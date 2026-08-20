# Base de datos — Supabase «colecta»

*Proyecto `xwcgqhlsubyfmpdjabjt`, región us-east-1, Postgres 17. Estado al 20 de agosto de 2026.*

## Las tablas

### El restaurante y quién lo maneja

**`menusbot_restaurantes`** — una fila por restaurante.
`id bigint · slug text · nombre · email · pass_hash · cocina · plan · activo · creado`
El `slug` es la dirección pública (`?r=<slug>`). `plan` vale `carta`, `negocio`, `cadenas` o `demo`. `pass_hash` es del sistema viejo de contraseñas y **ya no se usa para entrar** — la única puerta es Supabase Auth.

**`menusbot_duenios`** — qué usuario de Auth manda en qué restaurante.
`user_id uuid · restaurante_id · rol · creado`
Es la base de toda la seguridad por restaurante. La función `menusbot_es_duenio(slug)` consulta esta tabla y es la que usan casi todas las políticas.

**`menusbot_config`** — **una sola fila por restaurante** con TODO lo configurable.
`id text (= slug) · data jsonb · actualizado`
Dentro de `data`: `config` (marca, tema, pin, mesas, meseros, sucursales, categorías, servicio, reseñas, cocinas, plan), más `platillos`, `precios`, `ocultos`, `fotos`, `videos`, `adminVisto`, y `redirige_a` cuando el slug se mudó.

**`menusbot_secretos`** — llaves por restaurante y proveedor. Existe, nadie la usa todavía. Probablemente pensada para Mercado Pago.

### La operación

**`menusbot_ordenes`** — la tabla central. 32 filas hoy.
Lo importante: `estado integer` (0 recibida, 1 en preparación, 2 lista, 3 entregada), `verificacion text` (`pendiente` / `ok` / `rechazada` — el contrato con la cocina), `cerrada boolean`, `items jsonb`, `canal` (aquí / recoger / domicilio), y toda la parte de pago (`pago_estado`, `pago_metodo`, `pagada_at`) que se usa en el modo sin mesero.
`cliente_id` apunta al sistema viejo de puntos; `comensal_id uuid` es el puente al sistema nuevo de cuentas, todavía sin cablear.

**`menusbot_mesas_abiertas`** — qué mesa está tomada y por quién.
`dispositivo_id` es el teléfono dueño, `codigo` el de cuatro dígitos, `invitados jsonb` los que entraron con él, `latido_at` la señal de vida.
**Índice único `(restaurante_id, sucursal, mesa)`** — es lo que hace atómico el reclamo, y también lo que hace que la misma mesa exista una vez por sucursal.

**`menusbot_cobros`** — el registro de dinero. 7 filas.
`total`, `propina`, `propina_sugerida`, `metodo`, `folios jsonb`, `mesero_id`, `origen_propina`. Sin fila aquí, una venta no existe para el corte.

**`menusbot_meseros`** — nombre, **`pin` en texto plano**, sucursal, `mesas jsonb`.

**`menusbot_llamadas`** — el comensal llama al mesero o pide la cuenta. `motivo`, `atendida`.

**`menusbot_presencia`** — quién tiene una pantalla abierta ahora mismo.

**`menusbot_push`** — suscripciones Web Push del mesero: `endpoint`, `p256dh`, `auth`. Es material criptográfico; nadie debería poder leerlo.

### Cuentas del comensal — existen, nadie las usa

**`menusbot_comensales`** (`user_id uuid` = Auth, nombre, teléfono, email) y **`menusbot_direcciones`** están creadas y con sus políticas bien puestas, pero **ningún HTML las toca todavía**. Son la base del pasaporte del comensal cuando se construya.

**`menusbot_clientes`** es el sistema viejo de puntos: alta por teléfono sin verificar, un contador suelto, sin canje. **Apagado** en el código; la tabla se congeló con una fila y cero puntos emitidos.

## Seguridad: qué está cerrado y qué no

Todas las tablas tienen RLS activa. El estado después de la etapa 0 (20-ago-2026):

| Tabla | Leer | Escribir |
|---|---|---|
| `menusbot_config` | público | INSERT/UPDATE solo el dueño · DELETE nadie |
| `menusbot_meseros` | **público (ver abajo)** | solo el dueño |
| `menusbot_cobros` | público | INSERT público · UPDATE y DELETE nadie |
| `menusbot_ordenes` | público | INSERT y UPDATE públicos · DELETE nadie |
| `menusbot_llamadas` | público | INSERT y UPDATE públicos · DELETE nadie |
| `menusbot_mesas_abiertas` | público | público (todo se usa) |
| `menusbot_push` | **nadie** | INSERT y DELETE públicos |
| `menusbot_clientes` | solo el dueño | nadie |
| `menusbot_restaurantes` | solo el dueño | nadie |
| `menusbot_comensales`, `menusbot_direcciones` | `user_id = auth.uid()` | igual |
| `menusbot_recuperacion`, `menusbot_secretos` | nadie | nadie |

### Los dos huecos que siguen abiertos, a propósito

**1. Los PIN de los meseros se pueden leer.** `menusbot_meseros` necesita SELECT público porque `mesero.html` compara el PIN en el navegador. Con la llave anónima —que está escrita en el HTML, a la vista— se pueden leer los PIN de todos los meseros de todos los restaurantes. El arreglo es una función `menusbot_mesero_login(restaurante, pin)` que valide del lado del servidor, más una vista sin la columna del PIN, y revocar el SELECT directo. Toca cambiar `mesero.html`.

**2. Fuga entre inquilinos.** Con la llave anónima se pueden leer las órdenes, los cobros y la configuración de *cualquier* restaurante, no solo el propio. **Esto no se arregla con reglas de base de datos**, porque el comensal anónimo no trae ninguna credencial que diga a qué restaurante pertenece. Se resuelve cuando el comensal tenga cuenta, o con tokens firmados por mesa.

Los dos son requisito antes de cobrarle a nadie.

## Funciones

Todas `security definer`, con `search_path` fijo.

| Función | Qué hace |
|---|---|
| `menusbot_es_duenio(slug)` | ¿el usuario de esta sesión manda en este restaurante? La usan casi todas las políticas |
| `menusbot_admin_visto(slug)` | marca que el dueño está mirando, tocando **una sola llave** del jsonb |
| `menusbot_soltar_mesa(...)` | libera una mesa con sus reglas de caducidad |
| `menusbot_slug_libre` / `menusbot_renombrar_slug` | direcciones públicas |
| `menusbot_cambiar_pass`, `menusbot_crear_recuperacion`, `menusbot_ver_recuperacion`, `menusbot_usar_recuperacion` | sistema **viejo** de contraseñas |

**Ojo con la recuperación vieja:** `menusbot_usar_recuperacion` cambia `menusbot_restaurantes.pass_hash` pero **no toca Supabase Auth**, y el panel arma con eso una sesión sin token. Un dueño que llegue por ahí se queda sin poder guardar nada. El camino bueno es `/auth/v1/recover`.

## Funciones de servidor (Edge Functions)

Ocho activas. Las que importan:

- **`mb-alta`** — crea el restaurante. Usa la llave de servicio, así que no la frena RLS. Por eso cerrar `menusbot_config` no rompió el registro.
- **`mb-avisar`** — Web Push real. RFC 8291 y 8292 escritos a mano: `npm:web-push` se cuelga en el runtime de Supabase, y `crypto.subtle.deriveBits` con ECDH está roto ahí, así que ese paso usa `@noble/curves`. **El array `errores` de su respuesta es el mejor diagnóstico que hay: no lo quites.**
- `mb-media`, `mb-recuperar`, `menusbot-fetch`, `menusbot-publicar`, `menusbot-app`, `mb-diag` (esta última quedó neutralizada devolviendo 410 y está pendiente de borrar).

## Almacenamiento

Un solo bucket público, `menusbot-demo`: 42 archivos, 14 MB. Las fotos se comprimen en el navegador antes de subir (WebP, tope de 190 KB) y suben con caché de un año. Los videos de platillo se filtran antes de subir: 10 segundos, 2 MB, 720p.

**El costo aquí no es el almacenamiento, es el tráfico**, y crece con cada comensal que abre la carta, no con cada restaurante que se vende.

## Al escribir en esta base desde herramientas

Con el MCP de Supabase, `execute_sql` con **varias sentencias en la misma llamada puede no persistir** los UPDATE — se vio con `menusbot_config`: el SELECT del mismo lote mostraba el valor y después no estaba. Con `apply_migration` sí persiste. Para escrituras que importan: una sentencia por llamada, o `apply_migration`, y **verificar en una llamada aparte**.
