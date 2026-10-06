// Generates lightweight SVG placeholder "photos" until real Moda Building job photos are supplied.
// Each image is clearly labeled as a placeholder. Swap for real WebP photos before launch.

const W = 1200, H = 800;

function rand(seed) {
  let s = seed % 2147483647; if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

function label(text) {
  const w = Math.max(260, text.length * 10.5 + 40);
  return `<g font-family="system-ui,-apple-system,Segoe UI,sans-serif"><rect x="${W - w - 24}" y="24" rx="8" width="${w}" height="40" fill="#0f1a24" fill-opacity=".72"/><text x="${W - w - 4}" y="50" font-size="18" fill="#fff" letter-spacing=".3">${text}</text></g>`;
}

function wrap(body, { before, text }) {
  const filter = before ? `<filter id="b"><feColorMatrix type="saturate" values=".25"/></filter>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><defs>${filter}</defs><g${before ? ' filter="url(#b)"' : ''}>${body}</g>${label(text)}</svg>`;
}

function roof(seed, before) {
  const r = rand(seed);
  const hx = 260 + Math.round(r() * 120), hw = 560 + Math.round(r() * 120);
  const roofCol = before ? '#6b6258' : ['#2e3a46', '#3b3f45', '#4a3f38'][seed % 3];
  const wall = ['#efe9e1', '#e4ddd2', '#d9cbbb'][seed % 3];
  let shingles = '';
  for (let y = 300; y < 470; y += 18) shingles += `<line x1="${hx - 40 + (470 - y) * 0}" y1="${y}" x2="${hx + hw + 40}" y2="${y}" stroke="#000" stroke-opacity=".12" stroke-width="2"/>`;
  let damage = '';
  if (before) for (let i = 0; i < 9; i++) damage += `<rect x="${hx + r() * hw}" y="${300 + r() * 150}" width="${30 + r() * 30}" height="14" fill="#8d8173" transform="rotate(${r() * 20 - 10} ${hx} 300)"/>`;
  return `
  <defs><linearGradient id="sky${seed}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bcd3e3"/><stop offset="1" stop-color="#eef3f6"/></linearGradient></defs>
  <rect width="${W}" height="${H}" fill="url(#sky${seed})"/>
  <ellipse cx="160" cy="520" rx="150" ry="210" fill="#4f6b52"/><ellipse cx="1080" cy="500" rx="170" ry="240" fill="#5d7a5c"/>
  <rect y="640" width="${W}" height="160" fill="#7d9a6a"/>
  <rect x="${hx}" y="460" width="${hw}" height="200" fill="${wall}"/>
  <clipPath id="rc${seed}"><polygon points="${hx - 50},470 ${hx + hw / 2},230 ${hx + hw + 50},470"/></clipPath>
  <polygon points="${hx - 50},470 ${hx + hw / 2},230 ${hx + hw + 50},470" fill="${roofCol}"/>
  <g clip-path="url(#rc${seed})">${shingles}${damage}</g>
  <rect x="${hx + hw * 0.7}" y="250" width="54" height="120" fill="#8a4b3a"/>
  <rect x="${hx + 60}" y="510" width="90" height="90" fill="#33414d"/><rect x="${hx + hw - 150}" y="510" width="90" height="90" fill="#33414d"/>
  <rect x="${hx + hw / 2 - 45}" y="530" width="90" height="130" fill="${before ? '#5a4a3c' : '#1f2a33'}"/>
  <rect x="${hx - 50}" y="466" width="${hw + 100}" height="10" fill="${before ? '#7a7066' : '#e8e2d8'}"/>`;
}

function waterproof(seed, before) {
  const r = rand(seed);
  let drops = '';
  if (before) for (let i = 0; i < 14; i++) drops += `<path d="M${560 + r() * 30} ${250 + r() * 300} q6 12 0 18 q-6 -6 0 -18z" fill="#4c7ea8"/>`;
  return `
  <rect width="${W}" height="${H}" fill="#8a6f55"/>
  <rect width="${W}" height="140" fill="#cfdbe4"/><rect y="140" width="${W}" height="30" fill="#6f8e5c"/>
  ${Array.from({ length: 40 }, () => `<circle cx="${r() * 520}" cy="${180 + r() * 600}" r="${3 + r() * 6}" fill="#6e5641"/>`).join('')}
  <rect x="520" y="120" width="70" height="620" fill="#b9b4ad"/>
  ${before ? `<path d="M540 260 l20 60 l-14 50 l22 70" stroke="#4b4640" stroke-width="5" fill="none"/>${drops}<ellipse cx="760" cy="735" rx="160" ry="14" fill="#4c7ea8" opacity=".7"/>` : `<rect x="510" y="120" width="10" height="620" fill="#1d2b36"/><circle cx="640" cy="715" r="26" fill="#2c4a63"/><circle cx="640" cy="715" r="14" fill="#9ab"/><rect x="980" y="620" width="120" height="140" fill="#3d4e5c"/><rect x="1000" y="560" width="16" height="80" fill="#3d4e5c"/>`}
  <rect x="590" y="120" width="${W - 590}" height="610" fill="${before ? '#9a958c' : '#e9e5df'}"/>
  <rect x="590" y="730" width="${W - 590}" height="70" fill="${before ? '#8c877f' : '#d8d2c8'}"/>
  ${before ? '<rect x="600" y="600" width="400" height="120" fill="#ffffff" opacity=".25"/>' : ''}`;
}

function basement(seed, before) {
  const r = rand(seed);
  const accent = ['#2f4f4f', '#5b4636', '#34495e'][seed % 3];
  if (before) {
    let studs = '';
    for (let x = 80; x < W; x += 90) studs += `<rect x="${x}" y="160" width="14" height="480" fill="#c8a978"/>`;
    return `<rect width="${W}" height="${H}" fill="#a39d94"/><rect y="640" width="${W}" height="160" fill="#8a857d"/>
    <rect y="140" width="${W}" height="24" fill="#c8a978"/>${studs}
    <rect x="560" y="160" width="26" height="480" fill="#555"/><rect x="0" y="60" width="${W}" height="60" fill="#9a9389"/>
    <rect x="200" y="80" width="700" height="44" fill="#c9c9c9"/>`;
  }
  return `<rect width="${W}" height="${H}" fill="#f1ede7"/>
  <rect y="600" width="${W}" height="200" fill="#c9b49a"/>
  ${Array.from({ length: 12 }, (_, i) => `<line x1="${i * 110}" y1="600" x2="${i * 110 - 60}" y2="800" stroke="#000" stroke-opacity=".08" stroke-width="3"/>`).join('')}
  ${[200, 500, 800, 1050].map(x => `<circle cx="${x}" cy="70" r="16" fill="#fff8e1"/><circle cx="${x}" cy="70" r="40" fill="#fff8e1" opacity=".35"/>`).join('')}
  <rect x="80" y="200" width="420" height="260" fill="#202a33"/><rect x="94" y="214" width="392" height="232" fill="#3a5568"/>
  <rect x="120" y="500" width="460" height="110" rx="18" fill="${accent}"/><rect x="120" y="470" width="460" height="50" rx="14" fill="${accent}" opacity=".85"/>
  <rect x="700" y="380" width="420" height="220" fill="#2c2620"/><rect x="690" y="360" width="440" height="26" fill="#e8e1d6"/>
  ${Array.from({ length: 5 }, (_, i) => `<rect x="${720 + i * 80}" y="200" width="50" height="${80 + r() * 50}" fill="#5d7a6a" opacity=".6"/>`).join('')}`;
}

function renovation(seed, before) {
  const cab = before ? '#a5753f' : ['#f4f1ec', '#2c3640', '#56604f'][seed % 3];
  const top = before ? '#b9ab8e' : '#ffffff';
  return `<rect width="${W}" height="${H}" fill="${before ? '#d9cdb4' : '#f6f4f0'}"/>
  <rect y="640" width="${W}" height="160" fill="${before ? '#bfa98a' : '#b48a62'}"/>
  ${before ? '' : '<rect x="820" y="60" width="300" height="300" fill="#cfe0ea"/><rect x="820" y="60" width="300" height="300" fill="none" stroke="#222" stroke-width="10"/>'}
  <rect x="60" y="80" width="${before ? 700 : 680}" height="200" fill="${cab}" stroke="#000" stroke-opacity=".12"/>
  ${Array.from({ length: 5 }, (_, i) => `<line x1="${60 + i * 136}" y1="80" x2="${60 + i * 136}" y2="280" stroke="#000" stroke-opacity=".15" stroke-width="3"/>`).join('')}
  <rect x="60" y="430" width="1080" height="210" fill="${cab}" stroke="#000" stroke-opacity=".12"/><rect x="50" y="410" width="1100" height="24" fill="${top}"/>
  ${before ? '<rect x="320" y="300" width="300" height="110" fill="#8e7d5f"/>' : `<rect x="300" y="520" width="600" height="150" fill="#2b3640"/><rect x="290" y="500" width="620" height="26" fill="#fff"/>${[420, 600, 780].map(x => `<line x1="${x}" y1="0" x2="${x}" y2="300" stroke="#222" stroke-width="3"/><path d="M${x - 34} 330 h68 l-14 -30 h-40z" fill="#1d2329"/>`).join('')}`}`;
}

const SCENES = { roofing: roof, 'basement-waterproofing': waterproof, 'finished-basements': basement, renovations: renovation };

function make(service, seed, before, text) {
  return wrap(SCENES[service](seed, before), { before, text });
}

function team() {
  return wrap(`<rect width="${W}" height="${H}" fill="#e9e4dc"/><rect y="600" width="${W}" height="200" fill="#cdbfae"/>
  ${[260, 480, 700, 920].map((x, i) => `<circle cx="${x}" cy="330" r="70" fill="#${['8d6e57', 'c79f83', '6f4e3a', 'b88b6c'][i]}"/><path d="M${x - 120} 640 q0 -200 120 -200 q120 0 120 200z" fill="#${['2e3a46', '3c4f5f', '22303b', '4a5a68'][i]}"/>`).join('')}`, { before: false, text: 'Placeholder — owner & team photo' });
}

module.exports = { make, team, SCENES };
