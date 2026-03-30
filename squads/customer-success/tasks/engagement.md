# Engagement

```yaml
task:
  id: engagement
  name: "Engagement"
  agent: cs-retencao
  squad: customer-success
  type: retention
```

## Proposito

Manter contato proativo com clientes ativos, compartilhar novidades relevantes, convidar para eventos e fortalecer o relacionamento. O engajamento proativo previne que o cliente "esfrie" e aumenta o valor percebido do produto.

## Input

- Health scores atualizados (vindo do Health Check)
- Calendario de novidades, eventos e webinars
- Historico de interacoes por cliente
- Conteudo relevante para compartilhar (releases, cases, dicas)

## Output

- Contatos proativos realizados conforme calendario
- Convites para eventos e webinars enviados
- Novidades relevantes compartilhadas por segmento de cliente
- Registro de interacoes no CRM

## Workflow

### Passo 1: Revisar calendario de engajamento
Verificar quais contatos proativos estao programados para o periodo.

### Passo 2: Selecionar conteudo relevante
Escolher novidades, releases, cases ou dicas relevantes para cada segmento de cliente.

### Passo 3: Executar contatos
Enviar mensagens personalizadas, compartilhar conteudo e convidar para eventos.

### Passo 4: Registrar interacoes
Documentar cada contato no CRM com resposta do cliente e proximo passo.

### Passo 5: Avaliar engajamento
Medir taxa de resposta e engajamento para ajustar frequencia e conteudo.

## O que faz

- Faz contato proativo com clientes ativos
- Compartilha novidades e releases relevantes
- Convida para eventos, webinars e conteudo exclusivo
- Registra interacoes e mede engajamento

## O que NAO faz

- NAO vende diretamente (se identifica oportunidade, passa para Upsell Detection)
- NAO resolve tickets de suporte
- NAO faz contato de retencao emergencial (isso e do Churn Prevention)

## Ferramentas

- **Email** -- Comunicacao de novidades e convites
- **WhatsApp** -- Contato rapido e personalizado
- **CRM** -- Registro de interacoes e historico
- **Notion** -- Calendario de engajamento e conteudo

## Quality Gate

- Threshold: >70%
- Contatos proativos realizados conforme calendario
- Conteudo relevante para o segmento do cliente
- Interacoes registradas no CRM
- Taxa de resposta medida e reportada

---
*Squad Customer Success Task*
