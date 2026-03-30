# WCAG 2.2 Accessibility Checklist

**Reference:** WCAG 2.2 (W3C)
**Items:** 35
**Used by:** a11y-auditor

## Perceivable (WCAG 1.x)

### Text Alternatives (1.1)
- [ ] **1.1.1 Non-text Content (A)** - All images, icons, and graphics have meaningful alt text
- [ ] **Decorative images** - Decorative images use `alt=""` or `aria-hidden="true"`
- [ ] **Icon buttons** - Icon-only buttons have `aria-label`

### Adaptable (1.3)
- [ ] **1.3.1 Info and Relationships (A)** - Semantic HTML conveys structure (headings, lists, tables)
- [ ] **1.3.2 Meaningful Sequence (A)** - DOM order matches visual reading order
- [ ] **1.3.3 Sensory Characteristics (A)** - Instructions do not rely solely on shape, size, or position
- [ ] **1.3.5 Identify Input Purpose (AA)** - Form inputs have `autocomplete` attributes

### Distinguishable (1.4)
- [ ] **1.4.1 Use of Color (A)** - Color is not the sole means of conveying information
- [ ] **1.4.3 Contrast Minimum (AA)** - Text contrast ratio >= 4.5:1 (normal), >= 3:1 (large)
- [ ] **1.4.4 Resize Text (AA)** - Text can be resized to 200% without loss of content
- [ ] **1.4.5 Images of Text (AA)** - Real text used instead of images of text
- [ ] **1.4.6 Contrast Enhanced (AAA)** - Text contrast >= 7:1 (normal), >= 4.5:1 (large)
- [ ] **1.4.11 Non-text Contrast (AA)** - UI components and graphics have >= 3:1 contrast
- [ ] **1.4.12 Text Spacing (AA)** - Content adapts when user increases text spacing
- [ ] **1.4.13 Content on Hover/Focus (AA)** - Tooltips are dismissible, hoverable, persistent

## Operable (WCAG 2.x)

### Keyboard Accessible (2.1)
- [ ] **2.1.1 Keyboard (A)** - All functionality available via keyboard
- [ ] **2.1.2 No Keyboard Trap (A)** - User can always Tab away from any element
- [ ] **2.1.4 Character Key Shortcuts (A)** - Single-key shortcuts can be turned off or remapped

### Enough Time (2.2)
- [ ] **2.2.1 Timing Adjustable (A)** - Time limits can be extended or turned off
- [ ] **2.2.2 Pause, Stop, Hide (A)** - Moving/auto-updating content can be paused

### Navigable (2.4)
- [ ] **2.4.3 Focus Order (A)** - Tab order follows logical reading sequence
- [ ] **2.4.6 Headings and Labels (AA)** - Headings and labels describe topic or purpose
- [ ] **2.4.7 Focus Visible (AA)** - Keyboard focus indicator is visible
- [ ] **2.4.11 Focus Not Obscured (AA)** - Focused element is not fully hidden by other content

### Input Modalities (2.5)
- [ ] **2.5.7 Dragging Movements (AA)** - Drag operations have single-pointer alternative
- [ ] **2.5.8 Target Size Minimum (AA)** - Interactive targets are at least 24x24px (44x44px preferred)

## Understandable (WCAG 3.x)

### Readable (3.1)
- [ ] **3.1.1 Language of Page (A)** - `lang` attribute set on `<html>` element
- [ ] **3.1.2 Language of Parts (AA)** - `lang` attribute set on content in different language

### Predictable (3.2)
- [ ] **3.2.1 On Focus (A)** - Focus does not trigger unexpected context changes
- [ ] **3.2.2 On Input (A)** - Input does not trigger unexpected context changes

### Input Assistance (3.3)
- [ ] **3.3.1 Error Identification (A)** - Errors are identified and described in text
- [ ] **3.3.2 Labels or Instructions (A)** - Form fields have labels or instructions
- [ ] **3.3.3 Error Suggestion (AA)** - Error messages suggest correction when possible
- [ ] **3.3.8 Accessible Authentication (AA)** - Authentication does not require cognitive function test

## Robust (WCAG 4.x)

- [ ] **4.1.2 Name, Role, Value (A)** - Custom components have correct ARIA roles and states

## Verdict Criteria

| Verdict | Criteria |
|---------|----------|
| **PASS** | All Level A + AA items checked (or Level AAA if specified) |
| **CONCERNS** | All Level A checked, 1-2 Level AA items pending |
| **FAIL** | Any Level A item unchecked or >2 Level AA items unchecked |

## Testing Tools

| Tool | Use For |
|------|---------|
| axe-core | Automated violation detection |
| Lighthouse | Overall accessibility score |
| WebAIM Contrast Checker | Manual contrast verification |
| NVDA / VoiceOver | Screen reader testing |
| Keyboard only | Tab, Enter, Space, Escape navigation |

---
*Design System Squad Checklist - WCAG 2.2*
