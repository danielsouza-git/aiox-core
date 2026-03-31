# Story BSS-1.1: Project Scaffold & Tech Stack Setup

**Status:** Done
**Epic:** EPIC-BSS-1 — Foundation & Simplified Infrastructure
**Priority:** P0
**Complexity:** Medium (M)
**Story Points:** 3 SP
**Created:** 2026-03-16
**Dependencies:** None (first story in epic)
**Blocks:** BSS-1.2, BSS-1.3, BSS-1.4, BSS-1.5, BSS-1.6, BSS-1.7

---

## Executor Assignment

```yaml
executor: "@dev"
quality_gate: "@architect"
quality_gate_tools: ["code-review", "architecture-validation", "dependency-audit"]
```

---

## Story

**As a** Brand System Service developer,
**I want** a properly scaffolded project with pnpm monorepo, TypeScript, Tailwind, ESLint, and static hosting configuration,
**so that** all subsequent BSS stories have a consistent, working foundation with enforced code quality standards.

---

## Acceptance Criteria

- [x] 1. **Monorepo Structure**: Project initialized with pnpm workspaces supporting packages: `@bss/core`, `@bss/tokens`, `@bss/creative`, `@bss/static-generator`
- [x] 2. **TypeScript Configuration**: TypeScript 5.x with strict mode, path aliases (`@bss/*`), composite project references for all packages
- [x] 3. **Static Site Generator Support**: Static HTML/CSS/JS build pipeline as default per ADR-001; Next.js is OPTIONAL (not installed); build scripts for brand-book, landing-page, site
- [x] 4. **Tailwind CSS Setup**: Tailwind CSS 3.x configured with CSS Custom Properties from Style Dictionary; token references mapped to theme (colors, fonts, spacing)
- [x] 5. **ESLint & Prettier**: ESLint flat config with `@typescript-eslint`, `eslint-plugin-jsx-a11y` (WCAG AA), `eslint-plugin-import`, Prettier integration
- [x] 6. **Git Hooks**: Husky + lint-staged pre-commit hook running ESLint --fix + Prettier on staged files
- [x] 7. **Static Hosting Configuration**: `vercel.json` and `netlify.toml` with security headers, asset caching, custom domain CNAME documentation
- [x] 8. **Build Scripts**: Root `package.json` with: `dev`, `build`, `build:brand-book`, `build:landing-page`, `build:site`, `type-check`, `lint`, `test`, `clean`
- [x] 9. **Environment Variables**: `.env.example` with all required vars documented (R2, AI APIs, Sentry, ClickUp); `.env` in `.gitignore`; dotenv loading via `@bss/core`
- [x] 10. **README & Documentation**: Project overview, monorepo structure, setup instructions, deployment workflow, contribution guidelines

---

## 🤖 CodeRabbit Integration

> **CodeRabbit Integration**: Enabled

### Story Type Analysis

**Primary Type**: Infrastructure / Scaffold
**Secondary Type(s)**: Developer Experience, Tooling
**Complexity**: Medium — affects all subsequent stories, but scope is well-defined

### Specialized Agent Assignment

**Primary Agents**:
- @dev (scaffold implementation and tooling)
- @architect (architecture validation, tech stack decisions)

**Supporting Agents**:
- @qa (linting and test infrastructure validation)
- @devops (git hooks and CI/CD groundwork)

### Quality Gate Tasks

- [x] Pre-Commit (@dev): Run before marking story complete
- [x] Architecture Review (@architect): Validate monorepo structure and ADR-001 compliance

### Self-Healing Configuration

**Expected Self-Healing**:
- Primary Agent: @dev (light mode)
- Max Iterations: 2
- Timeout: 15 minutes
- Severity Filter: CRITICAL

**Predicted Behavior**:
- CRITICAL issues: auto_fix (dependency vulnerabilities, type safety gaps)
- HIGH issues: document_only (linting gaps, missing a11y rules)

### CodeRabbit Focus Areas

**Primary Focus**:
- TypeScript strict mode properly configured (no `any`, no `strictNullChecks` disabled)
- No hardcoded secrets in source files

**Secondary Focus**:
- ESLint accessibility rules (jsx-a11y WCAG AA minimum)
- Static-first enforcement: no runtime SSR dependencies installed

---

## Tasks / Subtasks

- [x] Task 1: Initialize pnpm monorepo with `pnpm-workspace.yaml` (AC: 1)
- [x] Task 2: Configure TypeScript 5.x with strict mode and composite project refs (AC: 2)
- [x] Task 3: Set up static build pipeline (Node.js scripts, no Next.js) (AC: 3)
- [x] Task 4: Configure Tailwind CSS 3.x with PostCSS and CSS Custom Properties (AC: 4)
- [x] Task 5: Configure ESLint flat config with TypeScript, jsx-a11y, Prettier (AC: 5)
- [x] Task 6: Install and configure Husky + lint-staged pre-commit hook (AC: 6)
- [x] Task 7: Create `vercel.json` and `netlify.toml` with security headers (AC: 7)
- [x] Task 8: Define all npm scripts in root `package.json` (AC: 8)
- [x] Task 9: Create `.env.example` and configure dotenv in `@bss/core` (AC: 9)
- [x] Task 10: Write `README.md` with setup and deployment docs (AC: 10)

---

## Dev Notes

### Implementation State

**COMPLETE** — All 10 ACs implemented and QA passed (2026-03-15).

### Architecture References

- **ADR-001 (Static-First)**: Default build path is Node.js scripts + Style Dictionary. Next.js is optional and NOT installed.
- **ADR-008 (Flexible Static Hosting)**: Both Vercel and Netlify supported. Platform-agnostic `output/` directory.
- [AUTO-DECISION] Used ESLint flat config (`eslint.config.js`) instead of legacy `.eslintrc.js` — parent repo already uses flat config.
- [AUTO-DECISION] Used `Bundler` moduleResolution (not `Node16`) for better workspace package resolution.

### Key File Locations

```
brand-system-service/
  package.json                 # Root monorepo with workspace scripts
  pnpm-workspace.yaml          # pnpm workspace config: packages/*
  tsconfig.json                # Root TS config: strict, path aliases, project refs
  eslint.config.js             # ESLint flat config
  .prettierrc                  # Prettier: 2-space, single quotes, semicolons
  tailwind.config.ts           # Tailwind: CSS Custom Properties token integration
  postcss.config.js            # PostCSS config for Tailwind
  vercel.json                  # Vercel static deploy + security headers
  netlify.toml                 # Netlify static deploy + custom domain docs
  .env.example                 # All env vars documented
  .gitignore                   # Excludes .env, node_modules, output/
  .husky/pre-commit            # Pre-commit: lint-staged
  README.md                    # Full project documentation
  packages/core/               # @bss/core: config, errors, logger
  packages/tokens/             # @bss/tokens: token engine (placeholder for BSS-2.x)
  packages/creative/           # @bss/creative: creative pipeline (placeholder for BSS-4.x)
  packages/static-generator/   # @bss/static-generator: static site gen (placeholder for BSS-5.x)
```

### Testing

Tests were structural (no runtime test suite for scaffold story):
- `pnpm type-check` — zero TypeScript errors
- `pnpm lint` — zero ESLint errors
- `pnpm build` — all 4 packages compile successfully
- Pre-commit hook triggers correctly

---

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2026-03-16 | 1.0 | Formal story creation for `docs/stories/active/` | River (SM) |

---

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (claude-opus-4-6)

### Completion Notes List

- Story implemented and QA passed. See `docs/stories/epic-bss-1/1.1.project-scaffold-tech-stack.md` for full implementation record.

### File List

**Root configs:** `brand-system-service/package.json`, `pnpm-workspace.yaml`, `tsconfig.json`, `eslint.config.js`, `.prettierrc`, `.prettierignore`, `tailwind.config.ts`, `postcss.config.js`, `vercel.json`, `netlify.toml`, `.env.example`, `.gitignore`, `.husky/pre-commit`, `README.md`

**@bss/core:** `packages/core/package.json`, `packages/core/tsconfig.json`, `packages/core/src/index.ts`, `packages/core/src/config.ts`, `packages/core/src/errors.ts`, `packages/core/src/logger.ts`

**@bss/tokens:** `packages/tokens/package.json`, `packages/tokens/tsconfig.json`, `packages/tokens/src/index.ts`, `packages/tokens/src/token-engine.ts`

**@bss/creative:** `packages/creative/package.json`, `packages/creative/tsconfig.json`, `packages/creative/src/index.ts`, `packages/creative/src/creative-pipeline.ts`

**@bss/static-generator:** `packages/static-generator/package.json`, `packages/static-generator/tsconfig.json`, `packages/static-generator/src/index.ts`, `packages/static-generator/src/static-generator.ts`
