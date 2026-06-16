---
name: Shared dropdown portal standard (LabosDropdown)
description: All dropdown-opening components in labos-components.js use the shared LabosDropdown utility class — same CSS, HTML structure, positioning, and item rendering.
type: project
originSessionId: 05fae3be-1cb7-4f5d-842c-29556b38ad28
---
All six dropdown-opening components use **`LabosDropdown`** (defined near the top of `labos-components.js`, before LABOS-NAVBAR):

- `labos-select`
- `labos-rounded-select`
- `labos-autocomplete`
- `labos-icon-menu`
- `labos-menu-button`
- `labos-split-button`

## Standard

- Portal: `<div data-labos-portal>` appended to `document.body`, `position: fixed`
- Shell CSS: injected once via `<style id="labos-dropdown-css">` (by IIFE at startup)
- Box-shadow: `0 4px 4px 0 rgba(0,0,0,.25)`, z-index: 9999, animation: `labos-drop .12s ease`
- Items: class `lbd-item`, height 48px, padding 0 16px, font 14px Open Sans, hover `#F5F5F5`
- Active highlight class: `lbd-active`
- Icon: class `lbd-item__icon`, Material Icons 16px, color `#265F68`

## LabosDropdown constructor options

```
new LabosDropdown({
  direction:  'bottom-left'*  | 'bottom-right' | 'top-left' | 'top-right',
  minWidth:   0*,             // actual min-width = max(minWidth, anchorWidth)
  maxHeight:  300*,           // null = no limit
  keepFocus:  false*,         // true for autocomplete (prevents blur on portal mousedown)
})
```

## Methods

- `open(anchorEl, items, onSelect, opts?)` — create/reposition portal; opts can override direction
- `refresh(items, onSelect)` — re-render items without repositioning (autocomplete on keystroke)
- `close()` — remove portal
- `setHighlight(idx)` — add/remove `.lbd-active` class + scrollIntoView
- `get isOpen` / `getPortal()`

## Per-component configuration

| Component | minWidth | direction | keepFocus |
|-----------|----------|-----------|-----------|
| labos-select | 0 (anchor width) | bottom-left | false |
| labos-rounded-select | 0 | bottom-left | false |
| labos-autocomplete | 0 | bottom-left | true |
| labos-icon-menu | 200 | from `direction` attr | false |
| labos-menu-button | 200 | bottom-left | false |
| labos-split-button | 200 | bottom-left | false |

**Why:** After analysis found 3 divergent implementations (body portal with inline CSS, body portal with Object.assign styles, shadow DOM absolute). Unified in April 2026.

**How to apply:** Any new component that opens a floating item list must use `new LabosDropdown(...)` — do NOT create a custom portal or inject separate CSS.
