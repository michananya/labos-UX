---
name: Confirm dialog UX rules
description: Visual and focus rules for labos-dialog type="confirm" — banner style and initial focus on Cancel
type: feedback
originSessionId: b246e389-4d4c-4d68-bf2d-541419ec968d
---
Dialogs with `type="confirm"` follow these rules:

1. **Banner**: shows `warning` icon (48px, #D20000) + "Action confirmation" text (30px, font-weight 400, #D20000) between header and body.
2. **Initial focus**: on `show()`, focus always lands on the Cancel button (`labos-button[cancel]`), not the destructive action button.

**Why:** Confirmation dialogs are destructive — defaulting focus to Cancel prevents accidental keyboard-triggered deletions.

**How to apply:** Any destructive or irreversible action dialog (Delete, Set Inactive, etc.) should use `type="confirm"`. The component handles both the banner and the focus automatically. No extra wiring needed in screen files.
