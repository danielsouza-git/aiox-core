# Contas a Pagar

```yaml
task:
  id: contas-a-pagar
  name: "Contas a Pagar"
  agent: financeiro
  squad: administracao
  type: financial
```

## Proposito

Processar todos os pagamentos da empresa de forma sistematizada: custos fixos sao pagos automaticamente, custos variaveis e gastos acima do threshold exigem aprovacao do Admin Head. Garantir que nenhum pagamento atrasa e que todos os lancamentos estao corretos.

## Input

- Notas fiscais, boletos e faturas recebidas
- Contratos com valores e datas de vencimento
- Threshold de aprovacao definido pelo Admin Head
- Extrato bancario para conciliacao

## Output

- Pagamentos executados e conciliados
- Lista de pagamentos pendentes de aprovacao do Head
- Relatorio de pagamentos do periodo com classificacao por categoria

## Workflow

### Passo 1: Receber e classificar
Receba a nota/boleto, classifique por categoria (fixo, variavel, investimento) e por fornecedor.

### Passo 2: Verificar threshold
Se custo fixo recorrente e abaixo do threshold, processe automaticamente. Se acima do threshold ou despesa nova, solicite aprovacao do Admin Head.

### Passo 3: Executar pagamento
Realize o pagamento via sistema financeiro e registre o lancamento com data, valor, categoria e fornecedor.

### Passo 4: Conciliar
Confira o extrato bancario com os lancamentos registrados. Sinalize divergencias.

## O que faz

- Processa pagamentos de custos fixos automaticamente
- Solicita aprovacao do Head para valores acima do threshold
- Classifica despesas por categoria e fornecedor
- Concilia pagamentos com extrato bancario
- Alerta sobre vencimentos proximos

## O que NAO faz

- NAO aprova gastos acima do threshold (isso e do Admin Head)
- NAO negocia com fornecedores (isso e do Facilities)
- NAO decide prioridade de pagamento em caso de caixa baixo (Head decide)

## Ferramentas

- **Conta Azul** -- Lancamentos e conciliacao
- **Banco** -- Execucao de pagamentos
- **Google Sheets** -- Controle auxiliar e relatorios

## Quality Gate

- Threshold: >70%
- Nenhum pagamento atrasado sem justificativa
- Lancamentos conciliados com extrato bancario
- Classificacao correta de categorias
- Aprovacoes documentadas para gastos acima do threshold

---
*Squad Administracao Task*
