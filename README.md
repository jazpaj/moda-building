# Moda Building — modabuilding.com

A fully static, lead-generating website built from *Moda Building — Website Build Brief* (Oct 6, 2026).

- **Deploy:** upload the contents of `site/` to any static host (Netlify, Cloudflare Pages, S3, cPanel). HTTPS required.
- **Edit:** change content in `src/data/`, then run `node build.js` to regenerate `site/`. No dependencies.
- **Preview locally:** `node serve.js`, then open http://localhost:8080.

## What's included (per the brief)

| Brief item | Where |
|---|---|
| Homepage, sections 1–10 in the brief's order | `/` |
| 4 service pages (roofing first in nav, grid, footer) | `/roofing/`, `/basement-waterproofing/`, `/finished-basements/`, `/renovations/` |
| 24 location pages, unique copy each | Roofing and waterproofing: 6 cities + `/metro-detroit/`. Finished basements: 4 target cities. Renovations: 6 cities |
| Company pages | `/about/`, `/gallery/` (filter by service + city, before/after sliders), `/reviews/`, `/financing/`, `/contact/` |
| Blog (phase 2), 2 starter articles | `/blog/` |
| Ad landing pages: no nav, one offer, one form, `noindex` | `/lp/roofing/`, `/lp/basement-waterproofing/`, `/lp/finished-basements/`, `/lp/renovations/` |
| Thank-you page (separate URL for conversion counting) | `/thank-you/` |
| Privacy policy + cookie notice (Google Consent Mode v2) | `/privacy-policy/` |
| Designer's 2–3 brand options for owner approval | `/brand/` (noindex) |
| `sitemap.xml`, `robots.txt`, `404.html` | site root |

**Every page includes:**
- A sticky header with a tap-to-call phone number and a "Get a Free Estimate" button.
- A mobile sticky bar with Call and Get Quote.
- The trust strip.
- A quote form in the hero.
- A closing call-to-action band with a second form.

**Lead form:** the six required fields are name, phone (US mask), email, city dropdown plus optional address, budget and service.
- "Service desired" is pre-selected on service pages; the city is pre-selected on city pages.
- Optional extras: a project message and a photo upload.
- It is three steps on mobile (Service → Location/Budget → Contact) and a single form on desktop.
- Spam protection is a honeypot, plus Cloudflare Turnstile when `tracking.turnstileSiteKey` is set.

**Tracking:**
- Hidden fields capture UTM tags, `gclid`, `gbraid`, `wbraid`, `fbclid`, the landing page, referrer, Meta `_fbp`/`_fbc` and an `event_id` for Meta CAPI deduplication.
- `dataLayer` events fire for `phone_click` (every tel: link), `cta_click`, `form_start`, `form_step`, `form_submit` and `generate_lead` (on the thank-you page).
- Set `tracking.gtmId` and configure GA4, the Google Ads conversion tag and the Meta Pixel inside GTM.
- Add the CallRail script URL to `tracking.callRailScript`.

**SEO:**
- Every page has a unique title, meta description and H1, plus a canonical URL and Open Graph tags.
- JSON-LD covers `RoofingContractor` + `HomeAndConstructionBusiness`, `Service`, `FAQPage`, `BreadcrumbList` and `BlogPosting`.
- `Review` and `AggregateRating` markup is added automatically once real reviews and ratings replace the placeholders.

## Before launch: connect the form backend

Because the site is static, form submissions need a receiver:
- **Netlify:** works as-is. The form already has `data-netlify` and a honeypot. Turn on email notifications, and use Zapier for SMS and a Google Sheet/CRM backup.
- **Other hosts:** point the form `action` in `src/lib/ui.js` at Formspree, Basin or a Zapier/Make webhook, and keep the redirect to `/thank-you/`.

On localhost the form skips the POST and goes straight to `/thank-you/` so the flow can be tested.

## Placeholder content: replace before launch

The preview banner is off (`"preview": false` in `src/data/site.json`). Set it to `true` to show a yellow "awaiting real content" banner on every page.

- **`src/data/site.json`:** fill in the street address, license number, years in business, Google rating and review count, financing partner, social links, GTM ID, and the confirmed budget ranges. While a field is empty, the site shows neutral wording instead (e.g. "Locally owned & operated", "Free written estimates", "Serving Oakland County & all of Metro Detroit"). Never enter estimated or made-up ratings, review counts or license numbers. An optional `"certifications": ["…"]` list appears on the About page.
- **About page copy:** the company story and team role descriptions are drafts for the owner to confirm or replace.
- **`src/data/reviews.js`:** 16 customer reviews supplied by the owner, all roofing-related. Add waterproofing, basement and renovation reviews as they come in; a service page with no matching reviews hides its review section.
- **Images:** photos live in `src/img/photos/` as `<slot>.webp`, plus an 800px `<slot>-800.webp` for phones (`cwebp -q 78 -resize 800 0 in.webp -o in-800.webp`). Slots are `home-hero`, `<service>-hero`, `team` and `p<N>-after` / `p<N>-before` from `src/data/projects.js`. A missing slot falls back to an illustrated SVG placeholder. The current images are AI-generated (see the manifest in the image-generation folder) and should be swapped for real Moda Building job photos before launch.
- **`src/data/services.js`:** price ranges are planning ballparks for the owner to confirm.
- **Privacy policy:** a template that needs attorney review.

## Open questions from the brief
- Service area: Metro Detroit only, or also Macomb, Livingston and Washtenaw?
- Who signs off on page copy? A draft of all copy is written here.
- Is there an existing site? If so, add 301 redirects at the host.

## Launch checklist (from the brief)
- [ ] Test form submission end to end: email, SMS, CRM/Sheet, thank-you page
- [ ] Verify GA4, Google Ads and Meta Pixel conversions fire
- [ ] Test click-to-call on iPhone and Android
- [ ] Submit `sitemap.xml` to Google Search Console
- [ ] Mobile speed check (Lighthouse 90+)

## Preview deployment (GitHub Pages)
Every push to `main` builds the site with `BASE_PATH=/<repo-name>` and deploys it to GitHub Pages (`.github/workflows/pages.yml`).
Preview builds are `noindex` and `robots.txt` blocks crawling, so they never compete with modabuilding.com.
On the preview, the form skips the POST and goes straight to `/thank-you/`, the same as on localhost.

## Logo & favicon
- The owner-supplied logo was cut out of its background with smooth (anti-aliased) edges. Full-resolution transparent PNGs are in `brand-source/`: `logo-source.png`, `logo-light-source.png` (white version for dark backgrounds) and `mark-source.png` (house icon only).
- Website files are in `src/assets/brand/`: `logo.webp` (header, ad landing pages), `logo-light.webp` (footer) and `logo-600.png` (Google/schema logo).
- Favicons in `src/assets/`: `favicon.ico` (16/32/48), `favicon-32.png`, `apple-touch-icon.png` (180), `icon-192.png` / `icon-512.png` and `site.webmanifest`. `favicon.ico` is also copied to the site root.
- Logo colors: navy `#1e2a34`, grey `#808080`, blue `#07649f`.
