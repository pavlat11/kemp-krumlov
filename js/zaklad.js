/* Základ: načítání, hlavička při scrollu, postupné zobrazování sekcí, počítadla */
const reduce = false;

addEventListener('load',()=>setTimeout(()=>document.getElementById('loader').classList.add('done'),reduce?0:600));

setTimeout(()=>document.getElementById('loader').classList.add('done'),2500);

const header=document.querySelector('header'),prog=document.getElementById('progress'),callbar=document.getElementById('callbar'),menu=document.getElementById('menu');

let lastY=0;

function onScroll(){const y=scrollY;
  header?.classList.toggle('scrolled',y>40);
  const arR=document.getElementById('areal').getBoundingClientRect(),onMap=arR.top<90&&arR.bottom>90;
  header?.classList.toggle('onmap',onMap);if(onMap)menu?.classList.remove('open');
  header?.classList.toggle('hide',y>600&&y>lastY&&!menu?.classList.contains('open'));lastY=y;
  if(prog)prog.style.width=(y/(document.documentElement.scrollHeight-innerHeight)*100)+'%';
  const ar=document.getElementById('areal').getBoundingClientRect();
  const cn=document.getElementById('cenik').getBoundingClientRect();
  callbar?.classList.toggle('show',y>400&&!(ar.top<innerHeight*.5&&ar.bottom>innerHeight*.5)&&!(cn.top<innerHeight*.6&&cn.bottom>innerHeight*.4))}

addEventListener('scroll',onScroll,{passive:true});

onScroll();

menu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>menu.classList.remove('open')));

const io=new IntersectionObserver(es=>es.forEach(x=>{if(!x.isIntersecting)return;const el=x.target;
  const sib=[...el.parentElement.children].filter(c=>c.classList.contains('reveal'));
  el.style.transitionDelay=(sib.indexOf(el)*0.07)+'s';el.classList.add('in');
  el.querySelectorAll('[data-count]').forEach(countUp);io.unobserve(el)}),{threshold:.12});

document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

function countUp(el){if(el.dataset.done)return;el.dataset.done=1;const to=+el.dataset.count,dec=+(el.dataset.dec||0),t0=performance.now(),dur=1600;
  const fmtN=v=>v.toLocaleString('cs-CZ',{minimumFractionDigits:dec,maximumFractionDigits:dec});
  if(reduce){el.textContent=fmtN(to);return}
  const f=t=>{const p=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-p,3);el.textContent=fmtN(to*e);if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)}
