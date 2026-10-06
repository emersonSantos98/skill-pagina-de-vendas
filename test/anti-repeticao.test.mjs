import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { eixos, comparar } from "../skill/scripts/anti-repeticao.mjs";

const spec = JSON.parse(readFileSync(new URL("../skill/modelos/page-spec.exemplo.json", import.meta.url), "utf8"));

test("extrai 5 eixos", () => {
  const e = eixos(spec);
  assert.deepEqual(Object.keys(e), ["framework", "abertura", "hero", "prova_principal", "cta"]);
  assert.equal(e.framework, "PAS");
});

test("acusa estrutura igual e aceita distinta", () => {
  const e = eixos(spec);
  assert.equal(comparar(e, [{ projeto: "a", eixos: e }]).length, 1);
  const outro = { framework: "FAB", abertura: "x", hero: "oferta", prova_principal: "logo", cta: "trial@hero" };
  assert.equal(comparar(e, [{ projeto: "b", eixos: outro }]).length, 0);
});
