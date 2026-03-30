# Auditorias Internas

```yaml
task:
  id: auditorias-internas
  name: "Auditorias Internas"
  agent: compliance
  squad: administracao
  type: compliance
```

## Proposito

Auditar processos internos da empresa verificando aderencia a politicas, procedimentos e legislacao vigente. Identificar nao-conformidades, documentar achados e recomendar correcoes. Auditorias sao preventivas e educativas, nao punitivas.

## Input

- Solicitacao de auditoria de processo especifico
- Calendario periodico de auditorias (definido com Head)
- Checklist de auditoria para a area/processo
- Resultados de auditorias anteriores para follow-up

## Output

- Relatorio de auditoria com achados classificados por severidade
- Recomendacoes de correcao para cada achado
- Plano de remediacao com responsaveis e prazos
- Status de achados de auditorias anteriores (resolvido/pendente)

## Workflow

### Passo 1: Planejar auditoria
Defina escopo, processo a ser auditado, checklist a ser utilizado e cronograma.

### Passo 2: Executar auditoria
Aplique o checklist, colete evidencias, entreviste responsaveis pelo processo.

### Passo 3: Documentar achados
Classifique achados por severidade (critico, alto, medio, baixo) com evidencia.

### Passo 4: Recomendar e acompanhar
Crie recomendacoes de correcao e acompanhe implementacao ate resolucao.

## O que faz

- Audita processos internos contra politicas e legislacao
- Aplica checklists de conformidade
- Documenta achados com evidencia e classificacao de severidade
- Recomenda correcoes e cria plano de remediacao
- Acompanha resolucao de achados de auditorias anteriores

## O que NAO faz

- NAO pune -- apenas identifica e recomenda (Head ou CEO decide)
- NAO audita ESTRUTURA de squads (Squad Auditoria faz isso)
- NAO implementa correcoes (area auditada implementa)
- NAO cria novos processos (pede ao OPS)

## Ferramentas

- **Checklist** -- Checklists de auditoria padronizados
- **Notion** -- Documentacao de relatorios e acompanhamento
- **Google Sheets** -- Tracking de achados e remediacao

## Quality Gate

- Threshold: >70%
- Auditoria executada conforme checklist completo
- Achados documentados com evidencia
- Recomendacoes acionaveis para cada achado
- Achados anteriores acompanhados ate resolucao

---
*Squad Administracao Task*
