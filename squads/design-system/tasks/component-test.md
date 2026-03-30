# component-test

```yaml
task: componentTest()
agent: component-builder
squad: design-system

inputs:
  - name: component_name
    type: string
    required: true
  - name: component_files
    type: object
    required: true
    description: Component HTML/CSS/JS files to test
  - name: test_types
    type: array
    values: [visual, a11y, interaction, responsive]
    default: [visual, a11y, interaction]

outputs:
  - name: test_suite
    type: javascript
    destination: .aiox/design-system/{project}/tests/{name}.test.js
  - name: test_report
    type: markdown
    destination: .aiox/design-system/{project}/tests/{name}-report.md

tools:
  - testing-library
  - axe-core
```

## Purpose

Generate a comprehensive test suite for a design system component covering visual regression, accessibility compliance, keyboard interaction, and responsive behavior. Tests ensure components remain stable across updates.

## Workflow

### Phase 1: Test Planning
```yaml
steps:
  - inventory_variants: List all variant combinations to test
  - inventory_states: List all interactive states
  - inventory_a11y: List WCAG criteria applicable to this component
  - plan_test_cases: Generate test case list with expected outcomes
```

### Phase 2: Visual Tests
```yaml
steps:
  - test_default_render: Verify default render matches expected HTML/CSS
  - test_variant_renders: Verify each variant renders correctly
  - test_state_renders: Verify each state has distinct visual treatment
  - test_theme_renders: Verify component renders in each theme context
  - test_responsive: Verify component at breakpoints (320px, 768px, 1024px, 1440px)
```

### Phase 3: Accessibility Tests
```yaml
steps:
  - test_axe_core: Run axe-core on each variant, assert zero violations
  - test_color_contrast: Verify contrast ratios for all text/background pairs
  - test_aria_attributes: Verify required ARIA attributes are present and valid
  - test_role: Verify component has correct ARIA role
  - test_screen_reader: Verify accessible name and description
```

### Phase 4: Interaction Tests
```yaml
steps:
  - test_keyboard_enter: Verify Enter key activates the component
  - test_keyboard_space: Verify Space key activates (for buttons)
  - test_keyboard_escape: Verify Escape closes (for modals/dropdowns)
  - test_keyboard_tab: Verify Tab navigates focus correctly
  - test_focus_visible: Verify focus ring appears on keyboard navigation
  - test_disabled_state: Verify disabled prevents interaction
  - test_click: Verify click triggers expected behavior
```

### Phase 5: Report
```yaml
steps:
  - count_pass_fail: Tally results per category
  - identify_failures: Detail any failing tests with expected vs actual
  - generate_report: Produce markdown test report
```

## Test Template

```javascript
describe('{ComponentName}', () => {
  describe('Rendering', () => {
    it('renders default variant', () => { });
    it('renders all size variants', () => { });
    it('renders all color variants', () => { });
  });

  describe('Accessibility', () => {
    it('has no axe violations', async () => { });
    it('has correct ARIA role', () => { });
    it('has accessible name', () => { });
    it('meets contrast requirements', () => { });
  });

  describe('Keyboard Interaction', () => {
    it('activates on Enter', () => { });
    it('shows focus ring on Tab', () => { });
    it('prevents interaction when disabled', () => { });
  });
});
```

## Pre-Conditions

- [ ] Component built with all variants
- [ ] Testing Library available

## Post-Conditions

- [ ] Test suite file generated
- [ ] Test report documents pass/fail per category

## Acceptance Criteria

- [ ] All variants have at least one visual test
- [ ] axe-core audit passes for every variant
- [ ] Keyboard interaction tests cover Enter, Space, Tab, Escape
- [ ] Disabled state prevents all interaction
- [ ] Test report includes pass/fail counts per category

## Quality Gate
- Threshold: >70%
- axe-core accessibility audit passes for every variant with zero violations
- All variant combinations have at least one visual rendering test
- Keyboard interaction tests cover Enter, Space, Tab, and Escape key behaviors

---
*Design System Squad Task - component-builder*
