# Página de referência e auditoria

## Dois modos
| Modo | URL | Pode reaproveitar | Nunca |
|---|---|---|---|
| **referencia** | concorrente/inspiração | padrões estruturais (ordem, tipo de prova, estratégia de preço) | copiar texto, layout, imagens, marca |
| **auditoria** | página atual do usuário | textos, preços, provas e links reais (confirme com o usuário) | manter claims sem base ou dark patterns |

## Captura
```bash
npm i -D playwright-core
node <skill>/scripts/capturar-referencia.mjs --url https://exemplo.com --saida referencia [--modo auditoria]
```
Gera `referencia/estrutura.json`, `referencia/REFERENCIA.md`,
`referencia/desktop.png`, `referencia/celular.png`.

Respeite os termos de uso do site; a captura é de uma página pública, para
análise. Se a página bloquear robôs ou exigir login, peça ao usuário prints.

## Como analisar (preencha em REFERENCIA.md)
1. **Sequência de blocos:** mapeie cada seção para um `id` de `modulos.md`.
2. **Headline:** qual nível de consciência ela pressupõe? Qual framework aparente?
3. **CTA:** intenção (comprar, trial, demo…), quantidade, posições, microcopy.
4. **Oferta e preço:** visível? parcelamento? âncora? recorrência? plano recomendado?
5. **Provas:** tipos, especificidade, proximidade do CTA.
6. **Objeções trabalhadas:** quais e onde; quais ficaram sem resposta.
7. **Confiança e legal:** CNPJ, contato, termos, garantia, disclaimer.
8. **Riscos:** dark patterns, promessas de ganho, timers.
9. **Oportunidades de diferenciação:** o que *não* fazer igual (anti-template).

## Saída para o diagnóstico
- **Referência:** lista de padrões a considerar + lista de diferenciações.
- **Auditoria:** inventário de conteúdo real reaproveitável + lacunas + problemas
  priorizados (impacto × esforço).
