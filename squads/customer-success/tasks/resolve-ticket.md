# Resolve Ticket

```yaml
task:
  id: resolve-ticket
  name: "Resolve Ticket"
  agent: suporte
  squad: customer-success
  type: support
```

## Proposito

Resolver tickets classificados como N1 (FAQ) utilizando a knowledge base documentada, garantindo que a solucao seja clara, rapida e documentada para futuras consultas.

## Input

- Ticket classificado como N1 (vindo do Ticket Triage)
- Knowledge base com solucoes documentadas
- Contexto do cliente e historico de tickets

## Output

- Ticket resolvido com solucao aplicada
- Solucao documentada no ticket para referencia futura
- Knowledge base atualizada se nova solucao foi encontrada
- Cliente notificado da resolucao

## Workflow

### Passo 1: Buscar solucao na knowledge base
Consultar a base de conhecimento para encontrar a solucao documentada.

### Passo 2: Aplicar solucao
Comunicar a solucao ao cliente com instrucoes claras e passo a passo.

### Passo 3: Confirmar resolucao
Validar com o cliente que o problema foi resolvido.

### Passo 4: Documentar solucao
Registrar a solucao aplicada no ticket e atualizar knowledge base se necessario.

### Passo 5: Fechar ticket
Encerrar o ticket com status "Resolvido" e satisfacao do cliente registrada.

## O que faz

- Resolve tickets N1 usando knowledge base validada
- Documenta a solucao no ticket
- Atualiza knowledge base com novas solucoes
- Confirma resolucao com o cliente

## O que NAO faz

- NAO inventa solucoes fora da knowledge base
- NAO resolve tickets N2/N3 (escala via Escalate Ticket)
- NAO promete que a solucao vai funcionar sem validar

## Ferramentas

- **Intercom/Zendesk** -- Comunicacao com cliente e resolucao
- **Notion KB** -- Consulta e atualizacao da knowledge base
- **Slack** -- Consulta rapida com time se necessario

## Quality Gate

- Threshold: >70%
- Ticket resolvido dentro do SLA para N1
- Solucao baseada na knowledge base (nao inventada)
- Cliente confirmou resolucao
- Solucao documentada no ticket
- CSAT do atendimento registrado

---
*Squad Customer Success Task*
