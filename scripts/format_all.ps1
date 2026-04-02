param(
    [switch]$Check
)

$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

$prettierArgs = @('exec', '--', 'prettier')
if ($Check) {
    $prettierArgs += @('--check', '.')
} else {
    $prettierArgs += @('--write', '.')
}

& npm @prettierArgs
if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}
