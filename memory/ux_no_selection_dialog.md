---
name: No-selection action guard
description: When user clicks any action button without selecting a row, show a labos-dialog type="warning" — never a toast or alert
type: feedback
---

When a user clicks an action button (Edit, Delete, Assign, etc.) without first selecting a row from the grid or list, show a modal dialog instead of a toast or banner alert.

**Rule:** replace all `labos-alert id="alert-no-selection"` and `LabosToast.show(..., 'warning')` selection guards with:

```html
<labos-dialog id="dialog-no-selection" type="warning" title="Selection required">
  <p style="font-size:14px;color:#333">Please select at least one item</p>
  <labos-button slot="footer" variant="default" icon="check" onclick="closeDialog('dialog-no-selection')">OK</labos-button>
</labos-dialog>
```

Guard function pattern:
```js
function requireSelection(dialogId) {
  if (selection.length === 0) { openDialog('dialog-no-selection'); return; }
  openDialog(dialogId);
}
```

**Why:** Dialogs are more visible and block interaction until acknowledged — toasts and alerts can be missed.

**How to apply:** Every screen that has action buttons on a grid/list must include the `dialog-no-selection` element and use it in all selection-guard checks.
