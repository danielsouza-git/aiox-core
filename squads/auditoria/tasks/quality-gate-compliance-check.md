# Quality Gate Compliance Check

```yaml
task:
  id: quality-gate-compliance-check
  name: "Quality Gate Compliance Check"
  agent: squad-auditor
  squad: auditoria
  type: validation
```

## Proposito

Verificar que os quality gates definidos nas tasks de cada squad estao configurados corretamente, com thresholds definidos, fluxo sequencial coerente e sem gaps na cadeia de progressao.

## Input

- Caminho do diretorio do squad (ex: squads/ops/)
- config.yaml do squad (secao quality_gates se existir)
- Todos os arquivos de tasks do squad (secao Quality Gate de cada task)

## Output

- Relatorio de conformidade de quality gates: gates definidos por task, thresholds configurados, fluxo sequencial correto, gaps identificados na cadeia

## Workflow

### Passo 1: Verificar quality gates no config
Ler config.yaml e identificar se existe secao quality_gates com fluxo definido (stages, thresholds, on_fail).

### Passo 2: Verificar quality gates nas tasks
Ler cada arquivo de task e verificar presenca e conteudo da secao Quality Gate (threshold, criterios de aprovacao).

### Passo 3: Validar consistencia
Cruzar quality gates do config com gates das tasks -- garantir que nao ha tasks no fluxo sem gate, e que thresholds sao consistentes.

### Passo 4: Verificar cadeia sequencial
Se o squad tem fluxo sequencial (como OPS), verificar que cada stage aponta para o proximo correto e que nao ha gaps ou stages orfas.

### Passo 5: Gerar relatorio
Consolidar findings com severidade (critico: task sem gate em fluxo obrigatorio, alto: threshold inconsistente, medio: secao incompleta).

## O que faz

- Verifica que quality gates estao definidos em todas as tasks relevantes
- Valida que thresholds estao configurados (padrao: >70%)
- Verifica que fluxo sequencial de gates nao tem gaps
- Detecta tasks sem quality gate que bloqueiam progressao
- Identifica inconsistencias entre config e definicoes de tasks

## O que NAO faz

- NAO avalia se os thresholds sao adequados para o negocio
- NAO executa quality gates (apenas verifica que estao definidos)
- NAO corrige quality gates faltando
- NAO modifica nenhum arquivo

## Ferramentas

- **Markdown** -- Leitura de definicoes
- **Sheets** -- Tabela de compliance

## Quality Gate

- Threshold: >70%
- Todos os squads auditados para quality gates
- Fluxos sequenciais validados sem gaps
- Tasks sem gate sinalizadas com severidade
- Relatorio entregue com findings classificados

---
*Squad Auditoria Task*
