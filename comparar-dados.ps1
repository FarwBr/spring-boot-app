# Script de Comparação Desktop vs Web
# Execute este script no PowerShell

Write-Host "`n╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║          COMPARAÇÃO DADOS DESKTOP vs WEB                      ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# 1. CONSULTAR DESKTOP (SQLite Local)
Write-Host "📱 DADOS DO DESKTOP (SQLite):`n" -ForegroundColor Yellow

$dbPath = "$env:APPDATA\electron-checkin\checkin.db"

if (Test-Path $dbPath) {
    Write-Host "Eventos:" -ForegroundColor Green
    sqlite3 $dbPath "SELECT id, name, active, synced FROM events ORDER BY id;" -header -column
    
    Write-Host "`nParticipantes:" -ForegroundColor Green
    sqlite3 $dbPath "SELECT id, name, email, eventId, isWalkIn, synced FROM participants ORDER BY eventId, id;" -header -column
    
    Write-Host "`nParticipantes NÃO SINCRONIZADOS:" -ForegroundColor Red
    sqlite3 $dbPath "SELECT id, name, email, eventId FROM participants WHERE synced = 0;" -header -column
} else {
    Write-Host "❌ Banco de dados do Desktop não encontrado em: $dbPath" -ForegroundColor Red
    Write-Host "   O Desktop precisa ter sido aberto pelo menos uma vez." -ForegroundColor Gray
}

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor DarkGray

# 2. CONSULTAR WEB (PostgreSQL via SSH)
Write-Host "🌐 DADOS DO WEB (PostgreSQL):`n" -ForegroundColor Yellow
Write-Host "Para consultar o Web, execute no SSH:" -ForegroundColor Cyan
Write-Host ""
Write-Host "ssh univates@177.44.248.75" -ForegroundColor White
Write-Host "cd spring-boot-app" -ForegroundColor White
Write-Host ""
Write-Host "# Ver eventos:" -ForegroundColor Green
Write-Host 'sudo docker exec -i postgres-db psql -U event_user -d event_db -c "SELECT id, name, active FROM events ORDER BY id;"' -ForegroundColor White
Write-Host ""
Write-Host "# Ver participantes:" -ForegroundColor Green
Write-Host 'sudo docker exec -i postgres-db psql -U event_user -d event_db -c "SELECT p.id, p.name, p.email, p.event_id, p.is_walk_in FROM participants p ORDER BY p.event_id, p.id;"' -ForegroundColor White

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor DarkGray

# 3. ESTATÍSTICAS
Write-Host "📊 ESTATÍSTICAS DESKTOP:`n" -ForegroundColor Yellow

if (Test-Path $dbPath) {
    $totalEventos = sqlite3 $dbPath "SELECT COUNT(*) FROM events;"
    $totalParticipantes = sqlite3 $dbPath "SELECT COUNT(*) FROM participants;"
    $totalPendentes = sqlite3 $dbPath "SELECT COUNT(*) FROM participants WHERE synced = 0;"
    
    Write-Host "  Total de Eventos: $totalEventos" -ForegroundColor White
    Write-Host "  Total de Participantes: $totalParticipantes" -ForegroundColor White
    Write-Host "  Participantes Pendentes de Sync: $totalPendentes" -ForegroundColor $(if ($totalPendentes -gt 0) { "Red" } else { "Green" })
}

Write-Host "`n"
