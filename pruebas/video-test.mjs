import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const pg = await b.newPage({ viewport:{width:1280,height:900} });
const errs=[]; pg.on('pageerror',e=>errs.push(String(e).slice(0,160)));
await pg.goto('http://localhost:8098/panel.html?demo');
await pg.waitForTimeout(2500);
const r = await pg.evaluate(async ()=>{
  // fabricar videos de prueba con MediaRecorder desde un canvas
  async function hacerVideo(seg, lado){
    const cv=document.createElement('canvas'); cv.width=lado; cv.height=Math.round(lado*9/16);
    const g=cv.getContext('2d'); const st=cv.captureStream(25);
    const rec=new MediaRecorder(st,{mimeType:'video/webm'}); const trozos=[];
    rec.ondataavailable=e=>trozos.push(e.data); rec.start();
    const t0=performance.now();
    await new Promise(res=>{ (function pinta(){ const t=performance.now()-t0;
      g.fillStyle=`hsl(${t/10%360},80%,50%)`; g.fillRect(0,0,cv.width,cv.height);
      for(let i=0;i<400;i++){ g.fillStyle=`hsl(${(i+t)%360},90%,${30+i%50}%)`; g.fillRect((i*53+t)%cv.width,(i*97)%cv.height,18,18); }
      if(t<seg*1000) requestAnimationFrame(pinta); else res(); })(); });
    rec.stop(); await new Promise(res=>rec.onstop=res);
    return new File(trozos,'p.webm',{type:'video/webm'});
  }
  const out={};
  const largo = await hacerVideo(14, 640);
  const bueno = await hacerVideo(4, 640);
  out.medir_largo = await medirVideo(largo);
  out.medir_bueno = await medirVideo(bueno);
  out.pesos = { largo:(largo.size/1024/1024).toFixed(2)+' MB', bueno:(bueno.size/1024/1024).toFixed(2)+' MB' };
  out.reglas = { seg:VIDEO_MAX_SEG, mb:VIDEO_MAX_MB, alto:VIDEO_MAX_ALTO, planes:PLANES_CON_VIDEO, puede:puedeSubirVideo() };
  // simular el filtro tal como lo aplica subirVideo
  const filtra = (f,m)=>{ const mb=f.size/1024/1024; const fallas=[];
    if(m.seg>VIDEO_MAX_SEG+0.4) fallas.push('dura '+m.seg.toFixed(0)+' s');
    if(mb>VIDEO_MAX_MB) fallas.push('pesa '+mb.toFixed(1)+' MB');
    if(Math.min(m.ancho,m.alto)>VIDEO_MAX_ALTO) fallas.push('es '+m.ancho+'x'+m.alto);
    return fallas; };
  out.veredicto_largo = filtra(largo,out.medir_largo);
  out.veredicto_bueno = filtra(bueno,out.medir_bueno);
  return out;
});
console.log(JSON.stringify(r,null,1));
console.log('errores JS:', errs.length? errs.join(' | ') : 'ninguno');
await b.close();
