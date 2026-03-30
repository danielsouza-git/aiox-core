# Content Review

```yaml
task:
  id: content-review
  name: "Content Review"
  agent: content-creator
  squad: produto
  type: content
```

## Proposito

Revisar o conteudo com base no feedback de quality check do CS/Retencao-Produto. O Content Creator corrige problemas identificados, ajusta conteudo e garante que todos os pontos de feedback foram enderecados antes de publicar.

## Input

- Relatorio de quality check do CS/Retencao-Produto com lista de problemas
- Conteudo original criado (content-create)
- Spec do PM com criterios de aceitacao (referencia)

## Output

- Conteudo revisado com todos os pontos de feedback enderecados
- Documento de revisao: o que mudou e por que
- Conteudo pronto para nova rodada de QA ou publicacao

## Workflow

### Passo 1: Analisar feedback
Leia o relatorio de quality check e priorize os problemas por gravidade.

### Passo 2: Corrigir problemas criticos
Enderece primeiro os problemas que impedem publicacao: erros factuais, conteudo faltando, falhas graves de experiencia.

### Passo 3: Ajustar melhorias
Enderece melhorias sugeridas: clareza de explicacao, fluxo de aprendizado, materiais complementares.

### Passo 4: Documentar mudancas
Registre o que foi alterado e por que, para rastreabilidade.

### Passo 5: Reenviar para QA
Envie o conteudo revisado para nova rodada de quality check se houve mudancas significativas.

## O que faz

- Revisa conteudo com base em feedback de QA
- Corrige problemas identificados pelo CS/Retencao-Produto
- Ajusta conteudo para atender criterios de aceitacao
- Documenta mudancas feitas na revisao
- Reenvia para QA se necessario

## O que NAO faz

- NAO ignora feedback de QA sem justificativa
- NAO faz quality check do proprio trabalho revisado
- NAO publica sem aprovacao do QA

## Ferramentas

- **Notion** -- Rastreamento de feedback e mudancas
- **Descript** -- Re-edicao de videos
- **Canva** -- Ajuste de materiais visuais
- **Loom** -- Regravacao de trechos com problemas

## Quality Gate

- Threshold: >70%
- Todos os problemas criticos do feedback foram corrigidos
- Melhorias sugeridas foram enderecadas ou justificadas
- Documento de revisao registra mudancas e razoes
- Conteudo pronto para QA final ou publicacao

---
*Squad Produto Task*
