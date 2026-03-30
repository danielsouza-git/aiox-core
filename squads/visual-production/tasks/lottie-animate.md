# lottie-animate

> **DEPRECATED:** This task is superseded by `motion-create.md` using Framer Motion 11.
> All new animation work MUST use Framer Motion components. Lottie is only supported
> for legacy asset playback via `lottie-react` (optional dependency).

```yaml
task:
  id: lottie-animate
  name: Create Lottie Animation (DEPRECATED)
  agent: motion-designer
  squad: visual-production
  type: creation
  elicit: false
  deprecated: true
  replacement: motion-create.md

inputs:
  required: []
  optional: []

outputs: []

pre_conditions:
  - "This task is DEPRECATED. Use motion-create.md instead."

post_conditions:
  - "Redirect to Framer Motion workflow"
```

## Migration Notice

**Lottie animations are no longer created for new work.** The visual-production squad
uses Framer Motion 11 exclusively for all animation.

### What changed

| Before | After |
|--------|-------|
| Lottie JSON files | Framer Motion React/TSX components |
| After Effects workflow | Code-first animation with motion.* |
| lottie-web / lottie-react playback | Native React component rendering |
| Shape layer constraints | GPU-accelerated transform/opacity |
| JSON file size limits (150KB) | Tree-shaken component bundles (<5KB gzip) |

### What to do instead

1. Use `*animate` command (runs `motion-create.md` task)
2. Create Framer Motion components with `motion.*` elements
3. Use spring physics, AnimatePresence, and layout animations
4. Export as React/TSX components, not JSON files

### Legacy Lottie playback

Existing Lottie assets remain supported for playback via `lottie-react` (optional dependency).
To play legacy Lottie files:

```tsx
import Lottie from 'lottie-react';
import animationData from './legacy-animation.json';

export function LegacyAnimation() {
  return <Lottie animationData={animationData} loop />;
}
```

**Do NOT create new Lottie files.** Migrate existing ones to Framer Motion as capacity allows.

## Quality Gate
- Threshold: >70%
- Task is deprecated; redirect to motion-create.md for all new work
- Legacy Lottie assets play correctly via lottie-react if still in use

---
*Visual Production Squad Task (DEPRECATED)*
