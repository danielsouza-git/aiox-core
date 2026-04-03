'use strict';

const { emitTokens, inferTokenType } = require('../src/token-emitter');
const ethereal = require('../src/families/ethereal');
const boldStructured = require('../src/families/bold-structured');

describe('token-emitter', () => {
  describe('inferTokenType', () => {
    it('returns "dimension" for px values', () => {
      expect(inferTokenType('24px')).toBe('dimension');
    });

    it('returns "dimension" for vh values', () => {
      expect(inferTokenType('60vh')).toBe('dimension');
    });

    it('returns "duration" for ms values', () => {
      expect(inferTokenType('300ms')).toBe('duration');
    });

    it('returns "cubicBezier" for cubic-bezier values', () => {
      expect(inferTokenType('cubic-bezier(0.25, 0.1, 0.25, 1.0)')).toBe('cubicBezier');
    });

    it('returns "number" for numeric values', () => {
      expect(inferTokenType(1.5)).toBe('number');
      expect(inferTokenType(12)).toBe('number');
    });

    it('returns "string" for plain strings', () => {
      expect(inferTokenType('spacious')).toBe('string');
      expect(inferTokenType('fade-up')).toBe('string');
    });
  });

  describe('emitTokens structure', () => {
    let tokens;

    beforeAll(() => {
      const result = emitTokens('ethereal', ethereal);
      tokens = result.layout;
    });

    it('wraps output in { layout: ... }', () => {
      const result = emitTokens('ethereal', ethereal);
      expect(result).toHaveProperty('layout');
    });

    it('has family.name token', () => {
      expect(tokens.family.name.$value).toBe('ethereal');
      expect(tokens.family.name.$type).toBe('string');
      expect(tokens.family.name.$description).toBeDefined();
    });

    it('has all required token categories', () => {
      const categories = ['family', 'corner', 'whitespace', 'nav', 'divider', 'animation', 'grid', 'section', 'component'];
      for (const cat of categories) {
        expect(tokens[cat]).toBeDefined();
      }
    });

    it('has nav.style token', () => {
      expect(tokens.nav.style.$value).toBe('centered-top');
      expect(tokens.nav.style.$type).toBe('string');
    });

    it('has whitespace.density token', () => {
      expect(tokens.whitespace.density.$value).toBe('spacious');
      expect(tokens.whitespace.density.$type).toBe('string');
    });

    it('has corner.radiusBase token', () => {
      expect(tokens.corner.radiusBase.$value).toBe('24px');
      expect(tokens.corner.radiusBase.$type).toBe('dimension');
    });

    it('has animation.duration token', () => {
      expect(tokens.animation.duration.$value).toBe('300ms');
      expect(tokens.animation.duration.$type).toBe('duration');
    });

    it('has animation.easing token', () => {
      expect(tokens.animation.easing.$value).toContain('cubic-bezier');
      expect(tokens.animation.easing.$type).toBe('cubicBezier');
    });

    it('has grid.columns as number token', () => {
      expect(tokens.grid.columns.$value).toBe(1);
      expect(tokens.grid.columns.$type).toBe('number');
    });

    it('has whitespace.multiplier as number token', () => {
      expect(tokens.whitespace.multiplier.$value).toBe(1.5);
      expect(tokens.whitespace.multiplier.$type).toBe('number');
    });
  });

  describe('$value/$type/$description format for all tokens', () => {
    it('every token in ethereal preset has required DTCG fields', () => {
      const result = emitTokens('ethereal', ethereal);
      const layout = result.layout;

      for (const [catName, category] of Object.entries(layout)) {
        for (const [tokenName, token] of Object.entries(category)) {
          expect(token).toHaveProperty('$value');
          expect(token).toHaveProperty('$type');
          expect(token).toHaveProperty('$description');
          expect(typeof token.$description).toBe('string');
          expect(token.$description.length).toBeGreaterThan(0);
        }
      }
    });

    it('every token in bold-structured preset has required DTCG fields', () => {
      const result = emitTokens('bold-structured', boldStructured);
      const layout = result.layout;

      for (const [catName, category] of Object.entries(layout)) {
        for (const [tokenName, token] of Object.entries(category)) {
          expect(token).toHaveProperty('$value');
          expect(token).toHaveProperty('$type');
          expect(token).toHaveProperty('$description');
        }
      }
    });
  });

  describe('token type correctness', () => {
    it('string tokens have $type="string"', () => {
      const result = emitTokens('ethereal', ethereal);
      expect(result.layout.nav.style.$type).toBe('string');
      expect(result.layout.whitespace.density.$type).toBe('string');
      expect(result.layout.divider.style.$type).toBe('string');
      expect(result.layout.section.background.$type).toBe('string');
      expect(result.layout.component.cardShape.$type).toBe('string');
    });

    it('dimension tokens have $type="dimension"', () => {
      const result = emitTokens('ethereal', ethereal);
      expect(result.layout.corner.radiusBase.$type).toBe('dimension');
      expect(result.layout.whitespace.sectionGap.$type).toBe('dimension');
      expect(result.layout.nav.height.$type).toBe('dimension');
      expect(result.layout.section.heroHeight.$type).toBe('dimension');
    });

    it('number tokens have $type="number"', () => {
      const result = emitTokens('ethereal', ethereal);
      expect(result.layout.whitespace.multiplier.$type).toBe('number');
      expect(result.layout.grid.columns.$type).toBe('number');
    });
  });
});
