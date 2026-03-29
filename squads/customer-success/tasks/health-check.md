# Health Check

```yaml
task:
  id: health-check
  name: "Health Check"
  agent: cs-retencao
  squad: customer-success
  type: retention
```

## Proposito

Monitorar a saude de cada conta de cliente ativo, identificar sinais de risco precoces e manter um scoring de engajamento atualizado. O health check e a base para todas as acoes proativas de retencao e prevencao de churn.

## Input

- Metricas de uso do produto por conta (logins, features usadas, frequencia)
- Historico de tickets e NPS por cliente
- Dados do CRM (renovacao, plano, valor)
- Feedback coletado em interacoes

## Output

- Health score atualizado por conta (verde, amarelo, vermelho)
- Lista de contas em risco com sinais identificados
- Acoes recomendadas para contas amarelas e vermelhas
- Dashboard de saude da base atualizado

## Workflow

### Passo 1: Coletar metricas de uso
Extrair dados de uso do produto: frequencia de login, features usadas, tickets abertos.

### Passo 2: Calcular health score
Aplicar modelo de scoring combinando: uso do produto, satisfacao (NPS/CSAT), tickets, tempo desde ultimo contato.

### Passo 3: Classificar contas
- **Verde:** Saudavel, engajado, sem sinais de risco
- **Amarelo:** Atencao, queda de uso ou sinais fracos de risco
- **Vermelho:** Risco alto, necessita acao imediata

### Passo 4: Definir acoes
Para cada conta amarela/vermelha, definir acao recomendada (contato proativo, engagement, reuniao, oferta).

### Passo 5: Atualizar dashboard
Registrar health scores atualizados e compartilhar com CS Head.

## O que faz

- Monitora saude de contas via metricas de uso e satisfacao
- Calcula health score combinando multiplos indicadores
- Identifica sinais de risco precoces
- Define acoes recomendadas para contas em risco

## O que NAO faz

- NAO executa as acoes de retencao (isso e do Engagement e Churn Prevention)
- NAO resolve tickets de suporte
- NAO define o modelo de scoring (CS Head define)

## Ferramentas

- **CRM** -- Dados de contas e historico
- **Intercom/Zendesk** -- Metricas de tickets e satisfacao
- **Google Sheets** -- Modelo de scoring e consolidacao
- **ClickUp** -- Registro de acoes recomendadas
- **Notion** -- Documentacao do modelo de health score

## Quality Gate

- Threshold: >70%
- Health scores atualizados mensalmente para todas as contas
- Contas em risco identificadas com sinais claros
- Acoes recomendadas definidas para contas amarelas/vermelhas
- Dashboard atualizado e compartilhado com CS Head

---
*Squad Customer Success Task*
