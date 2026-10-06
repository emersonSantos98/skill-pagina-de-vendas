#!/usr/bin/env node
// Valida coerência do page-spec.json (estratégia, provas, CTAs, ética).
// Uso: node validar-spec.mjs --spec page-spec.json [--json]
// Sai com código 1 se houver erros.
import { readFileSync } from "node:fs";
import { args, fail } from "./_lib.mjs";

export const ENUMS = {
  product_type: ["infoproduto", "curso", "mentoria", "comunidade", "saas", "saas_b2b", "ferramenta", "assinatura", "servico"],
  awareness: ["inconsciente", "problema", "solucao", "produto", "muito_consciente"],
  goal: ["compra", "trial", "freemium", "demo", "aplicacao", "call", "lista_espera", "lead", "whatsapp"],
  faixa: ["baixo", "medio", "alto"],
  length: ["curta", "media", "longa"],
  recorrencia: ["nenhuma", "mensal", "trimestral", "anual"],
  module: ["hero", "vsl", "problema", "agitacao", "promessa", "mecanismo", "beneficios", "features", "demonstracao",
    "como_funciona", "integracoes", "seguranca", "comunidade_por_dentro", "para_quem", "para_quem_nao", "prova_social",
    "depoimentos", "cases", "resultados", "autoridade", "oferta", "ancoragem", "bonus", "pricing", "comparacao_planos",
    "garantia", "escassez", "urgencia", "aplicacao", "faq", "cta_final", "disclaimer", "footer_legal"],
  proof: ["depoimento", "case", "numero", "logo", "credencial", "midia", "review", "demo", "garantia"],
  cta_intent: ["comprar", "assinar", "trial", "demo", "aplicar", "agendar", "lista_espera", "whatsapp", "lead", "ver_mais"],
  urgency: ["nenhuma", "real_prazo", "real_vagas"],
};

export function validar(spec) {
  const erros = [];
  const avisos = [];
  const E = (m) => erros.push(m);
  const W = (m) => avisos.push(m);
  const m = spec.meta || {};

  // ---------- meta ----------
  for (const k of ["product_type", "awareness", "goal"]) {
    if (!m[k]) E(`meta.${k} é obrigatório.`);
    else if (!ENUMS[k].includes(m[k])) E(`meta.${k} inválido: "${m[k]}".`);
  }
  if (!m.ticket?.faixa || !ENUMS.faixa.includes(m.ticket.faixa)) E("meta.ticket.faixa obrigatório (baixo|medio|alto).");
  if (!Number.isInteger(m.sophistication) || m.sophistication < 1 || m.sophistication > 5) E("meta.sophistication deve ser inteiro 1–5.");
  if (!Array.isArray(m.traffic_sources) || !m.traffic_sources.length) E("meta.traffic_sources: informe ao menos uma fonte.");
  if (!m.framework?.primario) E("meta.framework.primario é obrigatório.");
  else if (!m.framework.justificativa) W("meta.framework.justificativa ausente.");

  // ---------- módulos ----------
  const mods = Array.isArray(spec.modules) ? spec.modules : [];
  if (!mods.length) E("modules vazio.");
  const ids = new Set();
  for (const mod of mods) {
    if (!mod.id) E("Módulo sem id.");
    else if (ids.has(mod.id)) E(`Módulo duplicado: ${mod.id}.`);
    ids.add(mod.id);
    if (!ENUMS.module.includes(mod.type)) E(`Módulo ${mod.id}: type inválido "${mod.type}".`);
    if (!mod.purpose) W(`Módulo ${mod.id}: sem purpose (crença que instala).`);
  }
  const tipos = new Set(mods.map((x) => x.type));
  const tem = (t) => tipos.has(t);
  if (mods[0] && mods[0].type !== "hero") E("O primeiro módulo deve ser hero.");
  if (!tem("footer_legal")) E("footer_legal obrigatório (Decreto 7.962/2013).");
  if (!Array.isArray(spec.omitted)) W("Liste os módulos omitidos com motivo em `omitted`.");

  // ---------- provas ----------
  const proofs = Array.isArray(spec.proofs) ? spec.proofs : [];
  const proofById = new Map(proofs.map((p) => [p.id, p]));
  for (const p of proofs) {
    if (!ENUMS.proof.includes(p.type)) E(`Prova ${p.id}: type inválido "${p.type}".`);
    if (p.verified !== true) E(`Prova ${p.id} não verificada (verified != true). Não pode ser usada.`);
    if (p.type === "depoimento" && p.consent !== true) E(`Depoimento ${p.id} sem consentimento.`);
    if (["depoimento", "case"].includes(p.type) && p.result && !p.typicality_note) W(`Prova ${p.id}: resultado sem nota de tipicidade.`);
  }
  const checarProvas = (lista, onde) => (lista || []).forEach((pid) => { if (!proofById.has(pid)) E(`${onde}: prova "${pid}" não existe no inventário.`); });
  mods.forEach((mod) => checarProvas(mod.proof_ids, `Módulo ${mod.id}`));
  const nProvas = (t) => proofs.filter((p) => p.type === t && p.verified === true).length;
  if (tem("depoimentos") && nProvas("depoimento") < 1) E("Módulo depoimentos sem depoimentos verificados no inventário.");
  if (tem("cases") && nProvas("case") < 1) E("Módulo cases sem case verificado.");
  if (tem("prova_social") && !proofs.some((p) => ["numero", "logo", "review", "midia"].includes(p.type))) E("prova_social sem número/logo/review/mídia real.");

  // ---------- objeções ----------
  const objs = Array.isArray(spec.objections) ? spec.objections : [];
  if (objs.length < 1) E("Mapeie ao menos 1 objeção (ideal: 3–5).");
  else if (objs.length < 3) W(`Apenas ${objs.length} objeção(ões) mapeada(s); o ideal é 3–5.`);
  for (const o of objs) {
    if (!o.answered_by?.length) E(`Objeção ${o.id} sem módulo que a responda.`);
    for (const mid of o.answered_by || []) if (!ids.has(mid)) E(`Objeção ${o.id}: módulo "${mid}" não existe.`);
    checarProvas(o.proof_ids, `Objeção ${o.id}`);
    if ((o.severity || 0) >= 4 && !o.proof_ids?.length) W(`Lacuna crítica: objeção ${o.id} (severidade ${o.severity}) sem prova.`);
    if (o.source === "hipotese") W(`Objeção ${o.id} é hipótese: valide com o usuário.`);
  }

  // ---------- CTAs ----------
  const ctas = Array.isArray(spec.ctas) ? spec.ctas : [];
  const prim = ctas.filter((c) => c.hierarchy === "primario");
  if (!prim.length) E("Defina um CTA primário.");
  const intents = new Set(prim.map((c) => c.intent));
  if (intents.size > 1) E(`CTAs primários com intenções diferentes (${[...intents].join(", ")}): um objetivo por página.`);
  for (const c of ctas) {
    if (!ENUMS.cta_intent.includes(c.intent)) E(`CTA ${c.id}: intent inválido "${c.intent}".`);
    if (!c.destination || c.destination === "#") E(`CTA ${c.id}: destino real obrigatório.`);
    if (!c.context_microcopy && c.hierarchy === "primario") W(`CTA ${c.id}: sem microcopy de expectativa.`);
    const u = c.urgency?.level || "nenhuma";
    if (!ENUMS.urgency.includes(u)) E(`CTA ${c.id}: urgency.level inválido.`);
    if (u !== "nenhuma" && !c.urgency?.justification) E(`CTA ${c.id}: urgência sem justificativa real.`);
    if (u === "real_prazo" && !c.urgency?.deadline_iso) E(`CTA ${c.id}: urgência de prazo sem deadline_iso.`);
  }

  // ---------- oferta ----------
  const of = spec.offer || {};
  const rec = of.price?.recorrencia || "nenhuma";
  const vendeDireto = ["compra"].includes(m.goal) || ["comprar", "assinar"].some((i) => intents.has(i));
  if (vendeDireto) {
    if (of.price?.avista == null && of.price?.parcelas == null) E("Venda direta sem preço definido em offer.price.");
    if (of.price?.parcelas && of.price.parcelas.juros === undefined) E("offer.price.parcelas.juros deve ser explícito (true/false).");
    if (!of.guarantee || !(of.guarantee.dias >= 7)) E("Garantia/arrependimento de no mínimo 7 dias (CDC art. 49).");
    if (!tem("garantia")) W("Venda direta sem módulo garantia.");
    if (!tem("pricing") && !tem("oferta")) E("Venda direta sem módulo pricing/oferta.");
  }
  if (of.anchor && of.anchor.tipo && of.anchor.tipo !== "nenhum" && !of.anchor.fonte) E("Âncora de preço sem fonte (preço real anterior ou custo da alternativa).");
  if (tem("ancoragem") && (!of.anchor || of.anchor.tipo === "nenhum")) E("Módulo ancoragem sem offer.anchor real.");
  if ((tem("escassez") || tem("urgencia")) && of.scarcity?.real !== true) E("Escassez/urgência na página sem offer.scarcity.real = true.");
  if (of.scarcity?.real === true && !of.scarcity.motivo) E("offer.scarcity.motivo obrigatório.");
  for (const b of of.bonuses || []) {
    if (!b.objection_resolved) W(`Bônus "${b.item}" não resolve objeção declarada.`);
    if (b.valor && !b.value_basis) E(`Bônus "${b.item}" com valor sem value_basis.`);
  }
  if (rec !== "nenhuma") {
    if (!of.cancellation?.metodo) E("Produto recorrente sem offer.cancellation.metodo.");
    if (!tem("faq")) W("Produto recorrente: explique cancelamento no FAQ.");
  }

  // ---------- regras de diagnóstico ----------
  const aw = m.awareness;
  if (["produto", "muito_consciente"].includes(aw) && tem("agitacao")) W("Consciência alta: agitação tende a ser redundante.");
  if (["inconsciente", "problema"].includes(aw) && !tem("problema")) W("Consciência baixa: falta módulo problema.");
  if (["inconsciente", "problema"].includes(aw) && m.length === "curta") W("Consciência baixa com página curta: revise.");
  if (m.sophistication >= 3 && !tem("mecanismo")) E("Sofisticação ≥ 3: módulo mecanismo obrigatório.");
  if (["saas", "ferramenta", "saas_b2b"].includes(m.product_type) && !tem("demonstracao")) E("SaaS/ferramenta: demonstracao obrigatória.");
  if (m.ticket?.faixa === "alto" && ["mentoria", "servico", "saas_b2b"].includes(m.product_type)) {
    if (!tem("para_quem_nao")) W("Ticket alto: considere para_quem_nao.");
    if (intents.has("comprar")) W("Ticket alto B2B/mentoria com compra direta: avalie aplicação/call/demo.");
  }
  if (m.sensitive_niche === true && !tem("disclaimer")) E("Nicho sensível (renda/saúde/finanças): disclaimer obrigatório.");
  if ((m.traffic_sources || []).includes("frio_pago") && !m.ad_match) W("Tráfego frio pago: registre meta.ad_match (promessa do anúncio).");

  // ---------- legal ----------
  const lg = spec.legal || {};
  for (const k of ["razao_social", "documento", "contato"]) if (!lg[k]) E(`legal.${k} obrigatório.`);
  if (!lg.endereco) W("legal.endereco recomendado (Decreto 7.962 exige endereço físico e eletrônico).");

  return { erros, avisos, ok: erros.length === 0 };
}

const isCli = process.argv[1] && process.argv[1].endsWith("validar-spec.mjs");
if (isCli) {
  const a = args();
  if (!a.spec) fail("Informe --spec page-spec.json");
  let spec;
  try { spec = JSON.parse(readFileSync(a.spec, "utf8")); } catch (e) { fail(`Não consegui ler ${a.spec}: ${e.message}`); }
  const r = validar(spec);
  if (a.json) console.log(JSON.stringify(r, null, 2));
  else {
    r.erros.forEach((x) => console.log(`✖ ${x}`));
    r.avisos.forEach((x) => console.log(`⚠ ${x}`));
    console.log(r.ok ? `✔ Spec válido (${r.avisos.length} aviso(s)).` : `✖ ${r.erros.length} erro(s), ${r.avisos.length} aviso(s).`);
  }
  process.exit(r.ok ? 0 : 1);
}
