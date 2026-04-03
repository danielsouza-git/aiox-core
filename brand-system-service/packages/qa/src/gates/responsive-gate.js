'use strict';

/**
 * Responsive Viewport Validation Gate
 *
 * Validates that generated HTML/CSS will not produce horizontal overflow
 * at 3 breakpoints: 375px (mobile), 768px (tablet), 1440px (desktop).
 *
 * Static analysis approach: inspects CSS for fixed widths, media queries,
 * and layout patterns that could cause overflow.
 *
 * Zero external dependencies.
 *
 * @module responsive-gate
 */

/** @type {number[]} Breakpoints to validate */
const BREAKPOINTS = [375, 768, 1440];

/**
 * @typedef {Object} ViewportResult
 * @property {number} viewport - Viewport width in px
 * @property {boolean} pass - Whether viewport passes validation
 * @property {string[]} issues - Issues found at this viewport
 */

/**
 * @typedef {Object} ResponsiveAuditResult
 * @property {boolean} pass - Whether all viewports pass
 * @property {string} verdict - 'PASS' or 'FAIL'
 * @property {ViewportResult[]} viewports - Per-viewport results
 * @property {string[]} warnings - Non-blocking warnings
 */

/**
 * Extract all fixed width declarations from CSS/HTML.
 *
 * @param {string} css - CSS string (inline or external)
 * @returns {{ selector: string, width: number, unit: string }[]}
 */
function extractFixedWidths(css) {
  const results = [];

  // Parse CSS rule blocks: selector { declarations }
  const ruleRegex = /([^{}]+)\{([^}]*)\}/g;
  let ruleMatch;

  while ((ruleMatch = ruleRegex.exec(css)) !== null) {
    const selector = ruleMatch[1].trim().split('\n').pop().trim();
    const declarations = ruleMatch[2];

    // Match only standalone "width" property (not max-width, min-width, or custom properties)
    // Split declarations by semicolons and check each
    const decls = declarations.split(';');
    for (const decl of decls) {
      const trimmed = decl.trim();
      // Must start with "width" (or have whitespace/newline before it), not be part of a longer property name
      const widthMatch = trimmed.match(/^width\s*:\s*(\d+)(px)\b/i);
      if (widthMatch) {
        results.push({
          selector,
          width: parseInt(widthMatch[1], 10),
          unit: widthMatch[2],
        });
      }
    }
  }

  return results;
}

/**
 * Extract media query breakpoints from CSS.
 *
 * @param {string} css - CSS string
 * @returns {number[]} Declared breakpoint values in px
 */
function extractMediaQueryBreakpoints(css) {
  const breakpoints = new Set();
  const mqRegex = /@media[^{]*\(\s*(?:max|min)-width\s*:\s*(\d+)px\s*\)/gi;
  let match;

  while ((match = mqRegex.exec(css)) !== null) {
    breakpoints.add(parseInt(match[1], 10));
  }

  return Array.from(breakpoints).sort((a, b) => a - b);
}

/**
 * Check for viewport meta tag configuration.
 *
 * @param {string} html - HTML string
 * @returns {{ present: boolean, hasWidth: boolean, content: string }}
 */
function checkViewportMeta(html) {
  const match = html.match(/<meta[^>]*name=["']viewport["'][^>]*content=["']([^"']*)["'][^>]*>/i)
    || html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']viewport["'][^>]*>/i);

  if (!match) {
    return { present: false, hasWidth: false, content: '' };
  }

  const content = match[1];
  return {
    present: true,
    hasWidth: /width=device-width/i.test(content),
    content,
  };
}

/**
 * Check for horizontal overflow risks at a specific viewport width.
 *
 * @param {string} html - HTML string
 * @param {string} css - Combined CSS string
 * @param {number} viewport - Viewport width in px
 * @returns {string[]} List of issues found
 */
function checkViewportOverflow(html, css, viewport) {
  const issues = [];

  // 1. Check for fixed widths larger than viewport
  const fixedWidths = extractFixedWidths(css);
  for (const fw of fixedWidths) {
    if (fw.width > viewport) {
      // Exclude if inside a max-width media query that would apply
      issues.push(
        `Element "${fw.selector}" has fixed width ${fw.width}px exceeding ${viewport}px viewport`
      );
    }
  }

  // 2. Check inline style fixed widths in HTML (standalone "width:" only, not max-width/min-width)
  const inlineStyleRegex = /style=["']([^"']*)["']/gi;
  let styleMatch;
  while ((styleMatch = inlineStyleRegex.exec(html)) !== null) {
    const styleContent = styleMatch[1];
    // Split by semicolons and find standalone width declarations
    const decls = styleContent.split(';');
    for (const decl of decls) {
      const trimmed = decl.trim();
      const widthPxMatch = trimmed.match(/^width\s*:\s*(\d+)px/i);
      if (widthPxMatch) {
        const width = parseInt(widthPxMatch[1], 10);
        if (width > viewport) {
          issues.push(`Inline style has fixed width ${width}px exceeding ${viewport}px viewport`);
        }
      }
    }
  }

  // 3. Check for min-width values larger than viewport
  const minWidthRegex = /min-width\s*:\s*(\d+)px/gi;
  let minMatch;
  while ((minMatch = minWidthRegex.exec(css)) !== null) {
    const minWidth = parseInt(minMatch[1], 10);
    if (minWidth > viewport) {
      issues.push(`min-width: ${minWidth}px exceeds ${viewport}px viewport`);
    }
  }

  // 4. Check for tables without overflow handling
  if (/<table[^>]*>/i.test(html)) {
    const hasTableOverflow = /table[^{]*\{[^}]*overflow(?:-x)?\s*:\s*(?:auto|scroll|hidden)/i.test(css);
    const hasTableWrapper = /overflow(?:-x)?\s*:\s*(?:auto|scroll)/i.test(css);
    if (!hasTableOverflow && !hasTableWrapper && viewport <= 768) {
      issues.push('Tables detected without overflow handling at mobile/tablet viewport');
    }
  }

  // 5. Check for horizontal scroll patterns (overflow-x: visible or no overflow handling with wide content)
  if (viewport <= 375) {
    // At mobile, check for common overflow causes
    const hasOverflowHidden = /overflow-x\s*:\s*hidden/i.test(css) || /overflow\s*:\s*hidden/i.test(css);
    const hasBoxSizing = /box-sizing\s*:\s*border-box/i.test(css);
    if (!hasOverflowHidden && !hasBoxSizing) {
      issues.push('No box-sizing: border-box or overflow-x: hidden detected for mobile viewport');
    }
  }

  return issues;
}

/**
 * Extract all CSS content from HTML (inline styles + style tags).
 *
 * @param {string} html - HTML string
 * @returns {string} Combined CSS string
 */
function extractCSSFromHTML(html) {
  const cssBlocks = [];
  const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let match;

  while ((match = styleRegex.exec(html)) !== null) {
    cssBlocks.push(match[1]);
  }

  return cssBlocks.join('\n');
}

/**
 * Run responsive validation gate on generated HTML.
 *
 * @param {string} html - The generated HTML string
 * @param {string} [css] - Optional external CSS string
 * @param {Object} [options] - Options
 * @param {number[]} [options.breakpoints] - Override breakpoints (default: [375, 768, 1440])
 * @returns {ResponsiveAuditResult}
 */
function runResponsiveGate(html, css, options) {
  if (!html || typeof html !== 'string') {
    throw new Error('html parameter is required and must be a string');
  }

  const breakpoints = (options && options.breakpoints) || BREAKPOINTS;
  const warnings = [];

  // Combine inline CSS from HTML with external CSS
  const inlineCSS = extractCSSFromHTML(html);
  const combinedCSS = css ? `${inlineCSS}\n${css}` : inlineCSS;

  // Check viewport meta
  const viewportMeta = checkViewportMeta(html);
  if (!viewportMeta.present) {
    warnings.push('Missing <meta name="viewport"> tag -- responsive behavior may be unpredictable');
  } else if (!viewportMeta.hasWidth) {
    warnings.push('Viewport meta missing width=device-width');
  }

  // Check media query coverage
  const declaredBreakpoints = extractMediaQueryBreakpoints(combinedCSS);
  for (const bp of breakpoints) {
    const hasCoverage = declaredBreakpoints.some(
      (dbp) => Math.abs(dbp - bp) <= 50 // Within 50px tolerance
    );
    if (!hasCoverage && bp < 1440) {
      warnings.push(`No media query found near ${bp}px breakpoint`);
    }
  }

  // Validate each viewport
  const viewports = breakpoints.map((viewport) => {
    const issues = checkViewportOverflow(html, combinedCSS, viewport);
    return {
      viewport,
      pass: issues.length === 0,
      issues,
    };
  });

  const allPass = viewports.every((v) => v.pass);

  return {
    pass: allPass,
    verdict: allPass ? 'PASS' : 'FAIL',
    viewports,
    warnings,
  };
}

module.exports = {
  runResponsiveGate,
  BREAKPOINTS,
  // Exported for testing
  extractFixedWidths,
  extractMediaQueryBreakpoints,
  checkViewportMeta,
  checkViewportOverflow,
  extractCSSFromHTML,
};
