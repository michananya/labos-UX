---
name: View toggle selection carry-over
description: UX rule for selection state when switching between grid and split view — applies to ALL screens
type: feedback
originSessionId: 11d8d650-a858-4969-a49e-2ceb3dd0c2b1
---
When a screen supports both grid view and split (master-details) view, selection must be preserved across the toggle.

**Grid → Split view:**
- No grid selection → auto-select first row in master-list (selected + focus)
- 1 row selected → same row selected in master-list (selected + focus)
- Multiple rows selected → all selected in master-list; first (lowest index) gets focus

**Split view → Grid:**
- No master-list selection → nothing selected in grid
- 1 row selected → same row selected in grid (selected + focus / scroll into view)
- Multiple rows selected → all selected in grid; first gets focus / scroll into view

**Why:** Defined by the user as a permanent UX standard for all future screens.

**How to apply:**
- Track `gridSelectionIndices` (sorted) via `labos-selection-change`
- Track `masterSelectionIndices` (sorted) via `labos-selection-change`
- Use `LabosGrid.setSelection(indices)` (public method) to restore grid selection
- Use `LabosMasterList.setFocus(index)` (public method) after `setData` to position focus
- Pass `selected: true` in rows to `masterList.setData()` to pre-select items
- When no grid selection on entry to split view, default `selIdx = [0]`
