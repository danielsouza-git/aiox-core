# Quality Check

```yaml
task:
  id: quality-check
  name: "Quality Check"
  agent: cs-retencao-produto
  squad: produto
  type: quality
```

## Proposito

Revisar o conteudo criado pelo Content Creator antes da publicacao, validando contra a spec do Product Manager. O quality check garante que o produto atende aos criterios de aceitacao e aos padroes de qualidade antes de chegar ao cliente.

## Input

- Conteudo criado pelo Content Creator (pre-publicacao)
- Spec do Product Manager com criterios de aceitacao
- Padrao de qualidade definido pelo Produto Head

## Output

- Relatorio de quality check: APROVADO ou LISTA DE CORRECOES
- Lista detalhada de problemas encontrados com severidade
- Recomendacoes de melhoria

## Workflow

### Passo 1: Ler spec do PM
Entenda os criterios de aceitacao: o que o produto deve ter, para quem e em que formato.

### Passo 2: Revisar completude
Verifique se todo o conteudo especificado na spec foi criado: modulos, aulas, materiais.

### Passo 3: Revisar qualidade
Avalie a qualidade do conteudo: clareza, profundidade, coerencia, ausencia de erros factuais.

### Passo 4: Classificar problemas
Para cada problema encontrado, classifique: critico (bloqueia publicacao), importante (deve corrigir), sugestao (pode melhorar).

### Passo 5: Gerar relatorio
Consolide os achados em um relatorio claro para o Content Creator.

## O que faz

- Revisa conteudo antes de publicar
- Valida contra spec do PM e criterios de aceitacao
- Verifica completude do conteudo
- Identifica erros factuais, lacunas e inconsistencias
- Classifica problemas por severidade
- Gera relatorio de quality check

## O que NAO faz

- NAO cria ou corrige o conteudo (isso e do Content Creator)
- NAO aprova publicacao sozinho (apenas gera relatorio)
- NAO testa a experiencia como usuario (isso e do Test Experience)
- NAO define criterios de aceitacao (isso vem da spec do PM)

## Ferramentas

- **Notion** -- Documentacao do quality check e relatorio
- **Google Sheets** -- Checklist de validacao
- **Loom** -- Gravacao de problemas encontrados

## Quality Gate

- Threshold: >70%
- Todos os criterios de aceitacao da spec foram verificados
- Problemas classificados por severidade
- Relatorio claro e acionavel para Content Creator
- Nenhum problema critico sem documentacao

---
*Squad Produto Task*
