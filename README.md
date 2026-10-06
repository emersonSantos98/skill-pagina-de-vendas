# skill-pagina-de-vendas

[![CI](https://github.com/emersonSantos98/skill-pagina-de-vendas/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/emersonSantos98/skill-pagina-de-vendas/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@emersonsantos98/skill-pagina-de-vendas.svg)](https://www.npmjs.com/package/@emersonsantos98/skill-pagina-de-vendas)
[![Licença: MIT](https://img.shields.io/badge/licen%C3%A7a-MIT-blue.svg)](LICENSE)

Skill para **Claude Code** que cria páginas de vendas e landing pages **a partir de
diagnóstico, não de template**. Ela entrevista você, identifica o nível de
consciência do público, mapeia objeções, escolhe o framework de copy, monta só
os módulos necessários, escreve a copy, gera HTML e **verifica o resultado**
(screenshots desktop/celular, acessibilidade e lint ético/legal).

> Princípio: uma página de vendas é uma sequência de crenças. Cada módulo instala
> uma crença e derruba uma objeção com uma **prova real**. Sem prova, sem módulo.

## Sumário
- [Instalação](#instalação)
- [Uso](#uso)
- [Página de referência e auditoria](#página-de-referência-e-auditoria)
- [Como a skill trabalha](#como-a-skill-trabalha)
- [Scripts](#scripts)
- [Estrutura do repositório](#estrutura-do-repositório)
- [Contribuindo](#contribuindo)
- [Publicação no npm (mantenedor)](#publicação-no-npm-mantenedor)
- [Licença](#licença)

## Instalação

Requisitos: **Node.js ≥ 18.17** e Claude Code. Para a verificação visual:
Google Chrome instalado (ou variável `CHROME_PATH`).

```bash
# Global (todos os projetos): ~/.claude/skills/pagina-de-vendas
npx @emersonsantos98/skill-pagina-de-vendas install

# Só no projeto atual: ./.claude/skills/pagina-de-vendas
npx @emersonsantos98/skill-pagina-de-vendas install --project
```

| Comando | O que faz |
|---|---|
| `install [--project] [--agents] [--force] [--dir <pasta>]` | Instala (`--agents` também copia para `.agents/skills`; `--force` atualiza) |
| `uninstall [--project]` | Remove |
| `path [--project]` | Mostra o destino |
| `doctor` | Verifica Node, Chrome, `playwright-core` e instalações |

Atualizar para a versão mais recente:
```bash
npx @emersonsantos98/skill-pagina-de-vendas@latest install --force
```

Para os scripts de navegador (verificação e captura), instale no **projeto da página**:
```bash
npm i -D playwright-core
```
O `playwright-core` não baixa navegadores: ele usa o Chrome que você já tem.

## Uso

Abra o Claude Code na pasta do projeto e peça, por exemplo:

```text
Usa a skill pagina-de-vendas para criar a página do meu curso de Excel para analistas.
```
```text
Quero uma landing para o trial do meu SaaS de agendamento. O tráfego vem do Google Ads.
```
```text
Refaz minha página de vendas: https://meusite.com/curso — mantém preços e depoimentos reais.
```

A skill **não sai escrevendo HTML**. Ela segue as fases e pede sua aprovação na arquitetura:

1. **Briefing** — uma pergunta por vez → `BRIEF.md`
2. **Diagnóstico** — tipo, ticket, consciência, sofisticação, objetivo
3. **Crenças, objeções e oferta** — top 3–5 objeções ligadas a provas reais
4. **Arquitetura** — módulos com motivo de inclusão/omissão → `page-spec.json` (validado)
5. **Copy** — na linguagem do cliente, com lint ético
6. **HTML** — semântico, mobile primeiro, um CTA primário
7. **Verificação** — screenshots + relatório; corrige até passar
8. **Entrega** — relatório com decisões, lacunas de prova, riscos e hipóteses de A/B

Arquivos gerados no seu projeto: `BRIEF.md`, `page-spec.json`, `index.html`,
`verificacao/`, `construcoes.json` e, quando houver URL, `referencia/`.

## Página de referência e auditoria

Sim, você pode enviar um link. São dois modos:

| Modo | Quando | O que a skill faz |
|---|---|---|
| **Referência** | Página de concorrente ou inspiração | Extrai **padrões estruturais** (ordem dos blocos, CTAs, preço, provas, objeções) para comparar e diferenciar. **Não copia** texto, layout, imagens ou marca. |
| **Auditoria** | Sua página atual | Mesma extração + diagnóstico de lacunas. Reaproveita textos, preços e provas reais (com sua confirmação). |

```bash
node ~/.claude/skills/pagina-de-vendas/scripts/capturar-referencia.mjs \
  --url https://exemplo.com/oferta --saida referencia --modo referencia   # ou --modo auditoria
```
Saída: `referencia/REFERENCIA.md`, `estrutura.json`, `desktop.png` e `celular.png`.
Normalmente você só cola o link no chat e a skill roda isso sozinha.

## Como a skill trabalha

- **Nível de consciência (Schwartz)** define a headline, a ordem e a extensão da página.
- **Sofisticação do mercado** ≥ 3 torna o módulo *mecanismo* obrigatório.
- **Ticket e complexidade** definem o CTA: compra, trial, demo, aplicação ou call.
- **Inventário de provas** é a única fonte de prova. Depoimento sem consentimento é bloqueado.
- **Ética e legal** como regra: CDC art. 49, Decreto 7.962/2013, LGPD, termos da
  Hotmart, Meta Ads e FTC. Escassez falsa, "de/por" fictício, confirmshaming e
  juros escondidos são barrados pelo validador e pelo lint.
- **Evidência rotulada**: [E] empírica, [C] consenso, [O] opinião, [T] tendência.
  A skill não vende boa prática como garantia de conversão.

Base de conhecimento: [`skill/referencias/`](skill/referencias).

## Scripts

Todos ficam em `skill/scripts/`, sem dependências (exceto `playwright-core` opcional no projeto).

| Script | Uso |
|---|---|
| `servir.mjs` | `--pasta . --porta 4600`: servidor estático local |
| `verificar.mjs` | `--url … --saida verificacao`: screenshots 1440/390, reduced-motion e `RELATORIO.md` |
| `capturar-referencia.mjs` | `--url … --modo referencia\|auditoria`: análise de página |
| `validar-spec.mjs` | `--spec page-spec.json`: coerência entre estratégia, provas, CTAs, oferta e legal |
| `lint-copy.mjs` | `--arquivo index.html`: promessa de ganho, confirmshaming, escassez, âncora etc. |
| `anti-repeticao.mjs` | `--spec … --registro construcoes.json [--registrar]`: evita estrutura-template |

Códigos de saída: `0` ok · `1` erro de validação · `2` erros de console na verificação.

## Estrutura do repositório

```
.
├── bin/cli.mjs                  # instalador (npx)
├── skill/                       # conteúdo copiado para .claude/skills/pagina-de-vendas
│   ├── SKILL.md
│   ├── referencias/             # diagnóstico, módulos, frameworks, CRO, ética/legal…
│   ├── schemas/                 # page-spec.schema.json, referencia.schema.json
│   ├── scripts/                 # servir, verificar, capturar-referencia, validar-spec, lint-copy, anti-repeticao
│   ├── checklists/              # qualidade.md, legal-br.md
│   └── modelos/                 # BRIEF, page-spec de exemplo, relatório de entrega
├── test/                        # node:test
├── scripts/                     # setup-github.sh + rulesets (manutenção do repo)
└── .github/                     # CI, release, templates, CODEOWNERS
```

## Contribuindo

Contribuições são bem-vindas via **fork + Pull Request para `dev`**. Todo PR
precisa da aprovação do mantenedor e do CI verde. Leia o [CONTRIBUTING.md](CONTRIBUTING.md).

Fluxo de branches:
```
feature/<numero>-<descricao>  ──PR──▶  dev  ──PR (mantenedor)──▶  main  ──tag vX.Y.Z──▶  npm
```

## Publicação no npm (mantenedor)

**Primeira vez (0.1.0):**
```bash
npm login
npm publish --access public --provenance=false
```
Em seguida, no npmjs.com, abra o pacote → **Settings → Trusted Publisher → GitHub Actions**:
owner `emersonSantos98`, repositório `skill-pagina-de-vendas`, workflow `release.yml`,
environment `npm`. A partir daí não há token no repositório.

**Próximas versões:**
```bash
# 1. bump de versão numa branch de release, via PR (main/dev não aceitam push direto)
git switch dev && git pull
git switch -c release/<numero>-v0.2.0
npm version minor --no-git-tag-version   # patch | minor | major
# atualize o CHANGELOG.md
git commit -am "chore(release): v0.2.0"
git push -u origin HEAD                  # PR → dev, depois PR dev → main

# 2. com o merge feito na main, crie a tag (só admins podem criar tags v*)
git switch main && git pull
git tag v0.2.0 && git push origin v0.2.0
```
O workflow `release.yml` confere se a tag está na `main` e se bate com o
`package.json`, roda os testes, publica com *provenance* e cria a GitHub Release.

## Licença

[MIT](LICENSE) © Emerson Santos. Os sites e as páginas que você criar com a skill são seus.
