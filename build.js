#!/usr/bin/env node
// Static site generator for modabuilding.com — run `node build.js`, output goes to /site.
// No dependencies. Edit content in src/data/*, styles in src/assets/css, behavior in src/assets/js.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const ui = require('./src/lib/ui');
const ph = require('./src/lib/placeholders');
const projects = require('./src/data/projects');
const posts = require('./src/data/posts');
const { priceEstimator, ALL_REVIEWS, liveReviews, reviewsPageLive, financingPageLive, lpPhone, trustBar, reviewsBlock, problemTiles, PROBLEMS, picUrl, has, hasAddress, hasRating, pic, hasPhoto, site, services, cities, coreCities, esc, telHref, svcBy, cityBy, svcUrl, cityUrl, ICON, img, callBtn, quoteForm, header, footer, mobileBar, trustStrip, crumbs, processSection, reviewCard, projectCard, faqSection, ctaBand } = ui;

const OUT = path.join(__dirname, 'site');
// BASE_PATH (e.g. /moda-building) builds a preview for a subfolder host like GitHub Pages; previews are noindex.
const BASE = (process.env.BASE_PATH || '').replace(/\/$/, '');
const IS_PREVIEW_HOST = !!BASE;
const SITE_URL = site.url.replace(/\/$/, '');
const pages = []; // for sitemap.xml

/* ---------- Files ---------- */
fs.rmSync(OUT, { recursive: true, force: true });
function write(rel, content) {
  const f = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, content);
}
function copyDir(src, dst) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dst, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name), d = path.join(dst, e.name);
    if (e.isDirectory()) { fs.mkdirSync(d, { recursive: true }); copyDir(s, d); } else fs.copyFileSync(s, d);
  }
}
fs.mkdirSync(OUT, { recursive: true });
copyDir(path.join(__dirname, 'src/assets'), path.join(OUT, 'assets'));
copyDir(path.join(__dirname, 'src/img'), path.join(OUT, 'img')); // real photos go in src/img
const hash = (f) => crypto.createHash('md5').update(fs.readFileSync(path.join(OUT, f))).digest('hex').slice(0, 8);
const CSS_V = hash('assets/css/main.css'), JS_V = hash('assets/js/main.js');
const selfFonts = fs.existsSync(path.join(OUT, 'assets/fonts/manrope-latin.woff2'));

/* ---------- Placeholder images ---------- */
const svcSeed = { roofing: 3, 'basement-waterproofing': 5, 'finished-basements': 7, renovations: 11 };
const placeholder = (name, svg) => { if (!hasPhoto(name)) write(`img/ph/${name}.svg`, svg()); };
for (const s of services) placeholder(`${s.key}-hero`, () => ph.make(s.key, svcSeed[s.key], false, `Placeholder — real ${s.short.toLowerCase()} project photo`));
placeholder('home-hero', () => ph.make('roofing', 2, false, ''));
placeholder('team', () => ph.team());
projects.forEach((p, i) => {
  const c = cityBy(p.city);
  placeholder(`${p.id}-after`, () => ph.make(p.service, i + 13, false, `Placeholder — after · ${c.name}`));
  if (p.before) placeholder(`${p.id}-before`, () => ph.make(p.service, i + 13, true, `Placeholder — before · ${c.name}`));
});

/* ---------- Schema ---------- */
const BIZ_ID = `${SITE_URL}/#business`;
function businessSchema() {
  const a = site.address;
  const b = {
    '@type': ['RoofingContractor', 'HomeAndConstructionBusiness'],
    '@id': BIZ_ID,
    name: site.name,
    url: SITE_URL + '/',
    telephone: '+1-' + site.phone.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'),
    email: site.email,
    image: `${SITE_URL}${picUrl('home-hero')}`,
    logo: `${SITE_URL}/assets/brand/logo-600.png`,
    priceRange: '$$',
    areaServed: [...coreCities.map((c) => ({ '@type': 'City', name: `${c.name}, MI` })), { '@type': 'AdministrativeArea', name: 'Metro Detroit, MI' }],
    openingHours: site.hours.map((h) => h.schema).filter(Boolean),
    sameAs: Object.values(site.social).concat(site.googleBusinessProfileUrl).filter(Boolean)
  };
  if (hasAddress()) b.address = { '@type': 'PostalAddress', streetAddress: a.street, addressLocality: a.city, addressRegion: a.region, postalCode: a.zip, addressCountry: 'US' };
  else b.address = { '@type': 'PostalAddress', addressRegion: a.region, addressCountry: 'US' };
  if (hasRating()) b.aggregateRating = { '@type': 'AggregateRating', ratingValue: site.googleRating, reviewCount: site.googleReviewCount };
  const real = liveReviews(); // only owner-verified reviews are marked up
  if (real.length) b.review = real.slice(0, 10).map((r) => ({ '@type': 'Review', author: { '@type': 'Person', name: r.name }, reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5 }, reviewBody: r.text }));
  return b;
}
const faqSchema = (items) => ({ '@type': 'FAQPage', mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) });
const crumbSchema = (list) => ({ '@type': 'BreadcrumbList', itemListElement: list.map(([n, u], i) => ({ '@type': 'ListItem', position: i + 1, name: n, item: SITE_URL + u })) });
const serviceSchema = (s, areas, name) => ({ '@type': 'Service', name: name || s.name, serviceType: s.name, provider: { '@id': BIZ_ID }, areaServed: areas.map((c) => (c.isRegion ? { '@type': 'AdministrativeArea', name: 'Metro Detroit, MI' } : { '@type': 'City', name: `${c.name}, MI` })) });

/* ---------- Layout ---------- */
function layout({ url, title, description, body, schema = [], noindex = false, minimal = false, lp = null, current = '', bodyAttr = '', ogImage = picUrl('home-hero'), sitemap = true, priority = '0.6' }) {
  if (title.length > 70) console.warn(`! Title > 70 chars (${title.length}): ${url}`);
  if (!noindex && sitemap) pages.push({ url, priority });
  const graph = [businessSchema(), { '@type': 'WebPage', '@id': SITE_URL + url, url: SITE_URL + url, name: title, description, isPartOf: { '@type': 'WebSite', '@id': SITE_URL + '/#website', name: site.name, url: SITE_URL + '/' } }, ...schema];
  const gtm = site.tracking.gtmId;
  const fonts = selfFonts
    ? `<link rel="preload" href="/assets/fonts/manrope-latin.woff2" as="font" type="font/woff2" crossorigin><style>@font-face{font-family:'Manrope';font-style:normal;font-weight:400 800;font-display:swap;src:url(/assets/fonts/manrope-latin.woff2) format('woff2')}</style>`
    : `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap">`;
  const html = `<!doctype html>
<html lang="en-US" data-base="${BASE}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${SITE_URL}${url}">
${noindex || IS_PREVIEW_HOST ? '<meta name="robots" content="noindex, follow">' : '<meta name="robots" content="index, follow, max-image-preview:large">'}
<meta name="theme-color" content="#1e2a34">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${SITE_URL}${url}">
<meta property="og:image" content="${SITE_URL}${ogImage}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/assets/favicon.ico" sizes="48x48">
<link rel="icon" href="/assets/favicon-32.png" type="image/png" sizes="32x32">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<link rel="manifest" href="/assets/site.webmanifest">
${fonts}
<link rel="stylesheet" href="/assets/css/main.css?v=${CSS_V}">
<script>
window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{ad_storage:'denied',analytics_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});
try{if(JSON.parse(localStorage.getItem('moda_consent'))===true)gtag('consent','update',{ad_storage:'granted',analytics_storage:'granted',ad_user_data:'granted',ad_personalization:'granted'});}catch(e){}
</script>
${gtm ? `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${esc(gtm)}');</script>` : '<!-- Google Tag Manager: set tracking.gtmId in src/data/site.json (GA4, Google Ads conversion and Meta Pixel are configured inside GTM) -->'}
${site.tracking.callRailScript ? `<script async src="${esc(site.tracking.callRailScript)}"></script>` : ''}
${site.tracking.turnstileSiteKey ? '<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>' : ''}
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })}</script>
</head>
<body${bodyAttr}>
${gtm ? `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${esc(gtm)}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>` : ''}
<a class="skip" href="#main">Skip to content</a>
${header({ minimal, current, lp })}
<main id="main">
${body}
</main>
${footer({ minimal, lp })}
${lp ? mobileBar({ label: lp.cta, phone: lp.phone }) : mobileBar()}
<script src="/assets/js/main.js?v=${JS_V}" defer></script>
</body>
</html>
`;
  // Pages without a quote form send "Get a Free Estimate" buttons to the contact page instead of #quote.
  let out = body.includes('id="quote"') ? html : html.replace(/href="#quote"/g, 'href="/contact/"');
  if (BASE) out = out.replace(/(href|src|action)="\/(?!\/)/g, `$1="${BASE}/`).replace(/srcset="([^"]+)"/g, (m, v) => `srcset="${v.replace(/(^|,\s*)\//g, `$1${BASE}/`)}"`).replace(/url\(\/assets/g, `url(${BASE}/assets`);
  write(url === '/404.html' ? '404.html' : path.join(url, 'index.html'), out);
}

const heroPhoto = (src, alt) => `<div class="hero__media">${img(src, alt, { sizes: '(min-width: 960px) 50vw, 100vw' })}</div>`;
const projAlt = (p) => `${p.title} — ${svcBy(p.service).short.toLowerCase()} project in ${cityBy(p.city).name}, MI`;
const bullets = (list) => `<ul class="hero__bullets">${list.map((b) => `<li>${ICON.check}<span>${b}</span></li>`).join('')}</ul>`;
const checks = (list) => `<ul class="checks">${list.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>`;
const proj = (id) => projects.find((p) => p.id === id);
const triple = (list, max = 6) => list.slice(0, Math.min(max, Math.floor(list.length / 3) * 3)); // grids only in multiples of 3
const sectionCta = (html) => `<p class="section-cta">${html}</p>`;
const ghostBtn = (href, label) => `<a class="btn btn--ghost" href="${href}">${label}</a>`;
const livePageFor = (s) => s.cityPagesLive === true;

// Standard page hero: breadcrumb inside the hero (no separate strip); copy left, quote form right (desktop) / below (mobile).
function pageHero({ crumbsList, eyebrow, h1, lead, bulletsList = [], service = '', city = '', location, media = '', formTitle, ctas = true, form = true }) {
  return `<section class="hero">${crumbsList ? crumbs(crumbsList) : ''}<div class="wrap hero__grid${form ? '' : ' hero__grid--solo'}">
  <div class="hero__copy">${eyebrow ? `<span class="eyebrow">${esc(eyebrow)}</span>` : ''}<h1>${h1}</h1><p class="lead">${lead}</p>
    ${bulletsList.length ? bullets(bulletsList) : ''}
    ${ctas ? `<div class="hero__ctas">${callBtn(location + '-hero')}${form ? '' : `<a class="btn btn--cta" href="/contact/" data-cta="${location}-hero">Get a Free Estimate</a>`}</div>` : ''}
    ${media ? `<div class="hero__extra">${media}</div>` : ''}</div>
  ${form ? quoteForm({ service, city, location: location + '-hero', title: formTitle }) : ''}
</div></section>`;
}

/* ================= HOMEPAGE — 8 sections: hero, trust strip, problem cards, 3 before/afters, reviews, how it works, 4 FAQs, final CTA ================= */
(function home() {
  const featured = ['p1', 'p7', 'p15'].map(proj); // roofing first; one per main service
  const homeFaq = [
    { q: 'What areas do you serve?', a: 'Roofing and basement waterproofing across Oakland County and all of Metro Detroit. Finished basements and full renovations focus on Birmingham, Royal Oak, Bloomfield Hills, Rochester Hills, West Bloomfield and Beverly Hills.' },
    { q: 'Are estimates really free?', a: 'Yes. Inspections and written estimates are free and come with no obligation.' },
    { q: 'Are you licensed and insured?', a: `Yes. Moda Building is a licensed Michigan residential builder${has(site.license) ? ` (license ${site.license})` : ''} and carries liability and workers’ compensation insurance. Certificates are available on request.` },
    { q: 'Do you help with insurance claims?', a: 'For storm and hail damage, we document the damage with dated photos and meet your adjuster on-site so your claim reflects what is actually on your roof.' }
  ];
  const body = `
<section class="hero hero--photo"><div class="hero__bg">${img(pic('home-hero'), 'Newly replaced architectural shingle roof on an upscale Metro Detroit home', { eager: true, sizes: '100vw' })}</div>
<div class="wrap hero__grid">
  <div class="hero__copy"><span class="eyebrow">Roofing · Waterproofing · Basements · Renovations</span>
    <h1>Metro Detroit’s Trusted Roofing Contractor</h1>
    <p class="lead">Roof replacement, repair and storm damage for homeowners from Birmingham to Rochester Hills — with free inspections, clear written quotes and craftsmanship you can see.</p>
    ${bullets(['Free roof inspection with photos', 'Storm &amp; hail damage — we meet your adjuster', hasRating() ? `Licensed &amp; insured · ${esc(site.googleRating)}★ on Google` : 'Licensed, insured &amp; warrantied'])}
    <div class="hero__ctas">${callBtn('home-hero')}</div>
  </div>
  ${quoteForm({ service: 'Roofing', location: 'home-hero', title: 'Get your free roofing estimate', heading: 'h2' })}
</div></section>
${trustStrip()}
${problemTiles(PROBLEMS.home, { stone: true })}

<section class="section"><div class="wrap">
  <div class="section-head section-head--center"><span class="eyebrow">Recent projects</span><h2>Before and after</h2><p class="lead">Drag the slider to compare. Every project is labeled by service and city.</p></div>
  <div class="grid grid--3">${featured.map((p) => projectCard(p)).join('')}</div>
  ${sectionCta(ghostBtn('/gallery/', 'View the full gallery'))}
</div></section>

${reviewsBlock(liveReviews(), { stone: true })}
${processSection({ dark: true })}
${faqSection(homeFaq)}
${ctaBand({ title: 'Get your free estimate today' })}`;
  layout({ url: '/', title: 'Moda Building | Metro Detroit Roofing & Home Contractor', description: 'Moda Building is a Metro Detroit roofing contractor for roof replacement, repair and storm damage, plus basement waterproofing, finished basements and renovations. Free estimates.', body, schema: [faqSchema(homeFaq)], priority: '1.0' });
})();

/* ================= SERVICE PAGES ================= */
for (const s of services) {
  const sProjects = projects.filter((p) => p.service === s.key);
  const sReviews = liveReviews().filter((r) => r.service === s.key);
  const sCities = s.cityKeys.map(cityBy);
  const cross = svcBy(s.crossSell.to);
  const bc = [['Home', '/'], [s.name, svcUrl(s)]];
  const isWp = s.key === 'basement-waterproofing';
  const crossBox = `<div class="cross"><span class="eyebrow">Related service</span><h3>${esc(cross.name)}</h3><p>${esc(s.crossSell.text)}</p><a class="link-arrow" href="${svcUrl(cross)}">${esc(s.crossSell.cta)}</a></div>`;
  const roofBox = `<div class="cross"><span class="eyebrow">Roof + basement</span><h3>Need a roof, too?</h3><p>Water problems often start at the roof line. Overflowing gutters and roof leaks are a common source of interior water damage — we can inspect both in one visit.</p><a class="link-arrow" href="/roofing/">Roofing services</a></div>`;
  const related = s.key === 'roofing' ? crossBox : isWp ? roofBox : `<div class="grid grid--2">${crossBox}${roofBox}</div>`;
  // Waterproofing pushes the whole-basement story right after the intro: dry it, then finish it.
  const dryThenFinish = isWp ? `
<section class="section section--ink"><div class="wrap">
  <div class="section-head section-head--center"><span class="eyebrow">Dry it, then finish it</span><h2>One team for the whole basement</h2><p class="lead" style="color:#c9d1d9">Water follows a path — roof, gutters, grading, foundation. We stop it, then turn the dry space into living space.</p></div>
  <div class="grid grid--2 steps2">
    <div class="step2"><span class="step2__n">1</span><h3>Dry it</h3><p>We find where water gets in — cracks, failed drain tile, the wall–floor joint, gutters or grading — and fix the cause with a written, transferable warranty.</p><a class="btn btn--cta" href="#quote" data-cta="wp-dry-it">Book a free inspection</a></div>
    <div class="step2"><span class="step2__n">2</span><h3>Finish it</h3><p>With the water handled, your basement becomes the most affordable square footage you can add: a family room, bar, theater, gym or guest suite.</p><a class="btn btn--ghost" href="/finished-basements/">See finished basements</a></div>
  </div>
</div></section>` : '';
  const shownProjects = triple(sProjects);
  const body = `
${pageHero({ crumbsList: bc, eyebrow: `${s.name} · ${s.coverage}`, h1: esc(s.h1), lead: esc(s.heroSub), bulletsList: ['Free in-home inspection and written quote', 'Licensed, insured &amp; warrantied', 'Financing on qualifying projects'], service: s.formValue, location: s.key, formTitle: `Get a free ${s.short.toLowerCase()} estimate`, media: heroPhoto(pic(`${sProjects[0].id}-after`), projAlt(sProjects[0])) })}
${problemTiles(PROBLEMS.filter((p) => p.service === s.key).slice(0, 3).map((p) => p.id), { title: `What’s going on with your ${s.key === 'roofing' ? 'roof' : s.key === 'renovations' ? 'home' : 'basement'}?`, stone: true })}

<section class="section"><div class="wrap split">
  <div><span class="eyebrow">${esc(s.name)}</span><h2>${s.key === 'roofing' ? 'Built for Michigan weather' : isWp ? 'Find the cause. Fix it for good.' : s.key === 'finished-basements' ? 'Space that feels like the main floor' : 'Modern design, respectful of your home'}</h2>${s.intro.map((p) => `<p>${esc(p)}</p>`).join('')}
    <ul class="toc" aria-label="On this page">${s.subservices.map((x) => `<li><a href="#${x.id}">${esc(x.title)}</a></li>`).join('')}</ul></div>
  <div class="rounded">${img(pic(`${s.key}-hero`), `${s.name} by Moda Building in Oakland County, MI`, { sizes: '(min-width: 960px) 50vw, 100vw' })}</div>
</div></section>
${dryThenFinish}
<section class="section section--stone"><div class="wrap">
  <div class="section-head"><span class="eyebrow">What we do</span><h2>${esc(s.name)} services</h2></div>
  ${s.subservices.map((x) => `<div class="sub" id="${x.id}"><h3>${esc(x.title)}</h3><div><p>${esc(x.text)}</p>${x.points.length ? checks(x.points) : ''}</div></div>`).join('')}
</div></section>

<section class="section"><div class="wrap">
  <div class="section-head"><span class="eyebrow">${s.key === 'renovations' ? 'Projects & timelines' : isWp ? 'Solutions' : s.key === 'finished-basements' ? 'Materials' : 'Shingle types & materials'}</span><h2>${s.key === 'roofing' ? 'Choosing your roofing material' : isWp ? 'Which waterproofing fix fits your home?' : s.key === 'finished-basements' ? 'Built for below grade' : 'Typical project types'}</h2></div>
  <div class="materials">${s.materials.map((m) => `<div class="material"><h3>${esc(m.name)}</h3><span class="life">${esc(m.life)}</span><p>${esc(m.note)}</p></div>`).join('')}</div>
</div></section>

<section class="section section--stone" id="cost"><div class="wrap split" style="align-items:start">
  <div><span class="eyebrow">Cost</span><h2>What affects the cost of ${esc(s.name.toLowerCase())}?</h2>${checks(s.costFactors)}</div>
  <div><table class="table"><caption class="sr-only">Typical price ranges</caption><thead><tr><th scope="col">Project</th><th scope="col">Typical range</th></tr></thead><tbody>${s.priceRanges.map((r) => `<tr><td>${esc(r.label)}</td><td>${esc(r.range)}</td></tr>`).join('')}</tbody></table>
  <p class="note" style="margin-top:10px">Ballpark ranges for planning only. Your written quote is based on an on-site inspection.</p>
  ${s.estimator ? '<p class="est-link" hidden><a class="link-arrow" href="#instant-estimate">Get an instant price range for your roof</a></p>' : ''}</div>
</div></section>
${s.estimator ? priceEstimator(s.estimator) : ''}

${shownProjects.length ? `<section class="section"><div class="wrap">
  <div class="section-head section-head--center"><span class="eyebrow">Project gallery</span><h2>Recent ${esc(s.short.toLowerCase())} projects</h2></div>
  <div class="grid grid--3">${shownProjects.map((p) => projectCard(p)).join('')}</div>
  ${sectionCta(ghostBtn(`/gallery/?service=${s.key}`, `See all ${esc(s.short.toLowerCase())} projects`))}
</div></section>` : ''}

${reviewsBlock(sReviews, { title: `${s.short} reviews`, stone: true })}

<section class="section"><div class="wrap">${related}</div></section>

${faqSection(s.faqs, { title: `${s.name} FAQ`, stone: true })}
${ctaBand({ title: `Get a free ${esc(s.short.toLowerCase())} estimate` })}`;
  layout({ url: svcUrl(s), title: s.title, description: s.description, body, current: s.key, ogImage: picUrl(`${s.key}-hero`), priority: '0.9',
    schema: [serviceSchema(s, sCities), faqSchema(s.faqs), crumbSchema(bc)] });
}

/* ================= LOCATION PAGES — roofing only (other services held back until real local projects exist) ================= */
const cityTitles = {
  roofing: (c) => c.isRegion ? 'Roofing Across Oakland County & Metro Detroit | Moda Building' : `Roofing Contractor ${c.name}, MI | Moda Building`,
  'basement-waterproofing': (c) => c.isRegion ? 'Basement Waterproofing Across Metro Detroit | Moda Building' : `Basement Waterproofing ${c.name}, MI | Moda Building`,
  'finished-basements': (c) => `Finished Basements ${c.name}, MI | Moda Building`,
  renovations: (c) => `Home Renovation ${c.name}, MI | Moda Building`
};
const cityH1 = {
  roofing: (c) => c.isRegion ? 'Roofing contractor serving all of Metro Detroit' : `Roof replacement &amp; repair in ${c.name}, MI`,
  'basement-waterproofing': (c) => c.isRegion ? 'Basement waterproofing across Metro Detroit' : `Basement waterproofing in ${c.name}, MI`,
  'finished-basements': (c) => `Finished basements in ${c.name}, MI`,
  renovations: (c) => `Home renovations in ${c.name}, MI`
};
const cityDesc = {
  roofing: (c) => c.isRegion ? 'Roof replacement, repair and storm damage across Oakland County and all of Metro Detroit. Free roof inspections and written quotes from Moda Building.' : `Roof replacement and repair in ${c.name}, MI. Storm and hail damage, insurance claims, gutters and free roof inspections from Moda Building.`,
  'basement-waterproofing': (c) => c.isRegion ? 'Basement waterproofing across Metro Detroit: crack repair, interior drain tile, sump pumps and foundation repair with a written warranty.' : `Basement waterproofing in ${c.name}, MI: leak and crack repair, interior drain tile, sump pumps and foundation repair, with a written warranty.`,
  'finished-basements': (c) => `Design-build finished basements in ${c.name}, MI: family rooms, bars, theaters, guest suites, egress windows and bathrooms. Free consultation.`,
  renovations: (c) => `Whole-home remodels, kitchens, bathrooms and additions in ${c.name}, MI. Modern design-build renovations by Moda Building. Free consultation.`
};

for (const s of services.filter(livePageFor)) {
  for (const c of s.cityKeys.map(cityBy)) {
    const local = c.pages[s.key];
    const url = cityUrl(s, c);
    const where = c.isRegion ? 'Metro Detroit' : `${c.name}, MI`;
    // Projects: local first, then nearby, shown in a full row of 3 (Metro Detroit: up to 6).
    const localProjs = projects.filter((p) => p.service === s.key && (c.isRegion || p.city === c.key));
    const nearbyProjs = c.isRegion ? [] : projects.filter((p) => p.service === s.key && p.city !== c.key && c.nearby.includes(p.city));
    const others = projects.filter((p) => p.service === s.key && !localProjs.includes(p) && !nearbyProjs.includes(p));
    const projs = triple([...localProjs, ...nearbyProjs, ...others], c.isRegion ? 6 : 3);
    const revs = liveReviews().filter((r) => r.service === s.key && (c.isRegion || r.city === c.key));
    const otherSvcs = services.filter((o) => o.key !== s.key);
    const nearbyLinks = c.isRegion ? [] : c.nearby.filter((k) => s.cityKeys.includes(k)).map(cityBy);
    const faqs = [local.faq, ...s.faqs.slice(0, 3)];
    const bc = [['Home', '/'], [s.name, svcUrl(s)], [c.isRegion ? 'Metro Detroit' : c.name, url]];
    const heroProj = localProjs[0] || nearbyProjs[0] || projects.find((p) => p.service === s.key);
    const body = `
${pageHero({ crumbsList: bc, eyebrow: `${s.name} · ${c.county}`, h1: cityH1[s.key](c), lead: esc(local.intro[0]), bulletsList: [`Free roof inspection in ${c.isRegion ? 'your city' : esc(c.name)}`, 'Licensed, insured &amp; warrantied', 'Clear written quote — no pressure'], service: s.formValue, city: c.isRegion ? '' : c.name, location: `${s.key}-${c.key}`, media: heroPhoto(pic(`${heroProj.id}-after`), projAlt(heroProj)), formTitle: `Free estimate in ${c.isRegion ? 'Metro Detroit' : c.name}` })}

<section class="section"><div class="wrap split" style="align-items:start">
  <div><span class="eyebrow">${esc(s.short)} in ${esc(c.name)}</span><h2>${c.isRegion ? 'Serving homeowners across Oakland County and all of Metro Detroit' : `Local ${esc(s.short.toLowerCase())} for ${esc(c.name)} homes`}</h2>
    ${local.intro.slice(1).map((p) => `<p>${esc(p)}</p>`).join('')}
    <h3 style="margin-top:24px">${c.isRegion ? 'What every Metro Detroit homeowner gets' : `What we see in ${esc(c.name)}`}</h3>${checks(local.local)}</div>
  <div><div class="material"><h3>${c.isRegion ? 'Cities we serve' : 'Neighborhoods we serve'}</h3><p style="margin-bottom:12px">${c.isRegion ? 'Including, but not limited to:' : `${esc(c.name)} is mostly ${esc(c.housing)}. We work throughout:`}</p>
    <ul class="chips">${c.neighborhoods.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>
    ${!c.isRegion && c.nearbyOther.length ? `<p style="margin:14px 0 0" class="note">Also nearby: ${c.nearbyOther.map(esc).join(', ')}.</p>` : ''}
    ${c.isRegion ? `<p style="margin:14px 0 0">Core Oakland County cities: ${coreCities.map((x) => `<a href="${cityUrl(s, x)}">${esc(x.name)}</a>`).join(', ')}.</p>` : ''}</div></div>
</div></section>

${projs.length ? `<section class="section section--stone"><div class="wrap">
  <div class="section-head section-head--center"><span class="eyebrow">${localProjs.length ? 'Local projects' : 'Nearby projects'}</span><h2>${c.isRegion ? `Recent ${esc(s.short.toLowerCase())} projects in Metro Detroit` : `${esc(s.short)} projects in and near ${esc(c.name)}`}</h2></div>
  <div class="grid grid--3">${projs.map((p) => projectCard(p)).join('')}</div>
  ${sectionCta(ghostBtn(`/gallery/?service=${s.key}${!c.isRegion && localProjs.length ? '&amp;city=' + c.key : ''}`, 'More projects'))}
</div></section>` : ''}

${reviewsBlock(revs, { title: c.isRegion ? 'Reviews from Metro Detroit homeowners' : `Reviews from ${c.name} homeowners`, eyebrow: 'Local reviews' })}

<section class="section"><div class="wrap grid grid--2">
  <div class="cross"><h3>${esc(s.name)} services</h3><p>Replacement, repair, storm damage and insurance claims, shingle options, gutters and free inspections — plus typical costs.</p><a class="link-arrow" href="${svcUrl(s)}">See all ${esc(s.short.toLowerCase())} services</a>${nearbyLinks.length ? `<h3 style="margin-top:20px">Nearby cities</h3><ul class="chips" style="margin-top:10px">${nearbyLinks.map((n) => `<li><a href="${cityUrl(s, n)}">${esc(n.name)}</a></li>`).join('')}</ul>` : ''}</div>
  <div class="cross"><h3>More from Moda Building</h3><p>The same team also handles what’s below the roof line.</p><ul class="chips" style="margin-top:10px">${otherSvcs.map((o) => `<li><a href="${svcUrl(o)}">${esc(o.name)}</a></li>`).join('')}</ul></div>
</div></section>

${faqSection(faqs, { title: `${s.short} in ${c.isRegion ? 'Metro Detroit' : c.name}: FAQ`, stone: true })}
${ctaBand({ title: `Free ${esc(s.short.toLowerCase())} estimate in ${c.isRegion ? 'Metro Detroit' : esc(c.name)}` })}`;
    layout({ url, title: cityTitles[s.key](c), description: cityDesc[s.key](c), body, current: s.key, priority: '0.8',
      schema: [serviceSchema(s, [c], `${s.name} in ${where}`), faqSchema(faqs), crumbSchema(bc)] });
  }
}

/* ================= ABOUT ================= */
const owner = site.owner || {};
layout({ url: '/about/', title: 'About Moda Building | Oakland County Contractor', description: 'Meet Moda Building: a licensed and insured Metro Detroit contractor for roofing, basement waterproofing, finished basements and renovations.', priority: '0.6', current: 'about',
  schema: [crumbSchema([['Home', '/'], ['About', '/about/']])], body: `
${pageHero({ crumbsList: [['Home', '/'], ['About', '/about/']], eyebrow: 'About us', h1: 'Modern building, old-fashioned accountability', lead: 'Moda Building is a residential contractor serving Metro Detroit. We lead with roofing and bring the same standards to basements and renovations: honest inspections, clear quotes and work we are proud to put our name on.', location: 'about', formTitle: 'Get a free estimate', media: has(owner.photo) ? heroPhoto(owner.photo, `${owner.name || 'Owner'}, ${owner.title || 'Owner'} of Moda Building`) : heroPhoto(pic('team'), 'Moda Building team at a residential jobsite in Metro Detroit') })}
<section class="section"><div class="wrap split">
  <div><span class="eyebrow">Our story</span><h2>Why we started Moda Building</h2>
    <p>Moda Building started with a simple frustration: too many homeowners in Metro Detroit were getting vague quotes, missed start dates and crews that left a mess behind. We set out to build the kind of contractor we would want working on our own homes — one that shows up when promised, explains every option in plain language and treats each house like it belongs to family.</p>
    <p>Roofing became our core because a sound roof protects everything beneath it. From there, homeowners kept asking us to help with what came next: wet basements, unfinished lower levels and the renovations that make an older Oakland County home fit modern life.</p>
    <p>“Moda” points to modern design, and that is how we approach every project — clean details, durable materials and a process that respects your time and your home. Whether it is a new roof in Royal Oak or a lower-level theater in Bloomfield Hills, the standard does not change.</p></div>
  <div class="rounded">${img(pic('p2-after'), projAlt(proj('p2')), { sizes: '(min-width: 960px) 50vw, 100vw' })}</div>
</div></section>
${has(owner.name) ? `<section class="section section--stone"><div class="wrap split">
  ${has(owner.photo) ? `<div class="rounded">${img(owner.photo, `${owner.name}, ${owner.title || 'Owner'} of Moda Building`, { sizes: '(min-width: 960px) 50vw, 100vw' })}</div>` : ''}
  <div><span class="eyebrow">Meet the owner</span><h2>${esc(owner.name)}</h2><p class="lead">${esc(owner.title || 'Owner')}${has(site.yearsInBusiness) ? ` · ${esc(site.yearsInBusiness)} years in business` : ''}</p>${has(owner.bio) ? `<p>${esc(owner.bio)}</p>` : ''}<p>You deal with me directly — from the first inspection to the final walkthrough.</p></div>
</div></section>` : ''}
<section class="section${has(owner.name) ? '' : ' section--stone'}"><div class="wrap">
  <div class="section-head"><span class="eyebrow">Credentials</span><h2>Licensed, insured and accountable</h2></div>
  <div class="stat-row">
    ${has(site.yearsInBusiness) ? `<div class="stat"><strong>${esc(site.yearsInBusiness)}</strong><span>Years in business</span></div>` : '<div class="stat"><strong>Local</strong><span>Locally owned &amp; operated in Metro Detroit</span></div>'}
    ${hasRating() ? `<div class="stat"><strong>${esc(site.googleRating)}★</strong><span>Google rating (${esc(site.googleReviewCount)} reviews)</span></div>` : '<div class="stat"><strong>Free</strong><span>Inspections and written estimates</span></div>'}
    <div class="stat"><strong>MI</strong><span>Licensed residential builder${has(site.license) ? ` · ${esc(site.license)}` : ''}</span></div>
    <div class="stat"><strong>Insured</strong><span>General liability &amp; workers’ comp — certificates on request</span></div>
  </div>
  ${(site.certifications || []).length ? `<ul class="chips" style="margin-top:20px">${site.certifications.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>` : ''}
</div></section>
${ctaBand()}` });

/* ================= GALLERY ================= */
layout({ url: '/gallery/', title: 'Project Gallery: Roofing, Basements & Renovations | Moda Building', description: 'Before-and-after photos of Moda Building roofing, basement waterproofing, finished basement and renovation projects across Oakland County and Metro Detroit.', priority: '0.7', current: 'gallery',
  schema: [crumbSchema([['Home', '/'], ['Our Work', '/gallery/']])], body: `
${pageHero({ crumbsList: [['Home', '/'], ['Our Work', '/gallery/']], eyebrow: 'Our work', h1: 'Project gallery', lead: 'Projects labeled by service and city. Drag the sliders to compare before and after, or filter by the work you are planning.', location: 'gallery', formTitle: 'Get a free estimate', media: projectCard(proj('p15')) })}
<section class="section"><div class="wrap">
  <div class="section-head"><h2>Browse projects</h2></div>
  <div class="filters" role="group" aria-label="Filter projects">
    <div><label for="f-service">Service</label><select id="f-service"><option value="">All services</option>${services.map((s) => `<option value="${s.key}">${esc(s.name)}</option>`).join('')}</select></div>
    <div id="f-room-wrap"><label for="f-room">Room</label><select id="f-room"><option value="">All rooms</option>${[...new Set(projects.filter((p) => p.room).map((p) => p.room))].sort().map((r) => `<option>${esc(r)}</option>`).join('')}</select></div>
    <div><label for="f-city">City</label><select id="f-city"><option value="">All cities</option>${coreCities.map((c) => `<option value="${c.key}">${esc(c.name)}</option>`).join('')}</select></div>
    <p class="count" id="f-count" aria-live="polite"></p>
  </div>
  <div class="gallery-grid" data-gallery>${projects.map((p) => projectCard(p)).join('')}</div>
  <p id="f-empty" hidden>No projects match those filters yet — <a href="/contact/">ask us</a> for references in your area.</p>
</div></section>
${ctaBand()}` });

/* ================= REVIEWS — live Google feed + link to leave a review (built only when there is something real to show) ================= */
if (reviewsPageLive()) {
  const verified = liveReviews();
  layout({ url: '/reviews/', title: 'Customer Reviews | Moda Building Metro Detroit', description: 'Read Google reviews from Moda Building customers in Birmingham, Royal Oak, Bloomfield Hills, Rochester Hills, West Bloomfield and Beverly Hills.', priority: '0.6',
    schema: [crumbSchema([['Home', '/'], ['Reviews', '/reviews/']])], body: `
${pageHero({ crumbsList: [['Home', '/'], ['Reviews', '/reviews/']], eyebrow: 'Reviews', h1: 'What our customers say', lead: `${hasRating() ? `Rated ${esc(site.googleRating)} stars across ${esc(site.googleReviewCount)} Google reviews. ` : ''}Reviews from homeowners across Oakland County, straight from our Google Business Profile.`, location: 'reviews', formTitle: 'Get a free estimate', bulletsList: ['Verified Google reviews', 'Homeowners across Oakland County', 'Free, no-pressure estimates'], media: has(site.googleReviewUrl) ? `<p><a class="btn btn--cta" href="${esc(site.googleReviewUrl)}" rel="noopener" data-cta="leave-review">Leave us a review on Google</a></p>` : '' })}
${has(site.googleReviewsEmbed) ? `<section class="section"><div class="wrap"><div class="section-head section-head--center"><span class="eyebrow">Google reviews</span><h2>Live from Google</h2></div>${site.googleReviewsEmbed}</div></section>` : ''}
${verified.length >= 3 ? `<section class="section section--stone"><div class="wrap"><div class="section-head section-head--center"><span class="eyebrow">Reviews</span><h2>Recent reviews</h2></div><div class="reviews-grid">${triple(verified, 9).map(reviewCard).join('')}</div>${has(site.googleReviewUrl) ? sectionCta(`<a class="btn btn--ghost" href="${esc(site.googleReviewUrl)}" rel="noopener">Leave a review on Google</a>`) : ''}</div></section>` : ''}
${ctaBand()}` });
}

/* ================= FINANCING — only when a lender, terms and an apply link exist (otherwise the page is cut) ================= */
if (financingPageLive()) {
  const finFaq = [
    { q: 'What projects qualify for financing?', a: 'Roof replacements, basement waterproofing, finished basements and renovations may all qualify, subject to credit approval and project size.' },
    { q: 'Will applying affect my credit?', a: `Check with ${site.financing.partner} for how prequalification works and whether it affects your score.` },
    { q: 'Can I pay off early?', a: 'Confirm the terms of your specific plan before signing.' }
  ];
  layout({ url: '/financing/', title: 'Roofing & Remodeling Financing | Moda Building', description: `Financing through ${site.financing.partner} for roof replacement, basement waterproofing, finished basements and home renovations in Metro Detroit.`, priority: '0.6', schema: [faqSchema(finFaq), crumbSchema([['Home', '/'], ['Financing', '/financing/']])], body: `
${pageHero({ crumbsList: [['Home', '/'], ['Financing', '/financing/']], eyebrow: 'Financing', h1: 'Financing for your roof, basement or renovation', lead: `Financing through ${esc(site.financing.partner)}. ${esc(site.financing.terms)}`, location: 'financing', formTitle: 'Get a free estimate', media: `<p><a class="btn btn--cta" href="${esc(site.financing.applyUrl)}" rel="noopener" data-cta="financing-apply">Apply now</a></p>` })}
${faqSection(finFaq, { title: 'Financing FAQ', stone: true })}
${ctaBand()}` });
}

/* ================= CONTACT ================= */
const a = site.address;
layout({ url: '/contact/', title: 'Contact Us | Free Estimate | Moda Building', description: 'Request a free estimate from Moda Building for roofing, basement waterproofing, finished basements or renovations in Metro Detroit. Call or send the form.', priority: '0.8',
  schema: [crumbSchema([['Home', '/'], ['Contact', '/contact/']])], body: `
<section class="hero">${crumbs([['Home', '/'], ['Contact', '/contact/']])}<div class="wrap hero__grid">
  <div class="hero__copy"><span class="eyebrow">Contact / Free estimate</span><h1>Request your free estimate</h1>
    <p class="lead">Tell us about your project. We will confirm your details and schedule a free, no-pressure visit — usually within a few business days.</p>
    <ul class="contact-list">
      <li><strong>Phone</strong><a href="${telHref(site.phone)}" data-loc="contact-page">${esc(site.phone)}</a></li>
      <li><strong>Email</strong><a href="mailto:${esc(site.email)}">${esc(site.email)}</a></li>
      <li><strong>Hours</strong>${site.hours.map((h) => `${esc(h.days)}: ${esc(h.open)}${h.close ? '–' + esc(h.close) : ''}`).join('<br>')}</li>
      ${hasAddress() ? `<li><strong>Address</strong>${esc(a.street)}, ${esc(a.city)}, ${esc(a.region)} ${esc(a.zip)}</li>` : ''}
      ${has(site.license) ? `<li><strong>License</strong>${esc(site.license)}</li>` : ''}
    </ul>
    <div class="hero__extra"><h2 style="font-size:1.1rem;margin-bottom:10px">Cities we serve</h2>
    <ul class="chips">${coreCities.map((c) => `<li><a href="${cityUrl(services[0], c)}">${esc(c.name)}</a></li>`).join('')}<li><a href="/roofing/metro-detroit/">All of Metro Detroit</a></li></ul>
      <h2 style="font-size:1.1rem;margin:26px 0 10px">What happens next</h2>
      <ol class="next-steps"><li><strong>We call to confirm</strong> your project details — usually within one business day.</li><li><strong>Free on-site visit</strong> at a time that works for you.</li><li><strong>Written estimate</strong> with photos, options and a clear price.</li></ol>
    </div>
  </div>
  ${quoteForm({ location: 'contact-page', title: 'Get your free estimate' })}
</div></section>
${hasAddress() ? `<section class="section section--stone"><div class="wrap">
  <div class="section-head section-head--center"><span class="eyebrow">Find us</span><h2>Our office</h2><p class="lead">${esc(a.street)}, ${esc(a.city)}, ${esc(a.region)} ${esc(a.zip)}</p></div>
  <iframe class="map map--wide" title="Map: Moda Building, ${esc(a.street)}, ${esc(a.city)}" src="https://www.google.com/maps?q=${encodeURIComponent(`${site.name}, ${a.street}, ${a.city}, ${a.region} ${a.zip}`)}&amp;output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
</div></section>` : ''}` });

/* ================= BLOG (footer only; 2 posts) ================= */
layout({ url: '/blog/', title: 'Roofing & Basement Advice for Michigan Homeowners | Moda Building', description: 'Guides from Moda Building on roof replacement costs, basement waterproofing, finishing and renovating homes in Metro Detroit.', priority: '0.5',
  schema: [crumbSchema([['Home', '/'], ['Blog', '/blog/']])], body: `
${pageHero({ crumbsList: [['Home', '/'], ['Blog', '/blog/']], eyebrow: 'Blog', h1: 'Advice for Michigan homeowners', lead: 'Straight answers about roofs, basements and renovations in Metro Detroit.', location: 'blog', form: false })}
<section class="section"><div class="wrap">
  <div class="grid grid--2">${posts.map((p) => `<article class="card"><div class="card__img">${img(pic(`${p.service}-hero`), p.title, { sizes: '(min-width: 700px) 50vw, 100vw' })}</div><div class="card__body"><p class="proj__meta"><time datetime="${p.date}">${new Date(p.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time></p><h2 style="font-size:1.35rem"><a href="/blog/${p.slug}/" style="text-decoration:none">${esc(p.title)}</a></h2><p>${esc(p.excerpt)}</p><a class="link-arrow" href="/blog/${p.slug}/">Read article</a></div></article>`).join('')}</div>
</div></section>
${ctaBand({ href: '/contact/' })}` });
for (const p of posts) {
  const s = svcBy(p.service);
  const url = `/blog/${p.slug}/`;
  const bc = [['Home', '/'], ['Blog', '/blog/'], [p.title, url]];
  layout({ url, title: `${p.title} | Moda Building`.length > 70 ? p.title : `${p.title} | Moda Building`, description: p.description, priority: '0.5', ogImage: picUrl(`${p.service}-hero`),
    schema: [{ '@type': 'BlogPosting', headline: p.title, description: p.description, datePublished: p.date, author: { '@id': BIZ_ID }, publisher: { '@id': BIZ_ID }, mainEntityOfPage: SITE_URL + url }, crumbSchema(bc)],
    body: `
<article class="section section--article">${crumbs(bc)}<div class="wrap split" style="align-items:start">
  <div class="prose"><p class="proj__meta"><time datetime="${p.date}">${new Date(p.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time> · ${esc(s.name)}</p><h1 style="font-size:clamp(1.9rem,5vw,2.8rem)">${esc(p.title)}</h1>${p.body}</div>
  <aside>${quoteForm({ service: s.formValue, location: `blog-${p.slug}`, title: `Free ${s.short.toLowerCase()} estimate`, id: 'quote' })}</aside>
</div></article>
${ctaBand()}` });
}

/* ================= AD LANDING PAGES — one template; no menu, one form, one phone number ================= */
// Each LP: slim header → hero + form → trust bar → offer cards → (why-first) → before/after → reviews → how it works → 4 FAQs → final CTA → mini footer.
function lpTrust(extra) {
  const items = [];
  if (hasRating()) items.push([ICON.star, `${esc(site.googleRating)}★ Google rating`, `${esc(site.googleReviewCount)} reviews`]);
  if (has(site.yearsInBusiness)) items.push([ICON.calendar, `${esc(site.yearsInBusiness)} years in business`, '']);
  items.push([ICON.shield, 'Licensed &amp; insured', has(site.license) ? `MI Lic. ${esc(site.license)}` : 'Michigan residential builder']);
  if ((site.certifications || []).length) items.push([ICON.award, 'Certified installer', esc(site.certifications.join(' · '))]);
  items.push(extra);
  if (site.financing.offered) items.push([ICON.dollar, 'Financing available', 'On qualifying projects']);
  if (items.length < 4) items.splice(items.length - 1, 0, [ICON.clipboard, 'Free written estimates', 'No pressure, no surprises']);
  return trustBar(items.slice(0, 5));
}
function landingPage(cfg) {
  const url = `/lp/${cfg.slug}/`, ty = `${url}thank-you/`;
  const lp = { phone: lpPhone(), cta: cfg.cta };
  const formHtml = quoteForm({ location: `lp-${cfg.slug}`, title: cfg.formTitle, sub: cfg.formSub, action: ty, options: cfg.options, variant: 'lp', photo: cfg.photo, address: false, submitLabel: cfg.submitLabel, serviceLabel: cfg.serviceLabel });
  const body = `
<section class="hero hero--photo"><div class="hero__bg">${img(pic(cfg.heroImg), cfg.heroAlt, { eager: true, sizes: '100vw' })}</div>
<div class="wrap hero__grid">
  <div class="hero__copy"><span class="eyebrow">${cfg.eyebrow}</span><h1>${esc(cfg.h1)}</h1><p class="lead">${esc(cfg.sub)}</p>${bullets(cfg.bullets)}<div class="hero__ctas">${callBtn('lp-hero', 'btn btn--ghost', null, lp.phone)}</div></div>
  ${formHtml}
</div></section>
${lpTrust(cfg.trustExtra)}
${cfg.offer}
${cfg.whyFirst || ''}
<section class="section"><div class="wrap">
  <div class="section-head section-head--center"><span class="eyebrow">Before &amp; after</span><h2>${esc(cfg.baTitle)}</h2><p class="lead">Drag the slider to compare.</p></div>
  <div class="grid grid--3">${cfg.projects.map(([id, caption]) => projectCard(proj(id), { caption })).join('')}</div>
</div></section>
${reviewsBlock(liveReviews().filter(cfg.reviewFilter), { title: cfg.reviewsTitle, stone: true })}
${processSection({ dark: true, intro: 'Three simple steps.', steps: cfg.steps })}
${faqSection(cfg.faqs, { phone: lp.phone, intro: 'The questions we hear most.' })}
${ctaBand({ title: esc(cfg.h1), text: cfg.sub, points: cfg.bullets, buttonLabel: cfg.submitLabel, phone: lp.phone })}`;
  layout({ url, title: `${cfg.tabTitle || cfg.h1} | Moda Building`, description: cfg.sub, noindex: true, minimal: true, lp, sitemap: false, ogImage: picUrl(cfg.heroImg), body });
  layout({ url: ty, title: 'Thank You | Moda Building', description: 'Thank you — we received your request.', noindex: true, minimal: true, lp: { ...lp, cta: cfg.cta }, sitemap: false, bodyAttr: ` data-thankyou data-lp="${cfg.slug}"`, body: `
<section class="section"><div class="wrap ty">
  <div class="ty__check">${ICON.check}</div>
  <h1>Thank you — we’ve got your request</h1>
  <p class="lead" style="margin:0 auto">We will contact you shortly, usually within one business day. Need us sooner?</p>
  <p style="margin-top:20px">${callBtn('lp-thank-you', 'btn btn--cta', 'Call ' + lp.phone, lp.phone)}</p>
  <h2 style="font-size:1.3rem;margin-top:40px">What happens next</h2>
  <ol>${cfg.steps.map(([h, p]) => `<li><strong>${h}.</strong> ${p}</li>`).join('')}</ol>
</div></section>` });
}
const offerCards = (title, cards) => `<section class="section"><div class="wrap">
  <div class="section-head section-head--center"><span class="eyebrow">What we do</span><h2>${esc(title)}</h2></div>
  <div class="grid grid--3">${cards.map(([h, p, imgId]) => `<div class="card"><div class="card__img">${img(pic(imgId), `${h} — Moda Building`)}</div><div class="card__body"><h3>${h}</h3><p>${p}</p></div></div>`).join('')}</div>
</div></section>`;

landingPage({
  slug: 'roofing', cta: 'Free Estimate', h1: 'Metro Detroit Roof Replacement & Repair', sub: 'Free inspection and written estimate. Licensed & insured.',
  eyebrow: 'Roofing · Oakland County &amp; all of Metro Detroit',
  bullets: ['Free roof inspection', 'Storm &amp; insurance claim help — we meet your adjuster', `Workmanship + manufacturer warranty`],
  heroImg: 'roofing-hero', heroAlt: 'Completed roof replacement on a Metro Detroit home by Moda Building',
  formTitle: 'Get your free roof estimate', formSub: 'Takes about 60 seconds. We reply within one business day.', submitLabel: 'Get My Free Roof Estimate',
  serviceLabel: 'What do you need?', options: ['Replacement', 'Repair', 'Storm damage', 'Not sure'], photo: false,
  trustExtra: [ICON.award, 'Warranties', 'Workmanship + manufacturer'],
  offer: offerCards('Roofing done right, start to finish', [
    ['Roof Replacement', 'Full tear-off, new underlayment, flashing and ventilation — most homes done in 1–2 days.', 'p3-after'],
    ['Roof Repair &amp; Leaks', 'We trace the leak to its source and fix it — emergency tarping when you need it.', 'p6-after'],
    ['Storm/Hail Damage &amp; Insurance', 'Dated photo documentation and an on-site meeting with your adjuster.', 'p5-after']
  ]),
  baTitle: 'Recent roofs in Metro Detroit',
  projects: [['p1', 'Royal Oak — full tear-off, architectural shingles'], ['p2', 'Birmingham — Tudor re-roof in designer shingles'], ['p4', 'Rochester Hills — hail-damage insurance replacement']],
  reviewFilter: (r) => r.service === 'roofing', reviewsTitle: 'What homeowners say about their new roof',
  steps: [['Free inspection', 'We inspect, measure and photograph your roof — and show you exactly what we found.'], ['Written estimate', 'A clear, line-item quote with options. No pressure, no vague allowances.'], ['Install + cleanup + warranty', 'A protected yard, a magnetic nail sweep and your warranty registered for you.']],
  faqs: [
    { q: 'Is the estimate free?', a: 'Yes. The inspection and written estimate are free, with no obligation.' },
    { q: 'Do you help with insurance claims?', a: 'Yes. For storm and hail damage we document everything with dated photos and meet your adjuster on-site so the claim reflects what is actually on your roof.' },
    { q: 'How long does a replacement take?', a: 'Most single-family homes are torn off and re-roofed in one to two days. Larger or steeper roofs, or premium materials, can take longer — we give you a schedule before we start.' },
    { q: 'Do you offer financing?', a: 'Yes, financing is available on qualifying projects. Ask about current options during your free estimate.' }
  ]
});

landingPage({
  slug: 'basements', cta: 'Free Consultation', h1: 'Dry, Finished Basements in Oakland County', sub: 'Waterproofing and basement finishing by one team — free in-home consultation.',
  eyebrow: 'Basement waterproofing &amp; finishing',
  bullets: ['Free in-home consultation', 'Waterproofing first, then finishing — one team', 'Written, transferable waterproofing warranty'],
  heroImg: 'finished-basements-hero', heroAlt: 'Finished basement living space in Oakland County by Moda Building',
  formTitle: 'Book your free consultation', formSub: 'Takes about 60 seconds. We reply within one business day.', submitLabel: 'Get My Free Consultation',
  serviceLabel: 'What do you need?', options: ['Waterproofing', 'Basement finishing', 'Both', 'Not sure'], photo: true,
  trustExtra: [ICON.award, 'Waterproofing warranty', 'Written &amp; transferable'],
  offer: `<section class="section"><div class="wrap">
  <div class="section-head section-head--center"><span class="eyebrow">Pick your situation</span><h2>Where is your basement today?</h2></div>
  <div class="grid grid--2 situations">
    <div class="situation"><span class="problem__icon">${ICON.drop}</span><h3>Water or dampness?</h3>${checks(['Leaks after rain or snowmelt', 'Cracks in walls or floor', 'Sump pump problems', 'Musty smell or white powder on walls'])}<a class="btn btn--cta" href="#quote" data-problem="Water or dampness" data-service="Waterproofing" data-cta="lp-dry">Dry my basement</a></div>
    <div class="situation"><span class="problem__icon">${ICON.sofa}</span><h3>Ready to finish it?</h3>${checks(['Family room', 'Bar', 'Theater', 'Guest suite or gym'])}<a class="btn btn--cta" href="#quote" data-problem="Ready to finish it" data-service="Basement finishing" data-cta="lp-finish">Plan my basement</a></div>
  </div>
</div></section>`,
  whyFirst: `<section class="section section--stone"><div class="wrap narrow-center">
  <span class="eyebrow">Why waterproof first</span><h2>Finish a wet basement and you’ll pay for it twice</h2>
  <p class="lead">Drywall, carpet and framing hide moisture until it becomes mold and torn-out walls. We inspect first, fix the water, then build — so your new space stays dry, healthy and covered by one team.</p>
</div></section>`,
  baTitle: 'Wet to dry. Unfinished to finished.',
  projects: [['p7', 'Birmingham — interior drain tile in a 1920s basement'], ['p8', 'Rochester Hills — poured-wall crack injection'], ['p10', 'Royal Oak — new sump pit and downspout re-route'], ['p11', 'Bloomfield Hills — lower-level theater and wine room'], ['p12', 'Royal Oak — family room, office and second bath'], ['p14', 'Rochester Hills — home gym and rec room']],
  reviewFilter: (r) => r.service === 'basement-waterproofing' || r.service === 'finished-basements', reviewsTitle: 'What homeowners say about their basement',
  steps: [['Free inspection &amp; design consult', 'We check for moisture, measure the space and talk through how you want to use it.'], ['Fixed written quote', 'One clear, fixed-scope price for the waterproofing and the finish work.'], ['Build', 'Waterproofing first, then finishing — one team, one schedule.']],
  faqs: [
    { q: 'Do I need waterproofing before finishing?', a: 'If you have any signs of water — staining, efflorescence, musty smells or past leaks — yes. Finishing over moisture leads to mold and torn-out drywall. We check during the free consultation and tell you honestly.' },
    { q: 'Is the consultation free?', a: 'Yes. The in-home inspection and design consultation are free, with no obligation.' },
    { q: 'Do you handle permits?', a: 'Yes. We pull the building, electrical, mechanical and plumbing permits and schedule every inspection.' },
    { q: 'Do you offer financing?', a: 'Yes, financing is available on qualifying projects. Ask about current options during your free consultation.' }
  ]
});

landingPage({
  slug: 'renovations', cta: 'Free Consultation', tabTitle: 'Kitchen, Bath & Whole-Home Renovations', h1: 'Kitchen, Bath & Whole-Home Renovations in Oakland County', sub: 'Modern design-build renovations by one team — free in-home consultation.',
  eyebrow: 'Renovations · Oakland County',
  bullets: ['Free design consultation', 'Fixed-scope written proposal', 'One team from design to final walkthrough'],
  heroImg: 'renovations-hero', heroAlt: 'Modern kitchen renovation in Oakland County by Moda Building',
  formTitle: 'Book your free consultation', formSub: 'Takes about 60 seconds. We reply within one business day.', submitLabel: 'Get My Free Consultation',
  serviceLabel: 'What are you planning?', options: ['Kitchen', 'Bathroom', 'Whole-home remodel', 'Addition', 'Not sure'], photo: true,
  trustExtra: [ICON.award, 'Warranties', 'Workmanship + manufacturer'],
  offer: offerCards('Renovations, designed and built by one team', [
    ['Kitchens', 'Layouts that work, real islands, and cabinetry and lighting planned in detail.', 'p17-after'],
    ['Bathrooms', 'Primary suites with curbless showers, double vanities and heated floors.', 'p20-after'],
    ['Whole-home &amp; additions', 'Open floor plans, structural changes and additions that look original to the house.', 'p16-after']
  ]),
  baTitle: 'Recent renovations in Oakland County',
  projects: [['p15', 'Bloomfield Hills — open kitchen and great room'], ['p18', 'Beverly Hills — ranch whole-home refresh'], ['p19', 'Royal Oak — bungalow kitchen opening']],
  reviewFilter: (r) => r.service === 'renovations', reviewsTitle: 'What homeowners say about their renovation',
  steps: [['Free design consultation', 'We visit, measure and talk through how you want to live in the space.'], ['Fixed-scope proposal', 'Drawings, selections and one clear written price before work begins.'], ['Build', 'One team, one schedule and one point of contact to the final walkthrough.']],
  faqs: [
    { q: 'Is the consultation free?', a: 'Yes. The in-home design consultation is free, with no obligation.' },
    { q: 'Can we live at home during the renovation?', a: 'Often, yes. We phase the work and seal off work areas; for larger projects we talk honestly about when a short move-out makes sense.' },
    { q: 'Do you provide design, or do I need an architect?', a: 'We are design-build: our team handles design, drawings and selections, and coordinates engineering for structural changes and permits.' },
    { q: 'Do you offer financing?', a: 'Yes, financing is available on qualifying projects. Ask about current options during your free consultation.' }
  ]
});

/* ================= THANK YOU (main site) ================= */
layout({ url: '/thank-you/', title: 'Thank You — We Received Your Request | Moda Building', description: 'Thank you for contacting Moda Building. We will be in touch shortly to schedule your free estimate.', noindex: true, sitemap: false, bodyAttr: ' data-thankyou', body: `
<section class="section"><div class="wrap ty">
  <div class="ty__check">${ICON.check}</div>
  <h1>Thank you — we’ve got your request</h1>
  <p class="lead" style="margin:0 auto">A member of our team will contact you shortly, usually within one business day. Need us sooner?</p>
  <p style="margin-top:20px">${callBtn('thank-you', 'btn btn--cta', 'Call ' + site.phone)}</p>
  <h2 style="font-size:1.3rem;margin-top:40px">What happens next</h2>
  <ol><li><strong>We call to confirm</strong> your project details and answer quick questions.</li><li><strong>We schedule a free visit</strong> at a time that works for you.</li><li><strong>You get a written estimate</strong> with photos, options and a clear price.</li></ol>
  <p><a href="/">Back to home</a> · <a href="/gallery/">Browse our projects</a></p>
</div></section>` });

/* ================= PRIVACY POLICY ================= */
layout({ url: '/privacy-policy/', title: 'Privacy Policy | Moda Building', description: 'How Moda Building collects, uses and protects information submitted through modabuilding.com, including cookies, analytics and advertising.', priority: '0.2', body: `
<section class="section section--article">${crumbs([['Home', '/'], ['Privacy policy', '/privacy-policy/']])}<div class="wrap"><div class="prose">
<h1>Privacy policy</h1>
<p class="note">Last updated: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.</p>
<p>This policy explains how ${esc(site.name)} (“we”, “us”) collects and uses information when you visit modabuilding.com or contact us.</p>
<h2>Information we collect</h2>
<ul><li><strong>Information you provide:</strong> name, phone number, email, city and optional street address, budget range, service requested, project details and any photos you upload through our estimate form.</li><li><strong>Advertising and campaign data:</strong> when you arrive from an ad or link, we record campaign parameters (such as UTM tags and Google or Meta click IDs) with your request so we know which campaigns work.</li><li><strong>Usage data:</strong> pages visited, device and browser information collected through cookies and similar technologies, if you consent.</li><li><strong>Phone calls:</strong> we may use a call tracking service that records the source of calls and, where disclosed, the call itself for quality and training.</li></ul>
<h2>How we use information</h2>
<ul><li>To respond to your request, schedule estimates and provide our services.</li><li>To contact you by phone or email about your project.</li><li>To send text messages about your estimate and appointment, <strong>only if you opt in</strong> by checking the text-message box on our form. Message frequency varies; message and data rates may apply. Reply STOP to opt out or HELP for help. Consent to texts is not a condition of any purchase. We do not share your phone number or text-message consent with third parties for their marketing.</li><li>To measure and improve our website and advertising.</li></ul>
<p>We do not sell your personal information.</p>
<h2 id="cookies">Cookies and advertising</h2>
<p>With your consent, we use Google Analytics 4, Google Ads conversion tracking and the Meta Pixel (including Meta’s Conversions API) to understand how visitors use our site and to measure our ads. These providers may set cookies and process data under their own privacy policies. You can accept or decline non-essential cookies in our cookie notice and change your choice at any time using “Cookie settings” in the footer. You can also manage ad preferences at <a href="https://adssettings.google.com" rel="noopener">Google Ad Settings</a> and in your Meta account settings.</p>
<h2>Sharing</h2>
<p>We share information only with service providers that help us run our business (for example, website hosting, form processing, CRM, email/SMS and call tracking providers, and financing partners if you request financing), or when required by law.</p>
<h2>Retention and security</h2>
<p>We keep information only as long as needed for the purposes above and protect it with reasonable safeguards, including encrypted (HTTPS) connections.</p>
<h2>Your choices</h2>
<p>You may ask us to access, correct or delete your information by emailing <a href="mailto:${esc(site.email)}">${esc(site.email)}</a> or calling <a href="${telHref(site.phone)}" data-loc="privacy">${esc(site.phone)}</a>.</p>
<h2>Children</h2><p>This site is not directed to children under 13, and we do not knowingly collect their information.</p>
<h2>Contact</h2><p>${esc(site.name)}${hasAddress() ? `, ${esc(a.street)}, ${esc(a.city)}, ${esc(a.region)} ${esc(a.zip)}` : ', Metro Detroit, Michigan'} · <a href="mailto:${esc(site.email)}">${esc(site.email)}</a> · <a href="${telHref(site.phone)}" data-loc="privacy-contact">${esc(site.phone)}</a></p>
</div></div></section>` });

/* ================= BRAND OPTIONS (designer proposal — noindex) ================= */
const palettes = [
  { name: 'Option A — Slate & Copper (in use)', note: 'Premium, warm and roofing-appropriate. Copper accent reserved for CTAs.', c: [['Ink', '#121b24'], ['Stone', '#f5f2ed'], ['Line', '#e2dcd2'], ['Copper CTA', '#c2410c']] },
  { name: 'Option B — Graphite & Signal Green', note: 'Modern and architectural; green accent reads as “go”.', c: [['Graphite', '#1b1f23'], ['Fog', '#f3f4f2'], ['Line', '#dfe2de'], ['Green CTA', '#15803d']] },
  { name: 'Option C — Navy & Brass', note: 'Classic and upscale for Birmingham / Bloomfield Hills audiences.', c: [['Navy', '#0f2236'], ['Ivory', '#f7f4ec'], ['Line', '#e4dccb'], ['Brass CTA', '#a16207']] }
];
layout({ url: '/brand/', title: 'Brand Options | Moda Building', description: 'Logo and color options for owner approval.', noindex: true, sitemap: false, body: `
<section class="section"><div class="wrap">
  <div class="section-head"><span class="eyebrow">For owner approval</span><h1>Brand options</h1><p class="lead">The brief asks the designer to propose 2–3 options until final logo and colors come from the owner. Each palette keeps one strong accent color reserved for buttons and calls-to-action. Option A is applied to this build; switching is a one-line change to the CSS variables.</p></div>
  <div class="grid grid--3">${palettes.map((p) => `<div class="card"><div class="card__body"><h2 style="font-size:1.15rem">${p.name}</h2><p>${p.note}</p>
    <div style="display:flex;align-items:center;gap:10px;padding:16px;border-radius:12px;background:${p.c[1][1]};color:${p.c[0][1]};margin:6px 0 12px"><span class="logo">${ui.logoImg({ alt: 'Moda Building logo' })}</span></div>
    <div class="swatches">${p.c.map(([n, h]) => `<div class="swatch"><div style="background:${h}"></div><p><strong>${n}</strong><br>${h}</p></div>`).join('')}</div>
    <p style="margin-top:14px"><span class="btn" style="background:${p.c[3][1]};color:#fff">Get a Free Estimate</span></p></div></div>`).join('')}</div>
</div></section>` });

/* ================= 404 ================= */
layout({ url: '/404.html', title: 'Page Not Found | Moda Building', description: 'The page you are looking for could not be found.', noindex: true, sitemap: false, body: `
<section class="section"><div class="wrap ty"><h1>Page not found</h1><p class="lead" style="margin:0 auto 24px">That page may have moved. Try one of these:</p>
<ul class="chips" style="justify-content:center">${services.map((s) => `<li><a href="${svcUrl(s)}">${esc(s.name)}</a></li>`).join('')}<li><a href="/contact/">Free estimate</a></li></ul></div></section>` });

/* ---------- Static assets ---------- */
fs.copyFileSync(path.join(OUT, 'assets/favicon.ico'), path.join(OUT, 'favicon.ico')); // root fallback for crawlers/browsers
const today = new Date().toISOString().slice(0, 10);
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map((p) => `  <url><loc>${SITE_URL}${p.url}</loc><lastmod>${today}</lastmod><priority>${p.priority}</priority></url>`).join('\n')}\n</urlset>\n`);
write('robots.txt', IS_PREVIEW_HOST ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

console.log(`Built ${pages.length} indexable pages (+ 3 ad landing pages with thank-you pages, thank-you, brand, 404) into ./site`);
