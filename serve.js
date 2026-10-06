// Tiny static preview server: node serve.js  →  http://localhost:8080
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, 'site');
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png' };
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  let f = path.join(ROOT, p);
  if (!f.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!fs.existsSync(f)) { res.writeHead(404, { 'Content-Type': TYPES['.html'] }); return res.end(fs.readFileSync(path.join(ROOT, '404.html'))); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
}).listen(process.env.PORT || 8080, () => console.log('Preview: http://localhost:' + (process.env.PORT || 8080)));
