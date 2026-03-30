# Image Specifications

Resolution standards, aspect ratios, and format requirements per channel and asset type.

---

## Standard Dimensions

### Web Assets
| Asset | Dimensions | Aspect Ratio | Format | Max Size |
|-------|-----------|-------------|--------|----------|
| Hero Banner | 1920x1080 | 16:9 | WebP, AVIF, JPG | 200KB |
| Hero Mobile | 768x1024 | 3:4 | WebP, JPG | 150KB |
| Section Image | 1280x720 | 16:9 | WebP, JPG | 150KB |
| Card Thumbnail | 640x360 | 16:9 | WebP, JPG | 50KB |
| Avatar | 200x200 | 1:1 | WebP, PNG | 20KB |
| Favicon | 32x32 | 1:1 | PNG, ICO | 5KB |
| Apple Touch Icon | 180x180 | 1:1 | PNG | 15KB |
| OG Image | 1200x630 | ~1.9:1 | JPG, PNG | 100KB |
| Twitter Card | 1200x675 | 16:9 | JPG, PNG | 100KB |

### Social Media - Instagram
| Asset | Dimensions | Aspect Ratio | Format | Notes |
|-------|-----------|-------------|--------|-------|
| Feed Post (Square) | 1080x1080 | 1:1 | PNG, JPG | Most common |
| Feed Post (Portrait) | 1080x1350 | 4:5 | PNG, JPG | Best engagement |
| Feed Post (Landscape) | 1080x566 | ~1.91:1 | PNG, JPG | Least common |
| Story / Reel | 1080x1920 | 9:16 | PNG, MP4 | Full screen |
| Carousel | 1080x1080 | 1:1 | PNG | Per slide |
| Profile Photo | 320x320 | 1:1 | JPG | Displayed at 110px |

### Social Media - LinkedIn
| Asset | Dimensions | Aspect Ratio | Format |
|-------|-----------|-------------|--------|
| Post Image | 1200x627 | ~1.91:1 | PNG, JPG |
| Article Cover | 1200x644 | ~1.86:1 | PNG, JPG |
| Profile Banner | 1584x396 | 4:1 | PNG, JPG |
| Company Banner | 1128x191 | ~5.9:1 | PNG, JPG |

### Social Media - Twitter/X
| Asset | Dimensions | Aspect Ratio | Format |
|-------|-----------|-------------|--------|
| Post Image | 1200x675 | 16:9 | PNG, JPG |
| Header Photo | 1500x500 | 3:1 | PNG, JPG |
| Profile Photo | 400x400 | 1:1 | PNG, JPG |

### Social Media - Facebook
| Asset | Dimensions | Aspect Ratio | Format |
|-------|-----------|-------------|--------|
| Post Image | 1200x630 | ~1.91:1 | PNG, JPG |
| Cover Photo | 820x312 | ~2.63:1 | PNG, JPG |
| Event Cover | 1920x1005 | ~1.91:1 | PNG, JPG |
| Ad Image | 1200x628 | ~1.91:1 | PNG, JPG |

### Social Media - TikTok
| Asset | Dimensions | Aspect Ratio | Format |
|-------|-----------|-------------|--------|
| Video | 1080x1920 | 9:16 | MP4 |
| Thumbnail | 1080x1920 | 9:16 | JPG |

### YouTube
| Asset | Dimensions | Aspect Ratio | Format |
|-------|-----------|-------------|--------|
| Thumbnail | 1280x720 | 16:9 | JPG |
| Channel Banner | 2560x1440 | 16:9 | PNG, JPG |
| Video | 1920x1080 | 16:9 | MP4 |

## Responsive Breakpoints

| Breakpoint | Width | Target Device |
|-----------|-------|--------------|
| xs | 320px | Small phone |
| sm | 640px | Large phone |
| md | 768px | Tablet portrait |
| lg | 1024px | Tablet landscape |
| xl | 1280px | Small desktop |
| 2xl | 1920px | Full desktop |

### srcset Generation
```html
<picture>
  <source
    srcset="image-320w.avif 320w,
            image-640w.avif 640w,
            image-1024w.avif 1024w,
            image-1920w.avif 1920w"
    sizes="(max-width: 640px) 100vw,
           (max-width: 1024px) 80vw,
           1200px"
    type="image/avif">
  <source
    srcset="image-320w.webp 320w,
            image-640w.webp 640w,
            image-1024w.webp 1024w,
            image-1920w.webp 1920w"
    sizes="(max-width: 640px) 100vw,
           (max-width: 1024px) 80vw,
           1200px"
    type="image/webp">
  <img
    src="image-1920w.jpg"
    alt="Description"
    loading="lazy"
    decoding="async"
    width="1920"
    height="1080">
</picture>
```

## Color Space Standards

| Use Case | Color Space | Bit Depth | ICC Profile |
|----------|------------|-----------|-------------|
| Web / Screen | sRGB | 8-bit | sRGB IEC61966-2.1 |
| HDR Web | Display P3 | 10-bit | Display P3 |
| Print | CMYK | 8-bit | FOGRA39 or US Web Coated |
| Photography (archive) | Adobe RGB | 16-bit | Adobe RGB (1998) |

## Compression Quality Guide

| Quality Level | WebP | AVIF | JPG | Use Case |
|--------------|------|------|-----|----------|
| Maximum | 95% | 90% | 97% | Print-quality, portfolio |
| High | 85% | 80% | 90% | Web hero, marketing |
| Standard | 75% | 70% | 80% | General web, cards |
| Optimized | 65% | 60% | 70% | Thumbnails, previews |
| Minimum | 50% | 45% | 60% | Placeholders, LQIP |

## Print Specifications

| Element | Specification |
|---------|--------------|
| Resolution | 300 DPI minimum |
| Color Space | CMYK |
| Bleed | 3mm on all sides |
| Safe Zone | 5mm from trim edge |
| File Format | TIFF (preferred), PDF/X-4 |
| Overprint | Black text set to overprint |
| Rich Black | C:60 M:40 Y:40 K:100 |

## Icon Specifications

| Platform | Size | Format | Notes |
|----------|------|--------|-------|
| UI (small) | 16x16 | SVG | Pixel-hinted at this size |
| UI (default) | 24x24 | SVG | Standard UI icon size |
| UI (large) | 32x32 | SVG | Prominent actions |
| Touch target | 48x48 | SVG | Minimum touch area |
| App icon (iOS) | 1024x1024 | PNG | AppStore, auto-scaled |
| App icon (Android) | 512x512 | PNG | Adaptive icon format |

---

*Visual Production Squad - Image Specifications v1.0*
