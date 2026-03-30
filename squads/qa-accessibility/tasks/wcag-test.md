# wcag-test

```yaml
task:
  id: wcag-test
  name: WCAG 2.2 AA Compliance Audit
  agent: a11y-tester
  squad: qa-accessibility
  type: audit
  elicit: true

inputs:
  required:
    - target_url: "URL to audit for WCAG compliance"
  optional:
    - compliance_level: "Target compliance (A, AA, AAA) - default: AA"
    - pages: "List of pages/routes to audit"
    - scope: "Full audit or specific criteria"

outputs:
  - wcag_audit_report.md: "Full WCAG compliance report"
  - issues.json: "Machine-readable issues list"
  - remediation_plan.md: "Prioritized fix plan"

pre_conditions:
  - "Target URL accessible"
  - "axe-core available for automated scanning"
  - "Compliance level defined"

post_conditions:
  - "Automated scan completed"
  - "Manual checks performed"
  - "All WCAG criteria evaluated"
  - "Compliance percentage calculated"
  - "Remediation plan created"

tools:
  - axe-core
  - lighthouse
  - pa11y
```

## Purpose

Perform a full WCAG 2.2 AA compliance audit combining automated scanning (axe-core, Lighthouse, Pa11y) with manual verification checks. Produce a comprehensive compliance report with remediation guidance.

## Workflow

### Phase 1: Automated Scanning (10 min)
1. **axe-core scan** - DOM-based accessibility testing
   - Color contrast violations
   - Missing ARIA roles
   - Form label issues
   - Heading order problems
   - Link name issues
   - Image alt text
2. **Lighthouse accessibility audit** - Score target >= 95
3. **Pa11y scan** - WCAG2AA standard mapping

### Phase 2: Perceivable (P) Manual Checks (10 min)
1. **1.1 Text Alternatives** - All images have meaningful alt text
2. **1.2 Time-Based Media** - Captions for video, transcripts for audio
3. **1.3 Adaptable** - Semantic HTML, proper heading hierarchy
4. **1.4 Distinguishable** - Contrast ratios (4.5:1 normal, 3:1 large)

### Phase 3: Operable (O) Manual Checks (10 min)
1. **2.1 Keyboard Accessible** - All functions via keyboard
2. **2.2 Enough Time** - Time limits adjustable
3. **2.3 Seizures** - No flashing > 3/sec
4. **2.4 Navigable** - Skip links, page titles, focus order
5. **2.5 Input Modalities** - Pointer gestures, target size (>= 24px)

### Phase 4: Understandable (U) Manual Checks (5 min)
1. **3.1 Readable** - Language defined, abbreviations explained
2. **3.2 Predictable** - Consistent navigation, no unexpected changes
3. **3.3 Input Assistance** - Error identification, labels, suggestions

### Phase 5: Robust (R) Manual Checks (5 min)
1. **4.1 Compatible** - Valid HTML, ARIA attributes correct
2. **4.1.2 Name, Role, Value** - Custom controls announce properly
3. **4.1.3 Status Messages** - Live regions announce updates

### Phase 6: Report Generation (5 min)
1. Compile automated + manual findings
2. Calculate compliance percentage per principle
3. Generate overall compliance verdict
4. Create prioritized remediation plan

## WCAG 2.2 Success Criteria (AA)

| Principle | Criteria Count | Weight |
|-----------|---------------|--------|
| Perceivable | 13 | 30% |
| Operable | 15 | 30% |
| Understandable | 8 | 20% |
| Robust | 4 | 20% |

## Compliance Verdicts

| Compliance | Verdict | Action |
|------------|---------|--------|
| >= 95% | PASS | Certified AA compliant |
| 85-94% | CONDITIONAL PASS | Fix critical issues within 30 days |
| 70-84% | FAIL | Significant remediation needed |
| < 70% | CRITICAL FAIL | Major accessibility barriers |

## Acceptance Criteria

- [ ] Automated scan completed (axe-core + Lighthouse + Pa11y)
- [ ] All 4 POUR principles manually checked
- [ ] Issues categorized by severity and WCAG criterion
- [ ] Compliance percentage calculated
- [ ] Remediation plan with priorities created
- [ ] Report generated with full evidence

## Quality Gate
- Threshold: >70%
- Zero critical WCAG violations (Level A failures that block access)
- WCAG 2.2 AA compliance score >= 85% across all four POUR principles
- Remediation plan created with priorities for every failing criterion

---
*QA Accessibility Squad Task - a11y-tester*
