# Lead Scoring

```yaml
task:
  id: lead-scoring
  name: "Lead Scoring"
  agent: sdr
  squad: vendas
  type: prospecting
```

## Proposito

Pontuar leads brutos recebidos de Marketing ou CS com base no fit com o ICP (Ideal Customer Profile), gerando um score de 0-100 e classificacao de prioridade para direcionar o esforco de qualificacao.

## Input

- Lead bruto com dados disponiveis (nome, empresa, cargo, setor, tamanho, fonte)
- Criterios de ICP definidos pelo negocio
- Historico de conversao por perfil (quando disponivel)

## Output

- Lead com score numerico de 0 a 100
- Classificacao de prioridade: Alta (70-100), Media (40-69), Baixa (0-39)
- Justificativa do score por criterio avaliado
- Recomendacao: qualificar agora, monitorar ou descartar

## Workflow

1. Receber lead bruto e verificar dados minimos disponiveis
2. Avaliar fit demografico: setor, tamanho da empresa, localizacao
3. Avaliar fit do contato: cargo, nivel de decisao, departamento
4. Avaliar sinais de intencao: fonte do lead, paginas visitadas, conteudo baixado
5. Calcular score ponderado (demografico 40%, contato 30%, intencao 30%)
6. Classificar prioridade com base no score
7. Registrar score e justificativa no CRM
8. Encaminhar leads Alta prioridade para qualificacao BANT

## O que faz

- Aplica modelo de scoring baseado em criterios objetivos
- Pondera cada dimensao conforme relevancia para o negocio
- Documenta justificativa para auditoria e melhoria do modelo
- Prioriza a fila de trabalho do SDR

## O que NAO faz

- NAO qualifica o lead (scoring e etapa anterior a qualificacao)
- NAO contata o lead
- NAO modifica criterios de ICP sem aprovacao do Head

## Ferramentas

- CRM (registro e consulta de dados do lead)
- Google Sheets (modelo de scoring auxiliar)

## Quality Gate

- [ ] Score calculado com todos os criterios disponiveis
- [ ] Prioridade classificada corretamente
- [ ] Justificativa documentada no CRM
- [ ] Leads de alta prioridade encaminhados para qualificacao

---
*Squad Vendas Task*
