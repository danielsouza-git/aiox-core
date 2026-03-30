# Client Onboarding

```yaml
task:
  id: client-onboarding
  name: "Client Onboarding"
  agent: operations-coordinator
  squad: branding
  type: operations
```

## Proposito

Execute the full client onboarding workflow, from initial intake through discovery workshop scheduling, ensuring all prerequisite information and assets are collected before brand work begins.

## Input

- Client contact information
- Selected service tier and add-ons
- Existing brand assets (if any)
- Preferred timeline

## Output

- Completed intake form with all required fields
- Client folder structure in R2 storage
- ClickUp project created and configured
- Discovery workshop scheduled
- Onboarding status report

## Workflow

### Passo 1: Collect Intake Information
Gather company basics, industry, target audience, existing brand materials, competitor URLs, and deliverable preferences via the intake form.

### Passo 2: Create Storage Structure
Set up the R2 folder structure for the client with standard subfolders (brand-book, social, video, web, email, tokens, source).

### Passo 3: Setup ClickUp Project
Trigger the clickup-project-setup task to create the full project structure with appropriate tier configuration.

### Passo 4: Upload Existing Assets
If the client has existing brand assets, upload them to the appropriate R2 folders and catalog them in the onboarding task.

### Passo 5: Schedule Discovery
Coordinate discovery workshop scheduling based on mode (standard 15-min or audit-assisted) and notify the brand-strategist agent.

## O que faz

- Collects and validates all client intake information
- Creates organized storage structure in Cloudflare R2
- Triggers ClickUp project creation with correct tier settings
- Catalogs existing client assets for reference
- Schedules and prepares for brand discovery workshop

## O que NAO faz

- Does not conduct the discovery workshop (brand-strategist handles that)
- Does not make brand strategy decisions
- Does not generate any creative deliverables

## Ferramentas

- **ClickUp API** -- Project and task creation
- **Cloudflare R2** -- Asset storage setup
- **Intake Form** -- Client information collection

## Quality Gate

- Threshold: >70%
- All required intake fields populated
- R2 folder structure created with correct permissions
- ClickUp project active with assigned team members

---
*Squad Branding Task*
