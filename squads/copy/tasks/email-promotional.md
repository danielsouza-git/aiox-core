# email-promotional

```yaml
task:
  id: email-promotional
  name: Write Promotional Email
  agent: email-specialist
  squad: copy
  type: creation
  elicit: true

inputs:
  required:
    - offer: "Product/service/discount being promoted"
    - deadline: "Offer expiration date/time"
    - audience: "Email segment"
  optional:
    - promo_type: "Flash sale, launch, holiday, clearance"
    - discount_amount: "Percentage or dollar amount"
    - urgency_type: "Time-limited, quantity-limited, exclusive"

outputs:
  - promo_email.md: "Complete promotional email"
  - subject_variants.md: "5 subject line options"
  - urgency_elements.md: "Scarcity copy elements"

pre_conditions:
  - "Offer details finalized"
  - "Deadline confirmed"
  - "Audience segmented"

post_conditions:
  - "Promo email complete"
  - "Urgency clear and real"
  - "CTA prominent"
  - "Subject lines A/B ready"
```

## Workflow

### Phase 1: Promo Type Analysis (5 min)

**Promo Email Types:**

| Type | Angle | Urgency |
|------|-------|---------|
| **Flash Sale** | Limited time | Hours/minutes |
| **Launch** | New product | Early bird pricing |
| **Holiday** | Seasonal | Holiday deadline |
| **Clearance** | Last chance | Stock running out |
| **Exclusive** | VIP access | Members only |
| **Bundle** | Added value | Limited availability |

### Phase 2: Framework Selection (5 min)

**Promo Frameworks:**

| Framework | Use When |
|-----------|----------|
| **PAS** | Audience problem-aware |
| **AIDA** | New product introduction |
| **Before-After-Bridge** | Transformation focus |
| **Direct Response** | List already warm |

### Phase 3: Email Writing (20 min)

## Promotional Email Templates

### Template 1: Flash Sale

```markdown
# Subject Line Options:
1. "⚡ [X]% off — [X] hours only"
2. "[First Name], this disappears at midnight"
3. "FLASH SALE: [Offer] (ends [time])"
4. "I almost didn't send this... [X]% off"
5. "🚨 [X] hours left: [offer]"

# Preview Text:
"Don't miss this — [additional urgency]"

---

Hey [First Name],

**[X]% OFF everything — [X] hours only**

No build-up. No long story. Just:

→ **[Offer details]**
→ **Ends [specific time + timezone]**
→ **No exceptions**

[BUTTON: Shop Now →]

Here's what's included:

✓ [Product/benefit 1]
✓ [Product/benefit 2]
✓ [Product/benefit 3]

**Why now?**
[Brief reason for the sale — keep it real]

[BUTTON: Get [X]% Off Now]

[Signature]

P.S. Seriously, [time] left. After that, full price returns.
```

### Template 2: Product Launch

```markdown
# Subject Line Options:
1. "Introducing [Product Name] — finally here"
2. "[First Name], it's live 🎉"
3. "The wait is over: [Product]"
4. "You asked, we built it: [Product]"
5. "NEW: [Product] + early bird pricing"

# Preview Text:
"Plus, save [X]% if you act in the next [time]"

---

Hey [First Name],

**It's finally here.**

After [time/effort], I'm thrilled to introduce:

## [Product Name]

[2-3 sentences describing what it is and transformation it provides]

**What you get:**

✓ [Feature → Benefit]
✓ [Feature → Benefit]
✓ [Feature → Benefit]
✓ [Feature → Benefit]

**Early Bird Pricing (limited time):**

~~$[Original Price]~~ → **$[Sale Price]**

[BUTTON: Get [Product] Now →]

**Why early bird?**

The first [X] people get [bonus/discount].

After that, the price goes to $[regular price].

[Testimonial or social proof if available]

[BUTTON: Claim Your Spot]

[Signature]

P.S. Early bird ends [specific date/time]. Don't wait!
```

### Template 3: Last Chance

```markdown
# Subject Line Options:
1. "FINAL HOURS: [offer] ends tonight"
2. "[First Name], last chance — literally"
3. "⏰ Closing in [X] hours"
4. "Your cart is about to expire"
5. "Did you forget? [Offer] closes at midnight"

# Preview Text:
"This is your last reminder before the price goes up"

---

Hey [First Name],

I'll keep this short:

**[Offer] ends in [X] hours.**

After [deadline], it's gone. Here's what you'll miss:

→ [Benefit 1]
→ [Benefit 2]
→ [Benefit 3]

Current price: **$[Price]**
Price after deadline: **$[Higher Price]**

[BUTTON: Get It Before Midnight →]

This is your last reminder.

If you've been thinking about it, now's the time.

If it's not for you, no worries — I'll stop emailing about this after today.

But if you DO want [transformation], this is it.

[BUTTON: Yes, I'm In →]

[Signature]

P.S. [Final urgency statement]
```

### Template 4: Exclusive/VIP

```markdown
# Subject Line Options:
1. "[First Name], you're on the VIP list"
2. "Private sale — not for everyone"
3. "Exclusive access (don't share this)"
4. "This email is only going to [X] people"
5. "You're invited (members only)"

# Preview Text:
"Only [X] spots available — you're first in line"

---

Hey [First Name],

You're getting this email because [reason you're on this list].

And because of that, I want to give you first access to:

**[Exclusive Offer]**

This is NOT on our website.
This is NOT available to everyone.
This is ONLY for people like you who [qualifier].

**Here's what you get:**

✓ [Benefit 1]
✓ [Benefit 2]
✓ [Benefit 3]

**Your exclusive price:** $[Price]
(Regular price is $[Higher])

[BUTTON: Access My VIP Deal →]

**Only [X] available.**

Once they're gone, this email becomes useless.

Don't share this link.

[Signature]

P.S. This expires [time/date] OR when [X] spots fill up — whichever comes first.
```

## Urgency Elements Bank

**Time-Based:**
- "Ends at midnight [timezone]"
- "Only [X] hours left"
- "Sale ends [specific date/time]"
- "Price increases in [countdown]"

**Quantity-Based:**
- "Only [X] left in stock"
- "Limited to [X] customers"
- "[X] spots remaining"
- "Once they're gone, they're gone"

**Exclusivity:**
- "VIP members only"
- "Early access for subscribers"
- "Not available to the public"
- "First [X] buyers only"

## Acceptance Criteria

- [ ] Promo type clearly identified
- [ ] Offer presented clearly
- [ ] Urgency real and specific
- [ ] Benefits highlighted (not just features)
- [ ] CTA prominent and repeated
- [ ] Subject lines create urgency
- [ ] Mobile-friendly formatting
- [ ] Deadline stated clearly
- [ ] P.S. reinforces urgency

## Quality Gate
- Threshold: >70%
- Subject line under 50 characters with urgency element present
- Deadline/expiration stated explicitly with timezone
- CTA button text is action-oriented and appears at least twice in the email

---
*Copy Squad Task*
