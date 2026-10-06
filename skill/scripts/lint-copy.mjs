#!/usr/bin/env node
// Lint ético/legal de copy. Uso: node lint-copy.mjs --arquivo index.html [--json]
// Sai com código 1 se houver erros (avisos não falham).
import { readFileSync } from "node:fs";
import { args, fail } from "./_lib.mjs";

export const REGRAS = [
  { id: "promessa-ganho", nivel: "erro", re: /\b(renda|lucro|ganho|faturamento)s?\b[^.\n]{0,40}\b(garantid[oa]s?|certo|assegurad[oa])\b/i, msg: "Promessa de ganho garantido (Hotmart/Meta/CDC)." },
  { id: "dinheiro-facil", nivel: "erro", re: /\b(dinheiro|renda) (f[aá]cil|r[aá]pid[oa])\b|\bsem (nenhum )?esfor[cç]o\b|\bfique rico\b|\benrique[cç]a\b/i, msg: "Enriquecimento fácil/rápido/sem esforço." },
  { id: "resultado-garantido", nivel: "erro", re: /\b(resultados?|sucesso) (100% )?garantid[oa]s?\b|\b100% garantido\b/i, msg: "Resultado garantido. Use garantia de reembolso, não de resultado." },
  { id: "cura", nivel: "erro", re: /\bcura (definitiva|garantida)?\b|\bcurar (a|o|sua|seu)\b/i, msg: "Alegação de cura." },
  { id: "atributo-pessoal", nivel: "aviso", re: /\bvoc[eê] (est[aá]|[eé]|anda|vive) (endividad|obes|gord|deprimid|ansios|doente|falid|solteir|careca)/i, msg: "Atributo pessoal afirmado (política Meta Ads). Prefira 'para quem quer…'." },
  { id: "confirmshaming", nivel: "erro", re: /\bn[aã]o,? (obrigad[oa],? )?(eu )?(prefiro|quero) (continuar|ficar|perder|ser)\b/i, msg: "Confirmshaming na recusa. Use 'Agora não'." },
  { id: "escassez", nivel: "aviso", re: /(?<!\p{L})([uú]ltimas?|poucas) (vagas|unidades|horas)(?!\p{L})|\bvagas limitadas\b|\bs[oó] hoje\b|\bencerra (hoje|em breve)\b/iu, msg: "Escassez/urgência: confirme base real (motivo + data) no page-spec." },
  { id: "ancoragem", nivel: "aviso", re: /\bde\s*R\$\s*[\d.,]+\s*(por|para)\s*(apenas\s*)?R\$/i, msg: "Âncora 'de/por': exige preço anterior real praticado (com data) ou custo real da alternativa." },
  { id: "prova-social-ao-vivo", nivel: "aviso", re: /\b\d+ pessoas (est[aã]o )?(vendo|comprando|olhando)\b|\bacabou de (comprar|se inscrever)\b/i, msg: "Notificação de atividade: só com dado real em tempo real." },
  { id: "visto-em", nivel: "aviso", re: /\b(visto|como visto|apareceu) (na|no|em)\b/i, msg: "'Visto em': confirme aparição real e datada." },
  { id: "sem-risco", nivel: "aviso", re: /\b(zero|sem) risco\b|\brisco zero\b/i, msg: "'Sem risco': explique a garantia real em vez de prometer ausência de risco." },
  { id: "clique-aqui", nivel: "aviso", re: />\s*clique aqui\s*</i, msg: "Link 'clique aqui' (acessibilidade): use texto descritivo." },
];

export function lint(texto) {
  const limpo = texto.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, " ");
  const linhas = limpo.split(/\r?\n/);
  const achados = [];
  linhas.forEach((linha, i) => {
    for (const r of REGRAS) {
      const m = linha.match(r.re);
      if (m) achados.push({ linha: i + 1, regra: r.id, nivel: r.nivel, trecho: m[0], msg: r.msg });
    }
  });
  return achados;
}

const isCli = process.argv[1] && process.argv[1].endsWith("lint-copy.mjs");
if (isCli) {
  const a = args();
  if (!a.arquivo) fail("Informe --arquivo");
  const achados = lint(readFileSync(a.arquivo, "utf8"));
  if (a.json) console.log(JSON.stringify(achados, null, 2));
  else if (!achados.length) console.log("✔ Nenhum problema de copy encontrado.");
  else for (const x of achados) console.log(`${x.nivel === "erro" ? "✖" : "⚠"} ${a.arquivo}:${x.linha} [${x.regra}] "${x.trecho}" — ${x.msg}`);
  process.exit(achados.some((x) => x.nivel === "erro") ? 1 : 0);
}
