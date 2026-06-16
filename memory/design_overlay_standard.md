---
name: Overlay/Dropdown shell standard
description: Standard visual spec for all floating overlay containers (dropdowns, menus, autocomplete panels)
type: project
originSessionId: b246e389-4d4c-4d68-bf2d-541419ec968d
---
All floating overlay containers (autocomplete dropdown, menu button panel, split button submenu, any future popups) must use:

```css
background: #ffffff;
box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
border-radius: 0;
top: 100%; /* flush to the triggering element — no gap */
```

No `border` on the overlay shell itself.

**List item standard** (applies to all menu/select/autocomplete rows):
- `height: 48px`
- `font-size: 14px`
- `font-weight: 400`
- `padding: 0 16px`

Tokens: `--menu-item-height`, `--menu-item-fs`, `--menu-item-fw`, `--menu-item-px` (defined in TOKENS).

**Why:** Unified design language for all floating UI surfaces.

**How to apply:** When adding or editing any dropdown/popup overlay, replace any existing `box-shadow` and remove `border` from the container element. Use the `--overlay-shadow` token (defined in TOKENS in labos-components.js).
