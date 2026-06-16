---
name: Component change policy
description: When making component changes, always update both labos-components.js AND the Angular design system source
type: feedback
originSessionId: 11d8d650-a858-4969-a49e-2ceb3dd0c2b1
---
Every component change must be applied in TWO places simultaneously:

1. `X:\Product\Specs\Work Items\LaaS\UI\shared\labos-components.js` — the Web Component used by all demo screens
2. The matching Angular component in `C:\Users\hananya.m\labos-design-system\projects\labos-ui\src\lib\components\<name>\`

**Why:** Changes at the screen level are one-off fixes. The source of truth is the design system + labos-components.js. Both must stay in sync.

**How to apply:** Never edit only one. If touching Navbar CSS → update `NAVBAR_CSS` in labos-components.js AND `navbar.component.scss`. If touching Button → update `BUTTON_CSS` AND `button.component.scss`. Etc.
