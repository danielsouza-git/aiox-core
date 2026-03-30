# Atomic Design Guide

A practical guide to applying Brad Frost's Atomic Design methodology within the Design System Squad.

## The Five Levels

### 1. Atoms

The smallest, indivisible UI elements. They cannot be broken down further without losing meaning.

| Atom | HTML Element | Tokens Used |
|------|-------------|-------------|
| Button | `<button>` | color, spacing, radius, font, shadow |
| Input | `<input>` | color, spacing, radius, font, border |
| Label | `<label>` | color, font |
| Icon | `<svg>` | color, size |
| Badge | `<span>` | color, spacing, radius, font |
| Tag | `<span>` | color, spacing, radius, font |
| Avatar | `<img>` / `<div>` | size, radius, color |
| Checkbox | `<input type="checkbox">` | color, size, radius |
| Radio | `<input type="radio">` | color, size |
| Toggle | `<button role="switch">` | color, size, radius |
| Divider | `<hr>` | color, spacing |
| Skeleton | `<div>` | color, radius, animation |

**Rule:** If it uses only design tokens and has no child components, it is an atom.

### 2. Molecules

Simple groups of atoms functioning together as a unit.

| Molecule | Composed Of | Purpose |
|----------|------------|---------|
| Form Field | Label + Input + Help Text | Single form input with context |
| Search Bar | Input + Button (Icon) | Search functionality |
| Card Header | Avatar + Text + Badge | Identify a card's subject |
| Nav Item | Icon + Label + Badge | Single navigation entry |
| Breadcrumb | Links + Dividers | Location indicator |
| Pagination | Buttons + Text | Page navigation |
| Tab | Button + Indicator | Tab selector |
| Tooltip | Text + Arrow | Contextual help |

**Rule:** A molecule combines 2-3 atoms into a single functional unit with a clear purpose.

### 3. Organisms

Complex UI sections composed of molecules and atoms.

| Organism | Composed Of | Purpose |
|----------|------------|---------|
| Navigation Bar | Nav Items + Logo + Search Bar | Primary site navigation |
| Hero Section | Heading + Text + Button + Image | Page introduction |
| Footer | Nav Items + Text + Social Icons | Site footer |
| Sidebar | Nav Items + Dividers + Heading | Side navigation |
| Card | Card Header + Body + Footer | Content container |
| Modal / Dialog | Heading + Body + Button Group | Overlay content |
| Toast | Icon + Text + Button | Notification |
| Data Table | Headers + Rows + Pagination | Tabular data |
| Form | Form Fields + Button Group | Data entry |

**Rule:** Organisms are self-contained sections that can be placed into templates.

### 4. Templates

Page-level layout structures that define where organisms are placed. Templates are content-agnostic -- they define the skeleton, not the data.

| Template | Organisms Used | Layout |
|----------|---------------|--------|
| Dashboard | Navigation + Sidebar + Cards + Table | Grid with sidebar |
| Article | Navigation + Hero + Content + Footer | Single column |
| Settings | Navigation + Sidebar + Form | Two-column |
| Auth | Card (centered) | Centered single card |
| Landing | Navigation + Hero + Features + CTA + Footer | Full-width sections |

**Rule:** Templates define content areas. They use CSS Grid/Flexbox to position organisms.

### 5. Pages

Specific instances of templates with real content. Pages are where real data meets the design system.

**Rule:** Pages are NOT part of the design system deliverable. They are built by consuming projects using templates.

---

## Decision Tree: Which Level?

```
Is it a single HTML element with no children?
  YES -> ATOM

Does it combine 2-3 atoms into one function?
  YES -> MOLECULE

Is it a self-contained section with multiple molecules?
  YES -> ORGANISM

Does it define page layout without specific content?
  YES -> TEMPLATE

Does it have real content/data?
  YES -> PAGE (not in design system)
```

## Naming Conventions

### File Names
```
atoms/button/button.{html,css,js}
molecules/form-field/form-field.{html,css,js}
organisms/navigation/navigation.{html,css,js}
templates/dashboard/dashboard.html
```

### CSS Class Names
```css
/* Atom */
.btn { }
.input { }
.badge { }

/* Molecule */
.form-field { }
.search-bar { }
.nav-item { }

/* Organism */
.navigation { }
.hero { }
.data-table { }

/* Template */
.layout-dashboard { }
.layout-article { }
```

## Composition Rules

1. **Atoms** depend only on tokens (CSS custom properties)
2. **Molecules** compose atoms via HTML structure, never by importing CSS
3. **Organisms** compose molecules and atoms, may add layout CSS
4. **Templates** compose organisms using CSS Grid/Flexbox
5. **No upward dependencies** -- an atom must never reference a molecule

## Token Flow

```
Design Tokens (W3C DTCG)
    |
    v
CSS Custom Properties (:root)
    |
    v
Atoms (consume tokens directly)
    |
    v
Molecules (inherit from atoms, may use layout tokens)
    |
    v
Organisms (inherit from molecules, add section-level tokens)
    |
    v
Templates (use grid/layout tokens only)
```

## When to Create vs Compose

| Scenario | Action |
|----------|--------|
| Need a button with icon | Compose: Icon atom + Button atom = Molecule |
| Need a unique loading animation | Create: New Skeleton atom |
| Need a card with header and actions | Compose: Card Header molecule + Button atoms = Card organism |
| Need a new page layout | Create: New Template using existing organisms |
| Need a button that looks like a link | Create: New Button variant, NOT a new atom |

## Anti-Patterns

### Do NOT
- Create a molecule that is really just a styled atom (Button with icon is still a Button variant)
- Create an organism for something used in only one place (that is a page-specific component)
- Skip levels (do not compose an organism directly from atoms, use molecules)
- Create atoms that are just CSS utility classes (atoms have HTML structure)

### Do
- Start with atoms and build up
- Reuse existing atoms in new molecules
- Keep organisms self-contained and testable
- Document composition patterns in usage examples

---

## Reference

- **Book:** Atomic Design by Brad Frost (https://atomicdesign.bradfrost.com)
- **W3C DTCG:** https://tr.designtokens.org/format/
- **Style Dictionary:** https://styledictionary.com

---

*Design System Squad - Atomic Design Guide v1.0*
