# Visual Production Squad - Tech Stack

## Core Technologies

### Image Processing
- **Engine:** Sharp (libvips-based, fast image processing)
- **Formats:** WebP, AVIF, PNG, JPG, TIFF, SVG
- **SVG Optimization:** SVGO
- **Metadata:** ExifTool (reading/stripping)

### AI Image Generation
- **Primary:** Flux 1.1 Pro (photorealism, composition)
- **Secondary:** DALL-E 3 (concept art, illustration)
- **Alternative:** Midjourney v6 (artistic, editorial)
- **Local:** Stable Diffusion XL (control, inpainting)

### Motion & Animation

**Primary Engine: Framer Motion 11**

Framer Motion is the SOLE animation library for all motion work in this squad. No other animation libraries are permitted.

| Capability | Framer Motion API | Notes |
|------------|------------------|-------|
| Element animation | `motion.*` components | Div, span, svg, path, etc. |
| Variants | `variants` prop + `animate` | Declarative state machines |
| Spring physics | `type: 'spring'` transition | Stiffness, damping, mass |
| SVG path animation | `motion.path` + `pathLength` | Draw-on effects, morphing |
| SVG shape morphing | `motion.path` + `d` attribute | Path data interpolation |
| Gesture animations | `whileHover`, `whileTap`, `whileDrag` | Interactive responses |
| Scroll animations | `whileInView`, `useScroll` | Viewport-triggered |
| Layout animations | `layout` prop, `layoutId` | Shared layout transitions |
| Exit animations | `AnimatePresence` | Unmount animations |
| Orchestration | `staggerChildren`, `delayChildren` | Sequenced group animation |
| Reduced motion | `useReducedMotion()` hook | Accessibility |
| Animation controls | `useAnimationControls()` | Imperative control (use sparingly) |

**Explicitly Forbidden Animation Libraries:**

| Library | Status | Reason |
|---------|--------|--------|
| GSAP | FORBIDDEN | License complexity, bundle size, unnecessary given FM capabilities |
| anime.js | FORBIDDEN | Redundant with Framer Motion |
| Lottie / lottie-web | FORBIDDEN for new work | Requires After Effects workflow; Framer Motion can replicate effects in code |
| Three.js | FORBIDDEN | 3D not in scope; massive bundle |
| react-spring | FORBIDDEN | API overlap with Framer Motion spring physics |
| Web Animations API (direct) | FORBIDDEN | Use Framer Motion's abstraction instead |
| SMIL (SVG animation) | FORBIDDEN | Deprecated in most contexts; use Framer Motion `motion.path` |

**Migration Note:** Existing Lottie assets remain supported for playback via `lottie-react` in legacy contexts, but all NEW animation work MUST use Framer Motion components.

#### GPU-Accelerated Properties (Mandatory)

All animations MUST use only GPU-composited CSS properties:

| Allowed (GPU-composited) | Forbidden (triggers layout/paint) |
|--------------------------|-----------------------------------|
| `transform` (translate, scale, rotate, skew) | `width`, `height` |
| `opacity` | `top`, `left`, `right`, `bottom` |
| `filter` (blur, brightness, drop-shadow) | `margin`, `padding` |
| `clipPath` | `border-width`, `border-radius` (animate) |
| `boxShadow` (via style prop) | `font-size`, `line-height` |
| SVG `d` (path data) | `background-color`, `color` |
| SVG `pathLength`, `strokeDasharray` | `background-position` |

**Rationale:** GPU-composited properties avoid triggering browser layout recalculation and paint, ensuring 60fps on mid-range devices. Framer Motion automatically optimizes `transform` and `opacity` for GPU compositing.

#### Spring Physics Configuration

Spring physics provide natural, physically-based motion. Default profiles:

| Profile | Stiffness | Damping | Mass | Character | When to Use |
|---------|-----------|---------|------|-----------|-------------|
| Gentle | 100 | 15 | 1.0 | Soft, floaty | Content entrances, tooltips |
| Bouncy | 300 | 10 | 1.0 | Playful overshoot | Buttons, cards, emphasis |
| Snappy | 400 | 25 | 0.8 | Quick, precise | Menus, toggles, tabs |
| Slow | 50 | 20 | 1.5 | Heavy, deliberate | Page transitions, modals |
| Elastic | 200 | 8 | 0.5 | Whip-like snap | Drag release, flick gestures |

**Spring vs Tween Decision Guide:**

| Use Spring | Use Tween (easing curve) |
|------------|--------------------------|
| User-initiated interactions | Timed sequences (brand reveals) |
| Draggable elements | Looping animations |
| Bouncy/elastic effects | Opacity-only transitions |
| Natural-feeling entrances | Precise timing control needed |
| Gesture responses | Exit animations |

#### SVG Animation via Framer Motion

All SVG animation uses Framer Motion's `motion.svg`, `motion.path`, `motion.circle`, etc.:

| Effect | Technique | Example |
|--------|-----------|---------|
| Draw on | `pathLength: 0 -> 1` | Line drawing, icon reveal |
| Morph | Animate `d` attribute | Shape transformation |
| Stroke dash | `strokeDasharray`, `strokeDashoffset` | Progress indicators |
| Color | `stroke`, `fill` via CSS variables | Brand color transitions |
| Scale/rotate | `transform` on SVG group | Spinning icons, growing shapes |

**Important:** SVG path morphing (animating `d`) requires source and target paths to have the same number and type of commands for smooth interpolation. Use a path normalization utility or design paths with matching control points.

### Asset Management
- **CDN:** Cloudflare R2 (zero egress)
- **Upload:** Wrangler CLI (R2 operations)
- **Manifest:** JSON-based asset registry
- **Hashing:** Content-hash for cache busting

## Infrastructure

### Storage
- **Source files:** Local filesystem / Git LFS
- **Optimized assets:** Cloudflare R2
- **Path pattern:** `r2://assets/{project}/{category}/`
- **Backup:** Automated R2 lifecycle rules

### Delivery
- **CDN:** Cloudflare (global edge network)
- **Cache:** Immutable caching with content-hash
- **Compression:** Brotli for text (SVG, JSON, TSX), native for images
- **Edge functions:** For dynamic image transformation (if needed)

### Development
- **Node.js:** 20+ (Sharp requires N-API)
- **React:** 18+ (required for Framer Motion 11)
- **TypeScript:** 5+ (strict mode)
- **Package manager:** npm
- **Task runner:** npm scripts

## Dependencies

```json
{
  "dependencies": {
    "framer-motion": "^11.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "sharp": "^0.33.0",
    "svgo": "^3.2.0",
    "wrangler": "^3.0.0",
    "typescript": "^5.0.0",
    "@types/react": "^18.0.0"
  },
  "optionalDependencies": {
    "ffmpeg-static": "^5.2.0",
    "lottie-react": "^2.4.0"
  }
}
```

**Dependency Notes:**
- `framer-motion` is the primary runtime dependency for all animation components
- `lottie-react` is optional, kept only for legacy Lottie asset playback
- `ffmpeg-static` is optional, used only for video processing tasks
- `sharp`, `svgo`, `wrangler` are dev/build dependencies, not shipped to client

## AI Model Configuration

| Model | API | Cost Tier | Speed | Quality |
|-------|-----|-----------|-------|---------|
| Flux 1.1 Pro | Replicate / BFL | Medium | Fast | Excellent |
| DALL-E 3 | OpenAI | Medium | Fast | Very Good |
| Midjourney v6 | Discord / API | High | Slow | Excellent |
| SDXL | Local / Replicate | Low | Medium | Good |

### Model Selection Guide
| Need | Use |
|------|-----|
| Photorealistic hero images | Flux 1.1 Pro |
| Conceptual illustrations | DALL-E 3 |
| Artistic/editorial imagery | Midjourney v6 |
| Batch with fine control | SDXL |
| Inpainting / outpainting | SDXL |

## Format Support Matrix

| Format | Read | Write | Optimize | Best For |
|--------|------|-------|----------|----------|
| WebP | Yes | Yes | Yes | Web primary |
| AVIF | Yes | Yes | Yes | Web next-gen |
| PNG | Yes | Yes | Yes | Social, transparency |
| JPG | Yes | Yes | Yes | Fallback, email |
| TIFF | Yes | Yes | No | Print |
| SVG | Yes | No* | Yes (SVGO) | Icons, vectors, animation paths |
| TSX | -- | Yes | -- | Framer Motion components |
| MP4 | Yes (FFmpeg) | Yes (FFmpeg) | Yes | Video |
| GIF | Yes | Yes | Yes | Legacy animation |

*SVG files are authored by designers, optimized by SVGO, and animated via Framer Motion `motion.path`.

## Performance Targets

| Operation | Target |
|-----------|--------|
| Single image resize | < 200ms |
| Format conversion (per image) | < 500ms |
| Batch of 10 images | < 3s |
| Component generation (single) | < 30s |
| Full motion component suite (8) | < 5min |
| CDN upload (per file) | < 2s |
| Full pipeline (10 images) | < 30s |
| Animation frame rate (runtime) | 60fps sustained |
| Animation bundle size (per component) | < 5KB gzipped |
| Total motion bundle (8 components + lib) | < 25KB gzipped |

---

*Visual Production Squad Config -- Tech Stack v2.0 (Framer Motion Primary)*
