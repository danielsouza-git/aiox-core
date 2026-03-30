# Motion Quality Checklist

Quality standards for all motion design and animation deliverables.

## Performance

- [ ] **Frame rate** - Maintains 60fps (or 30fps for Lottie web) consistently
- [ ] **No frame drops** - Smooth playback on target device class
- [ ] **CPU impact** - Animation does not spike CPU above 15% on mid-range device
- [ ] **GPU acceleration** - Uses `transform` and `opacity` for hardware-accelerated properties
- [ ] **No jank** - No visible stuttering during playback

## File Size

- [ ] **Lottie < 150KB** - JSON file under size limit
- [ ] **GIF < 5MB** - If GIF output required
- [ ] **Video < 2MB** - For short loops (< 5s)
- [ ] **CSS animation < 5KB** - Keyframe definitions lean
- [ ] **Total page motion < 500KB** - Combined animation weight manageable

## Timing & Easing

- [ ] **Durations appropriate** - Matches interaction type (100-800ms range)
- [ ] **Easing curves correct** - ease-out for entrances, ease-in for exits
- [ ] **No linear motion** - Unless intentional (progress bars, spinners)
- [ ] **Stagger timing natural** - Sequential elements have consistent delay
- [ ] **Loop seamless** - No visible jump at loop point

## Accessibility

- [ ] **prefers-reduced-motion** - Alternative provided (instant or no animation)
- [ ] **No flashing** - Content does not flash more than 3 times per second
- [ ] **Motion not sole indicator** - Information not conveyed by motion alone
- [ ] **Pause/stop available** - User can stop continuous animations
- [ ] **Duration reasonable** - Animations do not trap user attention excessively

## Lottie-Specific

- [ ] **No raster images** - Only shape layers and vector paths
- [ ] **Layer count < 30** - Keep composition manageable
- [ ] **No expressions** - Use keyframes for cross-platform compatibility
- [ ] **Valid JSON** - Passes LottieFiles validator
- [ ] **Player tested** - Works in lottie-web, lottie-react, lottie-ios
- [ ] **Naming conventions** - Layers named descriptively (not "Shape Layer 1")

## CSS Animation Specific

- [ ] **No layout triggers** - Avoids animating width, height, top, left
- [ ] **will-change declared** - Hint browser for complex animations
- [ ] **Animation cleanup** - Removes will-change after animation completes
- [ ] **Keyframes named** - Descriptive names (not @keyframes a1, a2)
- [ ] **Vendor prefixes** - Included where still needed

## Brand Alignment

- [ ] **Colors match brand** - Animation uses approved palette
- [ ] **Motion style consistent** - Matches other brand animations
- [ ] **Personality reflected** - Motion energy level matches brand personality
- [ ] **No off-brand effects** - No gratuitous effects (lens flare, glitch, etc.)

---

## Scoring

| Score | Rating | Action |
|-------|--------|--------|
| 90-100% | Production-ready | Ship it |
| 75-89% | Good | Minor timing/size tweaks |
| 60-74% | Fair | Performance or accessibility fixes needed |
| Below 60% | Poor | Significant rework required |

---

*Visual Production Squad - Motion Quality Checklist v1.0*
