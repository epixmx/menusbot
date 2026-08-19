/* Service worker de MenusBot.

   Hace tres cosas: los avisos que llegan por Web Push, que las pantallas ABRAN sin internet,
   y obedecer el interruptor de apagado.

   Sobre el caché. La versión anterior no guardaba nada a propósito, con un argumento que era
   correcto: «el mesero necesita datos frescos, no una copia vieja». Sigue siendo correcto —
   para los DATOS. Por eso aquí no se guarda ni una sola respuesta de Supabase: lo único que se
   guarda es la aplicación misma, el HTML y los iconos, que no caducan. La pantalla abre; qué
   enseña y qué tan viejo es lo decide cada pantalla, con su reloj a la vista.

   Sobre el interruptor. Un service worker roto es el peor bicho que se puede publicar: deja a
   un restaurante servido con una versión vieja y sin forma de empujarle el arreglo. Por eso
   cada pantalla consulta sw-estado.json al abrir, y si dice activo:false se desinstala sola y
   borra lo guardado. Cambiar ese archivo de una línea apaga esto en todos los aparatos sin
   volver a publicar código y sin que nadie tenga que hacer nada. */

const VERSION = 'v2';
const CACHE = 'menusbot-app-' + VERSION;

self.addEventListener('install', () => {
  // Toma el control de inmediato: si el mesero recarga, no queremos dos versiones peleando.
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    // Fuera lo de versiones pasadas: un caché viejo sirviendo un HTML viejo es el bicho.
    const nombres = await caches.keys();
    await Promise.all(nombres.filter(n => n !== CACHE).map(n => caches.delete(n)));
    await self.clients.claim();
  })());
});

/* Apagado a distancia. La pantalla manda este mensaje cuando sw-estado.json dice que no. */
self.addEventListener('message', (e) => {
  if (!e.data || e.data.mb !== 'apagar') return;
  e.waitUntil((async () => {
    const nombres = await caches.keys();
    await Promise.all(nombres.map(n => caches.delete(n)));
    await self.registration.unregister();
  })());
});

/* ---------- Abrir sin internet ----------
   Red primero, guardado después: mientras haya señal SIEMPRE se ve lo último publicado, y la
   copia sirve nada más cuando la red no contesta. Al revés —caché primero— sería más rápido y
   mucho peor: un arreglo publicado tardaría una recarga extra en llegar a la cocina. */
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  let url;
  try { url = new URL(req.url); } catch (_e) { return; }

  // Supabase, las tipografías y los CDN no se tocan: ni datos ni terceros entran a este caché.
  if (url.origin !== self.location.origin) return;

  // El interruptor jamás se guarda; si se guardara no podría apagar nada.
  if (url.pathname.endsWith('sw-estado.json')) return;

  const esPagina = req.mode === 'navigate' || /\.html$/i.test(url.pathname);
  const esEstatico = /\.(png|svg|ico|webmanifest)$/i.test(url.pathname) ||
                     url.pathname.endsWith('manifest.json');
  if (!esPagina && !esEstatico) return;

  /* Las páginas se guardan por su ruta, sin la parte de la interrogación: cada mesa abre
     carta.html?mesa=7&r=… con una dirección distinta, y guardar una copia por mesa llenaría
     el disco de doscientas copias del mismo archivo. */
  const llave = esPagina ? (url.origin + url.pathname) : req;
  e.respondWith(redPrimero(req, llave));
});

async function redPrimero(req, llave) {
  const cache = await caches.open(CACHE);
  try {
    /* Con corte a los 5 s. Una red que existe pero no contesta es peor que no tener red: la
       pantalla se queda en blanco esperando algo que no va a llegar, y en una cocina eso es
       una tele apagada a media hora pico. */
    const ctrl = new AbortController();
    const reloj = setTimeout(() => ctrl.abort(), 5000);
    const r = await fetch(req, { signal: ctrl.signal });
    clearTimeout(reloj);
    if (r && r.ok) { try { await cache.put(llave, r.clone()); } catch (_e) {} }
    return r;
  } catch (_e) {
    const guardada = await cache.match(llave);
    if (guardada) return guardada;
    throw _e;
  }
}

/* ---------- Avisos por Web Push (igual que antes) ---------- */
self.addEventListener('push', (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_e) { d = {}; }

  const titulo = d.titulo || 'MenusBot';
  const cuerpo = d.cuerpo || 'Tienes un aviso de una de tus mesas.';
  const url = d.url || '/mesero.html';
  const tipo = d.tipo || 'aviso';
  const mesa = d.mesa || '';

  // La etiqueta agrupa por mesa y tipo: si llegan tres avisos iguales de la mesa 4
  // mientras el teléfono está en el bolsillo, se ve uno, no tres.
  const etiqueta = 'mb-' + tipo + '-' + mesa;

  e.waitUntil(self.registration.showNotification(titulo, {
    body: cuerpo,
    tag: etiqueta,
    renotify: true,          // vuelve a vibrar aunque reemplace uno anterior
    requireInteraction: tipo === 'cuenta' || tipo === 'mesero',
    vibrate: [200, 100, 200, 100, 300],
    icon: 'icono-192.png',
    badge: 'icono-192.png',
    data: { url, tipo, mesa },
  }));
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const destino = (e.notification.data && e.notification.data.url) || '/mesero.html';

  e.waitUntil((async () => {
    const abiertas = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    // Si ya tiene la pantalla del mesero abierta, la enfoca en lugar de abrir otra pestaña.
    for (const c of abiertas) {
      if (c.url.indexOf('mesero.html') !== -1) {
        try { c.postMessage({ mbAviso: e.notification.data || {} }); } catch (_e) {}
        return c.focus();
      }
    }
    return self.clients.openWindow(destino);
  })());
});
