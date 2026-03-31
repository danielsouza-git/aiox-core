# Story BSS-1.6: Static Hosting Configuration

**Status:** Done
**Epic:** EPIC-BSS-1 — Foundation & Simplified Infrastructure
**Priority:** P0
**Complexity:** Medium (M)
**Story Points:** 3 SP
**Created:** 2026-03-16
**Dependencies:** BSS-1.1 (Project Scaffold — Done, vercel.json and netlify.toml exist)
**Blocks:** BSS-2.6 (Brand Book Static Site Generator), BSS-5.1 (Static Site Build Pipeline)

---

## Executor Assignment

```yaml
executor: "@dev"
quality_gate: "@devops"
quality_gate_tools: ["deployment-validation", "code-review", "ci-cd-audit"]
```

---

## Story

**As a** Brand System Service developer,
**I want** a complete, validated static hosting pipeline with Git-based CI/CD for Vercel and Netlify, custom domain CNAME support, and per-client deployment configuration,
**so that** static brand sites can be reliably deployed to either platform with a single command, custom domains, and automated builds on push.

---

## Acceptance Criteria

- [x] 1. **Vercel Configuration**: `vercel.json` exists with: static build command (`pnpm build`), `output/` publish directory, security headers (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy), asset caching (1yr immutable for `/assets/*`), SPA fallback rewrite
- [x] 2. **Netlify Configuration**: `netlify.toml` exists with: same build command and publish directory, identical security headers, asset caching, SPA fallback redirect (200 status), Node 20 + pnpm 9.15.4 environment
- [x] 3. **Git-Based CI/CD**: GitHub Actions workflow (`.github/workflows/deploy-static.yml`) that:
  - Triggers on push to `main` (and optionally on PR for preview)
  - Installs pnpm, runs `pnpm install --frozen-lockfile`
  - Runs type-check and lint
  - Runs `pnpm build`
  - Deploys to Vercel via `vercel deploy --prod` OR to Netlify via Netlify CLI
  - Uses GitHub Secrets for deployment tokens (`VERCEL_TOKEN`, `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID`)
- [x] 4. **Custom Domain CNAME Support**: Documentation and tooling for configuring custom domains:
  - README section explaining: add CNAME record pointing `brand.client-domain.com` → `client-brand.vercel.app` (or `.netlify.app`)
  - Per-client deployment configuration: `deployments/{clientId}/config.json` storing `{ platform, siteId, customDomain, deployedAt }`
  - Script `packages/core/src/scripts/add-deployment.ts` to register a new client deployment
- [x] 5. **Per-Client Build Isolation**: Build script accepts `--client` flag: `pnpm build --client={clientId}` that:
  - Reads client config from `deployments/{clientId}/config.json`
  - Sets `BSS_CLIENT_ID` env var
  - Outputs to `output/{clientId}/` directory
  - Prevents cross-client output contamination
- [x] 6. **Environment Variable Management**: `.env.example` (already exists from BSS-1.1) documents deployment-specific vars: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID`. GitHub Secrets setup instructions in README
- [x] 7. **Deployment Validation Script**: `packages/core/src/scripts/validate-deployment.ts` that:
  - Checks deployed site responds with 200
  - Validates security headers are present
  - Checks assets serve with correct `Cache-Control`
  - Runs after deployment in CI pipeline
- [x] 8. **Platform Limits Documentation**: Document known constraints in README:
  - Vercel free tier: 100 deployments/day, custom domains require Pro ($20/mo) for >1 domain per project
  - Netlify free tier: 300 build minutes/month, 100GB bandwidth
  - Workaround: separate Vercel/Netlify project per client (each gets free-tier domain)

---

## 🤖 CodeRabbit Integration

> **CodeRabbit Integration**: Enabled

### Story Type Analysis

**Primary Type**: Deployment / Infrastructure
**Secondary Type(s)**: Architecture (CI/CD patterns)
**Complexity**: Medium — multiple platform integrations, secrets management

### Specialized Agent Assignment

**Primary Agents**:
- @dev (configuration files, scripts, build isolation)
- @devops (CI/CD pipeline, secrets management, deployment validation)

**Supporting Agents**:
- @architect (validate per-client isolation model doesn't create scaling problems)

### Quality Gate Tasks

- [ ] Pre-Commit (@dev): Run before marking story complete
- [ ] Pre-PR (@devops): CI pipeline validation before merge
- [ ] Deployment Verification (@devops): Run validate-deployment.ts against test deployment

### Self-Healing Configuration

**Expected Self-Healing**:
- Primary Agent: @dev (light mode) for code; @devops (check mode) for CI
- Max Iterations: 2
- Timeout: 15 minutes
- Severity Filter: CRITICAL

**Predicted Behavior**:
- CRITICAL issues: auto_fix (secrets in CI config, cross-client output contamination)
- HIGH issues: document_only (deployment timeout handling, build failure recovery)

### CodeRabbit Focus Areas

**Primary Focus**:
- Secrets management: no tokens in source code, only GitHub Secrets
- Build isolation: `output/{clientId}/` directories never share files

**Secondary Focus**:
- CI pipeline efficiency: cache pnpm store between runs
- Platform-specific constraints documented (Vercel domain cap, Netlify build minutes)

---

## Tasks / Subtasks

- [x] Task 1: Verify `vercel.json` meets all requirements in AC-1 (AC: 1)
  - [x] Static build command and output directory
  - [x] Security headers (4 headers)
  - [x] Asset cache headers (`/assets/*` 1yr immutable)
  - [x] SPA fallback rewrite

- [x] Task 2: Verify `netlify.toml` meets all requirements in AC-2 (AC: 2)
  - [x] Build command, publish dir, Node/pnpm versions
  - [x] Security headers
  - [x] Asset cache
  - [x] SPA redirect (200 status)
  - [x] Custom domain documentation in comments

- [x] Task 3: Create GitHub Actions workflow for static deployment (AC: 3)
  - [x] Create `.github/workflows/deploy-static.yml`
  - [x] Trigger: `push` to `main`, `workflow_dispatch`
  - [x] Steps: checkout, setup pnpm, install deps, type-check, lint, build, deploy
  - [x] Support both Vercel and Netlify deploy paths (conditioned on env secret presence)
  - [x] Cache: `~/.local/share/pnpm/store` keyed on `pnpm-lock.yaml` hash
  - [x] Document required GitHub Secrets in workflow comments

- [x] Task 4: Create per-client deployment configuration (AC: 4, 5)
  - [x] Define `DeploymentConfig` type: `{ clientId, platform, siteId, projectId, customDomain?, deployedAt }`
  - [x] Create `deployments/` directory with `.gitkeep`
  - [x] Create `packages/core/src/scripts/add-deployment.ts` CLI script
  - [x] Create `packages/core/src/scripts/build-client.ts` for `--client` flag support
  - [x] Add `"build:client": "ts-node packages/core/src/scripts/build-client.ts"` to package.json

- [x] Task 5: Update `.env.example` with deployment vars (AC: 6)
  - [x] Add: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
  - [x] Add: `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID`
  - [x] Add comment: "See README for GitHub Secrets setup"
  - [x] Add README section: "Setting up GitHub Secrets for CI/CD"

- [x] Task 6: Create deployment validation script (AC: 7)
  - [x] `packages/core/src/scripts/validate-deployment.ts`
  - [x] Accepts `--url` flag for deployed site URL
  - [x] Checks: 200 response, security headers present, assets cache header
  - [x] Returns exit code 0 (pass) or 1 (fail) for CI integration
  - [x] Add step in GitHub Actions workflow to run after deploy

- [x] Task 7: Document platform limits and per-client domain strategy (AC: 8)
  - [x] Add "Deployment Architecture" section to README
  - [x] Document Vercel and Netlify free tier limits
  - [x] Explain per-client project strategy for custom domains
  - [x] Link to Vercel/Netlify documentation for domain management

---

## Dev Notes

### Implementation State (~40% Complete)

**IMPLEMENTED** (ACs 1-2):
- `brand-system-service/vercel.json` — full static deploy config with security headers, caching, SPA fallback
- `brand-system-service/netlify.toml` — equivalent Netlify config with build environment pinning

**REMAINING** (ACs 3-8):
- GitHub Actions workflow — does not exist
- Per-client build isolation — no `deployments/` directory or `--client` flag
- Deployment validation script — not implemented
- Platform limits documentation — partially in `netlify.toml` comments only

### Key Technical Decisions

**Vercel vs Netlify**:
Both are supported to avoid vendor lock-in per ADR-008. The CI pipeline should deploy to whichever platform has credentials available (GitHub Secrets control which platform is active).

**Per-client project strategy**:
Each client gets a separate Vercel/Netlify project. This maximizes free-tier usage (each project gets its own free-tier domain) and provides complete isolation. Managed via `deployments/{clientId}/config.json`.

**pnpm cache in CI**:
```yaml
- uses: actions/cache@v4
  with:
    path: ~/.local/share/pnpm/store
    key: ${{ runner.os }}-pnpm-${{ hashFiles('**/pnpm-lock.yaml') }}
    restore-keys: |
      ${{ runner.os }}-pnpm-
```

**Vercel deploy via CLI**:
```bash
npx vercel --prod --token=$VERCEL_TOKEN
```

**Netlify deploy via CLI**:
```bash
npx netlify-cli deploy --prod --auth=$NETLIFY_AUTH_TOKEN --site=$NETLIFY_SITE_ID --dir=output
```

### Architecture References

- **ADR-001 (Static-First)**: Build output is platform-agnostic static files
- **ADR-008 (Flexible Static Hosting)**: Support Vercel, Netlify, any web server
- [Source: `docs/architecture-brand-system-service.md`]

### NFR References

- **NFR-1.4**: Support 10-50 clients via static hosting (per-client project strategy)
- **NFR-1.5**: ClickUp + static sites are the operational hub (no proprietary hosting portal)
- **NFR-9.3**: Static sites deployable to any platform

### File Locations

```
brand-system-service/
  vercel.json                    # DONE — Vercel deploy config
  netlify.toml                   # DONE — Netlify deploy config
  .github/workflows/
    deploy-static.yml            # TODO — CI/CD pipeline
  deployments/
    .gitkeep                     # TODO — per-client deployment configs
    {clientId}/
      config.json                # TODO — per-client config
  packages/core/src/scripts/
    add-deployment.ts            # TODO — register new client deployment
    build-client.ts              # TODO — per-client build with isolation
    validate-deployment.ts       # TODO — post-deploy verification
```

### Testing

**Verification approach** (not unit tests — operational validation):
- Deploy a test static site to Vercel/Netlify staging
- Run `validate-deployment.ts --url {deployed-url}`
- Verify custom domain CNAME setup instructions are accurate
- CI pipeline: test on a PR to verify workflow runs correctly

---

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2026-03-16 | 1.0 | Formal story creation reflecting ~40% implementation state | River (SM) |
| 2026-03-30 | 2.0 | Implementation complete — all 8 ACs met, CI/CD pipeline, per-client isolation, deployment validation | Dex (Dev) |
| 2026-03-30 | 2.1 | QA CONCERNS resolved — sub-task checkboxes marked, Change Log updated | Gage (DevOps) |

---

## QA Results

### Review Date: 2026-03-30

### Reviewed By: Quinn (Test Architect)

**Verdict: CONCERNS (non-blocking)**

**AC Traceability:**

| AC | Status | Evidence |
|----|--------|----------|
| AC-1 Vercel Configuration | MET | `vercel.json`: pnpm build, output/, 4 security headers + CSP, 1yr immutable /assets/*, SPA rewrite |
| AC-2 Netlify Configuration | MET | `netlify.toml`: same build/publish, 4 security headers + CSP, 1yr immutable cache, 200 redirect, Node 20 + pnpm 9.15.4 |
| AC-3 Git-Based CI/CD | MET | `.github/workflows/deploy-static.yml`: push to main trigger, pnpm setup, type-check, lint, build, Vercel + Netlify deploy, GitHub Secrets |
| AC-4 Custom Domain CNAME | MET | README has "Setting up GitHub Secrets" section (line 155); `add-deployment.ts` creates per-client config.json |
| AC-5 Per-Client Build Isolation | MET | `build-client.ts`: reads deployments/{clientId}/config.json, sets BSS_CLIENT_ID, outputs to output/{clientId}/, cleans before build |
| AC-6 Environment Variables | MET | `.env.example` lines 84-91: all deployment vars documented with README reference |
| AC-7 Deployment Validation | MET | `validate-deployment.ts`: checks 200 response, 4 security headers, asset Cache-Control; exit code 0/1 for CI |
| AC-8 Platform Limits | MET | README "Platform Limits" section (line 192): Vercel and Netlify free tier limits documented |

**Issues Found:**

| ID | Severity | Finding |
|----|----------|---------|
| DOC-001 | low | Two sub-task checkboxes unchecked (Task 5: README section, Task 6: workflow step) despite implementation being complete |
| DOC-002 | low | Change Log not updated beyond v1.0 to reflect completed implementation |

These are documentation-only issues. All functional ACs are met.

### Gate Status

Gate: CONCERNS -> docs/qa/gates/bss-1.6-static-hosting-configuration.yml
