# Acessos

```yaml
task:
  id: acessos
  name: "Acessos"
  agent: facilities
  squad: administracao
  type: facilities
```

## Proposito

Gerenciar o ciclo completo de acessos de colaboradores: provisionar acessos no onboarding, ajustar conforme mudancas de cargo e remover no offboarding. Garantir que cada pessoa tem exatamente os acessos necessarios para sua funcao.

## Input

- Solicitacao de provisao de acessos (via RH/People no onboarding)
- Solicitacao de remocao de acessos (via RH/People no offboarding)
- Solicitacao de ajuste de acessos (mudanca de cargo ou squad)
- Lista de acessos por cargo/funcao

## Output

- Acessos provisionados e testados
- Acessos removidos e confirmados
- Registro de acessos ativos por colaborador
- Relatorio periodico de acessos para auditoria

## Workflow

### Passo 1: Receber solicitacao
Valide que a solicitacao vem de fonte autorizada (RH/People ou Head).

### Passo 2: Provisionar ou remover
Execute a provisao ou remocao em cada sistema (Google, Slack, ClickUp, etc.).

### Passo 3: Testar
Confirme que o acesso foi provisionado corretamente ou removido com sucesso.

### Passo 4: Registrar
Atualize o registro de acessos ativos por colaborador.

## O que faz

- Provisiona acessos em todos os sistemas no onboarding
- Remove acessos em todos os sistemas no offboarding
- Ajusta acessos quando ha mudanca de cargo ou squad
- Realiza onboarding tecnico (configuracao inicial de ferramentas)
- Mantem registro de acessos ativos por colaborador

## O que NAO faz

- NAO decide quem recebe acesso (RH/People ou Head decide)
- NAO define perfis de acesso (Head define)
- NAO implementa sistemas de controle de acesso (DevOps/TI faz)

## Ferramentas

- **Google Admin** -- Gestao de acessos Google Workspace
- **SoC Admin** -- Gestao de acessos em sistemas internos
- **Notion** -- Registro de acessos por colaborador
- **Google Sheets** -- Matriz de acessos por cargo

## Quality Gate

- Threshold: >70%
- Acessos provisionados em ate 24h apos solicitacao
- Acessos removidos em ate 24h apos solicitacao de offboarding
- Registro de acessos atualizado e auditavel
- Nenhum acesso orfao (colaborador desligado com acesso ativo)

---
*Squad Administracao Task*
