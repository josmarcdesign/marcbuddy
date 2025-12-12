# 🚀 Guia de Setup do Backend no Render

## ⚠️ Problema Atual

O Render não consegue acessar o repositório. Isso pode acontecer por:

1. **Repositório vazio** - Precisa ter pelo menos um commit
2. **Repositório privado** - Render precisa de permissão de acesso
3. **Branch não existe** - A branch `main` precisa existir

---

## ✅ Passos para Resolver

### 1. Verificar se o repositório tem código

```bash
# No diretório do projeto
git init
git add .
git commit -m "Initial commit - MarcBuddy Backend"
git branch -M main
git remote add origin https://github.com/josmarcdesign/marcbuddy.git
git push -u origin main
```

### 2. Verificar permissões no Render

1. Acesse: https://dashboard.render.com
2. Vá em **Account Settings** → **GitHub**
3. Verifique se o repositório `josmarcdesign/marcbuddy` aparece na lista
4. Se não aparecer, reconecte o GitHub

### 3. Verificar se o repositório é público ou privado

- **Público**: Render acessa automaticamente
- **Privado**: Precisa dar permissão específica no GitHub

---

## 🔧 Criar Serviço Manualmente (Alternativa)

Se o MCP não funcionar, você pode criar manualmente:

1. Acesse: https://dashboard.render.com/new/web-service
2. Conecte o repositório: `josmarcdesign/marcbuddy`
3. Configure:
   - **Name**: `marcbuddy-backend`
   - **Region**: `Oregon`
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Starter`

### Variáveis de Ambiente

Adicione estas variáveis no painel do Render:

```
NODE_ENV=production
PORT=3001
SUPABASE_DB_CONNECTION_STRING=postgresql://postgres.umydjofqoknbggwtwtqv:GkJWkn13oFT9vd1C@aws-0-us-east-1.pooler.supabase.com:6543/postgres
SUPABASE_URL=https://umydjofqoknbggwtwtqv.supabase.co
SUPABASE_SERVICE_KEY=sb_secret_qxkUBDDgozx5sIEvTr28TA_aP1j_bLu
JWT_SECRET=sua_chave_jwt_super_segura_aqui
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://seu-frontend.onrender.com
STRIPE_SECRET_KEY=sk_live_sua_chave_aqui
STRIPE_WEBHOOK_SECRET=whsec_sua_chave_webhook_aqui
```

**⚠️ IMPORTANTE**: Altere `JWT_SECRET` para uma chave segura em produção!

---

## 📝 Checklist

- [ ] Repositório tem pelo menos um commit
- [ ] Branch `main` existe
- [ ] Render tem acesso ao repositório (verificado em Account Settings)
- [ ] Variáveis de ambiente configuradas
- [ ] Root Directory: `backend` (se o repositório tem frontend e backend)

---

## 🔄 Após o Deploy

1. **Atualizar Webhook do Stripe**
   - URL: `https://marcbuddy-backend.onrender.com/api/stripe/webhook`
   - Adicione no Stripe Dashboard

2. **Atualizar FRONTEND_URL**
   - Após deploy do frontend, atualize a variável `FRONTEND_URL`

3. **Testar API**
   - Health check: `https://marcbuddy-backend.onrender.com/api/health`

---

**Última atualização:** Dezembro 2024
