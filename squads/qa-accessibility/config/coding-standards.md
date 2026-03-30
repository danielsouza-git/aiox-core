# QA Accessibility Squad - Coding Standards

Standards for test reports, evidence documentation, and deliverable structure.

## File Naming

### Test Reports
```
{test-type}-{target}-{date}.md
```

Examples:
- `wcag-audit-landing-page-2026-03-27.md`
- `visual-review-brand-book-2026-03-27.md`
- `lighthouse-homepage-2026-03-27.md`

### Screenshots & Evidence
```
{test-type}/{target}/{browser}-{viewport}-{state}.png
```

Examples:
- `visual-review/landing-page/chrome-1440-default.png`
- `cross-browser/homepage/firefox-1440-hover.png`
- `responsive/about/chrome-320-mobile.png`

### Compliance Certificates
```
{type}-certificate-{target}-{date}.md
```

Examples:
- `wcag-aa-certificate-brand-site-2026-03-27.md`
- `brand-compliance-certificate-landing-page-2026-03-27.md`

## Report Structure

### Standard Test Report
```markdown
# [Test Type]: [Target]

## Metadata
- **Target:** [URL or deliverable]
- **Agent:** [Agent name]
- **Date:** [YYYY-MM-DD]
- **Version:** [X.X]
- **Status:** [PASS/FAIL/CONDITIONAL]

## Summary
| Metric | Value |
|--------|-------|
| Overall Score | X% |
| Critical Issues | N |
| Total Issues | N |

---

## Findings

### Critical
| # | Issue | Location | Evidence | Fix |
|---|-------|----------|----------|-----|

### Major
...

### Minor
...

---

## Remediation Plan
1. [Priority fix]

## Evidence
- [Screenshot links]

## Revision History
| Version | Date | Changes | Author |
|---------|------|---------|--------|
```

## Evidence Standards

### Screenshots
- Always capture at 2x resolution for clarity
- Include browser chrome when relevant (for browser-specific issues)
- Annotate with red boxes/arrows for specific issues
- Name files descriptively (not `screenshot-1.png`)

### Diff Images
- Use red overlay for changed pixels
- Include both baseline and current versions
- Show percentage change in filename or metadata

### Video Evidence
- Record at native resolution
- Include captions for screen reader tests
- Keep under 30 seconds per issue
- MP4 format preferred

## Severity Classification

| Severity | Definition | SLA |
|----------|-----------|-----|
| **Critical** | Blocks users from completing tasks | Fix within 24h |
| **Major** | Significant usability or compliance issue | Fix within 1 week |
| **Minor** | Noticeable but non-blocking issue | Fix within 1 sprint |
| **Cosmetic** | Nitpick or polish item | Backlog |

## Metrics & Scoring

### Compliance Scores
- Always express as percentage (0-100%)
- Include category breakdown
- Show weighted overall score
- Compare against targets

### Pass/Fail Thresholds
- Report both "target" and "minimum acceptable"
- Use color coding: green (pass), yellow (threshold), red (fail)
- Always include the exact measured value

## Version Control

### Report Versioning
- `v1.0` - Initial report
- `v1.1` - Updated after retest
- `v2.0` - Major retest (new baseline)

### Status Labels
- `In Progress` - Testing underway
- `Complete` - Report finalized
- `Retest Required` - Issues found, awaiting fixes
- `Certified` - Passed all criteria

---

*QA Accessibility Squad - Coding Standards v1.0*
