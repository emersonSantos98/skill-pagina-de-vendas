# Contribuindo

Obrigado pelo interesse! Este repositório é público, mas **nada entra sem
aprovação do mantenedor** (@emersonSantos98).

## Regras do fluxo
- `main`: estável, publicada no npm. Só recebe PR vindo de `dev`.
- `dev`: integração. **Todo PR de contribuição aponta para `dev`.**
- Push direto, force-push e exclusão de `main`/`dev` são bloqueados.
- Merge exige: 1 aprovação do CODEOWNER, conversas resolvidas e o check `ci-ok` verde.
- Workflows de PRs vindos de forks só rodam após aprovação do mantenedor.

## Passo a passo
```bash
# 1. fork pelo GitHub e clone o seu fork
git clone https://github.com/<seu-usuario>/skill-pagina-de-vendas.git
cd skill-pagina-de-vendas
git remote add upstream https://github.com/emersonSantos98/skill-pagina-de-vendas.git

# 2. branch a partir de dev
git fetch upstream && git switch -c feature/<numero>-<descricao-em-ingles> upstream/dev

# 3. desenvolva e valide
npm ci
npm test
npm run lint:skill

# 4. teste a skill instalada localmente
node bin/cli.mjs install --project --force

# 5. commit e PR para dev
git commit -m "feat: add <descricao>"
git push -u origin HEAD
```

## Convenções
- **Branch:** `prefixo/<numero>-<descricao-em-ingles>`, em que `numero` é a issue.
  Prefixos: `feature`, `fix`, `docs`, `refactor`, `chore`, `test`, `release`.
  Ex.: `feature/12-add-webinar-page-type`.
- **Commit:** [Conventional Commits](https://www.conventionalcommits.org/pt-br/), em inglês.
  Ex.: `fix: handle relative urls in capture script`.
- **Código:** ESM, Node ≥ 18.17, **sem dependências de runtime** (só módulos nativos).
- **Referências da skill (`skill/referencias/`):** toda regra nova de copy/CRO cita a
  fonte e o nível de evidência: [E] empírica, [C] consenso, [O] opinião, [T] tendência.
  Nada de "isso sempre converte".
- **Exemplos:** dados fictícios e marcados como fictícios. Nunca use depoimento ou
  número de pessoa ou empresa real sem autorização.
- Mantenha o `SKILL.md` abaixo de ~500 linhas. Detalhes vão para `referencias/`.
- Atualize o `CHANGELOG.md` na seção "Não lançado".

## Para o mantenedor
- PRs de terceiros: revise e aprove, depois faça merge (squash) em `dev`.
- `dev → main`: abra o PR e faça o merge com bypass de admin (você não pode
  aprovar o próprio PR; o ruleset permite bypass só via PR). Use **merge commit**,
  não squash, para `main` e `dev` não divergirem.
- Release: ver README → "Publicação no npm".
