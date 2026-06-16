---
name: Toast component rules
description: Visual and behaviour spec for <labos-toast> — the fixed top-right notification banner
type: project
---

`<labos-toast>` — fixed-position notification banner, top-right of screen.

**Position:** 10px from right edge, 10px below the navbar (CSS: `top: 58px; right: 10px`)

**Size & style:**
- Height: 48px
- Border-radius: 3px (var(--radius))
- Box-shadow: var(--overlay-shadow)  `0 4px 4px 0 rgba(0,0,0,.25)`
- Text: 14px, font-weight 600, white
- Padding: 16px left, 12px right; 12px gap between text and × icon

**Types (background color):**
| type | token | hex |
|------|-------|-----|
| `success` | `--green` | #5ABA47 |
| `warning` | `--orange` | #FFA500 |
| `info` | `--blue` | #1773E0 |
| `error` | `--red-darken-15` | #B30000 |

**Behaviour:**
- Auto-dismisses after 3 seconds (default)
- Entry: slide down from above (`translateY(-100%) → 0`) + fade in
- Exit: slide up (`0 → translateY(-100%)`) + fade out
- × button closes immediately

**API:**
```js
// Instance
document.querySelector('labos-toast').show('Message', 'success');
document.querySelector('labos-toast').show('Message', 'warning', 5000); // custom ms

// Static (auto-creates element)
LabosToast.show('Message', 'info');
```

**Why:** Standardised flash feedback across all LabOS screens without inline alert dialogs.

**How to apply:** Add `<labos-toast></labos-toast>` once in the page body. Call `LabosToast.show()` for any transient feedback (save, delete, error).
