import {
  extractSeoDocumentationPageData,
} from '../pages/seo-documentation-page-data';
import {
  BRAND_BOOK_PAGES,
} from '../static-generator';

describe('extractSeoDocumentationPageData', () => {
  it('should return complete page data with all 5 sections', () => {
    const data = extractSeoDocumentationPageData();
    expect(data).toHaveProperty('metaTags');
    expect(data).toHaveProperty('openGraph');
    expect(data).toHaveProperty('twitterCard');
    expect(data).toHaveProperty('jsonLd');
    expect(data).toHaveProperty('imageSpecs');
  });

  // Meta Tags Guide
  describe('metaTags', () => {
    it('should have title, description, robots, canonical, and fullSnippet', () => {
      const data = extractSeoDocumentationPageData();
      expect(data.metaTags.title).toBeTruthy();
      expect(data.metaTags.description).toBeTruthy();
      expect(data.metaTags.robots).toBeTruthy();
      expect(data.metaTags.canonical).toBeTruthy();
      expect(data.metaTags.fullSnippet).toBeTruthy();
    });

    it('title tag should have max length of 60', () => {
      const data = extractSeoDocumentationPageData();
      expect(data.metaTags.title.maxLength).toBe(60);
    });

    it('description tag should have max length of 155', () => {
      const data = extractSeoDocumentationPageData();
      expect(data.metaTags.description.maxLength).toBe(155);
    });

    it('robots value should be "index, follow"', () => {
      const data = extractSeoDocumentationPageData();
      expect(data.metaTags.robots.value).toBe('index, follow');
    });

    it('each meta tag should have bestPractice', () => {
      const data = extractSeoDocumentationPageData();
      expect(data.metaTags.title.bestPractice).toBeTruthy();
      expect(data.metaTags.description.bestPractice).toBeTruthy();
      expect(data.metaTags.robots.bestPractice).toBeTruthy();
      expect(data.metaTags.canonical.bestPractice).toBeTruthy();
    });

    it('should auto-populate brand name in title value', () => {
      const data = extractSeoDocumentationPageData({
        brandName: 'Acme Corp',
        tagline: 'Building the future',
      });
      expect(data.metaTags.title.value).toContain('Acme Corp');
    });

    it('should auto-populate domain in canonical value', () => {
      const data = extractSeoDocumentationPageData({
        domain: 'acme.com',
      });
      expect(data.metaTags.canonical.value).toContain('acme.com');
    });

    it('fullSnippet should contain HTML-escaped tags', () => {
      const data = extractSeoDocumentationPageData();
      expect(data.metaTags.fullSnippet).toContain('&lt;title&gt;');
      expect(data.metaTags.fullSnippet).toContain('&lt;meta');
      expect(data.metaTags.fullSnippet).toContain('&lt;link');
    });
  });

  // Open Graph Guide
  describe('openGraph', () => {
    it('should have exactly 5 properties', () => {
      const data = extractSeoDocumentationPageData();
      expect(data.openGraph.properties.length).toBe(5);
    });

    it('should include all 5 essential OG properties', () => {
      const data = extractSeoDocumentationPageData();
      const names = data.openGraph.properties.map((p) => p.property);
      expect(names).toContain('og:title');
      expect(names).toContain('og:description');
      expect(names).toContain('og:type');
      expect(names).toContain('og:image');
      expect(names).toContain('og:url');
    });

    it('each OG property should have description and bestPractice', () => {
      const data = extractSeoDocumentationPageData();
      for (const prop of data.openGraph.properties) {
        expect(prop.description).toBeTruthy();
        expect(prop.bestPractice).toBeTruthy();
      }
    });

    it('og:image should recommend 1200x630', () => {
      const data = extractSeoDocumentationPageData();
      const ogImage = data.openGraph.properties.find((p) => p.property === 'og:image');
      expect(ogImage!.bestPractice).toContain('1200x630');
    });

    it('should auto-populate brand domain in og:url', () => {
      const data = extractSeoDocumentationPageData({
        domain: 'mybrand.io',
      });
      const ogUrl = data.openGraph.properties.find((p) => p.property === 'og:url');
      expect(ogUrl!.content).toContain('mybrand.io');
    });

    it('fullSnippet should contain escaped meta tags', () => {
      const data = extractSeoDocumentationPageData();
      expect(data.openGraph.fullSnippet).toContain('&lt;meta');
      expect(data.openGraph.fullSnippet).toContain('og:title');
    });
  });

  // Twitter/X Card Guide
  describe('twitterCard', () => {
    it('should have exactly 3 properties', () => {
      const data = extractSeoDocumentationPageData();
      expect(data.twitterCard.properties.length).toBe(3);
    });

    it('should include twitter:card, twitter:site, twitter:image', () => {
      const data = extractSeoDocumentationPageData();
      const names = data.twitterCard.properties.map((p) => p.name);
      expect(names).toContain('twitter:card');
      expect(names).toContain('twitter:site');
      expect(names).toContain('twitter:image');
    });

    it('twitter:card should default to summary_large_image', () => {
      const data = extractSeoDocumentationPageData();
      const card = data.twitterCard.properties.find((p) => p.name === 'twitter:card');
      expect(card!.content).toBe('summary_large_image');
    });

    it('should use provided Twitter handle', () => {
      const data = extractSeoDocumentationPageData({
        socialHandles: { twitter: '@mycompany' },
      });
      const site = data.twitterCard.properties.find((p) => p.name === 'twitter:site');
      expect(site!.content).toBe('@mycompany');
    });

    it('should add @ prefix if missing from handle', () => {
      const data = extractSeoDocumentationPageData({
        socialHandles: { twitter: 'mycompany' },
      });
      const site = data.twitterCard.properties.find((p) => p.name === 'twitter:site');
      expect(site!.content).toBe('@mycompany');
    });

    it('each Twitter property should have description and bestPractice', () => {
      const data = extractSeoDocumentationPageData();
      for (const prop of data.twitterCard.properties) {
        expect(prop.description).toBeTruthy();
        expect(prop.bestPractice).toBeTruthy();
      }
    });
  });

  // JSON-LD Schema Examples
  describe('jsonLd', () => {
    it('should have 3 schema examples', () => {
      const data = extractSeoDocumentationPageData();
      expect(data.jsonLd.schemas.length).toBe(3);
    });

    it('should include Organization, Article, and Product schemas', () => {
      const data = extractSeoDocumentationPageData();
      const types = data.jsonLd.schemas.map((s) => s.schemaType);
      expect(types).toContain('Organization');
      expect(types).toContain('Article');
      expect(types).toContain('Product');
    });

    it('each schema should have schemaType, description, snippet, and useCase', () => {
      const data = extractSeoDocumentationPageData();
      for (const schema of data.jsonLd.schemas) {
        expect(schema.schemaType).toBeTruthy();
        expect(schema.description).toBeTruthy();
        expect(schema.snippet).toBeTruthy();
        expect(schema.useCase).toBeTruthy();
      }
    });

    it('Organization schema should contain brand name', () => {
      const data = extractSeoDocumentationPageData({
        brandName: 'TestBrand',
      });
      const org = data.jsonLd.schemas.find((s) => s.schemaType === 'Organization');
      expect(org!.snippet).toContain('TestBrand');
    });

    it('Organization schema should include social profiles', () => {
      const data = extractSeoDocumentationPageData({
        socialHandles: {
          twitter: 'myco',
          linkedin: 'myco',
        },
      });
      const org = data.jsonLd.schemas.find((s) => s.schemaType === 'Organization');
      expect(org!.snippet).toContain('twitter.com/myco');
      expect(org!.snippet).toContain('linkedin.com/company/myco');
    });

    it('each schema snippet should be valid JSON', () => {
      const data = extractSeoDocumentationPageData();
      for (const schema of data.jsonLd.schemas) {
        expect(() => JSON.parse(schema.snippet)).not.toThrow();
      }
    });

    it('Organization schema should include logo URL from brand profile', () => {
      const data = extractSeoDocumentationPageData({
        logoUrl: 'https://mybrand.com/logo.svg',
      });
      const org = data.jsonLd.schemas.find((s) => s.schemaType === 'Organization');
      expect(org!.snippet).toContain('https://mybrand.com/logo.svg');
    });
  });

  // Image Specifications
  describe('imageSpecs', () => {
    it('should have at least 4 image specs', () => {
      const data = extractSeoDocumentationPageData();
      expect(data.imageSpecs.specs.length).toBeGreaterThanOrEqual(4);
    });

    it('should include OG and Twitter image specs', () => {
      const data = extractSeoDocumentationPageData();
      const platforms = data.imageSpecs.specs.map((s) => s.platform);
      expect(platforms).toContain('Open Graph');
      expect(platforms).toContain('Twitter/X Card');
    });

    it('OG image should be 1200x630', () => {
      const data = extractSeoDocumentationPageData();
      const og = data.imageSpecs.specs.find((s) => s.platform === 'Open Graph');
      expect(og!.width).toBe(1200);
      expect(og!.height).toBe(630);
      expect(og!.aspectRatio).toBe('1.91:1');
    });

    it('Twitter image should be 1200x600', () => {
      const data = extractSeoDocumentationPageData();
      const tw = data.imageSpecs.specs.find((s) => s.platform === 'Twitter/X Card');
      expect(tw!.width).toBe(1200);
      expect(tw!.height).toBe(600);
      expect(tw!.aspectRatio).toBe('2:1');
    });

    it('each spec should have all required fields', () => {
      const data = extractSeoDocumentationPageData();
      for (const spec of data.imageSpecs.specs) {
        expect(spec.platform).toBeTruthy();
        expect(spec.width).toBeGreaterThan(0);
        expect(spec.height).toBeGreaterThan(0);
        expect(spec.aspectRatio).toBeTruthy();
        expect(spec.format).toBeTruthy();
        expect(spec.maxFileSize).toBeTruthy();
        expect(spec.notes).toBeTruthy();
      }
    });
  });

  // Brand Profile Integration (AC 5)
  describe('brand profile integration', () => {
    it('should use default values when no profile provided', () => {
      const data = extractSeoDocumentationPageData();
      expect(data.metaTags.title.value).toContain('Brand Name');
      expect(data.metaTags.canonical.value).toContain('example.com');
    });

    it('should auto-populate all sections with brand data', () => {
      const profile = {
        brandName: 'Acme Corp',
        domain: 'acme.com',
        tagline: 'Building better tools',
        logoUrl: 'https://acme.com/logo.svg',
        socialHandles: {
          twitter: '@acmecorp',
          linkedin: 'acme-corp',
          instagram: 'acmecorp',
        },
      };
      const data = extractSeoDocumentationPageData(profile);

      // Meta tags populated
      expect(data.metaTags.title.value).toContain('Acme Corp');
      expect(data.metaTags.canonical.value).toContain('acme.com');

      // OG populated
      const ogUrl = data.openGraph.properties.find((p) => p.property === 'og:url');
      expect(ogUrl!.content).toContain('acme.com');

      // Twitter populated
      const twitterSite = data.twitterCard.properties.find((p) => p.name === 'twitter:site');
      expect(twitterSite!.content).toBe('@acmecorp');

      // JSON-LD populated
      const org = data.jsonLd.schemas.find((s) => s.schemaType === 'Organization');
      expect(org!.snippet).toContain('Acme Corp');
      expect(org!.snippet).toContain('acme.com');
      expect(org!.snippet).toContain('https://acme.com/logo.svg');
      expect(org!.snippet).toContain('twitter.com/acmecorp');
      expect(org!.snippet).toContain('linkedin.com/company/acme-corp');
      expect(org!.snippet).toContain('instagram.com/acmecorp');
    });
  });
});

describe('BRAND_BOOK_PAGES includes seo-documentation', () => {
  it('should include seo-documentation page entry', () => {
    const page = BRAND_BOOK_PAGES.find((p) => p.slug === 'seo-documentation');
    expect(page).toBeDefined();
    expect(page!.title).toBe('SEO Documentation');
    expect(page!.template).toBe('seo-documentation');
  });
});
