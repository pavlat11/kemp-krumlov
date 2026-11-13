(()=>{const t=document.querySelector('.marquee-track');if(!t)return;
setTimeout(()=>{const x0=t.getBoundingClientRect().left;setTimeout(()=>{
if(Math.abs(t.getBoundingClientRect().left-x0)>1)return;
t.style.animation='none';let x=0,last=performance.now();const w=t.scrollWidth/2;
(function f(n){if(!window.__animPaused)x-=(n-last)*0.046;last=n;if(x<=-w)x+=w;t.style.transform='translate3d('+x+'px,0,0)';requestAnimationFrame(f)})(last)},1500)},800)})();
