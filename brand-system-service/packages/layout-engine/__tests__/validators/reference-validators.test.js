'use strict';

const { validateReferenceInput, VALID_ARCHETYPES, PERSONALITY_TRAIT_FIELDS } = require('../../src/validators/reference-input-validator');
const { validateReferenceOutput, VALID_FAMILIES, LAYOUT_PATTERN_FIELDS } = require('../../src/validators/reference-output-validator');

// --- Helpers ---

function makeValidInput() {
  return {
    archetypes: ['Explorer', 'Creator'],
    personality_traits: {
      formal_casual: 3,
      traditional_modern: 4,
      serious_playful: 2,
      conservative_bold: 4,
      minimal_expressive: 3,
    },
    industry: 'technology',
  };
}

function makeValidLayoutPatterns() {
  return {
    nav_style: 'sticky-minimal',
    whitespace_density: 'generous',
    corner_treatment: 'subtle (4-8px)',
    divider_style: 'thin-geometric',
    grid_rhythm: 'editorial-wide',
    animation_approach: 'scroll-reveal',
    section_backgrounds: 'full-bleed-image',
  };
}

function makeValidReference(overrides = {}) {
  return {
    url: 'https://example.com',
    description: 'A beautiful editorial layout with generous whitespace',
    relevance_score: 4,
    layout_patterns: makeValidLayoutPatterns(),
    ...overrides,
  };
}

function makeValidOutput(referenceCount = 5) {
  const references = [];
  for (let i = 0; i < referenceCount; i++) {
    references.push(makeValidReference({ url: `https://example${i}.com` }));
  }
  return {
    brand: 'TestBrand',
    archetypes: ['Explorer', 'Creator'],
    resolved_family: 'adventurous-open',
    references,
  };
}

// ============================================================
// Input Validator Tests
// ============================================================

describe('validateReferenceInput', () => {
  describe('valid input', () => {
    it('should pass with all required fields', () => {
      const result = validateReferenceInput(makeValidInput());
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should pass with optional visual_preferences', () => {
      const input = { ...makeValidInput(), visual_preferences: { colors: 'earth tones' } };
      const result = validateReferenceInput(input);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should pass with optional mood_keywords', () => {
      const input = { ...makeValidInput(), mood_keywords: ['ethereal', 'bold'] };
      const result = validateReferenceInput(input);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should pass with a single archetype', () => {
      const input = { ...makeValidInput(), archetypes: ['Sage'] };
      const result = validateReferenceInput(input);
      expect(result.valid).toBe(true);
    });

    it('should pass with exactly 3 archetypes', () => {
      const input = { ...makeValidInput(), archetypes: ['Sage', 'Explorer', 'Creator'] };
      const result = validateReferenceInput(input);
      expect(result.valid).toBe(true);
    });

    it('should accept all 14 valid archetypes individually', () => {
      for (const archetype of VALID_ARCHETYPES) {
        const input = { ...makeValidInput(), archetypes: [archetype] };
        const result = validateReferenceInput(input);
        expect(result.valid).toBe(true);
      }
    });

    it('should accept trait values at boundaries (1 and 5)', () => {
      const input = makeValidInput();
      input.personality_traits.formal_casual = 1;
      input.personality_traits.minimal_expressive = 5;
      const result = validateReferenceInput(input);
      expect(result.valid).toBe(true);
    });
  });

  describe('missing archetypes', () => {
    it('should fail when archetypes is missing', () => {
      const input = makeValidInput();
      delete input.archetypes;
      const result = validateReferenceInput(input);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing required field: archetypes');
    });

    it('should fail when archetypes is empty', () => {
      const input = { ...makeValidInput(), archetypes: [] };
      const result = validateReferenceInput(input);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toMatch(/at least 1/);
    });
  });

  describe('invalid archetype names', () => {
    it('should fail with an unknown archetype', () => {
      const input = { ...makeValidInput(), archetypes: ['Wizard'] };
      const result = validateReferenceInput(input);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toMatch(/Invalid archetype: "Wizard"/);
    });

    it('should fail with case-sensitive mismatch', () => {
      const input = { ...makeValidInput(), archetypes: ['explorer'] };
      const result = validateReferenceInput(input);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toMatch(/Invalid archetype: "explorer"/);
    });
  });

  describe('too many archetypes', () => {
    it('should fail when more than 3 archetypes are provided', () => {
      const input = { ...makeValidInput(), archetypes: ['Explorer', 'Creator', 'Sage', 'Hero'] };
      const result = validateReferenceInput(input);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toMatch(/at most 3/);
    });
  });

  describe('personality traits out of range', () => {
    it('should fail when a trait is below 1', () => {
      const input = makeValidInput();
      input.personality_traits.formal_casual = 0;
      const result = validateReferenceInput(input);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toMatch(/formal_casual must be between 1 and 5/);
    });

    it('should fail when a trait is above 5', () => {
      const input = makeValidInput();
      input.personality_traits.conservative_bold = 6;
      const result = validateReferenceInput(input);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toMatch(/conservative_bold must be between 1 and 5/);
    });

    it('should fail when a trait is not a number', () => {
      const input = makeValidInput();
      input.personality_traits.serious_playful = 'high';
      const result = validateReferenceInput(input);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toMatch(/serious_playful must be a number/);
    });
  });

  describe('missing required fields', () => {
    it('should fail when personality_traits is missing', () => {
      const input = makeValidInput();
      delete input.personality_traits;
      const result = validateReferenceInput(input);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing required field: personality_traits');
    });

    it('should fail when industry is missing', () => {
      const input = makeValidInput();
      delete input.industry;
      const result = validateReferenceInput(input);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing required field: industry');
    });

    it('should fail when industry is empty string', () => {
      const input = { ...makeValidInput(), industry: '   ' };
      const result = validateReferenceInput(input);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toMatch(/non-empty string/);
    });

    it('should fail when input is null', () => {
      const result = validateReferenceInput(null);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Input must be a non-null object');
    });

    it('should fail when input is undefined', () => {
      const result = validateReferenceInput(undefined);
      expect(result.valid).toBe(false);
    });

    it('should fail when a personality trait field is missing', () => {
      const input = makeValidInput();
      delete input.personality_traits.minimal_expressive;
      const result = validateReferenceInput(input);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toMatch(/Missing personality trait field: minimal_expressive/);
    });
  });

  describe('multiple errors', () => {
    it('should collect all errors when multiple fields are invalid', () => {
      const result = validateReferenceInput({});
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(3);
    });
  });
});

// ============================================================
// Output Validator Tests
// ============================================================

describe('validateReferenceOutput', () => {
  describe('valid output', () => {
    it('should pass with 5 valid references', () => {
      const result = validateReferenceOutput(makeValidOutput(5));
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should pass with 10 valid references', () => {
      const result = validateReferenceOutput(makeValidOutput(10));
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should pass with 7 references (mid-range)', () => {
      const result = validateReferenceOutput(makeValidOutput(7));
      expect(result.valid).toBe(true);
    });

    it('should accept all valid families', () => {
      for (const family of VALID_FAMILIES) {
        const output = makeValidOutput(5);
        output.resolved_family = family;
        const result = validateReferenceOutput(output);
        expect(result.valid).toBe(true);
      }
    });
  });

  describe('too few references', () => {
    it('should fail with fewer than 5 references', () => {
      const result = validateReferenceOutput(makeValidOutput(4));
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toMatch(/at least 5/);
    });

    it('should fail with 0 references', () => {
      const output = makeValidOutput(5);
      output.references = [];
      const result = validateReferenceOutput(output);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toMatch(/at least 5/);
    });
  });

  describe('too many references', () => {
    it('should fail with more than 10 references', () => {
      const result = validateReferenceOutput(makeValidOutput(11));
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toMatch(/at most 10/);
    });
  });

  describe('invalid family', () => {
    it('should fail with unknown family', () => {
      const output = makeValidOutput(5);
      output.resolved_family = 'dark-gothic';
      const result = validateReferenceOutput(output);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toMatch(/Invalid resolved_family: "dark-gothic"/);
    });

    it('should fail with case-sensitive mismatch', () => {
      const output = makeValidOutput(5);
      output.resolved_family = 'Ethereal';
      const result = validateReferenceOutput(output);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toMatch(/Invalid resolved_family/);
    });
  });

  describe('missing layout pattern fields', () => {
    it('should fail when layout_patterns is missing', () => {
      const output = makeValidOutput(5);
      delete output.references[0].layout_patterns;
      const result = validateReferenceOutput(output);
      expect(result.valid).toBe(false);
      expect(result.errors).toEqual(
        expect.arrayContaining([
          expect.stringContaining('layout_patterns is required'),
        ])
      );
    });

    it('should fail when a layout pattern field is missing', () => {
      const output = makeValidOutput(5);
      delete output.references[0].layout_patterns.nav_style;
      const result = validateReferenceOutput(output);
      expect(result.valid).toBe(false);
      expect(result.errors).toEqual(
        expect.arrayContaining([
          expect.stringContaining('nav_style is required'),
        ])
      );
    });

    it('should fail when a layout pattern field is not a string', () => {
      const output = makeValidOutput(5);
      output.references[0].layout_patterns.grid_rhythm = 42;
      const result = validateReferenceOutput(output);
      expect(result.valid).toBe(false);
      expect(result.errors).toEqual(
        expect.arrayContaining([
          expect.stringContaining('grid_rhythm must be a string'),
        ])
      );
    });
  });

  describe('invalid URL', () => {
    it('should fail when URL does not start with http', () => {
      const output = makeValidOutput(5);
      output.references[0].url = 'ftp://example.com';
      const result = validateReferenceOutput(output);
      expect(result.valid).toBe(false);
      expect(result.errors).toEqual(
        expect.arrayContaining([
          expect.stringContaining('must start with http'),
        ])
      );
    });

    it('should fail when URL is missing', () => {
      const output = makeValidOutput(5);
      delete output.references[0].url;
      const result = validateReferenceOutput(output);
      expect(result.valid).toBe(false);
      expect(result.errors).toEqual(
        expect.arrayContaining([
          expect.stringContaining('url is required'),
        ])
      );
    });
  });

  describe('invalid relevance score', () => {
    it('should fail when relevance_score is below 1', () => {
      const output = makeValidOutput(5);
      output.references[0].relevance_score = 0;
      const result = validateReferenceOutput(output);
      expect(result.valid).toBe(false);
      expect(result.errors).toEqual(
        expect.arrayContaining([
          expect.stringContaining('relevance_score must be between 1 and 5'),
        ])
      );
    });

    it('should fail when relevance_score is above 5', () => {
      const output = makeValidOutput(5);
      output.references[0].relevance_score = 6;
      const result = validateReferenceOutput(output);
      expect(result.valid).toBe(false);
      expect(result.errors).toEqual(
        expect.arrayContaining([
          expect.stringContaining('relevance_score must be between 1 and 5'),
        ])
      );
    });

    it('should fail when relevance_score is not a number', () => {
      const output = makeValidOutput(5);
      output.references[0].relevance_score = 'high';
      const result = validateReferenceOutput(output);
      expect(result.valid).toBe(false);
      expect(result.errors).toEqual(
        expect.arrayContaining([
          expect.stringContaining('relevance_score must be a number'),
        ])
      );
    });

    it('should fail when relevance_score is missing', () => {
      const output = makeValidOutput(5);
      delete output.references[0].relevance_score;
      const result = validateReferenceOutput(output);
      expect(result.valid).toBe(false);
      expect(result.errors).toEqual(
        expect.arrayContaining([
          expect.stringContaining('relevance_score is required'),
        ])
      );
    });
  });

  describe('missing required output fields', () => {
    it('should fail when brand is missing', () => {
      const output = makeValidOutput(5);
      delete output.brand;
      const result = validateReferenceOutput(output);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing required field: brand');
    });

    it('should fail when archetypes is missing', () => {
      const output = makeValidOutput(5);
      delete output.archetypes;
      const result = validateReferenceOutput(output);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing required field: archetypes');
    });

    it('should fail when resolved_family is missing', () => {
      const output = makeValidOutput(5);
      delete output.resolved_family;
      const result = validateReferenceOutput(output);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing required field: resolved_family');
    });

    it('should fail when references is missing', () => {
      const output = makeValidOutput(5);
      delete output.references;
      const result = validateReferenceOutput(output);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing required field: references');
    });

    it('should fail when output is null', () => {
      const result = validateReferenceOutput(null);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Output must be a non-null object');
    });
  });

  describe('reference description', () => {
    it('should fail when description is missing', () => {
      const output = makeValidOutput(5);
      delete output.references[0].description;
      const result = validateReferenceOutput(output);
      expect(result.valid).toBe(false);
      expect(result.errors).toEqual(
        expect.arrayContaining([
          expect.stringContaining('description is required'),
        ])
      );
    });
  });
});

// ============================================================
// Exported Constants Tests
// ============================================================

describe('exported constants', () => {
  it('should export 14 valid archetypes', () => {
    expect(VALID_ARCHETYPES).toHaveLength(14);
  });

  it('should export 5 personality trait fields', () => {
    expect(PERSONALITY_TRAIT_FIELDS).toHaveLength(5);
  });

  it('should export 6 valid families', () => {
    expect(VALID_FAMILIES).toHaveLength(6);
  });

  it('should export 7 layout pattern fields', () => {
    expect(LAYOUT_PATTERN_FIELDS).toHaveLength(7);
  });
});
