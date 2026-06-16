---
name: feedback_date_format
description: Date format rule — always DD/MM/YYYY with / separator
metadata:
  type: feedback
---

Always format dates as **DD/MM/YYYY** — two-digit day, two-digit month, four-digit year, slash separators.

Example: `11/08/2026`

**Why:** Project-wide consistency; user explicitly defined this as the standard.

**How to apply:** Any date rendered in HTML (grid cells, summary bars, expand panels, dialog content, chart labels) must use this format. No ISO (`2026-08-11`), no dot notation (`11.08.2026`), no other separators.
