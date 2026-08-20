# Manual de operación de MenusBot para el dueño del restaurante

Este manual explica, con las mismas palabras que ya ves en la pantalla, cómo operar tu restaurante con MenusBot: tu Panel, la Carta que ve el comensal, la app del Mesero, la pantalla de Cocina y el registro (Alta).

---

## 1. Qué es y cómo funciona, en una página

MenusBot conecta cuatro pantallas alrededor de tu mesa:

1. **El comensal se sienta y escanea el QR de su mesa.** Se abre tu carta en su propio teléfono, con fotos, precios y — si lo configuraste — un video corto del platillo. No instala nada.
2. **Ordena desde su teléfono, con toda calma.** Arma su pedido y lo manda. Nadie lo apura: puede ordenar las veces que quiera durante la comida.
3. **El mesero confirma en la mesa.** La orden le llega al teléfono del mesero como **Por autorizar**. Antes de mandarla a cocina, la lee en voz alta con el comensal y toca **Confirmar y mandar a cocina** (o **Rechazar** si algo no cuadra, por ejemplo que ya no haya un ingrediente).
4. **La orden entra a Cocina.** Ahí avanza por tres columnas: **Recibidas**, **En preparación**, **Listas o en camino**. El mesero recibe el aviso cuando un platillo está listo, lo recoge y lo entrega.
5. **El comensal pide la cuenta y marca su propina.** Desde su teléfono toca **Pedir la cuenta para pagar** y elige cuánta propina dejar (o decide no dejar). El mesero va a la mesa, cobra con el botón **Cobrar y cerrar la mesa**, y la mesa se cierra.
6. **Al cerrar, se le puede ofrecer una reseña de Google o Facebook.**

Todo esto lo ves en vivo en tu **Panel**: la pestaña **Comandas** es tu pantalla principal del día a día.

---

## 2. Primeros pasos

Tu Panel trae una pestaña que se llama exactamente **Primeros pasos**, con la leyenda *«Lo que falta para poder abrir — se revisa solo»*. No es una sugerencia mía: es la lista que el propio sistema usa para decidir si tu restaurante está listo. Se llena sola conforme configuras cosas en otras pestañas — no hay nada que palomear a mano — y mientras te falte algo obligatorio, un aviso permanente aparece arriba de **Comandas** y un globo rojo con el número de pendientes se prende en la pestaña.

El orden en el que el sistema te lo pide es este:

**Grupo 1 — Configura tu restaurante**
1. **La identidad de tu restaurante** — tu nombre y tu logo, con los que se presenta tu carta, tu panel y tus hojas de QR. Se configura en **Identidad**.
2. **Tu carta, con fotos y precios** — lo único que ve el comensal al escanear el QR. Si tu carta está vacía, o si tiene platillos sin foto, aquí te lo dice. *Ojo:* si dejas los platillos de ejemplo que trae el sistema sin borrarlos ni esconderlos, el comensal los sigue viendo como si fueran tuyos.
3. **Da de alta a tus meseros** — cada mesero necesita estar en la lista de **Equipo** para entrar desde su teléfono.
4. **Tus sucursales** — cada local es una sucursal, con sus propias mesas, meseros y cocina. Aunque tengas un solo local necesitas escribir al menos un nombre (por ejemplo «Principal»): sin eso, las mesas se abren sin local asignado y sus cuentas no cuadran con las de nadie.

**Grupo 2 — Tus mesas y sus códigos QR**
5. **Cuántas mesas tienes** — de este número salen tus hojas de QR y la rejilla para repartir mesas entre meseros.
6. **Imprime los QR de tus mesas** — un QR por mesa, pegado en la mesa.

**Grupo 3 — El acceso de tus meseros**
7. **Su PIN y las mesas que le tocan** — cada mesero necesita un PIN de 4 dígitos y sus mesas asignadas.
8. **Mándales su enlace** — cada mesero tiene su propio enlace; se lo mandas por mensaje y él lo guarda en la pantalla de inicio de su teléfono.

**Grupo 4 — La cocina**
9. **Una cocina por sucursal** (o **El acceso de tu cocina**, si solo tienes una) — el PIN de 4 dígitos con el que se abre la pantalla del pase.

**Opcionales — no te detienen para abrir**
- **Enlaces de reseñas de Google y Facebook.**
- **Tu correo y tu contraseña del panel.**

Cuando ya no falta nada obligatorio, la pantalla te lo dice claro: *«Todo listo — tu restaurante puede abrir»*. Aun así conviene volver a revisarla si das de alta una sucursal nueva o cambias el número de mesas, porque ahí se te va a notar lo que quedó suelto.

---

## 3. Tu carta

Se configura en la pestaña **Carta** de tu Panel, con el título *«La carta — Precios, fotos y disponibilidad — el comensal lo ve al instante»*.

### Cargar tu menú con el importador

Arriba de la lista de platillos está **Importar carta con AI**. Ahí subes tu menú actual con el botón **Subir menú (PDF / foto / TXT)** y el sistema lo convierte en un borrador editable:
- Si subes un **PDF con texto**, lee el texto real, respetando columnas.
- Si subes una **foto** (JPG/PNG) o un **PDF escaneado**, usa reconocimiento óptico en español.
- También acepta **TXT/CSV**.

El importador detecta nombre, precio y categoría de cada platillo, y estima calorías y macros — todo editable antes de publicar. **Nunca inventa platillos: si no reconoce nada, te lo dice.** Si tu archivo pesa más de 25 MB, te pide que lo comprimas o subas solo las páginas del menú.

Cuando termina, ves un **Borrador extraído** con botones para **Publicar en la carta**, **Estimar nutrición faltante**, **Agregar platillo** a mano, **Ver texto leído** (por si quieres revisar qué entendió) o **Descartar**.

### Precios, fotos y video

Cada renglón de tu carta trae:
- **El precio**, editable directo en el campo.
- **Foto** — puede ser una propia que tú subas (botón **Foto**) o la que ya trae el sistema. La imagen se comprime automáticamente antes de subirse para que no le pese al comensal que abre la carta con datos móviles.
- **Video** (solo en el plan Negocio) — botón **Video**, con estos límites exactos: **máximo 10 segundos, 2 MB de peso y 720p de resolución**. Si tu video no cumple con eso, el sistema te dice exactamente por qué (dura de más, pesa de más, o mide de más) y te pide recortarlo desde la galería de tu teléfono.
- **El interruptor de disponibilidad** — apágalo para marcar un platillo como agotado; se ve como *«Agotado — no visible para el comensal»*.
- Un botón para **eliminar** los platillos que tú mismo agregaste.

**Advertencia:** si dejas platillos de ejemplo sin foto o sin precio, el comensal los ve en cero, o los ve pero no le llaman la atención. Empieza por poner fotos en los platillos que más vendes.

---

## 4. Tu marca

Se configura en la pestaña **Temas**, sección **Identidad**, con el subtítulo *«Logo, nombre y colores corporativos — aplican a la carta del comensal y a este panel»*.

Los campos son:
- **Tipo / prefijo** (Trattoria, Taquería, Restaurante…) y **Nombre del restaurante**.
- **Lema / eslogan.**
- **Sucursales**, separadas por coma. Si solo tienes un local, escribe «Principal».
- **Cuántas mesas tienes.**
- **Logo** — botón **Subir logo**.
- **Color primario (acento)** y **Color secundario (detalles)**, con selector de color.

Guarda con el botón **Guardar identidad**. Hay también un botón **Usar colores del tema** para heredar los colores del tema visual que elegiste.

Más abajo en la misma pestaña hay una sección de **Temas**: MenusBot trae 9 temas visuales listos (Editoriale, Notte Verde, Giorno, Mare, Mercado, Cartel, Trompo, Cristal y Huerto), cada uno con su propia tipografía y forma de esquinas, no solo colores. Eliges uno con el botón **Aplicar** en su tarjeta. Los colores corporativos que pusiste se aplican encima del tema elegido, y el cambio se ve al instante en la carta del comensal.

---

## 5. Los QR

Se configuran en la pestaña **QR**, título *«Códigos QR por mesa»*.

- Se genera **un QR por mesa**, según el número de mesas que configuraste en Identidad.
- El botón **Imprimir hoja de QRs** te da la hoja lista para imprimir y pegar una en cada mesa.
- Cada QR abre la carta de tu restaurante con la mesa ya asignada (la URL trae `?mesa=N&r=tu-restaurante`). El comensal escanea, ordena y su comanda llega a tu Panel ya con el número de mesa puesto.
- Si cambiaste el número de mesas después de imprimir, el sistema te avisa que la hoja quedó desactualizada y te dice cuántos QR te faltan (o te sobran).

Aparte, hay una sección de **QR de reseñas**, más grande porque está pensada para pegarse en el ticket o en un tent de mesa, con su propio botón **Imprimir QR de reseñas**.

---

## 6. Tu equipo

Se da de alta en la pestaña **Equipo**, título *«El equipo — Cada mesero con su PIN, su sucursal y las mesas que le tocan»*.

Para agregar un mesero:
1. Escribe su **Nombre**.
2. Ponle un **PIN de 4 dígitos** (o usa el botón **Al azar**).
3. Elígele una **Sucursal** (o «Sin sucursal» si atiende en todas).
4. Toca los números en **Mesas que le tocan** para asignarle sus mesas.
5. Guarda con **Agregar al equipo**.

Cada mesero abre su propio enlace en su teléfono, elige su nombre de una lista y teclea su PIN. De ahí en adelante ve solo las mesas que le asignaste, confirma las órdenes de viva voz en la mesa y registra lo que cobra.

**Advertencia:** el PIN es apenas una llave de casa, no una contraseña fuerte. Sirve para separar las mesas de cada quien y dejar constancia de quién autorizó una orden o cobró una mesa. Cámbialo si alguien lo vio, o si el mesero deja de trabajar contigo.

### El PIN de cocina

En la misma pestaña **Equipo** está la sección **Cocina**. Ahí eliges de qué sucursal estás hablando y le pones:
- Un **PIN de 4 dígitos** para esa cocina (o botón **Al azar**).
- **Cómo firma esta cocina** — el nombre que queda registrado cuando el pase marca un platillo como salido; si lo dejas vacío, firma como «Cocina».

Cada sucursal tiene su propia cocina, su propio PIN y su propio enlace. Si dejas el PIN de una sucursal vacío, esa cocina hereda el PIN y la firma de la **Cocina general** — así un restaurante de un solo local no tiene que configurar nada extra.

**Advertencia importante:** si dejas el PIN vacío tanto en la sucursal como en el general, la cocina se abre sin pedir nada, y **cualquiera que tenga el enlace puede mover tus comandas**. La pantalla de cocina lo avisa de pie de página hasta que le pongas un PIN, pero es algo que te puede salir caro si no lo configuras desde el primer día.

La pantalla de cocina se abre en la tableta o pantalla del pase, a pantalla completa, suena cuando entra una comanda nueva y **no muestra precios, totales ni nombres de clientes** — solo mesa, platillos y notas.

---

## 7. El día a día

Tu pestaña principal es **Comandas**, título *«Comandas en vivo»*.

1. **Llega un aviso de mesa.** Puede ser que la mesa llame al mesero, que pida su siguiente tiempo, o que pida la cuenta.
2. **Por confirmar — esperando al mesero en la mesa.** Aquí ves las órdenes que el comensal ya mandó pero que el mesero todavía no autoriza en persona. El texto lo dice claro: *«Cocina no ve estas órdenes todavía. El mesero de cada mesa las confirma de viva voz desde su teléfono; si no lo trae encima, autorízalas tú desde aquí»*. Tienes los botones **Autorizar** y **Rechazar**.
3. **Rechazadas hoy.** Las órdenes que se rechazaron se quedan a la vista, con la leyenda *«no cuentan en ventas ni pasan a cocina»*. El comensal, en su teléfono, ve *«Esta orden no pudo pasar… no se te cobra nada»* y puede volver a ordenar lo mismo o llamar a su mesero.
4. **El tablero de cocina**, con tres columnas: **01 · Recibidas**, **02 · En preparación**, **03 · Listas o en camino — entrega por partidas**. Ahí ves cada comanda avanzar en vivo.
5. **Cobro y cierre.** Cuando la mesa pide la cuenta, el mesero abre **Cobrar y cerrar** desde su teléfono: ve el consumo, la propina que el comensal ya marcó (si la marcó — si no, puede pedírsela con el botón **Pedirle a la mesa que marque su propina**), elige si pagó en **Efectivo** o **Tarjeta**, y si es efectivo anota con cuánto pagó para calcular el cambio. Al tocar **Cobrado, cerrar la mesa** la mesa queda libre y el cobro se guarda con el nombre del mesero y la hora. **Esto no se puede deshacer desde ahí**, así que revisa bien antes de confirmar.

En **Comandas** también ves los **chips de mesas abiertas**: verde para mesas con comensales, ámbar para las que abrió el propio comensal (todavía sin que el mesero confirme nada), y un color aparte para las que están fuera de tu número configurado de mesas.

---

## 8. El código de mesa

Cuando un comensal escanea el QR y toma la mesa, se le muestra una pantalla de bienvenida: *«Esta mesa ya es tuya»* (o *«Ya estás en la mesa N»*), con un código de **4 dígitos** grande, bajo el título **CÓDIGO DE TU MESA**.

Sirve para esto: si varias personas van a comer juntas y cada quien quiere ver la carta y ordenar desde su propio teléfono, **no vuelven a escanear nada distinto** — escanean el mismo QR de la mesa y, al llegar a la pantalla de unirse, escriben esos cuatro números. Con eso entran a la **misma cuenta**, y todo lo que pidan se junta para pagarse al final. El botón **Compartir el código con mi mesa** manda ese código por el medio que el comensal elija.

Si alguien teclea mal el código, el sistema le avisa cuántos intentos le quedan, sin regañarlo — puede haber oído mal un número.

Como nota de seguridad: nadie de otra mesa puede ordenar a nombre de una mesa que no es la suya sin ese código.

---

## 9. Reportes y corte

Se ven en la pestaña **Reportes**, con selector de periodo: **Hoy (corte del día)**, **Últimos 7 días** o **Últimos 30 días**, y filtro por sucursal si tienes varias.

Ahí encuentras:
- **KPIs del periodo:** Vendido, Comandas, Ticket promedio, Servicio promedio.
- **Ventas por día** (gráfica de barras) y **Top platillos**.
- **Desempeño por mesero — ventas y propinas:** mesas atendidas, vendido, en efectivo, con tarjeta, propina registrada, propina que eligió el cliente, la diferencia entre ambas, y la propina como porcentaje de su venta. El sistema aclara que esa diferencia *«casi siempre tiene una explicación cotidiana: el cliente cambió de opinión al pagar, dejó menos suelto del que había marcado, o repartió el pago entre varios»* — es un dato para platicarlo, no un señalamiento.
- **Para cuadrar la caja:** efectivo esperado solo por ventas, y efectivo esperado sumando ventas más propinas (según si las propinas en efectivo se las queda el mesero o entran a la caja).

Con los botones **Imprimir corte** obtienes el resumen del turno impreso, y con **Exportar CSV** te lo llevas a Excel.

**Ojo:** si en un periodo no hubo cobros registrados en mesa (porque nadie tocó **Cobrar y cerrar la mesa** ni tú cerraste la mesa desde Comandas), el desglose de dinero sale vacío aunque sí haya comandas — el dinero se registra solo cuando se cobra.

La pestaña **Registro** es la tabla completa de comandas, con filtros por estado, mesa, mesero y fecha, y su propio botón **Exportar CSV (Excel)**, útil para conciliar contra tu punto de venta.

---

## 10. Reseñas de Google y Facebook al cerrar la cuenta

Se configuran en **Temas**, sección **Reseñas al final de la visita**, con el interruptor **Invitar al comensal a dejar reseña cuando pida la cuenta**.

Los campos son:
- **Link de reseñas de Google** — para conseguirlo entras a tu perfil de empresa en Google Maps, buscas el botón **«Pedir reseñas»** y copias el enlace corto que te da (del tipo `https://g.page/r/…`).
- **Link de la página de Facebook.**
- **Título** y **Texto**, opcionales (si los dejas vacíos se usan textos de ejemplo).
- **Incentivo**, opcional (por ejemplo: *«Muéstrale tu reseña al mesero y te invitamos un café»*).

Cuando el mesero cobra y cierra la mesa, la pantalla de despedida del comensal (*«Gracias por tu visita»*) le muestra el resumen de su cuenta y, si activaste las reseñas, la invitación **¿Nos regalas una reseña?** con los botones **Reseñar en Google** y **Reseñar en Facebook**.

**Advertencia:** si tienes los enlaces puestos pero el interruptor está apagado, nadie ve la invitación — revísalo si esperabas reseñas y no están llegando.

---

## 11. Los tres modos de negocio

Se configuran en **Temas**, sección **Cómo se ordena y cómo se cobra**, con el selector **Cómo trabaja tu negocio**.

### Con mesero — «Restaurante con servicio en mesa»
*«Tus comensales se sientan, cada mesa tiene su QR y un mesero toma y confirma la orden.»* Es el modo descrito en las secciones 1 y 7 de este manual: el comensal ordena, el mesero confirma en la mesa, cobra y cierra.

Dentro de este tipo de negocio hay un segundo selector, **Modo del restaurante**, con dos opciones:
- **Con mesero** — «el comensal ordena y el mesero confirma en la mesa» (el modo normal).
- **Sin mesero** — «el comensal ordena, paga, y la orden entra derecho a la cocina». En este modo desaparecen del teléfono del comensal el botón de llamar al mesero, pedir la cuenta, el código de mesa y unirse a una mesa — porque no hacen falta.

Cuando activas **Sin mesero** puedes elegir qué puede pedir el comensal: **Comer aquí** (ordena en la mesa o en una tablet), **Pasar a recoger**, y **Llevar a domicilio** (con costo de envío y pedido mínimo configurables). Y cómo puede pagar: **En caja o al recibirlo** (efectivo o terminal) o **Tarjeta con Mercado Pago** (se cobra al ordenar). Si activas domicilio sin ningún pago en línea, el sistema te avisa: *«a domicilio sin pago en línea, el repartidor sale sin cobrar por adelantado»*.

### Sin mesero — «Mostrador o autoservicio»
*«El cliente ordena solo y pasa por su comida cuando le llaman. Puede haber mesas para sentarse, pero nadie las atiende ni se lleva una cuenta por mesa.»* En este tipo de negocio el panel no te pide número de mesas ni equipo de meseros, porque no aplican.

### Dark kitchen — «Cocina sin local»
*«No entra nadie a comer: todo sale para recoger en la puerta o a domicilio. Sin mesas, sin meseros y sin salón, así que el panel te esconde todo eso.»*

En cualquiera de los modos sin mesero, la cocina **no ve un pedido en línea hasta que está pagado, o hasta que quedó apartado para pagarse en caja.**

---

## 12. Preguntas frecuentes y qué hacer cuando algo sale mal

**Se cayó el internet.**
- En tu Panel, el chip que normalmente dice **EN VIVO** cambia a **SIN CONEXIÓN**.
- La pantalla de **Cocina** se queda mostrando lo último que sabía, con una alarma encendida, y avisa **«SIN CONEXIÓN — LO ÚLTIMO QUE SUPIMOS FUE…»** (o **«…TODAVÍA NO CARGA NADA»** si nunca alcanzó a cargar). No es que trabaje a ciegas: sigue mostrando lo que ya tenía.
- En el teléfono del comensal, si su orden no se pudo mandar, ve el aviso **«No pudimos confirmar tu mesa»** con la explicación *«Revisa tu internet o pídele al mesero que abra tu mesa. Tu orden se queda guardada aquí tal como la armaste — nada se pierde»*, y un botón para **Intentar de nuevo**.

**Una mesa se quedó apartada sin que nadie ordene.**
Pasa cuando alguien abre la carta en un número de mesa y no pide nada (por ejemplo, se equivocó de código QR). El mesero ve el aviso **«Esta mesa está apartada pero nadie ha ordenado nada»** con dos botones:
- **Liberar** — suelta el teléfono que tenía apartada la mesa y deja el número esperando; el que se siente y ordene la vuelve a tomar.
- **Cerrar mesa** — deja el número libre desde ya, igual que cuando terminas de cobrar.

**Una orden se rechazó.**
El mesero la revisó y decidió no mandarla a cocina (por ejemplo, porque algo se acabó, o hubo un cambio de última hora). Al comensal no se le cobra nada; ve el aviso **«Esta orden no pudo pasar»** con la explicación de que puede preguntarle a su mesero qué pasó, y botones para **Volver a ordenar lo mismo** o **Llamar al mesero a mi mesa**. En tu Panel, esa orden queda registrada en **Rechazadas hoy** — no cuenta en ventas ni pasa a cocina.

**El mesero no recibe avisos.**
Si su teléfono se queda sin batería o sin internet, los avisos simplemente no le llegan. La propia app del mesero lo advierte: *«Si el teléfono se queda sin batería o sin internet, los avisos no llegan. Esta pantalla abierta es el respaldo: revisa tus mesas cada tanto y no dependas de un solo canal»*. Como respaldo, tú también ves en tu Panel, en **Comandas**, el bloque **Por confirmar — esperando al mesero en la mesa**, con un botón para **Autorizar** tú mismo si el mesero no trae el teléfono a mano.

**Cambié el número de mesas o de sucursales después de imprimir los QR.**
Revisa **Primeros pasos**: te va a decir cuántos QR te faltan o si te sobran, y **QR** te avisa si la hoja quedó desactualizada.

**Cambié la dirección de mi carta (el slug de la URL).**
Se hace desde **Identidad**, sección **Dirección pública**, pidiéndote tu contraseña del panel. Tus QR ya impresos siguen funcionando porque la dirección vieja queda apuntando a la nueva, pero conviene reimprimirlos cuando puedas y volver a compartir el enlace de tus meseros.

---

*Este manual describe únicamente lo que hoy hace el sistema, con los mismos nombres de pestañas, botones y avisos que ves en tu pantalla.*
