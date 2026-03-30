# Close Deal

```yaml
task:
  id: close-deal
  name: "Close Deal"
  agent: closer
  squad: vendas
  type: closing
```

## Proposito

Fechar o negocio com assinatura de contrato e coleta de pagamento, garantindo handoff completo para o CS. Registrar motivo de perda quando o deal nao e fechado.

## Input

- Lead com objecoes tratadas e pronto para fechar
- Contrato com termos finais aprovados
- Dados de pagamento (quando aplicavel)
- Checklist de handoff para CS

## Output

- Contrato assinado digitalmente
- Pagamento coletado (quando aplicavel)
- Handoff estruturado para CS com dados completos
- Deal perdido com motivo registrado (quando nao fecha)
- Lead frio encaminhado para Marketing (nurture)

## Workflow

1. Confirmar termos finais com o lead
2. Enviar contrato digital para assinatura
3. Acompanhar assinatura com follow-up se necessario
4. Coletar primeiro pagamento (se processo inclui pagamento)
5. Atualizar status do deal no CRM para "Ganho"
6. Preparar pacote de handoff para CS:
   - Dados da empresa e contato principal
   - Necessidades mapeadas na discovery
   - Termos do contrato e condicoes especiais
   - Expectativas do cliente
7. Realizar handoff formal para CS (Welcome Client)
8. Se deal perdido: registrar motivo detalhado e encaminhar lead frio para Marketing

## O que faz

- Finaliza o processo comercial com contrato assinado
- Garante transicao suave para CS com dados completos
- Coleta pagamento quando aplicavel
- Documenta motivos de perda para inteligencia comercial

## O que NAO faz

- NAO gerencia o pos-venda (isso e do CS)
- NAO renegocia termos apos assinatura
- NAO omite informacoes no handoff para CS

## Ferramentas

- Contratos digitais (DocuSign ou equivalente)
- Stripe / PagSeguro (coleta de pagamento)
- CRM (atualizacao de status e handoff)
- WhatsApp / Email (acompanhamento)

## Quality Gate

- [ ] Contrato com termos corretos e validados
- [ ] Assinatura coletada ou motivo de perda registrado
- [ ] Pagamento coletado (quando aplicavel)
- [ ] Handoff para CS com checklist completo
- [ ] Lead frio encaminhado para Marketing (quando perdido)

---
*Squad Vendas Task*
