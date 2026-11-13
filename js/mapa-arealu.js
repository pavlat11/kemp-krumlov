/* Interaktivní mapa areálu kempu včetně animací (lodě, raft, dodávka) */
(()=>{const svg=document.getElementById('amSvg');if(!svg)return;
svg.replaceChildren();
const NS='http://www.w3.org/2000/svg',sec=document.getElementById('areal'),stage=document.getElementById('amStage'),tip=document.getElementById('amTip');
const E=(t,a={},p=svg,html)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(html)e.innerHTML=html;p.append(e);return e};
const G=(p,a={})=>E('g',a,p);
let seed=5;const R=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646};
const FONT='Plus Jakarta Sans,sans-serif';

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
const icon=(k,s=24)=>`<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${IC[k]}</svg>`;

/* data – svět = 2× souřadnice snímku */
const D=[
 {k:'parking',f:{x:340,y:430,w:540,h:440},n:'Parkoviště',c:'#55606b',m:[600,560],
  d:'Parkoviště u vjezdu do kempu, hned vedle občerstvení. Do historického centra dojdete pěšky.',
  li:['Auto '+KKC.t('auto','a')+' / den','Autobus '+KKC.t('autobus','a')+' / den – zdarma, pokud cestující bydlí v kempu','Parkovné platí do 24:00 daného dne']},
 {k:'kiosek',f:{x:860,y:500,w:340,h:220},n:'Kiosek a občerstvení',c:'#e0912f',m:[1030,560],
  d:'Občerstvení přímo v kempu s posezením u vody. Kousek odtud vyplouvají lodě z půjčovny.',
  li:['Občerstvení a pití','Posezení s výhledem na řeku','Úschovna bagáže '+KKC.t('uschovna','a')+' / batoh']},
 {k:'wc',f:{x:850,y:270,w:280,h:190},n:'WC',c:'#5d6fb8',m:[976,330],
  d:'Nové sociální zařízení s WC a sprchami, pár kroků od louky i chatek.',
  li:['Nové sprchy a WC','Sprcha na mince: '+KKC.t('sprcha','a')+' / 4 minuty']},
 {k:'pujcovna',f:{x:-200,y:380,w:640,h:760},n:'Půjčovna lodí PE-LA',c:'#1f6f9a',m:[344,862],
  d:'Půjčovna lodí a raftů PE-LA hned za parkovištěm. Zapůjčíte si kánoe nebo raft a zajistí i přepravu osob a bagáže.',
  li:['Kánoe a rafty','Přeprava osob a bagáže','Hned vedle parkoviště']},
 {k:'lode',f:{x:940,y:680,w:1600,h:200},n:'Přístaviště',c:'#2a8bb0',m:[1880,750],
  d:'Přistát můžete kdekoli podél břehu kempu. Lodě necháte na trávě u vody, pár kroků od stanu i kiosku.',
  li:['Přistání po celé délce břehu','Lodě necháte na břehu u kempu','Vltava, ř. km 280,9']},
 {k:'kotva',f:{x:300,y:880,w:480,h:300},n:'Kotviště',c:'#2f6fb0',m:[470,1100],
  d:'Kotviště je pláž a břeh řeky pod parkovištěm. Zakotvíte loď a máte to kousek do kempu.',
  li:['Pláž a břeh pod parkovištěm','Bez mola, bez vyznačení bójemi']},
 {k:'recepce',f:{x:780,y:600,w:260,h:200},n:'Recepce',c:'#b6513e',m:[902,652],
  d:'Recepce kempu u vjezdu s malou budkou a závorou. Tady se ubytujete a vyřídíte pobyt.',
  li:['Příjezd a ubytování','Informace o kempu']},
 {k:'hriste',f:{x:1170,y:720,w:230,h:150},n:'Dětské hřiště',c:'#d6457a',m:[1284,768],
  d:'Hřiště pro děti u břehu hned vedle kiosku. Rodiče mají děti na očích z posezení.',
  li:['Hned u kiosku','Výhled na řeku']},
 {k:'stany',f:{x:1190,y:250,w:850,h:520},n:'Louka pro stany',c:'#4f9a58',m:[1560,500],
  d:'Velká travnatá louka mezi řekou a chatkami pro vlastní stany a karavany.',
  li:['Rezervace nutná až pro skupiny 15+ stanů','Elektřina '+KKC.t('elek','a')+' / noc','Karavan '+KKC.t('karavan','a')+' / noc (mimo sezónu '+KKC.t('karavan','b')+')'],price:KKC.t('stan','a'),unit:'stan / noc · v sezóně'},
 {k:'podsad',f:{x:1260,y:170,w:340,h:70},n:'Podsadové stany',c:'#2a7c86',m:[1430,200],
  d:'Řada postavených stanů na dřevěné podsadě podél cesty. Přijedete a rovnou se ubytujete.',
  li:['Stan je postavený, nic nestavíte','Hned u cesty k sociálkám'],price:KKC.t('podsad','a'),unit:'stan / noc + osoby'},
 {k:'teepee',f:{x:1720,y:360,w:140,h:100},n:'Teepee',c:'#d58a2c',m:[1786,330],
  d:'Velké indiánské teepee na louce pod chatkami. Zážitek hlavně pro rodiny s dětmi a party.',
  li:['Stojí volně na louce','Kousek od chatek i sociálek'],price:KKC.t('teepee','a'),unit:'noc + osoby · mimo sezónu '+KKC.t('teepee','b')},
 {k:'chatky',f:{x:540,y:0,w:1400,h:310},n:'Chatky',c:'#b6513e',m:[1780,120],
  d:'Dřevěné chatky v klidné části kempu pod lesem a menší řada u vjezdu. Každá má kapacitu 7 osob a je včetně lůžkovin.',
  li:['Kapacita 7 osob','Včetně lůžkovin','Platí se chatka + každá osoba','Školní kurzy: '+KKC.t('skola','a')+' / osoba'],price:KKC.t('chatka','a'),unit:'chatka / noc + osoby · mimo sezónu '+KKC.t('chatka','b')}
];
const Z={};D.forEach(o=>Z[o.k]=o);

E('defs',{},svg,`
 <linearGradient id="amRv" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5f8f8a"/><stop offset=".5" stop-color="#4f7d79"/><stop offset="1" stop-color="#3f6a6b"/></linearGradient>
 <linearGradient id="amGr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9fcb79"/><stop offset="1" stop-color="#86b862"/></linearGradient>
 <pattern id="amMow" width="80" height="80" patternUnits="userSpaceOnUse" patternTransform="rotate(28)"><rect width="40" height="80" fill="rgba(255,255,255,.06)"/></pattern>
 <pattern id="amGravel" width="12" height="12" patternUnits="userSpaceOnUse"><rect width="12" height="12" fill="#e7dcc4"/><circle cx="3" cy="4" r="1" fill="#cfc2a5"/><circle cx="9" cy="9" r="1.2" fill="#d6caae"/></pattern>

 <pattern id="txG" width="128" height="128" patternUnits="userSpaceOnUse"><image href="img/inl-03.webp" width="128" height="128"/></pattern>
 <pattern id="txF" width="128" height="128" patternUnits="userSpaceOnUse"><image href="img/inl-04.webp" width="128" height="128"/></pattern>
 <pattern id="txT" width="64" height="64" patternUnits="userSpaceOnUse"><image href="img/inl-05.webp" width="64" height="64"/></pattern>
 <pattern id="txV" width="64" height="64" patternUnits="userSpaceOnUse"><image href="img/inl-06.webp" width="64" height="64"/></pattern>
 <pattern id="txW" width="220" height="110" patternUnits="userSpaceOnUse" patternTransform="rotate(-8)"><image href="img/inl-07.webp" width="220" height="110" preserveAspectRatio="none"/></pattern>
 <radialGradient id="trA" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#7cbf5e"/><stop offset=".55" stop-color="#3f8a45"/><stop offset="1" stop-color="#21512c"/></radialGradient>
 <radialGradient id="trB" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#93c45a"/><stop offset=".55" stop-color="#4f8f38"/><stop offset="1" stop-color="#2a5524"/></radialGradient>
 <radialGradient id="trC" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#6aa864"/><stop offset=".55" stop-color="#346f42"/><stop offset="1" stop-color="#1b4027"/></radialGradient>
 <linearGradient id="cnA" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3e7a4c"/><stop offset=".5" stop-color="#2b5e3a"/><stop offset="1" stop-color="#1a3d27"/></linearGradient>
 <linearGradient id="roofG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".5" stop-color="#fff" stop-opacity=".05"/><stop offset=".5" stop-color="#000" stop-opacity=".12"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></linearGradient>
 <filter id="amSoft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.2"/></filter>
 <filter id="amSh" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="2" dy="3" stdDeviation="1.8" flood-color="#173a22" flood-opacity=".35"/></filter>`);
const world=G(svg);
const S2=G(world,{transform:'scale(2)'});
const bgp=G(S2,{class:'am-bg'});
const DLS=[];const dl=(x,y,txt,size=15,rot=0,col='#2c3a30')=>{const t=E('text',{class:'am-dl','data-s':size*2,x,y,'text-anchor':'middle','font-family':FONT,'font-weight':800,'font-size':size*2,fill:col,transform:rot?`rotate(${rot} ${x} ${y})`:'','paint-order':'stroke',stroke:'rgba(255,255,255,.88)','stroke-width':4},world);t.textContent=txt;DLS.push(t);return t};
const shade=(hex,f)=>{const n=parseInt(hex.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;r=Math.round(r*f);g=Math.round(g*f);b=Math.round(b*f);return `rgb(${Math.min(255,r)},${Math.min(255,g)},${Math.min(255,b)})`};
const TREES=[];
const tree=(p,x,y,r)=>{const g=G(p,{class:'t3'});g.dataset.y=y;TREES.push(g);
  E('ellipse',{cx:x+r*.7,cy:y+r*.2,rx:r*1.2,ry:r*.65,fill:'rgba(15,40,22,.16)'},g);E('ellipse',{cx:x+r*.62,cy:y+r*.18,rx:r*.9,ry:r*.45,fill:'rgba(15,40,22,.22)'},g);
  if(R()<.32){/* jehličnan */const h=r*2.6,c='url(#cnA)';
    E('rect',{x:x-r*.09,y:y-r*.5,width:r*.18,height:r*.55,fill:'#6b4a2e'},g);
    for(let k=0;k<3;k++){const yy=y-r*.35-k*h*.26,ww=r*(1-k*.24);
      E('path',{d:`M${x-ww} ${yy} L${x} ${yy-h*.42} L${x+ww} ${yy}Z`,fill:c},g);
      E('path',{d:`M${x} ${yy-h*.42} L${x+ww} ${yy} L${x} ${yy}Z`,fill:'rgba(0,20,10,.28)'},g)}
    return g}
  const pal=['url(#trA)','url(#trB)','url(#trC)'][Math.floor(R()*3)];
  const cy=y-r*.95;
  E('rect',{x:x-r*.1,y:cy,width:r*.2,height:r*.95,fill:'#6b4a2e'},g);
  E('circle',{cx:x+r*.08,cy:cy+r*.12,r:r*.98,fill:'#1d4428'},g);
  E('circle',{cx:x,cy,r,fill:pal},g);
  for(let i=0;i<6;i++){const a=i/6*Math.PI*2-.6,rr=r*(.42+R()*.14);E('circle',{cx:x+Math.cos(a)*r*.5,cy:cy+Math.sin(a)*r*.44,r:rr,fill:pal},g)}
  E('circle',{cx:x-r*.15,cy:cy-r*.2,r:r*.55,fill:pal},g);return g};
const roofB=(p,x,y,w,h,col='#c23b4a',rot=0,H,noWin)=>{H=H??Math.max(9,Math.min(34,Math.min(w,h)*.42));
  const g=G(p,{transform:`rotate(${rot} ${x+w/2} ${y+h/2})`});
  E('path',{d:`M${x} ${y+h} L${x+w} ${y+h} L${x+w+H*.9} ${y+h-H*.25} L${x+w+H*.9} ${y-H*.2} L${x+w} ${y}Z`,fill:'rgba(15,40,22,.32)',filter:'url(#amSoft)'},g);
  const wy=y+h-H;
  E('rect',{x,y:wy,width:w,height:H,fill:'#e9e3d6'},g);E('rect',{x,y:wy,width:w,height:H,fill:shade(col,.9),opacity:.25},g);
  E('rect',{x,y:y+h-2,width:w,height:2,fill:'rgba(0,0,0,.15)'},g);
  const nW=Math.floor(w/11),nF=Math.max(1,Math.floor(H/11));
  if(noWin){}else if(nF===1&&H<=16){const ww=7,wh=H*.48,n=Math.max(1,Math.floor((w-8)/13));for(let i=0;i<n;i++){const xx=x+6+i*(w-12)/n+((w-12)/n-ww)/2;E('rect',{x:xx-1,y:wy+H*.22-1,width:ww+2,height:wh+2,fill:'#fff'},g);E('rect',{x:xx,y:wy+H*.22,width:ww,height:wh,fill:'#6f8fa0'},g);E('rect',{x:xx,y:wy+H*.22,width:ww,height:wh*.4,fill:'rgba(255,255,255,.35)'},g)}}
  else for(let f=0;f<nF;f++)for(let i=0;i<nW;i++)E('rect',{x:x+4+i*(w-6)/nW,y:wy+3+f*(H-4)/nF,width:Math.min(5,(w-6)/nW-2),height:Math.min(5,(H-4)/nF-3),fill:'#7d97a6',opacity:.85},g);
  E('rect',{x,y:y-H,width:w,height:h,fill:col},g);E('rect',{x,y:y-H,width:w,height:h,fill:'url(#roofG)'},g);
  E('line',{x1:x,y1:y-H+h/2,x2:x+w,y2:y-H+h/2,stroke:'rgba(0,0,0,.25)','stroke-width':1},g);return g};
const cabin=(p,x,y,rot=0)=>{const g=G(p,{transform:`translate(${x} ${y}) rotate(${rot})`});
  E('path',{d:'M-11 13 L11 13 L19 11 L19 -13 L11 -13Z',fill:'rgba(20,45,30,.22)'},g);
  E('rect',{x:-11,y:4,width:22,height:11,fill:'#8a5a36'},g);E('rect',{x:-3,y:7,width:6,height:8,fill:'#5a3a22'},g);E('rect',{x:-9,y:7,width:4,height:4,fill:'#f3d58a'},g);E('rect',{x:5,y:7,width:4,height:4,fill:'#f3d58a'},g);
  E('g',{transform:'translate(0 -9)'},g);const gg=g.lastChild;
  E('rect',{x:-11,y:-13,width:22,height:26,rx:1,fill:'#b9343f'},gg);E('rect',{x:-11,y:-13,width:11,height:26,fill:'#d24753'},gg);
  E('line',{x1:0,y1:-13,x2:0,y2:13,stroke:'#8e2630','stroke-width':1},gg)};
const ptent=(p,x,y)=>{const g=G(p,{transform:`translate(${x} ${y})`,filter:'url(#amSh)'});E('rect',{x:-5,y:-6,width:10,height:12,rx:1,fill:'#f4f2ea'},g);E('rect',{x:0,y:-6,width:5,height:12,fill:'#dcd9cd'},g);E('rect',{x:-6,y:5,width:12,height:2.5,fill:'#9a714a'},g)};
const dome=(p,x,y,c,s=1)=>{const g=G(p,{transform:`translate(${x} ${y}) scale(${s})`});E('ellipse',{cx:1.5,cy:2,rx:7,ry:5.5,fill:'rgba(23,58,34,.3)'},g);E('ellipse',{rx:6.5,ry:5,fill:c},g);E('path',{d:'M-6.5 0 H6.5 M0 -5 V5',stroke:'rgba(0,0,0,.2)','stroke-width':.8},g);E('ellipse',{cx:-2,cy:-2,rx:2.5,ry:1.6,fill:'rgba(255,255,255,.35)'},g)};
const car=(p,x,y,c,rot=0)=>{const g=G(p,{transform:`translate(${x} ${y}) rotate(${rot})`});E('rect',{x:-7.5,y:-3.8,width:15,height:7.6,rx:2.2,fill:c,filter:'url(#amSh)'},g);E('rect',{x:-2.5,y:-3,width:5.5,height:6,rx:1,fill:'rgba(30,50,60,.45)'},g)};
const van=(p,x,y,rot=0,w=16,h=7)=>{const g=G(p,{transform:`translate(${x} ${y}) rotate(${rot})`,filter:'url(#amSh)'});E('rect',{x:-w/2,y:-h/2,width:w,height:h,rx:1.5,fill:'#f3f3ef'},g);E('rect',{x:w/2-4,y:-h/2+1,width:3,height:h-2,fill:'rgba(30,50,60,.4)'},g)};
const boat=(p,x,y,rot,c,len=9)=>{const g=G(p,{transform:`translate(${x} ${y}) rotate(${rot})`});E('path',{d:`M${-len} 0 Q${-len*.4} -3 0 -3 Q${len*.4} -3 ${len} 0 Q${len*.4} 3 0 3 Q${-len*.4} 3 ${-len} 0Z`,fill:c,stroke:'rgba(0,0,0,.25)','stroke-width':.5},g)};
const raft=(p,x,y,c,rot=0)=>{const g=G(p,{transform:`translate(${x} ${y}) rotate(${rot})`});E('rect',{x:-8,y:-4,width:16,height:8,rx:4,fill:c,stroke:'rgba(0,0,0,.25)','stroke-width':.5},g);E('rect',{x:-5,y:-2,width:10,height:4,rx:2,fill:'rgba(0,0,0,.18)'},g)};
const zone=o=>{const g=G(S2,{class:'am-zone','data-k':o.k});o.g=g;return g};
const hl=(g,tag,a)=>E(tag,Object.assign({class:'hl'},a),g);

/* podklad */
E('rect',{x:-900,y:-450,width:2700,height:1700,fill:'url(#txG)'},bgp);
E('rect',{x:-900,y:-450,width:2700,height:1700,fill:'url(#amMow)',opacity:.6},bgp);
E('path',{d:'M-900 -450 H960 V-10 C700 10 500 30 280 60 C150 80 40 110 -300 130 C-500 140 -700 150 -900 160Z',fill:'url(#txT)'},bgp);
[[-700,-300],[-520,-200],[-300,-330],[-80,-250],[120,-320],[330,-260],[560,-330],[760,-260],[-640,-60],[-460,-120],[40,-140],[300,-150],[560,-160],[760,-140],[-820,40],[880,-200]].forEach(([x,y])=>{for(let k=0;k<4;k++)tree(bgp,x+R()*70,y+R()*40,9+R()*7)});
[[-380,-60,90,40,'#a8574a'],[-260,-20,70,36,'#8c8378'],[-160,0,110,34,'#9a5aa0'],[50,18,160,32,'#8f5e8f'],[215,20,55,24,'#b8503b'],[280,0,60,28,'#9d978d'],[360,-40,90,30,'#8c8378'],[480,-60,120,40,'#b8503b'],[640,-80,100,40,'#9d978d'],[-420,40,100,40,'#b8503b'],[-120,70,70,30,'#a8574a'],[0,-60,120,40,'#b8503b'],[180,-80,120,46,'#9a5aa0']].forEach(([x,y,w,h,c])=>roofB(bgp,x,y,w,h,c,-8));
E('path',{d:'M-540 120 C-200 95 0 70 180 45 S420 5 620 -30 L980 -80',fill:'none',stroke:'#b3ab9b','stroke-width':16},bgp);
for(let i=0;i<46;i++){const x=-60+R()*350,y=62+R()*55-x*.12;tree(bgp,x,y,10+R()*9)}
const GRV='M-182 160 L130 150 L270 138 L555 66 L620 52 L800 38 L965 50 L968 125 L820 122 L640 120 L615 160 L602 230 L600 350 L603 424 L520 442 L420 470 L330 506 L210 556 L90 586 L-182 592Z';
E('path',{d:GRV,fill:'url(#txV)'},bgp);E('path',{d:GRV,fill:'none',stroke:'#cbbd9c','stroke-width':2},bgp);
E('path',{d:'M-500 152 C-420 170 -250 176 -100 172 C40 168 120 168 160 175 L270 145 L555 78 L630 70 L820 62 L965 70',fill:'none',stroke:'#d8ccae','stroke-width':14,'stroke-linecap':'round'},bgp);
{const RD='M150 172 C152 260 150 380 148 470 C146 530 128 548 70 552 L-100 556 C-150 556 -168 530 -168 480 L-168 260 C-168 205 -160 180 -130 172';
 E('path',{d:RD,fill:'none',stroke:'#cbbd9c','stroke-width':28,'stroke-linejoin':'round'},bgp);E('path',{d:RD,fill:'none',stroke:'#e2d6b8','stroke-width':22,'stroke-linejoin':'round'},bgp);
 const R2='M-140 556 C-190 560 -220 566 -260 578';E('path',{d:R2,fill:'none',stroke:'#cbbd9c','stroke-width':26},bgp);E('path',{d:R2,fill:'none',stroke:'#e2d6b8','stroke-width':20},bgp);
 const R3='M140 520 C190 530 240 522 290 506';E('path',{d:R3,fill:'none',stroke:'#e2d6b8','stroke-width':16,'stroke-linecap':'round'},bgp);}
E('path',{d:'M175 430 L470 430 L560 410',fill:'none',stroke:'#d8ccae','stroke-width':16},bgp);
// les vpravo nahoře
const fEdge=x=>x<965?-999:x<1000?(x-965)*3+20:Math.min(240,120+(x-1000)*.35);
for(let i=0;i<420;i++){const x=950+R()*850,y=-450+R()*700;if(y>fEdge(x))continue;tree(bgp,x,y,16+R()*16)}
for(let i=0;i<20;i++){const x=900+R()*80,y=-40+R()*60;tree(bgp,x,y,12+R()*8)}
// řeka – stejná šířka po celé délce
const NB='M-900 607 L-500 606 C-250 604 -60 602 80 594 C180 588 250 552 330 512 S520 440 660 420 S900 392 1050 370 S1300 345 1800 330';
const RW=135;const nbP=E('path',{d:NB,fill:'none',stroke:'none'},bgp);const nbL=nbP.getTotalLength();
const RV=[];for(let l=0;l<=nbL;l+=10){const p=nbP.getPointAtLength(l),q=nbP.getPointAtLength(Math.min(nbL,l+1)),pp=nbP.getPointAtLength(Math.max(0,l-1));
  let dx=q.x-pp.x,dy=q.y-pp.y;const m=Math.hypot(dx,dy)||1;RV.push({x:p.x,y:p.y,nx:-dy/m,ny:dx/m})}
const off=(k)=>RV.map(r=>[r.x+r.nx*RW*k,r.y+r.ny*RW*k]);
const toD=pts=>'M'+pts.map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' L');
const far=off(1);
E('path',{d:toD(RV.map(r=>[r.x,r.y]))+' L'+far.slice().reverse().map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' L')+'Z',fill:'url(#txW)'},bgp);
{const RVD=toD(RV.map(r=>[r.x,r.y]))+' L'+far.slice().reverse().map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' L')+'Z';E('path',{d:RVD,fill:'url(#amRv)',opacity:.4},bgp);
 [[.04,10,'rgba(25,55,55,.35)'],[.13,14,'rgba(25,55,55,.15)'],[.95,10,'rgba(170,205,190,.25)']].forEach(([k,w,c])=>E('path',{d:toD(off(k)),fill:'none',stroke:c,'stroke-width':w,filter:'url(#amSoft)'},bgp))}
E('path',{d:toD(far)+' L1800 1300 L-900 1300Z',fill:'url(#txF)'},bgp);
E('path',{d:toD(far),fill:'none',stroke:'#c9b892','stroke-width':6},bgp);
E('path',{d:NB,fill:'none',stroke:'#cdbb93','stroke-width':9,'stroke-linecap':'round'},bgp);
E('path',{d:NB,fill:'none',stroke:'#ddcfae','stroke-width':4},bgp);
[.3,.5,.7].forEach((k,i)=>E('path',{class:'am-wave',d:toD(off(k)),fill:'none',stroke:'rgba(255,255,255,.16)','stroke-width':1.1,'stroke-dasharray':'8 22','stroke-linecap':'round',style:`animation-delay:-${i*1.7}s`},bgp));
for(let i=0;i<230;i++){const x=-850+R()*2650,y=560+R()*600;const fy=far.reduce((a,p)=>Math.abs(p[0]-x)<Math.abs(a[0]-x)?p:a)[1];if(y<fy+20)continue;tree(bgp,x,y,12+R()*14)}
E('text',{x:1080,y:448,fill:'rgba(255,255,255,.8)','font-family':'Fraunces,serif','font-style':'italic','font-size':24,transform:'rotate(-6 1060 420)'},bgp).textContent='Vltava';
E('path',{d:'M900 460 l40 -5 m-10 -5 l10 5 l-9 6',fill:'none',stroke:'rgba(255,255,255,.6)','stroke-width':2,'stroke-linecap':'round','stroke-linejoin':'round'},bgp);
/* ===== za půjčovnou podle skutečnosti ===== */
{const L=G(bgp);
 const road=(d,w)=>{E('path',{d,fill:'none',stroke:'#cbbd9c','stroke-width':w+6,'stroke-linecap':'round','stroke-linejoin':'round'},L);E('path',{d,fill:'none',stroke:'#e2d6b8','stroke-width':w,'stroke-linecap':'round','stroke-linejoin':'round'},L)};
 const asph=(d,w)=>{E('path',{d,fill:'none',stroke:'#a9a397','stroke-width':w+4,'stroke-linecap':'round'},L);E('path',{d,fill:'none',stroke:'#bdb7ab','stroke-width':w,'stroke-linecap':'round'},L)};
 E('path',{d:'M-500 175 C-300 185 -190 180 -182 190 L-182 560 L-260 560 C-360 540 -420 460 -470 360 C-500 290 -515 220 -500 175Z',fill:'#5f9a5c'},L);
 E('path',{d:'M-480 170 C-450 260 -390 360 -320 450 C-285 500 -282 555 -292 604',fill:'none',stroke:'#5f8f8a','stroke-width':5,'stroke-linecap':'round'},L);
 E('path',{d:'M-445 205 L-238 194 L-206 228 L-206 405 L-262 432 L-330 418 L-410 300Z',fill:'#a5a39d',filter:'url(#amSh)'},L);
 const pl=G(L,{transform:'rotate(28 -320 300)'});
 for(let r=0;r<3;r++)for(let c=0;c<6;c++)E('rect',{x:-385+c*16,y:252+r*34,width:16,height:30,fill:'none',stroke:'#fff','stroke-width':1.3,opacity:.85},pl);
 for(let i=0;i<7;i++)E('rect',{x:-232,y:250+i*18,width:18,height:16,fill:'none',stroke:'#fff','stroke-width':1.3,opacity:.85},L);
 const cc=['#f4f4f4','#3a6ea5','#2b2b2b','#cfcfcf','#d64545'];
 for(let i=0;i<9;i++)car(L,-420+i*20,212-i*1.2,cc[i%5],-90);
 car(L,-223,300,'#2b2b2b');car(L,-223,354,'#f4f4f4');
 asph('M-540 120 L-900 96',16);asph('M-540 120 L-560 -120',16);asph('M-505 150 C-420 170 -300 176 -182 174',16);
 asph('M-528 166 C-512 262 -482 342 -440 404 C-392 478 -320 546 -222 556 L-150 556',15);
 E('circle',{cx:-540,cy:120,r:44,fill:'none',stroke:'#a9a397','stroke-width':22},L);E('circle',{cx:-540,cy:120,r:44,fill:'none',stroke:'#bdb7ab','stroke-width':17},L);
 E('circle',{cx:-540,cy:120,r:30,fill:'#6f9a55'},L);E('circle',{cx:-540,cy:120,r:16,fill:'#8a7d62'},L);
 [[-500,140],[-525,170],[-584,118]].forEach(([x,y])=>{for(let k=-2;k<=2;k++)E('rect',{x:x+k*5-1.5,y:y-6,width:3,height:12,fill:'#fff',opacity:.8},L)});
 road('M-150 556 C-220 562 -270 572 -293 592',18);
 E('rect',{x:-306,y:588,width:26,height:170,fill:'#9b9790',filter:'url(#amSh)'},L);E('rect',{x:-306,y:588,width:3,height:170,fill:'#6f6c66'},L);E('rect',{x:-283,y:588,width:3,height:170,fill:'#6f6c66'},L);
 roofB(L,-128,96,180,58,'#d8d5ce',-6);E('rect',{x:-128,y:96,width:42,height:58,fill:'#c9b8a2',transform:'rotate(-6 -38 125)'},L);
 roofB(L,180,92,60,40,'#c23b4a');
 E('path',{d:'M-900 430 C-760 420 -640 440 -560 480 C-520 520 -540 580 -560 600 L-900 604Z',fill:'#d9c7a1'},L);
 roofB(L,-700,470,40,24,'#e5e3dd');roofB(L,-650,478,30,22,'#c9883e');roofB(L,-620,540,60,40,'#8f8a83');
 for(let i=0;i<70;i++){const t=R();let x,y;
   if(i<22){x=-470+t*260;y=430+R()*130-t*20}
   else if(i<40){const s=R();x=-505+s*80+R()*30;y=200+s*220}
   else if(i<52){x=-200+R()*12;y=200+R()*330}
   else {x=-880+R()*300;y=180+R()*250}
   tree(L,x,y,10+R()*10)}
}
roofB(bgp,352,165,40,30,'#8f8a83');roofB(bgp,392,172,38,28,'#cfd3d6');roofB(bgp,500,218,25,22,'#7c4b9a');roofB(bgp,322,220,38,14,'#cfd3d6');

const bank=x=>x<660?452-(x-470)*.22:x<1050?420-(x-660)*.128:370-(x-1050)*.06;
const DOCKS=[760,905,1010,1160];
/* ZÓNY */
// parkoviště
{const g=zone(Z.parking);hl(g,'rect',{x:172,y:222,width:255,height:208,rx:10});
 E('rect',{x:180,y:228,width:240,height:196,rx:4,fill:'#bdb6a7'},g);
 const cc=['#d64545','#f4f4f4','#3a6ea5','#2b2b2b','#cfcfcf','#9fb3c0','#f4f4f4','#4b5a6a','#f4f4f4','#cfcfcf','#7a1f2a'];
 [190,212,240,262,322,344,392,412].forEach(x=>{for(let y=240;y<=412;y+=11.5){if(R()<.14)continue;car(g,x,y,cc[Math.floor(R()*cc.length)])}});
 E('rect',{x:182,y:300,width:14,height:14,rx:3,fill:'#2f6f9a'},g);E('text',{x:189,y:311,'text-anchor':'middle',fill:'#fff','font-weight':800,'font-size':10,'font-family':FONT},g).textContent='P'}
// WC a sprchy
{const g=zone(Z.wc);hl(g,'rect',{x:430,y:143,width:128,height:80,rx:8});
 roofB(g,437,150,103,66,'#c23b4a',0,13);roofB(g,540,160,13,42,'#9a9fa4',0,10)}
// kiosek
{const g=zone(Z.kiosek);hl(g,'path',{d:'M438 255 H592 V352 H438Z'});
 roofB(g,446,262,80,52,'#c23b4a');roofB(g,505,276,48,40,'#c23b4a',0,undefined,true);roofB(g,446,300,60,46,'#c23b4a');
 E('rect',{x:478,y:318,width:42,height:24,fill:'#3c9aa0',filter:'url(#amSh)'},g);E('rect',{x:520,y:312,width:36,height:30,fill:'#d9dbd6',filter:'url(#amSh)'},g);
 // posezení u stromů: lavička – stůl – lavička (otočeno o 90°)
 [[468,372],[507,372],[546,372]].forEach(([x,y])=>{
  const s=G(g,{transform:`translate(0 14) rotate(90 ${x+13} ${y+11.5})`});
  E('rect',{x:x+1,y:y+1,width:26,height:22,rx:2,fill:'rgba(15,40,22,.25)'},s);
  const bn=yy=>{E('rect',{x:x+1,y:yy,width:24,height:4,rx:1,fill:'#a8713a',stroke:'#6b4423','stroke-width':.5},s)};
  bn(y);
  E('rect',{x,y:y+6.5,width:26,height:9,rx:1.5,fill:'#c9955c',stroke:'#6b4423','stroke-width':.6,filter:'url(#amSh)'},s);
  E('line',{x1:x+1,y1:y+11,x2:x+25,y2:y+11,stroke:'rgba(70,40,15,.35)','stroke-width':.5},s);
  bn(y+18)});
 dl(1030,724,'Kiosek a občerstvení',15)}
// půjčovna lodí PE-LA
{const z=zone(Z.pujcovna);const g=G(z,{transform:'translate(0 -36)'});hl(g,'path',{d:'M-100 215 L152 215 L152 572 L-100 576Z'});
 roofB(g,-75,225,95,46,'#8f4a55');
 roofB(g,-92,330,58,232,'#c23b4a');
 roofB(g,26,300,52,70,'#c23b4a');roofB(g,20,365,66,195,'#c23b4a');
 roofB(g,96,285,46,135,'#c23b4a');roofB(g,96,430,40,52,'#c23b4a');
 E('rect',{x:100,y:492,width:28,height:18,fill:'#e8b23a',filter:'url(#amSh)'},g);E('rect',{x:132,y:445,width:16,height:16,fill:'#3c9aa0',filter:'url(#amSh)'},g);
 const rc=['#e8b23a','#d64545','#3a6ea5','#f2f2f2','#4b8a5a'];
 for(let i=0;i<8;i++){boat(g,-19,352+i*21,90,rc[i%5]);boat(g,5,352+i*21,90,rc[(i+2)%5])}
 // malá dřevěná bouda půjčovny (stejný náklon jako ostatní budovy)
 roofB(g,180,471,40,18,'#a8713a',0,12);
 dl(-14,1098,'Půjčovna lodí PE-LA',14)}
// dětské hřiště
{const g=zone(Z.hriste);hl(g,'rect',{x:614,y:378,width:56,height:44,rx:6,transform:'rotate(-5 642 400)'});
 const p=G(g,{transform:'translate(-26 10) rotate(-5 668 390)'});
 E('rect',{x:652,y:378,width:34,height:24,rx:2,fill:'#e2c98f',stroke:'#c94a4a','stroke-width':1.5},p);
 E('rect',{x:656,y:382,width:10,height:6,fill:'#d64545',filter:'url(#amSh)'},p);E('path',{d:'M666 385 L680 396',stroke:'#3a8fb7','stroke-width':3,'stroke-linecap':'round'},p);
 E('line',{x1:670,y1:381,x2:684,y2:381,stroke:'#555','stroke-width':1.5},p);E('rect',{x:672,y:383,width:4,height:2,fill:'#f2c230'},p);E('rect',{x:679,y:383,width:4,height:2,fill:'#f2c230'},p);
 E('circle',{cx:660,cy:396,r:3,fill:'#f2c230'},p);
 dl(1284,862,'Dětské hřiště',13)}
// přístaviště podél celého břehu
{const g=zone(Z.lode);hl(g,'path',{d:'M470 452 L560 430 L660 410 L800 394 L950 375 L1050 360 L1270 342 L1270 372 L1050 388 L950 402 L800 420 L660 440 L560 462 L470 486Z'});
 const bc=['#e8b23a','#d64545','#3a8fb7','#f2f2f2','#4b8a5a'];
 for(let i=0;i<34;i++){const x=480+i*23+R()*8;if(x<672)continue;if(DOCKS.some(d=>Math.abs(x-d)<16))continue;boat(g,x,bank(x)-5+R()*3,-8+R()*16,bc[i%5])}
 raft(g,700,432,'#e8b23a',-8);raft(g,880,412,'#d64545',-6);raft(g,1110,385,'#e8b23a',-4);
 dl(1800,820,'Přístaviště po celém břehu',14,-4)}
// kotviště (pláž pod parkovištěm)
{const g=zone(Z.kotva);hl(g,'path',{d:'M150 508 L229 490 L271 478 L319 461 L334 513 L322 519 L298 531 L274 540 L250 552 L226 561 L200 570 L172 579 L155 584Z'});
 dl(480,1190,'Kotviště',15)}
// recepce (budka + závora na začátku budovy)
{const g=zone(Z.recepce);hl(g,'rect',{x:430,y:326,width:44,height:72,rx:8});
 roofB(g,440,334,22,15,'#b6513e',0,9);
 // závora: sloupek u budky a rameno směrem dolů k cestě
 E('rect',{x:440,y:349,width:7,height:4,rx:1,fill:'#4a4a4a',filter:'url(#amSh)'},g);
 E('rect',{x:441,y:352,width:5,height:40,rx:1,fill:'#f4f4f4',stroke:'rgba(0,0,0,.35)','stroke-width':.4},g);
 [355,363,371,379].forEach(y=>E('rect',{x:441,y,width:5,height:3.5,fill:'#d64545'},g));
 dl(900,776,'Recepce',13)}
// louka pro stany
{const g=zone(Z.stany);hl(g,'path',{d:'M600 140 L965 128 L1010 165 L1010 300 L960 330 L870 352 L700 372 L615 380 L598 300Z'});
 van(g,632,212,-80,24,10);van(g,786,178,-80,20,10);van(g,826,193,0,30,9);van(g,752,190,0,12,7);van(g,1003,195,0,14,8);van(g,710,220,0,10,7);
 const tc=['#4f9ec4','#5bb56a','#e0e0d8','#3a6e8f','#e05a4c','#f2c230','#9fb8c8'];
 [[702,270],[735,248],[765,240],[800,240],[822,240],[745,298],[770,292],[818,258],[705,248],[790,265],[728,305],[885,297],[900,295],[918,295],[935,293],[1035,280],[960,230],[655,250],[680,300]].forEach(([x,y],i)=>dome(g,x,y,tc[i%tc.length],1.25));
 dl(1560,560,'Louka pro stany',16)}
// podsadové stany
{const g=zone(Z.podsad);hl(g,'rect',{x:636,y:92,width:160,height:24,rx:6});
 for(let i=0;i<12;i++)ptent(g,646+i*12.5,104)}
// teepee (podle skutečnosti: bílé plátno, dřevěné tyče nahoře, vchod)
{const g=zone(Z.teepee);hl(g,'circle',{cx:893,cy:208,r:30});
 const cx=893,by=216,rx=19,ry=7,ay=178;
 // stín na trávě
 E('ellipse',{cx:cx+14,cy:by+3,rx:rx+10,ry:ry+1,fill:'rgba(23,58,34,.32)',filter:'url(#amSoft)'},g);
 // kolíky a lana
 [[-30,4],[-12,11],[12,11],[30,4]].forEach(([dx,dy])=>{E('line',{x1:cx+dx*.62,y1:by-4,x2:cx+dx,y2:by+dy,stroke:'rgba(90,70,40,.55)','stroke-width':.5},g);E('circle',{cx:cx+dx,cy:by+dy,r:1,fill:'#7a5a3a'},g)});
 // tělo (kužel)
 E('path',{d:`M${cx-rx} ${by} Q${cx} ${by+ry*2} ${cx+rx} ${by} L${cx+2} ${ay} L${cx-2} ${ay}Z`,fill:'#f3ecdb',stroke:'#cfc3a4','stroke-width':.6},g);
 // stínovaná pravá polovina
 E('path',{d:`M${cx+3} ${ay} L${cx+rx} ${by} Q${cx+8} ${by+ry*1.8} ${cx+2} ${by+ry*1.7}Z`,fill:'rgba(120,100,70,.22)'},g);
 // švy
 [-12,-6,6,12].forEach(dx=>E('path',{d:`M${cx+dx*.1} ${ay+2} L${cx+dx*1.4} ${by+2}`,stroke:'rgba(160,140,105,.55)','stroke-width':.5,fill:'none'},g));
 // vchod
 E('path',{d:`M${cx-5} ${by+ry*1.6} L${cx-2.5} ${by-13} Q${cx} ${by-16} ${cx+2.5} ${by-13} L${cx+5} ${by+ry*1.6}Z`,fill:'#6b4a2b'},g);
 E('path',{d:`M${cx-5} ${by+ry*1.6} L${cx-2.5} ${by-13} L${cx-8} ${by+ry*1.5}Z`,fill:'#e6dcc2',stroke:'#cfc3a4','stroke-width':.4},g);
 // tyče nad vrcholem
 [-9,-5,-2,2,5,9].forEach(dx=>E('line',{x1:cx+dx*.15,y1:ay+2,x2:cx+dx,y2:ay-11-Math.abs(dx)*-.3,stroke:'#c79a5a','stroke-width':1.1,'stroke-linecap':'round'},g));
 E('circle',{cx,cy:ay,r:1.6,fill:'#9a7040'},g)}
// chatky
{const g=zone(Z.chatky);hl(g,'path',{d:'M274 98 L546 33 L558 66 L288 128Z M600 110 H632 V142 H600Z M814 2 H960 V42 H814Z M814 76 H960 V116 H814Z'});
 for(let i=0;i<10;i++)cabin(g,290+i*27.5,108-i*6.3,-13);
 cabin(g,616,125,0);
 for(let i=0;i<5;i++)cabin(g,832+i*28,22,0);
 for(let i=0;i<5;i++)cabin(g,832+i*28,96,0);
 dl(1780,268,'Chatky',16)}
const trs=G(S2);
[[672,232,24],[757,225,24],[928,340,28],[1022,328,28],[1125,318,28],[1188,262,22],[1047,232,24],[1110,205,28],[1180,195,20],[728,85,22],[485,362,20],[548,238,15],[440,437,24],[487,435,22],[535,432,20],[668,430,13],[300,495,20],[1225,322,20],[1240,250,18],[575,85,12]].forEach(([x,y,r])=>tree(trs,x,y,r));
dl(976,476,'WC',14);
dl(-640,600,'Nový potok',13,30,'#4a4a4a');dl(-900,520,'Na Svahu',12,62,'#4a4a4a');dl(-700,320,'U Trojice',12,8,'#4a4a4a');dl(-590,900,'most Na Svahu',11,90,'#4a4a4a');
/* hloubkové řazení stromů (vzdálenější dřív) */
{const byP=new Map();TREES.forEach(t=>{const p=t.parentNode;if(!p)return;if(!byP.has(p))byP.set(p,[]);byP.get(p).push(t)});
 byP.forEach(arr=>{const ph=arr.map(t=>{const c=document.createComment('');t.replaceWith(c);return c});arr.sort((a,b)=>a.dataset.y-b.dataset.y);ph.forEach((c,i)=>c.replaceWith(arr[i]))})}
/* animace: lodě připlouvají po řece a parkují v kempu */
{const lay=G(S2,{class:'am-fleet'});const cols=['#e8b23a','#d64545','#3a8fb7','#4b8a5a'];
 const F=DOCKS.map((x,i)=>{const by=bank(x)-4;const lane=off(.45+.08*(i%2));
   const pts=lane.filter(p=>p[0]<x-70);const last=pts[pts.length-1];
   const p=E('path',{d:toD(pts)+` Q${x-20} ${last[1]} ${x} ${by}`,fill:'none',stroke:'none'},lay);
   const g=G(lay);E('ellipse',{rx:16,ry:5,fill:'rgba(255,255,255,.35)',class:'wake'},g);
   const b=G(g,{transform:'scale(1.5)'});
   if(i%3===1){E('rect',{x:-11,y:-5.5,width:22,height:11,rx:5.5,fill:cols[i%cols.length],stroke:'rgba(0,0,0,.3)','stroke-width':.6},b);E('rect',{x:-7.5,y:-3,width:15,height:6,rx:3,fill:'rgba(0,0,0,.16)'},b);
    [[-5.5,-2,'#3a8fb7'],[-2,2,'#f4f4f4'],[2,-2,'#d64545'],[5.5,2,'#4b8a5a']].forEach(([x,y,c])=>E('circle',{cx:x,cy:y,r:1.7,fill:c,stroke:'rgba(0,0,0,.3)','stroke-width':.3},b))}
   else{E('path',{d:'M-12 0 Q-5 -4 0 -4 Q5 -4 12 0 Q5 4 0 4 Q-5 4 -12 0Z',fill:cols[i],stroke:'rgba(0,0,0,.3)','stroke-width':.6},b);
   E('circle',{cx:-4,cy:0,r:1.9,fill:'#c0392b'},b);E('circle',{cx:4,cy:0,r:1.9,fill:'#f2f2f2'},b)}
   return{p,g,L:p.getTotalLength(),off:i*3600}});
 const T=14400,TRAV=9000;let on=true;
 new IntersectionObserver(es=>{on=es[0].isIntersecting;if(on)requestAnimationFrame(tick)}).observe(sec);
 const red=false;
 function tick(now){if(!on)return;
  F.forEach(f=>{const t=((now+f.off)%T);let k=Math.min(1,t/TRAV);k=1-Math.pow(1-k,2.2);
   if(red)k=1;const l=k*f.L,a=f.p.getPointAtLength(l),bp=f.p.getPointAtLength(Math.max(0,l-2));
   const ang=k>=1?-8:Math.atan2(a.y-bp.y,a.x-bp.x)*180/Math.PI;
   f.g.setAttribute('transform',`translate(${a.x} ${a.y}) rotate(${ang})`);
   f.g.querySelector('.wake').setAttribute('opacity',k>=1?0:.9);
   const fade=t<500?t/500:t>T-700?(T-t)/700:1;f.g.setAttribute('opacity',fade)});
  requestAnimationFrame(tick)}
 requestAnimationFrame(tick)}

/* značky */
const mks=G(world);
D.forEach(o=>{const [x,y]=o.m;const g=G(mks,{class:'am-mk','data-k':o.k});o.mk=g;o.mx=x;o.my=y;
  E('ellipse',{cx:0,cy:2,rx:9,ry:3.5,fill:'rgba(0,0,0,.35)'},g);
  const up=G(g,{class:'up'});o.up=up;
  E('circle',{class:'ring',cy:-38,r:24,fill:'none',stroke:o.c,'stroke-width':4,opacity:0},up);
  const c=G(up,{class:'mc'});
  E('path',{d:'M0 0 L-14 -21 A25 25 0 1 1 14 -21Z',fill:'#fff',filter:'url(#amSh)'},c);
  E('path',{d:'M0 -6 L-10.5 -22 A20 20 0 1 1 10.5 -22Z',fill:o.c},c);
  E('circle',{cx:-6,cy:-46,r:6,fill:'rgba(255,255,255,.22)'},c);
  E('g',{transform:'translate(-12 -50)',color:'#fff'},c,icon(o.k,24));
  const lb=G(up,{class:'mlb'});const tw=o.n.length*7.4+22;
  E('rect',{x:-tw/2,y:6,width:tw,height:22,rx:11,fill:'rgba(13,30,22,.9)'},lb);
  E('text',{x:0,y:21,'text-anchor':'middle','font-family':FONT,'font-size':12,'font-weight':800,fill:'#fff'},lb).textContent=o.n;
  o.pr=[[0,0],[20,0],[0,-20]].map(([px,py])=>E('rect',{x:px-1,y:py-1,width:2,height:2,fill:'none',opacity:0,'pointer-events':'none'},g))});

const list=document.getElementById('amList'),card=document.getElementById('amCard');
/* ===== kamera ===== */
const FULL={x:-600,y:20,w:3060,h:1160},LIM={x0:-1750,y0:-800,x1:3500,y1:2000};
let vb={...FULL},anim=null,cur=null;
const size=()=>{const r=stage.getBoundingClientRect();return{W:r.width||1,H:r.height||1}};
const mob=()=>innerWidth<=900;
function insets(sel){if(mob())return{l:12,r:12,t:70,b:sel&&!card.hidden?card.offsetHeight+30:20};
  return{l:sel?410:24,r:sec.classList.contains('collapsed')?80:400,t:40,b:24}}
function fit(box,sel){const {W,H}=size(),i=insets(sel),aw=Math.max(80,W-i.l-i.r),ah=Math.max(80,H-i.t-i.b);
  let s=Math.min(aw/box.w,ah/box.h);
  const sMin=Math.max(W/(LIM.x1-LIM.x0),H/(LIM.y1-LIM.y0));s=Math.max(s,sMin);{const bs=W/cover().w;s=Math.min(s,bs*2.4)}
  const cxp=i.l+aw/2,cyp=i.t+ah/2,cx=box.x+box.w/2,cy=box.y+box.h/2;
  return clamp({x:cx-cxp/s,y:cy-cyp/s,w:W/s,h:H/s})}
function cover(){const {W,H}=size(),i=insets(false);
  const B=mob()?{x:820,y:120,w:1000,h:780}:FULL;const aw=W-i.l-i.r,ah=H-i.t-i.b;const s=Math.min(aw/B.w,ah/B.h);
  return clamp({x:B.x+B.w/2-(i.l+aw/2)/s,y:B.y+B.h/2-(i.t+ah/2)/s,w:W/s,h:H/s})}
function clamp(b){const mw=LIM.x1-LIM.x0,mh=LIM.y1-LIM.y0,cx=b.x+b.w/2,cy=b.y+b.h/2;let k=Math.min(1,mw/b.w,mh/b.h);if(k<1){b.w*=k;b.h*=k;b.x=cx-b.w/2;b.y=cy-b.h/2}
  b.x=Math.min(Math.max(b.x,LIM.x0),LIM.x1-b.w);b.y=Math.min(Math.max(b.y,LIM.y0),LIM.y1-b.h);return b}
/* značky stojí rovně: náklon mapy (rotateX + perspektiva) se pro každou značku změří a vyruší */
function upright(){
  const R=D.map(o=>o.pr.map(e=>e.getBoundingClientRect()));
  D.forEach((o,i)=>{const [r0,rx,ry]=R[i];if(!(r0.width||r0.height))return;
    const c=r=>[r.left+r.width/2,r.top+r.height/2],p0=c(r0),px=c(rx),py=c(ry);
    const ax=(px[0]-p0[0])/20,ay=(px[1]-p0[1])/20,bx=(p0[0]-py[0])/20,by=(p0[1]-py[1])/20;
    const det=ax*by-bx*ay;if(!(Math.abs(det)>1e-6))return;
    const k=Math.hypot(ax,ay);
    o.up.setAttribute('transform',`matrix(${(k*by/det).toFixed(4)} ${(-k*ay/det).toFixed(4)} ${(-k*bx/det).toFixed(4)} ${(k*ax/det).toFixed(4)} 0 0)`)})}
function apply(b){vb=b;svg.setAttribute('viewBox',`${b.x} ${b.y} ${b.w} ${b.h}`);
  const {W}=size(),s=W/b.w,base=W/cover().w,k=Math.max(1.15,Math.min(2.8,Math.pow(base/s,.75)*2.5));
  D.forEach(o=>o.mk.setAttribute('transform',`translate(${o.mx} ${o.my}) scale(${k})`));upright();
  svg.classList.toggle('zoomed',s>base*1.6);
  const kd=Math.min(1.2,1.6/(s/base));DLS.forEach(t=>t.setAttribute('font-size',t.dataset.s*kd))}
{let vis=true,sig='';const io2=new IntersectionObserver(e=>{vis=e[0].isIntersecting},{threshold:0});io2.observe(sec);
 (function watch(){if(vis&&D[0]&&D[0].pr){const a=D[0].pr[0].getBoundingClientRect(),b=D[0].pr[1].getBoundingClientRect(),
   t=[a.left,a.top,b.left,b.top].map(v=>v.toFixed(1)).join();if(t!==sig){sig=t;upright()}}requestAnimationFrame(watch)})()}
const ez=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
function go(to,ms=900){cancelAnimationFrame(anim);const from={...vb},t0=performance.now();
  if(false)ms=1;
  const f=t=>{const p=Math.min(1,(t-t0)/ms),e=ez(p);apply({x:from.x+(to.x-from.x)*e,y:from.y+(to.y-from.y)*e,w:from.w+(to.w-from.w)*e,h:from.h+(to.h-from.h)*e});if(p<1)anim=requestAnimationFrame(f)};anim=requestAnimationFrame(f)}
function zoomBy(f,cx,cy){const {W}=size();cx??=vb.x+vb.w/2;cy??=vb.y+vb.h/2;const w=vb.w/f,h=vb.h/f;
  const minW=W/6;if(w<minW&&f>1)return;go(clamp({x:cx-(cx-vb.x)/f,y:cy-(cy-vb.y)/f,w,h}),400)}

/* ===== UI ===== */
const GRPS=[['Ubytování',['chatky','podsad','teepee','stany']],['Na vodě',['lode','kotva','pujcovna']],['Služby',['recepce','kiosek','wc','parking','hriste']]];
const PR={chatky:KKC.t('chatka','od'),podsad:KKC.t('podsad','od'),teepee:KKC.t('teepee','od'),stany:KKC.t('stan','od')};
list.replaceChildren();GRPS.forEach(([t,ks])=>{const h=document.createElement('div');h.className='am-grp';h.textContent=t;list.append(h);
  ks.forEach(k=>{const o=Z[k];const b=document.createElement('button');b.type='button';b.className='am-f';b.style.setProperty('--c',o.c);
    b.innerHTML=`<span class="n">${icon(o.k,16)}</span>${o.n}${PR[k]?`<span class="pr">${PR[k]}</span>`:''}`;b.addEventListener('click',()=>select(cur===o?null:o));list.append(b);o.btn=b})});
D.forEach(o=>{
  [o.g,o.mk].forEach(el=>{el.addEventListener('click',e=>{if(moved)return;e.stopPropagation();select(o)})})});
const PH={stany:'img/stan.webp',podsad:'img/podsadovy.webp',teepee:'img/teepee.webp',chatky:'img/chatky_nova.webp',kiosek:'img/posezeni_u_vody.webp'},BDG={teepee:'Zážitek pro rodiny'};
function render(o){if(!o){card.hidden=true;return}
  const i=D.indexOf(o),prev=D[(i+D.length-1)%D.length],next=D[(i+1)%D.length];
  card.hidden=false;card.style.setProperty('--c',o.c);card.style.animation='none';void card.offsetWidth;card.style.animation='';
  card.classList.toggle('hasph',!!PH[o.k]);
  const chips=o.li.every(x=>x.length<=34),ar=d=>`<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`;
  const un=o.price?o.unit.split(' · ').map(u=>`<small>${u}</small>`).join(''):'';
  card.innerHTML=`<button type="button" class="am-x" aria-label="Zavřít"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
   ${PH[o.k]?`<div class="ph" style="background-image:url(${PH[o.k]})">${BDG[o.k]?`<span class="bdg">${BDG[o.k]}</span>`:''}</div>`:''}
   <div class="bd"><div class="t"><i>${icon(o.k,24)}</i><h3>${o.n}</h3></div><p>${o.d}</p>
   <ul class="${chips?'chips':''}">${o.li.map(t=>`<li>${t}</li>`).join('')}</ul>
   ${o.price?`<div class="row2"><div class="pb"><span class="price">${o.price}</span>${un}</div><a href="#rezervace" class="btn btn-sun">Poptat pobyt</a></div>`:''}
   <div class="am-nav"><button type="button" data-d="-1">${ar('M15 6l-6 6 6 6')}<span>${prev.n}</span></button><button type="button" data-d="1"><span>${next.n}</span>${ar('M9 6l6 6-6 6')}</button></div></div>`;
  card.querySelector('.am-x').onclick=()=>select(null);
  card.querySelectorAll('.am-nav button').forEach(b=>b.onclick=()=>select(+b.dataset.d<0?prev:next))}
function select(o){cur=o;sec.classList.toggle('focus',!!o);
  D.forEach(x=>{const m=x===o;x.g.classList.toggle('on',m);x.mk.classList.toggle('on',m);x.btn.classList.toggle('on',m);x.btn.setAttribute('aria-pressed',m)});
  render(o);
  if(o){mks.append(o.mk);const bb=o.f,pad=60;
    go(fit({x:bb.x-pad,y:bb.y-pad-50,w:bb.w+pad*2,h:bb.h+pad*2+50},true));
    if(list.scrollWidth>list.clientWidth+4)list.scrollTo({left:o.btn.offsetLeft-12,behavior:'smooth'})}
  else go(cover())}
document.getElementById('amIn').onclick=()=>zoomBy(1.5);
document.getElementById('amOut').onclick=()=>zoomBy(1/1.5);
document.getElementById('amAll').onclick=()=>select(null);
addEventListener('keydown',e=>{if(e.key==='Escape'&&cur)select(null)});

let down=null,moved=false;const ptrs=new Map();
stage.addEventListener('pointerdown',e=>{ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});down={x:e.clientX,y:e.clientY,vb:{...vb}};moved=false;cancelAnimationFrame(anim)});
addEventListener('pointermove',e=>{if(!down||!ptrs.has(e.pointerId))return;const prev=ptrs.get(e.pointerId);ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});
  const {W}=size(),s=W/vb.w;
  if(ptrs.size===2){const [a,b]=[...ptrs.values()];const d1=Math.hypot(a.x-b.x,a.y-b.y);const pa=[...ptrs.entries()].find(([k])=>k!==e.pointerId)[1];const d0=Math.hypot(pa.x-prev.x,pa.y-prev.y);
    if(d0>0){const f=d1/d0,r=stage.getBoundingClientRect(),mx=vb.x+((a.x+b.x)/2-r.left)/s,my=vb.y+((a.y+b.y)/2-r.top)/s,w=vb.w/f,h=vb.h/f;if(w>W/6)apply(clamp({x:mx-(mx-vb.x)/f,y:my-(my-vb.y)/f,w,h}))}moved=true;return}
  const dx=e.clientX-down.x,dy=e.clientY-down.y;if(Math.abs(dx)+Math.abs(dy)>5){moved=true;stage.classList.add('drag')}
  if(moved)apply(clamp({...down.vb,x:down.vb.x-dx/s,y:down.vb.y-dy/s}))});
const up=e=>{ptrs.delete(e.pointerId);if(ptrs.size===0){down=null;stage.classList.remove('drag');setTimeout(()=>moved=false,0)}else{const [p]=ptrs.values();down={x:p.x,y:p.y,vb:{...vb}}}};
addEventListener('pointerup',up);addEventListener('pointercancel',up);
stage.addEventListener('click',e=>{if(!moved&&cur&&!e.target.closest('.am-zone,.am-mk'))select(null)});
stage.addEventListener('dblclick',e=>{const r=stage.getBoundingClientRect(),s=size().W/vb.w;zoomBy(1.6,vb.x+(e.clientX-r.left)/s,vb.y+(e.clientY-r.top)/s)});

const panel=document.getElementById('amPanel'),tog=document.getElementById('amTog'),opn=document.getElementById('amOpen');
const legH=()=>sec.style.setProperty('--legH',mob()&&!sec.classList.contains('collapsed')?(panel.offsetHeight+10)+'px':'0px');
function setCol(v){sec.classList.toggle('collapsed',v);opn.hidden=!v;tog.setAttribute('aria-expanded',!v);legH();if(cur)select(cur);else go(cover(),500)}
tog.onclick=()=>setCol(true);opn.onclick=()=>setCol(false);
legH();
/* ===== ŽIVÁ SCÉNA: raft připluje ke kotvišti, lidé ho vynesou na břeh a donesou do půjčovny k boudě ===== */
{const act=G(S2,{'pointer-events':'none'});
 const ln=(a,b,k)=>a+(b-a)*k,eo=k=>1-Math.pow(1-k,3),ei=k=>k*k*(3-2*k),cl=k=>Math.max(0,Math.min(1,k));
 const path=(P,k)=>{const n=P.length-1,f=Math.min(n-.0001,Math.max(0,k*n)),i=Math.floor(f),u=f-i;return [ln(P[i][0],P[i+1][0],u),ln(P[i][1],P[i+1][1],u)]};
 const place=(g,x,y,r,sx,sy)=>g.setAttribute('transform',`translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${r}) scale(${sx} ${sy})`);
 const PC=['#3a8fb7','#d64545','#4b8a5a','#f4f4f4'],PO=[[-4.5,-1.6],[-1.5,1.6],[1.5,-1.6],[4.5,1.6]].map(p=>[p[0]*1.7,p[1]*1.7]),SIDE=[[-9,-10],[9,-10],[-9,10],[9,10]];
 const rg=G(act,{});raft(rg,0,0,'#e8b23a',0);
 const wk=PC.map(c=>E('circle',{r:3,fill:c,stroke:'rgba(0,0,0,.4)','stroke-width':.5},act));
 rg.style.display='none';wk.forEach(d=>d.style.display='none');
 /* dodávka u silnice: raft + lodička z půjčovny na střechu, lidé nastoupí a dodávka odjede */
 const vo=G(act,{filter:'url(#amSh)'}),vi=G(vo,{});
 E('rect',{x:-13,y:-5.5,width:26,height:11,rx:2.5,fill:'#f2c230',stroke:'rgba(0,0,0,.3)','stroke-width':.6},vi);
 E('rect',{x:6,y:-5.5,width:7,height:11,rx:2.5,fill:'#e0ae1f'},vi);
 E('rect',{x:8.2,y:-4,width:3.6,height:8,rx:1,fill:'rgba(30,50,60,.6)'},vi);
 [[-8,-6.2],[-8,6.2],[7,-6.2],[7,6.2]].forEach(w=>E('rect',{x:w[0]-2,y:w[1]-.9,width:4,height:1.8,rx:.8,fill:'#2a2a2a'},vi));
 vo.style.display='none';
 const rg2=G(act,{});raft(rg2,0,0,'#3a8fb7',0);const bg2=G(act,{});boat(bg2,0,0,0,'#d64545',9);
 const W2=['#3a8fb7','#d64545','#4b8a5a','#f4f4f4','#8e5bb5','#e07b2e'].map(c=>E('circle',{r:3,fill:c,stroke:'rgba(0,0,0,.4)','stroke-width':.5},act));
 [rg2,bg2].forEach(g=>g.style.display='none');W2.forEach(d=>d.style.display='none');
 const P0=[172,526],OUT=[[172,526],[150,531],[125,545],[95,556],[40,558],[-40,558],[-110,562]],INV=OUT.slice().reverse();
 const CR=[[216,464],[192,474],[184,488],[184,500]],CB=[[206,462],[182,474],[173,488],[170,500]];
 const BO=[[-12,-5],[12,5]],R2=Math.PI/180;
 const ang=(P,k)=>{const a=path(P,cl(k)),b=path(P,cl(k)+.01);let d=Math.atan2(b[1]-a[1],b[0]-a[0])/R2;return d};
 const loc=(vx,vy,h,lx,ly)=>{lx*=1.6;ly*=1.6;return [vx+lx*Math.cos(h*R2)-ly*Math.sin(h*R2),vy+lx*Math.sin(h*R2)+ly*Math.cos(h*R2)]};
 const IN=[[-70,672],[100,612],[257,564]],CARRY=[[257,564],[274,545],[274,508],[258,482],[228,472],[198,464]],ROT=-17,RC=-117;
 let c=0,last=null,vis=true;
 new IntersectionObserver(e=>{vis=e[0].isIntersecting}).observe(sec);
 (function tick(t){requestAnimationFrame(tick);if(last===null)last=t;const dt=Math.min(100,t-last);last=t;if(!vis)return;
  if(sec.classList.contains('am-pre')){c=-800;return}
  c=(c+dt)%24000;if(c<0)return;const s=c/1000;let x,y,r=ROT,op=1,show=true,lift=0;
  if(s<6){const k=eo(s/6),p=path(IN,k);x=p[0];y=p[1]+Math.sin(s*2)*.5;r=ROT+(1-k)*6;op=cl(s/.8)}
  else if(s<6.6){x=IN[2][0];y=IN[2][1]+Math.sin(s*2)*.4}
  else if(s<14.6){const k=ei((s-6.6)/8),p=path(CARRY,k);x=p[0];y=p[1];lift=cl((s-6.6)/.6);r=ln(ROT,RC,ei(cl((s-6.6)/1.5)));if(s>=13.6)op=Math.max(0,1-(s-13.6))}
  else show=false;
  rg.style.display=show?'':'none';rg.style.opacity=op;if(show)place(rg,x,y,r,1.7,1.7);
  const cr=Math.cos(r*Math.PI/180),sr=Math.sin(r*Math.PI/180);
  wk.forEach((d,i)=>{d.style.display=show?'':'none';d.style.opacity=op;if(!show)return;
   const ox=ln(PO[i][0],SIDE[i][0],ei(lift)),oy=ln(PO[i][1],SIDE[i][1],ei(lift));
   d.setAttribute('cx',(x+ox*cr-oy*sr).toFixed(2));d.setAttribute('cy',(y+ox*sr+oy*cr).toFixed(2))});
  /* --- dodávka --- */
  {const s=c/1000+13;
  let vx=P0[0],vy=P0[1],vh=0,vs=true;
  if(s>=24.8&&s<26){vh=-180*ei((s-24.8)/1.2)}
  else if(s>=26&&s<30.5){const k=ei((s-26)/4.5),p=path(OUT,k);vx=p[0];vy=p[1];let a=ang(OUT,k);if(a>0)a-=360;vh=ln(-180,a,cl(k/.25))}
  else if(s>=30.5&&s<32.8)vs=false;
  else if(s>=32.8){const k=eo((s-32.8)/3.5),p=path(INV,k);vx=p[0];vy=p[1];vh=ln(ang(INV,k),0,cl((k-.7)/.3))}
  vo.style.display=vs?'':'none';vo.style.opacity=s>=32.8?cl((s-32.8)/.8):1;
  vo.setAttribute('transform',`translate(${vx.toFixed(2)} ${vy.toFixed(2)})`);vi.setAttribute('transform',`rotate(${vh.toFixed(2)}) scale(1.6)`);
  /* raft + lodička + lidé */
  const on=s>=16.5&&s<30.5;
  [rg2,bg2].forEach(g=>g.style.display=on?'':'none');
  if(!on){W2.forEach(d=>d.style.display='none');return}
  const fi=cl((s-16.5)/.6);
  const prog=(lag)=>ei(cl((s-17-lag)/4.5)),lod=(lag)=>ei(cl((s-21.5-lag)/1));
  const door=loc(vx,vy,vh,2,0),pos=[];
  const one=(g,P,lag,rl,sc0,sc1,lx,ly)=>{
   const k=prog(lag),p=path(P,k),u=lod(lag),r0=RC,roof=loc(vx,vy,vh,lx,ly);
   let X=ln(p[0],roof[0],u),Y=ln(p[1],roof[1],u),R=ln(r0,vh,u),Sc=ln(sc0,sc1,u);
   if(u>=1){X=roof[0];Y=roof[1];R=vh;Sc=sc1}
   place(g,X,Y,R,Sc,Sc);g.style.opacity=fi;return {x:p[0],y:p[1],u}};
  const a=one(rg2,CR,0,0,1.7,1.45,-5,0),b=one(bg2,CB,.4,0,1.7,1.35,6,0);
  const cr2=Math.cos(RC*R2),sr2=Math.sin(RC*R2),bd=cl((s-23.2)/1);
  W2.forEach((d,i)=>{
   const raftW=i<4,it=raftW?a:b,o=raftW?SIDE[i]:BO[i-4];
   const px=it.x+o[0]*cr2-o[1]*sr2,py=it.y+o[0]*sr2+o[1]*cr2;
   const k=ei(bd),X=ln(px,door[0],k),Y=ln(py,door[1],k);
   d.style.display=bd>=1?'none':'';d.style.opacity=fi*(1-bd);
   d.setAttribute('cx',X.toFixed(2));d.setAttribute('cy',Y.toFixed(2))})}
 })(performance.now())}
/* zapečení statického pozadí mapy do jednoho vektorového obrázku – plynulejší animace */
{const bake=async()=>{try{const bg=svg.querySelector('.am-bg');if(!bg||bg.dataset.baked)return;const bb=bg.getBBox(),df=svg.querySelector('defs').cloneNode(true);
 const toData=async u=>{const b=await (await fetch(u)).blob();return await new Promise(r=>{const f=new FileReader();f.onload=()=>r(f.result);f.readAsDataURL(b)})};
 for(const im of df.querySelectorAll('image')){const h=im.getAttribute('href');if(h&&!h.startsWith('data:'))im.setAttribute('href',await toData(h))}
 const X=new XMLSerializer(),str=`<svg xmlns="${NS}" viewBox="${bb.x} ${bb.y} ${bb.width} ${bb.height}" width="${bb.width}" height="${bb.height}">${X.serializeToString(df)}${[...bg.childNodes].map(n=>X.serializeToString(n)).join('')}</svg>`;
 const url=URL.createObjectURL(new Blob([str],{type:'image/svg+xml'}));await new Promise((ok,no)=>{const I=new Image();I.onload=ok;I.onerror=no;I.src=url});
 const im=document.createElementNS(NS,'image');for(const[k,v]of Object.entries({href:url,x:bb.x,y:bb.y,width:bb.width,height:bb.height,preserveAspectRatio:'none'}))im.setAttribute(k,v);bg.replaceChildren(im);bg.dataset.baked=1}catch(e){}};
 const go=()=>('requestIdleCallback'in window?requestIdleCallback(bake,{timeout:3000}):setTimeout(bake,800));
 if(document.readyState==='complete')go();else addEventListener('load',go)}
apply(cover());
window.__am={Z:Z,icon:icon,select:select};
let rt;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>{legH();if(cur)select(cur);else apply(cover())},120)});
})();
