# Script de Deploy para Servidor Univates
# Execute este script no PowerShell

Write-Host "🚀 Iniciando deploy no servidor Univates..." -ForegroundColor Cyan
Write-Host ""

$server = "univates@177.44.248.75"

# Passo 1: Parar containers
Write-Host "1️⃣ Parando containers antigos..." -ForegroundColor Yellow
ssh $server "cd spring-boot-app && sudo docker compose down"

# Passo 2: Atualizar código
Write-Host ""
Write-Host "2️⃣ Atualizando código do GitHub..." -ForegroundColor Yellow
ssh $server "cd spring-boot-app && git pull origin main"

# Passo 3: Subir banco de dados
Write-Host ""
Write-Host "3️⃣ Iniciando PostgreSQL..." -ForegroundColor Yellow
ssh $server "cd spring-boot-app && sudo docker compose up -d postgres"
Start-Sleep -Seconds 10

# Passo 4: Subir API Gateway
Write-Host ""
Write-Host "4️⃣ Iniciando API Gateway..." -ForegroundColor Yellow
ssh $server "cd spring-boot-app && sudo docker compose up -d api-gateway"

# Passo 5: Subir Backend (demora ~2 minutos)
Write-Host ""
Write-Host "5️⃣ Compilando e iniciando Backend (aguarde ~2 minutos)..." -ForegroundColor Yellow
ssh $server "cd spring-boot-app && sudo docker compose up -d --build --no-deps backend"

# Passo 6: Subir Frontend (demora ~3 minutos)
Write-Host ""
Write-Host "6️⃣ Compilando e iniciando Frontend (aguarde ~3 minutos)..." -ForegroundColor Yellow
ssh $server "cd spring-boot-app && sudo docker compose up -d --build --no-deps frontend"

# Verificar status
Write-Host ""
Write-Host "7️⃣ Verificando status dos containers..." -ForegroundColor Yellow
ssh $server "cd spring-boot-app && sudo docker compose ps"

Write-Host ""
Write-Host "✅ Deploy concluído!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Acesse o sistema em: http://177.44.248.75:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Para ver logs:" -ForegroundColor Gray
Write-Host "   ssh $server" -ForegroundColor Gray
Write-Host "   cd spring-boot-app && sudo docker compose logs -f" -ForegroundColor Gray
