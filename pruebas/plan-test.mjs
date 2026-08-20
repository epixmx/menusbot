import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const CFG = { config:{ pin:'1987', tema:'huerto', mesas:12, negocio:'restaurante',
  marca:{ nombre:'PRUEBA', prefijo:'', lema:'', logo:'', acento:'', secundario:'' },
  sucursales:['UNO'], meseros:[], menuPropio:true, categorias:[{id:'c',nombre:'C'}],
  servicio:{modo:'mesero',canales:{aqui:true},pagos:{caja:true}} },
  platillos:[{id:'t1',cat:'c',nombre:'Platillo',precio:85}], fotos:{}, ocultos:[], precios:{} };
for(const plan of ['carta','negocio','demo','', 'ñ-basura']){
  const pg = await b.newPage({ viewport:{width:1300,height:900} });
  const errs=[]; pg.on('pageerror',e=>errs.push(String(e).slice(0,120)));
  await pg.addInitScript(p=>{ sessionStorage.setItem('menusbot_pin_ok','1');
    localStorage.setItem('mb_panel_sesion', JSON.stringify({slug:'x',nombre:'PRUEBA',email:'a@b.c',plan:p,auth:true})); }, plan);
  await pg.route('**/rest/v1/**', async r=>{ const u=r.request().url();
    await r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*'},
      body:u.includes('menusbot_config')?JSON.stringify([{id:'x',data:CFG}]):(u.includes('menusbot_duenios')?JSON.stringify([{restaurante_id:'x'}]):'[]')}); });
  await pg.goto('http://localhost:8098/panel.html?demo');
  await pg.waitForTimeout(2000);
  const r = await pg.evaluate(()=>{
    const res={};
    for(const v of ['comandas','registro','reportes','equipo','carta','temas','qr']){
      mostrarVistaPanel(v);
      res[v] = document.getElementById('v-candado').classList.contains('activa') ? 'CANDADO' : 'abre';
    }
    return { plan: planActual(), video: puedeSubirVideo(), vistas: res };
  });
  console.log(`  plan "${plan}" -> resuelve a "${r.plan}" · video:${r.video?'sí':'no'}`);
  console.log(`     ${Object.entries(r.vistas).map(([k,v])=>k+':'+v).join('  ')}`);
  if(errs.length) console.log('     ERRORES:', errs.join(' | '));
  await pg.close();
}
await b.close();
