/**
 * Navigation tree for the brand book sidebar.
 *
 * Provides hierarchical navigation structure with collapsible sections,
 * breadcrumb generation, and backward compatibility with the flat
 * BRAND_BOOK_PAGES array.
 *
 * @module navigation/nav-tree
 */

/**
 * Top-level navigation section with collapsible children.
 */
export interface NavSection {
  readonly id: string;
  readonly title: string;
  readonly icon: string;
  readonly children: NavItem[];
}

/**
 * Individual navigation item within a section.
 */
export interface NavItem {
  readonly slug: string;
  readonly title: string;
  readonly section: string;
  readonly path: string;
  readonly placeholder?: boolean;
}

/**
 * Single breadcrumb entry.
 */
export interface Breadcrumb {
  readonly label: string;
  readonly href: string;
}

/**
 * Breadcrumb result including items and JSON-LD structured data.
 */
export interface BreadcrumbResult {
  readonly items: Breadcrumb[];
  readonly jsonLd: string;
}

/**
 * SVG icon definitions for each navigation section.
 * Minimal inline SVGs for zero-dependency rendering.
 */
const SECTION_ICONS: Record<string, string> = {
  home: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  guidelines: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
  foundations: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
  identity: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  icons: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
  about: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
};

/**
 * The canonical navigation tree for the brand book.
 *
 * Maps existing pages by their current slugs and adds placeholder
 * entries for pages coming in Epic A (BSS-A.9 through BSS-A.14).
 */
const NAVIGATION_TREE: NavSection[] = [
  {
    id: 'home',
    title: 'Home',
    icon: SECTION_ICONS.home,
    children: [
      { slug: 'index', title: 'Overview', section: 'home', path: './index.html' },
    ],
  },
  {
    id: 'guidelines',
    title: 'Guidelines',
    icon: SECTION_ICONS.guidelines,
    children: [
      { slug: 'guidelines', title: 'Brand Voice', section: 'guidelines', path: './guidelines.html' },
      { slug: 'manifesto', title: 'Manifesto', section: 'guidelines', path: '#', placeholder: true },
    ],
  },
  {
    id: 'foundations',
    title: 'Foundations',
    icon: SECTION_ICONS.foundations,
    children: [
      { slug: 'foundations', title: 'Overview', section: 'foundations', path: './foundations.html' },
      { slug: 'colors', title: 'Colors', section: 'foundations', path: './colors.html' },
      { slug: 'typography', title: 'Typography', section: 'foundations', path: './typography.html' },
      { slug: 'components', title: 'Components', section: 'foundations', path: './components.html' },
      { slug: 'motion', title: 'Motion', section: 'foundations', path: './motion.html' },
      { slug: 'templates', title: 'Templates', section: 'foundations', path: './templates.html' },
      { slug: 'surfaces', title: 'Surfaces & Borders', section: 'foundations', path: './surfaces.html' },
      { slug: 'semantic-tokens', title: 'Semantic Tokens', section: 'foundations', path: './semantic-tokens.html' },
    ],
  },
  {
    id: 'identity',
    title: 'Brand Identity',
    icon: SECTION_ICONS.identity,
    children: [
      { slug: 'logo', title: 'Logo System', section: 'identity', path: './logo.html' },
      { slug: 'logo-usage', title: 'Logo Usage Rules', section: 'identity', path: './logo-usage.html' },
      { slug: 'moodboard', title: 'Moodboard', section: 'identity', path: '#', placeholder: true },
      { slug: 'movement-strategy', title: 'Movement & Strategy', section: 'identity', path: '#', placeholder: true },
    ],
  },
  {
    id: 'icons',
    title: 'Icons',
    icon: SECTION_ICONS.icons,
    children: [
      { slug: 'icons', title: 'Icon Library', section: 'icons', path: './icons.html' },
    ],
  },
  {
    id: 'about',
    title: 'About',
    icon: SECTION_ICONS.about,
    children: [
      { slug: 'about', title: 'About', section: 'about', path: './about.html' },
    ],
  },
];

/**
 * Build and return the navigation tree.
 *
 * @returns The hierarchical navigation tree
 */
export function buildNavigationTree(): NavSection[] {
  return NAVIGATION_TREE;
}

/**
 * Flatten the navigation tree into a simple list of nav items.
 * Useful for backward compatibility with BRAND_BOOK_PAGES.
 *
 * @returns Flat array of all navigation items
 */
export function getNavItems(): NavItem[] {
  const items: NavItem[] = [];
  for (const section of NAVIGATION_TREE) {
    for (const child of section.children) {
      items.push(child);
    }
  }
  return items;
}

/**
 * Find a navigation item by its slug.
 *
 * @param slug - Page slug to find
 * @returns The matching nav item, or undefined
 */
export function findNavItem(slug: string): NavItem | undefined {
  for (const section of NAVIGATION_TREE) {
    const item = section.children.find((c) => c.slug === slug);
    if (item) return item;
  }
  return undefined;
}

/**
 * Find the parent section that contains a given slug.
 *
 * @param slug - Page slug to search for
 * @returns The parent section, or undefined
 */
export function findParentSection(slug: string): NavSection | undefined {
  for (const section of NAVIGATION_TREE) {
    if (section.children.some((c) => c.slug === slug)) {
      return section;
    }
  }
  return undefined;
}

/**
 * Check whether a section contains the currently active page.
 *
 * @param sectionId - Section identifier
 * @param currentSlug - Current page slug
 * @returns True if the section contains the current page
 */
export function isActiveSection(sectionId: string, currentSlug: string): boolean {
  const section = NAVIGATION_TREE.find((s) => s.id === sectionId);
  if (!section) return false;
  return section.children.some((c) => c.slug === currentSlug);
}

/**
 * Generate breadcrumb trail for a given page slug.
 *
 * Produces: Home > Section > Page
 * The last item is the current page (no link).
 *
 * @param slug - Current page slug
 * @returns Breadcrumb result with items and JSON-LD
 */
export function generateBreadcrumbs(slug: string): BreadcrumbResult {
  const items: Breadcrumb[] = [
    { label: 'Home', href: './index.html' },
  ];

  const parentSection = findParentSection(slug);
  const navItem = findNavItem(slug);

  if (parentSection && parentSection.id !== 'home') {
    // Add section breadcrumb (links to the first non-placeholder child)
    const firstChild = parentSection.children.find((c) => !c.placeholder);
    const sectionHref = firstChild ? firstChild.path : '#';
    items.push({ label: parentSection.title, href: sectionHref });
  }

  if (navItem && slug !== 'index') {
    items.push({ label: navItem.title, href: '' });
  }

  const jsonLd = generateBreadcrumbJsonLd(items);

  return { items, jsonLd };
}

/**
 * Generate JSON-LD BreadcrumbList structured data.
 *
 * @param items - Breadcrumb trail items
 * @returns JSON-LD script string
 */
function generateBreadcrumbJsonLd(items: Breadcrumb[]): string {
  const listItems = items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.label,
    ...(item.href ? { item: item.href } : {}),
  }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: listItems,
  };

  return `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`;
}

/**
 * Get the SVG icon for a section by its ID.
 *
 * @param sectionId - Section identifier
 * @returns SVG string or empty string
 */
export function getSectionIcon(sectionId: string): string {
  return SECTION_ICONS[sectionId] || '';
}
