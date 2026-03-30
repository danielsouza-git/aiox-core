# Forecast

```yaml
task:
  id: forecast
  name: "Forecast"
  agent: sales-analyst
  squad: vendas
  type: analysis
```

## Proposito

Projetar receita de vendas mensal e trimestral com base no pipeline atual, calculando probabilidade de fechamento por deal e alertando quando a meta esta em risco.

## Input

- Pipeline atual com deals, valores e estagios
- Taxas historicas de conversao por etapa
- Metas de receita do periodo
- Calendario de fechamentos esperados

## Output

- Forecast de receita mensal e trimestral
- Probabilidade de fechamento por deal
- Cenarios: otimista, realista, pessimista
- Alerta de meta em risco (quando aplicavel)
- Gap entre forecast e meta com recomendacoes

## Workflow

1. Extrair pipeline atual com valores e estagios de cada deal
2. Atribuir probabilidade de fechamento por deal baseado em etapa e historico
3. Calcular receita esperada ponderada (valor x probabilidade)
4. Projetar cenario realista (receita ponderada)
5. Projetar cenario otimista (+20% sobre ponderada)
6. Projetar cenario pessimista (-20% sobre ponderada)
7. Comparar cenario realista com meta do periodo
8. Se gap negativo: gerar alerta com defasagem e recomendacoes
9. Identificar deals criticos (alto valor + alta probabilidade)
10. Compartilhar forecast com Head

## O que faz

- Projeta receita com base em dados reais do pipeline
- Calcula probabilidade objetiva por deal
- Gera cenarios para tomada de decisao
- Alerta proativamente sobre metas em risco

## O que NAO faz

- NAO modifica metas (isso e do Head)
- NAO acelera deals para melhorar forecast
- NAO manipula probabilidades sem base em dados

## Ferramentas

- CRM (dados de pipeline)
- Google Sheets (modelagem de forecast)
- Metabase (visualizacao de tendencias)

## Quality Gate

- [ ] Probabilidades baseadas em taxas historicas reais
- [ ] 3 cenarios calculados (otimista, realista, pessimista)
- [ ] Gap com meta identificado e comunicado
- [ ] Alerta emitido quando meta em risco

---
*Squad Vendas Task*
