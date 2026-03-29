# Task Coverage Analysis

```yaml
task:
  id: task-coverage-analysis
  name: "Task Coverage Analysis"
  agent: coverage-analyst
  squad: auditoria
  type: analysis
```

## Proposito

Mapear as necessidades de negocio para as capacidades oferecidas pelos squads, identificando gaps onde funcoes criticas nao estao cobertas por nenhuma task de nenhum squad.

## Input

- Todas as definicoes de squads (config.yaml + agents/ + tasks/ de cada squad em squads/)
- Lista de funcoes de negocio esperadas (derivada do PRD ou briefing)

## Output

- Matriz de cobertura: funcoes de negocio (linhas) vs squads/tasks (colunas)
- Lista de gaps: funcoes de negocio sem cobertura
- Lista de funcoes com cobertura parcial (task existe mas escopo e limitado)

## Workflow

### Passo 1: Inventariar capacidades
Ler todas as definicoes de tasks de todos os squads e listar as capacidades oferecidas por cada uma.

### Passo 2: Listar funcoes de negocio
Definir as funcoes de negocio esperadas: operacoes, vendas, financeiro, RH, juridico, facilities, compliance, produto, CS, marketing, auditoria.

### Passo 3: Mapear capacidades para funcoes
Associar cada task a uma ou mais funcoes de negocio que ela atende.

### Passo 4: Identificar gaps
Listar funcoes de negocio sem nenhuma task associada ou com cobertura insuficiente.

### Passo 5: Gerar matriz e relatorio
Produzir matriz visual e relatorio textual com gaps e recomendacoes.

## O que faz

- Inventaria todas as tasks de todos os squads
- Mapeia tasks para funcoes de negocio
- Identifica funcoes sem cobertura (gaps)
- Identifica funcoes com cobertura parcial
- Gera matriz de cobertura consolidada

## O que NAO faz

- NAO cria tasks para cobrir gaps -- apenas reporta
- NAO avalia qualidade das tasks existentes
- NAO detecta overlaps (isso e da task cross-squad-overlap-detection)
- NAO modifica nenhum arquivo

## Ferramentas

- **Sheets** -- Matriz de cobertura
- **Markdown** -- Leitura de definicoes de squads
- **Notion** -- Documentacao do relatorio

## Quality Gate

- Threshold: >70%
- Todos os squads inventariados
- Todas as funcoes de negocio listadas e mapeadas
- Gaps identificados com severidade
- Matriz de cobertura completa e legivel

---
*Squad Auditoria Task*
