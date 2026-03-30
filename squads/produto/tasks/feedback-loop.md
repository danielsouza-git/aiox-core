# Feedback Loop

```yaml
task:
  id: feedback-loop
  name: "Feedback Loop"
  agent: cs-retencao-produto
  squad: produto
  type: quality
```

## Proposito

Coletar feedback do CS de Experiencia (squad Customer Success), organizar por prioridade e impacto, e passar para o Product Manager priorizar no roadmap. O feedback loop garante que problemas reais de clientes influenciam as decisoes de produto.

## Input

- Feedback de clientes coletado pelo CS squad (suporte, NPS, pesquisas)
- Relatorios de suporte com problemas recorrentes
- Dados de uso do produto (engajamento, conclusao, abandono)

## Output

- Feedback consolidado e categorizado por tema
- Priorizacao por impacto (quantos clientes afetados, gravidade)
- Recomendacoes para o Product Manager

## Workflow

### Passo 1: Coletar feedback
Reuna feedback do CS de Experiencia: tickets recorrentes, avaliacoes, NPS, pesquisas.

### Passo 2: Categorizar por tema
Agrupe o feedback por area: conteudo, plataforma, experiencia, suporte.

### Passo 3: Priorizar por impacto
Classifique cada tema por: numero de clientes afetados x gravidade do problema.

### Passo 4: Consolidar recomendacoes
Para cada tema prioritario, escreva uma recomendacao clara do que deve mudar.

### Passo 5: Passar para PM
Entregue o feedback consolidado para o Product Manager priorizar no roadmap.

## O que faz

- Coleta feedback do CS de Experiencia (squad Customer Success)
- Categoriza feedback por tema e area
- Prioriza por impacto (clientes afetados x gravidade)
- Consolida recomendacoes acionaveis
- Passa para Product Manager priorizar

## O que NAO faz

- NAO toma decisao de priorizacao de produto (passa para PM)
- NAO resolve os problemas diretamente
- NAO coleta feedback sozinho (depende do CS squad)
- NAO promete mudancas para clientes

## Ferramentas

- **Notion** -- Documentacao e consolidacao de feedback
- **Google Sheets** -- Categorizacao e priorizacao
- **Slack** -- Comunicacao com CS squad para coleta de feedback
- **Typeform** -- Pesquisas complementares quando necessario

## Quality Gate

- Threshold: >70%
- Feedback coletado de fontes concretas (tickets, NPS, pesquisas)
- Categorizacao por tema realizada
- Priorizacao por impacto documentada
- Recomendacoes claras e acionaveis para o PM

---
*Squad Produto Task*
