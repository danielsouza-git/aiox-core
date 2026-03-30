# Test Experience

```yaml
task:
  id: test-experience
  name: "Test Experience"
  agent: cs-retencao-produto
  squad: produto
  type: quality
```

## Proposito

Testar a experiencia completa do produto como aluno/cliente, navegando por toda a jornada como um usuario real. O objetivo e identificar problemas de usabilidade, fluxo e conteudo que so aparecem quando alguem usa o produto de ponta a ponta.

## Input

- Conteudo publicado na plataforma (ou em ambiente de teste)
- Spec do PM com a jornada esperada do usuario
- Criterios de experiencia: o que o usuario deve conseguir fazer

## Output

- Relatorio de teste de experiencia com problemas encontrados
- Gravacoes de tela mostrando os problemas
- Classificacao de problemas por impacto na experiencia do usuario

## Workflow

### Passo 1: Criar cenario de teste
Defina o percurso que um aluno/cliente faria: acesso, navegacao, consumo, conclusao.

### Passo 2: Navegar como usuario
Acesse o produto como se fosse um aluno novo, sem conhecimento previo.

### Passo 3: Documentar problemas
Registre cada problema encontrado: o que tentou fazer, o que aconteceu, o que esperava.

### Passo 4: Gravar evidencias
Grave a tela mostrando os problemas para facilitar a correcao.

### Passo 5: Classificar por impacto
Classifique: bloqueante (impede uso), grave (dificulta uso), menor (incomoda mas funciona).

## O que faz

- Testa experiencia completa como aluno/cliente
- Navega por toda a jornada do usuario
- Identifica problemas de usabilidade e fluxo
- Grava evidencias de problemas encontrados
- Classifica problemas por impacto na experiencia

## O que NAO faz

- NAO corrige os problemas (passa para Content Creator ou OPS)
- NAO testa a plataforma tecnicamente (bugs de sistema -- reporta ao OPS)
- NAO cria conteudo de teste (usa o conteudo real)
- NAO substitui testes com usuarios reais (e complementar)

## Ferramentas

- **Hotmart / Kajabi / Teachable** -- Plataforma de teste de experiencia
- **Loom** -- Gravacao de tela com evidencias
- **Notion** -- Documentacao de problemas encontrados
- **Google Sheets** -- Classificacao e priorizacao de problemas

## Quality Gate

- Threshold: >70%
- Jornada completa testada ponta a ponta
- Problemas documentados com evidencias
- Classificacao por impacto realizada
- Gravacoes de problemas criticos incluidas

---
*Squad Produto Task*
