/* Moda Building — site script (no dependencies) */
(function () {
  'use strict';
  var w = window, d = document;
  w.dataLayer = w.dataLayer || [];
  function push(o) { try { w.dataLayer.push(o); } catch (e) {} }
  function store(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k)); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } }
  function $(s, c) { return (c || d).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); }

  /* ---------- Mobile menu ---------- */
  var toggle = $('.menu-toggle'), mnav = $('#mnav');
  if (toggle && mnav) {
    toggle.addEventListener('click', function () {
      var open = mnav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open);
      d.body.style.overflow = open ? 'hidden' : '';
    });
  }
  // If the screen widens to the desktop menu (e.g. tablet rotation) while the mobile menu is open, close it.
  var mqDesktop = w.matchMedia('(min-width: 1080px)');
  if (mqDesktop.addEventListener) mqDesktop.addEventListener('change', function (e) {
    if (e.matches && mnav && mnav.classList.contains('is-open')) { mnav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); d.body.style.overflow = ''; }
  });
  /* Desktop dropdowns (click/keyboard support; hover handled in CSS) */
  $$('.nav button[aria-expanded]').forEach(function (b) {
    b.addEventListener('click', function () {
      var was = b.getAttribute('aria-expanded') === 'true';
      $$('.nav button[aria-expanded]').forEach(function (o) { o.setAttribute('aria-expanded', 'false'); });
      b.setAttribute('aria-expanded', String(!was));
    });
  });
  d.addEventListener('click', function (e) { if (!e.target.closest('.nav')) $$('.nav button[aria-expanded]').forEach(function (o) { o.setAttribute('aria-expanded', 'false'); }); });
  // Submenu links that jump to a section of the current page: close the dropdown / mobile menu so it doesn't cover the content.
  d.addEventListener('click', function (e) {
    var a = e.target.closest('.nav .dd a, #mnav a');
    if (!a) return;
    $$('.nav button[aria-expanded]').forEach(function (o) { o.setAttribute('aria-expanded', 'false'); });
    if (a.closest('.nav')) a.blur();
    if (mnav && mnav.classList.contains('is-open') && toggle) toggle.click();
  });
  d.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    $$('.nav button[aria-expanded="true"]').forEach(function (o) { o.setAttribute('aria-expanded', 'false'); o.focus(); });
    if (mnav && mnav.classList.contains('is-open')) toggle.click();
  });

  /* ---------- Attribution: UTM + click IDs (first & last touch) ---------- */
  var params = new URLSearchParams(location.search);
  var KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'gbraid', 'wbraid', 'fbclid', 'msclkid'];
  var touch = {};
  KEYS.forEach(function (k) { var v = params.get(k); if (v) touch[k] = v.slice(0, 200); });
  if (Object.keys(touch).length) {
    touch.landing_page = location.pathname;
    touch.ts = new Date().toISOString();
    if (!store('moda_first_touch')) store('moda_first_touch', touch);
    store('moda_last_touch', touch);
  }
  if (!store('moda_landing')) store('moda_landing', { page: location.pathname + location.search, ref: d.referrer || '(direct)' });
  function cookie(n) { var m = d.cookie.match(new RegExp('(?:^|; )' + n + '=([^;]*)')); return m ? decodeURIComponent(m[1]) : ''; }
  function uid() { return 'lead-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10); }
  function fillHidden(form) {
    var last = store('moda_last_touch') || {}, first = store('moda_first_touch') || {}, land = store('moda_landing') || {};
    function set(n, v) { var el = form.elements[n]; if (el && v) el.value = v; }
    KEYS.forEach(function (k) { set(k, last[k]); });
    set('first_touch', Object.keys(first).length ? JSON.stringify(first) : '');
    set('landing_page', land.page);
    set('referrer', land.ref);
    set('page_url', location.href.split('#')[0]);
    var fbc = cookie('_fbc') || (last.fbclid ? 'fb.1.' + Date.now() + '.' + last.fbclid : '');
    set('fbp', cookie('_fbp'));
    set('fbc', fbc);
    if (!form.elements.event_id.value) form.elements.event_id.value = uid();
  }

  /* ---------- Click-to-call + CTA tracking ---------- */
  d.addEventListener('click', function (e) {
    var a = e.target.closest('a');
    if (!a) return;
    if (a.protocol === 'tel:') push({ event: 'phone_click', phone_location: a.getAttribute('data-loc') || 'inline', page_path: location.pathname });
    else if (a.hasAttribute('data-cta')) push({ event: 'cta_click', cta_location: a.getAttribute('data-cta'), page_path: location.pathname });
  });

  /* ---------- Lead form ---------- */
  var mqSteps = w.matchMedia('(max-width: 767px)');
  function digits(v) { return (v || '').replace(/\D/g, '').replace(/^1(?=\d{10})/, '').slice(0, 10); }
  function fmtPhone(v) {
    var x = digits(v);
    if (x.length < 4) return x.length ? '(' + x : '';
    if (x.length < 7) return '(' + x.slice(0, 3) + ') ' + x.slice(3);
    return '(' + x.slice(0, 3) + ') ' + x.slice(3, 6) + '-' + x.slice(6);
  }
  function validField(el) {
    var f = el.closest('.field'), ok = true, v = (el.value || '').trim();
    if (el.required && !v) ok = false;
    else if (el.type === 'email' && v) ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
    else if (el.type === 'tel' && v) ok = digits(v).length === 10;
    else if (el.name === 'zip' && v) ok = /^\d{5}$/.test(v);
    else if (el.type === 'file' && el.files && el.files[0]) ok = el.files[0].size <= 8 * 1024 * 1024;
    if (f) f.classList.toggle('has-error', !ok);
    el.classList.toggle('is-invalid', !ok);
    el.setAttribute('aria-invalid', String(!ok));
    return ok;
  }
  function validGroup(scope) {
    var bad = null;
    $$('input, select, textarea', scope).forEach(function (el) {
      if (el.type === 'hidden' || el.closest('.hp') || (el.offsetParent === null && !el.closest('.qf-step'))) return;
      if (!validField(el) && !bad) bad = el;
    });
    if (bad) {
      var det = bad.closest('details'); if (det) det.open = true; // reveal errors inside "Add project details"
      bad.focus();
    }
    return !bad;
  }

  $$('form.qf').forEach(function (form) {
    var steps = $$('.qf-step', form), idx = 0;
    var bars = $$('.qf-progress span', form), stepText = $('.qf-steptext', form);
    var started = false;
    function show(i) {
      idx = i;
      steps.forEach(function (s, n) { s.classList.toggle('is-active', n === i); });
      bars.forEach(function (b, n) { b.classList.toggle('on', n <= i); });
      if (stepText) stepText.textContent = 'Step ' + (i + 1) + ' of ' + steps.length;
      form.classList.toggle('on-first', i === 0);
      form.classList.toggle('on-last', i === steps.length - 1);
    }
    function mode() {
      form.classList.toggle('is-steps', mqSteps.matches);
      show(mqSteps.matches ? 0 : steps.length - 1);
      if (!mqSteps.matches) form.classList.remove('on-first');
    }
    mode();
    if (mqSteps.addEventListener) mqSteps.addEventListener('change', mode);
    // Preset from a problem tile: service chosen + problem attached; on phones jump past the service step.
    form.addEventListener('qf:preset', function (e) {
      var d = e.detail || {};
      if (d.service && form.elements.service) { form.elements.service.value = d.service; validField(form.elements.service); }
      if (d.problem && form.elements.problem) form.elements.problem.value = d.problem;
      // Skip ahead only when the first step asks for nothing but the service (main site). LP step 1 also asks for ZIP.
      var firstFields = $$('input:not([type=hidden]), select', steps[0]).filter(function (x) { return !x.closest('.hp'); });
      if (form.classList.contains('is-steps') && form.elements.service.value && firstFields.length === 1) show(1);
    });

    form.addEventListener('focusin', function () {
      if (started) return; started = true;
      push({ event: 'form_start', form_location: form.elements.form_location.value });
    });
    $('.qf-next', form) && $('.qf-next', form).addEventListener('click', function () {
      if (!validGroup(steps[idx])) return;
      push({ event: 'form_step', step: idx + 2, form_location: form.elements.form_location.value });
      show(Math.min(idx + 1, steps.length - 1));
      var first = $('input:not([type=hidden]), select', steps[idx]); if (first) first.focus();
    });
    $('.qf-back', form) && $('.qf-back', form).addEventListener('click', function () { show(Math.max(idx - 1, 0)); });

    var tel = form.elements.phone;
    if (tel) tel.addEventListener('input', function () { tel.value = fmtPhone(tel.value); });
    var zip = form.elements.zip;
    if (zip) zip.addEventListener('input', function () { zip.value = zip.value.replace(/\D/g, '').slice(0, 5); });
    $$('input, select, textarea', form).forEach(function (el) {
      el.addEventListener('blur', function () { if (el.value) validField(el); });
      el.addEventListener('change', function () { if (el.classList.contains('is-invalid')) validField(el); });
    });

    form.addEventListener('submit', function (e) {
      fillHidden(form);
      if (!validGroup(form)) {
        e.preventDefault();
        if (form.classList.contains('is-steps')) {
          var badStep = steps.findIndex(function (s) { return $('.is-invalid', s); });
          if (badStep > -1) { show(badStep); var b = $('.is-invalid', steps[badStep]); b && b.focus(); }
        }
        return;
      }
      if (form.elements.company_website && form.elements.company_website.value) { e.preventDefault(); return; }
      var lead = { estimate: form.elements.estimate ? form.elements.estimate.value : '', problem: form.elements.problem ? form.elements.problem.value : '', service: form.elements.service.value, city: form.elements.city.value, zip: form.elements.zip ? form.elements.zip.value : '', budget: form.elements.budget.value, event_id: form.elements.event_id.value, form_location: form.elements.form_location.value };
      try { sessionStorage.setItem('moda_lead', JSON.stringify(lead)); } catch (err) {}
      push({ event: 'form_submit', estimate: lead.estimate, problem: lead.problem, service: lead.service, city: lead.city, zip: lead.zip, budget: lead.budget, form_location: lead.form_location });
      var btn = $('button[type=submit]', form); if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
      // Static preview (no form backend on localhost or GitHub Pages): go straight to the thank-you page.
      if (/^(localhost|127\.0\.0\.1|)$|\.github\.io$/.test(location.hostname)) { e.preventDefault(); location.href = form.getAttribute('action'); } // action already includes the base path (e.g. /lp/roofing/thank-you/)
    });
  });

  /* ---------- Problem tiles → estimate form ---------- */
  function preset(problem, service) {
    $$('form.qf').forEach(function (f) { f.dispatchEvent(new CustomEvent('qf:preset', { detail: { problem: problem, service: service } })); });
  }
  var qp = new URLSearchParams(location.search).get('problem');
  if (qp) preset(qp.slice(0, 80), '');
  d.addEventListener('click', function (e) {
    var a = e.target.closest('[data-problem]');
    if (!a) return;
    push({ event: 'problem_click', problem: a.getAttribute('data-problem'), service: a.getAttribute('data-service'), page_path: location.pathname });
    var card = $('#quote');
    if (!card) return; // no form here → follow the link to the service page's form
    e.preventDefault();
    preset(a.getAttribute('data-problem'), a.getAttribute('data-service'));
    card.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start' });
    var f = $('form.qf', card), active = f && ($('.qf-step.is-active select, .qf-step.is-active input:not([type=hidden])', f) || $('select, input:not([type=hidden])', f));
    setTimeout(function () {
      var top = card.getBoundingClientRect().top;
      if (top < -10 || top > w.innerHeight * 0.6) card.scrollIntoView({ block: 'start' }); // fallback if smooth scroll didn't run
      if (active) active.focus({ preventScroll: true });
    }, 700);
  });

  /* ---------- Instant price range (roofing page) ----------
     3 questions → ballpark taken from the cost table bands in services.js → hands the result to the quote form. */
  var est = $('[data-estimator]');
  if (est) {
    est.hidden = false;
    $$('.est-link').forEach(function (l) { l.hidden = false; });
    var cfg = JSON.parse($('#est-data', est).textContent);
    var qs = $$('.est__q', est), result = $('.est__result', est), back = $('.est__back', est);
    var bars = $$('.est__progress span', est), stepText = $('.est__steptext', est), cta = $('[data-cta="estimator-quote"]', est);
    var ans = {}, cur = 0, lastRange = '';
    var money = function (n) { return '$' + Math.round(n).toLocaleString('en-US'); };
    var r500 = function (n) { return Math.round(n / 500) * 500; };
    var find = function (list, id) { return list.filter(function (o) { return o.id === id; })[0]; };
    function showQ(n) {
      cur = n;
      qs.forEach(function (q, k) { q.classList.toggle('is-active', k === n); });
      result.hidden = n < qs.length;
      bars.forEach(function (b, k) { b.classList.toggle('on', k <= Math.min(n, qs.length - 1)); });
      stepText.textContent = n < qs.length ? 'Question ' + (n + 1) + ' of ' + qs.length : '';
      stepText.hidden = n >= qs.length;
      back.hidden = n === 0;
    }
    function compute() {
      var size = find(cfg.sizes, ans.size), mat = find(cfg.materials, ans.material), lay = find(cfg.layers, ans.layers);
      var summary = size.label + ' roof · ' + mat.label + ' · ' + lay.label.toLowerCase().replace('not sure', 'layers not sure');
      var range, note;
      if (!mat.bands) {
        range = 'Priced on-site';
        note = 'Metal roofs vary too much by profile and detailing for a fair ballpark — we measure and price them at your free inspection.';
      } else {
        var b = mat.bands[ans.size], lo = b[0], hi = b[1];
        if (hi === null) { range = money(lo) + '+'; }
        else {
          var span = hi - lo;
          if (ans.layers === 'one') hi = lo + span * 0.75;
          if (ans.layers === 'two') lo = lo + span * 0.25;
          range = money(r500(lo)) + ' – ' + money(r500(hi));
        }
        note = 'Based on our typical range for ' + mat.row.charAt(0).toLowerCase() + mat.row.slice(1) + '. Pitch, decking, flashing, ventilation and permits set the exact price — your written quote follows a free inspection.';
      }
      $('.est__range', est).textContent = range;
      $('.est__summary', est).textContent = summary;
      $('.est__note', est).textContent = note;
      lastRange = range;
      cta.setAttribute('data-problem', 'Instant estimate: ' + summary + ' (' + range + ')');
      push({ event: 'estimator_complete', size: ans.size, material: ans.material, layers: ans.layers, range: range });
    }
    $$('.est__opt', est).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var q = btn.getAttribute('data-q');
        ans[q] = btn.getAttribute('data-v');
        $$('.est__opt[data-q="' + q + '"]', est).forEach(function (o) { o.setAttribute('aria-pressed', String(o === btn)); });
        if (cur === 0) push({ event: 'estimator_start' });
        if (cur < qs.length - 1) { showQ(cur + 1); var first = $('.est__opt', qs[cur]); first && first.focus(); }
        else { compute(); showQ(qs.length); $('.est__range', est).focus(); }
      });
    });
    back.addEventListener('click', function () { showQ(Math.max(0, cur - 1)); var sel = $('.est__opt[aria-pressed="true"]', qs[cur]) || $('.est__opt', qs[cur]); sel && sel.focus(); });
    $('.est__restart', est).addEventListener('click', function () {
      ans = {}; $$('.est__opt', est).forEach(function (o) { o.setAttribute('aria-pressed', 'false'); });
      showQ(0); $('.est__opt', qs[0]).focus();
    });
    // Hand the range to the quote form (the [data-problem] handler below pre-fills service + problem and scrolls up).
    cta.addEventListener('click', function () {
      $$('form.qf').forEach(function (f) { if (f.elements.estimate) f.elements.estimate.value = lastRange; });
    });
  }

  /* Back button from thank-you page restores the page from cache — re-enable submit buttons */
  w.addEventListener('pageshow', function (e) {
    if (!e.persisted) return;
    $$('form.qf button[type=submit]').forEach(function (b) { b.disabled = false; b.textContent = 'Get My Free Estimate'; });
  });

  /* Thank-you page conversion event (counted once per lead) */
  if (d.body.hasAttribute('data-thankyou')) {
    var lead = null;
    try { lead = JSON.parse(sessionStorage.getItem('moda_lead')); sessionStorage.removeItem('moda_lead'); } catch (e) {}
    if (lead) push({ event: 'generate_lead', landing_page_variant: d.body.getAttribute('data-lp') || 'main', estimate: lead.estimate || '', problem: lead.problem, service: lead.service, zip: lead.zip, city: lead.city, budget: lead.budget, event_id: lead.event_id, form_location: lead.form_location });
  }

  /* ---------- Gallery filters (service, room, city; also from ?service= &room= &city=) ---------- */
  var gal = $('[data-gallery]');
  if (gal) {
    var fs = $('#f-service'), fr = $('#f-room'), fc = $('#f-city'), count = $('#f-count'), roomWrap = $('#f-room-wrap');
    var ROOM_SERVICES = ['', 'finished-basements', 'renovations']; // services that have room types
    var p = new URLSearchParams(location.search);
    [[fs, 'service'], [fr, 'room'], [fc, 'city']].forEach(function (x) {
      var v = p.get(x[1]); if (v && x[0] && $$('option', x[0]).some(function (o) { return o.value === v; })) x[0].value = v;
    });
    function apply() {
      var roomsOk = ROOM_SERVICES.indexOf(fs.value) > -1;
      if (roomWrap) roomWrap.hidden = !roomsOk;
      if (!roomsOk && fr) fr.value = '';
      var n = 0;
      $$('.proj', gal).forEach(function (el) {
        var ok = (!fs.value || el.dataset.service === fs.value) && (!fc.value || el.dataset.city === fc.value) && (!fr || !fr.value || el.dataset.room === fr.value);
        el.hidden = !ok; if (ok) n++;
      });
      if (count) count.textContent = n + (n === 1 ? ' project' : ' projects');
      var empty = $('#f-empty'); if (empty) empty.hidden = n > 0;
    }
    [fs, fr, fc].forEach(function (s) { s && s.addEventListener('change', apply); });
    apply();
  }

  /* ---------- Before / after sliders ---------- */
  // Before/after slider. Mouse: press-and-drag anywhere. Touch: a horizontal swipe drags, a vertical swipe
  // scrolls the page untouched, a tap jumps to that spot. The hidden range input handles keyboard (arrow keys).
  $$('.ba').forEach(function (ba) {
    var r = $('input[type=range]', ba), drag = null;
    function setPct(p) { p = Math.max(0, Math.min(100, p)); r.value = Math.round(p); ba.style.setProperty('--pos', p + '%'); }
    function fromX(x) { var b = ba.getBoundingClientRect(); setPct(((x - b.left) / b.width) * 100); }
    r.addEventListener('input', function () { setPct(Number(r.value)); });
    ba.addEventListener('dragstart', function (e) { e.preventDefault(); });
    ba.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      drag = { id: e.pointerId, x: e.clientX, y: e.clientY, touch: e.pointerType !== 'mouse', active: e.pointerType === 'mouse', moved: false };
      if (drag.active) { e.preventDefault(); fromX(e.clientX); try { ba.setPointerCapture(e.pointerId); } catch (err) {} }
    });
    ba.addEventListener('pointermove', function (e) {
      if (!drag || e.pointerId !== drag.id) return;
      var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (!drag.active) {
        if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
        drag.moved = true;
        if (Math.abs(dx) <= Math.abs(dy)) { drag = null; return; } // vertical → let the page scroll
        drag.active = true;
        try { ba.setPointerCapture(e.pointerId); } catch (err) {}
      }
      drag.moved = true;
      fromX(e.clientX);
    });
    function end(e) {
      if (!drag || e.pointerId !== drag.id) return;
      if (e.type === 'pointerup' && drag.touch && !drag.moved) fromX(e.clientX); // tap to jump
      drag = null;
    }
    ['pointerup', 'pointercancel'].forEach(function (t) { ba.addEventListener(t, end); });
    setPct(50); // always start centred (browsers may restore an old range value on reload/back)
  });

  /* ---------- Reviews carousel ---------- */
  var reduceMotion = w.matchMedia('(prefers-reduced-motion: reduce)');
  $$('[data-carousel]').forEach(function (wrap) {
    var track = $('.reviews', wrap), prev = $('[data-dir="-1"]', wrap), next = $('[data-dir="1"]', wrap);
    function stepW() { var c = track.children; return c.length > 1 ? c[1].offsetLeft - c[0].offsetLeft : track.clientWidth; }
    function maxX() { return track.scrollWidth - track.clientWidth; }
    function update() {
      if (prev) prev.disabled = track.scrollLeft <= 4;
      if (next) next.disabled = track.scrollLeft >= maxX() - 4;
    }
    function go(dir) {
      var sw = stepW(), target = (Math.round(track.scrollLeft / sw) + dir) * sw;
      track.scrollTo({ left: Math.max(0, Math.min(maxX(), target)), behavior: reduceMotion.matches ? 'auto' : 'smooth' });
      update(); setTimeout(update, 450);
    }
    if (prev) prev.addEventListener('click', function () { go(-1); });
    if (next) next.addEventListener('click', function () { go(1); });
    track.addEventListener('scroll', update, { passive: true });
    w.addEventListener('resize', update);
    update();
  });

  /* ---------- Cookie notice + Google Consent Mode ---------- */
  var banner = $('#cookie');
  function consent(granted) {
    var v = granted ? 'granted' : 'denied';
    if (typeof w.gtag === 'function') w.gtag('consent', 'update', { ad_storage: v, analytics_storage: v, ad_user_data: v, ad_personalization: v });
    push({ event: 'consent_update', consent: v });
  }
  var choice = store('moda_consent');
  if (choice === null && banner) banner.classList.add('show');
  else if (choice) consent(true);
  $$('[data-consent]').forEach(function (b) {
    b.addEventListener('click', function () {
      var ok = b.getAttribute('data-consent') === 'accept';
      store('moda_consent', ok); consent(ok);
      if (banner) banner.classList.remove('show');
    });
  });
  $$('[data-cookie-settings]').forEach(function (b) { b.addEventListener('click', function (e) { e.preventDefault(); banner && banner.classList.add('show'); }); });
})();
