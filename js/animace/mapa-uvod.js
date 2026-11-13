(function(){
var sec=document.getElementById('areal'),intro=document.getElementById('amIntro');
if(!sec||!intro||!window.__am)return;
var AM=window.__am,Z=AM.Z,icon=AM.icon;
var PR={chatky:'od 890 Kč',podsad:'300 Kč',teepee:'od 700 Kč',stany:'od 190 Kč'};
var TILES=['chatky','teepee','podsad','stany'],PILLS=['lode','pujcovna','kiosek','wc','parking','hriste'];
var TXT={stany:'Louka pro stany'};
/* ---------- obsah karty z dat mapy ---------- */
var tiles=intro.querySelector('.ai-tiles'),pills=intro.querySelector('.ai-pills');
TILES.forEach(function(k,i){var o=Z[k];if(!o)return;var b=document.createElement('button');b.type='button';b.className='ai-tile';b.style.setProperty('--c',o.c);b.style.setProperty('--i',i);b.dataset.k=k;
 b.innerHTML='<span class="ai-ti">'+icon(k,22)+'</span><span class="ai-tx"><b>'+(TXT[k]||o.n)+'</b><span>'+(PR[k]||'')+'</span></span><span class="ai-ar" aria-hidden="true">\u2192</span>';
 b.addEventListener('click',function(){reveal(k)});tiles.appendChild(b)});
PILLS.forEach(function(k,i){var o=Z[k];if(!o)return;var b=document.createElement('button');b.type='button';b.className='ai-pill';b.style.setProperty('--c',o.c);b.style.setProperty('--i',i+4);b.dataset.k=k;
 b.innerHTML='<i>'+icon(k,14)+'</i>'+o.n;b.addEventListener('click',function(){reveal(k)});pills.appendChild(b)});
intro.querySelector('.ai-n-places').textContent=Object.keys(Z).length;
/* pulzující značky na pozadí */
var DOTS=[[7,18,'#b6513e',0],[13,72,'#d58a2c',.8],[27,88,'#2a7c86',1.6],[41,9,'#4b8a5a',.4],[60,91,'#1f6f9a',2.2],[76,12,'#e0912f',1.2],[90,64,'#5d6fb8',.2],[93,28,'#b6513e',2],[4,46,'#5d6fb8',1.4]];
var dotsEl=intro.querySelector('.ai-dots');
DOTS.forEach(function(d){var e=document.createElement('span');e.className='ai-dot';e.style.cssText='--x:'+d[0]+'%;--y:'+d[1]+'%;--c:'+d[2]+';--d:'+d[3]+'s';dotsEl.appendChild(e)});
/* mapa je pod úvodem nedostupná (ani klávesnicí) */
var locked=['amStage','amPanel'].map(function(id){return document.getElementById(id)}).concat([].slice.call(sec.querySelectorAll('.am-ctrl,.am-open')));
locked.forEach(function(e){if(e)e.inert=true});
/* ---------- progress bar: spustí se sám, jakmile je karta vidět ---------- */
var done=false,started=false,ratio=0,pending=null;
var pctEl=document.getElementById('aiPct'),fillEl=document.getElementById('aiFill'),labEl=document.getElementById('aiLab'),barEl=intro.querySelector('.ai-bar'),loadEl=document.getElementById('aiLoad'),stepEls=[].slice.call(intro.querySelectorAll('.ai-steps li'));
var LABS=['Načítám areál kempu…','Stavím chatky a budovy…','Rozmisťuji značky…','Hotovo, otevírám mapu'];
var reduce=false;
var DUR=reduce?700:1900;
/* nerovnoměrný průběh působí přirozeněji než rovná čára */
function curve(t){return t<.28?.34*Math.pow(t/.28,.9):t<.6?.34+.36*((t-.28)/.32):t<.8?.70+.18*Math.pow((t-.6)/.2,1.3):.88+.12*(1-Math.pow(1-(t-.8)/.2,2))}
function setPct(p){var v=Math.min(100,Math.round(p));
 pctEl.innerHTML=v+'&nbsp;%';fillEl.style.transform='scaleX('+(p/100).toFixed(4)+')';barEl.setAttribute('aria-valuenow',v);
 var s=v>=100?3:v>=70?2:v>=32?1:0;
 stepEls.forEach(function(li,i){li.classList.toggle('on',i<=s);li.classList.toggle('cur',i===s&&v<100)});
 if(labEl.dataset.s!==String(s)){labEl.dataset.s=s;labEl.textContent=LABS[s]}}
var acc=0,skipFrom=null;
function start(){if(started||done)return;started=true;
 loadEl.classList.add('run');
 var last=null,cur=0;
 (function f(t){if(done)return;
  if(last===null)last=t;var dt=Math.max(0,Math.min(600,t-last));last=t;
  if(ratio>=.15||skipFrom!==null)acc+=dt;             /* mimo obrazovku se průběh pozastaví */
  var target=curve(Math.max(0,Math.min(1,acc/DUR)))*100;if(!(target>=0))target=0;
  if(skipFrom!==null)target=Math.max(target,cur+(100-cur)*Math.min(1,(acc-skipFrom)/260));
  cur=Math.max(cur,target);setPct(cur);
  if(cur>=99.9){setPct(100);setTimeout(function(){open(pending)},reduce?80:420);return}
  requestAnimationFrame(f)})(performance.now())}
/* přeskočení tlačítkem nebo dlaždicí: průběh rychle dojede do 100 % */
function reveal(k){if(done)return;pending=k||null;if(!started)start();if(skipFrom===null)skipFrom=acc}
/* karta se objeví při dorolování, průběh startuje automaticky při ≥ 55 % viditelnosti nebo při najetí myší */
if('IntersectionObserver' in window){
 var io=new IntersectionObserver(function(es){var e=es[0];ratio=e.intersectionRatio;
  if(e.isIntersecting&&ratio>=.25)intro.classList.add('in');
  if(ratio>=.55&&!started)setTimeout(function(){if(ratio>=.4)start()},650)},{threshold:[0,.15,.25,.4,.55,.7,1]});
 io.observe(intro)}
else{intro.classList.add('in');ratio=1;start()}
intro.addEventListener('pointerenter',function(){if(ratio>=.15&&!started)start()});
function open(k){if(done)return;done=true;
 intro.classList.add('loaded');
 sec.classList.add('am-rev');intro.classList.add('go');
 setTimeout(function(){sec.classList.remove('am-pre');locked.forEach(function(e){if(e)e.inert=false})},300);
 setTimeout(function(){intro.hidden=true},900);
 if(k&&Z[k])setTimeout(function(){AM.select(Z[k])},1050);
 setTimeout(function(){sec.classList.remove('am-rev')},2600);
 setTimeout(hint,1500)}
document.getElementById('aiGo').addEventListener('click',function(){reveal(null)});
function hint(){
 var coarse=matchMedia('(pointer:coarse)').matches,h=document.createElement('div');h.className='am-hint';
 h.innerHTML='<i>\u261D</i><span>'+(coarse?'Klepněte na značku nebo tažením posouvejte mapu':'Klikněte na značku nebo tažením posouvejte mapu')+'</span>';
 sec.appendChild(h);
 function off(){h.classList.add('off');setTimeout(function(){h.remove()},600);sec.removeEventListener('pointerdown',off,true)}
 sec.addEventListener('pointerdown',off,true);setTimeout(off,7000)}
})();
