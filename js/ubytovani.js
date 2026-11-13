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
