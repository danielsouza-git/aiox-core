'use strict';

const {
  validateBriefOutput,
  VALID_FAMILIES,
  VALID_NAV_STYLES,
  VALID_DIVIDER_STYLES,
  VALID_GRID_RHYTHMS,
  VALID_ENTRANCES,
  VALID_BACKGROUNDS,
  VALID_CORNER_TREATMENTS,
  RECOMMENDATION_SECTIONS,
} = require('../../src/validators/brief-output-validator');

// --- Helpers ---

function makeValidRecommendations() {
  return {
    navigation: {
      style: 'sticky-minimal',
      justification: 'References 1, 3, 7 use sticky nav; matches Explorer archetype',
    },
    whitespace: {
      density: 'generous',
      multiplier: 1.3,
      section_gap: '72px',
      content_padding: '64px',
    },
    corners: {
      radius_base: '6px',
      treatment: 'subtle',
    },
    dividers: {
      style: 'thin-geometric',
    },
    grid: {
      rhythm: 'editorial-wide',
      max_width: '1100px',
      columns: 2,
    },
    animation: {
      entrance: 'scroll-reveal',
      duration: '400ms',
    },
    sections: {
      background: 'full-bleed-image',
      hero_height: '70vh',
    },
  };
}

function makeValidBrief(overrides = {}) {
  return {
    brand: 'TestBrand',
    date: '2026-04-02',
    sources: {
      visual_references: 'path/to/visual-references.md',
      brand_profile: 'path/to/brand-profile.yaml',
    },
    family_suggestion: {
      primary: 'adventurous-open',
      confidence: 0.85,
      fallback: 'warm-artisan',
      reasoning: 'Explorer primary archetype + bold=4 + modern=4',
    },
    recommendations: makeValidRecommendations(),
    ...overrides,
  };
}

// ============================================================
// Valid Brief Tests
// ============================================================

describe('validateBriefOutput', () => {
  describe('valid brief', () => {
    it('should pass with a complete valid brief', () => {
      const result = validateBriefOutput(makeValidBrief());
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should pass with minimal valid values', () => {
      const brief = makeValidBrief({
        brand: 'A',
        date: '2000-01-01',
        family_suggestion: {
          primary: 'ethereal',
          confidence: 0,
          fallback: 'rebel-edge',
          reasoning: 'minimal',
        },
        recommendations: {
          navigation: { style: 'centered-top', justification: 'test' },
          whitespace: { density: 'compact', multiplier: 0.1, section_gap: '1px', content_padding: '1px' },
          corners: { radius_base: '0px', treatment: 'sharp' },
          dividers: { style: 'none' },
          grid: { rhythm: 'centered-single', max_width: '320px', columns: 1 },
          animation: { entrance: 'none', duration: '0ms' },
          sections: { background: 'flat-solid', hero_height: '100px' },
        },
      });
      const result = validateBriefOutput(brief);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should accept confidence at boundary 0', () => {
      const brief = makeValidBrief();
      brief.family_suggestion.confidence = 0;
      const result = validateBriefOutput(brief);
      expect(result.valid).toBe(true);
    });

    it('should accept confidence at boundary 1', () => {
      const brief = makeValidBrief();
      brief.family_suggestion.confidence = 1;
      const result = validateBriefOutput(brief);
      expect(result.valid).toBe(true);
    });

    it('should accept hero_height with px unit', () => {
      const brief = makeValidBrief();
      brief.recommendations.sections.hero_height = '600px';
      const result = validateBriefOutput(brief);
      expect(result.valid).toBe(true);
    });

    it('should accept all valid families as primary', () => {
      for (const family of VALID_FAMILIES) {
        const brief = makeValidBrief();
        brief.family_suggestion.primary = family;
        // Ensure fallback is different
        brief.family_suggestion.fallback = VALID_FAMILIES.find(f => f !== family);
        const result = validateBriefOutput(brief);
        expect(result.valid).toBe(true);
      }
    });
  });

  // ============================================================
  // Missing brand
  // ============================================================

  describe('missing brand', () => {
    it('should fail when brand is missing', () => {
      const brief = makeValidBrief();
      delete brief.brand;
      const result = validateBriefOutput(brief);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing required field: brand');
    });

    it('should fail when brand is empty string', () => {
      const brief = makeValidBrief({ brand: '   ' });
      const result = validateBriefOutput(brief);
      expect(result.valid).toBe(false);
      expect(result.errors).toEqual(
        expect.arrayContaining([expect.stringContaining('non-empty string')])
      );
    });

    it('should fail when brand is a number', () => {
      const brief = makeValidBrief({ brand: 42 });
      const result = validateBriefOutput(brief);
      expect(result.valid).toBe(false);
      expect(result.errors).toEqual(
        expect.arrayContaining([expect.stringContaining('non-empty string')])
      );
    });
  });

  // ============================================================
  // Invalid date
  // ============================================================

  describe('invalid date format', () => {
    it('should fail when date is missing', () => {
      const brief = makeValidBrief();
      delete brief.date;
      const result = validateBriefOutput(brief);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing required field: date');
    });

    it('should fail with DD/MM/YYYY format', () => {
      const brief = makeValidBrief({ date: '02/04/2026' });
      const result = validateBriefOutput(brief);
      expect(result.valid).toBe(false);
      expect(result.errors).toEqual(
        expect.arrayContaining([expect.stringContaining('YYYY-MM-DD')])
      );
    });

    it('should fail with partial date', () => {
      const brief = makeValidBrief({ date: '2026-04' });
      const result = validateBriefOutput(brief);
      expect(result.valid).toBe(false);
      expect(result.errors).toEqual(
        expect.arrayContaining([expect.stringContaining('YYYY-MM-DD')])
      );
    });
  });

  // ============================================================
  // Missing sources
  // ============================================================

  describe('missing sources', () => {
    it('should fail when sources is missing', () => {
      const brief = makeValidBrief();
      delete brief.sources;
      const result = validateBriefOutput(brief);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing required field: sources');
    });

    it('should fail when sources.visual_references is missing', () => {
      const brief = makeValidBrief();
      delete brief.sources.visual_references;
      const result = validateBriefOutput(brief);
      expect(result.valid).toBe(false);
      expect(result.errors).toEqual(
        expect.arrayContaining([expect.stringContaining('sources.visual_references')])
      );
    });

    it('should fail when sources.brand_profile is missing', () => {
      const brief = makeValidBrief();
      delete brief.sources.brand_profile;
      const result = validateBriefOutput(brief);
      expect(result.valid).toBe(false);
      expect(result.errors).toEqual(
        expect.arrayContaining([expect.stringContaining('sources.brand_profile')])
      );
    });
  });

  // ============================================================
  // Invalid family_suggestion.primary
  // ============================================================

  describe('invalid family_suggestion.primary', () => {
    it('should fail with unknown family', () => {
      const brief = makeValidBrief();
      brief.family_suggestion.primary = 'dark-gothic';
      const result = validateBriefOutput(brief);
      expect(result.valid).toBe(false);
      expect(result.errors).toEqual(
        expect.arrayContaining([expect.stringContaining('Invalid family_suggestion.primary: "dark-gothic"')])
      );
    });

    it('should fail with case-sensitive mismatch', () => {
      const brief = makeValidBrief();
      brief.family_suggestion.primary = 'Ethereal';
      const result = validateBriefOutput(brief);
      expect(result.valid).toBe(false);
      expect(result.errors).toEqual(
        expect.arrayContaining([expect.stringContaining('Invalid family_suggestion.primary')])
      );
    });
  });

  // ============================================================
  // Confidence out of range
  // ============================================================

  describe('confidence out of range', () => {
    it('should fail when confidence is negative', () => {
      const brief = makeValidBrief();
      brief.family_suggestion.confidence = -0.1;
      const result = validateBriefOutput(brief);
      expect(result.valid).toBe(false);
      expect(result.errors).toEqual(
        expect.arrayContaining([expect.stringContaining('between 0 and 1')])
      );
    });

    it('should fail when confidence is above 1', () => {
      const brief = makeValidBrief();
      brief.family_suggestion.confidence = 1.1;
      const result = validateBriefOutput(brief);
      expect(result.valid).toBe(false);
      expect(result.errors).toEqual(
        expect.arrayContaining([expect.stringContaining('between 0 and 1')])
      );
    });

    it('should fail when confidence is not a number', () => {
      const brief = makeValidBrief();
      brief.family_suggestion.confidence = 'high';
      const result = validateBriefOutput(brief);
      expect(result.valid).toBe(false);
      expect(result.errors).toEqual(
        expect.arrayContaining([expect.stringContaining('confidence must be a number')])
      );
    });
  });

  // ============================================================
  // Primary == fallback
  // ============================================================

  describe('primary equals fallback', () => {
    it('should fail when primary and fallback are the same', () => {
      const brief = makeValidBrief();
      brief.family_suggestion.primary = 'ethereal';
      brief.family_suggestion.fallback = 'ethereal';
      const result = validateBriefOutput(brief);
      expect(result.valid).toBe(false);
      expect(result.errors).toEqual(
        expect.arrayContaining([expect.stringContaining('fallback must be different from primary')])
      );
    });
  });

  // ============================================================
  // Missing recommendation sections
  // ============================================================

  describe('missing recommendation sections', () => {
    it('should fail when recommendations is missing', () => {
      const brief = makeValidBrief();
      delete brief.recommendations;
      const result = validateBriefOutput(brief);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing required field: recommendations');
    });

    for (const section of RECOMMENDATION_SECTIONS) {
      it(`should fail when ${section} section is missing`, () => {
        const brief = makeValidBrief();
        delete brief.recommendations[section];
        const result = validateBriefOutput(brief);
        expect(result.valid).toBe(false);
        expect(result.errors).toEqual(
          expect.arrayContaining([expect.stringContaining(`Missing recommendation section: ${section}`)])
        );
      });
    }
  });

  // ============================================================
  // Invalid nav style
  // ============================================================

  describe('invalid nav style', () => {
    it('should fail with unknown nav style', () => {
      const brief = makeValidBrief();
      brief.recommendations.navigation.style = 'hamburger-menu';
      const result = validateBriefOutput(brief);
      expect(result.valid).toBe(false);
      expect(result.errors).toEqual(
        expect.arrayContaining([expect.stringContaining('Invalid navigation style: "hamburger-menu"')])
      );
    });
  });

  // ============================================================
  // Invalid grid rhythm
  // ============================================================

  describe('invalid grid rhythm', () => {
    it('should fail with unknown grid rhythm', () => {
      const brief = makeValidBrief();
      brief.recommendations.grid.rhythm = 'flex-wrap';
      const result = validateBriefOutput(brief);
      expect(result.valid).toBe(false);
      expect(result.errors).toEqual(
        expect.arrayContaining([expect.stringContaining('Invalid grid rhythm: "flex-wrap"')])
      );
    });
  });

  // ============================================================
  // Invalid divider style
  // ============================================================

  describe('invalid divider style', () => {
    it('should fail with unknown divider style', () => {
      const brief = makeValidBrief();
      brief.recommendations.dividers.style = 'double-line';
      const result = validateBriefOutput(brief);
      expect(result.valid).toBe(false);
      expect(result.errors).toEqual(
        expect.arrayContaining([expect.stringContaining('Invalid divider style: "double-line"')])
      );
    });
  });

  // ============================================================
  // Invalid entrance animation
  // ============================================================

  describe('invalid entrance animation', () => {
    it('should fail with unknown entrance', () => {
      const brief = makeValidBrief();
      brief.recommendations.animation.entrance = 'spin-in';
      const result = validateBriefOutput(brief);
      expect(result.valid).toBe(false);
      expect(result.errors).toEqual(
        expect.arrayContaining([expect.stringContaining('Invalid animation entrance: "spin-in"')])
      );
    });
  });

  // ============================================================
  // Invalid background
  // ============================================================

  describe('invalid background', () => {
    it('should fail with unknown background', () => {
      const brief = makeValidBrief();
      brief.recommendations.sections.background = 'gradient-mesh';
      const result = validateBriefOutput(brief);
      expect(result.valid).toBe(false);
      expect(result.errors).toEqual(
        expect.arrayContaining([expect.stringContaining('Invalid section background: "gradient-mesh"')])
      );
    });
  });

  // ============================================================
  // Columns out of range
  // ============================================================

  describe('columns out of range', () => {
    it('should fail when columns is 0', () => {
      const brief = makeValidBrief();
      brief.recommendations.grid.columns = 0;
      const result = validateBriefOutput(brief);
      expect(result.valid).toBe(false);
      expect(result.errors).toEqual(
        expect.arrayContaining([expect.stringContaining('columns must be between 1 and 12')])
      );
    });

    it('should fail when columns is 13', () => {
      const brief = makeValidBrief();
      brief.recommendations.grid.columns = 13;
      const result = validateBriefOutput(brief);
      expect(result.valid).toBe(false);
      expect(result.errors).toEqual(
        expect.arrayContaining([expect.stringContaining('columns must be between 1 and 12')])
      );
    });

    it('should fail when columns is not an integer', () => {
      const brief = makeValidBrief();
      brief.recommendations.grid.columns = 2.5;
      const result = validateBriefOutput(brief);
      expect(result.valid).toBe(false);
      expect(result.errors).toEqual(
        expect.arrayContaining([expect.stringContaining('columns must be an integer')])
      );
    });
  });

  // ============================================================
  // Multiplier <= 0
  // ============================================================

  describe('multiplier out of range', () => {
    it('should fail when multiplier is 0', () => {
      const brief = makeValidBrief();
      brief.recommendations.whitespace.multiplier = 0;
      const result = validateBriefOutput(brief);
      expect(result.valid).toBe(false);
      expect(result.errors).toEqual(
        expect.arrayContaining([expect.stringContaining('multiplier must be greater than 0')])
      );
    });

    it('should fail when multiplier is negative', () => {
      const brief = makeValidBrief();
      brief.recommendations.whitespace.multiplier = -1;
      const result = validateBriefOutput(brief);
      expect(result.valid).toBe(false);
      expect(result.errors).toEqual(
        expect.arrayContaining([expect.stringContaining('multiplier must be greater than 0')])
      );
    });

    it('should fail when multiplier is not a number', () => {
      const brief = makeValidBrief();
      brief.recommendations.whitespace.multiplier = 'high';
      const result = validateBriefOutput(brief);
      expect(result.valid).toBe(false);
      expect(result.errors).toEqual(
        expect.arrayContaining([expect.stringContaining('multiplier must be a number')])
      );
    });
  });

  // ============================================================
  // Multiple errors accumulated
  // ============================================================

  describe('multiple errors accumulated', () => {
    it('should collect all errors in a single validation', () => {
      const result = validateBriefOutput({});
      expect(result.valid).toBe(false);
      // Should have errors for brand, date, sources, family_suggestion, recommendations
      expect(result.errors.length).toBeGreaterThanOrEqual(5);
    });

    it('should collect errors from multiple recommendation sections', () => {
      const brief = makeValidBrief();
      brief.recommendations.navigation.style = 'invalid';
      brief.recommendations.grid.rhythm = 'invalid';
      brief.recommendations.dividers.style = 'invalid';
      const result = validateBriefOutput(brief);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(3);
    });
  });

  // ============================================================
  // Null / undefined input
  // ============================================================

  describe('null and undefined input', () => {
    it('should fail when brief is null', () => {
      const result = validateBriefOutput(null);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Brief must be a non-null object');
    });

    it('should fail when brief is undefined', () => {
      const result = validateBriefOutput(undefined);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Brief must be a non-null object');
    });
  });

  // ============================================================
  // Invalid corner treatment
  // ============================================================

  describe('invalid corner treatment', () => {
    it('should fail with unknown corner treatment', () => {
      const brief = makeValidBrief();
      brief.recommendations.corners.treatment = 'circular';
      const result = validateBriefOutput(brief);
      expect(result.valid).toBe(false);
      expect(result.errors).toEqual(
        expect.arrayContaining([expect.stringContaining('Invalid corner treatment: "circular"')])
      );
    });
  });

  // ============================================================
  // Unit suffix validations
  // ============================================================

  describe('unit suffix validations', () => {
    it('should fail when section_gap does not end with px', () => {
      const brief = makeValidBrief();
      brief.recommendations.whitespace.section_gap = '72em';
      const result = validateBriefOutput(brief);
      expect(result.valid).toBe(false);
      expect(result.errors).toEqual(
        expect.arrayContaining([expect.stringContaining('section_gap must end with px')])
      );
    });

    it('should fail when content_padding does not end with px', () => {
      const brief = makeValidBrief();
      brief.recommendations.whitespace.content_padding = '64rem';
      const result = validateBriefOutput(brief);
      expect(result.valid).toBe(false);
      expect(result.errors).toEqual(
        expect.arrayContaining([expect.stringContaining('content_padding must end with px')])
      );
    });

    it('should fail when radius_base does not end with px', () => {
      const brief = makeValidBrief();
      brief.recommendations.corners.radius_base = '6em';
      const result = validateBriefOutput(brief);
      expect(result.valid).toBe(false);
      expect(result.errors).toEqual(
        expect.arrayContaining([expect.stringContaining('radius_base must end with px')])
      );
    });

    it('should fail when max_width does not end with px', () => {
      const brief = makeValidBrief();
      brief.recommendations.grid.max_width = '1100em';
      const result = validateBriefOutput(brief);
      expect(result.valid).toBe(false);
      expect(result.errors).toEqual(
        expect.arrayContaining([expect.stringContaining('max_width must end with px')])
      );
    });

    it('should fail when duration does not end with ms', () => {
      const brief = makeValidBrief();
      brief.recommendations.animation.duration = '400s';
      const result = validateBriefOutput(brief);
      expect(result.valid).toBe(false);
      expect(result.errors).toEqual(
        expect.arrayContaining([expect.stringContaining('duration must end with ms')])
      );
    });

    it('should fail when hero_height has invalid unit', () => {
      const brief = makeValidBrief();
      brief.recommendations.sections.hero_height = '70%';
      const result = validateBriefOutput(brief);
      expect(result.valid).toBe(false);
      expect(result.errors).toEqual(
        expect.arrayContaining([expect.stringContaining('hero_height must end with vh or px')])
      );
    });
  });

  // ============================================================
  // Exported constants
  // ============================================================

  describe('exported constants', () => {
    it('should export 6 valid families', () => {
      expect(VALID_FAMILIES).toHaveLength(6);
    });

    it('should export 6 valid nav styles', () => {
      expect(VALID_NAV_STYLES).toHaveLength(6);
    });

    it('should export 8 valid divider styles', () => {
      expect(VALID_DIVIDER_STYLES).toHaveLength(8);
    });

    it('should export 6 valid grid rhythms', () => {
      expect(VALID_GRID_RHYTHMS).toHaveLength(6);
    });

    it('should export 6 valid entrances', () => {
      expect(VALID_ENTRANCES).toHaveLength(6);
    });

    it('should export 6 valid backgrounds', () => {
      expect(VALID_BACKGROUNDS).toHaveLength(6);
    });

    it('should export 4 valid corner treatments', () => {
      expect(VALID_CORNER_TREATMENTS).toHaveLength(4);
    });

    it('should export 7 recommendation sections', () => {
      expect(RECOMMENDATION_SECTIONS).toHaveLength(7);
    });
  });
});
