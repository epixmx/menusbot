import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const base = { tema:'huerto', mesas:12, negocio:'restaurante',
  marca:{ nombre:'X', prefijo:'', lema:'', logo:'', acento:'', secundario:'' },
  sucursales:['UNO'], meseros:['Ana'], categorias:[{id:'c',nombre:'C'}],
  servicio:{modo:'mesero',canales:{aqui:true},pagos:{caja:true}} };
for(const plan of ['carta','negocio']){
  const CFG = { config:{...base, plan}, platillos:[{id:'t1',cat:'c',nombre:'P',precio:85,kcal:1,prot:1,carb:1,grasa:1,tiempo:'1',porcion:'1',desc:'x',descLarga:'x',ingredientes:['a'],alergenos:[],tags:[],claves:[]}], fotos:{}, ocultos:[], precios:{}, menuPropio:true };
  const pg = await b.newPage({ viewport:{width:393,height:800}, isMobile:true, hasTouch:true });
  const escrituras=[];
  await pg.route('**/rest/v1/**', async r=>{ const m=r.request().method(), u=r.request().url();
    if(m!=='GET') escrituras.push(m+' '+u.split('/rest/v1/')[1].split('?')[0]);
    await r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*'},
      body:u.includes('menusbot_config')?JSON.stringify([{id:'x',data:CFG}]):(m==='POST'?JSON.stringify([{id:1,codigo:'1111',invitados:[]}]):'[]')}); });
  await pg.goto('http://localhost:8098/carta.html?r=x&mesa=1');
  await pg.waitForTimeout(5000);
  const hoja = await pg.evaluate(()=>(document.querySelector('.hoja.abierta')||{innerText:''}).innerText.replace(/\s+/g,' ').slice(0,60));
  console.log(`  plan ${plan} -> escrituras: ${escrituras.length?escrituras.join(' | '):'NINGUNA'} · hoja: ${hoja||'(ninguna)'}`);
  await pg.close();
}
await b.close();
