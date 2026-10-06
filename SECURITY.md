# Segurança

## Versões suportadas
Apenas a versão mais recente publicada no npm recebe correções.

## Como reportar
**Não abra issue pública.** Use o reporte privado:
https://github.com/emersonSantos98/skill-pagina-de-vendas/security/advisories/new

Inclua a versão, os passos para reproduzir e o impacto. Resposta inicial em até 5 dias úteis.

## Escopo
- CLI de instalação (`bin/cli.mjs`): escrita fora do destino, sobrescrita indevida.
- Scripts (`skill/scripts/*`): path traversal no `servir.mjs`, execução indevida.
- Workflows do GitHub Actions e cadeia de publicação no npm.
