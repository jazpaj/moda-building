// Shared HTML helpers, icons and components.
const site = require('../data/site.json');
const services = require('../data/services');
const cities = require('../data/cities');

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const isPh = (v) => typeof v === 'string' && v.trim().startsWith('[');
// Render a value; owner-supplied placeholders (in [brackets]) render as a visible highlight.
const val = (v) => (isPh(v) ? `<mark class="ph">${esc(v.replace(/^\[|\]$/g, ''))}</mark>` : esc(v));
// has(): a real, owner-confirmed value is present (empty or [bracketed] = unknown → show neutral copy instead).
const has = (v) => (typeof v === 'string' ? v.trim() !== '' && !isPh(v) : !!v);
const hasAddress = () => has(site.address.street) && has(site.address.city) && has(site.address.zip);
const hasRating = () => has(site.googleRating) && has(site.googleReviewCount);
const telHref = (p) => 'tel:+1' + p.replace(/\D/g, '').slice(-10);
const svcBy = (k) => services.find((s) => s.key === k);
const cityBy = (k) => cities.find((c) => c.key === k);
const svcUrl = (s) => `/${s.slug}/`;
const cityUrl = (s, c) => `/${s.slug}/${c.slug}/`;
const coreCities = cities.filter((c) => !c.isRegion);

const ICON = {
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke-width="1.8"/><path d="m8 12 3 3 5-6"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/></svg>',
  award: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="6"/><path d="M15.5 13 17 22l-5-3-5 3 1.5-9"/></svg>',
  dollar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 12h.01M18 12h.01"/></svg>',
  clipboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="4" width="14" height="18" rx="2"/><path d="M9 2h6v4H9zM9 12h6M9 16h4"/></svg>',
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11 12 3l9 8"/><path d="M5 10v11h14V10"/><path d="M10 21v-6h4v6"/></svg>',
  ruler: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 17 17 3l4 4L7 21z"/><path d="m7 13 2 2M10 10l2 2M13 7l2 2"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="8" r="4"/><path d="M1 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/><path d="M17 4a4 4 0 0 1 0 8M23 21v-1a6 6 0 0 0-4-5.6"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v8h4v-8h3l1-4h-4V8z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
  houzz: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 2v20h5v-6h2v6h5V9l-7-2V2z"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 8.2a3 3 0 0 0-2-2C18.2 5.7 12 5.7 12 5.7s-6.2 0-8 .5a3 3 0 0 0-2 2A31 31 0 0 0 1.6 12 31 31 0 0 0 2 15.8a3 3 0 0 0 2 2c1.8.5 8 .5 8 .5s6.2 0 8-.5a3 3 0 0 0 2-2 31 31 0 0 0 .4-3.8 31 31 0 0 0-.4-3.8zM10 15.2V8.8l5.2 3.2z"/></svg>'
};

const LOGO = `<span class="logo__mark" aria-hidden="true"><svg viewBox="0 0 40 40" width="40" height="40"><rect width="40" height="40" rx="9" fill="currentColor"/><path d="M8 22 20 11l12 11" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M13 21v9h14v-9" fill="none" stroke="#fff" stroke-width="3.2" stroke-linejoin="round"/></svg></span><span class="logo__word">MODA<small>BUILDING</small></span>`;

// Photos live in src/img/photos/<name>.webp (+ <name>-800.webp for phones). Missing photos fall back to SVG placeholders.
const fs = require('fs');
const path = require('path');
const PHOTO_DIR = path.join(__dirname, '../img/photos');
const hasPhoto = (name) => fs.existsSync(path.join(PHOTO_DIR, name + '.webp'));
const pic = (name) => (hasPhoto(name) ? `/img/photos/${name}.webp` : `/img/ph/${name}.svg`);
function webpWidth(file) {
  const b = fs.readFileSync(file);
  const fmt = b.toString('ascii', 12, 16);
  if (fmt === 'VP8X') return 1 + b.readUIntLE(24, 3);
  if (fmt === 'VP8 ') return b.readUInt16LE(26) & 0x3fff;
  if (fmt === 'VP8L') return 1 + (b.readUInt32LE(21) & 0x3fff);
  return 1200;
}
const SIZES = '(min-width: 1000px) 33vw, (min-width: 700px) 50vw, 100vw';
function srcAttrs(src, sizes = SIZES) {
  const m = src.match(/^\/img\/photos\/(.+)\.webp$/);
  if (!m || !fs.existsSync(path.join(PHOTO_DIR, m[1] + '-800.webp'))) return `src="${src}"`;
  return `src="${src}" srcset="/img/photos/${m[1]}-800.webp 800w, ${src} ${webpWidth(path.join(PHOTO_DIR, m[1] + '.webp'))}w" sizes="${sizes}"`;
}
const img = (src, alt, { eager = false, cls = '', w = 1200, h = 800, sizes } = {}) =>
  `<img ${srcAttrs(src, sizes)} alt="${esc(alt)}" width="${w}" height="${h}"${cls ? ` class="${cls}"` : ''} ${eager ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"'}>`;

const callBtn = (loc, cls = 'btn btn--ghost', label) =>
  `<a class="${cls}" href="${telHref(site.phone)}" data-loc="${loc}">${ICON.phone}<span>${label || 'Call ' + esc(site.phone)}</span></a>`;
const quoteBtn = (loc, label = 'Get a Free Estimate', href = '#quote') => `<a class="btn btn--cta" href="${href}" data-cta="${loc}">${label}</a>`;

function stars(n) { const r = Math.round(n); return '★★★★★'.slice(0, r) + '☆☆☆☆☆'.slice(0, 5 - r); }

/* ---------- Lead form ---------- */
let formCount = 0;
function quoteForm({ service = '', city = '', location = 'page', title = 'Get your free estimate', sub = 'Takes about 60 seconds. We reply within one business day — usually much sooner.', id = 'quote', heading = 'h2' } = {}) {
  const n = ++formCount;
  const f = (name) => `f${n}-${name}`;
  const svcOpts = ['Roofing', 'Basement Waterproofing', 'Finished Basement', 'Full Renovation', 'Other']
    .map((o) => `<option${o === service ? ' selected' : ''}>${o}</option>`).join('');
  const cityOpts = coreCities.map((c) => `<option${c.name === city ? ' selected' : ''}>${c.name}</option>`).join('') + '<option value="Other">Other city in Metro Detroit</option>';
  const budgetOpts = site.budgets.map((b) => `<option>${esc(b)}</option>`).join('');
  const hidden = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'gbraid', 'wbraid', 'fbclid', 'msclkid', 'first_touch', 'landing_page', 'referrer', 'page_url', 'fbp', 'fbc', 'event_id']
    .map((h) => `<input type="hidden" name="${h}">`).join('');
  const turnstile = site.tracking.turnstileSiteKey ? `<div class="cf-turnstile" data-sitekey="${esc(site.tracking.turnstileSiteKey)}" data-size="flexible"></div>` : '';
  return `<div class="qf-card" id="${id}">
  <${heading} class="qf-title">${esc(title)}</${heading}>
  <p class="qf-sub">${esc(sub)}</p>
  <form class="qf on-first" name="estimate" method="POST" action="/thank-you/" data-netlify="true" netlify-honeypot="company_website" enctype="multipart/form-data" novalidate>
    <input type="hidden" name="form-name" value="estimate">
    <input type="hidden" name="form_location" value="${esc(location)}">
    ${hidden}
    <div class="hp" aria-hidden="true"><label for="${f('hp')}">Leave this field empty</label><input id="${f('hp')}" name="company_website" tabindex="-1" autocomplete="off"></div>
    <p class="qf-steptext" aria-live="polite">Step 1 of 3</p>
    <div class="qf-progress" aria-hidden="true"><span class="on"></span><span></span><span></span></div>

    <fieldset class="qf-step is-active">
      <legend class="sr-only">Your project</legend>
      <div class="field"><label for="${f('service')}">Service desired</label>
        <select id="${f('service')}" name="service" required aria-describedby="${f('service')}-e"><option value="">Choose a service</option>${svcOpts}</select>
        <p class="err" id="${f('service')}-e">Please choose a service.</p></div>
    </fieldset>

    <fieldset class="qf-step">
      <legend class="sr-only">Location and budget</legend>
      <div class="row2">
        <div class="field"><label for="${f('city')}">City</label>
          <select id="${f('city')}" name="city" required aria-describedby="${f('city')}-e"><option value="">Select city</option>${cityOpts}</select>
          <p class="err" id="${f('city')}-e">Please choose your city.</p></div>
        <div class="field"><label for="${f('budget')}">Budget</label>
          <select id="${f('budget')}" name="budget" required aria-describedby="${f('budget')}-e"><option value="">Select range</option>${budgetOpts}</select>
          <p class="err" id="${f('budget')}-e">Please choose a budget range.</p></div>
      </div>
      <div class="field other-city"><label for="${f('city_other')}">Your city or ZIP code</label>
        <input id="${f('city_other')}" name="city_other" autocomplete="address-level2" aria-describedby="${f('city_other')}-e">
        <p class="err" id="${f('city_other')}-e">Please enter your city or ZIP.</p></div>
      <div class="field"><label for="${f('address')}">Street address <span class="opt">(optional)</span></label>
        <input id="${f('address')}" name="address" autocomplete="street-address"></div>
    </fieldset>

    <fieldset class="qf-step">
      <legend class="sr-only">Contact information</legend>
      <div class="field"><label for="${f('name')}">Full name</label>
        <input id="${f('name')}" name="name" autocomplete="name" required aria-describedby="${f('name')}-e">
        <p class="err" id="${f('name')}-e">Please enter your name.</p></div>
      <div class="row2">
        <div class="field"><label for="${f('phone')}">Phone number</label>
          <input id="${f('phone')}" name="phone" type="tel" inputmode="tel" autocomplete="tel-national" placeholder="(248) 000-0000" required aria-describedby="${f('phone')}-e">
          <p class="err" id="${f('phone')}-e">Please enter a 10-digit US phone number.</p></div>
        <div class="field"><label for="${f('email')}">Email</label>
          <input id="${f('email')}" name="email" type="email" inputmode="email" autocomplete="email" required aria-describedby="${f('email')}-e">
          <p class="err" id="${f('email')}-e">Please enter a valid email address.</p></div>
      </div>
      <details class="qf-more"><summary>Add project details or a photo <span class="opt">(optional)</span></summary>
      <div class="field"><label for="${f('message')}">Tell us about your project</label>
        <textarea id="${f('message')}" name="message" rows="3"></textarea></div>
      <div class="field"><label for="${f('photo')}">Add a photo <span class="opt">(great for roof or leak damage)</span></label>
        <input id="${f('photo')}" name="photo" type="file" accept="image/*" aria-describedby="${f('photo')}-e">
        <p class="err" id="${f('photo')}-e">Please choose an image under 8 MB.</p></div>
      </details>
      ${turnstile}
    </fieldset>

    <div class="qf-nav">
      <button type="button" class="btn btn--ghost qf-back" aria-label="Previous step">Back</button>
      <button type="button" class="btn btn--cta qf-next">Continue</button>
    </div>
    <div class="qf-submit-wrap"><button type="submit" class="btn btn--cta btn--block">Get My Free Estimate</button></div>
    <p class="consent">By submitting, you agree Moda Building may contact you by phone, text or email about your project. No spam, ever. See our <a href="/privacy-policy/">privacy policy</a>.</p>
  </form>
  <div class="qf-trust"><span>Free, no-obligation</span><span>Licensed &amp; insured</span><span>Fast response</span></div>
</div>`;
}

/* ---------- Header / footer ---------- */
function navData() {
  return services.map((s) => ({
    s,
    subs: s.subservices.filter((x) => x.id !== 'cost-ranges' && x.id !== 'warranty').slice(0, 6),
    cities: s.cityKeys.map(cityBy)
  }));
}

function header({ minimal = false, current = '' } = {}) {
  const preview = site.preview ? `<div class="preview-bar" role="note"><strong>Preview build:</strong> highlighted items, sample reviews and illustrated placeholder photos are awaiting real content from Moda Building.</div>` : '';
  if (minimal) {
    return `${preview}<header class="header lp-header"><div class="wrap header__in">
  <span class="logo" aria-label="Moda Building">${LOGO}</span>
  <a class="header__phone" href="${telHref(site.phone)}" data-loc="header"><small>Free estimate — call</small>${esc(site.phone)}</a>
</div></header>`;
  }
  const nd = navData();
  const desktop = nd.map(({ s, subs, cities: cs }) => `<li><button type="button" aria-expanded="false"${current === s.key ? ' aria-current="true"' : ''}>${esc(s.navLabel)}</button>
    <div class="dd dd--wide"><div><p class="dd__label">${esc(s.short)} services</p><a href="${svcUrl(s)}">${esc(s.name)} overview</a>${subs.map((x) => `<a href="${svcUrl(s)}#${x.id}">${esc(x.title.replace(/ and .*$| &.*$/, ''))}</a>`).join('')}</div>
    <div><p class="dd__label">${esc(s.short)} by city</p>${cs.map((c) => `<a href="${cityUrl(s, c)}">${esc(c.name)}</a>`).join('')}</div></div></li>`).join('');
  const company = [['About', '/about/'], ['Gallery', '/gallery/'], ['Reviews', '/reviews/'], ['Financing', '/financing/'], ['Blog', '/blog/'], ['Contact', '/contact/']];
  const mobile = nd.map(({ s, cities: cs }) => `<li><details><summary>${esc(s.name)}</summary><ul><li><a href="${svcUrl(s)}">${esc(s.name)} overview</a></li>${cs.map((c) => `<li><a href="${cityUrl(s, c)}">${esc(s.short)} in ${esc(c.name)}</a></li>`).join('')}</ul></details></li>`).join('');
  return `${preview}<header class="header"><div class="wrap header__in">
  <a class="logo" href="/" aria-label="Moda Building home">${LOGO}</a>
  <nav class="nav" aria-label="Main"><ul>${desktop}
    <li><button type="button" aria-expanded="false">Company</button><div class="dd">${company.map(([l, h]) => `<a href="${h}">${l}</a>`).join('')}</div></li>
  </ul></nav>
  <div class="header__actions">
    <a class="header__phone" href="${telHref(site.phone)}" data-loc="header"><small>Call for a free estimate</small>${esc(site.phone)}</a>
    <a class="icon-btn call-icon" href="${telHref(site.phone)}" data-loc="header-icon" aria-label="Call ${esc(site.phone)}">${ICON.phone}</a>
    ${quoteBtn('header')}
    <button class="icon-btn menu-toggle" type="button" aria-expanded="false" aria-controls="mnav" aria-label="Menu">${ICON.menu}</button>
  </div>
</div>
<nav class="mnav" id="mnav" aria-label="Mobile"><ul>${mobile}
  ${company.map(([l, h]) => `<li><a href="${h}">${l}</a></li>`).join('')}
</ul><a class="btn btn--cta btn--block" href="/contact/" data-cta="mobile-menu">Get a Free Estimate</a></nav>
</header>`;
}

function mobileBar() {
  return `<div class="mbar" role="region" aria-label="Quick contact">${callBtn('sticky-bar', 'btn btn--ghost', 'Call')}<a class="btn btn--cta" href="#quote" data-cta="sticky-bar">Get Quote</a></div>`;
}

function trustStrip() {
  const items = [
    [ICON.shield, 'Licensed &amp; insured', has(site.license) ? `Lic. ${esc(site.license)}` : 'Michigan residential builder'],
    has(site.yearsInBusiness) ? [ICON.calendar, `${esc(site.yearsInBusiness)} years in business`, 'Locally owned'] : [ICON.calendar, 'Locally owned &amp; operated', 'Serving all of Metro Detroit'],
    hasRating() ? [ICON.star, `${esc(site.googleRating)}★ Google rating`, `${esc(site.googleReviewCount)} reviews`] : [ICON.clipboard, 'Free written estimates', 'No pressure, no surprises'],
    [ICON.award, 'Warranties', esc(site.warranty)],
    [ICON.dollar, 'Financing available', 'On qualifying projects']
  ];
  return `<section class="trust" aria-label="Why homeowners trust us"><div class="wrap"><ul>${items.map(([i, a, b]) => `<li>${i}<span>${a}<small>${b}</small></span></li>`).join('')}</ul></div></section>`;
}

function footer({ minimal = false } = {}) {
  const addr = site.address;
  const year = new Date().getFullYear();
  const hours = site.hours.map((h) => `<li>${esc(h.days)}: ${esc(h.open)}${h.close ? '–' + esc(h.close) : ''}</li>`).join('');
  const social = Object.entries(site.social).map(([k, u]) => (u ? `<a href="${esc(u)}" rel="noopener" aria-label="${k}">${ICON[k]}</a>` : '')).join('');
  const nap = `<address><strong style="color:#fff">${esc(site.name)}</strong><br>${hasAddress() ? `${esc(addr.street)}<br>${esc(addr.city)}, ${esc(addr.region)} ${esc(addr.zip)}` : 'Serving Oakland County &amp;<br>all of Metro Detroit, MI'}<br><a href="${telHref(site.phone)}" data-loc="footer">${esc(site.phone)}</a><br><a href="mailto:${esc(site.email)}">${esc(site.email)}</a></address>`;
  const cookieUi = `<div class="cookie" id="cookie" role="dialog" aria-live="polite" aria-label="Cookie notice"><p>We use cookies to measure our ads and improve this site. You can accept or decline non-essential cookies. <a href="/privacy-policy/#cookies">Read our cookie policy</a></p><div class="btns"><button class="btn btn--ghost" type="button" data-consent="decline">Decline</button><button class="btn btn--ghost" type="button" data-consent="accept" style="background:var(--ink);color:#fff">Accept</button></div></div>`;
  if (minimal) {
    return `<footer class="footer"><div class="wrap">${nap}<div class="footer__bottom"><span>© ${year} ${esc(site.name)}${has(site.license) ? ` · License ${esc(site.license)}` : ' · Licensed &amp; insured in Michigan'}</span><span><a href="/privacy-policy/">Privacy policy</a> · <a href="#" data-cookie-settings>Cookie settings</a></span></div></div></footer>${cookieUi}`;
  }
  return `<footer class="footer"><div class="wrap">
  <div class="footer__grid">
    <div><a class="logo" href="/" aria-label="Moda Building home">${LOGO}</a>${nap}
      <p style="margin-top:12px">${has(site.license) ? `License ${esc(site.license)}<br>` : ''}Licensed &amp; insured in Michigan</p>
      ${social ? `<div class="footer__social">${social}</div>` : ''}</div>
    <div><h2>Services</h2><ul>${services.map((s) => `<li><a href="${svcUrl(s)}">${esc(s.name)}</a></li>`).join('')}<li><a href="/financing/">Financing</a></li><li><a href="/gallery/">Project gallery</a></li></ul>
      <h2 style="margin-top:28px">Hours</h2><ul>${hours}</ul></div>
    <div><h2>Service areas</h2><ul>${cities.map((c) => `<li><a href="${cityUrl(services[0], c)}">${c.isRegion ? 'All of Metro Detroit' : esc(c.name) + ', MI'}</a></li>`).join('')}</ul></div>
    <div><h2>Company</h2><ul><li><a href="/about/">About us</a></li><li><a href="/reviews/">Reviews</a></li><li><a href="/blog/">Blog</a></li><li><a href="/contact/">Contact / Free estimate</a></li><li><a href="/privacy-policy/">Privacy policy</a></li></ul></div>
  </div>
  <div class="footer__bottom"><span>© ${year} ${esc(site.name)}. All rights reserved.</span><span><a href="/privacy-policy/">Privacy policy</a> · <a href="#" data-cookie-settings>Cookie settings</a> · <a href="/sitemap.xml">Sitemap</a></span></div>
</div></footer>${cookieUi}`;
}

/* ---------- Content components ---------- */
function crumbs(list) {
  return `<nav class="crumbs wrap" aria-label="Breadcrumb"><ol>${list.map(([n, u], i) => (i === list.length - 1 ? `<li aria-current="page">${esc(n)}</li>` : `<li><a href="${u}">${esc(n)}</a></li>`)).join('')}</ol></nav>`;
}

const PROCESS = [
  ['Inspect', 'A free, no-pressure visit. We inspect, measure and photograph — then show you exactly what we found.'],
  ['Quote', 'A clear, line-item written quote with options. No high-pressure tactics, no vague allowances.'],
  ['Build', 'A dedicated project lead, a protected home and a clean site every day. You always know what is next.'],
  ['Warranty', 'Final walkthrough, warranty registration and documentation. We stand behind the work after we leave.']
];
function processSection({ dark = false, title = 'How it works', intro = 'Four simple steps from first call to finished project.' } = {}) {
  return `<section class="section${dark ? ' section--ink' : ' section--stone'}"><div class="wrap">
  <div class="section-head"><span class="eyebrow">Our process</span><h2>${esc(title)}</h2><p class="lead"${dark ? ' style="color:#c9d1d9"' : ''}>${esc(intro)}</p></div>
  <ol class="process">${PROCESS.map(([h, p]) => `<li><h3>${h}</h3><p>${p}</p></li>`).join('')}</ol>
</div></section>`;
}

function reviewCard(r) {
  const c = cityBy(r.city), s = svcBy(r.service);
  return `<figure class="review"><div class="stars" aria-label="${r.rating} out of 5 stars">${stars(r.rating)}</div>
  <blockquote><p>${esc(r.text)}</p></blockquote>
  <figcaption><strong>${esc(r.name)}</strong>${r.sample ? '<span class="sample-tag">Sample</span>' : ''}<br>${esc(r.label || s.short)} · ${esc(c.name)}, MI</figcaption></figure>`;
}

function reviewsCarousel(list, { title = 'What homeowners say', eyebrow = 'Reviews', stone = false, intro = '' } = {}) {
  if (!list.length) return '';
  return `<section class="section${stone ? ' section--stone' : ''}"><div class="wrap" data-carousel>
  <div class="section-head"><span class="eyebrow">${esc(eyebrow)}</span><h2>${esc(title)}</h2>
  <div class="rating-summary">${hasRating() ? `<span class="big">${esc(site.googleRating)}</span><span><span class="stars" style="color:#b7791f">★★★★★</span><br>${esc(site.googleReviewCount)} Google reviews</span>` : ''}<a class="link-arrow" href="/reviews/">Read reviews</a></div>${intro ? `<p class="lead" style="margin-top:12px">${intro}</p>` : ''}</div>
  <div class="reviews" tabindex="0" aria-label="Customer reviews">${list.map(reviewCard).join('')}</div>
  <div class="carousel-nav"><button class="icon-btn" type="button" data-dir="-1" aria-label="Previous reviews">←</button><button class="icon-btn" type="button" data-dir="1" aria-label="Next reviews">→</button></div>
</div></section>`;
}

function projectCard(p, { slider = true } = {}) {
  const s = svcBy(p.service), c = cityBy(p.city);
  const after = pic(`${p.id}-after`), before = pic(`${p.id}-before`);
  const altBase = `${p.title} — ${s.short.toLowerCase()} project in ${c.name}, MI`;
  const media = p.before && slider
    ? `<div class="ba">${img(after, `After: ${altBase}`)}${img(before, `Before: ${altBase}`, { cls: 'ba__before' })}<span class="ba__line"></span><span class="ba__tag ba__tag--b">Before</span><span class="ba__tag ba__tag--a">After</span><input type="range" min="0" max="100" value="50" aria-label="Drag to compare before and after: ${esc(p.title)}"></div>`
    : `<div class="card__img">${img(after, altBase)}</div>`;
  return `<article class="proj" data-service="${p.service}" data-city="${p.city}">${media}<div class="proj__body"><p class="proj__meta">${esc(s.short)} · ${esc(c.name)}</p><h3>${esc(p.title)}</h3><p>${esc(p.scope)}</p></div></article>`;
}

function faqSection(items, { title = 'Frequently asked questions', stone = false } = {}) {
  return `<section class="section${stone ? ' section--stone' : ''}" id="faq"><div class="wrap"><div class="section-head"><span class="eyebrow">FAQ</span><h2>${esc(title)}</h2></div>
  <div class="faq">${items.map((f, i) => `<details${i === 0 ? ' open' : ''}><summary>${esc(f.q)}</summary><div><p>${esc(f.a)}</p></div></details>`).join('')}</div></div></section>`;
}

function ctaBand({ service = '', city = '', title = 'Ready for a free estimate?', text = 'Tell us about your project and we will schedule a free, no-pressure visit. Prefer to talk? Call us now.' } = {}) {
  return `<section class="cta-band" aria-labelledby="cta-h"><div class="wrap split">
  <div><span class="eyebrow" style="color:#9aa7b4">Free estimate</span><h2 id="cta-h">${esc(title)}</h2><p>${esc(text)}</p>
    <a class="phone-big" href="${telHref(site.phone)}" data-loc="cta-band">${esc(site.phone)}</a>
    <ul class="hero__bullets">${['Free inspection and written quote', 'Licensed, insured, warrantied work', 'Financing available on qualifying projects'].map((b) => `<li>${ICON.check}${b}</li>`).join('')}</ul></div>
  ${quoteForm({ service, city, location: 'cta-band', id: 'quote-2', title: 'Request your free estimate' })}
</div></section>`;
}

function areasSection({ dark = false, title = 'Areas we serve', intro = '' } = {}) {
  const cards = coreCities.map((c) => {
    const links = services.filter((s) => s.cityKeys.includes(c.key)).map((s) => `<li><a href="${cityUrl(s, c)}">${esc(s.short)}</a></li>`).join('');
    return `<div class="area"><h3>${esc(c.name)}, MI</h3><ul>${links}</ul></div>`;
  }).join('');
  const metro = `<div class="area"><h3>All of Metro Detroit</h3><ul><li><a href="${cityUrl(services[0], cityBy('metro-detroit'))}">Roofing</a></li><li><a href="${cityUrl(services[1], cityBy('metro-detroit'))}">Waterproofing</a></li></ul></div>`;
  return `<section class="section${dark ? ' section--ink' : ''}" id="areas"><div class="wrap">
  <div class="section-head"><span class="eyebrow">Service areas</span><h2>${esc(title)}</h2><p class="lead"${dark ? ' style="color:#c9d1d9"' : ''}>${intro || 'Roofing and waterproofing across all of Metro Detroit. Finished basements and full renovations focused on six Oakland County communities.'}</p></div>
  <div class="areas">${cards}${metro}</div></div></section>`;
}

function financingCallout() {
  return `<section class="section"><div class="wrap"><div class="callout">
  <div><span class="eyebrow">Financing</span><h2>${esc(site.financing.headline)}</h2><p>Spread the cost of a new roof, a dry basement or a full renovation into manageable monthly payments. ${esc(site.financing.terms)}</p></div>
  <div style="display:flex;gap:12px;flex-wrap:wrap"><a class="btn btn--cta" href="/financing/" data-cta="financing-callout">See financing options</a></div>
</div></div></section>`;
}

module.exports = { has, hasAddress, hasRating, pic, hasPhoto, site, services, cities, coreCities, esc, val, isPh, telHref, svcBy, cityBy, svcUrl, cityUrl, ICON, LOGO, img, callBtn, quoteBtn, quoteForm, header, footer, mobileBar, trustStrip, crumbs, processSection, reviewCard, reviewsCarousel, projectCard, faqSection, ctaBand, areasSection, financingCallout, PROCESS };
