---
name: Mandatory field validation on submit
description: UX rule for form submit — all empty mandatory fields turn red and focus moves to first empty one
type: feedback
originSessionId: b246e389-4d4c-4d68-bf2d-541419ec968d
---
On any submit action (Save, Apply, Ok, or equivalent confirm button): validate all fields with `mandatory` attribute before proceeding. If any mandatory field is empty:
1. Set `invalid` attribute on every empty mandatory field → turns label and underline red.
2. Move focus to the first empty mandatory field.
3. Do NOT close the dialog or submit the form.

**Why:** Consistent validation UX across all screens — user gets clear visual feedback pinpointing exactly which required fields are missing, with focus placed on the first one so they can start filling immediately.

**How to apply:** When wiring up any Save/Ok button in a dialog or form that contains `<labos-input mandatory>` or `<labos-select mandatory>` fields, always add this pre-submit validation logic before the actual save action.
