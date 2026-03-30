# Branding Squad - Tech Stack

## Core Technologies

### Design Tokens
- **Format:** W3C DTCG 2025.10
- **Build Tool:** Style Dictionary 4.x
- **Sync:** Tokens Studio (Figma plugin)

### Creative Production
- **Rendering:** Satori (JSX to SVG)
- **Rasterization:** Sharp
- **Formats:** PNG, JPG, SVG, WebP

### Web Generation
- **Output:** Static HTML/CSS/JS
- **Styling:** Tailwind CSS
- **PDF:** Puppeteer

### AI Services
- **Copy:** Claude 3.5 Sonnet (primary), GPT-4o (fallback)
- **Images:** Flux 1.1 Pro (primary), DALL-E 3 (fallback)
- **Voice:** ElevenLabs (video only)

## Infrastructure

### Storage
- **Assets:** Cloudflare R2 (zero egress)
- **Path:** `r2://brand-assets/{client-id}/`

### Hosting
- **Static Sites:** Vercel, Netlify, any static host
- **CDN:** Cloudflare

### Operations
- **Project Management:** ClickUp
- **Approvals:** ClickUp workflows

## Dependencies

```json
{
  "style-dictionary": "^4.0.0",
  "sharp": "^0.33.0",
  "@vercel/og": "^0.6.0",
  "puppeteer": "^22.0.0",
  "tailwindcss": "^3.4.0",
  "fuse.js": "^7.0.0"
}
```

## File Formats

| Asset Type | Format | Notes |
|------------|--------|-------|
| Logo | SVG, PNG | SVG primary, PNG for fallback |
| Photos | JPG, WebP | WebP for web, JPG for compatibility |
| Icons | SVG | Always SVG |
| Social Posts | PNG | 1080px for Instagram |
| Thumbnails | JPG | 1280x720 for YouTube |
| Brand Book | HTML, PDF, ZIP | Triple delivery |

---
*Branding Squad Config*
