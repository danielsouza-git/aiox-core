# Discovery Process

```yaml
task:
  id: discovery-process
  name: "Discovery Process"
  agent: process-mapper
  squad: ops
  type: process
```

## Proposito

Mapear o processo atual do fim ao inicio, identificando todas as etapas, gargalos, responsaveis e caminhos de erro possiveis. O resultado e um documento completo do estado atual ("as-is") que serve como base para o desenho do novo processo.

## Input

- Pedido de mapeamento de qualquer squad, recebido via OPS Head
- Contexto do problema: onde ha gargalo, o que esta falhando, quem esta envolvido
- Acesso a stakeholders para entrevistas

## Output

- Documento de processo atual mapeado contendo: etapas, responsaveis, ferramentas usadas, gargalos identificados, caminhos de erro, tempos estimados por etapa

## Workflow

### Passo 1: Entender o resultado desejado
Comece pelo fim -- defina claramente qual e o output esperado do processo e trabalhe de tras para frente.

### Passo 2: Mapear etapas e responsaveis
Identifique cada etapa do processo, quem executa, com quais ferramentas e quanto tempo leva.

### Passo 3: Identificar gargalos e pontos de falha
Documente onde o processo trava, onde ha dependencia de pessoa especifica e onde erros acontecem com frequencia.

### Passo 4: Documentar caminhos de erro
Mapeie todos os caminhos alternativos quando algo da errado -- o que acontece se um campo nao e preenchido, se uma aprovacao atrasa, se um sistema cai.

### Passo 5: Entrevistar stakeholders
Converse com quem executa o processo e com quem recebe o output. Grave walkthroughs do processo sendo executado.

### Passo 6: Consolidar documento
Reuna tudo em um documento unico com fluxograma visual e descricao textual de cada etapa.

## O que faz

- Mapeia processo do fim ao inicio
- Identifica etapas, gargalos e pontos de falha
- Descobre quem faz o que e com quais ferramentas
- Documenta caminhos de erro possiveis
- Entrevista stakeholders
- Grava processo sendo executado (screencast, walkthrough)

## O que NAO faz

- NAO desenha o novo processo (isso e do Create Process)
- NAO implementa nada no ClickUp
- NAO cria automacoes
- NAO executa as tasks do processo

## Ferramentas

- **Notion** -- Documentacao do mapeamento
- **Loom** -- Gravacao de entrevistas e walkthroughs
- **Miro** -- Mapeamento visual colaborativo
- **Google Docs** -- Documentacao compartilhada

## Quality Gate

- Threshold: >70%
- Todas as etapas do processo estao documentadas
- Gargalos identificados com evidencia
- Caminhos de erro mapeados
- Responsaveis listados para cada etapa
- Stakeholders validaram o mapeamento

---
*Squad OPS Task*
