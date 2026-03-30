# Ticket Triage

```yaml
task:
  id: ticket-triage
  name: "Ticket Triage"
  agent: suporte
  squad: customer-success
  type: support
```

## Proposito

Classificar cada ticket recebido por nivel (N1/N2/N3), priorizar por urgencia e impacto, e rotear para o responsavel correto. A triage correta garante que tickets simples sejam resolvidos rapidamente e tickets complexos cheguem ao especialista certo sem demora.

## Input

- Ticket recebido via Intercom, Zendesk ou Freshdesk
- Contexto do cliente: plano, historico de tickets, health score
- Criterios de classificacao N1/N2/N3

## Output

- Ticket classificado (N1, N2 ou N3)
- Prioridade definida (urgente, alta, media, baixa)
- Ticket roteado para o responsavel correto
- Registro de classificacao documentado

## Workflow

### Passo 1: Ler o ticket
Entender o problema descrito pelo cliente e o contexto.

### Passo 2: Classificar nivel
- **N1 (FAQ):** Problema com solucao documentada na knowledge base
- **N2 (Tecnico):** Problema que requer investigacao tecnica
- **N3 (Critico):** Problema que impacta operacao do cliente ou e um bug critico

### Passo 3: Definir prioridade
Avaliar urgencia (impacto no cliente) e combinar com o nivel para definir prioridade.

### Passo 4: Rotear para responsavel
- N1 -> Resolve direto (Resolve Ticket)
- N2/N3 -> Escala para especialista (Escalate Ticket)

## O que faz

- Classifica tickets em N1/N2/N3
- Prioriza por urgencia e impacto
- Roteia para responsavel correto
- Documenta classificacao

## O que NAO faz

- NAO resolve o ticket nesta etapa (isso e do Resolve ou Escalate)
- NAO reclassifica tickets ja em andamento
- NAO promete prazos ao cliente antes da classificacao

## Ferramentas

- **Intercom** -- Recepcao e classificacao de tickets
- **Zendesk** -- Gestao e roteamento de tickets
- **Notion KB** -- Consulta de criterios de classificacao
- **ClickUp** -- Registro de tickets roteados

## Quality Gate

- Threshold: >70%
- Ticket classificado em ate 1h apos recebimento
- Nivel (N1/N2/N3) e prioridade definidos corretamente
- Ticket roteado para o responsavel correto
- Classificacao documentada

---
*Squad Customer Success Task*
