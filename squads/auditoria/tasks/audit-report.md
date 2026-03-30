# Audit Report

```yaml
task:
  id: audit-report
  name: "Audit Report"
  agent: alignment-checker
  squad: auditoria
  type: reporting
```

## Proposito

Consolidar todos os outputs de auditoria (completude, cobertura, overlap, delegacao e quality gates) em um relatorio executivo unico com classificacao de severidade e acoes recomendadas. Este e o output final do squad Auditoria.

## Input

- Relatorio de completude (do squad-auditor via squad-completeness-audit)
- Relatorio de conformidade de quality gates (do squad-auditor via quality-gate-compliance-check)
- Matriz de cobertura e relatorio de gaps (do coverage-analyst via task-coverage-analysis)
- Relatorio de overlap (do coverage-analyst via cross-squad-overlap-detection)
- Relatorio de delegacao (do alignment-checker via agent-delegation-validation)

## Output

- Relatorio consolidado de auditoria contendo: sumario executivo, score geral de saude, findings por dimensao com severidade, acoes recomendadas priorizadas, squads com maior risco

## Workflow

### Passo 1: Coletar todos os inputs
Reunir relatorios das 5 tasks de auditoria: completude, quality gates, cobertura, overlap, delegacao.

### Passo 2: Unificar findings
Consolidar todos os findings em lista unica, removendo duplicatas e cruzando informacoes complementares.

### Passo 3: Classificar por severidade
Classificar cada finding: critico (bloqueante, risco imediato), alto (requer acao em curto prazo), medio (melhorar quando possivel), baixo (nice to have).

### Passo 4: Calcular score geral
Gerar score de saude geral da estrutura de squads baseado em: % de squads completos, % de quality gates conformes, numero de gaps criticos, numero de delegacoes quebradas.

### Passo 5: Priorizar acoes
Ordenar acoes recomendadas por impacto x esforco, priorizando findings criticos e de alta severidade.

### Passo 6: Gerar relatorio executivo
Produzir relatorio final com: sumario (1 paragrafo), score, tabela de findings, acoes priorizadas, squads com maior risco.

## O que faz

- Consolida todas as dimensoes de auditoria em relatorio unico
- Classifica findings por severidade (critico, alto, medio, baixo)
- Calcula score geral de saude da estrutura de squads
- Prioriza acoes recomendadas por impacto
- Identifica squads com maior risco ou mais problemas
- Gera sumario executivo para Builders/CEO

## O que NAO faz

- NAO executa auditorias individuais (recebe outputs prontos)
- NAO implementa correcoes
- NAO modifica arquivos de squads
- NAO substitui os relatorios individuais -- complementa com visao consolidada

## Ferramentas

- **Markdown** -- Geracao do relatorio consolidado
- **Sheets** -- Tabelas de findings e scoring
- **Notion** -- Publicacao do relatorio final

## Quality Gate

- Threshold: >70%
- Todas as 5 dimensoes cobertas (completude, quality gates, cobertura, overlap, delegacao)
- Cada finding tem severidade e acao recomendada
- Score geral calculado e justificado
- Sumario executivo presente e compreensivel
- Relatorio revisado pelo Auditoria Head antes de entrega

---
*Squad Auditoria Task*
