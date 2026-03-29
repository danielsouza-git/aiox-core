# Offboarding

```yaml
task:
  id: offboarding
  name: "Offboarding"
  agent: rh-people
  squad: administracao
  type: hr
```

## Proposito

Processar o desligamento de colaboradores de forma sistematica: remover acessos, processar documentacao, conduzir entrevista de saida e garantir transicao de responsabilidades. O offboarding deve ser executado em ate 48h apos decisao do Admin Head.

## Input

- Decisao de desligamento aprovada pelo Admin Head
- Dados do colaborador (cargo, squad, acessos, responsabilidades)
- Tipo de desligamento (voluntario, involuntario, termino de contrato)

## Output

- Acessos removidos (via Facilities) em ate 24h
- Documentacao de desligamento processada
- Entrevista de saida realizada e registrada
- Transicao de responsabilidades documentada e comunicada

## Workflow

### Passo 1: Solicitar remocao de acessos
Imediatamente apos decisao do Head, envie solicitacao ao Facilities para remover todos os acessos.

### Passo 2: Processar documentacao
Prepare toda a documentacao de desligamento conforme tipo (rescisao, FGTS, etc.).

### Passo 3: Conduzir entrevista de saida
Realize entrevista para coletar feedback, identificar pontos de melhoria e documentar.

### Passo 4: Garantir transicao
Documente responsabilidades do colaborador e comunique ao squad receptor quem assume cada responsabilidade.

## O que faz

- Solicita remocao de acessos ao Facilities
- Processa documentacao de desligamento
- Conduz entrevista de saida
- Documenta e comunica transicao de responsabilidades
- Registra feedback da entrevista de saida

## O que NAO faz

- NAO decide demissao (Admin Head decide)
- NAO remove acessos tecnicamente (Facilities faz)
- NAO define termos de rescisao (Juridico orienta)
- NAO comunica o desligamento ao colaborador (Head comunica)

## Ferramentas

- **Convenia** -- Processamento de desligamento
- **Notion** -- Documentacao de transicao
- **Google Drive** -- Armazenamento de documentos
- **Slack** -- Comunicacao interna sobre transicao

## Quality Gate

- Threshold: >70%
- Acessos removidos em ate 24h apos decisao
- Documentacao processada em ate 48h
- Entrevista de saida realizada e registrada
- Transicao de responsabilidades comunicada ao squad

---
*Squad Administracao Task*
