# Fluxo de Caixa

```yaml
task:
  id: fluxo-de-caixa
  name: "Fluxo de Caixa"
  agent: financeiro
  squad: administracao
  type: financial
```

## Proposito

Projetar o fluxo de caixa da empresa com visao mensal e trimestral, identificando riscos de liquidez e gerando alertas preventivos para que o Admin Head tome decisoes de alocacao com antecedencia.

## Input

- Contas a pagar previstas (fixas e variaveis)
- Contas a receber previstas (faturamento e recebimentos)
- Saldo bancario atual
- Compromissos futuros (contratos, investimentos)
- Sazonalidade historica

## Output

- Projecao de fluxo de caixa mensal e trimestral
- Alertas de risco de liquidez com prazo estimado
- Recomendacoes de acao preventiva para o Admin Head
- Cenarios (otimista, realista, pessimista)

## Workflow

### Passo 1: Consolidar entradas e saidas previstas
Reuna todas as contas a pagar e receber previstas para o periodo, incluindo compromissos futuros.

### Passo 2: Projetar fluxo
Projete o saldo do caixa dia a dia, semana a semana, para os proximos 30, 60 e 90 dias.

### Passo 3: Identificar riscos
Sinalize pontos onde o saldo pode ficar negativo ou abaixo do minimo operacional.

### Passo 4: Gerar alertas
Crie alertas preventivos com antecedencia suficiente para o Head tomar acao (renegociar prazos, antecipar recebimentos, adiar gastos).

## O que faz

- Projeta fluxo de caixa para 30, 60 e 90 dias
- Identifica riscos de liquidez e pontos criticos
- Gera alertas preventivos com recomendacoes de acao
- Cria cenarios otimista, realista e pessimista
- Atualiza projecao semanalmente com dados reais

## O que NAO faz

- NAO decide onde cortar gastos (Head decide)
- NAO negocia prazos com fornecedores (Facilities faz)
- NAO toma acoes sobre o caixa -- apenas projeta e alerta

## Ferramentas

- **Conta Azul** -- Dados de contas a pagar e receber
- **Banco** -- Saldo e extrato atual
- **Google Sheets** -- Projecoes e cenarios

## Quality Gate

- Threshold: >70%
- Projecao atualizada semanalmente
- Riscos identificados com antecedencia minima de 15 dias
- Cenarios documentados com premissas claras
- Alertas enviados ao Head com recomendacoes acionaveis

---
*Squad Administracao Task*
