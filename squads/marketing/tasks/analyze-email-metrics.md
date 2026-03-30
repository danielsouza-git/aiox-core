# Analyze Email Metrics

```yaml
task:
  id: analyze-email-metrics
  name: "Analyze Email Metrics"
  agent: email-strategist
  squad: marketing
  type: email
```

## Proposito

Analisar metricas semanais de email marketing (open rate, CTR, conversao), comparar modelos de email e identificar oportunidades de melhoria baseadas em dados para otimizar performance continuamente.

## Input

- Dados de performance de emails enviados (open rate, CTR, conversao, bounce, unsubscribe)
- Resultados de testes A/B (assunto, horario, segmento)
- Benchmarks do setor e historico proprio

## Output

- Relatorio semanal de metricas de email
- Comparativo entre modelos de email (A/B tests)
- Recomendacoes de melhoria baseadas em dados
- Alertas de metricas fora do benchmark

## Workflow

### Passo 1: Coletar dados de performance
Extrair metricas de todos os emails enviados na semana: open rate, CTR, conversao, bounce rate, unsubscribe rate.

### Passo 2: Comparar com benchmarks
Comparar metricas com benchmarks do setor e historico proprio, identificando tendencias positivas e negativas.

### Passo 3: Analisar testes A/B
Avaliar resultados de testes de assunto, horario e segmento, determinando vencedores com significancia estatistica.

### Passo 4: Identificar oportunidades
Documentar oportunidades de melhoria: segmentos com baixo engajamento, assuntos com melhor performance, horarios otimos.

### Passo 5: Consolidar relatorio
Montar relatorio semanal com metricas, comparativos e recomendacoes para o Head.

## O que faz

- Analisa metricas semanais de email (open rate, CTR, conversao)
- Compara modelos de email com testes A/B
- Identifica tendencias e oportunidades de melhoria
- Produz relatorio semanal para o Head
- Alerta quando metricas estao fora do benchmark

## O que NAO faz

- NAO reescreve copy de emails
- NAO reconfigura sequencias sem validacao
- NAO define metas de email sozinho
- NAO toma decisoes estrategicas sem aprovacao do Head

## Ferramentas

- **ActiveCampaign** -- Extracao de metricas e dados de performance
- **Google Sheets** -- Consolidacao de metricas, comparativos e graficos

## Quality Gate

- [ ] Relatorio semanal entregue ao Head
- [ ] Metricas comparadas com benchmarks do setor
- [ ] Resultados de A/B tests documentados
- [ ] Recomendacoes de melhoria listadas com base em dados
- [ ] Alertas emitidos para metricas fora do benchmark

---
*Squad Marketing Task*
