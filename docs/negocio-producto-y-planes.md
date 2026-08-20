# Producto, mercado y planes

Documento de negocio. Qué vendemos, a quién, en qué orden, y qué trae cada
plan. Lo técnico está en los otros documentos; aquí no hay código.

---

## 1. Qué es MenusBot en una frase

Un restaurante pega un QR en la mesa y el comensal ve la carta con fotos y
video, ordena desde su teléfono, la cocina lo ve en una pantalla, el mesero lo
confirma y cobra. Sin app que bajar, sin hardware, sin instalación.

## 2. Qué problema resuelve, en el orden en que le duele al dueño

1. **La carta en papel se vuelve mentira.** Sube un insumo y el precio impreso
   queda viejo; se acaba un platillo y el mesero lo dice de boca. Cambiar la
   carta cuesta imprimir.
2. **El mesero es el cuello de botella.** Toma la orden, la lleva, vuelve por
   la bebida, vuelve por la cuenta. En hora pico se pierden mesas.
3. **No sabe qué se vende.** Al cerrar el día tiene una caja y una intuición,
   no un reporte.
4. **La foto vende y no la tiene.** Un platillo con foto se pide más que uno
   descrito en una línea. Con video, más todavía.

Los cuatro se atacan con lo mismo, pero el que abre la conversación es el
primero, porque es el único que el dueño ya sabe que tiene.

## 3. Los dos mercados

Vendemos a dos públicos distintos, con mensajes distintos y por canales
distintos. Confundirlos es el error más caro.

### Mercado A — el comensal

**No nos paga.** Nos importa igual o más, porque es quien genera la demanda: si
el comensal pide el QR, el restaurante lo busca.

- **Qué le ofrecemos:** ver el platillo antes de pedirlo, ordenar sin esperar
  al mesero, pedir la cuenta sin levantar la mano, y —cuando esté— puntos y
  favoritos que sirven en todos los restaurantes afiliados.
- **Qué queremos que haga:** que use el demo, que lo enseñe, que pregunte en su
  restaurante de siempre «¿por qué no tienen esto?».
- **Canal:** redes, video corto, el demo público. El demo **es** la campaña de
  este mercado: por eso se trabaja como escaparate y no como prueba interna.

### Mercado B — el restaurante

**Es quien paga.** Ciclo más largo, decisión de una persona, y esa persona casi
nunca es técnica.

- **Qué le ofrecemos:** el plan Carta gratis para que empiece sin fricción, y
  el momento de dolor —«mis clientes quieren ordenar y no puedo»— resuelto con
  un botón.
- **Qué queremos que haga:** que dé de alta su carta gratis. La conversión no
  se pelea en el alta, se pelea después.
- **Canal:** venta directa, recorrido de zona, referidos de dueño a dueño.

### El orden importa

La campaña del comensal va **primero y pesa más**. Un restaurante al que le
llega un vendedor dice «lo pienso»; un restaurante al que tres clientes le
preguntan por el QR en la misma semana busca el QR. La demanda del comensal es
lo que baja el costo de adquirir al restaurante.

Consecuencia operativa: **el demo público es un producto, no una prueba.** Se
mantiene, se pule, y se cuida que veinte personas lo abran a la vez sin
estorbarse. Ese trabajo ya está hecho —el demo no escribe nada en la base y
simula la cocina en la memoria del teléfono— y hay que sostenerlo.

## 4. Los tres planes

### Carta — $0, para siempre

- Menú completo con fotos, **sin tope de platillos**
- Importador con AI: sube la carta en PDF o foto
- QR para todas las mesas
- Marca propia: logo, colores, tipografía
- **No toma órdenes**

### Negocio — precio por definir, por sucursal, al mes

Todo lo del plan Carta, más:

- Ordenar desde la mesa
- Órdenes a la cocina y app del mesero
- Los tres modos: con meseros, sin meseros, dark kitchen
- Propinas, cortes y cuenta por mesa
- Reseñas de Google y Facebook
- Video en los platillos

### Cadenas — a cotizar

- Multi-sucursal con equipo por sede
- Reportes consolidados
- Marca blanca del grupo
- Acompañamiento de arranque

## 5. Por qué el plan gratis no tiene tope de platillos

Esta fue una decisión discutida y vale la pena dejarla escrita, porque la
intuición dice lo contrario.

La idea original era hacer el plan gratis lo más chico posible —diez platillos,
por ejemplo— para forzar el upgrade. El problema es **qué** limita ese tope: un
menú incompleto. Un restaurante con la mitad de su carta cargada tiene una
herramienta que no puede usar delante de un cliente. No la enseña, no la
comparte, no se le vuelve costumbre. Cuando llega la hora de decidir si paga,
lo que tiene en la cabeza es «esa cosa que nunca terminé de llenar».

El corte que sí funciona es **por capacidad, no por tamaño**: el menú completo,
bonito, con su marca, en todas las mesas —y el botón de ordenar apagado. El
dueño lo usa a diario, sus clientes lo ven, y el límite aparece justo en el
momento de mayor deseo: un cliente pregunta si puede pedir desde ahí y la
respuesta es no.

Además hay un argumento de red: cada carta gratis publicada es un QR más en una
mesa, y cada QR es exposición del mercado A. Un plan gratis capado produce
menos QR en la calle.

En la página el límite se dice de frente, sin letra chiquita:
**«Se ve, pero no toma órdenes.»**

## 6. Cómo se aplica el límite en el producto

El plan vive en el registro del restaurante y se refleja en la configuración
que lee la carta. Con plan Carta:

- La carta esconde el botón de agregar, la barra de la orden, las sugerencias
  de más, y las pestañas de orden, cuenta y mesa.
- La carta **no aparta mesa** ni muestra código de mesa.
- El panel bloquea las vistas de órdenes, equipo y reportes, y muestra en su
  lugar una pantalla que explica qué falta y cómo se abre.
- La subida de video queda apagada.

El criterio de diseño es **fallar abierto**: si por lo que sea no se puede leer
el plan, se asume que sí puede. Un restaurante que paga y ve su sistema
apagado por un error de red es un problema mucho más caro que un restaurante
gratis que ordenó de más un día.

## 7. Sistema de puntos — la decisión tomada

Cuatro decisiones cerradas, la implementación pendiente:

- **Identidad:** el comensal elige —cuenta o sin cuenta. No se obliga.
- **Premio:** configurable por el dueño, en dinero o en producto.
- **Acreditación:** cuando el mesero cierra el cobro. No al ordenar: una orden
  cancelada no puede haber dado puntos.
- **Alcance:** de cada restaurante, con cuenta compartida. Una sola cuenta del
  comensal que se afilia a cada restaurante por separado, y ve todos sus saldos
  en un panel.

La tasa de ejemplo que se manejó —1 peso por cada 10 gastados, o sea 10%— está
**sin decidir**. Un 10% de descuento efectivo es mucho para un margen de
restaurante; lo normal en programas de este tipo anda entre 2% y 5%. Como es
configurable por el dueño, lo que hay que fijar es el valor **por omisión**, y
ese debería salir de hablar con dos o tres dueños reales antes de programarlo.

Autenticación: **solo correo**, que no cuesta. SMS queda para después.

## 8. Qué falta antes de poder cobrar

No es una lista de deseos, es la lista de bloqueos:

1. **Los PIN de los meseros se pueden leer** con la llave pública. Necesita un
   procedimiento de entrada del lado del servidor.
2. **Un restaurante puede leer datos de otro** con la llave pública. No se
   arregla solo con políticas de la base, porque el comensal anónimo no lleva
   credencial.
3. **No hay pasarela de pago conectada.** Mercado Pago está apagado.
4. **El alta no asigna plan.** Un restaurante nuevo queda sin plan definido.
5. **Falta el precio del plan Negocio.**

Los dos primeros son de seguridad y no son negociables: cobrar por un sistema
con esos huecos abiertos es exponer a los clientes que pagan.

## 9. Nombre y marca

La piel actual —«Huerto», verde bosque con lima— está aplicada en las seis
pantallas. El **nombre definitivo está pendiente**, y de él dependen títulos,
metadatos, marcas de agua, el manifiesto de la app y el dominio. Conviene
cerrarlo antes de la campaña del mercado A, porque esa campaña se lleva el
nombre puesto.
