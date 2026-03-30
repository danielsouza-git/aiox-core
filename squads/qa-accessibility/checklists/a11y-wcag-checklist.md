# WCAG 2.2 Accessibility Checklist

Comprehensive accessibility checklist based on the POUR framework (Perceivable, Operable, Understandable, Robust).

## Perceivable

### Text Alternatives (1.1)
- [ ] **Alt text** - All content images have descriptive alt text
- [ ] **Decorative images** - Decorative images use `alt=""` or `aria-hidden`
- [ ] **Complex images** - Charts/diagrams have extended text descriptions
- [ ] **Form images** - Image buttons have descriptive alt text

### Time-Based Media (1.2)
- [ ] **Captions** - All video has accurate captions
- [ ] **Audio descriptions** - Video has audio description track (if visual-only info)
- [ ] **Transcripts** - Audio-only content has text transcript

### Adaptable (1.3)
- [ ] **Semantic HTML** - Proper use of headings, lists, tables, landmarks
- [ ] **Heading hierarchy** - H1-H6 in logical order, no skipped levels
- [ ] **Lists** - Ordered and unordered lists use proper markup
- [ ] **Tables** - Data tables have headers (`<th>`) and captions
- [ ] **Form labels** - All form fields have associated labels
- [ ] **Reading order** - DOM order matches visual order

### Distinguishable (1.4)
- [ ] **Color not sole indicator** - Information not conveyed by color alone
- [ ] **Contrast (AA)** - Text contrast >= 4.5:1 (normal), >= 3:1 (large)
- [ ] **Resize text** - Content usable at 200% zoom
- [ ] **Images of text** - Avoided (use real text)
- [ ] **Reflow** - No horizontal scroll at 320px width
- [ ] **Non-text contrast** - UI components >= 3:1 contrast
- [ ] **Text spacing** - Content works with increased spacing
- [ ] **Content on hover/focus** - Dismissible, hoverable, persistent

## Operable

### Keyboard Accessible (2.1)
- [ ] **All functions via keyboard** - No mouse-only interactions
- [ ] **No keyboard traps** - Can always Tab away from elements
- [ ] **Keyboard shortcuts** - If used, can be turned off or remapped
- [ ] **Character key shortcuts** - Can be disabled (if single char)

### Enough Time (2.2)
- [ ] **Timing adjustable** - Time limits can be extended or turned off
- [ ] **Pause/stop** - Moving/auto-updating content can be paused
- [ ] **No timing** - No time limit on essential activities

### Seizures & Physical (2.3)
- [ ] **No flashing** - No content flashes more than 3 times/second
- [ ] **Motion animation** - Can be disabled (reduced motion)

### Navigable (2.4)
- [ ] **Skip link** - "Skip to main content" link present
- [ ] **Page title** - Descriptive and unique per page
- [ ] **Focus order** - Logical tab order (left-right, top-bottom)
- [ ] **Link purpose** - Link text describes destination (not "click here")
- [ ] **Multiple ways** - More than one way to find each page
- [ ] **Headings descriptive** - Headings describe content sections
- [ ] **Focus visible** - Focus indicator clearly visible (>= 3:1 contrast)

### Input Modalities (2.5)
- [ ] **Pointer gestures** - Multi-point gestures have single-point alternative
- [ ] **Pointer cancellation** - Up-event used for activation
- [ ] **Target size** - Touch targets >= 24x24px (44x44px recommended)
- [ ] **Dragging** - Drag operations have non-dragging alternative

## Understandable

### Readable (3.1)
- [ ] **Language defined** - `lang` attribute on `<html>` element
- [ ] **Language of parts** - `lang` on content in different languages
- [ ] **Unusual words** - Jargon/idioms explained

### Predictable (3.2)
- [ ] **On focus** - No unexpected changes on focus
- [ ] **On input** - No unexpected changes on input
- [ ] **Consistent navigation** - Same navigation across pages
- [ ] **Consistent identification** - Same function = same label

### Input Assistance (3.3)
- [ ] **Error identification** - Errors clearly identified and described
- [ ] **Labels/instructions** - Form fields have clear labels
- [ ] **Error suggestion** - Correction suggestions provided
- [ ] **Error prevention** - Important submissions confirmable/reversible

## Robust

### Compatible (4.1)
- [ ] **Valid HTML** - No parsing errors in markup
- [ ] **Name, Role, Value** - Custom controls have correct ARIA
- [ ] **Status messages** - Dynamic messages use `aria-live`

---

## Scoring

| Score | Level | Action |
|-------|-------|--------|
| 95-100% | AA Certified | Formal compliance certificate |
| 85-94% | Conditional AA | Fix critical items within 30 days |
| 70-84% | Non-Compliant | Significant remediation needed |
| Below 70% | Critical Fail | Major accessibility barriers |

---

*QA Accessibility Squad - WCAG 2.2 Checklist v1.0*
