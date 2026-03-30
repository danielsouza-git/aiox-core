# static-export-validate

```yaml
task:
  id: static-export-validate
  name: Static Export Validation
  agent: performance-auditor
  squad: qa-accessibility
  type: validation
  elicit: false

inputs:
  required:
    - app_path: "Path to the Next.js application root (contains out/ after build)"
  optional:
    - expected_routes: "List of expected routes to verify in out/ (default: auto-detect from app/)"
    - max_page_size_kb: "Maximum HTML page size in KB (default: 200)"
    - check_offline: "Verify the static site works without external API calls (default: true)"

outputs:
  - static_export_report.md: "Full static export validation report"
  - broken_links.json: "Machine-readable list of broken internal links"
  - missing_assets.json: "Machine-readable list of missing assets"

pre_conditions:
  - "Next.js build completed successfully (next-build-validate passed)"
  - "out/ directory exists at {app_path}/out/"
  - "next.config has output: 'export' configured"

post_conditions:
  - "out/index.html exists and is valid HTML"
  - "All internal links resolve to existing files"
  - "All images and assets present in out/"
  - "No server-side features detected"
  - "File sizes within acceptable limits"
  - "Static site is self-contained (no required external API calls)"

tools:
  - node
  - playwright
```

## Purpose

Validate the static export (`out/` directory) produced by `next build` with `output: 'export'`. Verify that all pages, assets, and links are present and functional. Ensure the static site works as a standalone deployment without requiring a Node.js server or external API calls.

## Workflow

### Phase 1: Directory Structure Validation (5 min)

1. Verify `{app_path}/out/` directory exists
2. Verify `{app_path}/out/index.html` exists and is non-empty
3. Scan for expected route directories:

| Expected Path | Description |
|--------------|-------------|
| `out/index.html` | Root landing page |
| `out/brandbook/index.html` | Brand book entry |
| `out/brandbook/guidelines/index.html` | Guidelines pillar |
| `out/brandbook/foundations/index.html` | Foundations pillar |
| `out/brandbook/components/index.html` | Components pillar |
| `out/brandbook/patterns/index.html` | Patterns pillar |

4. If `expected_routes` input provided, verify each route has an `index.html`
5. If not provided, auto-detect routes from `{app_path}/app/` directory structure
6. Count total HTML files and compare against expected route count
7. Flag any expected routes missing from `out/`

### Phase 2: HTML Integrity Check (10 min)

1. Parse `out/index.html`:
   - Verify valid HTML5 doctype (`<!DOCTYPE html>`)
   - Verify `<html lang="...">` attribute present
   - Verify `<meta charset="utf-8">` present
   - Verify `<title>` tag is non-empty
   - Verify `<meta name="viewport">` present
2. For each HTML file in `out/`:
   - Check for empty `<body>` (indicates render failure)
   - Check for React error boundaries in HTML (e.g., "Application error")
   - Check for `<noscript>` fallback content
   - Verify no inline `<script>` tags contain `throw new Error` patterns
3. Verify no HTML files contain error markers:
   - `__NEXT_DATA__` with error properties
   - React hydration error messages baked into HTML

### Phase 3: Internal Link Validation (10 min)

1. Parse all HTML files in `out/`
2. Extract all `<a href="...">` attributes
3. Classify links:
   - **Internal links** (`/`, `/brandbook/`, relative paths) -- must resolve
   - **Anchor links** (`#section-id`) -- verify target ID exists in same page
   - **External links** (`https://...`) -- note but do not validate
4. For each internal link:
   - Resolve relative to the containing HTML file's location
   - Check that the target file exists in `out/`
   - For paths like `/brandbook/guidelines`, check both `/brandbook/guidelines/index.html` and `/brandbook/guidelines.html`
5. Report all broken internal links with source file and line number
6. Verdict: FAIL if any broken internal links exist

### Phase 4: Asset Completeness (10 min)

1. **JavaScript/CSS bundles:**
   - Verify `out/_next/` directory exists
   - Verify at least one `.js` bundle file exists in `out/_next/static/`
   - Verify at least one `.css` file exists in `out/_next/static/`
   - Check that all `<script src="...">` and `<link href="...">` tags in HTML reference files that exist in `out/`

2. **Images:**
   - List all files in `out/images/` and `out/assets/`
   - Parse all HTML files for `<img src="...">` tags
   - Parse CSS files for `url(...)` references to images
   - Verify every referenced image file exists in `out/`
   - Report missing images with the referencing file

3. **Fonts:**
   - Check for font files in `out/_next/static/media/` or `out/fonts/`
   - Parse CSS for `@font-face` declarations
   - Verify referenced font files exist
   - Note: Next.js font optimization may inline fonts as data URIs (acceptable)

4. **Favicon and metadata assets:**
   - Check for `out/favicon.ico` or `out/icon.png`
   - Verify `<link rel="icon">` references resolve

### Phase 5: Server-Side Feature Detection (5 min)

Static export is incompatible with certain Next.js features. Verify none are present:

| Feature | Detection Method | Severity |
|---------|-----------------|----------|
| API routes | Check for `out/api/` directory | CRITICAL -- must not exist |
| Server Actions | Grep for `'use server'` in HTML/JS bundles | CRITICAL |
| Server Components with DB | Grep JS bundles for database connection strings | CRITICAL |
| Dynamic routes without static params | Routes missing from `out/` that exist in `app/` | ERROR |
| Middleware | Check for `out/_middleware.js` | ERROR |
| ISR/SSR markers | Check HTML for `__NEXT_DATA__` with `revalidate` | WARNING |

1. Scan `out/` for any of the above
2. If CRITICAL features detected: FAIL with explanation
3. If ERROR features detected: FAIL with remediation guidance
4. If WARNING features detected: WARN and document

### Phase 6: File Size and Performance (5 min)

1. Calculate total `out/` directory size
2. Measure individual page sizes:

| Metric | Target | Warning | Critical |
|--------|--------|---------|----------|
| Total out/ size | < 10MB | < 25MB | >= 50MB |
| Single HTML file | < 200KB | < 500KB | >= 1MB |
| Single image | < 500KB | < 1MB | >= 2MB |
| Total images | < 5MB | < 15MB | >= 30MB |
| CSS total | < 100KB | < 250KB | >= 500KB |
| JS total (first load) | < 500KB | < 750KB | >= 1MB |

3. List the 10 largest files in `out/` with sizes
4. Flag any individual files exceeding thresholds

### Phase 7: Offline Capability Check (5 min)

1. Check if the static site requires external API calls to function:
   - Parse JS bundles for `fetch(` calls to external domains
   - Parse JS bundles for `XMLHttpRequest` to external URLs
   - Check for external `<script src="https://...">` tags (CDN dependencies)
   - Check for external `<link href="https://...">` stylesheets
2. Classify external dependencies:
   - **Required for function** (API calls in component logic) -- FAIL
   - **Analytics/tracking** (Google Analytics, etc.) -- WARN, acceptable
   - **Font CDN** (Google Fonts, etc.) -- WARN, recommend self-hosting
   - **Icon CDN** (Font Awesome CDN, etc.) -- WARN, recommend bundling
3. Verify the site can render core content without network access
4. If `check_offline` is true and required external calls found: FAIL

### Phase 8: Browser Smoke Test (5 min)

If Playwright is available:
1. Start a local static file server on `out/` directory
2. Navigate to `http://localhost:{port}/`
3. Wait for page load (networkidle)
4. Check browser console for JavaScript errors
5. Capture screenshot for evidence
6. Navigate to `/brandbook/` and verify it loads
7. Check for any React error boundaries or blank pages
8. Stop the server

If Playwright is not available:
1. Skip this phase
2. Note: "Browser smoke test skipped -- Playwright not available"

### Phase 9: Report Generation (2 min)

1. Compile all findings
2. Calculate overall static export health score
3. Generate broken links and missing assets JSON files

## Static Export Health Score

| Category | Weight | Pass Criteria |
|----------|--------|---------------|
| Directory Structure | 20% | All expected routes have index.html |
| HTML Integrity | 15% | Valid HTML, no error markers |
| Link Validation | 20% | Zero broken internal links |
| Asset Completeness | 20% | All referenced assets exist |
| No Server Features | 15% | No SSR/API/middleware detected |
| File Sizes | 10% | All files under critical thresholds |

| Score | Rating | Verdict |
|-------|--------|---------|
| 100% | Perfect Export | Ready for deployment |
| 85-99% | Minor Issues | Deployable with warnings |
| 70-84% | Significant Issues | Needs fixes before deployment |
| < 70% | Export Failure | Critical issues must be resolved |

## Report Format

```markdown
# Static Export Validation Report

## Summary

| Check | Status | Details |
|-------|--------|---------|
| Directory Structure | PASS/FAIL | {found}/{expected} routes |
| HTML Integrity | PASS/FAIL | {issue count} issues |
| Internal Links | PASS/FAIL | {broken count} broken links |
| Asset Completeness | PASS/FAIL | {missing count} missing assets |
| Server Features | PASS/FAIL | {detection count} server features |
| File Sizes | PASS/WARN/FAIL | Total: {size}MB |
| Offline Capable | PASS/WARN/FAIL | {external dep count} external deps |

**Export Health Score:** {score}%
**Verdict:** {PASS / WARN / FAIL}

## Route Coverage
| Route | HTML Exists | Links Valid | Assets Complete |
|-------|------------|-------------|-----------------|
| / | YES | YES | YES |
| /brandbook | YES | YES | YES |
| ... | ... | ... | ... |

## Broken Links (if any)
| Source File | Link | Expected Target |
|------------|------|-----------------|
| ... | ... | ... |

## Missing Assets (if any)
| Referenced In | Asset Path | Type |
|--------------|------------|------|
| ... | ... | image/font/script |

## File Size Analysis
| Category | Size | Threshold | Status |
|----------|------|-----------|--------|
| Total out/ | {size}MB | < 10MB | PASS |
| JS (first load) | {size}KB | < 500KB | PASS |
| CSS total | {size}KB | < 100KB | PASS |
| Images total | {size}MB | < 5MB | PASS |

## Recommendations
1. ...
```

## Acceptance Criteria

- [ ] out/ directory exists with index.html
- [ ] All expected routes have corresponding HTML files
- [ ] HTML files are valid and contain no error markers
- [ ] All internal links resolve to existing files
- [ ] All referenced images and assets are present in out/
- [ ] No server-side features detected (API routes, SSR, middleware)
- [ ] File sizes within acceptable thresholds
- [ ] Static site is self-contained (no required external API calls)
- [ ] Static export validation report generated

## Quality Gate
- Threshold: >70%
- All expected routes have corresponding HTML files in out/ directory
- Zero broken internal links and zero missing referenced assets
- No server-side features detected (API routes, SSR, middleware)

---
*QA Accessibility Squad Task - performance-auditor*
