# Visual QA Checklist

Comprehensive visual quality assurance checklist for design system and brand deliverables.

## Layout & Structure

- [ ] **Grid alignment** - All elements aligned to the design grid
- [ ] **Spacing consistency** - Margins and padding match design spec
- [ ] **Section ordering** - Sections appear in correct order
- [ ] **Container widths** - Max-widths and breakpoints match spec
- [ ] **Overflow handling** - No unexpected content overflow
- [ ] **Z-index stacking** - Elements layer correctly (modals, dropdowns above content)

## Typography

- [ ] **Font family correct** - Matches approved typefaces
- [ ] **Font sizes match** - Heading and body sizes match type scale
- [ ] **Font weights correct** - Bold, medium, regular applied correctly
- [ ] **Line heights match** - Leading matches spec per element
- [ ] **Letter spacing** - Tracking matches spec where defined
- [ ] **Text alignment** - Left, center, right as per design
- [ ] **No text overflow** - Text wraps or truncates as intended
- [ ] **No orphan/widow lines** - Especially in headings and key copy

## Colors

- [ ] **Background colors match** - Hex values match palette exactly
- [ ] **Text colors match** - All text colors match approved palette
- [ ] **Border colors match** - Borders use approved palette colors
- [ ] **Gradient accuracy** - Gradients match spec (colors, stops, direction)
- [ ] **Opacity values** - Transparent elements match spec
- [ ] **Dark mode** - If applicable, colors correct in dark mode

## Images & Media

- [ ] **Correct images used** - Right assets in right positions
- [ ] **Image quality** - No pixelation, artifacts, or blur
- [ ] **Aspect ratios** - Images not stretched or squished
- [ ] **Alt text present** - All content images have alt text
- [ ] **SVGs crisp** - Vector graphics render sharply at all sizes
- [ ] **Video/animation** - Plays correctly, proper controls shown

## Interactive States

- [ ] **Hover states** - All interactive elements have hover styles
- [ ] **Focus states** - Visible focus indicators on all focusable elements
- [ ] **Active/pressed states** - Click feedback visible
- [ ] **Disabled states** - Disabled elements visually distinct
- [ ] **Loading states** - Skeleton screens or spinners where expected
- [ ] **Error states** - Form errors display correctly
- [ ] **Empty states** - Empty content areas have appropriate placeholder

## Animations & Transitions

- [ ] **Transition timing** - Matches spec (duration, easing)
- [ ] **Animation triggers** - Fire at correct scroll position or interaction
- [ ] **Reduced motion** - Respects `prefers-reduced-motion` media query
- [ ] **No jank** - Animations smooth at 60fps
- [ ] **Page transitions** - Route changes animate correctly (if applicable)

## Responsive Behavior

- [ ] **Mobile (320px)** - Layout correct, content readable
- [ ] **Tablet (768px)** - Layout adapts, content accessible
- [ ] **Desktop (1024px)** - Full layout renders correctly
- [ ] **Desktop L (1440px)** - Primary viewport pixel-perfect
- [ ] **Desktop XL (1920px)** - No stretch, proper max-width
- [ ] **No horizontal scroll** - At any standard breakpoint

---

## Scoring

| Score | Rating | Action |
|-------|--------|--------|
| 90-100% | Pixel-Perfect | Ready for delivery |
| 75-89% | Minor Deviations | Fix before delivery |
| 60-74% | Significant Issues | Revisions required |
| Below 60% | Major Problems | Rework needed |

---

*QA Accessibility Squad - Visual QA Checklist v1.0*
