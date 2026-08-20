# Pruebas y trampas conocidas

Este documento tiene dos partes. La primera es **cómo se prueba MenusBot** sin
depender de que alguien abra el teléfono y mire. La segunda es **la lista de
trampas que ya pisamos**: cada una costó horas de diagnóstico y está escrita
aquí para que no vuelva a costar lo mismo.

---

## Parte 1 — Cómo se prueba

### La forma corta

No hay framework, no hay build, no hay `npm test`. Hay una carpeta `pruebas/`
con scripts de Playwright que se corren a mano, uno por uno, cuando se toca la
zona que cada uno vigila. Esto no es pereza: con seis archivos HTML sin
compilar, un runner completo cuesta más de lo que ahorra. Lo que sí es
obligatorio es correr el script de la zona tocada **antes** de dar por buena
una entrega.

### Preparar el ambiente

Chromium ya viene instalado en el contenedor. No corras `playwright install`.

```bash
cd /home/claude/repo
npx playwright@latest --version   # solo para tener el paquete
node pruebas/verify.mjs
```

Si un script no arranca por el navegador, la causa casi siempre es que
Playwright quiere bajarse su propio Chromium. La receta es lanzar con la ruta
explícita:

```js
const nav = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
```

Y en el ambiente ya están puestas `PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers` y
`PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1`.

### Cómo se sirven los archivos

Los HTML son estáticos, así que un servidor de una línea alcanza:

```bash
cd /home/claude/repo && python3 -m http.server 8899 &
# luego, en el script: await pg.goto('http://localhost:8899/carta.html?mesa=1&r=flautas-el-crunch&demo')
```

Abrir el archivo con `file://` **no sirve**: el service worker no se registra,
`fetch` a Supabase falla por origen, y varias cosas se comportan distinto. Usa
siempre `http://localhost`.

### Cómo se finge Supabase

La mayoría de los scripts no tocan la base real. Interceptan las llamadas y
devuelven lo que la prueba necesita:

```js
await pg.route('**/rest/v1/**', ruta => {
  const u = ruta.request().url();
  if (u.includes('menusbot_config')) {
    return ruta.fulfill({ status: 200, contentType: 'application/json',
      body: JSON.stringify([{ id: 1, data: { plan: 'carta', platillos: [...] } }]) });
  }
  return ruta.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
});
```

Esto tiene una ventaja enorme —se prueban estados que en la base real serían
difíciles de armar, como «restaurante en plan carta con ocho platillos y sin
mesas abiertas»— y una trampa que ya nos mordió, descrita abajo.

### Los scripts que hay y qué vigila cada uno

| Script | Qué prueba | Cuándo correrlo |
|---|---|---|
| `verify.mjs`, `verify2.mjs` | Que las seis pantallas abran sin errores de consola y con los elementos clave presentes | Después de cualquier cambio de estructura |
| `demo-test.mjs` | Que el demo **no escriba** en las tablas de operación: abre la carta con `&demo`, hace una orden completa y verifica que ninguna llamada de mutación salió | Al tocar `api()` en carta.html o el bloque de aislamiento del demo |
| `demo-cocina.mjs` | Que la cocina simulada del demo avance sola por los cinco estados sin base de datos | Al tocar `programarEstados()` |
| `movil.mjs` | Ancho de la página en varios teléfonos; detecta la barra lateral y el desbordamiento horizontal | Al tocar cualquier CSS de ancho, `position:fixed`, o las hojas |
| `sticky-ficha.mjs` | Que la ficha del platillo no muestre el margen fantasma arriba al hacer scroll | Al tocar `.hero-plato` o el visor |
| `hoja-test.mjs` | Que las hojas suban centradas, sin costura de un píxel y sin que el fondo se mueva detrás | Al tocar `.hoja`, `abrirVelo`, `quietoElFondo` |
| `plan-test.mjs`, `plan-carta-test.mjs` | Que el plan Carta esconda todo lo de ordenar y que el panel bloquee las vistas que no le tocan | Al tocar `CAPACIDADES`, `puede()`, `cartaOrdena()` |
| `mesa-plan-test.mjs` | Que un plan Carta **no** aparte mesa ni enseñe código de mesa | Al tocar `abrirMesaAlLlegar` o `asegurarMesa` |
| `video-test.mjs` | Que el filtro previo rechace video largo, pesado o muy alto, y que junte las tres fallas en un solo aviso | Al tocar `medirVideo` o `subirVideo` |
| `subida-test.mjs` | Que la compresión de imagen llegue por debajo del tope de bytes y produzca WebP cuando el navegador puede | Al tocar `comprimirImagen` |
| `medir-video.mjs` | Mide duración, peso y dimensiones de los videos del landing; sirve para verificar una recompresión | Al reemplazar videos |

### Verificar en producción, no en la copia

Una prueba local que pasa no significa que lo publicado esté bien. El cierre de
cualquier entrega es:

1. **Vercel dice READY.** No «Building», no el despliegue anterior.
2. **Bajar el archivo publicado y buscar la marca.** Un pedazo de texto único
   del cambio, traído con caché apagado:
   ```js
   fetch('https://menusbot.vercel.app/carta.html', { cache: 'reload' })
     .then(r => r.text()).then(t => t.includes('chip-video'));
   ```
   Si esto da `false`, el cambio no está en la calle por más que el commit
   exista.
3. **Contar filas antes y después** en Supabase cuando el cambio toca datos.
   Usar la app y verificar que las cuentas se movieron —o no se movieron, si de
   eso se trataba.
4. **Una captura.** Los bugs de UI no se ven en el código.

### Probar cambiando el código a propósito

Una prueba que pasa siempre no prueba nada. Antes de confiar en un script
nuevo, **rómpelo a propósito**: quita la línea que el script debería atrapar,
corre el script, y confirma que falla. Si pasa igual, el script no está mirando
lo que crees. Esto atrapó al menos dos scripts que verificaban la existencia de
un elemento que existía por otra razón.

---

## Parte 2 — Trampas que ya pisamos

### 1. El latido que se comía la configuración

**Lo que pasaba.** Una llave escrita en `menusbot_config` desaparecía sola a
los pocos segundos. No siempre: solo cuando el panel estaba abierto.

**Cómo se diagnosticó**, porque el método sirve para el próximo bicho de este
tipo:

1. El blob seguía completo salvo mi llave → no era una transacción tirada
   atrás, era alguien escribiendo un blob viejo encima.
2. El campo `actualizado` no cambiaba, y `configEscribir()` siempre lo pone →
   el que escribía **no** era `configEscribir`.
3. Con el navegador cerrado el valor sobrevivía; con el panel abierto moría →
   el culpable estaba en el panel.
4. `data->>'adminVisto'` avanzaba cada 10 segundos, exactamente en el ritmo en
   que el valor moría → el latido.

**La causa.** El panel mandaba `PATCH` del **documento entero** cada 10 s solo
para actualizar una marca de «el dueño está viendo». Consecuencias: dos paneles
abiertos se revierten los cambios en silencio, y 8,640 escrituras del menú
completo por día por panel.

**El arreglo.** Un RPC que toca un solo campo:

```js
setInterval(() => {
  if (!accesoOk || MODO_DEMO || !RID) return;
  api('rpc/menusbot_admin_visto', { method: 'POST',
       body: JSON.stringify({ p_rest: RID }) }).catch(() => {});
}, 10000);
```

**La secuela.** Publicar el arreglo no basta: los paneles ya abiertos siguen
con el código viejo y siguen pisando. Hay que **cerrar y reabrir** todas las
ventanas del admin. Y ojo con el truco de diagnóstico: borrar la llave mala no
sirve —el panel viejo la reescribe de su memoria— pero escribir el **valor
correcto** sí, porque el panel lo lee en su siguiente vuelta de 4 segundos.

**Lo que sigue abierto.** `configEscribir()` todavía escribe el documento
completo. Mismo patrón, misma bomba, solo que con menos frecuencia.

### 2. `execute_sql` con varias sentencias tira una atrás en silencio

Un `execute_sql` del MCP con dos `UPDATE` aplicó uno y descartó el otro sin
error. La regla: **una sentencia por llamada**, o `apply_migration`. Y siempre
verificar con un `SELECT` en una llamada aparte, no en la misma.

### 3. El reloj del servidor está en UTC

Las horas que devuelve la base están en UTC. Cualquier comparación con «hoy» o
«hace cinco minutos» hecha con el reloj del teléfono está corrida por las horas
de diferencia. Los reportes del panel lo tienen resuelto; código nuevo que
agrupe por día debe convertir explícitamente.

### 4. `latido_at` viaja como texto, no como fecha

PostgREST entrega los timestamps como cadena ISO. `new Date(fila.latido_at)`
sí funciona; `fila.latido_at - Date.now()` da `NaN` en silencio y la mesa nunca
se ve como caducada. Convertir siempre antes de restar.

### 5. El emulador de PostgREST miente sobre lo que importa

Cuando se finge Supabase con `pg.route`, es fácil devolver una forma que
PostgREST real nunca devolvería:

- PostgREST responde **arreglo** aunque filtres por `id=eq.X`; solo devuelve
  objeto con la cabecera `Accept: application/vnd.pgrst.object+json`.
- Un `PATCH` sin `Prefer: return=representation` responde **204 sin cuerpo**.
  Devolver `[{...}]` en la prueba esconde código que reventaría en producción.
- Los filtros van en `?columna=eq.valor`, y un filtro mal escrito **no da
  error**: devuelve todo. Una prueba con datos fingidos jamás detecta eso.
- RLS no existe en el emulador. Una consulta que en producción devuelve vacío
  por política aquí devuelve datos.

Por eso el paso 3 de la lista de producción —contar filas reales— no es
opcional.

### 6. `overflow: hidden` rompe `position: sticky`

En un ancestro, `overflow:hidden` desactiva el pegado de los hijos. Para cortar
el desbordamiento horizontal sin romper nada, usar `overflow-x: clip`, con
`hidden` antes como respaldo para navegadores viejos:

```css
html, body { max-width: 100%; overflow-x: hidden; overflow-x: clip; }
```

### 7. Centrar con `translateX(-50%)` produce costuras de un píxel

En teléfonos con densidad fraccionaria (2.75x, 3.5x), centrar con
`left:50%; transform:translateX(-50%)` cae en medio píxel y pinta una línea
clara en el borde. `margin: 0 auto` con `left:0; right:0` cae en píxel entero y
no la pinta. Esta fue la causa del «marco de un píxel arriba a la derecha».

### 8. `100vh` no es la altura visible en el teléfono

`vh` no descuenta la barra del navegador. Usar `100dvh` con `vh` antes como
respaldo. La hoja del platillo lleva las dos líneas por eso.

### 9. Bloquear el scroll del fondo con `overflow:hidden` no funciona en iOS

Safari lo ignora en `body`. Lo que sí funciona es `position:fixed` en el body
guardando y restaurando el `scrollY`. Está en `quietoElFondo()` /
`sueltaElFondo()`.

### 10. El color corporativo se pintaba encima de la marca

`m.acento || '#E4593B'` ponía el tomate viejo como respaldo, y eso pisaba el
`:root` de la piel nueva en todos los restaurantes sin color propio. La regla:
cuando no hay valor, **quitar la variable**, no poner un valor de respaldo.

```js
if (m.acento) document.documentElement.style.setProperty('--pomodoro', m.acento);
else document.documentElement.style.removeProperty('--pomodoro');
```

### 11. Listar el repo antes de decir «listo»

En el primer pase de la piel nueva se me quedó `cocina.html` completo, porque
trabajé de memoria sobre los archivos que tenía abiertos. Antes de dar por
terminado un cambio transversal: `ls` del repo y `grep` de la marca del cambio
en **todos** los HTML.

### 12. `device_commit_files` quiere rutas de Windows

Escribir de vuelta a la máquina del usuario falla con rutas tipo `~/mnt/...`.
Hay que dar la ruta absoluta de Windows: `C:\Users\victo\MENUSBOT\...`.

### 13. `git push` no sale de este ambiente

El proxy de la sesión bloquea el push a repos que no se adjuntaron al crear la
sesión, y eso no se puede cambiar después. El flujo real es: se entregan los
archivos a la carpeta del usuario y él corre los comandos de git desde su
consola. Está escrito en `pendientes.md`.

---

## Lista de verificación antes de publicar

- [ ] `ls` del repo y `grep` de la marca del cambio en los seis HTML
- [ ] Correr los scripts de `pruebas/` de la zona tocada
- [ ] Romper el código a propósito y confirmar que el script lo atrapa
- [ ] Entregar archivos y dar los comandos de git
- [ ] Vercel en READY
- [ ] `fetch` con `cache:'reload'` buscando la marca en el archivo publicado
- [ ] Contar filas en Supabase si el cambio toca datos
- [ ] Una captura de la pantalla afectada
