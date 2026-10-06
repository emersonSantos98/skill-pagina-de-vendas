// Utilidades compartilhadas pelos scripts da skill. Sem dependências externas.
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

/** Lê argumentos no formato --chave valor / --flag. */
export function args(argv = process.argv.slice(2)) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) continue;
    const key = a.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith("--")) out[key] = true;
    else { out[key] = next; i++; }
  }
  return out;
}

export function fail(msg, code = 1) {
  console.error(`✖ ${msg}`);
  process.exit(code);
}

/** Carrega playwright-core a partir do projeto atual (cwd), não da pasta da skill. */
export async function loadPlaywright() {
  const req = createRequire(join(process.cwd(), "package.json"));
  try {
    const p = req.resolve("playwright-core");
    const mod = await import(pathToFileURL(p).href);
    return mod.chromium ? mod : mod.default; // pacote CJS: exports ficam em default
  } catch {
    fail("playwright-core não encontrado neste projeto. Rode: npm i -D playwright-core");
  }
}

const CHROME_CANDIDATES = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
];

/** Abre o Chrome instalado (CHROME_PATH tem prioridade). */
export async function launchChrome(pw) {
  const exe = process.env.CHROME_PATH || CHROME_CANDIDATES.find((p) => existsSync(p));
  try {
    if (exe) return await pw.chromium.launch({ executablePath: exe, headless: true });
    return await pw.chromium.launch({ channel: "chrome", headless: true });
  } catch (e) {
    fail(`Não consegui abrir o Chrome (${e.message.split("\n")[0]}). Defina CHROME_PATH.`);
  }
}

export const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  celular: { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
};

/** Coleta estrutural da página (roda no navegador). */
export function coletarEstrutura() {
  const txt = (el) => (el?.innerText || el?.textContent || "").replace(/\s+/g, " ").trim();
  const CTA_RE = /(compr|assin|quero|comec|começ|garant|inscrev|matric|agend|aplic|test|experiment|demo|cadastr|entrar na lista|lista de espera|whatsapp|baix|acess|start|get|try|buy|sign up|book)/i;
  const headings = [...document.querySelectorAll("h1,h2,h3")].map((h) => ({
    nivel: Number(h.tagName[1]),
    texto: txt(h).slice(0, 200),
    y: Math.round(h.getBoundingClientRect().top + scrollY),
  }));
  const ctas = [...document.querySelectorAll("a,button,[role=button],input[type=submit]")]
    .map((el) => ({ texto: txt(el) || el.value || el.getAttribute("aria-label") || "", href: el.getAttribute("href") || null, y: Math.round(el.getBoundingClientRect().top + scrollY) }))
    .filter((c) => c.texto && c.texto.length <= 80 && CTA_RE.test(c.texto));
  const body = txt(document.body);
  const precos = [...new Set(body.match(/(R\$|US\$|\$|€)\s?\d{1,3}(\.\d{3})*(,\d{2})?(\s?\/\s?(m[eê]s|ano|month|year|mo))?/gi) || [])].slice(0, 30);
  const parcelamento = [...new Set(body.match(/\d{1,2}\s?x\s?(de\s)?R\$\s?\d+[\d.,]*/gi) || [])].slice(0, 10);
  const faq = [...document.querySelectorAll("details summary, [itemtype*='FAQPage'] [itemprop=name]")].map(txt).slice(0, 40);
  const footer = txt(document.querySelector("footer")).slice(0, 1500);
  const imgs = [...document.images];
  return {
    url: location.href,
    titulo: document.title,
    lang: document.documentElement.lang || null,
    viewport: document.querySelector("meta[name=viewport]")?.content || null,
    alturaPagina: document.documentElement.scrollHeight,
    headings,
    ctas,
    precos,
    parcelamento,
    faq,
    sinais: {
      cnpj: /\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}/.test(body),
      garantia: /garantia|reembolso|money.?back|refund/i.test(body),
      timer: /\b\d{1,2}\s*:\s*\d{2}\s*:\s*\d{2}\b/.test(body) || !!document.querySelector("[class*=countdown],[id*=countdown],[class*=timer]"),
      video: !!document.querySelector("video, iframe[src*='youtube'], iframe[src*='vimeo'], iframe[src*='panda'], iframe[src*='vturb']"),
      formulario: !!document.querySelector("form"),
      depoimentos: /depoimento|testimonial|o que (dizem|falam)|alunos|clientes/i.test(body),
    },
    footer,
    acessibilidade: {
      h1: document.querySelectorAll("h1").length,
      imagensSemAlt: imgs.filter((i) => !i.hasAttribute("alt")).length,
      linksVazios: [...document.querySelectorAll("a")].filter((a) => !a.getAttribute("href") || a.getAttribute("href") === "#").length,
      larguraExcedente: document.documentElement.scrollWidth > innerWidth + 1,
    },
  };
}
