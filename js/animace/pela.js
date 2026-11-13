(function(){
 var sec=document.getElementById('pela'); if(!sec)return;
 var reduce=!!window.KK_BEZ_ANIMACI;
 function animateNumber(el,delay){
   var target=Number(el.dataset.n||0), pre=el.dataset.prefix||'', suf=el.dataset.suffix||'';
   if(reduce){el.textContent=pre+target+suf;return;}
   el.textContent=pre+'0'+suf;
   setTimeout(function(){
     var t0=null,dur=1050;
     function frame(t){
       if(!t0)t0=t; var p=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-p,3);
       el.textContent=pre+Math.round(target*e)+suf;
       if(p<1)requestAnimationFrame(frame); else el.textContent=pre+target+suf;
     }
     requestAnimationFrame(frame);
   },delay);
 }
 function run(){
   sec.classList.add('pela-in');
   sec.querySelectorAll('.pl-stats b[data-n]').forEach(function(el,i){animateNumber(el,120+i*90)});
 }
 if(reduce){run();return;}
 if('IntersectionObserver' in window){
   var io=new IntersectionObserver(function(e){if(e[0].isIntersecting){run();io.disconnect()}},{threshold:.18,rootMargin:'0px 0px -5% 0px'}); io.observe(sec);
 } else run();
})();
