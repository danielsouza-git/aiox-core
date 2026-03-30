# Content Publish

```yaml
task:
  id: content-publish
  name: "Content Publish"
  agent: content-creator
  squad: produto
  type: content
```

## Proposito

Publicar o conteudo finalizado na plataforma de entrega, organizando a estrutura de modulos/aulas e testando o acesso do aluno/cliente. A publicacao e a etapa final de producao -- o conteudo deve estar aprovado pelo QA antes de publicar.

## Input

- Conteudo aprovado pelo CS/Retencao-Produto (quality check passado)
- Estrutura de modulos e aulas definida
- Acesso a plataforma de publicacao

## Output

- Conteudo publicado e acessivel na plataforma
- Estrutura de modulos/aulas organizada
- Teste de acesso realizado como aluno
- Confirmacao de publicacao para Product Manager

## Workflow

### Passo 1: Preparar plataforma
Configure a estrutura do curso/produto na plataforma: modulos, aulas, ordem de apresentacao.

### Passo 2: Fazer upload
Suba videos, textos, materiais complementares e recursos para a plataforma.

### Passo 3: Organizar estrutura
Organize a ordem dos modulos e aulas, configure pre-requisitos se houver, ajuste permissoes de acesso.

### Passo 4: Testar como aluno
Acesse o produto como aluno/cliente e navegue por toda a experiencia: videos tocam, materiais abrem, ordem esta correta.

### Passo 5: Confirmar publicacao
Comunique ao Product Manager que o conteudo esta publicado e pronto.

## O que faz

- Faz upload de conteudo para a plataforma
- Organiza estrutura de modulos e aulas
- Configura ordem e pre-requisitos
- Testa acesso como aluno/cliente
- Confirma publicacao para o PM

## O que NAO faz

- NAO configura plataforma tecnicamente (integracao, dominio, pagamento -- pede ao OPS)
- NAO publica sem aprovacao do QA
- NAO cria a conta do aluno ou gerencia acessos
- NAO faz marketing do lancamento

## Ferramentas

- **Hotmart / Kajabi / Teachable** -- Plataformas de publicacao
- **Notion** -- Checklist de publicacao
- **Loom** -- Gravacao de teste de acesso como evidencia

## Quality Gate

- Threshold: >70%
- Conteudo acessivel na plataforma
- Estrutura de modulos/aulas organizada corretamente
- Teste como aluno realizado sem problemas
- PM informado sobre publicacao

---
*Squad Produto Task*
