# Design Executors

```yaml
task:
  id: design-executors
  name: "Design Executors"
  agent: process-architect
  squad: ops
  type: design
```

## Proposito

Criar a matriz de responsabilidades que define quem executa cada etapa do processo, com responsabilidades claras, handoffs entre executores, SLAs por etapa e caminhos de escalacao. Garantir que ninguem tem funcao dupla e que cada etapa tem exatamente um responsavel.

## Input

- Estrutura de folders/lists/fields/status (output do Design Architecture)
- Documentacao de etapas e donos do novo processo
- Regras de negocio sobre aprovacoes e escalacoes

## Output

- Matriz de responsabilidades (quem faz o que)
- SLAs por etapa (tempo maximo aceitavel)
- Handoffs entre executores com criterios de transicao
- Caminhos de escalacao quando SLA e violado

## Workflow

### Passo 1: Mapear executores por etapa
Para cada etapa do processo, defina quem e o responsavel principal e quem e backup.

### Passo 2: Definir responsabilidades claras
Documente exatamente o que cada executor faz e o que NAO faz -- sem ambiguidade.

### Passo 3: Definir handoffs
Documente como uma etapa passa para a proxima: que criterios devem ser atendidos, que informacao deve ser passada.

### Passo 4: Definir SLAs
Para cada etapa, defina o tempo maximo aceitavel para execucao. Considere urgencia e complexidade.

### Passo 5: Definir escalacao
Documente o que acontece quando um SLA e violado: para quem escala, em quanto tempo, com que informacao.

### Passo 6: Validar ausencia de funcao dupla
Revise a matriz garantindo que nenhum executor acumula funcoes conflitantes.

## O que faz

- Define quem executa cada etapa
- Documenta responsabilidades claras por executor
- Define handoffs entre executores
- Estabelece SLAs por etapa
- Cria caminhos de escalacao
- Garante que ninguem tem funcao dupla

## O que NAO faz

- NAO define a estrutura no ClickUp (ja foi feito no Design Architecture)
- NAO cria automacoes
- NAO decide quem deve ser contratado

## Ferramentas

- **Google Sheets** -- Matriz de responsabilidades e SLAs
- **Notion** -- Documentacao de handoffs e escalacoes
- **ClickUp** -- Atribuicao de responsaveis na estrutura

## Quality Gate

- Threshold: >70%
- Cada etapa tem executor definido
- Responsabilidades sao claras e nao duplicadas
- Handoffs tem criterios de transicao documentados
- SLAs estao definidos para cada etapa
- Caminhos de escalacao existem
- Nenhum executor tem funcao dupla
- Se aprovado (>70%), output segue para Automation Architect

---
*Squad OPS Task*
