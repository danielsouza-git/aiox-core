# Ferramentas

```yaml
task:
  id: ferramentas
  name: "Ferramentas"
  agent: facilities
  squad: administracao
  type: facilities
```

## Proposito

Controlar todas as assinaturas SaaS da empresa: inventario, custos, vencimentos, negociacao de planos e identificacao de oportunidades de otimizacao. Garantir que a empresa paga apenas pelo que usa e que renovacoes sao negociadas com antecedencia.

## Input

- Inventario atual de ferramentas SaaS
- Novos pedidos de ferramentas (aprovados pelo Head)
- Datas de vencimento e renovacao
- Dados de uso de cada ferramenta

## Output

- Inventario atualizado com custos e vencimentos
- Recomendacoes de otimizacao (cancelar, downgrade, consolidar)
- Negociacoes de renovacao executadas
- Relatorio mensal de custos de ferramentas

## Workflow

### Passo 1: Manter inventario
Mantenha lista atualizada de todas as ferramentas SaaS com: nome, fornecedor, custo, vencimento, responsavel, numero de licencas.

### Passo 2: Monitorar uso
Identifique ferramentas subutilizadas ou com licencas ociosas.

### Passo 3: Negociar renovacoes
Antes do vencimento, negocie melhores condicoes com fornecedores. Apresente opcoes ao Head.

### Passo 4: Reportar
Gere relatorio mensal de custos e recomendacoes de otimizacao.

## O que faz

- Mantém inventario completo de ferramentas SaaS
- Monitora uso e identifica ferramentas subutilizadas
- Negocia planos e renovacoes com fornecedores
- Identifica oportunidades de consolidacao e economia
- Gera relatorio mensal de custos

## O que NAO faz

- NAO aprova compras de novas ferramentas (Head aprova)
- NAO implementa ferramentas tecnicamente (DevOps/TI faz)
- NAO decide cancelamento sem aprovacao do Head

## Ferramentas

- **Google Sheets** -- Inventario e controle de custos
- **Notion** -- Documentacao de ferramentas e fornecedores

## Quality Gate

- Threshold: >70%
- Inventario atualizado mensalmente
- Renovacoes negociadas antes do vencimento
- Ferramentas subutilizadas identificadas e reportadas
- Custos dentro do orcamento aprovado

---
*Squad Administracao Task*
