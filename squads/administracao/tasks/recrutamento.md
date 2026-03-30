# Recrutamento

```yaml
task:
  id: recrutamento
  name: "Recrutamento"
  agent: rh-people
  squad: administracao
  type: hr
```

## Proposito

Publicar vagas, triar candidatos e agendar entrevistas para posicoes aprovadas pelo Admin Head. Garantir um pipeline de recrutamento eficiente onde os melhores candidatos chegam ate a fase de entrevista tecnica com o squad receptor.

## Input

- Solicitacao de contratacao aprovada pelo Admin Head
- Descricao da vaga (perfil, requisitos, salario, beneficios)
- Squad receptor que fara entrevista tecnica

## Output

- Vagas publicadas nas plataformas corretas
- Candidatos triados com ranking por aderencia ao perfil
- Entrevistas agendadas com candidatos qualificados
- Candidatos encaminhados para entrevista tecnica do squad

## Workflow

### Passo 1: Receber e validar solicitacao
Confirme que a contratacao foi aprovada pelo Head e que a descricao da vaga esta completa.

### Passo 2: Publicar vaga
Publique nas plataformas adequadas ao perfil (LinkedIn, portais, indicacoes).

### Passo 3: Triar candidatos
Avalie curriculos recebidos contra criterios da vaga. Faca ranking por aderencia.

### Passo 4: Agendar entrevistas
Agende entrevistas com candidatos qualificados. Coordene com o squad receptor para entrevista tecnica.

## O que faz

- Publica vagas em plataformas de recrutamento
- Faz triagem de curriculos com criterios claros
- Agenda entrevistas iniciais (fit cultural, expectativas)
- Encaminha candidatos para entrevista tecnica do squad
- Acompanha pipeline de candidatos

## O que NAO faz

- NAO decide contratacao (Admin Head decide)
- NAO faz entrevista tecnica (squad receptor faz)
- NAO negocia salario final (Head define)
- NAO busca candidatos proativamente sem vaga aprovada

## Ferramentas

- **LinkedIn** -- Publicacao de vagas e busca ativa
- **Notion** -- Pipeline de candidatos
- **ClickUp** -- Acompanhamento do processo
- **Google Sheets** -- Ranking de candidatos
- **Typeform** -- Formularios de triagem

## Quality Gate

- Threshold: >70%
- Vaga publicada em ate 48h apos aprovacao
- Triagem com criterios documentados e ranking
- Entrevistas agendadas em ate 5 dias uteis apos triagem
- Feedback dado a todos os candidatos (aprovados e reprovados)

---
*Squad Administracao Task*
