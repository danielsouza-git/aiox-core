# Build Sequence

```yaml
task:
  id: build-sequence
  name: "Build Sequence"
  agent: email-strategist
  squad: marketing
  type: email
```

## Proposito

Definir calendario de disparo, segmentar audiencia por etapa do funil, montar sequencias de email automatizadas e agendar disparos nos horarios de melhor performance. O resultado e uma sequencia pronta e agendada.

## Input

- Lista segmentada (output do Write Email)
- Copy de emails aprovados por COPY
- Calendario de lancamentos e campanhas do Head
- Dados de melhor horario de disparo por segmento

## Output

- Sequencias de email configuradas e agendadas (welcome, nurture, reengajamento, lancamento)
- Calendario de disparo documentado
- Automacoes de email configuradas no ActiveCampaign

## Workflow

### Passo 1: Definir calendario de disparo
Planejar datas e horarios de cada email da sequencia, considerando intervalos adequados entre disparos.

### Passo 2: Segmentar audiencia por etapa
Selecionar segmentos corretos para cada sequencia (novos leads -> welcome, frios -> reengajamento, etc.).

### Passo 3: Montar sequencia no ActiveCampaign
Configurar automacao com triggers, condicoes, delays e acoes para cada email da sequencia.

### Passo 4: Inserir copy aprovado
Carregar textos e templates aprovados por COPY em cada etapa da sequencia.

### Passo 5: Agendar e testar
Agendar sequencia, enviar teste para si mesmo e verificar que tudo funciona corretamente.

## O que faz

- Define calendario de disparo de emails
- Segmenta audiencia por etapa do funil
- Monta sequencias de email (welcome, nurture, reengajamento, lancamento)
- Configura automacoes de email no ActiveCampaign
- Agenda disparos nos horarios de melhor performance
- Testa sequencias antes de ativar

## O que NAO faz

- NAO escreve copy de emails (pede a COPY)
- NAO cria automacoes externas ao email (pede ao OPS)
- NAO define estrategia de marketing geral
- NAO dispara sem copy aprovado por COPY

## Ferramentas

- **ActiveCampaign** -- Configuracao de automacoes e sequencias
- **Google Sheets** -- Planejamento de calendario de disparo

## Quality Gate

- [ ] Sequencias configuradas com triggers e condicoes corretas
- [ ] Copy aprovado por COPY inserido em cada email
- [ ] Horarios de disparo baseados em dados de performance
- [ ] Teste de sequencia executado com sucesso
- [ ] Calendario de disparo documentado

---
*Squad Marketing Task*
