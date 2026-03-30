# Component Quality Checklist

**Reference:** Design System Squad
**Items:** 30
**Used by:** component-builder, ds-architect

## Token Usage

- [ ] **No hardcoded colors** - All colors reference CSS custom properties from tokens
- [ ] **No hardcoded fonts** - Font families, sizes, and weights from tokens
- [ ] **No hardcoded spacing** - Padding, margins, and gaps from spacing tokens
- [ ] **No hardcoded radii** - Border radius values from tokens
- [ ] **No hardcoded shadows** - Box shadows from elevation tokens
- [ ] **Semantic tokens preferred** - Uses semantic tokens (e.g., `--color-text-primary`) over primitive tokens (e.g., `--color-gray-900`)

## Responsive Design

- [ ] **Mobile-first CSS** - Base styles target mobile, media queries add desktop
- [ ] **Fluid sizing** - Uses `rem`/`em` not `px` for text and spacing
- [ ] **No horizontal overflow** - Component does not cause horizontal scroll at 320px
- [ ] **Touch targets** - Interactive elements are at least 44x44px on mobile
- [ ] **Breakpoint testing** - Tested at 320px, 768px, 1024px, 1440px

## Variants

- [ ] **Size variants** - sm, md (default), lg implemented and visually distinct
- [ ] **State variants** - Hover, focus, active, disabled all styled
- [ ] **Theme variants** - Works in light and dark themes
- [ ] **Loading state** - Has loading/skeleton state if applicable
- [ ] **Empty state** - Has empty/placeholder state if applicable

## Browser Compatibility

- [ ] **Chrome** - Renders correctly in latest Chrome
- [ ] **Safari** - Renders correctly in latest Safari
- [ ] **Firefox** - Renders correctly in latest Firefox
- [ ] **Edge** - Renders correctly in latest Edge
- [ ] **No vendor prefixes needed** - Or autoprefixer handles them

## Performance

- [ ] **Minimal DOM** - Component uses minimum necessary HTML elements
- [ ] **No layout thrashing** - Does not cause layout recalculation on interaction
- [ ] **CSS containment** - Uses `contain` property where appropriate
- [ ] **No forced sync layout** - JavaScript does not trigger forced synchronous layout
- [ ] **Efficient selectors** - CSS selectors are not deeply nested (max 3 levels)

## Code Quality

- [ ] **BEM or utility naming** - Follows squad's CSS naming methodology
- [ ] **No `!important`** - Styles do not use `!important`
- [ ] **Progressive enhancement** - Core functionality works without JavaScript
- [ ] **Self-contained** - No leaking styles that affect parent or siblings
- [ ] **Documented API** - Props, slots, and events are documented

## Verdict Criteria

| Verdict | Criteria |
|---------|----------|
| **PASS** | All 30 items checked |
| **CONCERNS** | 25-29 items checked, issues are minor |
| **FAIL** | <25 items checked or any token/a11y items unchecked |

## Common Issues

1. **Hardcoded hex color** - Search for `#` in CSS, replace with token reference
2. **px font size** - Replace with `rem` value from typography tokens
3. **Missing focus styles** - Add `:focus-visible` with `--color-focus-ring` token
4. **Nested selectors >3** - Flatten selector hierarchy
5. **Missing disabled state** - Add `[aria-disabled="true"]` styles

---
*Design System Squad Checklist*
