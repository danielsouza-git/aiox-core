# email-newsletter

```yaml
task:
  id: email-newsletter
  name: Write Newsletter Email
  agent: email-specialist
  squad: copy
  type: creation
  elicit: true

inputs:
  required:
    - topic: "Main topic or theme"
    - audience: "Newsletter segment"
    - format: "Story, listicle, curated, hybrid"
  optional:
    - brand_voice: "Voice guide"
    - recent_content: "Blog posts, videos to promote"
    - newsletter_template: "Existing template"

outputs:
  - newsletter_email.md: "Complete newsletter copy"
  - subject_variants.md: "5 subject line options"
  - preview_text.md: "Preview text options"

pre_conditions:
  - "Topic selected"
  - "Content gathered (if curated)"

post_conditions:
  - "Newsletter complete and formatted"
  - "Subject lines A/B ready"
  - "Mobile-friendly formatting"
```

## Workflow

### Phase 1: Format Selection (5 min)

**Newsletter Formats:**

| Format | Structure | Best For |
|--------|-----------|----------|
| **Story** | Personal narrative + lesson | Personal brands |
| **Listicle** | X tips/ideas/tools | Value-focused |
| **Curated** | Best of week/month | Thought leadership |
| **Hybrid** | Story + curated links | Engaged audiences |
| **Announcement** | News + context | Product updates |

### Phase 2: Structure Planning (5 min)

**Newsletter Formula:**
1. Hook (first line)
2. Setup (context)
3. Main content
4. Takeaway
5. CTA
6. P.S. (optional secondary CTA)

### Phase 3: Newsletter Writing (20 min)

## Newsletter Templates

### Template 1: Story Newsletter

```markdown
# Subject Line Options:
1. "[Unexpected thing] happened to me this week"
2. "The [topic] lesson I learned the hard way"
3. "I made a mistake with [topic]"
4. "[First Name], I have a confession"
5. "This changed how I think about [topic]"

# Preview Text:
"[Continuation of subject that creates curiosity]"

---

Hey [First Name],

[Hook — first line that stops the scroll]

[2-3 paragraphs telling the story]

Here's what I learned:

**[Key takeaway in bold]**

[1-2 paragraphs expanding on the lesson]

[Application — how they can use this]

[CTA if relevant]

[Signature]

P.S. [Secondary CTA or curiosity hook]
```

### Template 2: Listicle Newsletter

```markdown
# Subject Line Options:
1. "[X] ways to [achieve outcome] this week"
2. "The [X] [things] I can't live without"
3. "[X] [topic] lessons from [source]"
4. "Your [X]-step guide to [outcome]"
5. "[X] things I wish I knew about [topic]"

# Preview Text:
"#1 is something most people overlook..."

---

Hey [First Name],

[Brief intro — why this matters]

Here are [X] [things] that [benefit]:

**1. [Point]**
[2-3 sentence explanation]

**2. [Point]**
[2-3 sentence explanation]

**3. [Point]**
[2-3 sentence explanation]

[Continue as needed...]

**Quick takeaway:** [Summary]

[CTA]

[Signature]

P.S. [Bonus tip or secondary CTA]
```

### Template 3: Curated Newsletter

```markdown
# Subject Line Options:
1. "This week's [X] best [things]"
2. "What I'm reading, watching, thinking"
3. "The [X] links that caught my attention"
4. "[Month] digest: the best of [topic]"
5. "Curated for you: [topic] edition"

# Preview Text:
"Plus, one thing that surprised me..."

---

Hey [First Name],

[Brief intro — theme of this edition]

---

## 📚 Read

**[Article Title]** — [Source]
[2-3 sentence summary + why it matters]
[Link]

---

## 🎥 Watch

**[Video Title]** — [Creator]
[2-3 sentence summary + key takeaway]
[Link]

---

## 🎧 Listen

**[Podcast/Episode]** — [Host]
[2-3 sentence summary + favorite quote]
[Link]

---

## 💡 Think About

[Personal reflection or question to ponder]

---

## 🔧 Tool of the Week

**[Tool Name]**
[What it does + why I recommend it]
[Link]

---

That's all for this week!

[Signature]

P.S. [CTA or question for engagement]
```

### Template 4: Hybrid Newsletter

```markdown
# Subject Line Options:
[Combine story and curated approaches]

---

Hey [First Name],

[Personal story or observation — 2-3 paragraphs]

**The lesson:** [Key takeaway]

---

## What I've been consuming:

📚 **[Article]** — [Quick take]
🎥 **[Video]** — [Quick take]
🔧 **[Tool]** — [Quick take]

---

[Closing thought]

[Signature]
```

## Subject Line Formulas

1. **Curiosity:** "The [adjective] truth about [topic]"
2. **Number:** "[X] ways to [outcome]"
3. **Question:** "Have you ever [relatable situation]?"
4. **Personal:** "I [did something] and here's what happened"
5. **Direct:** "[First Name], here's your [thing]"
6. **Contrast:** "Why [common belief] is wrong"
7. **How-to:** "How to [achieve outcome] without [obstacle]"

## Acceptance Criteria

- [ ] Newsletter follows chosen format
- [ ] Hook captures attention in first line
- [ ] Content delivers clear value
- [ ] 5 subject line variants provided
- [ ] Preview text complements subject
- [ ] Mobile-friendly formatting
- [ ] Clear CTA included
- [ ] P.S. used effectively (optional)
- [ ] Appropriate length (300-500 words)

## Quality Gate
- Threshold: >70%
- Subject line under 50 characters with at least 5 variants provided
- Newsletter body between 300-500 words with clear value delivery
- Preview text complements (does not repeat) the subject line

---
*Copy Squad Task*
