# Piso de design

A página parada já tem que parecer confiável. Animação não salva estrutura ruim.

## Hierarquia
- Um foco por tela: headline → subheadline → CTA → microprova.
- CTA primário com a maior ênfase visual da tela; secundário sempre mais discreto.
- Preço legível: valor principal grande, parcelamento/recorrência logo abaixo, nunca em cinza claro minúsculo.

## Tipografia
- Duas famílias no máximo (display + texto). Escala definida (ex.: 15/18/24/32/48/72).
- Texto corrido ≥ 16 px no mobile, linha de 60–75 caracteres, altura de linha 1,5–1,7.
- Números comparáveis com `font-variant-numeric: tabular-nums`.

## Cor
- Papéis: fundo, superfície, texto, texto suave, **um** acento (CTA e destaques).
- Contraste mínimo 4,5:1 (texto) e 3:1 (componentes e texto grande).
- Evite degradê roxo/azul genérico, texto em degradê e neon.

## Espaço e estrutura
- Espaçamento em escala (8/16/24/40/64/104).
- Varie a ancoragem entre seções; página com toda seção "título centralizado +
  três cards" é template.
- Depoimentos com foto real (se houver), nome e contexto.
- Tabelas de planos viram cards empilhados no mobile, com o recomendado primeiro.

## Movimento
- Só quando ajuda a entender (ex.: demonstração). Anime `transform`/`opacity`.
- Respeite `prefers-reduced-motion`: tudo visível e legível sem animação.

## Conteúdo
- Texto real no HTML (nunca dentro de imagem).
- Links reais para checkout/agenda/WhatsApp.
- Ortografia impecável; voz do dono.
