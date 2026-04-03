'use strict';

/**
 * Default Layout Configuration
 *
 * Provides backward-compatible defaults matching the current BSS output
 * (bold-structured family). When no layout brief is available, these
 * values are used to maintain identical output to the pre-PDL-4 system.
 *
 * @module defaults
 */

/**
 * Default layout configuration matching current BSS output exactly.
 * Uses bold-structured family values: sidebar-fixed nav, 8px corners,
 * compact spacing, strict-grid, no animation.
 *
 * @type {Readonly<object>}
 */
const DEFAULT_LAYOUT = Object.freeze({
  family: 'bold-structured',
  navigation: {
    style: 'sidebar-fixed',
    justification: 'Default sidebar navigation for structured layouts',
  },
  whitespace: {
    density: 'compact',
    multiplier: 0.8,
    section_gap: '48px',
    content_padding: '40px',
  },
  corners: {
    radius_base: '8px',
    treatment: 'subtle',
  },
  dividers: {
    style: 'solid-thin',
  },
  grid: {
    rhythm: 'strict-grid',
    max_width: '1400px',
    columns: 12,
  },
  animation: {
    entrance: 'none',
    duration: '0ms',
  },
  sections: {
    background: 'flat-solid',
    hero_height: '40vh',
  },
});

/**
 * Deep merge two objects, with source values taking precedence.
 * Only merges plain objects; arrays and primitives are overwritten.
 *
 * @param {object} target - Base object (defaults)
 * @param {object} source - Override object (brief recommendations)
 * @returns {object} Merged object
 */
function deepMerge(target, source) {
  const result = {};

  // Copy all target keys
  for (const key of Object.keys(target)) {
    result[key] = target[key];
  }

  // Merge source keys
  for (const key of Object.keys(source)) {
    if (
      source[key] !== null &&
      source[key] !== undefined &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key]) &&
      typeof target[key] === 'object' &&
      !Array.isArray(target[key]) &&
      target[key] !== null
    ) {
      result[key] = deepMerge(target[key], source[key]);
    } else {
      result[key] = source[key];
    }
  }

  return result;
}

/**
 * Merge brief recommendations over DEFAULT_LAYOUT.
 * Any missing field falls back to the default value.
 *
 * @param {object|null} briefRecommendations - Layout recommendations from brief
 * @returns {object} Complete layout configuration with all fields populated
 */
function mergeWithDefaults(briefRecommendations) {
  if (!briefRecommendations || typeof briefRecommendations !== 'object') {
    return { ...DEFAULT_LAYOUT };
  }

  // Map brief recommendation fields to default layout fields
  // Brief uses different field names for some sections
  const mapped = {};

  if (briefRecommendations.family) {
    mapped.family = briefRecommendations.family;
  }

  if (briefRecommendations.navigation) {
    mapped.navigation = briefRecommendations.navigation;
  }

  if (briefRecommendations.whitespace) {
    mapped.whitespace = briefRecommendations.whitespace;
  }

  if (briefRecommendations.corners) {
    mapped.corners = briefRecommendations.corners;
  }

  if (briefRecommendations.dividers) {
    mapped.dividers = briefRecommendations.dividers;
  }

  if (briefRecommendations.grid) {
    mapped.grid = briefRecommendations.grid;
  }

  if (briefRecommendations.animation) {
    mapped.animation = briefRecommendations.animation;
  }

  if (briefRecommendations.sections) {
    mapped.sections = briefRecommendations.sections;
  }

  return deepMerge(DEFAULT_LAYOUT, mapped);
}

module.exports = {
  DEFAULT_LAYOUT,
  mergeWithDefaults,
  deepMerge,
};
