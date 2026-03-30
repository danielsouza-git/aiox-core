# Optimize Ads

```yaml
task:
  id: optimize-ads
  name: "Optimize Ads"
  agent: media-buyer
  squad: marketing
  type: paid-traffic
```

## Proposito

Analisar metricas de campanhas de trafego pago diariamente, realizar ajustes de otimizacao, pausar anuncios underperformers e testar variacoes para melhorar CPL, CPA e ROAS continuamente.

## Input

- Campanhas ativas nas plataformas (Meta, Google, TikTok)
- Metricas de performance em tempo real (CPL, CPA, CTR, ROAS, frequencia)
- Benchmarks de referencia por vertical e objetivo

## Output

- Relatorio diario de performance com acoes tomadas
- Anuncios underperformers pausados com justificativa
- Ajustes de lance, publico e posicionamento documentados
- Variacoes de teste criadas e em andamento

## Workflow

### Passo 1: Analisar metricas diarias
Revisar CPL, CPA, CTR, ROAS, frequencia e custo por resultado de cada conjunto e anuncio.

### Passo 2: Identificar underperformers
Marcar anuncios e conjuntos com performance abaixo do benchmark ou tendencia de piora.

### Passo 3: Pausar e ajustar
Pausar underperformers, ajustar lances em conjuntos com potencial, realocar budget para vencedores.

### Passo 4: Testar variacoes
Criar testes A/B de criativos, copy, publicos ou posicionamentos para descobrir novas combinacoes vencedoras.

### Passo 5: Documentar aprendizados
Registrar o que funcionou, o que nao funcionou e benchmarks atualizados.

## O que faz

- Analisa metricas de campanhas diariamente
- Pausa anuncios e conjuntos underperformers
- Ajusta lances, publicos e posicionamentos
- Realoca budget entre conjuntos
- Testa variacoes de criativos e publicos (A/B)
- Documenta aprendizados e benchmarks

## O que NAO faz

- NAO aumenta budget total sem aprovacao do Head
- NAO cria novos criativos (pede a COPY)
- NAO estrutura campanhas novas (isso e do Create Campaign)
- NAO escala campanhas vencedoras (isso e do Scale Winners)

## Ferramentas

- **Meta Ads** -- Analise e otimizacao de campanhas Facebook/Instagram
- **Google Ads** -- Analise e otimizacao de campanhas Search/Display
- **TikTok Ads** -- Analise e otimizacao de campanhas TikTok
- **Ads Manager** -- Visao consolidada de performance
- **Google Sheets** -- Registro de metricas diarias e benchmarks

## Quality Gate

- [ ] Metricas analisadas diariamente
- [ ] Underperformers pausados com justificativa documentada
- [ ] Pelo menos 1 teste A/B ativo por campanha
- [ ] Aprendizados documentados semanalmente
- [ ] Budget realocado sem exceder total aprovado

---
*Squad Marketing Task*
