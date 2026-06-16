# Write-SafeFile.ps1
# ──────────────────────────────────────────────────────────────────────────────
# Safe file writer for SMB/network drives where oplocks block direct overwrite.
#
# Usage (from PowerShell tool):
#   $content = @'
#   ... file content ...
#   '@
#   & "X:\Product\Specs\Work Items\LaaS\UI\shared\Write-SafeFile.ps1" `
#       -Path "X:\Product\Specs\Work Items\LaaS\UI\Design-System-Screens\foo.html" `
#       -Content $content
#
# Strategy: write to a sibling .tmp file, then rename-swap.
# Rename is a directory-entry operation — not blocked by SMB oplocks.
# ──────────────────────────────────────────────────────────────────────────────
param(
    [Parameter(Mandatory)][string]$Path,
    [Parameter(Mandatory)][string]$Content
)

$tmp = $Path + '.tmp'

# 1. Write content to the tmp file (new file — never locked)
[System.IO.File]::WriteAllText($tmp, $Content, [System.Text.Encoding]::UTF8)

# 2. If target exists, rename it out of the way
if (Test-Path $Path) {
    $bak = $Path + '.bak'
    Rename-Item -LiteralPath $Path -NewName ([System.IO.Path]::GetFileName($bak)) -Force
    # 3. Rename tmp → target
    Rename-Item -LiteralPath $tmp -NewName ([System.IO.Path]::GetFileName($Path)) -Force
    # 4. Delete backup
    Remove-Item -LiteralPath $bak -Force
} else {
    # Target doesn't exist — just rename tmp → target
    Rename-Item -LiteralPath $tmp -NewName ([System.IO.Path]::GetFileName($Path)) -Force
}

Write-Host "Written: $Path"
