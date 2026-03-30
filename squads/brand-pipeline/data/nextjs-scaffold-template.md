# Next.js Scaffold Template

Template for generating the Next.js brand book application structure. Used by Phase 0 (Scaffold) of the brand pipeline.

## Project Structure

```
{client}-brandbook/
  app/
    layout.tsx                          # Root layout: fonts, metadata, global providers
    page.tsx                            # Home/hero landing page
    globals.css                         # Tailwind v4 + CSS custom properties
    brandbook/
      layout.tsx                        # Brandbook sidebar navigation layout
      guidelines/
        page.tsx                        # Brand identity overview
        voice/
          page.tsx                      # Voice & tone guide
        manifesto/
          page.tsx                      # Brand manifesto
        positioning/
          page.tsx                      # Brand positioning
      foundations/
        page.tsx                        # Design tokens overview
        colors/
          page.tsx                      # Color palette & usage
        typography/
          page.tsx                      # Typography system
        spacing/
          page.tsx                      # Spacing & layout scale
      components/
        page.tsx                        # Component catalog index
        buttons/
          page.tsx                      # Button component demos
        cards/
          page.tsx                      # Card component demos
        forms/
          page.tsx                      # Form input component demos
        feedback/
          page.tsx                      # Alert, Toast, Badge demos
        tables/
          page.tsx                      # Table component demos
        [category]/
          page.tsx                      # Dynamic category page
      patterns/
        page.tsx                        # Patterns index
        motion/
          page.tsx                      # Animation system demos
        grids/
          page.tsx                      # Grid & layout patterns
        templates/
          page.tsx                      # Page template gallery
      showcase/
        page.tsx                        # Full showcase/demo page
  components/
    ui/                                 # Reusable UI components
      button.tsx
      card.tsx
      badge.tsx
      input.tsx
      select.tsx
      textarea.tsx
      toggle.tsx
      avatar.tsx
      tooltip.tsx
      alert.tsx
      table.tsx
      tabs.tsx
      index.ts                          # Barrel export
    motion/                             # Framer Motion animation components
      fade-in.tsx
      slide-up.tsx
      stagger-children.tsx
      page-transition.tsx
      hover-scale.tsx
      reveal-section.tsx
      parallax-layer.tsx
      count-up.tsx
      index.ts                          # Barrel export
    layout/                             # Layout components
      sidebar.tsx                       # Brandbook sidebar navigation
      header.tsx                        # Site header
      footer.tsx                        # Site footer
      breadcrumb.tsx                    # Breadcrumb navigation
      index.ts
    showcase/                           # Showcase/demo components
      hero-demo.tsx
      card-gallery.tsx
      color-swatch.tsx
      typography-sample.tsx
      component-preview.tsx
      index.ts
  lib/
    tokens.ts                           # Design tokens as TS constants
    animations.ts                       # Framer Motion variant presets
    utils.ts                            # Utility functions (cn, etc.)
  styles/
    tokens.css                          # CSS custom properties
  public/
    images/                             # Brand images (generated in Phase 4)
    assets/                             # Organized assets (generated in Phase 4)
    fonts/                              # Custom fonts (if any)
  next.config.js                        # Static export configuration
  tailwind.config.ts                    # Brand-specific Tailwind configuration
  postcss.config.mjs                    # PostCSS with Tailwind v4 plugin
  package.json                          # Dependencies and scripts
  tsconfig.json                         # TypeScript configuration
  .eslintrc.json                        # ESLint configuration
```

## package.json

```json
{
  "name": "{CLIENT_NAME}-brandbook",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "export": "next build",
    "preview": "npx serve out",
    "clean": "rm -rf .next out node_modules"
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
  },
  "engines": {
    "node": ">=20.0.0"
  }
}
```

## next.config.js

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Trailing slash ensures each route gets its own directory with index.html
  trailingSlash: true,
}

module.exports = nextConfig
```

## tsconfig.json

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
    "plugins": [
      { "name": "next" }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

## postcss.config.mjs

```js
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

## tailwind.config.ts

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand colors -- populated from tokens.json during Phase 3
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        foreground: 'var(--color-text)',
        muted: 'var(--color-text-muted)',
      },
      fontFamily: {
        heading: 'var(--font-heading)',
        body: 'var(--font-body)',
        mono: 'var(--font-mono)',
      },
      spacing: {
        // Brand spacing scale -- populated from tokens.json during Phase 3
        'brand-xs': 'var(--space-xs)',
        'brand-sm': 'var(--space-sm)',
        'brand-md': 'var(--space-md)',
        'brand-lg': 'var(--space-lg)',
        'brand-xl': 'var(--space-xl)',
        'brand-2xl': 'var(--space-2xl)',
        'brand-3xl': 'var(--space-3xl)',
      },
      borderRadius: {
        'brand-sm': 'var(--radius-sm)',
        'brand-md': 'var(--radius-md)',
        'brand-lg': 'var(--radius-lg)',
        'brand-full': 'var(--radius-full)',
      },
      transitionTimingFunction: {
        'brand': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'brand-bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      transitionDuration: {
        'brand-fast': '150ms',
        'brand-normal': '300ms',
        'brand-slow': '500ms',
      },
    },
  },
  plugins: [],
}

export default config
```

## app/globals.css

```css
@import "tailwindcss";

/*
 * Brand Design Tokens
 * Auto-populated by Phase 3 (design-system) from discovery/tokens.json
 * Do not edit manually -- changes will be overwritten.
 */
:root {
  /* === Colors === */
  --color-primary: #000000;
  --color-secondary: #666666;
  --color-accent: #0066ff;
  --color-background: #ffffff;
  --color-surface: #f5f5f5;
  --color-text: #111111;
  --color-text-muted: #666666;
  --color-border: #e5e5e5;
  --color-error: #ef4444;
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-info: #3b82f6;

  /* === Typography === */
  --font-heading: system-ui, -apple-system, sans-serif;
  --font-body: system-ui, -apple-system, sans-serif;
  --font-mono: 'SF Mono', 'Fira Code', monospace;

  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;
  --text-5xl: 3rem;

  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;

  --tracking-tight: -0.025em;
  --tracking-normal: 0;
  --tracking-wide: 0.025em;

  /* === Spacing === */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;
  --space-3xl: 4rem;

  /* === Border Radius === */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
  --radius-full: 9999px;

  /* === Shadows === */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);

  /* === Motion === */
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* Dark mode overrides */
.dark {
  --color-background: #0a0a0a;
  --color-surface: #1a1a1a;
  --color-text: #fafafa;
  --color-text-muted: #a0a0a0;
  --color-border: #2a2a2a;
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.3);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.4);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.5);
}

/* === Base Styles === */
html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--color-background);
  color: var(--color-text);
  font-family: var(--font-body);
  line-height: var(--leading-normal);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* === Focus Styles (Accessibility) === */
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

/* === Selection === */
::selection {
  background-color: var(--color-accent);
  color: var(--color-background);
}
```

## app/layout.tsx

```tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '{CLIENT_NAME} Brand Book',
  description: 'Design system and brand identity for {CLIENT_NAME}',
  openGraph: {
    title: '{CLIENT_NAME} Brand Book',
    description: 'Design system and brand identity for {CLIENT_NAME}',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  )
}
```

## app/page.tsx

```tsx
import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-4xl text-center">
        <h1 className="text-5xl font-heading font-bold tracking-tight mb-6">
          {CLIENT_NAME}
        </h1>
        <p className="text-xl text-muted mb-12 max-w-2xl mx-auto">
          Brand identity, design system, and component library.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/brandbook/guidelines"
            className="px-6 py-3 bg-primary text-background rounded-brand-md font-medium hover:opacity-90 transition-opacity"
          >
            Guidelines
          </Link>
          <Link
            href="/brandbook/foundations"
            className="px-6 py-3 bg-surface border border-[var(--color-border)] rounded-brand-md font-medium hover:bg-primary hover:text-background transition-colors"
          >
            Foundations
          </Link>
          <Link
            href="/brandbook/components"
            className="px-6 py-3 bg-surface border border-[var(--color-border)] rounded-brand-md font-medium hover:bg-primary hover:text-background transition-colors"
          >
            Components
          </Link>
          <Link
            href="/brandbook/patterns"
            className="px-6 py-3 bg-surface border border-[var(--color-border)] rounded-brand-md font-medium hover:bg-primary hover:text-background transition-colors"
          >
            Patterns
          </Link>
        </div>
      </div>
    </main>
  )
}
```

## app/brandbook/layout.tsx

```tsx
import Link from 'next/link'

const navigation = [
  {
    title: 'Guidelines',
    href: '/brandbook/guidelines',
    children: [
      { title: 'Voice & Tone', href: '/brandbook/guidelines/voice' },
      { title: 'Manifesto', href: '/brandbook/guidelines/manifesto' },
      { title: 'Positioning', href: '/brandbook/guidelines/positioning' },
    ],
  },
  {
    title: 'Foundations',
    href: '/brandbook/foundations',
    children: [
      { title: 'Colors', href: '/brandbook/foundations/colors' },
      { title: 'Typography', href: '/brandbook/foundations/typography' },
      { title: 'Spacing', href: '/brandbook/foundations/spacing' },
    ],
  },
  {
    title: 'Components',
    href: '/brandbook/components',
    children: [
      { title: 'Buttons', href: '/brandbook/components/buttons' },
      { title: 'Cards', href: '/brandbook/components/cards' },
      { title: 'Forms', href: '/brandbook/components/forms' },
      { title: 'Feedback', href: '/brandbook/components/feedback' },
      { title: 'Tables', href: '/brandbook/components/tables' },
    ],
  },
  {
    title: 'Patterns',
    href: '/brandbook/patterns',
    children: [
      { title: 'Motion', href: '/brandbook/patterns/motion' },
      { title: 'Grids', href: '/brandbook/patterns/grids' },
      { title: 'Templates', href: '/brandbook/patterns/templates' },
    ],
  },
  {
    title: 'Showcase',
    href: '/brandbook/showcase',
    children: [],
  },
]

export default function BrandbookLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-[var(--color-border)] bg-surface p-6 overflow-y-auto sticky top-0 h-screen">
        <Link
          href="/"
          className="block text-lg font-heading font-bold mb-8 hover:text-accent transition-colors"
        >
          {CLIENT_NAME}
        </Link>
        <nav className="space-y-6">
          {navigation.map((section) => (
            <div key={section.href}>
              <Link
                href={section.href}
                className="block text-sm font-semibold uppercase tracking-wide text-muted hover:text-foreground transition-colors mb-2"
              >
                {section.title}
              </Link>
              {section.children.length > 0 && (
                <ul className="space-y-1 ml-2">
                  {section.children.map((child) => (
                    <li key={child.href}>
                      <Link
                        href={child.href}
                        className="block text-sm py-1 text-muted hover:text-foreground transition-colors"
                      >
                        {child.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 max-w-5xl">
        {children}
      </main>
    </div>
  )
}
```

## Placeholder Page Template

Each placeholder page follows this structure (content populated in Phases 3-5):

```tsx
// app/brandbook/{pillar}/page.tsx
export default function {PillarName}Page() {
  return (
    <div>
      <h1 className="text-4xl font-heading font-bold mb-4">{Pillar Title}</h1>
      <p className="text-muted text-lg mb-8">
        {Pillar description placeholder -- populated during pipeline execution.}
      </p>
      <div className="grid gap-6">
        {/* Content populated by Phase 3/4/5 */}
      </div>
    </div>
  )
}
```

## lib/tokens.ts

```typescript
/**
 * Design Tokens -- TypeScript Constants
 *
 * Auto-generated by Phase 3 (design-system) from discovery/tokens.json
 * Do not edit manually. Re-run the pipeline to update.
 */

export const colors = {
  primary: '#000000',
  secondary: '#666666',
  accent: '#0066ff',
  background: '#ffffff',
  surface: '#f5f5f5',
  text: '#111111',
  textMuted: '#666666',
  border: '#e5e5e5',
  error: '#ef4444',
  success: '#22c55e',
  warning: '#f59e0b',
  info: '#3b82f6',
} as const

export const typography = {
  fontHeading: 'system-ui, -apple-system, sans-serif',
  fontBody: 'system-ui, -apple-system, sans-serif',
  fontMono: "'SF Mono', 'Fira Code', monospace",
  sizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
  tracking: {
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
  },
} as const

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
} as const

export const radii = {
  sm: '0.25rem',
  md: '0.5rem',
  lg: '1rem',
  full: '9999px',
} as const

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
} as const

export const motion = {
  durationFast: '150ms',
  durationNormal: '300ms',
  durationSlow: '500ms',
  easeDefault: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeBounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const
```

## lib/animations.ts

```typescript
/**
 * Framer Motion Animation Presets
 *
 * Auto-generated by Phase 4 (visual) with brand-specific timing.
 * Timing curves and durations are derived from brand personality.
 */

import type { Variants, Transition } from 'framer-motion'

// === Base Transitions ===

export const defaultTransition: Transition = {
  duration: 0.3,
  ease: [0.4, 0, 0.2, 1],
}

export const bounceTransition: Transition = {
  duration: 0.5,
  ease: [0.68, -0.55, 0.265, 1.55],
}

export const springTransition: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
}

// === Page & Route Transitions ===

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2 },
  },
}

// === Entrance Animations ===

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4 },
  },
}

export const slideInFromLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  },
}

export const slideInFromRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  },
}

// === Container & Stagger ===

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  },
}

// === Interactive ===

export const scaleOnHover: Variants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
}

export const liftOnHover: Variants = {
  rest: { y: 0, boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)' },
  hover: {
    y: -4,
    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    transition: { duration: 0.2 },
  },
}

// === Scroll-Triggered ===

export const revealOnScroll: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
  },
}

export const parallaxUp: Variants = {
  hidden: { y: 50 },
  visible: {
    y: 0,
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
  },
}

// === Utility ===

export const countUp = {
  duration: 1.5,
  ease: [0.4, 0, 0.2, 1] as const,
}
```

## lib/utils.ts

```typescript
/**
 * Utility functions for the brand book application.
 */

import { type ClassValue, clsx } from 'clsx'

/**
 * Conditional class name merge utility.
 * Combines clsx for conditional classes.
 *
 * Usage:
 *   cn('base-class', condition && 'conditional-class', className)
 *
 * Note: If clsx is not installed, this falls back to simple array join.
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs)
}
```

**Note:** `clsx` is intentionally NOT in the default `package.json` dependencies. If the pipeline needs `cn()` with `clsx`, the `component-build.md` task should add it during Phase 3. Otherwise, a simpler implementation without `clsx` can be used:

```typescript
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}
```

## .eslintrc.json

```json
{
  "extends": "next/core-web-vitals"
}
```

## Component Template (used by Phase 3)

Each UI component follows this template:

```tsx
'use client'

import { forwardRef, type ComponentPropsWithoutRef } from 'react'

// --- Types ---

export interface {ComponentName}Props extends ComponentPropsWithoutRef<'{element}'> {
  /** Visual variant */
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost'
  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
}

// --- Styles ---

const baseStyles = '...'

const variantStyles: Record<NonNullable<{ComponentName}Props['variant']>, string> = {
  default: '...',
  primary: '...',
  secondary: '...',
  outline: '...',
  ghost: '...',
}

const sizeStyles: Record<NonNullable<{ComponentName}Props['size']>, string> = {
  sm: '...',
  md: '...',
  lg: '...',
}

// --- Component ---

export const {ComponentName} = forwardRef<HTML{Element}Element, {ComponentName}Props>(
  function {ComponentName}({ variant = 'default', size = 'md', className, children, ...props }, ref) {
    return (
      <{element}
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className ?? ''}`}
        {...props}
      >
        {children}
      </{element}>
    )
  }
)
```

## Motion Component Template (used by Phase 4)

Each motion component follows this template:

```tsx
'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, type ReactNode } from 'react'
import { fadeInUp } from '@/lib/animations'

export interface {MotionName}Props {
  children: ReactNode
  className?: string
  /** Delay before animation starts (seconds) */
  delay?: number
  /** Whether to animate only once */
  once?: boolean
}

export function {MotionName}({
  children,
  className,
  delay = 0,
  once = true,
}: {MotionName}Props) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      variants={fadeInUp}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
```

## Dynamic Category Page (components/[category]/page.tsx)

```tsx
import { notFound } from 'next/navigation'

// Define valid categories for static generation
const validCategories = [
  'buttons', 'cards', 'forms', 'feedback', 'tables',
  'states', 'lists', 'charts', 'sections', 'advanced', 'effects',
]

export function generateStaticParams() {
  return validCategories.map((category) => ({ category }))
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params

  if (!validCategories.includes(category)) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-4xl font-heading font-bold mb-4 capitalize">
        {category}
      </h1>
      <p className="text-muted text-lg mb-8">
        Component documentation for {category}.
      </p>
      <div className="grid gap-6">
        {/* Components rendered here by Phase 3 */}
      </div>
    </div>
  )
}
```

## Scaffold Validation Checklist

After scaffold generation, verify:

- [ ] `package.json` exists and `JSON.parse()` succeeds
- [ ] `next.config.js` contains `output: 'export'`
- [ ] `tsconfig.json` has `paths` with `@/*`
- [ ] `postcss.config.mjs` exists
- [ ] `app/layout.tsx` exists
- [ ] `app/page.tsx` exists
- [ ] `app/globals.css` contains `@import "tailwindcss"`
- [ ] `app/brandbook/layout.tsx` exists
- [ ] `app/brandbook/guidelines/page.tsx` exists
- [ ] `app/brandbook/foundations/page.tsx` exists
- [ ] `app/brandbook/components/page.tsx` exists
- [ ] `app/brandbook/patterns/page.tsx` exists
- [ ] `components/ui/` directory exists
- [ ] `components/motion/` directory exists
- [ ] `components/layout/` directory exists
- [ ] `components/showcase/` directory exists
- [ ] `lib/tokens.ts` exists
- [ ] `lib/animations.ts` exists
- [ ] `public/images/` directory exists
- [ ] `npm install` exits with code 0
- [ ] `npx tsc --noEmit` exits with code 0 (scaffold compiles)

---
*Brand Pipeline Scaffold Template v2.0 -- Next.js 15 + React 19 + Tailwind 4 + Framer Motion 11*
