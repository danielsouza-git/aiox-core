# component-variants

```yaml
task: componentVariants()
agent: component-builder
squad: design-system

inputs:
  - name: component_name
    type: string
    required: true
    description: PascalCase component name (e.g., Button, Card, Alert)
  - name: variant_dimensions
    type: array
    required: true
    description: "Variant dimensions to define (e.g., [variant, size, color, state])"
  - name: tokens_css
    type: css
    required: true
    description: Compiled CSS custom properties file (styles/tokens.css)

outputs:
  - name: component_tsx
    type: tsx
    destination: app/components/ui/{category}/{name}.tsx
    description: Updated component with cva variant definitions

tools:
  - class-variance-authority
  - tailwind-merge
  - framer-motion
```

## Purpose

Define and manage component variants using the class-variance-authority (cva) pattern. All variants are expressed as props on a single component -- NOT as separate component files. This task establishes the variant architecture, compound variant rules, and type-safe variant API for every component in the design system.

## Core Principle: Variants as Props

```tsx
// CORRECT: Single component, variants via props
<Button variant="primary" size="lg" />
<Button variant="outline" size="sm" loading />
<Card variant="elevated" padding="lg" interactive />

// WRONG: Separate component files per variant
<PrimaryButton />         // DO NOT create separate variant components
<OutlineButton />         // All variants live in one component
<SmallButton />           // Size is a prop, not a file
```

## cva Pattern Reference

```tsx
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const componentVariants = cva(
  // Base classes -- always applied regardless of variant
  'inline-flex items-center justify-center font-medium transition-colors',
  {
    // Variant dimensions -- each key becomes a prop
    variants: {
      variant: {
        primary:   'bg-[--color-primary-500] text-white hover:bg-[--color-primary-600]',
        secondary: 'bg-[--color-secondary-500] text-white hover:bg-[--color-secondary-600]',
        outline:   'border border-[--color-border-default] bg-transparent hover:bg-[--color-surface-hover]',
        ghost:     'bg-transparent hover:bg-[--color-surface-hover]',
        link:      'bg-transparent underline-offset-4 hover:underline text-[--color-primary-500]',
      },
      size: {
        sm: 'h-8 px-3 text-sm gap-1.5',
        md: 'h-10 px-4 text-base gap-2',
        lg: 'h-12 px-6 text-lg gap-2.5',
        xl: 'h-14 px-8 text-xl gap-3',
      },
    },

    // Compound variants -- conditional class overrides
    compoundVariants: [
      {
        variant: 'link',
        size: 'sm',
        class: 'h-auto px-0 text-sm',
      },
      {
        variant: 'link',
        size: 'lg',
        class: 'h-auto px-0 text-lg',
      },
    ],

    // Default variants -- applied when prop is not specified
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)
```

## Workflow

### Phase 1: Variant Dimension Analysis

```yaml
steps:
  - identify_dimensions: |
      For each component, determine which variant dimensions apply.
      Common dimensions across the design system:

      | Dimension | Values | Applies To |
      |-----------|--------|------------|
      | variant | primary, secondary, outline, ghost, link | Buttons |
      | variant | elevated, outlined, filled | Cards |
      | variant | info, success, warning, error | Alert, Toast, Badge |
      | variant | default, filled, flushed | Input, Textarea, Select |
      | variant | solid, subtle, outline | Badge, Tag |
      | variant | line, enclosed, pills | Tabs |
      | variant | simple, striped | Table |
      | size | sm, md, lg | Most components |
      | size | sm, md, lg, xl | Button, Modal |
      | orientation | horizontal, vertical | Stack, Divider, Tabs, Slider |
      | placement | top, right, bottom, left | Tooltip, Popover, Drawer |
      | placement | bottom-start, bottom-end | Dropdown |
      | color | Any semantic color token | Badge, Tag, Spinner, Progress |

  - calculate_combinations: |
      Calculate total variant combinations per component.
      Flag components with > 50 combinations (review for simplification).
      Example: Button = 5 variants x 4 sizes = 20 base combinations.

  - define_defaults: |
      Every dimension MUST have a defaultVariant.
      This ensures the component renders correctly with zero props:
        <Button />        -> variant="primary" size="md"
        <Card />          -> variant="elevated" padding="md"
        <Alert />         -> variant="info"
```

### Phase 2: Variant Class Mapping

```yaml
steps:
  - map_variant_to_classes: |
      For each variant value, define the Tailwind classes that express it.
      RULES:
        1. All color values MUST reference CSS custom properties
        2. Use Tailwind arbitrary value syntax: bg-[--color-primary-500]
        3. Or use Tailwind theme extensions: bg-primary-500 (if mapped in tailwind.config.ts)
        4. Include hover, focus, active states within the variant class string
        5. Include transition utilities in base classes (not per-variant)

  - define_state_classes: |
      States are NOT variant dimensions. They are CSS pseudo-classes
      and data attributes applied alongside variants:

      PSEUDO-CLASS STATES (applied via Tailwind modifiers):
        hover:     hover:bg-[--color-primary-600]
        focus:     focus-visible:ring-2 focus-visible:ring-[--color-focus-ring]
        active:    active:scale-[0.98]
        disabled:  disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none

      DATA ATTRIBUTE STATES (applied via component logic):
        loading:   [data-loading="true"] -> show spinner, disable interaction
        selected:  [data-selected="true"] or aria-selected="true"
        expanded:  [data-expanded="true"] or aria-expanded="true"
        error:     [data-error="true"] -> border-[--color-error-500]

  - define_compound_variants: |
      Compound variants override classes when specific dimension
      combinations occur together:

      Example: Link variant ignores size height/padding:
        compoundVariants: [
          { variant: 'link', class: 'h-auto px-0' },
        ]

      Example: Ghost outline on dark background:
        compoundVariants: [
          { variant: 'ghost', color: 'dark', class: 'text-white hover:bg-white/10' },
        ]

      RULE: Only define compound variants when a dimension combination
      requires classes that DIFFER from the union of individual dimension classes.
```

### Phase 3: Props Interface Definition

```yaml
steps:
  - generate_variant_props: |
      Use VariantProps<typeof componentVariants> to auto-generate
      the variant prop types from the cva definition:

        export interface ButtonProps
          extends React.ComponentPropsWithoutRef<'button'>,
            VariantProps<typeof buttonVariants> {
          loading?: boolean       // component-specific prop
          leftIcon?: React.ReactNode
          rightIcon?: React.ReactNode
        }

      The VariantProps utility extracts:
        - variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | null
        - size?: 'sm' | 'md' | 'lg' | 'xl' | null

  - enforce_typing_rules: |
      RULES for props interfaces:
        1. NEVER use 'any' type
        2. All variant props are optional (defaults from cva)
        3. className prop is always available (from HTML element extension)
        4. ref prop is always available (via forwardRef)
        5. Component-specific props have explicit types and JSDoc descriptions
        6. Use 'as' prop pattern for polymorphic components (Text, Heading)

  - document_props: |
      Every prop MUST have a JSDoc comment:
        /** Visual style variant */
        variant?: 'primary' | 'secondary' | 'outline'
        /** Size preset affecting height, padding, and font size */
        size?: 'sm' | 'md' | 'lg'
        /** Show loading spinner and disable interaction */
        loading?: boolean
```

### Phase 4: Integration with Framer Motion

```yaml
steps:
  - determine_animation_variants: |
      Some cva variants imply different Framer Motion animations:

      Card with interactive prop:
        whileHover={{ y: -2, boxShadow: 'var(--shadow-lg)' }}

      Toast entry based on position variant:
        placement='top':    initial={{ y: -20, opacity: 0 }}
        placement='bottom': initial={{ y: 20, opacity: 0 }}

      Drawer entry based on placement variant:
        placement='left':   initial={{ x: '-100%' }}
        placement='right':  initial={{ x: '100%' }}

  - map_motion_to_variant: |
      When a cva variant implies a specific animation, compute the
      Framer Motion props from the variant value:

        const drawerMotion = {
          left:   { initial: { x: '-100%' }, animate: { x: 0 }, exit: { x: '-100%' } },
          right:  { initial: { x: '100%' },  animate: { x: 0 }, exit: { x: '100%' } },
          top:    { initial: { y: '-100%' }, animate: { y: 0 }, exit: { y: '-100%' } },
          bottom: { initial: { y: '100%' },  animate: { y: 0 }, exit: { y: '100%' } },
        }

      Apply in component:
        <motion.div {...drawerMotion[placement]} transition={{ type: 'spring', damping: 25 }}>

  - reduced_motion_variants: |
      ALWAYS provide reduced motion alternatives:
        const transition = prefersReducedMotion
          ? { duration: 0 }
          : { type: 'spring', stiffness: 400, damping: 17 }
```

### Phase 5: Variant Composition (Component Hierarchy)

```yaml
steps:
  - define_slot_variants: |
      Compound components (Card, Modal, Table) have sub-components
      that inherit the parent's variant context:

      Card:
        <Card variant="elevated" padding="lg">
          <CardHeader />    -- inherits padding context
          <CardBody />      -- inherits padding context
          <CardFooter />    -- inherits padding context
        </Card>

      Use React Context to pass variant state to children:
        const CardContext = createContext<{ padding: string }>({ padding: 'md' })

      Or use slot-based cva:
        const cardHeaderVariants = cva('border-b', {
          variants: {
            padding: {
              sm: 'px-3 py-2',
              md: 'px-4 py-3',
              lg: 'px-6 py-4',
            }
          }
        })

  - define_variant_groups: |
      Group components that share variant dimensions for consistency:

      Color semantic group (all use info/success/warning/error):
        - Alert, Toast, Badge

      Size group (all use sm/md/lg):
        - Button, Input, Select, Badge, Spinner, Pagination

      Layout group (all use horizontal/vertical):
        - Stack, Divider, Tabs, Slider

      This ensures variant names are consistent across the system.
```

### Phase 6: Validation

```yaml
steps:
  - validate_no_separate_files: |
      CRITICAL: Verify no variant is implemented as a separate component file.
      Every variant MUST be a prop on a single component.
      Grep for patterns like:
        - PrimaryButton, SecondaryButton, OutlineButton -> VIOLATION
        - SmallCard, LargeCard -> VIOLATION
        - InfoAlert, SuccessAlert -> VIOLATION

  - validate_defaults: |
      Every cva definition MUST include defaultVariants.
      A component with zero props must render correctly:
        <Button />        -> renders primary/md
        <Input />         -> renders default/md
        <Card />          -> renders elevated/md

  - validate_token_usage: |
      All variant class strings MUST use token-based values:
        CORRECT: 'bg-[--color-primary-500]' or 'bg-primary-500'
        WRONG:   'bg-blue-500' or 'bg-[#2563eb]'

  - validate_type_safety: |
      VariantProps<typeof xVariants> must produce correct union types.
      TypeScript should error on invalid variant values:
        <Button variant="invalid" />  -> TypeScript error
        <Button size="xxl" />         -> TypeScript error

  - validate_contrast: |
      All variant color combinations must meet WCAG AA (4.5:1) contrast.
      Check text-on-background for each variant:
        primary:   white on --color-primary-500 -> must be >= 4.5:1
        secondary: white on --color-secondary-500 -> must be >= 4.5:1
        outline:   --color-text-primary on transparent -> must be >= 4.5:1

  - validate_touch_targets: |
      Size variants must meet minimum touch target:
        sm: >= 32px (h-8) -- acceptable for desktop, warn for mobile-first
        md: >= 40px (h-10) -- meets 44px guideline with padding
        lg: >= 48px (h-12) -- exceeds guideline
```

## Standard Variant Dimensions by Component

| Component | variant | size | color | placement | orientation | Other |
|-----------|---------|------|-------|-----------|-------------|-------|
| Button | primary, secondary, outline, ghost, link | sm, md, lg, xl | -- | -- | -- | loading |
| IconButton | primary, secondary, outline, ghost | sm, md, lg | -- | -- | -- | icon |
| Card | elevated, outlined, filled | -- | -- | -- | -- | padding, interactive |
| FeatureCard | -- | -- | -- | -- | layout: vertical, horizontal | highlight |
| TestimonialCard | default, minimal, featured | -- | -- | -- | -- | -- |
| PricingCard | default, popular, enterprise | -- | -- | -- | -- | billing |
| Input | default, filled, flushed | sm, md, lg | -- | -- | -- | error, disabled |
| Textarea | default, filled | -- | -- | -- | -- | resize |
| Select | default, filled | sm, md, lg | -- | -- | -- | error, disabled |
| Checkbox | -- | sm, md, lg | -- | -- | -- | indeterminate |
| Switch | -- | sm, md, lg | -- | -- | -- | -- |
| Slider | -- | sm, md | -- | -- | horizontal, vertical | range |
| Radio | -- | sm, md, lg | -- | -- | -- | -- |
| Alert | info, success, warning, error | -- | -- | -- | -- | closable |
| Toast | info, success, warning, error | -- | -- | position | -- | duration |
| Badge | solid, subtle, outline | sm, md | semantic | -- | -- | -- |
| Tag | solid, subtle, outline | sm, md | semantic | -- | -- | closable |
| Spinner | -- | sm, md, lg, xl | semantic | -- | -- | -- |
| Progress | linear, circular | sm, md, lg | -- | -- | -- | indeterminate |
| Skeleton | text, circular, rectangular | -- | -- | -- | -- | animation |
| Navbar | solid, transparent, blur | -- | -- | -- | -- | sticky |
| Sidebar | full, compact, overlay | -- | -- | -- | -- | collapsible |
| Breadcrumb | -- | -- | -- | -- | -- | separator |
| Tabs | line, enclosed, pills | -- | -- | -- | horizontal, vertical | -- |
| Pagination | default, compact | sm, md | -- | -- | -- | -- |
| Container | -- | sm, md, lg, xl, full | -- | -- | -- | padding |
| Grid | -- | -- | -- | -- | -- | cols, gap |
| Stack | -- | -- | -- | -- | horizontal, vertical | gap, align |
| Divider | solid, dashed, dotted | -- | -- | -- | horizontal, vertical | -- |
| Section | default, highlighted, hero | -- | -- | -- | -- | padding |
| Table | simple, striped | sm, md | -- | -- | -- | sortable, selectable |
| List | unordered, ordered, description | -- | -- | -- | -- | spacing |
| Stat | default, card | -- | -- | -- | -- | trend |
| Modal | -- | sm, md, lg, xl, full | -- | -- | -- | scrollBehavior |
| Drawer | -- | sm, md, lg | -- | placement | -- | -- |
| Tooltip | -- | -- | -- | placement | -- | delay |
| Popover | -- | -- | -- | placement | -- | trigger |
| Dropdown | -- | -- | -- | placement | -- | trigger |
| Heading | -- | -- | -- | -- | -- | level, weight |
| Text | -- | xs, sm, md, lg, xl | -- | -- | -- | weight, as |
| Code | inline, block | -- | -- | -- | -- | language |
| Blockquote | default, accent, minimal | -- | -- | -- | -- | -- |
| Label | -- | sm, md | -- | -- | -- | required |

## Pre-Conditions

- [ ] Component exists as a `.tsx` file with basic structure
- [ ] tokens.css available with all required design tokens
- [ ] tailwind.config.ts generated with token theme extensions
- [ ] `class-variance-authority` installed as dependency

## Post-Conditions

- [ ] All variants expressed as props via cva (zero separate variant files)
- [ ] defaultVariants defined for every dimension
- [ ] compoundVariants defined where dimension intersections require overrides
- [ ] VariantProps type correctly inferred from cva definition
- [ ] Framer Motion animations adapt to relevant variant values
- [ ] All variant combinations pass contrast checks

## Acceptance Criteria

- [ ] Single component file per component (variants via props, not files)
- [ ] cva used for ALL variant management
- [ ] TypeScript catches invalid variant values at compile time
- [ ] defaultVariants ensure component works with zero props
- [ ] All variant classes use design tokens (no hardcoded values)
- [ ] Compound variants defined only where individual dimension union is insufficient
- [ ] Size variants meet minimum touch target guidelines
- [ ] Color variants meet WCAG AA contrast requirements
- [ ] Framer Motion animations adapt to placement/orientation variants

## Quality Gate
- Threshold: >70%
- All variant classes use design tokens (zero hardcoded color, font, or spacing values)
- TypeScript catches invalid variant values at compile time via VariantProps inference
- All color variant combinations meet WCAG AA contrast requirements (4.5:1 minimum)

---
*Design System Squad Task - component-builder*
