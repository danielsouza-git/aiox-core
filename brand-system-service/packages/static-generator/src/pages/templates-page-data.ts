/**
 * Templates page data extractor.
 *
 * Generates structured data for the brand book Templates page,
 * providing 3 reusable page layout templates with visual previews
 * and copyable code snippets:
 *
 * 1. Page Shell — sticky nav, section dividers, footer
 * 2. Dashboard Grid — bento-style asymmetric 4-column layout
 * 3. Content Grid — auto-fit minmax(340px, 1fr) responsive grid
 *
 * NO external API calls — all data is self-contained.
 *
 * @module pages/templates-page-data
 */

/**
 * A single page layout template definition.
 */
export interface LayoutTemplate {
  /** Unique identifier for the template */
  readonly id: string;
  /** Display name */
  readonly name: string;
  /** Short description of purpose and use case */
  readonly description: string;
  /** Key features / characteristics */
  readonly features: string[];
  /** HTML code for the visual preview (inline styles, self-contained) */
  readonly previewHtml: string;
  /** Copyable HTML/CSS code snippet */
  readonly codeSnippet: string;
  /** CSS-specific snippet for the layout */
  readonly cssSnippet: string;
}

/**
 * Complete data for the Templates brand book page.
 */
export interface TemplatesPageData {
  readonly templates: LayoutTemplate[];
  readonly introText: string;
}

/**
 * Build the Page Shell template definition.
 */
function buildPageShellTemplate(): LayoutTemplate {
  return {
    id: 'page-shell',
    name: 'Page Shell',
    description:
      'A complete page scaffold with sticky navigation bar, content sections separated by dividers, and a branded footer. Ideal for marketing pages, documentation, and long-form content.',
    features: [
      'Sticky navigation bar (position: sticky, top: 0)',
      'Horizontal section dividers between content blocks',
      'Branded footer with configurable columns',
      'Responsive: collapses to stacked layout at 768px',
    ],
    previewHtml: `<div style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;font-family:system-ui,sans-serif;font-size:12px;background:#fff;">
  <div style="background:var(--brand-primary,#7631e5);color:#fff;padding:8px 16px;font-weight:600;position:sticky;top:0;display:flex;justify-content:space-between;align-items:center;">
    <span>Brand Logo</span>
    <div style="display:flex;gap:12px;font-size:11px;font-weight:400;">
      <span>Home</span><span>About</span><span>Contact</span>
    </div>
  </div>
  <div style="padding:24px 16px;text-align:center;">
    <div style="font-size:16px;font-weight:700;margin-bottom:4px;">Hero Section</div>
    <div style="color:#6b7280;font-size:11px;">Full-width content area</div>
  </div>
  <div style="height:1px;background:#e5e7eb;margin:0 16px;"></div>
  <div style="padding:16px;text-align:center;">
    <div style="font-weight:600;margin-bottom:4px;">Content Section</div>
    <div style="color:#6b7280;font-size:11px;">Separated by dividers</div>
  </div>
  <div style="height:1px;background:#e5e7eb;margin:0 16px;"></div>
  <div style="padding:12px 16px;background:#f8f9fa;text-align:center;color:#6b7280;font-size:10px;">
    Footer &mdash; Brand &copy; 2026
  </div>
</div>`,
    codeSnippet: `<div class="page-shell">
  <nav class="page-shell__nav">
    <a href="/" class="page-shell__logo">Brand</a>
    <ul class="page-shell__links">
      <li><a href="/about">About</a></li>
      <li><a href="/services">Services</a></li>
      <li><a href="/contact">Contact</a></li>
    </ul>
  </nav>

  <main class="page-shell__main">
    <section class="page-shell__section">
      <h1>Hero Section</h1>
      <p>Full-width content area with brand styling.</p>
    </section>

    <hr class="page-shell__divider" />

    <section class="page-shell__section">
      <h2>Content Section</h2>
      <p>Each section is separated by a horizontal divider.</p>
    </section>
  </main>

  <footer class="page-shell__footer">
    <p>&copy; 2026 Brand. All rights reserved.</p>
  </footer>
</div>`,
    cssSnippet: `.page-shell__nav {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 56px;
  background: var(--brand-primary);
  color: #fff;
}

.page-shell__links {
  display: flex;
  gap: 24px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.page-shell__section {
  padding: 64px 24px;
  max-width: 960px;
  margin: 0 auto;
}

.page-shell__divider {
  border: none;
  height: 1px;
  background: var(--color-border, #e5e7eb);
  margin: 0 24px;
}

.page-shell__footer {
  padding: 32px 24px;
  background: var(--color-bg-subtle, #f8f9fa);
  text-align: center;
  font-size: 14px;
  color: var(--color-text-secondary, #6b7280);
}

@media (max-width: 768px) {
  .page-shell__nav {
    flex-direction: column;
    height: auto;
    padding: 12px 16px;
    gap: 8px;
  }
  .page-shell__section {
    padding: 32px 16px;
  }
}`,
  };
}

/**
 * Build the Dashboard Grid template definition.
 */
function buildDashboardGridTemplate(): LayoutTemplate {
  return {
    id: 'dashboard-grid',
    name: 'Dashboard Grid',
    description:
      'A bento-style asymmetric grid layout using 4 columns. Cards span different widths and heights to create visual hierarchy. Ideal for dashboards, analytics pages, and feature showcases.',
    features: [
      'Asymmetric 4-column grid with named areas',
      'Cards with variable spans (1x1, 2x1, 2x2)',
      'Visual hierarchy through size differentiation',
      'Responsive: stacks to single column at 768px',
    ],
    previewHtml: `<div style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;padding:12px;font-family:system-ui,sans-serif;font-size:11px;background:#f8f9fa;">
  <div style="display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:auto auto;gap:8px;">
    <div style="grid-column:span 2;grid-row:span 2;background:var(--brand-primary,#7631e5);color:#fff;border-radius:6px;padding:16px;display:flex;flex-direction:column;justify-content:center;">
      <div style="font-weight:700;font-size:14px;">Primary Metric</div>
      <div style="font-size:10px;opacity:0.8;margin-top:4px;">2x2 featured card</div>
    </div>
    <div style="background:#fff;border:1px solid #e5e7eb;border-radius:6px;padding:12px;">
      <div style="font-weight:600;">Card A</div>
      <div style="color:#6b7280;font-size:10px;">1x1</div>
    </div>
    <div style="background:#fff;border:1px solid #e5e7eb;border-radius:6px;padding:12px;">
      <div style="font-weight:600;">Card B</div>
      <div style="color:#6b7280;font-size:10px;">1x1</div>
    </div>
    <div style="grid-column:span 2;background:#fff;border:1px solid #e5e7eb;border-radius:6px;padding:12px;">
      <div style="font-weight:600;">Wide Card</div>
      <div style="color:#6b7280;font-size:10px;">2x1 span</div>
    </div>
  </div>
</div>`,
    codeSnippet: `<div class="dashboard-grid">
  <div class="dashboard-grid__card dashboard-grid__card--featured">
    <h2>Primary Metric</h2>
    <p class="dashboard-grid__value">$12,450</p>
    <p class="dashboard-grid__label">Monthly Revenue</p>
  </div>

  <div class="dashboard-grid__card">
    <h3>Active Users</h3>
    <p class="dashboard-grid__value">1,284</p>
  </div>

  <div class="dashboard-grid__card">
    <h3>Conversion</h3>
    <p class="dashboard-grid__value">3.2%</p>
  </div>

  <div class="dashboard-grid__card dashboard-grid__card--wide">
    <h3>Recent Activity</h3>
    <p>Activity timeline or chart goes here.</p>
  </div>
</div>`,
    cssSnippet: `.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto auto;
  gap: 16px;
  padding: 24px;
}

.dashboard-grid__card {
  background: var(--color-bg, #fff);
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 8px;
  padding: 24px;
}

.dashboard-grid__card--featured {
  grid-column: span 2;
  grid-row: span 2;
  background: var(--brand-primary, #7631e5);
  color: #fff;
  border: none;
}

.dashboard-grid__card--wide {
  grid-column: span 2;
}

.dashboard-grid__value {
  font-size: 32px;
  font-weight: 700;
  margin: 8px 0 4px;
}

.dashboard-grid__label {
  font-size: 14px;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  .dashboard-grid__card--featured,
  .dashboard-grid__card--wide {
    grid-column: span 1;
    grid-row: span 1;
  }
}`,
  };
}

/**
 * Build the Content Grid template definition.
 */
function buildContentGridTemplate(): LayoutTemplate {
  return {
    id: 'content-grid',
    name: 'Content Grid',
    description:
      'A responsive auto-fit grid using minmax(340px, 1fr) that automatically adapts the number of columns based on available width. Ideal for blog listings, portfolios, product catalogs, and team directories.',
    features: [
      'Auto-fit columns with minmax(340px, 1fr)',
      'Cards with consistent height alignment',
      'Fully responsive without breakpoints',
      'Graceful degradation: single column on narrow screens',
    ],
    previewHtml: `<div style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;padding:12px;font-family:system-ui,sans-serif;font-size:11px;background:#f8f9fa;">
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
    <div style="background:#fff;border:1px solid #e5e7eb;border-radius:6px;overflow:hidden;">
      <div style="height:48px;background:linear-gradient(135deg,var(--brand-primary,#7631e5),#6366f1);"></div>
      <div style="padding:10px;">
        <div style="font-weight:600;margin-bottom:2px;">Card Title</div>
        <div style="color:#6b7280;font-size:10px;">Short description text for this content card item.</div>
      </div>
    </div>
    <div style="background:#fff;border:1px solid #e5e7eb;border-radius:6px;overflow:hidden;">
      <div style="height:48px;background:linear-gradient(135deg,#6366f1,#ec4899);"></div>
      <div style="padding:10px;">
        <div style="font-weight:600;margin-bottom:2px;">Card Title</div>
        <div style="color:#6b7280;font-size:10px;">Short description text for this content card item.</div>
      </div>
    </div>
    <div style="background:#fff;border:1px solid #e5e7eb;border-radius:6px;overflow:hidden;">
      <div style="height:48px;background:linear-gradient(135deg,#ec4899,var(--brand-primary,#7631e5));"></div>
      <div style="padding:10px;">
        <div style="font-weight:600;margin-bottom:2px;">Card Title</div>
        <div style="color:#6b7280;font-size:10px;">Short description text for this content card item.</div>
      </div>
    </div>
  </div>
</div>`,
    codeSnippet: `<div class="content-grid">
  <article class="content-grid__card">
    <div class="content-grid__card-image">
      <img src="image.jpg" alt="Description" />
    </div>
    <div class="content-grid__card-body">
      <h3 class="content-grid__card-title">Card Title</h3>
      <p class="content-grid__card-desc">
        Short description text for this content card item.
      </p>
      <a href="/detail" class="content-grid__card-link">
        Read more &rarr;
      </a>
    </div>
  </article>

  <!-- Repeat cards as needed -->
</div>`,
    cssSnippet: `.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 24px;
  padding: 24px;
}

.content-grid__card {
  background: var(--color-bg, #fff);
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.15s ease;
}

.content-grid__card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.content-grid__card-image {
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.content-grid__card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.content-grid__card-body {
  padding: 20px;
}

.content-grid__card-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px;
}

.content-grid__card-desc {
  font-size: 14px;
  color: var(--color-text-secondary, #6b7280);
  margin: 0 0 12px;
  line-height: 1.6;
}

.content-grid__card-link {
  font-size: 14px;
  font-weight: 500;
  color: var(--brand-primary, #7631e5);
}`,
  };
}

/**
 * Extract templates page data for brand book rendering.
 *
 * Generates structured template data for 3 layout patterns:
 * Page Shell, Dashboard Grid, and Content Grid.
 *
 * @returns Complete templates page data for template rendering
 */
export function extractTemplatesPageData(): TemplatesPageData {
  return {
    introText:
      'Ready-to-use page layout templates combining the design tokens into practical, reusable compositions. Each template includes a visual preview, description, and copyable code snippet.',
    templates: [
      buildPageShellTemplate(),
      buildDashboardGridTemplate(),
      buildContentGridTemplate(),
    ],
  };
}
