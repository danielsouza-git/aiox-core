# cdn-optimize

```yaml
task:
  id: cdn-optimize
  name: CDN Optimization & Deployment
  agent: asset-manager
  squad: visual-production
  type: deployment
  elicit: true

inputs:
  required:
    - assets: "Assets to deploy to CDN"
    - cdn_provider: "CDN provider (cloudflare-r2, vercel, custom)"
    - project_id: "Project identifier for path structure"
  optional:
    - cache_strategy: "Cache TTL and invalidation rules"
    - custom_path: "Override default path structure"
    - compression: "Additional compression (brotli, gzip)"
    - versioning: "content-hash or query-param"

outputs:
  - cdn-manifest.json: "Deployed asset URLs and metadata"
  - cdn-report.md: "Deployment report with performance metrics"
  - integration-snippets.md: "Ready-to-use URL patterns and code"

pre_conditions:
  - "Assets optimized and export-ready"
  - "CDN provider credentials configured"
  - "Project path structure defined"

post_conditions:
  - "All assets uploaded to CDN"
  - "Cache headers configured"
  - "Content-hash versioning applied"
  - "CDN URLs documented and accessible"
```

## Purpose

Deploy optimized visual assets to a CDN with proper caching, versioning, and delivery configuration. Ensure fast global delivery with cache busting support.

## Workflow

### Phase 1: Pre-Upload Validation (5 min)
1. Verify all assets are optimized (format, size, quality)
2. Check naming convention compliance
3. Validate no sensitive metadata in files
4. Calculate total upload size
5. Verify CDN credentials and access

### Phase 2: Path Structure (5 min)
Define CDN path structure:
```
/{version}/{project}/{category}/{filename}

Examples:
/v1/acme/hero/homepage-dark-1920x1080.webp
/v1/acme/social/instagram-post-01-1080x1080.png
/v1/acme/motion/loader-primary.json
```

For content-hash versioning:
```
/{project}/{category}/{hash}-{filename}

Example:
/acme/hero/a1b2c3-homepage-dark-1920x1080.webp
```

### Phase 3: Upload (varies)
1. Upload assets to CDN in parallel (batch of 10)
2. Set content-type headers per format:
   | Format | Content-Type |
   |--------|-------------|
   | WebP | image/webp |
   | AVIF | image/avif |
   | PNG | image/png |
   | JPG | image/jpeg |
   | SVG | image/svg+xml |
   | JSON (Lottie legacy) | application/json |
   | MP4 | video/mp4 |
3. Apply cache-control headers:
   ```
   Cache-Control: public, max-age=31536000, immutable
   ```
4. Set CORS headers if cross-origin access needed
5. Log upload status per file

### Phase 4: Cache Configuration (5 min)
| Asset Type | Cache TTL | Strategy |
|-----------|-----------|----------|
| Images (hashed) | 1 year | Immutable, content-hash busting |
| Images (versioned) | 30 days | Query param busting |
| Animations | 1 year | Immutable |
| Frequently updated | 1 hour | Short TTL + purge on deploy |

### Phase 5: Verification & Documentation (10 min)
1. Verify each uploaded asset is accessible via CDN URL
2. Test response headers (cache-control, content-type, CORS)
3. Measure TTFB from 2-3 geographic regions
4. Generate cdn-manifest.json:
   ```json
   {
     "cdn_base": "https://cdn.example.com/v1/acme",
     "deployed_at": "2026-03-27T12:00:00Z",
     "total_assets": 45,
     "total_size_mb": 8.5,
     "assets": [
       {
         "local": "hero/homepage-dark-1920x1080.webp",
         "cdn_url": "https://cdn.example.com/v1/acme/hero/a1b2c3-homepage-dark-1920x1080.webp",
         "size": "185KB",
         "cache_ttl": "31536000",
         "content_hash": "a1b2c3"
       }
     ]
   }
   ```
5. Create integration snippets for developers

## CDN Provider Config

### Cloudflare R2
```bash
# Upload
wrangler r2 object put assets/{project}/{path} --file={local_path}

# Purge cache
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone}/purge_cache" \
  -H "Authorization: Bearer {token}" \
  -d '{"files":["https://cdn.example.com/path"]}'
```

### Vercel Edge
```bash
# Deploy via Vercel CLI
vercel deploy --prod
```

## Elicitation Questions

```yaml
elicit:
  - question: "Which CDN provider?"
    options:
      - "Cloudflare R2 (zero egress cost)"
      - "Vercel Edge Network"
      - "AWS CloudFront + S3"
      - "Custom CDN"

  - question: "What versioning strategy?"
    options:
      - "Content-hash in filename (recommended)"
      - "Query parameter (?v=hash)"
      - "Path versioning (/v1/, /v2/)"
```

## Acceptance Criteria

- [ ] All assets uploaded to CDN
- [ ] CDN URLs accessible and verified
- [ ] Cache-control headers configured
- [ ] Content-type headers correct per format
- [ ] Versioning/cache-busting applied
- [ ] CDN manifest with all URLs generated
- [ ] Integration snippets provided
- [ ] TTFB verified acceptable (< 100ms)

## Quality Gate
- Threshold: >70%
- All assets uploaded and accessible via CDN URLs
- Cache-control and content-type headers correctly configured
- TTFB verified acceptable (<100ms) from at least 2 regions

---
*Visual Production Squad Task*
