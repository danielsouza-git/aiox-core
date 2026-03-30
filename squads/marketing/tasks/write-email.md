# Write Email

```yaml
task:
  id: write-email
  name: "Write Email"
  agent: email-strategist
  squad: marketing
  type: email
```

## Proposito

Segmentar a lista de contatos por comportamento, definir tags e lead scores, e remover inativos da base ativa. O resultado e uma base limpa e segmentada pronta para receber sequencias de email.

## Input

- Base de contatos com dados comportamentais (aberturas, cliques, compras)
- Regras de segmentacao definidas pela estrategia do Head
- Historico de interacoes por contato

## Output

- Lista segmentada por comportamento (ativos, mornos, frios, inativos)
- Tags e lead scores definidos e aplicados
- Contatos inativos removidos da base ativa
- Base pronta para receber sequencias de email

## Workflow

### Passo 1: Analisar base de contatos
Revisar dados comportamentais da base: taxas de abertura, cliques, compras e ultimo engajamento.

### Passo 2: Definir segmentos
Criar segmentos baseados em comportamento: ativos (engajaram nos ultimos 30 dias), mornos (30-60 dias), frios (60-90 dias), inativos (90+ dias).

### Passo 3: Aplicar tags e scores
Definir tags por interesse, etapa do funil e comportamento. Aplicar lead scoring baseado em engajamento.

### Passo 4: Remover inativos
Mover contatos inativos (90+ dias sem engajamento) para lista de exclusao, mantendo base limpa.

### Passo 5: Documentar segmentacao
Registrar criterios de segmentacao, quantidade por segmento e regras aplicadas.

## O que faz

- Segmenta lista por comportamento (abertura, cliques, compras)
- Define e gerencia tags por interesse e etapa do funil
- Aplica lead scores baseados em engajamento
- Remove contatos inativos da base ativa
- Mantem base limpa e atualizada

## O que NAO faz

- NAO escreve copy de emails (pede a COPY)
- NAO dispara emails (aguarda copy aprovado)
- NAO cria templates visuais (pede a COPY)
- NAO define estrategia geral de marketing

## Ferramentas

- **ActiveCampaign** -- Segmentacao, tags, lead scoring e gestao de listas
- **Google Sheets** -- Documentacao de segmentos e criterios

## Quality Gate

- [ ] Segmentos definidos com criterios claros e documentados
- [ ] Tags e lead scores aplicados corretamente
- [ ] Inativos removidos da base ativa
- [ ] Quantidade por segmento registrada
- [ ] Base pronta para receber sequencias

---
*Squad Marketing Task*
