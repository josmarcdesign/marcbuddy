# ✅ Integração Stripe - Configuração Completa

## Status: Configurado e Pronto para Testes

### ✅ O que foi feito:

1. **Produtos criados no Stripe:**
   - ✅ MBuddy Classic (R$ 29,90/mês) - `prod_TaWvYQm4KHnqVg`
   - ✅ MBuddy Pro (R$ 59,90/mês) - `prod_TaWvZrsMv5clLo`
   - ✅ MBuddy Team (R$ 149,90/mês) - `prod_TaWvwNYqkgi9TJ`

2. **Preços criados no Stripe:**
   - ✅ Classic: `price_1SdLs63HuSgjUVZNoHFiM9c3`
   - ✅ Pro: `price_1SdLsB3HuSgjUVZNn8BXkf3E`
   - ✅ Team: `price_1SdLsF3HuSgjUVZNK4Kwh8xv`

3. **Backend:**
   - ✅ SDK do Stripe instalado
   - ✅ Serviço do Stripe criado (`stripe.service.js`)
   - ✅ Controller do Stripe criado (`stripe.controller.js`)
   - ✅ Rotas do Stripe configuradas (`/api/stripe/create-checkout` e `/api/stripe/webhook`)
   - ✅ Migração V20 executada (coluna `stripe_subscription_id` adicionada)

4. **Variáveis de ambiente:**
   - ✅ `STRIPE_SECRET_KEY` configurada no `.env`
   - ✅ `STRIPE_WEBHOOK_SECRET` configurada no `.env`

5. **Webhook configurado no Stripe:**
   - ✅ URL: `https://seu-ngrok-url.ngrok-free.app/api/stripe/webhook`
   - ✅ Eventos selecionados: checkout.session.completed, customer.subscription.*, invoice.payment.*

---

## 🚀 Próximos Passos

### 1. Reiniciar o servidor backend
```bash
# Pare o servidor atual (Ctrl+C) e reinicie para carregar as novas variáveis
cd backend
npm run dev
```

### 2. Testar a integração

#### Teste 1: Criar Checkout Session
```bash
POST http://localhost:3001/api/stripe/create-checkout
Authorization: Bearer <seu_token>
Body: {
  "subscription_id": 123
}
```

#### Teste 2: Verificar webhook
- No dashboard do Stripe, vá em Webhooks
- Clique no webhook criado
- Use "Send test webhook" para testar eventos

### 3. Atualizar Frontend (Próximo passo)

O frontend ainda precisa ser atualizado para usar o Stripe Checkout. Atualmente ele usa o sistema PIX manual.

**Arquivos que precisam ser atualizados:**
- `frontend/src/pages/Checkout.jsx` - Adicionar opção de Stripe Checkout
- `frontend/src/pages/Payment.jsx` - Integrar com Stripe
- `frontend/src/services/subscription.service.js` - Adicionar função para criar checkout

---

## 📋 Endpoints Disponíveis

### Criar Checkout Session
```
POST /api/stripe/create-checkout
Authorization: Bearer <token>
Body: {
  "subscription_id": <id_da_assinatura>
}

Resposta:
{
  "success": true,
  "data": {
    "sessionId": "cs_test_...",
    "url": "https://checkout.stripe.com/..."
  }
}
```

### Webhook (Stripe)
```
POST /api/stripe/webhook
Headers: {
  "stripe-signature": "..."
}
Body: <raw JSON do Stripe>
```

---

## 🔍 Verificações

- ✅ Backend rodando na porta 3001
- ✅ Ngrok rodando e apontando para porta 3001
- ✅ Webhook configurado no Stripe com URL do ngrok
- ✅ Variáveis de ambiente configuradas
- ⏳ Frontend precisa ser atualizado para usar Stripe

---

## 🐛 Troubleshooting

### Erro: "STRIPE_SECRET_KEY não configurado"
- Verifique se o arquivo `.env` tem a chave
- Reinicie o servidor backend

### Erro: "Webhook signature verification failed"
- Verifique se `STRIPE_WEBHOOK_SECRET` está correto
- Certifique-se de que está usando o Signing secret do webhook correto

### Webhook não recebe eventos
- Verifique se o ngrok está rodando
- Verifique se a URL do webhook no Stripe está correta
- Verifique os logs do backend para erros

---

**Status:** Backend pronto ✅ | Frontend pendente ⏳
