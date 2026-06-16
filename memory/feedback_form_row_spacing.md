---
name: Form field container spacing
description: Containers that hold form fields must never have gap or margin-bottom — field components provide their own natural spacing
type: feedback
---

Never add `gap`, `margin-bottom`, or any vertical spacing to a container whose direct children are form field components (`labos-input`, `labos-autocomplete`, `labos-rounded-search`, radio groups, etc.).

**Why:** Field components (e.g. `labos-input` at 60px, `labos-autocomplete` at 60px) already include their own height with built-in visual breathing room. Adding gap or margin-bottom on top creates unintended extra white space between rows.

**How to apply:**
- `.form-row` — no `margin-bottom`
- Any flex/grid container holding field rows — no `gap` on the column axis (vertical)
- If horizontal gap is needed between fields on the same row, that's fine (e.g. `gap: 16px` on a row-level flex wrapper)
- Applies to all form layouts across all screens, including tab content panels like `.containers-fields`
