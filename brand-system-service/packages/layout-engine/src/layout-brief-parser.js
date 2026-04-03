'use strict';

/**
 * Layout Brief Parser
 *
 * Parses layout-brief.md (YAML frontmatter) into a structured object
 * matching the brief schema. Validates using brief-output-validator.
 *
 * Zero external dependencies (uses simple YAML-like parser for brief format).
 *
 * @module layout-brief-parser
 */

const { validateBriefOutput } = require('./validators/brief-output-validator');

/**
 * Simple YAML parser for layout brief format.
 * Handles the subset of YAML used in layout-brief.md:
 * - Top-level keys with string/number values
 * - Nested objects (one or two levels deep)
 * - No arrays, no multi-line strings, no anchors
 *
 * @param {string} yamlString - YAML content to parse
 * @returns {object|null} Parsed object or null on failure
 */
function parseSimpleYaml(yamlString) {
  if (!yamlString || typeof yamlString !== 'string') {
    return null;
  }

  try {
    const result = {};
    const lines = yamlString.split('\n');
    const stack = [{ obj: result, indent: -1 }];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Skip empty lines, comments, and YAML document markers
      if (!line.trim() || line.trim().startsWith('#') || line.trim() === '---') {
        continue;
      }

      const indent = line.search(/\S/);
      const content = line.trim();

      // Split into key: value
      const colonIdx = content.indexOf(':');
      if (colonIdx === -1) continue;

      const key = content.slice(0, colonIdx).trim();
      const rawValue = content.slice(colonIdx + 1).trim();

      // Pop stack to the correct nesting level
      while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
        stack.pop();
      }

      const parent = stack[stack.length - 1].obj;

      if (rawValue === '' || rawValue === '|' || rawValue === '>') {
        // Nested object (or block scalar -- treated as empty string for now)
        if (rawValue === '' || rawValue === '|' || rawValue === '>') {
          // Check if next non-empty line has greater indent
          let nextIdx = i + 1;
          while (nextIdx < lines.length && !lines[nextIdx].trim()) nextIdx++;
          if (nextIdx < lines.length) {
            const nextIndent = lines[nextIdx].search(/\S/);
            if (nextIndent > indent) {
              parent[key] = {};
              stack.push({ obj: parent[key], indent });
              continue;
            }
          }
          parent[key] = '';
        }
      } else {
        // Parse value
        parent[key] = parseYamlValue(rawValue);
      }
    }

    return result;
  } catch (_err) {
    return null;
  }
}

/**
 * Parse a YAML scalar value.
 *
 * @param {string} raw - Raw value string
 * @returns {string|number|boolean|null}
 */
function parseYamlValue(raw) {
  // Remove surrounding quotes
  if ((raw.startsWith('"') && raw.endsWith('"')) ||
      (raw.startsWith("'") && raw.endsWith("'"))) {
    return raw.slice(1, -1);
  }

  // Boolean
  if (raw === 'true') return true;
  if (raw === 'false') return false;

  // Null
  if (raw === 'null' || raw === '~') return null;

  // Number
  const num = Number(raw);
  if (!isNaN(num) && raw !== '') return num;

  return raw;
}

/**
 * Parse a layout brief YAML string into a structured object.
 *
 * Extracts: family_suggestion, recommendations (navigation, whitespace,
 * corners, dividers, grid, animation, sections).
 *
 * Validates the parsed result using brief-output-validator from PDL-2.
 * Returns null for invalid/missing briefs (graceful fallback).
 *
 * @param {string} briefYamlString - Raw YAML string from layout-brief.md
 * @returns {object|null} Structured brief object, or null if invalid/missing
 */
function parseBrief(briefYamlString) {
  if (!briefYamlString || typeof briefYamlString !== 'string') {
    return null;
  }

  // Strip markdown frontmatter delimiters if present
  let yamlContent = briefYamlString.trim();
  if (yamlContent.startsWith('---')) {
    const endIdx = yamlContent.indexOf('---', 3);
    if (endIdx !== -1) {
      yamlContent = yamlContent.slice(3, endIdx).trim();
    } else {
      yamlContent = yamlContent.slice(3).trim();
    }
  }

  const parsed = parseSimpleYaml(yamlContent);
  if (!parsed) {
    return null;
  }

  // Validate using brief-output-validator
  const validation = validateBriefOutput(parsed);
  if (!validation.valid) {
    return null;
  }

  return parsed;
}

/**
 * Extract only the layout recommendations from a parsed brief.
 *
 * @param {object|null} brief - Parsed brief object (from parseBrief)
 * @returns {object|null} recommendations object, or null if brief is invalid
 */
function extractRecommendations(brief) {
  if (!brief || !brief.recommendations) {
    return null;
  }
  return brief.recommendations;
}

/**
 * Extract the family suggestion from a parsed brief.
 *
 * @param {object|null} brief - Parsed brief object (from parseBrief)
 * @returns {object|null} family_suggestion object, or null if brief is invalid
 */
function extractFamilySuggestion(brief) {
  if (!brief || !brief.family_suggestion) {
    return null;
  }
  return brief.family_suggestion;
}

module.exports = {
  parseBrief,
  extractRecommendations,
  extractFamilySuggestion,
  parseSimpleYaml,
};
