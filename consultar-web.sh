#!/bin/bash
# Script de Consulta de Dados do Web (PostgreSQL)
# Execute este script no servidor via SSH

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║              DADOS DO WEB (PostgreSQL)                        ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# 1. EVENTOS
echo "📅 EVENTOS:"
echo ""
sudo docker exec -i postgres-db psql -U event_user -d event_db -c "
SELECT 
    id, 
    name, 
    location,
    active, 
    finished,
    TO_CHAR(start_time, 'DD/MM/YYYY HH24:MI') as inicio
FROM events 
ORDER BY id;
"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 2. PARTICIPANTES
echo "👥 PARTICIPANTES:"
echo ""
sudo docker exec -i postgres-db psql -U event_user -d event_db -c "
SELECT 
    p.id, 
    p.name,
    p.email,
    p.event_id,
    CASE WHEN p.is_walk_in THEN '🚶 Walk-in' ELSE '📝 Pré-cadastro' END as tipo,
    CASE WHEN p.checked_in THEN '✅ Sim' ELSE '⏳ Não' END as checkin
FROM participants p 
ORDER BY p.event_id, p.id;
"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 3. ESTATÍSTICAS POR EVENTO
echo "📊 ESTATÍSTICAS POR EVENTO:"
echo ""
sudo docker exec -i postgres-db psql -U event_user -d event_db -c "
SELECT 
    e.id,
    e.name as evento,
    COUNT(p.id) as total_participantes,
    COUNT(CASE WHEN p.checked_in THEN 1 END) as com_checkin,
    COUNT(CASE WHEN p.is_walk_in THEN 1 END) as walkins
FROM events e
LEFT JOIN participants p ON e.id = p.event_id
GROUP BY e.id, e.name
ORDER BY e.id;
"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 4. USUÁRIOS
echo "👤 USUÁRIOS:"
echo ""
sudo docker exec -i postgres-db psql -U event_user -d event_db -c "
SELECT 
    id, 
    name, 
    email, 
    role,
    TO_CHAR(created_at, 'DD/MM/YYYY') as criado_em
FROM users 
ORDER BY id;
"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 5. PARTICIPANTES COM DADOS DO USER
echo "🔗 PARTICIPANTES COM USUÁRIOS:"
echo ""
sudo docker exec -i postgres-db psql -U event_user -d event_db -c "
SELECT 
    p.id,
    p.name as nome_participante,
    p.email as email_participante,
    u.name as nome_usuario,
    u.email as email_usuario,
    p.event_id,
    CASE WHEN p.user_id IS NOT NULL THEN '✅' ELSE '❌' END as tem_user
FROM participants p
LEFT JOIN users u ON p.user_id = u.id
ORDER BY p.event_id, p.id;
"

echo ""
echo "✅ Consulta concluída!"
echo ""
