# Biblioteca de módulos

Cada módulo tem um **contrato**: crença que instala, objeção que remove, etapa da
jornada (1–9, ver `objecoes.md`), insumos obrigatórios e quando omitir.
Módulo sem insumo real **não entra**.

| id | Crença / objetivo | Etapa | Insumos obrigatórios | Omitir quando | Posição típica |
|---|---|---|---|---|---|
| hero | O que é, para quem, resultado, próxima ação | 1 | promessa, CTA | nunca | topo |
| vsl | Argumento em vídeo | 1–3 | vídeo real + resumo em texto + legendas | sem vídeo; ticket baixo | hero ou logo abaixo |
| problema | Nomeia o problema na língua do cliente | 2 | VOC ou descrição do problema | consciência produto/muito_consciente | após hero |
| agitacao | Custo de não agir | 2 | dor real | consciência ≥ produto; dor fraca | após problema |
| promessa | Resultado desejado / Big Idea | 3 | resultado realista | — | após dor ou no hero |
| mecanismo | Por que funciona diferente | 3 | diferencial real | sofisticação ≤ 2 e consciência alta | após promessa |
| beneficios | O que muda | 3 | benefícios | — | após mecanismo |
| features | O que tem/faz | 5 | lista de features/módulos | — | após benefícios / na oferta |
| demonstracao | Produto em uso | 3,5 | print/GIF/vídeo/aula amostra reais | sem material | hero (SaaS) ou meio |
| como_funciona | 3–5 passos da entrega | 5 | processo real | entrega trivial | meio |
| integracoes | Encaixa no que uso | 5 | lista real | não se aplica | meio (SaaS) |
| seguranca | Dados seguros | 4 | certificações/políticas reais | B2C simples | meio (B2B) |
| comunidade_por_dentro | Rituais, frequência, quem participa | 3,5 | dados reais | não é comunidade | meio |
| para_quem | É para mim | 2 | perfis | público óbvio | meio |
| para_quem_nao | Não é bom demais para ser verdade | 7 | perfis excluídos | ticket baixo e público amplo | meio |
| prova_social | Outros escolheram | 4 | números/logos/avaliações reais | sem dados | perto do hero e CTAs |
| depoimentos | Gente como eu conseguiu | 4 | ≥2 depoimentos reais com consentimento | sem depoimentos | perto das objeções |
| cases | Antes → intervenção → depois | 3,4 | case real com métrica | sem case | meio |
| resultados | Números de resultado | 3 | dados reais + nota de tipicidade | sem dados | meio |
| autoridade | Quem está por trás | 4 | credenciais verificáveis | marca forte e consciência alta | antes da oferta |
| oferta | Tudo que está incluído | 5 | entregáveis | objetivo ≠ compra | antes do preço |
| ancoragem | Referência de valor | 6 | preço real anterior ou custo da alternativa | sem base real | antes do preço |
| bonus | Extras que derrubam objeções | 5 | bônus ligados a objeções | sem bônus | após oferta |
| pricing | Quanto custa | 6 | preço, parcelas, recorrência | objetivo = aplicação sem faixa | após oferta (longa) / cedo (curta) |
| comparacao_planos | Qual plano escolher | 6 | ≥2 planos | plano único | pricing |
| garantia | Risco baixo | 8 | prazo e condições | — (≥7 dias no BR) | junto ao preço e no FAQ |
| escassez | Limite real | 9 | motivo real | `real=false` | perto do CTA |
| urgencia | Prazo real | 9 | deadline real | `real=false` | perto do CTA |
| aplicacao | Qualificação | 9 | formulário/agenda | compra direta | fim |
| faq | Objeções residuais e operação | 7 | perguntas reais/esperadas | — | antes do CTA final |
| cta_final | Promessa + oferta + garantia + botão | 9 | CTA | — | fim |
| disclaimer | Resultados não típicos, riscos | 8 | texto | nicho fora de renda/saúde/finanças e sem resultados | rodapé e perto de resultados |
| footer_legal | Quem vende, como contatar | 8 | razão social, CNPJ/CPF, endereço, contato, termos, privacidade | nunca (BR) | rodapé |

## Combinações naturais
problema+agitacao (páginas curtas) · mecanismo+como_funciona ·
oferta+bonus+ancoragem+pricing+garantia ("bloco de oferta") · microprova ao lado
de cada CTA · autoridade+história de origem.

## Redundâncias a evitar
benefícios e features dizendo o mesmo · depoimentos genéricos ("amei!") em série
· várias seções "para quem é" · FAQ que repete a página · escassez + urgência
juntas sem base real.

## CTAs
- Um **objetivo**, um CTA **primário** (pode repetir em várias posições).
- Texto = verbo + resultado ("Começar teste grátis de 14 dias").
- Microcopy de expectativa ao lado ("Sem cartão", "Acesso imediato por e-mail").
- Posições: hero, pós-oferta, final; `sticky_mobile` opcional.
- CTA secundário pode existir com hierarquia visual menor ("Ver como funciona").
