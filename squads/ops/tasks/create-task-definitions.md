# Create Task Definitions

```yaml
task:
  id: create-task-definitions
  name: "Create Task Definitions"
  agent: automation-architect
  squad: ops
  type: automation
```

## Proposito

Criar uma definicao detalhada para cada task do processo, incluindo inputs, outputs, criterios de aceitacao, dependencias, condicoes de bloqueio e exemplos concretos de "done". Cada definicao deve ser clara o suficiente para que qualquer pessoa consiga executar a task sem ambiguidade.

## Input

- Estrutura de folders/lists/fields/status (output do Design Architecture)
- Matriz de responsabilidades com SLAs (output do Design Executors)
- Regras de negocio e condicoes de bloqueio do processo

## Output

- Definicoes documentadas para cada task do processo
- Cada definicao contendo: input, output, criterios de aceitacao, dependencias, condicoes de bloqueio, exemplos de "done"

## Workflow

### Passo 1: Listar todas as tasks do processo
Identifique cada task que precisa de definicao a partir da estrutura arquitetada.

### Passo 2: Definir input e output de cada task
Para cada task, documente exatamente o que entra e o que sai.

### Passo 3: Definir criterios de aceitacao
O que precisa ser verdade para a task ser considerada "done"? Liste criterios objetivos e verificaveis.

### Passo 4: Definir dependencias e bloqueios
O que precisa estar pronto antes desta task comecar? O que impede esta task de avancar?

### Passo 5: Criar exemplos de "done"
Para cada task, escreva um exemplo concreto de como ela se parece quando completa.

## O que faz

- Cria definicao para cada task do processo
- Define inputs e outputs claros
- Estabelece criterios de aceitacao objetivos
- Mapeia dependencias entre tasks
- Documenta condicoes de bloqueio
- Cria exemplos concretos de "done"

## O que NAO faz

- NAO cria automacoes (isso e da task Create Task Definitions Automations)
- NAO altera a estrutura do ClickUp
- NAO executa as tasks em producao

## Ferramentas

- **ClickUp** -- Criacao de task definitions e templates
- **Notion** -- Documentacao detalhada de definicoes
- **Markdown** -- Formato padrao para documentacao tecnica

## Quality Gate

- Threshold: >70%
- Cada task tem definicao completa (input, output, criterios, dependencias, bloqueios, exemplo)
- Criterios de aceitacao sao objetivos e verificaveis
- Dependencias estao mapeadas corretamente
- Exemplos de "done" sao concretos e uteis

---
*Squad OPS Task*
