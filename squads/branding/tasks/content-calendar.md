# content-calendar

```yaml
task: contentCalendar()
agent: creative-producer
squad: branding
prd_refs: [FR-2.6]

inputs:
  - name: brand_profile
    type: BrandProfile
    required: true
  - name: calendar_config
    type: CalendarConfig
    required: true

outputs:
  - name: content_calendar
    type: ContentCalendar
    destination: .aiox/branding/{client}/planning/content-calendar.yaml
  - name: calendar_export
    type: spreadsheet
    destination: .aiox/branding/{client}/planning/content-calendar.xlsx

tools:
  - ai-orchestrator
  - spreadsheet-generator
```

## Purpose

Generate content calendar with 4-week rotation and content pillars mapped per industry.

## Calendar Structure

```yaml
rotation_framework:
  week_1:
    theme: Educational
    percentage: 40%
    goal: "Build authority, provide value"
    content_types:
      - how_to_posts
      - tips_and_tricks
      - tutorials
      - explainers

  week_2:
    theme: Authority
    percentage: 25%
    goal: "Establish expertise, build trust"
    content_types:
      - case_studies
      - results_showcase
      - behind_the_scenes
      - expert_insights

  week_3:
    theme: Engagement
    percentage: 15%
    goal: "Drive interaction, build community"
    content_types:
      - polls
      - questions
      - user_generated_content
      - challenges

  week_4:
    theme: Conversion
    percentage: 10%
    goal: "Drive action, generate leads"
    content_types:
      - promotions
      - ctas
      - offers
      - product_features

  ongoing:
    theme: Promotional
    percentage: 10%
    goal: "Brand awareness, announcements"
    content_types:
      - company_news
      - events
      - partnerships
```

## Content Pillars by Industry

```yaml
industry_pillars:
  tech_saas:
    - product_education
    - industry_trends
    - customer_success
    - team_culture
    - thought_leadership

  ecommerce:
    - product_showcase
    - lifestyle_content
    - customer_stories
    - promotions
    - behind_brand

  professional_services:
    - expertise_demonstration
    - case_studies
    - industry_insights
    - team_spotlight
    - client_testimonials

  health_wellness:
    - educational_content
    - motivation_inspiration
    - success_stories
    - tips_advice
    - community

  creative_agency:
    - portfolio_showcase
    - process_insights
    - industry_trends
    - team_culture
    - client_work
```

## Calendar Output Format

```yaml
calendar_entry:
  date: date
  day_of_week: string
  week_number: 1-4
  theme: string
  pillar: string
  platform: string[]
  content_type: string
  topic_idea: string
  copy_brief: string
  visual_direction: string
  hashtags: string[]
  status: planned | drafted | approved | published
  assigned_to: string
  notes: string
```

## Generation Process

```yaml
steps:
  - step: analyze_brand
    extract:
      - industry
      - target_audience
      - brand_voice
      - key_topics

  - step: define_pillars
    count: 4-5
    based_on: industry + brand_goals

  - step: generate_calendar
    duration: 4 weeks (28 days)
    posts_per_day: configurable (1-3)
    apply: rotation_framework

  - step: generate_topic_ideas
    per_entry: topic + brief description
    ensure: variety within pillars

  - step: add_metadata
    per_entry:
      - platform_recommendations
      - hashtag_suggestions
      - best_posting_time

  - step: export
    formats:
      - yaml (for automation)
      - xlsx (for manual planning)
      - csv (for import to tools)
```

## Posting Schedule Recommendations

```yaml
posting_schedule:
  instagram:
    optimal_times: [9am, 12pm, 5pm]
    days: daily or 5x/week
    stories: 3-7 per day

  linkedin:
    optimal_times: [7am, 12pm, 5pm]
    days: weekdays
    frequency: 3-5x/week

  twitter_x:
    optimal_times: [9am, 12pm, 3pm, 6pm]
    days: daily
    frequency: 3-5x/day

  tiktok:
    optimal_times: [7am, 12pm, 3pm]
    days: daily
    frequency: 1-3x/day

  youtube:
    optimal_times: [2pm, 4pm]
    days: consistent day of week
    frequency: 1-2x/week
```

## Pre-Conditions

- [ ] Brand profile with industry
- [ ] Platform selection
- [ ] Calendar duration specified

## Post-Conditions

- [ ] 4-week calendar generated
- [ ] All themes covered
- [ ] Export files created

## Acceptance Criteria

- [ ] Rotation framework applied
- [ ] Pillars industry-appropriate
- [ ] Topic ideas actionable
- [ ] Ready for content creation

## Quality Gate

- Threshold: >70%
- Calendar covers 4 weeks with daily content slots
- Content mix follows distribution (40% educational, 25% authority, etc.)
- Topic ideas actionable with clear briefs for production

---
*Branding Squad Task - creative-producer*
