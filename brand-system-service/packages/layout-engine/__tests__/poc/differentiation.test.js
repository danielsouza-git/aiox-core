'use strict';

const { resolveLayout, generateLayoutCSS } = require('../../src/index');

/**
 * PDL-6: Differentiation Tests
 *
 * CRITICAL: Validates that two different brands produce visually distinct
 * layout skeletons from the same pipeline. This is the core value
 * proposition of the Personality-Driven Layout system.
 *
 * Stray Innocence (ETHEREAL) vs Nova Vista Cafe (ADVENTUROUS-OPEN)
 */
describe('PDL-6: Differentiation — Stray Innocence vs Nova Vista Cafe', () => {
  // Stray Innocence: Innocent/Dreamer/Creator -> ETHEREAL
  const strayInput = {
    archetypes: ['Innocent', 'Dreamer', 'Creator'],
    personalityTraits: {
      formalCasual: 2,
      traditionalModern: 2,
      seriousPlayful: 2,
      conservativeBold: 1,
      minimalExpressive: 1,
    },
  };

  // Nova Vista Cafe: Explorer/Creator -> ADVENTUROUS-OPEN
  const novaVistaInput = {
    archetypes: ['Explorer', 'Creator'],
    personalityTraits: {
      formalCasual: 2,
      traditionalModern: 4,
      seriousPlayful: 3,
      conservativeBold: 4,
      minimalExpressive: 4,
    },
  };

  let stray;
  let novaVista;

  beforeAll(() => {
    stray = resolveLayout(strayInput);
    novaVista = resolveLayout(novaVistaInput);
  });

  describe('Family resolution differentiation', () => {
    it('Stray Innocence resolves to ethereal', () => {
      expect(stray.family).toBe('ethereal');
    });

    it('Nova Vista Cafe resolves to adventurous-open', () => {
      expect(novaVista.family).toBe('adventurous-open');
    });

    it('families are different', () => {
      expect(stray.family).not.toBe(novaVista.family);
    });
  });

  describe('Dimension-by-dimension differentiation', () => {
    it('navigation styles differ', () => {
      const strayNav = stray.tokens.layout.nav.style.$value;
      const novaNav = novaVista.tokens.layout.nav.style.$value;
      expect(strayNav).not.toBe(novaNav);
      expect(strayNav).toBe('centered-top');
      expect(novaNav).toBe('sticky-minimal');
    });

    it('corner radii differ', () => {
      const strayRadius = stray.tokens.layout.corner.radiusBase.$value;
      const novaRadius = novaVista.tokens.layout.corner.radiusBase.$value;
      expect(strayRadius).not.toBe(novaRadius);
    });

    it('divider styles differ', () => {
      const strayDivider = stray.tokens.layout.divider.style.$value;
      const novaDivider = novaVista.tokens.layout.divider.style.$value;
      expect(strayDivider).not.toBe(novaDivider);
      expect(strayDivider).toBe('organic-wave');
      expect(novaDivider).toBe('thin-geometric');
    });

    it('animation entrance types differ', () => {
      const strayAnim = stray.tokens.layout.animation.entrance.$value;
      const novaAnim = novaVista.tokens.layout.animation.entrance.$value;
      expect(strayAnim).not.toBe(novaAnim);
      expect(strayAnim).toBe('fade-up');
      expect(novaAnim).toBe('scroll-reveal');
    });

    it('grid rhythms differ', () => {
      const strayGrid = stray.tokens.layout.grid.rhythm.$value;
      const novaGrid = novaVista.tokens.layout.grid.rhythm.$value;
      expect(strayGrid).not.toBe(novaGrid);
      expect(strayGrid).toBe('centered-single');
      expect(novaGrid).toBe('editorial-wide');
    });

    it('section backgrounds differ', () => {
      const strayBg = stray.tokens.layout.section.background.$value;
      const novaBg = novaVista.tokens.layout.section.background.$value;
      expect(strayBg).not.toBe(novaBg);
      expect(strayBg).toBe('soft-fill');
      expect(novaBg).toBe('full-bleed-image');
    });

    it('whitespace densities differ', () => {
      const strayDensity = stray.tokens.layout.whitespace.density.$value;
      const novaDensity = novaVista.tokens.layout.whitespace.density.$value;
      expect(strayDensity).not.toBe(novaDensity);
      expect(strayDensity).toBe('spacious');
      expect(novaDensity).toBe('generous');
    });
  });

  describe('Minimum differentiation threshold', () => {
    it('at least 5 of 7 layout dimensions differ', () => {
      const dimensions = [
        { name: 'navigation', stray: stray.tokens.layout.nav.style.$value, nova: novaVista.tokens.layout.nav.style.$value },
        { name: 'corner', stray: stray.tokens.layout.corner.radiusBase.$value, nova: novaVista.tokens.layout.corner.radiusBase.$value },
        { name: 'divider', stray: stray.tokens.layout.divider.style.$value, nova: novaVista.tokens.layout.divider.style.$value },
        { name: 'animation', stray: stray.tokens.layout.animation.entrance.$value, nova: novaVista.tokens.layout.animation.entrance.$value },
        { name: 'grid', stray: stray.tokens.layout.grid.rhythm.$value, nova: novaVista.tokens.layout.grid.rhythm.$value },
        { name: 'background', stray: stray.tokens.layout.section.background.$value, nova: novaVista.tokens.layout.section.background.$value },
        { name: 'whitespace', stray: stray.tokens.layout.whitespace.density.$value, nova: novaVista.tokens.layout.whitespace.density.$value },
      ];

      let diffCount = 0;
      for (const dim of dimensions) {
        if (dim.stray !== dim.nova) {
          diffCount++;
        }
      }

      expect(diffCount).toBeGreaterThanOrEqual(5);
    });

    it('all 7 of 7 layout dimensions differ (full differentiation)', () => {
      const dimensions = [
        { stray: stray.tokens.layout.nav.style.$value, nova: novaVista.tokens.layout.nav.style.$value },
        { stray: stray.tokens.layout.corner.radiusBase.$value, nova: novaVista.tokens.layout.corner.radiusBase.$value },
        { stray: stray.tokens.layout.divider.style.$value, nova: novaVista.tokens.layout.divider.style.$value },
        { stray: stray.tokens.layout.animation.entrance.$value, nova: novaVista.tokens.layout.animation.entrance.$value },
        { stray: stray.tokens.layout.grid.rhythm.$value, nova: novaVista.tokens.layout.grid.rhythm.$value },
        { stray: stray.tokens.layout.section.background.$value, nova: novaVista.tokens.layout.section.background.$value },
        { stray: stray.tokens.layout.whitespace.density.$value, nova: novaVista.tokens.layout.whitespace.density.$value },
      ];

      for (const dim of dimensions) {
        expect(dim.stray).not.toBe(dim.nova);
      }
    });
  });

  describe('CSS output differentiation', () => {
    it('full CSS outputs are different strings', () => {
      const strayConfig = {
        family: 'ethereal',
        navigation: { style: 'centered-top' },
        whitespace: { density: 'spacious', multiplier: 1.5, section_gap: '96px', content_padding: '80px' },
        corners: { radius_base: '24px', treatment: 'pill' },
        dividers: { style: 'organic-wave' },
        grid: { rhythm: 'centered-single', max_width: '800px', columns: 1 },
        animation: { entrance: 'fade-up', duration: '300ms' },
        sections: { background: 'soft-fill', hero_height: '60vh' },
      };

      const novaConfig = {
        family: 'adventurous-open',
        navigation: { style: 'sticky-minimal' },
        whitespace: { density: 'generous', multiplier: 1.3, section_gap: '80px', content_padding: '64px' },
        corners: { radius_base: '6px', treatment: 'subtle' },
        dividers: { style: 'thin-geometric' },
        grid: { rhythm: 'editorial-wide', max_width: '1200px', columns: 2 },
        animation: { entrance: 'scroll-reveal', duration: '400ms' },
        sections: { background: 'full-bleed-image', hero_height: '80vh' },
      };

      const strayCSS = generateLayoutCSS(strayConfig);
      const novaCSS = generateLayoutCSS(novaConfig);

      expect(strayCSS).not.toBe(novaCSS);
      expect(strayCSS.length).toBeGreaterThan(0);
      expect(novaCSS.length).toBeGreaterThan(0);
    });

    it('CSS contains brand-specific nav classes', () => {
      const { generateNavCSS } = require('../../src/index');

      const strayNavCSS = generateNavCSS('centered-top');
      const novaNavCSS = generateNavCSS('sticky-minimal');

      expect(strayNavCSS).toContain('centered-top');
      expect(novaNavCSS).toContain('sticky-minimal');
      expect(strayNavCSS).not.toContain('sticky-minimal');
      expect(novaNavCSS).not.toContain('centered-top');
    });

    it('CSS contains brand-specific animation keyframes', () => {
      const strayConfig = { animation: { entrance: 'fade-up' } };
      const novaConfig = { animation: { entrance: 'scroll-reveal' } };

      const strayCSS = generateLayoutCSS(strayConfig);
      const novaCSS = generateLayoutCSS(novaConfig);

      expect(strayCSS).toContain('fade-up');
      expect(novaCSS).toContain('scroll-reveal');
    });

    it('CSS contains brand-specific divider styles', () => {
      const strayConfig = { dividers: { style: 'organic-wave' } };
      const novaConfig = { dividers: { style: 'thin-geometric' } };

      const strayCSS = generateLayoutCSS(strayConfig);
      const novaCSS = generateLayoutCSS(novaConfig);

      expect(strayCSS).toContain('organic-wave');
      expect(novaCSS).toContain('thin-geometric');
    });
  });

  describe('Scoring differentiation', () => {
    it('Stray Innocence ethereal score > adventurous-open score', () => {
      expect(stray.scoring.scores['ethereal']).toBeGreaterThan(
        stray.scoring.scores['adventurous-open']
      );
    });

    it('Nova Vista adventurous-open score > ethereal score', () => {
      expect(novaVista.scoring.scores['adventurous-open']).toBeGreaterThan(
        novaVista.scoring.scores['ethereal']
      );
    });

    it('winning families are different in scoring breakdown', () => {
      expect(stray.scoring.family).not.toBe(novaVista.scoring.family);
    });
  });
});
