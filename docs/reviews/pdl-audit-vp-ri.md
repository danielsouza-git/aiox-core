# Domain Audit: Visual Production + Research Intelligence vs PDL

**Date:** 2026-04-02
**Auditor:** vp-domain-auditor + ri-domain-auditor (Quinn / Guardian)
**Scope:** Gap analysis against EPIC-BSS-D (Personality-Driven Layouts)
**Source Epic:** `docs/epics-brand-system-service.md` > EPIC-BSS-D
**Architecture Doc:** `docs/architecture/personality-driven-layouts.md`

---

## PDL Requirements Summary

EPIC-BSS-D requires 4 core capabilities that touch these squads:

| # | Capability | Primary Agent in Epic | Relevant Squad |
|---|-----------|----------------------|----------------|
| 1 | **Visual Reference Research** -- search 5-10 reference sites per brand by archetype/personality | @analyst (PDL-1) | Research Intelligence |
| 2 | **Reference Analysis** -- extract layout patterns (nav, grid, whitespace, corners, animations) into a layout brief | @architect (PDL-2) | Research Intelligence (data feed) |
| 3 | **AI Layout Generation** -- generate unique HTML/CSS layout code per brand | @dev + brand-book-builder (PDL-4-6) | Visual Production (direction) |
| 4 | **Quality Gates for Generated Layouts** -- Lighthouse >90, WCAG AA, responsive validation | @qa (PDL-9) | Visual Production (asset standards) |

The PDL pipeline is:
```
Brand Profile --> Visual Reference Research --> Reference Analysis --> Layout Brief --> AI Layout Generation
```

---

## Squad: Visual Production

**Config:** `/mnt/c/Users/mrapa/projects/my-projects/aios-core/squads/visual-production/config.yaml`
**Agents:** Vincent (art-director), Iris (ai-image-specialist), Phoebe (photo-editor), Max (motion-designer), Archer (asset-manager)
**Tasks:** 16 tasks across 5 agents

### Capacidades Existentes (relevantes ao PDL)

| # | Capability | Agent/Task | Relevance to PDL |
|---|-----------|-----------|------------------|
| 1 | Visual direction creation (mood, style, palette, composition, motion) | Vincent / `visual-direction.md` | HIGH -- defines the visual language a brand should express. PDL needs this as input to layout brief |
| 2 | Brand visual audit (cross-channel consistency, layout consistency check) | Vincent / `brand-visual-audit.md` | MEDIUM -- can audit generated layouts for brand consistency post-generation |
| 3 | Style guide enforcement | Vincent / `style-guide-enforce.md` | MEDIUM -- can validate generated layouts against brand guidelines |
| 4 | AI image generation (Flux, DALL-E, batch production) | Iris / `ai-image-generate.md`, `batch-image-generate.md` | LOW -- generates images, not layouts. However, PDL might need hero/background images per layout family |
| 5 | Image optimization for web (WebP, AVIF, responsive srcset) | Phoebe / `image-optimize.md` | MEDIUM -- PDL quality gates require optimized assets within generated layouts |
| 6 | Framer Motion animation components (15 animation types, spring physics, scroll-triggered) | Max / `motion-create.md`, `micro-interaction.md` | HIGH -- PDL architecture specifies animation patterns per archetype (Explorer = scroll-triggered reveals, Caregiver = gentle fades). Max already covers this |
| 7 | CDN optimization and asset delivery | Archer / `cdn-optimize.md` | LOW -- CDN delivery is downstream of layout generation |
| 8 | Image standards (hero: 1920x1080, social sizes, WebP/AVIF quality specs) | `config.yaml` > `image_standards` | MEDIUM -- layout families may require different hero dimensions (e.g., full-bleed vs contained) |
| 9 | Integration with branding squad (receives brand_profile, palette, moodboard, visual_direction) | `config.yaml` > `integration` | HIGH -- the PDL pipeline starts from brand_profile which VP already receives |

### Gaps Identificados

| # | Gap | Severidade | Descricao Detalhada | Recomendacao |
|---|-----|------------|---------------------|--------------|
| VP-1 | **Nenhum agente analisa referencias visuais de SITES** | CRITICO | O art-director (Vincent) trabalha com moodboards e estilo visual generico. Nao existe task para analisar SITES de referencia por archetype -- buscar URLs de sites do mesmo archetype (Innocent/Dreamer, Explorer/Creator), sites premiados (Awwwards, CSS Design Awards) e extrair padroes de LAYOUT (nav, grid, whitespace, corners, animacoes). O PDL-1 requer exatamente esta capacidade. | Criar task `site-reference-analysis.md` no VP squad OU (mais adequado) delegar integralmente ao R-I squad. Recomendacao: **manter no R-I** por ser pesquisa de mercado, nao producao visual. |
| VP-2 | **Visual direction nao define layout families/archetypes** | ALTO | O `visual-direction.md` define mood, estilo, paleta, tipografia, composicao e motion -- mas NAO define layout FAMILY (qual dos 6 familias de layout o brand deve usar) nem parametros de layout (corner radii, whitespace density, nav style, grid rhythm). A arquitetura PDL exige um "Layout Personality Engine" que mapeia archetypes para layout families. | Estender `visual-direction.md` com uma Phase 3.5 "Layout Family Selection" que inclua: (a) mapeamento archetype-->layout family, (b) parametros de whitespace density, (c) corner radii, (d) nav style preference, (e) grid rhythm. OU criar uma nova task `layout-direction.md` especifica para PDL. |
| VP-3 | **Image standards nao cobrem layouts variados** | MEDIO | `image_standards.sizes` define tamanhos fixos (hero: 1920x1080, social_square: 1080x1080). O PDL gera layouts com hero sections de alturas variadas (full-bleed vs contained), grids asimetricos, e composicoes nao-padrao. Os standards atuais sao por canal (web, social, print), nao por layout family. | Adicionar um bloco `layout_aware_sizes` no `config.yaml` que mapeie layout families para dimensoes de hero e grid. Ex: `editorial_hero: "1920x800"`, `ethereal_hero: "1920x1200"`, `brutalist_hero: "1920x600"`. |
| VP-4 | **Nenhum agente gera assets otimizados para DIFERENTES layouts** | MEDIO | Iris (ai-image-specialist) gera imagens com dimensoes fixas por request. Nao ha task para gerar um SET de hero images em multiplas aspect ratios para que o layout engine escolha a melhor. Phoebe (photo-editor) otimiza para sizes predefinidas, nao para layout-aware responsive breakpoints. | Criar task `layout-aware-asset-generation.md` que receba o layout-brief como input e gere hero/background assets nas dimensoes corretas por layout family. |
| VP-5 | **Motion direction e rica mas desconectada do layout archetype mapping** | BAIXO | Max (motion-designer) tem um excelente sistema de motion (15 tipos, spring physics, scroll-triggered). O `visual-direction.md` ja define motion personality. O gap e que nao ha mapeamento automatico archetype-->motion profile. A arquitetura PDL define que "Explorer brands demand scroll-triggered reveals; Caregiver brands need gentle fades." Este mapeamento precisa existir como lookup table. | Adicionar ao `visual-direction.md` ou criar arquivo `archetype-motion-map.yaml` com mapeamento: `Innocent: { entry: "Blur In", spring: "gentle", scroll: false }`, `Explorer: { entry: "Slide In", spring: "bouncy", scroll: true }`, etc. |
| VP-6 | **Nenhuma integracao com R-I squad** | ALTO | O `config.yaml` define `receives_from_branding` e `receives_from_design_system` mas NAO tem `receives_from_research_intelligence`. O PDL pipeline requer que o VP receba `visual-references.md` e `layout-brief.md` do R-I squad para produzir assets e motion aligned com o layout escolhido. | Adicionar ao `integration` do `config.yaml`: `receives_from_research_intelligence: [visual_references, layout_brief, trend_data]`. |

### Score de Saude para PDL: 38/100

**Justificativa:**
- Capacidades existentes cobrem 30-40% das necessidades indiretas (motion, image generation, optimization)
- Gaps criticos (VP-1, VP-2, VP-6) bloqueiam a participacao do squad no pipeline PDL
- O squad esta orientado para producao de ASSETS (imagens, animacoes) mas nao para LAYOUT STRUCTURE
- A maioria das capacidades PDL requeridas (visual reference research, layout analysis) pertencem mais ao R-I squad do que ao VP

---

## Squad: Research Intelligence

**Config:** `/mnt/c/Users/mrapa/projects/my-projects/aios-core/squads/research-intelligence/config.yaml`
**Agents:** Maya (market-researcher), Cyrus (competitive-analyst), Blake (brand-auditor), Tessa (trend-spotter)
**Tasks:** 14 tasks across 4 agents

### Capacidades Existentes (relevantes ao PDL)

| # | Capability | Agent/Task | Relevance to PDL |
|---|-----------|-----------|------------------|
| 1 | Visual benchmarking com layout patterns (hero section, nav structure, CTA style, footer, whitespace) | Cyrus / `visual-benchmark.md` | MUITO ALTO -- Phase 4 do visual-benchmark ja analisa "Layout & Structure" por competidor: hero pattern, nav structure, CTA placement, footer, whitespace. Isto e 70% do que PDL-2 precisa |
| 2 | Competitive audit com visual identity (logo, cores, tipografia, imageria) e digital presence | Cyrus / `competitive-audit.md` | ALTO -- 7 dimensoes de analise incluem visual identity e digital presence. Porem, foca em COMPETIDORES, nao em sites por ARCHETYPE |
| 3 | Trend report covering layout, motion, iconography, spacing/grid patterns | Tessa / `trend-report.md` | ALTO -- ja cobre "Layout & UI Patterns" (bento grid, asymmetric, full-bleed, scroll-driven), "Motion & Animation", "Spacing & Grid Systems". Exatamente o tipo de inteligencia que o PDL-1 precisa para selecionar layout families |
| 4 | Imagery trend analysis (AI-generated, authentic photography, composition patterns) | Tessa / `imagery-trends.md` | MEDIO -- analisa composicao patterns e tratamentos visuais que influenciam escolhas de layout |
| 5 | Typography trends and pairing recommendations | Tessa / `typography-trends.md` | BAIXO -- tipografia ja e coberta pelo token engine, nao e gap PDL |
| 6 | Color forecast including dark mode trends | Tessa / `color-forecast.md` | BAIXO -- cor ja e coberta pelo token engine |
| 7 | Brand perception audit with visual consistency across touchpoints | Blake / `brand-perception-audit.md` | MEDIO -- pode validar se layouts gerados estao consistentes com a percepcao de marca |
| 8 | Content landscape analysis | Maya / `content-landscape.md` | BAIXO -- foco em conteudo editorial, nao layout visual |
| 9 | SEO gap analysis (meta tags, schema, headings, performance) | Cyrus / `seo-gap-analysis.md` | BAIXO -- Performance scores sao relevantes ao PDL-9 quality gate |
| 10 | EXA Search, Apify, SimilarWeb como ferramentas | `config.yaml` > `cross_cutting.tools_ecosystem` | ALTO -- ferramentas essenciais para pesquisar e scrape de sites de referencia por archetype |

### Gaps Identificados

| # | Gap | Severidade | Descricao Detalhada | Recomendacao |
|---|-----|------------|---------------------|--------------|
| RI-1 | **Nao existe task para pesquisa de REFERENCIAS VISUAIS por archetype** | CRITICO | O visual-benchmark (`visual-benchmark.md`) analisa competidores ESPECIFICOS fornecidos pelo usuario. O PDL-1 requer pesquisa PROATIVA de sites por archetype de marca: "buscar sites Innocent/Dreamer com estetica eterea", "buscar sites Explorer/Creator com editorial dinamico", "filtrar por premiados (Awwwards, CSS Design Awards)", "buscar portfolios (Dribbble, Behance) com tags relacionadas". Esta pesquisa nao parte de uma lista de competidores -- parte de um ARCHETYPE e retorna sites relevantes. | Criar nova task `visual-reference-research.md` (conforme PDL-1 especifica) para Cyrus (competitive-analyst) ou Maya (market-researcher). Input: archetype(s), industry, mood keywords. Output: `visual-references.md` com 5-10 URLs, descricoes de screenshot, padroes de layout identificados, relevance scoring. Usar EXA Search + Apify para scraping. |
| RI-2 | **Nao existe task para extrair PADROES DE LAYOUT de sites de referencia** | CRITICO | O visual-benchmark analisa layout "per competitor" a alto nivel (hero type, nav type, CTA style). Porem, NAO extrai PADROES DE LAYOUT detalhados como: corner radii observados, whitespace density ratio, grid rhythm (symmetric vs asymmetric), section divider style, animation patterns on scroll, color blocking strategy, visual hierarchy approach. O PDL-2 (layout-brief) precisa destes padroes extraidos como input. | Criar nova task `layout-pattern-extraction.md` para Cyrus OU estender `visual-benchmark.md` com uma Phase 4.5 que faca deep extraction de padroes de layout. Output: `layout-patterns.md` com: nav_style, grid_type, whitespace_density, corner_radii, divider_style, animation_patterns, visual_hierarchy. |
| RI-3 | **Benchmarking visual nao inclui sites por ARCHETYPE -- apenas competidores diretos** | ALTO | O `visual-benchmark.md` requer como input uma lista de competidores especificos com URLs. O PDL precisa de uma abordagem diferente: "dado que a marca e Innocent/Dreamer, encontre sites premiados que expressem essa personalidade, independentemente de serem competidores". Isto e pesquisa de REFERENCIA VISUAL, nao analise COMPETITIVA. Sao fluxos fundamentalmente diferentes. | Separar claramente os dois fluxos: (1) `visual-benchmark.md` = competidores, (2) nova `visual-reference-research.md` = archetype-driven. A nova task deve aceitar archetype(s) como input primario, nao URLs de competidores. |
| RI-4 | **Trend-spotter (Tessa) cobre layout trends genericos mas nao faz LAYOUT TREND ANALYSIS por archetype** | MEDIO | Tessa ja reporta layout trends (bento grid, scroll-driven, asymmetric) no `trend-report.md`. Porem, nao os mapeia para ARCHETYPES de marca. O PDL precisa saber: "quais trends de layout sao mais alinhados com Innocent/Dreamer? Quais com Explorer/Creator?" Isto e o cruzamento trend x archetype que nao existe. | Estender `trend-report.md` com uma Phase 3.5 "Archetype Relevance Mapping" onde cada trend de layout e classificado por fit com cada archetype. Alternativa: criar lookup table `layout-trend-archetype-fit.yaml` que Tessa atualiza periodicamente. |
| RI-5 | **Nenhum agente extrai decisoes de LAYOUT de sites de referencia** | ALTO | O PDL precisa de um agente que, dado 5-10 sites de referencia, extraia DECISOES de layout: "este site usa nav horizontal minimalista", "whitespace e 48px entre secoes", "corners sao full rounded (999px)", "scroll reveal com fade-up a 30% viewport". Nenhum agente atual faz esta extracao estruturada. O visual-benchmark faz a nivel de "hero type: image/video", nao ao nivel de especificacao tecnica. | Criar task `layout-decision-extraction.md` (pode ser parte de `layout-pattern-extraction.md` da RI-2) que analise cada site de referencia e extraia um schema estruturado de decisoes de layout: `{ nav: "top-bar-minimal", grid: "asymmetric-2col", whitespace: "generous-48px", corners: "pill-999px", dividers: "gradient-fade", animations: ["scroll-fade-up", "parallax-hero"], hero: "full-bleed-video" }`. |
| RI-6 | **Nenhum cross-squad flow definido para o VP squad** | MEDIO | O `config.yaml` define `cross_squad_flows` para branding, marketing e copy. NAO define flow para visual-production. O PDL pipeline requer que R-I envie `visual-references.md` e `layout-patterns.md` para o VP squad (art-director) para que Vincent possa criar visual direction alinhada com os padroes de layout identificados. | Adicionar `to_visual_production` cross-squad flow: trigger="Visual reference research and layout patterns complete", target_squad=visual-production, target_agent=art-director, payload="visual-references.md, layout-patterns.md, archetype-motion-map". |
| RI-7 | **Maya (market-researcher) nao faz visual benchmarking de layouts** | BAIXO | Maya foca em market sizing, audience segmentation e content landscape. Nao analisa componentes visuais de sites. O PDL-1 esta atribuido a @analyst (generic), nao especificamente a Maya. No contexto do R-I squad, Cyrus (competitive-analyst) e quem ja faz visual benchmark e seria o agente natural para visual reference research. | [AUTO-DECISION] Designar Cyrus como agente primario para PDL-1 dentro do R-I squad, nao Maya. Maya pode contribuir com dados de industria/audiencia que contextualizem a pesquisa visual. |

### Score de Saude para PDL: 45/100

**Justificativa:**
- O visual-benchmark (Cyrus) ja cobre ~70% da estrutura de analise de layout que o PDL precisa, porem aplicado a COMPETIDORES e nao a ARCHETYPES
- Tessa ja reporta layout/motion/spacing trends com lifecycle staging -- forte base para informar escolhas de layout family
- As ferramentas certas ja estao disponiveis (EXA Search, Apify, SimilarWeb)
- Os gaps CRITICOS (RI-1, RI-2) sao de TASK que precisam ser criadas, nao de reestruturacao fundamental
- O squad tem a mentalidade correta (pesquisa baseada em evidencia, fontes citadas, rastreabilidade)
- A adaptacao requerida e menor: criar 2-3 novas tasks e estender 1-2 existentes

---

## Analise Cruzada: Onde Cada Capacidade PDL Deveria Viver

| Capacidade PDL | Squad Recomendado | Agente Recomendado | Justificativa |
|---------------|-------------------|-------------------|---------------|
| Visual Reference Research (PDL-1) | **Research Intelligence** | Cyrus (competitive-analyst) | Pesquisa de sites e extracao de padroes e competencia core do R-I. Cyrus ja faz visual benchmark. Estender para archetype-driven research. |
| Layout Pattern Extraction (parte de PDL-1/PDL-2) | **Research Intelligence** | Cyrus (competitive-analyst) | Analise estruturada de padroes de layout requer as mesmas ferramentas e metodologia que visual-benchmark. |
| Layout Brief Generation (PDL-2) | **Fora de escopo** (atribuido a @architect) | Aria (architect) | Decisao arquitetural, nao pertence a nenhum dos dois squads auditados. |
| Layout-Aware Asset Generation | **Visual Production** | Vincent (art-director) + Iris (ai-image-specialist) | Producao de assets visuais dimensionados por layout family e competencia core do VP. |
| Motion Profile per Archetype | **Visual Production** | Max (motion-designer) | Mapeamento archetype-->motion profile e extensao natural do motion-create system. |
| Quality Gates (PDL-9) | **Fora de escopo** (atribuido a @qa) | Quinn (qa) | QA gates sao dominio do QA agent, nao dos squads. |

---

## Recomendacoes Consolidadas (Priorizadas)

### Prioridade 1 -- Bloqueadores Criticos

| # | Acao | Squad | Severidade | Esforco |
|---|------|-------|-----------|---------|
| 1 | Criar task `visual-reference-research.md` para Cyrus no R-I | Research Intelligence | CRITICO | 2 SP |
| 2 | Criar task `layout-pattern-extraction.md` para Cyrus no R-I | Research Intelligence | CRITICO | 2 SP |
| 3 | Estender `visual-direction.md` no VP com Phase "Layout Family Selection" | Visual Production | ALTO | 1 SP |
| 4 | Adicionar `receives_from_research_intelligence` no VP config.yaml | Visual Production | ALTO | 0.5 SP |

### Prioridade 2 -- Gaps Importantes

| # | Acao | Squad | Severidade | Esforco |
|---|------|-------|-----------|---------|
| 5 | Adicionar `to_visual_production` cross-squad flow no R-I config.yaml | Research Intelligence | MEDIO | 0.5 SP |
| 6 | Estender `trend-report.md` com archetype relevance mapping | Research Intelligence | MEDIO | 1 SP |
| 7 | Criar `layout-aware-asset-generation.md` task no VP | Visual Production | MEDIO | 1.5 SP |
| 8 | Adicionar `layout_aware_sizes` ao VP image_standards | Visual Production | MEDIO | 0.5 SP |

### Prioridade 3 -- Nice-to-Have

| # | Acao | Squad | Severidade | Esforco |
|---|------|-------|-----------|---------|
| 9 | Criar `archetype-motion-map.yaml` (lookup table) no VP | Visual Production | BAIXO | 0.5 SP |
| 10 | Documentar fluxo PDL completo envolvendo ambos squads | Cross-Squad | BAIXO | 0.5 SP |

**Esforco total estimado:** ~10 SP para tornar ambos squads PDL-ready

---

## Decisao

**NEEDS_WORK**

Ambos squads possuem fundacoes solidas que podem ser estendidas para suportar o PDL. Nenhum requer reestruturacao fundamental. Os gaps criticos sao 2 tasks ausentes no R-I e 2 extensoes necessarias no VP. O investimento e modesto (~10 SP) para desbloquear todo o pipeline PDL.

O R-I squad esta mais proximo de ready (45/100) que o VP (38/100) porque a analise de layout ja e parcialmente coberta pelo visual-benchmark existente. O VP precisa de integracao com R-I que hoje nao existe.

**Score Consolidado: 42/100** (media ponderada: R-I com peso maior por ser upstream no pipeline)

---

-- Quinn, guardiao da qualidade
