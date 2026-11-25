/* PE-LA — interakce a animace */
/* ===== Cloudflare Turnstile – VEŘEJNÝ klíč (Site Key). Prázdné = vypnuto. =====
   Tajný klíč (Secret Key) patří do forms/config.php, NIKDY sem. */
const TURNSTILE_SITEKEY = '0x4AAAAAAFlb5d0oP_5PPmOG';
(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = false;   // animace běží vždy (i při zapnutém „omezit pohyb“)

  /* ---------- překlady hlášek ---------- */
  const LANG = (document.documentElement.lang || 'cs').slice(0, 2);
  const I18N = window.PELA_I18N || {};   // překlady se vkládají z lang/*.php ('_js')
  const L = t => I18N[t] || t;

  /* ---------- reklamní pruh: zůstane zavřený během návštěvy ---------- */
  try { if (sessionStorage.getItem('promo-off')) { const pb = $('#promoBar'); pb && pb.remove(); document.body.classList.remove('has-promo'); } } catch (e) {}

  /* ---------- preloader ---------- */
  const loader = $('.loader');
  const start = () => {
    if (loader) loader.classList.add('done');
    setTimeout(() => $$('.split, .hero, .phero').forEach(el => el.classList.add('in')), loader ? 350 : 0);
  };
  if (loader && !sessionStorageGet('pela-seen')) {
    window.addEventListener('load', () => setTimeout(start, 900));
    setTimeout(start, 2800); // pojistka
    sessionStorageSet('pela-seen', '1');
  } else {
    if (loader) loader.remove();
    requestAnimationFrame(() => setTimeout(start, 60));
  }
  function sessionStorageGet(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
  function sessionStorageSet(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }

  /* ---------- split text na slova ---------- */
  $$('.split').forEach(el => {
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span'); w.className = 'w';
            const i = document.createElement('span'); i.textContent = part; w.appendChild(i);
            frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
      });
    };
    walk(el);
    $$('.w > span', el).forEach((s, i) => s.style.transitionDelay = (0.08 * i + 0.1) + 's');
  });

  /* ---------- header ---------- */
  const header = $('.header');
  const progress = $('.progress');
  const totop = $('.totop');
  const ring = totop && $('circle', totop);
  let lastY = 0;
  const onScroll = () => {
    const y = scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? y / max : 0;
    if (progress) progress.style.transform = `scaleX(${p})`;
    if (header) {
      header.classList.toggle('is-solid', y > 40 || header.dataset.solid === '1');
      header.classList.toggle('is-hidden', y > 500 && y > lastY + 4 && !document.body.classList.contains('menu-open'));
      if (y < lastY - 4) header.classList.remove('is-hidden');
    }
    if (totop) { totop.classList.toggle('show', y > 700); if (ring) ring.style.strokeDashoffset = 163 - 163 * p; }
    lastY = y;
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  totop && totop.addEventListener('click', () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));

  /* ---------- mobilní menu ---------- */
  const burger = $('.burger');
  burger && burger.addEventListener('click', () => {
    const open = document.body.classList.toggle('menu-open');
    burger.setAttribute('aria-expanded', open);
  });
  $$('.mobile-menu a').forEach(a => a.addEventListener('click', () => {
    document.body.classList.remove('menu-open');
    burger && burger.setAttribute('aria-expanded', 'false');
  }));
  $$('.dd > button').forEach(b => b.addEventListener('click', () => {
    const open = b.parentElement.classList.toggle('open');
    b.setAttribute('aria-expanded', open);
  }));
  document.addEventListener('click', e => { $$('.dd.open').forEach(d => { if (!d.contains(e.target)) d.classList.remove('open'); }); });

  /* ---------- aktivní položka menu ---------- */
  const navLinks = $$('.nav > a[href*="#"]');
  const secs = navLinks.map(a => { const id = a.getAttribute('href').split('#')[1]; return document.getElementById(id); }).filter(Boolean);
  if (secs.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) navLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href').endsWith('#' + en.target.id)));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    secs.forEach(s => io.observe(s));
  }

  /* ---------- reveal on scroll ---------- */
  const rio = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); rio.unobserve(en.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
  $$('[data-reveal], .clip-reveal, .split:not(.hero .split):not(.phero .split)').forEach(el => rio.observe(el));
  $$('[data-stagger]').forEach(group => {
    [...group.children].forEach((c, i) => { c.setAttribute('data-reveal', c.getAttribute('data-reveal') || 'up'); c.style.setProperty('--d', (i % 6) * 0.09 + 's'); rio.observe(c); });
  });

  /* ---------- počítadla ---------- */
  const cio = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target; cio.unobserve(el);
      const to = +el.dataset.count, dur = 1800, t0 = performance.now();
      const tick = t => {
        const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 4);
        el.textContent = Math.round(to * e).toLocaleString('cs-CZ');
        if (k < 1) requestAnimationFrame(tick);
      };
      reduce ? (el.textContent = to) : requestAnimationFrame(tick);
    });
  }, { threshold: .6 });
  $$('[data-count]').forEach(el => cio.observe(el));

  /* ---------- parallax ---------- */
  const px = $$('[data-parallax]');
  if (px.length && !reduce) {
    const run = () => {
      px.forEach(el => {
        const r = el.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) return;
        const k = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
        el.style.transform = `translate3d(0, ${k * -(+el.dataset.parallax || 60)}px, 0)`;
      });
    };
    addEventListener('scroll', () => requestAnimationFrame(run), { passive: true }); run();
  }

  /* ---------- 3D náklon karet ---------- */
  if (matchMedia('(hover:hover) and (pointer:fine)').matches && !reduce) {
    $$('.card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        card.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
      });
      card.addEventListener('mouseleave', () => card.style.transform = '');
    });
  }

  /* ---------- záložky ceníku ---------- */
  $$('.tabs').forEach(tabs => {
    const btns = $$('.tab', tabs), ink = $('.tabs__ink', tabs);
    const move = b => { ink.style.width = b.offsetWidth + 'px'; ink.style.transform = `translateX(${b.offsetLeft}px)`; };
    btns.forEach(b => b.addEventListener('click', () => {
      btns.forEach(x => x.setAttribute('aria-selected', x === b));
      $$('.panel').forEach(p => p.classList.toggle('on', p.id === b.getAttribute('aria-controls')));
      move(b);
      b.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
    }));
    const sel = btns.find(b => b.getAttribute('aria-selected') === 'true') || btns[0];
    requestAnimationFrame(() => move(sel));
    addEventListener('resize', () => move(btns.find(b => b.getAttribute('aria-selected') === 'true')));
    document.fonts && document.fonts.ready.then(() => move(btns.find(b => b.getAttribute('aria-selected') === 'true')));
  });

  /* ---------- otevírací doba (živě) ---------- */
  const hours = $('.hours');
  if (hours) {
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Prague' }));
    const m = now.getMonth() + 1, h = now.getHours();
    const season = m >= 5 && m <= 9;
    const open = season && h >= 9 && h < 19;
    hours.classList.toggle('off', !open);
    $('b', hours).textContent = L(open ? 'Právě máme otevřeno' : (season ? 'Teď je zavřeno, otevíráme v 9:00' : 'Mimo sezónu: rezervace přijímáme'));
  }

  /* ---------- galerie + lightbox ---------- */
  /* položky se čtou až při kliknutí – galerii může překreslit administrace (fotky z ní) */
  const gItems = () => $$('.gitem');
  const more = $('.gallery-more button');
  if (more) {
    more.addEventListener('click', () => {
      const hidden = gItems().filter(i => i.classList.contains('is-hidden'));
      hidden.slice(0, 9).forEach((i, k) => { i.classList.remove('is-hidden'); i.setAttribute('data-reveal', 'up'); i.style.setProperty('--d', k * .06 + 's'); rio.observe(i); });
      if (hidden.length <= 9) more.parentElement.remove();
    });
  }
  if ($('.gallery')) {
    let items = gItems();
    const lb = document.createElement('div');
    lb.className = 'lb'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', L('Fotogalerie'));
    lb.innerHTML = `<img class="lb__img" alt="">
      <button class="lb__btn lb__close" aria-label="${L('Zavřít')}"><svg class="icon"><use href="#i-x"/></svg></button>
      <button class="lb__btn lb__prev" aria-label="${L('Předchozí')}"><svg class="icon"><use href="#i-left"/></svg></button>
      <button class="lb__btn lb__next" aria-label="${L('Další')}"><svg class="icon"><use href="#i-arrow"/></svg></button>
      <div class="lb__count"></div>`;
    document.body.appendChild(lb);
    const img = $('.lb__img', lb), cnt = $('.lb__count', lb);
    let idx = 0, lastFocus;
    const show = i => {
      idx = (i + items.length) % items.length;
      img.classList.add('swap');
      const src = items[idx].dataset.full;
      const pre = new Image(); pre.onload = () => { img.src = src; img.classList.remove('swap'); }; pre.src = src;
      img.alt = items[idx].querySelector('img').alt;
      cnt.textContent = String(idx + 1).padStart(2, '0') + ' / ' + String(items.length).padStart(2, '0');
    };
    const open = i => { items = gItems(); lastFocus = document.activeElement; show(i); lb.classList.add('open'); document.body.style.overflow = 'hidden'; $('.lb__close', lb).focus(); };
    const close = () => { lb.classList.remove('open'); document.body.style.overflow = ''; lastFocus && lastFocus.focus(); };
    document.addEventListener('click', e => { const it = e.target.closest('.gitem'); if (!it || document.documentElement.classList.contains('kk-edit')) return; open(gItems().indexOf(it)); });
    $('.lb__close', lb).onclick = close;
    $('.lb__prev', lb).onclick = () => show(idx - 1);
    $('.lb__next', lb).onclick = () => show(idx + 1);
    lb.addEventListener('click', e => { if (e.target === lb) close(); });
    addEventListener('keydown', e => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
    let sx = null;
    lb.addEventListener('touchstart', e => sx = e.touches[0].clientX, { passive: true });
    lb.addEventListener('touchend', e => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1)); sx = null; });
  }

  /* ---------- subnav (stránky lodí) ---------- */
  const sublinks = $$('.subnav a');
  if (sublinks.length) {
    const sio = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) sublinks.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + en.target.id)); });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sublinks.forEach(a => { const t = document.getElementById(a.getAttribute('href').slice(1)); t && sio.observe(t); });
  }

  /* ---------- formulář ---------- */
  $$('.form').forEach(wrap => {
    const form = $('form', wrap), msg = $('.form__msg', wrap), ta = $('textarea', form);
    $$('.hint button', wrap).forEach(b => b.addEventListener('click', () => {
      const add = b.dataset.add;
      ta.value = (ta.value.trim() ? ta.value.trim() + '\n' : '') + add;
      ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length);
    }));
    // předvyplnění typu lodě z odkazu ?lod=
    const q = new URLSearchParams(location.search).get('lod');
    $$('[data-book]').forEach(a => a.addEventListener('click', () => {
      ta.value = L('Mám zájem o: ') + a.dataset.book + '\n' + L('Termín: ') + '\n' + L('Počet osob: ') + '\n' + L('Místo návozu / vyzvednutí: ');
    }));
    if (q && !ta.value) ta.value = L('Mám zájem o: ') + q + '\n';
    /* --- Turnstile: načte se až když se formulář blíží do zobrazení --- */
    const ts = $('.turnstile', wrap);
    let widgetId = null;
    const tsOn = !!(TURNSTILE_SITEKEY && ts);
    const renderTs = () => {
      if (!window.turnstile || widgetId !== null) return;
      widgetId = turnstile.render(ts, {
        sitekey: TURNSTILE_SITEKEY, language: LANG, theme: 'light', size: 'flexible', action: 'rezervace',
        retry: 'auto', 'refresh-expired': 'auto',
        'error-callback': code => {
          const c = String(code || '');
          let hint = L('Obnovte prosím stránku, nebo nám zavolejte na 725 336 601.');
          if (/^1102/.test(c)) hint = 'Doména webu není povolená u widgetu v Cloudflare (Hostname Management).';
          else if (/^(1101|4000)/.test(c)) hint = 'Neplatný veřejný klíč (Site Key) v assets/js/main.js.';
          console.warn('[Turnstile] chyba', c);
          msg.textContent = L('Ověření „Nejsem robot“ se nepodařilo (kód ') + c + '). ' + hint;
          return true;
        }
      });
    };
    if (tsOn) {
      ts.hidden = false;
      window.__tsQueue = window.__tsQueue || [];
      window.__tsQueue.push(renderTs);
      const tio = new IntersectionObserver(en => {
        if (!en[0].isIntersecting) return; tio.disconnect();
        if (window.turnstile) return renderTs();
        if (!document.getElementById('cf-ts')) {
          window.__tsReady = () => window.__tsQueue.forEach(fn => fn());
          const sc = document.createElement('script');
          sc.id = 'cf-ts'; sc.async = true; sc.defer = true;
          sc.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=__tsReady';
          document.head.appendChild(sc);
        }
      }, { rootMargin: '600px 0px' });
      tio.observe(wrap);
    }
    const tsReset = () => { if (tsOn && window.turnstile && widgetId !== null) turnstile.reset(widgetId); };

    form.addEventListener('submit', async e => {
      e.preventDefault();
      msg.textContent = '';
      let bad = false;
      $$('input[required], textarea[required]', form).forEach(f => {
        const ok = f.checkValidity(); f.parentElement.classList.toggle('err', !ok); if (!ok && !bad) { bad = true; f.focus(); }
      });
      if (bad) { msg.textContent = L('Vyplňte prosím všechna pole správně.'); return; }
      if (tsOn) {
        const tok = form.querySelector('[name="cf-turnstile-response"]');
        if (!tok || !tok.value) { msg.textContent = L('Počkejte prosím na dokončení ověření „Nejsem robot“.'); return; }
      }
      wrap.classList.add('sending');
      try {
        const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { 'X-Requested-With': 'XMLHttpRequest' } });
        const txt = (await res.text()).trim();
        if (res.ok && txt === 'OK') { wrap.classList.add('done'); form.reset(); }
        else if (/^MSG:/.test(txt)) { msg.textContent = L(txt.slice(4)); }
        else throw new Error('HTTP ' + res.status + ' ' + txt.slice(0, 200));
      } catch (err) {
        console.warn('[Formulář]', err.message);
        msg.innerHTML = L('Zprávu se nepodařilo odeslat. Zavolejte nám prosím na') + ' <a href="tel:+420725336601"><b>+420 725 336 601</b></a>.<br><small style="opacity:.7">(' + String(err.message).replace(/[<>&]/g, '').slice(0, 160) + ')</small>';
      } finally { wrap.classList.remove('sending'); tsReset(); }
    });
    $$('input, textarea', form).forEach(f => f.addEventListener('input', () => f.parentElement.classList.remove('err')));
    // návrat z odeslání bez JavaScriptu (?odeslano=1 / ?chyba=1)
    const qs = new URLSearchParams(location.search);
    if (qs.has('odeslano')) wrap.classList.add('done');
    if (qs.has('chyba')) msg.innerHTML = L('Zprávu se nepodařilo odeslat. Zavolejte nám prosím na') + ' <a href="tel:+420725336601"><b>+420 725 336 601</b></a>.';
    const again = $('.form__again', wrap);
    again && again.addEventListener('click', () => wrap.classList.remove('done'));
  });

  /* ---------- rok v patičce ---------- */
  $$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
  $$('[data-since]').forEach(el => el.dataset.count = new Date().getFullYear() - 1993);
})();
