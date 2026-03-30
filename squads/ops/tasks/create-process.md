# Create Process

```yaml
task:
  id: create-process
  name: "Create Process"
  agent: process-mapper
  squad: ops
  type: process
```

## Proposito

A partir do documento de Discovery Process, desenhar o novo processo otimizado que elimina caminhos de erro, define donos claros para cada etapa, estabelece handoffs bem definidos e documenta condicoes de veto. O resultado e um fluxograma validado com stakeholders.

## Input

- Documento de Discovery Process (processo atual mapeado)
- Gargalos e pontos de falha identificados
- Feedback de stakeholders sobre prioridades

## Output

- Fluxograma do novo processo otimizado
- Documentacao de etapas com donos definidos
- Handoffs entre etapas com criterios de transicao
- Condicoes de veto documentadas

## Workflow

### Passo 1: Definir etapas do novo processo
Com base no mapeamento atual, desenhe as etapas do novo fluxo eliminando redundancias e gargalos.

### Passo 2: Definir donos de cada etapa
Cada etapa deve ter um dono claro -- sem etapas orfas e sem funcao dupla.

### Passo 3: Eliminar caminhos de erro
Para cada caminho de erro identificado no Discovery, crie uma solucao: automacao, validacao, ou etapa adicional.

### Passo 4: Definir handoffs
Documente o que precisa estar pronto para uma etapa passar para a proxima. Criterios claros de transicao.

### Passo 5: Documentar condicoes de veto
Defina o que impede uma etapa de avancar -- campos obrigatorios, aprovacoes necessarias, dependencias externas.

### Passo 6: Validar com stakeholders
Apresente o novo processo para quem executa e quem recebe o output. Ajuste com base no feedback.

## O que faz

- Desenha o novo processo otimizado
- Define etapas e donos claros
- Elimina caminhos de erro
- Define handoffs entre etapas
- Documenta condicoes de veto
- Valida com stakeholders

## O que NAO faz

- NAO implementa no ClickUp (isso e do Process Architect)
- NAO cria automacoes (isso e do Automation Architect)
- NAO executa as tasks do processo

## Ferramentas

- **Figma** -- Desenho do fluxograma
- **Notion** -- Documentacao do novo processo
- **Miro** -- Validacao visual com stakeholders
- **Google Docs** -- Documentacao colaborativa

## Quality Gate

- Threshold: >70%
- Fluxograma do novo processo e claro e completo
- Todas as etapas tem donos definidos
- Handoffs tem criterios de transicao documentados
- Condicoes de veto existem para etapas criticas
- Stakeholders validaram o novo processo
- Se aprovado (>70%), output segue para Process Architect

---
*Squad OPS Task*
