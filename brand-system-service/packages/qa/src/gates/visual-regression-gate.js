'use strict';

/**
 * Visual Regression Baseline Gate
 *
 * Manages baseline snapshots for layout families and compares
 * new builds against the baseline using structural hashing.
 *
 * Since we cannot take real screenshots in a headless static analysis,
 * this gate uses a structural hash approach: it generates a fingerprint
 * from the HTML structure + CSS custom properties, and compares against
 * a stored baseline fingerprint per layout family.
 *
 * Zero external dependencies.
 *
 * @module visual-regression-gate
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/** @type {string} Default directory for baseline storage */
const DEFAULT_BASELINE_DIR = '.layout-baselines';

/**
 * @typedef {Object} BaselineEntry
 * @property {string} family - Layout family name
 * @property {string} hash - Structural hash of the layout
 * @property {string} timestamp - ISO timestamp when baseline was created
 * @property {Object} structure - Structural summary
 * @property {number} structure.tagCount - Total tag count
 * @property {number} structure.depth - Maximum DOM depth
 * @property {string[]} structure.cssVars - Layout CSS custom properties found
 */

/**
 * @typedef {Object} VisualRegressionResult
 * @property {boolean} pass - Whether the layout matches baseline (or baseline was created)
 * @property {string} verdict - 'PASS' | 'BASELINE_CREATED' | 'REGRESSION_DETECTED'
 * @property {string} family - Layout family name
 * @property {string} currentHash - Hash of the current layout
 * @property {string|null} baselineHash - Hash from baseline (null if no baseline)
 * @property {Object|null} diff - Structural differences if regression detected
 */

/**
 * Generate a structural hash from HTML content.
 * Ignores whitespace variations and content text to focus on structure.
 *
 * @param {string} html - HTML string
 * @param {string} [css] - Optional CSS string
 * @returns {{ hash: string, structure: { tagCount: number, depth: number, cssVars: string[] }}}
 */
function generateStructuralHash(html, css) {
  // 1. Extract tag structure (ignore text content and attributes values)
  const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)[^>]*>/g;
  const tags = [];
  let match;

  while ((match = tagRegex.exec(html)) !== null) {
    tags.push(match[0].replace(/=["'][^"']*["']/g, '=""').toLowerCase());
  }

  // 2. Extract CSS custom properties (--layout-*)
  const cssVars = [];
  const combinedCSS = (css || '') + '\n' + extractInlineCSS(html);
  const varRegex = /(--layout-[a-zA-Z0-9-]+)\s*:/g;
  let varMatch;

  while ((varMatch = varRegex.exec(combinedCSS)) !== null) {
    if (!cssVars.includes(varMatch[1])) {
      cssVars.push(varMatch[1]);
    }
  }
  cssVars.sort();

  // 3. Calculate structure metrics
  const selfClosing = new Set([
    'br', 'hr', 'img', 'input', 'meta', 'link',
    'area', 'base', 'col', 'embed', 'source', 'track', 'wbr',
  ]);

  let depth = 0;
  let maxDepth = 0;
  const structureTags = [];

  for (const tag of tags) {
    const tagName = (tag.match(/<\/?([a-zA-Z][a-zA-Z0-9]*)/) || [])[1];
    if (!tagName) continue;

    if (selfClosing.has(tagName.toLowerCase()) || tag.endsWith('/>')) {
      structureTags.push(tagName.toLowerCase());
      continue;
    }

    if (tag.startsWith('</')) {
      depth = Math.max(0, depth - 1);
    } else {
      depth++;
      if (depth > maxDepth) maxDepth = depth;
    }
    structureTags.push(tagName.toLowerCase());
  }

  // 4. Build fingerprint from structure
  const fingerprint = [
    structureTags.join(','),
    cssVars.join(','),
  ].join('|');

  const hash = crypto
    .createHash('sha256')
    .update(fingerprint)
    .digest('hex')
    .substring(0, 16);

  return {
    hash,
    structure: {
      tagCount: structureTags.length,
      depth: maxDepth,
      cssVars,
    },
  };
}

/**
 * Extract inline CSS from HTML style tags.
 *
 * @param {string} html
 * @returns {string}
 */
function extractInlineCSS(html) {
  const blocks = [];
  const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let match;

  while ((match = styleRegex.exec(html)) !== null) {
    blocks.push(match[1]);
  }

  return blocks.join('\n');
}

/**
 * Load existing baseline for a layout family.
 *
 * @param {string} family - Layout family name
 * @param {string} baselineDir - Directory containing baselines
 * @returns {BaselineEntry|null}
 */
function loadBaseline(family, baselineDir) {
  const filePath = path.join(baselineDir, `${family}.json`);

  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch {
    return null;
  }
}

/**
 * Save a baseline entry for a layout family.
 *
 * @param {BaselineEntry} entry - Baseline data to save
 * @param {string} baselineDir - Directory to save baselines
 */
function saveBaseline(entry, baselineDir) {
  if (!fs.existsSync(baselineDir)) {
    fs.mkdirSync(baselineDir, { recursive: true });
  }

  const filePath = path.join(baselineDir, `${entry.family}.json`);
  fs.writeFileSync(filePath, JSON.stringify(entry, null, 2), 'utf8');
}

/**
 * Compare two structural hashes and compute a diff summary.
 *
 * @param {Object} current - Current structure
 * @param {Object} baseline - Baseline structure
 * @returns {Object} Diff summary
 */
function computeStructuralDiff(current, baseline) {
  const addedVars = current.cssVars.filter((v) => !baseline.cssVars.includes(v));
  const removedVars = baseline.cssVars.filter((v) => !current.cssVars.includes(v));
  const tagCountDelta = current.tagCount - baseline.tagCount;
  const depthDelta = current.depth - baseline.depth;

  return {
    tagCountDelta,
    depthDelta,
    addedCSSVars: addedVars,
    removedCSSVars: removedVars,
    structurallyIdentical: tagCountDelta === 0 && depthDelta === 0 &&
      addedVars.length === 0 && removedVars.length === 0,
  };
}

/**
 * Run visual regression gate for a layout.
 *
 * @param {string} html - Generated HTML string
 * @param {string} family - Layout family name
 * @param {Object} [options] - Options
 * @param {string} [options.css] - Optional external CSS
 * @param {string} [options.baselineDir] - Directory for baseline storage
 * @param {boolean} [options.updateBaseline] - Force baseline update
 * @returns {VisualRegressionResult}
 */
function runVisualRegressionGate(html, family, options) {
  if (!html || typeof html !== 'string') {
    throw new Error('html parameter is required and must be a string');
  }
  if (!family || typeof family !== 'string') {
    throw new Error('family parameter is required and must be a string');
  }

  const opts = options || {};
  const baselineDir = opts.baselineDir || DEFAULT_BASELINE_DIR;
  const updateBaseline = opts.updateBaseline || false;

  // Generate current structural hash
  const { hash: currentHash, structure: currentStructure } = generateStructuralHash(html, opts.css);

  // Load existing baseline
  const baseline = loadBaseline(family, baselineDir);

  // If no baseline exists or update requested, create baseline
  if (!baseline || updateBaseline) {
    const entry = {
      family,
      hash: currentHash,
      timestamp: new Date().toISOString(),
      structure: currentStructure,
    };

    saveBaseline(entry, baselineDir);

    return {
      pass: true,
      verdict: 'BASELINE_CREATED',
      family,
      currentHash,
      baselineHash: null,
      diff: null,
    };
  }

  // Compare against baseline
  if (currentHash === baseline.hash) {
    return {
      pass: true,
      verdict: 'PASS',
      family,
      currentHash,
      baselineHash: baseline.hash,
      diff: null,
    };
  }

  // Regression detected
  const diff = computeStructuralDiff(currentStructure, baseline.structure);

  return {
    pass: false,
    verdict: 'REGRESSION_DETECTED',
    family,
    currentHash,
    baselineHash: baseline.hash,
    diff,
  };
}

module.exports = {
  runVisualRegressionGate,
  DEFAULT_BASELINE_DIR,
  // Exported for testing
  generateStructuralHash,
  loadBaseline,
  saveBaseline,
  computeStructuralDiff,
  extractInlineCSS,
};
