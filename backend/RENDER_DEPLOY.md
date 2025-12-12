# 🚀 Deploy do Backend no Render

## Pré-requisitos

1. **Repositório Git** (GitHub, GitLab, Bitbucket)
   - O código do backend precisa estar em um repositório Git
   - Render precisa acessar o repositório para fazer deploy

2. **Conta no Render**
   - Já configurada ✅
   - Workspace: José's workspace

---

## 📋 Passo a Passo

### 1. Preparar Repositório Git

Se ainda não tiver um repositório:

```bash
# Inicializar Git (se ainda não tiver)
git init

# Adicionar arquivos
git add .

# Fazer commit
git commit -m "Initial commit - MarcBuddy Backend"

# Criar repositório no GitHub/GitLab e adicionar remote
git remote add origin https://github.com/seu-usuario/marcbuddy-backend.git
git push -u origin main
```

### 2. Variáveis de Ambiente Necessárias

Você precisará configurar estas variáveis no Render:

**Obrigatórias:**
- `PORT` - Porta do servidor (Render define automaticamente, mas pode usar 3001)
- `NODE_ENV` - `production`
- `SUPABASE_DB_CONNECTION_STRING` - Connection string do Supabase
- `JWT_SECRET` - Chave secreta para JWT
- `FRONTEND_URL` - URL do frontend em produção

**Opcionais mas recomendadas:**
- `SUPABASE_URL` - URL do projeto Supabase
- `SUPABASE_SERVICE_KEY` - Service key do Supabase
- `STRIPE_SECRET_KEY` - Chave secreta do Stripe
- `STRIPE_WEBHOOK_SECRET` - Secret do webhook do Stripe
- `PIX_KEY` - Chave PIX (se usar)

### 3. Criar Serviço no Render

**Configurações do Serviço:**

- **Nome:** `marcbuddy-backend`
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Root Directory:** `backend` (se o repositório tiver frontend e backend)
- **Plan:** `Starter` (ou superior conforme necessidade)

**Variáveis de Ambiente:**

```env
PORT=3001
NODE_ENV=production
SUPABASE_DB_CONNECTION_STRING=postgresql://postgres.umydjofqoknbggwtwtqv:GkJWkn13oFT9vd1C@aws-0-us-east-1.pooler.supabase.com:6543/postgres
JWT_SECRET=sua_chave_jwt_super_segura_aqui
FRONTEND_URL=https://seu-frontend.onrender.com
STRIPE_SECRET_KEY=sk_live_sua_chave_aqui
STRIPE_WEBHOOK_SECRET=whsec_sua_chave_webhook_aqui
```

---

## 🔧 Comandos para Criar via MCP

Após ter o repositório Git configurado, você pode usar:

```javascript
// Exemplo de criação via MCP Render
mcp_render_create_web_service({
  name: "marcbuddy-backend",
  runtime: "node",
  repo: "https://github.com/seu-usuario/marcbuddy-backend.git",
  branch: "main",
  buildCommand: "npm install",
  startCommand: "npm start",
  plan: "starter",
  region: "oregon",
  envVars: [
    { key: "NODE_ENV", value: "production" },
    { key: "PORT", value: "3001" },
    // ... outras variáveis
  ]
})
```

---

## ⚠️ Importante

1. **Repositório Git é obrigatório** - Render não aceita deploy sem Git
2. **Variáveis de ambiente** - Configure todas no painel do Render
3. **Webhook do Stripe** - Após deploy, atualize a URL do webhook no Stripe Dashboard
4. **CORS** - Certifique-se de que `FRONTEND_URL` está correto

---

## 📝 Checklist

- [ ] Repositório Git criado e código commitado
- [ ] Repositório conectado ao Render
- [ ] Variáveis de ambiente configuradas
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`
- [ ] Root directory: `backend` (se aplicável)
- [ ] Webhook do Stripe atualizado com nova URL

---

**Última atualização:** Dezembro 2024
