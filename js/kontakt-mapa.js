/* MAPY.CZ – vložení mapy do Kontaktu.
   Na mapy.cz najděte kemp → Sdílet → Vložit mapu do webu → zkopírujte adresu z atributu src="…" (začíná https://frame.mapy.cz/…)
   a vložte ji mezi uvozovky níže. Dokud je prázdné, zobrazí se náhled s odkazem „Otevřít v Mapy.cz“. */
var MAPY_EMBED='https://mapy.com/s/laranobohe';
(function(){var w=document.getElementById('ktMapy');if(!w||!MAPY_EMBED)return;var b=w.querySelector('.kt-mapy-show');
function load(){if(w.classList.contains('on'))return;var f=document.createElement('iframe');f.src=MAPY_EMBED;f.title='Mapa – Kemp Krumlov (Mapy.cz)';f.loading='lazy';f.setAttribute('allowfullscreen','');w.appendChild(f);w.classList.add('on')}
if('IntersectionObserver'in window){var io=new IntersectionObserver(function(e){if(e[0].isIntersecting){load();io.disconnect()}},{rootMargin:'300px'});io.observe(w)}else load();
b.hidden=false;b.addEventListener('click',load)})();
