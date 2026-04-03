'use strict';

/**
 * Brief Output Validator
 *
 * Validates layout-brief.md output structure (parsed as object).
 * Zero external dependencies.
 *
 * @module brief-output-validator
 */

const VALID_FAMILIES = [
  'ethereal',
  'bold-structured',
  'warm-artisan',
  'adventurous-open',
  'playful-dynamic',
  'rebel-edge',
];

const VALID_NAV_STYLES = [
  'centered-top',
  'sidebar-fixed',
  'breadcrumb-horizontal',
  'sticky-minimal',
  'floating-pill',
  'inline-minimal',
];

const VALID_DIVIDER_STYLES = [
  'solid-thin',
  'solid-thick',
  'organic-wave',
  'textured-line',
  'thin-geometric',
  'zigzag-wave',
  'slash-raw',
  'none',
];

const VALID_GRID_RHYTHMS = [
  'centered-single',
  'strict-grid',
  'masonry-inspired',
  'editorial-wide',
  'broken-asymmetric',
  'single-column-stacked',
];

const VALID_ENTRANCES = [
  'none',
  'fade-up',
  'slide-in',
  'scroll-reveal',
  'bounce-in',
  'cut-in',
];

const VALID_BACKGROUNDS = [
  'flat-solid',
  'soft-fill',
  'layered-shadow',
  'full-bleed-image',
  'alternating-accent',
  'dark-mono',
];

const VALID_CORNER_TREATMENTS = [
  'sharp',
  'subtle',
  'rounded',
  'pill',
];

const RECOMMENDATION_SECTIONS = [
  'navigation',
  'whitespace',
  'corners',
  'dividers',
  'grid',
  'animation',
  'sections',
];

/**
 * Validates layout-brief output structure.
 *
 * @param {object} brief - The parsed layout-brief object to validate.
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateBriefOutput(brief) {
  const errors = [];

  if (!brief || typeof brief !== 'object') {
    return { valid: false, errors: ['Brief must be a non-null object'] };
  }

  // --- brand (required, non-empty string) ---
  if (!brief.brand) {
    errors.push('Missing required field: brand');
  } else if (typeof brief.brand !== 'string') {
    errors.push('brand must be a non-empty string');
  } else if (brief.brand.trim() === '') {
    errors.push('brand must be a non-empty string');
  }

  // --- date (required, YYYY-MM-DD format) ---
  if (!brief.date) {
    errors.push('Missing required field: date');
  } else if (typeof brief.date !== 'string') {
    errors.push('date must be a string');
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(brief.date)) {
    errors.push('date must match YYYY-MM-DD format');
  }

  // --- sources (required, object with visual_references and brand_profile) ---
  if (!brief.sources) {
    errors.push('Missing required field: sources');
  } else if (typeof brief.sources !== 'object' || Array.isArray(brief.sources)) {
    errors.push('sources must be an object');
  } else {
    if (!brief.sources.visual_references || typeof brief.sources.visual_references !== 'string') {
      errors.push('sources.visual_references must be a non-empty string');
    }
    if (!brief.sources.brand_profile || typeof brief.sources.brand_profile !== 'string') {
      errors.push('sources.brand_profile must be a non-empty string');
    }
  }

  // --- family_suggestion (required, object) ---
  if (!brief.family_suggestion) {
    errors.push('Missing required field: family_suggestion');
  } else if (typeof brief.family_suggestion !== 'object' || Array.isArray(brief.family_suggestion)) {
    errors.push('family_suggestion must be an object');
  } else {
    const fs = brief.family_suggestion;

    // primary (required, one of 6 families)
    if (!fs.primary) {
      errors.push('family_suggestion.primary is required');
    } else if (typeof fs.primary !== 'string') {
      errors.push('family_suggestion.primary must be a string');
    } else if (!VALID_FAMILIES.includes(fs.primary)) {
      errors.push(`Invalid family_suggestion.primary: "${fs.primary}". Valid: ${VALID_FAMILIES.join(', ')}`);
    }

    // confidence (required, number 0-1)
    if (fs.confidence === undefined || fs.confidence === null) {
      errors.push('family_suggestion.confidence is required');
    } else if (typeof fs.confidence !== 'number' || !Number.isFinite(fs.confidence)) {
      errors.push('family_suggestion.confidence must be a number');
    } else if (fs.confidence < 0 || fs.confidence > 1) {
      errors.push('family_suggestion.confidence must be between 0 and 1');
    }

    // fallback (required, one of 6 families, different from primary)
    if (!fs.fallback) {
      errors.push('family_suggestion.fallback is required');
    } else if (typeof fs.fallback !== 'string') {
      errors.push('family_suggestion.fallback must be a string');
    } else if (!VALID_FAMILIES.includes(fs.fallback)) {
      errors.push(`Invalid family_suggestion.fallback: "${fs.fallback}". Valid: ${VALID_FAMILIES.join(', ')}`);
    } else if (fs.primary && fs.fallback === fs.primary) {
      errors.push('family_suggestion.fallback must be different from primary');
    }

    // reasoning (required, non-empty string)
    if (!fs.reasoning) {
      errors.push('family_suggestion.reasoning is required');
    } else if (typeof fs.reasoning !== 'string') {
      errors.push('family_suggestion.reasoning must be a non-empty string');
    } else if (fs.reasoning.trim() === '') {
      errors.push('family_suggestion.reasoning must be a non-empty string');
    }
  }

  // --- recommendations (required, object with 7 sections) ---
  if (!brief.recommendations) {
    errors.push('Missing required field: recommendations');
  } else if (typeof brief.recommendations !== 'object' || Array.isArray(brief.recommendations)) {
    errors.push('recommendations must be an object');
  } else {
    const rec = brief.recommendations;

    // Check all 7 sections exist
    for (const section of RECOMMENDATION_SECTIONS) {
      if (!rec[section]) {
        errors.push(`Missing recommendation section: ${section}`);
      }
    }

    // --- navigation ---
    if (rec.navigation && typeof rec.navigation === 'object') {
      if (!rec.navigation.style) {
        errors.push('recommendations.navigation.style is required');
      } else if (!VALID_NAV_STYLES.includes(rec.navigation.style)) {
        errors.push(`Invalid navigation style: "${rec.navigation.style}". Valid: ${VALID_NAV_STYLES.join(', ')}`);
      }
      if (!rec.navigation.justification || typeof rec.navigation.justification !== 'string') {
        errors.push('recommendations.navigation.justification must be a non-empty string');
      }
    }

    // --- whitespace ---
    if (rec.whitespace && typeof rec.whitespace === 'object') {
      if (!rec.whitespace.density || typeof rec.whitespace.density !== 'string') {
        errors.push('recommendations.whitespace.density must be a non-empty string');
      }
      if (rec.whitespace.multiplier === undefined || rec.whitespace.multiplier === null) {
        errors.push('recommendations.whitespace.multiplier is required');
      } else if (typeof rec.whitespace.multiplier !== 'number' || !Number.isFinite(rec.whitespace.multiplier)) {
        errors.push('recommendations.whitespace.multiplier must be a number');
      } else if (rec.whitespace.multiplier <= 0) {
        errors.push('recommendations.whitespace.multiplier must be greater than 0');
      }
      if (!rec.whitespace.section_gap || typeof rec.whitespace.section_gap !== 'string') {
        errors.push('recommendations.whitespace.section_gap is required');
      } else if (!rec.whitespace.section_gap.endsWith('px')) {
        errors.push('recommendations.whitespace.section_gap must end with px');
      }
      if (!rec.whitespace.content_padding || typeof rec.whitespace.content_padding !== 'string') {
        errors.push('recommendations.whitespace.content_padding is required');
      } else if (!rec.whitespace.content_padding.endsWith('px')) {
        errors.push('recommendations.whitespace.content_padding must end with px');
      }
    }

    // --- corners ---
    if (rec.corners && typeof rec.corners === 'object') {
      if (!rec.corners.radius_base || typeof rec.corners.radius_base !== 'string') {
        errors.push('recommendations.corners.radius_base is required');
      } else if (!rec.corners.radius_base.endsWith('px')) {
        errors.push('recommendations.corners.radius_base must end with px');
      }
      if (!rec.corners.treatment) {
        errors.push('recommendations.corners.treatment is required');
      } else if (!VALID_CORNER_TREATMENTS.includes(rec.corners.treatment)) {
        errors.push(`Invalid corner treatment: "${rec.corners.treatment}". Valid: ${VALID_CORNER_TREATMENTS.join(', ')}`);
      }
    }

    // --- dividers ---
    if (rec.dividers && typeof rec.dividers === 'object') {
      if (!rec.dividers.style) {
        errors.push('recommendations.dividers.style is required');
      } else if (!VALID_DIVIDER_STYLES.includes(rec.dividers.style)) {
        errors.push(`Invalid divider style: "${rec.dividers.style}". Valid: ${VALID_DIVIDER_STYLES.join(', ')}`);
      }
    }

    // --- grid ---
    if (rec.grid && typeof rec.grid === 'object') {
      if (!rec.grid.rhythm) {
        errors.push('recommendations.grid.rhythm is required');
      } else if (!VALID_GRID_RHYTHMS.includes(rec.grid.rhythm)) {
        errors.push(`Invalid grid rhythm: "${rec.grid.rhythm}". Valid: ${VALID_GRID_RHYTHMS.join(', ')}`);
      }
      if (!rec.grid.max_width || typeof rec.grid.max_width !== 'string') {
        errors.push('recommendations.grid.max_width is required');
      } else if (!rec.grid.max_width.endsWith('px')) {
        errors.push('recommendations.grid.max_width must end with px');
      }
      if (rec.grid.columns === undefined || rec.grid.columns === null) {
        errors.push('recommendations.grid.columns is required');
      } else if (typeof rec.grid.columns !== 'number' || !Number.isInteger(rec.grid.columns)) {
        errors.push('recommendations.grid.columns must be an integer');
      } else if (rec.grid.columns < 1 || rec.grid.columns > 12) {
        errors.push('recommendations.grid.columns must be between 1 and 12');
      }
    }

    // --- animation ---
    if (rec.animation && typeof rec.animation === 'object') {
      if (!rec.animation.entrance) {
        errors.push('recommendations.animation.entrance is required');
      } else if (!VALID_ENTRANCES.includes(rec.animation.entrance)) {
        errors.push(`Invalid animation entrance: "${rec.animation.entrance}". Valid: ${VALID_ENTRANCES.join(', ')}`);
      }
      if (!rec.animation.duration || typeof rec.animation.duration !== 'string') {
        errors.push('recommendations.animation.duration is required');
      } else if (!rec.animation.duration.endsWith('ms')) {
        errors.push('recommendations.animation.duration must end with ms');
      }
    }

    // --- sections ---
    if (rec.sections && typeof rec.sections === 'object') {
      if (!rec.sections.background) {
        errors.push('recommendations.sections.background is required');
      } else if (!VALID_BACKGROUNDS.includes(rec.sections.background)) {
        errors.push(`Invalid section background: "${rec.sections.background}". Valid: ${VALID_BACKGROUNDS.join(', ')}`);
      }
      if (!rec.sections.hero_height || typeof rec.sections.hero_height !== 'string') {
        errors.push('recommendations.sections.hero_height is required');
      } else if (!rec.sections.hero_height.endsWith('vh') && !rec.sections.hero_height.endsWith('px')) {
        errors.push('recommendations.sections.hero_height must end with vh or px');
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

module.exports = {
  validateBriefOutput,
  VALID_FAMILIES,
  VALID_NAV_STYLES,
  VALID_DIVIDER_STYLES,
  VALID_GRID_RHYTHMS,
  VALID_ENTRANCES,
  VALID_BACKGROUNDS,
  VALID_CORNER_TREATMENTS,
  RECOMMENDATION_SECTIONS,
};
