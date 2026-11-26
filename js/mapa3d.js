/* Mapa kempu ve WebGL (three.js): celá mapa jako jedna textura, naklopená kamera, štítky jako sprity, plující lodě.
   Rozhraní (karta, seznam míst, úvod, tlačítka) zůstává z mapy.js – tady je jen vykreslování a ovládání pohledu.
   Textury img/mapa3d-*.webp a data js/mapa3d-data.json se generují ze SVG mapy (viz admin/NAPOJENI-NA-SERVER.md). */
import * as THREE from './vendor/three.module.min.js';
import {MapControls} from './vendor/three-addons/MapControls.js';
const IC={
 chatky:'<path d="M3 11 12 4l9 7M5 10v10h14V10M10 20v-5h4v5"/>',
 stany:'<path d="M3 20 12 6l9 14zM12 6v14"/>',
 teepee:'<path d="M12 3 5 21h14zM10 3l2 3 2-3M10 21l2-5 2 5"/>',
 podsad:'<path d="M3 19 12 6l9 13M2 21h20M9 19l3-5 3 5"/>',
 kiosek:'<path d="M17 11h1a3 3 0 0 1 0 6h-1M5 8h12v9a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4zM8 2v3M12 2v3"/>',
 wc:'<path d="M2 7l2.2 10L7 10l2.8 7L12 7M21.5 9.2A4 4 0 0 0 14.5 12a4 4 0 0 0 7 2.8"/>',
 parking:'<rect x="4" y="3" width="16" height="18" rx="3"/><path d="M10 17V8h3a2.5 2.5 0 0 1 0 5h-3"/>',
 lode:'<path d="M2 14h20l-3 5H5zM12 3v11M12 4l6 7h-6"/>',
 recepce:'<path d="M4 18h16M6 18a6 6 0 0 1 12 0M12 8V5M9.5 5h5"/>',
 kotva:'<circle cx="12" cy="5" r="2.2"/><path d="M12 7.2V21M8 11h8M5 14c0 4 3 7 7 7s7-3 7-7M3 15.5l2-2 2 2M17 15.5l2-2 2 2"/>',
 hriste:'<path d="M3 21 7 4h10l4 17M7 4h10M10 4v9M14 4v9M9 13h6"/>',
 pujcovna:'<path d="M3.5 20.5 13.5 10.5M20.5 20.5 10.5 10.5M2.5 18.5l3 3M21.5 18.5l-3 3"/><ellipse cx="16.6" cy="7.4" rx="2.3" ry="4.4" transform="rotate(45 16.6 7.4)"/><ellipse cx="7.4" cy="7.4" rx="2.3" ry="4.4" transform="rotate(-45 7.4 7.4)"/>'
};
export async function start({stage,sec,base,styl,onPick}){
 const D=await (await fetch(base+'js/mapa3d-data.json')).json();
 const T=D.tex,CX=T.x+T.w/2,CZ=T.y+T.h/2,wx=x=>x-CX,wz=y=>y-CZ;
 const R=new THREE.WebGLRenderer({antialias:true,powerPreference:'low-power',alpha:false});
 const sz=()=>[stage.clientWidth||innerWidth,stage.clientHeight||600];
 R.setPixelRatio(Math.min(devicePixelRatio,2));R.setSize(...sz());R.outputColorSpace=THREE.SRGBColorSpace;
 const cv=R.domElement;cv.className='am-gl';cv.setAttribute('aria-hidden','true');stage.prepend(cv);
 const S=new THREE.Scene();S.background=new THREE.Color('#d9d4c6');S.fog=new THREE.Fog('#d9d4c6',3600,7000);
 const C=new THREE.PerspectiveCamera(36,sz()[0]/sz()[1],20,12000);
 const mala=Math.min(innerWidth,innerHeight)<700||!(R.capabilities.maxTextureSize>=4096);
 const TL=new THREE.TextureLoader(),tex={};
 const nacti=s=>tex[s]||(tex[s]=new Promise((ok,no)=>TL.load(`${base}img/mapa3d-${s}${mala?'-2048':''}.webp`,t=>{t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=Math.min(8,R.capabilities.getMaxAnisotropy());ok(t)},undefined,no)));
 const zem=new THREE.Mesh(new THREE.PlaneGeometry(T.w,T.h),new THREE.MeshBasicMaterial({color:'#fff'}));zem.rotation.x=-Math.PI/2;S.add(zem);
 /* špendlíky (kreslená) / bílé štítky (realistická) */
 const IKs=(k,c)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="${c}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${IC[k]||''}</svg>`;
 const img=src=>new Promise(ok=>{const i=new Image();i.onload=()=>ok(i);i.onerror=()=>ok(null);i.src=src});
 const FONT='"Plus Jakarta Sans",system-ui,sans-serif';
 async function spriteTex(it,s){const c2=document.createElement('canvas'),c=c2.getContext('2d'),dp=2;
  if(s==='real'){c.font=`700 ${15*dp}px ${FONT}`;const tw=c.measureText(it.n).width,W=tw+44*dp,H=48*dp;c2.width=W;c2.height=H;
   c.font=`700 ${15*dp}px ${FONT}`;c.shadowColor='rgba(0,0,0,.3)';c.shadowBlur=8*dp;c.shadowOffsetY=2*dp;c.fillStyle='#fff';
   c.beginPath();c.roundRect(2*dp,2*dp,W-4*dp,28*dp,8*dp);c.fill();c.shadowColor='transparent';
   c.fillRect(W/2-dp,30*dp,2*dp,14*dp);c.beginPath();c.arc(W/2,45*dp,3*dp,0,7);c.fill();
   const i=await img('data:image/svg+xml,'+encodeURIComponent(IKs(it.k,'#1d2420')));if(i)c.drawImage(i,10*dp,9*dp,16*dp,16*dp);
   c.fillStyle='#1d2420';c.textBaseline='middle';c.fillText(it.n,32*dp,16.5*dp)}
  else{const W=64*dp,H=80*dp;c2.width=W;c2.height=H;c.shadowColor='rgba(0,0,0,.35)';c.shadowBlur=6*dp;c.shadowOffsetY=3*dp;
   c.fillStyle='#fff';c.beginPath();c.arc(W/2,30*dp,26*dp,Math.PI*.82,Math.PI*2.18);c.lineTo(W/2,74*dp);c.closePath();c.fill();c.shadowColor='transparent';
   c.fillStyle=it.c;c.beginPath();c.arc(W/2,30*dp,21*dp,Math.PI*.8,Math.PI*2.2);c.lineTo(W/2,67*dp);c.closePath();c.fill();
   const i=await img('data:image/svg+xml,'+encodeURIComponent(IKs(it.k,'#fff')));if(i)c.drawImage(i,W/2-12*dp,18*dp,24*dp,24*dp)}
  const t=new THREE.CanvasTexture(c2);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;return {t,a:c2.width/c2.height}}
 const pins=D.items.map(it=>{const sp=new THREE.Sprite(new THREE.SpriteMaterial({depthTest:false,transparent:true}));sp.center.set(.5,0);sp.renderOrder=10;
  sp.position.set(wx(it.m[0]),0,wz(it.m[1]));sp.userData.it=it;S.add(sp);return sp});
 let vyb=null,zmena=true;
 function velikost(){const h0=sz()[1];for(const sp of pins){const d=C.position.distanceTo(sp.position),h=sp.userData.h||80,k=2*Math.tan(C.fov*Math.PI/360)*d/h0*h*(innerWidth<700?.8:1)*(sp.userData.it.k===vyb?1.22:1);sp.scale.set(k*(sp.userData.a||.8),k,1)}}
 async function nastavStyl(s){const t=await nacti(s);zem.material.map=t;zem.material.needsUpdate=true;
  await Promise.all(pins.map(async sp=>{const {t:st,a}=await spriteTex(sp.userData.it,s);const old=sp.material.map;sp.material.map=st;sp.material.needsUpdate=true;if(old)old.dispose();sp.userData.a=a;sp.userData.h=s==='real'?48:80}));
  for(const k in tex)if(k!==s){tex[k].then(t=>t.dispose());delete tex[k]}
  velikost();zmena=true}
 /* lodě po řece */
 const kanoe=(()=>{const sh=new THREE.Shape();sh.moveTo(-24,0);sh.quadraticCurveTo(-10,-8,0,-8);sh.quadraticCurveTo(10,-8,24,0);sh.quadraticCurveTo(10,8,0,8);sh.quadraticCurveTo(-10,8,-24,0);
  const g=new THREE.ExtrudeGeometry(sh,{depth:5,bevelEnabled:false});g.rotateX(Math.PI/2);g.translate(0,5,0);return g})();
 const LO=D.paths.map((P,i)=>{const cur=new THREE.CatmullRomCurve3(P.map(p=>new THREE.Vector3(wx(p[0]),2,wz(p[1]))));
  const m=new THREE.Mesh(kanoe,new THREE.MeshBasicMaterial({color:['#e8b23a','#d64545','#3a8fb7','#4b8a5a'][i%4]}));m.scale.setScalar(1.5);S.add(m);return{cur,m,off:i*3600}});
 /* kamera */
 const VYCH={t:new THREE.Vector3(wx(1000),0,wz(560)),p:new THREE.Vector3(wx(1000),2150,wz(900)+1900)};
 C.position.copy(VYCH.p);
 const K=new MapControls(C,cv);K.target.copy(VYCH.t);K.enableDamping=true;K.dampingFactor=.12;K.screenSpacePanning=false;
 K.minDistance=450;K.maxDistance=4200;K.minPolarAngle=.15;K.maxPolarAngle=1.05;K.zoomToCursor=true;K.update();
 const MEZ=new THREE.Box3(new THREE.Vector3(-T.w/2+300,0,-T.h/2+300),new THREE.Vector3(T.w/2-300,0,T.h/2-300));
 K.addEventListener('change',()=>{const t=K.target,c=t.clone();MEZ.clampPoint(t,t);const d=t.clone().sub(c);if(d.lengthSq())C.position.add(d);zmena=true;velikost()});
 let let_=null;
 function letNa(t,p,ms=800){let_={t0:performance.now(),ms,ot:K.target.clone(),op:C.position.clone(),t,p}}
 /* klik do mapy: štítek, nebo zóna pod kurzorem */
 const RC=new THREE.Raycaster(),v2=new THREE.Vector2();let dolu=null;
 const stop=e=>e.stopPropagation();['click','dblclick','wheel','pointerdown','touchstart'].forEach(t=>cv.addEventListener(t,stop,{passive:true}));
 cv.addEventListener('pointerdown',e=>{dolu=[e.clientX,e.clientY]});
 cv.addEventListener('pointerup',e=>{if(!dolu||Math.hypot(e.clientX-dolu[0],e.clientY-dolu[1])>6)return;dolu=null;
  const r=cv.getBoundingClientRect();v2.set((e.clientX-r.left)/r.width*2-1,-((e.clientY-r.top)/r.height)*2+1);RC.setFromCamera(v2,C);
  let it=null;const hp=RC.intersectObjects(pins);if(hp.length)it=hp[0].object.userData.it;
  if(!it){const hz=RC.intersectObject(zem);if(hz.length){const x=hz[0].point.x+CX,y=hz[0].point.z+CZ;it=D.items.find(i=>i.r&&x>=i.r[0]&&x<=i.r[0]+i.r[2]&&y>=i.r[1]&&y<=i.r[1]+i.r[3])}}
  onPick(it?it.k:null)});
 new ResizeObserver(()=>{const [w,h]=sz();R.setSize(w,h);C.aspect=w/h;C.updateProjectionMatrix();velikost();zmena=true}).observe(stage);
 /* kreslí jen když je mapa vidět; lodě stačí ~30 snímků/s, při ovládání plně */
 let vidi=false;new IntersectionObserver(e=>{vidi=e[0].isIntersecting;zmena=true},{rootMargin:'100px'}).observe(stage);
 let last=0;
 R.setAnimationLoop(now=>{if(!vidi||document.hidden)return;const akt=zmena||let_;if(!akt&&now-last<32)return;last=now;
  if(let_){const k=Math.min(1,(now-let_.t0)/let_.ms),e=1-Math.pow(1-k,3);K.target.lerpVectors(let_.ot,let_.t,e);C.position.lerpVectors(let_.op,let_.p,e);velikost();if(k>=1)let_=null}
  K.update();
  const TT=14400,TR=9000;for(const o of LO){const t=(now+o.off)%TT;let k=Math.min(1,t/TR);k=1-Math.pow(1-k,2.2);o.m.position.copy(o.cur.getPointAt(k));const q=o.cur.getTangentAt(Math.min(.999,k));o.m.rotation.y=-Math.atan2(q.z,q.x);o.m.visible=t<TT-700}
  R.render(S,C);zmena=false});
 await (document.fonts&&document.fonts.load?document.fonts.load(`700 15px ${FONT}`).catch(()=>{}):0);
 await nastavStyl(styl);
 return {
  styl:nastavStyl,
  focus(k){vyb=k||null;velikost();zmena=true;const it=k&&D.items.find(i=>i.k===k);
   if(!it){letNa(VYCH.t.clone(),VYCH.p.clone());return}
   const t=new THREE.Vector3(wx(it.m[0]),0,wz(it.m[1]-(innerWidth<700?0:40)));const off=C.position.clone().sub(K.target).setLength(1900);letNa(t,t.clone().add(off))},
  zoom(f){const off=C.position.clone().sub(K.target),d=Math.min(K.maxDistance,Math.max(K.minDistance,off.length()/f));letNa(K.target.clone(),K.target.clone().add(off.setLength(d)),400)},
  destroy(){R.setAnimationLoop(null);R.dispose();cv.remove()}
 }}
