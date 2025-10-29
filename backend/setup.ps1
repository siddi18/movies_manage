# PowerShell installation script for the Movies Backend API

Write-Host "Installing dependencies..." -ForegroundColor Green
npm install

Write-Host "Installing TypeScript development dependencies..." -ForegroundColor Green
npm install --save-dev @types/express @types/cors @types/node typescript ts-node

Write-Host "Generating Prisma client..." -ForegroundColor Green
npm run db:generate

Write-Host "Setup complete! Don't forget to:" -ForegroundColor Yellow
Write-Host "1. Copy .env.example to .env and configure your database URL" -ForegroundColor Cyan
Write-Host "2. Run 'npm run db:push' to sync your database schema" -ForegroundColor Cyan
Write-Host "3. Run 'npm run dev' to start the development server" -ForegroundColor Cyan