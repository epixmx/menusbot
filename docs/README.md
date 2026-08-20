# Documentación de MenusBot

Índice de la carpeta. Cada documento se puede leer solo; este archivo da el
estado del proyecto en una página y dice a cuál ir.

Última revisión: 20 de agosto de 2026.

---

## El proyecto en una página

**Qué es.** Un restaurante pega un QR en la mesa; el comensal ve la carta con
fotos y video, ordena desde su teléfono, la cocina lo ve en una pantalla y el
mesero confirma y cobra. Sin app que bajar, sin hardware.

**Cómo está construido.** Seis archivos HTML sueltos, con su CSS y su
JavaScript adentro. Sin framework, sin paso de compilación. Vercel los sirve
tal cual; Supabase guarda los datos.

| Archivo | Líneas | Para quién |
|---|---|---|
| `index.html` | 442 | Página pública de venta |
| `alta.html` | 417 | Registro de un restaurante nuevo |
| `carta.html` | 4,298 | El comensal en la mesa |
| `panel.html` | 5,971 | El dueño |
| `mesero.html` | 2,464 | El mesero |
| `cocina.html` | 1,680 | La pantalla de la cocina |

**Dónde vive.** Producción en `menusbot.vercel.app`. Base de datos: proyecto
Supabase `colecta` (`xwcgqhlsubyfmpdjabjt`). Repositorio `epixmx/menusbot`.

**En qué etapa está.** Piloto en vivo con restaurantes reales. La piel de marca
está aplicada en las seis pantallas; el nombre definitivo **no está decidido**.
Los planes ya se aplican de verdad en el producto. **Todavía no se cobra**, y
hay dos huecos de seguridad conocidos que deben cerrarse antes de cobrar.

**Lo más importante que hay que saber si llegas nuevo:**

1. Toda la configuración de un restaurante —menú, temas, sucursales, todo—
   vive en **un solo documento JSON**. Escribirlo entero es fácil y es la causa
   del peor bicho que hemos tenido. Ver la trampa 1 en
   `tecnico-pruebas-y-trampas.md` antes de tocar nada que escriba configuración.
2. El demo público **no escribe nada** en la base. Es un escaparate de venta,
   no una prueba interna.
3. Los límites de plan **fallan abiertos**: si no se puede leer el plan, se
   asume que sí puede. A propósito.
4. `git push` no sale de este ambiente. Se entregan los archivos y el dueño
   publica desde su consola.

---

## Los documentos

### Técnico

**[`tecnico-arquitectura.md`](tecnico-arquitectura.md)** — Cómo está armado.
Las seis pantallas y cómo se reconocen entre ellas, el contrato de
autorización de una orden, el apartado de mesas y lo que implica el índice por
sucursal, el documento único de configuración y sus peligros, el sondeo de 4
segundos, temas contra colores corporativos contra la marca fija, el diseño de
planes, el aislamiento del demo y el service worker.

**[`tecnico-base-de-datos.md`](tecnico-base-de-datos.md)** — Las 16 tablas con
sus columnas, la matriz completa de políticas de acceso, **los dos huecos que
siguen abiertos a propósito**, todas las funciones con permisos elevados
—incluida la advertencia de que `menusbot_usar_recuperacion` no toca la
autenticación de Supabase—, las ocho funciones de borde, el almacenamiento de
archivos y la trampa de las sentencias múltiples.

**[`tecnico-pruebas-y-trampas.md`](tecnico-pruebas-y-trampas.md)** — Cómo se
prueba sin framework, qué vigila cada script de `pruebas/`, cómo se finge
Supabase y en qué miente ese emulador, cómo se verifica contra producción, y
**trece trampas ya pisadas** con su diagnóstico y su arreglo. Termina con la
lista de verificación antes de publicar.

### Operación

**[`operacion-restaurante.md`](operacion-restaurante.md)** — Manual para el
dueño y su equipo. Cómo se da de alta, cómo se carga el menú, los tres modos de
servicio, cómo trabaja el mesero, cómo se lee la pantalla de cocina, cómo se
cobra y se corta el día, y qué hacer cuando algo se atora. Escrito para
alguien que no es técnico.

### Negocio

**[`negocio-producto-y-planes.md`](negocio-producto-y-planes.md)** — Qué
problema resuelve y en qué orden le duele al dueño, los **dos mercados** —el
comensal y el restaurante— con su secuencia y por qué el del comensal va
primero, los tres planes tal como los anuncia la página, **por qué el plan
gratis no tiene tope de platillos**, cómo se aplica el límite en el producto,
las decisiones cerradas del sistema de puntos, y qué falta antes de poder
cobrar.

**[`pendientes.md`](pendientes.md)** — La lista viva, ordenada de lo que
bloquea a lo que espera. Incluye los huecos de funcionalidad que no existen y
que nadie debe prometer en una venta, el recordatorio permanente del flujo de
publicación, y la receta de compresión de video.

---

## Cómo mantener esto

- **`pendientes.md` se actualiza en el mismo momento** en que algo se cierra o
  aparece. Lo cerrado se mueve al final con fecha, no se borra.
- **Una trampa nueva se escribe el día que se resuelve**, no después. El valor
  de esa lista es el diagnóstico, y el diagnóstico se olvida en una semana.
- **Un cambio de plan o de precio toca dos lugares:** `index.html` y
  `negocio-producto-y-planes.md`. Si se separan, la página miente.
- Los documentos técnicos se revisan cuando cambia la forma de los datos o el
  contrato entre pantallas, no en cada cambio de estilo.
