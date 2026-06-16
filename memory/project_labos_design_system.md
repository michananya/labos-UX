---
name: LabOS Design System
description: Angular design system library built from Figma storybook file (0UGfeXBwdgOOh1ZP8zpJHO), located at X:\Product\Specs\Work Items\LaaS\UI\labos-design-system
type: project
originSessionId: 11d8d650-a858-4969-a49e-2ceb3dd0c2b1
---
Angular Material + AG Grid design system for the LabOS product, scaffolded from a Figma storybook.

**Location:** `X:\Product\Specs\Work Items\LaaS\UI\labos-design-system\`

**Figma source:** https://www.figma.com/design/0UGfeXBwdgOOh1ZP8zpJHO/Storybook (fileKey: 0UGfeXBwdgOOh1ZP8zpJHO)

**Why:** Central UI library so all LabOS Angular apps share one consistent look-and-feel driven directly by the Figma spec.

**How to apply:** When working on LabOS UI tasks, reference the design system at the path above. The INTEGRATION.md explains how to wire it into an app.

**Key design tokens:**
- Primary: #265F68 (teal)
- Accent: #5ABA47 (green, used for OK/confirm)
- Error: #D20000
- Font: Open Sans, border-radius: 3px

**Stack:**
- Angular 17+ standalone components
- Angular Material M2 theming (labos-theme.scss)
- AG Grid 31+ (labos-ag-grid-theme.scss)

**Components delivered:** BannerAlert, Badge, Breadcrumb, LabosButton, ChipList, LabosDialog, SidebarMenu, SearchAutocomplete, MasterList, LabosGrid, LabosCheckbox, LabosRadio

**Web components (labos-components.js on X:\):**
- `<labos-navbar>`, `<labos-button>`, `<labos-badge>`, `<labos-dialog>`, `<labos-alert>`
- `<labos-grid>` — AG-Grid-style data grid with multi-select, checkboxes, Shift+click range, `setData()`, `setSelection()`, `selectedRows`
- `<labos-master-list>` — master-detail left panel, multi-select with Shift+Arrow shrink/extend, `setData()`, `setFocus()`, `selectedRows`
- `<labos-autocomplete>` — search dropdown with label/row2/row3/badge, inline highlight, disabled options, keyboard nav
- `<labos-rounded-search>` — pill-shaped search field (bg #eee, border-radius 18px) from Figma "Rounded input or Autocomplete"; supports label+row2, optional `action-icon` attr, events: `labos-select`, `labos-action`
- `<labos-checkbox>` — 16px checkbox, #757575 unselected, primary checked/indeterminate, ripple hover/focus; attrs: `label`, `checked`, `disabled`, `indeterminate`; event: `labos-change`
- `<labos-radio>` — 16px radio, #757575 unselected, primary checked, ripple hover/focus, auto-unchecks same-`name` siblings; attrs: `label`, `checked`, `disabled`, `name`, `value`; event: `labos-change`

**Checkbox design spec (applies to all checkboxes in the system):**
- Size: 16px (not 18px)
- Unselected border color: #757575
- Selected: background + border = primary (#265F68), white SVG checkmark
- Indeterminate: same fill, white dash SVG
- Hover/focus: circular ripple rgba(38,95,104,.12), box-shadow 10px spread on native inputs

**Screen files (X:\Product\Specs\Work Items\LaaS\UI\Design-System-Screens\):**
- `user-management-new.html` — Users screen: grid + split-view toggle, `<labos-rounded-search>` for main search (no filter — navigates to record)
- `doctors.html` — Doctors screen: same pattern, fields: title/firstName/lastName/license/specialty/department/phone/email
- `lab-equipment.html` — Lab Equipment screen: grid + split-view toggle, Out of Service split-button
- `genetics-status-approval.html` — Setup screen: multi-filter zone (Procedure/User/Permission Group), dynamic grid columns, Add/Delete only (no split view)
- `orders-list.html` — Workstation screen: rich action bar (Release, Print split, Distribution split, icon btns, More menu), 6 icon columns per row, status color badges, no split view

**Shared pattern for all screens:**
- `.screen-top` wrapper with `padding: 16px 16px 0` for search + action bar
- `labos-grid` has `margin: 12px 16px 0`
- Split view is edge-to-edge (no margin), detail panel has `border-top: 1px solid #E4E4E4` only
- Main search field uses `<labos-rounded-search>` (not labos-autocomplete)
- Selection carry-over UX when toggling grid↔split: see `ux_view_toggle_selection.md`
