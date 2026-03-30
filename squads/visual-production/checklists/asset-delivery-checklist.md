# Asset Delivery Checklist

Verifies assets are ready for deployment and integration.

## Format Coverage

- [ ] **WebP generated** - Primary web format available
- [ ] **AVIF generated** - Next-gen format for modern browsers
- [ ] **Fallback available** - JPG or PNG for legacy support
- [ ] **SVG for vectors** - Icons and logos in SVG format
- [ ] **Lottie validated** - Animations pass LottieFiles validator

## Size Variants

- [ ] **Responsive sizes generated** - 320w, 640w, 1024w, 1920w minimum
- [ ] **Social platform sizes** - 1080x1080, 1080x1920, 1200x630 as needed
- [ ] **Thumbnail variants** - 640x360, 320x180 for video/card thumbnails
- [ ] **Retina variants** - @2x versions where required
- [ ] **OG image** - 1200x630 for social sharing

## Naming & Organization

- [ ] **Naming convention** - All files follow `{project}-{category}-{descriptor}-{size}.{ext}`
- [ ] **Folder structure** - Organized by category (hero/, social/, icon/, etc.)
- [ ] **No spaces in filenames** - Kebab-case only
- [ ] **Lowercase filenames** - All filenames lowercase
- [ ] **No special characters** - Only alphanumeric, hyphens, dots

## Metadata & Documentation

- [ ] **Manifest generated** - manifest.json with metadata per asset
- [ ] **Alt text documented** - Descriptive alt text for every image
- [ ] **License documented** - Source/license info for stock or AI-generated
- [ ] **Version tracked** - File version in manifest or filename
- [ ] **Usage notes included** - Where and how to use each asset

## CDN Readiness

- [ ] **Cache headers planned** - TTL defined per asset type
- [ ] **Content-hash versioning** - Hash in filename for cache busting
- [ ] **Content-type correct** - MIME types verified per format
- [ ] **CORS configured** - If cross-origin access needed
- [ ] **Compression applied** - Brotli/gzip for text-based assets (SVG, JSON)

## Integration Artifacts

- [ ] **srcset snippets** - HTML picture/source elements provided
- [ ] **CSS custom properties** - Image URLs as CSS variables if applicable
- [ ] **CDN URL mapping** - Local path to CDN URL mapping documented
- [ ] **Loading strategy** - lazy/eager/priority documented per asset
- [ ] **Preload hints** - Critical assets identified for `<link rel="preload">`

## Quality Final Check

- [ ] **Spot check at each size** - Visual quality verified at every breakpoint
- [ ] **Total page weight** - Combined image weight < 1MB for typical page
- [ ] **LCP impact assessed** - Hero image load time < 2.5s
- [ ] **No broken references** - All URLs/paths resolve correctly
- [ ] **Rollback plan** - Previous version accessible if issues found

---

## Scoring

| Score | Rating | Action |
|-------|--------|--------|
| 90-100% | Ship-ready | Deploy to production |
| 75-89% | Near-ready | Fix remaining items, then deploy |
| 60-74% | Gaps exist | Address before deployment |
| Below 60% | Not ready | Major rework needed |

---

*Visual Production Squad - Asset Delivery Checklist v1.0*
