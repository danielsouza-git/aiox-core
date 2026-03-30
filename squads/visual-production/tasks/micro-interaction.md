# micro-interaction

```yaml
task:
  id: micro-interaction
  name: Design Micro-Interaction
  agent: motion-designer
  squad: visual-production
  type: creation
  elicit: true

inputs:
  required:
    - interaction_type: "Type: hover, click, scroll, loading, toggle, input"
    - element: "UI element to animate (button, card, icon, etc.)"
    - context: "Where in the interface this appears"
  optional:
    - design_system: "Design system component reference"
    - brand_motion: "Brand motion guidelines"
    - implementation: "Framer Motion (React/TSX components)"

outputs:
  - micro-spec.md: "Micro-interaction specification"
  - animation-tokens.md: "Timing and easing values (spring profiles, durations)"
  - implementation-code/: "Framer Motion React/TSX component code"
  - preview.html: "Interactive preview (or Next.js page)"

pre_conditions:
  - "UI element and interaction type defined"
  - "Context of use specified"

post_conditions:
  - "Animation spec covers all states"
  - "Timing values are precise and documented"
  - "Reduced-motion alternative defined"
  - "Implementation code ready for developer handoff"
```

## Purpose

Design a micro-interaction that provides meaningful feedback to user actions. Specify precise timing, easing, and states for developer implementation.

## Workflow

### Phase 1: Interaction Analysis (5 min)
1. Identify the trigger (what the user does)
2. Define the feedback (what the system shows)
3. Determine the mode (how long does it persist)
4. Consider the loop (does it repeat)

### Phase 2: State Mapping (10 min)
Map all states for the interaction:

```
[Default] --trigger--> [Active] --complete--> [Final]
                           |
                           +--cancel--> [Default]
```

For each state, define:
- Visual properties (scale, opacity, color, position)
- Duration to reach this state
- Easing curve

### Phase 3: Timing Specification (10 min)

| State Transition | Duration | Easing | Properties |
|-----------------|----------|--------|------------|
| Default -> Hover | 150ms | ease-out | scale: 1.02, shadow: +2px |
| Hover -> Active | 100ms | ease-in | scale: 0.98, bg: darker |
| Active -> Complete | 200ms | ease-out | scale: 1.0, ripple |
| Any -> Default | 150ms | ease-out | all: reset |

### Phase 4: Implementation (15 min)

**Framer Motion Implementation:**
```tsx
import { motion, useReducedMotion } from 'framer-motion';

const buttonVariants = {
  rest: { scale: 1, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' },
  hover: { scale: 1.02, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' },
  tap: { scale: 0.98 },
};

export function AnimatedButton({ children, ...props }) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.button
      variants={prefersReduced ? {} : buttonVariants}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
```

**Animation Tokens (Spring Profiles):**
```ts
export const motionTokens = {
  spring: {
    snappy: { type: 'spring', stiffness: 400, damping: 25, mass: 0.8 },
    bouncy: { type: 'spring', stiffness: 300, damping: 10, mass: 1.0 },
    gentle: { type: 'spring', stiffness: 100, damping: 15, mass: 1.0 },
  },
  duration: {
    fast: 0.1,
    normal: 0.15,
    slow: 0.3,
  },
} as const;
```

### Phase 5: Accessibility & Preview (5 min)
1. Use `useReducedMotion()` hook to disable animations when user prefers reduced motion
2. Verify motion does not convey critical information alone
3. Create interactive preview (React component or HTML page)
4. Document keyboard interaction equivalent

## Common Micro-Interactions

| Interaction | Element | Duration | Key Property |
|-------------|---------|----------|-------------|
| Hover lift | Card | 150ms | translateY(-2px) + shadow |
| Press | Button | 100ms | scale(0.98) |
| Toggle | Switch | 200ms | translateX + color |
| Focus ring | Input | 150ms | outline + scale |
| Ripple | Button | 400ms | scale + opacity |
| Skeleton | Loading | 1.5s loop | opacity pulse |
| Check mark | Checkbox | 250ms | stroke-dashoffset |
| Slide in | Toast | 300ms | translateY + opacity |

## Elicitation Questions

```yaml
elicit:
  - question: "What type of micro-interaction?"
    options:
      - "Hover effect (card, button, link)"
      - "Click/tap feedback (button, toggle)"
      - "Scroll-triggered (reveal, parallax)"
      - "Loading state (skeleton, spinner)"
      - "Form interaction (input focus, validation)"

  - question: "What implementation format?"
    options:
      - "Framer Motion (recommended for all new work)"
      - "Framer Motion with spring physics (interactive elements)"
      - "Framer Motion with scroll triggers (whileInView, useScroll)"
      - "Framer Motion with AnimatePresence (mount/unmount)"
```

## Acceptance Criteria

- [ ] All states mapped and specified
- [ ] Timing values precise (ms, easing curves)
- [ ] Implementation code provided
- [ ] Reduced-motion alternative defined
- [ ] Interactive preview created
- [ ] Animation tokens documented
- [ ] Keyboard interaction equivalent specified

## Quality Gate
- Threshold: >70%
- All interaction states mapped with precise timing values
- Implementation code uses Framer Motion with GPU-accelerated properties only
- Reduced-motion alternative defined and tested

---
*Visual Production Squad Task*
