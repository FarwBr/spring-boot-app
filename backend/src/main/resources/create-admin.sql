-- Script para criar usuário administrador inicial
-- Senha: admin123 (BCrypt encoded)

INSERT INTO users (name, email, password, role, phone, company, created_at)
VALUES ('Administrator', 'admin@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN', '', '', NOW())
ON CONFLICT (email) DO NOTHING;

-- O hash acima corresponde à senha: admin123
-- Para gerar novos hashes, use: https://bcrypt-generator.com/ com 10 rounds
