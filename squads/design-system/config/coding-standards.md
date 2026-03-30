# Design System Squad - Coding Standards

## Overview

Standards for all component code, token files, and documentation produced by the Design System Squad. Every deliverable must be token-driven, accessible, and portable.

## General Principles

1. **Token-Driven** - Every visual value comes from design tokens, never hardcoded
2. **Accessibility First** - WCAG 2.2 AA is the minimum standard
3. **Progressive Enhancement** - Components must work without JavaScript
4. **Composable** - Components compose together, not depend on each other

---

## HTML Standards

### Semantic Structure
```html
<!-- Use semantic elements -->
<button class="btn" type="button" data-variant="primary" data-size="md">
  <svg class="btn__icon" aria-hidden="true" focusable="false">...</svg>
  <span class="btn__label">Save changes</span>
</button>

<!-- NOT this -->
<div class="btn" onclick="save()">
  <img src="icon.png">
  Save changes
</div>
```

### Conventions
- Use semantic HTML5 elements (`button`, `input`, `nav`, `dialog`, `details`)
- `data-*` attributes for variant control (`data-size`, `data-variant`, `data-state`)
- ARIA attributes only when HTML semantics are insufficient
- One component per file (component-name.html)

### Accessibility Requirements
- All interactive elements are focusable
- All images have `alt` attributes (empty string for decorative)
- All form inputs have associated `<label>` elements
- All custom widgets have appropriate ARIA roles and states
- `aria-hidden="true"` on decorative icons

### Forbidden
- `<div>` for interactive elements (use `<button>`, `<a>`, `<input>`)
- Inline event handlers (`onclick="..."`)
- `tabindex` values greater than 0
- `<img>` without `alt` attribute

---

## CSS Standards

### Token Integration
```css
/* Always reference tokens */
.card {
  background: var(--color-surface-primary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  padding: var(--spacing-4);
  box-shadow: var(--shadow-sm);
  font-family: var(--font-family-sans);
  font-size: var(--font-size-md);
  line-height: var(--line-height-normal);
}

/* NEVER hardcode values */
.card-bad {
  background: #ffffff;      /* hardcoded */
  color: #333333;           /* hardcoded */
  border-radius: 8px;       /* hardcoded */
  padding: 16px;            /* hardcoded */
  font-size: 14px;          /* hardcoded */
}
```

### Naming Methodology: BEM
```css
/* Block */
.card { }

/* Element */
.card__header { }
.card__body { }
.card__footer { }

/* Modifier via data attributes */
.card[data-variant="elevated"] { }
.card[data-size="sm"] { }
```

### States
```css
/* Interactive states */
.btn:hover { }
.btn:focus-visible {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
}
.btn:active { }
.btn:disabled,
.btn[aria-disabled="true"] {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/* Loading state */
.btn[data-loading="true"] {
  cursor: wait;
}
```

### Architecture
```
components/{level}/{name}/
├── {name}.html
├── {name}.css
├── {name}.js          (optional, only if interactive)
└── showcase.html      (variant showcase)
```

### Conventions
- Mobile-first media queries
- `rem` for font sizes and spacing, never `px`
- CSS Grid for page layouts, Flexbox for component layouts
- Logical properties preferred (`margin-inline`, `padding-block`)
- Maximum 3 levels of selector nesting
- `:focus-visible` instead of `:focus` for keyboard-only focus rings

### Performance
- No `@import` in CSS (use build tool to concatenate)
- Avoid universal selectors (`*`)
- Use `contain: layout` for self-contained components
- Minimize use of `calc()` in render-path styles

### Forbidden
- `!important` (except utility overrides)
- Hardcoded colors, fonts, spacing, radii, or shadows
- `float` for layout
- Deep nesting (> 3 levels)
- ID selectors for styling

---

## JavaScript Standards

### General
- ES6+ module syntax
- Vanilla JS only (no jQuery, no framework dependency)
- Progressive enhancement (component works without JS)
- Event delegation over individual event listeners

### Component Pattern
```javascript
/**
 * Accordion component
 * Progressive enhancement: works as static details/summary without JS
 */
class Accordion {
  constructor(element) {
    this.el = element;
    this.triggers = element.querySelectorAll('[data-accordion-trigger]');
    this.init();
  }

  init() {
    this.triggers.forEach(trigger => {
      trigger.addEventListener('click', () => this.toggle(trigger));
      trigger.addEventListener('keydown', (e) => this.handleKeydown(e, trigger));
    });
  }

  toggle(trigger) {
    const panel = document.getElementById(trigger.getAttribute('aria-controls'));
    const expanded = trigger.getAttribute('aria-expanded') === 'true';
    trigger.setAttribute('aria-expanded', !expanded);
    panel.hidden = expanded;
  }

  handleKeydown(event, trigger) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggle(trigger);
    }
  }
}

// Auto-initialize
document.querySelectorAll('[data-accordion]').forEach(el => new Accordion(el));
```

### Conventions
- `const` by default, `let` when reassignment is needed
- Arrow functions for callbacks
- `data-*` attributes for JS hooks (not classes)
- `aria-expanded`, `aria-controls`, `aria-selected` for state
- `hidden` attribute for show/hide (not `display: none` in JS)

### Keyboard Handling
```javascript
// Standard keyboard patterns
const KEYS = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  TAB: 'Tab',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
};
```

### Forbidden
- `var` keyword
- `document.write()`
- Inline event handlers
- Blocking `<script>` in `<head>`
- `setTimeout` for state management
- Direct DOM manipulation of styles (use classes or data attributes)

---

## Design Token File Standards

### W3C DTCG Format
```json
{
  "color": {
    "primary": {
      "500": {
        "$value": "#2563eb",
        "$type": "color",
        "$description": "Primary brand color, used for primary buttons and links"
      }
    }
  }
}
```

### Token Hierarchy
```
tokens/
├── primitives/         # Raw values (colors, sizes, weights)
│   ├── colors.json
│   ├── typography.json
│   └── spacing.json
├── semantic/           # Meaning-based (text, surface, interactive)
│   ├── colors.json
│   └── typography.json
├── component/          # Component-specific (button, input, card)
│   └── button.json
└── tokens.json         # Merged output
```

### Naming Convention
- `kebab-case` for all token names
- Category prefix: `color-`, `font-`, `spacing-`, `radius-`, `shadow-`, `z-`
- Semantic layer references primitives: `"$value": "{color.blue.500}"`

---

## File Naming

### Components
```
{atomic-level}/{component-name}/{component-name}.{ext}
```
Examples:
- `atoms/button/button.html`
- `molecules/search-bar/search-bar.css`
- `organisms/navigation/navigation.js`

### Documentation
```
docs/{component-name}/README.md
docs/{component-name}/examples.html
```

### Tokens
```
tokens/{tier}/{category}.json
```
Examples:
- `tokens/primitives/colors.json`
- `tokens/semantic/typography.json`

---

## Quality Checklist

Before delivery, all component code must pass:

- [ ] Zero hardcoded visual values
- [ ] axe-core audit: zero violations
- [ ] Keyboard navigation functional
- [ ] Focus styles visible
- [ ] Tested at 320px, 768px, 1024px, 1440px
- [ ] Works without JavaScript
- [ ] BEM naming followed
- [ ] Maximum 3 CSS nesting levels

---

*Design System Squad Coding Standards v1.0*
