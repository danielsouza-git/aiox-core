# Upsell Detection

```yaml
task:
  id: upsell-detection
  name: "Upsell Detection"
  agent: cs-retencao
  squad: customer-success
  type: retention
```

## Proposito

Identificar oportunidades de expansao em clientes satisfeitos, mapear necessidades adicionais e passar leads quentes para o SDR em Vendas. O CS/Retencao detecta a oportunidade, mas NAO vende diretamente.

## Input

- Health scores verdes (clientes satisfeitos e engajados)
- Metricas de uso: features nao utilizadas, limites proximos de serem atingidos
- Feedback de clientes indicando necessidades adicionais
- Historico de interacoes e engajamento

## Output

- Oportunidades de upsell mapeadas com contexto
- Necessidades adicionais do cliente documentadas
- Leads quentes passados para SDR em Vendas (via cross-squad flow)
- Registro de oportunidades no CRM

## Workflow

### Passo 1: Analisar clientes verdes
Filtrar clientes com health score verde e alto engajamento.

### Passo 2: Identificar sinais de expansao
Procurar: uso proximo do limite do plano, features nao exploradas que resolveriam problemas, feedback pedindo mais.

### Passo 3: Mapear necessidades
Documentar necessidades adicionais identificadas e como o produto pode atender.

### Passo 4: Qualificar oportunidade
Avaliar se o cliente tem budget, autoridade e necessidade real (pre-qualificacao).

### Passo 5: Passar lead para SDR
Enviar lead quente para SDR em Vendas com contexto completo de uso e necessidade.

## O que faz

- Identifica oportunidades de expansao em clientes satisfeitos
- Mapeia necessidades adicionais do cliente
- Documenta contexto de uso e oportunidade
- Passa leads quentes para SDR em Vendas

## O que NAO faz

- NAO vende diretamente para o cliente
- NAO faz proposta ou negociacao (isso e de Vendas)
- NAO oferece descontos ou condicoes especiais
- NAO pressiona cliente para upgrade

## Ferramentas

- **CRM** -- Analise de contas e registro de oportunidades
- **Intercom/Zendesk** -- Historico de interacoes e feedback
- **Google Sheets** -- Consolidacao de oportunidades
- **Slack** -- Comunicacao com SDR para passagem de lead
- **ClickUp** -- Tracking de oportunidades identificadas

## Quality Gate

- Threshold: >70%
- Oportunidades identificadas com sinais claros de expansao
- Necessidades adicionais mapeadas e documentadas
- Lead passado para SDR com contexto completo (uso, necessidade, contato)
- Registro de oportunidade no CRM

---
*Squad Customer Success Task*
