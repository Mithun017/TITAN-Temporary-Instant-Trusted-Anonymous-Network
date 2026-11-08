@echo off
setlocal
title LeetCode

echo ======================================================================
echo    LeetCode - The World's Leading Online Programming Platform
echo ======================================================================
echo.

cd /d "%~dp0"

set NODE_ENV=production
set PORT=3001

if not exist node_modules (
    echo [*] Installing dependencies...
    call npm install
)

if not exist .next\BUILD_ID (
    echo [*] Building optimized production bundles...
    call npm run build
)

if exist scripts\preflight.js (
    node scripts\preflight.js
)

echo [*] Launching browser at http://localhost:3001...
start http://localhost:3001

echo [*] Starting server on port 3001...
echo [*] Service active at http://localhost:3001
echo [*] Press Ctrl+C to terminate.
echo.

node server.js

pause
