# PDL Squad Gap Analysis: Personality-Driven Layouts (EPIC-BSS-D)

**Date:** 2026-04-02
**Author:** Atlas (Analyst Agent)
**Scope:** Gap analysis of 6 BSS-related squads against EPIC-BSS-D (Personality-Driven Layouts) requirements
**Confidence Level:** HIGH (based on direct inspection of all config.yaml, agents, tasks, and workflows across 6 squads)
**Method:** Systematic audit of each squad's agents, tasks, and workflows against the 4 PDL capability pillars

---

## 1. Resumo Executivo

The Personality-Driven Layouts (PDL) pipeline requires 4 core capabilities:

| # | Capability | Description |
|---|-----------|-------------|
| C1 | **Visual Reference Research** | Research reference websites by brand archetype/personality |
| C2 | **Reference Analysis** | Analyze layout patterns of reference sites (nav, grid, whitespace, corners, animations) |
| C3 | **AI Layout Generation** | Generate unique HTML/CSS/JSX layouts per brand personality (not fixed templates) |
| C4 | **Quality Gates** | Validate generated layouts (responsive, a11y, performance) |

After auditing 6 squads (branding, design-system, visual-production, research-intelligence, qa-accessibility, brand-pipeline), the findings are:

- **C1 (Visual Reference Research):** PARTIAL coverage. The R-I squad has `visual-benchmark` and `competitive-audit` tasks but these are competitor-focused, not archetype/personality-driven reference research. No squad can search for "reference sites that embody the Explorer archetype" today.
- **C2 (Reference Analysis):** PARTIAL coverage. R-I's `visual-benchmark` task catalogs layout patterns (hero, nav, CTA, footer, whitespace) but lacks structured extraction of grid systems, border-radius patterns, animation styles, and whitespace ratios as machine-readable data for downstream generation.
- **C3 (AI Layout Generation):** NO coverage. No squad has any task or agent capable of generating unique HTML/CSS/JSX layouts from personality data. The branding squad's web-builder (Webb) uses a fixed 8-section conversion architecture template. The design-system squad's component-builder (Cole) builds reusable components, not unique page layouts. Nobody generates layouts from personality traits.
- **C4 (Quality Gates):** YES coverage. The qa-accessibility squad has comprehensive responsive testing, a11y testing, performance auditing, and brand compliance checking. The branding squad also has QA agents for deliverable review.

**Overall verdict:** The PDL pipeline has a **critical gap in C3 (AI Layout Generation)** and **significant gaps in C1 and C2** that require new tasks and potentially new agents. Quality gates (C4) are well-covered by existing infrastructure.

---

## 2. Capability Matrix (Squad x Capability)

| Squad | C1: Visual Reference Research | C2: Reference Analysis | C3: AI Layout Generation | C4: Quality Gates |
|-------|:---:|:---:|:---:|:---:|
| **branding** | NO | NO | NO | PARTIAL |
| **design-system** | NO | NO | NO | PARTIAL |
| **visual-production** | NO | NO | NO | NO |
| **research-intelligence** | PARTIAL | PARTIAL | NO | NO |
| **qa-accessibility** | NO | NO | NO | YES |
| **brand-pipeline** | NO | NO | NO | PARTIAL |

### Legend
- **YES** -- Fully supports the capability as-is, no modifications needed
- **PARTIAL** -- Has related tasks/agents that partially cover the capability but need extension
- **NO** -- No existing task, agent, or workflow addresses this capability

---

## 3. Detailed Gap Analysis Per Squad

### 3.1. Branding Squad (`squads/branding/`)

**Lead:** Stella (brand-strategist)
**Agents:** 10 (brand-strategist, token-engineer, brand-book-builder, ai-orchestrator, creative-producer, web-builder, qa-reviewer, operations-coordinator, analytics-specialist, figma-component-builder)
**Tasks:** 72 total
**Workflows:** 4 (brand-discovery-flow, brand-book-delivery, creative-batch-flow, landing-page-flow)

#### C1 -- Visual Reference Research: NO

The brand-strategist (Stella) runs brand discovery workshops capturing personality, archetypes, and visual preferences but does NOT search for reference websites by archetype. The `moodboard-generate` task creates AI-generated mood images but does not research existing web layouts. The `digital-audit` task analyzes existing digital presence but only for the client's own brand.

**Gap:** No task exists to search for web design references that match a specific brand archetype (e.g., "Find websites that embody the Explorer/Rebel/Sage archetype in the dental industry").

#### C2 -- Reference Analysis: NO

The web-builder (Webb) creates pages using a fixed conversion architecture (8 sections) but does not analyze external reference sites for layout patterns. No agent in the branding squad extracts nav structure, grid systems, whitespace ratios, border-radius patterns, or animation styles from reference URLs.

**Gap:** No task exists to parse and catalog layout DNA from reference sites.

#### C3 -- AI Layout Generation: NO

The web-builder (Webb) follows a rigid 8-section template:
```
Hero -> Problem -> Solution -> How It Works -> Social Proof -> Pricing -> FAQ -> Final CTA
```
This is a conversion-optimized template, not a personality-driven generative system. The `landing-page-create` task applies brand tokens (colors, fonts) to this fixed structure but never varies the section layout, grid, whitespace treatment, or visual rhythm based on brand personality.

**Gap:** This is the CRITICAL gap. No agent can take a brand personality profile (e.g., "sophisticated, minimal, Sage archetype") and generate a unique layout with appropriate whitespace ratios, grid structure, navigation style, corner treatments, and animation patterns. Webb applies brand tokens to a fixed template; PDL requires generating the template itself from personality data.

#### C4 -- Quality Gates: PARTIAL

The qa-reviewer (Quentin) has `review-deliverable`, `brand-consistency-check`, `accessibility-check`, `contrast-check`, and `final-approval` tasks. These cover brand compliance and accessibility but are generic reviewers -- they would work for PDL outputs without modification.

**Assessment:** QA gates exist but lack specific PDL validation criteria (e.g., "Does the layout express the target personality archetype?", "Is the whitespace ratio consistent with the personality profile?").

---

### 3.2. Design System Squad (`squads/design-system/`)

**Lead:** Atlas (ds-architect) -- Note: name collision with my own persona
**Agents:** 6 (ds-architect, token-transformer, component-builder, a11y-auditor, ds-documenter, migration-planner)
**Tasks:** 12 total
**Workflows:** 3 (design-system-build-flow, component-library-flow, token-pipeline-flow)

#### C1 -- Visual Reference Research: NO

No agent in this squad performs visual research. The squad receives design tokens from branding and transforms them into components. It is purely an implementation squad.

#### C2 -- Reference Analysis: NO

The `pattern-extract` task (ds-architect) extracts patterns from an existing codebase, not from external reference websites. The `atomic-audit` task audits component structure against Atomic Design methodology.

**Gap:** No task analyzes external web layouts for component patterns.

#### C3 -- AI Layout Generation: NO

The component-builder (Cole) builds individual React/TSX components using cva variants, Tailwind CSS 4, and Framer Motion 11. These are reusable primitives (Button, Card, Hero, etc.), not page-level layouts. Cole builds blocks; PDL needs to compose blocks into unique page architectures based on personality.

**Gap:** The design-system squad builds the building blocks that PDL would USE, but cannot compose them into personality-driven layouts. This is a different scope -- a layout composition layer is needed above the component level.

#### C4 -- Quality Gates: PARTIAL

The a11y-auditor (Asha) performs WCAG accessibility audits and remediation. This would apply to PDL-generated layouts. However, there is no performance or responsive validation within this squad (those live in qa-accessibility).

---

### 3.3. Visual Production Squad (`squads/visual-production/`)

**Lead:** Vincent (art-director)
**Agents:** 5 (art-director, ai-image-specialist, photo-editor, motion-designer, asset-manager)
**Tasks:** 15 total
**Workflows:** 3 (visual-production-flow, asset-pipeline-flow, ai-image-pipeline-flow)

#### C1 -- Visual Reference Research: NO

The art-director (Vincent) defines visual direction via the `visual-direction` task but this is about image style (photography, illustration, color treatment), not web layout research. The `brand-visual-audit` task audits visual consistency of brand assets, not external layouts.

#### C2 -- Reference Analysis: NO

No task in this squad analyzes web layouts. The squad focuses on image assets (photos, illustrations, motion) not layout structure.

#### C3 -- AI Layout Generation: NO

The ai-image-specialist (Iris) generates images using Flux/DALL-E, not HTML/CSS/JSX layouts. The motion-designer (Max) creates Framer Motion components and Lottie animations, which PDL could USE in generated layouts but Max does not compose layouts.

**Potential contribution to PDL:** The motion-designer could provide personality-specific animation presets that feed into the PDL generator. For example, "Explorer personality = dynamic slide-in animations; Sage personality = subtle fade-ins." This is a dependency, not a gap.

#### C4 -- Quality Gates: NO

No QA agents in this squad. Visual quality is delegated to qa-accessibility.

---

### 3.4. Research Intelligence Squad (`squads/research-intelligence/`)

**Lead:** Tessa (trend-spotter)
**Agents:** 4 (market-researcher, competitive-analyst, brand-auditor, trend-spotter)
**Tasks:** 15 total
**Workflows:** 3 (research-pipeline-flow, competitive-intelligence-flow, brand-health-check-flow)

#### C1 -- Visual Reference Research: PARTIAL

**Closest existing task:** `visual-benchmark` (competitive-analyst, Cyrus)

This task captures screenshots and catalogs visual attributes (color palette, typography, layout patterns, imagery style) of competitor websites. However:

1. **Scope limitation:** It analyzes COMPETITORS, not archetype-aligned reference sites. PDL needs to search for "websites that express Explorer personality" across any industry, not just competitors in the client's industry.
2. **Input limitation:** It requires explicit competitor URLs as input. PDL needs to DISCOVER reference URLs based on personality/archetype search criteria.
3. **Output limitation:** The output is a comparison matrix (qualitative scores), not structured machine-readable layout data that can feed a generator.

**Closest existing task:** `imagery-trends` (trend-spotter, Tessa)

This task analyzes photography/imagery trends including composition patterns, visual treatments, and AI imagery approaches. It partially covers visual language research but focuses on imagery, not web layout structure.

**Gap:** A new task is needed that searches for reference websites by archetype/personality, not by competitor identity. This task should use web search tools (EXA, WebSearch) to find "best websites with sophisticated minimal design" or "websites that embody the Explorer brand archetype" and return structured URLs with rationale.

#### C2 -- Reference Analysis: PARTIAL

**Closest existing task:** `visual-benchmark` Phase 4 (Layout & Structure)

The visual-benchmark task catalogs per competitor per page:
- Hero section pattern (image/video/illustration/text-only)
- Navigation structure (top bar, hamburger, sidebar)
- Content section patterns
- CTA placement and style
- Footer structure
- Whitespace usage

This is relevant but **insufficient** for PDL because:

1. **Missing structural data:** Does not extract grid system (columns, gutter width), border-radius patterns (rounded vs sharp corners), animation timing/easing, scroll behavior, visual rhythm, or section transition patterns.
2. **Output format:** Produces markdown comparison tables, not machine-readable YAML/JSON that can parameterize a layout generator.
3. **No personality mapping:** Does not map observed patterns to personality traits or archetypes.

**Gap:** A new task (or extension of visual-benchmark) is needed that outputs structured layout DNA as machine-readable data:
```yaml
layout_dna:
  nav: {type: sticky-transparent, height: 64px, animation: slide-down}
  grid: {columns: 12, gutter: 24px, max_width: 1440px}
  whitespace: {section_gap: 120px, density: spacious}
  corners: {radius: 0px, style: sharp}
  animations: {type: subtle-fade, duration: 300ms, easing: ease-out}
  color_usage: {primary_ratio: 0.15, neutral_ratio: 0.70, accent_ratio: 0.15}
  typography: {scale_ratio: 1.25, h1_size: 72px, body_size: 18px}
```

#### C3 -- AI Layout Generation: NO

The R-I squad produces research outputs, not code artifacts. It cannot generate HTML/CSS/JSX.

#### C4 -- Quality Gates: NO

Quality gates within R-I focus on research completeness (data source count, coverage score), not layout/code quality. This is appropriate for a research squad.

---

### 3.5. QA Accessibility Squad (`squads/qa-accessibility/`)

**Lead:** (no explicit lead defined)
**Agents:** 4 (visual-qa Vega, a11y-tester Ally, brand-compliance Barrett, performance-auditor Percy)
**Tasks:** 18 total
**Workflows:** 3 (qa-pipeline-flow, a11y-certification-flow, brand-compliance-flow)

#### C1 -- Visual Reference Research: NO
#### C2 -- Reference Analysis: NO
#### C3 -- AI Layout Generation: NO

Not within scope for a QA squad. Correct.

#### C4 -- Quality Gates: YES

This squad is **fully equipped** for PDL quality validation:

| Agent | Relevant Tasks | PDL Coverage |
|-------|---------------|-------------|
| visual-qa (Vega) | `responsive-test`, `cross-browser-test`, `screenshot-compare`, `visual-review` | Responsive validation at all breakpoints, cross-browser rendering, visual regression |
| a11y-tester (Ally) | `wcag-test`, `screen-reader-test`, `keyboard-nav-test`, `color-contrast-test` | WCAG AA compliance, keyboard navigation, screen reader compatibility |
| brand-compliance (Barrett) | `brand-compliance-check`, `palette-compliance`, `typography-compliance` | Brand token compliance (are generated layouts using correct tokens?) |
| performance-auditor (Percy) | `lighthouse-audit`, `core-web-vitals`, `asset-size-audit`, `next-build-validate`, `static-export-validate` | Performance scoring, CWV compliance, build validation |

**Assessment:** All 4 QA agents and their 18 tasks are directly applicable to PDL-generated layouts without modification. The only addition needed is PDL-specific validation criteria (personality expression scoring), which is a new concern not currently represented in any squad.

---

### 3.6. Brand Pipeline Squad (`squads/brand-pipeline/`)

**Lead:** Maestro (brand-orchestrator)
**Agents:** 1 (brand-orchestrator)
**Tasks:** 5 (run-pipeline, run-phase, pipeline-status, resume-pipeline, pipeline-report)
**Workflows:** 3 (full-brand-pipeline, express-brand-pipeline, refresh-brand-pipeline)

#### C1 -- Visual Reference Research: NO
#### C2 -- Reference Analysis: NO
#### C3 -- AI Layout Generation: NO

The brand-pipeline is a meta-orchestrator. It chains other squads' work but does not perform any creative or analytical work itself.

#### C4 -- Quality Gates: PARTIAL

The `full-brand-pipeline` workflow includes a QA phase that orchestrates qa-accessibility agents. This orchestration would extend naturally to include PDL-generated layout validation.

**Impact of PDL:** The `full-brand-pipeline.yaml` workflow needs a new phase or sub-phase for PDL between the discovery phase and the design-system phase:

```
Current:  Research -> Discovery -> [Design System | Visual | Content] -> QA
PDL:      Research -> Discovery -> PDL Reference Research -> PDL Layout Gen -> [Design System | Visual | Content] -> QA
```

---

## 4. Cross-Squad Overlap Detection

| Capability Area | Squads Involved | Overlap? | Risk |
|----------------|-----------------|----------|------|
| Visual benchmarking of websites | R-I (`visual-benchmark`), Branding (`digital-audit`) | LOW overlap | `digital-audit` is client-focused; `visual-benchmark` is competitor-focused. No conflict. |
| Layout pattern extraction | R-I (`visual-benchmark` Phase 4), Design System (`pattern-extract`) | MEDIUM overlap | Both extract patterns but from different sources: R-I from external websites, DS from existing codebase. PDL needs the R-I side. Ensure clear scope boundaries. |
| Component generation | Branding (`landing-page-create`), Design System (`component-build`) | LOW overlap | Webb builds complete pages from templates; Cole builds individual components. PDL would sit between these: generating page-level compositions from components. |
| Accessibility testing | Branding (`accessibility-check`), QA (`wcag-test`) | HIGH overlap | Both test WCAG compliance. Resolution: branding's `accessibility-check` is a quick check; QA's `wcag-test` is the formal certification. For PDL, delegate to QA squad. |
| Brand compliance | Branding (`brand-consistency-check`), QA (`brand-compliance-check`) | HIGH overlap | Similar scope. Resolution: branding's check is during production (informal gate); QA's check is the formal gate. For PDL, delegate to QA squad. |

**Recommendation:** For PDL, avoid duplicating quality gates. Use qa-accessibility as the single formal QA authority for generated layouts. The branding squad's qa-reviewer serves as an informal first-pass only.

---

## 5. Recommendations: New Tasks, Agents, and Modifications

### 5.1. New Tasks Required

| # | Task | Squad | Agent | Priority | Description |
|---|------|-------|-------|----------|-------------|
| T1 | `archetype-reference-search.md` | research-intelligence | competitive-analyst (Cyrus) or NEW agent | HIGH | Search for reference websites by brand archetype/personality. Input: archetype name, industry, visual mood. Output: 8-15 curated URLs with archetype-alignment scores. Uses EXA/WebSearch. |
| T2 | `layout-dna-extract.md` | research-intelligence | competitive-analyst (Cyrus) or NEW agent | HIGH | Visit reference URLs and extract structured layout DNA as machine-readable YAML. Captures: nav structure, grid system, whitespace ratios, border-radius, animation patterns, color distribution, typography scale. Uses WebFetch/Playwright. |
| T3 | `personality-layout-generate.md` | branding (or NEW sub-system) | NEW agent | CRITICAL | Generate unique HTML/CSS/JSX page layouts from: (1) brand personality profile, (2) layout DNA from reference analysis, (3) design tokens. Output: complete page markup with sections, grid, whitespace, animations per personality. |
| T4 | `layout-personality-score.md` | qa-accessibility | brand-compliance (Barrett) | MEDIUM | Score a generated layout against personality expression criteria: does the whitespace ratio match "sophisticated"? Do animations match "bold"? Does the grid density match "playful"? |
| T5 | `pdl-reference-pipeline.md` | brand-pipeline | brand-orchestrator (Maestro) | HIGH | Orchestration task that chains T1 -> T2 -> T3 -> T4 as a sub-pipeline within the full brand pipeline. |

### 5.2. New Agents Required

| # | Agent | Squad | Rationale |
|---|-------|-------|-----------|
| A1 | `layout-architect` | branding or design-system | **Recommended.** A new agent specialized in page-level layout composition from personality data. Neither Webb (fixed templates) nor Cole (individual components) covers this scope. This agent would take personality profiles + layout DNA + design tokens and generate unique page architectures. This is the most significant gap. |

**Alternative:** Extend web-builder (Webb) with a new task for personality-driven generation. This is simpler but risks overloading Webb's scope, which is currently focused on static-first conversion pages.

[AUTO-DECISION] "Should layout-architect be a new agent or an extension of Webb?" -> New agent (reason: Webb's identity is "static conversion pages with fixed templates"; personality-driven generative layout is a fundamentally different capability that deserves its own agent with specialized prompting, personality mapping, and generative architecture skills)

### 5.3. Existing Task Modifications

| # | Task | Squad | Modification |
|---|------|-------|-------------|
| M1 | `visual-benchmark.md` | R-I | Add optional input `archetype_filter` to search by personality in addition to competitor. Add machine-readable YAML output alongside markdown tables. |
| M2 | `brand-discovery.md` | branding | Extend BrandProfile output schema to include `layout_preferences` (dense/spacious, sharp/rounded, animated/static, symmetric/asymmetric). These feed into PDL generation. |
| M3 | `full-brand-pipeline.yaml` | brand-pipeline | Add new phase `pdl` between `discovery` and `design-system` with steps for reference search, layout DNA extraction, and layout generation. |
| M4 | `moodboard-generate.md` | branding | Extend to optionally include web layout screenshots (not just AI-generated mood images) as part of the visual direction. |

### 5.4. New Workflows Required

| # | Workflow | Squad | Description |
|---|----------|-------|-------------|
| W1 | `pdl-pipeline-flow.yaml` | brand-pipeline | Sub-pipeline: `archetype-reference-search` -> `layout-dna-extract` -> `personality-layout-generate` -> `layout-personality-score` -> handoff to design-system for component binding. |

---

## 6. PDL Integration Architecture (Proposed)

```
                       EXISTING                              NEW (PDL)
                    +------------------+                  +---------------------------+
                    |   R-I Squad      |                  |   R-I Squad (extended)    |
                    |                  |                  |                           |
Brand Profile  ---->| visual-benchmark |   + NEW TASKS:  | archetype-reference-search|
(from branding)     | competitive-audit|                  | layout-dna-extract        |
                    +--------+---------+                  +-------------+-------------+
                             |                                          |
                             v                                          v
                    +------------------+                  +---------------------------+
                    | Branding Squad   |                  | Branding Squad (+ NEW)    |
                    |                  |                  |                           |
                    | web-builder      |   + NEW AGENT:   | layout-architect (A1)     |
                    | (fixed template) |                  | personality-layout-gen    |
                    +--------+---------+                  +-------------+-------------+
                             |                                          |
                             v                                          v
                    +------------------+                  +---------------------------+
                    | Design System    |                  | Design System             |
                    |                  |                  |                           |
                    | component-build  |  UNCHANGED:      | component-build           |
                    | (React TSX)      |  (binds tokens   | (binds tokens to layout)  |
                    +--------+---------+   to components) +-------------+-------------+
                             |                                          |
                             v                                          v
                    +------------------+                  +---------------------------+
                    | QA Accessibility |                  | QA Accessibility          |
                    |                  |                  | + NEW TASK:               |
                    | responsive-test  |                  | layout-personality-score   |
                    | wcag-test        |                  | (personality QA gate)     |
                    | lighthouse-audit |                  |                           |
                    +------------------+                  +---------------------------+
```

---

## 7. Effort Estimation

| Item | Type | Estimated Effort | Priority |
|------|------|-----------------|----------|
| T1: archetype-reference-search | New task | 1 story (M) | HIGH |
| T2: layout-dna-extract | New task | 1 story (L) | HIGH |
| T3: personality-layout-generate | New task | 2-3 stories (XL) | CRITICAL |
| T4: layout-personality-score | New task | 1 story (S) | MEDIUM |
| T5: pdl-reference-pipeline | New task | 1 story (M) | HIGH |
| A1: layout-architect agent | New agent | 1 story (M) | CRITICAL |
| M1: visual-benchmark extension | Modification | 0.5 story (S) | MEDIUM |
| M2: brand-discovery extension | Modification | 0.5 story (S) | HIGH |
| M3: full-brand-pipeline extension | Modification | 0.5 story (S) | HIGH |
| M4: moodboard-generate extension | Modification | 0.5 story (S) | LOW |
| W1: pdl-pipeline-flow | New workflow | 1 story (M) | HIGH |
| **TOTAL** | | **9-10 stories** | |

---

## 8. Risk Assessment

| Risk | Severity | Mitigation |
|------|----------|-----------|
| AI layout generation quality is unpredictable | HIGH | Use reference layout DNA as structural constraints (not free generation). Multiple generation attempts with scoring. Human review gate. |
| Personality-to-layout mapping is subjective | MEDIUM | Document explicit mapping rules (e.g., "Sage archetype = generous whitespace + serif headings + muted palette"). Use research data from T1/T2 to validate mappings empirically. |
| Generated layouts may not be accessible | MEDIUM | Enforce WCAG AA as a hard gate via qa-accessibility. Generate semantic HTML first, style second. |
| Performance of generated layouts may be poor | LOW | The existing Lighthouse gate (Percy) catches this. Static HTML generation naturally performs well. |
| Overlap between layout-architect (A1) and web-builder (Webb) | MEDIUM | Clear scope: Webb = conversion-focused templates from briefs. Layout-architect = personality-driven generative layouts from archetypes. They serve different workflows. |

---

## 9. Confidence Assessment

| Analysis Area | Confidence | Basis |
|--------------|-----------|-------|
| Squad capability inventory | HIGH | Direct inspection of all config.yaml, agents, tasks, and workflows |
| Gap identification (C1-C4) | HIGH | Systematic comparison of PDL requirements vs existing task inputs/outputs |
| Overlap detection | HIGH | Cross-referenced handoff matrices and integration blocks across all 6 squads |
| Effort estimation | MEDIUM | Based on comparable stories in EPIC-BSS-A and EPIC-BSS-VAL; actual effort depends on AI generation complexity |
| Architecture proposal | MEDIUM | Logical extension of existing pipeline; implementation details need architect validation |

---

## 10. Appendix: Files Inspected

### Configs
- `squads/branding/config.yaml` (273 lines, 10 agents, 72 tasks, 4 workflows)
- `squads/design-system/config.yaml` (130 lines, 6 agents, 12 tasks, 3 workflows)
- `squads/visual-production/config.yaml` (175 lines, 5 agents, 15 tasks, 3 workflows)
- `squads/research-intelligence/config.yaml` (212 lines, 4 agents, 15 tasks, 3 workflows)
- `squads/qa-accessibility/config.yaml` (135 lines, 4 agents, 18 tasks, 3 workflows)
- `squads/brand-pipeline/config.yaml` (118 lines, 1 agent, 5 tasks, 3 workflows)

### Agents (key profiles inspected)
- `squads/branding/agents/web-builder.md` (Webb)
- `squads/branding/agents/brand-strategist.md` (Stella)
- `squads/research-intelligence/agents/competitive-analyst.md` (Cyrus)
- `squads/design-system/agents/component-builder.md` (Cole)

### Tasks (key tasks inspected)
- `squads/research-intelligence/tasks/visual-benchmark.md`
- `squads/research-intelligence/tasks/competitive-audit.md`
- `squads/research-intelligence/tasks/imagery-trends.md`
- `squads/branding/tasks/landing-page-create.md`
- `squads/branding/tasks/brand-discovery.md`
- `squads/branding/tasks/moodboard-generate.md`

### Workflows (key workflows inspected)
- `squads/brand-pipeline/workflows/full-brand-pipeline.yaml`
- `squads/branding/workflows/landing-page-flow.yaml`
- `squads/research-intelligence/workflows/research-pipeline-flow.yaml`

---

*PDL Squad Gap Analysis v1.0 -- Atlas (Analyst Agent) -- 2026-04-02*
