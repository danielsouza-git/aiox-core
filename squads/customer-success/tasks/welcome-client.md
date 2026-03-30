# Welcome Client

```yaml
task:
  id: welcome-client
  name: "Welcome Client"
  agent: onboarding-specialist
  squad: customer-success
  type: onboarding
```

## Proposito

Dar as boas-vindas ao novo cliente de forma personalizada, apresentar os proximos passos do onboarding e alinhar expectativas sobre prazos, entregas e canais de comunicacao. Esse e o primeiro contato pos-venda e define o tom do relacionamento.

## Input

- Dados do novo cliente vindos de Vendas (Close Deal)
- Informacoes do contrato: nome, plano, expectativas, necessidades mapeadas pelo Closer
- Template de boas-vindas do playbook de onboarding

## Output

- Mensagem de boas-vindas personalizada enviada ao cliente
- Proximos passos apresentados e confirmados
- Expectativas alinhadas (prazos, entregas, canais)
- Registro no CRM com status "Onboarding - Welcome"

## Workflow

### Passo 1: Receber contexto de Vendas
Ler dados do Close Deal -- nome, plano, necessidades, promessas feitas pelo Closer.

### Passo 2: Personalizar boas-vindas
Adaptar template de welcome com nome, plano e referencias ao que foi discutido na venda.

### Passo 3: Enviar boas-vindas
Enviar via canal preferido do cliente (email + WhatsApp) em ate 24h apos contrato.

### Passo 4: Apresentar proximos passos
Listar etapas do onboarding com prazos estimados e o que esperar em cada uma.

### Passo 5: Alinhar expectativas
Confirmar canais de comunicacao, horarios de disponibilidade e ponto de contato.

## O que faz

- Envia boas-vindas personalizadas em ate 24h
- Apresenta proximos passos claros do onboarding
- Alinha expectativas de prazo e entrega
- Registra status no CRM

## O que NAO faz

- NAO configura a conta do cliente (isso e do Setup Account)
- NAO resolve duvidas tecnicas
- NAO faz demonstracao do produto

## Ferramentas

- **Email** -- Envio de boas-vindas formal
- **WhatsApp** -- Contato rapido e confirmacao
- **CRM** -- Registro de status e atividades
- **Notion** -- Template de boas-vindas

## Quality Gate

- Threshold: >70%
- Boas-vindas enviadas em ate 24h apos contrato
- Proximos passos apresentados e confirmados pelo cliente
- Expectativas alinhadas e documentadas
- Status atualizado no CRM

---
*Squad Customer Success Task*
