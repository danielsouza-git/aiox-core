'use strict';

const { modulateTokens, scaleDimension } = require('../src/personality-modulator');
const ethereal = require('../src/families/ethereal');
const boldStructured = require('../src/families/bold-structured');

describe('personality-modulator', () => {
  describe('scaleDimension helper', () => {
    it('scales 24px by 1.3 to 31px', () => {
      expect(scaleDimension('24px', 1.3)).toBe('31px');
    });

    it('scales 96px by 1.2 to 115px', () => {
      expect(scaleDimension('96px', 1.2)).toBe('115px');
    });

    it('scales 0px by any factor to 0px', () => {
      expect(scaleDimension('0px', 1.5)).toBe('0px');
    });

    it('scales 60vh by 0.5 to 30vh', () => {
      expect(scaleDimension('60vh', 0.5)).toBe('30vh');
    });

    it('scales 300ms by 0.7 to 210ms', () => {
      expect(scaleDimension('300ms', 0.7)).toBe('210ms');
    });
  });

  describe('all 1s (extreme minimal/formal/conservative)', () => {
    const traits = {
      formalCasual: 1,
      traditionalModern: 1,
      seriousPlayful: 1,
      conservativeBold: 1,
      minimalExpressive: 1,
    };

    it('enlarges whitespace multiplier by 1.2x', () => {
      const result = modulateTokens(ethereal, traits);
      expect(result.whitespace.multiplier).toBeCloseTo(1.5 * 1.2, 2);
    });

    it('enlarges sectionGap by 1.2x', () => {
      const result = modulateTokens(ethereal, traits);
      // 96px * 1.2 = 115px
      expect(result.whitespace.sectionGap).toBe('115px');
    });

    it('shrinks radiusBase by 0.5x (formalCasual=1)', () => {
      const result = modulateTokens(ethereal, traits);
      // 24px * 0.5 = 12px
      expect(result.corner.radiusBase).toBe('12px');
    });

    it('does not modify base preset (immutability)', () => {
      const original = JSON.parse(JSON.stringify(ethereal));
      modulateTokens(ethereal, traits);
      expect(ethereal).toEqual(original);
    });
  });

  describe('all 5s (extreme expressive/casual/bold)', () => {
    const traits = {
      formalCasual: 5,
      traditionalModern: 5,
      seriousPlayful: 5,
      conservativeBold: 5,
      minimalExpressive: 5,
    };

    it('reduces whitespace multiplier by 0.9x', () => {
      const result = modulateTokens(ethereal, traits);
      expect(result.whitespace.multiplier).toBeCloseTo(1.5 * 0.9, 2);
    });

    it('increases radiusBase by 1.3x (formalCasual=5)', () => {
      const result = modulateTokens(ethereal, traits);
      // 24px * 1.3 = 31px
      expect(result.corner.radiusBase).toBe('31px');
    });

    it('reduces animation duration by 0.7x (conservativeBold=5)', () => {
      const result = modulateTokens(ethereal, traits);
      // 300ms * 0.7 = 210ms
      expect(result.animation.duration).toBe('210ms');
    });

    it('sets grid maxWidth to 1200px (minimalExpressive=5)', () => {
      const result = modulateTokens(ethereal, traits);
      expect(result.grid.maxWidth).toBe('1200px');
    });
  });

  describe('all 3s (neutral)', () => {
    const traits = {
      formalCasual: 3,
      traditionalModern: 3,
      seriousPlayful: 3,
      conservativeBold: 3,
      minimalExpressive: 3,
    };

    it('produces minimal change from base ethereal preset', () => {
      const result = modulateTokens(ethereal, traits);
      expect(result.whitespace.multiplier).toBe(ethereal.whitespace.multiplier);
      expect(result.corner.radiusBase).toBe(ethereal.corner.radiusBase);
      expect(result.animation.duration).toBe(ethereal.animation.duration);
      expect(result.grid.maxWidth).toBe(ethereal.grid.maxWidth);
    });

    it('produces minimal change from base bold-structured preset', () => {
      const result = modulateTokens(boldStructured, traits);
      expect(result.whitespace.multiplier).toBe(boldStructured.whitespace.multiplier);
      expect(result.corner.radiusBase).toBe(boldStructured.corner.radiusBase);
    });
  });

  describe('individual trait modulation', () => {
    it('formalCasual=5 increases radiusBase', () => {
      const traits = {
        formalCasual: 5,
        traditionalModern: 3,
        seriousPlayful: 3,
        conservativeBold: 3,
        minimalExpressive: 3,
      };
      const result = modulateTokens(boldStructured, traits);
      // 2px * 1.3 = 3px (rounded)
      expect(result.corner.radiusBase).toBe('3px');
    });

    it('minimalExpressive=2 enlarges whitespace but keeps grid', () => {
      const traits = {
        formalCasual: 3,
        traditionalModern: 3,
        seriousPlayful: 3,
        conservativeBold: 3,
        minimalExpressive: 2,
      };
      const result = modulateTokens(boldStructured, traits);
      expect(result.whitespace.multiplier).toBeCloseTo(0.8 * 1.2, 2);
      // maxWidth should NOT change to 1200px (only for >=4)
      expect(result.grid.maxWidth).toBe(boldStructured.grid.maxWidth);
    });

    it('conservativeBold=4 reduces animation duration', () => {
      const traits = {
        formalCasual: 3,
        traditionalModern: 3,
        seriousPlayful: 3,
        conservativeBold: 4,
        minimalExpressive: 3,
      };
      const result = modulateTokens(ethereal, traits);
      // 300ms * 0.7 = 210ms
      expect(result.animation.duration).toBe('210ms');
    });
  });

  describe('null traits handling', () => {
    it('returns deep clone of base tokens when traits is null', () => {
      const result = modulateTokens(ethereal, null);
      expect(result).toEqual(ethereal);
      expect(result).not.toBe(ethereal);
    });
  });
});
