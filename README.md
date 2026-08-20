# MenusBot

Carta digital por QR con órdenes desde la mesa, app del mesero y pantalla de
cocina. Seis archivos HTML estáticos servidos por Vercel, con Supabase detrás.

**Producción:** https://menusbot.vercel.app
**Demo público:** https://menusbot.vercel.app/carta.html?mesa=1&r=flautas-el-crunch&demo

## Documentación

Todo está en **[`docs/`](docs/README.md)** — empieza por ahí. El índice trae el
estado del proyecto en una página.

- [Arquitectura](docs/tecnico-arquitectura.md)
- [Base de datos y seguridad](docs/tecnico-base-de-datos.md)
- [Pruebas y trampas conocidas](docs/tecnico-pruebas-y-trampas.md)
- [Manual de operación para el restaurante](docs/operacion-restaurante.md)
- [Producto, mercado y planes](docs/negocio-producto-y-planes.md)
- [Pendientes](docs/pendientes.md)

## Pruebas

Scripts de Playwright en [`pruebas/`](pruebas/). Se corren a mano, uno por
zona tocada. Instrucciones en
[Pruebas y trampas](docs/tecnico-pruebas-y-trampas.md).

## Antes de tocar código

Lee la trampa 1 de [Pruebas y trampas](docs/tecnico-pruebas-y-trampas.md): toda
la configuración de un restaurante vive en un solo documento JSON y escribirlo
completo ya nos costó una pérdida de datos silenciosa.
