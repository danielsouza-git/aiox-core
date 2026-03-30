# thread-create

```yaml
task:
  id: thread-create
  name: Create Twitter/X Thread
  agent: social-writer
  squad: copy
  type: creation
  elicit: true

inputs:
  required:
    - topic: "Thread topic"
    - thread_type: "How-to, story, listicle, breakdown, analysis"
    - num_tweets: "Number of tweets (5-20)"
  optional:
    - brand_voice: "Voice guide"
    - supporting_data: "Stats, examples, visuals"
    - existing_threads: "Past threads for reference"

outputs:
  - thread.md: "Complete thread copy"
  - visual_assets.md: "Image/screenshot notes"
  - engagement_prompts.md: "RT, reply, follow CTAs"

pre_conditions:
  - "Topic defined"
  - "Thread type selected"
  - "Length determined"

post_conditions:
  - "All tweets under 280 chars"
  - "Hook tweet compelling"
  - "CTA tweet clear"
  - "Numbered for clarity"
```

## Workflow

### Phase 1: Thread Structure (5 min)

**Thread Anatomy:**

| Tweet | Purpose | Content |
|-------|---------|---------|
| 1 | Hook | Pattern interrupt, big promise |
| 2 | Context | Why this matters, credibility |
| 3-N | Value | Main content, one point per tweet |
| N-1 | Summary | Key takeaways |
| N | CTA | Follow, RT, reply, link |

**Optimal Length:** 7-15 tweets

### Phase 2: Framework Selection (5 min)

**Thread Types:**

| Type | Structure | Best For |
|------|-----------|----------|
| **How-To** | Steps | Tutorials |
| **Story** | Narrative arc | Personal brand |
| **Listicle** | Numbered points | Quick value |
| **Breakdown** | Analysis | Expertise |
| **Comparison** | A vs B | Decision help |
| **Framework** | Model/system | Thought leadership |

### Phase 3: Thread Writing (25 min)

## Thread Templates

### Template 1: How-To Thread

```markdown
# Thread: How to [Achieve Outcome]
**Type:** How-To
**Tweets:** 10

---

## TWEET 1 (Hook):
"How to [achieve outcome] in [X] steps:

(Even if [objection])

🧵👇"

---

## TWEET 2 (Context):
"First, why this matters:

[Problem statement]

[Consequence of not solving it]

Here's the fix:"

---

## TWEET 3 (Step 1):
"Step 1: [Action]

[What to do]
[Why it matters]
[Quick tip]"

---

## TWEET 4 (Step 2):
"Step 2: [Action]

[What to do]
[Why it matters]
[Quick tip]"

---

## TWEET 5 (Step 3):
"Step 3: [Action]

[What to do]
[Why it matters]
[Quick tip]"

---

## TWEET 6 (Step 4):
"Step 4: [Action]

[What to do]
[Why it matters]
[Quick tip]"

---

## TWEET 7 (Step 5):
"Step 5: [Action]

[What to do]
[Why it matters]
[Quick tip]"

---

## TWEET 8 (Common Mistakes):
"Common mistakes to avoid:

❌ [Mistake 1]
❌ [Mistake 2]
❌ [Mistake 3]"

---

## TWEET 9 (Summary):
"TL;DR:

1. [Step 1]
2. [Step 2]
3. [Step 3]
4. [Step 4]
5. [Step 5]

That's it. Simple but powerful."

---

## TWEET 10 (CTA):
"If you found this helpful:

1. RT the first tweet to help others
2. Follow @[handle] for more [topic]

DM me '[keyword]' for a free [resource]"
```

### Template 2: Story Thread

```markdown
# Thread: [Story Title]
**Type:** Story
**Tweets:** 12

---

## TWEET 1 (Hook):
"[Year], I [situation].

[Time] later, [outcome].

Here's what happened:

🧵"

---

## TWEET 2 (Setup):
"Back then, I was [situation].

[What I was doing]
[How I felt]
[What I believed]"

---

## TWEET 3 (Problem):
"The problem?

[What wasn't working]

I tried:
- [Solution A] ❌
- [Solution B] ❌
- [Solution C] ❌

Nothing worked."

---

## TWEET 4 (Low Point):
"I hit rock bottom.

[Lowest moment]

[How it felt]

Then everything changed."

---

## TWEET 5 (Turning Point):
"One day, [turning point event].

[What I discovered]

[Lightbulb moment]"

---

## TWEET 6 (Action):
"So I did something different.

[What I changed]

[Specific actions]"

---

## TWEET 7 (Progress):
"At first, [early results].

[What happened]

[Signs of progress]"

---

## TWEET 8 (Results):
"[Time] later:

[Result 1]
[Result 2]
[Result 3]

[Proof or metrics]"

---

## TWEET 9 (Lesson 1):
"Biggest lesson #1:

[Lesson]

[Why it matters]"

---

## TWEET 10 (Lesson 2):
"Biggest lesson #2:

[Lesson]

[How to apply it]"

---

## TWEET 11 (Lesson 3):
"Biggest lesson #3:

[Lesson]

[What I'd do differently]"

---

## TWEET 12 (CTA):
"[Short summary of transformation]

If this resonated:
• RT tweet 1
• Follow @[handle]
• Reply with your story 👇"
```

### Template 3: Listicle Thread

```markdown
# Thread: [X] [Things] Every [Audience] Should Know
**Type:** Listicle
**Tweets:** 12

---

## TWEET 1 (Hook):
"[X] [things] every [audience] should know:

(But most never will)

🧵"

---

## TWEET 2:
"1. [Point]

[2-3 sentence explanation]

[Why it matters]"

---

## TWEET 3:
"2. [Point]

[2-3 sentence explanation]

[Application or example]"

---

## TWEET 4:
"3. [Point]

[2-3 sentence explanation]

[Pro tip]"

---

## TWEET 5:
"4. [Point]

[2-3 sentence explanation]

[Quote or stat]"

---

## TWEET 6:
"5. [Point]

[2-3 sentence explanation]

[Story or example]"

---

[Continue pattern for remaining points...]

---

## TWEET 11 (Summary):
"Summary:

1. [Point 1]
2. [Point 2]
3. [Point 3]
4. [Point 4]
5. [Point 5]
...

Bookmark this thread."

---

## TWEET 12 (CTA):
"Which one was most valuable?

Reply with the number 👇

(And RT tweet 1 to share with others)"
```

### Template 4: Breakdown Thread

```markdown
# Thread: Breaking Down [Topic/Concept]
**Type:** Breakdown/Analysis
**Tweets:** 10

---

## TWEET 1 (Hook):
"I spent [time] analyzing [topic].

Here's what I learned:

🧵"

---

## TWEET 2 (Overview):
"First, some context:

[What this is]
[Why it matters]
[What most people miss]"

---

## TWEET 3 (Component 1):
"Component 1: [Name]

[What it is]
[How it works]
[Why it's important]"

---

## TWEET 4 (Component 2):
"Component 2: [Name]

[What it is]
[How it works]
[Example]"

---

## TWEET 5 (Component 3):
"Component 3: [Name]

[What it is]
[How it works]
[Key insight]"

---

## TWEET 6 (How They Connect):
"How it all fits together:

[Diagram or explanation]

[The system/framework]"

---

## TWEET 7 (Application):
"How to apply this:

→ [Step 1]
→ [Step 2]
→ [Step 3]"

---

## TWEET 8 (Example):
"Real example:

[Case study or demonstration]

[Results]"

---

## TWEET 9 (Summary):
"Key takeaways:

1. [Takeaway 1]
2. [Takeaway 2]
3. [Takeaway 3]"

---

## TWEET 10 (CTA):
"Want more breakdowns like this?

Follow @[handle]

And RT tweet 1 to share this thread 🙏"
```

## Thread Writing Tips

**Hook Tweet:**
- Use numbers: "10 things..."
- Promise value: "Here's how..."
- Create curiosity: "Most people don't know..."
- State outcome: "[Outcome] in [Time]"

**Formatting:**
- One idea per tweet
- Use line breaks liberally
- Emojis for visual breaks (not excessive)
- Numbers or arrows for lists

**Engagement:**
- End with question
- Ask for RT/follow in final tweet
- Respond to early comments

## Acceptance Criteria

- [ ] All tweets under 280 characters
- [ ] Hook tweet creates curiosity
- [ ] Clear value throughout
- [ ] One idea per tweet
- [ ] Summary/TL;DR included
- [ ] CTA clear (RT, follow, reply)
- [ ] Numbered for navigation
- [ ] Visual assets noted if needed

## Quality Gate
- Threshold: >70%
- Every tweet is under 280 characters
- Hook tweet (tweet 1) creates curiosity with thread indicator
- Final tweet includes CTA (RT, follow, reply) with clear instruction

---
*Copy Squad Task*
