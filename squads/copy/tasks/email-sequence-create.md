# email-sequence-create

```yaml
task:
  id: email-sequence-create
  name: Create Email Sequence (Profile-Driven)
  agent: email-specialist
  squad: copy
  type: creation
  elicit: true

inputs:
  required:
    - brand_profile: "Brand profile YAML — .aiox/branding/{client}/brand-profile.yaml"
    - content_manifest: "Content manifest — .aiox/branding/{client}/content-manifest.md"
  optional:
    - sequence_type_override: "Override sequence type from manifest (welcome, nurture, launch, abandon, re-engage)"
    - audience_segment: "Who receives this sequence (default: from brand_profile.target_audience)"
    - goal: "Primary objective (default: derived from business model)"
    - voice_guide: "Voice guide — .aiox/branding/{client}/voice-guide.md"
    - existing_sequences: "Current automation map"
    - performance_data: "Historical email metrics"

outputs:
  - email_sequence/: "Folder with all email files"
  - sequence_map.md: "Visual sequence flow"
  - subject_line_variants.md: "A/B test subjects"
  - automation_logic.md: "Triggers and conditions"

pre_conditions:
  - "Brand profile exists with industry and archetype data"
  - "Content manifest exists with Email Strategy section"

post_conditions:
  - "Sequence types match manifest Email Strategy (not hardcoded)"
  - "Email count per sequence matches manifest quantities"
  - "Tone matches archetype + email tone modifiers from manifest"
  - "Subject lines use archetype-appropriate hooks"
  - "Automation logic documented"
  - "Timing specified"
```

## Profile-Driven Approach

**CRITICAL:** Read `content-manifest.md` -> Email Strategy section for sequence types, email counts,
timing, and frameworks. Read `brand-profile.yaml` for industry (which determines business model
and sequence selection). Do NOT hardcode sequence types or email counts.

### Step 0: Load Profile Context

1. Read `content-manifest.md` -> Email Strategy section:
   - Sequence types selected (based on business model from Content Selection Engine)
   - Email count per sequence
   - Timing per sequence
   - Framework per sequence
   - Email tone modifiers
2. Read `brand-profile.yaml`:
   - `client.industry` -> determines business model (e-commerce, SaaS, service, etc.)
   - `personality.archetypes` -> shapes email voice
   - `personality.tone_of_voice` -> base tone
   - `client.target_audience` -> audience segments
3. Determine sequence types: use `sequence_type_override` if provided, otherwise follow manifest plan
4. Derive `num_emails` from manifest quantities (not hardcoded defaults)

## Workflow

### Phase 1: Sequence Mapping (10 min)

**Sequence Types:**

| Type | Emails | Purpose | Timing |
|------|--------|---------|--------|
| **Welcome** | 5-7 | Onboard new subscribers | Days 0-14 |
| **Nurture** | 7-12 | Build relationship | Weekly |
| **Launch** | 5-8 | Product launch | Days 1-7 |
| **Abandon** | 3-5 | Cart/browse abandon | Hours 1-72 |
| **Re-engage** | 3-5 | Win back inactive | Days 1-10 |

### Phase 2: Email Framework Selection (5 min)

**Per Email Frameworks:**

| Framework | Structure | Best For |
|-----------|-----------|----------|
| **AIDA** | Attention → Interest → Desire → Action | Sales emails |
| **PAS** | Problem → Agitation → Solution | Problem-aware |
| **1-2-3** | 1 Idea, 2 Benefits, 3 Proof | Simple value |
| **Story** | Setup → Conflict → Resolution → CTA | Engagement |
| **Star-Chain-Hook** | Big idea → Logic chain → Call to action | Persuasion |

### Phase 3: Sequence Writing (60 min)

## Welcome Sequence Template

```markdown
# Welcome Sequence: [Segment Name]
**Trigger:** New subscriber signup
**Duration:** 14 days
**Emails:** 7

---

## Email 1: Welcome (Day 0, Immediate)

**Subject Line Options:**
1. "Welcome to [Brand] — here's your [lead magnet]"
2. "[First Name], you're in! Here's what happens next"
3. "Your [benefit] journey starts now"

**Preview Text:** [40-90 characters]

**Body:**

Hey [First Name],

Welcome to [Brand]! I'm thrilled you're here.

As promised, here's your [lead magnet]:
[BUTTON: Download Now]

Over the next few days, I'll send you:
- [Valuable thing 1]
- [Valuable thing 2]
- [Valuable thing 3]

But first, I have a question for you...

[Engagement question to get reply]

Hit reply and let me know!

[Signature]

P.S. [Curiosity hook for next email]

---

## Email 2: Quick Win (Day 1)

**Subject Line Options:**
1. "The #1 mistake [audience] make with [topic]"
2. "[First Name], do this first (takes 5 min)"
3. "Start here for [quick result]"

**Body:**

Hey [First Name],

Yesterday I asked [question]. The responses were [interesting/surprising/etc.].

Today, I want to share [quick win — something they can implement immediately].

Here's how:

**Step 1:** [Action]
**Step 2:** [Action]
**Step 3:** [Action]

Try this today and reply with your results!

[Signature]

P.S. Tomorrow I'll show you [next email hook]

---

## Email 3: Story + Credibility (Day 3)

**Subject Line Options:**
1. "My [topic] disaster (and what I learned)"
2. "The turning point that changed everything"
3. "From [bad state] to [good state]: my story"

**Body:**

Hey [First Name],

[Story that establishes credibility and creates connection]

That experience taught me [lesson].

And it's why I'm so passionate about helping [audience] with [problem].

[Transition to what's coming next]

[Signature]

---

## Email 4: Value + Soft Pitch (Day 5)

**Subject Line Options:**
1. "The [framework/method] that changed [result]"
2. "[First Name], here's my [secret/system/method]"
3. "How to [desired outcome] in [timeframe]"

**Body:**

Hey [First Name],

[Valuable teaching content]

If you want to go deeper on this, I have something that might help...

[Soft mention of product/service — not a hard sell]

[Signature]

---

## Email 5: Case Study (Day 7)

[Case study email with specific results]

---

## Email 6: FAQ/Objections (Day 10)

[Address common questions and objections]

---

## Email 7: Invitation (Day 14)

[Clear invitation to next step/offer]

---

## Automation Logic

**Triggers:**
- Start: New subscriber added to [segment]
- Exit: Unsubscribe OR purchase [product]

**Conditions:**
- If opens Email 3 → Tag as "engaged"
- If clicks Email 4 → Tag as "interested"
- If no opens by Email 5 → Branch to re-engagement

**Timing:**
- Email 1: Immediate
- Email 2: Day 1, 10:00 AM
- Email 3: Day 3, 10:00 AM
- [etc.]
```

## Acceptance Criteria

- [ ] Brand profile and content manifest loaded before writing
- [ ] Sequence type matches manifest Email Strategy (not arbitrary choice)
- [ ] Email count matches manifest quantities for this sequence type
- [ ] Tone matches archetype base + email tone modifiers from manifest
- [ ] Subject lines use archetype-appropriate hooks and language
- [ ] Framework matches manifest assignment for this sequence type
- [ ] All emails in sequence written
- [ ] Subject line variants for A/B testing
- [ ] Preview text for each email
- [ ] Clear CTAs using brand tone profile language
- [ ] Story arc across sequence aligned to content pillars
- [ ] Value-to-pitch ratio appropriate for business model
- [ ] Automation logic documented
- [ ] Timing specified per manifest
- [ ] Exit conditions defined

## Quality Gate
- Threshold: >70%
- Sequence type and email count match content manifest Email Strategy
- Subject line variants provided for each email with A/B test pairing
- Automation logic documented with triggers, conditions, and timing per email

---
*Copy Squad Task*
