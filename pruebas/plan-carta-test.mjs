import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const base = { tema:'huerto', mesas:12, negocio:'restaurante',
  marca:{ nombre:'PRUEBA', prefijo:'', lema:'', logo:'', acento:'', secundario:'' },
  sucursales:['UNO'], meseros:['Ana'], categorias:[{id:'c',nombre:'Cocina'}],
  servicio:{modo:'mesero',canales:{aqui:true},pagos:{caja:true}} };
for(const plan of ['carta','negocio','', undefined,'BASURA']){
  const CFG = { config: plan===undefined ? {...base} : {...base, plan}, 
    platillos:[{id:'t1',cat:'c',nombre:'Platillo',precio:85,kcal:400,prot:10,carb:30,grasa:10,tiempo:'10 min',porcion:'1',desc:'x',descLarga:'x',ingredientes:['a'],alergenos:[],tags:[],claves:[]}],
    fotos:{}, ocultos:[], precios:{}, menuPropio:true };
  const pg = await b.newPage({ viewport:{width:393,height:800}, deviceScaleFactor:2, isMobile:true, hasTouch:true });
  const errs=[]; pg.on('pageerror',e=>errs.push(String(e).slice(0,120)));
  await pg.route('**/rest/v1/**', async r=>{ const u=r.request().url();
    await r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*'},
      body:u.includes('menusbot_config')?JSON.stringify([{id:'x',data:CFG}]):'[]'}); });
  await pg.goto('http://localhost:8098/carta.html?r=x&mesa=1');   // sin &demo, para probar el plan de verdad
  await pg.waitForTimeout(2600);
  const r = await pg.evaluate(()=>{
    const s=document.getElementById('splash'); if(s) s.classList.add('oculto');
    const g=document.getElementById('guia'); if(g) g.classList.remove('visible');
    const vis = sel => { const e=document.querySelector(sel); return e ? getComputedStyle(e).display !== 'none' : null; };
    let agrego = null;
    try{ agregarAlPedido('t1',1); agrego = (typeof pedido!=='undefined') ? pedido.length : '?'; }catch(e){ agrego='error'; }
    return { ordena: cartaOrdena(), mas: vis('.btn-mas-foto'), navOrden: vis('#navOrden'),
      navCuenta: vis('#navCuenta'), navMesa: vis('#navMesa'), pedidoTrasAgregar: agrego };
  });
  console.log(`  plan ${JSON.stringify(plan)} -> ordena:${r.ordena?'SÍ':'NO'} · «+»:${r.mas===null?'n/a':(r.mas?'visible':'oculto')} · orden:${r.navOrden?'sí':'no'} cuenta:${r.navCuenta?'sí':'no'} mesero:${r.navMesa?'sí':'no'} · pedido tras agregar: ${r.pedidoTrasAgregar}`);
  if(errs.length) console.log('     ERRORES:', errs.join(' | '));
  await pg.close();
}
await b.close();
