# Design System Squad - Tech Stack

## Core Technologies

### Runtime & Framework
- **Framework:** Next.js 15 (App Router, static export)
- **UI Library:** React 19
- **Language:** TypeScript 5.x (strict mode)
- **Build Target:** Static export (`output: 'export'` in next.config.ts)

### Design Tokens
- **Format:** W3C DTCG (Design Token Community Group) 2025.10
- **Build Tool:** Style Dictionary 4.x (token transformation pipeline)
- **Sync:** Tokens Studio (Figma plugin) for design-to-code sync
- **Schema Validation:** Custom JSON Schema for DTCG compliance

### Component Development
- **Output:** React/TypeScript components (.tsx)
- **Styling:** Tailwind CSS 4 + CSS Custom Properties (design tokens)
- **Variant Management:** class-variance-authority (cva) -- variants as props, not files
- **Class Merging:** clsx + tailwind-merge (via `cn()` utility)
- **Animation:** Framer Motion 11 (exclusive -- no GSAP, no Lottie, no CSS @keyframes)
- **Component Pattern:** forwardRef + named exports + VariantProps typing

### Animation Rules
- **Library:** Framer Motion 11 is the ONLY animation library allowed
- **Micro-interactions:** whileHover, whileTap (max 300ms)
- **Transitions:** AnimatePresence for mount/unmount (max 500ms)
- **Layout shifts:** layout prop for automatic layout animation
- **Physics:** Spring-based for interactive elements, eased for transitions
- **Accessibility:** ALWAYS respect prefers-reduced-motion

### CSS Architecture
- **Token Layer:** `styles/tokens.css` (CSS custom properties -- source of truth)
- **Tailwind Config:** `tailwind.config.ts` (theme extensions reference CSS vars)
- **Global Styles:** `styles/globals.css` (Tailwind base + token imports + resets)
- **TypeScript Access:** `lib/tokens.ts` (type-safe programmatic token access)
- **No SCSS:** Project uses Tailwind CSS exclusively, no preprocessor needed
- **No CSS Modules:** All styling via Tailwind utilities + CSS custom properties

### Testing
- **Unit/Integration:** Vitest + React Testing Library
- **Accessibility:** axe-core (automated a11y audit per component)
- **Visual Regression:** Playwright (screenshot comparisons)
- **Contrast:** WCAG AA (4.5:1 minimum) validated per color variant
- **Type Checking:** TypeScript strict mode (no `any`)

### Documentation
- **Component Docs:** Storybook 8 or dedicated Next.js pages with live previews
- **Live Examples:** Embedded React components with prop controls
- **API Reference:** Auto-generated from TypeScript interfaces and JSDoc

## Infrastructure

### Build Pipeline
- **Token Build:** W3C DTCG JSON -> Style Dictionary -> tokens.css + tailwind.config.ts + tokens.ts + globals.css
- **Component Build:** Next.js build with static export
- **Type Checking:** `tsc --noEmit` (zero errors required)
- **Linting:** ESLint with @typescript-eslint + eslint-plugin-jsx-a11y
- **Formatting:** Prettier with Tailwind CSS plugin (automatic class sorting)

### Package Distribution
- **Primary:** Static export (HTML/CSS/JS) via `next build && next export`
- **NPM Package:** `@{org}/design-system` (React components + types + tokens)
- **Token Package:** `@{org}/design-tokens` (CSS + Tailwind config + TypeScript constants)

### Quality Gates
- **axe-core:** Zero violations per component
- **TypeScript:** Zero errors in strict mode
- **Contrast Checker:** All color variant pairs >= 4.5:1 (AA)
- **Token Coverage:** 100% (no hardcoded color, font, or spacing values)
- **Bundle Size:** Per-component tree-shaking via named exports

## Dependencies

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "next": "^15.0.0",
    "framer-motion": "^11.0.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.6.0"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "tailwindcss": "^4.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "style-dictionary": "^4.0.0",
    "vitest": "^3.0.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/jest-dom": "^6.6.0",
    "axe-core": "^4.10.0",
    "@axe-core/react": "^4.10.0",
    "playwright": "^1.48.0",
    "eslint": "^9.0.0",
    "eslint-plugin-jsx-a11y": "^6.10.0",
    "@typescript-eslint/eslint-plugin": "^8.0.0",
    "prettier": "^3.4.0",
    "prettier-plugin-tailwindcss": "^0.6.0"
  }
}
```

## Token Pipeline Outputs

| Output | File | Purpose |
|--------|------|---------|
| CSS Custom Properties | `styles/tokens.css` | Browser-level token definitions (:root) |
| Tailwind Config | `tailwind.config.ts` | Theme extensions referencing CSS vars |
| TypeScript Constants | `lib/tokens.ts` | Type-safe programmatic access to tokens |
| Global Styles | `styles/globals.css` | Tailwind base + token imports + resets |

## Component Architecture

| Concern | Solution |
|---------|----------|
| Variant management | class-variance-authority (cva) |
| Class merging | cn() = clsx + tailwind-merge |
| Type safety | VariantProps + ComponentPropsWithoutRef |
| Ref forwarding | React.forwardRef on all components |
| Animation | Framer Motion (motion.*, AnimatePresence) |
| Accessibility | Semantic HTML + ARIA + keyboard handlers |
| Reduced motion | prefers-reduced-motion media query |
| Dark mode | CSS custom properties + data-theme attribute |

## File Organization

```
brand-book-project/
  app/
    components/
      ui/
        buttons/        # Button, IconButton
        cards/          # Card, FeatureCard, TestimonialCard, PricingCard
        forms/          # Input, Textarea, Select, Checkbox, Switch, Slider, Radio
        feedback/       # Alert, Toast, Badge, Tag, Spinner, Progress, Skeleton
        navigation/     # Navbar, Sidebar, Breadcrumb, Tabs, Pagination
        layout/         # Container, Grid, Stack, Divider, Section
        data/           # Table, List, Stat, ChartPlaceholder
        overlay/        # Modal, Drawer, Tooltip, Popover, Dropdown
        typography/     # Heading, Text, Code, Blockquote, Label
        index.ts        # Root barrel export
    layout.tsx
    page.tsx
  lib/
    utils.ts            # cn() utility
    tokens.ts           # TypeScript token constants
  styles/
    tokens.css          # CSS custom properties
    globals.css         # Tailwind + tokens + resets
  tailwind.config.ts    # Theme extension from tokens
  next.config.ts        # Static export config
  tsconfig.json
```

## Browser Support

| Browser | Version |
|---------|---------|
| Chrome | Last 2 versions |
| Safari | Last 2 versions |
| Firefox | Last 2 versions |
| Edge | Last 2 versions |

**CSS Baseline:** Custom Properties, Grid, Flexbox, `:focus-visible`, `color-mix()`, Container Queries, `@layer`.

## Prohibited Technologies

| Technology | Reason | Use Instead |
|------------|--------|-------------|
| GSAP | Unnecessary complexity, license concerns | Framer Motion |
| Lottie | Heavy runtime, not needed for UI components | Framer Motion |
| CSS @keyframes | Inconsistent with Framer Motion animation system | Framer Motion |
| SCSS/Sass | Tailwind CSS handles all utility needs | Tailwind CSS |
| CSS Modules | Conflicts with Tailwind utility-first approach | Tailwind CSS |
| Emotion/styled-components | CSS-in-JS overhead, not needed with Tailwind | Tailwind CSS + cva |
| Default exports | Prevents tree-shaking and refactoring | Named exports only |

---
*Design System Squad Config*
