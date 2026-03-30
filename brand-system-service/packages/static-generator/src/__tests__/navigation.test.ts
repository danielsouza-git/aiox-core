import {
  buildNavigationTree,
  getNavItems,
  findNavItem,
  findParentSection,
  isActiveSection,
  generateBreadcrumbs,
  getSectionIcon,
} from '../navigation/nav-tree';

describe('buildNavigationTree', () => {
  it('should return a non-empty array of sections', () => {
    const tree = buildNavigationTree();
    expect(Array.isArray(tree)).toBe(true);
    expect(tree.length).toBeGreaterThan(0);
  });

  it('should have required section properties', () => {
    const tree = buildNavigationTree();
    for (const section of tree) {
      expect(section.id).toBeTruthy();
      expect(section.title).toBeTruthy();
      expect(section.icon).toBeTruthy();
      expect(Array.isArray(section.children)).toBe(true);
      expect(section.children.length).toBeGreaterThan(0);
    }
  });

  it('should contain all six required sections', () => {
    const tree = buildNavigationTree();
    const sectionIds = tree.map((s) => s.id);
    expect(sectionIds).toContain('home');
    expect(sectionIds).toContain('guidelines');
    expect(sectionIds).toContain('foundations');
    expect(sectionIds).toContain('identity');
    expect(sectionIds).toContain('icons');
    expect(sectionIds).toContain('about');
  });

  it('should have children with required properties', () => {
    const tree = buildNavigationTree();
    for (const section of tree) {
      for (const child of section.children) {
        expect(child.slug).toBeTruthy();
        expect(child.title).toBeTruthy();
        expect(child.section).toBe(section.id);
        expect(child.path).toBeTruthy();
      }
    }
  });
});

describe('getNavItems', () => {
  it('should return a flat array of all nav items', () => {
    const items = getNavItems();
    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBeGreaterThan(0);
  });

  it('should contain all existing brand book page slugs', () => {
    const items = getNavItems();
    const slugs = items.map((i) => i.slug);
    const existingPages = [
      'index',
      'guidelines',
      'foundations',
      'logo',
      'colors',
      'typography',
      'icons',
      'components',
      'motion',
      'templates',
    ];
    for (const page of existingPages) {
      expect(slugs).toContain(page);
    }
  });

  it('should contain placeholder pages for upcoming Epic A pages', () => {
    const items = getNavItems();
    const placeholders = items.filter((i) => i.placeholder === true);
    expect(placeholders.length).toBeGreaterThan(0);

    // Remaining placeholder: manifesto only (moodboard and movement activated in Wave 2)
    const placeholderSlugs = placeholders.map((p) => p.slug);
    expect(placeholderSlugs).toContain('manifesto');
  });

  it('should not mark existing pages as placeholders', () => {
    const items = getNavItems();
    const existingSlugs = ['index', 'guidelines', 'foundations', 'logo', 'colors', 'typography', 'icons', 'components', 'motion', 'surfaces', 'semantic-tokens', 'templates', 'about'];

    for (const slug of existingSlugs) {
      const item = items.find((i) => i.slug === slug);
      expect(item).toBeDefined();
      expect(item!.placeholder).toBeFalsy();
    }
  });
});

describe('findNavItem', () => {
  it('should find an existing page by slug', () => {
    const item = findNavItem('colors');
    expect(item).toBeDefined();
    expect(item!.slug).toBe('colors');
    expect(item!.title).toBe('Colors');
    expect(item!.section).toBe('foundations');
  });

  it('should find the moodboard page by slug (activated in Wave 2)', () => {
    const item = findNavItem('moodboard');
    expect(item).toBeDefined();
    expect(item!.slug).toBe('moodboard');
    expect(item!.path).toBe('./moodboard.html');
    expect(item!.placeholder).toBeFalsy();
  });

  it('should return undefined for unknown slug', () => {
    const item = findNavItem('nonexistent');
    expect(item).toBeUndefined();
  });

  it('should find the index page', () => {
    const item = findNavItem('index');
    expect(item).toBeDefined();
    expect(item!.slug).toBe('index');
    expect(item!.section).toBe('home');
  });
});

describe('findParentSection', () => {
  it('should find parent section for a child page', () => {
    const section = findParentSection('colors');
    expect(section).toBeDefined();
    expect(section!.id).toBe('foundations');
  });

  it('should find home section for index', () => {
    const section = findParentSection('index');
    expect(section).toBeDefined();
    expect(section!.id).toBe('home');
  });

  it('should return undefined for unknown slug', () => {
    const section = findParentSection('nonexistent');
    expect(section).toBeUndefined();
  });

  it('should find identity section for logo', () => {
    const section = findParentSection('logo');
    expect(section).toBeDefined();
    expect(section!.id).toBe('identity');
  });
});

describe('isActiveSection', () => {
  it('should return true when section contains the current page', () => {
    expect(isActiveSection('foundations', 'colors')).toBe(true);
    expect(isActiveSection('foundations', 'typography')).toBe(true);
    expect(isActiveSection('home', 'index')).toBe(true);
    expect(isActiveSection('identity', 'logo')).toBe(true);
  });

  it('should return false when section does not contain the current page', () => {
    expect(isActiveSection('foundations', 'logo')).toBe(false);
    expect(isActiveSection('home', 'colors')).toBe(false);
    expect(isActiveSection('identity', 'typography')).toBe(false);
  });

  it('should return false for unknown section id', () => {
    expect(isActiveSection('nonexistent', 'colors')).toBe(false);
  });

  it('should work with placeholder pages', () => {
    expect(isActiveSection('guidelines', 'manifesto')).toBe(true);
    expect(isActiveSection('foundations', 'surfaces')).toBe(true);
  });
});

describe('generateBreadcrumbs', () => {
  it('should generate Home-only breadcrumb for index page', () => {
    const result = generateBreadcrumbs('index');
    expect(result.items).toHaveLength(1);
    expect(result.items[0].label).toBe('Home');
    expect(result.items[0].href).toBe('./index.html');
  });

  it('should generate Home > Section > Page for nested pages', () => {
    const result = generateBreadcrumbs('colors');
    expect(result.items).toHaveLength(3);
    expect(result.items[0].label).toBe('Home');
    expect(result.items[1].label).toBe('Foundations');
    expect(result.items[2].label).toBe('Colors');
    expect(result.items[2].href).toBe('');
  });

  it('should generate Home > Section > Page for identity pages', () => {
    const result = generateBreadcrumbs('logo');
    expect(result.items).toHaveLength(3);
    expect(result.items[0].label).toBe('Home');
    expect(result.items[1].label).toBe('Brand Identity');
    expect(result.items[2].label).toBe('Logo System');
  });

  it('should generate breadcrumbs for placeholder pages', () => {
    const result = generateBreadcrumbs('moodboard');
    expect(result.items).toHaveLength(3);
    expect(result.items[0].label).toBe('Home');
    expect(result.items[1].label).toBe('Brand Identity');
    expect(result.items[2].label).toBe('Moodboard');
  });

  it('should include valid JSON-LD BreadcrumbList', () => {
    const result = generateBreadcrumbs('colors');
    expect(result.jsonLd).toContain('application/ld+json');
    expect(result.jsonLd).toContain('BreadcrumbList');

    // Parse the JSON inside the script tag
    const jsonMatch = result.jsonLd.match(/<script[^>]*>(.*)<\/script>/);
    expect(jsonMatch).not.toBeNull();

    const jsonLd = JSON.parse(jsonMatch![1]);
    expect(jsonLd['@context']).toBe('https://schema.org');
    expect(jsonLd['@type']).toBe('BreadcrumbList');
    expect(jsonLd.itemListElement).toHaveLength(3);
    expect(jsonLd.itemListElement[0].position).toBe(1);
    expect(jsonLd.itemListElement[0].name).toBe('Home');
  });

  it('should generate breadcrumbs for guidelines section pages', () => {
    const result = generateBreadcrumbs('guidelines');
    expect(result.items).toHaveLength(3);
    expect(result.items[1].label).toBe('Guidelines');
    expect(result.items[2].label).toBe('Brand Voice');
  });

  it('should handle icons section correctly', () => {
    const result = generateBreadcrumbs('icons');
    expect(result.items).toHaveLength(3);
    expect(result.items[1].label).toBe('Icons');
    expect(result.items[2].label).toBe('Icon Library');
  });
});

describe('getSectionIcon', () => {
  it('should return SVG string for known sections', () => {
    const icon = getSectionIcon('home');
    expect(icon).toContain('<svg');
    expect(icon).toContain('</svg>');
  });

  it('should return SVG for all defined sections', () => {
    const sectionIds = ['home', 'guidelines', 'foundations', 'identity', 'icons', 'about'];
    for (const id of sectionIds) {
      const icon = getSectionIcon(id);
      expect(icon).toContain('<svg');
    }
  });

  it('should return empty string for unknown section', () => {
    const icon = getSectionIcon('nonexistent');
    expect(icon).toBe('');
  });
});

describe('backward compatibility', () => {
  it('should preserve all 10 existing brand book page slugs in the nav tree', () => {
    const existingPages = ['index', 'guidelines', 'foundations', 'logo', 'colors', 'typography', 'icons', 'components', 'motion', 'templates'];
    const allItems = getNavItems();
    const allSlugs = allItems.map((i) => i.slug);

    for (const slug of existingPages) {
      expect(allSlugs).toContain(slug);
    }
  });

  it('should have valid paths for all existing pages', () => {
    const existingPages = ['index', 'guidelines', 'foundations', 'logo', 'colors', 'typography', 'icons', 'components', 'motion', 'templates'];

    for (const slug of existingPages) {
      const item = findNavItem(slug);
      expect(item).toBeDefined();
      expect(item!.path).toBe(`./${slug}.html`);
      expect(item!.placeholder).toBeFalsy();
    }
  });

  it('should have placeholder paths as # for upcoming pages', () => {
    const placeholderSlugs = ['manifesto'];

    for (const slug of placeholderSlugs) {
      const item = findNavItem(slug);
      expect(item).toBeDefined();
      expect(item!.path).toBe('#');
      expect(item!.placeholder).toBe(true);
    }
  });

  it('should have valid paths for newly activated pages', () => {
    const activatedPages = ['surfaces', 'semantic-tokens', 'about', 'logo-usage', 'moodboard'];

    for (const slug of activatedPages) {
      const item = findNavItem(slug);
      expect(item).toBeDefined();
      expect(item!.path).toBe(`./${slug}.html`);
      expect(item!.placeholder).toBeFalsy();
    }
  });

  it('should have movement-strategy page with ./movement.html path', () => {
    const item = findNavItem('movement-strategy');
    expect(item).toBeDefined();
    expect(item!.path).toBe('./movement.html');
    expect(item!.placeholder).toBeFalsy();
  });
});
