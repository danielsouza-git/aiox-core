# Contas a Receber

```yaml
task:
  id: contas-a-receber
  name: "Contas a Receber"
  agent: financeiro
  squad: administracao
  type: financial
```

## Proposito

Gerenciar o faturamento e acompanhar recebimentos, garantindo que todos os clientes paguem em dia. Identificar inadimplencia precocemente e acionar cobranca de forma sistematica.

## Input

- Contratos ativos com valores e datas de faturamento
- Dados de clientes para emissao de faturas
- Status de pagamentos recebidos
- Politica de cobranca definida pelo Admin Head

## Output

- Faturas emitidas e enviadas no prazo
- Status de inadimplencia atualizado com classificacao por tempo de atraso
- Acoes de cobranca acionadas conforme politica
- Relatorio de recebimentos do periodo

## Workflow

### Passo 1: Emitir faturas
Emita faturas conforme calendario de faturamento de cada contrato. Envie ao cliente com antecedencia.

### Passo 2: Acompanhar recebimentos
Monitore pagamentos recebidos e sinalize os nao-recebidos apos vencimento.

### Passo 3: Acionar cobranca
Para inadimplentes, acione cobranca conforme politica: lembrete amigavel, cobranca formal, escalacao ao Head.

### Passo 4: Reportar
Gere relatorio de recebimentos com metricas de inadimplencia e aging (tempo de atraso).

## O que faz

- Emite faturas conforme contratos ativos
- Acompanha status de pagamentos recebidos
- Identifica inadimplencia e classifica por tempo de atraso
- Aciona cobranca conforme politica definida
- Gera relatorio de recebimentos e inadimplencia

## O que NAO faz

- NAO negocia divida com cliente (Head aprova, Juridico orienta)
- NAO concede desconto ou parcelamento sem aprovacao do Head
- NAO cancela contratos por inadimplencia (Head decide)

## Ferramentas

- **Conta Azul** -- Emissao de faturas e acompanhamento
- **Stripe** -- Processamento de pagamentos online
- **Google Sheets** -- Controle de inadimplencia e aging

## Quality Gate

- Threshold: >70%
- Faturas emitidas no prazo correto
- Inadimplentes identificados em ate 48h apos vencimento
- Cobranca acionada conforme politica sem atrasos
- Relatorio de recebimentos entregue semanalmente

---
*Squad Administracao Task*
