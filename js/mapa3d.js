/* Podklad mapy kempu kreslený přes WebGL (three.js).
   Pohled, posun, přiblížení, náklon i hranice dál řídí SVG mapa v mapy.js (stejný viewBox a stejná CSS transformace),
   takže mapa vypadá a chová se úplně stejně. Jen těžký statický obsah (terén, budovy, stromy) místo tisíců
   SVG prvků se stíny vykresluje grafická karta z jedné textury. Špendlíky, zvýraznění zón a lodě zůstávají v SVG.
   Textury img/mapa3d-*.webp a js/mapa3d-data.json vyrábí nastroje/mapa3d-export.py. */
import * as THREE from './vendor/three.module.min.js';

export async function start({stage,svg,base,styl}){
 const D=await (await fetch(base+'js/mapa3d-data.json')).json(),T=D.tex;
 const R=new THREE.WebGLRenderer({antialias:false,alpha:true,powerPreference:'low-power'});
 R.setPixelRatio(Math.min(devicePixelRatio,2));R.outputColorSpace=THREE.SRGBColorSpace;R.setClearColor(0x000000,0);
 const cv=R.domElement;cv.className='am-gl';cv.setAttribute('aria-hidden','true');svg.before(cv);
 const S=new THREE.Scene(),C=new THREE.OrthographicCamera(0,1,0,-1,-10,10);
 const mala=Math.min(innerWidth,innerHeight)<700||!(R.capabilities.maxTextureSize>=4096);
 const nacti=s=>new Promise((ok,no)=>new THREE.TextureLoader().load(`${base}img/mapa3d-${s}${mala?'-2048':''}.webp`,t=>{
  t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=Math.min(8,R.capabilities.getMaxAnisotropy());t.generateMipmaps=true;t.minFilter=THREE.LinearMipmapLinearFilter;ok(t)},undefined,no));
 /* rovina v souřadnicích mapy (osa y obrácená, jako v SVG) */
 /* vybrané místo zůstane barevné, zbytek se ztlumí – jako .focus u SVG zón */
 const U={map:{value:await nacti(styl)},dim:{value:0},rc:{value:new THREE.Vector4(0,0,0,0)}};
 const mat=new THREE.ShaderMaterial({uniforms:U,
  vertexShader:'varying vec2 vUv;varying vec2 vW;void main(){vUv=uv;vec4 w=modelMatrix*vec4(position,1.);vW=vec2(w.x,-w.y);gl_Position=projectionMatrix*viewMatrix*w;}',
  fragmentShader:'uniform sampler2D map;uniform float dim;uniform vec4 rc;varying vec2 vUv;varying vec2 vW;void main(){vec4 c=texture2D(map,vUv);'+
   'float l=dot(c.rgb,vec3(.299,.587,.114));vec3 d=mix(vec3(l),c.rgb,.45);d=mix(d,vec3(.85,.83,.78),.18);'+
   'float m=step(rc.x,vW.x)*step(vW.x,rc.z)*step(rc.y,vW.y)*step(vW.y,rc.w);gl_FragColor=vec4(mix(c.rgb,d,dim*(1.-m)),1.);'+
   '\n#include <colorspace_fragment>\n}'});
 const zem=new THREE.Mesh(new THREE.PlaneGeometry(T.w,T.h),mat);
 zem.position.set(T.x+T.w/2,-(T.y+T.h/2),0);S.add(zem);
 let vb=null,ceka=false;
 const kresli=()=>{ceka=false;if(!vb)return;const r=stage.getBoundingClientRect();if(!r.width||!r.height)return;
  if(cv.width!==Math.round(r.width*R.getPixelRatio())||cv.height!==Math.round(r.height*R.getPixelRatio()))R.setSize(r.width,r.height,false);
  C.left=vb.x;C.right=vb.x+vb.w;C.top=-vb.y;C.bottom=-(vb.y+vb.h);C.updateProjectionMatrix();R.render(S,C)};
 const naplanuj=()=>{if(!ceka){ceka=true;requestAnimationFrame(kresli)}};
 new ResizeObserver(naplanuj).observe(stage);
 return {
  view(b){vb={x:b.x,y:b.y,w:b.w,h:b.h};naplanuj()},
  async styl(s){const t=await nacti(s),o=U.map.value;U.map.value=t;if(o)o.dispose();naplanuj()},
  focus(k){const it=k&&D.items.find(i=>i.k===k);if(it&&it.r){const P=40;U.rc.value.set(it.r[0]-P,it.r[1]-P,it.r[0]+it.r[2]+P,it.r[1]+it.r[3]+P)}
   const od=U.dim.value,cil=it?1:0,t0=performance.now();const krok=t=>{const k2=Math.min(1,(t-t0)/450);U.dim.value=od+(cil-od)*k2;kresli();if(k2<1)requestAnimationFrame(krok)};requestAnimationFrame(krok)},
  destroy(){R.dispose();cv.remove()}
 }}
