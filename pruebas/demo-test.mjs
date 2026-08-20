import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const CFG = { config:{ tema:'huerto', mesas:12, negocio:'restaurante',
  marca:{ nombre:'FLAUTAS EL CRUNCH', prefijo:'Taquería', lema:'Las más crujientes', logo:'', acento:'', secundario:'' },
  sucursales:['PLAYAS'], meseros:[{id:1,nombre:'Lupita'}],
  categorias:[{id:'tacos',nombre:'Tacos y antojitos'}],
  servicio:{modo:'mesero',canales:{aqui:true},pagos:{caja:true}} },
  platillos:[{id:'t1',cat:'tacos',nombre:'Tacos al pastor',precio:85,kcal:480,prot:26,carb:42,grasa:22,tiempo:'10 min',porcion:'3 piezas',desc:'x',descLarga:'x',ingredientes:['a'],alergenos:[],tags:[],claves:[]}],
  fotos:{}, ocultos:[], precios:{}, menuPropio:true };

async function correr(url, etiqueta){
  const pg = await b.newPage({ viewport:{width:420,height:900} });
  const escrituras = [], errores = [];
  pg.on('pageerror', e => errores.push(String(e).slice(0,140)));
  pg.on('console', m => { if(m.type()==='error' && !/favicon|fontshare|googleapis|gstatic|net::/i.test(m.text())) errores.push(m.text().slice(0,140)); });
  await pg.route('**/rest/v1/**', async r => {
    const req = r.request(), m = req.method(), u = req.url();
    if(m !== 'GET') escrituras.push(m + ' ' + u.split('/rest/v1/')[1].split('?')[0]);
    let body = '[]';
    if(u.includes('menusbot_config')) body = JSON.stringify([{ id:'flautas-el-crunch', data:CFG }]);
    if(m === 'POST' && u.includes('menusbot_ordenes')) body = JSON.stringify([{ id: 9999 }]);
    if(m === 'POST' && u.includes('menusbot_mesas_abiertas')) body = JSON.stringify([{ id: 77, codigo:'1234', dispositivo_id:'x', invitados:[] }]);
    await r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*'},body});
  });
  await pg.route('**/functions/v1/**', async r => { escrituras.push('FN ' + r.request().url().split('/functions/v1/')[1]); await r.fulfill({status:200,body:'{}'}); });
  await pg.goto(url);
  await pg.waitForTimeout(3000);
  await pg.evaluate(()=>{ const s=document.getElementById('splash'); if(s) s.classList.add('oculto'); });
  await pg.waitForTimeout(500);
  // agregar un platillo y mandar la orden
  await pg.evaluate(()=>{ agregarAlPedido('t1', 1); });
  await pg.waitForTimeout(400);
  await pg.evaluate(async ()=>{ sinBebidasOk = true; await enviarOrden(); });
  await pg.waitForTimeout(800);
  // los otros tres botones que escriben: llamar al mesero, siguiente tiempo y pedir la cuenta
  await pg.evaluate(()=>{ try{ llamarMesero&&llamarMesero(); }catch(e){}
                          try{ pedirSiguienteTiempo&&pedirSiguienteTiempo(); }catch(e){}
                          try{ pedirCuenta&&pedirCuenta(); }catch(e){} });
  await pg.waitForTimeout(2500);
  await pg.evaluate(()=>{ mostrarVista('cuenta'); }).catch(()=>{});
  await pg.waitForTimeout(1200);
  const estado = await pg.evaluate(()=>({
    botonCodigo: (()=>{const b=document.getElementById('btnUnirseSplash'); return b? getComputedStyle(b).display : 'no existe';})(),
    cuenta: (document.querySelector('#vistaCuenta')||document.body).innerText.replace(/\s+/g,' ').slice(0,220),
  }));
  console.log('\n### ' + etiqueta);
  console.log('  escrituras a la nube:', escrituras.length ? escrituras.join(' | ') : 'NINGUNA');
  console.log('  boton del codigo    :', estado.botonCodigo);
  console.log('  vista de cuenta     :', estado.cuenta);
  if(errores.length) console.log('  ERRORES JS          :', errores.join(' | '));
  await pg.close();
}
await correr('http://localhost:8098/carta.html?r=flautas-el-crunch&mesa=1&demo', 'DEMO (no debe escribir nada)');
await correr('http://localhost:8098/carta.html?r=flautas-el-crunch&mesa=1', 'REAL (debe apartar mesa y mandar orden)');
await b.close();
