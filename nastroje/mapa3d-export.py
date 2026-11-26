"""Vygeneruje podklady pro mapu kempu ve WebGL (js/mapa3d.js) ze SVG mapy (js/mapy.js):
   img/mapa3d-{kresl,real,teren-kresl,teren-real}(.webp|-2048.webp) a js/mapa3d-data.json.
   „teren“ = jen terén bez budov, chatek, stanů, aut a stromů (ty kreslí plné 3D).
   Spustit po každé změně SVG mapy:  python3 nastroje/mapa3d-export.py
   Potřebuje: pip install playwright pillow ; Google Chrome v /usr/bin/google-chrome."""
import json,os,time,base64
from playwright.sync_api import sync_playwright
from PIL import Image
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
U='file://'+ROOT+'/index.html'
VB=(-1800,-1064,5497,3664);W,H=4096,2730
SER="""async(teren)=>{const svg=document.getElementById('amSvg');const c=svg.cloneNode(true);
 c.querySelectorAll('.am-mk,.am-fleet,.am-cnum,.am-dl,.am-styl').forEach(e=>e.remove());
 const S2=c.querySelector(':scope>g>g');[...S2.children].forEach(e=>{if(e.getAttribute('pointer-events')==='none')e.remove()});
 c.querySelectorAll('.hl').forEach(e=>e.remove());
 if(teren){c.querySelectorAll('.o3').forEach(e=>e.remove());c.querySelectorAll('.am-zone[data-k=teepee] > *').forEach(e=>e.remove())}
 for(const im of c.querySelectorAll('image')){const h=im.getAttribute('href');if(h&&!h.startsWith('data:')){const b=await (await fetch(h)).blob();im.setAttribute('href',await new Promise(r=>{const f=new FileReader();f.onload=()=>r(f.result);f.readAsDataURL(b)}))}}
 c.setAttribute('viewBox','%s');c.setAttribute('preserveAspectRatio','none');c.setAttribute('width','%d');c.setAttribute('height','%d');c.removeAttribute('style');c.removeAttribute('class');
 return new XMLSerializer().serializeToString(c)}"""%(' '.join(map(str,VB)),W,H)
def nacti(p,styl):
  b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--allow-file-access-from-files'])
  o=b.new_page(viewport={'width':1440,'height':900})
  o.add_init_script("window.KK_NEBAKE=1;localStorage.setItem('kk.mapa.styl','%s');localStorage.setItem('kk.mapa.3d','0')"%styl)
  o.goto(U);o.wait_for_timeout(1500);o.locator('#areal').scroll_into_view_if_needed();o.wait_for_timeout(9000)
  return b,o
with sync_playwright() as p:
  data=None
  for styl in ['kresl','real']:
    b,o=nacti(p,styl)
    if data is None:
      data=o.evaluate("""(()=>{const Z=window.__am.Z,svg=document.getElementById('amSvg');
       const items=Object.values(Z).map(o=>{let r=null;if(o.g){const b=o.g.getBBox();r=[b.x*2,b.y*2,b.width*2,b.height*2]}return{k:o.k,n:o.n,c:o.c,m:[o.mx,o.my],r,d:o.d,li:o.li}});
       const paths=[...svg.querySelectorAll('.am-fleet path')].filter(p=>p.getAttribute('d')).map(p=>{const L=p.getTotalLength(),pts=[];for(let i=0;i<=60;i++){const q=p.getPointAtLength(L*i/60);pts.push([+(q.x*2).toFixed(1),+(q.y*2).toFixed(1)])}return pts});
       return {items,paths}})()""")
    for teren in [0,1]:
      svgs=o.evaluate(SER,teren)
      nm=('teren-' if teren else '')+styl
      f='/tmp/mapa3d-%s.html'%nm;open(f,'w').write('<!doctype html><html><body style="margin:0;background:#8fbd6c">'+svgs+'</body></html>')
      q=b.new_page(viewport={'width':W,'height':H});q.goto('file://'+f);q.wait_for_timeout(2500)
      tmp='/tmp/mapa3d-%s.png'%nm;q.screenshot(path=tmp,clip={'x':0,'y':0,'width':W,'height':H});q.close()
      im=Image.open(tmp).convert('RGB')
      im.save(ROOT+'/img/mapa3d-%s.webp'%nm,quality=84,method=6)
      im.resize((2048,1365),Image.LANCZOS).save(ROOT+'/img/mapa3d-%s-2048.webp'%nm,quality=84,method=6)
      print('ok',nm)
    b.close()
  data['paths']=[q for q in data['paths'] if abs(q[-1][0]-q[0][0])>300]
  data['v']=time.strftime('%Y%m%d%H%M')
  data['tex']={'x':VB[0],'y':VB[1],'w':VB[2],'h':VB[3]}
  json.dump(data,open(ROOT+'/js/mapa3d-data.json','w'),ensure_ascii=False)
  print('hotovo',data['tex'],len(data['items']),'míst',len(data['paths']),'tras lodí')
