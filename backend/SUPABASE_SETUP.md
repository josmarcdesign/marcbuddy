# Configuração do Supabase

## Passo 1: Obter a Connection String do Supabase

1. Acesse o painel do Supabase: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** → **Database**
4. Role até a seção **Connection string**
5. Selecione **URI** (não "Session mode" ou "Transaction mode")
6. Copie a connection string (formato: `postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`)

## Passo 2: Configurar o arquivo .env

Adicione a connection string no arquivo `backend/.env`:

```env
# Supabase
SUPABASE_URL=https://umydjofqoknbggwtwtqv.supabase.co
SUPABASE_SERVICE_KEY=sb_secret_qxkUBDDgozx5sIEvTr28TA_aP1j_bLu
SUPABASE_DB_CONNECTION_STRING=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
```

**⚠️ IMPORTANTE:** Substitua `[ref]`, `[password]` e `[region]` pelos valores reais da sua connection string.

## Passo 3: Testar a Conexão

Execute o script de teste:

```bash
cd backend
node scripts/test-supabase-connection.js
```

Se a conexão funcionar, você verá a lista de tabelas do banco.

## Passo 4: Verificar Schema do Banco

Certifique-se de que todas as tabelas necessárias existem no Supabase. O código espera as seguintes tabelas:

- `users`
- `mclients_clients`
- `mclients_follow_through_models`
- `mclients_follow_throughs`
- `mclients_demands`
- `mclients_payments`
- `mclients_documents`
- `mclients_services`
- `mclients_tasks`
- `mclients_pending_approvals`
- `mclients_time_entries`
- `mclients_activities`
- `mclients_briefing_submissions`

Se as tabelas não existirem, você pode executar as migrações:

```bash
npm run migrate:all
```

## Notas

- A **SUPABASE_SERVICE_KEY** é usada para operações administrativas via API do Supabase
- A **SUPABASE_DB_CONNECTION_STRING** é usada para conexão direta via PostgreSQL (mantém compatibilidade com código existente)
- O código atual usa `pg` (node-postgres) diretamente, então a connection string é a forma mais compatível

