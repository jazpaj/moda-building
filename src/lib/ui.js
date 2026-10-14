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
// Rating / reviews only show once the owner has verified them (site.json ratingVerified / reviewsVerified).
const hasRating = () => site.ratingVerified === true && has(site.googleRating) && has(site.googleReviewCount);
const ALL_REVIEWS = require('../data/reviews');
const liveReviews = () => (site.reviewsVerified === true ? ALL_REVIEWS.filter((r) => !r.sample) : []);
const reviewsPageLive = () => has(site.googleReviewsEmbed) || has(site.googleReviewUrl) || liveReviews().length >= 3;
const financingPageLive = () => has(site.financing.partner) && has(site.financing.applyUrl);
const lpPhone = () => (has(site.trackingPhone) ? site.trackingPhone : site.phone); // call-tracking number: landing pages only
const telHref = (p) => 'tel:+1' + p.replace(/\D/g, '').slice(-10);
const svcBy = (k) => services.find((s) => s.key === k);
const cityBy = (k) => cities.find((c) => c.key === k);
const svcUrl = (s) => `/${s.slug}/`;
const cityUrl = (s, c) => `/${s.slug}/${c.slug}/`;
const coreCities = cities.filter((c) => !c.isRegion);

const ICON = {
  drop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2.7S5 10.4 5 15a7 7 0 0 0 14 0c0-4.6-7-12.3-7-12.3z"/></svg>',
  storm: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.5 17H7a5 5 0 1 1 1-9.9A6 6 0 0 1 19.5 9 4 4 0 0 1 17.5 17z"/><path d="m13 13-2 4h3l-2 4"/></svg>',
  gutter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18v3a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3z"/><path d="M17 12v8M14 20h6"/></svg>',
  crack: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="m11 3-2 5 4 3-3 4 2 6"/></svg>',
  pump: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="7" y="9" width="10" height="12" rx="2"/><path d="M12 9V3M9 3h6M10 14h4"/></svg>',
  wind: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8h11a3 3 0 1 0-3-3M3 12h16a3 3 0 1 1-3 3M3 16h7"/></svg>',
  sofa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 11V8a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v3"/><path d="M2 13a2 2 0 0 1 4 0v2h12v-2a2 2 0 0 1 4 0v5H2z"/><path d="M5 18v2M19 18v2"/></svg>',
  bed: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 18V6M3 13h18v5M21 13a4 4 0 0 0-4-4h-7v4"/><circle cx="7" cy="10" r="1.6"/></svg>',
  kitchen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 10h18M8 6h.01M12 6h.01M8 14v3"/></svg>',
  layout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 12h9V3M12 17h9"/></svg>',
  bath: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12h18v3a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5z"/><path d="M6 12V5a2 2 0 0 1 4 0M7 20l-1 2M17 20l1 2"/></svg>',
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

// Owner-supplied logo (cut out from the supplied artwork; sources in /brand-source). Light version is for dark backgrounds.
const LOGO_W = 609, LOGO_H = 132;
const logoImg = ({ light = false, alt = '' } = {}) =>
  `<img class="logo__img" src="/assets/brand/${light ? 'logo-light' : 'logo'}.webp" alt="${alt}" width="${LOGO_W}" height="${LOGO_H}" decoding="async">`;
const LOGO = logoImg();

// Photos live in src/img/photos/<name>.webp (+ <name>-800.webp for phones). Missing photos fall back to SVG placeholders.
const fs = require('fs');
const path = require('path');
const PHOTO_DIR = path.join(__dirname, '../img/photos');
const hasPhoto = (name) => fs.existsSync(path.join(PHOTO_DIR, name + '.webp'));
const pic = (name) => (hasPhoto(name) ? `/img/photos/${name}.webp` : `/img/ph/${name}.svg`);
const picUrl = (name) => (hasPhoto(name) ? `${pic(name)}?v=${ver(path.join(PHOTO_DIR, name + '.webp'))}` : pic(name));
function webpWidth(file) {
  const b = fs.readFileSync(file);
  const fmt = b.toString('ascii', 12, 16);
  if (fmt === 'VP8X') return 1 + b.readUIntLE(24, 3);
  if (fmt === 'VP8 ') return b.readUInt16LE(26) & 0x3fff;
  if (fmt === 'VP8L') return 1 + (b.readUInt32LE(21) & 0x3fff);
  return 1200;
}
const SIZES = '(min-width: 1000px) 33vw, (min-width: 700px) 50vw, 100vw';
// ?v=<content hash> so replaced photos (same filename) are never served stale from browser/CDN caches.
const ver = (file) => require('crypto').createHash('md5').update(fs.readFileSync(file)).digest('hex').slice(0, 8);
function srcAttrs(src, sizes = SIZES) {
  const m = src.match(/^\/img\/photos\/(.+)\.webp$/);
  if (!m) return `src="${src}"`;
  const full = path.join(PHOTO_DIR, m[1] + '.webp'), small = path.join(PHOTO_DIR, m[1] + '-800.webp');
  const fullUrl = `${src}?v=${ver(full)}`;
  if (!fs.existsSync(small)) return `src="${fullUrl}"`;
  return `src="${fullUrl}" srcset="/img/photos/${m[1]}-800.webp?v=${ver(small)} 800w, ${fullUrl} ${webpWidth(full)}w" sizes="${sizes}"`;
}
const img = (src, alt, { eager = false, cls = '', w = 1200, h = 800, sizes } = {}) =>
  `<img ${srcAttrs(src, sizes)} alt="${esc(alt)}" width="${w}" height="${h}"${cls ? ` class="${cls}"` : ''} ${eager ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"'}>`;

const callBtn = (loc, cls = 'btn btn--ghost', label, phone = site.phone) =>
  `<a class="${cls}" href="${telHref(phone)}" data-loc="${loc}">${ICON.phone}<span>${label || 'Call ' + esc(phone)}</span></a>`;
const quoteBtn = (loc, label = 'Get a Free Estimate', href = '#quote') => `<a class="btn btn--cta" href="${href}" data-cta="${loc}">${label}</a>`;

function stars(n) { const r = Math.round(n); return '★★★★★'.slice(0, r) + '☆☆☆☆☆'.slice(0, 5 - r); }


/* ---------- Lead form ----------
   One form, reused site-wide. Desktop: single step. Phones: steps.
   variant 'main' → 3 steps (Service → ZIP/Budget/Address → Contact)
   variant 'lp'   → 2 steps (Service + ZIP + Budget → Contact), as specified for the ad landing pages. */
const MAIN_SERVICES = ['Roofing', 'Basement Waterproofing', 'Finished Basement', 'Full Renovation', 'Other'];
let formCount = 0;
function quoteForm({ service = '', city = '', location = 'page', title = 'Get your free estimate', sub = 'Takes about 60 seconds. We reply within one business day — usually much sooner.', id = 'quote', heading = 'h2', action = '/thank-you/', options = MAIN_SERVICES, variant = 'main', photo = true, address = true, submitLabel = 'Get My Free Estimate', serviceLabel = 'Service desired' } = {}) {
  const n = ++formCount;
  const f = (name) => `f${n}-${name}`;
  const svcOpts = options.map((o) => `<option${o === service ? ' selected' : ''}>${esc(o)}</option>`).join('');
  const budgetOpts = site.budgets.map((b) => `<option>${esc(b)}</option>`).join('');
  const hidden = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'gbraid', 'wbraid', 'fbclid', 'msclkid', 'first_touch', 'landing_page', 'referrer', 'page_url', 'fbp', 'fbc', 'event_id']
    .map((h) => `<input type="hidden" name="${h}">`).join('');
  const turnstile = site.tracking.turnstileSiteKey ? `<div class="cf-turnstile" data-sitekey="${esc(site.tracking.turnstileSiteKey)}" data-size="flexible"></div>` : '';
  const serviceField = `<div class="field"><label for="${f('service')}">${esc(serviceLabel)}</label>
        <select id="${f('service')}" name="service" required aria-describedby="${f('service')}-e"><option value="">Choose one</option>${svcOpts}</select>
        <p class="err" id="${f('service')}-e">Please choose an option.</p></div>`;
  const zipField = `<div class="field"><label for="${f('zip')}">ZIP code</label>
          <input id="${f('zip')}" name="zip" inputmode="numeric" autocomplete="postal-code" maxlength="5" placeholder="e.g. 48009" required aria-describedby="${f('zip')}-e">
          <p class="err" id="${f('zip')}-e">Please enter a 5-digit ZIP code.</p></div>`;
  const budgetField = `<div class="field"><label for="${f('budget')}">Budget <span class="opt">(optional)</span></label>
          <select id="${f('budget')}" name="budget"><option value="">Select range</option>${budgetOpts}</select></div>`;
  const addressField = address ? `<div class="field"><label for="${f('address')}">Street address <span class="opt">(optional)</span></label>
        <input id="${f('address')}" name="address" autocomplete="street-address"></div>` : '';
  const photoField = `<div class="field"><label for="${f('photo')}">Add a photo <span class="opt">(great for roof or leak damage)</span></label>
        <input id="${f('photo')}" name="photo" type="file" accept="image/*" aria-describedby="${f('photo')}-e">
        <p class="err" id="${f('photo')}-e">Please choose an image under 8 MB.</p></div>`;
  const contact = `<div class="field"><label for="${f('name')}">Full name</label>
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
      <div class="field qf-check">
        <input type="checkbox" id="${f('sms')}" name="sms_consent" value="yes">
        <label for="${f('sms')}">Text me updates about my estimate <span class="opt">(optional)</span>
          <small>By checking this box, you agree to receive text messages from Moda Building about your estimate and appointment at the number above. Message frequency varies. Msg &amp; data rates may apply. Reply STOP to opt out, HELP for help. Consent is not required to get an estimate.</small></label>
      </div>`;
  const steps = variant === 'lp'
    ? [
      `<legend class="sr-only">Your project</legend>${serviceField}<div class="row2">${zipField}${budgetField}</div>`,
      `<legend class="sr-only">Contact information</legend>${contact}${photo ? `<details class="qf-more"><summary>Add a photo <span class="opt">(optional)</span></summary>${photoField}</details>` : ''}${turnstile}`
    ]
    : [
      `<legend class="sr-only">Your project</legend>${serviceField}`,
      `<legend class="sr-only">Location and budget</legend><div class="row2">${zipField}${budgetField}</div>${addressField}`,
      `<legend class="sr-only">Contact information</legend>${contact}${photo ? `<details class="qf-more"><summary>Add project details or a photo <span class="opt">(optional)</span></summary>
      <div class="field"><label for="${f('message')}">Tell us about your project</label><textarea id="${f('message')}" name="message" rows="3"></textarea></div>${photoField}</details>` : ''}${turnstile}`
    ];
  return `<div class="qf-card" id="${id}">
  <${heading} class="qf-title">${esc(title)}</${heading}>
  <p class="qf-sub">${esc(sub)}</p>
  <form class="qf on-first" name="estimate" method="POST" action="${action}" data-netlify="true" netlify-honeypot="company_website" enctype="multipart/form-data" novalidate>
    <input type="hidden" name="form-name" value="estimate">
    <input type="hidden" name="form_location" value="${esc(location)}">
    <input type="hidden" name="problem">
    <input type="hidden" name="estimate">
    <input type="hidden" name="city" value="${esc(city)}">
    ${hidden}
    <div class="hp" aria-hidden="true"><label for="${f('hp')}">Leave this field empty</label><input id="${f('hp')}" name="company_website" tabindex="-1" autocomplete="off"></div>
    <p class="qf-steptext" aria-live="polite">Step 1 of ${steps.length}</p>
    <div class="qf-progress" aria-hidden="true">${steps.map((_, i) => `<span${i === 0 ? ' class="on"' : ''}></span>`).join('')}</div>
    ${steps.map((html, i) => `<fieldset class="qf-step${i === 0 ? ' is-active' : ''}">${html}</fieldset>`).join('\n    ')}
    <div class="qf-nav">
      <button type="button" class="btn btn--ghost qf-back" aria-label="Previous step">Back</button>
      <button type="button" class="btn btn--cta qf-next">Continue</button>
      <button type="submit" class="btn btn--cta qf-submit">${esc(submitLabel)}</button>
    </div>
    <p class="consent">By submitting, you agree Moda Building may contact you by phone or email about your project. We only text you if you check the box above. No spam, ever. See our <a href="/privacy-policy/">privacy policy</a>.</p>
  </form>
  <div class="qf-trust"><span>Free, no-obligation</span><span>Licensed &amp; insured${has(site.license) ? ` · MI Lic. ${esc(site.license)}` : ''}</span><span>Fast response</span></div>
</div>`;
}

/* ---------- Problem-based entry points ---------- */
const PROBLEMS = require('../data/problems');
function problemTiles(ids, { title = 'What’s going on at your home?', intro = 'Pick what you’re dealing with — we’ll set up your free estimate for it.', stone = false } = {}) {
  const list = ids.map((id) => PROBLEMS.find((p) => p.id === id));
  return `<section class="section${stone ? ' section--stone' : ''}" aria-labelledby="problems-h"><div class="wrap">
  <div class="section-head section-head--center"><span class="eyebrow">Start here</span><h2 id="problems-h">${esc(title)}</h2><p class="lead">${esc(intro)}</p></div>
  <div class="problems problems--${list.length % 3 === 0 && list.length > 3 ? '6' : '3'}">${list.map((p) => {
    const s = svcBy(p.service), label = p.title.replace(/\?$/, '');
    return `<a class="problem" href="${svcUrl(s)}?problem=${encodeURIComponent(label)}#quote" data-problem="${esc(label)}" data-service="${esc(s.formValue)}" data-cta="problem-${p.id}">
      <span class="problem__icon">${ICON[p.icon] || ICON.home}</span>
      <span class="problem__body"><strong>${esc(p.title)}</strong><span>${esc(p.text)}</span><span class="link-arrow">${esc(p.cta)}</span></span></a>`;
  }).join('')}</div>
</div></section>`;
}

/* ---------- Header / footer ---------- */
// Main menu: 5 items only (Roofing · Basements · Renovations · Our Work · About). Cities live in the footer.
const NAV = [
  { key: 'roofing', label: 'Roofing', children: [['All roofing services', '/roofing/'], ['Roof Replacement', '/roofing/#roof-replacement'], ['Roof Repair', '/roofing/#roof-repair'], ['Storm &amp; Hail Damage', '/roofing/#storm-damage'], ['Gutters', '/roofing/#gutters'], ['Instant Price Estimate', '/roofing/#instant-estimate']] },
  { key: 'basements', label: 'Basements', children: [['Basement Waterproofing', '/basement-waterproofing/'], ['Finished Basements', '/finished-basements/']] },
  { key: 'renovations', label: 'Renovations', children: [['All renovation services', '/renovations/'], ['Kitchens', '/renovations/#kitchens'], ['Bathrooms', '/renovations/#bathrooms'], ['Additions', '/renovations/#additions'], ['Whole-Home Remodels', '/renovations/#whole-home']] },
  { key: 'work', label: 'Our Work', children: [['All projects', '/gallery/'], ['Roofing projects', '/gallery/?service=roofing'], ['Waterproofing projects', '/gallery/?service=basement-waterproofing'], ['Finished basement projects', '/gallery/?service=finished-basements'], ['Renovation projects', '/gallery/?service=renovations']] },
  { key: 'about', label: 'About', children: () => [['About us', '/about/'], reviewsPageLive() ? ['Reviews', '/reviews/'] : null, financingPageLive() ? ['Financing', '/financing/'] : null, ['Contact / Free estimate', '/contact/']].filter(Boolean) }
];
// Submenus stay short (2–6 links); cities live in the footer, not the menu.
const navChildren = (n) => (typeof n.children === 'function' ? n.children() : n.children);
const navKeyFor = (current) => ({ 'basement-waterproofing': 'basements', 'finished-basements': 'basements', gallery: 'work', contact: 'about', reviews: 'about', financing: 'about' }[current] || current);

function header({ minimal = false, current = '', lp = null } = {}) {
  if (minimal) {
    const phone = lp ? lp.phone : site.phone;
    return `<header class="header lp-header"><div class="wrap header__in">
  ${lp && lp.logoHome ? `<a class="logo" href="/" aria-label="Moda Building home" data-cta="lp-logo-home">${logoImg()}</a>` : `<span class="logo">${logoImg({ alt: 'Moda Building' })}</span>`}
  <div class="header__actions">
    <a class="header__phone" href="${telHref(phone)}" data-loc="header">${esc(phone)}</a>
    <a class="icon-btn call-icon" href="${telHref(phone)}" data-loc="header-icon" aria-label="Call ${esc(phone)}">${ICON.phone}</a>
    ${lp && lp.cta ? `<a class="btn btn--cta lp-cta" href="#quote" data-cta="header">${esc(lp.cta)}</a>` : ''}
  </div>
</div></header>`;
  }
  const cur = navKeyFor(current);
  const desktop = NAV.map((n) => n.children
    ? `<li><button type="button" aria-expanded="false"${cur === n.key ? ' aria-current="true"' : ''}>${n.label}</button><div class="dd">${navChildren(n).map(([l, h]) => `<a href="${h}">${l}</a>`).join('')}</div></li>`
    : `<li><a href="${n.href}"${cur === n.key ? ' aria-current="page"' : ''}>${n.label}</a></li>`).join('');
  const mobile = NAV.map((n) => n.children
    ? `<li><details><summary>${n.label}</summary><ul>${navChildren(n).map(([l, h]) => `<li><a href="${h}">${l}</a></li>`).join('')}</ul></details></li>`
    : `<li><a href="${n.href}">${n.label}</a></li>`).join('');
  return `<header class="header"><div class="wrap header__in">
  <a class="logo" href="/" aria-label="Moda Building home">${LOGO}</a>
  <nav class="nav" aria-label="Main"><ul>${desktop}</ul></nav>
  <div class="header__actions">
    <a class="header__phone" href="${telHref(site.phone)}" data-loc="header"><small>Call for a free estimate</small>${esc(site.phone)}</a>
    <a class="icon-btn call-icon" href="${telHref(site.phone)}" data-loc="header-icon" aria-label="Call ${esc(site.phone)}">${ICON.phone}</a>
    <a class="btn btn--cta" href="#quote" data-cta="header">Get a Free Estimate</a>
    <button class="icon-btn menu-toggle" type="button" aria-expanded="false" aria-controls="mnav" aria-label="Menu">${ICON.menu}</button>
  </div>
</div>
<nav class="mnav" id="mnav" aria-label="Mobile"><ul>${mobile}</ul>
<a class="btn btn--cta btn--block" href="/contact/" data-cta="mobile-menu">Get a Free Estimate</a></nav>
</header>`;
}

// quote: false → Call only (thank-you pages: the visitor has already sent the form)
function mobileBar({ label = 'Get Quote', phone = site.phone, quote = true } = {}) {
  return `<div class="mbar${quote ? '' : ' mbar--call'}" role="region" aria-label="Quick contact">${callBtn('sticky-bar', quote ? 'btn btn--ghost' : 'btn btn--cta', quote ? 'Call' : 'Call ' + phone, phone)}${quote ? `<a class="btn btn--cta" href="#quote" data-cta="sticky-bar">${esc(label)}</a>` : ''}</div>`;
}

// Trust strip (homepage only). Shows only verified facts; unverified stats are never shown.
function trustStrip() {
  const items = [
    [ICON.shield, 'Licensed &amp; insured', has(site.license) ? `MI Lic. ${esc(site.license)}` : 'Michigan residential builder'],
    has(site.yearsInBusiness) ? [ICON.calendar, `${esc(site.yearsInBusiness)} years in business`, 'Locally owned'] : [ICON.calendar, 'Locally owned &amp; operated', `Serving ${esc(site.serviceArea)}`],
    hasRating() ? [ICON.star, `${esc(site.googleRating)}★ Google rating`, `${esc(site.googleReviewCount)} reviews`] : [ICON.clipboard, 'Free written estimates', 'No pressure, no surprises'],
    [ICON.award, 'Warranties', esc(site.warranty)],
    [ICON.dollar, 'Financing available', 'On qualifying projects']
  ];
  return trustBar(items);
}
const trustBar = (items) => `<section class="trust" aria-label="Why homeowners trust us"><div class="wrap"><ul class="trust--${items.length}">${items.map(([i, a, b]) => `<li>${i}<span>${a}${b ? `<small>${b}</small>` : ''}</span></li>`).join('')}</ul></div></section>`;

const cookieUi = `<div class="cookie" id="cookie" role="dialog" aria-live="polite" aria-label="Cookie notice"><p>We use cookies to measure our ads and improve this site. You can accept or decline non-essential cookies. <a href="/privacy-policy/#cookies">Read our cookie policy</a></p><div class="btns"><button class="btn btn--ghost" type="button" data-consent="decline">Decline</button><button class="btn btn--ghost" type="button" data-consent="accept" style="background:var(--ink);color:#fff">Accept</button></div></div>`;

function footer({ minimal = false, lp = null } = {}) {
  const addr = site.address;
  const year = new Date().getFullYear();
  if (minimal) {
    // Landing-page mini footer: business name, phone, license #, privacy policy. Nothing else.
    const phone = lp ? lp.phone : site.phone;
    return `<footer class="footer footer--mini"><div class="wrap"><p><strong>${esc(site.name)}</strong> · <a href="${telHref(phone)}" data-loc="footer">${esc(phone)}</a> · ${has(site.license) ? `MI License ${esc(site.license)}` : 'Licensed &amp; insured in Michigan'} · <a href="/privacy-policy/">Privacy policy</a></p></div></footer>${cookieUi}`;
  }
  const hours = site.hours.map((h) => `<li>${esc(h.days)}: ${esc(h.open)}${h.close ? '–' + esc(h.close) : ''}</li>`).join('');
  const social = Object.entries(site.social).map(([k, u]) => (u ? `<a href="${esc(u)}" rel="noopener" aria-label="${k}">${ICON[k]}</a>` : '')).join('');
  const nap = `<address><strong style="color:#fff">${esc(site.name)}</strong><br>${hasAddress() ? `${esc(addr.street)}<br>${esc(addr.city)}, ${esc(addr.region)} ${esc(addr.zip)}` : `Serving ${esc(site.serviceArea)}`}<br><a href="${telHref(site.phone)}" data-loc="footer">${esc(site.phone)}</a><br><a href="mailto:${esc(site.email)}">${esc(site.email)}</a></address>`;
  const company = [['About us', '/about/'], reviewsPageLive() ? ['Reviews', '/reviews/'] : null, financingPageLive() ? ['Financing', '/financing/'] : null, ['Contact / Free estimate', '/contact/'], ['Privacy policy', '/privacy-policy/']].filter(Boolean);
  return `<footer class="footer"><div class="wrap">
  <div class="footer__grid">
    <div><a class="logo" href="/" aria-label="Moda Building home">${logoImg({ light: true })}</a>${nap}
      <p style="margin-top:12px">${has(site.license) ? `MI License ${esc(site.license)}<br>` : ''}Licensed &amp; insured in Michigan</p>
      ${social ? `<div class="footer__social">${social}</div>` : ''}</div>
    <div><h2>Services</h2><ul>${services.map((s) => `<li><a href="${svcUrl(s)}">${esc(s.name)}</a></li>`).join('')}<li><a href="/gallery/">Project gallery</a></li></ul>
      <h2 style="margin-top:28px">Hours</h2><ul>${hours}</ul></div>
    <div><h2>Service areas</h2><ul>${cities.map((c) => `<li><a href="${cityUrl(services[0], c)}">${c.isRegion ? 'All of Metro Detroit' : esc(c.name) + ', MI'}</a></li>`).join('')}</ul></div>
    <div><h2>Company</h2><ul>${company.map(([l, h]) => `<li><a href="${h}">${l}</a></li>`).join('')}</ul></div>
  </div>
  <div class="footer__bottom"><span>© ${year} ${esc(site.name)}. All rights reserved.</span><span><a href="/privacy-policy/">Privacy policy</a> · <a href="#" data-cookie-settings>Cookie settings</a> · <a href="/sitemap.xml">Sitemap</a></span></div>
</div></footer>${cookieUi}`;
}

/* ---------- Content components ---------- */
// Breadcrumb lives inside the top of the hero (same background) — no separate white strip.
function crumbs(list) {
  return `<nav class="crumbs wrap" aria-label="Breadcrumb"><ol>${list.map(([n, u], i) => (i === list.length - 1 ? `<li aria-current="page">${esc(n)}</li>` : `<li><a href="${u}">${esc(n)}</a></li>`)).join('')}</ol></nav>`;
}

const PROCESS = [
  ['Inspect', 'A free, no-pressure visit. We inspect, measure and photograph — then show you exactly what we found.'],
  ['Quote', 'A clear, line-item written quote with options. No high-pressure tactics, no vague allowances.'],
  ['Build', 'A dedicated project lead, a protected home and a clean site every day. You always know what is next.'],
  ['Warranty', 'Final walkthrough, warranty registration and documentation. We stand behind the work after we leave.']
];
function processSection({ dark = false, title = 'How it works', intro = 'Four simple steps from first call to finished project.', steps = PROCESS } = {}) {
  return `<section class="section${dark ? ' section--ink' : ' section--stone'}"><div class="wrap">
  <div class="section-head section-head--center"><span class="eyebrow">Our process</span><h2>${esc(title)}</h2><p class="lead"${dark ? ' style="color:#c9d1d9"' : ''}>${esc(intro)}</p></div>
  <ol class="process process--${steps.length}">${steps.map(([h, p]) => `<li><h3>${h}</h3><p>${p}</p></li>`).join('')}</ol>
</div></section>`;
}

function reviewCard(r) {
  const c = cityBy(r.city), s = svcBy(r.service);
  return `<figure class="review"><div class="stars" aria-label="${r.rating} out of 5 stars">${stars(r.rating)}</div>
  <blockquote><p>${esc(r.text)}</p></blockquote>
  <figcaption><strong>${esc(r.name)}</strong><br>${esc(r.label || s.short)} · ${esc(c.name)}, MI</figcaption></figure>`;
}

// Reviews: static grid, always a multiple of 3 (no orphan cards). Renders nothing until reviews are verified.
function reviewsBlock(list, { title = 'What homeowners say', eyebrow = 'Reviews', stone = false, max = 3 } = {}) {
  const n = Math.min(max, Math.floor(list.length / 3) * 3);
  if (!n) return '';
  const more = has(site.googleReviewUrl) ? `<a class="btn btn--ghost" href="${esc(site.googleReviewUrl)}" rel="noopener">Read all our reviews on Google</a>` : (reviewsPageLive() ? `<a class="btn btn--ghost" href="/reviews/">Read more reviews</a>` : '');
  return `<section class="section${stone ? ' section--stone' : ''}"><div class="wrap">
  <div class="section-head section-head--center"><span class="eyebrow">${esc(eyebrow)}</span><h2>${esc(title)}</h2>
  ${hasRating() ? `<div class="rating-summary"><span class="big">${esc(site.googleRating)}</span><span><span class="stars" style="color:#b7791f">★★★★★</span><br>${esc(site.googleReviewCount)} Google reviews</span></div>` : ''}</div>
  <div class="reviews-grid">${list.slice(0, n).map(reviewCard).join('')}</div>
  ${more ? `<p class="section-cta">${more}</p>` : ''}
</div></section>`;
}

function projectCard(p, { slider = true, caption = '' } = {}) {
  const s = svcBy(p.service), c = cityBy(p.city);
  const after = pic(`${p.id}-after`), before = pic(`${p.id}-before`);
  const altBase = `${p.title} — ${s.short.toLowerCase()} project in ${c.name}, MI`;
  const media = p.before && slider
    ? `<div class="ba">${img(after, `After: ${altBase}`).replace('<img ', '<img draggable="false" ')}${img(before, `Before: ${altBase}`, { cls: 'ba__before' }).replace('<img ', '<img draggable="false" ')}<span class="ba__line"></span><span class="ba__tag ba__tag--b">Before</span><span class="ba__tag ba__tag--a">After</span><input type="range" min="0" max="100" value="50" autocomplete="off" aria-label="Drag to compare before and after: ${esc(p.title)}"></div>`
    : `<div class="card__img">${img(after, altBase)}</div>`;
  return `<article class="proj" data-service="${p.service}" data-city="${p.city}" data-room="${esc(p.room || '')}">${media}<div class="proj__body">${caption ? '' : `<p class="proj__meta">${esc(s.short)} · ${esc(c.name)}</p>`}<h3>${esc(caption || p.title)}</h3>${caption ? '' : `<p>${esc(p.scope)}</p>`}</div></article>`;
}

// FAQ: two columns — heading, intro and a call line on the left; accordion on the right.
function faqSection(items, { title = 'Frequently asked questions', stone = false, intro = 'Quick answers to what homeowners ask us most.', phone = site.phone } = {}) {
  return `<section class="section${stone ? ' section--stone' : ''}" id="faq"><div class="wrap faq-layout">
  <div class="faq-layout__head"><span class="eyebrow">FAQ</span><h2>${esc(title)}</h2><p>${esc(intro)}</p>
    <p class="faq-call">Still have a question?<br><a href="${telHref(phone)}" data-loc="faq">Call ${esc(phone)}</a></p></div>
  <div class="faq">${items.map((f, i) => `<details${i === 0 ? ' open' : ''}><summary>${esc(f.q)}</summary><div><p>${esc(f.a)}</p></div></details>`).join('')}</div></div></section>`;
}

/* Final call-to-action band — no second form (it scrolls up to the page's one form).
   Two equal columns: headline, trust points (+ a review when verified) left; phone + button card right.
   On phones the action card comes first. */
function ctaBand({ title = 'Ready for a free estimate?', text = 'Tell us about your project and we will schedule a free, no-pressure visit.', points = ['Free inspection and written quote', 'Licensed &amp; insured in Michigan', 'Workmanship + manufacturer warranties', 'Financing available on qualifying projects'], review = null, buttonLabel = 'Get a Free Estimate', phone = site.phone, href = '#quote' } = {}) {
  return `<section class="cta-band" aria-labelledby="cta-h"><div class="wrap cta-band__grid">
  <div class="cta-band__copy"><span class="eyebrow">Free estimate</span><h2 id="cta-h">${title}</h2><p>${esc(text)}</p>
    <ul class="hero__bullets">${points.map((b) => `<li>${ICON.check}<span>${b}</span></li>`).join('')}</ul>
    ${review ? reviewCard(review) : ''}</div>
  <div class="cta-card"><p class="cta-card__label">Prefer to talk?</p>
    <a class="phone-big" href="${telHref(phone)}" data-loc="cta-band">${esc(phone)}</a>
    <p class="cta-card__hours">${esc(site.hours[0].days)} ${esc(site.hours[0].open)}–${esc(site.hours[0].close)}</p>
    <a class="btn btn--cta btn--block" href="${href}" data-cta="cta-band">${esc(buttonLabel)}</a>
    <p class="cta-card__note">Takes about 60 seconds · Free, no obligation</p></div>
</div></section>`;
}

/* ---------- Instant price range (3 questions → ballpark from the cost table → quote form) ----------
   Hidden until JS runs; without JS the cost table above still shows the ranges. */
function priceEstimator(cfg) {
  const tiles = (q, list) => list.map((o) => `<button type="button" class="est__opt" data-q="${q}" data-v="${o.id}" aria-pressed="false"><strong>${esc(o.label)}</strong><span>${esc(o.hint)}</span></button>`).join('');
  return `<section class="section" id="instant-estimate" data-estimator hidden><div class="wrap">
  <div class="section-head section-head--center"><span class="eyebrow">Instant price range</span><h2>What will my new roof cost?</h2><p class="lead">Answer 3 quick questions for a ballpark from our typical Metro Detroit prices. Your exact price comes from a free on-site inspection.</p></div>
  <div class="est">
    <div class="est__progress" aria-hidden="true"><span class="on"></span><span></span><span></span></div>
    <p class="est__steptext" aria-live="polite">Question 1 of 3</p>
    <div class="est__q is-active" role="group" aria-labelledby="est-q1"><h3 id="est-q1">How big is your roof?</h3><div class="est__opts est__opts--4">${tiles('size', cfg.sizes)}</div></div>
    <div class="est__q" role="group" aria-labelledby="est-q2"><h3 id="est-q2">Which roofing material?</h3><div class="est__opts est__opts--4">${tiles('material', cfg.materials)}</div></div>
    <div class="est__q" role="group" aria-labelledby="est-q3"><h3 id="est-q3">How many layers of shingles are on it now?</h3><div class="est__opts est__opts--3">${tiles('layers', cfg.layers)}</div></div>
    <div class="est__result" hidden>
      <p class="est__label">Your ballpark range</p>
      <p class="est__range" tabindex="-1"></p>
      <p class="est__summary"></p>
      <p class="est__note"></p>
      <div class="est__ctas"><a class="btn btn--cta" href="#quote" data-service="Roofing" data-problem="" data-cta="estimator-quote">Get my exact quote</a><button type="button" class="btn btn--ghost est__restart">Start over</button></div>
    </div>
    <div class="est__nav"><button type="button" class="est__back link-btn" hidden>← Back</button></div>
  </div>
  <script type="application/json" id="est-data">${JSON.stringify(cfg).replace(/</g, '\\u003c')}</script>
</div></section>`;
}

module.exports = { priceEstimator, ALL_REVIEWS, liveReviews, reviewsPageLive, financingPageLive, lpPhone, trustBar, reviewsBlock, MAIN_SERVICES, problemTiles, PROBLEMS, logoImg, picUrl, has, hasAddress, hasRating, pic, hasPhoto, site, services, cities, coreCities, esc, val, isPh, telHref, svcBy, cityBy, svcUrl, cityUrl, ICON, LOGO, img, callBtn, quoteForm, header, footer, mobileBar, trustStrip, crumbs, processSection, reviewCard, projectCard, faqSection, ctaBand, PROCESS };
