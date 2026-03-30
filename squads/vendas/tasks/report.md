# Report

```yaml
task:
  id: report
  name: "Report"
  agent: sales-analyst
  squad: vendas
  type: analysis
```

## Proposito

Produzir relatorios semanais e mensais de performance comercial com metricas-chave, comparativos de periodo e analise de motivos de perda para direcionar decisoes do Head.

## Input

- Metricas do periodo (deals ganhos, perdidos, em andamento)
- Dados financeiros (receita, ticket medio, valores)
- Dados de atividade do time (calls, emails, reunioes)
- Motivos de perda registrados no CRM
- Metas do periodo para comparativo

## Output

- Relatorio semanal com metricas-chave
- Relatorio mensal consolidado com comparativos
- Metricas calculadas: CAC, LTV, ticket medio, ciclo de venda
- Ranking de motivos de perda
- Comparativo com periodo anterior

## Workflow

1. Coletar dados do periodo no CRM e ferramentas auxiliares
2. Calcular metricas-chave:
   - CAC (Custo de Aquisicao de Cliente)
   - LTV (Lifetime Value)
   - Ticket medio
   - Ciclo medio de venda (dias do primeiro contato ao fechamento)
   - Taxa de conversao geral
3. Compilar motivos de perda e rankear por frequencia
4. Comparar metricas com periodo anterior (variacao %)
5. Comparar resultado com meta (atingimento %)
6. Calcular performance individual (por SDR e por Closer)
7. Identificar destaques positivos e pontos de atencao
8. Montar relatorio visual com graficos e tabelas
9. Entregar relatorio ao Head e ao time

## O que faz

- Compila dados de multiplas fontes em visao unificada
- Calcula metricas padronizadas de vendas
- Identifica tendencias e padroes nos dados
- Fornece base para decisoes do Head

## O que NAO faz

- NAO toma decisoes com base nos dados (isso e do Head)
- NAO altera dados no CRM
- NAO omite metricas negativas

## Ferramentas

- CRM (extracao de dados)
- Google Sheets (calculos e consolidacao)
- Metabase (dashboards e graficos)
- Google Slides (apresentacao de relatorios)
- Notion (documentacao de insights)

## Quality Gate

- [ ] Todas as metricas-chave calculadas (CAC, LTV, ticket medio, ciclo)
- [ ] Comparativo com periodo anterior incluido
- [ ] Motivos de perda rankeados
- [ ] Relatorio semanal entregue ate segunda-feira
- [ ] Relatorio mensal entregue ate dia 5 do mes seguinte

---
*Squad Vendas Task*
