# 🚀 Setup Manual do Backend no Render

## ✅ Status Atual

- ✅ GitHub conectado ao Render
- ✅ Repositório `marcbuddy` encontrado no dashboard
- ✅ Repositório privado configurado
- ⚠️ MCP não consegue criar (limitação com repositórios privados)

---

## 📋 Passo a Passo para Criar Manualmente

### 1. Acessar o Dashboard

1. Vá para: https://dashboard.render.com/new/web-service
2. Clique em **"Connect account"** se necessário
3. Selecione o repositório: **`josmarcdesign/marcbuddy`**

### 2. Configurar o Serviço

Preencha os campos:

| Campo | Valor |
|-------|-------|
| **Name** | `marcbuddy-backend` |
| **Region** | `Oregon` (ou sua preferência) |
| **Branch** | `main` |
| **Root Directory** | `backend` ⚠️ **IMPORTANTE** |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Plan** | `Starter` (ou superior) |
| **Auto-Deploy** | `Yes` |

### 3. Configurar Variáveis de Ambiente

Na seção **"Environment Variables"**, adicione:

```env
NODE_ENV=production
PORT=3001
SUPABASE_DB_CONNECTION_STRING=postgresql://postgres.umydjofqoknbggwtwtqv:GkJWkn13oFT9vd1C@aws-0-us-east-1.pooler.supabase.com:6543/postgres
SUPABASE_URL=https://umydjofqoknbggwtwtqv.supabase.co
SUPABASE_SERVICE_KEY=sb_secret_qxkUBDDgozx5sIEvTr28TA_aP1j_bLu
JWT_SECRET=sua_chave_jwt_super_segura_aqui_MUDE_EM_PRODUCAO
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

**⚠️ IMPORTANTE**: 
- Altere `JWT_SECRET` para uma chave segura e única em produção!
- Gere uma chave forte: `openssl rand -base64 32`

### 4. Variáveis Opcionais (se usar)

Se você usar Stripe ou PIX, adicione também:

```env
STRIPE_SECRET_KEY=sk_live_sua_chave_aqui
STRIPE_WEBHOOK_SECRET=whsec_sua_chave_webhook_aqui
PIX_KEY=sua-chave-pix@exemplo.com
```

### 5. Criar o Serviço

1. Clique em **"Create Web Service"**
2. Aguarde o primeiro deploy (pode levar alguns minutos)

---

## 🔍 Verificar o Deploy

### 1. Logs do Deploy

Após criar, você verá os logs do build. Verifique se:
- ✅ `npm install` executou com sucesso
- ✅ `npm start` iniciou o servidor
- ✅ Sem erros de conexão com o banco

### 2. Testar a API

Após o deploy, teste:

```bash
# Health check
curl https://marcbuddy-backend.onrender.com/api/health

# Ou acesse no navegador
https://marcbuddy-backend.onrender.com/api/health
```

### 3. Verificar Logs em Tempo Real

No dashboard do Render:
1. Vá para o serviço `marcbuddy-backend`
2. Clique em **"Logs"**
3. Monitore erros e avisos

---

## 🔄 Após o Deploy Bem-Sucedido

### 1. Atualizar Webhook do Stripe

1. Acesse: https://dashboard.stripe.com/webhooks
2. Adicione/atualize o webhook:
   - **URL**: `https://marcbuddy-backend.onrender.com/api/stripe/webhook`
   - **Events**: Selecione os eventos necessários

### 2. Atualizar FRONTEND_URL

Quando o frontend estiver deployado:
1. Vá em **Environment** no serviço `marcbuddy-backend`
2. Atualize `FRONTEND_URL` para a URL do frontend em produção
3. Salve e aguarde o redeploy automático

### 3. Configurar Domínio Customizado (Opcional)

1. No dashboard do serviço, vá em **Settings**
2. Em **Custom Domains**, adicione seu domínio
3. Configure o DNS conforme instruções

---

## 🐛 Troubleshooting

### Erro: "Cannot find module"

**Causa**: Root Directory incorreto ou dependências não instaladas

**Solução**: 
- Verifique se **Root Directory** está como `backend`
- Verifique se `package.json` está na pasta `backend`

### Erro: "Connection refused" ou "Database error"

**Causa**: Variáveis de ambiente incorretas ou banco inacessível

**Solução**:
- Verifique `SUPABASE_DB_CONNECTION_STRING`
- Teste a connection string localmente
- Verifique se o Supabase permite conexões externas

### Erro: "Port already in use"

**Causa**: Render define a porta automaticamente via `PORT`

**Solução**: 
- Remova `PORT=3001` das variáveis de ambiente
- O Render define automaticamente via `process.env.PORT`

### Build falha

**Causa**: Dependências ou scripts incorretos

**Solução**:
- Verifique os logs do build
- Teste `npm install` localmente
- Verifique se `package.json` está correto

---

## 📝 Checklist Final

- [ ] Serviço criado no Render
- [ ] Root Directory: `backend` configurado
- [ ] Variáveis de ambiente adicionadas
- [ ] `JWT_SECRET` alterado para chave segura
- [ ] Deploy concluído com sucesso
- [ ] Health check funcionando
- [ ] Webhook do Stripe atualizado (se usar)
- [ ] `FRONTEND_URL` atualizado após deploy do frontend

---

## 🔗 Links Úteis

- Dashboard Render: https://dashboard.render.com
- Documentação Render: https://render.com/docs
- Logs do Serviço: https://dashboard.render.com/web/marcbuddy-backend/logs

---

**Última atualização:** Dezembro 2024

