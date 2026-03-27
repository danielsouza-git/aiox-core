import {
  extractEditorialStrategyPageData,
} from '../pages/editorial-strategy-page-data';
import {
  BRAND_BOOK_PAGES,
} from '../static-generator';

describe('extractEditorialStrategyPageData', () => {
  it('should return complete page data with all 4 sections', () => {
    const data = extractEditorialStrategyPageData();
    expect(data).toHaveProperty('visualSystem');
    expect(data).toHaveProperty('brandTraits');
    expect(data).toHaveProperty('audiencePersonas');
    expect(data).toHaveProperty('editorialStrategy');
  });

  // Visual System (AC 1)
  describe('visualSystem', () => {
    it('should have 4 editorial colors by default', () => {
      const data = extractEditorialStrategyPageData();
      expect(data.visualSystem.colors.length).toBe(4);
    });

    it('each color should have name, hex, role, and editorialUsage', () => {
      const data = extractEditorialStrategyPageData();
      for (const color of data.visualSystem.colors) {
        expect(color.name).toBeTruthy();
        expect(color.hex).toMatch(/^#[0-9A-Fa-f]{6}$/);
        expect(color.role).toBeTruthy();
        expect(color.editorialUsage).toBeTruthy();
      }
    });

    it('should have a description', () => {
      const data = extractEditorialStrategyPageData();
      expect(data.visualSystem.description).toBeTruthy();
    });

    it('should use custom colors from brand profile', () => {
      const data = extractEditorialStrategyPageData({
        colors: {
          primary: { name: 'Kinetic Limon', hex: '#D1FF00' },
          background: { name: 'Void Dark', hex: '#050505' },
          surface: { name: 'Obsidian', hex: '#0F0F11' },
          text: { name: 'Cream', hex: '#F5F4E7' },
        },
      });
      expect(data.visualSystem.colors.length).toBe(4);
      expect(data.visualSystem.colors[0].name).toBe('Kinetic Limon');
      expect(data.visualSystem.colors[0].hex).toBe('#D1FF00');
    });

    it('should include editorial usage context for custom colors', () => {
      const data = extractEditorialStrategyPageData({
        colors: {
          primary: { name: 'Kinetic Limon', hex: '#D1FF00' },
        },
      });
      expect(data.visualSystem.colors[0].editorialUsage).toContain('Kinetic Limon');
    });

    it('should fall back to defaults when no colors provided', () => {
      const data = extractEditorialStrategyPageData({
        personality: { traits: ['Bold'] },
      });
      expect(data.visualSystem.colors.length).toBe(4);
      expect(data.visualSystem.colors[0].name).toBe('Primary Accent');
    });
  });

  // Brand Traits (AC 2)
  describe('brandTraits', () => {
    it('should have 6 traits by default', () => {
      const data = extractEditorialStrategyPageData();
      expect(data.brandTraits.traits.length).toBe(6);
    });

    it('each trait should have name, description, and icon', () => {
      const data = extractEditorialStrategyPageData();
      for (const trait of data.brandTraits.traits) {
        expect(trait.name).toBeTruthy();
        expect(trait.description).toBeTruthy();
        expect(trait.icon).toContain('<svg');
      }
    });

    it('should use custom traits from brand profile', () => {
      const data = extractEditorialStrategyPageData({
        personality: {
          traits: ['Bold', 'Innovative', 'Authentic'],
        },
      });
      expect(data.brandTraits.traits.length).toBe(3);
      expect(data.brandTraits.traits[0].name).toBe('Bold');
      expect(data.brandTraits.traits[1].name).toBe('Innovative');
      expect(data.brandTraits.traits[2].name).toBe('Authentic');
    });

    it('should limit to 6 traits even if profile has more', () => {
      const data = extractEditorialStrategyPageData({
        personality: {
          traits: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
        },
      });
      expect(data.brandTraits.traits.length).toBe(6);
    });

    it('should provide fallback icon for unrecognized traits', () => {
      const data = extractEditorialStrategyPageData({
        personality: {
          traits: ['CustomTrait'],
        },
      });
      expect(data.brandTraits.traits[0].icon).toContain('<svg');
    });

    it('should provide fallback description for unrecognized traits', () => {
      const data = extractEditorialStrategyPageData({
        personality: {
          traits: ['CustomTrait'],
        },
      });
      expect(data.brandTraits.traits[0].description).toContain('CustomTrait');
    });

    it('should match known trait descriptions for recognized traits', () => {
      const data = extractEditorialStrategyPageData({
        personality: {
          traits: ['Empowering'],
        },
      });
      expect(data.brandTraits.traits[0].description).toContain('creators');
    });
  });

  // Audience Personas (AC 3)
  describe('audiencePersonas', () => {
    it('should have 3 default personas', () => {
      const data = extractEditorialStrategyPageData();
      expect(data.audiencePersonas.personas.length).toBe(3);
    });

    it('each persona should have title and description', () => {
      const data = extractEditorialStrategyPageData();
      for (const persona of data.audiencePersonas.personas) {
        expect(persona.title).toBeTruthy();
        expect(persona.description).toBeTruthy();
      }
    });

    it('default personas should have characteristics', () => {
      const data = extractEditorialStrategyPageData();
      for (const persona of data.audiencePersonas.personas) {
        expect(persona.characteristics.length).toBeGreaterThan(0);
      }
    });

    it('should show fallback message when using defaults', () => {
      const data = extractEditorialStrategyPageData();
      expect(data.audiencePersonas.fallbackMessage).toBeTruthy();
      expect(data.audiencePersonas.fallbackMessage).toContain('illustrative');
    });

    it('should use custom personas from brand profile', () => {
      const data = extractEditorialStrategyPageData({
        audience: {
          personas: [
            {
              title: 'The Executive',
              description: 'C-suite decision makers looking for ROI.',
              characteristics: ['Budget authority', 'Time-constrained'],
            },
            {
              title: 'The Developer',
              description: 'Technical implementers who need documentation.',
            },
          ],
        },
      });
      expect(data.audiencePersonas.personas.length).toBe(2);
      expect(data.audiencePersonas.personas[0].title).toBe('The Executive');
      expect(data.audiencePersonas.personas[0].characteristics.length).toBe(2);
      expect(data.audiencePersonas.personas[1].characteristics.length).toBe(0);
    });

    it('should NOT show fallback message when custom personas provided', () => {
      const data = extractEditorialStrategyPageData({
        audience: {
          personas: [
            { title: 'Custom', description: 'Custom persona' },
          ],
        },
      });
      expect(data.audiencePersonas.fallbackMessage).toBeUndefined();
    });

    it('should handle empty personas array gracefully', () => {
      const data = extractEditorialStrategyPageData({
        audience: { personas: [] },
      });
      // Falls back to defaults when empty
      expect(data.audiencePersonas.personas.length).toBe(3);
      expect(data.audiencePersonas.fallbackMessage).toBeTruthy();
    });
  });

  // Editorial Strategy (AC 4)
  describe('editorialStrategy', () => {
    it('should have at least 2 paragraphs', () => {
      const data = extractEditorialStrategyPageData();
      expect(data.editorialStrategy.paragraphs.length).toBeGreaterThanOrEqual(2);
    });

    it('should have at least 3 principles', () => {
      const data = extractEditorialStrategyPageData();
      expect(data.editorialStrategy.principles.length).toBeGreaterThanOrEqual(3);
    });

    it('each paragraph should be substantive', () => {
      const data = extractEditorialStrategyPageData();
      for (const para of data.editorialStrategy.paragraphs) {
        expect(para.length).toBeGreaterThan(50);
      }
    });

    it('should use voice guide data when provided', () => {
      const data = extractEditorialStrategyPageData({
        voiceGuide: {
          philosophy: 'We believe in radical transparency.',
          tone: 'direct and empowering',
          principles: [
            'Be transparent.',
            'Write for the reader.',
            'Show, do not tell.',
          ],
        },
      });
      expect(data.editorialStrategy.paragraphs[0]).toContain('radical transparency');
      expect(data.editorialStrategy.principles[0]).toBe('Be transparent.');
    });

    it('should include manifesto narrative when provided', () => {
      const data = extractEditorialStrategyPageData({
        voiceGuide: {
          philosophy: 'Core philosophy.',
        },
        manifesto: {
          narrative: 'Our manifesto drives everything we create.',
        },
      });
      const allText = data.editorialStrategy.paragraphs.join(' ');
      expect(allText).toContain('manifesto drives');
    });

    it('should fall back to defaults when no voice guide', () => {
      const data = extractEditorialStrategyPageData({
        personality: { traits: ['Bold'] },
      });
      expect(data.editorialStrategy.paragraphs.length).toBe(3);
      expect(data.editorialStrategy.principles.length).toBe(5);
    });
  });

  // Full brand profile integration (AC 5)
  describe('brand profile integration', () => {
    it('should produce complete output with full profile', () => {
      const profile = {
        personality: { traits: ['Empowering', 'Direct', 'Clear', 'Bold', 'Passionate', 'Courageous'] },
        colors: {
          primary: { name: 'Kinetic Limon', hex: '#D1FF00' },
          background: { name: 'Void Dark', hex: '#050505' },
          surface: { name: 'Obsidian', hex: '#0F0F11' },
          text: { name: 'Cream', hex: '#F5F4E7' },
        },
        audience: {
          personas: [
            {
              title: 'The Legendary',
              subtitle: 'Late-career reinventors',
              description: 'Experienced professionals seeking new creation paths.',
              characteristics: ['Rich experience', 'Open to change'],
            },
          ],
        },
        voiceGuide: {
          tone: 'confident and direct',
          philosophy: 'Terminal-based workflows over visual complexity.',
          principles: ['Clarity over cleverness.', 'Substance over style.'],
        },
        manifesto: {
          narrative: 'The AI is not the hero. You are.',
        },
      };

      const data = extractEditorialStrategyPageData(profile);

      // All sections populated
      expect(data.visualSystem.colors[0].name).toBe('Kinetic Limon');
      expect(data.brandTraits.traits[0].name).toBe('Empowering');
      expect(data.audiencePersonas.personas[0].title).toBe('The Legendary');
      expect(data.audiencePersonas.fallbackMessage).toBeUndefined();
      expect(data.editorialStrategy.paragraphs[0]).toContain('Terminal-based');
      expect(data.editorialStrategy.principles[0]).toBe('Clarity over cleverness.');
    });
  });
});

describe('BRAND_BOOK_PAGES includes editorial-strategy', () => {
  it('should include editorial-strategy page entry', () => {
    const page = BRAND_BOOK_PAGES.find((p) => p.slug === 'editorial-strategy');
    expect(page).toBeDefined();
    expect(page!.title).toBe('Editorial Strategy');
    expect(page!.template).toBe('editorial-strategy');
  });
});
