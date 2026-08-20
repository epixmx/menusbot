# Arquitectura — cómo está armado MenusBot

*Al 20 de agosto de 2026.*

## La forma del sistema, en un párrafo

No hay framework, ni build, ni servidor propio. Son **seis archivos HTML sueltos**, cada uno con su CSS y su JavaScript adentro, servidos como archivos estáticos por Vercel. Todos hablan directo con Supabase por su API REST. No hay paso de compilación: lo que está en el repositorio es exactamente lo que corre en el navegador. Eso hace el proyecto raro para los estándares de hoy y hay que decir por qué: un restaurante necesita que esto abra en tres segundos en un teléfono de gama baja con datos móviles, y cada kilobyte de framework se paga en ese momento.

| Archivo | Quién lo abre | Para qué |
|---|---|---|
| `index.html` | cualquiera | El sitio comercial. Planes, demo, alta. |
| `alta.html` | el dueño, una vez | Registro del restaurante. |
| `carta.html` | el comensal | La carta. Escanea el QR, ve el menú, ordena, pide la cuenta. |
| `panel.html` | el dueño | El panel: comandas, registro, reportes, carta, equipo, temas, QR. |
| `mesero.html` | el mesero | Su teléfono: confirma órdenes, cobra, cierra mesas. |
| `cocina.html` | la cocina | Pantalla de comandas para el pase. |

Tamaño real: 15,272 líneas en total. `panel.html` es el más grande (5,971) y `carta.html` le sigue (4,298).

## Cómo se identifican entre ellos

**El restaurante viaja en la URL.** Todo lo del comensal y del personal lleva `?r=<slug>`. El QR de cada mesa es `carta.html?mesa=7&r=flautas-el-crunch`. Sin `?r=` la carta te manda al sitio comercial.

**El slug puede mudarse.** Si un restaurante cambia su dirección pública, su fila vieja en `menusbot_config` se queda como lápida con una llave `redirige_a`, y carta, panel y mesero siguen la mudanza solos. Los QR ya impresos siguen funcionando. Ese mismo mecanismo es el que hace que el demo público apunte a Flautas: el slug `bellavita` no tiene menú, solo un `redirige_a`.

**El dueño entra con Supabase Auth.** Correo y contraseña, token en `localStorage` bajo `mb_panel_auth`. El panel manda ese token en cada llamada; carta, mesero y cocina usan la llave anónima. Esa diferencia es la que sostiene toda la seguridad que hay hoy — y la que explica sus huecos.

## El contrato que no se rompe

Este es el acuerdo entre las tres pantallas y **romperlo mete comida a la cocina que nadie autorizó**:

1. `carta.html` inserta toda orden con `verificacion: 'pendiente'`. Sin excepción.
2. `mesero.html` (o el panel, como respaldo) la pasa a `'ok'` o `'rechazada'`, y escribe `autorizada_por` y `autorizada_at`.
3. `cocina.html` **solo** muestra las que tienen `verificacion === 'ok'`.

La orden nace pendiente porque el mesero va a la mesa y la confirma de viva voz con el comensal. Es una decisión de producto, no técnica: evita que la cocina empiece a hacer algo que el comensal tocó por error.

La excepción es el modo sin mesero: si nadie puede autorizar, dejar la orden pendiente sería dejarla colgada para siempre, así que nace `'ok'` y entra directo.

## La mesa se amarra a un teléfono

El primer teléfono que ordena en una mesa se queda con ella y recibe un **código de cuatro dígitos**. Cualquier otro que quiera ordenar en esa misma mesa tiene que escribir ese código. Existe porque sin eso cualquiera podía mandar órdenes a cualquier mesa desde su teléfono.

Lo que hace atómico el reclamo es un índice único `(restaurante_id, sucursal, mesa)` en `menusbot_mesas_abiertas`: dos teléfonos que llegan al mismo tiempo compiten y el índice arbitra — el que pierde recibe un 409 y vuelve a leer.

**Consecuencia importante:** ese índice incluye la sucursal, así que *la misma mesa existe una vez por sucursal*. Un restaurante que empezó sin sucursales y luego las agregó puede tener dos filas para la mesa 2. Eso ya causó un bug caro (la propina que brincaba). Cuando haya que elegir una fila, el criterio correcto es **manda la fila viva** —teléfono amarrado, latido reciente— no la que empata de sucursal.

Una mesa apartada sin nadie ordenando se suelta sola a la media hora.

## Configuración: un solo documento por restaurante

Todo lo que el dueño configura vive en **una sola fila** de `menusbot_config`, en una columna `data` de tipo jsonb: el menú, los precios, las fotos, los videos, el tema, la marca, las sucursales, los meseros, el modo de servicio, las reseñas.

Es cómodo de leer —la carta lo pide una vez y ya tiene todo— y es la fuente de los peores bugs del proyecto, porque **quien escribe manda el documento entero**. Ya nos costó una vez: el panel reescribía todo cada diez segundos y pisaba lo que otro hubiera guardado. Está arreglado para ese caso, pero el patrón sigue en `configEscribir()`. Ver `tecnico-pruebas-y-trampas.md`.

## Sincronización: sondeo, no tiempo real

No hay websockets. Cada pantalla pregunta por su cuenta:

- La carta del comensal, cada **4 segundos**.
- El panel, cada **4 segundos**.
- El mesero y la cocina, con su propio ritmo.

Los avisos al mesero sí son **Web Push real** (una función de servidor manda la notificación al teléfono aunque la app esté cerrada), pero el estado de las órdenes se descubre sondeando.

Los tiempos del demo están medidos contra ese sondeo de 4 segundos: cada tramo de la cocina simulada dura más que dos vueltas para que ningún par de cambios se junte en el mismo refresco.

## Temas y marca: dos capas que se aplican en orden

1. El **tema** define las variables CSS: colores, tipografías, radios, sombras. Hay diez, y `huerto` es el de la casa desde el rebranding.
2. Encima, los **colores corporativos** del restaurante pisan el acento y el detalle.

Las cuatro tintas de las alertas (`--al-roja`, `--al-ambar`, `--al-verde`, `--al-azul`) **no cambian nunca con el tema**, ni en claro ni en oscuro. Es a propósito: una alerta tiene que verse igual siempre, y eso es parte de que se entienda de un vistazo.

Desde el rebranding, el panel, el mesero y la cocina llevan además una piel fija de marca —la banda verde bosque del encabezado, la pestaña activa en lima— con tokens `--mb-*` que **no** dependen del restaurante. Eso es MenusBot; lo de abajo es el cliente.

## Los planes

Un mapa `CAPACIDADES` en el panel define qué trae cada plan: `carta` (gratis) no ordena, `negocio` y `cadenas` sí. `demo` y `pro` apuntan al plan de paga mientras dure el piloto.

**Falla abierto a propósito:** un plan vacío, mal escrito o que no llegó da acceso completo. Un restaurante en plena comida no puede quedarse sin comandas porque un dato no cargó.

El plan vive en `menusbot_restaurantes.plan`, que está cerrada a su dueño. Como la carta entra con la llave anónima y no puede leerla, el panel deja una **copia** en `menusbot_config.data.config.plan`. La verdad sigue siendo la tabla; eso es un espejo.

Y hay que decirlo claro: **esto es un candado de producto, no de seguridad**. Le explica el plan al dueño; no aguanta a alguien con malas intenciones. El candado de verdad va en la base.

## El demo público está aislado

La carta de ejemplo la abren muchas personas a la vez, todas en la mesa 1. Con el camino normal, la primera se quedaba con la mesa y a las demás les pedía un código que nadie tenía.

Hoy, en modo demo, **ninguna escritura sale del navegador**. Hay un candado dentro de `api()` que corta cualquier método distinto de GET contra las tablas de operación. Las órdenes del demo llevan id negativo, viven en el teléfono, y la cocina simulada las hace avanzar en memoria con los mismos tiempos y los mismos avisos que vería un comensal de verdad.

## Servicio en segundo plano

`sw.js` hace dos cosas y ninguna es cachear datos: recibe los avisos push y guarda las páginas (no las respuestas de Supabase — el origen ajeno se descarta explícitamente) para que la app abra sin red. Tiene además un interruptor remoto, `sw-estado.json`, que nunca se cachea porque si se cachara no podría apagar nada.
