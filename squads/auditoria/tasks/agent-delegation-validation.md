# Agent Delegation Validation

```yaml
task:
  id: agent-delegation-validation
  name: "Agent Delegation Validation"
  agent: alignment-checker
  squad: auditoria
  type: validation
```

## Proposito

Verificar que todas as referencias de delegacao entre agentes de squads de negocio e agentes core do AIOX (ou outros squads) estao corretas, bidirecionais quando aplicavel e sem duplicacao de capacidade nao-declarada.

## Input

- Todas as definicoes de squads (config.yaml + agents/*.md)
- Definicoes de agentes core do AIOX (.aiox-core/development/agents/)
- Lista de delegacoes conhecidas (ex: product-manager -> @pm, research-analyst -> research-intelligence)

## Output

- Relatorio de validacao de delegacao contendo: delegacoes corretas, delegacoes quebradas (referencia aponta para agente inexistente), delegacoes faltando (duplicacao sem delegacao), duplicacoes de capacidade detectadas

## Workflow

### Passo 1: Extrair delegacoes declaradas
Ler todos os arquivos de agentes de squad e identificar delegacoes explicitamente declaradas (textos como "delega para @pm", "consome output de research-intelligence").

### Passo 2: Validar alvos de delegacao
Para cada delegacao declarada, verificar que o agente/squad alvo existe e esta acessivel.

### Passo 3: Verificar bidirecionalidade
Quando uma delegacao deve ser bidirecional, verificar que o alvo tambem referencia o squad de origem.

### Passo 4: Detectar duplicacoes sem delegacao
Identificar agentes de squad que oferecem capacidades similares a agentes core sem declarar delegacao explicita. Ex: um agente de squad que faz "pesquisa de mercado" sem delegar para @analyst.

### Passo 5: Gerar relatorio
Consolidar findings com classificacao: correto, quebrado, faltando, duplicacao.

## O que faz

- Valida que product-manager -> @pm (Morgan) esta configurado corretamente
- Valida que research-analyst -> research-intelligence esta configurado corretamente
- Detecta agentes de squad que duplicam capacidade de agente core sem delegacao
- Verifica bidirecionalidade de delegacoes quando aplicavel
- Classifica findings por tipo e severidade

## O que NAO faz

- NAO cria ou corrige delegacoes
- NAO modifica arquivos de agentes
- NAO avalia a qualidade da delegacao (se funciona bem na pratica)
- NAO audita completude estrutural (isso e do squad-auditor)

## Ferramentas

- **Markdown** -- Leitura de definicoes de agentes
- **Sheets** -- Tabela de delegacoes e status
- **Notion** -- Documentacao do relatorio

## Quality Gate

- Threshold: >70%
- Todas as delegacoes declaradas validadas
- Duplicacoes sem delegacao identificadas
- Findings classificados por severidade
- Delegacoes core conhecidas todas verificadas (@pm, research-intelligence)

---
*Squad Auditoria Task*
