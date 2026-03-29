# Lead Qualification

```yaml
task:
  id: lead-qualification
  name: "Lead Qualification"
  agent: sdr
  squad: vendas
  type: qualification
```

## Proposito

Qualificar leads pontuados utilizando o framework BANT (Budget, Authority, Need, Timeline) para determinar se o lead esta pronto para avancar no funil ou deve ser descartado/encaminhado para nurture.

## Input

- Lead com score de prioridade Alta ou Media
- Dados do lead no CRM
- Framework BANT do negocio com criterios de corte

## Output

- Lead qualificado (BANT completo, pronto para Closer)
- Lead descartado com motivo documentado
- Lead encaminhado para nurture (nao pronto agora, potencial futuro)

## Workflow

1. Revisar dados do lead e score de prioridade
2. Avaliar **Budget**: O lead tem orcamento para a solucao?
3. Avaliar **Authority**: O contato tem poder de decisao ou influencia?
4. Avaliar **Need**: A dor do lead se encaixa na solucao oferecida?
5. Avaliar **Timeline**: Existe urgencia ou prazo definido para decisao?
6. Classificar resultado: Qualificado (3-4 criterios OK), Nurture (1-2 OK), Descartado (0 OK)
7. Registrar resultado e notas no CRM
8. Encaminhar lead qualificado para primeiro contato

## O que faz

- Aplica framework BANT de forma estruturada
- Documenta cada criterio avaliado com evidencias
- Separa leads prontos de leads que precisam de nurture
- Alimenta pipeline com leads de qualidade

## O que NAO faz

- NAO contata o lead nesta etapa (isso e no first-contact)
- NAO negocia ou apresenta proposta
- NAO qualifica leads com score Baixo sem aprovacao

## Ferramentas

- CRM (consulta e registro de qualificacao)
- Google Sheets (tracking auxiliar)

## Quality Gate

- [ ] 4 criterios BANT avaliados para cada lead
- [ ] Resultado documentado no CRM com evidencias
- [ ] Leads nao-qualificados com motivo registrado
- [ ] Leads qualificados encaminhados para primeiro contato

---
*Squad Vendas Task*
