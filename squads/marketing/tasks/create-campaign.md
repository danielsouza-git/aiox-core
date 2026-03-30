# Create Campaign

```yaml
task:
  id: create-campaign
  name: "Create Campaign"
  agent: media-buyer
  squad: marketing
  type: paid-traffic
```

## Proposito

Estruturar campanhas de trafego pago do zero nas plataformas Meta Ads, Google Ads e TikTok Ads, incluindo setup de pixel, eventos de conversao, definicao de publico, budget e datas. O resultado e uma campanha pronta para ativacao.

## Input

- Briefing de campanha aprovado pelo Marketing Head (objetivo, publico, datas)
- Budget aprovado para a campanha
- Criativos recebidos de COPY (artes, videos, textos de anuncio)
- Benchmarks e referencias do Research Analyst (swipe file)

## Output

- Campanha estruturada na plataforma com: objetivo, publico, posicionamento, criativos, budget e datas
- Pixel e eventos de conversao configurados e testados
- Campanha pronta para ativacao

## Workflow

### Passo 1: Definir estrutura da campanha
Definir objetivo (conversao, leads, awareness), nivel de campanha, conjuntos de anuncio e anuncios.

### Passo 2: Configurar pixel e conversoes
Verificar pixel instalado, configurar eventos de conversao corretos (lead, purchase, initiate_checkout).

### Passo 3: Segmentar publico
Definir publico-alvo com base em dados demograficos, interesses, comportamento e lookalikes.

### Passo 4: Inserir criativos e copy
Carregar artes, videos e textos de anuncio recebidos de COPY, configurando variacoes para teste.

### Passo 5: Definir budget e datas
Configurar budget diario ou total conforme aprovado, definir datas de inicio e fim.

### Passo 6: Revisar e ativar
Revisar toda a estrutura antes de ativar, verificando links de destino, UTMs e tracking.

## O que faz

- Estrutura campanhas com objetivos claros
- Configura pixel e eventos de conversao
- Define e segmenta publicos-alvo
- Insere criativos e configura variacoes (A/B)
- Define budget e datas conforme aprovado
- Configura UTMs e tracking para atribuicao

## O que NAO faz

- NAO cria artes ou copy (pede a COPY)
- NAO define budget sem aprovacao do Head
- NAO cria landing pages
- NAO otimiza campanhas em andamento (isso e do Optimize Ads)

## Ferramentas

- **Meta Ads** -- Estruturacao de campanhas Facebook/Instagram
- **Google Ads** -- Estruturacao de campanhas Search/Display/YouTube
- **TikTok Ads** -- Estruturacao de campanhas TikTok
- **Ads Manager** -- Gestao centralizada
- **Google Sheets** -- Controle de budget e estrutura de campanhas

## Quality Gate

- [ ] Pixel e eventos de conversao configurados e testados
- [ ] Publico segmentado com base em dados
- [ ] Budget conforme aprovado pelo Head
- [ ] UTMs e tracking configurados corretamente
- [ ] Links de destino verificados e funcionando

---
*Squad Marketing Task*
