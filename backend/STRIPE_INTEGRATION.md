# Integração Stripe - MarcBuddy

## ✅ Implementação Completa

### Arquivos Criados/Modificados

1. **`backend/src/services/stripe.service.js`**
   - Serviço principal do Stripe
   - Funções para criar Checkout Sessions
   - Mapeamento de planos para preços do Stripe
   - Funções auxiliares para webhooks

2. **`backend/src/controllers/stripe.controller.js`**
   - Controller para criar Checkout Sessions
   - Handler de webhooks do Stripe
   - Processamento de eventos (checkout, subscription, invoice)

3. **`backend/src/routes/stripe.routes.js`**
   - Rota POST `/api/stripe/create-checkout` (autenticada)
   - Rota POST `/api/stripe/webhook` (não autenticada, usa assinatura Stripe)

4. **`backend/src/database/migrate-v20-stripe.js`**
   - Migração para adicionar coluna `stripe_subscription_id`

### Configuração Necessária

Adicione as seguintes variáveis no arquivo `.env`:

```env
# Configurações do Stripe
STRIPE_SECRET_KEY=sk_live_sua_chave_secreta_aqui
STRIPE_WEBHOOK_SECRET=whsec_sua_chave_webhook_aqui
```

**Onde encontrar:**
- **STRIPE_SECRET_KEY**: Dashboard Stripe → Developers → API keys → Secret key
- **STRIPE_WEBHOOK_SECRET**: Dashboard Stripe → Developers → Webhooks → Adicionar endpoint → Copiar "Signing secret"

### Produtos Criados no Stripe

| Plano | Product ID | Price ID | Valor |
|-------|------------|----------|-------|
| MBuddy Classic | `prod_TaWvYQm4KHnqVg` | `price_1SdLs63HuSgjUVZNoHFiM9c3` | R$ 29,90/mês |
| MBuddy Pro | `prod_TaWvZrsMv5clLo` | `price_1SdLsB3HuSgjUVZNn8BXkf3E` | R$ 59,90/mês |
| MBuddy Team | `prod_TaWvwNYqkgi9TJ` | `price_1SdLsF3HuSgjUVZNK4Kwh8xv` | R$ 149,90/mês |

### Endpoints Disponíveis

#### 1. Criar Checkout Session
```
POST /api/stripe/create-checkout
Authorization: Bearer <token>
Body: {
  "subscription_id": 123
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Checkout Session criada com sucesso",
  "data": {
    "sessionId": "cs_test_...",
    "url": "https://checkout.stripe.com/..."
  }
}
```

#### 2. Webhook do Stripe
```
POST /api/stripe/webhook
Headers: {
  "stripe-signature": "..."
}
Body: <raw JSON do Stripe>
```

**Eventos processados:**
- `checkout.session.completed` - Ativa assinatura após pagamento
- `customer.subscription.created` - Cria assinatura
- `customer.subscription.updated` - Atualiza status da assinatura
- `customer.subscription.deleted` - Cancela assinatura
- `invoice.payment_succeeded` - Renovação automática
- `invoice.payment_failed` - Falha no pagamento

### Fluxo de Pagamento

1. **Usuário escolhe plano** → Cria assinatura (status: `pending`)
2. **Frontend chama** `/api/stripe/create-checkout` com `subscription_id`
3. **Backend retorna** URL do Checkout do Stripe
4. **Usuário é redirecionado** para o Checkout do Stripe
5. **Usuário paga** no Checkout do Stripe
6. **Stripe envia webhook** `checkout.session.completed`
7. **Backend processa webhook** → Ativa assinatura automaticamente
8. **Usuário é redirecionado** para `/dashboard?session_id=...`

### Configurar Webhook no Stripe

1. Acesse: https://dashboard.stripe.com/webhooks
2. Clique em "Add endpoint"
3. URL do endpoint: `https://seu-dominio.com/api/stripe/webhook`
4. Selecione os eventos:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copie o "Signing secret" e adicione no `.env` como `STRIPE_WEBHOOK_SECRET`

### Executar Migração

```bash
cd backend
npm run migrate:v20
```

### Próximos Passos

1. ✅ Configurar variáveis de ambiente
2. ✅ Executar migração V20
3. ⏳ Configurar webhook no dashboard do Stripe
4. ⏳ Atualizar frontend para usar Stripe Checkout
5. ⏳ Testar fluxo completo

### Testes

**Modo Teste (Stripe Test Mode):**
- Use chaves de teste (`sk_test_...`)
- Use cartão de teste: `4242 4242 4242 4242`
- Data de validade: qualquer data futura
- CVC: qualquer 3 dígitos

**Modo Produção:**
- Use chaves de produção (`sk_live_...`)
- Webhook deve estar configurado com URL pública
- Use certificado SSL válido
