import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { validar } from "../skill/scripts/validar-spec.mjs";

const base = () => JSON.parse(readFileSync(new URL("../skill/modelos/page-spec.exemplo.json", import.meta.url), "utf8"));

test("exemplo oficial é válido", () => {
  const r = validar(base());
  assert.deepEqual(r.erros, []);
});

test("prova inexistente gera erro", () => {
  const s = base();
  s.objections[0].proof_ids = ["nao-existe"];
  assert.ok(validar(s).erros.some((e) => e.includes("nao-existe")));
});

test("depoimento sem consentimento gera erro", () => {
  const s = base();
  s.proofs[0].consent = false;
  assert.ok(validar(s).erros.some((e) => e.includes("consentimento")));
});

test("escassez sem base real gera erro", () => {
  const s = base();
  s.modules.splice(-2, 0, { id: "esc", type: "escassez", purpose: "x" });
  assert.ok(validar(s).erros.some((e) => e.includes("scarcity")));
});

test("dois CTAs primários com intenções diferentes geram erro", () => {
  const s = base();
  s.ctas.push({ id: "c2", label: "Agendar", intent: "agendar", hierarchy: "primario", destination: "https://x" });
  assert.ok(validar(s).erros.some((e) => e.includes("um objetivo")));
});

test("garantia < 7 dias gera erro", () => {
  const s = base();
  s.offer.guarantee.dias = 3;
  assert.ok(validar(s).erros.some((e) => e.includes("7 dias")));
});

test("sofisticação ≥ 3 sem mecanismo gera erro", () => {
  const s = base();
  s.modules = s.modules.filter((m) => m.type !== "mecanismo");
  s.objections[0].answered_by = ["depoimentos"];
  assert.ok(validar(s).erros.some((e) => e.includes("mecanismo")));
});

test("SaaS sem demonstração gera erro", () => {
  const s = base();
  s.meta.product_type = "saas";
  assert.ok(validar(s).erros.some((e) => e.includes("demonstracao")));
});

test("âncora sem fonte gera erro", () => {
  const s = base();
  s.offer.anchor = { tipo: "preco_anterior_real", valor: 997 };
  assert.ok(validar(s).erros.some((e) => e.includes("Âncora")));
});
