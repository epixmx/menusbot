# Pendientes

Lista viva. Ordenada por lo que bloquea a lo que espera. Al cerrar algo, se
mueve al final con la fecha, no se borra: sirve saber qué ya se resolvió y
cuándo.

Última revisión: 20 de agosto de 2026.

---

## Bloquea cobrar — no negociable

> **20 ago 2026 — cerrado y verificado en produccion.** Ver
> [`tecnico-seguridad.md`](tecnico-seguridad.md) para el modelo completo, lo que
> se cerro y las trampas que costaron caro.

### 1. Lo que sigue abierto de seguridad
- **El contenido de las ordenes se lee entre restaurantes** (platillos, mesa y
  total; ya no datos personales). Cerrarlo requiere darle identidad tambien al
  comensal anonimo — proyecto aparte.
- **`configEscribir()` escribe el documento completo.** Dos paneles abiertos se
  pisan en silencio. Es el mismo patron del bicho del latido.
- **Cobros duplicados**: cobrar desde el panel y desde el telefono del mesero a
  la vez puede meter dos veces la misma venta al corte.

### 2. Activar la proteccion de contraseñas filtradas
Un interruptor en el panel de Supabase (Auth → Password security). Compara
contra contraseñas ya filtradas en internet. Gratis, un clic.

### 3. Separar la base de la otra app
El proyecto de Supabase comparte tablas con una app de coleccion de estampas.
No es urgente, pero conviene separarlas antes de crecer.

## Bloquea vender

### 4. No hay pasarela de pago
Mercado Pago está apagado (`MP_LISTO = false`). Sin esto no se puede cobrar el
plan Negocio ni cobrar en línea al comensal.

### 5. El alta no asigna plan
Un restaurante que se da de alta queda sin plan definido. Debe quedar en
`carta` por omisión.

### 6. Falta el precio del plan Negocio
La página dice `$—` con una nota de que se define al cerrar el piloto.

### 7. Quitar `'demo'` de la lista de planes con video
`PLANES_CON_VIDEO` incluye `'demo'`, que era un atajo del piloto.

---

## Producto — comprometido, sin empezar

### 8. Cuentas del comensal, favoritos y puntos
Cinco etapas descritas en `plan-puntos-menusbot.md`. Decisiones ya tomadas
(identidad opcional, premio configurable, acreditación al cerrar el cobro,
cuenta compartida entre restaurantes) están en
`negocio-producto-y-planes.md`, sección 7. Falta decidir la **tasa por
omisión**; el 10% que se manejó como ejemplo es alto para el margen de un
restaurante.

### 9. El nombre definitivo de la marca
De él dependen títulos, metadatos, marcas de agua, el manifiesto y el dominio.
Conviene cerrarlo **antes** de la campaña dirigida al comensal.

---

## Contenido y limpieza

### 10. Comprimir los cuatro videos de platillos de Las Flautas
Pesan entre 1.8 y 3.3 MB. La receta que ya se usó para los del landing —bajó
21 MB a 2.4 MB sin diferencia visible— está al final de este documento. Los
archivos originales tiene que ponerlos el dueño en su carpeta MENUSBOT.

### 12. El aviso «Te faltan 5 pasos» del panel en modo demo
Aparece en el demo donde no aplica.

### 13. Borrar la función de borde `mb-diag`
Ya está neutralizada; falta eliminarla.

---

## Huecos de funcionalidad detectados al escribir el manual

Cosas que el manual de operación buscó en el código y **no existen**. No son
bugs; son alcance no construido. Se listan para que nadie las prometa en una
venta:

- Integración con impresora de tickets
- Descuentos y cupones
- Reglas de puntos configurables por el dueño (la configuración existe como
  decisión, no como código)
- Integración con apps de reparto
- Roles del equipo más allá de mesero
- Facturación CFDI

---

## Flujo de publicación (recordatorio permanente)

El `git push` **no sale de este ambiente**: el proxy bloquea los repos que no
se adjuntaron al crear la sesión, y eso no se cambia después. El flujo real,
que se le recuerda al dueño **cada vez** que hay algo que publicar:

```powershell
cd C:\Users\victo\MENUSBOT\deploy-huerto
git add -A
git commit -m "mensaje del cambio"
git push
```

Vercel publica solo. Después, verificar: Vercel en READY y la marca del cambio
presente en el archivo publicado (ver `tecnico-pruebas-y-trampas.md`).

---

## Receta de compresión de video

```bash
ffmpeg -i entrada.mp4 \
  -vf scale=960:-2:flags=lanczos \
  -c:v libx264 -preset veryslow -crf 23 -pix_fmt yuv420p \
  -an -movflags +faststart salida.mp4
```

`-an` quita el audio (los videos de platillo no lo llevan). `+faststart` mueve
el índice al principio para que empiece a verse sin bajar el archivo completo.
Verificar con SSIM antes de reemplazar.

---

## Cerrados

- **20 ago 2026** — Auditoria completa de seguridad, confiabilidad, datos
  personales y rendimiento. Se cerraron once huecos y se verifico cada uno
  atacando el sitio en produccion. Ver `tecnico-seguridad.md`.
- **20 ago 2026** — Aviso de privacidad publicado (con datos por llenar) y
  enlazado desde el sitio, el alta y la carta.
- **20 ago 2026** — Mesas colgadas de Flautas limpiadas.

- **20 ago 2026** — Límites de plan aplicados en panel y carta, incluida la
  reserva de mesa. Probado en vivo con Xiná.
- **20 ago 2026** — El latido del panel dejó de pisar la configuración
  completa; ahora usa un procedimiento que toca un solo campo.
- **20 ago 2026** — Aislamiento del demo: veinte personas a la vez sin
  estorbarse, cocina simulada en la memoria del teléfono.
- **20 ago 2026** — Videos del landing comprimidos de 21 MB a 2.4 MB.
- **20 ago 2026** — Compresión de imagen del lado del navegador con tope real
  de bytes y caché de un año.
- **20 ago 2026** — Filtro previo de subida de video (10 s, 2 MB, 720 px).
- **20 ago 2026** — Etapa 0 de seguridad en la base: políticas cerradas y
  aislamiento verificado.
- **20 ago 2026** — Piel «Huerto» aplicada en las seis pantallas.
- **20 ago 2026** — Bugs de UI en móvil: barra lateral, marco de un píxel,
  margen fantasma de la hoja, sombra del ticket, sugerencias con formato viejo.
