(function(){
 var intro=document.getElementById('amIntro');if(!intro)return;
 var card=intro.querySelector('.ai-card');if(!card)return;
 function fit(){
  if(intro.hidden)return;
  var cs=getComputedStyle(intro),pv=parseFloat(cs.paddingTop)+parseFloat(cs.paddingBottom),ph=parseFloat(cs.paddingLeft)+parseFloat(cs.paddingRight);
  var ch=card.offsetHeight,cw=card.offsetWidth;if(!ch||!cw)return;
  var f=Math.min(1,(intro.clientHeight-pv)/ch,(intro.clientWidth-ph)/cw);
  card.style.setProperty('--fit',(f>0?f:1).toFixed(4))}
 fit();addEventListener('resize',fit);addEventListener('orientationchange',fit);addEventListener('load',fit);
 if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fit);
 if('ResizeObserver' in window){var ro=new ResizeObserver(fit);ro.observe(intro);ro.observe(card)}
})();
