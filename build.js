#!/usr/bin/env node
// Static site generator for modabuilding.com — run `node build.js`, output goes to /site.
// No dependencies. Edit content in src/data/*, styles in src/assets/css, behavior in src/assets/js.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const ui = require('./src/lib/ui');
const ph = require('./src/lib/placeholders');
const projects = require('./src/data/projects');
const reviews = require('./src/data/reviews');
const posts = require('./src/data/posts');
const { pic, hasPhoto, site, services, cities, coreCities, esc, val, isPh, telHref, svcBy, cityBy, svcUrl, cityUrl, ICON, img, callBtn, quoteBtn, quoteForm, header, footer, mobileBar, trustStrip, crumbs, processSection, reviewCard, reviewsCarousel, projectCard, faqSection, ctaBand, areasSection, financingCallout } = ui;

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
    image: `${SITE_URL}${pic('home-hero')}`,
    logo: `${SITE_URL}/assets/logo.svg`,
    priceRange: '$$',
    areaServed: [...coreCities.map((c) => ({ '@type': 'City', name: `${c.name}, MI` })), { '@type': 'AdministrativeArea', name: 'Metro Detroit, MI' }],
    openingHours: site.hours.map((h) => h.schema).filter(Boolean),
    sameAs: Object.values(site.social).concat(site.googleBusinessProfileUrl).filter(Boolean)
  };
  if (![a.street, a.city, a.zip].some(isPh)) b.address = { '@type': 'PostalAddress', streetAddress: a.street, addressLocality: a.city, addressRegion: a.region, postalCode: a.zip, addressCountry: 'US' };
  else b.address = { '@type': 'PostalAddress', addressRegion: a.region, addressCountry: 'US' };
  if (!isPh(site.googleRating) && !isPh(site.googleReviewCount)) b.aggregateRating = { '@type': 'AggregateRating', ratingValue: site.googleRating, reviewCount: site.googleReviewCount };
  const real = reviews.filter((r) => !r.sample);
  if (real.length) b.review = real.slice(0, 10).map((r) => ({ '@type': 'Review', author: { '@type': 'Person', name: r.name }, reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5 }, reviewBody: r.text }));
  return b;
}
const faqSchema = (items) => ({ '@type': 'FAQPage', mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) });
const crumbSchema = (list) => ({ '@type': 'BreadcrumbList', itemListElement: list.map(([n, u], i) => ({ '@type': 'ListItem', position: i + 1, name: n, item: SITE_URL + u })) });
const serviceSchema = (s, areas, name) => ({ '@type': 'Service', name: name || s.name, serviceType: s.name, provider: { '@id': BIZ_ID }, areaServed: areas.map((c) => (c.isRegion ? { '@type': 'AdministrativeArea', name: 'Metro Detroit, MI' } : { '@type': 'City', name: `${c.name}, MI` })) });

/* ---------- Layout ---------- */
function layout({ url, title, description, body, schema = [], noindex = false, minimal = false, current = '', bodyAttr = '', ogImage = pic('home-hero'), sitemap = true, priority = '0.6' }) {
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
<meta name="theme-color" content="#121b24">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${SITE_URL}${url}">
<meta property="og:image" content="${SITE_URL}${ogImage}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
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
${header({ minimal, current })}
<main id="main">
${body}
</main>
${footer({ minimal })}
${mobileBar()}
<script src="/assets/js/main.js?v=${JS_V}" defer></script>
</body>
</html>
`;
  // Pages without a quote form send "Get a Free Estimate" buttons to the contact page instead of #quote.
  let out = body.includes('id="quote"') ? html : html.replace(/href="#quote"/g, 'href="/contact/"');
  if (BASE) out = out.replace(/(href|src|action)="\/(?!\/)/g, `$1="${BASE}/`).replace(/srcset="([^"]+)"/g, (m, v) => `srcset="${v.replace(/(^|,\s*)\//g, `$1${BASE}/`)}"`).replace(/url\(\/assets/g, `url(${BASE}/assets`);
  write(url === '/404.html' ? '404.html' : path.join(url, 'index.html'), out);
}

const bullets = (list) => `<ul class="hero__bullets">${list.map((b) => `<li>${ICON.check}<span>${b}</span></li>`).join('')}</ul>`;
const checks = (list) => `<ul class="checks">${list.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>`;

// Standard page hero: copy left, quote form right (desktop) / below (mobile).
function pageHero({ eyebrow, h1, lead, bulletsList = [], service = '', city = '', location, media = '', formTitle, ctas = true }) {
  return `<section class="hero"><div class="wrap hero__grid">
  <div class="hero__copy">${eyebrow ? `<span class="eyebrow">${esc(eyebrow)}</span>` : ''}<h1>${h1}</h1><p class="lead">${lead}</p>
    ${bulletsList.length ? bullets(bulletsList) : ''}
    ${ctas ? `<div class="hero__ctas">${callBtn(location + '-hero')}</div>` : ''}
    ${media}</div>
  ${quoteForm({ service, city, location: location + '-hero', title: formTitle })}
</div></section>`;
}

/* ================= HOMEPAGE ================= */
(function home() {
  const roof = services[0];
  const svcCards = services.map((s, i) => `<a class="svc${i === 0 ? ' svc--main' : ''}" href="${svcUrl(s)}">${img(pic(`${s.key}-hero`), `${s.name} project by Moda Building in Oakland County`, { sizes: '(min-width: 1080px) 40vw, (min-width: 760px) 33vw, 100vw' })}<div class="svc__body">${i === 0 ? '<span class="tag">Our main service</span>' : ''}<h3>${esc(s.name)}</h3><p>${esc(s.cardText)}</p><span class="go">${i === 0 ? 'Explore roofing' : 'Learn more'} →</span></div></a>`).join('');
  const why = [
    [ICON.clipboard, 'Photo-documented inspections', 'You see what we see. Every recommendation comes with photos, so you can decide with confidence.'],
    [ICON.ruler, 'Clear, line-item quotes', 'Materials, labor and options spelled out in writing. No vague allowances, no pressure to sign today.'],
    [ICON.home, 'Respect for your home', 'Protected landscaping and floors, a tidy site every day, and a magnetic sweep for nails on every roof.'],
    [ICON.shield, 'Warranties that mean something', 'Workmanship warranties plus manufacturer coverage — registered for you and documented at handoff.']
  ];
  const featured = ['p1', 'p11', 'p7', 'p15', 'p2', 'p12'].map((id) => projects.find((p) => p.id === id));
  const homeFaq = [
    { q: 'What areas do you serve?', a: 'Roofing and basement waterproofing throughout Metro Detroit. Finished basements and full renovations focus on Birmingham, Royal Oak, Bloomfield Hills, Rochester Hills, West Bloomfield and Beverly Hills, with other Metro Detroit cities on request.' },
    { q: 'Are estimates really free?', a: 'Yes. Inspections and written estimates are free and come with no obligation.' },
    { q: 'How quickly can you come out?', a: 'Most estimate visits are scheduled within a few business days. For active roof leaks and storm damage, we prioritize emergency tarping and repairs.' },
    { q: 'Are you licensed and insured?', a: `Yes. Moda Building is a licensed Michigan residential builder (license ${site.license.replace(/^\[|\]$/g, '')}) and carries liability and workers’ compensation insurance. Certificates are available on request.` },
    { q: 'Do you offer financing?', a: 'Yes, financing is available on qualifying projects. See our financing page for details or ask during your estimate.' },
    { q: 'Do you help with insurance claims?', a: 'For storm and hail damage, we document the damage with dated photos and meet your adjuster on-site so your claim reflects what is actually on your roof.' }
  ];
  const body = `
<section class="hero hero--photo"><div class="hero__bg">${img(pic('home-hero'), 'Newly replaced architectural shingle roof on an upscale Metro Detroit home', { eager: true, sizes: '100vw' })}</div>
<div class="wrap hero__grid">
  <div class="hero__copy"><span class="eyebrow">Roofing · Waterproofing · Basements · Renovations</span>
    <h1>Metro Detroit’s Trusted Roofing Contractor</h1>
    <p class="lead">Roof replacement, repair and storm damage for homeowners from Birmingham to Rochester Hills — with free inspections, clear written quotes and craftsmanship you can see.</p>
    ${bullets(['Free roof inspection with photos', 'Storm &amp; hail damage — we meet your adjuster', `Licensed &amp; insured · ${val(site.googleRating)}★ on Google`])}
    <div class="hero__ctas">${callBtn('home-hero')}</div>
  </div>
  ${quoteForm({ service: 'Roofing', location: 'home-hero', title: 'Get your free roofing estimate', heading: 'h2' })}
</div></section>
${trustStrip()}

<section class="section"><div class="wrap">
  <div class="section-head"><span class="eyebrow">Our services</span><h2>Roofing first. Everything your home needs, under one roof.</h2><p class="lead">Roofing is what we are known for. We also keep basements dry, finish them beautifully and renovate whole homes across Oakland County.</p></div>
  <div class="svc-grid">${svcCards}</div>
</div></section>

<section class="section section--stone"><div class="wrap">
  <div class="section-head"><span class="eyebrow">Why Moda Building</span><h2>Premium work. Straight answers.</h2></div>
  <div class="why why--4">${why.map(([i, h, p]) => `<div class="why__item"><div class="why__icon">${i}</div><div><h3>${h}</h3><p>${p}</p></div></div>`).join('')}</div>
</div></section>

<section class="section"><div class="wrap">
  <div class="section-head"><span class="eyebrow">Recent projects</span><h2>Before and after</h2><p class="lead">Drag the slider to compare. Every project is labeled by service and city.</p></div>
  <div class="grid grid--3">${featured.map((p) => projectCard(p)).join('')}</div>
  <p style="margin-top:28px"><a class="btn btn--ghost" href="/gallery/">View the full gallery</a></p>
</div></section>

${reviewsCarousel(reviews, { stone: true })}
${processSection({ dark: true })}
${areasSection()}
${financingCallout()}
${faqSection(homeFaq, { stone: true })}
${ctaBand({ service: '', title: 'Get your free estimate today' })}`;
  layout({ url: '/', title: 'Moda Building | Metro Detroit Roofing & Home Contractor', description: 'Moda Building is a Metro Detroit roofing contractor for roof replacement, repair and storm damage, plus basement waterproofing, finished basements and renovations. Free estimates.', body, schema: [faqSchema(homeFaq)], priority: '1.0' });
})();

/* ================= SERVICE PAGES ================= */
for (const s of services) {
  const sProjects = projects.filter((p) => p.service === s.key);
  const sReviews = reviews.filter((r) => r.service === s.key);
  const sCities = s.cityKeys.map(cityBy);
  const roofLink = s.key !== 'roofing' ? `<div class="cross" style="margin-top:20px"><h3>Need a roof, too?</h3><p>Roofing is our main service across all of Metro Detroit. Overflowing gutters and roof leaks are a common source of interior water damage — we can inspect both in one visit.</p><a class="link-arrow" href="/roofing/">Roofing services</a></div>` : '';
  const cross = svcBy(s.crossSell.to);
  const body = `
${crumbs([['Home', '/'], [s.name, svcUrl(s)]])}
${pageHero({ eyebrow: `${s.name} · ${s.coverage}`, h1: esc(s.h1), lead: esc(s.heroSub), bulletsList: ['Free in-home inspection and written quote', 'Licensed, insured &amp; warrantied', 'Financing on qualifying projects'], service: s.formValue, location: s.key, formTitle: `Get a free ${s.short.toLowerCase()} estimate` })}
${trustStrip()}

<section class="section"><div class="wrap split">
  <div><span class="eyebrow">${esc(s.name)}</span><h2>${s.key === 'roofing' ? 'Built for Michigan weather' : s.key === 'basement-waterproofing' ? 'Find the cause. Fix it for good.' : s.key === 'finished-basements' ? 'Space that feels like the main floor' : 'Modern design, respectful of your home'}</h2>${s.intro.map((p) => `<p>${esc(p)}</p>`).join('')}
    <ul class="toc" aria-label="On this page">${s.subservices.map((x) => `<li><a href="#${x.id}">${esc(x.title)}</a></li>`).join('')}</ul></div>
  <div class="rounded">${img(pic(`${s.key}-hero`), `${s.name} by Moda Building in Oakland County, MI`, { sizes: '(min-width: 960px) 50vw, 100vw' })}</div>
</div></section>

<section class="section section--stone"><div class="wrap">
  <div class="section-head"><span class="eyebrow">What we do</span><h2>${esc(s.name)} services</h2></div>
  ${s.subservices.map((x) => `<div class="sub" id="${x.id}"><h3>${esc(x.title)}</h3><div><p>${esc(x.text)}</p>${x.points.length ? checks(x.points) : ''}${x.id === 'free-inspection' || x.id === 'design-build' || x.id === 'design-process' ? `<p style="margin-top:14px">${quoteBtn(`${s.key}-${x.id}`, 'Book a free visit')}</p>` : ''}</div></div>`).join('')}
</div></section>

<section class="section"><div class="wrap">
  <div class="section-head"><span class="eyebrow">${s.key === 'renovations' ? 'Projects & timelines' : s.key === 'basement-waterproofing' ? 'Solutions' : s.key === 'finished-basements' ? 'Materials' : 'Shingle types & materials'}</span><h2>${s.key === 'roofing' ? 'Choosing your roofing material' : s.key === 'basement-waterproofing' ? 'Which waterproofing fix fits your home?' : s.key === 'finished-basements' ? 'Built for below grade' : 'Typical project types'}</h2></div>
  <div class="materials">${s.materials.map((m) => `<div class="material"><h3>${esc(m.name)}</h3><span class="life">${esc(m.life)}</span><p>${esc(m.note)}</p></div>`).join('')}</div>
</div></section>

<section class="section section--stone" id="cost"><div class="wrap split" style="align-items:start">
  <div><span class="eyebrow">Cost</span><h2>What affects the cost of ${esc(s.name.toLowerCase())}?</h2>${checks(s.costFactors)}</div>
  <div><table class="table"><caption class="sr-only">Typical price ranges</caption><thead><tr><th scope="col">Project</th><th scope="col">Typical range</th></tr></thead><tbody>${s.priceRanges.map((r) => `<tr><td>${esc(r.label)}</td><td>${esc(r.range)}</td></tr>`).join('')}</tbody></table>
  <p class="note" style="margin-top:10px">Ballpark ranges for planning only. Your written quote is based on an on-site inspection.</p></div>
</div></section>

<section class="section"><div class="wrap">
  <div class="section-head"><span class="eyebrow">Project gallery</span><h2>Recent ${esc(s.short.toLowerCase())} projects</h2></div>
  <div class="grid grid--3">${sProjects.slice(0, 6).map((p) => projectCard(p)).join('')}</div>
  <p style="margin-top:28px"><a class="btn btn--ghost" href="/gallery/?service=${s.key}">See all ${esc(s.short.toLowerCase())} projects</a></p>
</div></section>

${reviewsCarousel(sReviews, { title: `${s.short} reviews`, stone: true })}

<section class="section"><div class="wrap">
  <div class="cross"><span class="eyebrow">${s.key === 'basement-waterproofing' ? 'Dry it, then finish it' : 'Related service'}</span><h3>${esc(cross.name)}</h3><p>${esc(s.crossSell.text)}</p><a class="link-arrow" href="${svcUrl(cross)}">${esc(s.crossSell.cta)}</a></div>
  ${roofLink}
</div></section>

<section class="section section--ink"><div class="wrap">
  <div class="section-head"><span class="eyebrow">Local service</span><h2>${esc(s.name)} near you</h2><p class="lead" style="color:#c9d1d9">${s.key === 'roofing' || s.key === 'basement-waterproofing' ? 'We serve all of Metro Detroit. Choose your city for local projects and reviews.' : s.key === 'finished-basements' ? 'Finished basements throughout Metro Detroit, with a focus on these Oakland County communities.' : 'Full renovations focused on six Oakland County communities. Elsewhere in Metro Detroit on request.'}</p></div>
  <div class="areas">${sCities.map((c) => `<div class="area"><h3><a href="${cityUrl(s, c)}">${esc(s.short)} in ${esc(c.name)}${c.isRegion ? '' : ', MI'}</a></h3></div>`).join('')}</div>
</div></section>

${processSection()}
${faqSection(s.faqs, { title: `${s.name} FAQ` })}
${ctaBand({ service: s.formValue, title: `Get a free ${s.short.toLowerCase()} estimate` })}`;
  layout({ url: svcUrl(s), title: s.title, description: s.description, body, current: s.key, ogImage: pic(`${s.key}-hero`), priority: '0.9',
    schema: [serviceSchema(s, sCities), faqSchema(s.faqs), crumbSchema([['Home', '/'], [s.name, svcUrl(s)]])] });
}

/* ================= LOCATION PAGES (service × city) ================= */
const cityTitles = {
  roofing: (c) => c.isRegion ? 'Roofing Across Metro Detroit: Oakland, Macomb & Wayne | Moda Building' : `Roofing Contractor ${c.name}, MI | Moda Building`,
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
  roofing: (c) => c.isRegion ? 'Roof replacement, repair and storm damage across Oakland, Macomb and Wayne counties. Free roof inspections and written quotes from Moda Building.' : `Roof replacement and repair in ${c.name}, MI. Storm and hail damage, insurance claims, gutters and free roof inspections from Moda Building.`,
  'basement-waterproofing': (c) => c.isRegion ? 'Basement waterproofing across Metro Detroit: crack repair, interior drain tile, sump pumps and foundation repair with a written warranty.' : `Basement waterproofing in ${c.name}, MI: leak and crack repair, interior drain tile, sump pumps and foundation repair, with a written warranty.`,
  'finished-basements': (c) => `Design-build finished basements in ${c.name}, MI: family rooms, bars, theaters, guest suites, egress windows and bathrooms. Free consultation.`,
  renovations: (c) => `Whole-home remodels, kitchens, bathrooms and additions in ${c.name}, MI. Modern design-build renovations by Moda Building. Free consultation.`
};

for (const s of services) {
  for (const c of s.cityKeys.map(cityBy)) {
    const local = c.pages[s.key];
    const url = cityUrl(s, c);
    const where = c.isRegion ? 'Metro Detroit' : `${c.name}, MI`;
    let projs = projects.filter((p) => p.service === s.key && (c.isRegion || p.city === c.key));
    const nearbyProjs = c.isRegion ? [] : projects.filter((p) => p.service === s.key && p.city !== c.key && c.nearby.includes(p.city)).slice(0, 3 - Math.min(projs.length, 3));
    let revs = reviews.filter((r) => r.service === s.key && (c.isRegion || r.city === c.key));
    if (!c.isRegion) revs = revs.concat(reviews.filter((r) => r.city === c.key && r.service !== s.key));
    if (revs.length < 3) revs = revs.concat(reviews.filter((r) => r.service === s.key && !revs.includes(r))).slice(0, 6);
    const otherSvcs = services.filter((o) => o.key !== s.key && o.cityKeys.includes(c.key));
    const nearbyLinks = c.isRegion ? [] : c.nearby.filter((k) => s.cityKeys.includes(k)).map(cityBy);
    const faqs = [local.faq, ...s.faqs.slice(0, 3)];
    const bc = [['Home', '/'], [s.name, svcUrl(s)], [c.isRegion ? 'Metro Detroit' : c.name, url]];
    const body = `
${crumbs(bc)}
${pageHero({ eyebrow: `${s.name} · ${c.county}`, h1: cityH1[s.key](c), lead: esc(local.intro[0]), bulletsList: [`Free ${s.key === 'roofing' ? 'roof inspection' : s.key === 'basement-waterproofing' ? 'basement inspection' : 'design consultation'} in ${c.isRegion ? 'your city' : esc(c.name)}`, 'Licensed, insured &amp; warrantied', 'Clear written quote — no pressure'], service: s.formValue, city: c.isRegion ? '' : c.name, location: `${s.key}-${c.key}`, formTitle: `Free estimate in ${c.isRegion ? 'Metro Detroit' : c.name}` })}
${trustStrip()}

<section class="section"><div class="wrap split" style="align-items:start">
  <div><span class="eyebrow">${esc(s.short)} in ${esc(c.name)}</span><h2>${c.isRegion ? `Serving homeowners across ${esc(c.county)}` : `Local ${esc(s.short.toLowerCase())} for ${esc(c.name)} homes`}</h2>
    ${local.intro.slice(1).map((p) => `<p>${esc(p)}</p>`).join('')}
    <h3 style="margin-top:24px">${c.isRegion ? 'What every Metro Detroit homeowner gets' : `What we see in ${esc(c.name)}`}</h3>${checks(local.local)}</div>
  <div><div class="material"><h3>${c.isRegion ? 'Cities we serve' : 'Neighborhoods we serve'}</h3><p style="margin-bottom:12px">${c.isRegion ? 'Including, but not limited to:' : `${esc(c.name)} is mostly ${esc(c.housing)}. We work throughout:`}</p>
    <ul class="chips">${c.neighborhoods.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>
    ${!c.isRegion && c.nearbyOther.length ? `<p style="margin:14px 0 0" class="note">Also nearby: ${c.nearbyOther.map(esc).join(', ')}.</p>` : ''}
    ${c.isRegion ? `<p style="margin:14px 0 0">Core Oakland County cities: ${coreCities.map((x) => `<a href="${cityUrl(s, x)}">${esc(x.name)}</a>`).join(', ')}.</p>` : ''}</div></div>
</div></section>

<section class="section section--stone"><div class="wrap">
  <div class="section-head"><span class="eyebrow">Local projects</span><h2>${c.isRegion ? `Recent ${esc(s.short.toLowerCase())} projects in Metro Detroit` : `${esc(s.short)} projects in ${esc(c.name)}`}</h2></div>
  ${projs.length ? `<div class="grid grid--3">${projs.slice(0, 6).map((p) => projectCard(p)).join('')}</div>` : `<p>Ask us about recent ${esc(s.short.toLowerCase())} work in ${esc(c.name)} — we are happy to share references.</p>`}
  ${nearbyProjs.length ? `<h3 style="margin-top:36px">Nearby projects</h3><div class="grid grid--3">${nearbyProjs.map((p) => projectCard(p)).join('')}</div>` : ''}
  <p style="margin-top:28px"><a class="btn btn--ghost" href="/gallery/?service=${s.key}${c.isRegion ? '' : '&amp;city=' + c.key}">More projects</a></p>
</div></section>

${reviewsCarousel(revs, { title: c.isRegion ? 'Reviews from Metro Detroit homeowners' : `Reviews from ${c.name} homeowners`, eyebrow: 'Local reviews' })}

<section class="section section--stone"><div class="wrap">
  <div class="section-head"><span class="eyebrow">Services</span><h2>${esc(s.name)} services in ${esc(where)}</h2></div>
  <div class="grid grid--3">${s.subservices.filter((x) => x.id !== 'cost-ranges').map((x) => `<div class="card"><div class="card__body"><h3>${esc(x.title)}</h3><p>${esc(x.text.split('. ')[0])}.</p><a class="link-arrow" href="${svcUrl(s)}#${x.id}">More on ${esc(x.title.toLowerCase())}</a></div></div>`).join('')}</div>
</div></section>

<section class="section"><div class="wrap grid grid--2">
  <div class="cross"><h3>More from Moda Building in ${esc(c.name)}</h3><ul class="chips" style="margin-top:12px">${otherSvcs.map((o) => `<li><a href="${cityUrl(o, c)}">${esc(o.name)}</a></li>`).join('')}${s.key !== 'roofing' && !otherSvcs.includes(services[0]) ? `<li><a href="/roofing/">Roofing</a></li>` : ''}</ul>
    ${s.key === 'basement-waterproofing' && svcBy('finished-basements').cityKeys.includes(c.key) ? `<p style="margin-top:14px"><strong>Dry it, then finish it:</strong> once your basement is waterproofed, <a href="${cityUrl(svcBy('finished-basements'), c)}">finish it with us</a>.</p>` : ''}
    ${s.key === 'basement-waterproofing' && !svcBy('finished-basements').cityKeys.includes(c.key) ? `<p style="margin-top:14px"><strong>Dry it, then finish it:</strong> once your basement is waterproofed, <a href="/finished-basements/">finish it with us</a>.</p>` : ''}</div>
  ${nearbyLinks.length ? `<div class="cross"><h3>${esc(s.short)} in nearby cities</h3><ul class="chips" style="margin-top:12px">${nearbyLinks.map((n) => `<li><a href="${cityUrl(s, n)}">${esc(n.name)}</a></li>`).join('')}<li><a href="${svcUrl(s)}">All ${esc(s.short.toLowerCase())}</a></li></ul></div>` : `<div class="cross"><h3>Learn more about ${esc(s.name.toLowerCase())}</h3><p>Materials, cost factors and FAQs.</p><a class="link-arrow" href="${svcUrl(s)}">${esc(s.name)} overview</a></div>`}
</div></section>

${faqSection(faqs, { title: `${s.short} in ${c.isRegion ? 'Metro Detroit' : c.name}: FAQ`, stone: true })}
${ctaBand({ service: s.formValue, city: c.isRegion ? '' : c.name, title: `Free ${s.short.toLowerCase()} estimate in ${c.isRegion ? 'Metro Detroit' : c.name}` })}`;
    layout({ url, title: cityTitles[s.key](c), description: cityDesc[s.key](c), body, current: s.key, priority: '0.8',
      schema: [serviceSchema(s, [c], `${s.name} in ${where}`), faqSchema(faqs), crumbSchema(bc)] });
  }
}

/* ================= ABOUT ================= */
layout({ url: '/about/', title: 'About Moda Building | Oakland County Contractor', description: 'Meet Moda Building: a licensed and insured Metro Detroit contractor for roofing, basement waterproofing, finished basements and renovations.', priority: '0.6', body: `
${crumbs([['Home', '/'], ['About', '/about/']])}
${pageHero({ eyebrow: 'About us', h1: 'Modern building, old-fashioned accountability', lead: 'Moda Building is a residential contractor serving Metro Detroit. We lead with roofing and bring the same standards to basements and renovations: honest inspections, clear quotes and work we are proud to put our name on.', location: 'about', formTitle: 'Get a free estimate' })}
${trustStrip()}
<section class="section"><div class="wrap split">
  <div><span class="eyebrow">Our story</span><h2>Why we started Moda Building</h2>
    <p><mark class="ph">Owner story — to be supplied by the owner: background, how the company started, what drives the work.</mark></p>
    <p>“Moda” points to modern design, and that is how we approach every project — clean details, durable materials and a process that respects your time and your home. Whether it is a new roof in Royal Oak or a lower-level theater in Bloomfield Hills, the standard does not change.</p></div>
  <div class="rounded">${img(pic('team'), 'Moda Building owner and team at a residential jobsite in Metro Detroit', { sizes: '(min-width: 960px) 50vw, 100vw' })}</div>
</div></section>
<section class="section section--stone"><div class="wrap">
  <div class="section-head"><span class="eyebrow">Credentials</span><h2>Licensed, insured and accountable</h2></div>
  <div class="stat-row">
    <div class="stat"><strong>${val(site.yearsInBusiness)}</strong><span>Years in business</span></div>
    <div class="stat"><strong>${val(site.googleRating)}★</strong><span>Google rating (${val(site.googleReviewCount)} reviews)</span></div>
    <div class="stat"><strong>MI</strong><span>Residential builder license ${val(site.license)}</span></div>
    <div class="stat"><strong>Insured</strong><span>General liability &amp; workers’ comp — certificates on request</span></div>
  </div>
  <p style="margin-top:20px"><mark class="ph">Manufacturer certifications (e.g. shingle manufacturer programs) — owner to confirm</mark></p>
</div></section>
<section class="section"><div class="wrap">
  <div class="section-head"><span class="eyebrow">Our team</span><h2>The people on your project</h2><p class="lead">You will meet the same project lead from estimate to final walkthrough.</p></div>
  <div class="grid grid--3">${['Owner', 'Project manager', 'Lead roofer'].map((r) => `<div class="card"><div class="card__body"><h3><mark class="ph">Name</mark></h3><p>${r}</p></div></div>`).join('')}</div>
</div></section>
${processSection({ dark: true })}
${ctaBand()}` });

/* ================= GALLERY ================= */
layout({ url: '/gallery/', title: 'Project Gallery: Roofing, Basements & Renovations | Moda Building', description: 'Before-and-after photos of Moda Building roofing, basement waterproofing, finished basement and renovation projects across Oakland County and Metro Detroit.', priority: '0.7', body: `
${crumbs([['Home', '/'], ['Gallery', '/gallery/']])}
${pageHero({ eyebrow: 'Portfolio', h1: 'Project gallery', lead: 'Real projects, labeled by service and city. Drag the sliders to compare before and after, or filter by the work you are planning.', location: 'gallery', formTitle: 'Get a free estimate' })}
<section class="section"><div class="wrap">
  <div class="section-head"><h2>Browse projects</h2></div>
  <div class="filters" role="group" aria-label="Filter projects">
    <div><label for="f-service">Service</label><select id="f-service"><option value="">All services</option>${services.map((s) => `<option value="${s.key}">${esc(s.name)}</option>`).join('')}</select></div>
    <div><label for="f-city">City</label><select id="f-city"><option value="">All cities</option>${coreCities.map((c) => `<option value="${c.key}">${esc(c.name)}</option>`).join('')}</select></div>
    <p class="count" id="f-count" aria-live="polite"></p>
  </div>
  <div class="grid grid--3" data-gallery>${projects.map((p) => projectCard(p)).join('')}</div>
  <p id="f-empty" hidden>No projects match those filters yet — <a href="/contact/">ask us</a> for references in your area.</p>
</div></section>
${ctaBand()}` });

/* ================= REVIEWS ================= */
layout({ url: '/reviews/', title: 'Customer Reviews | Moda Building Metro Detroit', description: 'Read Google reviews and testimonials from Moda Building customers in Birmingham, Royal Oak, Bloomfield Hills, Rochester Hills, West Bloomfield and Beverly Hills.', priority: '0.6', body: `
${crumbs([['Home', '/'], ['Reviews', '/reviews/']])}
${pageHero({ eyebrow: 'Reviews', h1: 'What our customers say', lead: `Rated ${val(site.googleRating)} stars across ${val(site.googleReviewCount)} Google reviews. Here is what homeowners across Oakland County say about working with us.`, location: 'reviews', formTitle: 'Get a free estimate' })}
<section class="section section--stone"><div class="wrap">
  <div class="section-head"><span class="eyebrow">Testimonials</span><h2>Written testimonials</h2></div>
  <div class="reviews-grid">${reviews.map(reviewCard).join('')}</div>
</div></section>
${ctaBand()}` });

/* ================= FINANCING ================= */
const finFaq = [
  { q: 'What projects qualify for financing?', a: 'Roof replacements, basement waterproofing, finished basements and renovations may all qualify, subject to credit approval and project size.' },
  { q: 'Will applying affect my credit?', a: 'Many lenders offer a soft-credit prequalification that does not affect your score. Final approval typically requires a full application. Check with our financing partner for specifics.' },
  { q: 'Can I pay off early?', a: 'Most plans allow early payoff. Confirm the terms of your specific plan before signing.' }
];
layout({ url: '/financing/', title: 'Roofing & Remodeling Financing | Moda Building', description: 'Financing options for roof replacement, basement waterproofing, finished basements and home renovations in Metro Detroit. Low monthly payments on qualifying projects.', priority: '0.6', schema: [faqSchema(finFaq)], body: `
${crumbs([['Home', '/'], ['Financing', '/financing/']])}
${pageHero({ eyebrow: 'Financing', h1: 'Financing for your roof, basement or renovation', lead: 'Do not let an urgent roof repair or a dream basement wait. Flexible financing on qualifying projects lets you start now and pay over time.', bulletsList: ['Simple application', 'Fast decisions', 'Plans for projects of every size'], location: 'financing', formTitle: 'Get a free estimate' })}
<section class="section"><div class="wrap">
  <div class="section-head"><span class="eyebrow">Options</span><h2>How financing works</h2></div>
  <div class="grid grid--3">
    <div class="card"><div class="card__body"><h3>1. Get your estimate</h3><p>We inspect and give you a written quote so you know exactly what you are financing.</p></div></div>
    <div class="card"><div class="card__body"><h3>2. Apply in minutes</h3><p>Apply online or with your project lead through ${val(site.financing.partner)}.</p></div></div>
    <div class="card"><div class="card__body"><h3>3. Start your project</h3><p>Once approved, we schedule your work. Payments begin according to your plan.</p></div></div>
  </div>
  <div class="callout callout--light" style="margin-top:32px"><div><h2>Current offer</h2><p>${val(site.financing.terms)}</p></div>
  <div>${site.financing.applyUrl ? `<a class="btn btn--cta" href="${esc(site.financing.applyUrl)}" rel="noopener" data-cta="financing-apply">Apply now</a>` : `<a class="btn btn--cta" href="#quote" data-cta="financing-apply">Ask about financing</a>`}</div></div>
</div></section>
${faqSection(finFaq, { title: 'Financing FAQ', stone: true })}
${ctaBand()}` });

/* ================= CONTACT ================= */
const a = site.address;
layout({ url: '/contact/', title: 'Contact Us | Free Estimate | Moda Building', description: 'Request a free estimate from Moda Building for roofing, basement waterproofing, finished basements or renovations in Metro Detroit. Call or send the form.', priority: '0.8', body: `
${crumbs([['Home', '/'], ['Contact', '/contact/']])}
<section class="hero"><div class="wrap hero__grid">
  <div class="hero__copy"><span class="eyebrow">Contact / Free estimate</span><h1>Request your free estimate</h1>
    <p class="lead">Tell us about your project. We will confirm your details and schedule a free, no-pressure visit — usually within a few business days.</p>
    <ul class="contact-list">
      <li><strong>Phone</strong><a href="${telHref(site.phone)}" data-loc="contact-page">${esc(site.phone)}</a></li>
      <li><strong>Email</strong><a href="mailto:${esc(site.email)}">${esc(site.email)}</a></li>
      <li><strong>Address</strong>${val(a.street)}, ${val(a.city)}, ${esc(a.region)} ${val(a.zip)}</li>
      <li><strong>Hours</strong>${site.hours.map((h) => `${esc(h.days)}: ${esc(h.open)}${h.close ? '–' + esc(h.close) : ''}`).join('<br>')}</li>
      <li><strong>License</strong>${val(site.license)}</li>
    </ul>
  </div>
  ${quoteForm({ location: 'contact-page', title: 'Get your free estimate' })}
</div></section>
<section class="section"><div class="wrap split">
  <div><span class="eyebrow">Service area</span><h2>Where we work</h2><p>Roofing and basement waterproofing across all of Metro Detroit — Oakland, Macomb and Wayne counties. Finished basements and renovations focused on Birmingham, Royal Oak, Bloomfield Hills, Rochester Hills, West Bloomfield and Beverly Hills.</p>
    <ul class="chips">${coreCities.map((c) => `<li><a href="${cityUrl(services[0], c)}">${esc(c.name)}</a></li>`).join('')}<li><a href="/roofing/metro-detroit/">All of Metro Detroit</a></li></ul></div>
  <iframe class="map" title="Moda Building service area map: Oakland County and Metro Detroit" src="https://www.google.com/maps?q=Oakland+County,+Michigan&amp;z=10&amp;output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
</div></section>` });

/* ================= BLOG (phase 2) ================= */
layout({ url: '/blog/', title: 'Roofing & Basement Advice for Michigan Homeowners | Moda Building', description: 'Guides from Moda Building on roof replacement costs, basement waterproofing, finishing and renovating homes in Metro Detroit.', priority: '0.5', body: `
${crumbs([['Home', '/'], ['Blog', '/blog/']])}
${pageHero({ eyebrow: 'Blog', h1: 'Advice for Michigan homeowners', lead: 'Straight answers about roofs, basements and renovations in Metro Detroit.', location: 'blog', formTitle: 'Get a free estimate', ctas: false })}
<section class="section"><div class="wrap">
  <div class="grid grid--2">${posts.map((p) => `<article class="card"><div class="card__img">${img(pic(`${p.service}-hero`), p.title, { sizes: '(min-width: 700px) 50vw, 100vw' })}</div><div class="card__body"><p class="proj__meta"><time datetime="${p.date}">${new Date(p.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time></p><h2 style="font-size:1.35rem"><a href="/blog/${p.slug}/" style="text-decoration:none">${esc(p.title)}</a></h2><p>${esc(p.excerpt)}</p><a class="link-arrow" href="/blog/${p.slug}/">Read article</a></div></article>`).join('')}</div>
</div></section>
${ctaBand()}` });
for (const p of posts) {
  const s = svcBy(p.service);
  const url = `/blog/${p.slug}/`;
  layout({ url, title: `${p.title} | Moda Building`.length > 70 ? p.title : `${p.title} | Moda Building`, description: p.description, priority: '0.5', ogImage: pic(`${p.service}-hero`),
    schema: [{ '@type': 'BlogPosting', headline: p.title, description: p.description, datePublished: p.date, author: { '@id': BIZ_ID }, publisher: { '@id': BIZ_ID }, mainEntityOfPage: SITE_URL + url }, crumbSchema([['Home', '/'], ['Blog', '/blog/'], [p.title, url]])],
    body: `
${crumbs([['Home', '/'], ['Blog', '/blog/'], [p.title, url]])}
<article class="section" style="padding-top:28px"><div class="wrap split" style="align-items:start">
  <div class="prose"><p class="proj__meta"><time datetime="${p.date}">${new Date(p.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time> · ${esc(s.name)}</p><h1 style="font-size:clamp(1.9rem,5vw,2.8rem)">${esc(p.title)}</h1>${p.body}</div>
  <aside>${quoteForm({ service: s.formValue, location: `blog-${p.slug}`, title: `Free ${s.short.toLowerCase()} estimate`, id: 'quote' })}</aside>
</div></article>
${ctaBand({ service: s.formValue })}` });
}

/* ================= AD LANDING PAGES (no main nav, one offer, one form) ================= */
const LP = {
  roofing: { offer: 'Free Roof Inspection + Written Estimate', sub: 'Leaks, storm damage or an aging roof? A licensed Moda Building inspector will document your roof with photos and give you a clear, written quote — free.', bullets: ['Hail &amp; wind damage? We meet your adjuster', 'Most roofs replaced in 1–2 days', 'Financing on qualifying projects'] },
  'basement-waterproofing': { offer: 'Free Wet-Basement Inspection', sub: 'Water, cracks or a musty smell? We find the source and give you a written fix with a transferable warranty.', bullets: ['Crack repair, drain tile &amp; sump pumps', 'Written, transferable warranty', 'Serving all of Metro Detroit'] },
  'finished-basements': { offer: 'Free Basement Design Consultation', sub: 'Turn your basement into a family room, bar, theater or guest suite. Get a design consultation and fixed-scope quote — free.', bullets: ['Design + build, one team', 'Egress windows &amp; bathrooms', 'Dry-first moisture check included'] },
  renovations: { offer: 'Free Renovation Consultation', sub: 'Kitchens, bathrooms, additions and whole-home remodels in Oakland County — designed and built by one team.', bullets: ['Modern design-build process', 'Clear scope and schedule', 'Birmingham · Bloomfield Hills · Royal Oak &amp; more'] }
};
for (const s of services) {
  const o = LP[s.key];
  const url = `/lp/${s.slug}/`;
  layout({ url, title: `${o.offer} | Moda Building`, description: o.sub, noindex: true, minimal: true, sitemap: false, body: `
<section class="hero hero--photo"><div class="hero__bg">${img(pic(`${s.key}-hero`), `${s.name} project by Moda Building`, { eager: true, sizes: '100vw' })}</div>
<div class="wrap hero__grid">
  <div class="hero__copy"><span class="eyebrow">${esc(s.name)} · Oakland County &amp; Metro Detroit</span><h1>${esc(o.offer)}</h1><p class="lead">${esc(o.sub)}</p>${bullets(o.bullets)}<div class="hero__ctas">${callBtn('lp-hero')}</div></div>
  ${quoteForm({ service: s.formValue, location: `lp-${s.key}`, title: 'Claim your free visit' })}
</div></section>
${trustStrip()}
${reviewsCarousel(reviews.filter((r) => r.service === s.key), { title: 'Homeowners recommend Moda Building' })}
${processSection({ dark: true })}
${faqSection(s.faqs.slice(0, 4), { stone: true })}
<section class="section"><div class="wrap" style="text-align:center"><h2>Ready when you are</h2><p class="lead" style="margin:0 auto 20px">Call now or request your free visit online.</p><div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">${callBtn('lp-bottom')}${quoteBtn('lp-bottom', 'Claim your free visit')}</div></div></section>` });
}

/* ================= THANK YOU ================= */
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
${crumbs([['Home', '/'], ['Privacy policy', '/privacy-policy/']])}
<section class="section" style="padding-top:28px"><div class="wrap prose">
<h1>Privacy policy</h1>
<p class="note">Last updated: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}. <mark class="ph">Template — have it reviewed by the owner's attorney before launch</mark></p>
<p>This policy explains how ${esc(site.name)} (“we”, “us”) collects and uses information when you visit modabuilding.com or contact us.</p>
<h2>Information we collect</h2>
<ul><li><strong>Information you provide:</strong> name, phone number, email, city and optional street address, budget range, service requested, project details and any photos you upload through our estimate form.</li><li><strong>Advertising and campaign data:</strong> when you arrive from an ad or link, we record campaign parameters (such as UTM tags and Google or Meta click IDs) with your request so we know which campaigns work.</li><li><strong>Usage data:</strong> pages visited, device and browser information collected through cookies and similar technologies, if you consent.</li><li><strong>Phone calls:</strong> we may use a call tracking service that records the source of calls and, where disclosed, the call itself for quality and training.</li></ul>
<h2>How we use information</h2>
<ul><li>To respond to your request, schedule estimates and provide our services.</li><li>To contact you by phone, text message or email about your project. Message and data rates may apply; reply STOP to opt out of texts.</li><li>To measure and improve our website and advertising.</li></ul>
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
<h2>Contact</h2><p>${esc(site.name)}, ${val(a.street)}, ${val(a.city)}, ${esc(a.region)} ${val(a.zip)} · ${esc(site.email)}</p>
</div></section>` });

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
    <div style="display:flex;align-items:center;gap:10px;padding:16px;border-radius:12px;background:${p.c[1][1]};color:${p.c[0][1]};margin:6px 0 12px"><span class="logo" style="color:${p.c[0][1]}">${ui.LOGO}</span></div>
    <div class="swatches">${p.c.map(([n, h]) => `<div class="swatch"><div style="background:${h}"></div><p><strong>${n}</strong><br>${h}</p></div>`).join('')}</div>
    <p style="margin-top:14px"><span class="btn" style="background:${p.c[3][1]};color:#fff">Get a Free Estimate</span></p></div></div>`).join('')}</div>
</div></section>` });

/* ================= 404 ================= */
layout({ url: '/404.html', title: 'Page Not Found | Moda Building', description: 'The page you are looking for could not be found.', noindex: true, sitemap: false, body: `
<section class="section"><div class="wrap ty"><h1>Page not found</h1><p class="lead" style="margin:0 auto 24px">That page may have moved. Try one of these:</p>
<ul class="chips" style="justify-content:center">${services.map((s) => `<li><a href="${svcUrl(s)}">${esc(s.name)}</a></li>`).join('')}<li><a href="/contact/">Free estimate</a></li></ul></div></section>` });

/* ---------- Static assets ---------- */
write('assets/favicon.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" rx="9" fill="#121b24"/><path d="M8 22 20 11l12 11" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M13 21v9h14v-9" fill="none" stroke="#c2410c" stroke-width="3.2" stroke-linejoin="round"/></svg>`);
write('assets/logo.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 40"><rect width="40" height="40" rx="9" fill="#121b24"/><path d="M8 22 20 11l12 11" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M13 21v9h14v-9" fill="none" stroke="#fff" stroke-width="3.2" stroke-linejoin="round"/><text x="52" y="24" font-family="Manrope,Arial,sans-serif" font-weight="800" font-size="20" letter-spacing="3" fill="#121b24">MODA</text><text x="52" y="36" font-family="Manrope,Arial,sans-serif" font-weight="700" font-size="9" letter-spacing="4.2" fill="#5b6672">BUILDING</text></svg>`);
const today = new Date().toISOString().slice(0, 10);
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map((p) => `  <url><loc>${SITE_URL}${p.url}</loc><lastmod>${today}</lastmod><priority>${p.priority}</priority></url>`).join('\n')}\n</urlset>\n`);
write('robots.txt', IS_PREVIEW_HOST ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

console.log(`Built ${pages.length} indexable pages (+ ad landing pages, thank-you, brand, 404) into ./site`);
