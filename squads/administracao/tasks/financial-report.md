# Financial Report

```yaml
task:
  id: financial-report
  name: "Financial Report"
  agent: financeiro
  squad: administracao
  type: financial
```

## Proposito

Gerar o DRE mensal e o relatorio financeiro para o CEO contendo burn rate, runway, metricas chave e comparativo com periodos anteriores. Este e o principal output de visibilidade financeira para a lideranca.

## Input

- Dados consolidados de contas a pagar e receber do periodo
- Fluxo de caixa realizado vs projetado
- Metricas de negocios (MRR, ARR, churn, CAC, LTV se disponiveis)
- DRE do periodo anterior para comparativo

## Output

- DRE mensal completo (receitas, custos, despesas, resultado)
- Relatorio para CEO com: burn rate, runway, metricas chave
- Comparativo com periodo anterior e variacao percentual
- Alertas sobre desvios significativos

## Workflow

### Passo 1: Fechar o periodo
Verifique que todos os lancamentos do mes estao conciliados e classificados corretamente.

### Passo 2: Gerar DRE
Monte a Demonstracao de Resultado com receitas, custos diretos, despesas operacionais e resultado liquido.

### Passo 3: Calcular metricas
Calcule burn rate (media de gasto mensal), runway (meses de caixa remanescente), e metricas de negocio disponiveis.

### Passo 4: Montar relatorio CEO
Crie apresentacao executiva com DRE resumido, metricas, comparativo e alertas sobre desvios.

## O que faz

- Fecha o periodo contabil com lancamentos conciliados
- Gera DRE mensal com classificacao correta
- Calcula burn rate e runway
- Compara com periodo anterior e identifica variacoes
- Monta relatorio executivo para o CEO

## O que NAO faz

- NAO interpreta resultados estrategicamente (Head e CEO fazem)
- NAO sugere cortes de custos (Head decide)
- NAO projeta futuro (Fluxo de Caixa faz projecao)

## Ferramentas

- **Conta Azul** -- Dados contabeis e DRE
- **Google Sheets** -- Calculos e tabelas auxiliares
- **Google Slides** -- Apresentacao executiva para CEO

## Quality Gate

- Threshold: >70%
- DRE fechado ate o 5o dia util do mes seguinte
- Lancamentos 100% conciliados antes de gerar o relatorio
- Metricas calculadas com formula documentada
- Comparativo com periodo anterior incluido
- Relatorio entregue ao Head para revisao antes de enviar ao CEO

---
*Squad Administracao Task*
