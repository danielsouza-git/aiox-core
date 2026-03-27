import {
  extractMoodboardPageData,
} from '../pages/moodboard-page-data';
import {
  BRAND_BOOK_PAGES,
} from '../static-generator';

describe('extractMoodboardPageData', () => {
  it('should return complete page data with defaults', () => {
    const data = extractMoodboardPageData();
    expect(data).toHaveProperty('categories');
    expect(data).toHaveProperty('designPrinciples');
    expect(Array.isArray(data.categories)).toBe(true);
    expect(Array.isArray(data.designPrinciples)).toBe(true);
  });

  it('should return 4 categories by default', () => {
    const data = extractMoodboardPageData();
    expect(data.categories.length).toBe(4);
  });

  it('each category should have name, description, and slots', () => {
    const data = extractMoodboardPageData();
    for (const cat of data.categories) {
      expect(cat.name).toBeTruthy();
      expect(cat.description).toBeTruthy();
      expect(cat.slots.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('each slot should have caption, cssPattern, and description', () => {
    const data = extractMoodboardPageData();
    for (const cat of data.categories) {
      for (const slot of cat.slots) {
        expect(slot.caption).toBeTruthy();
        expect(slot.cssPattern).toBeTruthy();
        expect(slot.description).toBeTruthy();
        expect(slot.categoryTag).toBeTruthy();
      }
    }
  });

  it('should derive industry-specific categories for technology', () => {
    const data = extractMoodboardPageData({
      industry: { category: 'technology' },
    });
    const names = data.categories.map((c) => c.name);
    expect(names).toContain('Web UI & Product');
    expect(names).toContain('Dashboard & Data');
  });

  it('should derive industry-specific categories for fashion', () => {
    const data = extractMoodboardPageData({
      industry: { category: 'fashion' },
    });
    const names = data.categories.map((c) => c.name);
    expect(names).toContain('Editorial & Campaign');
  });

  it('should use default categories for unknown industry', () => {
    const data = extractMoodboardPageData({
      industry: { category: 'unknown-industry' },
    });
    const names = data.categories.map((c) => c.name);
    expect(names).toContain('Visual Identity');
  });

  it('should return at least 4 design principles by default', () => {
    const data = extractMoodboardPageData();
    expect(data.designPrinciples.length).toBeGreaterThanOrEqual(4);
  });

  it('each design principle should have title, description, and swatch', () => {
    const data = extractMoodboardPageData();
    for (const dp of data.designPrinciples) {
      expect(dp.title).toBeTruthy();
      expect(dp.description).toBeTruthy();
      expect(dp.swatchColor).toBeTruthy();
      expect(dp.swatchPattern).toBeTruthy();
    }
  });

  it('should use provided primary color in design principles', () => {
    const data = extractMoodboardPageData(undefined, '#ff0000');
    const brandPrinciple = data.designPrinciples.find((dp) => dp.title === 'Brand-First Design');
    expect(brandPrinciple!.swatchColor).toBe('#ff0000');
  });

  it('should add dark-first principle when traits include bold', () => {
    const data = extractMoodboardPageData({
      personality: { traits: ['bold'] },
    });
    const darkFirst = data.designPrinciples.find((dp) => dp.title === 'Dark-First Aesthetic');
    expect(darkFirst).toBeDefined();
  });

  it('should use primary color in slot gradient patterns', () => {
    const data = extractMoodboardPageData(undefined, '#ff0000');
    const secondSlot = data.categories[0].slots[1];
    expect(secondSlot.cssPattern).toContain('#ff0000');
  });
});

describe('BRAND_BOOK_PAGES includes moodboard', () => {
  it('should include moodboard page entry', () => {
    const page = BRAND_BOOK_PAGES.find((p) => p.slug === 'moodboard');
    expect(page).toBeDefined();
    expect(page!.title).toBe('Moodboard');
    expect(page!.template).toBe('moodboard');
  });
});
