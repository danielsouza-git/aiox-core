# Squad Completeness Audit

```yaml
task:
  id: squad-completeness-audit
  name: "Squad Completeness Audit"
  agent: squad-auditor
  squad: auditoria
  type: audit
```

## Proposito

Verificar que um squad possui todos os arquivos, agentes e tasks necessarios, com todas as secoes obrigatorias presentes e sem definicoes malformadas. Garante integridade estrutural basica.

## Input

- Caminho do diretorio do squad (ex: squads/ops/)
- Padrao esperado: config.yaml, agents/*.md, tasks/*.md

## Output

- Relatorio de completude contendo: agentes faltando, tasks faltando, arquivos orfaos, definicoes malformadas, secoes ausentes por arquivo

## Workflow

### Passo 1: Ler config.yaml
Extrair lista de agentes registrados, entry_agent, tiers e tasks referenciadas.

### Passo 2: Verificar arquivos de agentes
Para cada agente registrado no config.yaml, confirmar que existe arquivo correspondente em agents/. Listar agentes orfaos (arquivo existe mas nao esta no config).

### Passo 3: Verificar arquivos de tasks
Para cada task referenciada, confirmar que existe arquivo correspondente em tasks/. Listar tasks orfas.

### Passo 4: Validar secoes obrigatorias
Para cada arquivo .md, verificar presenca de: Proposito, Input, Output, O que faz, O que NAO faz, Ferramentas, Quality Gate.

### Passo 5: Gerar relatorio
Consolidar findings com severidade (critico: arquivo faltando, alto: secao ausente, medio: secao incompleta, baixo: formatacao).

## O que faz

- Verifica que config.yaml tem todos os agentes registrados
- Confirma que todos os arquivos de agentes existem
- Confirma que todos os arquivos de tasks existem
- Valida secoes obrigatorias em cada definicao
- Detecta arquivos orfaos (existem mas nao estao registrados)
- Classifica cada finding por severidade

## O que NAO faz

- NAO avalia qualidade do conteudo (se o texto faz sentido)
- NAO corrige problemas encontrados
- NAO verifica quality gates (isso e da task quality-gate-compliance-check)
- NAO modifica nenhum arquivo

## Ferramentas

- **Markdown** -- Leitura de arquivos .md e config.yaml
- **Sheets** -- Tabela de findings

## Quality Gate

- Threshold: >70%
- Todos os agentes registrados verificados
- Todas as tasks referenciadas verificadas
- Secoes obrigatorias validadas em todos os arquivos
- Findings classificados por severidade

---
*Squad Auditoria Task*
