'use strict';

const { generateCSSVariables, flattenTokens } = require('../src/css-var-generator');
const { resolveLayout } = require('../src/index');

describe('css-var-generator', () => {
  describe('generateCSSVariables', () => {
    it('generates :root block with --layout-* vars', () => {
      const input = {
        archetypes: ['Innocent', 'Dreamer'],
        personalityTraits: {
          formalCasual: 2,
          traditionalModern: 2,
          seriousPlayful: 2,
          conservativeBold: 1,
          minimalExpressive: 1,
        },
      };
      const tokens = resolveLayout(input).tokens;
      const css = generateCSSVariables(tokens);

      expect(css).toContain(':root {');
      expect(css).toContain('--layout-family-name');
      expect(css).toContain('--layout-corner-radiusBase');
      expect(css).toContain('--layout-nav-style');
      expect(css).toContain('}');
    });

    it('includes all token paths from layout engine output', () => {
      const input = {
        archetypes: ['Ruler'],
        personalityTraits: {
          formalCasual: 1,
          traditionalModern: 3,
          seriousPlayful: 1,
          conservativeBold: 3,
          minimalExpressive: 2,
        },
      };
      const tokens = resolveLayout(input).tokens;
      const css = generateCSSVariables(tokens);

      // Check key categories exist
      expect(css).toContain('--layout-family-name');
      expect(css).toContain('--layout-corner-');
      expect(css).toContain('--layout-whitespace-');
      expect(css).toContain('--layout-nav-');
      expect(css).toContain('--layout-divider-');
      expect(css).toContain('--layout-animation-');
      expect(css).toContain('--layout-grid-');
      expect(css).toContain('--layout-section-');
      expect(css).toContain('--layout-component-');
    });

    it('handles nested DTCG structure correctly', () => {
      const tokens = {
        layout: {
          corner: {
            radiusBase: { $value: '24px', $type: 'dimension', $description: 'test' },
          },
        },
      };
      const css = generateCSSVariables(tokens);
      expect(css).toContain('--layout-corner-radiusBase: var(--layout-corner-radiusBase, 24px);');
    });

    it('returns empty string for null tokens', () => {
      expect(generateCSSVariables(null)).toBe('');
    });

    it('returns empty string for undefined tokens', () => {
      expect(generateCSSVariables(undefined)).toBe('');
    });

    it('returns empty string for empty object', () => {
      expect(generateCSSVariables({})).toBe('');
    });

    it('returns empty string for object with empty layout', () => {
      expect(generateCSSVariables({ layout: {} })).toBe('');
    });

    it('uses var() with fallback pattern', () => {
      const tokens = {
        layout: {
          nav: {
            style: { $value: 'centered-top', $type: 'string', $description: 'Nav style' },
          },
        },
      };
      const css = generateCSSVariables(tokens);
      expect(css).toContain('var(--layout-nav-style, centered-top)');
    });

    it('handles numeric token values', () => {
      const tokens = {
        layout: {
          grid: {
            columns: { $value: 12, $type: 'number', $description: 'Grid columns' },
          },
        },
      };
      const css = generateCSSVariables(tokens);
      expect(css).toContain('--layout-grid-columns: var(--layout-grid-columns, 12);');
    });
  });

  describe('flattenTokens', () => {
    it('flattens nested tokens to flat map', () => {
      const obj = {
        corner: {
          radiusBase: { $value: '8px', $type: 'dimension', $description: 'desc' },
          radiusSmall: { $value: '4px', $type: 'dimension', $description: 'desc' },
        },
      };
      const result = flattenTokens(obj, '', {});
      expect(result['--layout-corner-radiusBase']).toBe('8px');
      expect(result['--layout-corner-radiusSmall']).toBe('4px');
    });

    it('returns empty object for null input', () => {
      expect(flattenTokens(null, '', {})).toEqual({});
    });

    it('skips non-object values', () => {
      expect(flattenTokens('string', '', {})).toEqual({});
    });
  });
});
