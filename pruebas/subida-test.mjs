import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const pg = await b.newPage({ viewport:{width:1280,height:900} });
const errs=[]; pg.on('pageerror',e=>errs.push(String(e).slice(0,160)));
await pg.goto('http://localhost:8098/panel.html?demo');
await pg.waitForTimeout(2500);
// probar el compresor con una imagen grande sintética, como la que sale de un teléfono
const r = await pg.evaluate(async ()=>{
  const cv=document.createElement('canvas'); cv.width=4032; cv.height=3024;
  const g=cv.getContext('2d');
  const grad=g.createLinearGradient(0,0,4032,3024); grad.addColorStop(0,'#d24'); grad.addColorStop(1,'#2a6');
  g.fillStyle=grad; g.fillRect(0,0,4032,3024);
  for(let i=0;i<3000;i++){ g.fillStyle=`hsl(${Math.floor(i%360)},70%,${40+(i%40)}%)`; g.fillRect((i*37)%4032,(i*91)%3024,26,26); }
  const img=new Image();
  await new Promise(res=>{ img.onload=res; img.src=cv.toDataURL('image/jpeg',.95); });
  const antes = Math.round(img.src.length*0.75/1024);
  const out = await comprimirImagen(img, 900, TOPE_FOTO, false);
  const logo = await comprimirImagen(img, 560, TOPE_LOGO, true);
  return { webp: haceWebp(), antesKB: antes,
    foto: { kb: Math.round(out.blob.size/1024), tipo: out.tipo, ext: out.ext, px: out.ancho+'x'+out.alto, dentroDelTope: out.blob.size<=TOPE_FOTO },
    logo: { kb: Math.round(logo.blob.size/1024), tipo: logo.tipo, dentroDelTope: logo.blob.size<=TOPE_LOGO },
    cabeceras: CABECERAS_SUBIDA('image/webp')['cache-control'] };
});
console.log(JSON.stringify(r,null,1));
console.log('errores JS:', errs.length? errs.join(' | ') : 'ninguno');
await b.close();
