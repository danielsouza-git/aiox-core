# Quality Report

```yaml
task:
  id: quality-report
  name: "Quality Report"
  agent: cs-retencao-produto
  squad: produto
  type: quality
```

## Proposito

Consolidar metricas de qualidade de produto em um relatorio periodico: NPS, taxa de conclusao, engajamento, problemas recorrentes e tendencias. O relatorio alimenta o Produto Head e o Product Manager com dados para decisoes estrategicas.

## Input

- Dados de uso do produto: taxa de conclusao, engajamento, abandono
- NPS de produto e avaliacoes de alunos/clientes
- Historico de quality checks e testes de experiencia
- Feedback consolidado do feedback loop

## Output

- Relatorio de qualidade com metricas atualizadas
- Tendencias identificadas (melhorando, piorando, estavel)
- Alertas para metricas abaixo do threshold
- Recomendacoes baseadas nos dados

## Workflow

### Passo 1: Coletar metricas
Reuna dados de todas as fontes: plataforma, NPS, quality checks, feedback.

### Passo 2: Calcular indicadores
Calcule os indicadores principais: NPS, taxa de conclusao, engajamento, tempo medio.

### Passo 3: Identificar tendencias
Compare com periodos anteriores: o que esta melhorando, piorando ou estavel.

### Passo 4: Alertar anomalias
Destaque metricas abaixo do threshold ou com queda significativa.

### Passo 5: Gerar relatorio
Consolide em um relatorio visual e claro para Produto Head e PM.

## O que faz

- Consolida metricas de qualidade de produto
- Calcula indicadores: NPS, taxa de conclusao, engajamento
- Identifica tendencias e anomalias
- Gera alertas para metricas abaixo do threshold
- Produz relatorio periodico para lideranca

## O que NAO faz

- NAO toma decisao de produto baseada nas metricas (isso e do PM/Head)
- NAO corrige problemas identificados
- NAO faz pesquisa de mercado
- NAO define os thresholds (isso e do Produto Head)

## Ferramentas

- **Google Sheets** -- Consolidacao de metricas e graficos
- **Notion** -- Publicacao do relatorio
- **Hotmart / Kajabi / Teachable** -- Dados de uso da plataforma
- **Typeform** -- Dados de NPS e pesquisas

## Quality Gate

- Threshold: >70%
- Metricas atualizadas e precisas
- Tendencias identificadas com comparativo de periodos
- Alertas documentados para anomalias
- Relatorio claro e acionavel para lideranca

---
*Squad Produto Task*
