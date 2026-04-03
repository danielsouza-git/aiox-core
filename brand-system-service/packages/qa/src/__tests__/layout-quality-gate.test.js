'use strict';

const os = require('os');
const fs = require('fs');
const path = require('path');

// Gate modules
const {
  runLighthouseGate,
  estimateDOMDepth,
  measureInlineScripts,
  measureCSSSize,
  countExternalResources,
  hasMetaViewport,
  hasDoctype,
  hasCharsetMeta,
  checkImageAlts,
  PERFORMANCE_THRESHOLD,
} = require('../gates/lighthouse-gate');

const {
  runAccessibilityGate,
  checkLanguageAttribute,
  checkHeadingHierarchy,
  checkImageAlternatives,
  checkFormLabels,
  checkSemanticLandmarks,
  checkKeyboardAccessibility,
  checkAriaAttributes,
} = require('../gates/accessibility-gate');

const {
  runResponsiveGate,
  extractFixedWidths,
  extractMediaQueryBreakpoints,
  checkViewportMeta,
  checkViewportOverflow,
  BREAKPOINTS,
} = require('../gates/responsive-gate');

const {
  runVisualRegressionGate,
  generateStructuralHash,
  loadBaseline,
  saveBaseline,
  computeStructuralDiff,
} = require('../gates/visual-regression-gate');

const {
  runQualityGates,
  calculatePersonalityScore,
  calculateDifferentiationScore,
  extractDimensions,
  scoreDimension,
  THRESHOLDS,
  FAMILY_DIMENSION_PRESETS,
  DIMENSION_KEYS,
  extractCSSVarValue,
  areFamilyCompatible,
  isNeutralValue,
} = require('../layout-quality-gate');

// ─── Test Fixtures ───────────────────────────────────────────────────────────

/** Well-formed HTML that passes all gates */
const GOOD_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    :root {
      --layout-corner-radius: 24px;
      --layout-whitespace-mult: 1.5;
      --layout-section-gap: 96px;
      --layout-content-padding: 80px;
      --layout-grid-max-width: 800px;
      --layout-animation-duration: 300ms;
      --layout-nav-style: centered-top;
      --layout-divider-style: organic-wave;
      --layout-grid-rhythm: centered-single;
      --layout-section-bg: soft-fill;
      --layout-family: ethereal;
    }
    body { margin: 0; max-width: 100%; overflow-x: hidden; }
    @media (max-width: 768px) { .container { padding: 16px; } }
    @media (max-width: 375px) { .container { padding: 8px; } }
  </style>
</head>
<body>
  <nav class="centered-top"><a href="/">Home</a></nav>
  <main>
    <h1>Welcome</h1>
    <section>
      <h2>About</h2>
      <p>Content here</p>
      <img src="hero.jpg" alt="Hero image">
    </section>
  </main>
</body>
</html>`;

/** HTML that fails multiple gates */
const BAD_HTML = `<div>
  <div onclick="alert('hi')">
    <img src="test.jpg">
    <input type="text">
    <span style="width: 2000px; color: #ffffff;">wide content</span>
  </div>
</div>`;

/** Minimal CSS for ethereal family */
const ETHEREAL_CSS = `
:root {
  --layout-corner-radius: 24px;
  --layout-whitespace-mult: 1.5;
  --layout-nav-style: centered-top;
  --layout-divider-style: organic-wave;
  --layout-animation-entrance: fade-up;
  --layout-grid-rhythm: centered-single;
  --layout-section-bg: soft-fill;
}`;

/** CSS for bold-structured family */
const BOLD_CSS = `
:root {
  --layout-corner-radius: 2px;
  --layout-whitespace-mult: 0.7;
  --layout-nav-style: sidebar-fixed;
  --layout-divider-style: solid-thick;
  --layout-animation-entrance: slide-in;
  --layout-grid-rhythm: strict-grid;
  --layout-section-bg: layered-shadow;
}`;

// ─── Lighthouse Gate Tests ───────────────────────────────────────────────────

describe('Lighthouse Gate', () => {
  describe('runLighthouseGate', () => {
    it('passes for well-formed HTML', () => {
      const result = runLighthouseGate(GOOD_HTML);
      expect(result.pass).toBe(true);
      expect(result.verdict).toBe('PASS');
      expect(result.performanceScore).toBeGreaterThanOrEqual(PERFORMANCE_THRESHOLD);
    });

    it('fails for poorly-formed HTML', () => {
      const result = runLighthouseGate(BAD_HTML);
      expect(result.pass).toBe(false);
      expect(result.verdict).toBe('FAIL');
      expect(result.performanceScore).toBeLessThan(PERFORMANCE_THRESHOLD);
    });

    it('throws on invalid input', () => {
      expect(() => runLighthouseGate(null)).toThrow('html parameter is required');
      expect(() => runLighthouseGate(123)).toThrow('html parameter is required');
    });

    it('accepts custom threshold', () => {
      const result = runLighthouseGate(BAD_HTML, undefined, { threshold: 10 });
      expect(result.pass).toBe(true);
    });

    it('reports warnings for missing meta tags', () => {
      const html = '<div>Hello</div>';
      const result = runLighthouseGate(html);
      expect(result.warnings).toContain('Missing <meta name="viewport"> tag');
      expect(result.warnings).toContain('Missing <!DOCTYPE html> declaration');
      expect(result.warnings).toContain('Missing <meta charset="utf-8"> tag');
    });

    it('handles CSS parameter correctly', () => {
      const html = '<!DOCTYPE html><html><head></head><body></body></html>';
      const css = 'body { margin: 0; }';
      const result = runLighthouseGate(html, css);
      expect(result.audits.cssSize.value).toBeGreaterThan(0);
    });
  });

  describe('estimateDOMDepth', () => {
    it('counts nested depth correctly', () => {
      expect(estimateDOMDepth('<div><div><p>text</p></div></div>')).toBe(3);
    });

    it('ignores self-closing tags', () => {
      expect(estimateDOMDepth('<div><br><img src="x"><hr></div>')).toBe(1);
    });

    it('returns 0 for empty string', () => {
      expect(estimateDOMDepth('')).toBe(0);
    });
  });

  describe('measureInlineScripts', () => {
    it('measures inline script content', () => {
      const html = '<script>console.log("hello");</script>';
      expect(measureInlineScripts(html)).toBeGreaterThan(0);
    });

    it('ignores external scripts', () => {
      const html = '<script src="app.js"></script>';
      expect(measureInlineScripts(html)).toBe(0);
    });
  });

  describe('measureCSSSize', () => {
    it('measures inline style tags', () => {
      const html = '<style>body { margin: 0; }</style>';
      expect(measureCSSSize(html)).toBeGreaterThan(0);
    });

    it('includes external CSS', () => {
      const html = '<div></div>';
      const css = 'body { color: red; }';
      expect(measureCSSSize(html, css)).toBeGreaterThan(0);
    });
  });

  describe('countExternalResources', () => {
    it('counts scripts, stylesheets, and images', () => {
      const html = `
        <link rel="stylesheet" href="style.css">
        <script src="app.js"></script>
        <img src="photo.jpg">
      `;
      expect(countExternalResources(html)).toBe(3);
    });
  });

  describe('meta tag checks', () => {
    it('detects viewport meta', () => {
      expect(hasMetaViewport('<meta name="viewport" content="width=device-width">')).toBe(true);
      expect(hasMetaViewport('<div></div>')).toBe(false);
    });

    it('detects DOCTYPE', () => {
      expect(hasDoctype('<!DOCTYPE html><html></html>')).toBe(true);
      expect(hasDoctype('<html></html>')).toBe(false);
    });

    it('detects charset meta', () => {
      expect(hasCharsetMeta('<meta charset="utf-8">')).toBe(true);
      expect(hasCharsetMeta('<meta charset=utf-8>')).toBe(true);
      expect(hasCharsetMeta('<div></div>')).toBe(false);
    });
  });

  describe('checkImageAlts', () => {
    it('detects images with and without alt', () => {
      const html = '<img src="a.jpg" alt="photo"><img src="b.jpg">';
      const result = checkImageAlts(html);
      expect(result.total).toBe(2);
      expect(result.withAlt).toBe(1);
    });

    it('accepts empty alt for decorative images', () => {
      const html = '<img src="a.jpg" alt="">';
      const result = checkImageAlts(html);
      expect(result.withAlt).toBe(1);
    });
  });
});

// ─── Accessibility Gate Tests ────────────────────────────────────────────────

describe('Accessibility Gate', () => {
  describe('runAccessibilityGate', () => {
    it('passes for accessible HTML', () => {
      const result = runAccessibilityGate(GOOD_HTML);
      expect(result.pass).toBe(true);
      expect(result.verdict).toBe('PASS');
      expect(result.violationCount).toBe(0);
    });

    it('fails for inaccessible HTML', () => {
      const result = runAccessibilityGate(BAD_HTML);
      expect(result.pass).toBe(false);
      expect(result.verdict).toBe('FAIL');
      expect(result.violationCount).toBeGreaterThan(0);
    });

    it('throws on invalid input', () => {
      expect(() => runAccessibilityGate(null)).toThrow('html parameter is required');
    });

    it('supports skipRules option', () => {
      const result = runAccessibilityGate(BAD_HTML, {
        skipRules: ['image-alt', 'label', 'html-has-lang', 'interactive-supports-focus',
          'landmark-main-is-top-level', 'landmark-navigation', 'page-has-heading-one'],
      });
      // With most rules skipped, fewer violations
      expect(result.violationCount).toBeLessThan(
        runAccessibilityGate(BAD_HTML).violationCount
      );
    });

    it('returns summary by severity', () => {
      const result = runAccessibilityGate(BAD_HTML);
      expect(result.summary).toBeDefined();
      expect(typeof result.summary.critical).toBe('number');
      expect(typeof result.summary.serious).toBe('number');
      expect(typeof result.summary.moderate).toBe('number');
      expect(typeof result.summary.minor).toBe('number');
    });
  });

  describe('checkLanguageAttribute', () => {
    it('finds missing lang attribute', () => {
      const violations = checkLanguageAttribute('<html><body></body></html>');
      expect(violations.length).toBe(1);
      expect(violations[0].rule).toBe('html-has-lang');
    });

    it('passes with lang attribute', () => {
      const violations = checkLanguageAttribute('<html lang="en"><body></body></html>');
      expect(violations.length).toBe(0);
    });
  });

  describe('checkHeadingHierarchy', () => {
    it('finds missing h1', () => {
      const violations = checkHeadingHierarchy('<h2>Sub</h2><h3>Sub-sub</h3>');
      expect(violations.some((v) => v.rule === 'page-has-heading-one')).toBe(true);
    });

    it('finds heading level skip', () => {
      const violations = checkHeadingHierarchy('<h1>Main</h1><h3>Skipped h2</h3>');
      expect(violations.some((v) => v.rule === 'heading-order')).toBe(true);
    });

    it('passes with correct hierarchy', () => {
      const violations = checkHeadingHierarchy('<h1>Main</h1><h2>Sub</h2><h3>Detail</h3>');
      expect(violations.length).toBe(0);
    });
  });

  describe('checkImageAlternatives', () => {
    it('finds images without alt', () => {
      const violations = checkImageAlternatives('<img src="test.jpg">');
      expect(violations.length).toBe(1);
      expect(violations[0].rule).toBe('image-alt');
      expect(violations[0].severity).toBe('critical');
    });

    it('accepts images with alt', () => {
      const violations = checkImageAlternatives('<img src="test.jpg" alt="A photo">');
      expect(violations.length).toBe(0);
    });
  });

  describe('checkFormLabels', () => {
    it('finds unlabeled inputs', () => {
      const violations = checkFormLabels('<input type="text">');
      expect(violations.length).toBe(1);
      expect(violations[0].rule).toBe('label');
    });

    it('accepts inputs with aria-label', () => {
      const violations = checkFormLabels('<input type="text" aria-label="Name">');
      expect(violations.length).toBe(0);
    });

    it('accepts hidden inputs', () => {
      const violations = checkFormLabels('<input type="hidden" name="csrf">');
      expect(violations.length).toBe(0);
    });

    it('accepts inputs with matching label', () => {
      const violations = checkFormLabels('<label for="name">Name</label><input type="text" id="name">');
      expect(violations.length).toBe(0);
    });
  });

  describe('checkSemanticLandmarks', () => {
    it('finds missing main landmark', () => {
      const violations = checkSemanticLandmarks('<div>content</div>');
      expect(violations.some((v) => v.rule === 'landmark-main-is-top-level')).toBe(true);
    });

    it('passes with main landmark', () => {
      const violations = checkSemanticLandmarks('<main><nav>links</nav>content</main>');
      expect(violations.filter((v) => v.rule === 'landmark-main-is-top-level').length).toBe(0);
    });
  });

  describe('checkKeyboardAccessibility', () => {
    it('finds clickable divs without tabindex/role', () => {
      const violations = checkKeyboardAccessibility('<div onclick="doSomething()">Click</div>');
      expect(violations.length).toBe(1);
      expect(violations[0].rule).toBe('interactive-supports-focus');
    });

    it('passes with proper tabindex and role', () => {
      const violations = checkKeyboardAccessibility(
        '<div onclick="doSomething()" tabindex="0" role="button">Click</div>'
      );
      expect(violations.length).toBe(0);
    });
  });

  describe('checkAriaAttributes', () => {
    it('finds aria-hidden on focusable elements', () => {
      const violations = checkAriaAttributes('<button aria-hidden="true">Hidden</button>');
      expect(violations.length).toBe(1);
      expect(violations[0].rule).toBe('aria-hidden-focus');
    });
  });
});

// ─── Responsive Gate Tests ───────────────────────────────────────────────────

describe('Responsive Gate', () => {
  describe('runResponsiveGate', () => {
    it('passes for well-structured responsive HTML', () => {
      const result = runResponsiveGate(GOOD_HTML);
      expect(result.pass).toBe(true);
      expect(result.verdict).toBe('PASS');
      expect(result.viewports).toHaveLength(3);
    });

    it('validates all three breakpoints', () => {
      const result = runResponsiveGate(GOOD_HTML);
      const viewportWidths = result.viewports.map((v) => v.viewport);
      expect(viewportWidths).toEqual([375, 768, 1440]);
    });

    it('throws on invalid input', () => {
      expect(() => runResponsiveGate(null)).toThrow('html parameter is required');
    });

    it('detects fixed widths exceeding viewport', () => {
      const html = `<!DOCTYPE html><html lang="en"><head>
        <meta charset="utf-8"><meta name="viewport" content="width=device-width">
        <style>.wide { width: 500px; }</style>
      </head><body><main><h1>Test</h1></main></body></html>`;
      const result = runResponsiveGate(html);
      const mobile = result.viewports.find((v) => v.viewport === 375);
      expect(mobile.pass).toBe(false);
      expect(mobile.issues.length).toBeGreaterThan(0);
    });

    it('accepts custom breakpoints', () => {
      const result = runResponsiveGate(GOOD_HTML, undefined, {
        breakpoints: [320, 1024],
      });
      expect(result.viewports).toHaveLength(2);
      expect(result.viewports[0].viewport).toBe(320);
    });

    it('handles external CSS parameter', () => {
      const html = '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head><body><main><h1>Test</h1></main></body></html>';
      const css = '*, *::before, *::after { box-sizing: border-box; }';
      const result = runResponsiveGate(html, css);
      expect(result).toBeDefined();
    });

    it('warns about missing viewport meta', () => {
      const html = '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><style>* { box-sizing: border-box; }</style></head><body><main><h1>Test</h1></main></body></html>';
      const result = runResponsiveGate(html);
      expect(result.warnings.some((w) => w.includes('viewport'))).toBe(true);
    });
  });

  describe('extractFixedWidths', () => {
    it('extracts fixed width declarations', () => {
      const css = '.box { width: 500px; } .small { width: 100px; }';
      const widths = extractFixedWidths(css);
      expect(widths.length).toBe(2);
      expect(widths[0].width).toBe(500);
    });
  });

  describe('extractMediaQueryBreakpoints', () => {
    it('extracts breakpoint values', () => {
      const css = '@media (max-width: 768px) { } @media (min-width: 375px) { }';
      const bps = extractMediaQueryBreakpoints(css);
      expect(bps).toContain(768);
      expect(bps).toContain(375);
    });
  });

  describe('checkViewportMeta', () => {
    it('detects viewport meta presence and width', () => {
      const result = checkViewportMeta('<meta name="viewport" content="width=device-width">');
      expect(result.present).toBe(true);
      expect(result.hasWidth).toBe(true);
    });

    it('detects missing viewport meta', () => {
      const result = checkViewportMeta('<meta charset="utf-8">');
      expect(result.present).toBe(false);
    });
  });
});

// ─── Visual Regression Gate Tests ────────────────────────────────────────────

describe('Visual Regression Gate', () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = path.join(os.tmpdir(), `vr-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    fs.mkdirSync(tmpDir, { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  describe('runVisualRegressionGate', () => {
    it('creates baseline when none exists', () => {
      const result = runVisualRegressionGate(GOOD_HTML, 'ethereal', {
        baselineDir: tmpDir,
      });
      expect(result.pass).toBe(true);
      expect(result.verdict).toBe('BASELINE_CREATED');
      expect(result.baselineHash).toBeNull();
    });

    it('passes when HTML matches baseline', () => {
      // Create baseline
      runVisualRegressionGate(GOOD_HTML, 'ethereal', { baselineDir: tmpDir });

      // Re-run with same HTML
      const result = runVisualRegressionGate(GOOD_HTML, 'ethereal', {
        baselineDir: tmpDir,
      });
      expect(result.pass).toBe(true);
      expect(result.verdict).toBe('PASS');
    });

    it('detects regression when HTML changes', () => {
      // Create baseline
      runVisualRegressionGate(GOOD_HTML, 'ethereal', { baselineDir: tmpDir });

      // Run with different HTML
      const modifiedHTML = GOOD_HTML.replace('<h1>Welcome</h1>', '<h1>Welcome</h1><h2>New Section</h2><p>Extra</p><div>More</div>');
      const result = runVisualRegressionGate(modifiedHTML, 'ethereal', {
        baselineDir: tmpDir,
      });
      expect(result.pass).toBe(false);
      expect(result.verdict).toBe('REGRESSION_DETECTED');
      expect(result.diff).toBeDefined();
    });

    it('force-updates baseline with updateBaseline option', () => {
      // Create baseline
      runVisualRegressionGate(GOOD_HTML, 'ethereal', { baselineDir: tmpDir });

      // Force update
      const result = runVisualRegressionGate(BAD_HTML, 'ethereal', {
        baselineDir: tmpDir,
        updateBaseline: true,
      });
      expect(result.pass).toBe(true);
      expect(result.verdict).toBe('BASELINE_CREATED');
    });

    it('throws on invalid input', () => {
      expect(() => runVisualRegressionGate(null, 'ethereal')).toThrow('html parameter is required');
      expect(() => runVisualRegressionGate('<div></div>', null)).toThrow('family parameter is required');
    });
  });

  describe('generateStructuralHash', () => {
    it('produces consistent hashes for same input', () => {
      const h1 = generateStructuralHash(GOOD_HTML);
      const h2 = generateStructuralHash(GOOD_HTML);
      expect(h1.hash).toBe(h2.hash);
    });

    it('produces different hashes for different HTML', () => {
      const h1 = generateStructuralHash('<div><p>A</p></div>');
      const h2 = generateStructuralHash('<div><p>A</p><span>B</span></div>');
      expect(h1.hash).not.toBe(h2.hash);
    });

    it('extracts CSS custom properties', () => {
      const html = `<style>:root { --layout-corner-radius: 24px; --layout-nav-style: centered-top; }</style><div></div>`;
      const result = generateStructuralHash(html);
      expect(result.structure.cssVars).toContain('--layout-corner-radius');
      expect(result.structure.cssVars).toContain('--layout-nav-style');
    });
  });

  describe('loadBaseline / saveBaseline', () => {
    it('round-trips baseline data', () => {
      const entry = {
        family: 'ethereal',
        hash: 'abc123',
        timestamp: new Date().toISOString(),
        structure: { tagCount: 10, depth: 3, cssVars: ['--layout-corner-radius'] },
      };

      saveBaseline(entry, tmpDir);
      const loaded = loadBaseline('ethereal', tmpDir);

      expect(loaded.family).toBe('ethereal');
      expect(loaded.hash).toBe('abc123');
      expect(loaded.structure.tagCount).toBe(10);
    });

    it('returns null for missing baseline', () => {
      const result = loadBaseline('nonexistent', tmpDir);
      expect(result).toBeNull();
    });
  });

  describe('computeStructuralDiff', () => {
    it('detects no diff for identical structures', () => {
      const structure = { tagCount: 10, depth: 3, cssVars: ['--a', '--b'] };
      const diff = computeStructuralDiff(structure, structure);
      expect(diff.structurallyIdentical).toBe(true);
    });

    it('detects tag count changes', () => {
      const current = { tagCount: 12, depth: 3, cssVars: ['--a'] };
      const baseline = { tagCount: 10, depth: 3, cssVars: ['--a'] };
      const diff = computeStructuralDiff(current, baseline);
      expect(diff.tagCountDelta).toBe(2);
      expect(diff.structurallyIdentical).toBe(false);
    });

    it('detects added/removed CSS vars', () => {
      const current = { tagCount: 10, depth: 3, cssVars: ['--a', '--c'] };
      const baseline = { tagCount: 10, depth: 3, cssVars: ['--a', '--b'] };
      const diff = computeStructuralDiff(current, baseline);
      expect(diff.addedCSSVars).toEqual(['--c']);
      expect(diff.removedCSSVars).toEqual(['--b']);
    });
  });
});

// ─── Personality Score Tests ─────────────────────────────────────────────────

describe('Personality Score', () => {
  describe('calculatePersonalityScore', () => {
    it('scores high for matching ethereal layout', () => {
      const html = `<html><head><style>${ETHEREAL_CSS}</style></head>
        <body><nav class="centered-top"></nav><main></main></body></html>`;
      const result = calculatePersonalityScore(html, 'ethereal');
      expect(result.score).toBeGreaterThanOrEqual(0.7);
      expect(result.pass).toBe(true);
    });

    it('scores low for mismatched layout', () => {
      const html = `<html><head><style>${BOLD_CSS}</style></head>
        <body><nav class="sidebar-fixed"></nav><main></main></body></html>`;
      const result = calculatePersonalityScore(html, 'ethereal');
      expect(result.score).toBeLessThan(0.7);
    });

    it('throws for unknown family', () => {
      expect(() => calculatePersonalityScore('<div></div>', 'nonexistent')).toThrow('Unknown layout family');
    });

    it('returns dimension-level breakdown', () => {
      const html = `<html><head><style>${ETHEREAL_CSS}</style></head><body></body></html>`;
      const result = calculatePersonalityScore(html, 'ethereal');
      expect(result.dimensions).toBeDefined();
      for (const dim of DIMENSION_KEYS) {
        expect(result.dimensions[dim]).toBeDefined();
        expect(result.dimensions[dim]).toHaveProperty('actual');
        expect(result.dimensions[dim]).toHaveProperty('expected');
        expect(result.dimensions[dim]).toHaveProperty('score');
      }
    });

    it('assigns correct verdicts based on score', () => {
      // High score = STRONG_EXPRESSION
      const html = `<html><head><style>${ETHEREAL_CSS}</style></head>
        <body><nav class="centered-top"></nav><main></main></body></html>`;
      const result = calculatePersonalityScore(html, 'ethereal');
      expect(['STRONG_EXPRESSION', 'ADEQUATE_EXPRESSION']).toContain(result.verdict);
    });
  });

  describe('scoreDimension', () => {
    it('returns 100 for exact match', () => {
      expect(scoreDimension('navStyle', 'centered-top', 'centered-top', 'ethereal')).toBe(100);
    });

    it('returns 0 for contradictory combination', () => {
      expect(scoreDimension('cornerRadius', 'sharp', 'pill', 'ethereal')).toBe(0);
    });

    it('returns 75 for family-compatible values', () => {
      expect(scoreDimension('cornerRadius', 'rounded', 'pill', 'ethereal')).toBe(75);
    });

    it('returns 50 for neutral values', () => {
      expect(scoreDimension('dividerStyle', 'none', 'organic-wave', 'ethereal')).toBe(50);
    });
  });

  describe('areFamilyCompatible', () => {
    it('groups sharp/subtle together', () => {
      expect(areFamilyCompatible('cornerRadius', 'sharp', 'subtle')).toBe(true);
    });

    it('groups rounded/pill together', () => {
      expect(areFamilyCompatible('cornerRadius', 'rounded', 'pill')).toBe(true);
    });

    it('does not group sharp with pill', () => {
      expect(areFamilyCompatible('cornerRadius', 'sharp', 'pill')).toBe(false);
    });
  });

  describe('isNeutralValue', () => {
    it('recognizes neutral values', () => {
      expect(isNeutralValue('cornerRadius', 'subtle')).toBe(true);
      expect(isNeutralValue('whitespaceDensity', 'balanced')).toBe(true);
      expect(isNeutralValue('animationEntrance', 'none')).toBe(true);
    });

    it('rejects non-neutral values', () => {
      expect(isNeutralValue('cornerRadius', 'pill')).toBe(false);
    });
  });

  describe('extractCSSVarValue', () => {
    it('extracts CSS custom property values', () => {
      const css = ':root { --layout-corner-radius: 24px; }';
      expect(extractCSSVarValue(css, '--layout-corner-radius')).toBe('24px');
    });

    it('returns null for missing property', () => {
      expect(extractCSSVarValue(':root {}', '--layout-missing')).toBeNull();
    });
  });

  describe('extractDimensions', () => {
    it('extracts all 7 dimensions from CSS', () => {
      const html = `<html><head><style>${ETHEREAL_CSS}</style></head>
        <body><nav class="centered-top"></nav></body></html>`;
      const dims = extractDimensions(html);
      expect(dims.navStyle).toBe('centered-top');
      expect(dims.whitespaceDensity).toBe('spacious');
      expect(dims.cornerRadius).toBe('pill');
      expect(dims.dividerStyle).toBe('organic-wave');
      expect(dims.animationEntrance).toBe('fade-up');
      expect(dims.gridRhythm).toBe('centered-single');
      expect(dims.sectionBackground).toBe('soft-fill');
    });
  });
});

// ─── Differentiation Check Tests ─────────────────────────────────────────────

describe('Differentiation Check', () => {
  describe('calculateDifferentiationScore', () => {
    it('scores high for two different families', () => {
      const htmlA = `<html><head><style>${ETHEREAL_CSS}</style></head>
        <body><nav class="centered-top"></nav></body></html>`;
      const htmlB = `<html><head><style>${BOLD_CSS}</style></head>
        <body><nav class="sidebar-fixed"></nav></body></html>`;

      const result = calculateDifferentiationScore(htmlA, htmlB);
      expect(result.score).toBeGreaterThanOrEqual(0.3);
      expect(result.pass).toBe(true);
      expect(result.differingDimensions).toBeGreaterThanOrEqual(3);
    });

    it('scores low for identical layouts', () => {
      const html = `<html><head><style>${ETHEREAL_CSS}</style></head><body></body></html>`;
      const result = calculateDifferentiationScore(html, html);
      expect(result.score).toBe(0);
      expect(result.pass).toBe(false);
      expect(result.verdict).toBe('NO_DIFFERENTIATION');
    });

    it('returns dimension-level comparison', () => {
      const htmlA = `<html><head><style>${ETHEREAL_CSS}</style></head><body></body></html>`;
      const htmlB = `<html><head><style>${BOLD_CSS}</style></head><body></body></html>`;
      const result = calculateDifferentiationScore(htmlA, htmlB);

      for (const dim of DIMENSION_KEYS) {
        expect(result.dimensionComparison[dim]).toBeDefined();
        expect(result.dimensionComparison[dim]).toHaveProperty('brandA');
        expect(result.dimensionComparison[dim]).toHaveProperty('brandB');
        expect(result.dimensionComparison[dim]).toHaveProperty('different');
      }
    });

    it('throws on invalid input', () => {
      expect(() => calculateDifferentiationScore(null, '<div></div>')).toThrow('htmlA parameter is required');
      expect(() => calculateDifferentiationScore('<div></div>', null)).toThrow('htmlB parameter is required');
    });
  });
});

// ─── Quality Gate Orchestrator Tests ─────────────────────────────────────────

describe('Quality Gate Orchestrator', () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = path.join(os.tmpdir(), `qg-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    fs.mkdirSync(tmpDir, { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  describe('runQualityGates', () => {
    it('passes for well-formed HTML with matching family', () => {
      const result = runQualityGates({
        html: GOOD_HTML,
        family: 'ethereal',
        options: { baselineDir: tmpDir },
      });

      expect(result.pass).toBe(true);
      expect(result.gates.length).toBeGreaterThanOrEqual(4);
      expect(result.summary.total).toBeGreaterThanOrEqual(4);
    });

    it('fails for poorly-formed HTML', () => {
      const result = runQualityGates({
        html: BAD_HTML,
        family: 'ethereal',
        options: { baselineDir: tmpDir },
      });

      expect(result.pass).toBe(false);
      expect(result.verdict).toBe('FAIL');
    });

    it('runs all 6 gates when comparison HTML provided', () => {
      const result = runQualityGates({
        html: GOOD_HTML,
        family: 'ethereal',
        options: {
          baselineDir: tmpDir,
          comparisonHtml: `<html><head><style>${BOLD_CSS}</style></head><body><nav class="sidebar-fixed"></nav><main><h1>Test</h1></main></body></html>`,
        },
      });

      const gateNames = result.gates.map((g) => g.gate);
      expect(gateNames).toContain('lighthouse');
      expect(gateNames).toContain('accessibility');
      expect(gateNames).toContain('responsive');
      expect(gateNames).toContain('visual-regression');
      expect(gateNames).toContain('personality');
      expect(gateNames).toContain('differentiation');
    });

    it('skips differentiation gate when no comparison HTML', () => {
      const result = runQualityGates({
        html: GOOD_HTML,
        family: 'ethereal',
        options: { baselineDir: tmpDir },
      });

      const gateNames = result.gates.map((g) => g.gate);
      expect(gateNames).not.toContain('differentiation');
    });

    it('supports skipGates option', () => {
      const result = runQualityGates({
        html: GOOD_HTML,
        family: 'ethereal',
        options: {
          baselineDir: tmpDir,
          skipGates: ['lighthouse', 'responsive'],
        },
      });

      const gateNames = result.gates.map((g) => g.gate);
      expect(gateNames).not.toContain('lighthouse');
      expect(gateNames).not.toContain('responsive');
      expect(gateNames).toContain('accessibility');
    });

    it('marks personality and differentiation as non-blocking', () => {
      const result = runQualityGates({
        html: GOOD_HTML,
        family: 'ethereal',
        options: {
          baselineDir: tmpDir,
          comparisonHtml: GOOD_HTML,
        },
      });

      const personalityGate = result.gates.find((g) => g.gate === 'personality');
      const diffGate = result.gates.find((g) => g.gate === 'differentiation');

      expect(personalityGate.blocking).toBe(false);
      expect(diffGate.blocking).toBe(false);
    });

    it('marks lighthouse, accessibility, responsive, visual-regression as blocking', () => {
      const result = runQualityGates({
        html: GOOD_HTML,
        family: 'ethereal',
        options: { baselineDir: tmpDir },
      });

      const blockingGates = result.gates.filter((g) => g.blocking);
      const blockingNames = blockingGates.map((g) => g.gate);

      expect(blockingNames).toContain('lighthouse');
      expect(blockingNames).toContain('accessibility');
      expect(blockingNames).toContain('responsive');
      expect(blockingNames).toContain('visual-regression');
    });

    it('returns PASS_WITH_WARNINGS when blocking pass but warnings exist', () => {
      // Create HTML that passes blocking gates but fails personality
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    :root {
      --layout-corner-radius: 2px;
      --layout-whitespace-mult: 0.7;
      --layout-nav-style: sidebar-fixed;
      --layout-divider-style: solid-thick;
      --layout-grid-rhythm: strict-grid;
      --layout-section-bg: layered-shadow;
      --layout-family: bold-structured;
    }
    body { margin: 0; overflow-x: hidden; }
    @media (max-width: 768px) { .c { padding: 16px; } }
    @media (max-width: 375px) { .c { padding: 8px; } }
  </style>
</head>
<body>
  <nav class="sidebar-fixed"><a href="/">Home</a></nav>
  <main><h1>Test</h1><p>Content</p></main>
</body>
</html>`;

      const result = runQualityGates({
        html,
        family: 'ethereal', // Mismatch: bold-structured CSS for ethereal family
        options: { baselineDir: tmpDir },
      });

      // Personality should fail (non-blocking)
      const personalityGate = result.gates.find((g) => g.gate === 'personality');
      expect(personalityGate.pass).toBe(false);

      // Overall: blocking gates pass but personality warning exists
      if (result.pass) {
        expect(result.verdict).toBe('PASS_WITH_WARNINGS');
      }
    });

    it('throws on invalid input', () => {
      expect(() => runQualityGates(null)).toThrow('input is required');
      expect(() => runQualityGates({ html: null, family: 'x' })).toThrow('input.html is required');
      expect(() => runQualityGates({ html: '<div></div>', family: null })).toThrow('input.family is required');
    });

    it('handles gate errors gracefully', () => {
      // Run with a family that does not have a preset -- personality gate will throw
      const result = runQualityGates({
        html: GOOD_HTML,
        family: 'nonexistent-family',
        options: { baselineDir: tmpDir },
      });

      // Personality gate should show ERROR but not crash the orchestrator
      const personalityGate = result.gates.find((g) => g.gate === 'personality');
      expect(personalityGate.verdict).toBe('ERROR');
      // Other gates should still run
      expect(result.gates.length).toBeGreaterThan(1);
    });
  });

  describe('THRESHOLDS', () => {
    it('has correct threshold values', () => {
      expect(THRESHOLDS.lighthousePerformance).toBe(90);
      expect(THRESHOLDS.wcagViolations).toBe(0);
      expect(THRESHOLDS.personalityScore).toBe(0.7);
      expect(THRESHOLDS.differentiationScore).toBe(0.3);
    });
  });

  describe('FAMILY_DIMENSION_PRESETS', () => {
    it('has presets for all 6 families', () => {
      const families = Object.keys(FAMILY_DIMENSION_PRESETS);
      expect(families).toHaveLength(6);
      expect(families).toContain('ethereal');
      expect(families).toContain('bold-structured');
      expect(families).toContain('warm-artisan');
      expect(families).toContain('adventurous-open');
      expect(families).toContain('playful-dynamic');
      expect(families).toContain('rebel-edge');
    });

    it('each preset has all 7 dimensions', () => {
      for (const [family, preset] of Object.entries(FAMILY_DIMENSION_PRESETS)) {
        for (const dim of DIMENSION_KEYS) {
          expect(preset[dim]).toBeDefined();
        }
      }
    });
  });
});
