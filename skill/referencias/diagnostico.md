# Diagnóstico

Legenda de evidência: **[E]** empírica · **[C]** consenso de mercado · **[O]** opinião/framework · **[T]** tendência.

## 1. Variáveis

| Variável | Valores | Efeito na página |
|---|---|---|
| Tipo | infoproduto, curso, mentoria, comunidade, saas, saas_b2b, ferramenta, assinatura, servico | Módulos típicos (ver `tipos-de-pagina.md`) |
| Ticket | baixo (< ~R$100), médio (~R$100–2k), alto (> ~R$2k) | CTA, extensão, nível de prova |
| Complexidade | baixa, alta | Demonstração, onboarding, FAQ técnico |
| Decisor | individual, comitê | Comitê → segurança, ROI, demo |
| Consciência | inconsciente, problema, solucao, produto, muito_consciente | Headline, ordem, extensão |
| Sofisticação | 1–5 | Mecanismo, identificação |
| Objetivo | compra, trial, freemium, demo, aplicacao, call, lista_espera, lead, whatsapp | CTA |

Faixas de ticket são heurísticas: calibre pelo nicho e renda do público.

## 2. Níveis de consciência (Schwartz) [O]

| Nível | O leitor… | Headline começa por | Ordem típica | Extensão | CTA forte |
|---|---|---|---|---|---|
| Inconsciente | não sabe do problema | história, identificação, Big Idea | história → revelação → mecanismo → prova → oferta | longa | tardio (isca costuma vencer venda direta) |
| Problema | sente a dor | a dor/desejo | dor → agitação → solução → mecanismo → prova → oferta | longa | após prova |
| Solução | conhece soluções, não a sua | resultado + diferencial | promessa → mecanismo → comparação → prova → oferta | média | hero + reforços |
| Produto | conhece você | produto + diferencial | prova → oferta → garantia → FAQ | curta–média | hero |
| Muito consciente | quer comprar | a oferta (preço, prazo) | oferta → CTA → FAQ | curta | imediato |

**Fonte de tráfego → consciência (hipótese inicial, valide):**
anúncio frio → inconsciente/problema · busca por problema → problema ·
busca por categoria → solução · marca/remarketing → produto ·
e-mail aquecido/carrinho aberto → muito consciente · afiliado → reforce o que o indicador prometeu.

Várias fontes com níveis diferentes → **variantes de hero ou landings separadas**.
Uma headline que sirva a todos os níveis é praticamente impossível (Copyhackers).

## 3. Sofisticação do mercado (Schwartz) [O]
1. Primeiro no mercado: promessa direta.
2. Concorrência copiou: amplifique a promessa.
3. Promessas saturadas: **mecanismo** novo.
4. Mecanismos copiados: mecanismo melhorado/expandido.
5. Mercado cético: **identificação** e história; prova mais crível.

Renda extra, emagrecimento e inglês no Brasil tendem a 4–5 (valide com pesquisa de concorrentes).

## 4. Árvore de decisão

```
1  PRODUTO      → tipo; entrega instantânea/recorrente/humana
2  PÚBLICO      → persona, JTBD, linguagem, decisor
3  CONSCIÊNCIA  → por fonte de tráfego; + sofisticação
4  OBJETIVO     → CTA
5  TICKET       → extensão, garantia, contato humano
6  COMPLEXIDADE → demonstração / onboarding
7  OBJEÇÕES     → top 3–5, cada uma com bloco + prova
8  PROVAS       → inventário real (fonte única de prova)
9  RESTRIÇÕES   → CDC, Decreto 7.962, LGPD, plataforma, anúncios
10 ESTRUTURA    → módulos mínimos ordenados pela jornada
```

## 5. Regras implementáveis
- `ticket=alto` e `tipo ∈ {mentoria, servico, saas_b2b}` → CTA aplicação/call/demo; `para_quem_nao` obrigatório.
- `consciencia ∈ {inconsciente, problema}` → `problema` + `agitacao` + `mecanismo`; extensão longa; CTA de compra só após prova.
- `consciencia ∈ {produto, muito_consciente}` → sem `agitacao`; hero com oferta; curta.
- `sofisticacao ≥ 3` → `mecanismo` obrigatório. `= 5` → hero de identificação.
- `tipo ∈ {saas, ferramenta}` → `demonstracao` obrigatória; preço visível (exceto enterprise → "a partir de"/"fale com vendas").
- `recorrencia ≠ nenhuma` → cancelamento explícito no FAQ e ao lado do preço.
- `provas.depoimentos = []` → sem módulo `depoimentos`; sugerir demo, garantia, aula grátis ou beta com coleta.
- `urgencia.real = false` → proibido timer, prazo e "vagas limitadas".
- nicho ∈ {renda, saúde, finanças} → `disclaimer` obrigatório; sem promessa de ganho; checar política de anúncios.
- `trafego = frio_pago` → *match* obrigatório entre anúncio e headline.
