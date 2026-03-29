# Churn Prevention

```yaml
task:
  id: churn-prevention
  name: "Churn Prevention"
  agent: cs-retencao
  squad: customer-success
  type: retention
```

## Proposito

Identificar clientes com risco de cancelamento, executar contato de recuperacao, apresentar oferta de retencao (com aprovacao do CS Head) e documentar motivos detalhados caso o cliente cancele. A prevencao de churn e a ultima linha de defesa antes da perda do cliente.

## Input

- Contas em risco (health score vermelho/amarelo vindo do Health Check)
- Sinais de churn: queda de uso, reclamacoes, NPS baixo, pedido de cancelamento
- Historico completo do cliente no CRM
- Playbook de retencao com ofertas aprovadas

## Output

- Contato de recuperacao realizado
- Oferta de retencao apresentada (se aprovada pelo CS Head)
- Cliente retido com plano de acao definido OU
- Motivos de churn documentados detalhadamente se cancelou
- Status atualizado no CRM

## Workflow

### Passo 1: Identificar risco de cancelamento
Analisar sinais de churn: queda de uso, tickets nao resolvidos, NPS muito baixo, contato pedindo cancelamento.

### Passo 2: Contato de recuperacao
Fazer contato direto com o cliente para entender a situacao e o que levou ao risco.

### Passo 3: Propor solucao
Com base no motivo, propor solucao: resolver problema tecnico, ajustar plano, retreinar uso.

### Passo 4: Oferta de retencao (se necessario)
Se o cliente insiste em cancelar, apresentar oferta de retencao previamente aprovada pelo CS Head.

### Passo 5: Documentar resultado
- Se retido: registrar plano de acao e follow-up agendado
- Se churnou: documentar motivos detalhados (preco, produto, atendimento, concorrencia, etc.)

## O que faz

- Identifica risco de cancelamento baseado em sinais claros
- Faz contato de recuperacao direto com o cliente
- Propoe solucao para o problema raiz
- Apresenta oferta de retencao COM APROVACAO do CS Head
- Documenta motivos detalhados de churn quando ocorre

## O que NAO faz

- NAO da descontos sem aprovacao do CS Head
- NAO resolve tickets de suporte (encaminha para Suporte)
- NAO faz promessas de features futuras sem validar com Produto
- NAO define ofertas de retencao (CS Head define e aprova)

## Ferramentas

- **CRM** -- Historico do cliente e registro de acoes
- **WhatsApp** -- Contato direto e rapido para recuperacao
- **Email** -- Comunicacao formal e follow-up
- **Zoom** -- Call de recuperacao quando necessario
- **Notion** -- Playbook de retencao e documentacao de motivos
- **ClickUp** -- Tracking de acoes de retencao e follow-ups
- **Google Sheets** -- Consolidacao de motivos de churn

## Quality Gate

- Threshold: >70%
- Risco identificado e acao iniciada em ate 48h
- Contato de recuperacao realizado com empatia e escuta ativa
- Oferta de retencao apresentada apenas com aprovacao do CS Head
- Motivos de churn documentados detalhadamente para cada cancelamento
- Status do cliente atualizado no CRM

---
*Squad Customer Success Task*
