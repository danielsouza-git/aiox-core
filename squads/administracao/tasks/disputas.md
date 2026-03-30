# Disputas

```yaml
task:
  id: disputas
  name: "Disputas"
  agent: juridico
  squad: administracao
  type: legal
```

## Proposito

Gerenciar disputas juridicas recebidas pela empresa: traduzir reclamacoes em linguagem juridica, coordenar com advogado externo, acompanhar casos em andamento e documentar resolucao. Nenhuma negociacao acontece sem aprovacao do Admin Head.

## Input

- Reclamacao ou disputa recebida (cliente, fornecedor, colaborador, orgao regulador)
- Documentacao de suporte (contratos, emails, evidencias)
- Orientacao do advogado externo
- Aprovacao do Head para estrategia de negociacao

## Output

- Disputa traduzida em linguagem juridica com analise de risco
- Plano de acao coordenado com advogado externo
- Acompanhamento de casos com status atualizado
- Resolucao documentada (acordo, sentenca, arquivamento)

## Workflow

### Passo 1: Receber e analisar reclamacao
Avalie a reclamacao, colete documentacao de suporte e traduza em linguagem juridica.

### Passo 2: Avaliar risco e estrategia
Classifique o risco (baixo, medio, alto) e proponha estrategia ao Head para aprovacao.

### Passo 3: Coordenar com advogado externo
Encaminhe ao advogado externo com contexto completo. Acompanhe orientacoes.

### Passo 4: Acompanhar e documentar
Mantenha status atualizado de cada caso. Documente resolucao final.

## O que faz

- Traduz reclamacoes em linguagem juridica
- Classifica risco e propoe estrategia de resposta
- Coordena com advogado externo para casos que exigem representacao
- Acompanha casos em andamento com status atualizado
- Documenta resolucao de cada caso

## O que NAO faz

- NAO negocia sem aprovacao do Admin Head
- NAO representa a empresa em juizo (advogado externo)
- NAO toma decisoes de acordo sem autorizacao
- NAO ignora prazos legais -- escala imediatamente se prazo em risco

## Ferramentas

- **Notion** -- Acompanhamento de casos e status
- **Google Docs** -- Documentacao de analises e pareceres
- **Email** -- Comunicacao com advogado externo e partes
- **Google Drive** -- Armazenamento de evidencias e documentos

## Quality Gate

- Threshold: >70%
- Disputa analisada em ate 72h apos recebimento
- Risco classificado e estrategia proposta ao Head
- Advogado externo envolvido em casos de medio/alto risco
- Prazos legais cumpridos sem excecao
- Resolucao documentada com aprendizados

---
*Squad Administracao Task*
