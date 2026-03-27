import {
  extractIconSystemPageData,
} from '../pages/icon-system-page-data';
import {
  BRAND_BOOK_PAGES,
} from '../static-generator';

describe('extractIconSystemPageData', () => {
  it('should return default icon data when no brand config provided', () => {
    const data = extractIconSystemPageData();
    expect(data.gridSizes.length).toBe(4);
    expect(data.icons.length).toBe(20);
    expect(data.strokeRules).toBeTruthy();
    expect(data.colorVariants.length).toBe(6);
    expect(data.accessibilityGuidelines).toBeTruthy();
  });

  it('should return 4 grid sizes: 16, 24, 32, 48', () => {
    const data = extractIconSystemPageData();
    const sizes = data.gridSizes.map((g) => g.size);
    expect(sizes).toEqual([16, 24, 32, 48]);
  });

  it('should have icons with valid SVG strings', () => {
    const data = extractIconSystemPageData();
    for (const icon of data.icons) {
      expect(icon.name).toBeTruthy();
      expect(icon.svg).toContain('<svg');
      expect(icon.svg).toContain('currentColor');
    }
  });

  it('should have stroke rules with width, cap, and join', () => {
    const data = extractIconSystemPageData();
    expect(data.strokeRules.width).toBe('2px');
    expect(data.strokeRules.cap).toBe('round');
    expect(data.strokeRules.join).toBe('round');
  });

  it('should use brand primary color for first color variant when provided', () => {
    const data = extractIconSystemPageData({
      clientName: 'Test',
      primaryColor: '#ff0000',
      logoPath: 'logo.svg',
      tagline: '',
      websiteUrl: '',
      brandBookTitle: '',
    });
    expect(data.colorVariants[0].value).toBe('#ff0000');
    expect(data.colorVariants[0].name).toBe('Primary');
  });

  it('should fallback to default primary color when no brand config', () => {
    const data = extractIconSystemPageData();
    expect(data.colorVariants[0].value).toBe('#7631e5');
  });

  it('should have accessibility guidelines with min touch target', () => {
    const data = extractIconSystemPageData();
    expect(data.accessibilityGuidelines.minTouchTarget).toBe('44px');
    expect(data.accessibilityGuidelines.ariaLabel).toBe(true);
  });

  it('each icon should have a unique name', () => {
    const data = extractIconSystemPageData();
    const names = data.icons.map((i) => i.name);
    const uniqueNames = new Set(names);
    expect(uniqueNames.size).toBe(names.length);
  });

  it('each color variant should have name, cssVar, and value', () => {
    const data = extractIconSystemPageData();
    for (const cv of data.colorVariants) {
      expect(cv.name).toBeTruthy();
      expect(cv.cssVar).toContain('--');
      expect(cv.value).toBeTruthy();
    }
  });
});

describe('BRAND_BOOK_PAGES includes icons', () => {
  it('should include icons page entry', () => {
    const iconsPage = BRAND_BOOK_PAGES.find((p) => p.slug === 'icons');
    expect(iconsPage).toBeDefined();
    expect(iconsPage!.title).toBe('Icons');
    expect(iconsPage!.template).toBe('icons');
  });
});
