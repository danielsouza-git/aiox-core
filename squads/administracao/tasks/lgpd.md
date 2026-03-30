# LGPD

```yaml
task:
  id: lgpd
  name: "LGPD"
  agent: compliance
  squad: administracao
  type: compliance
```

## Proposito

Garantir conformidade com a Lei Geral de Protecao de Dados (LGPD): mapear fluxos de dados pessoais na empresa, testar conformidade com direitos dos titulares e garantir transparencia no tratamento de dados. A implementacao tecnica e feita por TI/DevOps, o Compliance mapeia e valida.

## Input

- Mapeamento de sistemas que tratam dados pessoais
- Fluxos de dados entre sistemas e areas
- Solicitacoes de titulares (acesso, retificacao, exclusao)
- Atualizacoes na legislacao de protecao de dados

## Output

- Mapeamento completo de fluxos de dados pessoais
- Resultado de testes de conformidade com direitos dos titulares
- Relatorio de gaps de conformidade com plano de remediacao
- Recomendacoes de melhoria para areas e sistemas

## Workflow

### Passo 1: Mapear fluxos de dados
Identifique onde dados pessoais sao coletados, armazenados, processados e compartilhados.

### Passo 2: Verificar bases legais
Confirme que cada tratamento de dados tem base legal adequada (consentimento, contrato, obrigacao legal, etc.).

### Passo 3: Testar direitos dos titulares
Simule solicitacoes de acesso, retificacao e exclusao para verificar se os processos funcionam.

### Passo 4: Documentar e recomendar
Documente gaps encontrados e crie plano de remediacao com responsaveis e prazos.

## O que faz

- Mapeia fluxos de dados pessoais na empresa
- Verifica bases legais para cada tratamento de dados
- Testa conformidade com direitos dos titulares (acesso, retificacao, exclusao)
- Identifica gaps de conformidade e recomenda correcoes
- Garante transparencia no tratamento de dados
- Acompanha mudancas na legislacao de protecao de dados

## O que NAO faz

- NAO implementa tecnicamente (TI/DevOps implementa sistemas, cookies, APIs)
- NAO substitui DPO (Data Protection Officer) quando exigido
- NAO redige termos de uso (Juridico redige)
- NAO toma decisoes de arquitetura de dados (Architect ou Data Engineer faz)

## Ferramentas

- **Notion** -- Mapeamento de fluxos e documentacao
- **Google Sheets** -- Inventario de tratamentos de dados
- **Google Docs** -- Relatorios de conformidade
- **Checklist** -- Checklists de verificacao LGPD

## Quality Gate

- Threshold: >70%
- Fluxos de dados pessoais mapeados e atualizados
- Bases legais verificadas para cada tratamento
- Testes de direitos dos titulares executados e documentados
- Gaps identificados com plano de remediacao
- Nenhum tratamento de dados sem base legal documentada

---
*Squad Administracao Task*
