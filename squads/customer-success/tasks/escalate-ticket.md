# Escalate Ticket

```yaml
task:
  id: escalate-ticket
  name: "Escalate Ticket"
  agent: suporte
  squad: customer-success
  type: support
```

## Proposito

Escalar tickets N2 (tecnico) e N3 (critico) para o especialista correto, garantindo que todo o contexto necessario seja documentado e que o ticket seja acompanhado ate a resolucao final.

## Input

- Ticket classificado como N2 ou N3 (vindo do Ticket Triage)
- Contexto completo: problema descrito, tentativas feitas, impacto no cliente
- Historico de tickets do cliente

## Output

- Ticket escalado para especialista com contexto completo
- Cliente notificado sobre a escalacao e expectativa de prazo
- Acompanhamento ativo ate resolucao final
- Ticket resolvido ou re-escalado se necessario

## Workflow

### Passo 1: Compilar contexto
Reunir toda informacao relevante: descricao do problema, prints, logs, tentativas de resolucao, impacto no cliente.

### Passo 2: Identificar especialista
Definir quem e o especialista correto para o tipo de problema (tecnico, produto, infra).

### Passo 3: Escalar com documento
Enviar ticket ao especialista com documento de contexto completo.

### Passo 4: Notificar cliente
Informar o cliente que o ticket foi escalado, quem esta cuidando e prazo estimado.

### Passo 5: Acompanhar ate resolucao
Fazer follow-up periodico ate que o ticket seja resolvido. Notificar cliente da resolucao.

## O que faz

- Documenta contexto completo para o especialista
- Escala tickets N2/N3 para o responsavel correto
- Notifica o cliente sobre escalacao e expectativa
- Acompanha ate resolucao final

## O que NAO faz

- NAO tenta resolver tickets N2/N3 sozinho
- NAO promete prazos sem confirmar com o especialista
- NAO fecha o ticket sem confirmacao do cliente

## Ferramentas

- **Intercom/Zendesk** -- Gestao de escalacao e follow-up
- **Slack** -- Comunicacao rapida com especialistas
- **ClickUp** -- Tracking de tickets escalados e SLAs
- **Notion** -- Documento de contexto para escalacao

## Quality Gate

- Threshold: >70%
- Contexto completo documentado na escalacao
- Especialista correto identificado e ticket atribuido
- Cliente notificado sobre escalacao e prazo estimado
- Follow-up realizado ate resolucao
- Tempo de escalacao dentro do SLA

---
*Squad Customer Success Task*
