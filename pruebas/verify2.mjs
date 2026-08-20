import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const CFG = { config:{ pin:'1987', tema:'huerto', mesas:12, negocio:'restaurante',
  marca:{ nombre:'FLAUTAS EL CRUNCH', prefijo:'Taquería', lema:'Las más crujientes', logo:'', acento:'', secundario:'' },
  sucursales:['PLAYAS'], meseros:[],
  categorias:[{id:'entradas',nombre:'Para compartir'},{id:'tacos',nombre:'Tacos y antojitos'},{id:'principales',nombre:'Platos fuertes'},{id:'postres',nombre:'Postres'},{id:'bebidas',nombre:'Bebidas'}],
  servicio:{modo:'mesero',canales:{aqui:true,recoger:true,domicilio:true},pagos:{caja:true,mp:false},envio:50,minimo:200} },
  fotos:{}, videos:{}, ocultos:[], precios:{}, menuPropio:true };
const pg = await b.newPage({ viewport:{width:1360,height:1000} });
await pg.route('**/rest/v1/**', async r => {
  const u = r.request().url();
  let body = '[]';
  if(u.includes('menusbot_config')) body = JSON.stringify([{ id:'flautas-el-crunch', data:CFG }]);
  if(u.includes('menusbot_restaurantes')) body = JSON.stringify([{ slug:'flautas-el-crunch', nombre:'FLAUTAS EL CRUNCH', activo:true }]);
  await r.fulfill({ status:200, contentType:'application/json', headers:{'access-control-allow-origin':'*'}, body });
});
await pg.goto('http://localhost:8098/panel.html?demo');
await pg.waitForTimeout(2500);
await pg.fill('#pinInp', '1987').catch(e=>console.log('fill:',e.message));
await pg.evaluate(()=>probarPin());
await pg.waitForTimeout(2500);
await pg.screenshot({ path:'/home/claude/deploy-huerto/_shots/panel-dentro.png' });
await pg.evaluate(()=>{ const t=[...document.querySelectorAll('.tab')].find(x=>/TEMAS/i.test(x.textContent)); if(t) t.click(); });
await pg.waitForTimeout(1500);
await pg.screenshot({ path:'/home/claude/deploy-huerto/_shots/panel-temas.png' });
console.log(await pg.evaluate(()=>document.documentElement.getAttribute('style')));
await b.close();
