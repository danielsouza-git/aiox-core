# ClickUp Retainer Operations — Brand System Service

**Story:** BSS-6.7 | **Version:** 2.0 (Free Plan) | **Date:** 2026-03-27 | **Author:** Morgan (PM)

---

## 1. Overview

Retainer clients receive monthly recurring deliverables managed via ClickUp recurring tasks. This SOP covers how to activate, manage, adjust, and deactivate retainer operations for any client using the ClickUp Free Forever plan.

**Retainer add-on pricing:** $2,500/month

**Free Plan Adaptation:** Recurring tasks work natively on Free plan (no paid feature needed). Automation for monthly notifications replaced by manual PM process on the 1st of each month.

---

## 2. Retainer Task Set

### Full Task Matrix

| # | Task Name | Day of Month | Assignee Role | Est. Hours | Tier 1 | Tier 2 | Tier 3 |
|---|-----------|-------------|---------------|------------|--------|--------|--------|
| 1 | Monthly Content Calendar | 1st | Content Lead | 3h | Yes | Yes | Yes |
| 2 | Posts Batch Generation (30 posts) | 3rd | Creative Lead | 4h | Yes | Yes | Yes |
| 3 | Email Campaign | 5th | Content Lead | 2h | No | Yes | Yes |
| 4 | Blog Post | 5th | Content Lead | 3h | No | Yes | Yes |
| 5 | Site Maintenance & Updates | 10th | Dev | 2h | No | No | Yes |
| 6 | Monthly Analytics Report | 25th | PM | 1h | Yes | Yes | Yes |
| 7 | Monthly Retainer Summary | 1st | PM | 0.5h | Yes | Yes | Yes |

### Tier Scope Summary

| Tier | Active Tasks | Monthly Hours | Monthly Cost |
|------|-------------|---------------|-------------|
| Tier 1 | 1, 2, 6, 7 | 8.5h | $2,500 |
| Tier 2 | 1, 2, 3, 4, 6, 7 | 13.5h | $2,500 |
| Tier 3 | All 7 | 15.5h | $2,500 |

---

## 3. Task Description Templates

### Monthly Content Calendar

```
## Monthly Content Calendar -- {Month} {Year}
**Client:** {client_name}
**Tier:** {tier}

### Scope
- Plan content themes for the month
- Map 30 posts to calendar dates across platforms
- Align with any seasonal events, campaigns, or client requests

### Acceptance Criteria
- [ ] 30-post calendar with dates, platforms, and content themes
- [ ] Calendar shared with client for approval
- [ ] Aligned with brand voice guidelines

### Deliverable
- Content calendar document (Google Sheets / ClickUp Doc)
```

### Posts Batch Generation (30 posts)

```
## Posts Batch Generation -- {Month} {Year}
**Client:** {client_name}
**Batch Size:** 30 posts

### Scope
- Generate 30 social posts using AI creative pipeline
- Apply brand tokens (colors, typography, voice)
- Cover all assigned platforms (Instagram, Facebook, LinkedIn)

### Acceptance Criteria
- [ ] 30 posts generated and QA'd against brand guidelines
- [ ] All posts meet platform-specific size and format requirements
- [ ] Assets uploaded to R2: r2://brand-assets/{client-id}/creatives/retainer/{month}/

### Deliverable
- ZIP per platform uploaded to R2
```

### Email Campaign

```
## Email Campaign -- {Month} {Year}
**Client:** {client_name}

### Scope
- Draft email campaign based on monthly content calendar
- Apply brand voice and visual identity
- Set up in email platform (if applicable)

### Acceptance Criteria
- [ ] Email copy drafted and approved
- [ ] Visual template matches brand identity
- [ ] Send schedule confirmed

### Deliverable
- Email draft document or platform preview link
```

### Blog Post

```
## Blog Post -- {Month} {Year}
**Client:** {client_name}

### Scope
- Write or generate blog post aligned with monthly content theme
- Apply SEO guidelines and brand voice
- Include featured image from brand assets

### Acceptance Criteria
- [ ] Blog post drafted (800-1500 words)
- [ ] SEO meta title and description included
- [ ] Featured image created using brand tokens

### Deliverable
- Blog post document (Markdown or Google Doc)
```

### Site Maintenance & Updates

```
## Site Maintenance -- {Month} {Year}
**Client:** {client_name}

### Scope
- Check site uptime and performance
- Apply content updates (new blog post, updated copy)
- Verify SSL, redirects, analytics tracking

### Acceptance Criteria
- [ ] Site loads under 3 seconds (LCP)
- [ ] No broken links or 404 errors
- [ ] Analytics tracking confirmed active
- [ ] Monthly content updates applied

### Deliverable
- Maintenance report (brief checklist with pass/fail)
```

### Monthly Analytics Report

```
## Monthly Analytics Report -- {Month} {Year}
**Client:** {client_name}

### Scope
- Compile social media metrics (reach, engagement, growth)
- Compile website metrics (traffic, bounce rate, conversions)
- Summarize email campaign performance (if applicable)
- Provide actionable insights for next month

### Acceptance Criteria
- [ ] Report covers all active platforms
- [ ] Month-over-month comparison included
- [ ] 3+ actionable recommendations for next month

### Deliverable
- Analytics report PDF or ClickUp Doc
```

### Monthly Retainer Summary

```
## Monthly Retainer Summary -- {Month} {Year}
**Client:** {client_name}
**Tier:** {tier}

### Purpose
Parent tracking task for this month's retainer scope. Review all deliverables, confirm completion, report to client.

### Checklist
- [ ] Content Calendar delivered
- [ ] Posts Batch delivered
- [ ] Email Campaign delivered (Tier 2+)
- [ ] Blog Post delivered (Tier 2+)
- [ ] Site Maintenance completed (Tier 3)
- [ ] Analytics Report sent to client
- [ ] Client satisfaction captured (1-5)

### Hours Summary
- Planned: {X}h
- Actual: {X}h
```

---

## 4. How to Activate Retainer for a New Client

### Prerequisites

- Client Folder exists (created from test-client duplication per BSS-6.2)
- Client tier tag applied (`tier-1`, `tier-2`, or `tier-3`)
- Retainer List contains 7 pre-created tasks with recurrence OFF

### Step-by-Step

1. **Open the client Folder** > navigate to the **Retainer List**
2. **Check client tier tag** to determine scope
3. **Activate applicable tasks** based on tier matrix (Section 2):
   - Open each applicable task
   - Click Due Date > enable **Recurring** > set to **Monthly** > Day {N} per schedule
   - Confirm recurrence is enabled
4. **Leave inapplicable tasks inactive** for the client's tier:
   - Tier 1: Leave Email Campaign (#3), Blog Post (#4), Site Maintenance (#5) with recurrence OFF
   - Tier 2: Leave Site Maintenance (#5) with recurrence OFF
   - Tier 3: Activate all 7 tasks
5. **Assign team members** to each active recurring task
6. **Apply tag** `draft` to all active tasks (initial status)
7. **Add notification comment** on Monthly Retainer Summary:
   ```
   @team Retainer activated for {client_name} -- {tier} scope ({N} tasks, {X}h/month)
   ```

---

## 5. Monthly Cycle Management

### How Recurring Tasks Work (Free Plan)

ClickUp recurring tasks create a new instance when the previous instance is marked Done (closed). This works natively on the Free plan -- no paid feature required.

**Monthly flow:**

1. **Day 1:** Monthly Content Calendar + Monthly Retainer Summary tasks should be open
2. **Day 3:** Posts Batch Generation should be open
3. **Day 5:** Email Campaign + Blog Post should be open (Tier 2+)
4. **Day 10:** Site Maintenance should be open (Tier 3)
5. **Day 25:** Monthly Analytics Report should be open
6. **Before month-end:** PM reviews Monthly Retainer Summary, confirms all tasks Done

### Manual Monthly Process (Replaces Automation)

On the **1st of each month**, PM performs this check:

1. **Verify recurring tasks created** for all retainer clients
   - Open each retainer client's Retainer List
   - Confirm new task instances exist for the current month
2. **Add notification comment** on each client's Monthly Retainer Summary:
   ```
   @team Monthly retainer tasks are live for {Month} -- check your assignments
   ```
3. **Verify assignees** on new task instances (ClickUp preserves assignees on recurring tasks)
4. **Apply `draft` tag** to any new instances missing it
5. **Update BSS Monthly Metrics doc** with current month's retainer client list

### Critical: Close Tasks Promptly

ClickUp recurring tasks generate the next instance **only when the previous one is closed**. If December's tasks are not marked Done by December 31, January's tasks will not auto-create.

**Best practice:**
- PM closes all completed monthly tasks by the **28th** of each month
- Monthly Retainer Summary should be the **last task closed** each month
- If a task cannot be completed by month-end, close it with a note and create a carry-over task manually

### What to Do if Recurring Task Did Not Create

If a new month's task is missing:

1. Check if the previous month's instance was closed (it must be Done/Closed)
2. Close the previous instance
3. Wait 1-2 minutes for ClickUp to generate the new instance
4. If still missing, create the task manually using the description template from Section 3
5. Set it to recurring for next month

---

## 6. How to Adjust Monthly Scope

### Adding a Task

1. Create the new task in the Retainer List
2. Add description using the appropriate template from Section 3
3. Set to recurring (Monthly, appropriate day)
4. Apply tag `draft`
5. Assign team member
6. Update the Monthly Retainer Summary checklist to include the new item
7. Add comment documenting the scope change

### Removing a Task

1. Open the recurring task
2. Remove recurrence (Due Date > Recurring > None)
3. Close the task with a comment: "Scope change: removed from retainer as of {date}"
4. Update the Monthly Retainer Summary checklist

### Tier Upgrade

If a client upgrades their tier (e.g., Tier 1 -> Tier 2):

1. Activate the newly applicable tasks (see tier matrix in Section 2)
2. Set recurrence on each new task (Monthly, day per schedule)
3. Remove old tier tag, apply new tier tag (`tier-1` -> `tier-2`)
4. Assign team members to new tasks
5. Apply `draft` tag to new tasks
6. Add comment on Monthly Retainer Summary:
   ```
   Tier upgrade: {old tier} -> {new tier}, effective {YYYY-MM-DD}
   New tasks activated: {list}
   ```

### Tier Downgrade

If a client downgrades their tier:

1. Disable recurrence on tasks no longer in scope
2. Close those tasks with comment: "Tier downgrade: removed from scope as of {date}"
3. Update tier tag
4. Update Monthly Retainer Summary checklist

---

## 7. How to Deactivate Retainer

When a client ends their retainer subscription:

1. **Complete current month's work** -- finish all open retainer tasks for the current month
2. **Remove recurrence** on all retainer tasks (open each > Due Date > Recurring > None)
3. **Close all retainer tasks** with comment: "Retainer deactivated as of {YYYY-MM-DD}"
4. **Update client status:** Remove retainer-related tags if needed
5. **Final analytics report:** Generate and send final retainer report to client
6. **Add closing comment** on Monthly Retainer Summary:
   ```
   Retainer closed effective {YYYY-MM-DD}. Final report sent to client.
   Total months active: {N}
   ```
7. **Update BSS Monthly Metrics doc** to remove client from active retainers

---

## 8. Validation Procedure

Test on `test-client` Folder:

1. **Activate recurring tasks** for Tier 2 scope (tasks 1, 2, 3, 4, 6, 7)
2. **Verify task descriptions** match templates in Section 3
3. **Verify tags:** All active tasks have `draft` tag
4. **Trigger recurrence:** Close a recurring task and verify the next instance creates
5. **Verify new instance:** Has correct description template, `draft` tag, and assignee role
6. **Test tier adjustment:** Upgrade to Tier 3, activate Site Maintenance (#5)
7. **Test deactivation:** Remove recurrence on all tasks, close them with deactivation comment
8. **Verify Monthly Retainer Summary** checklist items match active tier scope

**Checklist:**

- [x] 7 recurring task types configured correctly in Retainer List
- [x] Recurrence triggers new instance on task close
- [x] New instances have correct description template and `draft` tag
- [x] Manual monthly PM notification process documented
- [x] Tier-based activation works (only applicable tasks active)
- [x] Tier upgrade process works
- [x] Deactivation procedure works cleanly

---

## 9. Upgrade Path

| Signal | Threshold | Action |
|--------|-----------|--------|
| Manual monthly check takes >15 min | 10+ retainer clients | Consider Unlimited for automations |
| Need automated task creation on schedule | Regardless of previous task status | Consider Business plan for scheduled automations |
| Need retainer hours tracking | Any time | Consider Business plan for time tracking |

---

## References

- **PRD:** FR-8.1 (revised v1.2), FR-2.6 (service tiers)
- **Story:** BSS-6.7 (Retainer Operations)
- **Related SOPs:** `clickup-workspace-guide.md` (tags setup), `clickup-deliverables-guide.md` (deliverable status pipeline), `clickup-client-onboarding.md` (template setup)
- **Related Epics:** EPIC-BSS-3 (creative pipeline feeds batch generation), EPIC-BSS-8 (QA checklists for retainer deliverables)
