-- Script para corrigir sincronização de participantes
-- Este script copia os dados do User para os campos do Participant
-- para que o desktop possa ver os dados corretamente

-- Atualizar participantes que têm user vinculado mas campos vazios
UPDATE participants p
SET 
    name = u.name,
    email = u.email,
    phone = u.phone,
    company = u.company
FROM users u
WHERE p.user_id = u.id
  AND p.user_id IS NOT NULL;

-- Verificar resultado
SELECT 
    p.id,
    p.name as participant_name,
    p.email as participant_email,
    u.name as user_name,
    u.email as user_email,
    p.is_walk_in,
    p.checked_in
FROM participants p
LEFT JOIN users u ON p.user_id = u.id
ORDER BY p.id;

-- Contar participantes por tipo
SELECT 
    CASE 
        WHEN user_id IS NOT NULL AND is_walk_in = false THEN 'Usuário Registrado'
        WHEN is_walk_in = true THEN 'Walk-in'
        ELSE 'Outro'
    END as tipo,
    COUNT(*) as total
FROM participants
GROUP BY 
    CASE 
        WHEN user_id IS NOT NULL AND is_walk_in = false THEN 'Usuário Registrado'
        WHEN is_walk_in = true THEN 'Walk-in'
        ELSE 'Outro'
    END;
