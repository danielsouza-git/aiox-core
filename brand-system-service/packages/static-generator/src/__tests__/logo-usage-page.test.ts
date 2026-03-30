import {
  extractLogoUsagePageData,
} from '../pages/logo-usage-page-data';
import {
  BRAND_BOOK_PAGES,
} from '../static-generator';

const TEST_BRAND_CONFIG = {
  clientName: 'TestBrand',
  primaryColor: '#7631e5',
  logoPath: 'logo.svg',
};

describe('extractLogoUsagePageData', () => {
  it('should return complete page data structure', () => {
    const data = extractLogoUsagePageData(TEST_BRAND_CONFIG);
    expect(data).toHaveProperty('clearSpace');
    expect(data).toHaveProperty('dos');
    expect(data).toHaveProperty('donts');
    expect(data).toHaveProperty('colorContexts');
    expect(data).toHaveProperty('fileFormats');
    expect(data).toHaveProperty('minimumSize');
  });

  it('should have clear space with X-unit system', () => {
    const data = extractLogoUsagePageData(TEST_BRAND_CONFIG);
    expect(data.clearSpace.unitName).toBe('X');
    expect(data.clearSpace.minMultiplier).toBe(1.5);
    expect(data.clearSpace.description).toBeTruthy();
  });

  it('should have 5 approved usage examples', () => {
    const data = extractLogoUsagePageData(TEST_BRAND_CONFIG);
    expect(data.dos.length).toBe(5);
    for (const d of data.dos) {
      expect(d.label).toBeTruthy();
      expect(d.description).toBeTruthy();
      expect(d.bgColor).toBeTruthy();
      expect(d.textColor).toBeTruthy();
    }
  });

  it('should have 7 incorrect usage examples', () => {
    const data = extractLogoUsagePageData(TEST_BRAND_CONFIG);
    expect(data.donts.length).toBe(7);
    for (const d of data.donts) {
      expect(d.label).toBeTruthy();
      expect(d.description).toBeTruthy();
      expect(d.cssTransform).toBeTruthy();
    }
  });

  it('should have 5 color contexts with brand color', () => {
    const data = extractLogoUsagePageData(TEST_BRAND_CONFIG);
    expect(data.colorContexts.length).toBe(5);

    const brandContext = data.colorContexts.find((c) => c.name === 'On Brand');
    expect(brandContext).toBeDefined();
    expect(brandContext!.bgColor).toBe('#7631e5');
  });

  it('should have 4 file format entries', () => {
    const data = extractLogoUsagePageData(TEST_BRAND_CONFIG);
    expect(data.fileFormats.length).toBe(4);

    const svgFormat = data.fileFormats.find((f) => f.format === 'SVG');
    expect(svgFormat).toBeDefined();
    expect(svgFormat!.extension).toBe('.svg');
  });

  it('should have minimum size for digital and print', () => {
    const data = extractLogoUsagePageData(TEST_BRAND_CONFIG);
    expect(data.minimumSize.digital).toBe('32px height');
    expect(data.minimumSize.print).toBe('10mm height');
  });

  it('should adapt color contexts to different primary colors', () => {
    const data = extractLogoUsagePageData({
      clientName: 'RedBrand',
      primaryColor: '#ff0000',
      logoPath: 'logo.svg',
    });
    const brandContext = data.colorContexts.find((c) => c.name === 'On Brand');
    expect(brandContext!.bgColor).toBe('#ff0000');
  });
});

describe('BRAND_BOOK_PAGES includes logo-usage', () => {
  it('should include logo-usage page entry', () => {
    const page = BRAND_BOOK_PAGES.find((p) => p.slug === 'logo-usage');
    expect(page).toBeDefined();
    expect(page!.title).toBe('Logo Usage Rules');
    expect(page!.template).toBe('logo-usage');
  });
});
