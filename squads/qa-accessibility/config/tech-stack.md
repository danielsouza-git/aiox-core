# QA Accessibility Squad - Tech Stack

Testing tools, frameworks, and integrations used by the QA Accessibility Squad.

## Core Testing Tools

### Playwright
- **Purpose:** Browser automation, screenshot capture, cross-browser testing
- **Version:** Latest stable
- **Browsers:** Chromium, Firefox, WebKit (Safari)
- **Usage:**
  - Visual regression screenshots
  - Cross-browser rendering comparison
  - Responsive testing at multiple viewports
  - Keyboard navigation automation
  - Network request interception (asset auditing)

### axe-core
- **Purpose:** Automated accessibility testing engine
- **Version:** Latest stable
- **Standard:** WCAG 2.2 AA
- **Usage:**
  - DOM-based accessibility scanning
  - Color contrast detection
  - ARIA validation
  - Form label verification
  - Heading order checks
- **Integration:** Via `@axe-core/playwright` for browser-based testing

### Lighthouse
- **Purpose:** Web performance and quality auditing
- **Version:** Latest (via Chrome DevTools Protocol)
- **Categories:** Performance, Accessibility, Best Practices, SEO
- **Usage:**
  - Performance scoring and metrics
  - Accessibility score (complements axe-core)
  - Best practices verification
  - SEO compliance checking
  - Core Web Vitals measurement

### Percy
- **Purpose:** Visual regression testing platform
- **Version:** Latest SDK
- **Usage:**
  - Automated screenshot comparison
  - Visual diff generation
  - Baseline management
  - Cross-browser visual testing
  - CI/CD integration for visual regression gates

### Pa11y
- **Purpose:** WCAG standard-mapped accessibility testing
- **Version:** Latest stable
- **Standard:** WCAG2AA
- **Usage:**
  - Complementary to axe-core
  - Standard-specific criterion mapping
  - CLI-based batch testing
  - JSON output for reporting

## Supporting Tools

### Color Contrast Analyzers
- **WCAG Contrast Checker** - Automated contrast ratio calculation
- **Color.review** - Visual contrast preview
- **whocanuse.com** - Vision impairment simulation

### Screen Readers (Manual Testing)
- **VoiceOver** - macOS/iOS built-in screen reader
- **NVDA** - Windows free screen reader
- **JAWS** - Windows commercial screen reader (reference only)

### Performance Measurement
- **Web Vitals JS** - Real User Monitoring (RUM) library
- **Chrome DevTools** - Performance profiling
- **WebPageTest** - Multi-location performance testing (reference)

## Integration Requirements

| Tool | Required | Installation |
|------|----------|-------------|
| Playwright | Yes | `npm install @playwright/test` |
| axe-core | Yes | `npm install @axe-core/playwright` |
| Lighthouse | Yes | Via Playwright Chrome connection |
| Percy | Optional | `npm install @percy/cli` |
| Pa11y | Optional | `npm install pa11y` |

## Configuration

### Playwright Config
```javascript
// playwright.config.js (QA squad context)
{
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 13'] } },
  ]
}
```

### axe-core Config
```javascript
// Accessibility rule configuration
{
  runOnly: {
    type: 'tag',
    values: ['wcag2a', 'wcag2aa', 'wcag22aa']
  },
  reporter: 'v2'
}
```

### Lighthouse Config
```javascript
// Performance budget
{
  performance: 90,
  accessibility: 95,
  'best-practices': 90,
  seo: 90
}
```

## Browser Matrix

| Browser | Engine | Viewport | Device |
|---------|--------|----------|--------|
| Chrome | Chromium | 1440x900 | Desktop |
| Firefox | Gecko | 1440x900 | Desktop |
| Safari | WebKit | 1440x900 | Desktop |
| Chrome Mobile | Chromium | 375x812 | iPhone 13 |
| Safari Mobile | WebKit | 375x812 | iPhone 13 |

---

*QA Accessibility Squad - Tech Stack v1.0*
