import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const errs = [];
async function shot(url, name, w, h, wait) {
  const pg = await b.newPage({ viewport: { width: w, height: h } });
  pg.on('console', m => { if (m.type() === 'error' && !/fontshare|googleapis|gstatic|favicon|ERR_TUNNEL|supabase|Failed to fetch|net::/i.test(m.text())) errs.push(name + ': ' + m.text().slice(0, 160)); });
  pg.on('pageerror', e => errs.push(name + ' PAGEERR: ' + String(e).slice(0, 160)));
  await pg.goto('http://localhost:8098/' + url).catch(e => errs.push(name + ' GOTO: ' + e.message.slice(0, 80)));
  await pg.waitForTimeout(wait);
  await pg.screenshot({ path: `/home/claude/deploy-huerto/_shots/${name}.png` });
  await pg.close();
}
await shot('index.html', 'index', 1400, 900, 1500);
await shot('alta.html', 'alta', 1280, 900, 1200);
await shot('panel.html?demo', 'panel', 1280, 900, 3000);
await shot('mesero.html?r=flautas-el-crunch', 'mesero', 420, 850, 2500);
await shot('carta.html?r=flautas-el-crunch&mesa=1&demo', 'carta', 420, 850, 3000);
console.log('ERRORES: ' + (errs.length ? errs.join(' | ') : 'ninguno'));
await b.close();
