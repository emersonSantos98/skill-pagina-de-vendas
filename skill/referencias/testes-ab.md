# Testes A/B

1. **Hipótese:** "Como [observação/dado], mudar [X] para [Y] vai aumentar [métrica] porque [razão]."
2. **Métrica primária** única (ex.: compras/visitantes) + métricas de proteção (reembolso, ticket).
3. **Efeito mínimo detectável (MDE)** e **amostra calculada antes** (α = 5%, poder = 80%).
4. Duração mínima de 1–2 ciclos semanais completos.
5. **Não pare quando "ficou significativo"** — espiar invalida a significância
   (Evan Miller). Use amostra fixa ou método sequencial próprio para espiadas.
6. Com tráfego baixo (< ~1.000 conversões/mês), prefira testes de mudança grande
   (proposta de valor, oferta) a microtestes (cor de botão), ou pesquisa qualitativa.

## Fórmula aproximada de amostra por variante (proporções)
n ≈ 16 · p(1−p) / Δ²   (α=5%, poder≈80%; p = taxa base, Δ = diferença absoluta)
Ex.: p = 2%, Δ = 0,5 p.p. → n ≈ 16·0,02·0,98/0,000025 ≈ 12.544 visitantes por variante.

## Ideias de teste que costumam valer (por impacto esperado)
proposta de valor/headline · oferta (bônus, garantia, parcelamento) · ordem de
provas · extensão da página · CTA (texto/intenção) · pricing (plano recomendado, anual).
