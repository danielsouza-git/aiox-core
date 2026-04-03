# Domain Audit: QA Accessibility + Brand Pipeline vs PDL

**Date:** 2026-04-02
**Auditor:** qa-meta-domain-auditor + bp-domain-auditor
**Scope:** Gap analysis against EPIC-BSS-D (Personality-Driven Layouts)
**Method:** Exhaustive inspection of config.yaml, all agents, all tasks, all workflows, all checklists, and config files for both squads
**Prior Art:** `docs/reviews/pdl-squad-gap-analysis.md` (Atlas, Analyst Agent) -- this audit validates, deepens, and extends that analysis from the QA perspective

---

## Squad: QA Accessibility

### Capacidades Existentes (relevantes ao PDL)

The squad has 4 agents, 18 tasks, 3 workflows, and 4 checklists. The following capabilities are directly applicable to PDL-generated layout validation.

| Agent | Name | Relevant Tasks | PDL Coverage |
|-------|------|----------------|-------------|
| visual-qa | Vega | `responsive-test.md`, `cross-browser-test.md`, `visual-review.md`, `screenshot-compare.md` | Responsive breakpoint testing at 320/375/768/1024/1440/1920px; cross-browser rendering (Chrome, Firefox, Safari, Edge); pixel-perfect comparison against specs; visual regression detection |
| a11y-tester | Ally | `wcag-test.md`, `screen-reader-test.md`, `keyboard-nav-test.md`, `color-contrast-test.md` | WCAG 2.2 AA compliance via axe-core + Pa11y; VoiceOver/NVDA screen reader testing; full keyboard navigation audit; color contrast ratio calculation (4.5:1/3:1) |
| brand-compliance | Barrett | `brand-compliance-check.md`, `logo-usage-verify.md`, `palette-compliance.md`, `typography-compliance.md`, `manifest-validate.md` | 9-phase compliance audit (logo, color, typography, spacing, imagery, manifest, React token compliance, animation compliance); scoring system (15% per category) |
| performance-auditor | Percy | `lighthouse-audit.md`, `core-web-vitals.md`, `asset-size-audit.md`, `next-build-validate.md`, `static-export-validate.md` | Lighthouse 4-category audit (Perf/A11y/BP/SEO); CWV measurement (LCP<2.5s, INP<200ms, CLS<0.1); Next.js build validation; static export integrity check |

**Workflow Coverage:**
- `qa-pipeline-flow.yaml` (8 phases): manifest-validate -> next-build-validate -> static-export-validate -> visual-review -> cross-browser -> responsive -> accessibility -> brand-compliance -> performance -> report
- `a11y-certification-flow.yaml`: dedicated WCAG certification workflow
- `brand-compliance-flow.yaml`: dedicated brand enforcement workflow

**Checklist Coverage:**
- `visual-qa-checklist.md`: 39 items across Layout/Typography/Colors/Images/Interactive/Animations/Responsive
- `a11y-wcag-checklist.md`: WCAG-aligned POUR principles checklist
- `brand-compliance-checklist.md`: brand guideline enforcement
- `performance-checklist.md`: 43 items across CWV/Images/Fonts/CSS/JS/Caching/Loading/Lighthouse

**Standards:**
- `config/testing-standards.md` defines breakpoints at 320/375/768/1024/1440/1920px (P0 and P1 priorities)
- Lighthouse targets: Performance>=90, Accessibility>=95, BP>=90, SEO>=90
- Brand compliance minimum: 85% across all categories

### Gaps Identificados

| # | Gap | Severidade | Impacto PDL | Recomendacao |
|---|-----|-----------|-------------|--------------|
| QA-1 | **No layout personality validation** -- No task validates that a generated layout EXPRESSES the target brand personality/archetype. Barrett checks tokens (color, typography, animation) but has zero concept of "does this layout feel like an Explorer brand?" | CRITICO | PDL story PDL-9 requires quality gates that validate "the layout corresponds to the archetype/personality of the brand". Without this, an AI-generated Explorer layout that accidentally produces an Innocent-feeling layout would pass all existing gates. | Create new task `layout-personality-score.md` assigned to Barrett (brand-compliance). Input: generated layout HTML/CSS + brand-profile.yaml. Score each layout dimension (nav style, whitespace density, corner radius, divider style, animation, grid rhythm) against the expected layout family preset from the architecture doc. Output: personality expression score (0-100%) with per-dimension breakdown. |
| QA-2 | **No cross-brand differentiation check** -- No task compares layouts between different brands to verify they are DIFFERENT. PDL's core promise is "2 brands with different personalities produce different layouts." Current QA validates one brand at a time in isolation. | CRITICO | Without this, two brands could silently receive identical layouts and pass all individual QA gates. The PDL architecture requires each brand to produce a unique layout skeleton. PDL-5/PDL-6 PoC stories explicitly require comparing Stray Innocence vs Nova Vista Cafe. | Create new task `layout-differentiation-check.md` assigned to Vega (visual-qa). Input: two generated brand layouts. Process: screenshot both at same viewport, compute visual diff percentage, verify structural differences (nav type, grid, dividers, corner radii, animations). Output: differentiation score. Threshold: >=15% visual diff AND at least 3/7 layout dimensions must differ. |
| QA-3 | **Responsive test lacks PDL-specific breakpoints** -- `responsive-test.md` tests 5 breakpoints (320/768/1024/1440/1920) but PDL explicitly requires validation at 375px (standard phone), 768px (tablet), and 1440px (desktop). 375px is listed in `testing-standards.md` as P1 but is NOT in the responsive-test.md default breakpoints -- it is only listed in the Breakpoint Reference table, not in the Phase 1 sweep. | ALTO | PDL-9 specifies "responsive at 375px/768px/1440px breakpoints" as a hard quality gate. The responsive-test task defaults to 320px instead of 375px for mobile. While 320px is more conservative (smaller), the PDL story EXPLICITLY names 375px and the QA gate must validate what the story specifies. | Modify `responsive-test.md` to add 375px as an explicit Phase 1 breakpoint (not just in the reference table). The task already has the infrastructure; this is a configuration alignment issue. |
| QA-4 | **Brand compliance lacks layout token validation** -- `brand-compliance-check.md` Phase 7 validates React component tokens (Tailwind classes vs hardcoded values) and Phase 8 validates Framer Motion animations. But there is no phase that validates **layout tokens** (--layout-nav-style, --layout-corner-radiusBase, --layout-whitespace-multiplier, etc.). The architecture defines 30+ layout CSS custom properties that must be present and correct. | ALTO | When PDL is implemented, the CSS will contain `var(--layout-corner-radiusBase, 8px)` patterns. If layout tokens are missing or wrong, the CSS falls back silently to hardcoded values (backward compatibility feature). This means a brand intended to be ETHEREAL (24px radius) could silently render as BOLD-STRUCTURED (0px radius) without triggering any compliance violation. | Add Phase 7b "Layout Token Compliance" to `brand-compliance-check.md`. Check: (1) all --layout-* CSS vars present in tokens.css, (2) values match layout.json, (3) no hardcoded layout values bypass the token system, (4) nav partial matches layout.nav.style token. |
| QA-5 | **No layout-brief-to-output comparison** -- PDL-2 produces a `layout-brief.md` with structural recommendations. PDL-4/7 then generate actual layouts. No QA task compares the brief against the generated output to verify the generation followed the brief. | ALTO | If the AI layout generator deviates from the layout brief, no gate catches it. For example, the brief says "sticky-minimal nav with generous whitespace" but the generated layout uses a sidebar with compact spacing. This is a requirements traceability gap specific to the AI generation pipeline. | Create new task `layout-brief-compliance.md` assigned to Barrett (brand-compliance). Input: layout-brief.md + generated HTML/CSS. Process: extract recommended structural properties from brief, compare against actual CSS/HTML structure. Output: brief-compliance score. |
| QA-6 | **Performance testing does not account for layout-specific density** -- Percy's lighthouse-audit tests against uniform thresholds (Perf>=90). PDL introduces variable whitespace density (0.7x for REBEL-EDGE to 1.5x for ETHEREAL). An ETHEREAL layout with spacious whitespace naturally has larger page height, more scroll, and potentially more images below the fold. A REBEL-EDGE layout is compact with aggressive spacing. Performance characteristics differ per family, but thresholds are uniform. | MEDIO | This is not a blocker but could cause false positives/negatives. An ETHEREAL brand book with very long pages might have slightly different CWV characteristics than a compact REBEL-EDGE one. The current uniform thresholds may be too strict for spacious layouts (more content below fold = different LCP behavior) or too lenient for compact ones. | Add a "Layout Density Context" section to `lighthouse-audit.md` that logs the layout family and whitespace density alongside performance scores. No threshold changes needed for V1, but the data should be captured to inform future threshold tuning. |
| QA-7 | **Visual regression baseline management undefined for layout variants** -- `screenshot-compare.md` captures baselines per release, but with 6 layout families, each brand will have a fundamentally different visual structure. The current baseline management assumes one "correct" layout. | MEDIO | After PDL, baseline management becomes more complex: each family needs its own baseline set. If a brand switches from ETHEREAL to WARM-ARTISAN (due to profile change), the visual regression system would flag 100% change -- which is intentional, not a regression. | Extend `screenshot-compare.md` and `testing-standards.md` to include layout-family-aware baseline management. Tag each baseline with its layout family. When family changes, flag it as "intentional layout change" rather than "regression". |
| QA-8 | **No validation for CSS animation entrance types** -- The visual-qa-checklist.md checks "Transition timing matches spec" and "Animation triggers fire at correct scroll position" but does not validate against PDL's 6 entrance animation types (none, fade-up, slide-in, scroll-reveal, bounce-in, cut-in). Barrett checks Framer Motion animation compliance but not CSS-only animations from the layout system. | MEDIO | PDL-7 (CSS Animation System) uses CSS-only animations (keyframes, @scroll-timeline). These are different from the Framer Motion animations validated in Phase 8 of brand-compliance-check. The CSS animation entrance type defined in layout tokens has no dedicated validation. | Add CSS animation entrance type validation to either `visual-review.md` (visual inspection) or create a subsection in `brand-compliance-check.md` Phase 8 that covers both Framer Motion AND CSS-only layout animations. |
| QA-9 | **No template partial coverage check** -- PDL introduces 6 navigation partials and 8 divider partials. No QA task validates that the correct partial is rendered for the resolved layout family. | BAIXO | If the template include logic has a bug (e.g., ETHEREAL brand renders sidebar-fixed nav instead of centered-top), no gate catches it specifically. Barrett's general brand compliance would flag "layout doesn't match" but lacks partial-level granularity. | Add partial rendering validation to the proposed `layout-personality-score.md` task. Check: nav partial rendered = expected nav partial for family; divider partial rendered = expected divider for family. |
| QA-10 | **qa-pipeline-flow.yaml lacks a PDL sub-pipeline phase** -- The 8-phase QA pipeline flow has no hook point for PDL-specific validation. Layout personality scoring, differentiation checks, and brief compliance need to be integrated into the existing flow. | BAIXO | Without an integration point, PDL validation tasks would need to be run manually outside the standard QA pipeline. This defeats the automation purpose of the qa-pipeline-flow. | Add a new phase (Phase 4b or integrate into Phase 5) in `qa-pipeline-flow.yaml` for layout-specific validation after visual-review and before brand-compliance. This phase runs layout-personality-score and (when applicable) layout-differentiation-check. |

### Score de Saude para PDL: 52/100

**Scoring methodology:**
- Start at 100
- CRITICO gaps: -20 each (QA-1, QA-2 = -40)
- ALTO gaps: -10 each (QA-3, QA-4, QA-5 = -30)
- MEDIO gaps: -5 each (QA-6, QA-7, QA-8 = -15)
- BAIXO gaps: -2 each (QA-9, QA-10 = -4)
- Existing capability credit: +8 for comprehensive responsive, a11y, performance, and compliance infrastructure already in place
- Bonus: +3 for well-structured testing-standards.md that is easily extensible

**Summary:** The qa-accessibility squad has EXCELLENT foundational infrastructure (responsive testing, WCAG compliance, Lighthouse audits, brand compliance with token checks). Every one of the 18 existing tasks is directly applicable to PDL output. However, it lacks the **conceptual layer** needed for personality-driven validation: no task understands what a "correct layout for an Explorer brand" looks like, no task compares layouts across brands, and no task validates layout tokens or brief-to-output fidelity. The structural QA (is the HTML valid, is it responsive, is it accessible, is it performant) is strong; the **semantic QA** (does this layout express the intended personality) does not exist.

---

## Squad: Brand Pipeline

### Capacidades Existentes (relevantes ao PDL)

The squad has 1 agent (Maestro), 5 tasks, 3 workflows, 2 checklists, 1 config doc, and 1 template.

| Component | PDL-Relevant Capability |
|-----------|------------------------|
| **Maestro** (brand-orchestrator) | 7-phase pipeline orchestration; state machine with checkpoints; phase gating with retry; parallel execution of build phases (design-system, visual, content); delegation to 6 specialized squads |
| `run-pipeline.md` | Full pipeline execution with 7 phases: scaffold -> research -> discovery -> design-system/visual/content (parallel) -> QA |
| `run-phase.md` | Individual phase execution (can run any single phase) |
| `pipeline-status.md` | Pipeline state inspection |
| `resume-pipeline.md` | Resumable pipeline from last checkpoint |
| `pipeline-report.md` | Delivery report generation with quality scores |
| `full-brand-pipeline.yaml` | 7-phase workflow: scaffold(0) -> research(1) -> discovery(2) -> build[3-5] -> QA(6). QA phase includes: typescript-check, lint-check, build-export, export-validation, visual-review, wcag-test, brand-compliance-check, lighthouse-audit, link-validation, final-report |
| `express-brand-pipeline.yaml` | 5-phase fast pipeline: discovery -> build[streamlined] -> basic QA (brand-compliance + lighthouse only) |
| `refresh-brand-pipeline.yaml` | Incremental pipeline: file-timestamp change detection, re-runs only stale phases |
| `pipeline-gate-checklist.md` | 8-item inter-phase gate: outputs generated, files exist, no critical errors, quality score, schema conformance, brand consistency, duration, dependencies satisfied |
| `delivery-checklist.md` | 10-item final delivery gate: brand profile, tokens, components, visual assets, copy, WCAG AA, brand compliance >=90%, Lighthouse >=80, organized folder, delivery report |
| `pipeline-config.md` | Tech stack (Next.js 15, React 19, Tailwind 4, Framer Motion 11); phase dependencies; scaffold structure; component generation; motion components; brand book structure engine (profile-driven page selection, theme mode selection, layout style selection, nav style selection) |

**Critical observation:** `pipeline-config.md` already contains a **Layout Style Selection** section (6 styles: structured grid, organic flow, bold full-width, minimal whitespace, asymmetric/editorial, card-based mosaic) mapped to archetypes. This is conceptually aligned with PDL's 6 layout families but is NOT connected to any automated pipeline phase. It is documentation only -- Maestro does not invoke any layout resolution logic.

### Gaps Identificados

| # | Gap | Severidade | Impacto PDL | Recomendacao |
|---|-----|-----------|-------------|--------------|
| BP-1 | **No Visual Reference Research phase** -- The pipeline has 7 phases: scaffold, research, discovery, design-system, visual, content, QA. PDL requires a "Visual Reference Research" phase BETWEEN research and discovery (or after discovery) where an agent searches for 5-10 reference websites per brand by archetype. No such phase exists. | CRITICO | PDL-1 (Visual Reference Research Task) and PDL-3 (Brand Book Delivery Workflow Integration) explicitly require this new phase in the pipeline. Without it, the AI generation pipeline has no reference data to work from. The architecture document Section 10 shows the pipeline should include this phase. | Add new phase `visual-reference-research` to `full-brand-pipeline.yaml` between discovery and the build parallel group. Input: brand_profile (archetypes, personality), industry. Output: visual-references.md with 5-10 annotated reference URLs. Agent: competitive-analyst (Cyrus) from research-intelligence squad, or a new agent. Depends on: discovery. |
| BP-2 | **No Layout Brief Generation phase** -- PDL requires a "Layout Brief" phase where an architect agent analyzes visual references + brand profile to produce a layout-brief.md with structural recommendations (spacing ratios, visual hierarchy, composition guidelines). No such phase exists. | CRITICO | PDL-2 (Layout Brief Task) explicitly requires this. The layout brief is the PRIMARY input to the AI layout generator (PDL-4). Without the brief, the generator has no structural guidance beyond the brand profile. | Add new phase `layout-brief` to `full-brand-pipeline.yaml` after visual-reference-research and before the build parallel group. Input: visual-references.md + brand_profile. Output: layout-brief.md. Agent: architect or a new layout-architect agent. Depends on: visual-reference-research. |
| BP-3 | **Pipeline artifacts do not include layout tokens or layout brief** -- The `artifacts` section of `full-brand-pipeline.yaml` lists discovery outputs (brand_profile, tokens, palette, etc.) but has no entry for layout.json, visual-references.md, or layout-brief.md. The `refresh-brand-pipeline.yaml` watch_inputs/watch_outputs do not include layout files. | ALTO | Without artifact tracking, the pipeline state machine cannot persist or resume layout-related work. The refresh pipeline cannot detect changes to layout inputs (e.g., brand profile archetype changed -> layout tokens stale). Layout work becomes invisible to the orchestrator. | Update artifacts section in all 3 workflow files to include: `pdl: [visual_references, layout_brief, layout_tokens, layout_css]`. Update refresh-brand-pipeline.yaml change_detection rules to watch layout input/output files. |
| BP-4 | **Express pipeline has no layout consideration** -- `express-brand-pipeline.yaml` skips research and performs minimal QA. It has no PDL phases at all. If a client runs express mode, their brand book will have zero personality-driven layout -- it will fall back entirely to the default BOLD-STRUCTURED family. | ALTO | Express mode is described as "1-2 hours, quick brand refresh." For clients who already have a brand profile with archetypes (from a previous full run), the layout engine can resolve a family in <10ms (per the architecture doc). There is no technical reason to skip layout resolution in express mode. | Add a lightweight layout resolution step to `express-brand-pipeline.yaml` that runs the @bss/layout-engine resolver (no visual reference research, no layout brief -- just archetype-to-family mapping). This is a <10ms computation that produces layout tokens, providing layout differentiation even in express mode. |
| BP-5 | **Refresh pipeline cannot detect layout staleness** -- `refresh-brand-pipeline.yaml` watches specific input/output files per phase. There are no entries for layout-related files (`tokens/layout/layout.json`, `visual-references.md`, `layout-brief.md`). | ALTO | If a brand's personality traits change (e.g., formalCasual goes from 2 to 4), the layout tokens are stale but the refresh pipeline will not detect it. The brand book will continue rendering with outdated layout tokens until a full pipeline re-run. | Add change_detection rules for a new `pdl` phase in `refresh-brand-pipeline.yaml`. Watch inputs: `discovery/brand_profile.json` personality section. Watch outputs: `discovery/layout/layout.json`, `visual-references.md`, `layout-brief.md`. |
| BP-6 | **Pipeline-gate-checklist lacks layout gate criteria** -- The 8-item `pipeline-gate-checklist.md` checks generic concerns (outputs exist, schema conforms, brand consistency, etc.) but has no layout-specific check. It could not validate "layout tokens are present and match the resolved family." | ALTO | After PDL, a phase could pass the generic gate while producing incorrect or missing layout tokens. The "Brand Consistency" check (item 6) is about colors/fonts/voice, not layout structure. | Add a 9th gate item: "Layout Tokens Present -- Layout tokens generated (if PDL enabled), layout family matches brand archetype, layout.json schema valid." Make this conditional on the `bss.personalityDrivenLayouts.enabled` feature flag from core-config.yaml. |
| BP-7 | **Delivery-checklist lacks layout deliverables** -- The 10-item `delivery-checklist.md` verifies brand profile, tokens (3 formats), components, assets, copy, WCAG, brand compliance, Lighthouse, folder organization, and delivery report. It does not verify layout tokens, layout brief, or visual references as deliverables. | ALTO | After PDL, a "complete" delivery could be missing the layout brief, visual references, and layout tokens. The client would receive a brand book without the personality-driven layout documentation that differentiates their brand. | Add items: (11) "Layout Tokens Exported -- layout.json present with all required layout dimensions"; (12) "Layout Brief Present -- layout-brief.md with structural recommendations"; (13) "Visual References Documented -- visual-references.md with 5-10 annotated reference URLs". Mark these as conditional on PDL being enabled. |
| BP-8 | **Pipeline-report.md does not include layout quality metrics** -- The delivery report template (Step 5) includes phase gate average, brand compliance score, WCAG compliance, Lighthouse scores, and deliverables complete percentage. It does not include layout personality score, layout differentiation status, or brief compliance score. | MEDIO | The delivery report is the primary artifact clients see. Without layout quality metrics, the client has no visibility into whether their brand book's layout was correctly personalized. | Add a "Layout Quality" section to the pipeline-report.md template in Step 5: layout family resolved, personality expression score, brief compliance score. These metrics come from the proposed QA tasks (layout-personality-score, layout-brief-compliance). |
| BP-9 | **pipeline-config.md Layout Style Selection is disconnected from automation** -- The pipeline-config.md already defines 6 layout styles mapped to archetypes (Section "Layout & Theme Selection by Profile"). However, this is purely documentation -- there is no task, agent, or workflow step that reads this mapping and applies it. It lives in a config file but has no consumers. | MEDIO | This is a latent asset: the mapping logic already exists as documentation but is not codified as executable logic. When PDL is implemented, the @bss/layout-engine will contain this logic as code, making the config documentation potentially stale or contradictory if not synchronized. | When PDL stories are implemented, ensure the @bss/layout-engine resolver uses the same mapping as pipeline-config.md. After implementation, update pipeline-config.md to reference the engine's source code as the canonical mapping, deprecating the config documentation as the source of truth. |
| BP-10 | **Brand Book Structure Engine (profile-driven) lacks layout-family-aware page selection** -- pipeline-config.md defines page selection by industry and scope. It defines theme mode and layout style selection. But there is no connection between the resolved layout family and the page selection logic. For example, a PLAYFUL-DYNAMIC family might benefit from a "Motion Showcase" page being included by default, while a BOLD-STRUCTURED family might skip it. | MEDIO | This is a missed opportunity for deeper personalization. The page selection currently considers industry and archetype independently, not the resolved layout family. The layout family could inform which optional pages are most relevant. | Extend the "Optional Pages" selection rules in pipeline-config.md to include layout family as a selection factor. Example: "Motion Showcase: include when layout family is playful-dynamic or adventurous-open (strong motion identity)." This is an enhancement, not a blocker. |
| BP-11 | **No layout-specific retry or error handling** -- The retry policy (1 auto-retry per phase, re-run entire phase) does not account for AI layout generation failures. If the AI generator produces an invalid layout (broken HTML, overflow issues), the retry would re-run the entire build phase, not just the layout generation. | BAIXO | AI layout generation is inherently less deterministic than token-based generation. A retry of the entire build phase is expensive. Layout-specific retry (re-generate layout only, re-validate) would be more efficient. | Add layout-generation-specific retry logic when PDL is implemented: if layout QA fails (personality score <60%), retry only the layout generation step (not the entire build phase) up to 2 times before escalating to full phase retry. |
| BP-12 | **Maestro does not delegate to a layout-specific agent** -- The brand-orchestrator delegates to 6 squad leads (Maya, Stella, Atlas, Vincent, Claude/Reed, Vega+Ally). None of these are a layout architect. PDL requires a new agent (layout-architect) or extension of an existing agent for layout generation. | BAIXO | This is an agent delegation gap, not a pipeline structure gap. Maestro's delegation model is extensible (just add a new squad/agent to the delegation list). However, until the agent is created, Maestro cannot orchestrate the PDL sub-pipeline. | When the layout-architect agent is created (per the analyst's recommendation A1), add it to Maestro's delegation chain. Phase 2b (layout brief) delegates to layout-architect. Alternatively, extend the branding squad's brand-book-builder (Paige) per the epic's "Agent Impact" section. |

### Score de Saude para PDL: 38/100

**Scoring methodology:**
- Start at 100
- CRITICO gaps: -20 each (BP-1, BP-2 = -40)
- ALTO gaps: -10 each (BP-3, BP-4, BP-5, BP-6, BP-7 = -50)
- MEDIO gaps: -5 each (BP-8, BP-9, BP-10 = -15)
- BAIXO gaps: -2 each (BP-11, BP-12 = -4)
- Existing capability credit: +5 for well-structured 7-phase pipeline with state machine, parallel execution, and retry
- Bonus: +4 for pipeline-config.md already containing layout style/theme/nav mappings (documentation-ready for codification)
- Bonus: +3 for brand book structure engine (profile-driven) already defining page selection by archetype/industry

**Summary:** The brand-pipeline squad has a well-engineered meta-orchestrator (Maestro) with a robust state machine, parallel execution, and quality gates. However, the pipeline is entirely **pre-PDL** -- it has no phases, artifacts, gates, or agent delegations for layout generation. The critical finding is that the two new phases (visual reference research + layout brief generation) are completely absent, and without them the AI generation pipeline cannot function. The positive finding is that the existing pipeline ARCHITECTURE is well-suited for PDL extension: phases are composable, gates are configurable, parallel execution works, and the config documentation already contains archetype-to-layout mappings that need only be codified.

---

## Cross-Squad Analysis

### Dependency Chain for PDL Quality Assurance

```
brand-pipeline                          qa-accessibility
    |                                        |
    | (1) New phase: visual-ref-research     |
    | (2) New phase: layout-brief            |
    | (3) Existing: build (now + layout gen) |
    |                                        |
    +---- handoff: generated layouts --------+
                                             |
                                    (4) layout-personality-score [NEW]
                                    (5) layout-differentiation-check [NEW]
                                    (6) layout-brief-compliance [NEW]
                                    (7) responsive-test (375/768/1440) [MODIFY]
                                    (8) brand-compliance-check + layout tokens [MODIFY]
                                    (9) lighthouse-audit [EXISTING, works as-is]
                                    (10) wcag-test [EXISTING, works as-is]
```

### Inter-Squad Gap Summary

| Category | QA Gaps | Pipeline Gaps | Combined Impact |
|----------|---------|---------------|-----------------|
| Personality Validation | QA-1 (no personality scoring) | BP-9 (mapping disconnected) | Generated layouts cannot be validated against personality intent |
| Differentiation | QA-2 (no cross-brand check) | BP-1/BP-2 (no reference research) | Cannot verify that two brands look different |
| Layout Tokens | QA-4 (no token validation) | BP-3 (no artifact tracking) | Layout tokens could be missing or wrong, undetected |
| Brief Traceability | QA-5 (no brief comparison) | BP-2 (no brief generation) | The brief-to-output chain is entirely missing |
| Pipeline Integration | QA-10 (no QA pipeline phase) | BP-6/BP-7 (no gate/delivery items) | Layout validation falls outside the automated pipeline |

### Risk Matrix (Combined)

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|-----------|
| AI-generated layouts pass all QA gates but do not express the target personality | HIGH | HIGH | QA-1: layout-personality-score task |
| Two brands receive identical layouts | MEDIUM | HIGH | QA-2: layout-differentiation-check task |
| Layout tokens missing/incorrect, fallback to defaults silently | MEDIUM | HIGH | QA-4: layout token compliance phase; BP-3: artifact tracking |
| Pipeline cannot resume after layout generation failure | LOW | MEDIUM | BP-11: layout-specific retry logic |
| Express mode produces layouts without personality | HIGH | MEDIUM | BP-4: lightweight layout resolution in express mode |
| Refresh mode does not detect layout staleness | MEDIUM | MEDIUM | BP-5: layout change detection rules |

---

## Consolidated Recommendations (Priority Order)

### Tier 1: Must-Have Before PDL Stories Begin

| # | Action | Squad | Effort | Blocks |
|---|--------|-------|--------|--------|
| R1 | Create `layout-personality-score.md` task | qa-accessibility | 1 story (M) | PDL-5, PDL-6 (PoC validation) |
| R2 | Create `layout-differentiation-check.md` task | qa-accessibility | 1 story (S) | PDL-5, PDL-6 (PoC comparison) |
| R3 | Add visual-reference-research phase to `full-brand-pipeline.yaml` | brand-pipeline | 0.5 story (part of PDL-3) | PDL-1 |
| R4 | Add layout-brief phase to `full-brand-pipeline.yaml` | brand-pipeline | 0.5 story (part of PDL-3) | PDL-2 |

### Tier 2: Must-Have Before PDL QA Gate (PDL-9)

| # | Action | Squad | Effort |
|---|--------|-------|--------|
| R5 | Add layout token compliance to `brand-compliance-check.md` (Phase 7b) | qa-accessibility | 0.5 story |
| R6 | Create `layout-brief-compliance.md` task | qa-accessibility | 0.5 story |
| R7 | Update pipeline artifacts in all 3 workflow files | brand-pipeline | 0.5 story |
| R8 | Update pipeline-gate-checklist (item 9: layout tokens) | brand-pipeline | Included in R7 |
| R9 | Update delivery-checklist (items 11-13: layout deliverables) | brand-pipeline | Included in R7 |
| R10 | Add 375px to responsive-test.md Phase 1 sweep | qa-accessibility | Trivial (config change) |

### Tier 3: Should-Have Before PDL GA

| # | Action | Squad | Effort |
|---|--------|-------|--------|
| R11 | Add layout quality metrics to pipeline-report.md | brand-pipeline | 0.5 story |
| R12 | Add lightweight layout resolution to express-brand-pipeline.yaml | brand-pipeline | 0.5 story |
| R13 | Add layout change detection to refresh-brand-pipeline.yaml | brand-pipeline | 0.5 story |
| R14 | Add PDL sub-phase to qa-pipeline-flow.yaml | qa-accessibility | 0.5 story |
| R15 | Layout-family-aware baseline management in screenshot-compare.md | qa-accessibility | 0.5 story |

### Tier 4: Nice-to-Have

| # | Action | Squad | Effort |
|---|--------|-------|--------|
| R16 | Layout density context in lighthouse-audit.md | qa-accessibility | Trivial |
| R17 | CSS animation entrance validation | qa-accessibility | 0.5 story |
| R18 | Layout-family-aware page selection in pipeline-config.md | brand-pipeline | 0.5 story |
| R19 | Layout-specific retry logic | brand-pipeline | 0.5 story |

---

## Files Inspected

### QA Accessibility Squad (`squads/qa-accessibility/`)

**Config:**
- `config.yaml` (135 lines, 4 agents, 18 tasks, 3 workflows)
- `config/coding-standards.md`
- `config/tech-stack.md`
- `config/testing-standards.md` (158 lines, breakpoints, budgets, compliance levels)

**Agents (all 4):**
- `agents/visual-qa.md` (Vega, 148 lines)
- `agents/a11y-tester.md` (Ally, 156 lines)
- `agents/brand-compliance.md` (Barrett, 146 lines)
- `agents/performance-auditor.md` (Percy, 156 lines)

**Tasks (all 18):**
- `tasks/responsive-test.md` (129 lines) -- default breakpoints 320/768/1024/1440/1920
- `tasks/brand-compliance-check.md` (209 lines) -- 9 phases, token + animation compliance
- `tasks/visual-review.md` (127 lines) -- pixel-perfect comparison
- `tasks/lighthouse-audit.md` (148 lines) -- 4-category Lighthouse with budget
- `tasks/cross-browser-test.md`, `tasks/screenshot-compare.md`, `tasks/wcag-test.md`, `tasks/screen-reader-test.md`, `tasks/keyboard-nav-test.md`, `tasks/color-contrast-test.md`, `tasks/core-web-vitals.md`, `tasks/asset-size-audit.md`, `tasks/next-build-validate.md`, `tasks/static-export-validate.md`, `tasks/logo-usage-verify.md`, `tasks/palette-compliance.md`, `tasks/typography-compliance.md`, `tasks/manifest-validate.md`

**Workflows (all 3):**
- `workflows/qa-pipeline-flow.yaml` (185 lines) -- 8-phase end-to-end QA pipeline
- `workflows/a11y-certification-flow.yaml`
- `workflows/brand-compliance-flow.yaml`

**Checklists (all 4):**
- `checklists/visual-qa-checklist.md` (84 lines, 39 items)
- `checklists/a11y-wcag-checklist.md`
- `checklists/brand-compliance-checklist.md`
- `checklists/performance-checklist.md` (91 lines, 43 items)

### Brand Pipeline Squad (`squads/brand-pipeline/`)

**Config:**
- `config.yaml` (118 lines, 1 agent, 5 tasks, 3 workflows, 6 pipeline phases)
- `config/pipeline-config.md` (536 lines, tech stack, phases, scaffold, layout/theme/nav selection)
- `config/tech-stack.md`

**Agent:**
- `agents/brand-orchestrator.md` (Maestro, 196 lines)

**Tasks (all 5):**
- `tasks/run-pipeline.md` (33,600 bytes) -- full 7-phase execution
- `tasks/run-phase.md` -- single phase execution
- `tasks/pipeline-status.md` -- state inspection
- `tasks/resume-pipeline.md` -- checkpoint resume
- `tasks/pipeline-report.md` (177 lines) -- delivery report generation

**Workflows (all 3):**
- `workflows/full-brand-pipeline.yaml` (326 lines) -- 7 phases, 30+ steps
- `workflows/express-brand-pipeline.yaml` (155 lines) -- 5 phases, streamlined
- `workflows/refresh-brand-pipeline.yaml` (120 lines) -- incremental, file-timestamp detection

**Checklists (all 2):**
- `checklists/pipeline-gate-checklist.md` (56 lines, 8 items)
- `checklists/delivery-checklist.md` (59 lines, 10 items)

**Templates:**
- `templates/pipeline-state-template.yaml`
- `templates/nextjs-scaffold-template.md`

### Architecture Reference
- `docs/architecture/personality-driven-layouts.md` (1606 lines, 15 sections, 5 ADRs)
- `docs/epics-brand-system-service.md` (EPIC-BSS-D section, PDL-1 through PDL-11)
- `docs/reviews/pdl-squad-gap-analysis.md` (430 lines, Atlas analyst report)

---

## Audit Verdict

| Squad | Score | Verdict | Rationale |
|-------|-------|---------|-----------|
| QA Accessibility | 52/100 | **NEEDS_WORK** | Strong foundational infrastructure (18 tasks, comprehensive responsive/a11y/performance/compliance testing). Critical gap: no semantic layout validation (personality expression, cross-brand differentiation, layout token compliance, brief traceability). The squad can validate WHAT was built but cannot validate WHY it was built that way. |
| Brand Pipeline | 38/100 | **NEEDS_WORK** | Robust orchestration architecture (state machine, parallel execution, gates, 3 pipeline modes). Critical gap: two entire pipeline phases are missing (visual reference research, layout brief). No layout artifacts tracked, no layout gates, no layout deliverables verified. The pipeline can run the current brand creation workflow but has zero PDL awareness. |
| **Combined** | **45/100** | **NEEDS_WORK** | Both squads require structural extensions before PDL can be implemented with quality assurance. The good news: the existing architectures in both squads are well-designed and EXTENSIBLE. None of the gaps require rearchitecting -- they require adding new tasks, phases, and gate criteria to existing structures. Estimated effort to reach PDL-readiness: 6-8 additional stories (3-4 per squad). |

---

*Quinn, guardiao da qualidade*
