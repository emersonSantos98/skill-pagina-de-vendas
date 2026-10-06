---
name: pagina-de-vendas
description: >
  Cria páginas de vendas e landing pages de alta conversão sob medida, a partir de
  diagnóstico — não de template. Entrevista o usuário (produto, público, oferta,
  provas, tráfego), identifica nível de consciência e sofisticação do mercado,
  mapeia objeções, escolhe framework de copy, define só os módulos necessários e
  a ordem deles, escreve a copy, gera HTML real e verifica tudo (screenshots
  desktop/mobile, acessibilidade, lint ético/legal). Aceita link de página de
  referência (concorrente) ou da página atual do usuário para auditar e refazer.
  Use SEMPRE que pedirem: página de vendas, landing page, LP, página de captura,
  sales page, carta de vendas, VSL, página de curso, mentoria, comunidade,
  infoproduto, SaaS, pricing, "melhorar conversão", "refazer minha página",
  "analisar essa página", CRO de página, copy de página — mesmo sem dizer "skill".
---

# Página de Vendas

Princípio: **a estrutura nasce do diagnóstico.** Uma página de vendas é uma
sequência de crenças que o visitante precisa ter para agir. Cada módulo instala
uma crença e derruba uma objeção com uma prova real. Módulo sem crença-alvo ou
sem insumo real **não entra**.

Duas regras inegociáveis:
1. **Prova real ou nada.** Nunca invente depoimento, número, logo, case, mídia,
   prazo ou vaga. Lacuna vira pendência no relatório.
2. **Uma fase por vez.** Não escreva copy antes do diagnóstico, nem HTML antes
   da arquitetura aprovada.

Leia os arquivos de `referencias/` **quando a fase pedir** (indicado abaixo).

## Fase 0 — Entrada

Descubra o modo:
- **Nova página** → Fase 1.
- **Com referência** (URL de concorrente/inspiração) ou **auditoria** (URL da
  página atual do usuário) → rode a captura e leia
  `referencias/analise-referencia.md` antes da Fase 1:
  ```bash
  node <skill>/scripts/capturar-referencia.mjs --url <URL> --saida referencia
  ```
  A captura alimenta o diagnóstico. **Nunca copie** texto, layout ou marca de
  terceiros; da página do próprio usuário, preserve textos, preços e provas reais.

## Fase 1 — Briefing
Leia `referencias/entrevista.md`. Uma pergunta por vez, obrigatórias primeiro.
Grave em `BRIEF.md` (modelo: `modelos/BRIEF.modelo.md`). Sem os obrigatórios,
pare e diga o que falta.

## Fase 2 — Diagnóstico
Leia `referencias/diagnostico.md` e `referencias/tipos-de-pagina.md`.
Defina: tipo, ticket, complexidade, decisor, **nível de consciência por fonte de
tráfego**, **sofisticação do mercado**, objetivo/CTA e extensão.

## Fase 3 — Crenças, objeções e oferta
Leia `referencias/objecoes.md` e `referencias/oferta.md`.
- Mapa de crenças (já existe × precisa instalar).
- Top 3–5 objeções com fonte e severidade; cada uma ligada a ≥1 prova do inventário.
- Oferta pontuada pela Value Equation; aponte o elo fraco.

## Fase 4 — Arquitetura
Leia `referencias/modulos.md` e `referencias/frameworks.md`.
- Framework primário (+ secundário) com justificativa.
- Lista de módulos com **motivo de inclusão** e lista de **omitidos com motivo**.
- Ordem pela jornada; UM pico (mecanismo ou oferta); posições dos CTAs.
- Grave `page-spec.json` (schema: `schemas/page-spec.schema.json`) e valide:
  ```bash
  node <skill>/scripts/validar-spec.mjs --spec page-spec.json
  ```
- Rode a trava anti-template (consultiva: a lógica de conversão vence a
  novidade; mude eixos que não prejudiquem a conversão):
  ```bash
  node <skill>/scripts/anti-repeticao.mjs --spec page-spec.json --registro construcoes.json
  ```
- **Mostre a arquitetura ao usuário e espere o "pode ir".**

## Fase 5 — Copy
Módulo a módulo, na linguagem do cliente (VOC do briefing). Headline pelo nível
de consciência. Benefício → feature → prova. Lint antes de seguir:
```bash
node <skill>/scripts/lint-copy.mjs --arquivo copy.md
```

## Fase 6 — Layout e HTML
Leia `referencias/design.md` e `referencias/acessibilidade-performance.md`.
HTML semântico real, mobile primeiro, um CTA primário, texto selecionável,
links reais (checkout, agenda, WhatsApp). Sem dependência externa obrigatória.

## Fase 7 — Verificação (obrigatória)
Leia `referencias/verificacao.md`.
```bash
node <skill>/scripts/servir.mjs --pasta . --porta 4600
node <skill>/scripts/verificar.mjs --url http://localhost:4600 --saida verificacao
node <skill>/scripts/lint-copy.mjs --arquivo index.html
```
**Abra e leia os screenshots.** Corrija e repita até passar. Aplique
`checklists/qualidade.md` e `checklists/legal-br.md`.

## Fase 8 — Entrega
Use `modelos/relatorio-entrega.md`: decisões (com nível de evidência
[E]/[C]/[O]/[T]), módulos omitidos, lacunas de prova, riscos legais, hipóteses de
teste A/B (ver `referencias/testes-ab.md`). Registre a construção:
```bash
node <skill>/scripts/anti-repeticao.mjs --spec page-spec.json --registro construcoes.json --registrar
```

## Regras de ouro

| Nunca | No lugar |
|---|---|
| Gerar todos os blocos por padrão | Só módulos com crença-alvo; justificar omissões |
| Copy antes do diagnóstico | Briefing → diagnóstico → arquitetura → copy → HTML |
| Inventar prova (depoimento, número, logo, mídia) | Só o inventário `proofs`; lacuna vira pendência |
| Timer/vagas/"X comprando agora" sem base | Urgência e escassez reais, com data ou motivo |
| "De R$ X" nunca praticado | Âncora = preço real anterior (com data) ou custo da alternativa |
| Esconder juros, recorrência, taxas, restrições | Total, parcelas e recorrência ao lado do CTA |
| Prometer ganho, cura, resultado garantido | Resultado típico + disclaimer; linguagem de processo |
| "Você está endividado?" (atributo pessoal) | "Para quem quer sair das dívidas" |
| Confirmshaming / order bump pré-marcado | Recusa neutra; opt-in explícito |
| Cancelamento difícil | Tão fácil quanto assinar, explicado no FAQ |
| Vários CTAs primários | Um objetivo, um CTA primário repetido |
| VSL como único conteúdo | VSL + resumo em texto + legendas |
| Copiar página de referência | Extrair padrões e diferenciar |
| Afirmar "isso converte mais" como fato | Rotular evidência e propor teste |
| Pular verificação | Rodar scripts e LER os screenshots |

## Mapa da skill
```
referencias/  entrevista · diagnostico · tipos-de-pagina · objecoes · oferta ·
              modulos · frameworks · cro · etica-legal · design ·
              acessibilidade-performance · verificacao · testes-ab · analise-referencia
schemas/      page-spec.schema.json · referencia.schema.json
scripts/      servir · verificar · capturar-referencia · validar-spec · lint-copy · anti-repeticao
checklists/   qualidade.md · legal-br.md
modelos/      BRIEF.modelo.md · page-spec.exemplo.json · relatorio-entrega.md
```
Os scripts que usam navegador precisam de `playwright-core` no projeto
(`npm i -D playwright-core`) e do Google Chrome instalado (ou `CHROME_PATH`).
