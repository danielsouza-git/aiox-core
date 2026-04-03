# Domain Audit: Branding + Design System vs PDL

**Date:** 2026-04-02
**Auditor:** branding-domain-auditor + ds-domain-auditor (coordinated by Quinn / QA Guardian)
**Scope:** Gap analysis of `squads/branding/` and `squads/design-system/` against EPIC-BSS-D (Personality-Driven Layouts)
**Reference Architecture:** `docs/architecture/personality-driven-layouts.md` (Aria, 15 sections, 5 ADRs)
**Reference Epic:** EPIC-BSS-D in `docs/epics-brand-system-service.md` v1.4

---

## PDL Capability Requirements (Summary)

The EPIC-BSS-D pipeline requires 5 core capabilities from the squads:

| # | Capability | Description |
|---|-----------|-------------|
| C1 | Visual Reference Research | Research reference sites by archetype/personality |
| C2 | Reference Analysis | Extract layout patterns (nav, grid, whitespace, corners, animations) from references |
| C3 | AI Layout Generation | Generate unique HTML/CSS/JSX per brand (not fixed 8-section template) |
| C4 | Layout Tokens | New token tier `layout.json` with nav.style, whitespace.density, corner.radius, etc. |
| C5 | Quality Gates | Validate generated layouts (responsive 375/768/1440, WCAG AA, Lighthouse >90) |

Additionally, the architecture document specifies:

| # | Technical Requirement | Source |
|---|----------------------|--------|
| T1 | New `@bss/layout-engine` package with 6 layout families | Architecture Section 6 |
| T2 | Layout CSS Generator module in static-generator | Architecture Section 9 |
| T3 | Navigation/divider template partials (6 nav, 8 dividers) | Architecture Section 9 |
| T4 | Integration with creative pipeline TokenSet | Architecture Section 10 |
| T5 | Feature flag `bss.personalityDrivenLayouts.enabled` | Architecture Section 13 |
| T6 | Backward compatibility via CSS var() fallbacks | Architecture Section 13 |

---

## Squad: Branding

### Capacidades Existentes (relevantes ao PDL)

Based on analysis of `squads/branding/config.yaml`, all 10 agents, 4 workflows, and complete task inventory:

| Capability | Agent/Task | Status | Relevance to PDL |
|-----------|-----------|--------|-------------------|
| Brand Discovery Workshop | brand-strategist (Stella) / `brand-discovery.md` | EXISTS | Produces `brand_profile` with archetypes and personality scales -- this is the PRIMARY INPUT for the Layout Personality Engine |
| Digital Presence Audit | brand-strategist (Stella) / `digital-audit.md` | EXISTS | Analyzes existing digital presence -- could feed visual pattern data but currently outputs text-based audit report, not layout analysis |
| Moodboard Generation | brand-strategist (Stella) / `moodboard-generate.md` | EXISTS | Generates 8-12 images for visual direction -- provides aesthetic reference but NOT layout-structural reference |
| Color Palette + WCAG | token-engineer (Toren) / `color-palette-generate.md` | EXISTS | WCAG-validated palette -- consumed by layout engine for divider.color and section backgrounds |
| Typography System | token-engineer (Toren) / `typography-pairing.md` | EXISTS | Font families and scale -- consumed alongside layout tokens |
| W3C DTCG Token Schema | token-engineer (Toren) / `token-schema-create.md` | EXISTS | 3-tier token architecture (primitive/semantic/component) -- PDL adds a parallel "layout" tier |
| Style Dictionary Build | token-engineer (Toren) / `style-dictionary-build.md` | EXISTS | Multi-format export (CSS, SCSS, Tailwind, JSON, Figma) -- will need to include layout tokens |
| Brand Book Generation (static HTML) | brand-book-builder (Paige) / `brand-book-generate.md` | EXISTS | Generates brand book with fixed template structure -- PDL-4 requires Paige to generate UNIQUE layout code from layout brief |
| Brand Book Triple Delivery | brand-book-builder (Paige) / PDF + Package + Deploy | EXISTS | Online + PDF + ZIP -- layout tokens must flow through all three |
| Conversion Architecture (8 sections) | web-builder (Webb) / `landing-page-create.md` | EXISTS | Fixed 8-section template -- PDL requires visual treatment variation per brand within these sections |
| AI Copy Generation | ai-orchestrator (Nova) / `copy-generate.md` | EXISTS | HCEA framework copy -- NOT directly relevant to layout, but copy LENGTH may interact with layout composition |
| AI Image Generation | ai-orchestrator (Nova) / `image-generate.md` | EXISTS | Flux/DALL-E image gen -- NOT layout-related |
| QA Review Pipeline | qa-reviewer (Quentin) / `review-deliverable.md` | EXISTS | Deliverable review -- needs extension for layout-specific quality gates |
| Accessibility Check | qa-reviewer (Quentin) / `accessibility-check.md` | EXISTS | WCAG checks -- directly relevant to PDL quality gate (C5) |

**Workflow Analysis:**

| Workflow | PDL Impact |
|----------|-----------|
| `brand-discovery-flow.yaml` | LOW -- produces brand_profile but does NOT include visual reference research step |
| `brand-book-delivery.yaml` | HIGH -- has generate > pdf > package > review > deploy steps but MISSING visual-research and layout-brief steps before generate |
| `creative-batch-flow.yaml` | MEDIUM -- will need layout token injection into creative pipeline |
| `landing-page-flow.yaml` | MEDIUM -- will need layout-aware rendering |

### Gaps Identificados

| # | Gap | Severidade | Impacto | Recomendacao |
|---|-----|-----------|---------|-------------|
| BG-1 | **No Visual Reference Research capability** -- No agent or task researches reference sites by archetype. PDL-1 requires `visual-reference-research.md` task for @analyst, but the Branding squad has no @analyst agent and no research task. Stella's `moodboard-generate.md` generates aesthetic mood images, NOT layout-structural analysis of reference sites. | CRITICO | C1 completely absent. Without visual references, the AI-generated layout pipeline (primary mode) cannot function. | Create `visual-reference-research.md` task. Option A: Add to Stella's tasks (since she does brand discovery). Option B: Delegate to AIOX @analyst agent as specified in EPIC-BSS-D (PDL-1). Recommendation: Option B (AIOX @analyst) since the skill is research-centric, not brand-strategy-centric. The Branding squad config should declare this as an external dependency in `handoffs`. |
| BG-2 | **No Layout Brief / Reference Analysis capability** -- No agent analyzes layout patterns (nav, grid, whitespace, corners, animations) from reference sites. PDL-2 assigns this to @architect, but the Branding squad has no @architect agent. The ds-architect (Atlas) in the Design System squad audits codebases, not visual references. | CRITICO | C2 completely absent. The layout brief is the bridge between visual references and layout generation. | Create `layout-brief.md` task. Assign to AIOX @architect (Aria) as specified in EPIC-BSS-D (PDL-2). The Branding squad should declare this as an external dependency. Alternatively, could be given to ds-architect (Atlas) if his scope is expanded, but his current focus is React/Tailwind component architecture, not visual composition analysis. |
| BG-3 | **Brand Book Builder (Paige) generates from fixed templates, not unique layouts** -- Paige's tasks (`brand-book-generate.md`) produce brand books from a predefined section structure (Guidelines, Foundations, Logo, Colors, Typography, Icons, Components, Motion, Templates). PDL-4 requires generating UNIQUE layout code from the layout brief. Paige has no concept of "layout brief" as an input, and her output structure is template-driven. | CRITICO | C3 partially absent. The brand book builder is the primary consumer of AI-generated layout, but has no mechanism to accept a layout brief and generate unique structural HTML from it. | Modify `brand-book-builder.md` agent definition to: (1) accept `layout-brief.md` as input, (2) add `generate-unique-layout` command/task that uses the brief to produce unique HTML/CSS instead of fixed template, (3) add structural diversity rules to ensure no two brands share the same layout skeleton. This is PDL-4 in the epic. |
| BG-4 | **Token Engineer (Toren) has no concept of Layout Tokens** -- Toren's token schema is 3-tier (primitive/semantic/component). The architecture document specifies a parallel "layout" tier with tokens for `nav.style`, `whitespace.density`, `corner.radius.base`, `divider.style`, `animation.entrance`, `grid.rhythm`, etc. Toren's tasks (`token-schema-create.md`, `style-dictionary-build.md`) do not reference layout tokens. | ALTO | C4 absent in token-engineer scope. Layout tokens are a foundational dependency for all PDL functionality. Without them, layout variation cannot be tokenized or exported. | Extend Toren's scope: (1) Add `layout-token-generate.md` task that consumes Layout Personality Engine output and produces `layout/layout.json` in W3C DTCG format, (2) Update `token-schema-create.md` to include layout token tier, (3) Update `style-dictionary-build.md` to include `layout/layout.json` in tokenFiles. Alternatively, layout token generation could be owned by the new `@bss/layout-engine` package and Toren handles export only. |
| BG-5 | **brand-book-delivery workflow MISSING visual-research and layout-brief steps** -- The current `brand-book-delivery.yaml` workflow has: generate > pdf > package > review > deploy. PDL-3 (the story) explicitly requires adding visual reference research and layout brief steps BEFORE generate. Without these steps, the pipeline cannot produce personality-driven layouts. | CRITICO | The core delivery workflow does not support the PDL pipeline. Brand books will continue using fixed templates until this is updated. | Modify `brand-book-delivery.yaml` to add: (1) `visual-research` step (agent: @analyst, task: visual-reference-research.md) BEFORE generate, (2) `layout-brief` step (agent: @architect, task: layout-brief.md) AFTER visual-research and BEFORE generate, (3) `layout-resolve` step (optional, for fallback mode using Layout Personality Engine). |
| BG-6 | **brand-discovery-flow workflow does not produce visual reference data** -- The `brand-discovery-flow.yaml` produces brand_profile, voice_guide, manifesto, moodboard, and tokens, but NOT visual references or layout brief. Since brand-book-delivery depends on brand-discovery-flow artifacts, the discovery flow should either include visual research or the delivery flow should handle it independently. | MEDIO | Discovery output is incomplete for PDL pipeline. The layout brief depends on visual references which depend on the brand profile. | Either: (A) Add visual-reference-research step to `brand-discovery-flow.yaml` (making visual research part of discovery), or (B) Keep visual research in the delivery workflow only (decoupled from discovery). Recommendation: Option B, since visual research is delivery-specific and not all discovery flows need it (e.g., social media only projects). |
| BG-7 | **QA Reviewer (Quentin) has no layout-specific quality gates** -- Quentin reviews deliverables for brand consistency, WCAG contrast, typography hierarchy, and responsive validation. But he has no tasks for: (1) Lighthouse performance >90 on generated layouts, (2) responsive validation at exactly 375/768/1440 breakpoints, (3) visual regression baseline comparison between brands, (4) layout structural diversity validation (ensuring two brands don't get identical skeletons). | ALTO | C5 partially covered. Basic a11y and brand consistency exist, but layout-specific quality criteria are absent. | Extend QA tasks: (1) Add `layout-quality-gate.md` task with Lighthouse >90, WCAG AA, responsive 375/768/1440 checks, (2) Add visual regression baseline to `review-deliverable.md`, (3) Add structural diversity check (compare layout skeletons between brands). This maps to PDL-9 in the epic. |
| BG-8 | **Web Builder (Webb) has no layout-aware rendering** -- Webb creates landing pages and institutional sites with fixed template structure. The architecture document (Section 7.1, 9) specifies significant changes to `static-generator.ts` and Nunjucks templates to support layout-conditional rendering (6 nav partials, 8 divider partials, section background treatments). Webb's current tasks have no concept of layout tokens as input. | ALTO | Landing pages and sites will not benefit from PDL until Webb's tasks are updated. | Extend Webb's tasks: (1) Update `landing-page-create.md` and `institutional-site.md` to accept layout tokens as input, (2) Add layout-conditional template rendering support, (3) Ensure Nunjucks partials for nav/divider styles are available. This maps to PDL-7 in the epic. |
| BG-9 | **No `@bss/layout-engine` package or agent** -- The architecture specifies a new standalone package `@bss/layout-engine` with family-resolver, personality-modulator, and token-emitter. This is not a squad agent but a code package. No agent in the Branding squad currently owns layout resolution logic. | ALTO | T1 absent. The engine is the core computational component of PDL. | The `@bss/layout-engine` package is a @dev implementation task (PDL-1 in the architecture's own story breakdown). However, the Branding squad should declare it as a dependency. Consider adding a thin wrapper agent or extending token-engineer (Toren) to invoke the engine as part of token generation. |
| BG-10 | **Creative Producer (Cleo) has no layout token awareness** -- Cleo orchestrates batch creative generation (carousels, thumbnails, social posts) but her TokenSet does not include layout tokens. The architecture document Section 10 specifies adding `layout` to `TokenSet` in `@bss/creative` types. | MEDIO | Social media posts will not reflect brand layout personality (corner radius, padding, card shape) until creative pipeline is updated. | Extend creative pipeline types to include `layout?: LayoutTokenFlat` in TokenSet. Update shared components (BrandBar, Headline, CtaBadge) to use layout tokens. This maps to PDL-8/PDL-10 in the epic. |
| BG-11 | **No handoff declaration for @analyst and @architect in config.yaml** -- The `handoffs` section in `squads/branding/config.yaml` does not reference external AIOX agents (@analyst, @architect) that PDL requires. The epic explicitly assigns tasks to these agents. | BAIXO | Handoff routing will not automatically chain to external agents for visual research and layout brief steps. | Add handoff entries to config.yaml: `analyst: { receives_from: [brand-strategist], routes_to: [architect] }` and `architect: { receives_from: [analyst], routes_to: [brand-book-builder] }` (external agent handoffs). |

### Score de Saude para PDL: 18/100

**Scoring rationale:**
- 4 CRITICO gaps (BG-1, BG-2, BG-3, BG-5): -80 points (4 x 20)
- 4 ALTO gaps (BG-4, BG-7, BG-8, BG-9): -40 points (4 x 10)
- 2 MEDIO gaps (BG-6, BG-10): -10 points (2 x 5)
- 1 BAIXO gap (BG-11): -2 points
- Base: 100 - 80 - 40 - 10 - 2 = **18/100 -- NOT READY for PDL**

The squad has strong foundations for what it currently does (brand discovery, tokens, brand book generation, QA). But the PDL pipeline introduces fundamentally new capabilities (visual reference research, layout analysis, layout-aware generation, layout tokens) that are entirely absent from the squad's current agent/task/workflow definitions.

---

## Squad: Design System

### Capacidades Existentes (relevantes ao PDL)

Based on analysis of `squads/design-system/config.yaml`, all 6 agents, 3 workflows, and complete task inventory:

| Capability | Agent/Task | Status | Relevance to PDL |
|-----------|-----------|--------|-------------------|
| Atomic Design Audit | ds-architect (Atlas) / `atomic-audit.md` | EXISTS | Audits React/Next.js codebases for component hierarchy -- useful for auditing PDL-generated components but NOT for analyzing visual layout references |
| Pattern Extraction | ds-architect (Atlas) / `pattern-extract.md` | EXISTS | Extracts recurring UI patterns into reusable specs -- could be extended to extract layout patterns from reference sites, but currently focused on React codebases |
| Token Transformation (W3C DTCG) | token-transformer (Tara) / `token-transform.md` | EXISTS | Transforms W3C DTCG tokens to CSS/SCSS/Tailwind/TypeScript -- DIRECTLY relevant: can transform layout tokens if they follow W3C DTCG format |
| Theme Creation | token-transformer (Tara) / `theme-create.md` | EXISTS | Creates theme variants (dark, high-contrast) -- could be extended to create layout family variants, but currently handles color/type themes only |
| Component Build (React/TSX) | component-builder (Cole) / `component-build.md` | EXISTS | Builds token-driven React/TSX components with cva -- relevant for building layout-aware components (nav partials, dividers) as React components |
| Component Variants | component-builder (Cole) / `component-variants.md` | EXISTS | Generates size/state/theme variants -- could generate layout family variants for components |
| WCAG Accessibility Audit | a11y-auditor (Asha) / `a11y-audit.md` | EXISTS | WCAG 2.2 AA/AAA compliance audit with axe-core -- DIRECTLY relevant to PDL quality gate (C5) |
| Accessibility Remediation | a11y-auditor (Asha) / `a11y-remediate.md` | EXISTS | Fixes a11y issues -- relevant for fixing PDL-generated layout a11y issues |
| Component Documentation | ds-documenter (Doris) / `ds-document.md` | EXISTS | Generates docs with props, examples, do/don't -- relevant for documenting layout components |
| Migration Planning | migration-planner (Miles) / `migration-plan.md` | EXISTS | Plans legacy-to-DS migration -- could plan migration from fixed templates to layout-aware templates |
| Token Pipeline (full) | `token-pipeline-flow.yaml` | EXISTS | Ingest > validate > transform > themes > quality > sync -- could include layout tokens in pipeline |
| Component Library (full) | `component-library-flow.yaml` | EXISTS | Plan > tokens > atoms > molecules > organisms > variants > audit > test > document | EXISTS | Could produce layout component atoms (nav, divider) |
| Design System Build (full) | `design-system-build-flow.yaml` | EXISTS | Audit > extract > transform > build > variants > a11y > document > test -- covers full lifecycle |

**Integration Analysis:**

The Design System squad has a declared dependency on the Branding squad:
```yaml
branding_integration:
  receives_from_branding:
    - design_tokens
    - palette
    - typography
    - brand_profile
```

This list does NOT include `layout_tokens` -- a gap.

### Gaps Identificados

| # | Gap | Severidade | Impacto | Recomendacao |
|---|-----|-----------|---------|-------------|
| DG-1 | **ds-architect (Atlas) does not define layout families or layout tokens** -- Atlas's focus is Atomic Design hierarchy for React/Next.js components, Tailwind CSS 4 architecture, cva patterns, and tree-shaking. He has no concept of "layout families" (ETHEREAL, BOLD-STRUCTURED, WARM-ARTISAN, ADVENTUROUS-OPEN, PLAYFUL-DYNAMIC, REBEL-EDGE) or spatial composition architecture. The architecture document (Section 3) defines 6 families with detailed visual DNA, key tokens, and ASCII wireframes. | ALTO | T1 partially absent in design-system scope. Atlas cannot currently contribute to layout family definition or architecture. The `@bss/layout-engine` is specified as a standalone package, not part of the DS squad. | [AUTO-DECISION] Should Atlas own layout family architecture? --> No (reason: Layout families are brand-personality-driven, not component-architecture-driven. Atlas should CONSUME layout tokens to build layout-aware components, not DEFINE the families. The Layout Personality Engine lives outside both squads as `@bss/layout-engine`). However, Atlas should be extended with a task to audit generated layouts for structural quality and consistency. |
| DG-2 | **token-transformer (Tara) does not handle layout tokens** -- Tara transforms color, typography, spacing, and effects tokens. Her task `token-transform.md` and the `token-pipeline-flow.yaml` workflow do not reference layout tokens. The architecture document (Section 5) specifies that `layout/layout.json` should be added to the token pipeline alongside existing files. | ALTO | C4 partially absent. Layout tokens will not be transformed to CSS/Tailwind/TypeScript until Tara's pipeline is updated. | Extend Tara's scope: (1) Update `token-transform.md` to handle layout token type ($type: "string" for enum values, $type: "dimension" for spatial values), (2) Add `layout/layout.json` to token pipeline ingestion, (3) Generate `--layout-*` CSS custom properties, (4) Add layout token validation rules. This is low-risk since the W3C DTCG format is already supported -- layout tokens just add new token paths. |
| DG-3 | **component-builder (Cole) does not create layout-aware components** -- Cole builds React/TSX components with cva variants and Tailwind CSS, but has no concept of: (1) navigation partials per layout family, (2) divider components per layout family, (3) section containers with layout-driven spacing, (4) responsive layout containers. The architecture document (Section 9) specifies 6 nav partials and 8 divider partials as template fragments. | ALTO | T3 partially absent. Layout-variant components (nav, divider, section) need to be built as reusable atoms/molecules. | Extend Cole's scope: (1) Add `layout-component-build.md` task for creating nav, divider, and section layout components, (2) Each nav component should be a variant-driven atom (6 variants via cva), (3) Each divider should be a variant-driven atom (8 variants), (4) Section containers should accept layout tokens for spacing, background, and corner radius. Note: The Eta/Nunjucks partials in the architecture are for the static-generator (HTML templates), but for the React-based creative pipeline and component library, Cole should build equivalent React components. |
| DG-4 | **No layout variability in documentation** -- ds-documenter (Doris) documents component props, variants, and usage examples. But there is no documentation coverage for: (1) layout family showcase (visual comparison of all 6 families), (2) layout token reference page, (3) layout component usage across families, (4) "Layout Philosophy" section for brand books. | MEDIO | Documentation will not cover layout variability, making it harder for developers and designers to understand the system. | Extend Doris's scope: (1) Add `layout-docs.md` task for generating layout family showcase pages, (2) Include layout token reference in token documentation, (3) Create visual comparison grid showing same content in all 6 families. This maps to PDL-13 in the architecture. |
| DG-5 | **a11y-auditor (Asha) does not validate layout-specific accessibility** -- Asha audits WCAG compliance for React components (axe-core, contrast, keyboard, ARIA). But layout-specific a11y concerns are not addressed: (1) navigation pattern a11y (landmark roles, skip links per nav style), (2) animation accessibility (prefers-reduced-motion per entrance type), (3) responsive layout a11y (touch target sizes at 375px, content reflow). Asha's skills include Framer Motion `useReducedMotion` compliance and Playwright a11y testing, which is relevant but not specialized for layout. | MEDIO | C5 partially covered. Layout-specific a11y gaps (skip links per nav style, animation motion preferences, responsive touch targets) could cause WCAG failures on generated layouts. | Extend Asha's audit scope: (1) Add layout-specific a11y checks to `a11y-audit.md` (navigation landmarks, skip links, animation motion preferences), (2) Add responsive layout audit at 375/768/1440 breakpoints with touch target validation, (3) Verify that each nav style variant includes proper ARIA landmarks. |
| DG-6 | **branding_integration does not include layout_tokens** -- The `config.yaml` integration section declares receiving `design_tokens`, `palette`, `typography`, and `brand_profile` from the Branding squad. `layout_tokens` is absent. | MEDIO | Layout tokens from the Branding pipeline will not automatically flow to the Design System squad without explicit integration. | Add `layout_tokens` to `branding_integration.receives_from_branding` list. Also add `layout_components` to `provides_to_branding` (nav, divider, section components). |
| DG-7 | **Token pipeline workflow does not include layout token validation** -- The `token-pipeline-flow.yaml` validates, transforms, creates themes, and syncs tokens, but has no step for layout-specific validation: (1) enum values must be from closed set (6 families, 6 nav styles, etc.), (2) dimension values must be valid CSS, (3) animation tokens must have valid duration and easing values. | MEDIO | Invalid layout tokens could pass the pipeline and produce broken CSS or incorrect template includes. | Add layout token validation to the `validate` step in `token-pipeline-flow.yaml`. Create specific validation rules: (a) `layout.family` must be one of 6 valid values, (b) `layout.nav.style` must be one of 6 valid values, (c) `layout.divider.style` must be one of 8 valid values, (d) dimension tokens must be valid CSS (px, rem, vh, %), (e) animation.easing must be valid cubic-bezier or keyword. |
| DG-8 | **No layout family theme support** -- Tara can create dark mode and high-contrast themes. But "layout families" are conceptually different from color themes. There is no mechanism to: (1) create a layout theme (switching from one family to another), (2) override individual layout tokens within a family, (3) provide layout previews in different families. | BAIXO | Layout families are resolved at build time (ADR-PDL-005), not switched at runtime like color themes. This is a lower-severity gap since the architecture intentionally resolves layout at build time. | No immediate action required for V1. In V2, if runtime layout switching is desired, Tara's theme-create.md could be extended to support layout family themes alongside color themes. For now, the build-time resolution model is correct per the architecture ADRs. |
| DG-9 | **migration-planner (Miles) has no layout migration path** -- Miles plans migration from legacy UI to design system components. With PDL, existing static-generator templates (18 Eta templates with hardcoded layout) need migration to layout-token-driven templates. Miles has no migration plan for this. | BAIXO | Existing brand books and sites will not automatically adopt PDL. Migration from fixed templates to layout-aware templates needs planning. | Add layout migration as a phase in Miles's scope. The architecture document Section 13 (Backward Compatibility) already defines a 4-phase migration path (Phase 0: standalone engine, Phase 1: CSS vars with fallbacks, Phase 2: template partials, Phase 3: creative integration, Phase 4: animations). Miles should formalize this into his `migration-plan.md` output. |

### Score de Saude para PDL: 38/100

**Scoring rationale:**
- 0 CRITICO gaps: -0 points
- 3 ALTO gaps (DG-1, DG-2, DG-3): -30 points (3 x 10)
- 4 MEDIO gaps (DG-4, DG-5, DG-6, DG-7): -20 points (4 x 5)
- 2 BAIXO gaps (DG-8, DG-9): -4 points (2 x 2)
- Existing PDL-relevant capabilities (token transformation, a11y, component building): +8 bonus for reusable foundation
- Deduction for no CRITICO but several structural gaps
- Base: 100 - 30 - 20 - 4 - 8 (no direct PDL support) = **38/100 -- SIGNIFICANT GAPS for PDL**

The Design System squad has better foundational readiness than Branding (token transformation, component building, a11y auditing are all reusable for PDL), but still lacks explicit layout awareness across all agents and workflows. The critical difference is that the DS squad has NO CRITICO gaps -- all its capabilities can be extended incrementally -- while the Branding squad has 4 CRITICO gaps representing entirely missing capabilities.

---

## Cross-Squad Analysis

### PDL Pipeline Ownership Map

| Pipeline Step | Owner (EPIC-BSS-D) | Branding Squad Support | Design System Squad Support | Gap Level |
|--------------|-------------------|----------------------|---------------------------|-----------|
| Brand Profile Input | brand-strategist (Stella) | EXISTS (produces archetypes + personality) | N/A (consumer) | NONE |
| Visual Reference Research | @analyst (AIOX core) | ABSENT (BG-1) | ABSENT | CRITICO |
| Reference Analysis / Layout Brief | @architect (AIOX core) | ABSENT (BG-2) | Partial (Atlas audits code, not visual refs) | CRITICO |
| Layout Family Resolution | @bss/layout-engine (new) | ABSENT (BG-9) | ABSENT (DG-1) | ALTO |
| Layout Token Generation | token-engineer (Toren) | ABSENT (BG-4) | token-transformer (Tara) can transform once generated (DG-2) | ALTO |
| Layout CSS Generation | @bss/static-generator (new module) | ABSENT | ABSENT | ALTO |
| Brand Book Layout-Aware Rendering | brand-book-builder (Paige) | ABSENT (BG-3) -- uses fixed templates | N/A | CRITICO |
| Site/LP Layout-Aware Rendering | web-builder (Webb) | ABSENT (BG-8) | N/A | ALTO |
| Creative Layout Token Injection | creative-producer (Cleo) | ABSENT (BG-10) | N/A | MEDIO |
| Layout Component Build (React) | N/A in current epic | N/A | component-builder (Cole) capable but not tasked (DG-3) | ALTO |
| Layout A11y Validation | qa-reviewer (Quentin) | Partial (BG-7) | a11y-auditor (Asha) capable but not tasked (DG-5) | MEDIO |
| Responsive Quality Gate (375/768/1440) | PDL-9 | ABSENT (BG-7) | Partial (Asha does responsive a11y) | ALTO |
| Lighthouse >90 Validation | PDL-9 | Webb has Lighthouse awareness | ABSENT | MEDIO |

### Dependency Chain for PDL

```
Brand Profile (EXISTS in Branding)
  --> Visual Reference Research (ABSENT -- needs @analyst)
  --> Layout Brief (ABSENT -- needs @architect)
  --> Layout Personality Engine (ABSENT -- needs @bss/layout-engine)
  --> Layout Tokens (ABSENT -- needs Toren extension + Tara pipeline)
  --> Layout CSS Generation (ABSENT -- needs new module)
  --> Template Partials (ABSENT -- needs Paige/Webb updates)
  --> Quality Gates (PARTIAL -- needs Quentin/Asha extension)
```

The dependency chain shows that the FIRST 3 steps are entirely absent, making everything downstream blocked until they are created. This is consistent with the EPIC-BSS-D wave structure: Wave 1 builds the research pipeline, Wave 2 proves the concept, Wave 3 extends to other deliverables.

---

## Consolidated Recommendations

### Priority 1: CRITICO -- Must resolve before any PDL development

| # | Action | Squad | Estimated Effort |
|---|--------|-------|-----------------|
| R1 | Create `visual-reference-research.md` task and assign to AIOX @analyst (not a Branding squad agent -- external dependency) | External + Branding (handoff) | 3 SP (PDL-1) |
| R2 | Create `layout-brief.md` task and assign to AIOX @architect (not a Branding/DS squad agent -- external dependency) | External + Branding (handoff) | 2 SP (PDL-2) |
| R3 | Modify `brand-book-builder.md` (Paige) to accept layout brief and generate unique layout code | Branding | 3 SP (PDL-4) |
| R4 | Modify `brand-book-delivery.yaml` workflow to add visual-research and layout-brief steps | Branding | 2 SP (PDL-3) |

### Priority 2: ALTO -- Must resolve during PDL Wave 1

| # | Action | Squad | Estimated Effort |
|---|--------|-------|-----------------|
| R5 | Extend token-engineer (Toren) to support layout token generation | Branding | 2 SP |
| R6 | Extend token-transformer (Tara) to transform layout tokens | Design System | 1 SP |
| R7 | Create `layout-quality-gate.md` task for Quentin (Branding QA) | Branding | 2 SP (PDL-9) |
| R8 | Extend web-builder (Webb) tasks for layout-aware rendering | Branding | 3 SP (PDL-7) |
| R9 | Create layout nav/divider/section components via component-builder (Cole) | Design System | 3 SP |
| R10 | Implement `@bss/layout-engine` package (dev task, not squad config) | @dev | 3 SP (PDL-1 architecture) |

### Priority 3: MEDIO -- Should resolve during PDL Wave 2-3

| # | Action | Squad | Estimated Effort |
|---|--------|-------|-----------------|
| R11 | Update `branding_integration` in DS config to include layout_tokens | Design System | 0.5 SP |
| R12 | Extend creative pipeline TokenSet with layout tokens | Branding | 2 SP (PDL-8) |
| R13 | Add layout token validation to token pipeline workflow | Design System | 1 SP |
| R14 | Extend a11y-auditor (Asha) for layout-specific accessibility | Design System | 1 SP |
| R15 | Create layout family documentation with ds-documenter (Doris) | Design System | 2 SP (PDL-13) |

### Priority 4: BAIXO -- Can defer to PDL Wave 4 or post-PDL

| # | Action | Squad | Estimated Effort |
|---|--------|-------|-----------------|
| R16 | Add external agent handoffs to Branding config.yaml | Branding | 0.5 SP |
| R17 | Layout migration plan via migration-planner (Miles) | Design System | 1 SP |
| R18 | Runtime layout theme switching support (V2 feature) | Design System | Deferred |

---

## Audit Decision

**NEEDS_WORK**

Both squads have significant gaps against the EPIC-BSS-D requirements. The Branding squad is critically unprepared (18/100) with 4 entirely missing capabilities. The Design System squad has better foundations (38/100) but lacks explicit layout awareness across all agents.

The EPIC-BSS-D story breakdown (PDL-1 through PDL-11) already addresses most of these gaps -- but the squad configurations, agent definitions, and workflow files have not yet been updated to reflect the planned work. This audit serves as the pre-PDL readiness assessment.

**Before starting PDL Wave 1, the following squad configuration updates are required:**
1. Branding squad `config.yaml` must declare external dependencies on @analyst and @architect
2. Branding workflow `brand-book-delivery.yaml` must be updated with the PDL pipeline steps
3. token-engineer (Toren) agent definition must be extended for layout tokens
4. Design System `config.yaml` must add `layout_tokens` to branding integration

These are configuration/documentation changes, not code changes. The actual implementation work is tracked in the PDL stories.

---

-- Quinn, guardiao da qualidade
