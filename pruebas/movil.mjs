import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
for(const [w,h,dpr] of [[360,800,3],[390,844,2.75],[393,873,2.75],[412,915,2.625]]){
  const pg = await b.newPage({ viewport:{width:w,height:h}, deviceScaleFactor:dpr, isMobile:true, hasTouch:true });
  await pg.goto('http://localhost:8098/index.html');
  await pg.waitForTimeout(1800);
  const a = await pg.evaluate(()=>{ const d=document.documentElement; return {c:d.clientWidth,s:d.scrollWidth}; });
  // y con scroll a distintas alturas, que es cuando el usuario ve el brinco
  const muestras=[];
  for(const y of [0,900,1800,3000,4500,6000]){
    await pg.evaluate(yy=>window.scrollTo(0,yy), y);
    await pg.waitForTimeout(400);
    muestras.push(await pg.evaluate(()=>document.documentElement.scrollWidth));
  }
  console.log(`  ${w}x${h} @${dpr}x -> client ${a.c} | scrollWidth en scroll: ${muestras.join(', ')}  ${muestras.every(m=>m<=a.c)?'OK':'DESBORDA'}`);
  await pg.close();
}
await b.close();
