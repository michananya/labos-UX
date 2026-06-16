---
name: Screen layout order — search, actions, grid
description: When a screen has a rounded search, action buttons, and a grid, the fixed order is: rounded search first, action buttons second, grid last
metadata:
  type: feedback
---

When a screen contains all three of: a rounded search bar, action buttons, and a data grid — the layout order must always be:

1. **Rounded search** (first line, inside `.screen-top`)
2. **Action buttons** (second line, inside `.screen-top`, below the search)
3. **Grid** (after `.screen-top`)

```html
<div class="screen-top">
  <div class="search-zone">
    <labos-rounded-search ...></labos-rounded-search>
    <!-- add button and view toggle also go here -->
  </div>
  <div class="action-bar">
    <!-- Edit, Delete, and other action buttons -->
  </div>
</div>
<labos-grid ...></labos-grid>
```

**Why:** Defined by the user as a permanent layout standard. Search is the primary interaction — it belongs at the top. Action buttons operate on the selection below them.

**How to apply:** Any time a screen has both a rounded search and action buttons, always put the search zone first and the action bar second, regardless of screen type. This applies to new screens and edits to existing ones.