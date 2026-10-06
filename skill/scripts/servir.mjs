#!/usr/bin/env node
// Servidor estático local, sem dependências.
// Uso: node servir.mjs --pasta . --porta 4600
import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";
import { args } from "./_lib.mjs";

const a = args();
const raiz = resolve(a.pasta || ".");
const porta = Number(a.porta || 4600);
const TIPOS = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".avif": "image/avif",
  ".gif": "image/gif", ".ico": "image/x-icon", ".mp4": "video/mp4", ".webm": "video/webm",
  ".woff2": "font/woff2", ".woff": "font/woff", ".txt": "text/plain; charset=utf-8",
};

createServer((req, res) => {
  const caminho = decodeURIComponent(new URL(req.url, "http://x").pathname);
  let arq = normalize(join(raiz, caminho));
  if (!arq.startsWith(raiz)) { res.writeHead(403).end("Proibido"); return; }
  if (existsSync(arq) && statSync(arq).isDirectory()) arq = join(arq, "index.html");
  if (!existsSync(arq)) { res.writeHead(404, { "content-type": "text/plain; charset=utf-8" }).end("Não encontrado"); return; }
  res.writeHead(200, { "content-type": TIPOS[extname(arq).toLowerCase()] || "application/octet-stream", "cache-control": "no-store" });
  createReadStream(arq).pipe(res);
}).listen(porta, () => console.log(`Servindo ${raiz} em http://localhost:${porta}`));
