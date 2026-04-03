'use strict';

const {
  generateLayoutCSS,
  generateNavCSS,
  generateDividerCSS,
  generateAnimationCSS,
  generateGridCSS,
  generateSectionBgCSS,
  generateResponsiveCSS,
  generateCustomProperties,
} = require('../src/layout-css-generator');
const { DEFAULT_LAYOUT, mergeWithDefaults } = require('../src/defaults');

describe('layout-css-generator', () => {
  describe('generateCustomProperties', () => {
    it('should generate :root block with all layout custom properties', () => {
      const etherealLayout = {
        family: 'ethereal',
        navigation: { style: 'centered-top' },
        whitespace: { multiplier: 1.5, section_gap: '96px', content_padding: '80px' },
        corners: { radius_base: '24px' },
        dividers: { style: 'organic-wave' },
        grid: { rhythm: 'centered-single', max_width: '800px' },
        animation: { entrance: 'fade-up', duration: '300ms' },
        sections: { background: 'soft-fill' },
      };

      const css = generateCustomProperties(etherealLayout);

      expect(css).toContain('--layout-corner-radius: 24px');
      expect(css).toContain('--layout-whitespace-mult: 1.5');
      expect(css).toContain('--layout-section-gap: 96px');
      expect(css).toContain('--layout-content-padding: 80px');
      expect(css).toContain('--layout-grid-max-width: 800px');
      expect(css).toContain('--layout-animation-duration: 300ms');
      expect(css).toContain('--layout-nav-style: centered-top');
      expect(css).toContain('--layout-divider-style: organic-wave');
      expect(css).toContain('--layout-grid-rhythm: centered-single');
      expect(css).toContain('--layout-section-bg: soft-fill');
      expect(css).toContain('--layout-family: ethereal');
    });

    it('should use defaults for missing values', () => {
      const css = generateCustomProperties({});
      expect(css).toContain('--layout-corner-radius: 8px');
      expect(css).toContain('--layout-nav-style: sidebar-fixed');
      expect(css).toContain('--layout-family: bold-structured');
    });

    it('should handle null input', () => {
      const css = generateCustomProperties(null);
      expect(css).toContain(':root');
      expect(css).toContain('--layout-corner-radius: 8px');
    });
  });

  describe('generateNavCSS', () => {
    const navStyles = [
      'centered-top',
      'sidebar-fixed',
      'breadcrumb-horizontal',
      'sticky-minimal',
      'floating-pill',
      'inline-minimal',
    ];

    for (const style of navStyles) {
      it(`should generate valid CSS for "${style}" navigation`, () => {
        const css = generateNavCSS(style);
        expect(css).toContain(`/* Navigation: ${style} */`);
        expect(css).toContain(`.layout-nav--${style}`);
        // Verify it is valid CSS (contains braces)
        expect(css).toContain('{');
        expect(css).toContain('}');
      });
    }

    it('should fall back to sidebar-fixed for unknown style', () => {
      const css = generateNavCSS('unknown');
      expect(css).toContain('sidebar-fixed');
    });

    it('should include sticky behavior for sticky-minimal', () => {
      const css = generateNavCSS('sticky-minimal');
      expect(css).toContain('position: sticky');
    });

    it('should include pill shape for floating-pill', () => {
      const css = generateNavCSS('floating-pill');
      expect(css).toContain('border-radius');
      expect(css).toContain('box-shadow');
    });

    it('should include breadcrumb separator for breadcrumb-horizontal', () => {
      const css = generateNavCSS('breadcrumb-horizontal');
      expect(css).toContain("content: '/'");
    });
  });

  describe('generateDividerCSS', () => {
    const dividerStyles = [
      'solid-thin',
      'solid-thick',
      'organic-wave',
      'textured-line',
      'thin-geometric',
      'zigzag-wave',
      'slash-raw',
      'none',
    ];

    for (const style of dividerStyles) {
      it(`should generate valid CSS for "${style}" divider`, () => {
        const css = generateDividerCSS(style);
        expect(css).toContain(`/* Divider: ${style} */`);
        expect(css).toContain(`.layout-divider--${style}`);
        expect(css).toContain('{');
        expect(css).toContain('}');
      });
    }

    it('should fall back to solid-thin for unknown style', () => {
      const css = generateDividerCSS('unknown');
      expect(css).toContain('solid-thin');
    });

    it('should use clip-path for organic-wave', () => {
      const css = generateDividerCSS('organic-wave');
      expect(css).toContain('clip-path');
    });

    it('should use repeating-linear-gradient for textured-line', () => {
      const css = generateDividerCSS('textured-line');
      expect(css).toContain('repeating-linear-gradient');
    });

    it('should have height: 0 for none', () => {
      const css = generateDividerCSS('none');
      expect(css).toContain('height: 0');
    });
  });

  describe('generateAnimationCSS', () => {
    const entranceTypes = [
      'none',
      'fade-up',
      'slide-in',
      'scroll-reveal',
      'bounce-in',
      'cut-in',
    ];

    for (const entrance of entranceTypes) {
      it(`should generate valid CSS for "${entrance}" animation`, () => {
        const css = generateAnimationCSS(entrance);
        expect(css).toContain(`/* Animation: ${entrance} */`);
        expect(css).toContain(`.layout-animate--${entrance}`);
        if (entrance !== 'none') {
          expect(css).toContain('@keyframes');
          expect(css).toContain('var(--layout-animation-duration');
        }
      });
    }

    it('should fall back to none for unknown entrance', () => {
      const css = generateAnimationCSS('unknown');
      expect(css).toContain('animation: none');
    });

    it('should include translateY for fade-up', () => {
      const css = generateAnimationCSS('fade-up');
      expect(css).toContain('translateY');
    });

    it('should include translateX for slide-in', () => {
      const css = generateAnimationCSS('slide-in');
      expect(css).toContain('translateX');
    });

    it('should include clip-path for cut-in', () => {
      const css = generateAnimationCSS('cut-in');
      expect(css).toContain('clip-path');
    });

    it('should include scale for bounce-in', () => {
      const css = generateAnimationCSS('bounce-in');
      expect(css).toContain('scale');
    });
  });

  describe('generateGridCSS', () => {
    const gridRhythms = [
      'centered-single',
      'strict-grid',
      'masonry-inspired',
      'editorial-wide',
      'broken-asymmetric',
      'single-column-stacked',
    ];

    for (const rhythm of gridRhythms) {
      it(`should generate valid CSS for "${rhythm}" grid`, () => {
        const css = generateGridCSS(rhythm);
        expect(css).toContain(`/* Grid: ${rhythm} */`);
        expect(css).toContain(`.layout-grid--${rhythm}`);
        expect(css).toContain('var(--layout-grid-max-width');
      });
    }

    it('should fall back to strict-grid for unknown rhythm', () => {
      const css = generateGridCSS('unknown');
      expect(css).toContain('strict-grid');
    });

    it('should use column-count for masonry-inspired', () => {
      const css = generateGridCSS('masonry-inspired');
      expect(css).toContain('column-count');
    });

    it('should use 12-col grid for strict-grid', () => {
      const css = generateGridCSS('strict-grid');
      expect(css).toContain('repeat(12, 1fr)');
    });

    it('should use flex-direction column for single-column-stacked', () => {
      const css = generateGridCSS('single-column-stacked');
      expect(css).toContain('flex-direction: column');
    });
  });

  describe('generateSectionBgCSS', () => {
    const backgrounds = [
      'flat-solid',
      'soft-fill',
      'layered-shadow',
      'full-bleed-image',
      'alternating-accent',
      'dark-mono',
    ];

    for (const bg of backgrounds) {
      it(`should generate valid CSS for "${bg}" background`, () => {
        const css = generateSectionBgCSS(bg);
        expect(css).toContain(`/* Section BG: ${bg} */`);
        expect(css).toContain(`.layout-section-bg--${bg}`);
      });
    }

    it('should fall back to flat-solid for unknown background', () => {
      const css = generateSectionBgCSS('unknown');
      expect(css).toContain('flat-solid');
    });

    it('should include dark colors for dark-mono', () => {
      const css = generateSectionBgCSS('dark-mono');
      expect(css).toContain('#1a1a2e');
      expect(css).toContain('color: #e0e0f0');
    });

    it('should include box-shadow for layered-shadow', () => {
      const css = generateSectionBgCSS('layered-shadow');
      expect(css).toContain('box-shadow');
    });

    it('should include nth-child for alternating-accent', () => {
      const css = generateSectionBgCSS('alternating-accent');
      expect(css).toContain('nth-child(even)');
    });
  });

  describe('generateResponsiveCSS', () => {
    it('should contain media queries for 375px, 768px, and 1440px', () => {
      const css = generateResponsiveCSS(DEFAULT_LAYOUT);
      expect(css).toContain('@media (max-width: 375px)');
      expect(css).toContain('@media (max-width: 768px)');
      expect(css).toContain('@media (min-width: 1440px)');
    });

    it('should collapse nav on mobile', () => {
      const css = generateResponsiveCSS(DEFAULT_LAYOUT);
      expect(css).toContain('flex-direction: column');
    });

    it('should reduce grid columns on tablet', () => {
      const css = generateResponsiveCSS(DEFAULT_LAYOUT);
      expect(css).toContain('repeat(4, 1fr)');
    });

    it('should use single column on mobile', () => {
      const css = generateResponsiveCSS(DEFAULT_LAYOUT);
      expect(css).toContain('grid-template-columns: 1fr');
    });

    it('should handle null layout', () => {
      const css = generateResponsiveCSS(null);
      expect(css).toContain('@media');
    });
  });

  describe('generateLayoutCSS', () => {
    it('should generate complete CSS for ethereal layout', () => {
      const etherealLayout = mergeWithDefaults({
        family: 'ethereal',
        navigation: { style: 'centered-top' },
        whitespace: { density: 'spacious', multiplier: 1.5, section_gap: '96px', content_padding: '80px' },
        corners: { radius_base: '24px', treatment: 'rounded' },
        dividers: { style: 'organic-wave' },
        grid: { rhythm: 'centered-single', max_width: '800px', columns: 1 },
        animation: { entrance: 'fade-up', duration: '300ms' },
        sections: { background: 'soft-fill', hero_height: '60vh' },
      });

      const css = generateLayoutCSS(etherealLayout);

      // Custom properties
      expect(css).toContain('--layout-corner-radius: 24px');
      expect(css).toContain('--layout-family: ethereal');

      // Navigation
      expect(css).toContain('layout-nav--centered-top');

      // Divider
      expect(css).toContain('layout-divider--organic-wave');

      // Animation
      expect(css).toContain('@keyframes layout-fade-up');

      // Grid
      expect(css).toContain('layout-grid--centered-single');

      // Section BG
      expect(css).toContain('layout-section-bg--soft-fill');

      // Responsive
      expect(css).toContain('@media');

      // Static-first: no runtime JS
      expect(css).not.toContain('document.');
      expect(css).not.toContain('window.');
      expect(css).not.toContain('addEventListener');
    });

    it('should generate complete CSS for bold-structured (default)', () => {
      const css = generateLayoutCSS(DEFAULT_LAYOUT);

      expect(css).toContain('--layout-corner-radius: 8px');
      expect(css).toContain('--layout-family: bold-structured');
      expect(css).toContain('layout-nav--sidebar-fixed');
      expect(css).toContain('layout-divider--solid-thin');
      expect(css).toContain('/* Animation: none */');
      expect(css).toContain('layout-grid--strict-grid');
      expect(css).toContain('layout-section-bg--flat-solid');
    });

    it('should handle null input with defaults', () => {
      const css = generateLayoutCSS(null);
      expect(css).toContain('--layout-corner-radius: 8px');
      expect(css).toContain('--layout-nav-style: sidebar-fixed');
    });

    it('should contain header comment', () => {
      const css = generateLayoutCSS(DEFAULT_LAYOUT);
      expect(css).toContain('/* Layout CSS');
    });

    it('should produce CSS with no runtime JavaScript', () => {
      const css = generateLayoutCSS(DEFAULT_LAYOUT);
      // CON-16: Static-first, zero runtime JS
      expect(css).not.toMatch(/\bfunction\b/);
      expect(css).not.toMatch(/\bvar\s+\w+\s*=/);
      expect(css).not.toMatch(/document\./);
      expect(css).not.toMatch(/window\./);
    });

    it('should use var() with fallbacks throughout', () => {
      const css = generateLayoutCSS(DEFAULT_LAYOUT);
      // Check that var() usage includes fallbacks
      const varMatches = css.match(/var\(--[^)]+\)/g) || [];
      // Most var() calls should include a fallback
      const withFallback = varMatches.filter(v => v.includes(','));
      expect(withFallback.length).toBeGreaterThan(0);
    });
  });
});
