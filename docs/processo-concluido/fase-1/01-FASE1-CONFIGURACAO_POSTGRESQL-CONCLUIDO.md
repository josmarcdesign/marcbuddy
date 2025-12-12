# ✅ CONCLUÍDO - Guia de Configuração do PostgreSQL - MarcBuddy

> **Status**: ✅ Concluído  
> **Data**: Fase 1 - Setup Inicial  
> **Ordem**: 01

Este guia explica passo a passo como configurar o PostgreSQL para o projeto MarcBuddy.

## 📋 Pré-requisitos

- PostgreSQL instalado (versão 12 ou superior)
- Acesso administrativo ao PostgreSQL

## 🔧 Passo 1: Instalar o PostgreSQL

### Windows

1. Baixe o PostgreSQL em: https://www.postgresql.org/download/windows/
2. Execute o instalador
3. Durante a instalação, você será solicitado a criar uma senha para o usuário `postgres`
   - **IMPORTANTE**: Anote esta senha, você precisará dela!
4. Deixe a porta padrão como `5432`
5. Complete a instalação

### Verificar Instalação

Abra o **pgAdmin** (interface gráfica) ou o **SQL Shell (psql)** que vem com o PostgreSQL.

## 🗄️ Passo 2: Criar o Banco de Dados

### Opção 1: Usando pgAdmin (Interface Gráfica)

1. Abra o **pgAdmin**
2. Conecte-se ao servidor PostgreSQL (use a senha que você criou)
3. Clique com botão direito em **Databases** → **Create** → **Database**
4. Configure:
   - **Name**: `marcbuddy_db`
   - **Owner**: `postgres` (ou seu usuário)
5. Clique em **Save**

### Opção 2: Usando SQL Shell (psql)

1. Abra o **SQL Shell (psql)**
2. Pressione Enter para aceitar os valores padrão até chegar na senha
3. Digite a senha do usuário `postgres`
4. Execute o comando:

```sql
CREATE DATABASE marcbuddy_db;
```

5. Verifique se foi criado:

```sql
\l
```

Você deve ver `marcbuddy_db` na lista de bancos de dados.

## 👤 Passo 3: Configurar Usuário e Permissões

### Usar o usuário padrão `postgres` (Recomendado para desenvolvimento)

Se você instalou o PostgreSQL normalmente, já terá um usuário `postgres` com permissões administrativas. Este é suficiente para desenvolvimento.

### Criar um usuário específico (Opcional, para produção)

Se preferir criar um usuário específico para o projeto:

```sql
-- Conecte-se ao PostgreSQL como superusuário
-- No psql, execute:

CREATE USER marcbuddy_user WITH PASSWORD 'sua_senha_segura_aqui';

-- Dar permissões ao usuário no banco de dados
GRANT ALL PRIVILEGES ON DATABASE marcbuddy_db TO marcbuddy_user;

-- Conectar ao banco marcbuddy_db
\c marcbuddy_db

-- Dar permissões no schema público
GRANT ALL ON SCHEMA public TO marcbuddy_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO marcbuddy_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO marcbuddy_user;

-- Garantir permissões para tabelas futuras
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO marcbuddy_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO marcbuddy_user;
```

## ⚙️ Passo 4: Configurar o arquivo .env do Backend

1. Navegue até a pasta `backend`
2. Crie um arquivo `.env` (ou renomeie `env.example.txt` para `.env`)
3. Configure com suas credenciais:

### Configuração Padrão (usando usuário postgres)

```env
PORT=3001
NODE_ENV=development

# Configurações do Banco de Dados PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=marcbuddy_db
DB_USER=postgres
DB_PASSWORD=sua_senha_do_postgres_aqui

# Configurações JWT
JWT_SECRET=seu_jwt_secret_super_seguro_aqui_mude_em_producao
JWT_EXPIRES_IN=7d

# URL do Frontend (para CORS)
FRONTEND_URL=http://localhost:3000
```

### Configuração com Usuário Específico

Se você criou um usuário específico:

```env
PORT=3001
NODE_ENV=development

# Configurações do Banco de Dados PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=marcbuddy_db
DB_USER=marcbuddy_user
DB_PASSWORD=sua_senha_segura_aqui

# Configurações JWT
JWT_SECRET=seu_jwt_secret_super_seguro_aqui_mude_em_producao
JWT_EXPIRES_IN=7d

# URL do Frontend (para CORS)
FRONTEND_URL=http://localhost:3000
```

## 🔍 Passo 5: Testar a Conexão

### Teste Manual (psql)

```bash
# No terminal, execute:
psql -U postgres -d marcbuddy_db

# Ou se criou usuário específico:
psql -U marcbuddy_user -d marcbuddy_db
```

Se conseguir conectar, está tudo certo!

### Teste via Aplicação

1. No terminal, navegue até `backend`
2. Execute a migração:

```bash
npm run migrate
```

Se tudo estiver correto, você verá:
```
🔄 Iniciando migração do banco de dados...
✅ Conectado ao banco de dados PostgreSQL
✅ Tabela users criada
✅ Tabela subscriptions criada
✅ Índices criados
🎉 Migração concluída com sucesso!
```

## 🛠️ Solução de Problemas Comuns

### Erro: "password authentication failed"

**Causa**: Senha incorreta no arquivo `.env`

**Solução**: 
- Verifique se a senha no `.env` está correta
- Se esqueceu a senha do `postgres`, você pode redefini-la editando o arquivo `pg_hba.conf`

### Erro: "database does not exist"

**Causa**: O banco de dados `marcbuddy_db` não foi criado

**Solução**: 
- Crie o banco seguindo o Passo 2
- Ou altere o nome do banco no `.env` para um que já existe

### Erro: "connection refused"

**Causa**: PostgreSQL não está rodando

**Solução**:
- **Windows**: Abra o **Services** (serviços), procure por "postgresql" e inicie o serviço
- Ou reinicie o PostgreSQL pelo pgAdmin

### Erro: "port 5432 is already in use"

**Causa**: Outra instância do PostgreSQL está usando a porta

**Solução**:
- Verifique se há outra instância rodando
- Ou altere a porta no `.env` (e configure o PostgreSQL para usar outra porta)

### Como verificar se o PostgreSQL está rodando (Windows)

1. Abra o **Gerenciador de Tarefas** (Ctrl + Shift + Esc)
2. Vá na aba **Serviços**
3. Procure por `postgresql-x64-XX` (onde XX é a versão)
4. O status deve estar como **Em execução**

## 📊 Estrutura das Tabelas Criadas

Após executar a migração, você terá:

### Tabela: `users`
- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR 255)
- `email` (VARCHAR 255, UNIQUE)
- `password_hash` (VARCHAR 255)
- `role` (VARCHAR 50) - 'user' ou 'admin'
- `is_active` (BOOLEAN)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Tabela: `subscriptions`
- `id` (SERIAL PRIMARY KEY)
- `user_id` (INTEGER, FK para users)
- `plan_type` (VARCHAR 50) - 'free', 'basic', 'premium', 'enterprise'
- `status` (VARCHAR 50) - 'pending', 'active', 'cancelled', 'expired'
- `license_key` (VARCHAR 255, UNIQUE)
- `start_date` (TIMESTAMP)
- `end_date` (TIMESTAMP)
- `renewal_date` (TIMESTAMP)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## 🔐 Segurança

### Para Desenvolvimento (Local)
- Usar `localhost` como host está seguro
- Usar o usuário `postgres` está OK para desenvolvimento local

### Para Produção
- **NUNCA** use o usuário `postgres` em produção
- Crie um usuário específico com permissões limitadas
- Use senhas fortes
- Configure firewall adequadamente
- Use SSL para conexões
- Considere usar variáveis de ambiente seguras

## 📝 Resumo das Configurações Recomendadas

### Desenvolvimento Local

```
Host: localhost
Porta: 5432
Banco: marcbuddy_db
Usuário: postgres
Senha: [a senha que você definiu na instalação]
```

### Exemplo de .env para Desenvolvimento

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=marcbuddy_db
DB_USER=postgres
DB_PASSWORD=minhasenha123
```

## ✅ Checklist de Configuração

- [x] PostgreSQL instalado
- [x] Banco de dados `marcbuddy_db` criado
- [x] Usuário configurado (postgres ou específico)
- [x] Arquivo `.env` criado no backend
- [x] Credenciais corretas no `.env`
- [x] PostgreSQL rodando
- [x] Migração executada com sucesso
- [x] Conexão testada

## 🆘 Precisa de Ajuda?

Se ainda tiver problemas:

1. Verifique os logs do PostgreSQL
2. Confirme que o serviço está rodando
3. Teste a conexão manualmente com psql
4. Verifique se as portas não estão bloqueadas pelo firewall
5. Confirme que as credenciais no `.env` estão corretas

---

**Próximo passo**: Após configurar o PostgreSQL, execute `npm run migrate` no backend para criar as tabelas!

