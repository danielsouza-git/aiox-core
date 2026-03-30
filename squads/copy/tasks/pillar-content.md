# pillar-content

```yaml
task:
  id: pillar-content
  name: Create Pillar Content
  agent: seo-writer
  squad: copy
  type: creation
  elicit: true

inputs:
  required:
    - pillar_topic: "Broad topic to own"
    - cluster_topics: "Related subtopics to link"
    - target_keyword: "Primary keyword for pillar"
  optional:
    - competitor_pillars: "Competing pillar pages"
    - existing_content: "Content to link from pillar"
    - brand_voice: "Voice guide"

outputs:
  - pillar_page.md: "Complete pillar content"
  - cluster_map.md: "Topic cluster linking strategy"
  - content_calendar.md: "Supporting content plan"
  - internal_links.md: "Bidirectional linking plan"

pre_conditions:
  - "Pillar topic defined"
  - "Cluster topics identified"
  - "Keyword research complete"

post_conditions:
  - "Comprehensive coverage (3000-5000 words)"
  - "Links to all cluster content"
  - "Table of contents navigable"
  - "Chapter structure clear"
```

## Workflow

### Phase 1: Topic Cluster Mapping (15 min)
1. Define pillar topic (broad)
2. Identify 8-15 cluster topics (specific)
3. Map keyword relationships
4. Identify existing content to link

### Phase 2: Content Architecture (15 min)
1. Create comprehensive outline
2. Ensure all cluster topics represented
3. Plan internal linking structure
4. Identify content gaps

### Phase 3: Writing (120 min)

## Pillar Content Template

```markdown
# [Pillar Topic]: The Complete Guide to [Outcome]

**Meta Title (50-60 chars):**
[Pillar Topic]: Complete Guide [Year] | [Brand]

**Meta Description (150-160 chars):**
Everything you need to know about [pillar topic]. [X] chapters covering [key aspects]. Updated for [year].

**URL Slug:**
/[pillar-topic]

---

## Quick Navigation

| Chapter | Topic | Jump |
|---------|-------|------|
| 1 | [Topic] | [Link](#chapter-1) |
| 2 | [Topic] | [Link](#chapter-2) |
| 3 | [Topic] | [Link](#chapter-3) |
| ... | ... | ... |

---

## Introduction

[Hook — why this topic matters now]

[Scope — what this guide covers]

[Authority — why trust this guide]

**What You'll Learn:**
- Chapter 1: [Topic] — [What they'll learn]
- Chapter 2: [Topic] — [What they'll learn]
- Chapter 3: [Topic] — [What they'll learn]
- [Continue...]

**Who This Is For:**
- [Audience 1]
- [Audience 2]
- [Audience 3]

**Time to Read:** [X] minutes

---

# Chapter 1: [First Major Topic] {#chapter-1}

## Overview

[Introduction to this chapter's topic]

[Why it's important]

## [Section 1.1]

[Detailed content]

[Link to cluster article: For more on [specific aspect], see our [article title](cluster-link)]

## [Section 1.2]

[Detailed content with examples]

## [Section 1.3]

[Detailed content]

### Key Takeaways from Chapter 1
- [Takeaway 1]
- [Takeaway 2]
- [Takeaway 3]

---

# Chapter 2: [Second Major Topic] {#chapter-2}

## Overview

[Introduction to chapter 2]

## [Section 2.1]

[Content]

## [Section 2.2]

[Content with data/research]

| Factor | Impact | Recommendation |
|--------|--------|----------------|
| [A] | [X%] | [Do this] |
| [B] | [X%] | [Do this] |

## [Section 2.3]

[Content]

[Link to cluster article: Learn more in our guide to [topic](cluster-link)]

### Key Takeaways from Chapter 2
- [Takeaway 1]
- [Takeaway 2]

---

# Chapter 3: [Third Major Topic] {#chapter-3}

[Continue same structure...]

---

# Chapter 4: [Fourth Major Topic] {#chapter-4}

[Continue same structure...]

---

# Chapter 5: [Fifth Major Topic] {#chapter-5}

[Continue same structure...]

---

# Chapter 6: [Sixth Major Topic] {#chapter-6}

[Continue same structure...]

---

# Chapter 7: Tools and Resources {#chapter-7}

## Recommended Tools

| Tool | Purpose | Price | Link |
|------|---------|-------|------|
| [Tool 1] | [What it does] | [Cost] | [Link] |
| [Tool 2] | [What it does] | [Cost] | [Link] |

## Free Resources

- [Resource 1] — [Description]
- [Resource 2] — [Description]

## Further Reading

- [Book/Resource 1]
- [Book/Resource 2]

---

# Chapter 8: FAQ {#chapter-8}

## Frequently Asked Questions

### [Question 1]?
[Comprehensive answer]

### [Question 2]?
[Comprehensive answer]

### [Question 3]?
[Comprehensive answer]

### [Question 4]?
[Comprehensive answer]

### [Question 5]?
[Comprehensive answer]

---

# Conclusion {#conclusion}

## Summary

[Recap of key points from each chapter]

## What to Do Next

1. **Start with:** [First action]
2. **Then:** [Second action]
3. **Finally:** [Third action]

## Keep Learning

**Related Guides:**
- [Related Pillar 1](link)
- [Related Pillar 2](link)

**Cluster Content:**
- [Cluster Article 1](link)
- [Cluster Article 2](link)
- [Cluster Article 3](link)

---

## About This Guide

**Last Updated:** [Date]
**Author:** [Author with credentials]
**Reviewed By:** [Reviewer if applicable]

---

## Get Updates

[CTA for newsletter or updates when content changes]
```

## Topic Cluster Map

```markdown
# Topic Cluster: [Pillar Topic]

## Hub (Pillar Page)
**URL:** /[pillar-topic]
**Target Keyword:** [primary keyword]
**Word Count:** 4000-5000

## Spokes (Cluster Content)

### Cluster 1: [Subtopic]
- **URL:** /[pillar-topic]/[subtopic-1]
- **Target Keyword:** [keyword]
- **Word Count:** 1500-2000
- **Link From Pillar:** Chapter [X], Section [Y]
- **Status:** [Exists / To Create]

### Cluster 2: [Subtopic]
- **URL:** /[pillar-topic]/[subtopic-2]
- **Target Keyword:** [keyword]
- **Word Count:** 1500-2000
- **Link From Pillar:** Chapter [X], Section [Y]
- **Status:** [Exists / To Create]

[Continue for 8-15 cluster topics...]

## Linking Strategy

### From Pillar to Clusters:
- Chapter 1 → [Cluster A], [Cluster B]
- Chapter 2 → [Cluster C], [Cluster D]
- Chapter 3 → [Cluster E]
[Continue...]

### From Clusters to Pillar:
Every cluster article links back to pillar in:
- Introduction ("For the complete guide, see [Pillar]")
- Conclusion ("Learn more in our [Pillar]")

### Cross-Cluster Links:
- [Cluster A] ↔ [Cluster B] (related)
- [Cluster C] ↔ [Cluster E] (related)
```

## Pillar Content Checklist

```markdown
## Comprehensiveness
- [ ] All cluster topics covered
- [ ] Answers all common questions
- [ ] More thorough than competitors
- [ ] Original insights/data included
- [ ] 3000-5000 word count

## Structure
- [ ] Clear chapter organization
- [ ] Table of contents with jump links
- [ ] Chapter summaries/takeaways
- [ ] Logical flow between sections

## SEO
- [ ] Primary keyword optimized
- [ ] Secondary keywords in chapters
- [ ] Meta tags optimized
- [ ] URL structure clean
- [ ] Schema markup (FAQ, How-to, Article)

## Linking
- [ ] Links to all cluster content
- [ ] All clusters link back to pillar
- [ ] External authority links
- [ ] Cross-cluster links where relevant

## User Experience
- [ ] Scannable (headers, bullets, tables)
- [ ] Mobile-friendly
- [ ] Fast loading (images optimized)
- [ ] Easy navigation
```

## Acceptance Criteria

- [ ] 3000-5000 words comprehensive content
- [ ] All cluster topics represented
- [ ] Clear chapter/section structure
- [ ] Internal linking complete
- [ ] Topic cluster map created
- [ ] Content calendar for missing clusters
- [ ] Meta tags optimized
- [ ] FAQ section included
- [ ] E-E-A-T signals present
- [ ] Update strategy noted

## Quality Gate
- Threshold: >70%
- Content length between 3000-5000 words with comprehensive topic coverage
- All cluster topics linked bidirectionally (pillar to cluster and cluster back to pillar)
- Table of contents with working jump links and clear chapter structure

---
*Copy Squad Task*
