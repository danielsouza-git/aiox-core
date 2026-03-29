# Support Report

```yaml
task:
  id: support-report
  name: "Support Report"
  agent: suporte
  squad: customer-success
  type: support
```

## Proposito

Gerar report semanal com metricas de suporte -- volume de tickets, SLA, satisfacao -- e identificar problemas recorrentes que devem ser reportados para Produto corrigir. O report alimenta decisoes do CS Head e do squad Produto.

## Input

- Dados de tickets da semana (abertos, resolvidos, escalados, pendentes)
- Metricas de SLA e CSAT por periodo
- Historico de tickets para analise de recorrencia

## Output

- Report semanal com metricas consolidadas
- Lista de problemas recorrentes com frequencia e impacto
- Problemas recorrentes reportados para Produto (via cross-squad flow)
- Recomendacoes de melhoria para knowledge base

## Workflow

### Passo 1: Coletar dados da semana
Extrair metricas de tickets: volume total, por nivel, resolvidos, pendentes, escalados.

### Passo 2: Calcular metricas de SLA
Medir tempo medio de primeira resposta, tempo de resolucao e taxa de cumprimento de SLA.

### Passo 3: Medir satisfacao
Consolidar CSAT, NPS de atendimento e feedback qualitativo dos clientes.

### Passo 4: Identificar problemas recorrentes
Analisar tickets para encontrar padroes -- mesmo problema reportado por multiplos clientes.

### Passo 5: Montar e entregar report
Consolidar tudo em report visual com metricas, tendencias e recomendacoes.

### Passo 6: Reportar para Produto
Enviar lista de problemas recorrentes para squad Produto via Feedback Loop.

## O que faz

- Gera metricas semanais de suporte (volume, SLA, CSAT)
- Identifica problemas recorrentes com frequencia e impacto
- Reporta problemas para Produto corrigir
- Recomenda melhorias na knowledge base

## O que NAO faz

- NAO resolve os problemas recorrentes (reporta para Produto)
- NAO define metas de SLA (CS Head define)
- NAO cria automacoes para report (pede ao OPS)

## Ferramentas

- **Intercom/Zendesk** -- Extracao de metricas de tickets
- **Google Sheets** -- Consolidacao e analise de dados
- **Notion** -- Template de report semanal
- **Slack** -- Distribuicao do report para CS Head e Produto
- **ClickUp** -- Registro de acoes derivadas do report

## Quality Gate

- Threshold: >70%
- Report entregue semanalmente no prazo
- Metricas corretas e consistentes (volume, SLA, CSAT)
- Problemas recorrentes identificados com frequencia e impacto
- Report enviado para CS Head e Produto
- Recomendacoes de melhoria documentadas

---
*Squad Customer Success Task*
