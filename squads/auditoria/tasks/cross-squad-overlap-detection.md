# Cross-Squad Overlap Detection

```yaml
task:
  id: cross-squad-overlap-detection
  name: "Cross-Squad Overlap Detection"
  agent: coverage-analyst
  squad: auditoria
  type: analysis
```

## Proposito

Identificar onde multiplos squads cobrem a mesma funcao de negocio, classificando cada overlap como intencional (documentado e justificado, como CS/Retencao em Produto e CS) ou como duplicacao nao-intencional que precisa ser resolvida.

## Input

- Todas as definicoes de squads (config.yaml + agents/ + tasks/)
- Decisoes de design conhecidas (overlaps intencionais documentados no PRD)
- Matriz de cobertura gerada pela task task-coverage-analysis

## Output

- Relatorio de overlap: funcoes cobertas por mais de um squad, com classificacao (intencional/nao-intencional) e recomendacao (manter, merge, eliminar)

## Workflow

### Passo 1: Cruzar capacidades
A partir da matriz de cobertura, identificar todas as funcoes que aparecem em mais de um squad.

### Passo 2: Consultar decisoes de design
Verificar se cada overlap encontrado esta documentado como intencional (ex: CS/Retencao em Produto foca em qualidade de produto, CS/Retencao em CS foca em retencao de cliente).

### Passo 3: Classificar overlaps
Para cada overlap, classificar como: intencional (documentado, escopos distintos) ou nao-intencional (mesma funcao, mesma perspectiva, duplicacao real).

### Passo 4: Recomendar acao
Para cada overlap, recomendar: manter ambos (escopos claramente distintos), fazer merge (unificar em um unico squad), ou eliminar (remover o duplicado menos adequado).

### Passo 5: Gerar relatorio
Produzir relatorio com tabela de overlaps, classificacao e recomendacoes.

## O que faz

- Detecta funcoes cobertas por multiplos squads
- Classifica overlaps como intencionais ou nao-intencionais
- Verifica se overlaps intencionais tem escopos realmente distintos
- Recomenda acao para cada overlap (manter, merge, eliminar)
- Sinaliza duplicacoes nao-intencionais com severidade alta

## O que NAO faz

- NAO decide unilateralmente se um overlap deve ser removido -- recomenda
- NAO modifica estrutura de nenhum squad
- NAO cria novos squads ou tasks para resolver overlaps
- NAO avalia completude (isso e do squad-auditor)

## Ferramentas

- **Sheets** -- Tabelas de overlap e cruzamento
- **Markdown** -- Leitura de definicoes
- **Notion** -- Documentacao do relatorio

## Quality Gate

- Threshold: >70%
- Todos os overlaps identificados e classificados
- Overlaps intencionais validados contra decisoes de design
- Cada overlap tem recomendacao de acao
- Nenhum overlap nao-intencional sem sinalizacao

---
*Squad Auditoria Task*
