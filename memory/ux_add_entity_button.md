---
name: Add entity button standard
description: Two distinct rules for the add button — depends on whether the screen is an entity-management screen or a setup/configuration screen
type: feedback
---

The add button placement and style differ by screen type.

---

### Entity-management screens (doctors, users, lab-equipment, …)

The add button sits **immediately to the right of the search field**, inside `.search-zone`.

- Position: after `<labos-rounded-search>`, gap provided by `.search-zone { gap: 10px }`
- Style: `<labos-button shape="rounded" icon="add">` — Default variant (white bg, primary-20 border, primary icon), **icon only, no text**
- No custom CSS needed

```html
<labos-button shape="rounded" icon="add" title="Add [Entity]" onclick="openDialog('dialog-add')"></labos-button>
```

There is **no** separate Add button in the action-bar for these screens.

---

### Setup / configuration screens (genetics-status-approval, …)

These screens have a filter zone instead of a search field. The add button is the **first button in the `.action-bar`** and is a **regular button with icon + text**.

- Position: first item in `.action-bar`
- Style: `<labos-button variant="default" icon="add">Add [Entity]</labos-button>` — icon + label

```html
<div class="action-bar">
  <labos-button variant="default" icon="add" onclick="openDialog('dialog-add')">Add [Entity]</labos-button>
  <labos-button variant="default" icon="delete" onclick="requireSelection('dialog-delete')">Delete</labos-button>
</div>
```

The filter zone itself contains **no** add button.

---

**Why:** Entity screens have a persistent search bar — the icon-only button is a natural companion. Setup screens have a filter zone with no fixed anchor, so the action-bar is the right home for primary actions.

**How to apply:** Identify the screen type first. Entity screen → icon-only rounded button next to search. Setup screen → icon+text button as first item in action-bar.
