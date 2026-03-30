# motion-create

```yaml
task:
  id: motion-create
  name: Generate Framer Motion Animation Components (Profile-Driven)
  agent: motion-designer
  squad: visual-production
  type: creation
  elicit: false

inputs:
  required:
    - brand_profile: "Brand profile (archetype, personality, industry) — .aiox/branding/{client}/brand-profile.yaml"
    - visual_direction: "Visual + motion direction document — from visual-direction.md output"
    - brand_tokens: "CSS custom property map (--brand-primary, --brand-accent, --brand-glow, etc.)"
    - target_directory: "Output path for components (default: app/components/motion/)"
  optional:
    - spring_overrides: "Custom spring configs to override motion-tokens defaults"
    - color_scheme: "light | dark | both (default: both)"
    - max_animations: "Maximum number of animations to generate (default: 8, min: 5, max: 12)"

outputs:
  generated_components:
    description: "Variable number of .tsx components selected based on brand profile"
    note: "NOT a fixed set — each client gets unique animations matching their brand personality"
  shared_utilities:
    - lib/animations.ts: "Reusable Framer Motion variant factories and shared patterns"
    - lib/motion-tokens.ts: "Timing, easing, spring configs, delay sequences as design tokens"
  barrel:
    - index.ts: "Re-exports all generated components and utilities"

pre_conditions:
  - "Framer Motion 11+ installed in target project"
  - "React 18+ with TypeScript configured"
  - "CSS custom properties defined for brand colors"
  - "Brand profile exists with archetype and personality data"
  - "Visual direction document exists with motion direction section"

post_conditions:
  - "All generated animation components render without errors"
  - "Each component is fully self-contained (no cross-component imports except shared lib)"
  - "All animations use GPU-accelerated properties only (transform, opacity, filter)"
  - "Click-to-replay interactivity works on every component"
  - "prefers-reduced-motion respected via useReducedMotion()"
  - "No hardcoded colors (all via CSS custom properties)"
  - "TypeScript strict mode passes with zero errors"
  - "Each component exports a typed props interface"
  - "Animation selection rationale documented in motion-manifest.md"
```

## Purpose

Generate a **profile-driven** set of Framer Motion React components (.tsx) that implement the brand's unique animation system. The animations selected and their characteristics are determined by the client's brand profile — archetype, personality, industry, and visual direction. Each client gets a unique motion language, not a fixed template.

These components are the production implementation of the brand motion language defined in the visual direction document.

## Animation Selection Engine

### Phase 0: Profile Analysis

Before generating any components, analyze the brand profile to determine the motion personality:

**Read from brand profile:**
- `archetype` (Explorer, Creator, Ruler, Caregiver, Sage, Hero, Rebel, Magician, Lover, Jester, Everyman, Innocent)
- `personality_traits` / `voice_attributes` (warm, bold, playful, serious, elegant, raw, etc.)
- `industry` (cafe, tech, fashion, health, finance, creative, etc.)
- `visual_direction.motion_principles` (from Phase 4 of visual-direction.md)

**Derive motion personality (5-axis):**

| Axis | Low | High | Derived From |
|------|-----|------|-------------|
| Speed | Slow, contemplative | Fast, energetic | archetype + industry |
| Weight | Light, airy | Heavy, grounded | personality traits |
| Precision | Organic, fluid | Geometric, exact | industry + archetype |
| Energy | Calm, minimal | Vibrant, dynamic | voice attributes |
| Complexity | Simple, clean | Layered, rich | brand maturity + scope |

### Phase 0b: Animation Selection

Based on the motion personality, select animations from the **Animation Catalog** below. Each animation has personality affinity scores — select those that score highest for the client's derived personality.

**Selection rules:**
1. Always include 2-3 **Essential** animations (entrance, text, transition)
2. Select 3-5 **Character** animations based on personality match
3. Optional: 1-2 **Signature** animations for unique brand moments
4. Total: 5-12 animations per client (default 8)

## Animation Catalog

### Essential Animations (pick 2-3)

Every brand book needs basic entrance, text, and transition animations. The *style* varies by profile.

| Animation | Personality Match | Description |
|-----------|------------------|-------------|
| **SoftReveal** | Warm, Caregiver, Innocent | Gentle fade + subtle scale-up entrance |
| **BoldReveal** | Hero, Rebel, Explorer | Blinds/wipe + scale + glow entrance |
| **SlideReveal** | Sage, Ruler, Everyman | Clean directional slide with easing |
| **StaggerText** | ALL (style varies) | Letter-by-letter text entrance — spring for playful, tween for elegant |
| **CrossFade** | ALL (universal) | Smooth opacity transition between states |
| **FadeDissolve** | Magician, Creator, Rebel | Flicker fade with optional blur |

### Character Animations (pick 3-5 based on profile)

These define the brand's unique motion character.

| Animation | Best For | NOT For | Description |
|-----------|----------|---------|-------------|
| **PulseGlow** | Tech, Magician, Creator | Traditional, Caregiver | Pulsating glow ring with satellites |
| **ParticleOrbit** | Tech, Sage, Explorer | Cafe, Fashion, Caregiver | Orbital particles with spring physics |
| **MorphShape** | Creator, Magician, Jester | Ruler, Finance | SVG shape morphing loop |
| **SpeedLines** | Hero, Rebel, Explorer | Sage, Caregiver, Innocent | Neon SVG line drawing with motion blur |
| **GlitchReveal** | Rebel, Tech, Gaming | Caregiver, Innocent, Luxury | Scanline + noise + skew digital effect |
| **FloatingElements** | Cafe, Lifestyle, Innocent | Tech, Finance, Ruler | Gentle floating/bobbing with parallax |
| **WaveMotion** | Ocean, Wellness, Lover | Tech, Gaming, Rebel | Smooth wave undulation (SVG path) |
| **TypewriterReveal** | Sage, Writer, Editorial | Fast-paced, Gaming | Character-by-character with cursor blink |
| **ElasticBounce** | Jester, Playful, Kids | Luxury, Finance, Ruler | Overshoot bounce with elastic spring |
| **SmokeTrail** | Cafe, Incense, Artisan | Tech, Corporate, Gaming | Organic particle trail with turbulence |
| **GrowthBloom** | Nature, Organic, Caregiver | Tech, Industrial, Gaming | Organic grow + bloom from center |
| **InkSpread** | Creative, Art, Rebel | Corporate, Finance | Ink/paint spread SVG mask reveal |
| **GeometricAssemble** | Ruler, Architect, Tech | Organic, Cafe, Nature | Geometric pieces assemble into shape |
| **RotateReveal** | Fashion, Luxury, Creator | Casual, Gaming | Elegant rotation + scale entrance |
| **ScrollParallax** | ALL (depth varies) | — | Multi-layer parallax on scroll |

### Signature Animations (pick 0-2)

Unique, high-impact animations for hero sections or special moments.

| Animation | Personality | Description |
|-----------|-------------|-------------|
| **LogoAssemble** | ANY (custom per logo) | Logo elements animate into final position |
| **HeroScene** | ANY (custom per brand) | Multi-element orchestrated hero entrance |
| **BrandMoment** | ANY (custom per brand) | Signature micro-interaction unique to brand |

## Example: Profile → Animation Selection

### Client: Nova Vista Cafe
- **Archetype:** Explorer + Creator
- **Personality:** Warm, Knowledgeable, Bold, Community-First
- **Industry:** Specialty Coffee / Cafe

**Motion personality:** Speed=Medium, Weight=Grounded, Precision=Organic, Energy=Warm, Complexity=Medium

**Selected animations:**
1. SoftReveal (Essential — warm entrance, not bold blinds)
2. StaggerText (Essential — spring style, warm timing)
3. CrossFade (Essential — universal transitions)
4. FloatingElements (Character — cafe, lifestyle, organic)
5. SmokeTrail (Character — coffee steam, artisan feel)
6. GrowthBloom (Character — nature, organic, community)
7. ScrollParallax (Character — depth for storytelling)
8. HeroScene (Signature — custom hero with brand elements)

**NOT selected:** GlitchReveal (too digital), SpeedLines (too aggressive), GeometricAssemble (too corporate), ParticleOrbit (too tech)

### Client: Hypothetical Tech Startup
- **Archetype:** Magician + Sage
- **Industry:** SaaS / AI

**Selected animations:**
1. BoldReveal (Essential — impactful entrance)
2. StaggerText (Essential — geometric, precise timing)
3. FadeDissolve (Essential — flicker transition)
4. PulseGlow (Character — tech, magician)
5. ParticleOrbit (Character — tech, data visualization feel)
6. GlitchReveal (Character — digital aesthetic)
7. GeometricAssemble (Character — precision, architecture)
8. MorphShape (Character — transformation, magician)
9. LogoAssemble (Signature — tech logo reveal)

## Architecture

### File Structure (Generated Output)

```
{target_directory}/
  brand-reveal.tsx            # Hero entrance: blinds + scale + glow
  stagger-text.tsx            # Letter-by-letter with spring + 3D rotateX
  glitch-reveal.tsx           # Scanline + noise + skew reveal
  pulse-glow.tsx              # Pulsating glow ring with stagger
  morph-shape.tsx             # SVG path morphing loop
  particle-orbit.tsx          # Orbital particles with spring physics
  speed-lines.tsx             # Neon SVG line drawing
  fade-dissolve.tsx           # Flicker fade-out transition
  lib/
    animations.ts             # Shared variant factories
    motion-tokens.ts          # Design tokens for motion
  index.ts                    # Barrel export
```

### Component Contract

Every generated component MUST follow this contract:

```typescript
// 1. TypeScript props interface (exported)
export interface ComponentNameProps {
  className?: string;           // Optional wrapper class
  children?: React.ReactNode;   // Content to animate (where applicable)
  onAnimationComplete?: () => void; // Callback when animation finishes
  autoPlay?: boolean;           // Start on mount (default: true)
  delay?: number;               // Additional delay in seconds
}

// 2. Component implementation
export function ComponentName({ ...props }: ComponentNameProps) {
  // useReducedMotion() for accessibility
  // useState for replay trigger
  // Framer Motion motion.* elements with variants
  // Click-to-replay handler
}
```

### Brand-Agnostic Color System

Components MUST NOT hardcode any color values. All colors flow through CSS custom properties:

```css
/* Expected custom properties (set by consuming project) */
--brand-primary: #value;        /* Main brand color */
--brand-accent: #value;         /* Accent / highlight color */
--brand-glow: #value;           /* Glow / neon effect color */
--brand-bg: #value;             /* Background color */
--brand-text: #value;           /* Text color */
--brand-muted: #value;          /* Muted / secondary text */
```

Components reference these via inline styles or CSS variables:

```typescript
style={{ color: 'var(--brand-primary)' }}
```

## Workflow

### Phase 1: Scaffold (5 min)

1. Create target directory structure:
   ```
   {target_directory}/
   {target_directory}/lib/
   ```
2. Generate `lib/motion-tokens.ts` with all design tokens
3. Generate `lib/animations.ts` with shared variant factories

### Phase 2: Generate Shared Utilities

#### `lib/motion-tokens.ts`

This file exports all motion design tokens as typed constants:

```typescript
// Spring configurations
export const springs = {
  gentle: { type: 'spring' as const, stiffness: 100, damping: 15, mass: 1 },
  bouncy: { type: 'spring' as const, stiffness: 300, damping: 10, mass: 1 },
  snappy: { type: 'spring' as const, stiffness: 400, damping: 25, mass: 0.8 },
  slow:   { type: 'spring' as const, stiffness: 50,  damping: 20, mass: 1.5 },
} as const;

// Duration tokens (seconds)
export const durations = {
  staggerText: 1.5,
  speedLines: 2.0,
  glitchReveal: 2.0,
  fadeDissolve: 3.0,
  brandReveal: 3.0,
  pulseGlow: 3.5,
  morphShape: 3.5,
  particleOrbit: 4.0,  // per revolution
} as const;

// Stagger delay tokens (seconds)
export const staggers = {
  fast: 0.03,
  medium: 0.05,
  slow: 0.08,
  letters: 0.04,
} as const;

// Easing curves (for tween-based animations)
export const easings = {
  easeOutExpo: [0.16, 1, 0.3, 1] as [number, number, number, number],
  easeInExpo: [0.7, 0, 0.84, 0] as [number, number, number, number],
  easeInOutQuart: [0.76, 0, 0.24, 1] as [number, number, number, number],
  linear: [0, 0, 1, 1] as [number, number, number, number],
} as const;

// Glow / filter tokens
export const glowSizes = {
  sm: '0 0 10px',
  md: '0 0 20px',
  lg: '0 0 40px',
  xl: '0 0 60px',
} as const;
```

#### `lib/animations.ts`

Shared variant factories and utilities:

```typescript
import { type Variants, useReducedMotion } from 'framer-motion';
import { springs, easings, staggers } from './motion-tokens';

// Factory: fade + translate entrance
export function createFadeUpVariants(distance = 30): Variants {
  return {
    hidden: { opacity: 0, y: distance },
    visible: {
      opacity: 1,
      y: 0,
      transition: { ...springs.gentle },
    },
  };
}

// Factory: stagger container
export function createStaggerContainer(staggerDelay = staggers.medium): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      },
    },
  };
}

// Factory: scale entrance
export function createScaleVariants(from = 0.8): Variants {
  return {
    hidden: { opacity: 0, scale: from },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { ...springs.bouncy },
    },
  };
}

// Utility: reduced motion fallback
export function useMotionSafe() {
  const prefersReduced = useReducedMotion();
  return {
    prefersReduced,
    safeTransition: prefersReduced
      ? { duration: 0 }
      : undefined,
    safeAnimate: (full: object, reduced?: object) =>
      prefersReduced ? (reduced ?? { opacity: 1 }) : full,
  };
}

// Utility: replay trigger (returns [key, replay])
export function useReplay(): [number, () => void] {
  const [key, setKey] = useState(0);
  const replay = useCallback(() => setKey((k) => k + 1), []);
  return [key, replay];
}
```

### Phase 3: Generate Animation Components (8 components)

For each component below, follow the Component Contract exactly. The implementation guidance describes the Framer Motion technique, not pseudocode -- the generated .tsx must be production-ready.

---

#### 3.1 BrandReveal (`brand-reveal.tsx`)

**Reference:** Brand Reveal (3s blinds + scale + glow)

**Technique:**
- Container `motion.div` with stagger children orchestration
- 5-6 horizontal blind strips as `motion.div` elements, each with `scaleY: 0 -> 1` staggered reveal
- After blinds complete, inner content `motion.div` scales from 0.9 to 1.0 with opacity fade-in
- Glow ring `motion.div` with `boxShadow` animate using `var(--brand-glow)`
- Total duration: 3s, blinds take first 1.5s, content reveal takes remaining 1.5s

**Variants:**
```
blinds: hidden { scaleY: 0, originY: 0 } -> visible { scaleY: 1 }
content: hidden { opacity: 0, scale: 0.9 } -> visible { opacity: 1, scale: 1 }
glow: hidden { opacity: 0 } -> visible { opacity: [0, 0.8, 0.4, 0.6], boxShadow: animated }
```

**Props:** `blindCount?: number` (default 5), `children` (content to reveal)

---

#### 3.2 StaggerText (`stagger-text.tsx`)

**Reference:** Stagger Letters (1.5s 3D rotateX + spring)

**Technique:**
- Accepts `text: string` prop, splits into individual characters
- Container `motion.div` with `staggerChildren: 0.04`
- Each character is a `motion.span` with `display: inline-block`
- Entrance: `rotateX: -90 -> 0`, `opacity: 0 -> 1`, `y: 20 -> 0`
- Spring physics: `stiffness: 300, damping: 10`
- `perspective: 600px` on container for 3D depth

**Variants:**
```
letter: hidden { opacity: 0, rotateX: -90, y: 20 } -> visible { opacity: 1, rotateX: 0, y: 0, transition: spring }
```

**Props:** `text: string`, `as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'` (default 'h2')

---

#### 3.3 GlitchReveal (`glitch-reveal.tsx`)

**Reference:** Glitch Reveal (2s scanlines + noise + skew)

**Technique:**
- Container with `position: relative` and `overflow: hidden`
- Main text `motion.div` with keyframe-style animation: `skewX` oscillates [0, -5, 3, -2, 0] over 2s
- Pseudo-layer 1 (scanlines): `motion.div` absolutely positioned with repeating-linear-gradient (2px lines), `opacity` pulses
- Pseudo-layer 2 (noise): `motion.div` with `clipPath: inset()` animated to create horizontal slice displacement
- `x` position randomly shifts between frames for glitch offset using keyframes array: `[0, -3, 5, -2, 0, 4, -1, 0]`
- Color channels split: one layer offset in x by 3px with `var(--brand-accent)` color, main with `var(--brand-text)`

**Variants:**
```
text: hidden { opacity: 0, skewX: -10 } -> visible { opacity: 1, skewX: [0, -5, 3, -2, 0] }
scanline: hidden { opacity: 0 } -> visible { opacity: [0, 0.15, 0.05, 0.1, 0] }
offset: hidden { x: 0 } -> visible { x: [0, -3, 5, -2, 0, 4, -1, 0] }
```

**Props:** `children` (content to glitch-reveal), `intensity?: 'low' | 'medium' | 'high'` (controls displacement range)

---

#### 3.4 PulseGlow (`pulse-glow.tsx`)

**Reference:** Orchestration Pulse (3.5s reveal with stagger)

**Technique:**
- Central element `motion.div` (circle/ring) with pulsating `boxShadow` using `var(--brand-glow)`
- Ring created via `border: 2px solid var(--brand-primary)`, `borderRadius: 50%`
- Scale pulses: `scale: [1, 1.15, 1, 1.1, 1]` with `repeat: Infinity`
- `boxShadow` pulses between `glowSizes.sm` and `glowSizes.xl` with brand-glow color
- 3-4 satellite dots `motion.div` with `staggerChildren`, each fades in and orbits
- Satellites use `rotate` animation (0 -> 360) with different offsets and spring damping

**Variants:**
```
ring: { scale: [1, 1.15, 1, 1.1, 1], transition: { repeat: Infinity, duration: 3.5 } }
satellite: hidden { opacity: 0, scale: 0 } -> visible { opacity: 1, scale: 1, rotate: 360 }
```

**Props:** `size?: number` (default 120, px), `satelliteCount?: number` (default 4)

---

#### 3.5 MorphShape (`morph-shape.tsx`)

**Reference:** Morphing Square (3.5s SVG morph loop)

**Technique:**
- `motion.svg` container with viewBox
- `motion.path` element with animated `d` attribute cycling through 4 shapes:
  - Square -> Circle -> Diamond -> Star -> Square (loop)
- Each morph transition uses spring physics for organic feel
- Stroke animated with `var(--brand-primary)`, fill with `var(--brand-accent)` at low opacity
- `pathLength` animated from 0 to 1 for draw-on effect during initial reveal
- `repeat: Infinity`, `repeatType: 'loop'`

**Variants:**
```
morph: animate { d: [squarePath, circlePath, diamondPath, starPath, squarePath], transition: { duration: 3.5, repeat: Infinity } }
draw: hidden { pathLength: 0 } -> visible { pathLength: 1 }
```

**Props:** `size?: number` (default 200), `shapes?: string[]` (custom SVG path data, overrides defaults)

**Important:** SVG path data for the 4 shapes must have equal numbers of control points for smooth interpolation. Pre-define compatible paths in the component.

---

#### 3.6 ParticleOrbit (`particle-orbit.tsx`)

**Reference:** Particle Orbit (loop with spring physics)

**Technique:**
- Container `motion.div` with `position: relative`
- N particle `motion.div` elements (default 8) distributed at equal angles
- Each particle orbits the center via `rotate` animation (0 -> 360 degrees) at different speeds
- Particles placed on orbit via `position: absolute` + `translate` to orbit radius
- Spring physics for entrance: particles fly from center outward with `stiffness: 200, damping: 12`
- Each particle is a small circle (4-8px) with `var(--brand-accent)` and glow shadow
- Orbit uses `transition: { duration: durations.particleOrbit, repeat: Infinity, ease: 'linear' }`
- Slight `scale` pulse on each particle for breathing effect

**Variants:**
```
particle: hidden { opacity: 0, scale: 0 } -> visible { opacity: 1, scale: [1, 1.3, 1], rotate: 360 }
orbit: { rotate: 360, transition: { duration: N, repeat: Infinity, ease: 'linear' } }
```

**Props:** `particleCount?: number` (default 8), `orbitRadius?: number` (default 80), `particleSize?: number` (default 6)

---

#### 3.7 SpeedLines (`speed-lines.tsx`)

**Reference:** Speed Lines (2s with neon SVG drawing)

**Technique:**
- `motion.svg` with multiple `motion.line` or `motion.path` elements
- 6-8 horizontal lines at varying y-positions with randomized lengths
- Each line uses `pathLength: 0 -> 1` for draw-on animation with stagger
- Lines styled with `stroke: var(--brand-glow)`, `strokeWidth: 2`, neon glow via `filter: drop-shadow`
- Stagger delay between lines: 0.08s
- After draw-on, lines fade out with `opacity: 1 -> 0` and `x` translation for speed effect
- Total duration: 2s (1.2s draw + 0.8s fade-out)

**Variants:**
```
line: hidden { pathLength: 0, opacity: 0 } -> visible { pathLength: 1, opacity: [0, 1, 1, 0], x: [0, 0, 0, 50] }
container: hidden {} -> visible { transition: { staggerChildren: 0.08 } }
```

**Props:** `lineCount?: number` (default 7), `direction?: 'left' | 'right'` (default 'right')

---

#### 3.8 FadeDissolve (`fade-dissolve.tsx`)

**Reference:** Logo Dissolve (3s flicker transition)

**Technique:**
- Container wraps `children` content (typically a logo or image)
- Flicker effect via `opacity` keyframes array: `[1, 0.4, 0.9, 0.2, 0.8, 0.1, 0.6, 0]`
- Timing uses `easeInExpo` from tokens for accelerating flicker
- Optional `filter: blur()` increasing from 0 to 4px as opacity decreases
- Total duration: 3s
- Can run in reverse (`mode: 'in' | 'out'`) -- 'in' reverses the opacity array to create a flicker-in

**Variants:**
```
dissolve-out: { opacity: [1, 0.4, 0.9, 0.2, 0.8, 0.1, 0.6, 0], filter: ['blur(0px)', ..., 'blur(4px)'] }
dissolve-in: { opacity: [0, 0.6, 0.1, 0.8, 0.2, 0.9, 0.4, 1], filter: ['blur(4px)', ..., 'blur(0px)'] }
```

**Props:** `mode?: 'in' | 'out'` (default 'out'), `children` (content to dissolve)

---

### Phase 4: Barrel Export

Generate `index.ts`:

```typescript
// Components
export { BrandReveal, type BrandRevealProps } from './brand-reveal';
export { StaggerText, type StaggerTextProps } from './stagger-text';
export { GlitchReveal, type GlitchRevealProps } from './glitch-reveal';
export { PulseGlow, type PulseGlowProps } from './pulse-glow';
export { MorphShape, type MorphShapeProps } from './morph-shape';
export { ParticleOrbit, type ParticleOrbitProps } from './particle-orbit';
export { SpeedLines, type SpeedLinesProps } from './speed-lines';
export { FadeDissolve, type FadeDissolveProps } from './fade-dissolve';

// Utilities
export * from './lib/animations';
export * from './lib/motion-tokens';
```

### Phase 5: Validation (5 min)

1. Verify every component:
   - Exports a named props interface
   - Uses only `motion.*` elements from `framer-motion`
   - Uses only GPU-accelerated properties (`transform`, `opacity`, `filter`)
   - References CSS custom properties for all colors (no hex/rgb literals)
   - Handles `useReducedMotion()` with graceful fallback
   - Implements click-to-replay via onClick handler + animation key reset
   - Has no cross-component imports except from `lib/`

2. Verify shared utilities:
   - `motion-tokens.ts` exports all tokens with `as const` typing
   - `animations.ts` exports factory functions and hooks

3. Verify barrel:
   - All 8 components exported
   - All lib utilities re-exported
   - Named exports only (no default exports)

## Component Implementation Standards

### GPU-Accelerated Properties ONLY

The following CSS properties trigger GPU compositing and MUST be the only animated properties:

| Allowed | NOT Allowed (triggers layout/paint) |
|---------|-------------------------------------|
| `transform` (translate, scale, rotate, skew) | `width`, `height` |
| `opacity` | `top`, `left`, `right`, `bottom` |
| `filter` (blur, drop-shadow) | `margin`, `padding` |
| `clipPath` | `border-width` |
| SVG `d` (path data) | `font-size` |
| SVG `pathLength` | `background-color` |
| `boxShadow` (via style, not layout) | `color` (animate opacity instead) |

### TypeScript Standards

- All props interfaces exported with `export interface`
- No `any` types -- use `React.ReactNode`, `React.CSSProperties`, etc.
- Component functions use explicit return types where non-trivial
- `as const` for all constant arrays and objects
- Strict null checks respected

### Accessibility

Every component MUST:
1. Call `useReducedMotion()` from framer-motion
2. When reduced motion is preferred: render content instantly (opacity 1, no transforms)
3. Include `aria-hidden="true"` on purely decorative animation elements
4. Never use animation as the sole means of conveying information

### Click-to-Replay Pattern

Every component MUST support replay:

```typescript
const [animationKey, setAnimationKey] = useState(0);
const replay = () => setAnimationKey(k => k + 1);

return (
  <motion.div
    key={animationKey}
    onClick={replay}
    style={{ cursor: 'pointer' }}
    // ... variants and animate
  >
    {/* content */}
  </motion.div>
);
```

## Dependency Constraints

| Dependency | Version | Purpose | Note |
|------------|---------|---------|------|
| `framer-motion` | `^11.0.0` | Animation engine | ONLY animation library allowed |
| `react` | `^18.0.0` | UI framework | Peer dependency |
| `typescript` | `^5.0.0` | Type safety | Strict mode required |

**Explicitly forbidden:**
- GSAP, anime.js, Lottie, Three.js, react-spring
- Any animation library other than Framer Motion
- Inline `requestAnimationFrame` loops (let Framer handle frame scheduling)

## Acceptance Criteria

- [ ] All 8 animation components generated as .tsx files
- [ ] `lib/motion-tokens.ts` generated with all design tokens
- [ ] `lib/animations.ts` generated with shared variant factories
- [ ] `index.ts` barrel export generated
- [ ] Every component uses TypeScript props interface (exported)
- [ ] Every component uses `motion.*` elements exclusively
- [ ] Every component uses GPU-accelerated transforms only
- [ ] Every component uses CSS custom properties for colors (zero hardcoded colors)
- [ ] Every component handles `useReducedMotion()` gracefully
- [ ] Every component supports click-to-replay
- [ ] Every component has `autoPlay` and `delay` props
- [ ] No cross-component imports (only lib/ imports allowed)
- [ ] Zero TypeScript errors in strict mode
- [ ] Spring physics used where specified (StaggerText, ParticleOrbit, MorphShape, PulseGlow)
- [ ] SVG animations use Framer Motion (not SMIL)

## Quality Gate
- Threshold: >70%
- All generated components render without errors and pass TypeScript strict mode
- Every component respects useReducedMotion and uses GPU-accelerated properties only
- Animation selection rationale documented in motion-manifest.md

---
*Visual Production Squad Task -- Framer Motion Component Generation v2.0*
