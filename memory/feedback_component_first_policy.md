---
name: Component-first policy (Demo before custom)
description: Always check shared Demo for existing components before building custom HTML/CSS; stop and ask for approval if missing
type: feedback
---

Before building any UI element, check `X:\Product\Specs\Work Items\LaaS\UI\shared\demo.html` for a matching component.

- If found → use it exactly as shown — attributes, variants, structure. No exceptions.
- If missing → stop, describe what's missing, and ask the user for explicit approval before writing any custom component.
- **Never invent attribute values, variant names, or component APIs.** If the correct usage is not known, read the Demo first.

**Why:** Keeps the design system consistent and prevents silent drift from the shared component library. Invented attributes (e.g. `variant="borderless"` instead of `borderless` attribute) silently fail with no error.

**How to apply:** This applies to every screen, dialog, and UI element — not just new screens. Any time a component attribute or variant is written, verify it against the Demo before writing it into code.
