# Run Pipeline

Execute the full 7-phase brand pipeline for a client, producing a Next.js brand book application with static export.

## Metadata

| Field | Value |
|-------|-------|
| **Agent** | brand-orchestrator (Maestro) |
| **Squad** | brand-pipeline |
| **Elicit** | true |
| **Mode** | yolo / interactive |

## Inputs

| Input | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `client_name` | string | YES | - | Client or brand name (used for state file naming) |
| `mode` | enum | NO | full | Pipeline mode: `full`, `express`, `refresh` |
| `skip_phases` | array | NO | [] | Phases to skip (e.g., `[research]`) |
| `industry` | string | NO | - | Client industry for research phase |
| `competitor_urls` | array | NO | [] | Competitor URLs for competitive audit |
| `pkg_manager` | enum | NO | npm | Package manager: `npm` or `pnpm` |

## Outputs

| Output | Location | Description |
|--------|----------|-------------|
| `pipeline-state.yaml` | `.aiox/branding/{client}/pipeline-state.yaml` | Pipeline state machine |
| `delivery-report.md` | `.aiox/branding/{client}/delivery-report.md` | Final delivery report |
| `app/` | `.aiox/branding/{client}/app/` | Next.js brand book application |
| `app/out/` | `.aiox/branding/{client}/app/out/` | Static export (open `out/index.html` in browser) |

## Steps

### Step 0: Scaffold Next.js Project

**Skip condition:** mode=refresh AND `app/package.json` exists and is valid

1. Read scaffold template from `data/nextjs-scaffold-template.md`
2. Create the Next.js project directory: `.aiox/branding/{client}/app/`
3. Generate `package.json` from template with exact dependency versions:
   ```json
   {
     "name": "{client_name}-brandbook",
     "private": true,
     "scripts": {
       "dev": "next dev --turbopack",
       "build": "next build",
       "start": "next start",
       "lint": "next lint",
       "export": "next build"
     },
     "dependencies": {
       "next": "15.3.2",
       "react": "19.1.0",
       "react-dom": "19.1.0",
       "framer-motion": "11.18.2"
     },
     "devDependencies": {
       "@types/node": "22.15.17",
       "@types/react": "19.1.3",
       "@types/react-dom": "19.1.3",
       "typescript": "5.8.3",
       "tailwindcss": "4.1.6",
       "@tailwindcss/postcss": "4.1.6",
       "postcss": "8.5.3",
       "eslint": "9.27.0",
       "eslint-config-next": "15.3.2",
       "@eslint/eslintrc": "3.3.1"
     }
   }
   ```
4. Generate `next.config.js` with static export:
   ```js
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     output: 'export',
     images: {
       unoptimized: true,
     },
   }
   module.exports = nextConfig
   ```
5. Generate `tsconfig.json` with path aliases:
   ```json
   {
     "compilerOptions": {
       "target": "ES2017",
       "lib": ["dom", "dom.iterable", "esnext"],
       "allowJs": true,
       "skipLibCheck": true,
       "strict": true,
       "noEmit": true,
       "esModuleInterop": true,
       "module": "esnext",
       "moduleResolution": "bundler",
       "resolveJsonModule": true,
       "isolatedModules": true,
       "jsx": "preserve",
       "incremental": true,
       "plugins": [{ "name": "next" }],
       "paths": { "@/*": ["./*"] }
     },
     "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
     "exclude": ["node_modules"]
   }
   ```
6. Generate `postcss.config.mjs`:
   ```js
   const config = {
     plugins: {
       "@tailwindcss/postcss": {},
     },
   };
   export default config;
   ```
7. Generate `app/globals.css` with Tailwind v4 directives and CSS custom property stubs:
   ```css
   @import "tailwindcss";

   /* Brand tokens -- populated by Phase 3 (design-system) */
   :root {
     /* Colors */
     --color-primary: #000000;
     --color-secondary: #666666;
     --color-accent: #0066ff;
     --color-background: #ffffff;
     --color-surface: #f5f5f5;
     --color-text: #111111;
     --color-text-muted: #666666;

     /* Typography */
     --font-heading: system-ui, sans-serif;
     --font-body: system-ui, sans-serif;
     --font-mono: monospace;

     /* Spacing scale */
     --space-xs: 0.25rem;
     --space-sm: 0.5rem;
     --space-md: 1rem;
     --space-lg: 1.5rem;
     --space-xl: 2rem;
     --space-2xl: 3rem;
     --space-3xl: 4rem;

     /* Radii */
     --radius-sm: 0.25rem;
     --radius-md: 0.5rem;
     --radius-lg: 1rem;
     --radius-full: 9999px;
   }

   /* Dark mode tokens */
   .dark {
     --color-background: #0a0a0a;
     --color-surface: #1a1a1a;
     --color-text: #fafafa;
     --color-text-muted: #a0a0a0;
   }
   ```
8. Generate `app/layout.tsx` (root layout with metadata, font loading, global CSS)
9. Generate `app/page.tsx` (hero/landing page shell with brand name placeholder)
10. Generate `app/brandbook/layout.tsx` (sidebar navigation layout for brand book)
11. Generate placeholder `page.tsx` files for all 4 pillars:
    - `app/brandbook/guidelines/page.tsx`
    - `app/brandbook/foundations/page.tsx`
    - `app/brandbook/components/page.tsx`
    - `app/brandbook/patterns/page.tsx`
12. Generate sub-route placeholders:
    - `app/brandbook/guidelines/voice/page.tsx`
    - `app/brandbook/guidelines/manifesto/page.tsx`
    - `app/brandbook/guidelines/positioning/page.tsx`
    - `app/brandbook/foundations/colors/page.tsx`
    - `app/brandbook/foundations/typography/page.tsx`
    - `app/brandbook/foundations/spacing/page.tsx`
    - `app/brandbook/components/buttons/page.tsx`
    - `app/brandbook/components/cards/page.tsx`
    - `app/brandbook/components/forms/page.tsx`
    - `app/brandbook/components/feedback/page.tsx`
    - `app/brandbook/components/tables/page.tsx`
    - `app/brandbook/patterns/motion/page.tsx`
    - `app/brandbook/patterns/grids/page.tsx`
    - `app/brandbook/patterns/templates/page.tsx`
    - `app/brandbook/showcase/page.tsx`
13. Create empty directory stubs:
    - `app/components/ui/`
    - `app/components/motion/`
    - `app/components/layout/`
    - `app/components/showcase/`
    - `app/lib/`
    - `app/styles/`
    - `public/images/`
    - `public/assets/`
14. Generate `app/lib/tokens.ts` (empty token constants, populated in Phase 3):
    ```typescript
    // Design tokens -- auto-generated by Phase 3 (design-system)
    // Do not edit manually. Source: discovery/tokens.json

    export const colors = {} as const
    export const typography = {} as const
    export const spacing = {} as const
    export const radii = {} as const
    ```
15. Generate `app/lib/animations.ts` (Framer Motion presets, populated in Phase 4):
    ```typescript
    // Animation presets -- auto-generated by Phase 4 (visual)
    // Do not edit manually.

    import type { Variants } from 'framer-motion'

    export const fadeInUp: Variants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    }

    export const staggerContainer: Variants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
      },
    }

    export const scaleOnHover: Variants = {
      rest: { scale: 1 },
      hover: { scale: 1.05, transition: { duration: 0.2 } },
    }

    export const pageTransition: Variants = {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
      exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
    }
    ```
16. Generate `app/styles/tokens.css` (stub, populated in Phase 3)
17. Generate `tailwind.config.ts` (brand-aware Tailwind config stub):
    ```typescript
    import type { Config } from 'tailwindcss'

    const config: Config = {
      content: [
        './app/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
      ],
      theme: {
        extend: {
          colors: {
            primary: 'var(--color-primary)',
            secondary: 'var(--color-secondary)',
            accent: 'var(--color-accent)',
            background: 'var(--color-background)',
            surface: 'var(--color-surface)',
          },
          fontFamily: {
            heading: 'var(--font-heading)',
            body: 'var(--font-body)',
            mono: 'var(--font-mono)',
          },
          borderRadius: {
            sm: 'var(--radius-sm)',
            md: 'var(--radius-md)',
            lg: 'var(--radius-lg)',
            full: 'var(--radius-full)',
          },
        },
      },
      plugins: [],
    }

    export default config
    ```
18. Run `{pkg_manager} install` in the app directory
19. Validate scaffold:
    - Check `package.json` exists and is valid JSON
    - Check `next.config.js` contains `output: 'export'`
    - Check `tsconfig.json` has `@/*` path alias
    - Check all 4 pillar directories exist under `app/brandbook/`
    - Check `npm install` exit code was 0
20. Update pipeline state: `phases.scaffold.status = "passed"`
21. Log: "Next.js scaffold created at .aiox/branding/{client}/app/"

### Step 0b: Profile-Driven Configuration (Manifest Generation)

**Prerequisite:** Scaffold complete (Step 0 passed) AND Discovery data available
**CRITICAL:** This step runs AFTER scaffold but BEFORE any generation phase (Phases 3, 4, 5).
It ensures every subsequent phase knows EXACTLY what to generate for THIS specific client.
Nothing is copied from a reference template. Every decision is driven by the client's profile.

#### 0b.1: Read Brand Profile

1. Read `discovery/brand_profile.json` from `.aiox/branding/{client}/discovery/`
2. Extract key profile dimensions:
   - `archetype` -- primary brand archetype (Ruler, Creator, Caregiver, etc.)
   - `personality_traits` -- list of personality adjectives
   - `industry` -- client industry classification
   - `target_audience` -- who the brand serves
3. Read `pipeline-state.yaml` to determine `scope` (portfolio | small | medium | large | enterprise)
4. If brand profile is not yet available (pipeline hasn't run Discovery):
   - Queue this step to execute AFTER Phase 2 (Discovery) completes
   - Log: "Profile-driven configuration deferred until Discovery completes"

#### 0b.2: Run Component Selection Engine

1. Invoke the Component Selection Engine (defined in `design-system/tasks/component-build.md`, Phase 0)
2. Inputs: `brand_profile.json`, `tokens.json`, `scope`
3. Output: `component-manifest.md` at `.aiox/branding/{client}/component-manifest.md`
4. The manifest determines:
   - Which universal components to generate (8-10, styled per archetype)
   - Which industry-specific components to generate (varies by industry)
   - Which optional/advanced components to include (varies by scope)
   - Archetype-driven styling presets for ALL components
5. Validate: manifest component count falls within scope range
6. Log: "Component manifest generated: {count} components for {industry}/{archetype}/{scope}"

#### 0b.3: Run Animation Selection Engine

1. Read brand profile `archetype` and `personality_traits`
2. Select animation presets based on archetype personality:

| Archetype | Motion Character | Default Easing | Duration Scale | Entrance Style |
|-----------|-----------------|----------------|----------------|----------------|
| Ruler | Deliberate, precise | ease-in-out | 1.0x (standard) | Fade + slide down |
| Creator | Bouncy, playful | spring (stiff: 300, damp: 15) | 0.8x (fast) | Scale + rotate |
| Caregiver | Gentle, soothing | ease-out | 1.2x (slow) | Soft fade |
| Explorer | Energetic, dynamic | spring (stiff: 400, damp: 20) | 0.7x (fast) | Slide from edges |
| Hero | Powerful, impactful | ease-in | 0.9x | Scale up with impact |
| Sage | Smooth, informative | ease-in-out | 1.1x | Sequential reveal |
| Magician | Ethereal, surprising | spring (stiff: 200, damp: 10) | 1.0x | Stagger + blur |
| Outlaw | Abrupt, aggressive | linear | 0.5x (very fast) | Hard cut / glitch |
| Jester | Bouncy, exaggerated | spring (stiff: 500, damp: 12) | 0.8x | Bounce + overshoot |
| Lover | Slow, sensual | ease-out | 1.3x (slow) | Gentle scale + fade |
| Everyman | Natural, unobtrusive | ease-in-out | 1.0x | Simple fade |
| Innocent | Light, optimistic | ease-out | 1.0x | Float up + fade |

3. Select which motion components to generate based on industry and scope:

| Motion Component | When to Include |
|-----------------|-----------------|
| `fade-in` | Always (universal) |
| `slide-up` | Always (universal) |
| `stagger-children` | Scope >= small (for lists/grids) |
| `page-transition` | Scope >= medium (multi-page brand books) |
| `hover-scale` | Interactive components present |
| `reveal-section` | Scope >= small (scroll-based reveals) |
| `parallax-layer` | Archetype is Explorer, Magician, or Creator AND scope >= medium |
| `count-up` | Industry has metrics to display (SaaS, Finance, Education) |

4. Generate `motion-manifest.md` at `.aiox/branding/{client}/motion-manifest.md`:

```markdown
# Motion Manifest -- {client_name}

## Profile Inputs
- **Archetype:** {archetype}
- **Personality:** {personality_traits}
- **Industry:** {industry}
- **Scope:** {scope}

## Animation Character
- **Motion personality:** {e.g., "Bouncy, playful"}
- **Default easing:** {value}
- **Duration scale:** {value}
- **Entrance style:** {value}

## Selected Motion Components ({count})
| Component | Selection Reason |
|-----------|-----------------|
| fade-in | Universal -- all brand books need basic entrance |
| ... | {why} |

## Motion Components NOT Included
| Component | Reason |
|-----------|--------|
| parallax-layer | Scope too small for parallax effects |
| ... | {why} |

## Framer Motion Preset Overrides
- `fadeInUp.transition.duration`: {calculated from duration scale}
- `staggerContainer.transition.staggerChildren`: {calculated from archetype}
- `scaleOnHover.hover.scale`: {calculated from archetype, e.g., Jester=1.08, Ruler=1.02}
- `spring.stiffness`: {from archetype table}
- `spring.damping`: {from archetype table}
```

5. Log: "Motion manifest generated: {count} motion components, {archetype} animation character"

#### 0b.4: Run Brand Book Structure Engine

1. Invoke the Brand Book Structure Engine (defined in `pipeline-config.md`)
2. Inputs: `brand_profile.json`, `scope`
3. Output: `brandbook-manifest.md` at `.aiox/branding/{client}/brandbook-manifest.md`
4. The manifest determines:
   - Which pages to generate (core + industry + optional)
   - Theme mode (dark-first / light-first / neutral)
   - Layout style (structured grid / organic flow / bold / minimal / asymmetric / card-based)
   - Navigation style (sidebar persistent / top nav / sidebar collapsible / tab-based)
   - Total page count (determined by scope, NOT fixed)
5. Update scaffold if needed:
   - Add/remove `app/brandbook/` route directories to match manifest pages
   - Update sidebar navigation in `app/brandbook/layout.tsx` to reflect actual pages
6. Log: "Brand book manifest generated: {count} pages, {theme_mode} theme, {layout_style} layout"

#### 0b.5: Run Content Selection Engine

1. Invoke the Content Selection Engine (defined in `copy/config/content-selection-engine.md`)
2. Inputs: `brand_profile.yaml` (or `.json`), `scope`, `voice_guide.md`, `deliverables`
3. Output: `content-manifest.md` at `.aiox/branding/{client}/content-manifest.md`
4. The manifest determines:
   - Which content types to produce (blog, social, email, landing, ads, SEO) based on industry
   - Which channels to target based on archetype (primary, secondary, avoid)
   - Quantity per content type based on scope (portfolio to enterprise)
   - Tone & voice profile based on archetype (formality, energy, confidence, warmth, directness)
   - Content pillars based on industry (with percentage weights)
   - SEO keyword clusters based on industry
   - Email sequence types based on business model (derived from industry)
   - Ad channel selection based on industry + archetype
   - Framework assignments per content type (with archetype overrides)
5. Template: `copy/data/content-manifest-template.md`
6. Validate: manifest content types map to paid deliverables
7. Log: "Content manifest generated: {content_type_count} content types, {channel_count} channels, {post_count} social posts for {industry}/{archetype}/{scope}"

#### 0b.6: Manifest Validation Gate

Before proceeding to Phases 3-4-5, validate all four manifests:

- [ ] `component-manifest.md` exists and has justified selections
- [ ] `motion-manifest.md` exists and archetype animation character is defined
- [ ] `brandbook-manifest.md` exists and page structure is defined
- [ ] `content-manifest.md` exists and content types are justified
- [ ] Component count is within scope range
- [ ] Page count is within scope range
- [ ] Content type count maps to paid deliverables
- [ ] Theme mode and layout style are explicitly chosen (not defaulted without reason)
- [ ] No component, page, animation, or content type is included "because the reference had it"
- [ ] Every inclusion has a documented reason tied to the brand profile

If validation fails, halt and fix manifests before proceeding.

#### 0b.7: Pass Manifests as Inputs to Build Phases

The four manifests are the PRIMARY input for Phases 3, 4, 5, and 6:

| Phase | Manifest Input | What It Controls |
|-------|---------------|------------------|
| Phase 3 (Design System) | `component-manifest.md` | WHICH components to build, HOW to style them (archetype presets) |
| Phase 4 (Visual) | `motion-manifest.md` | WHICH motion components to build, animation timing/easing/character |
| Phase 5 (Content) | `content-manifest.md` + `brandbook-manifest.md` | WHICH content to produce, for WHICH channels, in WHAT tone, for WHICH pages |
| Phase 6 (QA) | All four manifests | Validate deliverables match manifests (no missing, no extras) |

Update pipeline state: `phases.profile_config.status = "passed"`

---

### Step 1: Initialize Pipeline

1. Validate `client_name` is provided (elicit if missing)
2. Determine `mode` (default: full)
3. Create client directory: `.aiox/branding/{client}/`
4. Copy pipeline state template from `data/pipeline-state-template.yaml`
5. Set `pipeline.client` and `pipeline.mode` in state
6. Set `pipeline.status` to `in_progress`
7. Set `pipeline.started_at` to current ISO timestamp
8. Log: "Pipeline initialized for {client_name} in {mode} mode"

### Step 2: Load Pipeline Configuration

1. Read `config/pipeline-config.md` for phase config
2. Determine which phases to run based on `mode`:
   - **full**: All 7 phases (scaffold -> research -> discovery -> design-system + visual + content -> qa)
   - **express**: Skip research, run scaffold -> discovery -> design-system + visual + content -> basic QA
   - **refresh**: Check file timestamps, only re-run phases with changed inputs; skip scaffold if `app/` exists
3. Apply `skip_phases` overrides if provided
4. Log phase execution plan

### Step 3: Execute Phase 1 -- RESEARCH

**Skip condition:** mode=express OR "research" in skip_phases

1. Update state: `phases.research.status = "running"`, `phases.research.started_at = now()`
2. Delegate to `research-intelligence` squad:
   - Run `market-research.md` with `client_name`, `industry`
   - Run `competitive-audit.md` with `competitor_urls`, `industry` (depends on market-research)
   - Run `trend-report.md` with `industry`
   - Run `audience-analysis.md` with market_report (depends on market-research)
3. Collect outputs: `market_report`, `competitive_report`, `trend_data`, `audience_personas`
4. Run pipeline gate checklist (`checklists/pipeline-gate-checklist.md`)
5. If gate PASSES (>=7/8):
   - Update state: `phases.research.status = "passed"`, `phases.research.gate_score = {score}`
   - Record outputs in `phases.research.outputs`
6. If gate FAILS:
   - Retry once (update `retry_log`)
   - If retry fails: `phases.research.status = "failed"`, `pipeline.status = "failed"`
   - HALT and report failure

### Step 4: Execute Phase 2 -- DISCOVERY

**Prerequisite:** Phase 1 passed OR skipped

1. Update state: `phases.discovery.status = "running"`, `phases.discovery.started_at = now()`
2. Delegate to `branding` squad:
   - Run `brand-discovery.md` with `client_name`, `market_report`, `audience_personas`
   - Run `voice-guide-generator.md` (depends on brand-discovery)
   - Run `manifesto-generator.md` (depends on brand-discovery)
   - Run `moodboard-generate.md` (depends on brand-discovery)
   - Run `color-palette-generate.md` (depends on brand-discovery)
   - Run `typography-pairing.md` (depends on brand-discovery)
   - Run `token-schema-create.md` (depends on palette + typography)
3. Collect outputs: `brand_profile`, `voice_guide`, `manifesto`, `moodboard_urls`, `palette`, `typography`, `tokens`
4. Run pipeline gate checklist (minimum score: 8 for discovery)
5. If gate PASSES:
   - Update state: `phases.discovery.status = "passed"`
   - Record outputs
6. If gate FAILS:
   - Retry once -> if retry fails: HALT

### Step 5: Execute Phases 3-4-5 -- PARALLEL BUILD

**Prerequisite:** Phase 2 passed AND Step 0b manifests generated

Execute design-system, visual, and content phases IN PARALLEL.
**CRITICAL:** All three phases use the manifests from Step 0b as their primary input.
Components, pages, and animations are determined by the manifests, NOT by a fixed list.

#### Phase 3: DESIGN SYSTEM (React Components + Tailwind)

1. Update state: `phases.design-system.status = "running"`
2. Set `app_path` = `.aiox/branding/{client}/app/`
3. **Read `component-manifest.md`** -- this is the source of truth for which components to build
4. Delegate to `design-system` squad:
   - Run `token-transform.md` with `tokens`, `app_path`
     - Read `discovery/tokens.json`
     - Generate `{app_path}/styles/tokens.css` (CSS custom properties with brand values)
     - Generate `{app_path}/lib/tokens.ts` (TypeScript constants with brand values)
     - Update `{app_path}/tailwind.config.ts` (extend theme with actual brand tokens)
     - Update `{app_path}/app/globals.css` (replace stub values with brand tokens)
   - Run `component-build.md` (depends on token-transform)
     - **Read `component-manifest.md` to determine which components to generate**
     - Generate ONLY the components listed in the manifest (universal + industry-specific + optional)
     - Apply archetype styling presets from the manifest to every component
     - Do NOT generate a fixed list -- the manifest drives the component set
     - Each component uses Tailwind utility classes referencing brand tokens
     - Each component is typed with explicit props interface
     - Each component uses `forwardRef` for DOM access
     - Generate `index.ts` barrel export for selected components only
   - Run `component-variants.md` (depends on component-build)
     - Add size variants (sm, md, lg) and color variants to each component
     - Generate variant type unions from token values
   - Run `a11y-audit.md` (depends on component-build)
     - Verify ARIA attributes on all interactive components
     - Verify keyboard navigation (Tab, Enter, Escape)
     - Verify focus management and visible focus indicators
   - Run `ds-document.md` (depends on component-build + a11y-audit)
     - Generate brandbook documentation pages:
       - `{app_path}/brandbook/components/buttons/page.tsx` (live Button demo)
       - `{app_path}/brandbook/components/cards/page.tsx` (live Card demo)
       - `{app_path}/brandbook/components/forms/page.tsx` (live Form demo)
       - `{app_path}/brandbook/components/feedback/page.tsx` (live Alert/Toast demo)
       - `{app_path}/brandbook/components/tables/page.tsx` (live Table demo)
     - Each page imports actual components and renders interactive demos
     - Each page includes props documentation table and code snippets
4. Collect outputs: `tokens_css`, `tokens_ts`, `tailwind_config`, `component_library`, `variant_library`, `component_docs`

#### Phase 4: VISUAL PRODUCTION (Framer Motion + Assets)

1. Update state: `phases.visual.status = "running"`
2. **Read `motion-manifest.md`** -- this is the source of truth for animation character and motion components
3. Delegate to `visual-production` squad:
   - Run `visual-direction.md` with `brand_profile`, `moodboard_urls`, `palette`
   - Run `ai-image-generate.md` (depends on visual-direction)
     - Save generated images to `{app_path}/public/images/`
   - Run `photo-retouch.md` (depends on ai-image-generate)
     - Save retouched images to `{app_path}/public/images/`
   - Run `motion-create.md` (depends on visual-direction)
     - **Read `motion-manifest.md` to determine which motion components to generate**
     - Generate ONLY the motion components listed in the manifest
     - Apply archetype animation character (easing, duration scale, entrance style) from manifest
     - Do NOT generate all 8 motion components by default -- the manifest selects them
     - Generate `index.ts` barrel export for selected motion components only
     - Update `{app_path}/lib/animations.ts` with brand-specific presets:
       - Timing curves derived from archetype (motion-manifest.md Framer Motion Preset Overrides)
       - Duration scale, spring stiffness, damping from archetype table
       - Stagger timing from archetype personality
     - Generate showcase components in `{app_path}/components/showcase/`:
       - `hero-demo.tsx` -- hero section with brand imagery + motion
       - `card-gallery.tsx` -- animated card grid with stagger
       - `color-swatch.tsx` -- interactive color palette display
       - `typography-sample.tsx` -- font specimen with animations
       - `component-preview.tsx` -- generic component preview wrapper
       - `index.ts` (barrel export)
     - Generate brandbook motion documentation page:
       - `{app_path}/brandbook/patterns/motion/page.tsx` (live animation demos)
   - Run `asset-organize.md` (depends on photo-retouch + motion-create)
     - Organize all assets into `{app_path}/public/assets/`
     - Generate asset manifest (`{app_path}/public/assets/manifest.json`)
3. Collect outputs: `visual_direction_doc`, `generated_images`, `retouched_images`, `motion_components`, `showcase_components`, `organized_assets`

#### Phase 5: CONTENT

1. Update state: `phases.content.status = "running"`
2. **Read `brandbook-manifest.md`** -- this is the source of truth for which pages need content
3. Delegate to `copy` squad:
   - Run `copy-strategy-create.md` with `brand_profile`, `voice_guide`, `audience_personas`
   - Run `landing-page-copy.md` (depends on copy-strategy)
   - Run `social-post-create.md` (depends on copy-strategy)
   - Run `seo-meta-write.md` (depends on copy-strategy)
   - Run `email-sequence-create.md` (depends on copy-strategy)
3. Collect outputs: `copy_strategy`, `landing_copy`, `social_posts`, `seo_meta`, `email_sequences`
4. Inject content into Next.js pages **per the brandbook manifest**:
   - Read `brandbook-manifest.md` to get the list of pages that exist for this client
   - Update ONLY the pages listed in the manifest (do NOT inject into pages that were excluded)
   - For each core page in the manifest: inject relevant content (brand identity, voice, colors, etc.)
   - For each industry page in the manifest: generate and inject industry-specific content
   - For each optional page in the manifest: generate and inject scope-appropriate content
   - Inject SEO metadata from `seo_meta` into `{app_path}/layout.tsx`
   - **Do NOT assume a fixed page structure** -- the manifest determines what pages exist

**After ALL THREE phases complete:**

5. Run pipeline gate checklist for each phase (minimum score: 7)
6. Update state for each phase accordingly
7. If ANY phase fails gate:
   - Retry the failed phase once
   - If retry fails: mark failed, continue with remaining phases
   - If ALL three fail: `pipeline.status = "failed"`, HALT

### Step 6: Execute Phase 6 -- QA (Build + Static Export + Validation)

**Prerequisite:** ALL of phases 3, 4, 5 passed

1. Update state: `phases.qa.status = "running"`, `phases.qa.started_at = now()`
2. Set `app_path` = `.aiox/branding/{client}/app/`
3. **Read all three manifests** (`component-manifest.md`, `motion-manifest.md`, `brandbook-manifest.md`)
   to validate deliverables match profile-driven selections:
   - Every component in the component manifest must have a corresponding `.tsx` file
   - Every motion component in the motion manifest must have a corresponding `.tsx` file
   - Every page in the brandbook manifest must have a corresponding `page.tsx` route
   - No extra components/pages should exist that are NOT in the manifests
4. Run build validation sequence:
   a. **TypeScript check:** `cd {app_path} && npx tsc --noEmit`
      - Must exit with code 0 (zero type errors)
      - If fails: log errors, attempt auto-fix of common issues, retry once
   b. **Lint check:** `cd {app_path} && npx next lint`
      - Must exit with zero errors (warnings are acceptable)
   c. **Build + Static Export:** `cd {app_path} && npx next build`
      - Must exit with code 0
      - `next.config.js` has `output: 'export'`, so `next build` produces `out/`
   d. **Static export validation:**
      - Verify `{app_path}/out/index.html` exists
      - Verify `{app_path}/out/brandbook/index.html` exists
      - Verify all 4 pillar routes have `index.html`:
        - `out/brandbook/guidelines/index.html`
        - `out/brandbook/foundations/index.html`
        - `out/brandbook/components/index.html`
        - `out/brandbook/patterns/index.html`
      - Verify `out/_next/` directory contains JS/CSS bundles
      - Verify all images from `public/` are present in `out/`
   e. **Link validation:**
      - Parse all `<a href="...">` in `out/**/*.html`
      - Verify all internal links resolve to existing `.html` files
      - Log any broken links as errors
4. Delegate to `qa-accessibility` squad:
   - Run `visual-review.md` with `component_library`, `organized_assets`
   - Run `wcag-test.md` (depends on visual-review)
     - Test against `out/` static files
     - Minimum: WCAG 2.1 AA compliance
   - Run `brand-compliance-check.md` with `brand_profile`, all deliverables
     - Verify tokens in CSS match `discovery/tokens.json`
     - Verify voice/tone in content pages matches `voice_guide`
   - Run `lighthouse-audit.md`
     - Run Lighthouse CI against `out/index.html` (start local server or use file:// protocol)
     - Thresholds: Performance >= 90, Accessibility >= 90, SEO >= 90, Best Practices >= 90
     - Save report to `qa/lighthouse_report.json`
   - Run `pipeline-report.md` (depends on all QA tasks)
5. Collect outputs: `visual_qa_report`, `wcag_report`, `compliance_report`, `lighthouse_report`, `build_report`, `delivery_report`
6. Run delivery checklist (`checklists/delivery-checklist.md`, minimum score: 8)
7. If gate PASSES:
   - Update state: `phases.qa.status = "passed"`
   - `pipeline.status = "completed"`, `pipeline.completed_at = now()`
8. If gate FAILS:
   - Retry once -> if retry fails: `pipeline.status = "failed"`, HALT

### Step 7: Finalize

1. Save final pipeline state
2. Generate delivery report (invoke `pipeline-report.md`)
3. Log completion summary:
   - Total duration
   - Phases passed/failed/skipped
   - Deliverables count
   - Gate scores per phase
   - Build output size (total `out/` directory size)
   - Lighthouse scores
4. Copy `out/` to a clean delivery directory: `.aiox/branding/{client}/delivery/`
5. Display:
   ```
   Pipeline completed for {client_name}.
   Brand book app: .aiox/branding/{client}/app/
   Static export:  .aiox/branding/{client}/app/out/index.html
   Delivery report: .aiox/branding/{client}/delivery-report.md

   To preview locally:
     cd .aiox/branding/{client}/app && npx serve out

   To open directly:
     open .aiox/branding/{client}/app/out/index.html
   ```

## Error Handling

| Error | Action |
|-------|--------|
| Scaffold `npm install` fails | Check Node.js version (>=20), retry with `--legacy-peer-deps`, then escalate |
| `next build` fails | Parse error output, attempt auto-fix (missing imports, type errors), retry once |
| Static export missing routes | Check for `useSearchParams` or other client-only APIs in pages (not compatible with static export) |
| Phase fails gate | Retry once, then escalate |
| Phase timeout | Mark failed, save state, HALT |
| Missing prerequisite outputs | HALT, list missing outputs |
| State file corruption | Re-initialize from last known good state |

## Common Static Export Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| Route missing from `out/` | Dynamic route without `generateStaticParams` | Add `generateStaticParams` to dynamic `[slug]/page.tsx` |
| Build error: `useSearchParams` | Client-only hook in Server Component | Wrap in Suspense boundary or move to Client Component |
| Images not in `out/` | Using `next/image` without `unoptimized: true` | Ensure `next.config.js` has `images: { unoptimized: true }` |
| CSS not loading in `out/` | Incorrect asset prefix | Keep default asset prefix (no custom `basePath` needed for file:// access) |

## State File

Pipeline state persisted at `.aiox/branding/{client}/pipeline-state.yaml` after every step.
See `data/pipeline-state-template.yaml` for schema.

## Quality Gate

- Threshold: >70%
- All 7 phases complete with status "passed" (no phase left in "pending" or "running")
- No phase was skipped without explicit justification in pipeline state
- Final delivery report generated with all quality scores above minimum thresholds
- Static export builds successfully and `out/index.html` is accessible
- Pipeline state file is consistent (no corrupted or missing timestamps)

---
*Brand Pipeline Task v2.0 -- Next.js Architecture*
