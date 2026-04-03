# Brand System Service - Epic Map & Story Breakdown

**Version:** 1.4
**Date:** 2026-04-02
**Author:** Pax (PO Agent)
**Source PRD:** `docs/prd-brand-system-service.md` (v1.2, Reviewed)
**Architect Review (PRD):** `docs/review-prd-brand-system-service.md` (APPROVED WITH CONDITIONS - all 5 conditions incorporated in PRD v1.1)
**Architect Review (Epics):** `docs/review-epic-decomposition.md` (GO WITH ADJUSTMENTS - 10 recommendations incorporated)
**Evolution Plan:** `docs/reviews/bss-brand-book-evolution-plan.md` (v1.0, by Aria - gap analysis)
**PM Validation:** `docs/reviews/bss-evolution-plan-pm-validation.md` (CONDITIONAL GO - 5 conditions accepted)
**Architecture (PDL):** `docs/architecture/personality-driven-layouts.md` (Aria - 15 sections, 5 ADRs)

---

## Epic Map Overview

| ID | Title | Complexity | Priority | FRs/NFRs | Dependencies |
|----|-------|-----------|----------|----------|-------------|
| EPIC-BSS-1 | Foundation & Simplified Infrastructure | L | P0 | FR-8.1-8.3, NFR-1.4-1.6, NFR-5.1-5.6, NFR-6.5, NFR-9.10 | None |
| EPIC-BSS-2 | Design Token Engine & Brand Book (Triple Delivery) | L | P0 | FR-1.1-1.10, FR-1.13, FR-1.7 (revised), NFR-2.1-2.3, NFR-3.3, NFR-3.5, NFR-4.5, NFR-9.1-9.5 | EPIC-BSS-1 |
| EPIC-BSS-3 | AI Acceleration Pipeline & Prompt Engineering | L+ | P0 | FR-2.7, FR-2.9-2.10, FR-9.1-9.3, NFR-1.1, NFR-1.3, NFR-8.1 | EPIC-BSS-1 |
| EPIC-BSS-4 | Creative Production (Social Media & Batch) | L | P0 | FR-2.1-2.8, NFR-2.4, NFR-4.2 | EPIC-BSS-2, EPIC-BSS-3 |
| EPIC-BSS-5 | Landing Pages & Sites (Static-First) | L | P0 | FR-3.1-3.10, FR-3.5-3.6 (revised), NFR-2.1, NFR-3.2, NFR-9.3, NFR-9.5 | EPIC-BSS-1, EPIC-BSS-2 |
| EPIC-BSS-6 | ClickUp Operations & Approval Workflow | M | P0 | FR-8.1 (revised), FR-8.4-8.7 (revised), NFR-3.1-3.2, NFR-9.10 | EPIC-BSS-1 |
| EPIC-BSS-7 | Client Onboarding & Audit-Assisted Discovery | L+ | P0 | FR-1.1, FR-8.2 (revised), FR-10.1-10.5 (NEW), NFR-3.1, NFR-9.6-9.9 | EPIC-BSS-1, EPIC-BSS-6 |
| EPIC-BSS-8 | Quality Assurance & Review Pipeline | M | P0 | FR-8.5 (revised), FR-8.7 (revised), NFR-7.1-7.4, NFR-8.1 | EPIC-BSS-3, EPIC-BSS-4 |
| EPIC-BSS-VAL | Internal Validation Program | M | P0 | FR-11.1-11.6 (NEW), NFR-9.10-9.13 (NEW) | EPIC-BSS-1 through EPIC-BSS-8 |
| EPIC-BSS-A | Complete Brand Book (MVP Enhancement) | M | P0 | FR-1.2-1.3, FR-1.6-1.9, NFR-9.1-9.2 | EPIC-BSS-2 |
| EPIC-BSS-9 | Figma Component Library & Design System Export | L | P1 | FR-1.11, NFR-3.4, NFR-3.6, CON-13, CON-15 | EPIC-BSS-2 |
| EPIC-BSS-10 | Observability, Analytics & Cost Tracking | M | P1 | FR-8.6 (revised), NFR-6.1-6.5, NFR-4.1-4.2 | EPIC-BSS-1 |
| EPIC-BSS-C | Templates & SEO (Advanced Features) | L | P1 | FR-1.8, FR-3.7, NFR-9.1-9.2 | EPIC-BSS-2, EPIC-BSS-A |
| EPIC-BSS-D | Personality-Driven Layouts (AI-Generated) | L | P1 | FR-1.7, FR-2.7, FR-3.5, NFR-2.1, NFR-9.1-9.5 | EPIC-BSS-2, EPIC-BSS-A |
| EPIC-BSS-B | Design System Layer (Post-MVP) | XL | P2 | FR-1.2, FR-1.11, NFR-3.4 | EPIC-BSS-9, EPIC-BSS-A |
| EPIC-BSS-11 | Email Marketing (Pillar 4) | M | P2 | FR-4.1-4.7, NFR-2.5 | EPIC-BSS-1, EPIC-BSS-3 |
| EPIC-BSS-12 | Ads Criativos (Pillar 5) | M | P2 | FR-5.1-5.8 | EPIC-BSS-4, EPIC-BSS-3 |
| EPIC-BSS-13 | Video & Motion Graphics (Pillar 6) | L | P2 | FR-6.1-6.8 | EPIC-BSS-2, EPIC-BSS-3 |
| EPIC-BSS-14 | Corporate Materials (Pillar 7) | M | P2 | FR-7.1-7.8 | EPIC-BSS-2, EPIC-BSS-9 |
| EPIC-BSS-15 | Client Portal & Multi-Tenant (Phase 2) | L | P3 | FR-1.12, FR-8.1 (portal), NFR-2.6, NFR-8.2-8.4 | EPIC-BSS-VAL |

---

## MVP Scope Definition (v1.2 Simplified)

### MVP Philosophy (v1.2)

**[NEW v1.2]** The MVP prioritizes operational simplicity, portability, and validated delivery over advanced technical infrastructure:

1. **ClickUp-centric operations** instead of proprietary Client Portal
2. **Static-first deliverables** (HTML/CSS/JS) instead of mandatory CMS/Next.js
3. **Per-client static hosting** instead of multi-tenant subdomain routing
4. **Internal Validation Program** before commercial launch
5. **Audit-assisted onboarding** as optional enhancement to discovery

### MVP (P0 Epics) -- Pillars 1-3 + Foundation + QA + Validation

**Epics 1-8 + VAL** constitute the MVP. These deliver:
- Simplified infrastructure with ClickUp operations, R2 storage, and static hosting
- Design token engine with W3C DTCG format and **triple-delivery brand book** (online + PDF + local package)
- AI-accelerated content pipeline with prompt engineering
- Social media creative batch generation
- **Static-first** landing pages and institutional sites (CMS optional)
- **ClickUp-based** client operations and approval workflows
- **Audit-assisted** client onboarding and brand discovery
- Quality assurance pipeline with checklist-based QA
- **Internal Validation Program** with 3-5 reference projects

**Estimated MVP timeline:** 14-18 weeks (3.5-4.5 months)
> Reduced from v1.1 (16-20 weeks) due to simplified infrastructure (no multi-tenant runtime, no proprietary portal)

**Estimated MVP effort:** ~650-800 dev hours across all epics
> Reduced from v1.1 (~800-1000 hours) due to ClickUp replacing Client Portal

### Post-MVP (P1 Epics) -- Design System + Observability

**Epics 9-10** enhance MVP with Figma integration and observability.

**Estimated timeline:** 4-6 weeks after MVP

### Expansion (P2 Epics) -- Pillars 4-7

**Epics 11-14** add Email, Ads, Video, and Corporate Materials.

**Estimated timeline:** 6-12 months post-MVP, delivered incrementally

### Phase 2 Infrastructure (P3) -- Advanced Features

**Epic 15** adds proprietary Client Portal and multi-tenant architecture when scaling beyond 40 clients.

**Estimated timeline:** Post-validation, when approaching scale limits

---

## Execution Sequence (v1.2 Simplified)

### Wave 1: Foundation (Weeks 1-3)

```
EPIC-BSS-1 (Foundation & Simplified Infrastructure)
EPIC-BSS-6 (ClickUp Operations & Approval Workflow) -- can start Week 2
```

**[REVISED v1.2]** Foundation is simpler without multi-tenant runtime. ClickUp setup can start in Week 2 since it's independent tooling configuration.

> **Critical Path:** BSS-1 core stories (storage, asset management, security basics) must complete before Wave 2. ClickUp workspace setup (BSS-6) runs in parallel.

### Wave 2: Core Engines (Weeks 3-7)

```
EPIC-BSS-2 (Design Tokens & Brand Book Triple Delivery) -- depends on EPIC-BSS-1
EPIC-BSS-3 (AI Pipeline & Prompt Engineering) -- depends on EPIC-BSS-1
```

These two run in parallel. Token engine produces the brand foundation with **three delivery formats**; AI pipeline produces the content generation infrastructure.

### Wave 3: Production Pillars (Weeks 5-10)

```
EPIC-BSS-4 (Creative Production) -- depends on EPIC-BSS-2 + EPIC-BSS-3
EPIC-BSS-5 (Landing Pages & Sites - Static First) -- depends on EPIC-BSS-1 + EPIC-BSS-2
```

**[REVISED v1.2]** Two pillars running in parallel (reduced from three -- Client Portal moved to ClickUp in Wave 1).

| Team Size | Wave 3 Impact | Total MVP Timeline |
|-----------|--------------|-------------------|
| 2+ devs | All parallel | 14-18 weeks (on schedule) |
| 1 dev | Sequential, +4-6 weeks | 20-24 weeks |

### Wave 4: Onboarding & QA (Weeks 8-12)

```
EPIC-BSS-7 (Client Onboarding & Audit-Assisted Discovery) -- depends on EPIC-BSS-1 + EPIC-BSS-6
EPIC-BSS-8 (QA & Review Pipeline) -- depends on EPIC-BSS-3 + EPIC-BSS-4
```

**[REVISED v1.2]** BSS-7 now includes audit-assisted mode (FR-10.1-10.5) for analyzing existing digital presence.

### Wave 5: Validation (Weeks 10-14)

```
EPIC-BSS-VAL (Internal Validation Program) -- depends on all MVP epics (BSS-1 through BSS-8)
```

**[NEW v1.2]** Mandatory validation phase with 3-5 reference projects before commercial launch. This epic exercises the full workflow and captures learnings for backlog refinement.

### Wave 5b: Brand Book Enhancement (Weeks 10-14, overlapping with Wave 5)

```
EPIC-BSS-A (Complete Brand Book - MVP Enhancement) -- depends on EPIC-BSS-2
EPIC-BSS-C (Templates & SEO) -- depends on EPIC-BSS-2 + EPIC-BSS-A
```

**[NEW v1.3]** EPIC-BSS-A fills the 63% gap between BSS brand book output and AIOX reference quality. EPIC-BSS-C adds SEO documentation and editorial strategy pages. Both originated from gap analysis (`docs/reviews/bss-brand-book-evolution-plan.md`), validated by PM ("CONDITIONAL GO"). **Status: EPIC-BSS-A COMPLETE (7/8 stories Done, 130 tests), EPIC-BSS-C 2/3 stories Done (65 tests).**

### Wave 5c: Personality-Driven Layouts (Weeks 12-18, overlapping with Wave 5b)

```
EPIC-BSS-D (Personality-Driven Layouts) -- depends on EPIC-BSS-2 + EPIC-BSS-A
```

**[NEW v1.4]** EPIC-BSS-D introduces AI-generated layouts so that each brand book, site, and social post is visually unique -- driven by the brand profile and visual references rather than predefined templates. Wave 1 (PDL-1 to PDL-3) builds the visual research pipeline. Wave 2 (PDL-4 to PDL-6) proves the concept with AI-generated brand books. Wave 3 (PDL-7 to PDL-9) extends to other deliverables. Wave 4 (PDL-10 to PDL-11) adds a fallback engine with 6 layout families from the architecture document. Architecture: `docs/architecture/personality-driven-layouts.md`.

### Wave 6: Enhancement (Weeks 12-18, overlapping with Wave 5)

```
EPIC-BSS-9 (Figma Component Library) -- depends on EPIC-BSS-2
EPIC-BSS-10 (Observability & Analytics) -- depends on EPIC-BSS-1
```

### Wave 7: Expansion Pillars (Post-MVP, incremental)

```
EPIC-BSS-B (Design System Layer) -- depends on EPIC-BSS-9 + EPIC-BSS-A
EPIC-BSS-11 (Email Marketing) -- Q3
EPIC-BSS-12 (Ads Criativos) -- Q3
EPIC-BSS-13 (Video & Motion) -- Q4
EPIC-BSS-14 (Corporate Materials) -- Q1 Year 2
```

### Wave 8: Phase 2 Infrastructure (Post-Validation, when needed)

```
EPIC-BSS-15 (Client Portal & Multi-Tenant) -- when approaching 40 clients
```

### Dependency Graph (v1.4)

```
EPIC-BSS-1 (Foundation - Simplified)
  |
  +---> EPIC-BSS-6 (ClickUp Operations) [Wave 1, parallel]
  |       |
  |       +---> EPIC-BSS-7 (Onboarding + Audit-Assisted)
  |
  +---> EPIC-BSS-2 (Tokens & Brand Book Triple Delivery)
  |       |
  |       +---> EPIC-BSS-A (Complete Brand Book) [P0, DONE] <<<< NEW v1.3
  |       |       |
  |       |       +---> EPIC-BSS-C (Templates & SEO) [P1, 2/3 Done] <<<< NEW v1.3
  |       |       |
  |       |       +---> EPIC-BSS-D (Personality-Driven Layouts) [P1] <<<< NEW v1.4
  |       |       |
  |       |       +---> EPIC-BSS-B (Design System Layer) [P2] <--- EPIC-BSS-9 <<<< NEW v1.3
  |       |
  |       +---> EPIC-BSS-4 (Creatives) <--- EPIC-BSS-3 (AI Pipeline)
  |       |
  |       +---> EPIC-BSS-5 (Landing Pages - Static First)
  |       |
  |       +---> EPIC-BSS-9 (Figma Components) [P1]
  |       |       |
  |       |       +---> EPIC-BSS-14 (Corporate Materials) [P2]
  |       |       |
  |       |       +---> EPIC-BSS-B (Design System Layer) [P2] <--- EPIC-BSS-A
  |       |
  |       +---> EPIC-BSS-13 (Video & Motion) [P2] <--- EPIC-BSS-3
  |
  +---> EPIC-BSS-3 (AI Pipeline)
  |       |
  |       +---> EPIC-BSS-8 (QA Pipeline) <--- EPIC-BSS-4
  |       |
  |       +---> EPIC-BSS-11 (Email Marketing) [P2]
  |       |
  |       +---> EPIC-BSS-12 (Ads) [P2] <--- EPIC-BSS-4
  |
  +---> EPIC-BSS-10 (Observability) [P1]

EPIC-BSS-VAL (Validation Program)
  |
  +---> Depends on: BSS-1, BSS-2, BSS-3, BSS-4, BSS-5, BSS-6, BSS-7, BSS-8
  |
  +---> EPIC-BSS-15 (Client Portal & Multi-Tenant) [P3, Phase 2]
```

---

## Epic Details & Stories

---

### EPIC-BSS-1: Foundation & Simplified Infrastructure

**Priority:** P0 | **Complexity:** L | **Estimate:** 2-3 weeks
**Description:** **[REVISED v1.2]** Establish the simplified foundational infrastructure for MVP: asset storage (Cloudflare R2), static hosting setup, basic security, GDPR compliance pipeline. Multi-tenant subdomain routing and Supabase RLS deferred to Phase 2 (EPIC-BSS-15). Per-client static hosting replaces runtime multi-tenancy.

**FRs Covered:** FR-8.1 (revised - ClickUp), FR-8.2 (Phase 5 setup only), FR-8.3
**NFRs Covered:** NFR-1.4 (revised - 10-50 clients via static hosting), NFR-1.5 (revised - ClickUp + static sites), NFR-1.6, NFR-5.2-5.6, NFR-9.10

**[REMOVED v1.2]:** FR-1.12 (multi-tenant subdomain), NFR-2.6 (RLS), NFR-5.1 (proprietary auth), NFR-8.2-8.4 (advanced rate limiting, webhook HMAC, RLS testing) -- all moved to EPIC-BSS-15 (Phase 2)

**Stories:**

1. **BSS-1.1: Project Scaffold & Tech Stack Setup** -- Initialize project with static site generator support, TypeScript, Tailwind, ESLint, configure static hosting (Vercel/Netlify), set up monorepo structure
2. **BSS-1.2: Cloudflare R2 Asset Storage** -- Set up R2 bucket with client-specific path structure (`r2://brand-assets/{client-id}/`), signed URL generation (15min API / 1h downloads), upload/download utilities -- **[Critical Path]**
3. **BSS-1.3: Asset Organization & Naming Convention** -- Implement folder structure per FR-8.8: 01-brand-identity/, 02-design-system/, 03-social-media/, etc., with automated folder creation on client setup
4. **BSS-1.4: Basic Security Hardening** -- Malware scanning (ClamAV) for uploads, API key encryption in environment variables, signed URL expiration enforcement, abuse detection for asset downloads
5. **BSS-1.5: GDPR Compliance & Data Pipeline** -- Data export (JSON + ZIP), soft delete (7-day), permanent deletion with audit trail, asset backup configuration (daily, 30-day retention)
6. **BSS-1.6: Static Hosting Configuration** -- Configure deployment pipeline for static sites: Vercel/Netlify free-tier setup, custom domain support via CNAME, Git-based CI/CD for static deployments
7. **BSS-1.7: Infrastructure Monitoring Setup** -- Sentry error tracking (free tier), basic health monitoring via ClickUp dashboard, log structure for AI API calls

---

### EPIC-BSS-2: Design Token Engine & Brand Book (Triple Delivery)

**Priority:** P0 | **Complexity:** L | **Estimate:** 3-4 weeks
**Description:** **[REVISED v1.2]** Build the design token pipeline (W3C DTCG format) with Style Dictionary transformations, and the brand book generator with **triple delivery format**: (1) online static version, (2) PDF export, (3) portable local package openable via index.html. Static HTML/CSS/JS by default; Next.js optional when SSR needed. Tokens flow unidirectionally from code to all consumers.

**FRs Covered:** FR-1.1 (output), FR-1.2-1.10, FR-1.13, FR-1.7 (revised - triple delivery)
**NFRs Covered:** NFR-2.1-2.3, NFR-3.3, NFR-3.5, NFR-4.5, NFR-9.1-9.5 (NEW - static delivery & portability)
**CONs Addressed:** CON-13 (token source of truth is code, not Figma), CON-22 (local package via index.html, no server)

**Stories:**

1. **BSS-2.1: Token Schema & W3C DTCG Structure** -- Define 3-tier token architecture (primitive/semantic/component), create JSON schema, seed with default brand tokens, validate against DTCG 2025.10 spec
2. **BSS-2.2: Style Dictionary Build Pipeline** -- Configure Style Dictionary 4.x transforms for CSS Custom Properties, SCSS variables, Tailwind config, JSON export, Figma Variables push (via Tokens Studio)
3. **BSS-2.3: Color Palette Engine** -- Generate color palettes with primary (2-3), secondary (2-4), neutral scale (50-950), semantic colors (5 tones each), dark mode variants, WCAG AA/AAA contrast documentation
4. **BSS-2.4: Typography System** -- Configure Display/Heading, Body/Interface, Mono/Code font families, type scale (8-12 sizes), responsive typography with CSS clamp values, licensing documentation
5. **BSS-2.5: Grid System & Spacing** -- Define breakpoints (xs/sm/md/lg/xl/2xl), column counts, gutter sizes, margin specs, 8px base grid vertical rhythm
6. **BSS-2.6: Brand Book Static Site Generator** -- **[REVISED v1.2]** Create static HTML/CSS/JS template for brand book with sections: Guidelines, Foundations, Logo, Colors, Typography, Icons, Components, Motion, Templates. Use relative paths, embed all assets (fonts, images, CSS, JS), include client-side search (Fuse.js). Deployable to any static host
7. **BSS-2.7: Brand Book PDF Export** -- Generate PDF version (50-100 pages) via Puppeteer/wkhtmltopdf from brand book data, matching site content structure
8. **BSS-2.8: Brand Book Local Package** -- **[NEW v1.2]** Generate downloadable ZIP containing index.html + all HTML pages + /assets folder (CSS, JS, fonts, images) + embedded tokens. Must function when opened via index.html in any modern browser without server dependencies (NFR-9.1, NFR-9.4, CON-22)
9. **BSS-2.9: Brand Voice & Manifesto Generator** -- Produce Brand Voice Guide (8-12 pages), Manifesto (Belief-Bridge-Bold), Value Proposition Canvas, 5-10 taglines with creation formulas

---

### EPIC-BSS-3: AI Acceleration Pipeline & Prompt Engineering

**Priority:** P0 | **Complexity:** L+ | **Estimate:** 4-5 weeks
**Description:** Build the AI orchestration layer for content generation (Claude API, Flux, DALL-E), including prompt template library with versioning and quality scoring, content moderation filters, job queue management with rate limiting and backpressure, and cost tracking per client.

**FRs Covered:** FR-2.7 (AI portion), FR-2.9-2.10, FR-9.1-9.3
**NFRs Covered:** NFR-1.1, NFR-1.3, NFR-4.2, NFR-8.1
**CONs Addressed:** CON-3, CON-15 (logos never AI-generated)

**Stories:**

1. **BSS-3.1: AI Service Abstraction Layer** -- Create unified interface for Claude API, GPT-4o, Flux 1.1 Pro, DALL-E 3, with provider fallback strategy, retry logic, and model version pinning
2. **BSS-3.2: Job Queue & Rate Limit Management** -- Implement queue with backpressure for AI API calls, throttling to stay within RPM limits (Claude Tier 2: ~40 RPM), worker for long-running jobs
3. **BSS-3.3: Prompt Template Library** -- Create versioned prompt templates per deliverable type (brand voice, social post, landing page copy, email, ad copy, video script), with client context variable injection
4. **BSS-3.4: Prompt Quality Scoring Pipeline** -- Implement 5-dimension scoring (brand voice adherence, factual accuracy, tone, CTA effectiveness, creativity), iteration cycle until avg >= 4.0, A/B testing for prompt variants
5. **BSS-3.5: Content Moderation Filters** -- Automated checks for offensive language, factual claims flagging, brand-forbidden words (per client), competitor mentions, legal compliance, mandatory human review flag
6. **BSS-3.6: AI Cost Tracking & Budget Controls** -- Log all API calls (timestamp, client_id, tokens, cost, latency), per-client budget cap ($200), 80% warning alert, 100% auto-throttle
7. **BSS-3.7: Copy Generation Pipeline** -- HCEA framework (Hook/Context/Entrega/Action) implementation for social posts (150-300 words), carousel captions, hashtag generation (niche/medium/broad mix)

---

### EPIC-BSS-4: Creative Production (Social Media & Batch)

**Priority:** P0 | **Complexity:** L | **Estimate:** 3-4 weeks
**Description:** Build the batch creative generation pipeline using Satori (JSX-to-SVG) + Sharp (rasterization) for social media templates. Covers all platform formats, layout variants, content calendar structure, and platform-specific exports.

**FRs Covered:** FR-2.1-2.8
**NFRs Covered:** NFR-2.4, NFR-4.2

**Stories:**

1. **BSS-4.1: Template Engine (Satori + Sharp)** -- Set up Satori JSX-to-SVG rendering pipeline with Sharp rasterization, support for brand token injection, export to PNG/JPG per platform specs
2. **BSS-4.2: Instagram & Facebook Templates** -- Feed (1080x1080, 1080x1350), Stories (1080x1920), with 5-8 layout variants (Quote, Tip, Statistic, Before/After, Question, Announcement, Behind-the-scenes, Testimonial)
3. **BSS-4.3: LinkedIn, X/Twitter, Pinterest Templates** -- Platform-specific formats with brand token integration and layout variants
4. **BSS-4.4: Carousel Template Engine** -- Multi-slide carousel generator (1080x1350, 2-10 slides) with cover, content, summary, CTA slide types, continuity elements (arrows, progress dots)
5. **BSS-4.5: YouTube Thumbnail & Banner Templates** -- Thumbnail (1280x720) with 5 variants, Profile covers and banners for all platforms (LinkedIn, X, YouTube, Facebook, TikTok)
6. **BSS-4.6: Batch Generation Pipeline** -- End-to-end: content brief intake, AI copy generation, AI image generation, template rendering, rasterization, export to review queue, targeting 10-15 min for 30 posts
7. **BSS-4.7: Content Calendar Template** -- 4-week rotation structure (Educational 40%, Authority 25%, Engagement 15%, Conversion 10%, Promotional 10%), content pillars per industry vertical

---

### EPIC-BSS-5: Landing Pages & Sites (Static-First)

**Priority:** P0 | **Complexity:** L | **Estimate:** 3-4 weeks
**Description:** **[REVISED v1.2]** Build landing page and institutional site templates as **static HTML/CSS/JS by default**, deployable to any static hosting platform. CMS integration (Payload CMS) is OPTIONAL, used only when client requires frequent content updates. Static sites use build-time token injection.

**FRs Covered:** FR-3.1-3.10, FR-3.5 (revised - static default), FR-3.6 (revised - any hosting)
**NFRs Covered:** NFR-2.1, NFR-3.2, NFR-9.3 (static deployable anywhere), NFR-9.5 (static package portability)

**Stories:**

1. **BSS-5.1: Static Site Build Pipeline** -- **[REVISED v1.2]** Create static HTML/CSS/JS build pipeline with: token injection at build time, asset bundling (CSS, JS, fonts, images), relative paths for portability. Output deployable to Vercel, Netlify, GitHub Pages, any web server
2. **BSS-5.2: Landing Page Templates (Static)** -- Conversion Architecture framework with 8 sections (Hero, Problem, Solution, How It Works, Social Proof, Pricing, FAQ, Final CTA), 3 breakpoints (1440px, 768px, 375px), pure HTML/CSS/JS
3. **BSS-5.3: Institutional Site Templates (Static)** -- Page types: Home, About, Services, Portfolio, Blog Listing, Blog Post, Contact, Pricing, Terms/Privacy, 404, responsive design, static HTML
4. **BSS-5.4: Landing Page Copy Framework** -- 1500-3000 word copy structure, wireframe specs, clear customization points for tokens, content, and imagery
5. **BSS-5.5: SEO Metadata Engine** -- Auto-generate meta titles (<60 chars), descriptions (<155 chars), H1-H6 hierarchy, alt text, URL slugs, sitemap.xml, robots.txt
6. **BSS-5.6: CMS Integration (Optional)** -- **[REVISED v1.2]** Payload CMS 3.x integration for clients needing frequent content updates. Self-hosted in Next.js when needed, role-based access, draft/publish workflow. NOT required for MVP -- only implement when client requests
7. **BSS-5.7: Bio Link Page & Supporting Pages** -- Linktree-style brand-matched page, Thank You/Confirmation pages, Microcopy Guide generation
8. **BSS-5.8: Static Package Export** -- **[NEW v1.2]** Generate downloadable ZIP of landing page/site with all assets, relative paths, single-upload deployable anywhere without configuration changes (NFR-9.5)

---

### EPIC-BSS-6: ClickUp Operations & Approval Workflow

**Priority:** P0 | **Complexity:** M | **Estimate:** 2-3 weeks
**Description:** **[REVISED v1.2]** Configure ClickUp workspace for client operations, replacing proprietary Client Portal in MVP. ClickUp handles: project onboarding, briefing collection, timeline/status tracking, deliverables organization, QA checklists, client approvals, change requests, revision tracking, and retainer operations. Proprietary Client Portal deferred to Phase 2 (EPIC-BSS-15).

**FRs Covered:** FR-8.1 (revised - ClickUp), FR-8.4-8.7 (revised - ClickUp-based)
**NFRs Covered:** NFR-3.1, NFR-3.2, NFR-9.10 (MVP functions without proprietary portal)
**CONs Addressed:** CON-16 (proprietary portal not required in MVP), CON-21 (ClickUp is operational hub)

**Stories:**

1. **BSS-6.1: ClickUp Workspace Structure** -- **[NEW v1.2]** Create ClickUp workspace with hierarchy: Workspace > Space (Brand System Service) > Folders (per client) > Lists (Onboarding, Brand Identity, Creatives, Web, Approvals, Retainer). Configure custom fields for project tracking
2. **BSS-6.2: Client Folder Template** -- **[NEW v1.2]** Create reusable folder template for new clients: intake tasks, milestone tasks, deliverable tasks, approval tasks. Automations for status changes and notifications
3. **BSS-6.3: Onboarding Flow via ClickUp Forms** -- **[NEW v1.2]** Configure ClickUp Forms (or Tally integration) for Phase 1 Intake: company basics, brand personality scales, visual preferences, asset upload links, competitor URLs, deliverable selection. Form submission creates client folder from template
4. **BSS-6.4: Approval Workflow** -- **[NEW v1.2]** Configure approval workflow using ClickUp task comments and custom fields: items awaiting approval, approve/request-changes actions, revision tracking (up to 3 rounds per deliverable type per CON-14), status automation
5. **BSS-6.5: Deliverables Organization** -- **[NEW v1.2]** Configure deliverable tracking: task per deliverable type, attachment links to R2 signed URLs, status (Draft/Review/Approved/Delivered), version tracking via task history
6. **BSS-6.6: Dashboard & Metrics** -- **[NEW v1.2]** Configure ClickUp dashboards for: project timeline (planned vs actual), deliverables status, approval velocity, change request count, client satisfaction tracking via custom fields
7. **BSS-6.7: Retainer Operations** -- **[NEW v1.2]** Configure recurring tasks for retainer clients: monthly content calendar, post generation tasks, email tasks, blog tasks, maintenance tasks, analytics reporting tasks

---

### EPIC-BSS-7: Client Onboarding & Audit-Assisted Discovery

**Priority:** P0 | **Complexity:** L+ | **Estimate:** 4-5 weeks
**Description:** **[REVISED v1.2]** Build the client onboarding flow with two modes: (A) Standard Mode via ClickUp intake, and (B) Audit-Assisted Mode where existing digital presence is analyzed before discovery workshop. AI analysis generates draft brand direction. Audit findings are strategic support, not replacement for discovery. Complexity increased from L (3-4 weeks) to L+ (4-5 weeks) due to audit-assisted mode (FR-10.1-10.5).

**FRs Covered:** FR-1.1, FR-8.2 (revised - two modes), FR-10.1-10.5 (NEW - audit-assisted)
**NFRs Covered:** NFR-3.1, NFR-9.6-9.9 (NEW - audit & inference quality)
**CONs Addressed:** CON-17 (audit is strategic support, not replacement), CON-18 (public content only)

**Stories:**

1. **BSS-7.1: Standard Mode Intake Flow** -- Multi-step form via ClickUp/Tally: company basics, brand personality (5-point scales), visual preferences (mood selection), asset upload, competitor URLs, deliverable selection, progress save/resume, 15min target
2. **BSS-7.2: Audit-Assisted Mode - URL Collection** -- **[NEW v1.2]** Interface for collecting existing digital presence URLs: website, landing pages, YouTube, LinkedIn (company/personal), Instagram, Facebook, TikTok, X/Twitter, other public URLs. Handle incomplete input gracefully (NFR-9.6)
3. **BSS-7.3: Automated Digital Presence Audit** -- **[NEW v1.2]** Analyze provided URLs generating Initial Brand Audit Report: current perceived positioning, tone of voice analysis, messaging consistency, visual consistency (colors, typography, imagery style), improvement opportunities, competitive gap assessment. Include confidence levels (High/Medium/Low) per inference (NFR-9.8)
4. **BSS-7.4: AI Draft Generation from Audit** -- **[NEW v1.2]** Generate AI-assisted drafts from audit findings: draft Brand Voice Guide, draft Messaging Framework, draft Moodboard/Visual Direction, draft suggestions. All labeled "AI Draft - Requires Human Validation" (FR-10.4, NFR-9.7)
5. **BSS-7.5: Audit Data Quality Handling** -- **[NEW v1.2]** Handle incomplete, inconsistent, or outdated source content: flag data quality issues, indicate confidence levels, highlight conflicts between current signals and desired positioning, recommend discovery workshop focus areas (FR-10.5, NFR-9.6, NFR-9.9)
6. **BSS-7.6: AI Analysis Pipeline (Standard Mode)** -- Automated 30min phase: competitor screenshot analysis (Claude Vision), color palette generation, typography pairing, moodboard generation (Flux, 8-12 images), voice definition, W3C DTCG token draft
7. **BSS-7.7: Human Review Interface** -- Internal tool for reviewing AI analysis outputs (from either mode): validate palette accessibility, refine typography, curate moodboard, adjust voice, approve tokens (45min target)
8. **BSS-7.8: Client Approval Flow** -- Interactive preview of brand direction, feedback collection (structured comments via ClickUp), approval or change request workflow (30min target)
9. **BSS-7.9: Automated Client Setup** -- Generate token files, create R2 folder structure, configure static hosting deployment, send credentials (<5min target)

---

### EPIC-BSS-8: Quality Assurance & Review Pipeline

**Priority:** P0 | **Complexity:** M | **Estimate:** 2-3 weeks
**Description:** Implement the quality review queue with checklist-based QA per deliverable category, content moderation enforcement, and training/enablement deliverables generation. **[REVISED v1.2]** Uses ClickUp checklists for QA tracking.

**FRs Covered:** FR-8.5 (revised - ClickUp checklists), FR-8.7 (revised - ClickUp tracking), FR-8.9
**NFRs Covered:** NFR-7.1-7.4

**Stories:**

1. **BSS-8.1: Quality Review Queue (ClickUp)** -- **[REVISED v1.2]** Configure ClickUp checklists for QA before client delivery: brand voice consistency, color contrast (WCAG AA), typography hierarchy, responsive validation, accessibility, copy quality, link functionality, file format/size checks
2. **BSS-8.2: Per-Category Quality Checklists** -- Brand Identity (7 items), Social Media (6 items), Web Design (8 items), Email (8 items), Motion (7 items), Ads (7 items), automated where possible
3. **BSS-8.3: Revision Management (ClickUp)** -- **[REVISED v1.2]** 3 rounds per deliverable type (CON-14), tracking via ClickUp task comments and custom fields: revision number, items changed, reason, resolution date
4. **BSS-8.4: Training & Enablement Deliverables** -- Brand Usage Training material generation, static site update training, Social Media Training guides, Design System Onboarding for developers, recorded video placeholder (Loom links)

---

### EPIC-BSS-VAL: Internal Validation Program

**Priority:** P0 | **Complexity:** M | **Estimate:** 4-6 weeks
**Description:** **[NEW v1.2]** Validate MVP through 3-5 internal reference projects before commercial launch. Reference projects exercise the full workflow using identical infrastructure, tools, and deliverable formats planned for real clients. Captures learnings for backlog refinement.

**FRs Covered:** FR-11.1-11.6 (NEW)
**NFRs Covered:** NFR-9.10-9.13 (NEW)
**CONs Addressed:** CON-19 (identical infrastructure), CON-20 (validation is not permanent)
**Dependencies:** All MVP epics (EPIC-BSS-1 through EPIC-BSS-8)

**Stories:**

1. **BSS-VAL.1: Reference Project Planning** -- Define 3-5 reference project profiles: (1) new brand (startup, no existing presence), (2) rebrand (existing company, legacy assets), (3) strong digital presence (cleanup/systematization), (4) weak digital presence (significant gaps), (5) Tier 3 simulation (full scope). Assign internal stakeholders as "clients"
2. **BSS-VAL.2: Validation Learnings Registry** -- **[NEW v1.2]** Create structured registry for capturing: gaps identified, process improvements needed, prompt adjustments required, template refinements, checklist updates, operational friction points, product enhancement opportunities. Classification: (A) MVP-blocking fixes, (B) Post-MVP backlog, (C) Client-specific customizations not to be productized (FR-11.4, FR-11.5)
3. **BSS-VAL.3: Reference Project 1 - New Brand** -- Execute full workflow for new brand profile: onboarding (standard mode), discovery, AI draft generation, production, QA gate, revision cycles, final delivery including Brand Book (online + PDF + local package), Landing Page (static HTML)
4. **BSS-VAL.4: Reference Project 2 - Rebrand with Audit** -- Execute full workflow for rebrand profile: onboarding (audit-assisted mode), existing asset analysis, discovery workshop, AI draft generation, production, QA gate, revision cycles, final delivery
5. **BSS-VAL.5: Reference Project 3 - Tier 3 Simulation** -- Execute full workflow simulating Tier 3 scope: all deliverables, extended timeline, full QA cycle, retainer setup. Validates operational capacity
6. **BSS-VAL.6: Additional Reference Projects (2-3)** -- Execute additional reference projects as needed to cover: strong digital presence, weak digital presence, difficult client scenarios (delayed feedback, scope changes, revision loops)
7. **BSS-VAL.7: Learnings Integration & Backlog Update** -- Process Validation Learnings Registry: (A) MVP-blocking fixes applied immediately, (B) Post-MVP items added to backlog with priority, (C) Client-specific items documented but not productized. Update prompts, templates, checklists, and documentation (FR-11.5)
8. **BSS-VAL.8: Validation Completion Criteria** -- Confirm all success criteria met: all 3 delivery formats functional, ClickUp workflow operational, QA checklists validated, prompt templates refined, no MVP-blocking issues remaining. Sign-off for commercial launch

---

### EPIC-BSS-A: Complete Brand Book (MVP Enhancement)

**Priority:** P0 | **Complexity:** M | **Estimate:** 32-50h (adjusted by PM validation)
**Status:** **COMPLETE** (8/8 stories Done, 152 tests passing)
**Description:** **[NEW v1.3]** Fill missing brand identity pages and complete all foundation sub-pages in the brand book. Originated from gap analysis comparing BSS output (~7-9 pages) to AIOX reference (30+ pages). The analysis identified a 63% gap in brand identity and foundation categories. All pages use template-driven approach with curated imagery populated from brand discovery data.

**Source:** `docs/reviews/bss-brand-book-evolution-plan.md` (Aria, Architect)
**PM Validation:** `docs/reviews/bss-evolution-plan-pm-validation.md` (Morgan, CONDITIONAL GO)
**Research:** `docs/research/aiox-brand-book-full-analysis.md`

**FRs Covered:** FR-1.2 (tokens - surfaces, semantic), FR-1.3 (logo system - usage rules), FR-1.6 (icon set - documentation), FR-1.7 (brand book - new pages, navigation), FR-1.8 (brand voice - movement/strategy), FR-1.9 (manifesto - strategy extension)
**NFRs Covered:** NFR-9.1 (local package functionality), NFR-9.2 (relative paths)
**Dependencies:** EPIC-BSS-2

**Stories:**

1. **BSS-A.8: Navigation Enhancement** -- **[Done, 34 tests]** Hierarchical navigation scaffolding with 6 sections, 19 pages, breadcrumbs, JSON-LD, hamburger mobile menu. Built first to enable incremental page additions (PM reordering)
2. **BSS-A.7: About Page Generator** -- **[Done, 22 tests]** Auto-generate About page from brand profile, tech stack (8 BSS tools), 5-phase evolution timeline, team placeholder. Data from brandConfig
3. **BSS-A.4: Surfaces & Borders Page** -- **[Done, 21 tests]** Dedicated page for 8 surface tokens, 5 border tokens, 6 radius tokens, 2 glass effects with visual swatches. Extracted from existing FR-1.2 token schema
4. **BSS-A.5: Semantic Tokens Page** -- **[Done, 22 tests]** Semantic backgrounds, text, glow/neon tokens, interactive states, font weights, shadcn/ui mapping table. From FR-1.2 token schema
5. **BSS-A.6: Icon System Page** -- **[Done, 10 tests]** Grid sizes (16/24/32/48px), icon set preview, rules (2px stroke, round caps), accessibility (44x44px touch), color variants. From FR-1.6
6. **BSS-A.3: Logo Usage Rules Page** -- **[Done, 9 tests]** Clear space (X-unit grid), do's and don'ts, incorrect usage examples, color contexts, file format guide. From FR-1.3
7. **BSS-A.1: Moodboard Page Generator** -- **[Done, 13 tests]** 9 visual references in 4 categories (Web UI, HUD/Dashboard, Graphic/Pattern, Layout/Typography) plus Core Design Principles. Template-driven with curated imagery (PM simplified: no AI image gen dependency)
8. **BSS-A.2: Movement/Strategy Page Generator** -- **[Done, 21 tests]** 8-10 sections: Manifesto, Purpose, Values, Archetype, Positioning, BrandScript, Naming, Vocabulary. Extended from existing FR-1.9 manifesto data (PM scoped: deferred Testimonials, Founders)

---

### EPIC-BSS-C: Templates & SEO (Advanced Features)

**Priority:** P1 (promoted from P2 by PM) | **Complexity:** L | **Estimate:** 26-38h
**Status:** **2/3 stories Done** (65 tests passing)
**Description:** **[NEW v1.3]** Add page templates, SEO guidelines, and editorial strategy to the brand book. Can execute alongside Epic A. Originated from same gap analysis as EPIC-BSS-A.

**Source:** `docs/reviews/bss-brand-book-evolution-plan.md`
**PM Validation:** `docs/reviews/bss-evolution-plan-pm-validation.md`

**FRs Covered:** FR-1.8 (brand voice - editorial strategy), FR-3.7 (SEO metadata - documentation page)
**NFRs Covered:** NFR-9.1 (local package), NFR-9.2 (relative paths)
**Dependencies:** EPIC-BSS-2, EPIC-BSS-A

**Stories:**

1. **BSS-C.1: Templates Page** -- 3 page layout templates: Page Shell (sticky nav, section dividers, footer), Dashboard Grid (bento-style asymmetric 4-column), Content Grid (auto-fit minmax 340px)
2. **BSS-C.2: SEO Documentation Page** -- **[Done, 36 tests]** Meta tags guide, Open Graph properties, Twitter/X Card specifications, JSON-LD schema examples. Generated from FR-3.7 SEO framework and brand profile data
3. **BSS-C.3: Editorial Strategy Page** -- **[Done, 29 tests]** Visual system (brand colors), brand traits, audience personas, editorial strategy. Extended from FR-1.8 Brand Voice Guide

---

### EPIC-BSS-D: Personality-Driven Layouts (AI-Generated)

**Priority:** P1 (enhancement) | **Complexity:** L | **Estimate:** ~28 SP (11 stories across 4 waves)
**Status:** Not started
**Description:** **[NEW v1.4]** Make each brand book, site, and social post visually unique by generating layouts from the brand profile and visual references rather than from predefined templates. The primary mode is AI-generated: an agent researches visual references, analyzes the brand profile, and produces unique layout code. A fallback mode provides 6 predefined layout families with parametric tokens (from the architecture document) when AI generation is unavailable.

**Architecture:** `docs/architecture/personality-driven-layouts.md` (Aria - 15 sections, 5 ADRs)

**Approach (User-Approved):**
1. **AI-Generated (primary):** Agent researches references, analyzes brand profile, generates unique layout code
2. **Family-Based (fallback):** 6 predefined layout families with parametric tokens from architecture document

**Pipeline:**
```
Brand Profile (archetypes, personality, visual_direction)
  --> Visual Reference Research (@analyst) - search 5-10 reference sites per brand
  --> Reference Analysis (@architect) - extract layout patterns into brief
  --> Layout Generation (@dev + brand-book-builder) - generate unique HTML/CSS
```

**FRs Covered:** FR-1.7 (brand book - visual uniqueness), FR-2.7 (AI-assisted generation), FR-3.5 (landing page visual differentiation)
**NFRs Covered:** NFR-2.1 (quality), NFR-9.1-9.5 (static delivery, portability)
**Dependencies:** EPIC-BSS-2 (tokens), EPIC-BSS-A (brand book pages)

**Stories:**

**Wave 1: Visual Research Pipeline (foundation)**

1. **PDL-1: Visual Reference Research Task** (3 SP) -- Create `visual-reference-research.md` task for @analyst. Research 5-10 reference sites per brand by archetype. Output: `visual-references.md` with annotated screenshots, layout patterns, and relevance scoring
2. **PDL-2: Layout Brief Task** (2 SP) -- Create `layout-brief.md` task for @architect. Analyze visual references and brand profile to produce a layout brief with structural recommendations, spacing ratios, visual hierarchy, and composition guidelines. Output: `layout-brief.md`
3. **PDL-3: Brand Book Delivery Workflow Integration** (2 SP) -- Modify `brand-book-delivery.yaml` workflow to include visual reference research and layout brief steps before the generate phase. Ensure pipeline orchestration respects the new stages

**Wave 2: AI-Generated Brand Books**

4. **PDL-4: Brand Book Builder Layout Generation** (3 SP) -- Modify `brand-book-builder.md` agent instructions to generate unique layout code from the layout brief instead of applying fixed templates. Include structural diversity rules (no two brands should share the same layout skeleton)
5. **PDL-5: PoC - Stray Innocence AI-Generated Brand Book** (3 SP) -- Re-generate the Stray Innocence brand book using the full AI-generated pipeline. Validate visual uniqueness, responsive behavior, and brand profile alignment. Compare against template-based version
6. **PDL-6: PoC - Nova Vista Cafe AI-Generated Brand Book** (3 SP) -- Re-generate the Nova Vista Cafe brand book using the full AI-generated pipeline. Validate visual uniqueness, responsive behavior, and brand profile alignment. Compare against template-based version

**Wave 3: Extension to Other Deliverables**

7. **PDL-7: AI-Generated Landing Pages** (3 SP) -- Extend AI-generated layout capability to landing pages. Generate unique landing page layouts from the layout brief, respecting conversion architecture (Hero, Problem, Solution, CTA) while varying visual treatment per brand
8. **PDL-8: Social Posts Visual Treatment** (2 SP) -- Apply visual treatment inspired by the layout brief to social media posts. Adapt spacing, composition, and visual hierarchy from the brand-level brief to post-level templates
9. **PDL-9: Quality Gates for Generated Layouts** (2 SP) -- Automated validation of AI-generated layouts: Lighthouse performance >90, WCAG AA compliance, responsive validation at 375px/768px/1440px breakpoints, visual regression baseline

**Wave 4: Fallback Engine (6 Layout Families)**

10. **PDL-10: Layout Engine with 6 Families** (3 SP) -- Implement `@bss/layout-engine` with 6 predefined layout families from the architecture document as fallback. Each family provides parametric tokens for customization within the family constraints
11. **PDL-11: Fallback Integration in Static Generator** (2 SP) -- Integrate the fallback layout engine into the static-generator pipeline. When AI generation is unavailable (API down, budget exceeded, manual override), automatically select the most appropriate layout family based on brand archetype

**Verification Criteria:**
- @analyst produces `visual-references.md` with 5-10 relevant reference sites per brand
- @architect produces `layout-brief.md` with clear structural recommendations
- Brand books generated via AI pipeline have visually distinct layouts between different brands
- Quality gate: Lighthouse >90 performance, WCAG AA, responsive at 375px/768px/1440px
- Fallback (6 layout families) functions correctly when AI generation is unavailable

**Impact on Agents:**
- **@analyst:** New task `visual-reference-research`
- **@architect:** New task `layout-brief`
- **brand-book-builder (Paige):** Generate unique layout (not template-based)
- **@dev:** For sites/LPs, generate from brief

---

### EPIC-BSS-B: Design System Layer (Post-MVP)

**Priority:** P2 | **Complexity:** XL | **Estimate:** 178-238h
**Status:** Not started (blocked by EPIC-BSS-9)
**Description:** **[NEW v1.3]** Add components, patterns, motion, VFX, and advanced sections to the brand book. This is the largest evolution epic, adding 14 new pages with 60+ UI components, 31 patterns, 8 motion animations, 21 VFX effects, and 19 marketing section templates. Requires Figma Component Library (EPIC-BSS-9) as hard dependency.

**Source:** `docs/reviews/bss-brand-book-evolution-plan.md`

**FRs Covered:** FR-1.2 (tokens - motion, VFX), FR-1.11 (component library documentation)
**NFRs Covered:** NFR-3.4 (Figma Auto Layout)
**Dependencies:** EPIC-BSS-9 (Figma Component Library), EPIC-BSS-A (brand book pages foundation)

**Stories:** (to be drafted by @sm when EPIC-BSS-9 begins)

1. **BSS-B.1: Motion System Page** -- 8 animations (Framer Motion): Orchestration Pulse, Speed Lines, Particle Orbit, Logo Dissolve, Morphing Square, Glitch Reveal, Stagger Letters, Brand Reveal (16-20h)
2. **BSS-B.2: Component Page Generator** -- Generic component page generator: reads schema from Figma library, generates HTML with variants, sizes, states, code examples. Produces 10 pages by parameterization (8-12h + 1-2h per page)
3. **BSS-B.3: Charts Library Page** -- 13 chart types with interactive examples and data visualization tokens (24-32h)
4. **BSS-B.4: Marketing Sections Page** -- 19 reusable marketing sections: Hero, Stats, Problem Gallery, Services, How It Works, Case Study, Testimonials, Pricing, FAQ, etc. (20-28h)
5. **BSS-B.5: Effects Page** -- Ticker Strip, Badge Variants, Glow/Pulse, Hover Effects (8-12h)
6. **BSS-B.6: Patterns Library Page** -- 31 patterns in 6 categories: Grid, HUD Frames, Hazard/Warning, Circuit Traces, Textures, Dividers (16-24h)
7. **BSS-B.7: VFX System Page** -- 21 effects in 5 categories: Film Grain, Blend Modes, Blur, Glow, Overlay Composites (12-16h)

---

### EPIC-BSS-9: Figma Component Library & Design System Export

**Priority:** P1 | **Complexity:** L | **Estimate:** 3-4 weeks
**Description:** Create the template-based Figma component library (60+ base components, 200-400 variants) that gets token-swapped per client. Export pipeline for React baseline. All logos human-designed (CON-15).

**FRs Covered:** FR-1.11
**NFRs Covered:** NFR-3.4, NFR-3.6
**CONs Addressed:** CON-13 (code pushes to Figma), CON-15 (logos never AI-generated)

**Stories:**

1. **BSS-9.1: Primitive Components** -- Button, Input, Select, Checkbox, Radio, Toggle with size/state/config variants, Auto Layout, token-driven styling
2. **BSS-9.2: Feedback & Navigation Components** -- Alert, Toast, Badge, Progress, Skeleton, Spinner, Navbar, Sidebar, Tabs, Breadcrumbs, Pagination, Menu
3. **BSS-9.3: Data Display & Layout Components** -- Table, Card, List, Avatar, Tag, Tooltip, Popover, Container, Grid, Stack, Divider, Spacer
4. **BSS-9.4: Overlay, Forms & Advanced Components** -- Modal, Drawer, Command Palette, Date/Time Picker, File Upload, Accordion, Stepper, Timeline, Tree View, Data Chart, Code Block
5. **BSS-9.5: Token Integration via Tokens Studio** -- Code-to-Figma push pipeline (unidirectional per CON-13), Tokens Studio Pro plugin configuration, per-client token swap automation
6. **BSS-9.6: Component Code Export Pipeline** -- Figma plugin baseline React export, human refinement workflow, props/logic documentation, embedded usage instructions per NFR-3.6

---

### EPIC-BSS-10: Observability, Analytics & Cost Tracking

**Priority:** P1 | **Complexity:** M | **Estimate:** 2-3 weeks
**Description:** **[REVISED v1.2]** Build observability using ClickUp dashboards and simple monitoring. Advanced observability dashboard deferred to Phase 2.

**FRs Covered:** FR-8.6 (revised - ClickUp-based)
**NFRs Covered:** NFR-6.1-6.5 (revised - simplified), NFR-4.1-4.2

**Stories:**

1. **BSS-10.1: AI API Call Logging** -- Structured logs: timestamp, client_id, agent type, input/output tokens, cost, latency, success/failure, aggregated per client for cost tracking
2. **BSS-10.2: ClickUp Client Metrics** -- **[REVISED v1.2]** Configure ClickUp dashboard widgets for per-client metrics: project timeline (planned vs actual), deliverables status, approval velocity, change requests
3. **BSS-10.3: Simple Health Monitoring** -- **[REVISED v1.2]** Basic monitoring via ClickUp dashboard: active projects count, monthly costs summary, error rate (24h), services status checks (manual or via simple script)
4. **BSS-10.4: Performance Monitoring** -- Core Web Vitals tracking (LCP, FID, CLS) for Brand Book sites and Landing Pages via Lighthouse CI or free monitoring, targets: LCP <2.5s, FID <100ms, CLS <0.1

---

### EPIC-BSS-11: Email Marketing (Pillar 4) -- POST-MVP

**Priority:** P2 | **Complexity:** M | **Estimate:** 3-4 weeks
**Description:** Email template suite using react-email + Resend API, welcome sequences, transactional templates, promotional templates, email signatures, A/B testing for subject lines.

**FRs Covered:** FR-4.1-4.7
**NFRs Covered:** NFR-2.5

**Stories:**

1. **BSS-11.1: Newsletter Template Engine** -- react-email templates (600px max, <102KB), responsive for 320-480px, sections: pre-header, header, hero, content blocks, CTA, social, footer
2. **BSS-11.2: Welcome Email Sequence** -- 5-email automated sequence (Day 0, +2, +4, +7, +10), 150-400 words each, 3 subject line options per email
3. **BSS-11.3: Transactional Email Templates** -- Confirmation, password reset, order confirmation, invoice, delivery status, table-based HTML for client compatibility
4. **BSS-11.4: Promotional Templates & Signatures** -- Product Launch, Promotion, Event, Seasonal, Re-engagement templates + HTML email signature (600px, 150-200px height)
5. **BSS-11.5: ESP Integration & A/B Testing** -- Resend API integration (primary), Brevo fallback, subject line A/B testing with 3 variants (8 formulas)

---

### EPIC-BSS-12: Ads Criativos (Pillar 5) -- POST-MVP

**Priority:** P2 | **Complexity:** M | **Estimate:** 3-4 weeks
**Description:** Ad creative generation for Meta, Google Display, Google Search, YouTube, LinkedIn, TikTok, Pinterest, X/Twitter. A/B testing pipeline and pixel/tracking setup documentation.

**FRs Covered:** FR-5.1-5.8

**Stories:**

1. **BSS-12.1: Meta Ads Creative Sets** -- Facebook/Instagram formats (7 sizes), 3-5 copy variants per creative (short/medium/long), 5 angles (Dor, Desejo, Curiosidade, Prova, Autoridade)
2. **BSS-12.2: Google Display & Search Ads** -- IAB standard sizes (9 formats), Responsive Display Ads (headlines + descriptions + images), Responsive Search Ads (10+ headlines, 4+ descriptions)
3. **BSS-12.3: YouTube & Video Platform Ads** -- TrueView In-Stream, Bumper, Discovery Thumbnail, Companion Banner templates
4. **BSS-12.4: LinkedIn, TikTok, Pinterest, X/Twitter Ads** -- Platform-specific formats and sizes
5. **BSS-12.5: Ad Copy A/B Testing & Tracking Setup** -- 2-3 variants per campaign, auto-generation across headline/text/visual/CTA, Pixel/tracking setup documentation (Meta Pixel, Google Ads, UTM strategy)

---

### EPIC-BSS-13: Video & Motion Graphics (Pillar 6) -- POST-MVP

**Priority:** P2 | **Complexity:** L | **Estimate:** 4-5 weeks
**Description:** Video production pipeline using Remotion 4.x (React-based) and Remotion Lambda for serverless rendering. Logo animations, intros/outros, social motion templates, lower thirds, transitions, explainer videos, GIF/sticker packs.

**FRs Covered:** FR-6.1-6.8

**Stories:**

1. **BSS-13.1: Remotion Setup & Motion Token Integration** -- Configure Remotion 4.x with brand token injection (colors, fonts, motion.easing, motion.duration), Remotion Lambda for serverless rendering
2. **BSS-13.2: Logo Animation (2D)** -- 3-5 second reveal, 1920x1080 at 30/60fps, MP4/MOV/GIF/Lottie exports, seamless loop variant, quick stinger
3. **BSS-13.3: Video Intro/Outro Templates** -- YouTube intro (5-10s), outro (15-20s with end cards), brand token integration
4. **BSS-13.4: Social Media Motion Templates** -- Story Animated, Post Animated, Reel/TikTok, Carousel Animated, Quote Animation, Countdown, all with MP4 export
5. **BSS-13.5: Lower Thirds, Overlays & Transitions** -- Lower Third Name/Title, Subscribe Button, Social Icons, Bug/Watermark, Progress Bar, 4-6 custom transitions with alpha channel
6. **BSS-13.6: Explainer Video Pipeline (Premium)** -- Script generation (Claude), voiceover (ElevenLabs), asset assembly, animation (Remotion), background music, final export (MP4/WebM)
7. **BSS-13.7: GIF/Sticker Packs** -- Reaction GIFs (5-8), Sticker Pack (10-15), Loading Animation, Animated Emoji, GIPHY/Tenor optimization

---

### EPIC-BSS-14: Corporate Materials (Pillar 7) -- POST-MVP

**Priority:** P2 | **Complexity:** M | **Estimate:** 2-3 weeks
**Description:** Corporate material templates: pitch deck, commercial proposal, business cards, stationery suite, email signature, institutional presentation, one-pager, case study. Print-ready exports (CMYK, 300 DPI, bleed marks).

**FRs Covered:** FR-7.1-7.8
**CONs Addressed:** CON-7 (print-ready files only, no print coordination)

**Stories:**

1. **BSS-14.1: Pitch Deck Template** -- 16:9, 1920x1080, 15-25 slides with master layouts, export as Figma/PPTX/Google Slides/Keynote/PDF
2. **BSS-14.2: Commercial Proposal Template** -- A4/US Letter, 8-15 pages, structured sections, export as Figma/InDesign/DOCX/PDF
3. **BSS-14.3: Business Cards & Stationery Suite** -- Business card (90x50mm, 300 DPI, 3mm bleed), letterhead, envelopes, folder, invoice, stamp, badge, certificate, all print-ready
4. **BSS-14.4: Presentation, One-Pager & Case Study** -- Institutional presentation (20-40 slides), One-Pager/Executive Summary (single A4), Case Study template (4-6 pages)

---

### EPIC-BSS-15: Client Portal & Multi-Tenant (Phase 2)

**Priority:** P3 | **Complexity:** L | **Estimate:** 5-6 weeks
**Description:** **[NEW v1.2]** Phase 2 infrastructure upgrade: build proprietary Client Portal and multi-tenant architecture when scaling beyond 40 clients. Includes Supabase RLS, subdomain routing with runtime token injection, advanced security hardening.

**FRs Covered:** FR-1.12 (multi-tenant subdomain), FR-8.1 (proprietary portal)
**NFRs Covered:** NFR-2.6 (RLS), NFR-5.1 (proprietary auth), NFR-8.2-8.4 (advanced security)
**Dependencies:** EPIC-BSS-VAL (validation complete)

**Stories:**

1. **BSS-15.1: Supabase Schema & Multi-Tenant Data Model** -- Design and implement database schema (clients, tenants, users, brand_profiles) with tenant_id on all tables, create migration files
2. **BSS-15.2: RLS Policies & Tenant Isolation** -- Implement Row Level Security policies on all tables, tenant context injection via JWT claims, cross-tenant access prevention
3. **BSS-15.3: RLS Automated Test Suite** -- Create integration tests covering SELECT/INSERT/UPDATE/DELETE on all tenant-scoped tables, positive and negative scenarios, CI/CD integration
4. **BSS-15.4: Supabase Auth & Magic Link Login** -- Configure passwordless authentication with magic link email, user-tenant association, session management
5. **BSS-15.5: Multi-Tenant Subdomain Routing** -- Implement Next.js middleware for tenant resolution from hostname (acme.brand.aioxsquad.ai), runtime token loading from R2 with caching, CSS variable injection
6. **BSS-15.6: Portal Shell & Navigation** -- Next.js app at /portal/{client-slug}/, authenticated routes, sidebar navigation (Dashboard, Brand Book, Assets, Review, History, Settings)
7. **BSS-15.7: Project Dashboard** -- Project overview, timeline, deliverables status, recent activity, upcoming milestones
8. **BSS-15.8: Asset Download Center** -- Organized by type/category, signed R2 URLs, batch download as ZIP, file format filters
9. **BSS-15.9: Advanced Security Hardening** -- Rate limiting (100 RPM per user, 50 downloads/hr), HMAC webhook validation, advanced abuse detection
10. **BSS-15.10: Migration from ClickUp** -- Data migration from ClickUp to Portal, client communication, transition support

---

## Summary Statistics

| Category | Count |
|----------|-------|
| Total Epics | 20 |
| MVP Epics (P0) | 10 (including VAL + BSS-A) |
| Enhancement Epics (P1) | 4 (BSS-9, BSS-10, BSS-C, BSS-D) |
| Expansion Epics (P2) | 5 (BSS-11 to BSS-14 + BSS-B) |
| Phase 2 Epics (P3) | 1 |
| Total Stories (all epics) | 113 |
| MVP Stories | 64 (56 original + 8 BSS-A) |
| Post-MVP Stories | 49 (28 original + 3 BSS-C + 7 BSS-B + 11 BSS-D) |

### FR/NFR Coverage Matrix (v1.4)

| Requirement Range | Epic(s) |
|-------------------|---------|
| FR-1.1 to FR-1.13 | EPIC-BSS-2, EPIC-BSS-7, EPIC-BSS-9, EPIC-BSS-15, **EPIC-BSS-A**, **EPIC-BSS-B**, **EPIC-BSS-D** (FR-1.7 visual uniqueness) |
| FR-2.1 to FR-2.10 | EPIC-BSS-3, EPIC-BSS-4, **EPIC-BSS-D** (FR-2.7 AI-assisted generation) |
| FR-3.1 to FR-3.10 | EPIC-BSS-5, **EPIC-BSS-C** (FR-3.7 SEO docs), **EPIC-BSS-D** (FR-3.5 LP visual differentiation) |
| FR-4.1 to FR-4.7 | EPIC-BSS-11 |
| FR-5.1 to FR-5.8 | EPIC-BSS-12 |
| FR-6.1 to FR-6.8 | EPIC-BSS-13 |
| FR-7.1 to FR-7.8 | EPIC-BSS-14 |
| FR-8.1 to FR-8.10 | EPIC-BSS-1, EPIC-BSS-6, EPIC-BSS-7, EPIC-BSS-8, EPIC-BSS-15 |
| FR-9.1 to FR-9.3 | EPIC-BSS-3 |
| FR-10.1 to FR-10.5 (NEW) | EPIC-BSS-7 |
| FR-11.1 to FR-11.6 (NEW) | EPIC-BSS-VAL |
| NFR-1.x (Performance) | EPIC-BSS-1, EPIC-BSS-3, EPIC-BSS-4 |
| NFR-2.x (Quality) | EPIC-BSS-2, EPIC-BSS-5, EPIC-BSS-15, **EPIC-BSS-D** (NFR-2.1) |
| NFR-3.x (Usability) | EPIC-BSS-2, EPIC-BSS-6, EPIC-BSS-7, EPIC-BSS-9 |
| NFR-4.x (Cost) | EPIC-BSS-3, EPIC-BSS-10 |
| NFR-5.x (Security) | EPIC-BSS-1, EPIC-BSS-15 |
| NFR-6.x (Observability) | EPIC-BSS-1, EPIC-BSS-10 |
| NFR-7.x (Documentation) | EPIC-BSS-8 |
| NFR-8.x (Security Hardening) | EPIC-BSS-3, EPIC-BSS-15 |
| NFR-9.x (NEW - Static & Validation) | EPIC-BSS-2, EPIC-BSS-5, EPIC-BSS-6, EPIC-BSS-7, EPIC-BSS-VAL, **EPIC-BSS-D** (NFR-9.1-9.5) |
| CON-1 to CON-22 | Distributed across relevant epics |

### Evolution Plan Traceability (v1.3)

| Evolution Plan Item | Where Addressed |
|---------------------|----------------|
| Brand identity pages gap (63%) | EPIC-BSS-A (7 new pages: Moodboard, Movement, Logo Usage, Surfaces, Semantic Tokens, Icons, About) |
| Design system layer gap (100%) | EPIC-BSS-B (14 new pages: components, patterns, motion, VFX, sections) |
| Templates & SEO gap (75%) | EPIC-BSS-C (3 new pages: Templates, SEO, Editorial) |
| Navigation enhancement | BSS-A.8 (hierarchical nav, breadcrumbs, JSON-LD) |
| Moodboard simplification (no AI image gen) | BSS-A.1 (template-driven, curated imagery per PM validation) |
| Movement/Strategy scope reduction (13→8-10 sections) | BSS-A.2 (deferred Testimonials, Founders per PM validation) |

### PRD v1.2 Change Traceability

| PRD v1.2 Change | Where Addressed |
|-----------------|----------------|
| ClickUp instead of Client Portal (FR-8.1 revised) | EPIC-BSS-6 (complete rewrite), EPIC-BSS-15 (portal deferred) |
| Static-first architecture (FR-1.7, FR-3.5, FR-3.6 revised) | EPIC-BSS-2 (triple delivery), EPIC-BSS-5 (static-first) |
| Brand Book triple delivery (FR-1.7 revised) | EPIC-BSS-2 (BSS-2.6, BSS-2.7, BSS-2.8) |
| Audit-Assisted Onboarding (FR-10.1-10.5 NEW) | EPIC-BSS-7 (BSS-7.2, BSS-7.3, BSS-7.4, BSS-7.5) |
| Internal Validation Program (FR-11.1-11.6 NEW) | EPIC-BSS-VAL (new epic) |
| Multi-tenant deferred to Phase 2 (FR-1.12 revised) | EPIC-BSS-15 (new epic), EPIC-BSS-1 (simplified) |
| New NFRs 9.x (Static & Validation) | EPIC-BSS-2, BSS-5, BSS-6, BSS-7, BSS-VAL |
| New CONs 16-22 (MVP Simplification) | Distributed across relevant epics |

---

## Changelog

### v1.4 (2026-04-02) -- Personality-Driven Layouts Epic

Added EPIC-BSS-D for AI-generated personality-driven layouts. Each brand deliverable (brand book, site, social post) will have a visually unique layout generated from the brand profile and visual references, rather than applied from predefined templates.

**NEW EPIC:**

1. **EPIC-BSS-D added (P1, Not Started):** Personality-Driven Layouts with 11 stories across 4 waves, ~28 SP estimate. Two modes: AI-generated (primary, via visual reference research + layout brief pipeline) and family-based fallback (6 layout families from architecture document). Architecture: `docs/architecture/personality-driven-layouts.md` (Aria, 15 sections, 5 ADRs). User-approved pipeline: Brand Profile --> @analyst visual reference research --> @architect layout brief --> @dev/@brand-book-builder unique layout generation.

**OTHER CHANGES:**

- Wave 5c added to Execution Sequence for EPIC-BSS-D
- Dependency Graph updated to v1.4 with BSS-D under BSS-A
- Summary Statistics updated: 19 --> 20 epics, 102 --> 113 stories
- FR/NFR Coverage Matrix updated with BSS-D references (FR-1.7, FR-2.7, FR-3.5, NFR-2.1, NFR-9.1-9.5)
- Header updated with Architecture (PDL) document reference
- Next Steps updated with BSS-D story drafting

**SCOPE IMPACT:**

| Metric | v1.3 | v1.4 | Delta |
|--------|------|------|-------|
| Total Epics | 19 | 20 | +1 (BSS-D) |
| Enhancement Epics (P1) | 3 | 4 | +1 (BSS-D) |
| Total Stories | 102 | 113 | +11 |
| Post-MVP Stories | 38 | 49 | +11 (BSS-D) |
| Estimated SP (BSS-D) | 0 | ~28 | +28 |

**AGENT IMPACT:**

- @analyst: New task `visual-reference-research` (PDL-1)
- @architect: New task `layout-brief` (PDL-2)
- brand-book-builder (Paige): Modified to generate unique layout from brief (PDL-4)
- @dev: Sites/LPs generated from brief (PDL-7)

### v1.3 (2026-04-01) -- Brand Book Evolution Epics (No Invention Audit)

Added 3 new epics (A, B, C) from the Brand Book Evolution Plan. These epics were already planned, PM-validated ("CONDITIONAL GO"), and partially implemented (Epic A complete, Epic C 2/3 done) but were missing from the epic map — identified during No Invention audit (Article IV).

**NEW EPICS:**

1. **EPIC-BSS-A added (P0, COMPLETE):** Complete Brand Book (MVP Enhancement) with 8 stories, 8 Done (152 tests). Fills 63% gap in brand identity and foundation pages. Originated from `docs/reviews/bss-brand-book-evolution-plan.md` (Aria) + PM validation (Morgan, CONDITIONAL GO). All stories trace to existing FRs (1.2, 1.3, 1.6, 1.7, 1.8, 1.9).

2. **EPIC-BSS-C added (P1, 2/3 Done):** Templates & SEO (Advanced Features) with 3 stories, 2 Done (65 tests). Adds SEO documentation and editorial strategy pages. Traces to FR-3.7 and FR-1.8.

3. **EPIC-BSS-B added (P2, Not Started):** Design System Layer (Post-MVP) with 7 stories planned, 178-238h estimate. Adds components, patterns, motion, VFX (14 new pages). Blocked by EPIC-BSS-9 (Figma Component Library). Story files to be drafted by @sm when dependency is met.

**OTHER CHANGES:**

- Wave 5b added to Execution Sequence for EPIC-BSS-A and EPIC-BSS-C
- Dependency Graph updated to v1.3 with new epic relationships
- Summary Statistics updated: 16 → 19 epics, 84 → 102 stories
- FR/NFR Coverage Matrix updated with new epic references
- Evolution Plan Traceability section added
- Header updated with Evolution Plan and PM Validation references

**SCOPE IMPACT:**

| Metric | v1.2 | v1.3 | Delta |
|--------|------|------|-------|
| Total Epics | 16 | 19 | +3 (A, B, C) |
| MVP Epics (P0) | 9 | 10 | +1 (BSS-A) |
| Total Stories | 84 | 102 | +18 |
| MVP Stories | 56 | 64 | +8 (BSS-A) |
| Tests Added (A+C) | 0 | 217 | +217 (152 + 65) |

**AUDIT FINDINGS ADDRESSED:**
- Epic map now reflects all implemented work
- All new epics have FR traceability documented
- Decision trail (research → architect → PM) linked in header

### v1.2 (2026-03-09) -- PRD v1.2 MVP Simplification Alignment

Comprehensive update to align with PRD v1.2 MVP Simplification Release. Major architectural changes.

**MAJOR CHANGES:**

1. **EPIC-BSS-1 simplified (XL -> L, 4-5 weeks -> 2-3 weeks):** Removed multi-tenant subdomain routing, Supabase RLS, proprietary auth. Now focuses on R2 storage, static hosting, basic security. Complex infrastructure deferred to EPIC-BSS-15.

2. **EPIC-BSS-2 updated for triple delivery:** Added stories BSS-2.8 (Local Package) for index.html-openable brand book. BSS-2.6 revised for static HTML/CSS/JS output. NFR-9.1-9.5 coverage added.

3. **EPIC-BSS-5 revised to static-first:** Landing Pages and Sites now default to static HTML/CSS/JS. CMS (Payload) is optional (BSS-5.6). Added BSS-5.8 (Static Package Export). NFR-9.3, NFR-9.5 coverage added.

4. **EPIC-BSS-6 completely rewritten:** Was "Client Portal & Approval Workflow", now "ClickUp Operations & Approval Workflow". All stories replaced with ClickUp configuration stories. Complexity reduced L -> M, estimate reduced 3-4 -> 2-3 weeks.

5. **EPIC-BSS-7 expanded for audit-assisted mode (L -> L+, 3-4 -> 4-5 weeks):** Added 5 new stories (BSS-7.2 through BSS-7.6) for automated digital presence audit per FR-10.1-10.5. NFR-9.6-9.9 coverage added.

6. **EPIC-BSS-VAL added (new epic):** Internal Validation Program with 8 stories covering 3-5 reference projects. Addresses FR-11.1-11.6 and NFR-9.10-9.13. 4-6 week estimate.

7. **EPIC-BSS-15 added (new epic, Phase 2):** Proprietary Client Portal and multi-tenant infrastructure deferred from BSS-1. 10 stories covering Supabase RLS, subdomain routing, portal UI, migration from ClickUp. 5-6 week estimate.

**SCOPE IMPACT:**

| Metric | v1.1 | v1.2 | Delta |
|--------|------|------|-------|
| Total Epics | 14 | 16 | +2 |
| MVP Epics (P0) | 8 | 9 | +1 (VAL added) |
| MVP Timeline | 16-20 weeks | 14-18 weeks | -2 weeks (simpler infra) |
| MVP Effort | 800-1000 hours | 650-800 hours | -150-200 hours |
| Total Stories | 68 | 84 | +16 |
| MVP Stories | 48 | 56 | +8 |

**WAVE SEQUENCE CHANGES:**

- Wave 1: BSS-1 + BSS-6 (ClickUp) now parallel
- Wave 3: Reduced from 3 to 2 parallel epics (Portal moved to ClickUp in Wave 1)
- Wave 5: NEW - Validation Program (BSS-VAL)
- Wave 8: NEW - Phase 2 Infrastructure (BSS-15)

### v1.1 (2026-03-05) -- Architect Review Incorporation

Incorporated all 10 recommendations from the Architect Review (`docs/review-epic-decomposition.md`, verdict: GO WITH ADJUSTMENTS).

**HIGH PRIORITY changes:**
1. BSS-8 promoted P1 -> P0
2. BSS-1 gate markers added
3. BSS-3 estimate adjusted L -> L+ (4-5 weeks)
4. BSS-7 estimate adjusted M -> L (3-4 weeks)
5. BSS-7 dependency narrowed to BSS-6.1 only

**MEDIUM PRIORITY changes:**
6. Team size assumption documented
7. BSS-5.1 POC validation added
8. BSS-1.2 prioritized as first story

### v1.0 (2026-03-04) -- Initial Epic Map

Initial decomposition of PRD v1.1 into 14 epics (68 stories) across 6 execution waves. All 5 Architect PRD review conditions incorporated.

---

**Next Steps:**
- Complete BSS-C.1 (Templates page) -- last remaining story in EPIC-BSS-C
- Delegate to @sm for PDL-1 through PDL-11 story file drafting (EPIC-BSS-D, 11 stories)
- Delegate to @sm for BSS-VAL story drafting (7 remaining: BSS-VAL.2 through BSS-VAL.8)
- Delegate to @sm for BSS-2.x story file creation (retroactive -- 9 stories referenced in epic map but no story files exist)
- Begin EPIC-BSS-9 (Figma Components) to unblock EPIC-BSS-B
- Delegate to @architect for static-first architecture and build pipeline design
- Configure ClickUp workspace structure (EPIC-BSS-6)
- Plan reference projects for validation program (EPIC-BSS-VAL)

--- Pax, equilibrando prioridades
