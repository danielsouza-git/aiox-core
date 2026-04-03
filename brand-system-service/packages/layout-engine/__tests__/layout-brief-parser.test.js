'use strict';

const { parseBrief, extractRecommendations, extractFamilySuggestion, parseSimpleYaml } = require('../src/layout-brief-parser');

describe('layout-brief-parser', () => {
  // Valid brief YAML matching brief-output-validator schema
  const validBriefYaml = `
brand: Stray Innocence
date: 2026-04-02
sources:
  visual_references: visual-references.md
  brand_profile: brand-profile.yaml
family_suggestion:
  primary: ethereal
  confidence: 0.85
  fallback: warm-artisan
  reasoning: Soft rounded corners and airy whitespace match the dreamy brand personality
recommendations:
  navigation:
    style: centered-top
    justification: Centered navigation reinforces the ethereal symmetry
  whitespace:
    density: spacious
    multiplier: 1.5
    section_gap: 96px
    content_padding: 80px
  corners:
    radius_base: 24px
    treatment: rounded
  dividers:
    style: organic-wave
  grid:
    rhythm: centered-single
    max_width: 800px
    columns: 1
  animation:
    entrance: fade-up
    duration: 300ms
  sections:
    background: soft-fill
    hero_height: 60vh
`;

  describe('parseBrief', () => {
    it('should parse valid brief YAML into correct structure', () => {
      const result = parseBrief(validBriefYaml);

      expect(result).not.toBeNull();
      expect(result.brand).toBe('Stray Innocence');
      expect(result.date).toBe('2026-04-02');
      expect(result.family_suggestion.primary).toBe('ethereal');
      expect(result.family_suggestion.confidence).toBe(0.85);
      expect(result.family_suggestion.fallback).toBe('warm-artisan');
      expect(result.recommendations.navigation.style).toBe('centered-top');
      expect(result.recommendations.whitespace.density).toBe('spacious');
      expect(result.recommendations.whitespace.multiplier).toBe(1.5);
      expect(result.recommendations.whitespace.section_gap).toBe('96px');
      expect(result.recommendations.whitespace.content_padding).toBe('80px');
      expect(result.recommendations.corners.radius_base).toBe('24px');
      expect(result.recommendations.corners.treatment).toBe('rounded');
      expect(result.recommendations.dividers.style).toBe('organic-wave');
      expect(result.recommendations.grid.rhythm).toBe('centered-single');
      expect(result.recommendations.grid.max_width).toBe('800px');
      expect(result.recommendations.grid.columns).toBe(1);
      expect(result.recommendations.animation.entrance).toBe('fade-up');
      expect(result.recommendations.animation.duration).toBe('300ms');
      expect(result.recommendations.sections.background).toBe('soft-fill');
      expect(result.recommendations.sections.hero_height).toBe('60vh');
    });

    it('should handle YAML with --- frontmatter delimiters', () => {
      const withDelimiters = `---\n${validBriefYaml}\n---`;
      const result = parseBrief(withDelimiters);
      expect(result).not.toBeNull();
      expect(result.brand).toBe('Stray Innocence');
    });

    it('should return null for null input', () => {
      expect(parseBrief(null)).toBeNull();
    });

    it('should return null for undefined input', () => {
      expect(parseBrief(undefined)).toBeNull();
    });

    it('should return null for empty string', () => {
      expect(parseBrief('')).toBeNull();
    });

    it('should return null for non-string input', () => {
      expect(parseBrief(42)).toBeNull();
      expect(parseBrief({})).toBeNull();
      expect(parseBrief([])).toBeNull();
    });

    it('should return null for invalid YAML (missing required fields)', () => {
      const invalidYaml = `
brand: Test
date: 2026-04-02
`;
      expect(parseBrief(invalidYaml)).toBeNull();
    });

    it('should return null for YAML with invalid family', () => {
      const invalidFamily = validBriefYaml.replace('primary: ethereal', 'primary: invalid-family');
      expect(parseBrief(invalidFamily)).toBeNull();
    });

    it('should return null for YAML with invalid nav style', () => {
      const invalidNav = validBriefYaml.replace('style: centered-top', 'style: invalid-nav');
      expect(parseBrief(invalidNav)).toBeNull();
    });
  });

  describe('extractRecommendations', () => {
    it('should extract recommendations from valid parsed brief', () => {
      const brief = parseBrief(validBriefYaml);
      const recs = extractRecommendations(brief);

      expect(recs).not.toBeNull();
      expect(recs.navigation.style).toBe('centered-top');
      expect(recs.whitespace.multiplier).toBe(1.5);
      expect(recs.corners.radius_base).toBe('24px');
      expect(recs.dividers.style).toBe('organic-wave');
      expect(recs.grid.rhythm).toBe('centered-single');
      expect(recs.animation.entrance).toBe('fade-up');
      expect(recs.sections.background).toBe('soft-fill');
    });

    it('should return null for null brief', () => {
      expect(extractRecommendations(null)).toBeNull();
    });

    it('should return null for brief without recommendations', () => {
      expect(extractRecommendations({})).toBeNull();
    });
  });

  describe('extractFamilySuggestion', () => {
    it('should extract family suggestion from valid parsed brief', () => {
      const brief = parseBrief(validBriefYaml);
      const fs = extractFamilySuggestion(brief);

      expect(fs).not.toBeNull();
      expect(fs.primary).toBe('ethereal');
      expect(fs.confidence).toBe(0.85);
      expect(fs.fallback).toBe('warm-artisan');
    });

    it('should return null for null brief', () => {
      expect(extractFamilySuggestion(null)).toBeNull();
    });
  });

  describe('parseSimpleYaml', () => {
    it('should parse simple key-value pairs', () => {
      const yaml = 'name: test\nvalue: 42';
      const result = parseSimpleYaml(yaml);
      expect(result.name).toBe('test');
      expect(result.value).toBe(42);
    });

    it('should parse nested objects', () => {
      const yaml = 'parent:\n  child: value\n  num: 10';
      const result = parseSimpleYaml(yaml);
      expect(result.parent.child).toBe('value');
      expect(result.parent.num).toBe(10);
    });

    it('should handle quoted strings', () => {
      const yaml = "name: 'quoted value'\nother: \"double quoted\"";
      const result = parseSimpleYaml(yaml);
      expect(result.name).toBe('quoted value');
      expect(result.other).toBe('double quoted');
    });

    it('should handle boolean values', () => {
      const yaml = 'yes: true\nno: false';
      const result = parseSimpleYaml(yaml);
      expect(result.yes).toBe(true);
      expect(result.no).toBe(false);
    });

    it('should skip comments', () => {
      const yaml = '# comment\nname: value';
      const result = parseSimpleYaml(yaml);
      expect(result.name).toBe('value');
    });

    it('should return null for null input', () => {
      expect(parseSimpleYaml(null)).toBeNull();
    });

    it('should return null for empty string', () => {
      expect(parseSimpleYaml('')).toBeNull();
    });
  });
});
