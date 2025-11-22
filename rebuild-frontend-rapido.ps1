# Script para rebuild rápido do frontend
# Execute: .\rebuild-frontend-rapido.ps1

Write-Host "`n🚀 Rebuild Rápido do Frontend`n" -ForegroundColor Cyan

$server = "univates@177.44.248.75"

Write-Host "Conectando ao servidor..." -ForegroundColor Yellow
ssh $server @"
cd spring-boot-app
echo '🛑 Parando frontend...'
sudo docker compose stop frontend
echo '🗑️ Removendo container antigo...'
sudo docker compose rm -f frontend
echo '🔨 Construindo nova imagem (aguarde ~3 min)...'
sudo docker compose build frontend
echo '🚀 Iniciando frontend...'
sudo docker compose up -d frontend
echo '✅ Pronto!'
sudo docker compose ps frontend
"@

Write-Host "`n✅ Frontend reconstruído!" -ForegroundColor Green
Write-Host "🌐 Teste em: http://177.44.248.75:3000`n" -ForegroundColor Cyan
