#!/usr/bin/env node
// Captura uma página de referência (concorrente) ou da página atual do usuário (auditoria).
// Uso: node capturar-referencia.mjs --url https://exemplo.com --saida referencia [--modo referencia|auditoria]
import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { args, coletarEstrutura, fail, launchChrome, loadPlaywright } from "./_lib.mjs";

const a = args();
if (!a.url) fail("Informe --url");
let url;
try { url = new URL(a.url); } catch { fail(`URL inválida: ${a.url}`); }
if (!/^https?:$/.test(url.protocol)) fail("Use URL http(s).");
const modo = a.modo === "auditoria" ? "auditoria" : "referencia";
const saida = resolve(a.saida || "referencia");
mkdirSync(saida, { recursive: true });

const pw = await loadPlaywright();
const browser = await launchChrome(pw);

async function capturar(nome, opts) {
  const ctx = await browser.newContext({ ...opts, locale: "pt-BR" });
  const page = await ctx.newPage();
  await page.goto(url.href, { waitUntil: "networkidle", timeout: 60000 }).catch(() => page.waitForTimeout(3000));
  // rola até o fim para disparar lazy-load
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.8) {
      scrollTo(0, y); await new Promise((r) => setTimeout(r, 250));
    }
    scrollTo(0, 0);
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: join(saida, `${nome}.png`), fullPage: true });
  const est = await page.evaluate(coletarEstrutura);
  await ctx.close();
  return est;
}

const desktop = await capturar("desktop", { viewport: { width: 1440, height: 900 } });
const celular = await capturar("celular", { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
await browser.close();

const estrutura = { modo, capturadoEm: new Date().toISOString(), desktop, celular: { acessibilidade: celular.acessibilidade, alturaPagina: celular.alturaPagina } };
writeFileSync(join(saida, "estrutura.json"), JSON.stringify(estrutura, null, 2));

const s = desktop.sinais;
const sim = (b) => (b ? "sim" : "não");
const md = `# Análise de ${modo === "auditoria" ? "auditoria" : "referência"}

- URL: ${desktop.url}
- Título: ${desktop.titulo}
- Capturado em: ${estrutura.capturadoEm}
- Screenshots: \`desktop.png\`, \`celular.png\`

> ${modo === "referencia"
  ? "Página de terceiros: use apenas **padrões estruturais**. Não copie texto, layout, imagens ou marca."
  : "Página do próprio usuário: textos, preços e provas reais podem ser reaproveitados após confirmação."}

## 1. Sequência de blocos (headings)
| # | Nível | Texto | Módulo provável (preencher) |
|---|---|---|---|
${desktop.headings.map((h, i) => `| ${i + 1} | h${h.nivel} | ${h.texto.replace(/\|/g, "/")} |  |`).join("\n") || "| – | – | nenhum heading | |"}

## 2. CTAs encontrados
${desktop.ctas.map((c) => `- "${c.texto}" → ${c.href || "(sem href)"} (y=${c.y})`).join("\n") || "- nenhum"}

## 3. Preço
- Valores: ${desktop.precos.join(" · ") || "nenhum visível"}
- Parcelamento: ${desktop.parcelamento.join(" · ") || "não encontrado"}

## 4. Sinais
| Sinal | Encontrado |
|---|---|
| Vídeo / VSL | ${sim(s.video)} |
| Depoimentos (texto) | ${sim(s.depoimentos)} |
| Garantia / reembolso | ${sim(s.garantia)} |
| Timer / contador | ${sim(s.timer)} ${s.timer ? "← verificar se é real" : ""} |
| Formulário | ${sim(s.formulario)} |
| CNPJ no texto | ${sim(s.cnpj)} |

## 5. FAQ
${desktop.faq.map((q) => `- ${q}`).join("\n") || "- não identificado (pode não usar <details>)"}

## 6. Técnico
- h1: ${desktop.acessibilidade.h1} · imagens sem alt: ${desktop.acessibilidade.imagensSemAlt} · links vazios: ${desktop.acessibilidade.linksVazios}
- Celular com rolagem horizontal: ${sim(celular.acessibilidade.larguraExcedente)}
- Altura: desktop ${desktop.alturaPagina}px · celular ${celular.alturaPagina}px

## 7. Análise (preencher com referencias/analise-referencia.md)
- Nível de consciência pressuposto:
- Framework aparente:
- Objeções trabalhadas / sem resposta:
- Riscos (dark patterns, promessas):
- ${modo === "referencia" ? "Diferenciações (o que NÃO fazer igual):" : "Conteúdo real reaproveitável:"}
- ${modo === "referencia" ? "Padrões a considerar:" : "Problemas priorizados (impacto × esforço):"}
`;
writeFileSync(join(saida, "REFERENCIA.md"), md);
console.log(`✔ Captura salva em ${saida} (REFERENCIA.md, estrutura.json, desktop.png, celular.png)`);
