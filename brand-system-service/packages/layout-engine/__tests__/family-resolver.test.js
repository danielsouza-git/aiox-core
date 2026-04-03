'use strict';

const { resolveFamily, ARCHETYPE_FAMILY_MAP } = require('../src/family-resolver');
const { VALID_ARCHETYPES } = require('../src/types');

describe('family-resolver', () => {
  describe('single archetype resolution', () => {
    const expectedPrimary = {
      'Innocent': 'ethereal',
      'Dreamer': 'ethereal',
      'Creator': 'warm-artisan',
      'Caregiver': 'warm-artisan',
      'Explorer': 'adventurous-open',
      'Sage': 'adventurous-open',
      'Ruler': 'bold-structured',
      'Hero': 'bold-structured',
      'Jester': 'playful-dynamic',
      'Magician': 'playful-dynamic',
      'Rebel': 'rebel-edge',
      'Outlaw': 'rebel-edge',
      'Everyman': 'warm-artisan',
      'Lover': 'ethereal',
    };

    const neutralTraits = {
      formalCasual: 3,
      traditionalModern: 3,
      seriousPlayful: 3,
      conservativeBold: 3,
      minimalExpressive: 3,
    };

    it.each(VALID_ARCHETYPES)(
      '%s resolves to expected primary family',
      (archetype) => {
        const { family } = resolveFamily([archetype], neutralTraits);
        expect(family).toBe(expectedPrimary[archetype]);
      }
    );
  });

  describe('multi-archetype scoring', () => {
    const neutralTraits = {
      formalCasual: 3,
      traditionalModern: 3,
      seriousPlayful: 3,
      conservativeBold: 3,
      minimalExpressive: 3,
    };

    it('[Innocent, Dreamer] resolves to ethereal', () => {
      const { family } = resolveFamily(['Innocent', 'Dreamer'], neutralTraits);
      expect(family).toBe('ethereal');
    });

    it('[Explorer, Creator] resolves to adventurous-open or warm-artisan based on weights', () => {
      const { family, scores } = resolveFamily(['Explorer', 'Creator'], neutralTraits);
      // Explorer(1.0): adventurous-open=1.0, warm-artisan=0.3
      // Creator(0.6): warm-artisan=0.6, playful-dynamic=0.18
      // adventurous-open = 1.0, warm-artisan = 0.3+0.6 = 0.9
      expect(family).toBe('adventurous-open');
      expect(scores['adventurous-open']).toBeGreaterThan(scores['warm-artisan']);
    });

    it('[Ruler, Hero, Rebel] resolves to bold-structured', () => {
      const { family } = resolveFamily(['Ruler', 'Hero', 'Rebel'], neutralTraits);
      // Ruler(1.0): bold=1.0, adv=0.3
      // Hero(0.6): bold=0.6, rebel=0.18
      // Rebel(0.3): rebel=0.3, bold=0.09
      // bold-structured = 1.0 + 0.6 + 0.09 = 1.69
      expect(family).toBe('bold-structured');
    });

    it('4th+ archetypes use 0.2 weight', () => {
      const { scores } = resolveFamily(
        ['Innocent', 'Dreamer', 'Creator', 'Explorer'],
        neutralTraits
      );
      // Dreamer(0.6) fallback=adventurous-open: 0.6*0.3=0.18
      // Explorer(0.2) primary=adventurous-open: 0.2
      // Total adventurous-open = 0.18 + 0.2 = 0.38
      expect(scores['adventurous-open']).toBeCloseTo(0.38, 2);
    });
  });

  describe('personality modifiers shift scores', () => {
    it('formalCasual=1 boosts bold-structured', () => {
      const traits = {
        formalCasual: 1,
        traditionalModern: 3,
        seriousPlayful: 3,
        conservativeBold: 3,
        minimalExpressive: 3,
      };
      const { scores } = resolveFamily(['Jester'], traits);
      // Jester primary = playful-dynamic(1.0), fallback warm-artisan(0.3)
      // formalCasual=1 -> bold-structured + 0.3
      expect(scores['bold-structured']).toBeCloseTo(0.3, 2);
    });

    it('conservativeBold=5 boosts rebel-edge', () => {
      const traits = {
        formalCasual: 3,
        traditionalModern: 3,
        seriousPlayful: 3,
        conservativeBold: 5,
        minimalExpressive: 3,
      };
      const { scores } = resolveFamily(['Innocent'], traits);
      // Innocent primary = ethereal(1.0), fallback warm-artisan(0.3)
      // conservativeBold=5 -> rebel-edge + 0.2
      expect(scores['rebel-edge']).toBeCloseTo(0.2, 2);
    });

    it('minimalExpressive=1 boosts ethereal', () => {
      const traits = {
        formalCasual: 3,
        traditionalModern: 3,
        seriousPlayful: 3,
        conservativeBold: 3,
        minimalExpressive: 1,
      };
      const { scores } = resolveFamily(['Ruler'], traits);
      // Ruler primary = bold-structured(1.0), fallback adv(0.3)
      // minimalExpressive=1 -> ethereal + 0.3
      expect(scores['ethereal']).toBeCloseTo(0.3, 2);
    });

    it('all low traits (1) shift toward formal/structured families', () => {
      const traits = {
        formalCasual: 1,
        traditionalModern: 1,
        seriousPlayful: 1,
        conservativeBold: 1,
        minimalExpressive: 1,
      };
      const { scores } = resolveFamily(['Creator'], traits);
      // Creator: warm-artisan(1.0), playful-dynamic(0.3)
      // Modifiers: bold+0.3, warm+0.2, bold+0.2, ethereal+0.2, ethereal+0.3
      // bold-structured = 0.5, ethereal = 0.5
      expect(scores['bold-structured']).toBeCloseTo(0.5, 2);
      expect(scores['ethereal']).toBeCloseTo(0.5, 2);
    });

    it('all high traits (5) shift toward expressive/dynamic families', () => {
      const traits = {
        formalCasual: 5,
        traditionalModern: 5,
        seriousPlayful: 5,
        conservativeBold: 5,
        minimalExpressive: 5,
      };
      const { scores } = resolveFamily(['Ruler'], traits);
      // Ruler: bold(1.0), adv(0.3)
      // Modifiers: playful+0.3, adv+0.2, playful+0.2, rebel+0.2, playful+0.3
      // playful-dynamic = 0.8
      expect(scores['playful-dynamic']).toBeCloseTo(0.8, 2);
    });
  });

  describe('edge cases', () => {
    it('unknown archetype is skipped gracefully', () => {
      const neutralTraits = {
        formalCasual: 3,
        traditionalModern: 3,
        seriousPlayful: 3,
        conservativeBold: 3,
        minimalExpressive: 3,
      };
      const { family } = resolveFamily(['UnknownType', 'Innocent'], neutralTraits);
      // UnknownType skipped, Innocent wins
      expect(family).toBe('ethereal');
    });

    it('empty archetypes returns warm-artisan (default)', () => {
      const neutralTraits = {
        formalCasual: 3,
        traditionalModern: 3,
        seriousPlayful: 3,
        conservativeBold: 3,
        minimalExpressive: 3,
      };
      const { family } = resolveFamily([], neutralTraits);
      expect(family).toBe('warm-artisan');
    });

    it('all 14 archetypes are in ARCHETYPE_FAMILY_MAP', () => {
      for (const archetype of VALID_ARCHETYPES) {
        expect(ARCHETYPE_FAMILY_MAP[archetype]).toBeDefined();
        expect(ARCHETYPE_FAMILY_MAP[archetype].primary).toBeDefined();
        expect(ARCHETYPE_FAMILY_MAP[archetype].fallback).toBeDefined();
      }
    });
  });
});
