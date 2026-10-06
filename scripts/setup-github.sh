#!/usr/bin/env bash
# Cria o repositório público, as branches main/dev e as proteções.
# Pré-requisitos: git, GitHub CLI (gh) autenticado: `gh auth login`.
# Uso: bash scripts/setup-github.sh
set -euo pipefail

OWNER="emersonSantos98"
REPO="skill-pagina-de-vendas"
FULL="$OWNER/$REPO"
DESC="Skill para Claude Code que cria páginas de vendas sob medida: diagnóstico, copy, CRO, UX e verificação automática."

cd "$(dirname "$0")/.."

command -v gh >/dev/null || { echo "Instale o GitHub CLI: https://cli.github.com"; exit 1; }
gh auth status >/dev/null || { echo "Rode: gh auth login"; exit 1; }

echo "→ 1/6 Commit inicial na main"
if [ ! -d .git ]; then git init -b main; fi
git add -A
git commit -m "chore: initial project structure" || echo "(nada novo para commitar)"

echo "→ 2/6 Criando repositório público $FULL"
if ! gh repo view "$FULL" >/dev/null 2>&1; then
  gh repo create "$FULL" --public --description "$DESC" --source=. --remote=origin --push
else
  git remote get-url origin >/dev/null 2>&1 || git remote add origin "https://github.com/$FULL.git"
  git push -u origin main
fi

echo "→ 3/6 Branch dev"
git switch -c dev 2>/dev/null || git switch dev
git push -u origin dev
git switch main

echo "→ 4/6 Configurações do repositório"
gh repo edit "$FULL" \
  --default-branch main \
  --enable-issues \
  --enable-wiki=false \
  --enable-squash-merge \
  --enable-merge-commit \
  --enable-rebase-merge=false \
  --delete-branch-on-merge \
  --allow-update-branch \
  --add-topic claude-code,claude-skill,agent-skills,landing-page,copywriting,cro,pagina-de-vendas

echo "→ 5/6 Rulesets (main/dev e tags v*)"
gh api -X POST "repos/$FULL/rulesets" --input scripts/ruleset-branches.json >/dev/null && echo "  ✔ branches"
gh api -X POST "repos/$FULL/rulesets" --input scripts/ruleset-tags.json >/dev/null && echo "  ✔ tags"

echo "→ 6/6 Segurança e Actions"
gh api -X PUT "repos/$FULL/private-vulnerability-reporting" >/dev/null 2>&1 \
  && echo "  ✔ reporte privado de vulnerabilidades" \
  || echo "  • ative manualmente: Settings → Code security → Private vulnerability reporting"
gh api -X PUT "repos/$FULL/actions/permissions/fork-pr-contributor-approval" -f approval_policy=all_external_contributors >/dev/null 2>&1 \
  && echo "  ✔ workflows de forks exigem sua aprovação" \
  || echo "  • ajuste manualmente: Settings → Actions → General → Fork pull request workflows → 'Require approval for all external contributors'"
gh api -X PUT "repos/$FULL/environments/npm" >/dev/null && echo "  ✔ environment 'npm' criado"

cat <<MSG

✔ Pronto: https://github.com/$FULL

Próximos passos (uma vez):
  1. Settings → Environments → npm → Deployment branches and tags: restrinja a tags "v*".
  2. Publique a 0.1.0 manualmente (ver README → "Publicação no npm").
  3. No npmjs.com, configure o Trusted Publisher do pacote:
     GitHub Actions · owner $OWNER · repo $REPO · workflow release.yml · environment npm
MSG
