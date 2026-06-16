---
name: single-item-screen-layout
description: Layout rules for Single Item screens (order details, patient details, device details, etc.)
metadata:
  type: project
---

## Single Item Screen — layout structure

**Reference implementation:** `Design-System-Screens/order-details.html`

### HTML skeleton

```html
<labos-navbar breadcrumbs='[{"label":"List screen","href":"..."},{"label":"Entity name"}]'></labos-navbar>

<div class="item-screen">

  <div class="item-header">

    <!-- Row 1: search + rounded add button -->
    <div class="screen-top">
      <div class="search-zone">
        <labos-rounded-search placeholder="…"></labos-rounded-search>
        <labos-button shape="rounded" icon="add" title="New …"></labos-button>
      </div>
    </div>

    <!-- Row 2: entity title + status badge -->
    <div class="item-identity">
      <span class="item-title">Entity name / ID</span>
      <labos-badge variant="…">Status</labos-badge>
    </div>

    <!-- Row 3: action buttons -->
    <div class="item-actions">
      <labos-button variant="default" icon="edit">Edit</labos-button>
      <!-- … -->
    </div>

  </div>

  <!-- Dynamic content — varies per screen type -->
  <div class="item-body">
    <!-- per-screen content here -->
  </div>

</div>
```

### CSS rules

| Selector | Key properties |
|---|---|
| `.item-screen` | `flex:1; overflow-y:auto; display:flex; flex-direction:column` |
| `.item-header` | `flex-shrink:0; background:#fff; position:sticky; top:0; z-index:10` — no border |
| `.screen-top` | `padding:16px; border-bottom:1px solid #E4E4E4` — border separates search from identity |
| `.search-zone` | `display:flex; align-items:center; gap:10px` |
| `.search-zone labos-rounded-search` | `width:300px; flex-shrink:0` — always 300px |
| `.item-identity` | `display:flex; align-items:center; gap:10px; padding:12px 16px 0` |
| `.item-title` | `font-size:20px; font-weight:600; color:#333` |
| `.item-actions` | `display:flex; align-items:center; gap:10px; padding:10px 16px 16px` — 16px bottom gap, no border |
| `.item-body` | `flex:1; padding:0 16px 24px` — no top padding, content varies per screen |

### Breadcrumbs

Two levels: list screen first (with href) → entity name last (no href).

```json
[{"label":"Orders list","href":"orders-list.html"},{"label":"Order #2024-001"}]
```

### Split view (תצוגה משולבת)

When a Single Item screen includes a split view (master list + detail panel), the layout splits as follows:

- **`.screen-top` (search + add button)** — stays outside the detail panel, spans the full width above the split area
- **`.item-identity`, `.item-actions`, and all content** — live inside `.detail-panel` (right side)

```
.item-header
  .screen-top        ← full width, above the split

[split area]
  labos-master-list  ← left
  .detail-panel      ← right
    .item-identity
    .item-actions
    [content]
```

### Navigation into the screen

Entry point: clicking the entity name / row in the list screen's grid.

### Content area (.item-body)

Content is **dynamic per screen type** — not standardized at the layout level.

**Why:** Defined as the universal layout standard for all Single Item screens across LabOS.

**How to apply:** Any time a screen shows details of a single entity, use this exact structure. `.item-body` content is defined per screen.
