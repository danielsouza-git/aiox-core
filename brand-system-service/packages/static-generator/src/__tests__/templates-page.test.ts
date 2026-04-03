import {
  extractTemplatesPageData,
} from '../pages/templates-page-data';
import {
  BRAND_BOOK_PAGES,
} from '../static-generator';
import {
  buildNavigationTree,
  findNavItem,
} from '../navigation/nav-tree';

describe('extractTemplatesPageData', () => {
  let data;

  beforeAll(() => {
    data = extractTemplatesPageData();
  });

  it('should return complete page data with introText and templates array', () => {
    expect(data).toHaveProperty('introText');
    expect(data).toHaveProperty('templates');
    expect(typeof data.introText).toBe('string');
    expect(Array.isArray(data.templates)).toBe(true);
  });

  it('should have an intro text that is non-empty', () => {
    expect(data.introText.length).toBeGreaterThan(10);
  });

  it('should return exactly 3 templates', () => {
    expect(data.templates).toHaveLength(3);
  });

  it('should have templates in the expected order: page-shell, dashboard-grid, content-grid', () => {
    expect(data.templates[0].id).toBe('page-shell');
    expect(data.templates[1].id).toBe('dashboard-grid');
    expect(data.templates[2].id).toBe('content-grid');
  });
});

describe('Template structure validation', () => {
  let templates;

  beforeAll(() => {
    templates = extractTemplatesPageData().templates;
  });

  it.each([0, 1, 2])('template[%i] should have all required fields', (index) => {
    const tmpl = templates[index];
    expect(tmpl.id).toBeTruthy();
    expect(tmpl.name).toBeTruthy();
    expect(tmpl.description).toBeTruthy();
    expect(Array.isArray(tmpl.features)).toBe(true);
    expect(tmpl.features.length).toBeGreaterThan(0);
    expect(tmpl.previewHtml).toBeTruthy();
    expect(tmpl.codeSnippet).toBeTruthy();
    expect(tmpl.cssSnippet).toBeTruthy();
  });

  it.each([0, 1, 2])('template[%i] features should all be non-empty strings', (index) => {
    const tmpl = templates[index];
    for (const feature of tmpl.features) {
      expect(typeof feature).toBe('string');
      expect(feature.length).toBeGreaterThan(0);
    }
  });

  it.each([0, 1, 2])('template[%i] previewHtml should contain valid HTML elements', (index) => {
    const tmpl = templates[index];
    expect(tmpl.previewHtml).toContain('<div');
    expect(tmpl.previewHtml).toContain('</div>');
  });

  it.each([0, 1, 2])('template[%i] codeSnippet should contain HTML structure', (index) => {
    const tmpl = templates[index];
    expect(tmpl.codeSnippet).toContain('<');
    expect(tmpl.codeSnippet).toContain('>');
  });

  it.each([0, 1, 2])('template[%i] cssSnippet should contain CSS declarations', (index) => {
    const tmpl = templates[index];
    expect(tmpl.cssSnippet).toContain('{');
    expect(tmpl.cssSnippet).toContain('}');
    expect(tmpl.cssSnippet).toContain(':');
  });
});

describe('Page Shell template', () => {
  let pageShell;

  beforeAll(() => {
    pageShell = extractTemplatesPageData().templates[0];
  });

  it('should have id "page-shell"', () => {
    expect(pageShell.id).toBe('page-shell');
  });

  it('should have name "Page Shell"', () => {
    expect(pageShell.name).toBe('Page Shell');
  });

  it('should describe sticky navigation in features', () => {
    expect(pageShell.features.some((f) => f.toLowerCase().includes('sticky'))).toBe(true);
  });

  it('should describe section dividers in features', () => {
    expect(pageShell.features.some((f) => f.toLowerCase().includes('divider'))).toBe(true);
  });

  it('should describe footer in features', () => {
    expect(pageShell.features.some((f) => f.toLowerCase().includes('footer'))).toBe(true);
  });

  it('should describe responsive behavior at 768px', () => {
    expect(pageShell.features.some((f) => f.includes('768px'))).toBe(true);
  });

  it('previewHtml should show a navigation bar with sticky positioning', () => {
    expect(pageShell.previewHtml).toContain('sticky');
  });

  it('previewHtml should show footer element', () => {
    expect(pageShell.previewHtml.toLowerCase()).toContain('footer');
  });

  it('cssSnippet should contain position: sticky rule', () => {
    expect(pageShell.cssSnippet).toContain('position: sticky');
  });

  it('cssSnippet should contain responsive media query', () => {
    expect(pageShell.cssSnippet).toContain('@media (max-width: 768px)');
  });

  it('codeSnippet should use BEM-style class naming', () => {
    expect(pageShell.codeSnippet).toContain('page-shell__');
  });
});

describe('Dashboard Grid template', () => {
  let dashGrid;

  beforeAll(() => {
    dashGrid = extractTemplatesPageData().templates[1];
  });

  it('should have id "dashboard-grid"', () => {
    expect(dashGrid.id).toBe('dashboard-grid');
  });

  it('should have name "Dashboard Grid"', () => {
    expect(dashGrid.name).toBe('Dashboard Grid');
  });

  it('should describe 4-column grid in features', () => {
    expect(dashGrid.features.some((f) => f.includes('4-column') || f.includes('4 column'))).toBe(true);
  });

  it('should describe bento-style or asymmetric layout', () => {
    expect(
      dashGrid.description.toLowerCase().includes('bento') ||
      dashGrid.description.toLowerCase().includes('asymmetric'),
    ).toBe(true);
  });

  it('should describe variable card spans in features', () => {
    expect(dashGrid.features.some((f) => f.toLowerCase().includes('span'))).toBe(true);
  });

  it('cssSnippet should use grid-template-columns with repeat(4)', () => {
    expect(dashGrid.cssSnippet).toContain('repeat(4, 1fr)');
  });

  it('cssSnippet should include featured card spanning 2 columns', () => {
    expect(dashGrid.cssSnippet).toContain('grid-column: span 2');
  });

  it('cssSnippet should contain responsive media query', () => {
    expect(dashGrid.cssSnippet).toContain('@media (max-width: 768px)');
  });

  it('previewHtml should show grid layout with multiple cards', () => {
    expect(dashGrid.previewHtml).toContain('grid-template-columns');
  });

  it('codeSnippet should use BEM-style class naming', () => {
    expect(dashGrid.codeSnippet).toContain('dashboard-grid__');
  });
});

describe('Content Grid template', () => {
  let contentGrid;

  beforeAll(() => {
    contentGrid = extractTemplatesPageData().templates[2];
  });

  it('should have id "content-grid"', () => {
    expect(contentGrid.id).toBe('content-grid');
  });

  it('should have name "Content Grid"', () => {
    expect(contentGrid.name).toBe('Content Grid');
  });

  it('should describe auto-fit minmax(340px, 1fr) in features', () => {
    expect(contentGrid.features.some((f) => f.includes('minmax(340px'))).toBe(true);
  });

  it('should describe responsive behavior without breakpoints', () => {
    expect(contentGrid.features.some((f) => f.toLowerCase().includes('responsive') || f.toLowerCase().includes('auto-fit'))).toBe(true);
  });

  it('cssSnippet should use auto-fit with minmax', () => {
    expect(contentGrid.cssSnippet).toContain('repeat(auto-fit, minmax(340px, 1fr))');
  });

  it('previewHtml should show a grid with card elements', () => {
    expect(contentGrid.previewHtml).toContain('grid-template-columns');
  });

  it('previewHtml should include card content with title and description', () => {
    expect(contentGrid.previewHtml).toContain('Card Title');
  });

  it('codeSnippet should use BEM-style class naming', () => {
    expect(contentGrid.codeSnippet).toContain('content-grid__');
  });

  it('cssSnippet should include hover effect', () => {
    expect(contentGrid.cssSnippet).toContain(':hover');
  });
});

describe('BRAND_BOOK_PAGES integration', () => {
  it('should include templates page in BRAND_BOOK_PAGES', () => {
    const templatesPage = BRAND_BOOK_PAGES.find((p) => p.slug === 'templates');
    expect(templatesPage).toBeDefined();
  });

  it('should have correct slug, title, and template fields', () => {
    const templatesPage = BRAND_BOOK_PAGES.find((p) => p.slug === 'templates');
    expect(templatesPage.slug).toBe('templates');
    expect(templatesPage.title).toBe('Templates');
    expect(templatesPage.template).toBe('templates');
  });
});

describe('Navigation integration', () => {
  it('should include templates in the navigation tree', () => {
    const navItem = findNavItem('templates');
    expect(navItem).toBeDefined();
  });

  it('should have correct title in navigation', () => {
    const navItem = findNavItem('templates');
    expect(navItem.title).toBe('Templates');
  });

  it('should have correct path in navigation', () => {
    const navItem = findNavItem('templates');
    expect(navItem.path).toBe('./templates.html');
  });

  it('should be in the Foundations section', () => {
    const tree = buildNavigationTree();
    const foundationsSection = tree.find((s) => s.id === 'foundations');
    expect(foundationsSection).toBeDefined();
    const templatesItem = foundationsSection.children.find((c) => c.slug === 'templates');
    expect(templatesItem).toBeDefined();
  });

  it('should not be marked as a placeholder', () => {
    const navItem = findNavItem('templates');
    expect(navItem.placeholder).toBeFalsy();
  });
});

describe('CSS generation', () => {
  it('should have template previews using inline styles for self-containment', () => {
    const data = extractTemplatesPageData();
    for (const tmpl of data.templates) {
      expect(tmpl.previewHtml).toContain('style=');
    }
  });
});

describe('Search index integration', () => {
  it('templates page slug should be findable in BRAND_BOOK_PAGES for search indexing', () => {
    const found = BRAND_BOOK_PAGES.find((p) => p.slug === 'templates');
    expect(found).toBeDefined();
    expect(found.title).toBe('Templates');
  });
});

describe('Deterministic output', () => {
  it('should return identical data on multiple calls', () => {
    const first = extractTemplatesPageData();
    const second = extractTemplatesPageData();
    expect(JSON.stringify(first)).toBe(JSON.stringify(second));
  });
});

describe('Code snippet quality', () => {
  let templates;

  beforeAll(() => {
    templates = extractTemplatesPageData().templates;
  });

  it.each([0, 1, 2])('template[%i] HTML snippet should be properly indented', (index) => {
    const snippet = templates[index].codeSnippet;
    // Should have multi-line content
    expect(snippet.split('\n').length).toBeGreaterThan(3);
  });

  it.each([0, 1, 2])('template[%i] CSS snippet should contain var() references for brand tokens', (index) => {
    const css = templates[index].cssSnippet;
    expect(css).toContain('var(--');
  });

  it.each([0, 1, 2])('template[%i] description should be non-trivial (>50 chars)', (index) => {
    expect(templates[index].description.length).toBeGreaterThan(50);
  });
});
