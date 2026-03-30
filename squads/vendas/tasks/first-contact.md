# First Contact

```yaml
task:
  id: first-contact
  name: "First Contact"
  agent: sdr
  squad: vendas
  type: prospecting
```

## Proposito

Realizar o primeiro contato com o lead qualificado via email, WhatsApp ou cold call, com objetivo de gerar interesse, validar qualificacao e agendar uma call de discovery com o Closer.

## Input

- Lead qualificado via BANT
- Template de primeiro contato aprovado
- Canal preferido do lead (email, WhatsApp, telefone)
- Disponibilidade de agenda do Closer (Calendly)

## Output

- Call de discovery agendada com Closer
- Lead encaminhado para nurture (se nao respondeu ou pediu para esperar)
- Material pre-venda enviado (case studies, one-pagers)
- Interacao registrada no CRM

## Workflow

1. Selecionar canal de contato com base no perfil do lead
2. Personalizar template de abordagem com dados do lead
3. Realizar primeiro contato (email/WhatsApp/call)
4. Se interesse confirmado: agendar call de discovery via Calendly
5. Enviar material pre-venda relevante ao lead
6. Se sem resposta: follow-up em 48h (maximo 3 tentativas)
7. Se lead pede para esperar: agendar follow-up futuro
8. Registrar todas interacoes no CRM
9. Handoff para Closer: lead + dados BANT + call agendada

## O que faz

- Personaliza abordagem com base no perfil e dor do lead
- Segue cadencia de follow-up definida (3 tentativas max)
- Agenda call diretamente na agenda do Closer
- Envia materiais relevantes para preparar o lead

## O que NAO faz

- NAO apresenta proposta comercial
- NAO discute precos ou condicoes
- NAO conduz a discovery call
- NAO insiste alem da cadencia definida (3 tentativas)

## Ferramentas

- WhatsApp Business (contato direto)
- Email (outreach e follow-up)
- Calendly (agendamento)
- CRM (registro de interacoes)

## Quality Gate

- [ ] Primeiro contato realizado em ate 24h apos qualificacao
- [ ] Template personalizado com dados do lead
- [ ] Follow-up executado conforme cadencia
- [ ] Call agendada ou lead direcionado para nurture
- [ ] Interacoes registradas no CRM

---
*Squad Vendas Task*
