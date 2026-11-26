/* Mapa kempu kreslená přes WebGL (three.js).
   Pohled, posun, přiblížení, náklon i hranice dál řídí SVG mapa v mapy.js (stejný viewBox a stejná CSS transformace),
   takže mapa vypadá a chová se stejně. Špendlíky, čísla míst, zvýraznění zón a lodě zůstávají v SVG.
   Dva režimy:
   – podklad: celá mapa jako jedna textura, plátno má stejnou CSS transformaci jako SVG,
   – plné 3D (obj): terén jako textura + budovy, chatky, stany, auta a stromy jako 3D tělesa;
     kamera se počítá přímo z CSS náklonu SVG (perspektiva + rotateX), takže tělesa sedí přesně pod SVG značkami.
   Textury img/mapa3d-*.webp a js/mapa3d-data.json vyrábí nastroje/mapa3d-export.py. */
import * as THREE from './vendor/three.module.min.js';

export async function start({stage,svg,base,styl,obj,rc}){
 const D=await (await fetch(base+'js/mapa3d-data.json',{cache:'no-cache'})).json(),T=D.tex,VER=D.v||'';
 const P3=!!(obj&&obj.length);
 const R=new THREE.WebGLRenderer({antialias:P3,alpha:true,powerPreference:'low-power'});
 R.setPixelRatio(Math.min(devicePixelRatio,2));R.outputColorSpace=THREE.SRGBColorSpace;R.setClearColor(0x000000,0);
 const cv=R.domElement;cv.className='am-gl'+(P3?' am-gl3':'');cv.setAttribute('aria-hidden','true');svg.before(cv);
 const S=new THREE.Scene();
 const mala=Math.min(innerWidth,innerHeight)<700||!(R.capabilities.maxTextureSize>=4096);
 const jm=s=>(P3?'teren-':'')+s;
 const nacti=s=>new Promise((ok,no)=>new THREE.TextureLoader().load(`${base}img/mapa3d-${jm(s)}${mala?'-2048':''}.webp?v=${VER}`,t=>{
  t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=Math.min(8,R.capabilities.getMaxAnisotropy());t.generateMipmaps=true;t.minFilter=THREE.LinearMipmapLinearFilter;ok(t)},undefined,no));
 /* terén; vybrané místo zůstane barevné, zbytek se ztlumí – jako .focus u SVG zón */
 const U={map:{value:await nacti(styl)},dim:{value:0},rc:{value:new THREE.Vector4(0,0,0,0)}};
 const mat=new THREE.ShaderMaterial({uniforms:U,side:THREE.DoubleSide,
  vertexShader:'varying vec2 vUv;varying vec2 vW;void main(){vUv=uv;vec4 w=modelMatrix*vec4(position,1.);vW=vec2(w.x,'+(P3?'w.y':'-w.y')+');gl_Position=projectionMatrix*viewMatrix*w;}',
  fragmentShader:'uniform sampler2D map;uniform float dim;uniform vec4 rc;varying vec2 vUv;varying vec2 vW;void main(){vec4 c=texture2D(map,vUv);'+
   'float l=dot(c.rgb,vec3(.299,.587,.114));vec3 d=mix(vec3(l),c.rgb,.45);d=mix(d,vec3(.85,.83,.78),.18);'+
   'float m=step(rc.x,vW.x)*step(vW.x,rc.z)*step(rc.y,vW.y)*step(vW.y,rc.w);gl_FragColor=vec4(mix(c.rgb,d,dim*(1.-m)),1.);'+
   '\n#include <colorspace_fragment>\n}'});
 const zem=new THREE.Mesh(new THREE.PlaneGeometry(T.w,T.h),mat);S.add(zem);
 let C;
 if(!P3){zem.position.set(T.x+T.w/2,-(T.y+T.h/2),0);C=new THREE.OrthographicCamera(0,1,0,-1,-10,10)}
 else{
  /* souřadnice scény = souřadnice mapy: x doprava, y dolů, z = výška nad terénem */
  zem.position.set(T.x+T.w/2,T.y+T.h/2,0);zem.scale.y=-1;
  C=new THREE.Camera();C.matrixAutoUpdate=false;
  const HK=1.3;/* výšky jako v kreslené mapě (tam jsou „vytažené“ šikmo do plochy) */
  const cl=c=>{c=rc&&c?rc(c):c;return new THREE.Color(c||'#cccccc')};
  const pos=[],nor=[],col=[],tri=(a,b,c,k)=>{const n=new THREE.Vector3().subVectors(b,a).cross(new THREE.Vector3().subVectors(c,a)).normalize();
   if(n.z<0||(Math.abs(n.z)<1e-6&&n.lengthSq()===0))n.negate();for(const v of [a,b,c]){pos.push(v.x,v.y,v.z);nor.push(n.x,n.y,n.z);col.push(k.r,k.g,k.b)}};
  const V=(p,z)=>new THREE.Vector3(p[0],p[1],z),quad=(a,b,c,d,k)=>{tri(a,b,c,k);tri(a,c,d,k)};
  const stred=q=>[(q[0][0]+q[1][0]+q[2][0]+q[3][0])/4,(q[0][1]+q[1][1]+q[2][1]+q[3][1])/4];
  /* normála stěny ven od středu (scéna je zrcadlená, proto ruční orientace) */
  const stena=(a,b,z0,z1,k,c)=>{const A=V(a,z0),B=V(b,z0),B1=V(b,z1),A1=V(a,z1);const n=new THREE.Vector3().subVectors(B,A).cross(new THREE.Vector3(0,0,1)).normalize();
   const ven=new THREE.Vector3((a[0]+b[0])/2-c[0],(a[1]+b[1])/2-c[1],0);if(n.dot(ven)<0)n.negate();
   for(const v of [A,B,B1,A,B1,A1]){pos.push(v.x,v.y,v.z);nor.push(n.x,n.y,n.z);col.push(k.r,k.g,k.b)}};
  const kvadr=(q,z0,z1,kS,kT)=>{const c=stred(q);for(let i=0;i<4;i++)stena(q[i],q[(i+1)%4],z0,z1,kS,c);if(kT)quad(V(q[0],z1),V(q[1],z1),V(q[2],z1),V(q[3],z1),kT)};
  /* sedlová střecha: hřeben podél hrany q0→q1 (nebo q1→q2) */
  const sedlo=(q,z,rh,k,podel)=>{const [a,b,c,d]=podel?[q[1],q[2],q[3],q[0]]:q;const m1=[(a[0]+d[0])/2,(a[1]+d[1])/2],m2=[(b[0]+c[0])/2,(b[1]+c[1])/2];
   const A=V(a,z),B=V(b,z),Cc=V(c,z),Dd=V(d,z),M1=V(m1,z+rh),M2=V(m2,z+rh);quad(A,B,M2,M1,k);quad(Dd,Cc,M2,M1,k);tri(A,Dd,M1,k);tri(B,Cc,M2,k)};
  const geo=(g,x,y,z,k)=>{g=g.toNonIndexed();g.computeVertexNormals();const p=g.attributes.position,n=g.attributes.normal;
   for(let i=0;i<p.count;i++){pos.push(p.getX(i)+x,p.getY(i)+y,p.getZ(i)+z);nor.push(n.getX(i),n.getY(i),n.getZ(i));col.push(k.r,k.g,k.b)}};
  const SH=new THREE.SphereGeometry(1,14,7,0,Math.PI*2,0,Math.PI/2).rotateX(Math.PI/2),
   KR=new THREE.IcosahedronGeometry(1,2),KM=new THREE.CylinderGeometry(.1,.14,1,6).rotateX(Math.PI/2),KU=r=>new THREE.ConeGeometry(1,1,10).rotateX(Math.PI/2);
  const TREEC={trA:'#4a9a50',trB:'#5aa64f',trC:'#3a8a48'};
  const zed=cl('#ece6d8'),kmen=cl('#6b4a2e');
  for(const o of obj){const q=o.p;
   switch(o.t){
    case 'b':{const h=o.h*HK,e1=Math.hypot(q[1][0]-q[0][0],q[1][1]-q[0][1]),e2=Math.hypot(q[2][0]-q[1][0],q[2][1]-q[1][1]);
     kvadr(q,0,h,zed,null);sedlo(q,h,Math.min(e1,e2)*.28,cl(o.c),e2>e1);break}
    case 'cab':kvadr(q,0,o.h*HK*.75,cl('#8a5a36'),null);sedlo(q,o.h*HK*.75,o.h*HK*.6,cl('#c23b4a'),true);break;
    case 'pt':kvadr(q,0,1.5,cl('#9a714a'),null);sedlo(q,1.5,o.h*HK,cl('#f1eee4'),true);break;
    case 'car':kvadr(q,0,o.h*.55,cl(o.c),null);kvadr(q.map(p=>[p[0]*.8+stred(q)[0]*.2,p[1]*.8+stred(q)[1]*.2]),o.h*.55,o.h,cl(o.c).multiplyScalar(.82),cl(o.c).multiplyScalar(.9));break;
    case 'van':kvadr(q,0,o.h,cl('#f3f3ef'),cl('#e6e6df'));break;
    case 'dm':{const g=SH.clone().scale(o.r,o.r*.8,o.r*.75);geo(g,q[0][0],q[0][1],0,cl(o.c));break}
    case 'tp':{const g=KU().scale(o.r,o.r,o.h).translate(0,0,o.h/2);geo(g,q[0][0],q[0][1],0,cl('#f3ecdb'));break}
    case 'dec':{const r=o.r;geo(KM.clone().scale(r,r,r*.7),q[0][0],q[0][1],r*.35,kmen);geo(KR.clone().scale(r,r,r*.95),q[0][0],q[0][1],r*1.35,cl(TREEC[o.c]||'#3f8f49'));break}
    case 'con':{const r=o.r,h=r*2.6*HK*.8;geo(KM.clone().scale(r,r,r*.5),q[0][0],q[0][1],r*.25,kmen);
     for(let i=0;i<3;i++){const w=r*(1-i*.24),z=r*.35+i*h*.26;geo(KU().scale(w,w,h*.42).translate(0,0,h*.21),q[0][0],q[0][1],z,cl('#2c6b3f'))}break}
   }}
  const G=new THREE.BufferGeometry();G.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));G.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));G.setAttribute('color',new THREE.Float32BufferAttribute(col,3));
  const telesa=new THREE.Mesh(G,new THREE.MeshLambertMaterial({vertexColors:true,side:THREE.DoubleSide}));telesa.castShadow=true;S.add(telesa);
  S.add(new THREE.HemisphereLight(0xffffff,0x9aa58a,1.6));
  const L=new THREE.DirectionalLight(0xfff4e0,1.7),cx=T.x+T.w/2,cy=T.y+T.h/2;L.position.set(cx-1600,cy-1400,2600);L.target.position.set(cx,cy,0);S.add(L,L.target);
  if(!mala){R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;L.castShadow=true;L.shadow.mapSize.set(4096,4096);
   const sc=L.shadow.camera;sc.left=-T.w*.6;sc.right=T.w*.6;sc.top=T.h*.7;sc.bottom=-T.h*.7;sc.near=10;sc.far=8000;L.shadow.bias=-.0006;
   const st=new THREE.Mesh(new THREE.PlaneGeometry(T.w,T.h),new THREE.ShadowMaterial({opacity:.28,side:THREE.DoubleSide}));st.position.set(cx,cy,.5);st.receiveShadow=true;S.add(st)}
 }
 /* kamera z CSS: stejná transformace jako #amSvg (rotateX, scale, posun) a perspektiva jeviště */
 const ZR=6000;
 const kamera3=(W,H)=>{const s=W/vb.w,cs=getComputedStyle(svg),M=cs.transform&&cs.transform!=='none'?new DOMMatrix(cs.transform):new DOMMatrix();
  const [ox,oy]=cs.transformOrigin.split(' ').map(parseFloat),st=getComputedStyle(stage),d=parseFloat(st.perspective)||1e7,[px,py]=st.perspectiveOrigin.split(' ').map(parseFloat);
  const Mf=new DOMMatrix().translate(ox,oy).multiply(M).translate(-ox,-oy).multiply(new DOMMatrix([s,0,0,0, 0,s,0,0, 0,0,s,0, -vb.x*s,-vb.y*s,0,1]));
  const Cm=new THREE.Matrix4().set(2/W,0,-2*px/(W*d)+1/d,-1, 0,-2/H,2*py/(H*d)-1/d,1, 0,0,-1/ZR,0, 0,0,-1/d,1);
  C.projectionMatrix.copy(Cm.multiply(new THREE.Matrix4().fromArray(Mf.toFloat64Array())));C.projectionMatrixInverse.copy(C.projectionMatrix).invert()};
 let vb=null,ceka=false;
 const kresli=()=>{ceka=false;if(!vb)return;const W=stage.clientWidth,H=stage.clientHeight;if(!W||!H)return;
  if(cv.width!==Math.round(W*R.getPixelRatio())||cv.height!==Math.round(H*R.getPixelRatio()))R.setSize(W,H,false);
  if(P3)kamera3(W,H);else{C.left=vb.x;C.right=vb.x+vb.w;C.top=-vb.y;C.bottom=-(vb.y+vb.h);C.updateProjectionMatrix()}
  R.render(S,C)};
 const naplanuj=()=>{if(!ceka){ceka=true;requestAnimationFrame(kresli)}};
 new ResizeObserver(naplanuj).observe(stage);
 svg.addEventListener('transitionend',naplanuj);
 return {
  view(b){vb={x:b.x,y:b.y,w:b.w,h:b.h};naplanuj()},
  async styl(s){const t=await nacti(s),o=U.map.value;U.map.value=t;if(o)o.dispose();naplanuj()},
  focus(k){const it=k&&D.items.find(i=>i.k===k);if(it&&it.r){const P=40;U.rc.value.set(it.r[0]-P,it.r[1]-P,it.r[0]+it.r[2]+P,it.r[1]+it.r[3]+P)}
   const od=U.dim.value,cil=it?1:0,t0=performance.now();const krok=t=>{const k2=Math.min(1,(t-t0)/450);U.dim.value=od+(cil-od)*k2;kresli();if(k2<1)requestAnimationFrame(krok)};requestAnimationFrame(krok)},
  destroy(){R.dispose();cv.remove()}
 }}
