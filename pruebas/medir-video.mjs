import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
for(const [w,dpr] of [[393,2.75],[1440,2]]){
  const pg = await b.newPage({ viewport:{width:w,height:900}, deviceScaleFactor:dpr });
  await pg.goto('http://localhost:8098/index.html'); await pg.waitForTimeout(1500);
  const v = await pg.evaluate(()=>[...document.querySelectorAll('.serv video, .foto video')].map(x=>{const r=x.getBoundingClientRect(); return Math.round(r.width)+'x'+Math.round(r.height);}));
  console.log(`  viewport ${w} @${dpr}x -> videos en pantalla: ${v.join(', ')}  (px físicos: ${v[0]? v[0].split('x').map(n=>Math.round(n*dpr)).join('x'):'-'})`);
  await pg.close();
}
await b.close();
