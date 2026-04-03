'use strict';

const { DEFAULT_LAYOUT, mergeWithDefaults, deepMerge } = require('../src/defaults');

describe('defaults', () => {
  describe('DEFAULT_LAYOUT', () => {
    it('should be bold-structured family', () => {
      expect(DEFAULT_LAYOUT.family).toBe('bold-structured');
    });

    it('should have sidebar-fixed navigation', () => {
      expect(DEFAULT_LAYOUT.navigation.style).toBe('sidebar-fixed');
    });

    it('should have compact whitespace', () => {
      expect(DEFAULT_LAYOUT.whitespace.density).toBe('compact');
      expect(DEFAULT_LAYOUT.whitespace.multiplier).toBe(0.8);
      expect(DEFAULT_LAYOUT.whitespace.section_gap).toBe('48px');
      expect(DEFAULT_LAYOUT.whitespace.content_padding).toBe('40px');
    });

    it('should have subtle 8px corners', () => {
      expect(DEFAULT_LAYOUT.corners.radius_base).toBe('8px');
      expect(DEFAULT_LAYOUT.corners.treatment).toBe('subtle');
    });

    it('should have solid-thin dividers', () => {
      expect(DEFAULT_LAYOUT.dividers.style).toBe('solid-thin');
    });

    it('should have strict-grid with 12 columns', () => {
      expect(DEFAULT_LAYOUT.grid.rhythm).toBe('strict-grid');
      expect(DEFAULT_LAYOUT.grid.max_width).toBe('1400px');
      expect(DEFAULT_LAYOUT.grid.columns).toBe(12);
    });

    it('should have no animation', () => {
      expect(DEFAULT_LAYOUT.animation.entrance).toBe('none');
      expect(DEFAULT_LAYOUT.animation.duration).toBe('0ms');
    });

    it('should have flat-solid section background', () => {
      expect(DEFAULT_LAYOUT.sections.background).toBe('flat-solid');
      expect(DEFAULT_LAYOUT.sections.hero_height).toBe('40vh');
    });

    it('should be frozen (immutable)', () => {
      expect(Object.isFrozen(DEFAULT_LAYOUT)).toBe(true);
    });

    it('should have all 7 recommendation sections plus family', () => {
      expect(DEFAULT_LAYOUT).toHaveProperty('family');
      expect(DEFAULT_LAYOUT).toHaveProperty('navigation');
      expect(DEFAULT_LAYOUT).toHaveProperty('whitespace');
      expect(DEFAULT_LAYOUT).toHaveProperty('corners');
      expect(DEFAULT_LAYOUT).toHaveProperty('dividers');
      expect(DEFAULT_LAYOUT).toHaveProperty('grid');
      expect(DEFAULT_LAYOUT).toHaveProperty('animation');
      expect(DEFAULT_LAYOUT).toHaveProperty('sections');
    });
  });

  describe('mergeWithDefaults', () => {
    it('should return defaults when given null', () => {
      const result = mergeWithDefaults(null);
      expect(result.family).toBe('bold-structured');
      expect(result.navigation.style).toBe('sidebar-fixed');
      expect(result.whitespace.density).toBe('compact');
    });

    it('should return defaults when given undefined', () => {
      const result = mergeWithDefaults(undefined);
      expect(result.family).toBe('bold-structured');
    });

    it('should return defaults when given empty object', () => {
      const result = mergeWithDefaults({});
      expect(result.family).toBe('bold-structured');
      expect(result.navigation.style).toBe('sidebar-fixed');
      expect(result.grid.columns).toBe(12);
    });

    it('should merge partial brief — overrides only specified fields', () => {
      const partial = {
        family: 'ethereal',
        navigation: { style: 'centered-top' },
      };

      const result = mergeWithDefaults(partial);
      expect(result.family).toBe('ethereal');
      expect(result.navigation.style).toBe('centered-top');
      // Non-overridden fields retain defaults
      expect(result.whitespace.density).toBe('compact');
      expect(result.corners.radius_base).toBe('8px');
      expect(result.grid.rhythm).toBe('strict-grid');
    });

    it('should deep merge nested objects', () => {
      const partial = {
        whitespace: { density: 'spacious', multiplier: 1.5 },
      };

      const result = mergeWithDefaults(partial);
      expect(result.whitespace.density).toBe('spacious');
      expect(result.whitespace.multiplier).toBe(1.5);
      // Retained from defaults
      expect(result.whitespace.section_gap).toBe('48px');
      expect(result.whitespace.content_padding).toBe('40px');
    });

    it('should use all brief values when full brief is provided', () => {
      const full = {
        family: 'ethereal',
        navigation: { style: 'centered-top', justification: 'test' },
        whitespace: { density: 'spacious', multiplier: 1.5, section_gap: '96px', content_padding: '80px' },
        corners: { radius_base: '24px', treatment: 'rounded' },
        dividers: { style: 'organic-wave' },
        grid: { rhythm: 'centered-single', max_width: '800px', columns: 1 },
        animation: { entrance: 'fade-up', duration: '300ms' },
        sections: { background: 'soft-fill', hero_height: '60vh' },
      };

      const result = mergeWithDefaults(full);
      expect(result.family).toBe('ethereal');
      expect(result.navigation.style).toBe('centered-top');
      expect(result.whitespace.density).toBe('spacious');
      expect(result.whitespace.multiplier).toBe(1.5);
      expect(result.whitespace.section_gap).toBe('96px');
      expect(result.whitespace.content_padding).toBe('80px');
      expect(result.corners.radius_base).toBe('24px');
      expect(result.corners.treatment).toBe('rounded');
      expect(result.dividers.style).toBe('organic-wave');
      expect(result.grid.rhythm).toBe('centered-single');
      expect(result.grid.max_width).toBe('800px');
      expect(result.grid.columns).toBe(1);
      expect(result.animation.entrance).toBe('fade-up');
      expect(result.animation.duration).toBe('300ms');
      expect(result.sections.background).toBe('soft-fill');
      expect(result.sections.hero_height).toBe('60vh');
    });

    it('should not mutate DEFAULT_LAYOUT', () => {
      mergeWithDefaults({ family: 'ethereal' });
      expect(DEFAULT_LAYOUT.family).toBe('bold-structured');
    });
  });

  describe('deepMerge', () => {
    it('should merge flat objects', () => {
      const result = deepMerge({ a: 1, b: 2 }, { b: 3, c: 4 });
      expect(result).toEqual({ a: 1, b: 3, c: 4 });
    });

    it('should deep merge nested objects', () => {
      const result = deepMerge(
        { nested: { a: 1, b: 2 } },
        { nested: { b: 3, c: 4 } }
      );
      expect(result).toEqual({ nested: { a: 1, b: 3, c: 4 } });
    });

    it('should overwrite arrays (not merge)', () => {
      const result = deepMerge(
        { arr: [1, 2] },
        { arr: [3, 4, 5] }
      );
      expect(result.arr).toEqual([3, 4, 5]);
    });

    it('should overwrite primitives', () => {
      const result = deepMerge(
        { val: 'old' },
        { val: 'new' }
      );
      expect(result.val).toBe('new');
    });

    it('should not mutate inputs', () => {
      const target = { a: { b: 1 } };
      const source = { a: { c: 2 } };
      deepMerge(target, source);
      expect(target.a).toEqual({ b: 1 });
      expect(source.a).toEqual({ c: 2 });
    });
  });
});
