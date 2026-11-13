(function(){if(!('IntersectionObserver'in window))return;var io=new IntersectionObserver(function(es){es.forEach(function(e){e.target.classList.toggle('zz-off',!e.isIntersecting)})},{rootMargin:'0px'});
document.querySelectorAll('section,.marquee,header.kk2-part').forEach(function(el){if(el.closest('section')!==el&&el.closest('section'))return;io.observe(el)})})();
