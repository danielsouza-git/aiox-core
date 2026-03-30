# component-build

```yaml
task: componentBuild()
agent: component-builder
squad: design-system

inputs:
  - name: component_name
    type: string
    required: true
    description: PascalCase component name (e.g., Button, FeatureCard, Modal)
  - name: category
    type: enum
    values: [buttons, cards, forms, feedback, navigation, layout, data, overlay, typography]
    required: true
  - name: tokens_css
    type: css
    required: true
    description: Compiled CSS custom properties file (styles/tokens.css)
  - name: tailwind_config
    type: typescript
    required: true
    description: Tailwind config with token theme extension (tailwind.config.ts)
  - name: pattern_spec
    type: markdown
    required: false
    description: Pattern spec from ds-architect (if available)

outputs:
  - name: component_tsx
    type: tsx
    destination: app/components/ui/{category}/{name}.tsx
  - name: component_index
    type: typescript
    destination: app/components/ui/{category}/index.ts

tools:
  - testing-library
  - framer-motion
  - class-variance-authority
```

## Purpose

Build a single React/TypeScript component for the brand book design system. Each component uses Tailwind CSS utility classes combined with CSS custom properties (design tokens) for styling, class-variance-authority (cva) for variant management, and Framer Motion for all animations. Every component exports a fully typed props interface.

## Component Registry (Reference Catalog)

The following is the COMPLETE catalog of available components. This is NOT a build list.
**Phase 0 (Component Selection Engine) determines which components are built for each client.**
Only components selected by the manifest are generated. The catalog below serves as the
specification reference when a component IS selected.

### Category: Buttons (2 components)

| Component | Variants | Description |
|-----------|----------|-------------|
| `Button` | variant: primary, secondary, outline, ghost, link / size: sm, md, lg, xl / loading, disabled | Primary interactive element with all standard variants |
| `IconButton` | variant: primary, secondary, outline, ghost / size: sm, md, lg / icon position: left, right, only | Button optimized for icon-only or icon+label use |

### Category: Cards (4 components)

| Component | Variants | Description |
|-----------|----------|-------------|
| `Card` | variant: elevated, outlined, filled / padding: sm, md, lg / interactive (hover lift) | Base card container with optional header, body, footer slots |
| `FeatureCard` | layout: vertical, horizontal / icon position / highlight color | Feature showcase card with icon, title, description |
| `TestimonialCard` | variant: default, minimal, featured | Customer testimonial with avatar, quote, attribution |
| `PricingCard` | variant: default, popular, enterprise / billing: monthly, yearly | Pricing tier display with feature list and CTA |

### Category: Forms (7 components)

| Component | Variants | Description |
|-----------|----------|-------------|
| `Input` | variant: default, filled, flushed / size: sm, md, lg / error, disabled | Text input with label, helper text, error state |
| `Textarea` | variant: default, filled / resize: none, vertical, both | Multi-line text input with auto-resize option |
| `Select` | variant: default, filled / size: sm, md, lg | Native select wrapper with consistent styling |
| `Checkbox` | size: sm, md, lg / indeterminate | Checkbox with label and description support |
| `Switch` | size: sm, md, lg / color variants | Toggle switch with accessible labeling |
| `Slider` | size: sm, md / orientation: horizontal, vertical / range | Range input with track, thumb, and value display |
| `Radio` | size: sm, md, lg | Radio button group with orientation options |

### Category: Feedback (7 components)

| Component | Variants | Description |
|-----------|----------|-------------|
| `Alert` | variant: info, success, warning, error / closable | Contextual feedback banner with icon and actions |
| `Toast` | variant: info, success, warning, error / position | Temporary notification with auto-dismiss |
| `Badge` | variant: solid, subtle, outline / color / size: sm, md | Status indicator with text or count |
| `Tag` | variant: solid, subtle, outline / closable / size: sm, md | Removable label/category indicator |
| `Spinner` | size: sm, md, lg, xl / color | Loading spinner with accessible announcement |
| `Progress` | variant: linear, circular / size: sm, md, lg / indeterminate | Progress indicator with percentage label |
| `Skeleton` | variant: text, circular, rectangular / animation: pulse, wave | Placeholder loading state |

### Category: Navigation (5 components)

| Component | Variants | Description |
|-----------|----------|-------------|
| `Navbar` | variant: solid, transparent, blur / sticky | Top navigation bar with logo, links, actions |
| `Sidebar` | variant: full, compact, overlay / collapsible | Side navigation with sections and nested items |
| `Breadcrumb` | separator: slash, chevron, dot | Hierarchical navigation path |
| `Tabs` | variant: line, enclosed, pills / orientation: horizontal, vertical | Tab navigation with panels |
| `Pagination` | variant: default, compact / size: sm, md | Page navigation with previous/next and page numbers |

### Category: Layout (5 components)

| Component | Variants | Description |
|-----------|----------|-------------|
| `Container` | size: sm, md, lg, xl, full / padding | Max-width content container |
| `Grid` | cols: 1-12 / gap / responsive breakpoints | CSS Grid wrapper with responsive columns |
| `Stack` | direction: vertical, horizontal / gap / align, justify | Flexbox stack with consistent spacing |
| `Divider` | orientation: horizontal, vertical / variant: solid, dashed, dotted | Visual separator |
| `Section` | variant: default, highlighted, hero / padding: sm, md, lg, xl | Page section wrapper with background variants |

### Category: Data (4 components)

| Component | Variants | Description |
|-----------|----------|-------------|
| `Table` | variant: simple, striped / size: sm, md / sortable, selectable | Data table with header, body, pagination |
| `List` | variant: unordered, ordered, description / spacing: sm, md | Styled list with optional icons |
| `Stat` | variant: default, card / trend: up, down, neutral | Statistic display with label, value, change indicator |
| `ChartPlaceholder` | variant: bar, line, pie, area | Chart wrapper placeholder with loading state |

### Category: Overlay (5 components)

| Component | Variants | Description |
|-----------|----------|-------------|
| `Modal` | size: sm, md, lg, xl, full / scrollBehavior: inside, outside | Dialog overlay with header, body, footer |
| `Drawer` | placement: left, right, top, bottom / size: sm, md, lg | Slide-out panel overlay |
| `Tooltip` | placement: top, right, bottom, left / delay | Informational hover popup |
| `Popover` | placement: top, right, bottom, left / trigger: click, hover | Interactive content popup |
| `Dropdown` | placement: bottom-start, bottom-end / trigger: click, hover | Dropdown menu with items and groups |

### Category: Typography (5 components)

| Component | Variants | Description |
|-----------|----------|-------------|
| `Heading` | level: h1, h2, h3, h4, h5, h6 / size override / weight | Semantic heading with design token typography |
| `Text` | size: xs, sm, md, lg, xl / weight / color / as (polymorphic) | Body text with semantic rendering |
| `Code` | variant: inline, block / language (for syntax hint) | Code display with monospace styling |
| `Blockquote` | variant: default, accent, minimal | Styled quotation with attribution |
| `Label` | size: sm, md / required indicator / htmlFor | Form label with required indicator |

**Total: 44 components across 9 categories.**

## Workflow

### Phase 0: Profile Analysis -- Component Selection Engine

Before generating ANY component, analyze the client's brand profile to determine WHAT to build.
The reference site is a QUALITY reference, not a content template. Each client is unique.

```yaml
inputs:
  - brand_profile: discovery/brand_profile.json   # archetype, personality, industry
  - tokens: discovery/tokens.json                 # visual direction
  - scope: pipeline-state.yaml -> pipeline.scope  # small | medium | large | enterprise

outputs:
  - component_manifest: component-manifest.md     # WHY each component was selected
```

#### Step 0.1: Read Brand Profile

Read `brand_profile.json` and extract:
- `archetype` (e.g., Ruler, Creator, Caregiver, Explorer, Hero, Sage, Magician, Outlaw, Jester, Lover, Everyman, Innocent)
- `industry` (e.g., cafe, saas, fashion, health, education, finance, gaming, nightlife, real-estate)
- `personality_traits` (e.g., playful, serious, warm, bold, minimalist, luxurious)
- `scope` (small-business, medium, large, enterprise, portfolio)

#### Step 0.2: Select Industry-Specific Components

Based on `industry`, select ONLY the components this client actually needs:

| Industry | Industry-Specific Components |
|----------|------------------------------|
| Cafe / Restaurant | `MenuItem`, `MenuBoard`, `ReservationCard`, `HoursDisplay`, `LocationCard`, `SeasonalBanner` |
| SaaS / Tech | `PricingTable`, `FeatureGrid`, `ComparisonTable`, `IntegrationCard`, `ChangelogEntry`, `StatusBadge` |
| Fashion / Retail | `ProductCard`, `LookbookGrid`, `SizeGuide`, `ColorSelector`, `CollectionHero`, `WishlistButton` |
| Health / Wellness | `AppointmentCard`, `TestimonialSlider`, `ServiceCard`, `DoctorProfile`, `InsuranceBadge`, `WellnessTip` |
| Education | `CourseCard`, `CurriculumTimeline`, `InstructorProfile`, `EnrollmentCTA`, `ProgressTracker`, `LessonPreview` |
| Finance / Corporate | `DataTable`, `KPICard`, `ReportChart`, `ComplianceBadge`, `TeamMemberCard`, `CaseStudyCard` |
| Gaming / Entertainment | `LeaderboardRow`, `AchievementBadge`, `PlayerCard`, `EventCountdown`, `StreamEmbed`, `RatingStars` |
| Real Estate | `PropertyCard`, `FloorplanViewer`, `AgentProfile`, `MortgageCalculator`, `NeighborhoodMap`, `VirtualTourCTA` |
| Creative Agency | `PortfolioCard`, `ProjectShowcase`, `ClientLogo`, `ProcessStep`, `AwardBadge`, `CaseStudyHero` |
| Nightlife / Events | `EventCard`, `VenueMap`, `DJProfile`, `TicketCTA`, `GalleryMasonry`, `CountdownTimer` |

If the client's industry is not listed, derive appropriate components from the brand profile's
`personality_traits` and `industry` description. Document the reasoning in the manifest.

#### Step 0.3: Apply Archetype-Driven Styling Presets

The archetype determines the DEFAULT visual treatment for ALL components:

| Archetype | Border Radius | Grid Style | Shadow | Motion Feel | Typography Weight |
|-----------|---------------|------------|--------|-------------|-------------------|
| Ruler | Sharp (0-2px) | Structured, symmetric | Minimal, defined | Deliberate, precise | Bold headings, regular body |
| Creator | Rounded (12-20px) | Asymmetric, playful | Soft, layered | Bouncy, spring-based | Mixed weights, expressive |
| Caregiver | Soft (8-12px) | Gentle, spacious | Warm, diffused | Gentle, eased | Rounded fonts, medium weight |
| Explorer | Mixed (varies) | Dynamic, card-heavy | Elevated, dramatic | Energetic, fast | Strong, condensed |
| Hero | Medium (4-8px) | Bold, full-width | Sharp, high-contrast | Powerful, impact-based | Heavy, impactful |
| Sage | Clean (4-6px) | Organized, hierarchical | Subtle, understated | Smooth, informative | Light, readable |
| Magician | Fluid (16-24px) | Overlapping, layered | Glowing, ethereal | Magical, staggered | Elegant, varied |
| Outlaw | Harsh (0px) | Broken grid, raw | None or hard-edged | Aggressive, abrupt | Bold, condensed |
| Jester | Fully rounded (999px) | Chaotic, fun | Colorful, fun | Bouncy, exaggerated | Rounded, playful |
| Lover | Soft (10-16px) | Flowing, organic | Warm, intimate | Slow, sensual | Thin, elegant |
| Everyman | Standard (6-8px) | Simple, familiar | Default, comfortable | Natural, unobtrusive | Regular, approachable |
| Innocent | Soft (8-14px) | Clean, airy | Light, clean | Light, optimistic | Simple, clean |

These presets are GUIDELINES, not rigid rules. The brand profile's `personality_traits` can
override or blend archetypes (e.g., a "playful Ruler" uses structured grids but with rounded corners).

#### Step 0.4: Determine Component Count by Scope

| Scope | Universal | Industry-Specific | Optional/Advanced | Total Range |
|-------|-----------|-------------------|-------------------|-------------|
| Portfolio | 8-10 | 3-5 | 0-2 | 10-15 |
| Small Business | 8-10 | 5-8 | 2-4 | 15-20 |
| Medium | 8-10 | 8-12 | 4-6 | 20-28 |
| Large / Enterprise | 8-10 | 10-15 | 8-10 | 30-40+ |

**Universal components** (always generated, adapted to archetype styling):
`Button`, `Card`, `Badge`, `Input`, `Navbar`, `Footer`, `Hero`, `Container`, `Text`, `Heading`

**Optional/Advanced components** (only when scope demands):
`Table`, `Chart`, `DataGrid`, `ComplexForm`, `Wizard`, `Dashboard`, `Calendar`, `FileUpload`, `RichTextEditor`, `KanbanBoard`

#### Step 0.5: Write Component Manifest

Generate `component-manifest.md` in `.aiox/branding/{client}/`:

```markdown
# Component Manifest -- {client_name}

## Profile Summary
- **Industry:** {industry}
- **Archetype:** {archetype}
- **Scope:** {scope}
- **Personality:** {personality_traits}

## Styling Presets (from archetype)
- **Border radius:** {value}
- **Grid style:** {value}
- **Shadow:** {value}
- **Motion feel:** {value}
- **Typography weight:** {value}

## Selected Components ({total_count})

### Universal ({count})
| Component | Archetype Adaptation |
|-----------|---------------------|
| Button | {e.g., "Sharp corners, minimal shadow per Ruler archetype"} |
| ... | ... |

### Industry-Specific ({count})
| Component | Selection Reason |
|-----------|-----------------|
| {name} | {why this client needs it based on industry/profile} |
| ... | ... |

### Optional/Advanced ({count})
| Component | Justification |
|-----------|--------------|
| {name} | {why scope demands it} |
| ... | ... |

## Components NOT Included (and why)
| Component | Reason for Exclusion |
|-----------|---------------------|
| PricingTable | Not relevant for {industry} |
| ... | ... |
```

**CRITICAL:** The manifest must document WHY each component was selected or excluded.
No component should be included "because the template had it." Every inclusion is justified
by the client's profile.

#### Step 0.6: Validate Manifest Against Profile

Before proceeding to Phase 1:
- [ ] Every industry-specific component maps to a real client need
- [ ] Archetype styling presets are documented and consistent
- [ ] Component count falls within scope range
- [ ] No components are included without justification
- [ ] The manifest is saved and will be referenced by all subsequent phases

---

### Phase 1: Specification Review

```yaml
steps:
  - review_spec: |
      Read pattern spec if available.
      If no spec, define component API from the registry table above.
  - define_props_interface: |
      Create a TypeScript interface for all component props:
        - All variant dimensions as union type literals
        - Optional children (React.ReactNode) for container components
        - All HTML native attributes via ComponentPropsWithoutRef<element>
        - className override support
        - ref forwarding support
  - define_variants: |
      Define cva variant schema:
        - defaultVariants for each dimension
        - compoundVariants for conditional combinations
  - define_animation: |
      Determine Framer Motion integration:
        - Entry/exit animations (AnimatePresence)
        - Hover/tap interactions (whileHover, whileTap)
        - Layout animations (layout prop)
        - Respect prefers-reduced-motion
  - define_a11y: |
      Specify ARIA requirements:
        - Semantic HTML element
        - ARIA role, attributes, keyboard interaction
        - Focus management (modals, drawers, dropdowns)
```

### Phase 2: Component Implementation

```yaml
steps:
  - write_imports: |
      Standard import block:
        import { forwardRef } from 'react'
        import { cva, type VariantProps } from 'class-variance-authority'
        import { motion, AnimatePresence } from 'framer-motion'
        import { cn } from '@/lib/utils'
  - write_variants: |
      Define cva variant configuration:
        const {name}Variants = cva('base-classes', {
          variants: { ... },
          defaultVariants: { ... },
          compoundVariants: [ ... ]
        })
  - write_props_interface: |
      Export typed props interface:
        export interface {Name}Props
          extends React.ComponentPropsWithoutRef<'{element}'>
          , VariantProps<typeof {name}Variants> {
          // component-specific props
        }
  - write_component: |
      Export named forwardRef component:
        export const {Name} = forwardRef<HTML{Element}Element, {Name}Props>(
          ({ variant, size, className, children, ...props }, ref) => {
            return (
              <{element}
                ref={ref}
                className={cn({name}Variants({ variant, size }), className)}
                {...props}
              >
                {children}
              </{element}>
            )
          }
        )
        {Name}.displayName = '{Name}'
  - write_barrel_export: |
      Update category index.ts:
        export { {Name} } from './{name}'
        export type { {Name}Props } from './{name}'
```

### Phase 3: Styling with Tailwind + Tokens

```yaml
steps:
  - write_base_classes: |
      Use Tailwind utility classes that reference CSS custom properties:
        - Colors: text-[--color-text-primary] bg-[--color-surface-primary]
        - Spacing: p-[--spacing-3] gap-[--spacing-4]
        - Typography: font-[--font-family-sans] text-[length:--font-size-md]
        - Borders: border-[--color-border-default] rounded-[--radius-md]
      Or use Tailwind theme extensions where tokens are mapped:
        - Colors: text-primary-500 bg-surface-primary
        - Spacing: p-3 gap-4 (if tokens map to Tailwind scale)
  - write_variant_classes: |
      Use cva to switch classes per variant:
        variants: {
          variant: {
            primary: 'bg-[--color-primary-500] text-white hover:bg-[--color-primary-600]',
            secondary: 'bg-[--color-secondary-500] text-white hover:bg-[--color-secondary-600]',
            outline: 'border border-[--color-border-default] bg-transparent hover:bg-[--color-surface-hover]',
            ghost: 'bg-transparent hover:bg-[--color-surface-hover]',
          },
          size: {
            sm: 'h-8 px-3 text-sm',
            md: 'h-10 px-4 text-base',
            lg: 'h-12 px-6 text-lg',
          }
        }
  - write_state_classes: |
      Tailwind state modifiers:
        - hover: hover:bg-[--color-primary-600]
        - focus: focus-visible:ring-2 focus-visible:ring-[--color-focus-ring] focus-visible:ring-offset-2
        - active: active:scale-[0.98]
        - disabled: disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
  - verify_no_hardcoded: |
      CRITICAL: Zero hardcoded color, font, or spacing values.
      All visual values must come from:
        - CSS custom properties (--token-name)
        - Tailwind theme extensions (mapped from tokens)
        - Tailwind's default scale ONLY where token mapping exists
```

### Phase 4: Animation with Framer Motion

```yaml
steps:
  - write_entry_animation: |
      For components with visibility transitions (Modal, Toast, Drawer, Alert):
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              ...
            </motion.div>
          )}
        </AnimatePresence>
  - write_interaction_animation: |
      For interactive elements (Button, Card, IconButton):
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
  - write_reduced_motion: |
      ALWAYS respect prefers-reduced-motion:
        const prefersReducedMotion = typeof window !== 'undefined'
          ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
          : false
        // OR use Framer Motion's built-in support:
        transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
  - animation_rules: |
      RULES:
        - All animations via Framer Motion ONLY (no GSAP, no Lottie, no CSS @keyframes)
        - Maximum duration: 300ms for micro-interactions, 500ms for transitions
        - Spring physics preferred over eased durations for interactive elements
        - AnimatePresence for mount/unmount transitions
        - layout prop for layout shift animations
```

### Phase 5: Accessibility

```yaml
steps:
  - write_semantic_html: |
      Use the correct semantic element:
        - button for Button, IconButton
        - input for Input, Checkbox, Radio, Switch, Slider
        - dialog for Modal
        - nav for Navbar, Sidebar, Breadcrumb
        - table for Table
        - ul/ol for List
        - blockquote for Blockquote
  - write_aria: |
      Add ARIA attributes:
        - aria-label or aria-labelledby for non-text-content elements
        - aria-expanded for expandable (Drawer, Dropdown, Sidebar)
        - aria-selected for selectable (Tabs, Radio)
        - aria-live="polite" for dynamic content (Toast, Alert, Progress)
        - aria-busy="true" for loading states (Spinner, Skeleton)
        - role="dialog" + aria-modal="true" for Modal, Drawer
  - write_keyboard: |
      Keyboard support:
        - Enter/Space for Button, Checkbox, Switch
        - Arrow keys for Radio, Tabs, Slider, Select
        - Escape for Modal, Drawer, Dropdown, Popover
        - Tab for focus navigation (never trap unless modal)
  - write_focus_management: |
      Focus trapping for overlays:
        - Modal: trap focus inside, return focus on close
        - Drawer: trap focus inside, return focus on close
        - Dropdown: manage focus within items, close on outside click
```

### Phase 6: Validation

```yaml
steps:
  - validate_types: |
      TypeScript checks:
        - All props have explicit types (no 'any')
        - VariantProps correctly inferred from cva
        - Ref type matches the rendered element
        - Generic constraints for polymorphic components
  - validate_tokens: |
      Token usage:
        - Zero hardcoded color values (#hex, rgb(), hsl())
        - Zero hardcoded font-family declarations
        - Zero hardcoded spacing values (except 0, px)
        - All values reference --token or Tailwind theme extension
  - validate_exports: |
      Export checks:
        - Named export (no default exports)
        - Props interface exported separately
        - displayName set on forwardRef components
        - Barrel export in category index.ts
  - validate_a11y: |
      Accessibility audit:
        - Correct semantic element used
        - ARIA attributes present
        - Keyboard navigation functional
        - Focus-visible styles defined
        - Color contrast meets WCAG AA (4.5:1)
```

## Component Template

```tsx
// app/components/ui/{category}/{name}.tsx
'use client'

import { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------
const buttonVariants = cva(
  // Base classes (always applied)
  'inline-flex items-center justify-center font-medium transition-colors ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-focus-ring] focus-visible:ring-offset-2 ' +
  'disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary:
          'bg-[--color-primary-500] text-white hover:bg-[--color-primary-600] active:bg-[--color-primary-700]',
        secondary:
          'bg-[--color-secondary-500] text-white hover:bg-[--color-secondary-600] active:bg-[--color-secondary-700]',
        outline:
          'border border-[--color-border-default] bg-transparent hover:bg-[--color-surface-hover]',
        ghost:
          'bg-transparent hover:bg-[--color-surface-hover]',
        link:
          'bg-transparent underline-offset-4 hover:underline text-[--color-primary-500]',
      },
      size: {
        sm: 'h-8 px-3 text-sm rounded-[--radius-sm] gap-1.5',
        md: 'h-10 px-4 text-base rounded-[--radius-md] gap-2',
        lg: 'h-12 px-6 text-lg rounded-[--radius-md] gap-2.5',
        xl: 'h-14 px-8 text-xl rounded-[--radius-lg] gap-3',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
export interface ButtonProps
  extends React.ComponentPropsWithoutRef<'button'>,
    VariantProps<typeof buttonVariants> {
  /** Show loading spinner and disable interaction */
  loading?: boolean
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, loading, className, children, disabled, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading && (
          <span
            className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden="true"
          />
        )}
        {children}
      </motion.button>
    )
  }
)
Button.displayName = 'Button'
```

## cn Utility Requirement

Components depend on a `cn` utility that merges Tailwind classes. Create at `lib/utils.ts`:

```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

Required dependencies: `clsx`, `tailwind-merge`.

## File Organization

```
app/components/ui/
  buttons/
    button.tsx
    icon-button.tsx
    index.ts
  cards/
    card.tsx
    feature-card.tsx
    testimonial-card.tsx
    pricing-card.tsx
    index.ts
  forms/
    input.tsx
    textarea.tsx
    select.tsx
    checkbox.tsx
    switch.tsx
    slider.tsx
    radio.tsx
    index.ts
  feedback/
    alert.tsx
    toast.tsx
    badge.tsx
    tag.tsx
    spinner.tsx
    progress.tsx
    skeleton.tsx
    index.ts
  navigation/
    navbar.tsx
    sidebar.tsx
    breadcrumb.tsx
    tabs.tsx
    pagination.tsx
    index.ts
  layout/
    container.tsx
    grid.tsx
    stack.tsx
    divider.tsx
    section.tsx
    index.ts
  data/
    table.tsx
    list.tsx
    stat.tsx
    chart-placeholder.tsx
    index.ts
  overlay/
    modal.tsx
    drawer.tsx
    tooltip.tsx
    popover.tsx
    dropdown.tsx
    index.ts
  typography/
    heading.tsx
    text.tsx
    code.tsx
    blockquote.tsx
    label.tsx
    index.ts
  index.ts              # Root barrel export for all categories
```

## Pre-Conditions

- [ ] Token CSS file available at `styles/tokens.css`
- [ ] Tailwind config generated with token theme extension at `tailwind.config.ts`
- [ ] `cn` utility created at `lib/utils.ts`
- [ ] Dependencies installed: `class-variance-authority`, `clsx`, `tailwind-merge`, `framer-motion`
- [ ] Component name and category defined

## Post-Conditions

- [ ] Component `.tsx` file created in correct category directory
- [ ] Props interface exported with full TypeScript types
- [ ] Variants managed via cva (not separate files)
- [ ] Animations use Framer Motion exclusively
- [ ] Category `index.ts` barrel updated
- [ ] Component passes accessibility audit

## Acceptance Criteria

- [ ] Zero hardcoded visual values (colors, fonts, spacing)
- [ ] All styling via Tailwind utilities + CSS custom properties
- [ ] TypeScript strict: no `any`, all props typed, ref forwarded
- [ ] Named exports only (no default exports)
- [ ] cva for all variant management
- [ ] Framer Motion for all animations (no GSAP, no Lottie, no CSS @keyframes)
- [ ] prefers-reduced-motion respected
- [ ] Semantic HTML elements used
- [ ] ARIA attributes present and correct
- [ ] Focus-visible styles defined
- [ ] Keyboard navigation functional
- [ ] Component works in Next.js App Router ('use client' directive where needed)

## Quality Gate
- Threshold: >70%
- Component passes axe-core audit with zero violations
- Zero hardcoded color, font, or spacing values (all via CSS custom properties or Tailwind theme)
- TypeScript strict mode passes with no `any` types, all props typed, ref forwarded

---
*Design System Squad Task - component-builder*
