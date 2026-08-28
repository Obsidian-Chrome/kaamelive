'use strict';

// ═══════════════════════════════════════════════════════════════════════════
//  KAAMELIVE — Serveur local
//  • Sert les fichiers statiques (vidéos + site) avec support Range + CORS
//  • /api/ping?id=UUID  → enregistre un viewer actif, renvoie { viewers: N }
// ═══════════════════════════════════════════════════════════════════════════

const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT    = 8080;
const ROOT    = __dirname;

// ── CORS (nécessaire pour que GitHub Pages puisse charger les vidéos) ───────
const CORS = {
  'Access-Control-Allow-Origin'  : '*',
  'Access-Control-Allow-Headers' : 'Range, Content-Type',
  'Access-Control-Expose-Headers': 'Content-Range, Accept-Ranges, Content-Length',
};

// ── MIME types ───────────────────────────────────────────────────────────────
const MIME = {
  '.mp4' : 'video/mp4',
  '.webm': 'video/webm',
  '.html': 'text/html; charset=utf-8',
  '.css' : 'text/css; charset=utf-8',
  '.js'  : 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png' : 'image/png',
  '.jpg' : 'image/jpeg',
  '.ico' : 'image/x-icon',
};

// ── Compteur de viewers ──────────────────────────────────────────────────────
const viewers = new Map();     // id → timestamp du dernier ping
const VIEWER_TIMEOUT = 45000;  // 45 s sans ping → considéré déconnecté

function cleanViewers() {
  const cutoff = Date.now() - VIEWER_TIMEOUT;
  for (const [id, ts] of viewers) {
    if (ts < cutoff) viewers.delete(id);
  }
}
setInterval(cleanViewers, 10000);

// ── Helper : réponse JSON ────────────────────────────────────────────────────
function sendJson(res, data) {
  const body = JSON.stringify(data);
  res.writeHead(200, {
    ...CORS,
    'Content-Type'  : 'application/json; charset=utf-8',
    'Cache-Control' : 'no-store',
    'Content-Length': Buffer.byteLength(body),
  });
  res.end(body);
}

// ── Envoi d'un fichier statique avec support Range (nécessaire pour seek) ────
function serveStatic(req, res, filePath) {
  fs.stat(filePath, (statErr, stat) => {
    if (statErr || !stat.isFile()) {
      res.writeHead(404, { ...CORS, 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext  = path.extname(filePath).toLowerCase();
    const mime = MIME[ext] || 'application/octet-stream';
    const size = stat.size;
    const rangeHeader = req.headers['range'];

    if (rangeHeader) {
      const match = rangeHeader.match(/bytes=(\d+)-(\d*)/);
      if (!match) {
        res.writeHead(416, { ...CORS, 'Content-Range': `bytes */${size}` });
        res.end();
        return;
      }
      const start = parseInt(match[1], 10);
      const end   = match[2] !== '' ? parseInt(match[2], 10) : size - 1;

      if (start >= size || end >= size || start > end) {
        res.writeHead(416, { ...CORS, 'Content-Range': `bytes */${size}` });
        res.end();
        return;
      }

      res.writeHead(206, {
        ...CORS,
        'Content-Type'  : mime,
        'Accept-Ranges' : 'bytes',
        'Content-Range' : `bytes ${start}-${end}/${size}`,
        'Content-Length': end - start + 1,
        'Cache-Control' : 'no-cache',
      });
      fs.createReadStream(filePath, { start, end }).pipe(res);
    } else {
      res.writeHead(200, {
        ...CORS,
        'Content-Type'  : mime,
        'Accept-Ranges' : 'bytes',
        'Content-Length': size,
        'Cache-Control' : 'no-cache',
      });
      fs.createReadStream(filePath).pipe(res);
    }
  });
}

// ── Serveur HTTP ─────────────────────────────────────────────────────────────
http.createServer((req, res) => {

  // Preflight CORS
  if (req.method === 'OPTIONS') {
    res.writeHead(204, { ...CORS, 'Access-Control-Allow-Methods': 'GET, OPTIONS' });
    res.end();
    return;
  }

  // Parse l'URL
  let pathname, searchParams;
  try {
    const u = new URL(req.url, 'http://localhost');
    pathname     = decodeURIComponent(u.pathname);
    searchParams = u.searchParams;
  } catch {
    res.writeHead(400, CORS);
    res.end();
    return;
  }

  // ── API : ping ──────────────────────────────────────────────────────────
  if (pathname === '/api/ping') {
    const id = searchParams.get('id') || req.socket.remoteAddress || 'anon';
    viewers.set(id, Date.now());
    cleanViewers();
    sendJson(res, { viewers: viewers.size });
    return;
  }

  // ── Fichiers statiques ──────────────────────────────────────────────────
  let rel = pathname.replace(/^\/+/, '') || 'index.html';
  const filePath = path.join(ROOT, rel);

  // Sécurité : interdire la sortie du répertoire racine
  if (!filePath.startsWith(ROOT + path.sep) && filePath !== ROOT) {
    res.writeHead(403, CORS);
    res.end('403 Forbidden');
    return;
  }

  serveStatic(req, res, filePath);

}).listen(PORT, () => {
  const line = '─'.repeat(44);
  console.log(`\n  ${line}`);
  console.log(`  Kaamelive server  →  http://localhost:${PORT}`);
  console.log(`  ${line}\n`);
});
