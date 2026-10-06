import { test } from "node:test";
import assert from "node:assert/strict";
import { lint } from "../skill/scripts/lint-copy.mjs";

const ids = (t) => lint(t).map((x) => x.regra);

test("detecta promessa de ganho e dinheiro fácil", () => {
  assert.ok(ids("Renda extra garantida todo mês").includes("promessa-ganho"));
  assert.ok(ids("Dinheiro fácil sem esforço").includes("dinheiro-facil"));
});

test("detecta confirmshaming", () => {
  assert.ok(ids("Não, prefiro continuar perdendo vendas").includes("confirmshaming"));
});

test("avisa atributo pessoal, escassez e âncora", () => {
  const r = ids("Você está endividado? Últimas vagas! De R$ 997 por R$ 497");
  for (const id of ["atributo-pessoal", "escassez", "ancoragem"]) assert.ok(r.includes(id), id);
});

test("texto limpo não gera achados", () => {
  assert.deepEqual(lint("<h1>Relatórios que se atualizam sozinhos</h1><p>7 dias de garantia.</p>"), []);
});

test("ignora conteúdo de <script>", () => {
  assert.deepEqual(lint("<script>const x='dinheiro fácil'</script>"), []);
});
