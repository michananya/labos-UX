---
name: Navbar breadcrumbs structure
description: Breadcrumbs in labos-navbar always start with the screen name — never include a top-level "LabOS" entry
type: feedback
---

Never include `{"label":"LabOS"}` as the first breadcrumb level. Always start directly with the screen name.

**Why:** The "LabOS" root label is redundant — users already know they're in LabOS. The navbar breadcrumbs should reflect the navigation path within the app, not the app name.

**How to apply:** `breadcrumbs='[{"label":"About"}]'` not `[{"label":"LabOS"},{"label":"About"}]`. Single-level screens get a single item; nested screens get parent → screen (e.g. `[{"label":"Admin"},{"label":"User Management"}]`).
