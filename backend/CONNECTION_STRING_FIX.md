# 🔧 Corrigir Connection String do Supabase

## ⚠️ Problema

Erro: **"Tenant or user not found"** ao acessar tabelas no schema `marcbuddy`.

## 🔍 Causa

O pooler do Supabase (porta 6543) pode ter limitações para acessar schemas customizados como `marcbuddy`.

## ✅ Solução

### Opção 1: Usar Connection String Direta (Recomendado)

A connection string direta (porta 5432) tem acesso completo a todos os schemas.

1. Acesse: https://supabase.com/dashboard/project/umydjofqoknbggwtwtqv/settings/database
2. Em **Connection string**, selecione **"Direct connection"** (não "Session mode" ou "Transaction mode")
3. Copie a connection string (deve ter `:5432/` ao invés de `:6543/`)
4. Atualize no Render:
   - Acesse: https://dashboard.render.com/web/srv-d4tq98uuk2gs73c4m5bg/environment
   - Edite `SUPABASE_DB_CONNECTION_STRING`
   - Cole a nova connection string (porta 5432)
   - Salve (servidor reiniciará automaticamente)

### Opção 2: Usar Variáveis Individuais

Se preferir, use variáveis individuais:

```env
SUPABASE_DB_HOST=aws-0-us-east-1.pooler.supabase.com
SUPABASE_DB_PORT=5432
SUPABASE_DB_NAME=postgres
SUPABASE_DB_USER=postgres.umydjofqoknbggwtwtqv
SUPABASE_DB_PASSWORD=GkJWkn13oFT9vd1C
```

**⚠️ IMPORTANTE**: Use porta `5432` (direta) ao invés de `6543` (pooler) para schemas customizados.

---

## 📝 Formato da Connection String

**Pooler (pode ter problemas):**
```
postgresql://postgres.umydjofqoknbggwtwtqv:PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**Direta (recomendado para schemas customizados):**
```
postgresql://postgres.umydjofqoknbggwtwtqv:PASSWORD@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

Ou melhor ainda, use a connection string direta do Supabase Dashboard (não pooler).

---

## 🔄 Após Atualizar

1. O servidor será reiniciado automaticamente
2. Aguarde o deploy concluir
3. Teste novamente: https://marcbuddy-backend.onrender.com/api/plans

---

**Última atualização:** Dezembro 2024
