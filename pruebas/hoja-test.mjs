import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const CFG={config:{tema:'huerto',mesas:12,negocio:'restaurante',marca:{nombre:'FLAUTAS EL CRUNCH',prefijo:'Taquería',lema:'x',logo:'',acento:'',secundario:''},sucursales:['PLAYAS'],meseros:['Lupita'],categorias:[{id:'tacos',nombre:'Tacos'}],servicio:{modo:'mesero',canales:{aqui:true},pagos:{caja:true}}},
 platillos:Array.from({length:8},(_,i)=>({id:'t'+i,cat:'tacos',nombre:'Platillo '+i,precio:85,kcal:480,prot:26,carb:42,grasa:22,tiempo:'10 min',porcion:'3 piezas',desc:'x',descLarga:'Del trompo, con piña, cebolla y cilantro en tortilla de maíz. '.repeat(3),ingredientes:['Cerdo','Piña','Cebolla'],alergenos:[],tags:[],claves:[]})),fotos:{},ocultos:[],precios:{},menuPropio:true};
const pg = await b.newPage({ viewport:{width:393,height:800}, deviceScaleFactor:2.75, isMobile:true, hasTouch:true });
await pg.route('**/rest/v1/**', async r=>{ const u=r.request().url();
  await r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*'},
    body:u.includes('menusbot_config')?JSON.stringify([{id:'flautas-el-crunch',data:CFG}]):'[]'}); });
await pg.goto('http://localhost:8098/carta.html?r=flautas-el-crunch&mesa=1&demo');
await pg.waitForTimeout(2200);
await pg.evaluate(()=>{ document.getElementById('splash').classList.add('oculto'); const g=document.getElementById('guia'); if(g) g.classList.remove('visible'); });
await pg.evaluate(()=>window.scrollTo(0,600)); await pg.waitForTimeout(400);
const antes = await pg.evaluate(()=>window.scrollY);
await pg.evaluate(()=>abrirPlatillo('t0')); await pg.waitForTimeout(900);
const abierta = await pg.evaluate(()=>{ const h=document.getElementById('hoja'); const r=h.getBoundingClientRect();
  return { topHoja:Math.round(r.top), altoPantalla:window.innerHeight, fondoQuieto:document.documentElement.classList.contains('fondo-quieto') }; });
// intentar mover el fondo con la hoja abierta
await pg.evaluate(()=>window.scrollTo(0,2500)); await pg.waitForTimeout(400);
const durante = await pg.evaluate(()=>window.scrollY);
await pg.evaluate(()=>cerrarSheets()); await pg.waitForTimeout(700);
const despues = await pg.evaluate(()=>window.scrollY);
console.log(`  hueco arriba de la hoja: ${abierta.topHoja}px (pantalla ${abierta.altoPantalla}px) -> ${abierta.topHoja===0?'SIN HUECO':'TODAVÍA HAY HUECO'}`);
console.log(`  fondo congelado al abrir: ${abierta.fondoQuieto?'SÍ':'NO'}`);
console.log(`  scroll del fondo: antes ${antes} · intentando moverlo con la hoja abierta ${durante} -> ${durante===0?'NO SE MUEVE':'SE MOVIÓ'}`);
console.log(`  scroll al cerrar: ${despues} -> ${despues===antes?'VUELVE A SU LUGAR':'SE PERDIÓ EL LUGAR'}`);
await b.close();
