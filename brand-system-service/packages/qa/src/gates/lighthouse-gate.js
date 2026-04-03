'use strict';

/**
 * Lighthouse Performance Gate
 *
 * Simulates a Lighthouse audit for generated HTML output.
 * Checks performance-relevant heuristics: resource count, inline script size,
 * CSS efficiency, image optimization hints, and DOM depth.
 *
 * Zero external dependencies -- all checks are heuristic-based static analysis.
 *
 * @module lighthouse-gate
 */

/** @type {number} Minimum performance score to pass (0-100) */
const PERFORMANCE_THRESHOLD = 90;

/** @type {number} Maximum recommended DOM depth */
const MAX_DOM_DEPTH = 15;

/** @type {number} Maximum recommended inline script bytes */
const MAX_INLINE_SCRIPT_BYTES = 10000;

/** @type {number} Maximum recommended total CSS bytes */
const MAX_CSS_BYTES = 50000;

/** @type {number} Maximum recommended number of external resources */
const MAX_EXTERNAL_RESOURCES = 20;

/**
 * @typedef {Object} LighthouseAuditResult
 * @property {number} performanceScore - 0-100 performance score
 * @property {boolean} pass - Whether score meets threshold
 * @property {string} verdict - 'PASS' or 'FAIL'
 * @property {Object} audits - Individual audit results
 * @property {Object} audits.domDepth - DOM nesting depth audit
 * @property {Object} audits.inlineScripts - Inline script size audit
 * @property {Object} audits.cssSize - CSS size audit
 * @property {Object} audits.externalResources - External resource count audit
 * @property {Object} audits.metaViewport - Viewport meta tag audit
 * @property {Object} audits.doctype - DOCTYPE declaration audit
 * @property {Object} audits.charsetMeta - Charset meta tag audit
 * @property {Object} audits.imageAlt - Image alt attribute audit
 * @property {string[]} warnings - Non-blocking warnings
 */

/**
 * Count nesting depth of HTML by tracking open/close tags.
 *
 * @param {string} html - HTML string
 * @returns {number} Maximum nesting depth
 */
function estimateDOMDepth(html) {
  let depth = 0;
  let maxDepth = 0;

  // Self-closing tags that do not increase depth
  const selfClosing = new Set([
    'br', 'hr', 'img', 'input', 'meta', 'link',
    'area', 'base', 'col', 'embed', 'source', 'track', 'wbr',
  ]);

  const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)[^>]*\/?>/g;
  let match;

  while ((match = tagRegex.exec(html)) !== null) {
    const fullTag = match[0];
    const tagName = match[1].toLowerCase();

    if (selfClosing.has(tagName) || fullTag.endsWith('/>')) {
      continue;
    }

    if (fullTag.startsWith('</')) {
      depth = Math.max(0, depth - 1);
    } else {
      depth++;
      if (depth > maxDepth) {
        maxDepth = depth;
      }
    }
  }

  return maxDepth;
}

/**
 * Calculate total inline script bytes.
 *
 * @param {string} html - HTML string
 * @returns {number} Total bytes of inline scripts
 */
function measureInlineScripts(html) {
  const scriptRegex = /<script(?![^>]*\bsrc\b)[^>]*>([\s\S]*?)<\/script>/gi;
  let totalBytes = 0;
  let match;

  while ((match = scriptRegex.exec(html)) !== null) {
    totalBytes += Buffer.byteLength(match[1], 'utf8');
  }

  return totalBytes;
}

/**
 * Estimate total CSS bytes (inline styles + style tags).
 *
 * @param {string} html - HTML string
 * @param {string} [css] - Optional external CSS string
 * @returns {number} Total CSS bytes
 */
function measureCSSSize(html, css) {
  let totalBytes = 0;

  // Inline <style> tags
  const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let match;
  while ((match = styleRegex.exec(html)) !== null) {
    totalBytes += Buffer.byteLength(match[1], 'utf8');
  }

  // External CSS string
  if (css) {
    totalBytes += Buffer.byteLength(css, 'utf8');
  }

  return totalBytes;
}

/**
 * Count external resource references (scripts, stylesheets, images, fonts).
 *
 * @param {string} html - HTML string
 * @returns {number} Number of external resources
 */
function countExternalResources(html) {
  let count = 0;

  // External scripts
  const extScriptRegex = /<script[^>]*\bsrc\b[^>]*>/gi;
  const scriptMatches = html.match(extScriptRegex);
  if (scriptMatches) count += scriptMatches.length;

  // External stylesheets
  const linkStyleRegex = /<link[^>]*rel=["']stylesheet["'][^>]*>/gi;
  const linkMatches = html.match(linkStyleRegex);
  if (linkMatches) count += linkMatches.length;

  // Images
  const imgRegex = /<img[^>]*>/gi;
  const imgMatches = html.match(imgRegex);
  if (imgMatches) count += imgMatches.length;

  return count;
}

/**
 * Check for meta viewport tag.
 *
 * @param {string} html - HTML string
 * @returns {boolean}
 */
function hasMetaViewport(html) {
  return /<meta[^>]*name=["']viewport["'][^>]*>/i.test(html);
}

/**
 * Check for DOCTYPE declaration.
 *
 * @param {string} html - HTML string
 * @returns {boolean}
 */
function hasDoctype(html) {
  return /^<!DOCTYPE\s+html>/i.test(html.trim());
}

/**
 * Check for charset meta tag.
 *
 * @param {string} html - HTML string
 * @returns {boolean}
 */
function hasCharsetMeta(html) {
  return /<meta[^>]*charset=["']?utf-8["']?[^>]*>/i.test(html);
}

/**
 * Check that all images have alt attributes.
 *
 * @param {string} html - HTML string
 * @returns {{ total: number, withAlt: number }}
 */
function checkImageAlts(html) {
  const imgRegex = /<img[^>]*>/gi;
  const images = html.match(imgRegex) || [];
  let withAlt = 0;

  for (const img of images) {
    if (/\balt=["'][^"']*["']/i.test(img) || /\balt=""/i.test(img)) {
      withAlt++;
    }
  }

  return { total: images.length, withAlt };
}

/**
 * Compute a synthetic performance score from heuristic audits.
 *
 * Scoring breakdown:
 * - DOM depth:          20 points
 * - Inline scripts:     15 points
 * - CSS size:           15 points
 * - External resources: 15 points
 * - Meta viewport:      10 points
 * - DOCTYPE:            10 points
 * - Charset meta:        5 points
 * - Image alt attrs:    10 points
 *
 * @param {Object} audits - Audit results
 * @returns {number} Score 0-100
 */
function computeScore(audits) {
  let score = 0;

  // DOM depth (20 pts)
  if (audits.domDepth.value <= MAX_DOM_DEPTH) {
    score += 20;
  } else {
    const overRatio = Math.min((audits.domDepth.value - MAX_DOM_DEPTH) / MAX_DOM_DEPTH, 1);
    score += Math.max(0, Math.round(20 * (1 - overRatio)));
  }

  // Inline scripts (15 pts)
  if (audits.inlineScripts.value <= MAX_INLINE_SCRIPT_BYTES) {
    score += 15;
  } else {
    const overRatio = Math.min((audits.inlineScripts.value - MAX_INLINE_SCRIPT_BYTES) / MAX_INLINE_SCRIPT_BYTES, 1);
    score += Math.max(0, Math.round(15 * (1 - overRatio)));
  }

  // CSS size (15 pts)
  if (audits.cssSize.value <= MAX_CSS_BYTES) {
    score += 15;
  } else {
    const overRatio = Math.min((audits.cssSize.value - MAX_CSS_BYTES) / MAX_CSS_BYTES, 1);
    score += Math.max(0, Math.round(15 * (1 - overRatio)));
  }

  // External resources (15 pts)
  if (audits.externalResources.value <= MAX_EXTERNAL_RESOURCES) {
    score += 15;
  } else {
    const overRatio = Math.min((audits.externalResources.value - MAX_EXTERNAL_RESOURCES) / MAX_EXTERNAL_RESOURCES, 1);
    score += Math.max(0, Math.round(15 * (1 - overRatio)));
  }

  // Meta viewport (10 pts)
  if (audits.metaViewport.pass) score += 10;

  // DOCTYPE (10 pts)
  if (audits.doctype.pass) score += 10;

  // Charset meta (5 pts)
  if (audits.charsetMeta.pass) score += 5;

  // Image alt (10 pts)
  if (audits.imageAlt.total === 0 || audits.imageAlt.withAlt === audits.imageAlt.total) {
    score += 10;
  } else {
    score += Math.round(10 * (audits.imageAlt.withAlt / audits.imageAlt.total));
  }

  return score;
}

/**
 * Run a simulated Lighthouse performance audit on generated HTML.
 *
 * @param {string} html - The generated HTML string to audit
 * @param {string} [css] - Optional external CSS string
 * @param {Object} [options] - Options
 * @param {number} [options.threshold] - Override performance threshold (default: 90)
 * @returns {LighthouseAuditResult}
 */
function runLighthouseGate(html, css, options) {
  if (!html || typeof html !== 'string') {
    throw new Error('html parameter is required and must be a string');
  }

  const threshold = (options && options.threshold) || PERFORMANCE_THRESHOLD;
  const warnings = [];

  // Run individual audits
  const domDepthValue = estimateDOMDepth(html);
  const inlineScriptBytes = measureInlineScripts(html);
  const cssSizeBytes = measureCSSSize(html, css);
  const externalResourceCount = countExternalResources(html);
  const metaViewportPresent = hasMetaViewport(html);
  const doctypePresent = hasDoctype(html);
  const charsetPresent = hasCharsetMeta(html);
  const imageAltResults = checkImageAlts(html);

  const audits = {
    domDepth: {
      value: domDepthValue,
      pass: domDepthValue <= MAX_DOM_DEPTH,
      threshold: MAX_DOM_DEPTH,
    },
    inlineScripts: {
      value: inlineScriptBytes,
      pass: inlineScriptBytes <= MAX_INLINE_SCRIPT_BYTES,
      threshold: MAX_INLINE_SCRIPT_BYTES,
    },
    cssSize: {
      value: cssSizeBytes,
      pass: cssSizeBytes <= MAX_CSS_BYTES,
      threshold: MAX_CSS_BYTES,
    },
    externalResources: {
      value: externalResourceCount,
      pass: externalResourceCount <= MAX_EXTERNAL_RESOURCES,
      threshold: MAX_EXTERNAL_RESOURCES,
    },
    metaViewport: { pass: metaViewportPresent },
    doctype: { pass: doctypePresent },
    charsetMeta: { pass: charsetPresent },
    imageAlt: {
      total: imageAltResults.total,
      withAlt: imageAltResults.withAlt,
      pass: imageAltResults.total === 0 || imageAltResults.withAlt === imageAltResults.total,
    },
  };

  // Collect warnings
  if (!metaViewportPresent) {
    warnings.push('Missing <meta name="viewport"> tag');
  }
  if (!doctypePresent) {
    warnings.push('Missing <!DOCTYPE html> declaration');
  }
  if (!charsetPresent) {
    warnings.push('Missing <meta charset="utf-8"> tag');
  }
  if (imageAltResults.total > 0 && imageAltResults.withAlt < imageAltResults.total) {
    warnings.push(`${imageAltResults.total - imageAltResults.withAlt} image(s) missing alt attribute`);
  }

  const performanceScore = computeScore(audits);
  const pass = performanceScore >= threshold;

  return {
    performanceScore,
    pass,
    verdict: pass ? 'PASS' : 'FAIL',
    audits,
    warnings,
  };
}

module.exports = {
  runLighthouseGate,
  PERFORMANCE_THRESHOLD,
  // Exported for testing
  estimateDOMDepth,
  measureInlineScripts,
  measureCSSSize,
  countExternalResources,
  hasMetaViewport,
  hasDoctype,
  hasCharsetMeta,
  checkImageAlts,
  computeScore,
};
