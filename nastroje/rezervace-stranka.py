#!/usr/bin/env python3
"""Vygeneruje rezervace.html – samostatnou stránku jen s rezervačním formulářem kempu
(vkládá ji web PE-LA). Bere hlavičku a sekci #rezervace z index.html, takže po úpravě
formuláře v index.html stačí spustit znovu:  python3 nastroje/rezervace-stranka.py"""
import re, pathlib
koren = pathlib.Path(__file__).resolve().parent.parent
h = (koren / 'index.html').read_text(encoding='utf-8')
hlava = h[:h.index('</head>')]
hlava = re.sub(r'<link rel="preload" as="image"[^>]*>\n?', '', hlava)
hlava = re.sub(r'<link rel="canonical"[^>]*>', '<meta name="robots" content="noindex">', hlava)
hlava = re.sub(r'<title>[^<]*</title>', '<title>Rezervace · Kemp Krumlov a PE-LA</title>', hlava)
hlava = re.sub(r'<script type="application/ld\+json".*?</script>\n?', '', hlava, flags=re.S)
a = h.index('<section id="rezervace"'); b = h.index('</section>', a) + len('</section>')
sekce = h[a:b]
skripty = '\n'.join(re.findall(r'<script src="js/(?:cenik|pobyt)\.js[^"]*"></script>', h))
vlozeno = '''<style>
html,body{background:transparent}body.kk-vlozeno{margin:0;overflow-x:hidden}
.kk-vlozeno #rezervace{margin:0!important;padding-top:24px!important;padding-bottom:24px!important}
.kk-vlozeno .rz-anchor{display:none}
/* ve vloženém okně (web PE-LA) bez úvodu kempu a bez fotky na pozadí – nadpis má vkládající stránka */
html.kk-v-ramu .rz-head{display:none}
html.kk-v-ramu #rezervace,html.kk-v-ramu #rezervace::before,html.kk-v-ramu #rezervace::after{background:none!important}
html.kk-v-ramu #rezervace>.wrap{max-width:none;padding-left:0;padding-right:0}
</style>
<script>
/* výška pro vkládající web (PE-LA): posílá se rodičovské stránce, ať iframe nemá posuvník */
(function(){if(window.parent===window)return;document.documentElement.classList.add('kk-v-ramu');var p=0;function posli(){var v=Math.ceil(document.documentElement.scrollHeight);if(v!==p){p=v;parent.postMessage({kkRezervace:1,vyska:v},'*')}}
addEventListener('load',posli);if(window.ResizeObserver)new ResizeObserver(posli).observe(document.documentElement);setInterval(posli,800);
/* odkazy mimo formulář (GDPR, kontakty) otevřít v novém okně */
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href]');if(a&&!/^#|^javascript:/.test(a.getAttribute('href'))&&!a.target)a.target='_blank'},true)})();
</script>
'''
out = hlava + vlozeno + '</head>\n<body class="kk-vlozeno">\n' + sekce + '\n' + skripty + '\n</body>\n</html>\n'
(koren / 'rezervace.html').write_text(out, encoding='utf-8')
print('rezervace.html', len(out), 'B')
