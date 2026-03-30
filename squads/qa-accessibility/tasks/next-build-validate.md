# next-build-validate

```yaml
task:
  id: next-build-validate
  name: Next.js Build Validation
  agent: performance-auditor
  squad: qa-accessibility
  type: validation
  elicit: false

inputs:
  required:
    - app_path: "Path to the Next.js application root (e.g., .aiox/branding/{client}/app/)"
  optional:
    - bundle_size_limit_kb: "Maximum first-load JS bundle size in KB (default: 500)"
    - strict_types: "Fail on TypeScript warnings too (default: false)"

outputs:
  - build_validation_report.md: "Full build validation report with pass/fail per check"
  - build_errors.json: "Machine-readable list of build errors and warnings"

pre_conditions:
  - "Next.js project exists at app_path with valid package.json"
  - "Dependencies installed (node_modules/ exists)"
  - "next.config.js or next.config.ts present with output: 'export'"

post_conditions:
  - "TypeScript compilation passes with zero errors"
  - "Next.js build completes successfully"
  - "No React hydration warnings in build output"
  - "All imports resolve correctly"
  - "Bundle size within threshold"

tools:
  - node
  - typescript
  - next
```

## Purpose

Validate that a Next.js 15 application builds successfully with zero TypeScript errors, no hydration warnings, all imports resolved, and bundle sizes within acceptable thresholds. This task runs BEFORE static export validation and catches code-level issues early.

## Workflow

### Phase 1: Pre-Build Checks (5 min)

1. Verify `{app_path}/package.json` exists and is valid JSON
2. Verify `{app_path}/node_modules/` exists (dependencies installed)
3. Verify `{app_path}/next.config.js` or `next.config.ts` exists
4. Verify `next.config` contains `output: 'export'` (static export mode)
5. Verify `{app_path}/tsconfig.json` exists and has valid configuration
6. Check Node.js version >= 20 (required for Next.js 15)
7. Check for `@/*` path alias in tsconfig.json (required for absolute imports)

### Phase 2: TypeScript Validation (5 min)

1. Run `cd {app_path} && npx tsc --noEmit`
2. Parse output for errors vs warnings
3. Classify errors by category:
   - **Type errors** -- Missing types, incompatible assignments
   - **Import errors** -- Unresolved modules, missing exports
   - **Config errors** -- tsconfig issues, path alias problems
4. If any errors found: document each with file, line, and description
5. Verdict: PASS (zero errors) or FAIL (any errors)

### Phase 3: Next.js Build (10 min)

1. Run `cd {app_path} && npx next build`
2. Capture full build output (stdout + stderr)
3. Parse build output for:

   **Errors (FAIL immediately):**
   - Build compilation errors
   - Module not found errors
   - React Server Component violations
   - Dynamic import failures

   **Warnings (document but do not fail):**
   - Unused variables or imports
   - Missing `key` props in lists
   - Deprecated API usage

   **Hydration warnings (FAIL):**
   - `Warning: Text content did not match`
   - `Warning: Expected server HTML to contain`
   - `Warning: Prop ... did not match`
   - `Hydration failed because the initial UI does not match`

4. If build fails: capture error output, attempt common auto-fixes:
   - Missing `'use client'` directive -> add to affected components
   - Missing `generateStaticParams` for dynamic routes -> add stub
   - `useSearchParams` without Suspense boundary -> wrap in Suspense
5. Retry build once after auto-fixes

### Phase 4: Import Resolution (5 min)

1. Scan all `.ts` and `.tsx` files in `{app_path}/app/` and `{app_path}/components/`
2. Extract all import statements
3. Verify each import resolves:
   - `@/*` aliases resolve to actual files via tsconfig paths
   - Relative imports resolve to existing files
   - Package imports exist in `node_modules/`
4. Flag any unresolved imports as errors
5. Check for circular imports (warn only)

### Phase 5: Bundle Size Analysis (5 min)

1. After successful build, check `{app_path}/.next/` output
2. Extract bundle size information from build output:
   - First Load JS size per route
   - Shared bundle size
   - Total bundle size
3. Compare against thresholds:

| Metric | Target | Warning | Critical |
|--------|--------|---------|----------|
| First Load JS (per route) | < 200KB | < 350KB | >= 500KB |
| Shared bundle | < 150KB | < 250KB | >= 400KB |
| Total first load (any route) | < 500KB | < 750KB | >= 1MB |

4. If any route exceeds critical threshold: FAIL
5. If any route exceeds warning threshold: WARN with specific route details
6. List top 5 largest bundles by size

### Phase 6: Dependency Check (3 min)

1. Check for missing dependencies:
   - Run `cd {app_path} && npm ls --all 2>&1` and check for `UNMET DEPENDENCY`
   - Verify all `dependencies` in `package.json` are actually used in code
2. Check for peer dependency warnings
3. Verify no duplicate React versions (common Next.js issue)
4. Check for known vulnerable packages (informational only)

### Phase 7: Report Generation (2 min)

1. Compile all findings into build validation report
2. Calculate overall build health score
3. Generate machine-readable errors JSON

## Build Health Score

| Category | Weight | Pass Criteria |
|----------|--------|---------------|
| TypeScript | 30% | Zero errors from `tsc --noEmit` |
| Build Success | 30% | `next build` exits with code 0 |
| Hydration | 15% | Zero hydration warnings in output |
| Bundle Size | 15% | All routes under critical threshold |
| Dependencies | 10% | No unmet or missing dependencies |

| Score | Rating | Verdict |
|-------|--------|---------|
| 100% | Perfect Build | All checks passed |
| 85-99% | Minor Issues | Build succeeds, warnings present |
| 70-84% | Significant Issues | Build may succeed but has problems |
| < 70% | Build Failure | Critical issues must be resolved |

## Report Format

```markdown
# Next.js Build Validation Report

## Summary

| Check | Status | Details |
|-------|--------|---------|
| TypeScript | PASS/FAIL | {error count} errors, {warning count} warnings |
| Build | PASS/FAIL | Exit code {n} |
| Hydration | PASS/FAIL | {warning count} hydration warnings |
| Bundle Size | PASS/WARN/FAIL | First load JS: {size}KB |
| Dependencies | PASS/WARN | {issue count} issues |

**Build Health Score:** {score}%
**Verdict:** {PASS / WARN / FAIL}

## TypeScript Errors (if any)
| File | Line | Error |
|------|------|-------|
| ... | ... | ... |

## Bundle Size Analysis
| Route | First Load JS | Status |
|-------|--------------|--------|
| / | 180KB | PASS |
| /brandbook | 220KB | WARN |

## Recommendations
1. ...
```

## Common Next.js 15 Build Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| `useSearchParams` in Server Component | Client-only hook in server context | Add `'use client'` directive or wrap in Suspense |
| Dynamic route without `generateStaticParams` | Static export requires all routes known at build time | Add `generateStaticParams()` export |
| `next/image` without `unoptimized` | Static export cannot optimize images | Set `images: { unoptimized: true }` in next.config |
| Module not found `@/...` | Path alias not configured | Verify `paths` in tsconfig.json |
| Duplicate React | Multiple React versions in dependency tree | Check `npm ls react`, dedupe if needed |

## Acceptance Criteria

- [ ] Pre-build checks completed (package.json, next.config, tsconfig)
- [ ] TypeScript compilation passes with zero errors
- [ ] Next.js build completes with exit code 0
- [ ] No React hydration warnings detected
- [ ] All imports resolve correctly (no module-not-found)
- [ ] Bundle sizes within acceptable thresholds
- [ ] Dependencies verified (no unmet/missing)
- [ ] Build validation report generated

## Quality Gate
- Threshold: >70%
- TypeScript compilation passes with zero errors
- Next.js build completes with exit code 0 and zero hydration warnings
- Bundle sizes within critical thresholds (first-load JS < 500KB per route)

---
*QA Accessibility Squad Task - performance-auditor*
