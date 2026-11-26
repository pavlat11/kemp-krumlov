"""Vygeneruje podklady pro mapu kempu ve WebGL (js/mapa3d.js) ze SVG mapy (js/mapy.js):
   img/mapa3d-kresl(.webp|-2048.webp), img/mapa3d-real(...), js/mapa3d-data.json.
   Spustit po každé změně SVG mapy (nová chatka, přesun budovy…):  python3 nastroje/mapa3d-export.py
   Potřebuje: pip install playwright pillow numpy ; Google Chrome v /usr/bin/google-chrome."""
import json,os,sys
from playwright.sync_api import sync_playwright
from PIL import Image
import numpy as np
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
U='file://'+ROOT+'/index.html'
W,H=4096,2730
def stranka(p,styl,vp):
  b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--allow-file-access-from-files'])
  o=b.new_page(viewport=vp)
  o.add_init_script("localStorage.setItem('kk.mapa.styl','%s');localStorage.setItem('kk.mapa.3d','0')"%styl)
  o.goto(U);o.wait_for_timeout(1500);o.locator('#areal').scroll_into_view_if_needed();o.wait_for_timeout(12000)
  return b,o
with sync_playwright() as p:
  b,o=stranka(p,'kresl',{'width':1440,'height':900})
  d=o.evaluate("""(()=>{const Z=window.__am.Z,svg=document.getElementById('amSvg');
   const items=Object.values(Z).map(o=>{let r=null;if(o.g){const b=o.g.getBBox();r=[b.x*2,b.y*2,b.width*2,b.height*2]}return{k:o.k,n:o.n,c:o.c,m:[o.mx,o.my],r,d:o.d,li:o.li}});
   const paths=[...svg.querySelectorAll('.am-fleet path')].filter(p=>p.getAttribute('d')).map(p=>{const L=p.getTotalLength(),pts=[];for(let i=0;i<=60;i++){const q=p.getPointAtLength(L*i/60);pts.push([+(q.x*2).toFixed(1),+(q.y*2).toFixed(1)])}return pts});
   return {items,paths}})()""")
  b.close()
  d['paths']=[q for q in d['paths'] if abs(q[-1][0]-q[0][0])>300]
  vyska=None
  for st in ['kresl','real']:
    b,o=stranka(p,st,{'width':W,'height':H})
    o.evaluate("""(()=>{const svg=document.getElementById('amSvg');const S2=svg.querySelector(':scope>g>g');
     svg.querySelectorAll('.am-mk,.am-fleet,.am-cnum').forEach(e=>e.style.display='none');
     [...S2.children].forEach(e=>{if(e.getAttribute('pointer-events')==='none')e.style.display='none'});
     document.querySelectorAll('.am-styl,.am-panel,.am-ctrl,.am-hint,#amIntro,.am-open,.am-card,.am-tip').forEach(e=>e.style.display='none');
     svg.setAttribute('viewBox','-1800 -1064 5497 3664');svg.setAttribute('preserveAspectRatio','none');
     Object.assign(svg.style,{position:'fixed',left:'0',top:'0',width:'%dpx',height:'%dpx',zIndex:99999});svg.style.setProperty('transform','none','important');svg.style.setProperty('transition','none','important');document.body.append(svg)})()"""%(W,H))
    o.evaluate("scrollTo(0,0)");o.wait_for_timeout(1500)
    vb0=o.evaluate("[document.getElementById('amSvg').getAttribute('viewBox'),document.getElementById('amSvg').getAttribute('preserveAspectRatio'),JSON.stringify(document.getElementById('amSvg').getBoundingClientRect())]")
    tmp='/tmp/mapa3d-%s.png'%st;o.screenshot(path=tmp,clip={'x':0,'y':0,'width':W,'height':H})
    vb1=o.evaluate("document.getElementById('amSvg').getAttribute('viewBox')");print(st,vb0,vb1);b.close()
    im=Image.open(tmp).convert('RGB')
    if vyska is None:
      a=np.asarray(im).astype(int);s=a[:,::64,:].sum(axis=2).mean(axis=1);tm=np.where(s<160)[0];tm=tm[tm>H*0.8]
      vyska=int(tm[0]) if len(tm) else H
    im=im.crop((0,0,W,vyska))
    im.save(ROOT+'/img/mapa3d-%s.webp'%st,quality=84,method=6)
    im.resize((2048,round(vyska/2)),Image.LANCZOS).save(ROOT+'/img/mapa3d-%s-2048.webp'%st,quality=84,method=6)
  d['tex']={'x':-1800,'y':-1064,'w':5497,'h':round(3664*vyska/H,1)}
  json.dump(d,open(ROOT+'/js/mapa3d-data.json','w'),ensure_ascii=False)
  print('hotovo',d['tex'],len(d['items']),'míst',len(d['paths']),'tras lodí')
