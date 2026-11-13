/* Kemp Krumlov – Ubytování a výpočty: karty ubytování, rezervace s kalkulačkou, doprava osob.
   Spojeno z: ubytovani.js, rezervace.js, ubytovani-cenik.js, doprava.js, ubytovani-panely.js */

/* ===== ubytovani.js ===== */
(function(){
var sec=document.getElementById('ubytovani');if(!sec)return;
var cards=sec.querySelectorAll('.ub-card');
if('IntersectionObserver' in window){
 sec.classList.add('ub-js');
 var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target)}})},{threshold:.15});
 cards.forEach(function(c){io.observe(c)});
}
/* "Spočítat cenu" na kartě rovnou předvybere typ v kalkulačce */
sec.querySelectorAll('.ub-cta[data-kc]').forEach(function(a){
 a.addEventListener('click',function(){
  var name=a.getAttribute('data-kc');
  document.querySelectorAll('#kcTypes .kc-t').forEach(function(b){
   var t=b.querySelector('b');if(t&&t.textContent.trim()===name)b.click();
  });
 });
});
})();
;

/* ===== rezervace.js ===== */
(()=>{
const root=document.getElementById('rezervace');if(!root)return;
const form=document.getElementById('rzForm');
const $=id=>document.getElementById(id);
const SV=p=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const ICO={
 stan:'<path d="M3 20 12 6l9 14zM12 6v14"/>',karavan:'<rect x="2" y="7" width="15" height="10" rx="2"/><path d="M17 11h3l2 3v3h-5"/><circle cx="6" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>',
 chatka:'<path d="M3 11 12 4l9 7M5 10v10h14V10M10 20v-5h4v5"/>',teepee:'<path d="M12 3 5 21h14zM10 3l2 3 2-3M10 21l2-5 2 5"/>',
 podsad:'<path d="M3 19 12 6l9 13M2 21h20M9 19l3-5 3 5"/>',
 dosp:'<circle cx="12" cy="7" r="4"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/>',dite:'<circle cx="12" cy="9" r="3"/><path d="M7 21v-2a5 5 0 0 1 10 0v2"/>',
 zak:'<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>',
 auto:'<path d="M5 17h14v-5l-2-5H7l-2 5zM5 12h14"/><circle cx="8" cy="17" r="2"/><circle cx="16" cy="17" r="2"/>',
 moto:'<circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><path d="M6 17l4-7h4l4 7M14 10l-2-3h-2"/>',
 elek:'<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',pes:'<circle cx="5" cy="9" r="1.6"/><circle cx="9.5" cy="5.5" r="1.6"/><circle cx="14.5" cy="5.5" r="1.6"/><circle cx="19" cy="9" r="1.6"/><path d="M12 11c-3 0-6 4-6 7 0 2 2 2.5 3 2l3-1 3 1c1 .5 3 0 3-2 0-3-3-7-6-7z"/>'
};
/* ceník [sezóna (červen–srpen), mimo sezónu] – stejný jako dosud */
/* ceny z ceníku (js/cenik.js) – [sezóna, mimo sezónu] */
const KC=window.KKC;const P={};KC.data.polozky.forEach(p=>{P[p.k]=[KC.v(p.k,'a'),KC.v(p.k,'b')]});
const prOd=k=>{const a=KC.v(k,'a'),b=KC.v(k,'b');return (a!==b?'od ':'')+'<strong>'+KC.fmt(Math.min(a,b))+' Kč</strong>'};
const BT=[
 {k:'stan',n:'Vlastní stan',c:'#4f9a58',bd:'Dostatek míst',bc:'gr',pr:'od <strong>190 Kč</strong>',s:'místo na louce u řeky',img:'img/stan-640.webp',per:'za místo',bed:'vlastní spaní'},
 {k:'karavan',n:'Karavan',c:'#55606b',bd:'Volejte předem',bc:'call',pr:'od <strong>300 Kč</strong>',s:'místo s elektřinou',img:'img/karavan-640.webp',per:'za místo',bed:'vlastní spaní'},
 {k:'chatka',n:'Chatka',c:'#b6513e',bd:'Omezená kapacita',pr:'od <strong>890 Kč</strong>',s:'lůžkoviny, terasa',cap:7,img:'img/chatka_nova-640.webp',per:'za noc',bed:'7 lůžek'},
 {k:'teepee',n:'Teepee',c:'#d58a2c',bd:'Omezená kapacita',pr:'od <strong>700 Kč</strong>',s:'zážitek pro rodiny s dětmi',cap:4,img:'img/teepee-640.webp',per:'za noc',bed:'4 lůžka'},
 {k:'podsad',n:'Podsadový stan',c:'#2a7c86',bd:'Omezená kapacita',pr:'<strong>300 Kč</strong>',s:'už postavený, stačí přijet',cap:2,img:'img/podsadovy-640.webp',per:'za noc',bed:'2 lůžka'}];
const TYPES=KC.kat('ubytovani').filter(p=>p.rez!==0&&p.skryt!==1).map(p=>{const b=BT.find(x=>x.k===p.k)||{k:p.k,n:p.n,c:'#6b766f',bd:p.luzka?'Omezená kapacita':'',s:p.pozn||'',img:'img/kemp_reprezentativni-640.webp',per:'za noc'};
 return Object.assign({},b,{pr:prOd(p.k),cap:p.luzka||undefined,bed:p.luzka?p.luzka+' '+(p.luzka<5?'lůžka':'lůžek'):(b.bed||'vlastní spaní'),s:b.k===p.k&&BT.some(x=>x.k===p.k)?b.s:(p.pozn||'')})});
const UNIT0={stan:['Počet stanů','stan','stany','stanů'],karavan:['Počet karavanů','karavan','karavany','karavanů'],chatka:['Počet chatek','chatka','chatky','chatek'],teepee:['Počet teepee','teepee','teepee','teepee'],podsad:['Počet podsadových stanů','podsadový stan','podsadové stany','podsadových stanů']};
const UNIT=Object.assign({},UNIT0);TYPES.forEach(t=>{if(!UNIT[t.k]){const n=KL.male(KL.t(t.n));UNIT[t.k]=['Počet',n,n,n]}});
const EXTRAS=KC.kat('doplnky').filter(p=>p.rez!==0&&p.skryt!==1).map(p=>({k:p.k,n:p.n,s:KC.t(p.k,'a')+(p.pozn?' / '+p.pozn.replace(/^za /,''):' / noc')}));
EXTRAS.forEach(x=>{if(!ICO[x.k])ICO[x.k]='<path d="M12 5v14M5 12h14"/>'});
const PEOPLE=[{k:'dosp',n:'Dospělí',s:'od 15 let',min:1},{k:'dite',n:'Děti',s:'do 15 let',min:0},{k:'zak',n:'Žáci a studenti',s:'zvýhodněně jen ve vlastním stanu',min:0}].filter(x=>x.k==='dosp'||!(KC.p(x.k)||{}).skryt);
/* vlastní typy osob z ceníku (např. senior, ZTP) */
const OS_VLASTNI=KC.kat('osoby').filter(p=>!['os','dite','zak'].includes(p.k)&&p.skryt!==1);
OS_VLASTNI.forEach(p=>{PEOPLE.push({k:p.k,n:p.n,s:p.pozn||'',min:0,vl:1});if(!ICO[p.k])ICO[p.k]=ICO.dosp});
const S={type:(TYPES[0]||{}).k,q:{},c:{},dosp:1,dite:0,zak:0,units:1,from:null,to:null};OS_VLASTNI.forEach(p=>S[p.k]=0);TYPES.forEach(t=>S.q[t.k]=0);EXTRAS.forEach(x=>S[x.k]=0);
const fmt=n=>Math.round(n).toLocaleString('cs-CZ')+'\u00a0Kč';
const KL=window.KKL||{jazyk:'cs',t:x=>x,pl:(n,a,b,c)=>n===1?a:n>=2&&n<=4?b:c,male:x=>x.toLowerCase(),loc:'cs-CZ'};
const plural=(n,a,b,c)=>KL.pl(n,a,b,c);
const T=()=>TYPES.find(t=>t.k===S.type);
const persons=()=>S.dosp+S.dite+S.zak+OS_VLASTNI.reduce((a,p)=>a+(S[p.k]||0),0);
const minUnits=()=>{const t=T();return t.cap?Math.max(1,Math.ceil(persons()/t.cap)):1};
const fitUnits=()=>{};
const SEL=()=>TYPES.filter(t=>S.q[t.k]>0);
const ownBed=()=>S.q.stan>0||S.q.karavan>0;
const beds=()=>TYPES.reduce((a,t)=>a+(t.cap?t.cap*S.q[t.k]:0),0);
const bedsOk=()=>ownBed()||beds()>=persons();
const onlyStan=()=>S.q.stan>0&&SEL().length===1;
const pop=el=>{el.classList.remove('pop');void el.offsetWidth;el.classList.add('pop')};

/* ---------- datumy ---------- */
const D=(y,m,d)=>new Date(y,m,d,12);
const addD=(d,n)=>D(d.getFullYear(),d.getMonth(),d.getDate()+n);
const same=(a,b)=>a&&b&&a.getTime()===b.getTime();
const iso=d=>d?`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`:'';
const now=new Date(),TODAY=D(now.getFullYear(),now.getMonth(),now.getDate());
const SZ=KC.data.sezona,md=(s)=>s.split('-').map(Number),[OM,OD]=md(SZ.otevrenoOd),[CM,CD]=md(SZ.otevrenoDo);
const CELOROK=KC.celorocne;
const openNight=d=>{if(CELOROK)return true;const v=(d.getMonth()+1)*100+d.getDate();return v>=OM*100+OD&&v<CM*100+CD};   // poslední noc je den před koncem sezóny
const endOf=y=>CELOROK?D(y+1,0,31):D(y,CM-1,CD);
const isHi=d=>KC.hlavni(d.getMonth());
/* OBSAZENOST: sem se napojí rezervační systém. Formát: {chatka:['2027-07-18',…], teepee:[…]} = obsazené noci */
const BUSY=window.RZ_OBSAZENO||{};
const isBusyK=(k,d)=>(BUSY[k]||[]).includes(iso(d));
/* KONKRÉTNÍ MÍSTA: chatky a podsadové stany mají čísla, host si vybere které. Obsazenost jednoho místa: RZ_OBSAZENO['chatka-4']=[noci]
   Rozložení (skupiny podle polohy v kempu) jde přepsat v ceníku: KKC.data.mista={chatka:[['Název skupiny',od,do,'sloupec'],…]} – skupiny se stejným sloupcem jsou pod sebou */
const MISTA=Object.assign({chatka:[['Vlevo – řada 1–10',1,10,'vlevo'],['Vpravo – horní řada',11,15,'vpravo'],['Vpravo – dolní řada',16,20,'vpravo']],podsad:[['Řada 1–11',1,11]]},KC.data.mista||{});
const CNT={};Object.keys(MISTA).forEach(k=>{CNT[k]=MISTA[k].reduce((a,g)=>Math.max(a,g[2]),0);S.c[k]=[]});
const MAXQ=Object.assign({teepee:1},CNT);
const isBusyU=(k,n,d)=>isBusyK(k,d)||(BUSY[k+'-'+n]||[]).includes(iso(d));
const freeU=(k,n)=>{if(!S.from||!S.to)return true;for(let d=S.from;d<S.to;d=addD(d,1))if(isBusyU(k,n,d))return false;return true};
const isBusy=d=>SEL().some(t=>MISTA[t.k]?S.c[t.k].some(n=>isBusyU(t.k,n,d)):isBusyK(t.k,d));
const freeK=k=>{if(MISTA[k]){for(let n=1;n<=CNT[k];n++)if(freeU(k,n))return true;return false}if(!S.from||!S.to)return true;for(let d=S.from;d<S.to;d=addD(d,1))if(isBusyK(k,d))return false;return true};
const cis=k=>MISTA[k]&&S.c[k].length?' ('+KL.t('č.')+' '+S.c[k].join(', ')+')':'';
function setCount(k,v){const c=S.c[k];while(c.length>v)c.pop();for(let n=1;c.length<v&&n<=CNT[k];n++)if(!c.includes(n)&&freeU(k,n))c.push(n);c.sort((a,b)=>a-b);S.q[k]=c.length;return c.length>=v}
const rangeFree=(a,b)=>{for(let d=a;d<b;d=addD(d,1))if(isBusy(d))return false;return true};
const canArrive=d=>d>=TODAY&&openNight(d)&&!isBusy(d);
const canDepart=d=>!!S.from&&d>S.from&&d<=endOf(S.from.getFullYear())&&rangeFree(S.from,d);
const WD=KL.den?[0,1,2,3,4,5,6].map(i=>KL.den(i)):['ne','po','út','st','čt','pá','so'],MN=KL.mesic?[0,1,2,3,4,5,6,7,8,9,10,11].map(i=>KL.mesic(i)):['leden','únor','březen','duben','květen','červen','červenec','srpen','září','říjen','listopad','prosinec'];
const fD=d=>KL.datum?KL.datum(d):d?`${WD[d.getDay()]} ${d.getDate()}. ${d.getMonth()+1}.`:'–';
const fDY=d=>d?`${d.getDate()}. ${d.getMonth()+1}. ${d.getFullYear()}`:'–';
let START;(()=>{const y=TODAY.getFullYear();let a;
 if(TODAY<D(y,OM-1,OD))a=D(y,SZ.hlavniOd,10);else if(TODAY>=addD(endOf(y),-3))a=D(y+1,SZ.hlavniOd,10);else a=addD(TODAY,7);
 START=a})();
const nightsList=()=>{const out=[];if(!S.from||!S.to)return out;for(let d=S.from;d<S.to&&out.length<120;d=addD(d,1))out.push(d);return out};

/* ---------- kalendář ---------- */
const cal=$('rzCal');let view=D(START.getFullYear(),START.getMonth(),1),hover=null;
const minView=D(TODAY.getFullYear(),TODAY.getMonth(),1);
function month(m){const y=m.getFullYear(),mo=m.getMonth(),first=D(y,mo,1),len=new Date(y,mo+1,0).getDate(),off=(first.getDay()+6)%7;
 let h=`<div class="rz-m"><h3 class="rz-mh">${MN[mo]} ${y}</h3><div class="rz-wd">${[1,2,3,4,5,6,0].map(i=>`<span>${WD[i]}</span>`).join('')}</div><div class="rz-days">`;
 for(let i=0;i<off;i++)h+='<i></i>';
 for(let d=1;d<=len;d++){const x=D(y,mo,d);h+=`<button type="button" class="rz-d" data-d="${iso(x)}"><span>${d}</span></button>`}
 return h+'</div></div>'}
function drawCal(){cal.innerHTML=`<button type="button" class="rz-calnav p" aria-label="${KL.t('Předchozí měsíc')}"><svg class="chv" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5 9 12l6 7"/></svg></button><button type="button" class="rz-calnav n" aria-label="${KL.t('Další měsíc')}"><svg class="chv" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 5 6 7-6 7"/></svg></button>`+month(view)+month(D(view.getFullYear(),view.getMonth()+1,1));
 cal.querySelector('.p').disabled=view<=minView;paintCal()}
function paintCal(){const pending=S.from&&!S.to;
 cal.querySelectorAll('.rz-d').forEach(b=>{const [y,m,d]=b.dataset.d.split('-').map(Number),x=D(y,m-1,d);
  const ok=pending?(canDepart(x)||canArrive(x)):canArrive(x);
  b.disabled=!ok;b.classList.toggle('closed',!openNight(x)&&!(pending&&canDepart(x)));
  b.classList.toggle('hi',isHi(x));b.classList.toggle('busy',openNight(x)&&isBusy(x));b.classList.toggle('today',same(x,TODAY));
  b.classList.toggle('from',same(x,S.from));b.classList.toggle('to',same(x,S.to));
  b.classList.toggle('in',!!(S.from&&S.to&&x>S.from&&x<S.to));
  b.classList.toggle('pv',!!(pending&&hover&&canDepart(hover)&&x>S.from&&x<=hover));
  b.setAttribute('aria-pressed',String(!!(same(x,S.from)||same(x,S.to))));
  b.setAttribute('aria-label',(KL.jazyk==='cs'?`${WD[x.getDay()]} ${d}. ${m}. ${y}`:x.toLocaleDateString(KL.loc,{weekday:'long',day:'numeric',month:'long',year:'numeric'}))+(!openNight(x)?' – '+KL.t('zavřeno'):''))})}
cal.addEventListener('click',e=>{
 const nav=e.target.closest('.rz-calnav');
 if(nav){view=D(view.getFullYear(),view.getMonth()+(nav.classList.contains('n')?1:-1),1);if(view<minView)view=minView;drawCal();return}
 const b=e.target.closest('.rz-d');if(!b||b.disabled)return;
 const [y,m,d]=b.dataset.d.split('-').map(Number),x=D(y,m-1,d);
 if(S.from&&!S.to&&canDepart(x))S.to=x;else{S.from=x;S.to=null}
 hover=null;render()});
cal.addEventListener('mouseover',e=>{const b=e.target.closest('.rz-d');if(!b||!(S.from&&!S.to))return;const [y,m,d]=b.dataset.d.split('-').map(Number);hover=D(y,m-1,d);paintCal()});
cal.addEventListener('mouseleave',()=>{if(hover){hover=null;paintCal()}});
$('rzQuick').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(!S.from){warn(KL.t('Nejdřív klikněte v kalendáři na den příjezdu.'));return}const t=addD(S.from,+b.dataset.n);
 const lim=endOf(S.from.getFullYear()),tt=t>lim?lim:t;if(!rangeFree(S.from,tt)){warn(KL.t('V tomto rozsahu je některá noc obsazená.'));return}S.to=tt;render();
 if(t>lim)warn(KL.t('Kemp zavírá 1. 10., odjezd jsme posunuli na poslední možný den.'))});

/* ---------- osoby ---------- */
function stepper(get,set,min,max){const w=document.createElement('div');w.className='rz-st';
 w.innerHTML='<button type="button" aria-label="'+KL.t('Méně')+'"><i class="sg sg-m" aria-hidden="true"></i></button><output>0</output><button type="button" aria-label="'+KL.t('Více')+'"><i class="sg sg-p" aria-hidden="true"></i></button>';
 const [m,o,p]=w.children;
 m.addEventListener('click',e=>{e.stopPropagation();set(Math.max(min(),get()-1));render();pop(o)});
 p.addEventListener('click',e=>{e.stopPropagation();set(Math.min(max,get()+1));render();pop(o)});
 w.upd=()=>{o.textContent=get();m.disabled=get()<=min();p.disabled=get()>=max};return w}
PEOPLE.forEach(r=>{const c=document.createElement('div');c.className='rz-pc';
 c.innerHTML=`<span class="ic">${SV(ICO[r.k])}</span><span class="tx"><b>${r.n}</b><small>${r.s}</small></span>`;
 r.st=stepper(()=>S[r.k],v=>{S[r.k]=v;fitUnits()},()=>r.min,30);c.append(r.st);r.el=c;$('rzPeople').append(c)});

/* ---------- ubytování ---------- */
TYPES.forEach(t=>{const b=document.createElement('div');b.className='rz-row';b.style.setProperty('--c',t.c);
 b.innerHTML=`<span class="ph" style="background-image:url(${t.img})"><i class="n"></i></span><span class="tx"><b>${t.n}</b><small>${t.s}</small><span class="tg"><em>${t.bed}</em><em class="bd ${t.bc||''}">${t.bd}</em></span></span><span class="rt"><span class="pr">${t.per}<strong>${t.pr.replace(/<\/?strong>/g,'')}</strong></span></span>`;
 const st=stepper(()=>S.q[t.k],v=>{if(v>S.q[t.k]&&!freeK(t.k)){warn(KL.t(t.n)+' '+KL.t('je ve vybraném termínu obsazená, zkuste jiné ubytování.'));return}if(MISTA[t.k]){if(!setCount(t.k,v))warn(KL.t('Více volných míst tohoto typu ve vašem termínu nemáme.'));t.open=true}else S.q[t.k]=v;if(t.k==='karavan'&&v&&('elek' in S)&&!S.elek)S.elek=1},()=>0,MAXQ[t.k]||20);b.querySelector('.rt').append(st);t.st=st;
 $('rzTypes').append(b);t.el=b});
/* výběr konkrétního čísla chatky / stanu */
TYPES.forEach(t=>{if(!MISTA[t.k])return;const b=t.el,ch=t.k==='chatka';b.classList.add('has-pick');
 const tg=document.createElement('button');tg.type='button';tg.className='rz-pick-t';tg.setAttribute('aria-expanded','false');b.querySelector('.tx').append(tg);t.tg=tg;
 const p=document.createElement('div');p.className='rz-pick';p.hidden=true;
 p.innerHTML=`<div class="rz-pick-h"><b>${KL.t(ch?'Vyberte si číslo chatky':'Vyberte si číslo stanu')}</b><small>${KL.t('Přeškrtnutá čísla jsou ve vašem termínu obsazená.')}</small></div><div class="rz-pick-g">`+
  (()=>{const cols=[];MISTA[t.k].forEach((g,i)=>{const id=g[3]||i;let c=cols.find(x=>x.id===id);if(!c)cols.push(c={id,g:[],w:0});c.g.push(g);c.w=Math.max(c.w,g[2]-g[1]+1)});
   return cols.map(c=>`<div class="rz-pick-c" style="--n:${c.w}">`+c.g.map(g=>{let h='';for(let n=g[1];n<=g[2];n++)h+=`<button type="button" class="rz-cn" data-n="${n}" aria-pressed="false">${n}</button>`;return `<div class="rz-pick-s" style="--n:${g[2]-g[1]+1}"><span>${KL.t(g[0])}</span><div>${h}</div></div>`}).join('')+'</div>').join('')})()+'</div>';
 p.addEventListener('click',e=>{e.stopPropagation();const x=e.target.closest('.rz-cn');if(!x||x.disabled)return;const n=+x.dataset.n,c=S.c[t.k],i=c.indexOf(n);if(i>=0)c.splice(i,1);else c.push(n);c.sort((a,z)=>a-z);S.q[t.k]=c.length;render()});
 b.append(p);t.pick=p;t.cns=[...p.querySelectorAll('.rz-cn')];
 b.addEventListener('click',e=>{if(e.target.closest('.rz-st,.rz-pick'))return;t.open=!t.open;render()})});
function setType(k){const t=TYPES.find(x=>x.k===k);if(!t)return;TYPES.forEach(x=>{S.q[x.k]=0;if(S.c[x.k])S.c[x.k]=[]});const q=Math.min(MAXQ[k]||20,t.cap?Math.max(1,Math.ceil(persons()/t.cap)):1);if(MISTA[k]){setCount(k,q);t.open=true}else S.q[k]=q;if(k==='karavan'&&('elek' in S)&&!S.elek)S.elek=1;render()}
const uWrap=$('rzUnits');uWrap.hidden=true;

/* ---------- doplňky ---------- */
EXTRAS.forEach(x=>{const c=document.createElement('div');c.className='rz-x';c.tabIndex=0;c.setAttribute('role','checkbox');
 c.innerHTML=`<span class="tg"></span><span class="ic">${SV(ICO[x.k])}</span><b>${x.n}</b><small>${x.s}</small>`;
 x.st=stepper(()=>S[x.k],v=>{S[x.k]=v},()=>1,9);c.append(x.st);
 const tog=()=>{S[x.k]=S[x.k]?0:1;render()};
 c.addEventListener('click',e=>{if(e.target.closest('.rz-st'))return;tog()});
 c.addEventListener('keydown',e=>{if(e.target!==c)return;if(e.key==='Enter'||e.key===' '){e.preventDefault();tog()}});
 x.el=c;$('rzExtras').append(c)});

/* ---------- výpočet ---------- */
function compute(){const nights=nightsList(),L=[];let sum=0;
 const add=(label,key,qty)=>{if(!qty)return;let v=0;nights.forEach(d=>v+=P[key][isHi(d)?0:1]*qty);if(v){L.push([label,v]);sum+=v}};
 SEL().forEach(x=>{const u=UNIT[x.k],q=S.q[x.k];add(`${q}× ${plural(q,u[1],u[2],u[3])}${cis(x.k)}`,x.k,q)});
 const ad=S.dosp+(!onlyStan()?S.zak:0);
 add(`${ad}× ${plural(ad,'dospělý','dospělí','dospělých')}`,'os',ad);
 add(`${S.dite}× ${plural(S.dite,'dítě','děti','dětí')}`,'dite',S.dite);
 if(onlyStan())add(`${S.zak}× ${plural(S.zak,'žák','žáci','žáků')}`,'zak',S.zak);
 OS_VLASTNI.forEach(p=>add(`${S[p.k]||0}× ${KL.male(KL.t(p.n))}`,p.k,S[p.k]||0));
 EXTRAS.forEach(x=>add(`${S[x.k]}× ${KL.male(KL.t(x.n))}`,x.k,S[x.k]));
 const n=nights.length,disc=KC.sleva(n),dv=Math.round(sum*disc);
 return{nights,n,L,sum,disc,dv,total:sum-dv}}

/* plynulé počítání ceny */
const tw={};function tween(el,to){const o=tw[el.id]||(tw[el.id]={v:0,a:0});cancelAnimationFrame(o.a);const from=o.v,t0=performance.now(),dur=false?1:550;
 const f=t=>{const p=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-p,3);o.v=from+(to-from)*e;el.textContent=fmt(o.v);if(p<1)o.a=requestAnimationFrame(f)};o.a=requestAnimationFrame(f)}

let R,warnT;
function warn(msg){const w=$('rzWarn');w.textContent=msg;w.hidden=!msg;clearTimeout(warnT);if(msg)warnT=setTimeout(()=>{w.hidden=true},6000)}
const extrasTxt=()=>EXTRAS.filter(x=>S[x.k]).map(x=>`${S[x.k]>1?S[x.k]+'× ':''}${KL.male(KL.t(x.n))}`).join(', ');
const peopleTxt=()=>{const a=[`${S.dosp} ${plural(S.dosp,'dospělý','dospělí','dospělých')}`];if(S.dite)a.push(`${S.dite} ${plural(S.dite,'dítě','děti','dětí')}`);if(S.zak)a.push(`${S.zak} ${plural(S.zak,'žák','žáci','žáků')}`);OS_VLASTNI.forEach(p=>{if(S[p.k])a.push(`${S[p.k]}× ${KL.male(KL.t(p.n))}`)});return a.join(', ')};
const typeTxt=()=>SEL().map(t=>`${S.q[t.k]}× ${KL.male(KL.t(t.n))}${cis(t.k)}`).join(', ')||'nevybráno';
const dateTxt=()=>!S.from?'vyberte termín':S.from&&S.to?`${fD(S.from)} – ${fD(S.to)} · ${R.n} ${plural(R.n,'noc','noci','nocí')}`:'vyberte odjezd';

function render(){Object.keys(MISTA).forEach(k=>{S.c[k]=S.c[k].filter(n=>freeU(k,n));if(k in S.q)S.q[k]=S.c[k].length});R=compute();const pending=S.from&&!S.to;if(S.to&&!$('rzWarn').hidden)warn(KL.t(''));
 paintCal();
 $('rzFromT').textContent=S.from?fD(S.from):'vyberte';$('rzFromT').classList.toggle('wait',!S.from);
 const toT=$('rzToT');toT.textContent=S.to?fD(S.to):S.from?'vyberte':'–';toT.classList.toggle('wait',!!pending);
 $('rzN').textContent=R.n;$('rzNl').textContent=plural(R.n,'noc','noci','nocí');
 root.querySelectorAll('#rzQuick button').forEach(b=>b.classList.toggle('on',!!S.to&&+b.dataset.n===R.n));
 PEOPLE.forEach(r=>{r.st.upd();r.el.classList.toggle('has',S[r.k]>0)});
 TYPES.forEach(x=>{const q=S.q[x.k],fr=freeK(x.k);x.el.classList.toggle('on',q>0);x.el.classList.toggle('busy',!fr);x.el.querySelector('.n').textContent=q?q+'×':'';x.st.upd()});
 $('rzTNote').hidden=true;
 TYPES.forEach(t=>{if(!t.pick)return;const c=S.c[t.k],o=!!(t.open||c.length);t.pick.hidden=!o;t.tg.setAttribute('aria-expanded',o);
  t.tg.textContent=c.length?KL.t('č.')+' '+c.join(', '):KL.t(t.k==='chatka'?'Vybrat číslo chatky':'Vybrat číslo stanu');
  t.cns.forEach(x=>{const n=+x.dataset.n,s=c.includes(n),f=freeU(t.k,n);x.disabled=!f;x.classList.toggle('on',s);x.setAttribute('aria-pressed',s);x.setAttribute('aria-label',KL.t(t.n)+' '+n+(f?'':', '+KL.t('obsazeno')))})});
 EXTRAS.forEach(x=>{x.el.classList.toggle('on',S[x.k]>0);x.el.setAttribute('aria-checked',S[x.k]>0);x.st.upd()});
 /* souhrn */
 const hiN=R.nights.filter(isHi).length,se=$('rzSeason');
 se.textContent=!R.n||KC.jednaCena?'Termín':hiN===R.n?'Sezóna':hiN===0?'Mimo sezónu':'Sezóna + mimo';se.classList.toggle('lo',R.n>0&&hiN===0&&!KC.jednaCena);
 if(!S.to){$('rzTotal').textContent='— Kč';delete tw.rzTotal;$('rzBarTotal').textContent='—';delete tw.rzBarTotal;$('rzPer').textContent=pending?'Vyberte v kalendáři den odjezdu':'Cenu uvidíte po výběru termínu'}
 else{tween($('rzTotal'),R.total);tween($('rzBarTotal'),R.total);$('rzPer').textContent=persons()&&R.n?`≈ ${fmt(R.total/persons()/R.n)} ${KL.t('na osobu a noc')}`:''}
 const d=$('rzDisc');d.hidden=!R.disc;d.textContent=R.disc?`${KL.t('Sleva')} ${Math.round(R.disc*100)} % · ${KL.t('ušetříte')} ${fmt(R.dv)}`:'';
 $('rzSumDate').textContent=dateTxt();$('rzSumPeople').textContent=peopleTxt();$('rzSumType').textContent=typeTxt();$('rzSumExtras').textContent=extrasTxt()||'žádné';
 $('rzLines').innerHTML=!S.to?'<li><span>Vyberte termín</span><em>–</em></li>':R.L.map(([l,v])=>`<li><span>${l}</span><em>${fmt(v)}</em></li>`).join('')+(R.dv?`<li class="minus"><span>Sleva ${Math.round(R.disc*100)} %</span><em>−${fmt(R.dv)}</em></li>`:'')||'<li><span>Vyberte termín</span><em>–</em></li>';
 /* skrytá pole pro odeslání */
 const f=form.elements,set=(n,v)=>{f[n].value=v};
 set('prijezd',iso(S.from));set('odjezd',iso(S.to));set('noci',R.n);set('ubytovani',typeTxt());set('pocet_jednotek',SEL().reduce((a,t)=>a+S.q[t.k],0));
 set('dospeli',S.dosp);set('deti',S.dite);set('zaci',S.zak);set('doplnky',extrasTxt()||'žádné');set('cena',R.total);
 set('souhrn',summaryText());
 navState()}
function summaryText(){return `Termín: ${fDY(S.from)} – ${fDY(S.to)} (${R.n} ${plural(R.n,'noc','noci','nocí')})\nOsoby: ${peopleTxt()}\nUbytování: ${typeTxt()}\nDoplňky: ${extrasTxt()||'žádné'}\nOrientační cena: ${fmt(R.total)}${R.disc?` (vč. slevy ${Math.round(R.disc*100)} %)`:''}${KL.jazyk!=='cs'?'\nJazyk webu: '+KL.jazyk.toUpperCase():''}`}

/* ---------- kroky / průvodce ---------- */
const steps=[...root.querySelectorAll('.rz-step')],prog=[...root.querySelectorAll('.rz-prog button')],LAST=steps.length-1;
const NEXT=['Kdo jede','Ubytování','Doplňky','Kontakt','Odeslat poptávku'];
const mq=matchMedia('(max-width:900px)');let step=0;
const wiz=()=>true;
function navState(){
 prog.forEach((p,i)=>{p.classList.toggle('on',i===step);p.classList.toggle('done',wiz()?i<step:false);p.setAttribute('aria-current',i===step?'step':'false')});
 root.classList.toggle('wiz',wiz());root.classList.toggle('last',step===LAST);
 steps.forEach((s,i)=>s.classList.toggle('on',i===step));
 $('rzBack').hidden=step===0;
 $('rzNext').innerHTML=step===LAST?(innerWidth>900?KL.t('Odeslat poptávku')+' →':KL.t('Odeslat')+' →'):(innerWidth>900?KL.t('Pokračovat:')+' '+KL.t(NEXT[step])+' →':KL.t('Další')+' →');$('rzNext').removeAttribute('aria-label')}
function stepOk(i){if(i===2&&!SEL().length){warn(KL.t('Vyberte prosím aspoň jedno ubytování.'));return false}
 if(i===2&&!bedsOk()){warn(KL.t('Ještě nemají všichni kde spát – přidejte chatku, teepee nebo vlastní stan.'));return false}
 if(i===0&&!S.to){warn(S.from?'Vyberte v kalendáři den odjezdu.':'Vyberte v kalendáři den příjezdu a odjezdu.');const c=$('rzCal');c.classList.remove('nudge');void c.offsetWidth;c.classList.add('nudge');return false}return true}
function go(n,scroll=true){
 if(n>step)for(let i=step;i<n;i++)if(!stepOk(i)){n=i;break}
 step=Math.max(0,Math.min(LAST,n));navState();
 if(wiz()){if(scroll){const top=root.querySelector('.rz-main').getBoundingClientRect().top;if(top<0||top>innerHeight*.5)root.querySelector('.rz-main').scrollIntoView({behavior:'smooth',block:'start'})}
  if(step===LAST)setTimeout(()=>form.elements.jmeno.focus({preventScroll:true}),350)}
 else if(scroll)steps[step].scrollIntoView({behavior:'smooth',block:'start'})}
prog.forEach((p,i)=>p.addEventListener('click',()=>go(i)));
$('rzBack').addEventListener('click',()=>go(step-1));
$('rzNext').addEventListener('click',()=>{if(step===LAST)submit();else go(step+1)});
root.querySelectorAll('.rz-sum [data-go]').forEach(r=>r.addEventListener('click',()=>go(+r.dataset.go)));
mq.addEventListener?mq.addEventListener('change',()=>navState()):mq.addListener(()=>navState());
/* na počítači zvýrazní krok, který je právě vidět */
if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>{if(wiz())return;
  es.forEach(e=>{if(e.isIntersecting){step=+e.target.dataset.s;navState()}})},{rootMargin:'-45% 0px -50% 0px'});steps.forEach(s=>io.observe(s));
 const io2=new IntersectionObserver(es=>es.forEach(e=>document.body.classList.toggle('rz-inview',e.isIntersecting)),{threshold:.05});io2.observe(root)}

/* ---------- odeslání ---------- */
form.addEventListener('submit',e=>{e.preventDefault();submit()});
function fieldErr(name,msg){const inp=form.elements[name],lab=inp.closest('.rz-f');let em=lab.querySelector('em');
 if(msg){if(!em){em=document.createElement('em');em.id='err-'+name;lab.append(em)}em.textContent=msg;lab.classList.add('err');inp.setAttribute('aria-invalid','true');inp.setAttribute('aria-describedby','err-'+name)}else{if(em)em.remove();lab.classList.remove('err');inp.removeAttribute('aria-invalid');inp.removeAttribute('aria-describedby')}}
['jmeno','telefon','email'].forEach(n=>form.elements[n].addEventListener('input',()=>fieldErr(n,'')));
function submit(){
 if(!S.to){go(0);warn(KL.t('Vyberte v kalendáři termín pobytu.'));return}
 const f=form.elements;let bad=null;
 if(!f.jmeno.value.trim()){fieldErr('jmeno','Vyplňte prosím jméno.');bad=bad||f.jmeno}
 if(f.telefon.value.replace(/\D/g,'').length<9){fieldErr('telefon','Zadejte telefon, ať vás můžeme zastihnout.');bad=bad||f.telefon}
 if(f.email.value&&!/^\S+@\S+\.\S+$/.test(f.email.value)){fieldErr('email','E-mail nevypadá správně.');bad=bad||f.email}
 if(bad){go(LAST,false);steps[LAST].scrollIntoView({behavior:'smooth',block:'center'});setTimeout(()=>bad.focus({preventScroll:true}),400);const b=$('rzSubmit');pop(b);return}
 const ep=form.dataset.endpoint,btn=$('rzSubmit');
 if(ep){btn.disabled=true;btn.textContent='Odesílám…';
  fetch(ep,{method:'POST',body:new FormData(form)}).then(r=>{if(!r.ok)throw 0;done(false)})
  .catch(()=>{btn.disabled=false;btn.innerHTML='Odeslat poptávku <span>→</span>';warnSend()})}
 else{const body=`${summaryText()}\n\nJméno: ${f.jmeno.value}\nTelefon: ${f.telefon.value}\nE-mail: ${f.email.value||'-'}\nZpráva: ${f.zprava.value||'-'}`;
  location.href=`mailto:kempkrumlov2017@gmail.com?subject=${encodeURIComponent('Poptávka pobytu '+fDY(S.from)+' – '+fDY(S.to))}&body=${encodeURIComponent(body)}`;done(true)}}
function warnSend(){alert('Poptávku se nepodařilo odeslat. Zkuste to prosím znovu nebo zavolejte na +420 720 514 943.')}
function done(viaMail){const f=form.elements;
 $('rzDoneH').textContent=viaMail?'Skoro hotovo – dokončete odeslání v e-mailu':'Děkujeme, poptávka je odeslaná';
 $('rzDoneP').textContent=viaMail?'Otevřeli jsme vám e-mail s vyplněnou poptávkou, stačí ho odeslat. Ozveme se s potvrzením termínu a přesnou cenou.':`${KL.t('Ozveme se vám na')} ${f.telefon.value}${f.email.value?' '+KL.t('nebo')+' '+f.email.value:''} ${KL.t('s potvrzením termínu a přesnou cenou.')}`;
 $('rzDoneSum').innerHTML=summaryText().split('\n').map(l=>{const i=l.indexOf(':');return `<b>${l.slice(0,i+1)}</b>${l.slice(i+1)}`}).join('<br>');
 form.hidden=true;const d=$('rzDone');d.hidden=false;
 d.scrollIntoView({behavior:'smooth',block:'center'});d.focus({preventScroll:true})}
$('rzAgain').addEventListener('click',()=>{$('rzDone').hidden=true;form.hidden=false;const b=$('rzSubmit');b.disabled=false;b.innerHTML='Odeslat poptávku <span>→</span>';go(LAST)});

/* ---------- napojení z karet Ubytování ---------- */
const NAMES={'Vlastní stan':'stan','Karavan':'karavan','Chatka':'chatka','Teepee':'teepee','Podsadový stan':'podsad'};
document.querySelectorAll('[data-kc]').forEach(a=>a.addEventListener('click',e=>{const k=NAMES[a.dataset.kc];if(!k)return;e.preventDefault();
 setType(k);if(wiz()){step=S.to?2:0;navState()}
 (wiz()?root.querySelector('.rz-main'):steps[0]).scrollIntoView({behavior:"smooth",block:"start"})}));
window.RZ={setType,go};
const dlg=$('rzPrice'),openP=()=>{dlg.showModal?dlg.showModal():dlg.setAttribute('open','')};
$('rzPriceBtn').addEventListener('click',openP);$('rzPriceBtn2').addEventListener('click',openP);
dlg.querySelector('.rz-dlg-x').addEventListener('click',()=>dlg.close());
dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});

if(Object.values(BUSY).some(a=>a&&a.length))root.classList.add('has-busy');
drawCal();render();go(0,false);
})();
;

/* ===== ubytovani-cenik.js ===== */
(function(){var b=document.getElementById('ubPriceBtn'),d=document.getElementById('rzPrice');if(b&&d)b.addEventListener('click',function(){d.showModal?d.showModal():d.setAttribute('open','')});})();
;

/* ===== doprava.js ===== */
(function(){
var sec=document.getElementById('doprava');if(!sec)return;
var STOPS=[["Vyšší Brod", 1150], ["Rožmberk nad Vltavou", 850], ["Nahořany", 650], ["Kemp Vltava", 550], ["Viking / Pískárna", 500], ["Vltavan / Spolí", 350], ["Centrum", 250], ["Zlatá Koruna", 350], ["Boršov", 900]],NS='http://www.w3.org/2000/svg';
var W=480,H=740;
function E(n,a,p){var e=document.createElementNS(NS,n);for(var k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e}
/* ---------- geometrie: řeka teče shora dolů, silnice vpravo od ní ---------- */
function rx(y){return 232+58*Math.sin(y*0.0172+0.35)}
function poly(f,dx){var d='';for(var y=-10;y<=H+10;y+=8){d+=(d?' L':'M')+(rx(y)+dx).toFixed(1)+' '+y}return d}
var riverEl=document.getElementById('dpRiver'),roadEl=document.getElementById('dpRoad');
var D_RIVER=poly(rx,0),D_ROAD=poly(rx,78);
['dpRiverBank','dpRiver','dpRiverHl'].forEach(function(id){document.getElementById(id).setAttribute('d',D_RIVER)});
['dpRoadEdge','dpRoad','dpRoadDash'].forEach(function(id){document.getElementById(id).setAttribute('d',D_ROAD)});
var road=roadEl,L=road.getTotalLength(),rv=riverEl,RL=rv.getTotalLength();
var trail=document.getElementById('dpTrail'),van=document.getElementById('dpVan'),camp=document.getElementById('dpCamp'),gS=document.getElementById('dpStops');
var FR=[.045,.14,.235,.33,.43,.535,.64,.82,.955],CAMP=.735;
/* zastávky z ceníku: pořadí v ceníku = pořadí po proudu; nové se umístí mezi sousedy */
if(window.KKC){var FRK={dop1:.045,dop2:.14,dop3:.235,dop4:.33,dop5:.43,dop6:.535,dop7:.64,dop8:.82,dop9:.955};
 var vse=KKC.kat('doprava'),pol=vse.map(function(p){return p.poloha!=null?+p.poloha/100:FRK[p.k]!=null?FRK[p.k]:null});
 pol.forEach(function(v,i){if(v!=null)return;var a=null,b=null,ia=i,ib=i;
  while(ia>0&&a==null){ia--;a=pol[ia]}while(ib<pol.length-1&&b==null){ib++;b=pol[ib]}
  if(a==null)a=0.01;if(b==null)b=0.99;pol[i]=a+(b-a)*(i-ia)/Math.max(1,(ib-ia)||1)});
 STOPS=[];FR=[];vse.forEach(function(p,i){if(p.skryt===1)return;STOPS.push([p.n,KKC.v(p.k,'a'),p.k]);FR.push(Math.min(.99,Math.max(.01,pol[i])))});
 var chW=sec.querySelector('.dp-chips');if(chW)chW.innerHTML=STOPS.map(function(x,i){return '<button type="button" class="dp-chip" data-i="'+i+'"><span class="dp-dot"></span><b>'+x[0].replace(/[&<>]/g,'')+'</b><em>'+KKC.t(x[2],'a')+'</em></button>'}).join('');}
function rp(f){return rv.getPointAtLength(RL*f)}
/* ---------- zastávky na řece, popisek vlevo ---------- */
var stEls=STOPS.map(function(s,i){var p=rp(FR[i]),g=E('g',{class:'dp-st',tabindex:0,role:'button','aria-label':s[0],transform:'translate('+p.x.toFixed(1)+' '+p.y.toFixed(1)+')'},gS);
 E('circle',{class:'hit',r:24,fill:'transparent'},g);E('circle',{class:'ring',r:10},g);E('circle',{class:'o',r:8},g);
 var t=E('text',{x:-22,y:5.5,'text-anchor':'end'},g);t.textContent=s[0].replace(' nad Vltavou','');
 g.addEventListener('click',function(){stopAuto();select(i)});
 g.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();stopAuto();select(i)}});
 return g});
/* ---------- kemp u silnice ---------- */
var cr=road.getPointAtLength(L*CAMP);
var spur=E('path',{d:'M'+cr.x.toFixed(1)+' '+cr.y.toFixed(1)+' L'+(cr.x+36).toFixed(1)+' '+cr.y.toFixed(1),stroke:'#e9dfc3',fill:'none','stroke-width':7,'stroke-linecap':'round'});
camp.parentNode.insertBefore(spur,camp);
camp.setAttribute('transform','translate('+(cr.x+46).toFixed(1)+' '+cr.y.toFixed(1)+')');
var chips=[].slice.call(sec.querySelectorAll('.dp-chip'));
chips.forEach(function(c){c.addEventListener('click',function(){stopAuto();select(+c.dataset.i)})});
/* ---------- jízda ---------- */
function fmt(n){return Math.round(n).toLocaleString('cs-CZ')+'\u00a0Kč'}
var ang=0,angT=0;
function norm(a){while(a>180)a-=360;while(a<-180)a+=360;return a}
function targetAng(f,dir){var p=road.getPointAtLength(L*f),q=road.getPointAtLength(L*Math.min(1,Math.max(0,f+.003*dir)));return Math.atan2(q.y-p.y,q.x-p.x)*180/Math.PI+90}
function place(f,dir,snap){var p=road.getPointAtLength(L*f);angT=targetAng(f,dir);
 if(snap)ang=angT;else ang+=norm(angT-ang)*.22;
 van.setAttribute('transform','translate('+p.x.toFixed(1)+' '+p.y.toFixed(1)+') rotate('+ang.toFixed(1)+')')}
function drawTrail(a,b){var pts=[],n=44;for(var k=0;k<=n;k++){var p=road.getPointAtLength(L*(a+(b-a)*k/n));pts.push(p.x.toFixed(1)+' '+p.y.toFixed(1))}trail.setAttribute('d','M'+(cr.x+34).toFixed(1)+' '+cr.y.toFixed(1)+' L'+pts.join(' L'))}
var priceObj={v:0},anim=0,sel=-1,pT=0;
function tweenPrice(to){cancelAnimationFrame(pT);var from=priceObj.v,t0=performance.now();(function f(t){var p=Math.min(1,(t-t0)/600),e=1-Math.pow(1-p,3);priceObj.v=from+(to-from)*e;
 document.getElementById('dpPrice').textContent=fmt(priceObj.v);document.getElementById('dpPer').textContent=fmt(priceObj.v/8);if(p<1)pT=requestAnimationFrame(f)})(t0)}
function select(i){if(i===sel)return;sel=i;
 stEls.forEach(function(e,k){e.classList.toggle('on',k===i)});
 chips.forEach(function(c,k){c.classList.toggle('on',k===i);c.setAttribute('aria-selected',k===i)});
 document.getElementById('dpName').textContent=STOPS[i][0];tweenPrice(STOPS[i][1]);
 var target=FR[i],start=CAMP,dir=target>start?1:-1,dur=Math.max(450,Math.abs(target-start)*720),t0=null;cancelAnimationFrame(anim);van.classList.remove('dp-van-idle');
 (function f(t){if(!t0)t0=t;var p=Math.min(1,(t-t0)/dur),e=p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2,pos=start+(target-start)*e;place(pos,dir);drawTrail(start,pos);
  if(p<1)anim=requestAnimationFrame(f);else van.classList.add('dp-van-idle')})(performance.now())}
var auto=null,ai=0;function stopAuto(){clearInterval(auto);auto=null}
place(CAMP,1,true);
var reduce=!!window.KK_BEZ_ANIMACI;
function start(){select(0);if(reduce)return;ai=0;auto=setInterval(function(){ai=(ai+1)%STOPS.length;select(ai)},1400)}
if('IntersectionObserver' in window){var io=new IntersectionObserver(function(e){if(e[0].isIntersecting){start();io.disconnect()}},{threshold:.25});io.observe(sec.querySelector('.dp-map'))}else start();
})();
;

/* ===== ubytovani-panely.js ===== */
(()=>{const w=document.getElementById('ubPanels');if(!w)return;const ps=[...w.querySelectorAll('.ubp')];
function act(p){ps.forEach(x=>{const o=x===p;x.classList.toggle('on',o);const t=x.querySelector('.ubp-tg');if(t)t.setAttribute('aria-expanded',o)})}
ps.forEach(p=>{p.addEventListener('click',e=>{if(!p.classList.contains('on')){e.preventDefault();act(p)}});const tg=p.querySelector('.ubp-tg');if(tg)tg.addEventListener('click',e=>{e.stopPropagation();act(p)})})})();
;
