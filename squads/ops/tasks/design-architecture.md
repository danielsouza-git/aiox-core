# Design Architecture

```yaml
task:
  id: design-architecture
  name: "Design Architecture"
  agent: process-architect
  squad: ops
  type: design
```

## Proposito

Traduzir o fluxograma do novo processo em uma estrutura concreta no ClickUp: hierarquia de folders e lists, custom fields, fluxos de status, templates de task e views por executor. O resultado e uma estrutura pronta para ser implementada no ClickUp.

## Input

- Fluxograma do novo processo (output do Create Process)
- Documentacao de etapas, donos e handoffs
- Condicoes de veto e regras de negocio

## Output

- Estrutura de folders/lists definida
- Custom fields para cada tipo de task
- Fluxos de status para cada lista
- Templates de task prontos para uso
- Views configuradas por executor

## Workflow

### Passo 1: Definir hierarquia de folders e lists
Mapeie cada fase do processo para um folder ou list no ClickUp, respeitando a logica do fluxo.

### Passo 2: Criar custom fields
Defina os campos que capturam dados necessarios em cada etapa (responsavel, prazo, prioridade, campos especificos do processo).

### Passo 3: Definir fluxos de status
Crie os status que refletem as transicoes do processo (To Do, In Progress, Review, Done, Blocked, etc.).

### Passo 4: Criar templates de task
Para cada tipo de etapa, crie um template com campos pre-preenchidos e instrucoes.

### Passo 5: Configurar views por executor
Cada executor deve ver apenas as tasks relevantes para si, filtradas e ordenadas de forma util.

## O que faz

- Define estrutura de folders/lists no ClickUp
- Cria custom fields para capturar dados necessarios
- Define fluxos de status que refletem transicoes do processo
- Cria templates de task para cada tipo de etapa
- Configura views por executor

## O que NAO faz

- NAO mapeia processos (ja foi feito pelo Process Mapper)
- NAO cria automacoes (isso e do Automation Architect)
- NAO define regras de negocio -- traduz regras ja definidas

## Ferramentas

- **ClickUp** -- Criacao da estrutura
- **Notion** -- Documentacao das decisoes arquiteturais
- **Google Sheets** -- Mapeamento de fields e status

## Quality Gate

- Threshold: >70%
- Estrutura de folders/lists reflete o processo desenhado
- Custom fields capturam todos os dados necessarios
- Status flows cobrem todas as transicoes possiveis
- Templates existem para cada tipo de task
- Views por executor estao configuradas e funcionais

---
*Squad OPS Task*
