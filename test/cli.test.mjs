import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, existsSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { install, uninstall, parseArgs, targets } from "../bin/cli.mjs";

test("parseArgs entende comando e flags", () => {
  const o = parseArgs(["install", "--project", "--force", "--agents"]);
  assert.equal(o.cmd, "install");
  assert.ok(o.project && o.force && o.agents);
  assert.throws(() => parseArgs(["install", "--xyz"]));
});

test("targets usa .claude/skills/pagina-de-vendas", () => {
  const [t] = targets({ dir: "/tmp/base" });
  assert.match(t, /\.claude[\\/]skills[\\/]pagina-de-vendas$/);
});

test("install copia a skill e exige --force para sobrescrever", () => {
  const base = mkdtempSync(join(tmpdir(), "pdv-"));
  const [dest] = install({ dir: base, agents: false, force: false });
  assert.ok(existsSync(join(dest, "SKILL.md")));
  assert.match(readFileSync(join(dest, "SKILL.md"), "utf8"), /^---\nname: pagina-de-vendas/);
  assert.throws(() => install({ dir: base }), /--force/);
  assert.doesNotThrow(() => install({ dir: base, force: true }));
  assert.equal(uninstall({ dir: base }).length, 1);
  assert.ok(!existsSync(dest));
});

test("install --agents grava em dois destinos", () => {
  const base = mkdtempSync(join(tmpdir(), "pdv-"));
  const done = install({ dir: base, agents: true });
  assert.equal(done.length, 2);
  assert.ok(done.every((d) => existsSync(join(d, "SKILL.md"))));
});
