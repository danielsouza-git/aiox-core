# PDL Squad Audit -- Relatorio Consolidado

**Date:** 2026-04-02
**Auditor:** Alignment Checker (Squad Auditoria -- Quinn / Guardian)
**Scope:** 6 squads vs EPIC-BSS-D (Personality-Driven Layouts)
**Inputs:** 4 domain audit reports (Coverage Analyst + 3 domain auditor pairs)
**Verdict:** NEEDS_WORK

---

## Sumario Executivo

Os 6 squads do ecossistema BSS possuem fundacoes solidas para suas funcoes atuais (brand discovery, token engineering, component building, visual production, competitive research, QA testing, pipeline orchestration), porem estao significativamente despreparados para o EPIC-BSS-D (Personality-Driven Layouts). O gap mais critico e a ausencia total da capacidade C3 (AI Layout Generation) -- nenhum squad possui um agente ou task capaz de gerar layouts HTML/CSS/JSX unicos a partir de dados de personalidade de marca. As capacidades C1 (Visual Reference Research) e C2 (Reference Analysis) existem parcialmente no squad Research Intelligence mas sao orientadas a competidores, nao a archetypes. Apenas a capacidade C4 (Quality Gates) esta substancialmente coberta pelo squad QA Accessibility, embora necessitando extensao para validacao semantica de personalidade. O investimento total estimado para tornar todos os squads PDL-ready e de 25-30 story points distribuidos em 4 tiers de prioridade.

---

## Score de Saude

| Squad | Score | Verdict | Gaps Criticos | Gaps Altos | Gaps Medios | Gaps Baixos | Total Gaps |
|-------|-------|---------|:---:|:---:|:---:|:---:|:---:|
| **Branding** | 18/100 | BLOCKED | 4 | 4 | 2 | 1 | 11 |
| **Design System** | 38/100 | NEEDS_WORK | 0 | 3 | 4 | 2 | 9 |
| **Visual Production** | 38/100 | NEEDS_WORK | 1 | 2 | 2 | 1 | 6 |
| **Research Intelligence** | 45/100 | NEEDS_WORK | 2 | 2 | 2 | 1 | 7 |
| **QA Accessibility** | 52/100 | NEEDS_WORK | 2 | 3 | 3 | 2 | 10 |
| **Brand Pipeline** | 38/100 | NEEDS_WORK | 2 | 5 | 3 | 2 | 12 |

**Score Geral: 38/100** (media ponderada: Branding e Brand Pipeline com peso maior por serem squads primarios do pipeline)

---

## Capability Coverage Matrix

| Capability | branding | design-system | visual-prod | research-intel | qa-access | brand-pipeline |
|-----------|:---:|:---:|:---:|:---:|:---:|:---:|
| **C1: Visual Reference Research** | NO | NO | NO | PARTIAL | NO | NO |
| **C2: Reference Analysis** | NO | NO | NO | PARTIAL | NO | NO |
| **C3: AI Layout Generation** | NO | NO | NO | NO | NO | NO |
| **C4: Quality Gates** | PARTIAL | PARTIAL | NO | NO | YES | PARTIAL |
| **C4a: Layout Tokens** | NO | NO | NO | NO | NO | NO |
| **C4b: Personality Validation** | NO | NO | NO | NO | NO | NO |

**Legenda:** YES = cobertura total, PARTIAL = capacidade relacionada que precisa extensao, NO = ausencia total.

**Resumo:**
- C1 (Visual Ref Research): 0 YES, 1 PARTIAL (R-I), 5 NO -- **16% cobertura**
- C2 (Reference Analysis): 0 YES, 1 PARTIAL (R-I), 5 NO -- **16% cobertura**
- C3 (AI Layout Gen): 0 YES, 0 PARTIAL, 6 NO -- **0% cobertura (GAP CRITICO)**
- C4 (Quality Gates): 1 YES (QA), 3 PARTIAL, 2 NO -- **58% cobertura**

---

## Top Findings (Criticos + Altos)

### Findings CRITICOS

| # | Finding | Squad(s) | Fonte | Impacto | Acao Recomendada |
|---|---------|----------|-------|---------|------------------|
| F1 | **Nenhum agente gera layouts HTML/CSS/JSX unicos a partir de personalidade de marca** -- Webb (branding) usa template fixo de 8 secoes; Cole (design-system) constroi componentes individuais; nenhum squad tem capacidade de composicao de layout a nivel de pagina | branding, design-system | BG-3, Gap Analysis C3 | C3 totalmente ausente. Pipeline PDL nao pode funcionar sem esta capacidade. E a razao de ser do EPIC-BSS-D. | Criar novo agente `layout-architect` (recomendacao do Analyst) OU estender brand-book-builder (Paige) com task `generate-unique-layout`. Estimativa: 2-3 stories (XL). |
| F2 | **Nenhuma task pesquisa sites de referencia por archetype de marca** -- R-I visual-benchmark analisa competidores especificos (URLs fornecidas), nao pesquisa proativamente sites que expressem um archetype (Explorer, Sage, etc.) | research-intelligence, branding | RI-1, BG-1, VP-1 | C1 ausente. Sem referencias visuais, o pipeline de geracao AI nao tem dados estruturais de entrada. | Criar task `visual-reference-research.md` no R-I squad (agente Cyrus). Input: archetype(s), industry, mood. Output: 5-10 URLs com scores de alinhamento. 2 SP. |
| F3 | **Nenhuma task extrai padroes de layout estruturados de sites de referencia** -- visual-benchmark extrai hero type e nav type a alto nivel, mas nao extrai grid system, corner radii, whitespace ratios, animation patterns como dados machine-readable | research-intelligence, branding | RI-2, BG-2 | C2 ausente. O layout brief (ponte entre referencias e geracao) depende de dados estruturados que nao existem. | Criar task `layout-pattern-extraction.md` no R-I squad (agente Cyrus). Output: layout DNA em YAML com nav, grid, whitespace, corners, animations. 2 SP. |
| F4 | **Workflow brand-book-delivery nao inclui fases de visual reference research e layout brief** -- O workflow atual: generate > pdf > package > review > deploy. Sem as fases PDL intermediarias. | branding, brand-pipeline | BG-5, BP-1, BP-2 | Pipeline de delivery nao suporta PDL. Brand books continuam usando templates fixos. | Adicionar fases visual-reference-research e layout-brief ao `brand-book-delivery.yaml` (branding) e `full-brand-pipeline.yaml` (brand-pipeline). 1 SP. |
| F5 | **Nenhuma validacao de expressao de personalidade em layouts gerados** -- QA gates existentes validam HTML valido, responsividade, WCAG, Lighthouse, compliance de tokens de cor/tipografia. Nenhum gate valida "este layout EXPRESSA a personalidade Explorer?" | qa-accessibility | QA-1 | Layouts gerados por AI podem passar todos os gates e mesmo assim nao corresponder ao archetype. Um layout Explorer que parece Innocent seria aprovado. | Criar task `layout-personality-score.md` no QA squad (agente Barrett). Score 0-100% por dimensao de layout. 1 SP (M). |
| F6 | **Nenhuma verificacao de diferenciacao entre marcas** -- QA valida uma marca de cada vez. Nao existe comparacao cross-brand para garantir que layouts sao DIFERENTES. | qa-accessibility | QA-2 | Promessa central do PDL e que 2 marcas com personalidades diferentes produzem layouts diferentes. Sem este check, marcas poderiam receber layouts identicos. | Criar task `layout-differentiation-check.md` no QA squad (agente Vega). Threshold: >=15% diff visual E pelo menos 3/7 dimensoes de layout diferentes. 1 SP (S). |

### Findings ALTOS

| # | Finding | Squad(s) | Fonte | Impacto | Acao Recomendada |
|---|---------|----------|-------|---------|------------------|
| F7 | **Token Engineer (Toren) nao tem conceito de Layout Tokens** -- Schema de tokens e 3-tier (primitive/semantic/component). Nao existe tier "layout" com nav.style, whitespace.density, corner.radius, etc. | branding | BG-4 | Layout tokens sao fundacao de toda variabilidade PDL. Sem eles, layouts nao podem ser tokenizados ou exportados. | Estender Toren: criar task `layout-token-generate.md` e atualizar `token-schema-create.md` para incluir tier layout. 2 SP. |
| F8 | **Token Transformer (Tara) nao processa layout tokens** -- Pipeline de transformacao (W3C DTCG -> CSS/SCSS/Tailwind) nao referencia layout tokens. | design-system | DG-2 | Layout tokens gerados pelo Toren nao serao transformados para CSS custom properties (--layout-*). | Estender `token-transform.md` para incluir layout token type. Adicionar `layout/layout.json` ao pipeline de ingestao. 1 SP. |
| F9 | **Component Builder (Cole) nao cria componentes layout-aware** -- Cole constroi React/TSX components com cva mas nao tem conceito de nav partials por familia, divider components, ou section containers com spacing layout-driven. | design-system | DG-3 | Arquitetura PDL especifica 6 nav partials e 8 divider partials como template fragments. Versoes React destes nao existem. | Criar task `layout-component-build.md` para Cole: nav (6 variantes via cva), divider (8 variantes), section containers. 3 SP. |
| F10 | **Web Builder (Webb) nao tem rendering layout-aware** -- Landing pages e sites usam template fixo. Nao aceitam layout tokens como input nem suportam template partials condicionais. | branding | BG-8 | Landing pages e sites institucionais nao se beneficiam do PDL ate que Webb seja atualizado. | Estender tasks de Webb para aceitar layout tokens, adicionar rendering condicional de Nunjucks partials. 3 SP. |
| F11 | **Visual direction nao define layout families/archetypes** -- `visual-direction.md` (VP) define mood, estilo, composicao, motion, mas NAO define layout family nem parametros de layout (corner radii, whitespace density, nav style). | visual-production | VP-2 | VP nao participa da selecao de layout family, desconectando producao visual do pipeline PDL. | Estender `visual-direction.md` com Phase "Layout Family Selection" com mapeamento archetype -> layout family. 1 SP. |
| F12 | **VP nao tem integracao com R-I squad** -- config.yaml define receives_from_branding e receives_from_design_system mas nao receives_from_research_intelligence. | visual-production | VP-6 | Pipeline PDL requer que VP receba visual-references.md e layout-patterns.md do R-I. | Adicionar integracao R-I no config.yaml do VP. 0.5 SP. |
| F13 | **Benchmarking visual limitado a competidores diretos** -- visual-benchmark aceita URLs de competidores como input. PDL precisa de abordagem por archetype independente de competidores. | research-intelligence | RI-3 | Dois fluxos fundamentalmente diferentes: competitivo (URLs fornecidas) vs referencia (archetype-driven search). Precisam de tasks separadas. | Separar claramente: visual-benchmark = competidores, nova visual-reference-research = archetype-driven. 0.5 SP. |
| F14 | **Brand compliance check nao valida layout tokens** -- Phase 7 valida React component tokens, Phase 8 valida Framer Motion. Nenhuma phase valida --layout-* CSS vars. | qa-accessibility | QA-4 | CSS com `var(--layout-corner-radiusBase, 8px)` faz fallback silencioso se tokens estao ausentes. Brand ETHEREAL (24px radius) poderia renderizar como BOLD-STRUCTURED (0px) sem violacao. | Adicionar Phase 7b "Layout Token Compliance" ao `brand-compliance-check.md`. 0.5 SP. |
| F15 | **Nenhuma comparacao layout-brief vs output gerado** -- PDL-2 produz layout-brief.md com recomendacoes estruturais. PDL-4/7 geram layouts. Nenhum gate compara se o output seguiu o brief. | qa-accessibility | QA-5 | AI layout generator pode desviar do brief sem deteccao. Brief diz "nav sticky minimal" e output usa "sidebar fixed". | Criar task `layout-brief-compliance.md` para Barrett. 0.5 SP. |
| F16 | **Pipeline artifacts nao incluem layout tokens, brief, ou referencias** -- Artifacts section do full-brand-pipeline.yaml lista discovery outputs mas nenhum artifact PDL. Refresh pipeline nao detecta staleness de layout. | brand-pipeline | BP-3, BP-5 | Pipeline state machine nao persiste nem resume trabalho layout-related. Mudancas em archetype nao invalidam layout tokens. | Atualizar artifacts em 3 workflow files. Adicionar change detection para layout files. 0.5 SP. |
| F17 | **Express pipeline ignora layout completamente** -- express-brand-pipeline.yaml nao tem nenhuma fase PDL. | brand-pipeline | BP-4 | Clientes em modo express recebem layout default (BOLD-STRUCTURED) mesmo com brand profile que indicaria outra familia. Layout engine resolve em <10ms. | Adicionar layout resolution leve ao express pipeline. 0.5 SP. |
| F18 | **Pipeline-gate-checklist e delivery-checklist nao incluem layout** -- 8 items de gate e 10 items de delivery nao verificam layout tokens, layout brief, ou visual references. | brand-pipeline | BP-6, BP-7 | Delivery "completa" pode estar sem documentacao PDL. | Adicionar items condicionais (feature flag PDL). 0.5 SP. |
| F19 | **Responsive test usa 320px ao inves de 375px (PDL requirement)** -- responsive-test.md testa 320/768/1024/1440/1920. PDL-9 especifica explicitamente 375/768/1440. 375px esta no testing-standards.md mas como P1, nao no sweep Phase 1. | qa-accessibility | QA-3 | Gate PDL-9 nao valida o breakpoint especificado na story. | Adicionar 375px ao Phase 1 sweep do responsive-test.md. Trivial. |
| F20 | **Nenhum @bss/layout-engine package ou agente correspondente** -- Arquitetura especifica package standalone com family-resolver, personality-modulator, e token-emitter. Nenhum agente no ecossistema atual possui esta logica. | branding, design-system | BG-9, DG-1 | Engine computacional central do PDL nao existe. | Implementacao @dev (PDL-1 da arquitetura). Branding squad deve declarar como dependencia. 3 SP. |

---

## Acoes Priorizadas (Roadmap)

### Tier 1: Must-Have ANTES de PDL Wave 1 (Estimativa: 11 SP)

Estas acoes desbloqueiam o pipeline basico de pesquisa de referencias e geracao de layout.

| # | Acao | Squad | Agente | Esforco | Bloqueia |
|---|------|-------|--------|---------|----------|
| A1 | Criar task `visual-reference-research.md` | R-I | Cyrus | 2 SP | PDL-1 |
| A2 | Criar task `layout-pattern-extraction.md` | R-I | Cyrus | 2 SP | PDL-2 |
| A3 | Criar agente `layout-architect` OU estender Paige para layout-aware generation | branding | Novo/Paige | 3 SP | PDL-4 |
| A4 | Implementar `@bss/layout-engine` package (family-resolver + token-emitter) | @dev | N/A | 3 SP | PDL-1 arch |
| A5 | Adicionar fases visual-ref-research + layout-brief aos workflows de delivery e pipeline | branding + brand-pipeline | Maestro | 1 SP | PDL-3 |

### Tier 2: Must-Have ANTES de PDL Wave 2 (Estimativa: 9.5 SP)

Estas acoes habilitam tokens, transformacoes, componentes de layout, e QA semantico.

| # | Acao | Squad | Agente | Esforco | Bloqueia |
|---|------|-------|--------|---------|----------|
| A6 | Criar task `layout-token-generate.md` e estender token schema | branding | Toren | 2 SP | PDL tokens |
| A7 | Estender token-transform para layout tokens | design-system | Tara | 1 SP | PDL CSS vars |
| A8 | Criar task `layout-component-build.md` (6 nav + 8 divider variants) | design-system | Cole | 3 SP | PDL-7 partials |
| A9 | Criar task `layout-personality-score.md` | qa-accessibility | Barrett | 1 SP | PDL-9 |
| A10 | Criar task `layout-differentiation-check.md` | qa-accessibility | Vega | 1 SP | PDL-5/6 PoC |
| A11 | Estender Webb para layout-aware rendering | branding | Webb | 1 SP | PDL-7 |
| A12 | Criar task `layout-brief-compliance.md` | qa-accessibility | Barrett | 0.5 SP | PDL-9 |

### Tier 3: Should-Have antes de GA (Estimativa: 7.5 SP)

Extensoes de integracao, pipeline, e validacao que melhoram a robustez do sistema PDL.

| # | Acao | Squad | Agente | Esforco |
|---|------|-------|--------|---------|
| A13 | Estender `visual-direction.md` com Layout Family Selection | visual-production | Vincent | 1 SP |
| A14 | Adicionar layout token compliance (Phase 7b) ao brand-compliance-check | qa-accessibility | Barrett | 0.5 SP |
| A15 | Atualizar artifacts + change detection nos 3 workflow files | brand-pipeline | Maestro | 0.5 SP |
| A16 | Adicionar items de layout ao pipeline-gate-checklist e delivery-checklist | brand-pipeline | Maestro | 0.5 SP |
| A17 | Estender creative pipeline TokenSet com layout tokens | branding | Cleo | 2 SP |
| A18 | Adicionar layout_tokens a branding_integration do DS config | design-system | N/A | 0.5 SP |
| A19 | Layout token validation no token pipeline workflow | design-system | Tara | 1 SP |
| A20 | Estender a11y-auditor para layout-specific a11y (skip links per nav, prefers-reduced-motion) | design-system | Asha | 1 SP |
| A21 | Adicionar 375px ao responsive-test Phase 1 sweep | qa-accessibility | Vega | 0.5 SP |

### Tier 4: Nice-to-Have (Estimativa: 4 SP)

Otimizacoes e melhorias incrementais que podem ser deferidas.

| # | Acao | Squad | Agente | Esforco |
|---|------|-------|--------|---------|
| A22 | Layout resolution leve no express pipeline | brand-pipeline | Maestro | 0.5 SP |
| A23 | Layout change detection no refresh pipeline | brand-pipeline | Maestro | 0.5 SP |
| A24 | Layout quality metrics no pipeline-report.md | brand-pipeline | Maestro | 0.5 SP |
| A25 | Adds PDL sub-phase ao qa-pipeline-flow.yaml | qa-accessibility | N/A | 0.5 SP |
| A26 | Layout-family-aware baseline management (screenshot-compare) | qa-accessibility | Vega | 0.5 SP |
| A27 | Archetype-motion-map.yaml (lookup table) | visual-production | Max | 0.5 SP |
| A28 | Layout family documentation showcase | design-system | Doris | 2 SP |
| A29 | Estender trend-report com archetype relevance mapping | research-intelligence | Tessa | 1 SP |
| A30 | Adicionar cross-squad flow R-I -> VP no config.yaml | research-intelligence | N/A | 0.5 SP |
| A31 | Layout migration plan via migration-planner | design-system | Miles | 1 SP |
| A32 | Layout density context no lighthouse-audit | qa-accessibility | Percy | Trivial |
| A33 | CSS animation entrance validation | qa-accessibility | N/A | 0.5 SP |
| A34 | External agent handoffs no branding config.yaml | branding | N/A | 0.5 SP |
| A35 | Pipeline-config.md sincronizado com @bss/layout-engine source | brand-pipeline | N/A | Trivial |
| A36 | Layout-specific retry logic no pipeline | brand-pipeline | Maestro | 0.5 SP |

---

## Cross-Squad Dependencies

```
                    DEPENDENCY FLOW (PDL Pipeline)

 [Brand Profile]                                      [Quality Gates]
      |                                                      ^
      v                                                      |
+------------------+     +-------------------+     +--------------------+
| BRANDING         |     | RESEARCH          |     | QA ACCESSIBILITY   |
|                  |     | INTELLIGENCE      |     |                    |
| Stella: brand    |---->| Cyrus: visual-ref |     | Barrett: layout    |
|   profile        |     |   research (NEW)  |     |   personality      |
|                  |     | Cyrus: layout     |     |   score (NEW)      |
| Toren: layout    |<----|   pattern extract |     | Vega: layout       |
|   tokens (EXT)   |     |   (NEW)           |     |   differentiation  |
|                  |     +-------------------+     |   (NEW)            |
| Paige/NEW:       |                               | Barrett: layout    |
|   layout-aware   |                               |   brief compliance |
|   brand book     |                               |   (NEW)            |
|   (EXT)          |                               +--------------------+
|                  |                                      ^
| Webb: layout-    |                                      |
|   aware LP (EXT) |     +-------------------+            |
+------------------+     | DESIGN SYSTEM     |            |
      |                  |                    |            |
      | layout tokens    | Tara: transform   |            |
      +----------------->|   layout tokens   |            |
      |                  |   (EXT)           |            |
      |                  | Cole: nav/divider |            |
      |                  |   components (NEW)|            |
      |                  | Asha: layout a11y |            |
      |                  |   (EXT)           |            |
      |                  +-------------------+            |
      |                                                   |
      |     +-------------------+                         |
      |     | VISUAL PRODUCTION |                         |
      +---->| Vincent: layout   |                         |
      |     |   family selection|                         |
      |     |   (EXT)          |                         |
      |     | Max: archetype   |                         |
      |     |   motion map     |                         |
      |     +-------------------+                         |
      |                                                   |
      |     +-------------------+                         |
      +---->| BRAND PIPELINE    |-------------------------+
            | Maestro: PDL      |   (QA phase handoff)
            |   phases (NEW)    |
            | Artifacts + gates |
            |   (EXT)          |
            +-------------------+

Legenda: NEW = task/agente completamente novo, EXT = extensao de existente
```

**Cadeia de dependencias criticas (path critico):**
1. Brand Profile (EXISTS) --> Visual Reference Research (A1) --> Layout Pattern Extraction (A2) --> Layout Engine (A4) --> Layout Tokens (A6) --> Token Transform (A7) --> Layout-Aware Generation (A3) --> QA Gates (A9, A10, A12) --> Delivery

**Dependencias paralelas (podem ser trabalhadas simultaneamente):**
- A8 (Cole: nav/divider components) e paralelo a A4 (layout engine)
- A9/A10 (QA tasks) sao paralelos a A3 (layout generation)
- A13 (VP layout family selection) e paralelo a A1/A2 (R-I research)

---

## Squads com Maior Risco

### 1. Branding Squad (18/100) -- RISCO CRITICO

O squad mais impactado pelo PDL. Possui 4 gaps criticos representando capacidades inteiramente ausentes: visual reference research, reference analysis, layout-aware brand book generation, e workflow de delivery sem fases PDL. O squad e o produtor primario de brand books e landing pages -- se nao estiver PDL-ready, o pipeline inteiro falha. A decisao arquitetural mais importante e se o layout-architect sera um novo agente dentro do branding squad ou uma extensao do brand-book-builder (Paige). O Analyst recomenda novo agente; o Epic atribui a Paige. Esta ambiguidade precisa ser resolvida antes de PDL Wave 1.

### 2. Brand Pipeline Squad (38/100) -- RISCO ALTO

O orquestrador do pipeline inteiro. Tem 2 gaps criticos (fases ausentes) e 5 gaps altos (artifacts, gates, checklists, express mode, refresh mode sem awareness de layout). O risco e que mesmo que todos os outros squads implementem suas extensoes PDL, o pipeline nao invoca as novas fases sem atualizacao do Maestro. O positivo e que a arquitetura do pipeline (state machine, parallel execution, gates configuráveis) e facilmente extensivel -- os gaps sao de configuracao, nao de reestruturacao.

### 3. Research Intelligence Squad (45/100) -- RISCO MEDIO-ALTO

Upstream de todo o pipeline PDL. Os 2 gaps criticos (pesquisa por archetype e extracao de padroes de layout) bloqueiam C1 e C2 inteiramente. O aspecto positivo e que o squad ja possui 70% da infraestrutura necessaria (visual-benchmark, EXA, Apify, metodologia de pesquisa baseada em evidencia). A adaptacao e criar 2 novas tasks reutilizando ferramentas e metodologias existentes -- esforco relativamente baixo (4 SP) para desbloqueio critico.

---

## Conclusao

**Recomendacao: APROVAR inicio do PDL com condicoes.**

O EPIC-BSS-D NAO deve ser bloqueado. As fundacoes dos 6 squads sao solidas e extensiveis. Nenhum squad requer reestruturacao fundamental -- todos os gaps sao resolviveis via criacao de novas tasks, extensao de agentes existentes, e atualizacao de workflows/checklists.

**Condicoes para inicio de PDL Wave 1:**

1. **Resolver ambiguidade layout-architect vs Paige** -- Definir se sera novo agente ou extensao de Paige antes de iniciar implementacao (impacta 3 SP de escopo)
2. **Criar tasks A1 e A2 no R-I squad** (4 SP) -- Sem pesquisa de referencias e extracao de padroes, o pipeline de geracao nao tem input
3. **Implementar @bss/layout-engine A4** (3 SP) -- Componente computacional central, bloqueia tudo downstream
4. **Atualizar workflows A5** (1 SP) -- Maestro precisa saber invocar as novas fases
5. **Criar QA tasks A9 e A10** (2 SP) -- Validacao de personalidade e diferenciacao devem existir ANTES do PoC (PDL-5/6), pois sao o criterio de sucesso do PoC

**Investimento total para desbloquear Wave 1:** ~11 SP (Tier 1)
**Investimento total para PDL production-ready (GA):** ~32 SP (todos os tiers)

**Sequenciamento recomendado:**
- **Sprint 1:** A1, A2, A4, A5 (desbloqueio pipeline: 9 SP)
- **Sprint 2:** A3, A9, A10 (geracao + validacao: 5 SP)
- **Sprint 3:** A6, A7, A8, A11, A12 (tokens + componentes + Webb: 7.5 SP)
- **Sprint 4:** A13-A21 (integracao + QA extended: 7.5 SP)
- **Backlog:** A22-A36 (nice-to-have: ~8 SP)

---

-- Quinn, guardiao da qualidade
