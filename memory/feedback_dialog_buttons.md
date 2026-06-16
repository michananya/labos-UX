---
name: Dialog button conventions
description: Dialog action button is always variant="accent" on the right; Cancel always has icon="close"
metadata:
  type: feedback
---

In every dialog footer:

1. **Action button** (Save, OK, Confirm, Apply, etc.) — `variant="accent"`, placed **last** in the footer slot (renders on the right).
2. **Cancel button** — always includes `icon="close"`.
3. **Delete button text** — must be "Delete [entity name]" (e.g. "Delete group", "Delete workbench"), never just "Delete". Uses `variant="warn"`, placed **last** (right). Cancel goes first (left).

```html
<!-- Standard dialog -->
<labos-button slot="footer" variant="default" cancel icon="close" onclick="...">Cancel</labos-button>
<labos-button slot="footer" variant="accent"  icon="done" id="btn-save">Save</labos-button>

<!-- Destructive confirm dialog -->
<labos-button slot="footer" variant="default" cancel icon="close" onclick="...">Cancel</labos-button>
<labos-button slot="footer" variant="warn"    icon="delete" id="btn-delete-confirm">Delete group</labos-button>
```

**Why:** Consistent dialog UX — accent/warn colour signals the primary action, right-side placement matches standard modal conventions, the X icon on Cancel makes dismiss immediately recognisable, and the entity name on the Delete button makes the destructive action explicit.

**How to apply:** Every dialog with Cancel + action must follow this order. For destructive confirms, use `variant="warn"` and label the button "Delete [entity name]".
