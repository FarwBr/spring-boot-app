# Deploy Simples - Um comando só
# Execute este script no PowerShell

Write-Host "🚀 Deploy rápido no servidor..." -ForegroundColor Cyan
Write-Host "⚠️  Você precisará digitar a senha 3 vezes" -ForegroundColor Yellow
Write-Host ""

$server = "univates@177.44.248.75"

ssh $server "cd spring-boot-app && git pull origin main && sudo docker compose down && sudo docker compose up -d --build"

Write-Host ""
Write-Host "✅ Comando enviado!" -ForegroundColor Green
Write-Host "⏳ Aguarde ~5 minutos para compilar tudo" -ForegroundColor Yellow
Write-Host ""
Write-Host "🌐 Depois acesse: http://177.44.248.75:3000" -ForegroundColor Cyan
