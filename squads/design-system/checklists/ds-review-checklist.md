# Design System Review Checklist

**Reference:** Design System Squad
**Items:** 28
**Used by:** ds-architect, qa

## Consistency

- [ ] **Visual consistency** - All components use the same token values for shared properties
- [ ] **Naming consistency** - Component names follow atomic level conventions
- [ ] **API consistency** - Similar components have similar prop names and patterns
- [ ] **Spacing consistency** - Internal and external spacing follows the spacing scale
- [ ] **Typography consistency** - Text styles match the typography system

## Coverage

- [ ] **Atoms complete** - All fundamental elements built (Button, Input, Label, Icon, Badge)
- [ ] **Molecules complete** - Key compositions built (Form Field, Search Bar, Card Header)
- [ ] **Organisms complete** - Major sections built (Navigation, Hero, Footer, Modal)
- [ ] **Variant coverage** - Each component has size, color, and state variants
- [ ] **Theme coverage** - Components tested in light and dark themes

## Token Integration

- [ ] **100% token-driven** - Zero hardcoded visual values in component CSS
- [ ] **Semantic tokens used** - Components reference semantic tokens, not primitives
- [ ] **Theme-switchable** - Changing theme tokens updates all components correctly
- [ ] **Token documentation** - Each component lists the tokens it uses

## Accessibility

- [ ] **axe-core clean** - Zero violations across all components
- [ ] **WCAG AA compliance** - All Level A and AA criteria met
- [ ] **Keyboard navigable** - All interactive components work with keyboard only
- [ ] **Screen reader tested** - Components announce correctly with assistive tech
- [ ] **Focus management** - Focus indicators visible and logical

## Documentation

- [ ] **Props documented** - Every prop has type, default, and description
- [ ] **Usage examples** - At least 3 examples per component
- [ ] **Do/Don't guides** - Common misuse patterns documented
- [ ] **Accessibility notes** - ARIA and keyboard behavior documented
- [ ] **Changelog** - Version history maintained

## Testing

- [ ] **Unit tests** - Each component has test suite
- [ ] **Visual tests** - Variant rendering verified
- [ ] **Interaction tests** - Keyboard and click behavior tested
- [ ] **Responsive tests** - Tested at key breakpoints
- [ ] **Cross-browser** - Verified in Chrome, Safari, Firefox, Edge

## Verdict Criteria

| Verdict | Criteria |
|---------|----------|
| **PASS** | All 28 items checked |
| **CONCERNS** | 24-27 items checked, remaining items are non-critical |
| **FAIL** | <24 items checked or any accessibility item unchecked |

## Review Scoring

| Score | Rating | Action |
|-------|--------|--------|
| 90-100% | Excellent | Ready for adoption |
| 75-89% | Good | Minor improvements needed |
| 60-74% | Fair | Significant gaps to address |
| Below 60% | Poor | Major rework required |

---
*Design System Squad Checklist*
