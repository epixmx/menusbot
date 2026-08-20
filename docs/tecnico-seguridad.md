# Seguridad

Cómo se decide quién puede hacer qué en MenusBot, qué se cerró el 20 de agosto
de 2026, y qué sigue abierto a sabiendas.

---

## 1. El problema de raíz

La carta, la pantalla del mesero y la de cocina son archivos HTML que se abren
sin instalar nada. Todas llevan dentro la **llave pública** de Supabase, que va
a la vista en el código —eso es normal y está diseñado así—. El muro real no es
esa llave: son las reglas dentro de la base de datos.

Y ahí estaba el problema: esas reglas decían **`true`** —o sea, «cualquiera
puede»— en casi todas las tablas de operación. La base no tenía forma de
distinguir tres cosas que se veían idénticas:

- el comensal de la mesa 5 mandando su orden,
- el mesero autorizándola,
- un desconocido en su casa haciéndose pasar por cualquiera de los dos.

Todo llegaba con la misma llave. **No hay política que arregle eso**: primero
hacía falta que el mesero y la cocina tuvieran una identidad de verdad.

## 2. La solución: el pase de operador

```
El mesero teclea su PIN
        ↓
menusbot_mesero_login(restaurante, mesero, PIN)   ← se compara DENTRO del servidor
        ↓
devuelve un pase (token) que caduca a las 16 horas
        ↓
la pantalla lo manda en cada petición, en la cabecera x-mb-op
        ↓
las políticas y el disparador leen esa cabecera y ya saben con quién hablan
```

Lo importante:

- **El PIN nunca baja.** Sube, se compara adentro, y lo que regresa es el pase.
  La lista de meseros se lee de `menusbot_meseros_publicos`, una vista que
  simplemente no tiene la columna del PIN.
- **El pase caduca solo** a las 16 horas —un turno largo con margen—, así que un
  teléfono perdido deja de servir sin que nadie haga nada.
- **El pase no sirve en otro restaurante**: nace amarrado a uno.
- Lo mismo aplica a la cocina, con `menusbot_cocina_login`.

Quién es quién, en orden:

| Quién | Cómo se identifica | Qué puede |
|---|---|---|
| Dueño | Sesión real de Supabase Auth | Todo lo de su restaurante |
| Mesero / cocina | Pase de operador (`x-mb-op`) | Operar su restaurante |
| Comensal | Nada — es anónimo | Ver el menú, apartar su mesa, mandar su orden |

## 3. El blindaje del dinero

Un disparador (`menusbot_orden_blindaje`) revisa **cada** orden que entra o
cambia, antes de guardarla:

- **El precio lo pone el servidor.** Se busca cada platillo en el menú guardado
  y se usa ESE precio, se ignora el que mandó el teléfono. El total se vuelve a
  sumar aquí.
- **El envío no puede ser negativo** (era una forma de bajar el total).
- **La orden nace «pendiente»** en un restaurante con mesero, diga lo que diga
  el teléfono. Solo en mostrador o cocina sin local —donde no hay mesero que
  confirme— puede nacer lista.
- **Sin pase, un comensal no puede cambiar después** la verificación, el estado,
  si está cerrada, ni los datos de pago o entrega. Y una orden ya confirmada
  tampoco cambia de contenido desde la mesa.

Probado en producción: se mandó guacamole a $0, con envío de −$500, marcada como
autorizada y cerrada. Quedó guardada en **$190, pendiente, sin autorizar,
abierta**.

**Regla de diseño: falla abierto.** Si el servidor no puede comprobar algo —no
hay configuración, el platillo no existe en el menú— NO bloquea la orden. Un
restaurante que deja de vender por un error nuestro es peor que un platillo
inventado que nadie va a cocinar.

## 4. Qué se cerró

| Antes | Ahora |
|---|---|
| Cualquiera leía el PIN de todos los meseros | Bloqueado; el PIN se compara en el servidor |
| El PIN de cocina venía dentro del menú público | Tabla aparte, sin lectura pública |
| Cualquiera bajaba las ventas de todos los restaurantes | Solo dueño y operadores del suyo |
| Nombre, teléfono y domicilio de los comensales, legibles | Bloqueado por columna |
| Se podía pedir con precio $0 | El servidor recalcula |
| Se podía saltar al mesero | Solo dueño u operador autorizan |
| Se podían borrar las mesas de cualquier restaurante | Solo dueño u operador |
| Se podían apagar las alertas de otros | Solo dueño u operador |
| Se podían borrar los avisos de todos los meseros | Solo el propio o el dueño |
| PIN sin límite de intentos del lado del servidor | 5 por cada 15 minutos |
| Una nota del comensal ejecutaba código en el panel del dueño | Escapada |

## 5. Lo que sigue abierto, a sabiendas

1. **El contenido de las órdenes se puede leer entre restaurantes.** Platillos,
   mesa y total —ya no datos personales. Cerrarlo del todo requiere darle
   identidad también al comensal anónimo, que es un proyecto aparte.
2. **La configuración es de lectura pública.** Tiene que serlo: es el menú que
   la carta enseña. Ya no lleva PIN adentro, pero conviene revisar antes de
   guardar cualquier cosa nueva ahí.
3. **`configEscribir()` escribe el documento completo.** Dos paneles abiertos se
   pisan en silencio.
4. **Cobros duplicados** por dos atajos que no pasan por el candado del cierre
   de mesa.

## 6. Trampas que costaron caro (y que no hay que repisar)

**Cerrar antes de publicar rompe restaurantes.** Las pantallas que ya están
abiertas en los teléfonos usan el camino viejo. El orden correcto siempre es:
publicar la pantalla nueva → verificar que está en la calle → cerrar la base.

**`Prefer: return=representation` exige leer TODAS las columnas.** Al quitarle a
la llave pública la lectura de la tabla de órdenes, el envío de comandas se cayó
en producción: la carta pide de vuelta el folio al mandar la orden, y para
devolverlo PostgREST necesita poder leer la fila entera. La solución fue que la
carta pida **solo el folio** (`POST menusbot_ordenes?select=id`).

**Un permiso sobre la tabla entera le gana al de una columna.** `revoke select
(columna)` no hace nada si el rol tiene `select` sobre toda la tabla. Hay que
quitar el general y después dar las columnas una por una.

**`revoke ... from anon` no basta.** En Postgres toda función nace con permiso
de ejecución para PUBLIC, y quitárselo a `anon` no toca ese permiso heredado.
Hay que revocar **`from public`**. Por poco quedan llamables las funciones
internas, incluida la que borra el contador de intentos fallidos.

**Las políticas necesitan poder PREGUNTAR.** `menusbot_es_duenio` solo tenía
permiso de ejecución para usuarios autenticados, así que las pantallas de mesero
y cocina —que usan la llave pública— chocaban con «permission denied for
function». Dar ejecución a `anon` no abre nada: la función mira `auth.uid()`,
que para la llave pública es nulo.

**`let` en un script normal no crea una variable global.** Al probar desde la
consola, asignar `window.sesion` NO cambia el `let sesion` del archivo. Media
hora persiguiendo un fallo que no existía.

**Leer «negocio» al revés.** La carta dice que solo `mostrador` y `cocina` son
negocios sin mesero; **cualquier otro valor** —incluido `restaurante`— es de
mesas. Mi primera versión del disparador lo leyó al contrario y dio por kiosco a
todos los restaurantes normales, dejando pasar el sello de autorizada. Lo
atrapó la prueba, no la revisión.

## 7. Cómo comprobarlo tú mismo

Con la carta pública abierta, en la consola del navegador:

```js
// esto DEBE fallar o venir vacío
await api('menusbot_meseros?limit=2');            // PIN de meseros
await api('menusbot_cobros?limit=2');             // ventas
await api('menusbot_ordenes?select=contacto');    // teléfonos y domicilios

// esto DEBE funcionar
await api('menusbot_config?id=eq.<slug>&select=data');   // el menú
```
