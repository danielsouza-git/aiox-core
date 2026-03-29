# Business Squads PRD - Product Requirements Document

**Version:** 1.1
**Date:** 2026-03-29
**Author:** Morgan (PM Agent)
**Status:** Draft

---

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2026-03-29 | 1.0 | Initial PRD creation - 7 business squads | Morgan (PM) |
| 2026-03-29 | 1.1 | Architect review fixes: agent format, R-I dependency, Orchestrator path | Aria (Architect) |

---

## 1. Goals

- Implement 7 business squads as structured AI agent teams within the AIOX framework, providing complete operational coverage for a digital business
- Enable autonomous execution of business processes (OPS, Vendas, Administracao, Produto, CS, Marketing, Auditoria) through specialized AI agents with clear Input/Output contracts
- Establish a repeatable squad pattern (AI Head + N agents + tasks per agent) with quality gates (>70%) that can be orchestrated by a Chief Orchestrator agent
- Create a clear delegation model where business squad agents leverage AIOX core agents (@pm, @analyst, etc.) when needed, without duplicating core agent capabilities
- Deliver markdown-based agent and task definitions in `squads/` (L4 - Project Runtime) following the established AIOX squad architecture pattern

## 2. Background Context

The user operates a digital business with 6 functional squads visible on a Figma board, plus a 7th squad (Auditoria) decided during planning sessions. Today, these squads exist as conceptual designs without executable AI agent definitions. The AIOX framework already supports squads via the `squads/` directory structure (proven by `claude-code-mastery` and `branding` squads), providing a mature pattern of `config.yaml` + `agents/` + `tasks/` + `workflows/` + `checklists/`.

The business hierarchy flows from CEO through 3 Conselheiros (including a Steve Jobs clone) to 3 Builders who interface via WhatsApp/Telegram/Slack. The Builders work through a Chief Orchestrator agent that routes work to the 6 operational squads, while a 7th Auditoria squad operates independently to audit the structure of all squads.

Key architectural decisions have already been made: business squad agents are NOT clones of AIOX core agents -- they are specialized agents that delegate to core agents when needed. Several naming conflicts have been resolved (Process Architect, Process Validator), and cross-squad flow patterns are documented.

---

## 3. Requirements

### 3.1 Functional Requirements

- **FR-1:** Each of the 7 squads MUST be implemented as a self-contained directory under `squads/` with the standard structure: `config.yaml`, `agents/`, `tasks/`, and optional `workflows/`, `checklists/`, `data/` directories
- **FR-2:** Each squad MUST have an AI Head agent definition that receives demands, analyzes needs, distributes to the team, tracks progress, and delivers final output
- **FR-3:** Each agent definition (`.md` file) MUST follow the standard pattern: Input/Output contract, "O que faz" (what it does), "Nao faz" (what it does NOT do), Ferramentas (tools), and Quality Gates (>70% threshold)
- **FR-4:** Each task definition (`.md` file) MUST specify: Input, Output, "O que faz", "Nao faz", Ferramentas, and the quality gate pass threshold
- **FR-5:** The OPS squad MUST implement the sequential quality gates flow: Process Mapper (>70%) -> Process Architect (>70%) -> Automation Architect (>70%) -> Process Validator -> Quality Gate FINAL (>70%) -> ENTREGA
- **FR-6:** Cross-squad flows MUST be documented in each squad's `config.yaml` via a `handoffs` section, specifying which squad/agent receives output and under what conditions
- **FR-7:** The Product Manager agent in Squad Produto MUST delegate to AIOX core @pm (Morgan) for PRD and spec work, not duplicate that capability
- **FR-8:** The Research Analyst agent in Squad Marketing MUST consume outputs from the research-intelligence squad (Tessa/Cyrus/Maya) rather than duplicating research capabilities
- **FR-9:** The Process Validator agent (OPS) and Squad Auditor (Auditoria) MUST have clearly distinct scopes: Process Validator audits process execution quality, Auditoria audits structural completeness of squads
- **FR-10:** CS/Retencao agents appearing in both Produto and CS squads MUST have distinct task scopes: Produto focuses on product quality validation, CS focuses on client retention and health
- **FR-11:** The Auditoria squad MUST operate independently from all other squads, with read access to all squad definitions for structural auditing
- **FR-12:** Each squad's `config.yaml` MUST register all agents with tier classification, entry_agent designation, and handoff matrix (following the pattern established by `squads/claude-code-mastery/config.yaml`)
- **FR-13:** Agent naming MUST use kebab-case for file names (e.g., `process-mapper.md`, `media-buyer.md`) and descriptive display names in the agent definition
- **FR-14:** Squad 1 (OPS) MUST serve as the foundational squad that other squads can request process mapping and architecture from, acting as the "architect of the house"
- **FR-15:** The Chief Orchestrator agent (above the 6 operational squads) MUST be defined at `squads/orchestration/` following the standard squad pattern (`config.yaml` + `agents/chief-orchestrator.md`), serving as the routing layer between Builders and squads, capable of analyzing requests and dispatching to the correct squad head
- **FR-16:** All 81 tasks across all 7 squads MUST be created as individual `.md` files within each squad's `tasks/` directory

### 3.2 Non-Functional Requirements

- **NFR-1:** Squad definitions MUST be pure markdown files with no code dependencies, loadable by any AIOX-compatible IDE agent
- **NFR-2:** Total file count across all 7 squads SHOULD remain under 150 files to keep the repository manageable
- **NFR-3:** Each agent definition file SHOULD be under 200 lines to fit within a single context window load
- **NFR-4:** Each task definition file SHOULD be under 100 lines for focused, atomic execution
- **NFR-5:** Squad directory structure MUST follow the established AIOX convention: `squads/{squad-name}/config.yaml` as the entry point
- **NFR-6:** Quality gate thresholds MUST be configurable per squad via `config.yaml` (default: 70%)
- **NFR-7:** All squad files MUST be in Portuguese (business domain language) for agent instructions, with English for structural YAML keys and file names

---

## 4. Technical Assumptions

### 4.1 Repository Structure

Monorepo -- all squads live under `squads/` in the existing `aios-core` repository (L4 - Project Runtime, always mutable).

### 4.2 Service Architecture

File-based agent definitions (markdown + YAML). No backend services, no databases, no APIs. Agents are loaded by the AIOX framework at activation time. Each squad is a self-contained directory that can be loaded independently.

### 4.3 Testing Requirements

Manual validation via the PM checklist. Structural validation can be done by the Auditoria squad itself once implemented. No automated test suite needed for markdown definitions -- the quality gates are embedded in the agent/task definitions.

### 4.4 Additional Technical Assumptions

- The existing squad pattern from `squads/claude-code-mastery/` serves as the primary reference architecture. Note: `squads/branding/` uses a slightly different structure (no `config.yaml`, uses `config/` directory instead) and may need migration in the future
- Agent definitions follow a **business-agent template** -- a simplified format distinct from the full AIOX agent YAML-in-markdown format (`.aiox-core/development/agents/*.md`). Business agents use: YAML metadata wrapper + Input/Output contract, "O que faz", "Nao faz", Ferramentas, Quality Gates (>70%). This is an intentional variation because business squad agents are process-oriented role specifications, not IDE-loaded agents with persona/activation protocols
- Tools referenced in agent/task definitions (ClickUp, Notion, CRM, etc.) are external SaaS platforms, not AIOX MCP tools -- they represent the human-facing toolset each agent advises on
- The Chief Orchestrator is a special agent at `squads/orchestration/` that sits above the 6 operational squads and below the 3 Builders in the hierarchy
- The `squads/` directory is L4 (Project Runtime) and fully mutable -- no framework protection applies

---

## 5. Epic List

### Epic 1: OPS Squad -- Process Operations Foundation
Establish the foundational operations squad that all other squads depend on for process mapping, architecture, automation, and quality validation. **8 tasks, 4 agents + 1 AI Head.**

### Epic 2: Vendas Squad -- Sales Pipeline
Implement the complete sales pipeline from lead scoring through closing, with pipeline analytics and forecasting. **10 tasks, 3 agents + 1 AI Head.**

### Epic 3: Administracao Squad -- Back-Office Operations
Build the comprehensive back-office squad covering Financeiro, RH/People, Juridico, Facilities, and Compliance. **17 tasks, 5 agents + 1 AI Head.**

### Epic 4: Produto Squad -- Product Management
Create the product squad covering discovery, roadmap, content creation, and product quality, with delegation to AIOX core @pm. **12 tasks, 3 agents + 1 AI Head.**

### Epic 5: Customer Success Squad -- Client Lifecycle
Implement the complete client lifecycle from onboarding through retention, including support triage and churn prevention. **12 tasks, 3 agents + 1 AI Head.**

### Epic 6: Marketing Squad -- Growth Engine
Build the full marketing squad covering social media, trafego pago, email, content/SEO, and research/analysis. **17 tasks, 5 agents + 1 AI Head.**

### Epic 7: Auditoria Squad -- Structural Auditing
Create the independent auditing squad that validates structural completeness, coverage, delegation correctness, and quality gate compliance across all squads. **6 tasks, 3 agents + 1 AI Head.**

**Rationale for epic ordering:** OPS comes first because it is the "architect of the house" -- other squads need to be able to request process mapping from OPS. Vendas and Administracao follow as they are the most operationally critical. Produto and CS come next as they depend on having sales flow and admin infrastructure. Marketing builds on Produto and Vendas outputs. Auditoria comes last because it needs all other squads to exist before it can audit them.

---

## 6. Epic Details

---

### Epic 1: OPS Squad -- Process Operations Foundation

**Goal:** Establish the foundational operations squad that serves as the "architect of the house" for all other squads. OPS receives demands from any squad, maps processes, designs architecture in ClickUp, creates automations, and validates quality through a sequential gate flow. Without OPS, each squad invents its own rules.

**Directory:** `squads/ops/`

**Agents (5):**
- AI Head (ops-head)
- Process Mapper (process-mapper)
- Process Architect (process-architect)
- Automation Architect (automation-architect)
- Process Validator (process-validator)

**Quality Gates Flow:** Process Mapper (>70%) -> Process Architect (>70%) -> Automation Architect (>70%) -> Process Validator -> Quality Gate FINAL (>70%) -> ENTREGA

**Files to create (14):**
- `squads/ops/config.yaml`
- `squads/ops/agents/ops-head.md`
- `squads/ops/agents/process-mapper.md`
- `squads/ops/agents/process-architect.md`
- `squads/ops/agents/automation-architect.md`
- `squads/ops/agents/process-validator.md`
- `squads/ops/tasks/discovery-process.md`
- `squads/ops/tasks/create-process.md`
- `squads/ops/tasks/design-architecture.md`
- `squads/ops/tasks/design-executors.md`
- `squads/ops/tasks/create-task-definitions.md`
- `squads/ops/tasks/create-task-definitions-automations.md`
- `squads/ops/tasks/design-qa-gates.md`
- `squads/ops/tasks/test-qa-gates.md`

**Dependencies:** None (foundational squad)

---

#### Story 1.1: Create OPS Squad Config and AI Head

As the Chief Orchestrator,
I want the OPS squad to have a config.yaml and AI Head agent definition,
so that the squad can be activated and demands can be routed to it.

**Acceptance Criteria:**

1. `squads/ops/config.yaml` exists following the pattern from `squads/claude-code-mastery/config.yaml` with squad metadata, tier architecture, agent registry, handoff matrix, and cross-cutting concerns
2. `squads/ops/agents/ops-head.md` defines the AI Head with: receives demands from other squads, analyzes needs, distributes to team, tracks progress, delivers final output
3. AI Head explicitly lists what it does NOT do: map processes, create architecture in ClickUp, create automations, implement
4. AI Head lists tools: ClickUp, Slack, Notion, Loom
5. Config.yaml registers all 5 agents (ops-head, process-mapper, process-architect, automation-architect, process-validator) with tier classification
6. Config.yaml includes handoff routes from ops-head to all 4 specialist agents
7. Config.yaml documents the sequential quality gates flow in a `quality_gates` section

---

#### Story 1.2: Create Process Mapper Agent and Tasks

As the OPS Head,
I want a Process Mapper agent with Discovery Process and Create Process tasks,
so that incoming process mapping demands can be analyzed end-to-end and redesigned.

**Acceptance Criteria:**

1. `squads/ops/agents/process-mapper.md` defines the agent with Input/Output contract, "O que faz", "Nao faz", Ferramentas (Figma, Notion, Google Docs, Loom, Miro), and quality gate >70%
2. `squads/ops/tasks/discovery-process.md` specifies: Input (pedido de mapeamento de qualquer squad via OPS), Output (documento de processo atual mapeado), maps process from end to start, identifies steps and bottlenecks, discovers who does what, documents possible error paths, interviews stakeholders, records process being executed
3. `squads/ops/tasks/create-process.md` specifies: Input (Discovery Process document), Output (new process flowchart), designs new process, defines steps and owners, eliminates error paths, defines handoffs between steps, documents veto conditions, validates with stakeholders
4. Create Process task includes quality gate >70% that gates progression to Process Architect
5. Both task files explicitly state what the agent does NOT do (implement in ClickUp, create automations, execute tasks)

---

#### Story 1.3: Create Process Architect Agent and Tasks

As the OPS Head,
I want a Process Architect agent with Design Architecture and Design Executors tasks,
so that approved processes can be translated into ClickUp structures and responsibility matrices.

**Acceptance Criteria:**

1. `squads/ops/agents/process-architect.md` defines the agent (renamed from "Architect" to avoid confusion with AIOX @architect Aria) with Input/Output, "O que faz", "Nao faz", Ferramentas (ClickUp, Notion, Google Drive, Sheets)
2. `squads/ops/tasks/design-architecture.md` specifies: Input (Create Process output), Output (folder/list/field/status structure), defines folder/list structure in ClickUp, custom fields, status flows, task templates, views per executor
3. `squads/ops/tasks/design-executors.md` specifies: Input (Design Architecture output), Output (responsibility matrix), defines who executes each step, clear responsibilities, handoffs between executors, SLAs per step, escalation paths, ensures no one has dual functions
4. Design Executors includes quality gate >70% that gates progression to Automation Architect

---

#### Story 1.4: Create Automation Architect Agent and Tasks

As the OPS Head,
I want an Automation Architect agent with task definition and automation tasks,
so that processes can be codified into executable task definitions and automated workflows.

**Acceptance Criteria:**

1. `squads/ops/agents/automation-architect.md` defines the agent with Input/Output, "O que faz", "Nao faz", Ferramentas (ClickUp, Notion, Markdown for definitions; ClickUp Automations, N8N self-hosted, Webhooks, APIs for automations)
2. `squads/ops/tasks/create-task-definitions.md` specifies: Input (Design Executors output), Output (documented task definitions), creates definition for each task, defines inputs/outputs, acceptance criteria, dependencies, blocking conditions, "done" examples
3. `squads/ops/tasks/create-task-definitions-automations.md` specifies: Input (Create Task Definitions output), Output (configured and tested automations), creates error-blocking automations, configures inter-step triggers, auto-moves cards, configures notifications, integrates systems (Tidy+AC etc.), tests before activating, documents each automation, creates fallback if automation fails
4. Automations task includes quality gate >70% that gates progression to Process Validator

---

#### Story 1.5: Create Process Validator Agent and Tasks

As the OPS Head,
I want a Process Validator agent with QA gate design and testing tasks,
so that every process goes through structured quality validation before delivery.

**Acceptance Criteria:**

1. `squads/ops/agents/process-validator.md` defines the agent (renamed from "QA" to avoid confusion with AIOX @qa Quinn) with Input/Output, "O que faz", "Nao faz", Ferramentas (ClickUp, Notion, Sheets for design; Notion, ClickUp, Markdown, Loom for testing)
2. `squads/ops/tasks/design-qa-gates.md` specifies: Input (Automations output), Output (quality criteria + checklists), defines quality criteria, defines what is >70% vs <70%, creates validation checklists, defines verification points, defines what blocks advancement, defines who approves each gate
3. `squads/ops/tasks/test-qa-gates.md` specifies: Input (Design QA Gates checklists), Output (validated process OR correction list), executes checklist on process, validates everything works, tests with "lay person", documents problems found, approves or rejects, indicates where to return if failed
4. Test QA Gates is the FINAL quality gate (>70%) before ENTREGA
5. Process Validator explicitly scopes to process execution quality (distinct from Auditoria which audits structural completeness)

---

### Epic 2: Vendas Squad -- Sales Pipeline

**Goal:** Implement the complete sales pipeline from lead generation through deal closing, supported by analytics and forecasting. The squad covers SDR (prospecting and qualification), Closer (discovery through closing), and Sales Analyst (pipeline analysis, forecasting, reporting).

**Directory:** `squads/vendas/`

**Agents (4):**
- AI Head (vendas-head)
- SDR (sdr)
- Closer (closer)
- Analista de Vendas (sales-analyst)

**Files to create (15):**
- `squads/vendas/config.yaml`
- `squads/vendas/agents/vendas-head.md`
- `squads/vendas/agents/sdr.md`
- `squads/vendas/agents/closer.md`
- `squads/vendas/agents/sales-analyst.md`
- `squads/vendas/tasks/lead-scoring.md`
- `squads/vendas/tasks/lead-qualification.md`
- `squads/vendas/tasks/first-contact.md`
- `squads/vendas/tasks/discovery-call.md`
- `squads/vendas/tasks/proposal.md`
- `squads/vendas/tasks/negotiation.md`
- `squads/vendas/tasks/close-deal.md`
- `squads/vendas/tasks/pipeline-analysis.md`
- `squads/vendas/tasks/forecast.md`
- `squads/vendas/tasks/report.md`

**Dependencies:** OPS (for process definitions), Marketing (leads generated by marketing flow to SDR)

**Cross-Squad Flows:**
- Close Deal -> CS (Welcome Client via Onboarding Specialist)
- Cold leads -> Marketing (nurture flow)
- Receives leads from Marketing (marketing-generated leads -> SDR)
- Receives upsell leads from CS (Upsell Detection -> SDR)

---

#### Story 2.1: Create Vendas Squad Config and AI Head

As the Chief Orchestrator,
I want the Vendas squad to have a config.yaml and AI Head agent definition,
so that sales pipeline demands can be routed and managed.

**Acceptance Criteria:**

1. `squads/vendas/config.yaml` exists with squad metadata, tier architecture, agent registry (vendas-head, sdr, closer, sales-analyst), handoff matrix, and cross-squad flow documentation
2. `squads/vendas/agents/vendas-head.md` defines the AI Head: defines goals, distributes leads, tracks pipeline, removes blockers, demands results
3. AI Head does NOT do: prospect, close deals, make calls
4. AI Head tools: CRM (HubSpot/Pipedrive), ClickUp, Slack, Sheets
5. Config.yaml documents cross-squad flows: to CS (close deal), to Marketing (cold leads), from Marketing (new leads), from CS (upsell)

---

#### Story 2.2: Create SDR Agent and Tasks

As the Vendas Head,
I want an SDR agent with Lead Scoring, Lead Qualification, and First Contact tasks,
so that leads can be scored, qualified, and contacted before passing to Closers.

**Acceptance Criteria:**

1. `squads/vendas/agents/sdr.md` defines the SDR agent with Input/Output, tools (CRM, Sheets, WhatsApp, Email, Calendly)
2. `squads/vendas/tasks/lead-scoring.md`: Input (raw lead), Output (scored lead 0-100 + priority), scores based on ICP fit
3. `squads/vendas/tasks/lead-qualification.md`: Input (scored lead), Output (BANT-qualified lead or discarded), applies Budget/Authority/Need/Timeline
4. `squads/vendas/tasks/first-contact.md`: Input (qualified lead), Output (scheduled call or nurture), first contact via email/WhatsApp/call, schedules Closer call, sends pre-sale material
5. Handoff: qualified lead + scheduled call -> Closer

---

#### Story 2.3: Create Closer Agent and Tasks

As the Vendas Head,
I want a Closer agent with Discovery Call, Proposal, Negotiation, and Close Deal tasks,
so that qualified leads can be converted into signed contracts.

**Acceptance Criteria:**

1. `squads/vendas/agents/closer.md` defines the Closer agent with Input/Output, tools (Zoom, Google Meet, CRM, Notion, PDF/Slides, WhatsApp, Stripe/PagSeguro, digital contracts)
2. `squads/vendas/tasks/discovery-call.md`: Input (scheduled lead), Output (mapped needs + confirmed fit)
3. `squads/vendas/tasks/proposal.md`: Input (mapped needs), Output (proposal sent), uses OPS templates
4. `squads/vendas/tasks/negotiation.md`: Input (lead objections), Output (objections handled), no discounts without approval
5. `squads/vendas/tasks/close-deal.md`: Input (ready lead), Output (signed contract or lost + reason), collects payment, passes to CS
6. Cold leads flow back to Marketing for nurture

---

#### Story 2.4: Create Sales Analyst Agent and Tasks

As the Vendas Head,
I want a Sales Analyst agent with Pipeline Analysis, Forecast, and Report tasks,
so that the sales pipeline has data-driven visibility and forecasting.

**Acceptance Criteria:**

1. `squads/vendas/agents/sales-analyst.md` defines the Analyst agent, tools (CRM, Sheets, Metabase, Slides, Notion)
2. `squads/vendas/tasks/pipeline-analysis.md`: Input (CRM data), Output (bottlenecks identified), analyzes funnel, identifies bottlenecks, calculates conversion rates, monitors velocity
3. `squads/vendas/tasks/forecast.md`: Input (current pipeline), Output (revenue forecast), projects monthly/quarterly sales, calculates probability per deal, alerts if goal at risk
4. `squads/vendas/tasks/report.md`: Input (period metrics), Output (weekly/monthly report), metrics: CAC, LTV, average ticket, loss reasons, period comparison

---

### Epic 3: Administracao Squad -- Back-Office Operations

**Goal:** Build the comprehensive back-office squad covering 5 functional areas: Financeiro (accounts payable/receivable, cash flow, reporting), RH/People (recruitment, onboarding, management, offboarding), Juridico (contracts, compliance, disputes), Facilities (tools, access, vendors), and Compliance (audits, policies, LGPD). This is the largest squad with 17 tasks across 5 agents.

**Directory:** `squads/administracao/`

**Agents (6):**
- AI Head (admin-head)
- Financeiro (financeiro)
- RH/People (rh-people)
- Juridico (juridico)
- Facilities (facilities)
- Compliance (compliance)

**Files to create (24):**
- `squads/administracao/config.yaml`
- `squads/administracao/agents/admin-head.md`
- `squads/administracao/agents/financeiro.md`
- `squads/administracao/agents/rh-people.md`
- `squads/administracao/agents/juridico.md`
- `squads/administracao/agents/facilities.md`
- `squads/administracao/agents/compliance.md`
- `squads/administracao/tasks/contas-a-pagar.md`
- `squads/administracao/tasks/contas-a-receber.md`
- `squads/administracao/tasks/fluxo-de-caixa.md`
- `squads/administracao/tasks/financial-report.md`
- `squads/administracao/tasks/recrutamento.md`
- `squads/administracao/tasks/onboarding-interno.md`
- `squads/administracao/tasks/gestao-pessoas.md`
- `squads/administracao/tasks/offboarding.md`
- `squads/administracao/tasks/contratos.md`
- `squads/administracao/tasks/compliance-legal.md`
- `squads/administracao/tasks/disputas.md`
- `squads/administracao/tasks/ferramentas.md`
- `squads/administracao/tasks/acessos.md`
- `squads/administracao/tasks/fornecedores.md`
- `squads/administracao/tasks/auditorias-internas.md`
- `squads/administracao/tasks/politicas.md`
- `squads/administracao/tasks/lgpd.md`

**Dependencies:** OPS (process creation requests)

---

#### Story 3.1: Create Administracao Squad Config and AI Head

As the Chief Orchestrator,
I want the Administracao squad to have a config.yaml and AI Head,
so that back-office demands can be triaged and routed to the correct functional area.

**Acceptance Criteria:**

1. `squads/administracao/config.yaml` exists with 3-tier agent architecture: Tier 0 (admin-head), Tier 1 (financeiro, rh-people, juridico), Tier 2 (facilities, compliance)
2. `squads/administracao/agents/admin-head.md` defines the AI Head: controls backoffice, distributes demands, controls budget, removes blockers/delays, reports financial health
3. AI Head does NOT: post invoices, hire, create processes (asks OPS)
4. AI Head tools: Cloze, Conta Azul/Omie, Sheets, Google Drive

---

#### Story 3.2: Create Financeiro Agent and Tasks

As the Admin Head,
I want a Financeiro agent with Contas a Pagar, Contas a Receber, Fluxo de Caixa, and Report tasks,
so that financial operations are systematized and cash flow is visible.

**Acceptance Criteria:**

1. `squads/administracao/agents/financeiro.md` defines the agent with tools (Conta Azul, Stripe, Banco, Sheets, Slides)
2. 4 task files created covering: payments (auto for fixed costs, Head approves above threshold), receivables (invoices, delinquency tracking), cash flow projection with risk alerts, and monthly DRE + CEO report (burn rate, runway)
3. Each task specifies clear Input/Output and "Nao faz" boundaries

---

#### Story 3.3: Create RH/People Agent and Tasks

As the Admin Head,
I want an RH/People agent with Recrutamento, Onboarding, Gestao, and Offboarding tasks,
so that the full employee lifecycle is covered.

**Acceptance Criteria:**

1. `squads/administracao/agents/rh-people.md` defines the agent with tools (Slack, LinkedIn, Notion, ClickUp, Google Drive, Sheets, Convenia, Typeform)
2. 4 task files created: Recrutamento (publishes jobs, screens candidates, schedules interviews -- does NOT decide hiring), Onboarding (prepares access/equipment/docs -- does NOT train on function), Gestao (vacation/benefits/climate -- does NOT evaluate performance), Offboarding (processes termination/removes access -- does NOT decide termination)
3. Clear delegation: Head decides hiring/firing, squad does technical interviews

---

#### Story 3.4: Create Juridico Agent and Tasks

As the Admin Head,
I want a Juridico agent with Contratos, Compliance, and Disputas tasks,
so that legal operations are systematized with external counsel integration.

**Acceptance Criteria:**

1. `squads/administracao/agents/juridico.md` defines the agent with tools (Google Docs, DocuSign, Clicksign, Notion, Email, Drive)
2. 3 task files: Contratos (drafts/reviews contracts for clients/vendors/employees, LGPD terms -- does NOT audit alone), Compliance (ensures legal conformity, external counsel integration -- does NOT create policy alone), Disputas (translates complaints legally, coordinates with external counsel, tracks cases -- does NOT negotiate without approval)

---

#### Story 3.5: Create Facilities Agent and Tasks

As the Admin Head,
I want a Facilities agent with Ferramentas, Acessos, and Fornecedores tasks,
so that tools, access control, and vendor management are centralized.

**Acceptance Criteria:**

1. `squads/administracao/agents/facilities.md` defines the agent with tools (Sheets, Notion, Google Admin, SoC Admin)
2. 3 task files: Ferramentas (controls SaaS subscriptions, negotiates plans -- does NOT approve purchases), Acessos (manages access, technical onboarding -- does NOT decide who gets access), Fornecedores (registers vendors, evaluates quality -- does NOT choose vendor)

---

#### Story 3.6: Create Compliance Agent and Tasks

As the Admin Head,
I want a Compliance agent with Auditorias, Politicas, and LGPD tasks,
so that internal compliance, policies, and data protection are managed.

**Acceptance Criteria:**

1. `squads/administracao/agents/compliance.md` defines the agent (separate from Juridico) with tools (Checklist, Notion, Google Docs, Sheets)
2. 3 task files: Auditorias (audits internal processes and legal compliance -- does NOT punish), Politicas (drafts ESG policies -- CEO approves), LGPD (ensures transparency, maps personal data flows, tests data subject compliance -- does NOT implement technically)
3. Clear distinction: Compliance agent in Admin handles process/policy compliance; this is different from Auditoria squad which audits squad structures

---

### Epic 4: Produto Squad -- Product Management

**Goal:** Create the product squad covering the full product lifecycle: discovery, roadmap, spec, launch coordination, content creation, review, publishing, and product quality validation. The Product Manager agent delegates to AIOX core @pm (Morgan) for formal PRD/spec work. CS/Retencao appears here focused on product quality (distinct from CS squad where it focuses on client retention).

**Directory:** `squads/produto/`

**Agents (4):**
- AI Head (produto-head)
- Product Manager (product-manager) -- delegates to @pm
- Content Creator (content-creator)
- CS/Retencao - Produto (cs-retencao-produto)

**Files to create (17):**
- `squads/produto/config.yaml`
- `squads/produto/agents/produto-head.md`
- `squads/produto/agents/product-manager.md`
- `squads/produto/agents/content-creator.md`
- `squads/produto/agents/cs-retencao-produto.md`
- `squads/produto/tasks/discovery.md`
- `squads/produto/tasks/roadmap.md`
- `squads/produto/tasks/spec.md`
- `squads/produto/tasks/launch-coordination.md`
- `squads/produto/tasks/content-research.md`
- `squads/produto/tasks/content-create.md`
- `squads/produto/tasks/content-review.md`
- `squads/produto/tasks/content-publish.md`
- `squads/produto/tasks/quality-check.md`
- `squads/produto/tasks/test-experience.md`
- `squads/produto/tasks/feedback-loop.md`
- `squads/produto/tasks/quality-report.md`

**Dependencies:** OPS (process creation), Marketing (launch coordination), Vendas (launch coordination)

**Cross-Squad Flows:**
- Launch Coordination -> Marketing + Vendas
- Feedback Loop <- CS (Experiencia feedback)
- Quality issues -> feeds back to Content Creator

---

#### Story 4.1: Create Produto Squad Config and AI Head

As the Chief Orchestrator,
I want the Produto squad to have a config.yaml and AI Head,
so that product demands can be triaged and the product lifecycle managed.

**Acceptance Criteria:**

1. `squads/produto/config.yaml` exists with agent registry, tier architecture, handoff matrix
2. `squads/produto/agents/produto-head.md`: defines roadmap, prioritizes backlog, validates quality, aligns with business, demands deliveries
3. Does NOT: create content, write code, create processes (asks OPS)
4. Tools: ClickUp, Notion, Slack, Miro
5. Config documents delegation: product-manager -> @pm (Morgan) for PRD/spec work

---

#### Story 4.2: Create Product Manager Agent and Tasks

As the Produto Head,
I want a Product Manager agent with Discovery, Roadmap, Spec, and Launch Coordination tasks,
so that product opportunities are validated and turned into actionable specs.

**Acceptance Criteria:**

1. `squads/produto/agents/product-manager.md` explicitly states delegation to AIOX core @pm (Morgan) for formal PRD and spec creation
2. 4 task files: Discovery (identifies opportunities, researches needs, validates ideas), Roadmap (defines priorities, plans quarterly, aligns with business objectives), Spec (documents requirements, defines acceptance criteria, briefs Content Creator), Launch Coordination (coordinates with Marketing and Vendas, defines date/strategy, tracks launch metrics)
3. Tools: Notion, Miro, Typeform, ClickUp, Sheets, Slack, Figma

---

#### Story 4.3: Create Content Creator Agent and Tasks

As the Produto Head,
I want a Content Creator agent with Research, Create, Review, and Publish tasks,
so that product content (courses, videos, guides) can be produced and published.

**Acceptance Criteria:**

1. `squads/produto/agents/content-creator.md` defines the agent, tools (Google, YouTube, Notion, Loom, Descript, Canva, Hotmart/Kajabi/Teachable)
2. 4 task files: Research (deep topic research, collects references), Create (creates content -- courses, videos, guides), Review (revises based on QA feedback), Publish (uploads to platform, organizes structure, tests access)
3. Content Creator does NOT: create landing pages (asks COPY), create sales emails (asks COPY), configure platform (asks OPS)

---

#### Story 4.4: Create CS/Retencao-Produto Agent and Tasks

As the Produto Head,
I want a CS/Retencao agent focused on product quality with Quality Check, Test, Feedback Loop, and Report tasks,
so that product content is validated against spec before and after publishing.

**Acceptance Criteria:**

1. `squads/produto/agents/cs-retencao-produto.md` defines the agent SCOPED TO PRODUCT QUALITY (distinct from CS squad's retention focus)
2. 4 task files: Quality Check (reviews content before publishing, validates against PM spec), Test Experience (tests student/client experience, navigates as user, identifies problems), Feedback Loop (collects feedback from CS Experiencia, organizes by priority, passes to PM), Report (quality metrics, NPS, completion rate)
3. Agent does NOT: create content, fix technical bugs, resolve tickets

---

### Epic 5: Customer Success Squad -- Client Lifecycle

**Goal:** Implement the complete client lifecycle squad from welcome and onboarding through ongoing support, proactive engagement, and churn prevention. CS/Retencao appears here focused on client health and retention (distinct from Produto squad where it validates product quality).

**Directory:** `squads/customer-success/`

**Agents (4):**
- AI Head (cs-head)
- Onboarding Specialist (onboarding-specialist)
- Suporte (suporte)
- CS/Retencao - CS (cs-retencao)

**Files to create (17):**
- `squads/customer-success/config.yaml`
- `squads/customer-success/agents/cs-head.md`
- `squads/customer-success/agents/onboarding-specialist.md`
- `squads/customer-success/agents/suporte.md`
- `squads/customer-success/agents/cs-retencao.md`
- `squads/customer-success/tasks/welcome-client.md`
- `squads/customer-success/tasks/setup-account.md`
- `squads/customer-success/tasks/first-value.md`
- `squads/customer-success/tasks/handoff-to-cs.md`
- `squads/customer-success/tasks/ticket-triage.md`
- `squads/customer-success/tasks/resolve-ticket.md`
- `squads/customer-success/tasks/escalate-ticket.md`
- `squads/customer-success/tasks/support-report.md`
- `squads/customer-success/tasks/health-check.md`
- `squads/customer-success/tasks/engagement.md`
- `squads/customer-success/tasks/upsell-detection.md`
- `squads/customer-success/tasks/churn-prevention.md`

**Dependencies:** Vendas (receives closed clients), Produto (feedback to product)

**Cross-Squad Flows:**
- Receives from Vendas: Close Deal -> Welcome Client
- Upsell Detection -> Vendas (SDR)
- Support Report -> Produto (recurring problems)
- Feedback from experience -> Produto (Feedback Loop)

---

#### Story 5.1: Create CS Squad Config and AI Head

As the Chief Orchestrator,
I want the Customer Success squad to have a config.yaml and AI Head,
so that client lifecycle management can be orchestrated.

**Acceptance Criteria:**

1. `squads/customer-success/config.yaml` with agent registry, tiers, handoff matrix, cross-squad flows
2. `squads/customer-success/agents/cs-head.md`: defines CS strategy, monitors base health, tracks churn, removes blockers, demands NPS and satisfaction
3. Does NOT: handle tickets, do onboarding, create processes (asks OPS)
4. Tools: CRM, ClickUp, Slack, Intercom/Zendesk
5. Config documents inbound flow from Vendas (Close Deal -> Welcome Client) and outbound flows to Vendas (upsell) and Produto (problems)

---

#### Story 5.2: Create Onboarding Specialist Agent and Tasks

As the CS Head,
I want an Onboarding Specialist with Welcome, Setup, First Value, and Handoff tasks,
so that new clients are activated and transitioned smoothly to ongoing CS.

**Acceptance Criteria:**

1. `squads/customer-success/agents/onboarding-specialist.md` defines the agent, tools (Email, WhatsApp, Zoom, Loom, Notion, CRM, Intercom, ClickUp)
2. 4 task files: Welcome Client (sends welcome, presents next steps, aligns expectations), Setup Account (guides configuration, first steps, sends support materials), First Value (ensures first win, validates usage, collects initial feedback), Handoff (passes to CS, documents context, introduces CS responsible)
3. Handoff task completes the transition -- Onboarding Specialist does NOT continue accompanying after handoff

---

#### Story 5.3: Create Suporte Agent and Tasks

As the CS Head,
I want a Suporte agent with Ticket Triage, Resolve, Escalate, and Report tasks,
so that client issues are classified, resolved, or escalated systematically.

**Acceptance Criteria:**

1. `squads/customer-success/agents/suporte.md` defines the agent, tools (Intercom, Zendesk, Freshdesk, Notion KB, ClickUp, Slack, Sheets)
2. 4 task files: Ticket Triage (classifies N1/N2/N3, prioritizes by urgency, routes to responsible), Resolve (resolves N1 FAQ tickets using knowledge base, documents solution), Escalate (escalates N2/N3 to specialist, documents context, tracks until resolved), Report (weekly metrics -- tickets, SLA, satisfaction -- identifies recurring problems for Produto)
3. Suporte does NOT: invent solutions, promise without certainty, resolve what it does not know

---

#### Story 5.4: Create CS/Retencao Agent and Tasks

As the CS Head,
I want a CS/Retencao agent focused on client health with Health Check, Engagement, Upsell Detection, and Churn Prevention tasks,
so that client base health is monitored and revenue is protected.

**Acceptance Criteria:**

1. `squads/customer-success/agents/cs-retencao.md` defines the agent SCOPED TO CLIENT RETENTION (distinct from Produto squad's product quality focus)
2. 4 task files: Health Check (monitors account health, identifies risk signals, engagement scoring), Engagement (proactive contact, shares news, invites to events), Upsell Detection (identifies expansion opportunities, maps additional needs, passes hot leads to SDR), Churn Prevention (identifies cancellation risk, recovery contact, retention offer with Head approval, documents reasons if churned)
3. CS/Retencao does NOT: resolve tickets, sell directly, give discounts without approval

---

### Epic 6: Marketing Squad -- Growth Engine

**Prerequisite:** The `squads/research-intelligence/` squad (Tessa/Cyrus/Maya agents) must be committed to the repository before Story 6.6 (Research Analyst) can be implemented. The research-intelligence squad files already exist locally (created in BSS sessions) but have not been committed yet. @devops must commit them first.

**Goal:** Build the full marketing squad covering 5 functional areas: Social Media Manager, Trafego Pago (Media Buyer), Email Strategist, Content Manager (SEO), and Research Analyst. The Research Analyst delegates to the research-intelligence squad (Tessa/Cyrus/Maya) for deep research. This is a large squad with 16 tasks.

**Directory:** `squads/marketing/`

**Agents (6):**
- AI Head (marketing-head)
- Social Media Manager (social-media-manager)
- Trafego Pago / Media Buyer (media-buyer)
- Email Strategist (email-strategist)
- Content Manager (content-manager)
- Research Analyst (research-analyst) -- delegates to research-intelligence squad

**Files to create (24):**
- `squads/marketing/config.yaml`
- `squads/marketing/agents/marketing-head.md`
- `squads/marketing/agents/social-media-manager.md`
- `squads/marketing/agents/media-buyer.md`
- `squads/marketing/agents/email-strategist.md`
- `squads/marketing/agents/content-manager.md`
- `squads/marketing/agents/research-analyst.md`
- `squads/marketing/tasks/create-social-content.md`
- `squads/marketing/tasks/schedule-posts.md`
- `squads/marketing/tasks/engage-community.md`
- `squads/marketing/tasks/create-campaign.md`
- `squads/marketing/tasks/optimize-ads.md`
- `squads/marketing/tasks/scale-winners.md`
- `squads/marketing/tasks/write-email.md`
- `squads/marketing/tasks/build-sequence.md`
- `squads/marketing/tasks/analyze-email-metrics.md`
- `squads/marketing/tasks/seo-research.md`
- `squads/marketing/tasks/content-planning.md`
- `squads/marketing/tasks/publish-content.md`
- `squads/marketing/tasks/content-report.md`
- `squads/marketing/tasks/competitor-analysis.md`
- `squads/marketing/tasks/trend-hunting.md`
- `squads/marketing/tasks/swipe-file.md`
- (Note: Task 16 from the original spec -- Swipe File -- is the last Research Analyst task. The original squad spec lists 16 numbered tasks for Marketing but the user prompt says 17. Counting carefully: Social Media 3 + Media Buyer 3 + Email 3 + Content Manager 4 + Research Analyst 3 = 16 tasks. The task file count reflects this accurate count of 16.)

**Dependencies:** OPS (process creation), Produto (launch coordination)

**Cross-Squad Flows:**
- Leads generated -> Vendas (SDR)
- Receives cold leads from Vendas for nurture
- Launch coordination from Produto
- Research Analyst feeds COPY + Media Buyer
- All process requests -> OPS

---

#### Story 6.1: Create Marketing Squad Config and AI Head

As the Chief Orchestrator,
I want the Marketing squad to have a config.yaml and AI Head,
so that marketing strategy and execution can be orchestrated.

**Acceptance Criteria:**

1. `squads/marketing/config.yaml` with 3-tier architecture: Tier 0 (marketing-head), Tier 1 (social-media-manager, media-buyer, email-strategist), Tier 2 (content-manager, research-analyst)
2. `squads/marketing/agents/marketing-head.md`: defines strategy, approves calendar, distributes budget, aligns goals, demands metrics
3. Does NOT: create content, run campaigns, create processes (asks OPS)
4. Tools: ClickUp, Notion, Slack, Sheets
5. Config documents delegation: research-analyst -> research-intelligence squad
6. Config documents cross-squad flows to/from Vendas, Produto

---

#### Story 6.2: Create Social Media Manager Agent and Tasks

As the Marketing Head,
I want a Social Media Manager with Create Content, Schedule Posts, and Engage Community tasks,
so that social media presence is consistent and community engagement drives leads.

**Acceptance Criteria:**

1. `squads/marketing/agents/social-media-manager.md` defines the agent, tools (Notion, ClickUp, mLabs, Meta Business, Later, Instagram, WhatsApp)
2. 3 task files: Create Content (defines weekly calendar, chooses formats -- does NOT write copy or create art, requests from COPY), Schedule Posts (schedules and publishes at correct times), Engage Community (responds to comments, engages third-party posts, sends opportunities to SDR)

---

#### Story 6.3: Create Media Buyer Agent and Tasks

As the Marketing Head,
I want a Media Buyer agent with Create Campaign, Optimize Ads, and Scale Winners tasks,
so that paid traffic is systematically managed and scaled.

**Acceptance Criteria:**

1. `squads/marketing/agents/media-buyer.md` defines the agent, tools (Meta Ads, Google Ads, TikTok Ads, Ads Manager, Sheets)
2. 3 task files: Create Campaign (campaign structure, pixel/conversion setup, budget/dates -- does NOT create art or copy), Optimize Ads (daily metrics analysis, adjustments, pauses underperformers, tests variations), Scale Winners (increases budget on winners, scales creatives, replicates winning structures -- does NOT increase budget alone, asks Head)

---

#### Story 6.4: Create Email Strategist Agent and Tasks

As the Marketing Head,
I want an Email Strategist with Write Email, Build Sequence, and Analyze Metrics tasks,
so that email marketing is segmented, automated, and optimized.

**Acceptance Criteria:**

1. `squads/marketing/agents/email-strategist.md` defines the agent, tools (ActiveCampaign, Sheets)
2. 3 task files: Write Email (segments list by behavior, defines tags/scores, removes inactive -- does NOT send, requests COPY), Build Sequence (defines dispatch calendar, segments audience, builds sequence, schedules -- does NOT create external automations, asks OPS), Analyze Metrics (weekly metrics: open rate, CTR, conversion, comparative models)

---

#### Story 6.5: Create Content Manager Agent and Tasks

As the Marketing Head,
I want a Content Manager agent with SEO Research, Content Planning, Publish, and Report tasks,
so that organic content drives long-term traffic growth.

**Acceptance Criteria:**

1. `squads/marketing/agents/content-manager.md` defines the agent, tools (Ahrefs, Semrush, Notion, WordPress, YouTube Studio, Sheets)
2. 4 task files: SEO Research (keyword research, competitor analysis, identifies opportunities), Content Planning (defines monthly editorial calendar, prioritizes by SEO potential, aligns with general calendar), Publish (publishes articles, optimizes SEO -- title, meta, headers), Report (monthly metrics: rankings, traffic, organic performance, ROI analysis)
3. Content Manager does NOT: write articles (asks COPY), edit text (asks COPY)

---

#### Story 6.6: Create Research Analyst Agent and Tasks

As the Marketing Head,
I want a Research Analyst agent with Competitor Analysis, Trend Hunting, and Swipe File tasks,
so that competitive intelligence and trend data feeds the entire marketing squad.

**Acceptance Criteria:**

1. `squads/marketing/agents/research-analyst.md` explicitly states delegation to research-intelligence squad (Tessa/Cyrus/Maya) for deep research
2. 3 task files: Competitor Analysis (monitors competitors, identifies trends, maps formats by platform, alerts timing opportunities -- Input: sector briefing, Output: ready content briefs), Trend Hunting (identifies trends, models platform formats, alerts timing, feeds COPY + Media Buyer), Swipe File (saves winning creatives, organizes by category, feeds COPY + Media Buyer -- does NOT copy directly)
3. Tools: TikTok, Twitter, SimilarWeb, Notion

---

### Epic 7: Auditoria Squad -- Structural Auditing

**Goal:** Create the independent auditing squad that validates the structural completeness, coverage, delegation correctness, cross-squad overlap, and quality gate compliance of all other squads. This squad was NOT in the original Figma board -- it was decided as a separate concern from OPS. OPS audits processes (how work flows), Auditoria audits structure (who does the work and if it is complete).

**Directory:** `squads/auditoria/`

**Agents (4):**
- AI Head (auditoria-head)
- Squad Auditor (squad-auditor)
- Coverage Analyst (coverage-analyst)
- Alignment Checker (alignment-checker)

**Files to create (11):**
- `squads/auditoria/config.yaml`
- `squads/auditoria/agents/auditoria-head.md`
- `squads/auditoria/agents/squad-auditor.md`
- `squads/auditoria/agents/coverage-analyst.md`
- `squads/auditoria/agents/alignment-checker.md`
- `squads/auditoria/tasks/squad-completeness-audit.md`
- `squads/auditoria/tasks/task-coverage-analysis.md`
- `squads/auditoria/tasks/agent-delegation-validation.md`
- `squads/auditoria/tasks/cross-squad-overlap-detection.md`
- `squads/auditoria/tasks/quality-gate-compliance-check.md`
- `squads/auditoria/tasks/audit-report.md`

**Dependencies:** All 6 operational squads must exist (read access to audit)

---

#### Story 7.1: Create Auditoria Squad Config and AI Head

As the Chief Orchestrator,
I want the Auditoria squad to have a config.yaml and AI Head,
so that structural auditing can be triggered independently of all other squads.

**Acceptance Criteria:**

1. `squads/auditoria/config.yaml` with squad metadata, agent registry, tier architecture
2. `squads/auditoria/agents/auditoria-head.md` defines the AI Head: commissions audits, reviews audit reports, escalates findings, tracks remediation
3. Config.yaml explicitly documents independence: Auditoria does NOT report to any other squad, has read access to all squad definitions
4. Clear scope: audits STRUCTURE (agents, tasks, coverage, completeness), NOT processes (that is OPS)

---

#### Story 7.2: Create Squad Auditor Agent and Tasks

As the Auditoria Head,
I want a Squad Auditor agent with Squad Completeness Audit and Quality Gate Compliance Check tasks,
so that every squad has all required agents and tasks, and quality gates are properly configured.

**Acceptance Criteria:**

1. `squads/auditoria/agents/squad-auditor.md` defines the agent: reads squad config.yaml and agent/task files, validates against required structure
2. `squads/auditoria/tasks/squad-completeness-audit.md`: Input (squad directory path), Output (completeness report -- missing agents, missing tasks, malformed definitions), checks config.yaml has all agents registered, all agent files exist, all task files exist, all required sections present in each file
3. `squads/auditoria/tasks/quality-gate-compliance-check.md`: Input (squad directory path), Output (quality gate compliance report), verifies quality gates are defined in tasks, thresholds are set, gate flow is sequential, no gaps in the chain

---

#### Story 7.3: Create Coverage Analyst Agent and Tasks

As the Auditoria Head,
I want a Coverage Analyst with Task Coverage Analysis and Cross-Squad Overlap Detection tasks,
so that gaps and redundancies between squads are identified.

**Acceptance Criteria:**

1. `squads/auditoria/agents/coverage-analyst.md` defines the agent: maps business needs to squad capabilities, identifies what is covered and what is missing
2. `squads/auditoria/tasks/task-coverage-analysis.md`: Input (all squad definitions), Output (coverage matrix -- business functions vs squad tasks), maps gaps between what projects need and what squads offer
3. `squads/auditoria/tasks/cross-squad-overlap-detection.md`: Input (all squad definitions), Output (overlap report), identifies where multiple squads cover the same function (intentional like CS/Retencao in Produto + CS) vs unintentional duplication, flags with recommendation (keep both, merge, or eliminate)

---

#### Story 7.4: Create Alignment Checker Agent and Tasks

As the Auditoria Head,
I want an Alignment Checker with Agent Delegation Validation and Audit Report tasks,
so that delegation chains between squads and AIOX core agents are correct, and findings are consolidated.

**Acceptance Criteria:**

1. `squads/auditoria/agents/alignment-checker.md` defines the agent: validates that delegation references are correct and bidirectional
2. `squads/auditoria/tasks/agent-delegation-validation.md`: Input (all squad definitions), Output (delegation validation report), verifies product-manager -> @pm delegation is correctly configured, research-analyst -> research-intelligence delegation is correct, no squad agent duplicates a core agent's capability without explicit delegation
3. `squads/auditoria/tasks/audit-report.md`: Input (all audit outputs), Output (consolidated audit report), combines completeness, coverage, overlap, delegation, and quality gate findings into a single executive report with severity classification and recommended actions

---

## 7. Cross-Squad Flow Summary

| Flow | From | To | Trigger |
|------|------|-----|---------|
| New client handoff | Vendas (Close Deal) | CS (Welcome Client) | Contract signed |
| Cold lead nurture | Vendas (Close Deal - lost) | Marketing (nurture flow) | Lead rejected/lost |
| Marketing-generated leads | Marketing (campaigns) | Vendas (SDR - Lead Scoring) | New lead captured |
| Upsell opportunity | CS (Upsell Detection) | Vendas (SDR) | Satisfied client with expansion need |
| Recurring problems | CS (Support Report) | Produto (Feedback Loop) | Pattern of repeated issues |
| Launch coordination | Produto (Launch Coordination) | Marketing + Vendas | Product ready for launch |
| Process mapping request | Any Squad | OPS (AI Head) | Need for process mapping/architecture |
| Structure audit | Auditoria | All Squads | Periodic or on-demand audit |

---

## 8. Size Estimates

| Squad | Agents | Tasks | Files (config + agents + tasks) |
|-------|--------|-------|------|
| OPS | 5 (1 Head + 4) | 8 | 14 |
| Vendas | 4 (1 Head + 3) | 10 | 15 |
| Administracao | 6 (1 Head + 5) | 17 | 24 |
| Produto | 4 (1 Head + 3) | 12 | 17 |
| Customer Success | 4 (1 Head + 3) | 12 | 17 |
| Marketing | 6 (1 Head + 5) | 16 | 23 |
| Auditoria | 4 (1 Head + 3) | 6 | 11 |
| **TOTAL** | **33** | **81** | **121** |

Note: The original estimate mentioned ~83 tasks. The accurate count after detailed enumeration is 81 tasks (Marketing has 16 tasks, not 17 as initially estimated -- the Social Media Manager has 3, Media Buyer has 3, Email Strategist has 3, Content Manager has 4, and Research Analyst has 3 = 16). Total files including config.yaml per squad = 121 files (within the NFR-2 target of <150).

Additionally, the Chief Orchestrator agent should be defined separately (not part of any squad), adding 1 more agent definition file.

---

## 9. Implementation Order

| Priority | Epic | Rationale |
|----------|------|-----------|
| 1 | Epic 1: OPS | Foundational -- all squads depend on OPS for process mapping |
| 2 | Epic 2: Vendas | Revenue-critical -- sales pipeline must be operational |
| 3 | Epic 3: Administracao | Operational backbone -- financial, HR, legal support |
| 4 | Epic 4: Produto | Product lifecycle depends on having sales and admin infrastructure |
| 5 | Epic 5: Customer Success | Depends on Vendas (client handoff) and Produto (feedback loop) |
| 6 | Epic 6: Marketing | Growth engine that feeds Vendas and is fed by Produto launches |
| 7 | Epic 7: Auditoria | Needs all other squads to exist before auditing |

---

## 10. Key Decisions Already Made

| Decision | Rationale | Impact |
|----------|-----------|--------|
| Do NOT clone AIOX core agents | Create specialized agents that delegate to core when needed | Avoids capability duplication, maintains single source of truth |
| Product Manager (Produto) delegates to @pm Morgan | Formal PRD/spec work belongs to core @pm | product-manager.md explicitly references delegation |
| Research Analyst (Marketing) delegates to research-intelligence squad | Deep research capabilities exist in Tessa/Cyrus/Maya | research-analyst.md consumes outputs, does not duplicate |
| Rename OPS "QA" to "Process Validator" | Avoids confusion with AIOX @qa Quinn | Clear scope: process quality vs code quality |
| Rename OPS "Architect" to "Process Architect" | Avoids confusion with AIOX @architect Aria | Clear scope: ClickUp architecture vs system architecture |
| Auditoria as separate squad (not part of OPS) | OPS audits processes, Auditoria audits structure | Independent oversight, no conflict of interest |
| CS/Retencao in both Produto and CS | Different scopes: product quality vs client retention | Distinct task lists in each squad, same agent archetype |

---

## 11. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Agent definition files become too long and unfocused | Medium | Medium | Enforce NFR-3 (<200 lines per agent), review via Auditoria squad |
| Cross-squad handoff definitions become stale | High | Medium | Auditoria squad's cross-squad overlap detection task validates periodically |
| Delegation to core agents (@pm, research-intelligence) creates confusion | Medium | High | Explicit delegation section in agent definitions with clear "I do / I delegate" boundaries |
| 121 files create maintenance burden | Medium | Medium | Auditoria squad's completeness audit catches drift; file generation can be partially automated |
| OPS becomes a bottleneck (all squads depend on it) | Medium | High | OPS Head prioritizes by business impact; escalation path to Builders/CEO |
| Quality gate >70% threshold is too low/high | Low | Medium | Configurable per squad via config.yaml; adjust based on operational experience |

---

## 12. Checklist Results Report

### PM Checklist Validation

| Category | Status | Critical Issues |
|----------|--------|-----------------|
| 1. Problem Definition & Context | PASS | Clear articulation of business squad needs, who benefits, and why |
| 2. MVP Scope Definition | PASS | 7 squads with well-defined boundaries; nothing extra invented |
| 3. User Experience Requirements | N/A | No UI -- markdown-based agent definitions |
| 4. Functional Requirements | PASS | 16 FRs covering all structural and behavioral requirements |
| 5. Non-Functional Requirements | PASS | 7 NFRs covering file size, count, language, configurability |
| 6. Epic & Story Structure | PASS | 7 epics, 23 stories, logically sequenced with dependencies |
| 7. Technical Guidance | PASS | Uses existing AIOX squad architecture pattern, no new tech |
| 8. Cross-Functional Requirements | PASS | Cross-squad flows documented, delegation chains explicit |
| 9. Clarity & Communication | PASS | Consistent terminology, decision log, risk assessment |

**Overall: PASS (100%)** -- PRD is READY FOR IMPLEMENTATION.

### Critical Deficiencies

None identified. All requirements trace directly to the user's Figma board and session decisions (Constitution Article IV - No Invention).

### Recommendations

1. Start with Epic 1 (OPS) as a pilot to validate the agent/task definition pattern before scaling to all 7 squads
2. After Epic 1, consider implementing a lightweight `*validate-squad` command in the Auditoria squad early to validate subsequent squad implementations
3. The Chief Orchestrator agent should be defined as a separate file (not in any squad directory) -- suggest `squads/chief-orchestrator.md` or a dedicated `squads/orchestration/` directory

---

## 13. Next Steps

### Architect Prompt

> @architect -- Review `docs/prd-business-squads.md` and validate the directory structure, file naming conventions, and config.yaml pattern against the existing `squads/claude-code-mastery/` and `squads/branding/` implementations. Confirm that the proposed 121-file structure follows AIOX conventions and identify any structural concerns before implementation begins.

### Implementation Prompt

> @pm *create-epic -- Begin Epic 1 (OPS Squad) implementation. Use this PRD as the source of truth. Create the 14 files for the OPS squad following the agent/task patterns established in the PRD. Start with Story 1.1 (config.yaml + ops-head.md).

---

*-- Morgan, planejando o futuro*
