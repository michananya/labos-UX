---
name: Network drive file write strategy
description: X:\ is an SMB network drive — direct file overwrite fails with EBUSY due to oplocks; must use rename-swap approach
type: feedback
originSessionId: 11d8d650-a858-4969-a49e-2ceb3dd0c2b1
---
X:\ is mapped to \\srvfs1\tree (SMB network share). Windows SMB oplocks prevent direct overwrite of existing files (EBUSY) even after the user closes the browser — the indexer, VS Code file watcher, or OS oplock cache still holds the handle.

**Rule:** Never use the Write tool or Copy-Item to overwrite existing files on X:\. Always use the rename-swap pattern.

**Why:** Rename is a directory-entry operation (no content write needed) — SMB oplocks do not block it. Direct write (O_WRONLY|O_TRUNC) is blocked by oplocks.

**How to apply:** For any file on X:\ that already exists, use one of:

Option A — PowerShell helper script (preferred for large files):
```powershell
& "X:\Product\Specs\Work Items\LaaS\UI\shared\Write-SafeFile.ps1" `
    -Path "X:\...\file.html" `
    -Content $content
```

Option B — Copy-Item swap (preferred, Rename-Item sometimes fails with access denied):
```powershell
$tmp = "X:\...\file.tmp.html"
[System.IO.File]::WriteAllText($tmp, $content, [System.Text.Encoding]::UTF8)
Copy-Item $tmp "X:\...\file.html" -Force
Remove-Item $tmp -Force
```

Option C — Inline rename-swap (fallback if Copy-Item fails):
```powershell
$tmp = "X:\...\file.tmp.html"
[System.IO.File]::WriteAllText($tmp, $content, [System.Text.Encoding]::UTF8)
Rename-Item "X:\...\file.html" "file.bak.html" -Force
Rename-Item $tmp "file.html" -Force
Remove-Item "X:\...\file.bak.html" -Force
```

Files on C:\ (local drive) are NOT affected — use the Edit/Write tool normally there.
