# ClickUp Project Setup

```yaml
task:
  id: clickup-project-setup
  name: "ClickUp Project Setup"
  agent: operations-coordinator
  squad: branding
  type: operations
```

## Proposito

Create and configure a complete ClickUp project structure for a new branding client, including all standard lists, statuses, custom fields, and automation rules required by the branding squad workflow.

## Input

- Client name and basic information
- Selected deliverable tier (1, 2, or 3)
- Project timeline and milestones
- Team member assignments

## Output

- Fully configured ClickUp Space/Folder for the client
- All standard lists created (Onboarding, Brand Identity, Creatives, Web, QA & Approvals, Delivery)
- Custom fields and automations active
- Project kickoff task assigned

## Workflow

### Passo 1: Create Project Structure
Create the ClickUp Space or Folder using the branding squad template with all standard lists and sublists.

### Passo 2: Configure Custom Fields
Set up custom fields for each list: deliverable type, revision round, approval status, asset URLs, and brand profile reference.

### Passo 3: Apply Automations
Enable automation rules for status transitions, notifications on revision submissions, and deadline reminders.

### Passo 4: Assign Team and Milestones
Assign team members to their respective lists and set milestone dates based on the project timeline.

### Passo 5: Generate Kickoff Task
Create the initial kickoff task with discovery workshop scheduling and pre-work checklist.

## O que faz

- Creates standardized ClickUp project structure for branding clients
- Configures custom fields tailored to branding deliverables
- Sets up automation rules for status tracking and notifications
- Assigns team members and establishes milestone timeline
- Generates initial kickoff task with onboarding checklist

## O que NAO faz

- Does not execute the discovery workshop (that is brand-strategist's domain)
- Does not create tasks for individual deliverables (those are created as work progresses)
- Does not configure billing or payment tracking

## Ferramentas

- **ClickUp API** -- Create spaces, folders, lists, tasks, and automations
- **Template Engine** -- Apply branding squad project template

## Quality Gate

- Threshold: >70%
- All standard lists created and properly nested
- Custom fields configured for all deliverable types
- At least one automation rule active for status transitions

---
*Squad Branding Task*
