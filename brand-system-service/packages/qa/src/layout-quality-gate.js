'use strict';

/**
 * Layout Quality Gate Orchestrator
 *
 * Runs all quality gates for AI-generated layouts in sequence:
 * 1. Lighthouse performance audit
 * 2. WCAG AA accessibility check
 * 3. Responsive viewport validation
 * 4. Visual regression baseline comparison
 * 5. Layout personality score (validates layout matches expected family)
 * 6. Layout differentiation check (validates two brands produce distinct layouts)
 *
 * Designed to run post-generate, pre-delivery in the brand book build pipeline.
 *
 * Zero external dependencies.
 *
 * @module layout-quality-gate
 */

const { runLighthouseGate } = require('./gates/lighthouse-gate');
const { runAccessibilityGate } = require('./gates/accessibility-gate');
const { runResponsiveGate } = require('./gates/responsive-gate');
const { runVisualRegressionGate } = require('./gates/visual-regression-gate');

/**
 * Quality gate thresholds.
 * @type {Object}
 */
const THRESHOLDS = Object.freeze({
  lighthousePerformance: 90,
  wcagViolations: 0,
  personalityScore: 0.7,
  differentiationScore: 0.3,
});

/**
 * Layout family presets: expected dimension values per family.
 * Used for personality scoring.
 *
 * @type {Object<string, Object>}
 */
const FAMILY_DIMENSION_PRESETS = Object.freeze({
  'ethereal': {
    navStyle: 'centered-top',
    whitespaceDensity: 'spacious',
    cornerRadius: 'pill',
    dividerStyle: 'organic-wave',
    animationEntrance: 'fade-up',
    gridRhythm: 'centered-single',
    sectionBackground: 'soft-fill',
  },
  'bold-structured': {
    navStyle: 'sidebar-fixed',
    whitespaceDensity: 'compact',
    cornerRadius: 'sharp',
    dividerStyle: 'solid-thick',
    animationEntrance: 'slide-in',
    gridRhythm: 'strict-grid',
    sectionBackground: 'layered-shadow',
  },
  'warm-artisan': {
    navStyle: 'breadcrumb-horizontal',
    whitespaceDensity: 'balanced',
    cornerRadius: 'rounded',
    dividerStyle: 'textured-line',
    animationEntrance: 'fade-up',
    gridRhythm: 'masonry-inspired',
    sectionBackground: 'alternating-accent',
  },
  'adventurous-open': {
    navStyle: 'sticky-minimal',
    whitespaceDensity: 'generous',
    cornerRadius: 'subtle',
    dividerStyle: 'thin-geometric',
    animationEntrance: 'scroll-reveal',
    gridRhythm: 'editorial-wide',
    sectionBackground: 'full-bleed-image',
  },
  'playful-dynamic': {
    navStyle: 'floating-pill',
    whitespaceDensity: 'balanced',
    cornerRadius: 'rounded',
    dividerStyle: 'zigzag-wave',
    animationEntrance: 'bounce-in',
    gridRhythm: 'broken-asymmetric',
    sectionBackground: 'alternating-accent',
  },
  'rebel-edge': {
    navStyle: 'inline-minimal',
    whitespaceDensity: 'compact',
    cornerRadius: 'sharp',
    dividerStyle: 'slash-raw',
    animationEntrance: 'cut-in',
    gridRhythm: 'single-column-stacked',
    sectionBackground: 'dark-mono',
  },
});

/** @type {string[]} The 7 layout dimension keys */
const DIMENSION_KEYS = Object.freeze([
  'navStyle',
  'whitespaceDensity',
  'cornerRadius',
  'dividerStyle',
  'animationEntrance',
  'gridRhythm',
  'sectionBackground',
]);

/**
 * Contradictory value combinations that always score 0%.
 * @type {Object<string, Object<string, string[]>>}
 */
const CONTRADICTIONS = Object.freeze({
  'ethereal': {
    cornerRadius: ['sharp'],
    whitespaceDensity: ['compact'],
    dividerStyle: ['solid-thick'],
    animationEntrance: ['cut-in'],
    sectionBackground: ['dark-mono'],
  },
  'bold-structured': {
    cornerRadius: ['pill'],
    whitespaceDensity: ['spacious'],
    dividerStyle: ['organic-wave'],
    animationEntrance: ['bounce-in'],
    sectionBackground: ['soft-fill'],
  },
  'warm-artisan': {
    cornerRadius: ['sharp'],
    dividerStyle: ['slash-raw'],
    animationEntrance: ['cut-in'],
    sectionBackground: ['dark-mono'],
  },
  'adventurous-open': {
    navStyle: ['sidebar-fixed'],
    whitespaceDensity: ['compact'],
    dividerStyle: ['solid-thick'],
    animationEntrance: ['none'],
  },
  'playful-dynamic': {
    cornerRadius: ['sharp'],
    navStyle: ['sidebar-fixed'],
    animationEntrance: ['none'],
    sectionBackground: ['flat-solid'],
  },
  'rebel-edge': {
    cornerRadius: ['pill'],
    whitespaceDensity: ['spacious'],
    dividerStyle: ['organic-wave'],
    animationEntrance: ['fade-up'],
    sectionBackground: ['soft-fill'],
  },
});

/**
 * Extract actual layout dimension values from HTML/CSS.
 *
 * @param {string} html - Generated HTML
 * @param {string} [css] - Optional external CSS
 * @returns {Object<string, string>} Extracted dimension values
 */
function extractDimensions(html, css) {
  const combinedCSS = extractAllCSS(html, css);
  const dimensions = {};

  // Navigation style -- detect from CSS custom property or HTML structure
  dimensions.navStyle = extractCSSVarValue(combinedCSS, '--layout-nav-style')
    || detectNavFromHTML(html)
    || 'unknown';

  // Whitespace density -- detect from CSS custom property
  const multiplier = parseFloat(extractCSSVarValue(combinedCSS, '--layout-whitespace-mult') || '1');
  if (multiplier <= 0.8) dimensions.whitespaceDensity = 'compact';
  else if (multiplier <= 1.1) dimensions.whitespaceDensity = 'balanced';
  else if (multiplier <= 1.4) dimensions.whitespaceDensity = 'generous';
  else dimensions.whitespaceDensity = 'spacious';

  // Corner radius -- detect from CSS custom property or CSS rules
  const radiusStr = extractCSSVarValue(combinedCSS, '--layout-corner-radius') || '';
  const radiusPx = parseFloat(radiusStr) || 0;
  if (radiusPx <= 2) dimensions.cornerRadius = 'sharp';
  else if (radiusPx <= 8) dimensions.cornerRadius = 'subtle';
  else if (radiusPx <= 16) dimensions.cornerRadius = 'rounded';
  else dimensions.cornerRadius = 'pill';

  // Divider style
  dimensions.dividerStyle = extractCSSVarValue(combinedCSS, '--layout-divider-style') || 'none';

  // Animation entrance
  dimensions.animationEntrance = extractCSSVarValue(combinedCSS, '--layout-animation-entrance')
    || detectAnimationFromCSS(combinedCSS)
    || 'none';

  // Grid rhythm
  dimensions.gridRhythm = extractCSSVarValue(combinedCSS, '--layout-grid-rhythm') || 'strict-grid';

  // Section background
  dimensions.sectionBackground = extractCSSVarValue(combinedCSS, '--layout-section-bg') || 'flat-solid';

  return dimensions;
}

/**
 * Extract a CSS custom property value from CSS text.
 *
 * @param {string} css
 * @param {string} varName
 * @returns {string|null}
 */
function extractCSSVarValue(css, varName) {
  const escaped = varName.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  const regex = new RegExp(`${escaped}\\s*:\\s*([^;\\n}]+)`, 'i');
  const match = css.match(regex);
  return match ? match[1].trim() : null;
}

/**
 * Detect navigation style from HTML structure.
 *
 * @param {string} html
 * @returns {string|null}
 */
function detectNavFromHTML(html) {
  if (/<nav[^>]*class=["'][^"']*centered/i.test(html)) return 'centered-top';
  if (/<nav[^>]*class=["'][^"']*sidebar/i.test(html)) return 'sidebar-fixed';
  if (/<nav[^>]*class=["'][^"']*sticky/i.test(html)) return 'sticky-minimal';
  if (/<nav[^>]*class=["'][^"']*floating/i.test(html)) return 'floating-pill';
  if (/<nav[^>]*class=["'][^"']*breadcrumb/i.test(html)) return 'breadcrumb-horizontal';
  if (/<nav[^>]*class=["'][^"']*inline/i.test(html)) return 'inline-minimal';
  return null;
}

/**
 * Detect animation entrance type from CSS.
 *
 * @param {string} css
 * @returns {string|null}
 */
function detectAnimationFromCSS(css) {
  if (/fade-up|fadeUp/i.test(css)) return 'fade-up';
  if (/slide-in|slideIn/i.test(css)) return 'slide-in';
  if (/scroll-reveal|scrollReveal/i.test(css)) return 'scroll-reveal';
  if (/bounce-in|bounceIn/i.test(css)) return 'bounce-in';
  if (/cut-in|cutIn/i.test(css)) return 'cut-in';
  return null;
}

/**
 * Extract all CSS content from HTML and optional external CSS.
 *
 * @param {string} html
 * @param {string} [css]
 * @returns {string}
 */
function extractAllCSS(html, css) {
  const blocks = [];
  const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let match;

  while ((match = styleRegex.exec(html)) !== null) {
    blocks.push(match[1]);
  }

  if (css) blocks.push(css);
  return blocks.join('\n');
}

/**
 * Score a single layout dimension against expected family preset.
 *
 * @param {string} dimension - Dimension key
 * @param {string} actual - Actual value
 * @param {string} expected - Expected value from family preset
 * @param {string} family - Layout family name
 * @returns {number} Score 0-100
 */
function scoreDimension(dimension, actual, expected, family) {
  // Check for contradictory combination (always 0%)
  const familyContradictions = CONTRADICTIONS[family];
  if (familyContradictions && familyContradictions[dimension]) {
    if (familyContradictions[dimension].includes(actual)) {
      return 0;
    }
  }

  // Exact match
  if (actual === expected) {
    return 100;
  }

  // Family-compatible (same direction, different magnitude)
  if (areFamilyCompatible(dimension, actual, expected)) {
    return 75;
  }

  // Neutral (generic/default)
  if (isNeutralValue(dimension, actual)) {
    return 50;
  }

  // Default: partial match
  return 25;
}

/**
 * Check if two dimension values are family-compatible (similar direction).
 *
 * @param {string} dimension
 * @param {string} actual
 * @param {string} expected
 * @returns {boolean}
 */
function areFamilyCompatible(dimension, actual, expected) {
  const groups = {
    cornerRadius: [['sharp', 'subtle'], ['rounded', 'pill']],
    whitespaceDensity: [['compact', 'balanced'], ['generous', 'spacious']],
  };

  if (groups[dimension]) {
    for (const group of groups[dimension]) {
      if (group.includes(actual) && group.includes(expected)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Check if a dimension value is considered neutral/generic.
 *
 * @param {string} dimension
 * @param {string} value
 * @returns {boolean}
 */
function isNeutralValue(dimension, value) {
  const neutralValues = {
    cornerRadius: ['subtle'],
    whitespaceDensity: ['balanced'],
    dividerStyle: ['solid-thin', 'none'],
    animationEntrance: ['none'],
    gridRhythm: ['strict-grid'],
    sectionBackground: ['flat-solid'],
  };

  return neutralValues[dimension] && neutralValues[dimension].includes(value);
}

/**
 * Calculate personality score for a layout against an expected family.
 *
 * @param {string} html - Generated HTML
 * @param {string} expectedFamily - Expected layout family name
 * @param {Object} [options] - Options
 * @param {string} [options.css] - Optional external CSS
 * @returns {{ score: number, pass: boolean, verdict: string, dimensions: Object }}
 */
function calculatePersonalityScore(html, expectedFamily, options) {
  if (!html || typeof html !== 'string') {
    throw new Error('html parameter is required and must be a string');
  }

  const preset = FAMILY_DIMENSION_PRESETS[expectedFamily];
  if (!preset) {
    throw new Error(`Unknown layout family: ${expectedFamily}`);
  }

  const css = options && options.css;
  const actualDimensions = extractDimensions(html, css);
  const dimensionScores = {};
  let totalScore = 0;

  for (const dim of DIMENSION_KEYS) {
    const actual = actualDimensions[dim] || 'unknown';
    const expected = preset[dim];
    const dimScore = scoreDimension(dim, actual, expected, expectedFamily);
    dimensionScores[dim] = {
      actual,
      expected,
      score: dimScore,
    };
    totalScore += dimScore;
  }

  const normalizedScore = totalScore / (DIMENSION_KEYS.length * 100);
  const pass = normalizedScore >= THRESHOLDS.personalityScore;

  let verdict;
  if (normalizedScore >= 0.8) verdict = 'STRONG_EXPRESSION';
  else if (normalizedScore >= 0.6) verdict = 'ADEQUATE_EXPRESSION';
  else if (normalizedScore >= 0.4) verdict = 'WEAK_EXPRESSION';
  else verdict = 'WRONG_PERSONALITY';

  return {
    score: Math.round(normalizedScore * 1000) / 1000,
    pass,
    verdict,
    dimensions: dimensionScores,
  };
}

/**
 * Calculate differentiation score between two brand layouts.
 *
 * @param {string} htmlA - Generated HTML for Brand A
 * @param {string} htmlB - Generated HTML for Brand B
 * @param {Object} [options] - Options
 * @param {string} [options.cssA] - Optional external CSS for Brand A
 * @param {string} [options.cssB] - Optional external CSS for Brand B
 * @returns {{ score: number, pass: boolean, verdict: string, differingDimensions: number, dimensionComparison: Object }}
 */
function calculateDifferentiationScore(htmlA, htmlB, options) {
  if (!htmlA || typeof htmlA !== 'string') {
    throw new Error('htmlA parameter is required and must be a string');
  }
  if (!htmlB || typeof htmlB !== 'string') {
    throw new Error('htmlB parameter is required and must be a string');
  }

  const opts = options || {};
  const dimensionsA = extractDimensions(htmlA, opts.cssA);
  const dimensionsB = extractDimensions(htmlB, opts.cssB);

  let differingDimensions = 0;
  const dimensionComparison = {};

  for (const dim of DIMENSION_KEYS) {
    const valA = dimensionsA[dim] || 'unknown';
    const valB = dimensionsB[dim] || 'unknown';
    const isDifferent = valA !== valB;

    if (isDifferent) differingDimensions++;

    dimensionComparison[dim] = {
      brandA: valA,
      brandB: valB,
      different: isDifferent,
    };
  }

  // Dimensional diff score (100% weight since we cannot do visual pixel diff)
  const dimensionalDiffScore = differingDimensions / DIMENSION_KEYS.length;
  const score = Math.round(dimensionalDiffScore * 1000) / 1000;
  const pass = score >= THRESHOLDS.differentiationScore;

  let verdict;
  if (score >= 0.7) verdict = 'STRONG_DIFFERENTIATION';
  else if (score >= 0.5) verdict = 'ADEQUATE_DIFFERENTIATION';
  else if (score >= 0.3) verdict = 'WEAK_DIFFERENTIATION';
  else verdict = 'NO_DIFFERENTIATION';

  return {
    score,
    pass,
    verdict,
    differingDimensions,
    dimensionComparison,
  };
}

/**
 * @typedef {Object} GateResult
 * @property {string} gate - Gate name
 * @property {boolean} pass - Whether the gate passed
 * @property {string} verdict - Gate verdict
 * @property {boolean} blocking - Whether this gate blocks delivery
 * @property {Object} details - Gate-specific details
 */

/**
 * @typedef {Object} QualityGateResult
 * @property {boolean} pass - Whether all blocking gates passed
 * @property {string} verdict - 'PASS' | 'FAIL' | 'PASS_WITH_WARNINGS'
 * @property {GateResult[]} gates - Individual gate results
 * @property {string[]} warnings - Non-blocking warnings
 * @property {Object} summary - Summary counts
 * @property {number} summary.total - Total gates run
 * @property {number} summary.passed - Gates that passed
 * @property {number} summary.failed - Gates that failed
 * @property {number} summary.warnings - Warning-only gate failures
 */

/**
 * Run all quality gates on a generated layout.
 *
 * @param {Object} input - Gate input
 * @param {string} input.html - Generated HTML string
 * @param {string} [input.css] - Optional external CSS string
 * @param {string} input.family - Expected layout family name
 * @param {Object} [input.options] - Additional options
 * @param {string} [input.options.baselineDir] - Visual regression baseline directory
 * @param {boolean} [input.options.updateBaseline] - Force baseline update
 * @param {string} [input.options.comparisonHtml] - HTML of a second brand for differentiation check
 * @param {string} [input.options.comparisonCss] - CSS of a second brand for differentiation check
 * @param {string[]} [input.options.skipGates] - Gate names to skip
 * @returns {QualityGateResult}
 */
function runQualityGates(input) {
  if (!input || typeof input !== 'object') {
    throw new Error('input is required and must be an object');
  }
  if (!input.html || typeof input.html !== 'string') {
    throw new Error('input.html is required and must be a string');
  }
  if (!input.family || typeof input.family !== 'string') {
    throw new Error('input.family is required and must be a string');
  }

  const opts = input.options || {};
  const skipGates = opts.skipGates || [];
  const gates = [];
  const warnings = [];

  // Gate 1: Lighthouse Performance (BLOCKING)
  if (!skipGates.includes('lighthouse')) {
    try {
      const lighthouseResult = runLighthouseGate(input.html, input.css, {
        threshold: THRESHOLDS.lighthousePerformance,
      });

      gates.push({
        gate: 'lighthouse',
        pass: lighthouseResult.pass,
        verdict: lighthouseResult.verdict,
        blocking: true,
        details: {
          performanceScore: lighthouseResult.performanceScore,
          threshold: THRESHOLDS.lighthousePerformance,
          audits: lighthouseResult.audits,
        },
      });

      if (lighthouseResult.warnings.length > 0) {
        warnings.push(...lighthouseResult.warnings.map((w) => `[lighthouse] ${w}`));
      }
    } catch (err) {
      gates.push({
        gate: 'lighthouse',
        pass: false,
        verdict: 'ERROR',
        blocking: true,
        details: { error: err.message },
      });
    }
  }

  // Gate 2: WCAG AA Accessibility (BLOCKING)
  if (!skipGates.includes('accessibility')) {
    try {
      const a11yResult = runAccessibilityGate(input.html);

      gates.push({
        gate: 'accessibility',
        pass: a11yResult.pass,
        verdict: a11yResult.verdict,
        blocking: true,
        details: {
          violationCount: a11yResult.violationCount,
          threshold: THRESHOLDS.wcagViolations,
          summary: a11yResult.summary,
          violations: a11yResult.violations,
        },
      });
    } catch (err) {
      gates.push({
        gate: 'accessibility',
        pass: false,
        verdict: 'ERROR',
        blocking: true,
        details: { error: err.message },
      });
    }
  }

  // Gate 3: Responsive Viewports (BLOCKING)
  if (!skipGates.includes('responsive')) {
    try {
      const responsiveResult = runResponsiveGate(input.html, input.css);

      gates.push({
        gate: 'responsive',
        pass: responsiveResult.pass,
        verdict: responsiveResult.verdict,
        blocking: true,
        details: {
          viewports: responsiveResult.viewports,
        },
      });

      if (responsiveResult.warnings.length > 0) {
        warnings.push(...responsiveResult.warnings.map((w) => `[responsive] ${w}`));
      }
    } catch (err) {
      gates.push({
        gate: 'responsive',
        pass: false,
        verdict: 'ERROR',
        blocking: true,
        details: { error: err.message },
      });
    }
  }

  // Gate 4: Visual Regression Baseline (BLOCKING)
  if (!skipGates.includes('visual-regression')) {
    try {
      const vrResult = runVisualRegressionGate(input.html, input.family, {
        css: input.css,
        baselineDir: opts.baselineDir,
        updateBaseline: opts.updateBaseline,
      });

      gates.push({
        gate: 'visual-regression',
        pass: vrResult.pass,
        verdict: vrResult.verdict,
        blocking: true,
        details: {
          family: vrResult.family,
          currentHash: vrResult.currentHash,
          baselineHash: vrResult.baselineHash,
          diff: vrResult.diff,
        },
      });
    } catch (err) {
      gates.push({
        gate: 'visual-regression',
        pass: false,
        verdict: 'ERROR',
        blocking: true,
        details: { error: err.message },
      });
    }
  }

  // Gate 5: Personality Score (WARNING only)
  if (!skipGates.includes('personality')) {
    try {
      const personalityResult = calculatePersonalityScore(input.html, input.family, {
        css: input.css,
      });

      gates.push({
        gate: 'personality',
        pass: personalityResult.pass,
        verdict: personalityResult.verdict,
        blocking: false,
        details: {
          score: personalityResult.score,
          threshold: THRESHOLDS.personalityScore,
          dimensions: personalityResult.dimensions,
        },
      });

      if (!personalityResult.pass) {
        warnings.push(
          `[personality] Score ${personalityResult.score} below threshold ${THRESHOLDS.personalityScore}`
        );
      }
    } catch (err) {
      gates.push({
        gate: 'personality',
        pass: false,
        verdict: 'ERROR',
        blocking: false,
        details: { error: err.message },
      });
    }
  }

  // Gate 6: Differentiation Check (WARNING only, requires comparison HTML)
  if (!skipGates.includes('differentiation') && opts.comparisonHtml) {
    try {
      const diffResult = calculateDifferentiationScore(
        input.html,
        opts.comparisonHtml,
        { cssA: input.css, cssB: opts.comparisonCss },
      );

      gates.push({
        gate: 'differentiation',
        pass: diffResult.pass,
        verdict: diffResult.verdict,
        blocking: false,
        details: {
          score: diffResult.score,
          threshold: THRESHOLDS.differentiationScore,
          differingDimensions: diffResult.differingDimensions,
          dimensionComparison: diffResult.dimensionComparison,
        },
      });

      if (!diffResult.pass) {
        warnings.push(
          `[differentiation] Score ${diffResult.score} below threshold ${THRESHOLDS.differentiationScore}`
        );
      }
    } catch (err) {
      gates.push({
        gate: 'differentiation',
        pass: false,
        verdict: 'ERROR',
        blocking: false,
        details: { error: err.message },
      });
    }
  }

  // Compute summary
  const passed = gates.filter((g) => g.pass).length;
  const failed = gates.filter((g) => !g.pass && g.blocking).length;
  const warningCount = gates.filter((g) => !g.pass && !g.blocking).length;

  const allBlockingPassed = gates
    .filter((g) => g.blocking)
    .every((g) => g.pass);

  let verdict;
  if (allBlockingPassed && warningCount === 0) {
    verdict = 'PASS';
  } else if (allBlockingPassed && warningCount > 0) {
    verdict = 'PASS_WITH_WARNINGS';
  } else {
    verdict = 'FAIL';
  }

  return {
    pass: allBlockingPassed,
    verdict,
    gates,
    warnings,
    summary: {
      total: gates.length,
      passed,
      failed,
      warnings: warningCount,
    },
  };
}

module.exports = {
  runQualityGates,
  THRESHOLDS,
  FAMILY_DIMENSION_PRESETS,
  DIMENSION_KEYS,
  CONTRADICTIONS,
  // Individual scoring functions
  calculatePersonalityScore,
  calculateDifferentiationScore,
  extractDimensions,
  scoreDimension,
  // Utility functions
  extractCSSVarValue,
  detectNavFromHTML,
  detectAnimationFromCSS,
  areFamilyCompatible,
  isNeutralValue,
};
