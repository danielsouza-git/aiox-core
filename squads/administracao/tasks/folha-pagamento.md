# Folha de Pagamento

```yaml
task:
  id: folha-pagamento
  name: "Folha de Pagamento"
  agent: rh-people
  squad: administracao
  type: hr
```

## Proposito

Processar a folha de pagamento mensal de todos os colaboradores, garantindo que salarios, beneficios, descontos e encargos estejam corretos e sejam pagos no prazo. Manter conformidade com legislacao trabalhista vigente.

## Input

- Lista atualizada de colaboradores ativos (RH/People)
- Salarios base, adicionais e beneficios por colaborador
- Horas extras, faltas e atrasos do periodo
- Descontos (INSS, IRRF, vale transporte, plano de saude, etc.)
- Eventuais alteracoes salariais aprovadas pelo Admin Head

## Output

- Folha de pagamento processada e validada
- Holerites gerados para cada colaborador
- Guias de recolhimento (INSS, FGTS, IRRF)
- Relatorio de custo de pessoal do mes
- Comprovantes de pagamento agendados/executados

## Workflow

### Passo 1: Coletar dados do periodo
Reuna informacoes de ponto, horas extras, faltas, beneficios e alteracoes salariais aprovadas.

### Passo 2: Calcular folha
Processe salarios brutos, aplique descontos legais (INSS, IRRF) e beneficios (VT, VR, plano de saude). Calcule encargos patronais (FGTS, INSS patronal).

### Passo 3: Validar calculos
Confira valores contra o mes anterior. Identifique variacoes significativas e valide com Admin Head se necessario.

### Passo 4: Gerar holerites e guias
Produza holerites individuais e guias de recolhimento de tributos e encargos.

### Passo 5: Executar pagamento
Agende ou execute transferencias bancarias. Confirme recebimento e arquive comprovantes.

### Passo 6: Reportar
Envie relatorio de custo de pessoal ao Admin Head com comparativo mensal.

## O que faz

- Processa folha de pagamento mensal completa
- Calcula salarios, descontos legais e encargos
- Gera holerites e guias de recolhimento
- Agenda e executa pagamentos no prazo
- Produz relatorio mensal de custo de pessoal
- Mantem historico de folhas processadas

## O que NAO faz

- NAO decide reajustes salariais (Admin Head decide)
- NAO contrata ou demite (RH/People + Admin Head)
- NAO negocia beneficios com fornecedores (Facilities faz)
- NAO substitui contabilidade externa para obrigacoes acessorias (eSocial, RAIS, DIRF)
- NAO faz planejamento orcamentario de pessoal (Admin Head faz)

## Ferramentas

- **Conta Azul / Omie** -- Processamento contabil e folha
- **Convenia** -- Gestao de beneficios e holerites
- **Google Sheets** -- Conferencia e relatorios auxiliares
- **Banco** -- Execucao de pagamentos
- **eSocial** -- Envio de eventos trabalhistas (via contabilidade)

## Quality Gate

- Threshold: >70%
- Folha processada ate dia 25 de cada mes
- Zero erros em descontos legais (INSS, IRRF)
- Holerites disponiveis ate 2 dias uteis antes do pagamento
- Guias de recolhimento geradas e validadas
- Relatorio de custo enviado ao Head ate dia 28
- Variacao superior a 5% em relacao ao mes anterior requer justificativa documentada

---
*Squad Administracao Task*
