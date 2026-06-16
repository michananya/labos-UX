---
name: text-link-style
description: Every text link (grid cell, inline, etc.) must be font-weight 600 and color #265F68 with no underline
metadata:
  type: feedback
---

Every text link in the UI — grid cell `render`, inline anchors, etc. — must use:

```css
color: #265F68;
font-weight: 600;
text-decoration: none;
```

**Why:** Consistent link affordance across all screens; weight 600 gives the link enough visual prominence without relying on underline.

**How to apply:** Any time a column uses `render` to produce an `<a>` tag, or any inline anchor is added, always include `font-weight:600`. No exceptions per field importance.
