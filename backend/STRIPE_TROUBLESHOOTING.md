# 🔧 Troubleshooting - Erro 500 ao Criar Checkout Stripe

## Problema: Erro 500 ao criar Checkout Session

### Sintomas:
- Erro no console: `POST https://10.0.0.104:3000/api/stripe/create-checkout 500 (Internal Server Error)`
- Erro no terminal: `Proxy error: read ECONNRESET`
- Mensagem: "Erro ao processar pagamento"

---

## ✅ Checklist de Verificação

### 1. Verificar se o Backend está Rodando

```bash
# No diretório backend
cd backend
npm run dev
```

**Verificar:**
- Backend deve estar rodando na porta 3001
- Não deve haver erros no console
- Deve mostrar: `Server running on port 3001`

---

### 2. Verificar Variáveis de Ambiente

Verifique se o arquivo `.env` no diretório `backend` contém:

```env
STRIPE_SECRET_KEY=sk_test_... (ou sk_live_...)
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=http://localhost:3000
```

**Importante:**
- `STRIPE_SECRET_KEY` é **obrigatório**
- A chave deve começar com `sk_test_` (teste) ou `sk_live_` (produção)
- Se a chave não estiver configurada, o backend vai dar erro ao iniciar

---

### 3. Verificar Logs do Backend

Quando você tentar criar o checkout, verifique os logs do backend:

**Logs esperados:**
```
📝 Criando Checkout Session: { subscription_id: X, payment_method: '...', ... }
Criando Checkout Session: { priceId: '...', mode: '...', ... }
✅ Checkout Session criada com sucesso: cs_test_...
```

**Se houver erro:**
```
❌ Erro do Stripe ao criar Checkout Session: { type: '...', code: '...', message: '...' }
```

---

### 4. Verificar Proxy do Vite

O proxy do Vite está configurado em `frontend/vite.config.js`:

```javascript
proxy: {
  '/api': {
    target: httpsConfig ? 'https://localhost:3001' : 'http://localhost:3001',
    changeOrigin: true,
    secure: false,
    ws: true,
  }
}
```

**Verificar:**
- Backend está na porta 3001
- Frontend está na porta 3000
- Proxy está configurado corretamente

---

### 5. Verificar Chave do Stripe

**Teste a chave do Stripe:**

```bash
# No diretório backend
node -e "const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); stripe.prices.list({limit: 1}).then(console.log).catch(console.error)"
```

**Se der erro:**
- Chave inválida ou expirada
- Chave não está no formato correto
- Chave não tem permissões necessárias

---

## 🔍 Erros Comuns e Soluções

### Erro: "ECONNRESET" ou "Proxy error"

**Causa:** Backend não está rodando ou não está acessível

**Solução:**
1. Verificar se o backend está rodando: `cd backend && npm run dev`
2. Verificar se a porta 3001 está livre
3. Reiniciar o backend

---

### Erro: "STRIPE_SECRET_KEY não configurado"

**Causa:** Variável de ambiente não está definida

**Solução:**
1. Verificar arquivo `.env` no diretório `backend`
2. Adicionar: `STRIPE_SECRET_KEY=sk_test_...`
3. Reiniciar o backend

---

### Erro: "PriceId não encontrado para o plano"

**Causa:** Plano não está configurado no Stripe

**Solução:**
1. Verificar `STRIPE_PRICE_IDS` em `backend/src/services/stripe.service.js`
2. Criar preços no Stripe Dashboard
3. Atualizar os IDs no código

---

### Erro: "Invalid API Key provided"

**Causa:** Chave do Stripe inválida

**Solução:**
1. Verificar se a chave está correta no `.env`
2. Verificar se está usando a chave de teste (sk_test_) ou produção (sk_live_)
3. Gerar nova chave no Stripe Dashboard se necessário

---

## 🧪 Teste Manual

### 1. Testar Conexão com Stripe

```bash
# No diretório backend
node -e "
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
stripe.prices.list({limit: 1})
  .then(prices => console.log('✅ Stripe conectado!', prices.data[0]))
  .catch(err => console.error('❌ Erro:', err.message));
"
```

### 2. Testar Criação de Checkout Session

```bash
# No diretório backend
node -e "
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [{
    price: 'price_1SdLs63HuSgjUVZNoHFiM9c3',
    quantity: 1,
  }],
  mode: 'subscription',
  success_url: 'https://example.com/success',
  cancel_url: 'https://example.com/cancel',
})
  .then(session => console.log('✅ Checkout criado!', session.id))
  .catch(err => console.error('❌ Erro:', err.message));
"
```

---

## 📋 Checklist Rápido

- [ ] Backend rodando na porta 3001
- [ ] Frontend rodando na porta 3000
- [ ] `STRIPE_SECRET_KEY` configurado no `.env`
- [ ] Chave do Stripe válida e ativa
- [ ] Price IDs configurados corretamente
- [ ] Sem erros no console do backend
- [ ] Proxy do Vite configurado corretamente

---

## 🆘 Se Nada Funcionar

1. **Verificar logs completos:**
   - Backend: Console onde `npm run dev` está rodando
   - Frontend: Console do navegador (F12)

2. **Testar endpoint diretamente:**
   ```bash
   curl -X POST http://localhost:3001/api/stripe/create-checkout \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer SEU_TOKEN" \
     -d '{"subscription_id": 1, "payment_method": "stripe"}'
   ```

3. **Verificar se o ngrok está causando problemas:**
   - O ngrok é usado apenas para webhooks
   - Não deve afetar a criação de checkout
   - Se estiver usando ngrok, verificar se está ativo

---

**Última atualização:** Dezembro 2024
