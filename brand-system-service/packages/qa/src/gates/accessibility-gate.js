'use strict';

/**
 * WCAG AA Accessibility Gate
 *
 * Static analysis of generated HTML for WCAG 2.1 AA compliance.
 * Checks: color contrast hints, keyboard navigation, semantic HTML,
 * ARIA attributes, form labels, heading hierarchy, and language attributes.
 *
 * Zero external dependencies -- heuristic-based static analysis only.
 *
 * @module accessibility-gate
 */

/**
 * @typedef {Object} AccessibilityViolation
 * @property {string} rule - WCAG rule identifier
 * @property {string} description - Human-readable description
 * @property {string} severity - 'critical' | 'serious' | 'moderate' | 'minor'
 * @property {string} element - The HTML element or selector involved
 */

/**
 * @typedef {Object} AccessibilityAuditResult
 * @property {boolean} pass - Whether there are zero violations
 * @property {string} verdict - 'PASS' or 'FAIL'
 * @property {number} violationCount - Total number of violations
 * @property {AccessibilityViolation[]} violations - List of violations found
 * @property {Object} summary - Summary by severity
 * @property {number} summary.critical - Critical violation count
 * @property {number} summary.serious - Serious violation count
 * @property {number} summary.moderate - Moderate violation count
 * @property {number} summary.minor - Minor violation count
 */

/**
 * Check for lang attribute on <html> tag.
 *
 * @param {string} html
 * @returns {AccessibilityViolation[]}
 */
function checkLanguageAttribute(html) {
  const violations = [];
  const htmlTagMatch = html.match(/<html[^>]*>/i);

  if (htmlTagMatch) {
    if (!/\blang=["'][^"']+["']/i.test(htmlTagMatch[0])) {
      violations.push({
        rule: 'html-has-lang',
        description: '<html> element must have a lang attribute',
        severity: 'serious',
        element: '<html>',
      });
    }
  }

  return violations;
}

/**
 * Check heading hierarchy (h1-h6 in proper order, at least one h1).
 *
 * @param {string} html
 * @returns {AccessibilityViolation[]}
 */
function checkHeadingHierarchy(html) {
  const violations = [];
  const headingRegex = /<h([1-6])[^>]*>/gi;
  const headings = [];
  let match;

  while ((match = headingRegex.exec(html)) !== null) {
    headings.push(parseInt(match[1], 10));
  }

  if (headings.length === 0) {
    return violations;
  }

  // Check for at least one h1
  if (!headings.includes(1)) {
    violations.push({
      rule: 'page-has-heading-one',
      description: 'Page must contain at least one <h1> heading',
      severity: 'moderate',
      element: 'document',
    });
  }

  // Check for heading level skips (e.g., h1 -> h3 without h2)
  for (let i = 1; i < headings.length; i++) {
    if (headings[i] > headings[i - 1] + 1) {
      violations.push({
        rule: 'heading-order',
        description: `Heading level skipped: <h${headings[i - 1]}> followed by <h${headings[i]}>`,
        severity: 'moderate',
        element: `<h${headings[i]}>`,
      });
      break; // Report once
    }
  }

  return violations;
}

/**
 * Check images for alt attributes.
 *
 * @param {string} html
 * @returns {AccessibilityViolation[]}
 */
function checkImageAlternatives(html) {
  const violations = [];
  const imgRegex = /<img[^>]*>/gi;
  const images = html.match(imgRegex) || [];

  for (const img of images) {
    // Check for alt attribute (including empty alt="" which is valid for decorative images)
    if (!/\balt=/i.test(img)) {
      const src = (img.match(/src=["']([^"']*)["']/i) || [])[1] || 'unknown';
      violations.push({
        rule: 'image-alt',
        description: `Image missing alt attribute: ${src}`,
        severity: 'critical',
        element: img.substring(0, 80),
      });
    }
  }

  return violations;
}

/**
 * Check form inputs for associated labels.
 *
 * @param {string} html
 * @returns {AccessibilityViolation[]}
 */
function checkFormLabels(html) {
  const violations = [];
  const inputRegex = /<input[^>]*>/gi;
  const inputs = html.match(inputRegex) || [];

  for (const input of inputs) {
    // Skip hidden and submit/button types
    if (/type=["'](?:hidden|submit|button|reset|image)["']/i.test(input)) {
      continue;
    }

    const hasAriaLabel = /\baria-label=["'][^"']+["']/i.test(input);
    const hasAriaLabelledby = /\baria-labelledby=["'][^"']+["']/i.test(input);
    const hasTitle = /\btitle=["'][^"']+["']/i.test(input);
    const hasId = /\bid=["']([^"']+)["']/i.test(input);

    if (!hasAriaLabel && !hasAriaLabelledby && !hasTitle) {
      // Check if there's a matching <label for="id">
      if (hasId) {
        const id = (input.match(/\bid=["']([^"']+)["']/i) || [])[1];
        const labelRegex = new RegExp(`<label[^>]*\\bfor=["']${id}["'][^>]*>`, 'i');
        if (!labelRegex.test(html)) {
          violations.push({
            rule: 'label',
            description: `Form input missing associated label: id="${id}"`,
            severity: 'critical',
            element: input.substring(0, 80),
          });
        }
      } else {
        violations.push({
          rule: 'label',
          description: 'Form input missing label, aria-label, or aria-labelledby',
          severity: 'critical',
          element: input.substring(0, 80),
        });
      }
    }
  }

  return violations;
}

/**
 * Check for proper use of semantic HTML landmarks.
 *
 * @param {string} html
 * @returns {AccessibilityViolation[]}
 */
function checkSemanticLandmarks(html) {
  const violations = [];

  // Check for <main> landmark
  if (!/<main[\s>]/i.test(html)) {
    violations.push({
      rule: 'landmark-main-is-top-level',
      description: 'Page should contain a <main> landmark',
      severity: 'moderate',
      element: 'document',
    });
  }

  // Check for <nav> landmark
  if (!/<nav[\s>]/i.test(html)) {
    violations.push({
      rule: 'landmark-navigation',
      description: 'Page should contain a <nav> landmark',
      severity: 'minor',
      element: 'document',
    });
  }

  return violations;
}

/**
 * Check interactive elements for keyboard accessibility hints.
 *
 * @param {string} html
 * @returns {AccessibilityViolation[]}
 */
function checkKeyboardAccessibility(html) {
  const violations = [];

  // Check for onclick on non-interactive elements without tabindex and role
  const onclickRegex = /<(?:div|span|p|section|article)[^>]*\bonclick\b[^>]*>/gi;
  const clickableNonInteractive = html.match(onclickRegex) || [];

  for (const el of clickableNonInteractive) {
    const hasTabindex = /\btabindex=/i.test(el);
    const hasRole = /\brole=["'](?:button|link)["']/i.test(el);

    if (!hasTabindex || !hasRole) {
      violations.push({
        rule: 'interactive-supports-focus',
        description: 'Clickable non-interactive element needs tabindex and role="button"',
        severity: 'serious',
        element: el.substring(0, 80),
      });
    }
  }

  return violations;
}

/**
 * Check ARIA attribute usage.
 *
 * @param {string} html
 * @returns {AccessibilityViolation[]}
 */
function checkAriaAttributes(html) {
  const violations = [];

  // Check for aria-hidden="true" on focusable elements
  const ariaHiddenFocusable = /<(?:a|button|input|select|textarea)[^>]*aria-hidden=["']true["'][^>]*>/gi;
  const hiddenFocusable = html.match(ariaHiddenFocusable) || [];

  for (const el of hiddenFocusable) {
    violations.push({
      rule: 'aria-hidden-focus',
      description: 'Focusable element should not have aria-hidden="true"',
      severity: 'serious',
      element: el.substring(0, 80),
    });
  }

  return violations;
}

/**
 * Check color contrast indicators in inline styles.
 * This is a heuristic check -- real contrast checking requires computed styles.
 *
 * @param {string} html
 * @returns {AccessibilityViolation[]}
 */
function checkContrastHints(html) {
  const violations = [];

  // Look for very light text color on potentially light background
  // This is a rough heuristic: color values close to white (#fff, #fafafa, etc.)
  const lightColorRegex = /color\s*:\s*(?:#(?:fff|FFF|fefefe|FEFEFE|fafafa|FAFAFA|f[0-9a-fA-F]{5}))\b/gi;
  const lightOnLight = html.match(lightColorRegex) || [];

  if (lightOnLight.length > 0) {
    violations.push({
      rule: 'color-contrast',
      description: 'Very light text color detected -- verify contrast ratio meets 4.5:1 for WCAG AA',
      severity: 'moderate',
      element: 'inline-style',
    });
  }

  return violations;
}

/**
 * Run WCAG AA accessibility audit on generated HTML.
 *
 * @param {string} html - The generated HTML string to audit
 * @param {Object} [options] - Options
 * @param {string[]} [options.skipRules] - Rule IDs to skip
 * @returns {AccessibilityAuditResult}
 */
function runAccessibilityGate(html, options) {
  if (!html || typeof html !== 'string') {
    throw new Error('html parameter is required and must be a string');
  }

  const skipRules = (options && options.skipRules) || [];
  const allViolations = [];

  // Run all checks
  const checks = [
    checkLanguageAttribute,
    checkHeadingHierarchy,
    checkImageAlternatives,
    checkFormLabels,
    checkSemanticLandmarks,
    checkKeyboardAccessibility,
    checkAriaAttributes,
    checkContrastHints,
  ];

  for (const check of checks) {
    const violations = check(html);
    for (const v of violations) {
      if (!skipRules.includes(v.rule)) {
        allViolations.push(v);
      }
    }
  }

  // Summarize by severity
  const summary = { critical: 0, serious: 0, moderate: 0, minor: 0 };
  for (const v of allViolations) {
    summary[v.severity]++;
  }

  const pass = allViolations.length === 0;

  return {
    pass,
    verdict: pass ? 'PASS' : 'FAIL',
    violationCount: allViolations.length,
    violations: allViolations,
    summary,
  };
}

module.exports = {
  runAccessibilityGate,
  // Exported for testing
  checkLanguageAttribute,
  checkHeadingHierarchy,
  checkImageAlternatives,
  checkFormLabels,
  checkSemanticLandmarks,
  checkKeyboardAccessibility,
  checkAriaAttributes,
  checkContrastHints,
};
