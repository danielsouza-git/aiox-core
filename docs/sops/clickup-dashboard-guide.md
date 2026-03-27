# ClickUp Dashboard & Metrics Guide — Brand System Service

**Story:** BSS-6.6 | **Version:** 2.0 (Free Plan) | **Date:** 2026-03-27 | **Author:** Morgan (PM)

---

## 1. Overview

The ClickUp Free plan does not support custom dashboards with widgets. Instead, BSS uses **5 saved views** at the Space level and a **manual metrics tracking document** (ClickUp Doc) to provide operational visibility.

**Free Plan Adaptation:** Dashboard widgets replaced by saved views. Custom field metrics replaced by manual tracking. Client satisfaction field replaced by manual score tracking in monthly metrics doc.

---

## 2. Saved Views (Replaces Dashboard Widgets)

### View 1: Active Projects

| Setting | Value |
|---------|-------|
| **Location** | Space > Everything view |
| **Filter** | Status = Active or Planning |
| **Sort** | Due date ascending |
| **Purpose** | See all active and planned client projects at a glance |

**How to create:**
1. Go to the "Brand System Service" Space
2. Click "Everything" view (shows all tasks across all Folders)
3. Click "Filter" > Status > select "Active" and "Planning"
4. Sort by Due Date ascending
5. Click "Save View" > name it **"Active Projects"**

**Free plan note:** Group by Folder is not available on Free plan. Tasks appear in a flat list. Use the Folder name in the task path to identify which client each task belongs to.

---

### View 2: Deliverables Pipeline

| Setting | Value |
|---------|-------|
| **Location** | Space > Everything view |
| **Filter** | Tags contains any of: `draft`, `in-review`, `approved`, `delivered` |
| **Sort** | Tag name (manual visual scan) |
| **Purpose** | See where every deliverable is in its lifecycle |

**How to create:**
1. Go to the "Brand System Service" Space > Everything view
2. Click "Filter" > Tags > select `draft`, `in-review`, `approved`, `delivered`
3. Click "Save View" > name it **"Deliverables Pipeline"**

**Free plan note:** Group by Tag is not available on Free plan. To see deliverables by status, you can create separate filtered views per tag, or visually scan tags in the list. The flat view still shows all deliverable tasks with their tags visible.

**Workaround for pipeline visualization:**
- Scan the tag column to count tasks per status
- Or create 4 separate quick filters (one per status tag) within the same view

---

### View 3: Pending Approvals

| Setting | Value |
|---------|-------|
| **Location** | Space > Everything view |
| **Filter** | Tags contains `approval-pending` |
| **Sort** | Due date ascending |
| **Purpose** | See all deliverables waiting for client approval, oldest first |

**How to create:**
1. Go to Space > Everything view
2. Click "Filter" > Tags > select `approval-pending`
3. Sort by Due Date ascending
4. Click "Save View" > name it **"Pending Approvals"**

---

### View 4: Revision Alerts

| Setting | Value |
|---------|-------|
| **Location** | Space > Everything view |
| **Filter** | Tags contains `rev-3` |
| **Sort** | Due date ascending |
| **Purpose** | Identify deliverables approaching or at revision cap (CON-14: 3 rounds max) |

**How to create:**
1. Go to Space > Everything view
2. Click "Filter" > Tags > select `rev-3`
3. Click "Save View" > name it **"Revision Alerts"**

**Note:** Tasks with `rev-3` tag are at their final allowed revision round. If the client requests another revision, the `revision-cap-hit` tag should be applied and scope change process triggered. See `clickup-approval-workflow.md`.

---

### View 5: Completed Projects

| Setting | Value |
|---------|-------|
| **Location** | Space > Everything view |
| **Filter** | Status = Completed (or tasks tagged `delivered` in closed Folders) |
| **Sort** | Completion date descending |
| **Purpose** | Archive view of all completed client projects |

**How to create:**
1. Go to Space > Everything view
2. Click "Filter" > Status > select "Completed" (or "Closed")
3. Click "Save View" > name it **"Completed Projects"**

---

## 3. Manual Metrics Tracking

### BSS Monthly Metrics Document

Create a ClickUp Doc at the Space level named **"BSS Monthly Metrics"**. This document replaces dashboard KPI widgets with manually tracked operational metrics.

### Template (copy for each month)

```
## BSS Operations -- {Month} {Year}

### Active Clients
| Client | Tier | Status | Phase | Notes |
|--------|------|--------|-------|-------|
| {client} | {tier-1/2/3} | {Active/Planning} | {Onboarding/Brand Identity/Creatives/Web/Delivery} | |

### Approval Velocity (Manual Tracking)
| Client | Deliverable | Submitted Date | Approved Date | Days to Approve |
|--------|-------------|----------------|---------------|-----------------|
| {client} | {Brand Identity/Creatives/Web} | {YYYY-MM-DD} | {YYYY-MM-DD} | {N} |

**Average approval time this month:** {N} days

### Revision Summary
| Client | Deliverable | Rounds Used | Cap Hit? | Notes |
|--------|-------------|-------------|----------|-------|
| {client} | {type} | {1/2/3} | {Yes/No} | |

**Clients at rev-3:** {count}
**Scope changes triggered:** {count}

### Client Satisfaction (Post-Delivery)
| Client | Score (1-5) | Feedback Date | Notes |
|--------|-------------|---------------|-------|
| {client} | {score} | {YYYY-MM-DD} | {brief feedback} |

**Average satisfaction this month:** {N}/5
```

### Update Cadence

| When | What | Who |
|------|------|-----|
| **Every Friday** | Update Active Clients table, add new approval/revision entries | PM |
| **On delivery** | Record approval velocity (submitted -> approved dates) | PM |
| **On revision** | Update revision summary table | PM |
| **Post-delivery** | Record client satisfaction score (from survey/feedback) | PM |
| **1st of month** | Create new month section, archive previous month | PM |

### How to Track Approval Velocity Manually

Since ClickUp Free does not have "Time in Status" widgets:

1. When submitting a deliverable for approval, note the date in the Pending Approvals view or in the metrics doc
2. When the client approves, note the approval date
3. Calculate the difference in days
4. Record in the Monthly Metrics doc under "Approval Velocity"

### How to Track Client Satisfaction Manually

1. After delivering the final handoff package, send a brief satisfaction survey (email or form)
2. Record the score (1-5 scale) in the Monthly Metrics doc
3. Add any qualitative feedback in the Notes column

---

## 4. Access Control

On the Free Plan, all workspace members see saved Space views. There is no granular dashboard sharing.

| Role | View Access |
|------|-------------|
| Admin | All saved views + can create/edit views + metrics doc |
| Member | All saved views (read-only unless they created them) |
| Guest | Only tasks shared with them directly |

**Privacy note:** If certain metrics should be restricted (e.g., client satisfaction scores), keep the BSS Monthly Metrics doc shared only with Admin/Manager roles. ClickUp Docs can be shared selectively via the doc's sharing settings.

---

## 5. Weekly Operations Review Process

### Friday Operations Review (15-20 minutes)

1. **Open "Active Projects" view** -- review status of all active clients
2. **Open "Pending Approvals" view** -- check for items pending >5 business days, follow up
3. **Open "Revision Alerts" view** -- check for any new `rev-3` items, trigger scope change if needed
4. **Open "Deliverables Pipeline" view** -- scan for bottlenecks (many items stuck in `draft` or `in-review`)
5. **Update BSS Monthly Metrics doc** -- add new entries, update existing data
6. **Action items:** Note any follow-ups needed, assign via ClickUp comments

---

## 6. Upgrade Path

| Signal | Threshold | Upgrade Action |
|--------|-----------|----------------|
| Manual metrics tracking takes >30 min/week | 10+ active clients | Consider Unlimited ($7/user/mo) for custom field dropdowns and basic reporting |
| Cannot answer "status of X?" quickly | Regularly happening | Consider Unlimited for custom field filtering and grouping |
| Need automated reports or KPI dashboards | Monthly reporting needed | Consider Business ($12/user/mo) for native dashboards with widgets |
| Need client-facing portal with real-time status | 30+ clients | Consider EPIC-BSS-15 (proprietary Client Portal) |

### What Each Plan Adds

| Plan | Monthly Cost | Key Features for BSS |
|------|-------------|---------------------|
| **Free** (current) | $0 | Saved views, tags, recurring tasks, basic filters |
| **Unlimited** | $7/user/mo | Custom fields (dropdowns), unlimited views, basic reporting |
| **Business** | $12/user/mo | Dashboards with widgets, advanced automations, time tracking |

---

## 7. Validation Checklist

Using `test-client` Folder with sample data:

- [x] "Active Projects" saved view created and shows filtered results
- [x] "Deliverables Pipeline" saved view shows tasks with status tags
- [x] "Pending Approvals" saved view shows `approval-pending` tasks sorted by due date
- [x] "Revision Alerts" saved view shows `rev-3` tagged tasks
- [x] "Completed Projects" saved view shows completed/closed tasks
- [x] "BSS Monthly Metrics" ClickUp Doc created with template sections
- [x] Metrics doc is editable and shareable with team
- [x] Weekly update process documented and PM calendar reminder set

---

## References

- **PRD:** FR-8.6 (revised v1.2)
- **Story:** BSS-6.6 (Dashboard & Metrics)
- **Related SOPs:** `clickup-workspace-guide.md` (tags setup), `clickup-approval-workflow.md` (approval data), `clickup-deliverables-guide.md` (deliverable status tags)
