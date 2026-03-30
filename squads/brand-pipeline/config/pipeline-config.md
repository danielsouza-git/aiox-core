# Pipeline Configuration

Configuration for the Brand Pipeline orchestrator.

## Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Framework | Next.js | 15 | App Router, static export (`output: 'export'`) |
| UI Library | React | 19 | Component rendering |
| Styling | Tailwind CSS | 4 | Utility-first CSS, brand token integration |
| Animation | Framer Motion | 11 | Page transitions, micro-interactions, scroll reveals |
| Language | TypeScript | 5.7+ | Type safety across all components |
| Build | Turbopack (via Next.js) | - | Fast dev builds |
| Quality | Lighthouse CI | latest | Performance, a11y, SEO audits on static export |

## Phase Order & Dependencies

```
Phase 0: SCAFFOLD            (sequential)
Phase 1: RESEARCH            (sequential, depends on Phase 0)
Phase 2: DISCOVERY            (sequential, depends on Phase 1)
Phase 3: DESIGN-SYSTEM        (parallel group "build", depends on Phase 2)
Phase 4: VISUAL               (parallel group "build", depends on Phase 2)
Phase 5: CONTENT              (parallel group "build", depends on Phase 2)
Phase 6: QA                   (sequential, depends on Phases 3+4+5)
```

## Dependency Matrix

| Phase | Depends On | Required Inputs |
|-------|-----------|-----------------|
| scaffold | (none) | client_name |
| research | scaffold | client_name, industry, competitor_urls |
| discovery | research | market_report, audience_personas |
| design-system | discovery | tokens, app_path (Next.js project) |
| visual | discovery | brand_profile, moodboard_urls, palette, app_path |
| content | discovery | brand_profile, voice_guide, audience_personas |
| qa | design-system, visual, content | app_path, all deliverables |

## Phase 0: Scaffold -- Next.js Project Creation

Phase 0 creates the Next.js application skeleton before any brand work begins.

### What Scaffold Produces

| Artifact | Description |
|----------|-------------|
| `app/layout.tsx` | Root layout with fonts, metadata, global providers |
| `app/page.tsx` | Hero/landing page shell |
| `app/globals.css` | Tailwind directives + CSS custom property stubs |
| `app/brandbook/layout.tsx` | Brandbook sidebar navigation layout |
| `app/brandbook/*/page.tsx` | Placeholder pages for all 4 pillars |
| `app/components/` | Empty component directories (ui, motion, layout, showcase) |
| `app/lib/tokens.ts` | Design token constants (populated in Phase 3) |
| `app/lib/animations.ts` | Framer Motion variant presets |
| `app/styles/tokens.css` | CSS custom properties (populated in Phase 3) |
| `next.config.js` | Static export config (`output: 'export'`) |
| `tailwind.config.ts` | Brand-specific Tailwind config (populated in Phase 3) |
| `package.json` | Dependencies and scripts |
| `tsconfig.json` | TypeScript config with path aliases |

### Scaffold Configuration

| Setting | Value |
|---------|-------|
| Template source | `data/nextjs-scaffold-template.md` |
| Output directory | `.aiox/branding/{client}/app/` |
| Node.js minimum | 20 LTS |
| Package manager | npm (default) or pnpm |
| Static export target | `out/` folder |

### Scaffold Validation Checks

1. `package.json` exists and is valid JSON
2. `next.config.js` contains `output: 'export'`
3. `tsconfig.json` has `@/*` path alias
4. `tailwind.config.ts` imports token file
5. Directory structure matches template (all 4 pillar directories exist)
6. `npm install` succeeds without errors

## Phase 3: Design System -- React Components + Tailwind

Phase 3 now generates React components instead of static CSS/HTML files.

### Updated Outputs

| Old Output | New Output | Location |
|------------|------------|----------|
| `css-vars.css` | `styles/tokens.css` (CSS custom properties) | `app/styles/` |
| `tailwind.config.js` | `tailwind.config.ts` (typed, brand-aware) | project root |
| `_variables.scss` | REMOVED (Tailwind replaces SCSS) | - |
| `components/` (HTML) | `app/components/ui/` (React TSX) | `app/components/ui/` |
| `docs/` (markdown) | `app/brandbook/components/*/page.tsx` (live docs) | `app/brandbook/` |

### Component Generation Strategy

1. **Token Transform**: `tokens.json` -> `tokens.css` (CSS custom properties) + `tokens.ts` (TS constants) + `tailwind.config.ts` (extends theme)
2. **Base Components**: Button, Card, Badge, Input, Select, Textarea, Toggle, Avatar, Tooltip, Alert, Table, Tabs
3. **Component Variants**: Each component gets variant props (size, color, style) driven by brand tokens
4. **Accessibility**: All components include ARIA attributes, keyboard navigation, focus management
5. **Documentation Pages**: Each `app/brandbook/components/{category}/page.tsx` imports and renders live component demos

### Component File Convention

```
app/components/ui/
  button.tsx          # export function Button(props: ButtonProps)
  card.tsx            # export function Card(props: CardProps)
  badge.tsx           # ...
  input.tsx
  select.tsx
  textarea.tsx
  toggle.tsx
  avatar.tsx
  tooltip.tsx
  alert.tsx
  table.tsx
  tabs.tsx
  index.ts            # barrel export
```

Each component:
- Is a named export (no default exports)
- Accepts typed props interface (e.g., `ButtonProps`)
- Uses `tailwind.config.ts` brand tokens via utility classes
- Supports `className` prop for composition
- Uses `forwardRef` for DOM access

## Phase 4: Visual Production -- Framer Motion Animations

Phase 4 now generates Framer Motion animation components alongside visual assets.

### Updated Outputs

| Old Output | New Output | Location |
|------------|------------|----------|
| `motion/` (CSS/Lottie) | `app/components/motion/` (Framer Motion TSX) | `app/components/motion/` |
| `direction/` | `app/components/showcase/` (React showcase components) | `app/components/showcase/` |
| Static assets | `public/images/` + `public/assets/` | `public/` |

### Motion Component Generation

```
app/components/motion/
  fade-in.tsx           # Scroll-triggered fade in
  slide-up.tsx          # Slide up on enter
  stagger-children.tsx  # Staggered list animation
  page-transition.tsx   # Route transition wrapper
  hover-scale.tsx       # Interactive hover effect
  reveal-section.tsx    # Section reveal on scroll
  parallax-layer.tsx    # Parallax scroll effect
  count-up.tsx          # Animated number counter
  index.ts              # barrel export
```

### Animation Presets

All animation presets are centralized in `app/lib/animations.ts`:

```typescript
// Framer Motion variant definitions
export const fadeInUp = { ... }
export const staggerContainer = { ... }
export const scaleOnHover = { ... }
export const pageTransition = { ... }
export const slideInFromLeft = { ... }
export const revealOnScroll = { ... }
```

Motion components consume these presets, ensuring brand-consistent animation across all pages.

### Showcase Components

Visual showcase components combine motion + UI components for brandbook demo pages:

```
app/components/showcase/
  hero-demo.tsx         # Hero section with brand imagery + motion
  card-gallery.tsx      # Animated card grid
  color-swatch.tsx      # Interactive color palette display
  typography-sample.tsx # Font specimen with animations
  component-preview.tsx # Generic component preview wrapper
  index.ts
```

## Phase 6: QA -- Build Validation + Static Export

Phase 6 now includes Next.js build validation and static export verification.

### Updated QA Steps

| Step | Tool | Pass Criteria |
|------|------|---------------|
| 1. TypeScript check | `npx tsc --noEmit` | Zero errors |
| 2. Lint | `npx next lint` | Zero errors (warnings allowed) |
| 3. Build | `npx next build` | Exit code 0 |
| 4. Static export validation | Check `out/` directory | `out/index.html` exists, all routes have `.html` files |
| 5. Visual QA | `visual-review.md` | Component library + assets reviewed |
| 6. WCAG test | `wcag-test.md` | AA compliance minimum |
| 7. Brand compliance | `brand-compliance-check.md` | Tokens match, voice consistent |
| 8. Lighthouse audit | Lighthouse CI on `out/index.html` | Performance >= 90, Accessibility >= 90, SEO >= 90 |
| 9. Link validation | Check all internal `<a href>` in `out/` | Zero broken links |
| 10. Final report | `pipeline-report.md` | Delivery report generated |

### Static Export Validation

The static export (`out/`) must satisfy:

1. `out/index.html` exists and loads without JS errors
2. All brandbook routes produce `.html` files:
   - `out/brandbook/index.html`
   - `out/brandbook/guidelines/index.html`
   - `out/brandbook/foundations/index.html`
   - `out/brandbook/components/index.html`
   - `out/brandbook/patterns/index.html`
3. All CSS/JS assets are present in `out/_next/`
4. All images from `public/` are copied to `out/`
5. No `<img>` tags reference missing files
6. Total bundle size < 500KB (first load JS)

## Brand Book Structure Engine (Profile-Driven)

The brand book pages, sections, layout, and theme are NOT fixed. They are determined by the
client's brand profile. The reference site (brand.aioxsquad.ai) is a QUALITY reference for
production standards, not a CONTENT template to copy.

### Page Selection by Profile

#### Core Pages (always present, 6-8)

These pages exist in every brand book regardless of industry or scope:

| Page | Route | Purpose |
|------|-------|---------|
| Home / Hero | `/` | Brand overview, first impression |
| Brand Identity | `/brandbook/guidelines` | Archetype, personality, positioning |
| Colors | `/brandbook/foundations/colors` | Palette, usage rules, accessibility |
| Typography | `/brandbook/foundations/typography` | Type system, pairings, hierarchy |
| Components Catalog | `/brandbook/components` | Interactive component library |
| Voice & Tone Guide | `/brandbook/guidelines/voice` | Writing style, do/don't examples |

#### Industry-Specific Pages (selected by profile, 3-10)

| Industry | Pages to Include |
|----------|-----------------|
| Cafe / Restaurant | "Menu Showcase", "Space Photography", "Seasonal Campaigns", "Packaging Standards" |
| SaaS / Tech | "Product Screenshots", "API Documentation Style", "Dashboard Patterns", "Onboarding Flow", "Feature Announcements" |
| Fashion / Retail | "Lookbook Layouts", "Product Photography", "Seasonal Collections", "E-commerce Patterns", "Packaging & Tags" |
| Health / Wellness | "Patient Communication", "Clinical Photography", "Trust Signals", "Appointment Flow", "Wellness Content" |
| Education | "Course Materials", "Student Portal Patterns", "Certificate Design", "Learning Path Layouts" |
| Finance / Corporate | "Report Templates", "Data Visualization", "Compliance Badges", "Investor Materials", "Internal Communications" |
| Gaming / Entertainment | "Achievement System", "Loading Screens", "Player Profiles", "Leaderboard Design", "Event Banners" |
| Real Estate | "Property Listings", "Virtual Tour Guidelines", "Neighborhood Profiles", "Agent Branding" |
| Creative Agency | "Portfolio Layouts", "Case Study Templates", "Client Presentation", "Process Documentation" |
| Nightlife / Events | "Event Posters", "Social Media Templates", "Venue Photography", "Ticket Design", "DJ/Artist Profiles" |

#### Optional Pages (scope-dependent, 0-8)

| Page | Include When |
|------|-------------|
| Motion Showcase | Scope >= medium AND archetype has strong motion identity (Creator, Magician, Jester, Explorer) |
| Pattern Library | Scope >= medium |
| Page Templates | Scope >= large |
| Case Studies | B2B or agency clients |
| Social Media Kit | Scope includes social presence |
| Email Templates | Scope includes email marketing |
| Iconography | Scope >= large OR industry demands custom icons |
| Photography Direction | Industry relies heavily on imagery (fashion, food, real estate) |

#### Page Count by Scope

| Scope | Core | Industry | Optional | Total Range |
|-------|------|----------|----------|-------------|
| Portfolio | 6 | 3-4 | 0-1 | 10-12 |
| Small Business | 6-7 | 4-6 | 1-2 | 12-16 |
| Medium | 7-8 | 6-8 | 3-5 | 16-22 |
| Large / Enterprise | 8 | 8-10 | 5-8 | 22-30+ |

### Layout & Theme Selection by Profile

The visual layout and dark/light mode default are driven by the brand profile, NOT copied from a reference.

#### Theme Mode Selection

| Default Mode | Industries / Archetypes |
|-------------|------------------------|
| **Dark-first** | Tech, Gaming, Nightlife, Creative Agencies; Archetypes: Outlaw, Magician, Explorer |
| **Light-first** | Cafe, Health, Education, Kids, Nature, Bakery; Archetypes: Innocent, Caregiver, Everyman |
| **Neutral/adaptive** | Finance, Corporate, Fashion, Real Estate; Archetypes: Ruler, Sage, Hero |

Theme mode is a DEFAULT. Every brand book must support both modes via CSS custom properties.
The profile determines which mode is the PRIMARY experience.

#### Layout Style Selection

| Layout Style | When to Use |
|-------------|-------------|
| **Structured grid** | Ruler, Sage, corporate industries, data-heavy content |
| **Organic flow** | Creator, Lover, Caregiver, lifestyle industries |
| **Bold full-width** | Hero, Explorer, high-impact industries (gaming, entertainment) |
| **Minimal whitespace** | Innocent, Sage, luxury, portfolio |
| **Asymmetric/editorial** | Creator, Outlaw, fashion, creative agencies |
| **Card-based mosaic** | Everyman, SaaS, e-commerce, real estate |

#### Navigation Style Selection

| Nav Style | When to Use |
|-----------|-------------|
| **Sidebar (persistent)** | Large scope (20+ pages), enterprise, documentation-heavy |
| **Top nav (minimal)** | Small scope (<15 pages), portfolio, single-page feel |
| **Sidebar (collapsible)** | Medium scope, balanced between browsing and content |
| **Tab-based** | Component-heavy brand books, design system focus |

### Brand Book Manifest

Generate `brandbook-manifest.md` in `.aiox/branding/{client}/`:

```markdown
# Brand Book Manifest -- {client_name}

## Profile Inputs
- **Industry:** {industry}
- **Archetype:** {archetype}
- **Scope:** {scope}
- **Personality:** {personality_traits}

## Layout Decisions
- **Theme mode:** {dark-first | light-first | neutral} -- Reason: {why}
- **Layout style:** {style} -- Reason: {why}
- **Navigation:** {nav_style} -- Reason: {why}

## Page Structure ({total_pages} pages)

### Core Pages ({count})
| Page | Route |
|------|-------|
| ... | ... |

### Industry Pages ({count})
| Page | Route | Selection Reason |
|------|-------|-----------------|
| ... | ... | {why this page matters for this client} |

### Optional Pages ({count})
| Page | Route | Justification |
|------|-------|--------------|
| ... | ... | {why scope/profile demands it} |

## Pages NOT Included (and why)
| Page | Reason |
|------|--------|
| ... | {not relevant for this industry/scope} |
```

**CRITICAL:** The manifest must document WHY each page was included or excluded.
The total page count is determined by profile, NOT fixed at any number.

---

## Mode Configuration

### Full Mode

| Setting | Value |
|---------|-------|
| Phases | All 7 (0-6) |
| Skip | None |
| Parallel Build | Yes (phases 3-4-5) |
| Gate Minimums | scaffold: pass/fail, research: 7, discovery: 8, build: 7, qa: 8 |
| Estimated Duration | 4-8 hours |

### Express Mode

| Setting | Value |
|---------|-------|
| Phases | 5 (scaffold, discovery, design-system, visual, content, basic QA) |
| Skip | research, manifesto, component-variants, a11y-audit, ds-document, photo-retouch, motion-create, asset-organize, social-post-create, seo-meta-write, email-sequence, visual-review, wcag-test |
| Parallel Build | Yes (phases 3-4-5, streamlined) |
| Gate Minimums | scaffold: pass/fail, discovery: 7, build: 6, qa: 6 |
| Estimated Duration | 1-2 hours |

### Refresh Mode

| Setting | Value |
|---------|-------|
| Phases | Only stale phases |
| Skip | Phases with up-to-date outputs |
| Change Detection | File timestamp comparison |
| Gate Minimums | Same as full mode |
| Estimated Duration | Variable |
| Scaffold | Skipped if `app/` already exists and `package.json` is valid |

## Timeout Configuration

| Phase | Default Timeout | Express Timeout |
|-------|----------------|-----------------|
| scaffold | 10 min | 10 min |
| research | 60 min | N/A (skipped) |
| discovery | 90 min | 60 min |
| design-system | 60 min | 30 min |
| visual | 60 min | 30 min |
| content | 60 min | 30 min |
| qa | 60 min | 30 min |
| **Pipeline Total** | **520 min** | **130 min** |

## Retry Policy

| Setting | Value |
|---------|-------|
| Auto-retries per phase | 1 |
| Retry scope | Entire phase |
| Cooldown between retries | 30 seconds |
| Max total retries per pipeline | 7 (one per phase) |
| Post-retry failure action | HALT and escalate |

## Parallel Execution Rules

1. Phases 3, 4, 5 belong to `parallel_group: build`
2. All three START simultaneously after Phase 2 passes
3. Each has independent gate evaluation
4. Phase 6 (QA) waits for ALL three to complete
5. If one fails: retry that one while others continue
6. If one fails after retry: mark it failed, continue others, QA skips failed phase deliverables

## State Persistence

| Setting | Value |
|---------|-------|
| State file | `.aiox/branding/{client}/pipeline-state.yaml` |
| Save frequency | After every phase transition |
| Backup on start | Copy previous state to `.bak` |
| Template | `data/pipeline-state-template.yaml` |

## Gate Minimum Scores

| Phase | Full Mode | Express Mode |
|-------|-----------|--------------|
| scaffold | pass/fail (no score) | pass/fail (no score) |
| research | 7/8 | N/A |
| discovery | 8/8 | 7/8 |
| design-system | 7/8 | 6/8 |
| visual | 7/8 | 6/8 |
| content | 7/8 | 6/8 |
| qa | 8/8 (delivery checklist) | 6/8 |

## Artifact Locations

All artifacts stored under `.aiox/branding/{client}/`:

```
.aiox/branding/{client}/
  pipeline-state.yaml          # Pipeline state machine
  delivery-report.md           # Final delivery report
  research/                    # Phase 1 outputs
    market_report.md
    competitive_report.md
    trend_data.md
    audience_personas.md
  discovery/                   # Phase 2 outputs
    brand_profile.json
    voice_guide.md
    manifesto.md
    moodboard_urls.json
    palette.json
    typography.json
    tokens.json
  app/                         # Next.js project (Phase 0+3+4 outputs)
    layout.tsx
    page.tsx
    globals.css
    brandbook/
      layout.tsx
      guidelines/
      foundations/
      components/
      patterns/
      showcase/
    components/
      ui/                      # Phase 3: React components
      motion/                  # Phase 4: Framer Motion components
      layout/                  # Sidebar, Nav, Footer
      showcase/                # Phase 4: Demo components
    lib/
      tokens.ts                # Phase 3: TS token constants
      animations.ts            # Phase 4: Framer Motion presets
    styles/
      tokens.css               # Phase 3: CSS custom properties
    public/
      images/                  # Phase 4: Generated/retouched images
      assets/                  # Phase 4: Organized assets
    next.config.js
    tailwind.config.ts
    package.json
    tsconfig.json
    out/                       # Phase 6: Static export output
  content/                     # Phase 5 outputs
    copy_strategy.md
    landing_copy.md
    social_posts/
    seo_meta.json
    email_sequences/
  qa/                          # Phase 6 outputs
    visual_qa_report.md
    wcag_report.md
    compliance_report.md
    lighthouse_report.json
    build_report.md
    delivery_report.md
```

## Backward Compatibility

### What Changed

| Before (v1) | After (v2) | Migration |
|-------------|-----------|-----------|
| Static HTML/CSS output | Next.js React app | Complete replacement |
| `css-vars.css` | `styles/tokens.css` + `tailwind.config.ts` | Tokens JSON format unchanged |
| `_variables.scss` | Removed | Tailwind replaces SCSS |
| HTML components | React TSX components | New component architecture |
| CSS animations | Framer Motion components | New motion architecture |
| Direct file open | `npx next export` then open `out/index.html` | Static export preserves open-in-browser |

### What Did NOT Change

- Brand data format (tokens.json, palette.json, typography.json, brand_profile.json)
- Pipeline phases 1, 2, 5 (research, discovery, content)
- State machine format (pipeline-state.yaml)
- Gate checklist scoring system
- Squad delegation pattern
- Retry and timeout policies

---
*Brand Pipeline Config v2.0 -- Next.js Architecture*
