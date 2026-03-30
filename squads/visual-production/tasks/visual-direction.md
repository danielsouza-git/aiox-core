# visual-direction

```yaml
task:
  id: visual-direction
  name: Create Visual & Motion Direction Document
  agent: art-director
  squad: visual-production
  type: strategy
  elicit: true

inputs:
  required:
    - project_brief: "Project or campaign brief with objectives"
    - brand_profile: "Brand identity document or guidelines"
  optional:
    - moodboard: "Existing moodboard or visual references"
    - competitors: "Competitor visual examples"
    - target_audience: "Audience demographics and preferences"
    - reference_animations: "URLs or descriptions of reference motion styles"

outputs:
  - visual-direction.md: "Complete visual and motion direction document"
  - moodboard-refined.md: "Curated moodboard with annotations"
  - color-usage-guide.md: "Color application rules"
  - do-dont-examples.md: "Visual and motion do and don't reference sheet"
  - motion-direction.md: "Framer Motion animation direction with tokens and patterns"

pre_conditions:
  - "Project brief or campaign objectives provided"
  - "Brand profile or identity guidelines available"

post_conditions:
  - "Visual direction covers mood, style, palette, composition"
  - "Motion direction covers timing, easing, springs, entry/exit patterns"
  - "Animation tokens defined and ready for motion-tokens.ts generation"
  - "Moodboard aligned with brand personality"
  - "Clear constraints and guardrails defined for both static and motion"
  - "Direction documents ready for production team"
```

## Purpose

Create a comprehensive visual AND motion direction document that guides all visual asset and animation production for a project or campaign. This document becomes the single source of truth for visual consistency across static and animated content. The motion direction section specifically targets Framer Motion implementation, providing the design tokens and patterns that feed directly into the `motion-create` task.

## Workflow

### Phase 1: Brand Immersion (10 min)
1. Review brand profile, personality, and values
2. Analyze existing visual assets for patterns
3. Identify brand DNA elements (colors, shapes, textures)
4. Note any existing constraints or guidelines

### Phase 2: Mood Definition (15 min)
1. Define emotional keywords (3-5 words)
2. Curate reference images aligned with mood
3. Identify visual metaphors for the brand
4. Create mood spectrum: primary mood + secondary accent

### Phase 3: Style Framework (15 min)
1. **Photography style** - Lighting, color grading, subjects
2. **Illustration style** - If applicable, line weight, abstraction level
3. **Typography usage** - Hierarchy, weight distribution, spacing
4. **Color application** - Primary/secondary ratios, background rules
5. **Composition rules** - Grid preferences, whitespace, focal points

### Phase 4: Motion Direction (20 min)

This phase defines the animation language for the brand. All values here feed directly into Framer Motion implementation via `lib/motion-tokens.ts`.

#### 4.1 Motion Principles

Define the brand's motion personality through these axes:

| Axis | Spectrum | Brand Position |
|------|----------|----------------|
| Speed | Slow ... Fast | [position] |
| Weight | Light/Airy ... Heavy/Grounded | [position] |
| Precision | Mechanical/Exact ... Organic/Imperfect | [position] |
| Energy | Calm/Subtle ... Energetic/Bold | [position] |
| Complexity | Simple/Direct ... Layered/Orchestrated | [position] |

#### 4.2 Timing Tokens

Define base duration values for the motion system:

| Token | Value | Usage |
|-------|-------|-------|
| `duration.instant` | 100ms | Micro-feedback (hover states, toggles) |
| `duration.fast` | 200-300ms | Button presses, icon transitions |
| `duration.moderate` | 400-600ms | Panel reveals, accordions |
| `duration.slow` | 800-1200ms | Page transitions, hero reveals |
| `duration.dramatic` | 1500-3500ms | Brand moments, loading sequences |

#### 4.3 Easing Curves

Define the brand's preferred easing profiles:

| Name | Cubic-Bezier | Usage | Character |
|------|-------------|-------|-----------|
| `ease.entrance` | `[0.0, 0.0, 0.2, 1.0]` | Elements entering viewport | Decelerating arrival |
| `ease.exit` | `[0.4, 0.0, 1.0, 1.0]` | Elements leaving viewport | Accelerating departure |
| `ease.emphasis` | `[0.4, 0.0, 0.2, 1.0]` | State changes, toggles | Smooth weight shift |
| `ease.dramatic` | `[0.16, 1.0, 0.3, 1.0]` | Hero animations, reveals | Expo-style snap |
| `ease.linear` | `[0, 0, 1, 1]` | Progress bars, spinners | Constant velocity |

#### 4.4 Spring Configurations

Define spring physics profiles for organic motion:

| Name | Stiffness | Damping | Mass | Character |
|------|-----------|---------|------|-----------|
| `spring.gentle` | 100 | 15 | 1.0 | Soft, floaty arrival |
| `spring.bouncy` | 300 | 10 | 1.0 | Playful overshoot |
| `spring.snappy` | 400 | 25 | 0.8 | Quick and precise |
| `spring.slow` | 50 | 20 | 1.5 | Heavy, deliberate |
| `spring.elastic` | 200 | 8 | 0.5 | Whip-like snap |

**When to use springs vs tween easing:**
- **Springs:** User-triggered interactions (clicks, drags), element entrances, bouncy effects
- **Tween:** Timed sequences (brand reveals), exits, opacity-only transitions, looping animations

#### 4.5 Entry/Exit Animation Patterns

Define standard animation patterns for UI elements:

**Entry Patterns:**

| Pattern | Transform | Opacity | Spring | Use Case |
|---------|-----------|---------|--------|----------|
| Fade Up | `y: 30 -> 0` | `0 -> 1` | gentle | Default content entrance |
| Scale In | `scale: 0.8 -> 1` | `0 -> 1` | bouncy | Modals, cards, emphasis |
| Slide In | `x: -100% -> 0` | `1` | snappy | Panels, sidebars, drawers |
| Rotate In | `rotateX: -90 -> 0` | `0 -> 1` | bouncy | Text, dramatic reveals |
| Clip Reveal | `clipPath: inset(100% 0 0 0) -> inset(0)` | `1` | -- (tween) | Section reveals, images |
| Blur In | `filter: blur(10px) -> blur(0)` | `0 -> 1` | gentle | Soft, dreamy entrances |

**Exit Patterns:**

| Pattern | Transform | Opacity | Easing | Use Case |
|---------|-----------|---------|--------|----------|
| Fade Down | `y: 0 -> 20` | `1 -> 0` | ease.exit | Default content exit |
| Scale Out | `scale: 1 -> 0.9` | `1 -> 0` | ease.exit | Modals, dismissals |
| Slide Out | `x: 0 -> 100%` | `1` | ease.exit | Panels, drawers |
| Dissolve | `opacity: [1, 0.4, 0.9, 0.2, 0]` | -- | ease.dramatic | Brand transitions |

#### 4.6 Scroll-Triggered Animation Specs

Define behavior for elements that animate on scroll:

| Parameter | Value | Notes |
|-----------|-------|-------|
| Trigger point | `amount: 0.3` | 30% of element visible before triggering |
| Animation | Entry pattern (Fade Up default) | As defined in 4.5 |
| Repeat | `once: true` | Animate once, do not re-trigger on scroll back |
| Stagger | `staggerChildren: 0.05` | For lists and grids |
| Viewport margin | `margin: "-100px"` | Start slightly before visible |

**Framer Motion implementation pattern:**
```typescript
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.3, margin: "-100px" }}
  variants={fadeUpVariants}
>
```

#### 4.7 Hover/Interaction Animation Specs

Define interaction response animations:

| Interaction | Property | Value | Transition | Notes |
|-------------|----------|-------|------------|-------|
| Hover (card) | `scale` | `1.02` | `spring.snappy` | Subtle lift |
| Hover (card) | `boxShadow` | Increase spread | `duration: 0.2` | Elevation change |
| Hover (button) | `scale` | `1.05` | `spring.snappy` | Noticeable pop |
| Hover (link) | `x` | `4px` | `spring.gentle` | Subtle nudge |
| Press (button) | `scale` | `0.97` | `duration: 0.1` | Tactile press |
| Focus (input) | `boxShadow` | Glow ring | `duration: 0.2` | Focus indicator |
| Drag | -- | -- | `spring.bouncy` | Snap-back on release |

**Framer Motion implementation pattern:**
```typescript
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.97 }}
  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
>
```

#### 4.8 Stagger & Orchestration Patterns

Define how grouped elements animate together:

| Pattern | Stagger Delay | Direction | Use Case |
|---------|---------------|-----------|----------|
| List items | `0.05s` | Top to bottom | Navigation, feature lists |
| Grid items | `0.08s` | Left-to-right, row-by-row | Card grids, galleries |
| Letters | `0.04s` | Left to right | Headlines, brand text |
| Hero elements | `0.15s` | Custom order | Landing page sections |
| Reveal sequence | `0.2s` | Staged (not staggered) | Brand reveals, intros |

#### 4.9 Motion Do/Don't

| DO | DON'T |
|----|-------|
| Use spring physics for user interactions | Use linear easing for UI transitions |
| Stagger groups with consistent delay | Animate everything simultaneously |
| Use GPU-accelerated properties only | Animate width, height, margin, padding |
| Respect `prefers-reduced-motion` | Ignore accessibility preferences |
| Keep animations under 1s for UI, 3.5s for brand | Let UI animations exceed 1 second |
| Use Framer Motion exclusively | Mix animation libraries (GSAP + FM) |
| Animate transforms and opacity | Animate `background-color` or `color` |
| Use variants for state management | Use imperative animation controls |
| Export spring configs as tokens | Hardcode spring values in components |
| Test at 2x and 0.5x speed | Ship without reviewing timing |

### Phase 5: Constraints & Guardrails (10 min)
1. Define visual "don'ts" with examples
2. Set technical constraints (formats, sizes, color spaces)
3. Establish approval workflow for edge cases
4. Document accessibility requirements (contrast, alt text, reduced motion)

### Phase 6: Production Brief (10 min)
1. Summarize visual and motion direction in actionable format
2. Create quick-reference card for the team
3. List specific deliverables needed (static + animated)
4. Assign priority and timeline
5. Map animation tokens to `motion-tokens.ts` schema

## Elicitation Questions

```yaml
elicit:
  - question: "What is the primary emotion this project should evoke?"
    options:
      - "Trust and professionalism"
      - "Energy and excitement"
      - "Calm and sophistication"
      - "Bold and disruptive"
      - "Warm and approachable"

  - question: "What is the visual complexity level?"
    options:
      - "Minimal - clean, lots of whitespace"
      - "Moderate - balanced elements"
      - "Rich - layered, detailed compositions"

  - question: "What is the motion personality?"
    options:
      - "Subtle and refined - minimal movement, soft springs"
      - "Playful and bouncy - overshoots, elastic springs"
      - "Precise and snappy - quick, no overshoot"
      - "Dramatic and cinematic - slow reveals, orchestrated sequences"
      - "Technical and digital - glitch effects, data-driven motion"

  - question: "Are there any visual or motion styles to avoid?"
    type: text
    hint: "e.g., no stock photo look, no gratuitous parallax, no bouncy loaders"
```

## Visual Direction Template

```markdown
# Visual Direction: [Project Name]

## Mood Keywords
[keyword-1] | [keyword-2] | [keyword-3] | [keyword-4]

## Color Application
- **Primary (60%):** [color] - Used for backgrounds, large areas
- **Secondary (30%):** [color] - Used for accents, CTAs
- **Tertiary (10%):** [color] - Used for highlights, details

## Photography Style
- Lighting: [natural/studio/dramatic]
- Color grade: [warm/cool/neutral]
- Subjects: [people/product/abstract]
- Composition: [centered/rule-of-thirds/dynamic]

## Typography in Visuals
- Headlines: [font] at [weight]
- Body: [font] at [weight]
- Max characters per line in images: [number]

## Composition Rules
- Grid: [type]
- Safe zone: [percentage from edges]
- Focal point: [position preference]

## Motion Language
- Personality: [from elicitation: subtle/playful/precise/dramatic/technical]
- Default entry: [pattern from 4.5]
- Default exit: [pattern from 4.5]
- Spring profile: [gentle/bouncy/snappy/slow]
- Stagger delay: [fast 0.03s / medium 0.05s / slow 0.08s]
- Max UI animation: [Xms]
- Max brand animation: [Xs]
- Scroll trigger: [amount, once, margin]

## Animation Tokens Summary
| Token | Value | Usage |
|-------|-------|-------|
| spring.default | stiffness: X, damping: Y | General interactions |
| duration.ui | Xms | UI transitions |
| duration.brand | Xs | Brand moments |
| stagger.default | Xs | Grouped element delay |
| ease.default | [a, b, c, d] | Tween fallback |

## Do / Don't (Static)
| DO | DON'T |
|----|-------|
| [example] | [example] |

## Do / Don't (Motion)
| DO | DON'T |
|----|-------|
| [from section 4.9] | [from section 4.9] |
```

## Acceptance Criteria

- [ ] Mood keywords defined and aligned with brand
- [ ] Color application rules with ratios documented
- [ ] Photography/illustration style clearly described
- [ ] Composition rules and grid preferences set
- [ ] Static Do/Don't examples provided
- [ ] Motion personality defined on all 5 axes (speed, weight, precision, energy, complexity)
- [ ] Timing tokens defined (instant through dramatic)
- [ ] Easing curves defined (entrance, exit, emphasis, dramatic, linear)
- [ ] Spring configurations defined with stiffness, damping, mass
- [ ] Entry/exit animation patterns specified with transforms and transitions
- [ ] Scroll-triggered animation specs defined (trigger point, repeat, stagger)
- [ ] Hover/interaction animation specs defined for cards, buttons, links
- [ ] Stagger/orchestration patterns defined for lists, grids, letters, heroes
- [ ] Motion Do/Don't examples provided
- [ ] Animation tokens ready to map to `motion-tokens.ts`
- [ ] Technical constraints documented (GPU-only properties, Framer Motion only)
- [ ] Accessibility requirements documented (reduced motion, no flashing)
- [ ] Direction document reviewed by stakeholder

## Quality Gate
- Threshold: >70%
- Visual direction covers mood, palette, typography, composition, and constraints
- Motion direction includes timing tokens, easing curves, and spring configurations
- Do/Don't examples provided for both static and motion content

---
*Visual Production Squad Task -- Visual & Motion Direction v2.0*
