# email-transactional

```yaml
task:
  id: email-transactional
  name: Write Transactional Email
  agent: email-specialist
  squad: copy
  type: creation
  elicit: true

inputs:
  required:
    - email_type: "confirmation, receipt, shipping, password, welcome"
    - trigger_event: "What action triggers this email"
    - required_info: "What info must be included"
  optional:
    - brand_voice: "Voice guide"
    - upsell_opportunity: "Secondary conversion goal"

outputs:
  - transactional_email.md: "Complete email copy"
  - variable_map.md: "Dynamic content placeholders"
  - fallback_copy.md: "Fallback if variables fail"

pre_conditions:
  - "Email type defined"
  - "Required information documented"
  - "Trigger event confirmed"

post_conditions:
  - "All required info included"
  - "Variables clearly marked"
  - "On-brand but functional"
  - "Fallbacks provided"
```

## Workflow

### Phase 1: Email Type Analysis (5 min)

**Transactional Email Types:**

| Type | Trigger | Priority Info |
|------|---------|---------------|
| **Order Confirmation** | Purchase complete | Order details, total |
| **Receipt** | Payment processed | Line items, amount |
| **Shipping** | Order shipped | Tracking, ETA |
| **Delivery** | Order delivered | Confirm receipt |
| **Password Reset** | Reset requested | Reset link, expiry |
| **Account Welcome** | Account created | Login details, next steps |
| **Renewal Reminder** | Before expiry | Renewal date, price |
| **Cancellation** | Subscription cancelled | End date, reactivate |

### Phase 2: Legal/Compliance Check (5 min)

**Required Elements:**
- Clear subject identifying purpose
- Sender identification
- Unsubscribe link (if applicable)
- Contact information
- No misleading content

### Phase 3: Email Writing (15 min)

## Transactional Email Templates

### Template 1: Order Confirmation

```markdown
# Subject Line:
"Order confirmed! Your [Product/Order #{{order_number}}] is on its way"

# Preview Text:
"Thanks for your order — here's what happens next"

---

## Order Confirmed ✓

Hey {{first_name}},

Thanks for your order! We're on it.

---

**Order #{{order_number}}**
**Date:** {{order_date}}

---

### Items Ordered:

| Item | Qty | Price |
|------|-----|-------|
| {{item_name}} | {{qty}} | {{price}} |
| {{item_name}} | {{qty}} | {{price}} |

---

**Subtotal:** {{subtotal}}
**Shipping:** {{shipping}}
**Tax:** {{tax}}
**Total:** {{total}}

---

### Shipping To:
{{shipping_name}}
{{shipping_address_1}}
{{shipping_address_2}}
{{shipping_city}}, {{shipping_state}} {{shipping_zip}}

---

### What's Next?

1. We're preparing your order
2. You'll get a shipping email with tracking
3. Estimated delivery: {{estimated_delivery}}

---

Questions? [Contact Support]({{support_link}})

Thanks again!
[Brand Name]

---

[OPTIONAL UPSELL SECTION]
**While you wait...**
Check out [related product] — other customers love it:
[BUTTON: See More →]
```

### Template 2: Shipping Notification

```markdown
# Subject Line:
"Your order is on its way! 📦"

# Preview Text:
"Track your package: {{tracking_number}}"

---

## Your Order Has Shipped! 🚚

Hey {{first_name}},

Great news — your order is on its way!

---

**Tracking Number:** {{tracking_number}}
**Carrier:** {{carrier}}
**Estimated Delivery:** {{delivery_date}}

[BUTTON: Track Package →]({{tracking_link}})

---

### What's in the box:

{{#each items}}
- {{item_name}} x{{qty}}
{{/each}}

---

### Shipping To:
{{shipping_address}}

---

### Delivery Tips:
- Someone may need to sign
- Can't be home? [Reschedule delivery]({{reschedule_link}})
- Questions? [Contact us]({{support_link}})

See you soon!
[Brand Name]
```

### Template 3: Password Reset

```markdown
# Subject Line:
"Reset your password"

# Preview Text:
"We received a request to reset your password"

---

## Reset Your Password

Hey {{first_name}},

We received a request to reset your password for your [Brand] account.

[BUTTON: Reset Password]({{reset_link}})

This link expires in {{expiry_time}} hours.

---

**Didn't request this?**

If you didn't request a password reset, you can ignore this email. Your password won't be changed.

For security, we recommend:
- Using a unique password
- Enabling two-factor authentication
- Never sharing your password

---

Questions? [Contact Support]({{support_link}})

[Brand Name]

---

**Security Notice:**
We'll never ask for your password via email.
```

### Template 4: Account Welcome

```markdown
# Subject Line:
"Welcome to [Brand]! Here's how to get started"

# Preview Text:
"Your account is ready — let's get you set up"

---

## Welcome to [Brand]! 🎉

Hey {{first_name}},

Your account is all set up. Here's everything you need to get started.

---

### Your Account Details:

**Email:** {{email}}
**Username:** {{username}}
**Account Type:** {{plan_name}}

[BUTTON: Log In Now]({{login_link}})

---

### Quick Start Guide:

**Step 1:** Complete your profile
→ [Add profile info]({{profile_link}})

**Step 2:** [Key action #1]
→ [Do this]({{action_link}})

**Step 3:** [Key action #2]
→ [Do this]({{action_link}})

---

### Need Help?

- 📚 [Help Center]({{help_link}})
- 💬 [Contact Support]({{support_link}})
- 🎥 [Video Tutorials]({{tutorials_link}})

---

We're excited to have you!

[Brand Name]

P.S. Reply to this email if you have any questions — we read everything.
```

### Template 5: Subscription Renewal Reminder

```markdown
# Subject Line:
"Your subscription renews in {{days_until}} days"

# Preview Text:
"Just a heads up about your upcoming renewal"

---

## Subscription Renewal Reminder

Hey {{first_name}},

Your [Plan Name] subscription renews on **{{renewal_date}}**.

---

### Renewal Details:

**Plan:** {{plan_name}}
**Price:** {{renewal_price}}/{{billing_cycle}}
**Payment Method:** {{payment_method_last4}}
**Renewal Date:** {{renewal_date}}

---

### No action needed

If you want to continue, you don't need to do anything. We'll charge your card on file automatically.

---

### Need to make changes?

- [Update payment method]({{payment_link}})
- [Change plan]({{plan_link}})
- [Cancel subscription]({{cancel_link}})

---

Questions? [Contact us]({{support_link}})

Thanks for being a customer!
[Brand Name]
```

## Variable Mapping

```yaml
# Common variables across all emails:
common:
  - "{{first_name}}" → User's first name
  - "{{email}}" → User's email
  - "{{support_link}}" → Support page URL
  - "{{brand_name}}" → Company name

# Order emails:
order:
  - "{{order_number}}" → Order ID
  - "{{order_date}}" → Date of order
  - "{{items}}" → Array of line items
  - "{{total}}" → Order total
  - "{{shipping_address}}" → Formatted address

# Shipping emails:
shipping:
  - "{{tracking_number}}" → Carrier tracking #
  - "{{tracking_link}}" → Tracking URL
  - "{{carrier}}" → Shipping carrier name
  - "{{delivery_date}}" → ETA

# Account emails:
account:
  - "{{username}}" → Account username
  - "{{plan_name}}" → Subscription plan
  - "{{reset_link}}" → Password reset URL
  - "{{expiry_time}}" → Link expiration
```

## Acceptance Criteria

- [ ] Email type correctly identified
- [ ] All required information included
- [ ] Variables clearly mapped with {{syntax}}
- [ ] Fallback content for failed variables
- [ ] Clear subject line (not promotional)
- [ ] On-brand but functional tone
- [ ] Mobile-friendly formatting
- [ ] Legal/compliance elements included
- [ ] Support/contact info provided

## Quality Gate
- Threshold: >70%
- All dynamic variables mapped with {{syntax}} and fallback values provided
- Subject line clearly identifies the email purpose (non-promotional)
- Legal/compliance elements present (sender ID, contact info, unsubscribe if applicable)

---
*Copy Squad Task*
