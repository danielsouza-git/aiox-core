# Pipeline Analysis

```yaml
task:
  id: pipeline-analysis
  name: "Pipeline Analysis"
  agent: sales-analyst
  squad: vendas
  type: analysis
```

## Proposito

Analisar o funil de vendas etapa a etapa para identificar gargalos de conversao, calcular taxas e monitorar a velocidade do pipeline, fornecendo insights acionaveis ao Head.

## Input

- Dados de pipeline do CRM (deals por etapa, valores, datas)
- Periodo de analise definido
- Metas do periodo para comparativo

## Output

- Mapa do funil com taxas de conversao por etapa
- Gargalos identificados com severidade
- Velocidade media do pipeline (dias por etapa)
- Recomendacoes de acao para cada gargalo
- Comparativo com periodo anterior

## Workflow

1. Extrair dados de pipeline do CRM para o periodo
2. Calcular volume de deals por etapa do funil
3. Calcular taxa de conversao entre cada etapa
4. Identificar etapas com conversao abaixo do benchmark
5. Calcular tempo medio de permanencia em cada etapa
6. Identificar deals travados (acima do tempo medio + 1 desvio)
7. Cruzar dados por SDR e por Closer para visao individual
8. Formular recomendacoes de acao para cada gargalo
9. Comparar com periodo anterior para tendencia
10. Registrar analise e compartilhar com Head

## O que faz

- Analisa funil com rigor estatistico
- Identifica onde deals estao travando e por que
- Calcula metricas por individuo e por time
- Fornece recomendacoes acionaveis

## O que NAO faz

- NAO toma acoes corretivas (isso e do Head)
- NAO contata clientes ou leads
- NAO modifica o pipeline no CRM

## Ferramentas

- CRM (extracao de dados)
- Google Sheets (calculos e modelagem)
- Metabase (dashboards de visualizacao)

## Quality Gate

- [ ] Dados extraidos do CRM para o periodo correto
- [ ] Taxas de conversao calculadas por etapa
- [ ] Gargalos identificados com recomendacoes
- [ ] Comparativo com periodo anterior incluido

---
*Squad Vendas Task*
