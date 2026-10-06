#!/usr/bin/env node
// Verificação visual + estrutural da página.
// Uso: node verificar.mjs --url http://localhost:4600 --saida verificacao
import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { args, coletarEstrutura, fail, launchChrome, loadPlaywright, VIEWPORTS } from "./_lib.mjs";

const a = args();
if (!a.url) fail("Informe --url");
const saida = resolve(a.saida || "verificacao");
const passo = Number(a.passo || 0.75);
const maxPassos = Number(a["max-passos"] || 40);

const pw = await loadPlaywright();
const browser = await launchChrome(pw);
const relatorio = { url: a.url, data: new Date().toISOString(), condicoes: {} };

async function rodar(nome, contextOpts, { reduzido = false } = {}) {
  const ctx = await browser.newContext({ ...contextOpts, reducedMotion: reduzido ? "reduce" : "no-preference" });
  const page = await ctx.newPage();
  const erros = [];
  page.on("console", (m) => {
    if (m.type() !== "error" || /^Failed to load resource/.test(m.text())) return; // coberto por "response"
    erros.push(`console: ${m.text()}`);
  });
  page.on("response", (r) => {
    if (r.status() >= 400 && !/\/favicon\.ico(\?|$)/.test(r.url())) erros.push(`HTTP ${r.status()}: ${r.url()}`);
  });
  page.on("pageerror", (e) => erros.push(`página: ${e.message}`));
  page.on("requestfailed", (r) => erros.push(`requisição falhou: ${r.url()}`));
  await page.goto(a.url, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(600);
  const dir = join(saida, nome);
  mkdirSync(dir, { recursive: true });

  if (reduzido) {
    await page.screenshot({ path: join(dir, "pagina-inteira.png"), fullPage: true });
  } else {
    const altura = await page.evaluate(() => document.documentElement.scrollHeight);
    const tela = contextOpts.viewport.height;
    let y = 0, i = 1;
    while (i <= maxPassos) {
      await page.evaluate((v) => window.scrollTo(0, v), y);
      await page.waitForTimeout(450);
      await page.screenshot({ path: join(dir, `passo-${String(i).padStart(2, "0")}.png`) });
      if (y + tela >= altura) break;
      y += Math.round(tela * passo); i++;
    }
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  const estrutura = await page.evaluate(coletarEstrutura);
  relatorio.condicoes[nome] = { erros, estrutura };
  await ctx.close();
}

await rodar("desktop", { viewport: VIEWPORTS.desktop });
await rodar("celular", { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
await rodar("reduzido", { viewport: VIEWPORTS.desktop }, { reduzido: true });
await browser.close();

// ---------- relatório ----------
const d = relatorio.condicoes.desktop.estrutura;
const c = relatorio.condicoes.celular.estrutura;
const avisos = [];
if (d.acessibilidade.h1 !== 1) avisos.push(`Página tem ${d.acessibilidade.h1} <h1> (esperado: 1).`);
if (d.acessibilidade.imagensSemAlt) avisos.push(`${d.acessibilidade.imagensSemAlt} imagem(ns) sem atributo alt.`);
if (d.acessibilidade.linksVazios) avisos.push(`${d.acessibilidade.linksVazios} link(s) com href vazio ou "#".`);
if (!d.lang) avisos.push("Falta atributo lang no <html>.");
if (!d.viewport) avisos.push("Falta <meta name=viewport>.");
if (c.acessibilidade.larguraExcedente) avisos.push("Celular: conteúdo mais largo que a tela (rolagem horizontal).");
if (!d.ctas.length) avisos.push("Nenhum CTA reconhecido.");
else if (d.ctas[0].y > 900) avisos.push(`Primeiro CTA em y=${d.ctas[0].y}px (fora da primeira tela no desktop).`);
if (d.sinais.timer) avisos.push("Contador/timer detectado: confirme que o prazo é real e não reinicia.");
const totalErros = Object.values(relatorio.condicoes).reduce((s, x) => s + x.erros.length, 0);

const md = [
  `# Relatório de verificação`,
  ``,
  `- URL: ${a.url}`,
  `- Data: ${relatorio.data}`,
  `- Erros de console/página/rede: **${totalErros}**`,
  `- Avisos estruturais: **${avisos.length}**`,
  ``,
  `## Avisos`,
  ...(avisos.length ? avisos.map((x) => `- ${x}`) : ["- nenhum"]),
  ``,
  `## Erros por condição`,
  ...Object.entries(relatorio.condicoes).flatMap(([k, v]) => [`### ${k}`, ...(v.erros.length ? v.erros.map((e) => `- ${e}`) : ["- nenhum"])]),
  ``,
  `## Estrutura (desktop)`,
  `- Título: ${d.titulo}`,
  `- Altura: ${d.alturaPagina}px`,
  `- Headings:`,
  ...d.headings.map((h) => `${"  ".repeat(h.nivel)}- h${h.nivel}: ${h.texto}`),
  `- CTAs: ${d.ctas.map((x) => `"${x.texto}" (y=${x.y})`).join(" · ") || "nenhum"}`,
  `- Preços: ${d.precos.join(" · ") || "nenhum"}`,
  ``,
  `## Próximo passo`,
  `Abra os screenshots em ${saida}/desktop, ${saida}/celular e ${saida}/reduzido e revise com referencias/verificacao.md.`,
].join("\n");

mkdirSync(saida, { recursive: true });
writeFileSync(join(saida, "RELATORIO.md"), md + "\n");
writeFileSync(join(saida, "relatorio.json"), JSON.stringify({ ...relatorio, avisos }, null, 2));
console.log(md);
process.exit(totalErros ? 2 : 0);
