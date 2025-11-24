# Start both frontend and backend
# Run this from the project root in PowerShell

Write-Host "Installing backend dependencies..." -ForegroundColor Cyan
Set-Location server
npm install
Set-Location ..

Write-Host "`nStarting backend server (http://localhost:5000)..." -ForegroundColor Green
Start-Process -FilePath npm -ArgumentList "run dev --prefix server" -NoNewWindow

Start-Sleep -Seconds 2

Write-Host "Starting frontend dev server (http://localhost:5173)..." -ForegroundColor Green
npm run dev

Write-Host "`nBoth servers running!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "Backend: http://localhost:5000" -ForegroundColor Cyan
