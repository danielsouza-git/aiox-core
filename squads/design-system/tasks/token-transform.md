# token-transform

```yaml
task: tokenTransform()
agent: token-transformer
squad: design-system

inputs:
  - name: tokens_source
    type: json
    required: true
    description: W3C DTCG tokens file (tokens.json) with $value, $type, $description
  - name: palette_source
    type: json
    required: false
    description: Palette definition file (palette.json) with color scales
  - name: typography_source
    type: json
    required: false
    description: Typography tokens file (typography.json) with font families, sizes, weights, line heights

outputs:
  - name: tokens_css
    type: css
    destination: styles/tokens.css
    description: CSS custom properties for all design tokens
  - name: tailwind_config
    type: typescript
    destination: tailwind.config.ts
    description: Tailwind CSS 4 config with theme extension from tokens
  - name: tokens_ts
    type: typescript
    destination: lib/tokens.ts
    description: TypeScript constants for programmatic token access
  - name: globals_css
    type: css
    destination: styles/globals.css
    description: Tailwind base directives + token imports + resets
  - name: transform_report
    type: markdown
    destination: docs/token-transform-report.md
    description: Report with token counts, warnings, and verification results

tools:
  - style-dictionary
```

## Purpose

Transform W3C DTCG design tokens into four platform outputs for a Next.js 15 + Tailwind CSS 4 project:

1. **`styles/tokens.css`** -- CSS custom properties (the single source of truth for the browser)
2. **`tailwind.config.ts`** -- Tailwind theme extension that references the CSS custom properties
3. **`lib/tokens.ts`** -- TypeScript constants for programmatic access (JS-side token values)
4. **`styles/globals.css`** -- Tailwind base layer + token imports + CSS resets

All four outputs derive from the same token source files. No output contradicts another.

## Token Source Schema (W3C DTCG)

```json
{
  "color": {
    "primary": {
      "50":  { "$value": "#eff6ff", "$type": "color", "$description": "Lightest primary" },
      "500": { "$value": "#2563eb", "$type": "color", "$description": "Base primary" },
      "900": { "$value": "#1e3a5f", "$type": "color", "$description": "Darkest primary" }
    },
    "semantic": {
      "text-primary":    { "$value": "{color.neutral.900}", "$type": "color" },
      "surface-primary": { "$value": "{color.neutral.50}",  "$type": "color" },
      "focus-ring":      { "$value": "{color.primary.500}", "$type": "color" },
      "border-default":  { "$value": "{color.neutral.200}", "$type": "color" }
    }
  },
  "spacing": {
    "1": { "$value": "0.25rem", "$type": "dimension" },
    "2": { "$value": "0.5rem",  "$type": "dimension" },
    "3": { "$value": "0.75rem", "$type": "dimension" },
    "4": { "$value": "1rem",    "$type": "dimension" }
  },
  "typography": {
    "font-family": {
      "sans":  { "$value": "'Inter', system-ui, sans-serif", "$type": "fontFamily" },
      "mono":  { "$value": "'JetBrains Mono', monospace",    "$type": "fontFamily" }
    },
    "font-size": {
      "xs":  { "$value": "0.75rem",  "$type": "dimension" },
      "sm":  { "$value": "0.875rem", "$type": "dimension" },
      "md":  { "$value": "1rem",     "$type": "dimension" },
      "lg":  { "$value": "1.125rem", "$type": "dimension" },
      "xl":  { "$value": "1.25rem",  "$type": "dimension" },
      "2xl": { "$value": "1.5rem",   "$type": "dimension" },
      "3xl": { "$value": "1.875rem", "$type": "dimension" },
      "4xl": { "$value": "2.25rem",  "$type": "dimension" }
    }
  },
  "radius": {
    "sm":   { "$value": "0.25rem", "$type": "dimension" },
    "md":   { "$value": "0.375rem","$type": "dimension" },
    "lg":   { "$value": "0.5rem",  "$type": "dimension" },
    "xl":   { "$value": "0.75rem", "$type": "dimension" },
    "full": { "$value": "9999px",  "$type": "dimension" }
  },
  "shadow": {
    "sm": { "$value": "0 1px 2px 0 rgb(0 0 0 / 0.05)", "$type": "shadow" },
    "md": { "$value": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)", "$type": "shadow" },
    "lg": { "$value": "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)", "$type": "shadow" }
  }
}
```

## Workflow

### Phase 1: Validation

```yaml
steps:
  - validate_format: |
      Ensure all token entries follow W3C DTCG spec:
        - Every leaf has $value (required)
        - Every leaf has $type (required)
        - $description is optional but recommended
        - No leaf has extra unknown keys
  - validate_references: |
      Check all token references resolve correctly:
        - {color.primary.500} must point to an existing token
        - No circular references
        - Maximum reference depth: 3 levels
  - validate_types: |
      Ensure $type matches $value format:
        - color: hex (#RRGGBB), rgb(), hsl(), oklch()
        - dimension: number + unit (rem, px, em)
        - fontFamily: quoted string or comma-separated list
        - shadow: CSS box-shadow syntax
        - number: plain number (for line-height, opacity)
  - report_issues: |
      List all validation errors and warnings.
      Errors block the build. Warnings are advisory.
```

### Phase 2: Generate `styles/tokens.css`

```yaml
steps:
  - generate_root: |
      Output all tokens as CSS custom properties under :root.
      Naming convention: --{category}-{group}-{name}
      Examples:
        --color-primary-500: #2563eb;
        --color-text-primary: #1a1a2e;
        --spacing-4: 1rem;
        --font-family-sans: 'Inter', system-ui, sans-serif;
        --font-size-md: 1rem;
        --radius-md: 0.375rem;
        --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  - generate_dark_theme: |
      If dark theme tokens exist, output under @media (prefers-color-scheme: dark)
      and also under [data-theme="dark"] for manual toggle:
        @media (prefers-color-scheme: dark) {
          :root { --color-text-primary: #f0f0f0; ... }
        }
        [data-theme="dark"] { --color-text-primary: #f0f0f0; ... }
  - resolve_references: |
      Inline-resolve all token references to their final CSS values.
      The CSS file must not contain {token.reference} syntax.
      Each custom property must have a concrete value.
  - organize_sections: |
      Group custom properties by category with CSS comments:
        /* ===== Colors ===== */
        /* ===== Typography ===== */
        /* ===== Spacing ===== */
        /* ===== Radius ===== */
        /* ===== Shadows ===== */
```

**Output example:**

```css
/* styles/tokens.css -- Generated from design tokens. Do not edit manually. */

:root {
  /* ===== Colors: Palette ===== */
  --color-primary-50: #eff6ff;
  --color-primary-500: #2563eb;
  --color-primary-600: #2252c9;
  --color-primary-700: #1d40a7;
  --color-primary-900: #1e3a5f;

  /* ===== Colors: Semantic ===== */
  --color-text-primary: #1a1a2e;
  --color-text-secondary: #4a4a68;
  --color-surface-primary: #fafafa;
  --color-surface-hover: #f0f0f5;
  --color-border-default: #e2e2ea;
  --color-focus-ring: #2563eb;

  /* ===== Typography ===== */
  --font-family-sans: 'Inter', system-ui, sans-serif;
  --font-family-mono: 'JetBrains Mono', monospace;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-md: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;

  /* ===== Spacing ===== */
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-3: 0.75rem;
  --spacing-4: 1rem;
  --spacing-6: 1.5rem;
  --spacing-8: 2rem;
  --spacing-12: 3rem;
  --spacing-16: 4rem;

  /* ===== Radius ===== */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-full: 9999px;

  /* ===== Shadows ===== */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}
```

### Phase 3: Generate `tailwind.config.ts`

```yaml
steps:
  - generate_config: |
      Create a Tailwind CSS 4 config that extends the theme using
      CSS custom properties from tokens.css.
      IMPORTANT: Tailwind values reference var(--token), not hardcoded values.
      This ensures a single source of truth: change tokens.css, everything updates.
  - map_colors: |
      Map color tokens to Tailwind color scale:
        colors: {
          primary: {
            50:  'var(--color-primary-50)',
            500: 'var(--color-primary-500)',
            ...
          },
          // Semantic aliases
          text: {
            primary: 'var(--color-text-primary)',
            secondary: 'var(--color-text-secondary)',
          },
          surface: {
            primary: 'var(--color-surface-primary)',
            hover: 'var(--color-surface-hover)',
          },
        }
  - map_typography: |
      Map font tokens:
        fontFamily: {
          sans: 'var(--font-family-sans)',
          mono: 'var(--font-family-mono)',
        },
        fontSize: {
          xs: 'var(--font-size-xs)',
          sm: 'var(--font-size-sm)',
          ...
        }
  - map_spacing: |
      Map spacing tokens:
        spacing: {
          1: 'var(--spacing-1)',
          2: 'var(--spacing-2)',
          ...
        }
  - map_radius_shadows: |
      Map radius and shadow tokens:
        borderRadius: {
          sm: 'var(--radius-sm)',
          md: 'var(--radius-md)',
          ...
        },
        boxShadow: {
          sm: 'var(--shadow-sm)',
          md: 'var(--shadow-md)',
          ...
        }
```

**Output example:**

```typescript
// tailwind.config.ts -- Generated from design tokens. Do not edit manually.

import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          200: 'var(--color-primary-200)',
          300: 'var(--color-primary-300)',
          400: 'var(--color-primary-400)',
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary-700)',
          800: 'var(--color-primary-800)',
          900: 'var(--color-primary-900)',
        },
        secondary: {
          // ... same pattern
        },
        text: {
          primary:   'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted:     'var(--color-text-muted)',
        },
        surface: {
          primary: 'var(--color-surface-primary)',
          hover:   'var(--color-surface-hover)',
          active:  'var(--color-surface-active)',
        },
        border: {
          DEFAULT: 'var(--color-border-default)',
        },
        focus: {
          ring: 'var(--color-focus-ring)',
        },
      },
      fontFamily: {
        sans: 'var(--font-family-sans)',
        mono: 'var(--font-family-mono)',
      },
      fontSize: {
        xs:  'var(--font-size-xs)',
        sm:  'var(--font-size-sm)',
        base:'var(--font-size-md)',
        lg:  'var(--font-size-lg)',
        xl:  'var(--font-size-xl)',
        '2xl': 'var(--font-size-2xl)',
        '3xl': 'var(--font-size-3xl)',
        '4xl': 'var(--font-size-4xl)',
      },
      spacing: {
        1:  'var(--spacing-1)',
        2:  'var(--spacing-2)',
        3:  'var(--spacing-3)',
        4:  'var(--spacing-4)',
        6:  'var(--spacing-6)',
        8:  'var(--spacing-8)',
        12: 'var(--spacing-12)',
        16: 'var(--spacing-16)',
      },
      borderRadius: {
        sm:   'var(--radius-sm)',
        md:   'var(--radius-md)',
        lg:   'var(--radius-lg)',
        xl:   'var(--radius-xl)',
        full: 'var(--radius-full)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
    },
  },
  plugins: [],
}

export default config
```

### Phase 4: Generate `lib/tokens.ts`

```yaml
steps:
  - generate_constants: |
      Export TypeScript constants that mirror the CSS custom properties.
      Organized as nested readonly objects for type-safe programmatic access.
      Values are the CSS variable references (not resolved values) so they
      stay in sync with the CSS layer.
  - generate_type_definitions: |
      Export union types for each token category:
        type ColorToken = 'primary-50' | 'primary-500' | ...
        type SpacingToken = '1' | '2' | '3' | '4' | ...
        type RadiusToken = 'sm' | 'md' | 'lg' | ...
  - generate_utility_functions: |
      Export helper functions:
        token(path: string): string  -- returns var(--{path})
        resolveToken(path: string): string  -- returns computed value at runtime
```

**Output example:**

```typescript
// lib/tokens.ts -- Generated from design tokens. Do not edit manually.

export const tokens = {
  color: {
    primary: {
      50:  'var(--color-primary-50)',
      500: 'var(--color-primary-500)',
      600: 'var(--color-primary-600)',
      700: 'var(--color-primary-700)',
      900: 'var(--color-primary-900)',
    },
    text: {
      primary:   'var(--color-text-primary)',
      secondary: 'var(--color-text-secondary)',
    },
    surface: {
      primary: 'var(--color-surface-primary)',
      hover:   'var(--color-surface-hover)',
    },
    border: {
      default: 'var(--color-border-default)',
    },
    focus: {
      ring: 'var(--color-focus-ring)',
    },
  },
  spacing: {
    1:  'var(--spacing-1)',
    2:  'var(--spacing-2)',
    3:  'var(--spacing-3)',
    4:  'var(--spacing-4)',
    6:  'var(--spacing-6)',
    8:  'var(--spacing-8)',
    12: 'var(--spacing-12)',
    16: 'var(--spacing-16)',
  },
  typography: {
    fontFamily: {
      sans: 'var(--font-family-sans)',
      mono: 'var(--font-family-mono)',
    },
    fontSize: {
      xs:  'var(--font-size-xs)',
      sm:  'var(--font-size-sm)',
      md:  'var(--font-size-md)',
      lg:  'var(--font-size-lg)',
      xl:  'var(--font-size-xl)',
      '2xl': 'var(--font-size-2xl)',
      '3xl': 'var(--font-size-3xl)',
      '4xl': 'var(--font-size-4xl)',
    },
  },
  radius: {
    sm:   'var(--radius-sm)',
    md:   'var(--radius-md)',
    lg:   'var(--radius-lg)',
    xl:   'var(--radius-xl)',
    full: 'var(--radius-full)',
  },
  shadow: {
    sm: 'var(--shadow-sm)',
    md: 'var(--shadow-md)',
    lg: 'var(--shadow-lg)',
  },
} as const

// ---------------------------------------------------------------------------
// Type Definitions
// ---------------------------------------------------------------------------
export type ColorToken = keyof typeof tokens.color.primary
export type SemanticColorToken = keyof typeof tokens.color.text
export type SpacingToken = keyof typeof tokens.spacing
export type FontSizeToken = keyof typeof tokens.typography.fontSize
export type RadiusToken = keyof typeof tokens.radius
export type ShadowToken = keyof typeof tokens.shadow

// ---------------------------------------------------------------------------
// Utility Functions
// ---------------------------------------------------------------------------

/** Returns CSS variable reference: token('color-primary-500') -> 'var(--color-primary-500)' */
export function token(path: string): string {
  return `var(--${path})`
}

/** Resolves a CSS custom property value at runtime (client-only) */
export function resolveToken(path: string): string {
  if (typeof window === 'undefined') return ''
  return getComputedStyle(document.documentElement).getPropertyValue(`--${path}`).trim()
}
```

### Phase 5: Generate `styles/globals.css`

```yaml
steps:
  - generate_imports: |
      Import Tailwind CSS 4 base, components, utilities layers.
      Import tokens.css for custom property definitions.
  - generate_resets: |
      Add minimal CSS resets within the Tailwind base layer:
        - Box-sizing: border-box on all elements
        - Remove default margins
        - Set body defaults (font-family, color, background from tokens)
        - Smooth scrolling
        - Antialiased text rendering
  - generate_base_styles: |
      Set global defaults that reference tokens:
        - body font-family from --font-family-sans
        - body color from --color-text-primary
        - body background from --color-surface-primary
        - Selection color
        - Scrollbar styling (optional)
```

**Output example:**

```css
/* styles/globals.css -- Global styles for the brand book. Do not edit token values here. */

@import 'tailwindcss';
@import './tokens.css';

/* ===== Base Layer ===== */
@layer base {
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
    -webkit-text-size-adjust: 100%;
  }

  body {
    font-family: var(--font-family-sans);
    font-size: var(--font-size-md);
    line-height: 1.6;
    color: var(--color-text-primary);
    background-color: var(--color-surface-primary);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  ::selection {
    background-color: var(--color-primary-500);
    color: white;
  }

  :focus-visible {
    outline: 2px solid var(--color-focus-ring);
    outline-offset: 2px;
  }

  /* Reduced motion preference */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
}
```

### Phase 6: Generate Transform Report

```yaml
steps:
  - count_tokens: |
      Count tokens per category and per type:
        - Total tokens
        - Colors (palette + semantic)
        - Typography (families, sizes, weights, line heights)
        - Spacing
        - Radius
        - Shadows
  - list_warnings: |
      Document any non-blocking issues:
        - Unused tokens (defined but never referenced)
        - Missing descriptions
        - Unusual value formats
  - verify_completeness: |
      Confirm all source tokens appear in all four outputs.
      Flag any token missing from any output.
  - verify_consistency: |
      Confirm Tailwind config values match CSS custom properties.
      Confirm TypeScript constants match CSS custom properties.
      Confirm globals.css imports tokens.css.
```

## Pre-Conditions

- [ ] W3C DTCG tokens.json exists and is valid JSON
- [ ] palette.json exists (optional, merged into tokens.json color category)
- [ ] typography.json exists (optional, merged into tokens.json typography category)

## Post-Conditions

- [ ] `styles/tokens.css` generated with all CSS custom properties
- [ ] `tailwind.config.ts` generated with theme extensions referencing CSS variables
- [ ] `lib/tokens.ts` generated with TypeScript constants and utility functions
- [ ] `styles/globals.css` generated with Tailwind imports + base styles
- [ ] `docs/token-transform-report.md` generated with stats and verification
- [ ] All token references resolved (no unresolved `{token.ref}` in any output)
- [ ] Zero hardcoded values in tailwind.config.ts (all reference `var(--...)`)

## Acceptance Criteria

- [ ] CSS output uses `--kebab-case` naming convention
- [ ] Tailwind config references CSS variables, not hardcoded values
- [ ] TypeScript constants provide type-safe access to all tokens
- [ ] globals.css imports Tailwind + tokens and sets body defaults from tokens
- [ ] All four outputs are consistent (same tokens, same names)
- [ ] Dark theme supported via `prefers-color-scheme` and `data-theme` attribute
- [ ] Transform report documents token count per category and any issues
- [ ] No SCSS output (removed -- project uses Tailwind, not SCSS)

## Quality Gate
- Threshold: >70%
- Valid CSS output with all custom properties under :root using --kebab-case naming
- Tailwind config references CSS variables exclusively (zero hardcoded values)
- All four outputs (tokens.css, tailwind.config.ts, tokens.ts, globals.css) are consistent

---
*Design System Squad Task - token-transformer*
