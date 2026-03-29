# Fornecedores

```yaml
task:
  id: fornecedores
  name: "Fornecedores"
  agent: facilities
  squad: administracao
  type: facilities
```

## Proposito

Gerenciar o cadastro de fornecedores da empresa: registrar novos fornecedores, avaliar qualidade e custo-beneficio periodicamente, e apresentar opcoes ao Admin Head para decisao de contratacao. Garantir que a base de fornecedores esta atualizada e avaliada.

## Input

- Solicitacao de cadastro de novo fornecedor
- Dados do fornecedor (CNPJ, servicos, contato, condicoes)
- Feedback de areas que utilizam o fornecedor
- Criterios de avaliacao definidos pelo Head

## Output

- Fornecedor registrado no cadastro centralizado
- Avaliacao de qualidade e custo-beneficio documentada
- Recomendacoes de fornecedor para o Head (quando ha selecao)
- Relatorio periodico de fornecedores ativos

## Workflow

### Passo 1: Registrar fornecedor
Cadastre o fornecedor com dados completos: CNPJ, servicos oferecidos, contato, condicoes comerciais.

### Passo 2: Avaliar
Aplique criterios de avaliacao: qualidade, preco, prazo, atendimento, historico.

### Passo 3: Apresentar opcoes
Quando ha selecao de fornecedor, apresente opcoes avaliadas ao Head para decisao.

### Passo 4: Monitorar
Periodicamente reavalie fornecedores ativos com base em feedback das areas.

## O que faz

- Registra fornecedores no cadastro centralizado
- Avalia qualidade e custo-beneficio com criterios claros
- Apresenta opcoes avaliadas ao Head para selecao
- Monitora desempenho de fornecedores ativos
- Gera relatorio periodico de fornecedores

## O que NAO faz

- NAO escolhe fornecedor (Head aprova)
- NAO assina contratos com fornecedores (Juridico faz)
- NAO negocia valores sem orientacao do Head
- NAO paga fornecedores (Financeiro faz)

## Ferramentas

- **Notion** -- Cadastro centralizado de fornecedores
- **Google Sheets** -- Avaliacao e comparativo de fornecedores

## Quality Gate

- Threshold: >70%
- Cadastro completo com dados atualizados
- Avaliacao com criterios documentados
- Opcoes apresentadas ao Head com comparativo
- Fornecedores ativos reavaliados semestralmente

---
*Squad Administracao Task*
