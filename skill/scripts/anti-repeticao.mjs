#!/usr/bin/env node
// Trava anti-template: compara o page-spec com construções anteriores em 5 eixos.
// Uso: node anti-repeticao.mjs --spec page-spec.json --registro construcoes.json [--registrar] [--estrito] [--projeto nome]
// Padrão: só avisa (a lógica de conversão vence a novidade). --estrito falha com código 1.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { args, fail } from "./_lib.mjs";

export function eixos(spec) {
  const mods = (spec.modules || []).map((x) => x.type);
  const contagem = {};
  const proofById = new Map((spec.proofs || []).map((p) => [p.id, p.type]));
  for (const mod of spec.modules || []) for (const pid of mod.proof_ids || []) {
    const t = proofById.get(pid); if (t) contagem[t] = (contagem[t] || 0) + 1;
  }
  const prova = Object.entries(contagem).sort((a, b) => b[1] - a[1])[0]?.[0] || "nenhuma";
  const prim = (spec.ctas || []).find((c) => c.hierarchy === "primario");
  return {
    framework: spec.meta?.framework?.primario || "?",
    abertura: mods.slice(0, 5).join(">"),
    hero: spec.meta?.hero_type || "?",
    prova_principal: prova,
    cta: prim ? `${prim.intent}@${(prim.position || []).join("+")}` : "?",
  };
}

export function comparar(novo, anteriores, minimo = 3) {
  const conflitos = [];
  for (const ant of anteriores) {
    const diferentes = Object.keys(novo).filter((k) => novo[k] !== ant.eixos?.[k]).length;
    if (diferentes < minimo) conflitos.push({ projeto: ant.projeto, data: ant.data, diferentes });
  }
  return conflitos;
}

const isCli = process.argv[1] && process.argv[1].endsWith("anti-repeticao.mjs");
if (isCli) {
  const a = args();
  if (!a.spec) fail("Informe --spec");
  const registro = a.registro || "construcoes.json";
  const spec = JSON.parse(readFileSync(a.spec, "utf8"));
  const lista = existsSync(registro) ? JSON.parse(readFileSync(registro, "utf8")) : [];
  const novo = eixos(spec);
  const projeto = a.projeto || spec.meta?.projeto || "sem-nome";
  const conflitos = comparar(novo, lista.filter((x) => x.projeto !== projeto));
  console.log("Eixos:", JSON.stringify(novo, null, 2));
  if (conflitos.length) {
    for (const c of conflitos) console.log(`⚠ Parecido demais com "${c.projeto}" (${c.data}): difere em ${c.diferentes}/5 eixos.`);
    console.log("Mude eixos que não prejudiquem a lógica de conversão (hero, prova principal, framework secundário).");
  } else console.log("✔ Estrutura distinta das construções anteriores.");
  if (a.registrar) {
    lista.push({ data: new Date().toISOString().slice(0, 10), projeto, eixos: novo });
    writeFileSync(registro, JSON.stringify(lista, null, 2) + "\n");
    console.log(`✔ Registrado em ${registro}`);
  }
  process.exit(conflitos.length && a.estrito ? 1 : 0);
}
