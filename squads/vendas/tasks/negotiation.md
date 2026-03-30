# Negotiation

```yaml
task:
  id: negotiation
  name: "Negotiation"
  agent: closer
  squad: vendas
  type: closing
```

## Proposito

Tratar objecoes do lead apos envio da proposta, negociar termos comerciais dentro da alçada aprovada e mover o deal para decisao final de fechamento.

## Input

- Objecoes apresentadas pelo lead
- Proposta comercial enviada
- Politica de descontos e alçada do Closer
- Historico de negociacao no CRM

## Output

- Objecoes tratadas e documentadas
- Termos ajustados (se necessario) dentro da alçada
- Deal pronto para fechamento ou perdido com motivo
- Solicitacao de aprovacao ao Head (se desconto fora da alçada)

## Workflow

1. Identificar e classificar objecoes (preco, timing, funcionalidade, confianca)
2. Preparar respostas com base em dados e cases
3. Conduzir conversa de negociacao com foco em valor (nao preco)
4. Se desconto necessario e dentro da alçada: aplicar e documentar
5. Se desconto fora da alçada: solicitar aprovacao do Head
6. Registrar cada rodada de negociacao no CRM
7. Se objecoes tratadas: mover para close-deal
8. Se deal perdido: registrar motivo detalhado

## O que faz

- Trata objecoes com tecnicas consultivas focadas em valor
- Negocia termos dentro da alçada definida
- Escala para Head quando necessario
- Documenta cada interacao e ajuste

## O que NAO faz

- NAO aplica desconto sem aprovacao quando fora da alçada
- NAO aceita termos que prejudiquem a empresa
- NAO pressiona o lead de forma agressiva
- NAO promete customizacoes nao validadas

## Ferramentas

- Zoom / Google Meet (calls de negociacao)
- CRM (registro de objecoes e termos)
- WhatsApp (comunicacao rapida)

## Quality Gate

- [ ] Objecoes classificadas e documentadas
- [ ] Respostas baseadas em dados e cases
- [ ] Descontos dentro da alçada ou aprovados pelo Head
- [ ] Resultado da negociacao registrado no CRM

---
*Squad Vendas Task*
