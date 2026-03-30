# Domain Audit

```yaml
task:
  id: domain-audit
  name: "Domain Audit"
  agent: "*-domain-auditor"
  squad: auditoria
  type: audit
  parametrized: true
  parameter: squad_path
```

## Proposito

Task generica utilizada por todos os 14 domain auditors (Tier 3) para executar uma auditoria de dominio no squad que auditam. Diferente da auditoria estrutural (squad-completeness-audit), esta task aplica EXPERTISE DE DOMINIO -- verifica se o conteudo faz sentido no contexto do negocio, se fluxos estao coerentes, se delegacoes sao logicas e se quality gates cobrem o que realmente importa para aquele dominio.

## Input

- Campo `audits:` do agente domain-auditor (ex: `squads/ops/`)
- config.yaml do squad auditado
- Todos os arquivos em agents/ e tasks/ do squad auditado
- Expertise de dominio embutida no agente domain-auditor que executa esta task

## Output

- Relatorio de auditoria de dominio contendo:
  - Findings classificados por severidade (critico, alto, medio, baixo)
  - Score de saude do dominio (0-100)
  - Recomendacoes especificas ao dominio
  - Comparacao com auditoria anterior (se existir)

## Workflow

### Passo 1: Carregar contexto do squad
Ler o campo `audits:` do agente para identificar o squad alvo. Ler config.yaml do squad para entender estrutura, tiers, handoffs e workflow.

### Passo 2: Ler todas as definicoes
Ler todos os arquivos em agents/ e tasks/ do squad auditado. Construir mapa mental de capacidades, fluxos e dependencias.

### Passo 3: Aplicar expertise de dominio
Usando o conhecimento especializado do agente domain-auditor, validar:
- **Coerencia de fluxo:** Os handoffs entre agentes fazem sentido no dominio? Ha gaps no fluxo?
- **Completude de dominio:** Todas as funcoes esperadas naquele dominio estao cobertas?
- **Quality gates relevantes:** Os criterios de QG fazem sentido para o dominio? (ex: QG de vendas deve cobrir conversion rate, nao metricas de design)
- **Delegacoes logicas:** Delegacoes para outros squads ou agentes core fazem sentido?
- **Consistencia interna:** Outputs de um agente alimentam corretamente inputs do proximo?
- **Boas praticas do dominio:** O squad segue boas praticas reconhecidas daquele dominio?

### Passo 4: Comparar com auditoria anterior
Se existir relatorio anterior em docs/reviews/, comparar findings para identificar regressoes ou melhorias.

### Passo 5: Gerar relatorio
Consolidar findings em relatorio padrao com:
- Sumario executivo (1-2 linhas)
- Tabela de findings por severidade
- Score de saude (0-100)
- Top 3 recomendacoes
- Status vs auditoria anterior (melhorou/piorou/estavel)

### Passo 6: Reportar ao auditoria-head
Entregar relatorio ao auditoria-head para consolidacao no audit-report geral.

## O que faz

- Valida coerencia de fluxos e handoffs no contexto do dominio
- Verifica se quality gates cobrem criterios relevantes ao dominio
- Detecta gaps de cobertura especificos ao dominio (ex: vendas sem task de follow-up)
- Valida que delegacoes fazem sentido no contexto do negocio
- Verifica consistencia entre inputs e outputs dos agentes do squad
- Avalia se boas praticas do dominio estao refletidas nas definicoes
- Compara com auditorias anteriores para detectar regressoes
- Gera score de saude e recomendacoes acionaveis

## O que NAO faz

- NAO verifica estrutura de arquivos (isso e do squad-completeness-audit, Tier 1)
- NAO verifica cobertura cross-squad (isso e do coverage-analyst, Tier 2)
- NAO verifica delegacoes cross-squad (isso e do alignment-checker, Tier 2)
- NAO corrige problemas -- apenas reporta e recomenda
- NAO modifica nenhum arquivo do squad auditado
- NAO executa processos do squad -- apenas audita as definicoes

## Ferramentas

- **Markdown** -- Leitura de definicoes de agentes e tasks
- **YAML** -- Leitura de config.yaml
- **Sheets** -- Tabela de findings e scoring

## Quality Gate

| Criterio | Threshold | Obrigatorio |
|----------|-----------|-------------|
| Todas as dimensoes de dominio avaliadas | 100% | Sim |
| Findings classificados por severidade | 100% | Sim |
| Score de saude calculado | Presente | Sim |
| Recomendacoes acionaveis | >= 3 | Sim |
| Comparacao com auditoria anterior | Quando disponivel | Nao |

**Pass threshold:** >70% em todos os criterios obrigatorios

---
*Squad Auditoria Task -- Domain Audit (Generic, Tier 3)*
