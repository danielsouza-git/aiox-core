# Visual Quality Checklist

Universal quality checklist for all visual assets.

## Resolution & Dimensions

- [ ] **Correct dimensions** - Asset matches specified size (WxH)
- [ ] **Sufficient resolution** - Min 72 DPI for web, 300 DPI for print
- [ ] **No upscaling artifacts** - Image not stretched beyond native resolution
- [ ] **Aspect ratio correct** - Matches intended format (16:9, 1:1, 9:16)
- [ ] **Safe zone respected** - Key content within safe margins

## Color & Tone

- [ ] **Color space correct** - sRGB for web, CMYK for print
- [ ] **Brand palette adherence** - Only approved colors used
- [ ] **Contrast ratio** - Meets WCAG AA (4.5:1 text, 3:1 large text)
- [ ] **White balance accurate** - No unintended color cast
- [ ] **Exposure balanced** - No blown highlights or crushed shadows
- [ ] **Color consistency** - Matches other assets in the set

## Format & Compression

- [ ] **Correct format** - WebP for web, PNG for social, TIFF for print
- [ ] **File size within target** - Hero < 200KB, thumb < 50KB, social < 500KB
- [ ] **Quality setting appropriate** - No visible compression artifacts
- [ ] **Progressive loading** - JPGs use progressive encoding for web
- [ ] **Transparency preserved** - PNG/WebP alpha channel intact where needed

## Metadata & Naming

- [ ] **Naming convention followed** - `{project}-{category}-{descriptor}-{size}.{ext}`
- [ ] **Metadata stripped** - No EXIF GPS, camera info removed for web
- [ ] **Copyright preserved** - Copyright metadata retained if required
- [ ] **Alt text prepared** - Descriptive alt text documented
- [ ] **Manifest entry exists** - Asset logged in manifest.json

## Technical Quality

- [ ] **No visible artifacts** - Clean at 100% zoom
- [ ] **Edges clean** - No jagged edges on cutouts/masks
- [ ] **Sharpening appropriate** - For intended medium (screen vs print)
- [ ] **No banding** - Gradients smooth, no visible steps
- [ ] **No halos** - Clean edges without light/dark fringing

## Accessibility

- [ ] **Sufficient contrast** - Text overlays readable on all backgrounds
- [ ] **Color not sole indicator** - Information not conveyed by color alone
- [ ] **Alt text meaningful** - Describes content, not just "image"
- [ ] **Decorative images marked** - `aria-hidden` or empty alt for decorative

---

## Scoring

| Score | Rating | Action |
|-------|--------|--------|
| 90-100% | Excellent | Ready for delivery |
| 75-89% | Good | Minor fixes needed |
| 60-74% | Fair | Significant fixes needed |
| Below 60% | Poor | Redo required |

---

*Visual Production Squad - Quality Checklist v1.0*
