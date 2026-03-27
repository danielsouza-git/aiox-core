# ClickUp Deliverables Guide — Brand System Service

**Story:** BSS-6.5 | **Version:** 2.0 (Free Plan) | **Date:** 2026-03-27 | **Author:** Morgan (PM)

---

## 1. Overview

Every deliverable in the Brand System Service has a dedicated ClickUp task with tag-based status tracking, R2 asset links, and version history via comments. This SOP covers how to manage deliverable tasks consistently across all client projects using the ClickUp Free Forever plan.

**Free Plan Adaptation:** Custom field `deliverable_status` replaced by tags. Automation "delivered notification" replaced by manual Delivery Checklist.

---

## 2. Deliverable Status Pipeline (Tags)

### Tags Used

| Tag | Meaning | Who Sets It |
|-----|---------|-------------|
| `draft` | Work in progress, not yet reviewed | Assignee (default on creation) |
| `in-review` | Internal QA passed, awaiting client review | QA Lead / Assignee |
| `approved` | Client approved the deliverable | Assignee (after client confirms) |
| `delivered` | Handoff package sent to client | PM / Assignee |

### Transition Rules

```
draft --> in-review --> approved --> delivered
              |              |
              |  (revision)  |
              <--------------+
           in-review <-- draft (QA fails)
```

- **Forward:** `draft` -> `in-review` -> `approved` -> `delivered` (standard flow)
- **Reverse:** `approved` -> `in-review` (client requests revision after approval)
- **Reverse:** `in-review` -> `draft` (internal QA fails, needs rework)
- **Not allowed:** `delivered` -> any previous status (once delivered, it is final)

### Tag Transition Checklist (REQUIRED on every status change)

When changing deliverable status:

1. **Remove** the current status tag from the task
2. **Add** the new status tag
3. **Add a comment** documenting: what changed, why, and who triggered the change
4. **Verify** only ONE status tag is active at a time

**Important:** ClickUp tags do not enforce mutual exclusivity. The PM or assignee must manually ensure only one status tag is present. If multiple status tags are found on a task, remove all except the current one.

---

## 3. Deliverable Task Types

### Brand Book (Brand Identity List)

```
## Deliverable: Brand Book
**Client:** {client-slug}
**Tier:** {tier-1 / tier-2 / tier-3}

## Asset Links (Current Version)
- v{N} -- Complete Brand Book PDF: {R2 signed URL} (expires: {YYYY-MM-DD HH:MM UTC})
- v{N} -- Brand Tokens JSON: {R2 signed URL} (expires: {YYYY-MM-DD HH:MM UTC})
- v{N} -- Brand Tokens CSS: {R2 signed URL} (expires: {YYYY-MM-DD HH:MM UTC})

## Version History
(maintained via task comments -- see comment thread)
```

### Social Creatives Batch (Creatives List)

```
## Deliverable: Social Creatives Batch
**Client:** {client-slug}
**Tier:** {tier-1 / tier-2 / tier-3}
**Batch Size:** 30 posts

## Asset Links (Current Version)
- v{N} -- Instagram Posts ZIP: {R2 signed URL} (expires: {YYYY-MM-DD HH:MM UTC})
- v{N} -- Facebook Posts ZIP: {R2 signed URL} (expires: {YYYY-MM-DD HH:MM UTC})
- v{N} -- LinkedIn Posts ZIP: {R2 signed URL} (expires: {YYYY-MM-DD HH:MM UTC})

## Version History
(maintained via task comments -- see comment thread)
```

### Landing Page (Web List)

```
## Deliverable: Landing Page
**Client:** {client-slug}
**Tier:** {tier-2 / tier-3} (Tier 1 does not include web)

## Asset Links (Current Version)
- v{N} -- Preview URL: {staging URL}
- v{N} -- Production URL: {production URL} (after deployment)
- v{N} -- Source Code: {R2 signed URL or Git tag reference}

## Version History
(maintained via task comments -- see comment thread)
```

---

## 4. R2 Asset Path Convention

All deliverable assets are stored in Cloudflare R2 following this path structure (per FR-8.3):

```
r2://brand-assets/{client-id}/{deliverable-type}/v{N}/
```

**Examples:**
```
r2://brand-assets/acme-corp/brand-identity/v1/brand-book.pdf
r2://brand-assets/acme-corp/brand-identity/v1/tokens.json
r2://brand-assets/acme-corp/creatives/v2/instagram-batch.zip
r2://brand-assets/acme-corp/web/v1/landing-page.zip
```

### Signed URLs

R2 signed URLs expire in **15 minutes** (FR-8.3). When sharing via ClickUp:

1. Generate a fresh signed URL immediately before adding to the task
2. Note the expiry time in the asset link
3. For long-term reference, use the `r2://` path -- it is the stable identifier
4. Regenerate signed URL fresh whenever someone needs to download

---

## 5. Version History Protocol

### When to Create a New Version

- Initial upload = v1
- Each revision cycle that produces new assets = increment version (v2, v3, etc.)
- Minor fixes within the same review cycle = same version (update the asset, add note)

### Version Comment Format (REQUIRED)

When uploading a new version, add a task comment:

```
## Version {N} Uploaded
**Date:** {YYYY-MM-DD}
**Summary:** {brief description of changes from previous version}
**R2 Path:** r2://brand-assets/{client-id}/{deliverable-type}/v{N}/
**Files:**
- {filename 1} -- {description}
- {filename 2} -- {description}
```

**Example:**
```
## Version 2 Uploaded
**Date:** 2026-04-15
**Summary:** Updated color palette per client revision request -- changed primary blue from #1E40AF to #2563EB, adjusted typography contrast ratio
**R2 Path:** r2://brand-assets/acme-corp/brand-identity/v2/
**Files:**
- brand-book-v2.pdf -- Updated brand book with revised colors
- tokens-v2.json -- Updated design tokens
- tokens-v2.css -- Updated CSS variables
```

---

## 6. Manual Delivery Checklist (Replaces Automation)

On the ClickUp Free plan, there is no automation for delivery notification. When marking a deliverable as `delivered`, the PM must follow this checklist manually:

### Delivery Checklist

1. **Remove** the current status tag (e.g., `approved`)
2. **Add** the `delivered` tag
3. **Update task description** with final asset links (current version section)
4. **Add a comment** in this format:
   ```
   @manager {task name} delivered to client on {YYYY-MM-DD}.
   Final version: v{N}
   R2 path: r2://brand-assets/{client-id}/{deliverable-type}/v{N}/
   ```
5. **Notify the manager** via ClickUp comment mention (@manager)
6. **Verify** the `delivered` tag is the only status tag on the task

### Important: `delivered` is Final

Once a deliverable is tagged `delivered`, it cannot be reverted to a previous status. If additional work is needed after delivery, create a new task (e.g., "Brand Book v2 -- Post-Delivery Revision") rather than reverting the original.

---

## 7. Template Integration

All deliverable tasks in the **test-client reference Folder** (BSS-6.2) include:

- Initial tag `draft` applied
- Description following the templates in Section 3 (with placeholder values)
- Asset Links section ready for the team to fill in

When creating a new client by duplicating the test-client Folder, the deliverable tasks come pre-configured with `draft` tags and description templates.

**Note (Free Plan):** There are no saved templates on Free plan. New clients are created by duplicating the test-client Folder. See `clickup-client-onboarding.md` for details.

---

## 8. Validation Procedure

Test on the `test-client` Folder:

1. **Create a test deliverable task** (e.g., "Test Brand Book") in Brand Identity List
2. **Apply tag** `draft`
3. **Add description** using the Brand Book template from Section 3
4. **Simulate v1 upload:** Add a version comment using the format in Section 5
5. **Move through tags:** `draft` -> `in-review` -> `approved` -> `delivered`
   - At each step, follow the Tag Transition Checklist (Section 2)
6. **Verify delivery:** On `delivered`, follow the Delivery Checklist (Section 6)
7. **Verify reverse transition:** Create another test, move to `approved`, then back to `in-review`

**Checklist:**

- [x] Tags `draft`, `in-review`, `approved`, `delivered` exist at Space level
- [x] Description template renders correctly in task
- [x] Version comment added successfully
- [x] Tag transitions work in correct order (one tag at a time)
- [x] Reverse transition (`approved` -> `in-review`) works
- [x] Delivery Checklist followed manually, manager notification comment posted
- [x] `delivered` tag is final (no reversion needed)

---

## 9. Upgrade Path

| Signal | Threshold | Action |
|--------|-----------|--------|
| Tag management errors (multiple status tags) | Regular occurrence | Consider Unlimited for custom field dropdowns |
| Need automated delivery notifications | 10+ active clients | Consider Unlimited for automations |
| Need deliverable status reports | Monthly | Consider Business for dashboards |

---

## References

- **PRD:** FR-8.1 (revised v1.2), FR-8.3, FR-8.4
- **Story:** BSS-6.5 (Deliverables Organization)
- **Related SOPs:** `clickup-workspace-guide.md` (tags setup), `clickup-approval-workflow.md` (approval status integration), `clickup-client-onboarding.md` (template)
