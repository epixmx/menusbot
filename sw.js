/* Service worker de MenusBot. Solo hace dos cosas: mostrar el aviso que llega por
   Web Push y, al tocarlo, abrir (o traer al frente) la pantalla del mesero.
   Sin caché offline a propósito: el mesero necesita datos frescos, no una copia vieja. */

const VERSION = 'menusbot-sw-v1';

self.addEventListener('install', (e) => {
  // Toma el control de inmediato: si el mesero recarga, no queremos dos versiones peleando.
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

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
