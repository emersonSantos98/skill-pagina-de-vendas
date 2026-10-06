# Verificação

A página só está pronta depois que você a **viu**. Os screenshots são a prova.

## Rodar
```bash
npm i -D playwright-core           # uma vez, na pasta do projeto
node <skill>/scripts/servir.mjs --pasta . --porta 4600
node <skill>/scripts/verificar.mjs --url http://localhost:4600 --saida verificacao
node <skill>/scripts/lint-copy.mjs --arquivo index.html
node <skill>/scripts/validar-spec.mjs --spec page-spec.json
```
Usa o Chrome instalado (ou `CHROME_PATH`). Gera:
- `verificacao/desktop/` (1440×900), `verificacao/celular/` (390×844) — passos de 75% da tela
- `verificacao/reduzido/pagina-inteira.png` — `prefers-reduced-motion: reduce`
- `verificacao/RELATORIO.md` — erros de console, checagens estruturais

## O que procurar nos screenshots (abra um por um)
1. **Primeira tela:** em 5 s dá para saber o que é, para quem, resultado e próximo passo? CTA visível?
2. **Ilusão de completude:** a primeira tela parece "acabar"? Deixe algo cortado convidando a rolar.
3. **Cortes:** headline, botões, tabelas de preço quebrados no celular.
4. **Contraste:** texto legível sobre cada fundo/imagem.
5. **Preço:** total, parcelas e recorrência visíveis ao lado do CTA.
6. **Prova perto da decisão:** há prova junto do bloco de oferta?
7. **Trecho morto:** vários passos seguidos sem informação nova.
8. **Reduzido:** todo conteúdo visível sem animação, na ordem certa.

## Checagens automáticas do RELATORIO.md
Um `<h1>` · imagens sem `alt` · links `href="#"` ou vazios · CTAs encontrados ·
`lang` · viewport · erros de console/página · largura horizontal excedente no celular.

Repita até uma passada limpa. Na entrega, diga honestamente o que não foi testado
(dispositivo físico, checkout real, autoplay em iOS, dados de campo de velocidade).
