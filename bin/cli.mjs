#!/usr/bin/env node
// CLI de instalação da skill pagina-de-vendas no Claude Code.
// Sem dependências: usa apenas módulos nativos do Node (>= 18.17).
import { cpSync, existsSync, readFileSync, realpathSync, rmSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SKILL_NAME = "pagina-de-vendas";
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = join(ROOT, "skill");
const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));

const HELP = `
${pkg.name} v${pkg.version}

Uso:
  npx ${pkg.name} <comando> [opções]

Comandos:
  install     Instala a skill no Claude Code (padrão: global, ~/.claude/skills)
  uninstall   Remove a skill
  path        Mostra onde a skill seria/está instalada
  doctor      Verifica Node, Chrome e playwright-core
  help        Mostra esta ajuda

Opções:
  --project       Usa ./.claude/skills do diretório atual (em vez do global)
  --dir <pasta>   Usa uma pasta base customizada (contém .claude/skills)
  --agents        Também instala em .agents/skills (Antigravity e afins)
  --force         Sobrescreve instalação existente
  -v, --version   Mostra a versão
`;

export function parseArgs(argv) {
  const opts = { cmd: "help", project: false, dir: null, agents: false, force: false };
  const rest = [...argv];
  if (rest[0] && !rest[0].startsWith("-")) opts.cmd = rest.shift();
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (a === "--project") opts.project = true;
    else if (a === "--agents") opts.agents = true;
    else if (a === "--force" || a === "-f") opts.force = true;
    else if (a === "--dir") opts.dir = rest[++i];
    else if (a === "-v" || a === "--version") opts.cmd = "version";
    else if (a === "-h" || a === "--help") opts.cmd = "help";
    else throw new Error(`Opção desconhecida: ${a}`);
  }
  return opts;
}

export function targets(opts, env = process.env) {
  const base = opts.dir
    ? resolve(opts.dir)
    : opts.project
      ? process.cwd()
      : env.CLAUDE_HOME_DIR || homedir();
  const list = [join(base, ".claude", "skills", SKILL_NAME)];
  if (opts.agents) list.push(join(base, ".agents", "skills", SKILL_NAME));
  return list;
}

export function install(opts) {
  if (!existsSync(join(SOURCE, "SKILL.md"))) {
    throw new Error(`Pacote corrompido: ${SOURCE}/SKILL.md não encontrado.`);
  }
  const done = [];
  for (const dest of targets(opts)) {
    if (existsSync(dest)) {
      if (!opts.force) {
        throw new Error(`Já existe em ${dest}. Use --force para atualizar.`);
      }
      rmSync(dest, { recursive: true, force: true });
    }
    mkdirSync(dirname(dest), { recursive: true });
    cpSync(SOURCE, dest, { recursive: true });
    done.push(dest);
  }
  return done;
}

export function uninstall(opts) {
  const removed = [];
  for (const dest of targets(opts)) {
    if (existsSync(dest)) {
      rmSync(dest, { recursive: true, force: true });
      removed.push(dest);
    }
  }
  return removed;
}

async function doctor() {
  const [major, minor] = process.versions.node.split(".").map(Number);
  const nodeOk = major > 18 || (major === 18 && minor >= 17);
  console.log(`${nodeOk ? "✔" : "✖"} Node ${process.versions.node} (>= 18.17)`);
  let pw = false;
  try {
    const { createRequire } = await import("node:module");
    createRequire(join(process.cwd(), "package.json")).resolve("playwright-core");
    pw = true;
  } catch { /* não instalado no projeto */ }
  console.log(`${pw ? "✔" : "•"} playwright-core no projeto atual${pw ? "" : " (opcional: npm i -D playwright-core)"}`);
  const chromes = [
    process.env.CHROME_PATH,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
  ].filter(Boolean);
  const chrome = chromes.find((p) => existsSync(p));
  console.log(`${chrome ? "✔" : "•"} Chrome ${chrome ? `em ${chrome}` : "não detectado (defina CHROME_PATH se necessário)"}`);
  for (const t of [targets({ project: false }), targets({ project: true })].flat()) {
    console.log(`${existsSync(t) ? "✔" : "•"} skill em ${t}`);
  }
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  switch (opts.cmd) {
    case "install": {
      for (const d of install(opts)) console.log(`✔ Skill instalada em ${d}`);
      console.log(`\nAbra o Claude Code e peça: "use a skill ${SKILL_NAME} para criar minha página de vendas".`);
      break;
    }
    case "uninstall": {
      const r = uninstall(opts);
      console.log(r.length ? r.map((d) => `✔ Removida de ${d}`).join("\n") : "Nada para remover.");
      break;
    }
    case "path":
      console.log(targets(opts).join("\n"));
      break;
    case "doctor":
      await doctor();
      break;
    case "version":
      console.log(pkg.version);
      break;
    case "help":
      console.log(HELP);
      break;
    default:
      throw new Error(`Comando desconhecido: ${opts.cmd}\n${HELP}`);
  }
}

// npx/npm executam o bin via symlink: compara caminhos reais.
const isMain = (() => {
  try {
    return realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url));
  } catch {
    return false;
  }
})();
if (isMain) {
  main().catch((err) => {
    console.error(`✖ ${err.message}`);
    process.exit(1);
  });
}
