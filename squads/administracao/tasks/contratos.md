# Contratos

```yaml
task:
  id: contratos
  name: "Contratos"
  agent: juridico
  squad: administracao
  type: legal
```

## Proposito

Redigir e revisar contratos para clientes, fornecedores e colaboradores CLT, alem de termos LGPD. Garantir que todos os contratos estejam em conformidade legal e protejam os interesses da empresa antes da assinatura.

## Input

- Solicitacao de contrato (tipo: cliente, fornecedor, CLT, LGPD)
- Dados da parte contratante e termos comerciais acordados
- Modelo de contrato existente (se houver)
- Observacoes do advogado externo (se revisao)

## Output

- Contrato redigido e revisado pronto para assinatura
- Termos LGPD atualizados (quando aplicavel)
- Parecer sobre riscos juridicos identificados
- Contrato assinado digitalmente e arquivado

## Workflow

### Passo 1: Receber e analisar solicitacao
Identifique o tipo de contrato, partes envolvidas e termos comerciais acordados.

### Passo 2: Redigir ou revisar
Use modelo existente como base. Adapte clausulas conforme necessidade. Para contratos novos, redija do zero.

### Passo 3: Validar com advogado externo
Envie para revisao do advogado externo. Incorpore observacoes e ajustes.

### Passo 4: Coletar assinatura
Envie para assinatura digital via DocuSign/Clicksign. Arquive contrato assinado.

## O que faz

- Redige contratos para clientes, fornecedores e CLT
- Revisa contratos existentes quando ha alteracao
- Cria e atualiza termos LGPD
- Coordena revisao com advogado externo
- Coleta assinatura digital e arquiva

## O que NAO faz

- NAO audita contratos sozinho (advogado externo valida)
- NAO define termos comerciais (area solicitante define)
- NAO negocia clausulas com a outra parte sem aprovacao do Head

## Ferramentas

- **Google Docs** -- Redacao e revisao de contratos
- **DocuSign** -- Assinatura digital
- **Clicksign** -- Assinatura digital alternativa
- **Google Drive** -- Armazenamento de contratos assinados
- **Email** -- Comunicacao com advogado externo

## Quality Gate

- Threshold: >70%
- Contrato revisado por advogado externo antes de assinatura
- Clausulas LGPD presentes quando aplicavel
- Riscos juridicos documentados e comunicados
- Contrato assinado e arquivado corretamente

---
*Squad Administracao Task*
