-- Script SQL para tornar o usuário com email "josmarcdesign@gmail.com" como admin
-- Execute este script diretamente no banco de dados PostgreSQL

UPDATE users 
SET role = 'admin', updated_at = CURRENT_TIMESTAMP 
WHERE email = 'josmarcdesign@gmail.com';

-- Verificar se foi atualizado
SELECT id, name, email, role, created_at, updated_at 
FROM users 
WHERE email = 'josmarcdesign@gmail.com';

