# final-approval

```yaml
task: finalApproval()
agent: qa-reviewer
squad: branding
prd_refs: [FR-8.5, FR-8.7]

inputs:
  - name: deliverables
    type: DeliverableCollection
    required: true
  - name: review_reports
    type: ReviewReportCollection
    required: true
  - name: client_id
    type: string
    required: true

outputs:
  - name: approval_decision
    type: ApprovalDecision
    destination: .aiox/branding/{client}/approvals/{batch_id}.yaml
  - name: delivery_package
    type: DeliveryPackage
    destination: .aiox/branding/{client}/delivery/

tools:
  - approval-workflow
  - clickup-integration
  - r2-storage
```

## Purpose

Final QA gate before client delivery with approval decision (PASS/CONCERNS/FAIL).

## Approval Criteria

```yaml
criteria:
  mandatory_pass:
    - all_deliverables_reviewed
    - no_critical_issues
    - brand_consistency >= 90%
    - wcag_aa_compliant (web)
    - all_files_present

  approval_levels:
    PASS:
      condition: "All mandatory criteria met, no major issues"
      action: "Proceed to delivery"

    CONCERNS:
      condition: "Minor issues exist but not blocking"
      action: "Document concerns, proceed with client acknowledgment"

    FAIL:
      condition: "Critical or major issues exist"
      action: "Return for fixes, block delivery"
```

## Pre-Delivery Checklist

```yaml
checklist:
  files:
    - [ ] All deliverable files present
    - [ ] File naming follows convention
    - [ ] No placeholder content
    - [ ] No temporary files included

  quality:
    - [ ] QA review completed
    - [ ] Brand consistency verified
    - [ ] Accessibility checked (web)
    - [ ] Links validated

  documentation:
    - [ ] README/usage instructions included
    - [ ] Version documented
    - [ ] Changelog updated

  packaging:
    - [ ] Files organized correctly
    - [ ] ZIP package created
    - [ ] R2 upload ready

  client_ready:
    - [ ] ClickUp task updated
    - [ ] Delivery notification drafted
    - [ ] Download links generated
```

## Approval Workflow

```yaml
steps:
  - step: aggregate_reviews
    collect: all_review_reports
    summarize: issues_by_severity

  - step: run_final_checklist
    execute: pre_delivery_checklist
    record: pass_fail_per_item

  - step: calculate_readiness
    factors:
      - review_scores
      - checklist_completion
      - outstanding_issues

  - step: make_decision
    logic: |
      if critical_issues > 0:
        return FAIL
      elif major_issues > 0:
        return CONCERNS (if client can accept)
        return FAIL (if blocking)
      elif checklist_complete and reviews_pass:
        return PASS
      else:
        return CONCERNS

  - step: document_decision
    include:
      - decision
      - rationale
      - outstanding_items
      - conditions (if CONCERNS)

  - step: prepare_delivery
    if: decision in [PASS, CONCERNS]
    actions:
      - create_delivery_package
      - upload_to_r2
      - generate_signed_urls
      - update_clickup

  - step: notify_team
    if: FAIL
    actions:
      - create_fix_tasks
      - assign_to_responsible
      - set_deadline
```

## Decision Documentation

```yaml
ApprovalDecision:
  decision: PASS | CONCERNS | FAIL
  timestamp: datetime
  reviewer: string
  batch_id: string

  summary:
    deliverables_count: number
    issues_critical: number
    issues_major: number
    issues_minor: number
    checklist_score: percentage

  rationale: string

  conditions:  # if CONCERNS
    - condition: string
      client_must_acknowledge: boolean

  outstanding_items:  # if FAIL
    - item: string
      assigned_to: string
      due_date: date

  delivery_info:  # if PASS or CONCERNS
    package_url: string
    expires_at: datetime
    files_included: string[]
```

## Delivery Package Structure

```yaml
delivery_package:
  {client_name}_delivery_{date}/
  ├── README.txt
  ├── brand-identity/
  │   ├── logos/
  │   ├── colors/
  │   ├── typography/
  │   └── brand-book/
  ├── social-media/
  │   └── posts/
  ├── web/
  │   ├── landing-page/
  │   └── institutional/
  ├── tokens/
  │   └── [all formats]
  └── documentation/
      ├── brand-voice-guide.pdf
      └── usage-instructions.md
```

## ClickUp Integration

```yaml
clickup_actions:
  on_pass:
    - move_task: "Delivered"
    - add_comment: "✅ QA Approved - Delivery package ready"
    - attach: signed_download_url

  on_concerns:
    - move_task: "Pending Client Approval"
    - add_comment: "⚠️ QA Approved with Concerns"
    - attach: [delivery_url, concerns_list]

  on_fail:
    - move_task: "In Review"
    - add_comment: "❌ QA Failed - Fixes Required"
    - create_subtasks: fix_items
```

## Pre-Conditions

- [ ] All deliverables complete
- [ ] All reviews finished
- [ ] No unresolved critical issues

## Post-Conditions

- [ ] Decision documented
- [ ] Delivery package created (if approved)
- [ ] ClickUp updated
- [ ] Team notified

## Acceptance Criteria

- [ ] Clear PASS/CONCERNS/FAIL decision
- [ ] Rationale documented
- [ ] Delivery ready (if approved)
- [ ] Fix tasks created (if failed)

## Quality Gate

- Threshold: >70%
- All prior QA checks passed or exceptions documented
- Delivery package complete and verified
- Approval or rejection decision documented with rationale

---
*Branding Squad Task - qa-reviewer*
