import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
// 1) el encabezado sticky del landing sigue pegado
const pg = await b.newPage({ viewport:{width:393,height:873}, deviceScaleFactor:2.75, isMobile:true, hasTouch:true });
await pg.goto('http://localhost:8098/index.html'); await pg.waitForTimeout(1500);
await pg.evaluate(()=>window.scrollTo(0,2500)); await pg.waitForTimeout(600);
const st = await pg.evaluate(()=>{ const h=document.querySelector('header.top'); const r=h.getBoundingClientRect();
  return {top:Math.round(r.top), pos:getComputedStyle(h).position}; });
console.log('  encabezado del landing tras hacer scroll:', JSON.stringify(st), st.top===0?'-> SIGUE PEGADO' : '-> SE DESPEGÓ');
await pg.close();

// 2) la ficha: sin costura ni marco
const CFG={config:{tema:'huerto',mesas:12,negocio:'restaurante',marca:{nombre:'FLAUTAS EL CRUNCH',prefijo:'Taquería',lema:'x',logo:'',acento:'',secundario:''},sucursales:['PLAYAS'],meseros:['Lupita'],categorias:[{id:'tacos',nombre:'Tacos'}],servicio:{modo:'mesero',canales:{aqui:true},pagos:{caja:true}}},
 platillos:[{id:'t1',cat:'tacos',nombre:'Tacos al pastor',precio:85,kcal:480,prot:26,carb:42,grasa:22,tiempo:'10 min',porcion:'3 piezas',desc:'x',descLarga:'Del trompo, con piña, cebolla y cilantro en tortilla de maíz.',ingredientes:['Cerdo','Piña'],alergenos:[],tags:[],claves:[]}],fotos:{},ocultos:[],precios:{},menuPropio:true};
for(const [w,dpr] of [[360,3],[393,2.75],[412,2.625]]){
  const p2 = await b.newPage({ viewport:{width:w,height:860}, deviceScaleFactor:dpr, isMobile:true, hasTouch:true });
  await p2.route('**/rest/v1/**', async r=>{ const u=r.request().url();
    await r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*'},
      body:u.includes('menusbot_config')?JSON.stringify([{id:'flautas-el-crunch',data:CFG}]):'[]'}); });
  await p2.goto('http://localhost:8098/carta.html?r=flautas-el-crunch&mesa=1&demo');
  await p2.waitForTimeout(2200);
  await p2.evaluate(()=>{ document.getElementById('splash').classList.add('oculto'); const g=document.getElementById('guia'); if(g) g.classList.remove('visible'); abrirPlatillo('t1'); });
  await p2.waitForTimeout(1200);
  const m = await p2.evaluate(()=>{ const h=document.getElementById('hoja'); const r=h.getBoundingClientRect(); const cs=getComputedStyle(h);
    return { left:r.left, right:r.right, vw:document.documentElement.clientWidth, borde:cs.borderTopWidth, tf:cs.transform }; });
  const ok = m.left===0 && m.right===m.vw && m.borde==='0px';
  console.log(`  ficha ${m.vw}px @${dpr}x -> hoja de ${m.left} a ${m.right}, borde ${m.borde}  ${ok?'OK':'REVISAR'}`);
  if(w===393) await p2.screenshot({ path:'/home/claude/deploy-huerto/_shots/ficha-movil.png' });
  await p2.close();
}
await b.close();
