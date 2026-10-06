# Acessibilidade (WCAG 2.2) e performance

## Acessibilidade
- Um `<h1>`; hierarquia de headings sem pular níveis; `lang="pt-BR"`.
- Contraste 4,5:1 (1.4.3); alvos de toque ≥ 24×24 px (2.5.8) — prefira 44×44 no mobile.
- Foco visível; tudo operável por teclado; sem armadilha de foco em modais.
- `alt` descritivo em imagens informativas; `alt=""` em decorativas.
- Formulários com `<label>` associado, mensagens de erro em texto.
- VSL com legendas, sem autoplay com som, controles visíveis; resumo em texto.
- `prefers-reduced-motion` respeitado.
- Links descritivos ("Ver planos", não "clique aqui").

## Performance
- Imagem do hero otimizada (AVIF/WebP), dimensões declaradas, `fetchpriority="high"`; demais com `loading="lazy"`.
- VSL com *facade* (miniatura + play), carregando o player só no clique.
- Fontes: `font-display: swap`, no máximo 2 famílias, subset.
- Reserve espaço para embeds (evita CLS).
- Pixels, chat e scripts de terceiros: adiados (`defer`/após interação).
- Metas: LCP ≤ 2,5 s · INP ≤ 200 ms · CLS ≤ 0,1. Lighthouse é proxy de laboratório;
  o que vale é o dado de campo (p75).
