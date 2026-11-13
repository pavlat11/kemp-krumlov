(()=>{
window.__animPaused=false;
const raf=window.requestAnimationFrame.bind(window),si=window.setInterval.bind(window),st=window.setTimeout.bind(window),q=[];
window.__si=si;
window.requestAnimationFrame=function(cb){return raf(function(t){if(window.__animPaused)q.push(cb);else cb(t)})};
window.setInterval=function(fn,ms){if(typeof fn!=='function')return si.apply(null,arguments);const a=[].slice.call(arguments,2);return si(function(){if(!window.__animPaused)fn.apply(this,a)},ms)};
window.setTimeout=function(fn,ms){if(typeof fn!=='function')return st.apply(null,arguments);const a=[].slice.call(arguments,2);const run=function(){if(window.__animPaused)st(run,250);else fn.apply(null,a)};return st(run,ms)};
const freeze=()=>{try{document.getAnimations().forEach(x=>{if(x.playState==='running')x.pause()})}catch(e){}document.querySelectorAll('svg').forEach(v=>{try{v.pauseAnimations&&v.pauseAnimations()}catch(e){}})};
const thaw=()=>{try{document.getAnimations().forEach(x=>{if(x.playState==='paused')x.play()})}catch(e){}document.querySelectorAll('svg').forEach(v=>{try{v.unpauseAnimations&&v.unpauseAnimations()}catch(e){}});q.splice(0).forEach(cb=>raf(cb))};
let poll=null;
window.__setAnimPaused=function(p){window.__animPaused=p;document.documentElement.classList.toggle('anim-paused',p);
 const b=document.getElementById('animToggle');if(b){b.setAttribute('aria-pressed',p);const t=p?'Spustit animace':'Pozastavit animace';b.setAttribute('aria-label',t);b.title=t}
 if(p){freeze();if(!poll)poll=si(freeze,400)}else{if(poll){clearInterval(poll);poll=null}thaw()}};
document.addEventListener('DOMContentLoaded',()=>{const b=document.getElementById('animToggle');
 if(b)b.addEventListener('click',()=>window.__setAnimPaused(!window.__animPaused));
});
})();
