# Test QA Gates

```yaml
task:
  id: test-qa-gates
  name: "Test QA Gates"
  agent: process-validator
  squad: ops
  type: validation
```

## Proposito

Executar as checklists de validacao no processo completo, testar com um "leigo" que nao conhece o processo e determinar se o processo esta pronto para ENTREGA ou se precisa de correcoes. Este e o Quality Gate FINAL antes da entrega.

## Input

- Checklists de validacao (output do Design QA Gates)
- Processo completo no ClickUp com automacoes ativadas
- Acesso a um "leigo" para teste de usabilidade do processo

## Output

- Processo validado e pronto para ENTREGA (se aprovado >70%)
- OU lista de correcoes necessarias indicando exatamente qual etapa deve corrigir o que (se reprovado <70%)

## Workflow

### Passo 1: Executar checklist no processo
Percorra todo o processo usando a checklist de validacao, verificando cada criterio.

### Passo 2: Validar automacoes end-to-end
Teste cada automacao no fluxo real -- triggers disparam? Cards movem? Notificacoes chegam?

### Passo 3: Testar com "leigo"
Peca a alguem que nao conhece o processo para executar do inicio ao fim. Observe onde trava, onde confunde, onde erra.

### Passo 4: Documentar problemas encontrados
Registre cada problema com: onde ocorreu, qual a severidade, qual a etapa responsavel.

### Passo 5: Decisao -- aprovar ou reprovar
Se >70% dos criterios sao atendidos e nenhum bloqueio critico existe: APROVAR para ENTREGA.
Se <70% ou bloqueio critico: REPROVAR e indicar qual etapa deve corrigir.

## O que faz

- Executa checklist de validacao no processo completo
- Valida que todas as automacoes funcionam end-to-end
- Testa com um "leigo" que nao conhece o processo
- Documenta todos os problemas encontrados
- Aprova (>70%) ou reprova (<70%) o processo
- Se reprovar, indica exatamente qual etapa deve corrigir o que

## O que NAO faz

- NAO corrige os problemas encontrados (indica quem deve corrigir)
- NAO altera automacoes ou estrutura
- NAO redesenha o processo

## Ferramentas

- **Notion** -- Registro de resultados de teste
- **ClickUp** -- Execucao da checklist no processo real
- **Markdown** -- Documentacao de problemas encontrados
- **Loom** -- Gravacao do teste com leigo para evidencia

## Quality Gate

- Threshold: >70%
- Este e o **Quality Gate FINAL** do fluxo OPS
- Processo executa end-to-end sem erros criticos
- Leigo consegue executar o processo sem ajuda significativa
- Automacoes funcionam conforme documentado
- Todos os criterios das checklists sao atendidos
- Se aprovado (>70%), processo e liberado para **ENTREGA**
- Se reprovado, volta para a etapa indicada com lista de correcoes

---
*Squad OPS Task*
