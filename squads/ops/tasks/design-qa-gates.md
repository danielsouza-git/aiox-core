# Design QA Gates

```yaml
task:
  id: design-qa-gates
  name: "Design QA Gates"
  agent: process-validator
  squad: ops
  type: validation
```

## Proposito

Definir os criterios de qualidade para cada etapa do processo, criar checklists de validacao acionaveis e estabelecer o que significa atingir >70% (aprovado) vs <70% (reprovado) em cada quality gate. Definir quem aprova cada gate e o que bloqueia o avanco.

## Input

- Automacoes configuradas e testadas (output do Create Task Definitions Automations)
- Definicoes de tasks com criterios de aceitacao
- Estrutura completa do processo no ClickUp

## Output

- Criterios de qualidade para cada etapa do processo
- Definicao clara de >70% vs <70% para cada gate
- Checklists de validacao acionaveis
- Pontos de verificacao ao longo do processo
- Definicao de aprovadores para cada gate

## Workflow

### Passo 1: Definir criterios de qualidade por etapa
Para cada etapa do processo, defina o que precisa ser verdade para considerar a etapa "bem feita".

### Passo 2: Definir threshold >70% vs <70%
Documente objetivamente o que diferencia aprovacao de reprovacao em cada gate.

### Passo 3: Criar checklists de validacao
Transforme criterios em checklists acionaveis que qualquer pessoa pode executar.

### Passo 4: Definir pontos de verificacao
Identifique momentos ao longo do processo onde uma verificacao intermediaria e necessaria.

### Passo 5: Definir aprovadores
Para cada gate, defina quem tem autoridade para aprovar ou reprovar.

### Passo 6: Definir regras de bloqueio
Documente o que impede o avanco quando um gate reprova -- para onde volta, quem corrige, em quanto tempo.

## O que faz

- Define criterios de qualidade para cada etapa
- Define o que e >70% vs <70%
- Cria checklists de validacao acionaveis
- Define pontos de verificacao intermediarios
- Define o que bloqueia o avanco
- Define quem aprova cada gate

## O que NAO faz

- NAO executa os testes (isso e do Test QA Gates)
- NAO altera automacoes ou estrutura
- NAO cria novos processos

## Ferramentas

- **ClickUp** -- Definicao de gates dentro da estrutura
- **Notion** -- Documentacao de criterios de qualidade
- **Google Sheets** -- Matrizes de criterios e scoring

## Quality Gate

- Threshold: >70%
- Criterios cobrem todas as etapas do processo
- Definicao de >70% vs <70% e clara e objetiva
- Checklists sao acionaveis por qualquer pessoa
- Pontos de verificacao existem em momentos criticos
- Aprovadores estao definidos para cada gate

---
*Squad OPS Task*
