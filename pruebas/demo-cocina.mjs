import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const CFG = { config:{ tema:'huerto', mesas:12, negocio:'restaurante',
  marca:{ nombre:'FLAUTAS EL CRUNCH', prefijo:'Taquería', lema:'x', logo:'', acento:'', secundario:'' },
  sucursales:['PLAYAS'], meseros:[{id:1,nombre:'Lupita'}],
  categorias:[{id:'tacos',nombre:'Tacos'}],
  servicio:{modo:'mesero',canales:{aqui:true},pagos:{caja:true}} },
  platillos:[{id:'t1',cat:'tacos',nombre:'Tacos al pastor',precio:85,kcal:480,prot:26,carb:42,grasa:22,tiempo:'10 min',porcion:'3 piezas',desc:'x',descLarga:'x',ingredientes:['a'],alergenos:[],tags:[],claves:[]}],
  fotos:{}, ocultos:[], precios:{}, menuPropio:true };
const pg = await b.newPage({ viewport:{width:420,height:900} });
const escrituras = [];
await pg.route('**/rest/v1/**', async r => {
  if(r.request().method()!=='GET') escrituras.push(r.request().method());
  const u=r.request().url();
  await r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*'},
    body: u.includes('menusbot_config') ? JSON.stringify([{id:'flautas-el-crunch',data:CFG}]) : '[]'});
});
await pg.goto('http://localhost:8098/carta.html?r=flautas-el-crunch&mesa=1&demo');
await pg.waitForTimeout(2500);
await pg.evaluate(async ()=>{ document.getElementById('splash').classList.add('oculto'); agregarAlPedido('t1',1); sinBebidasOk=true; await enviarOrden(); mostrarVista('cuenta'); });
for(const seg of [3, 12, 24, 40, 60]){
  await pg.waitForTimeout(seg*1000 - (seg===3?0:0) - 0);
  const t = await pg.evaluate(()=>document.getElementById('vistaCuenta').innerText.replace(/\s+/g,' '));
  const m = t.match(/(ESPERANDO CONFIRMACIÓN|EN LA COCINA|EN PREPARACIÓN|LISTA|EN CAMINO|ENTREGAD\w+|CONFIRMADA)[^·]*/i);
  console.log(`  +${seg}s -> ${m? m[0].trim().slice(0,60) : t.slice(80,150)}`);
  break;
}
// muestreo cada 8s
for(let i=0;i<7;i++){
  await pg.waitForTimeout(8000);
  const t = await pg.evaluate(()=>document.getElementById('vistaCuenta').innerText.replace(/\s+/g,' '));
  const m = t.match(/(ESPERANDO CONFIRMACIÓN|EN LA COCINA|EN PREPARACIÓN|LISTA|EN CAMINO|ENTREGAD\w+|CONFIRMADA)[^·]*/i);
  console.log(`  +${3+(i+1)*8}s -> ${m? m[0].trim().slice(0,60) : '(sin cambio legible)'}`);
}
console.log('escrituras a la nube durante todo el ciclo:', escrituras.length ? escrituras.join(',') : 'NINGUNA');
await b.close();
