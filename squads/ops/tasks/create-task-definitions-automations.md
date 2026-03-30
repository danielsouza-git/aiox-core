# Create Task Definitions Automations

```yaml
task:
  id: create-task-definitions-automations
  name: "Create Task Definitions Automations"
  agent: automation-architect
  squad: ops
  type: automation
```

## Proposito

Criar automacoes que bloqueiam erros, conectam etapas automaticamente, movem cards, disparam notificacoes e integram sistemas. Cada automacao deve ser testada antes de ser ativada e ter um fallback documentado para quando falhar.

## Input

- Definicoes de tasks documentadas (output do Create Task Definitions)
- Estrutura do ClickUp com fields e status configurados
- Regras de negocio sobre transicoes e bloqueios

## Output

- Automacoes configuradas e testadas (ClickUp Automations + N8N)
- Documentacao de cada automacao: trigger, acao, condicao, fallback
- Integracoes entre sistemas conectadas e funcionais

## Workflow

### Passo 1: Mapear automacoes necessarias
Para cada transicao entre etapas e cada condicao de bloqueio, identifique que automacao e necessaria.

### Passo 2: Criar automacoes de bloqueio de erro
Configure automacoes que impedem avancar sem preencher campos obrigatorios ou sem aprovacao necessaria.

### Passo 3: Criar automacoes de transicao
Configure triggers que criam tasks na proxima etapa quando a anterior e concluida.

### Passo 4: Configurar notificacoes
Configure alertas automaticos para SLA proximo de vencer, mudanca de status e novos itens na fila.

### Passo 5: Integrar sistemas externos
Configure webhooks e APIs para conectar ClickUp com outros sistemas (Tidy, ActiveCampaign, etc.).

### Passo 6: Testar antes de ativar
Execute cada automacao em ambiente de teste. Valide trigger, acao e fallback.

### Passo 7: Documentar e criar fallbacks
Para cada automacao, documente o caminho manual caso a automacao falhe.

## O que faz

- Cria automacoes que bloqueiam erros
- Configura triggers entre etapas (auto-move cards)
- Configura notificacoes automaticas
- Integra sistemas externos (Tidy+AC, webhooks, APIs)
- Testa cada automacao antes de ativar
- Documenta cada automacao com trigger, acao e fallback
- Cria fallback manual para cada automacao

## O que NAO faz

- NAO define regras de negocio (ja foram definidas)
- NAO altera a estrutura do ClickUp (ja foi criada)
- NAO executa as tasks do processo em producao

## Ferramentas

- **ClickUp Automations** -- Automacoes nativas
- **N8N (self-hosted)** -- Workflows de automacao complexos
- **Webhooks** -- Integracoes entre sistemas
- **APIs** -- Conectores para sistemas externos

## Quality Gate

- Threshold: >70%
- Automacoes de bloqueio de erro estao configuradas e funcionam
- Triggers entre etapas estao conectados e testados
- Notificacoes estao configuradas para SLA e status
- Integracoes externas estao conectadas e funcionais
- Cada automacao tem fallback manual documentado
- Tudo foi testado antes de ativar
- Se aprovado (>70%), output segue para Process Validator

---
*Squad OPS Task*
