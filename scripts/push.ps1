# Build frontend locally, then commit backend + build output and push.
# Usage:  .\scripts\push.ps1
#         .\scripts\push.ps1 "your commit message"

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$Message = if ($args.Count -gt 0) { $args -join " " } else { "Update backend and frontend build" }

Set-Location $Root

Write-Host "==> Cleaning old frontend build..." -ForegroundColor Cyan
if (Test-Path "frontend\assets") {
    Get-ChildItem "frontend\assets" -Force | Remove-Item -Recurse -Force
}
@("frontend\index.html", "frontend\favicon.ico") | ForEach-Object {
    if (Test-Path $_) { Remove-Item -Force $_ }
}

Write-Host "==> Building frontend..." -ForegroundColor Cyan
Set-Location "frontend\amercereactjs"
if (-not (Test-Path "node_modules")) {
    npm install
}
npm run build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
Set-Location $Root

if (-not (Test-Path "frontend\index.html")) {
    Write-Error "Build failed: frontend\index.html not found"
}

Write-Host "==> Git add / commit / push..." -ForegroundColor Cyan
git add -A
git status --short
git commit -m $Message
git push origin main

Write-Host "==> Done." -ForegroundColor Green
