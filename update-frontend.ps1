# Script para atualizar frontend no servidor
# Execute este script no PowerShell

Write-Host "🔄 Atualizando frontend no servidor..." -ForegroundColor Cyan

$server = "univates@177.44.248.75"

# Atualizar código
Write-Host "📥 Puxando código..." -ForegroundColor Yellow
ssh $server "cd spring-boot-app && git pull origin main"

# Rebuild frontend
Write-Host "🔨 Reconstruindo frontend (aguarde ~3 minutos)..." -ForegroundColor Yellow
ssh $server "cd spring-boot-app && sudo docker compose up -d --build --no-deps frontend"

Write-Host ""
Write-Host "✅ Frontend atualizado!" -ForegroundColor Green
Write-Host "🌐 Acesse: http://177.44.248.75:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Aguarde 1-2 minutos e teste o carregamento de usuários." -ForegroundColor Yellow
