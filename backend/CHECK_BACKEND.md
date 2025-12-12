# ✅ Verificação Rápida - Backend

## Problema: ECONNRESET ao criar checkout

Este erro geralmente significa que o **backend caiu** ao processar a requisição.

---

## 🔍 Verificação Rápida

### 1. Backend está rodando?

```bash
# No diretório backend
cd backend
npm run dev
```

**Deve mostrar:**
```
Server running on port 3001
Database connected successfully
```

**Se não mostrar:**
- Verifique se há erros no console
- Verifique se a porta 3001 está livre
- Verifique se o `.env` está configurado

---

### 2. Verificar STRIPE_SECRET_KEY

No arquivo `backend/.env`, verifique:

```env
STRIPE_SECRET_KEY=sk_test_... (ou sk_live_...)
```

**Se não estiver configurado:**
- O backend vai dar erro ao iniciar
- Você verá: `❌ STRIPE_SECRET_KEY não configurado no .env`

---

### 3. Testar Backend Manualmente

Abra um novo terminal e teste:

```bash
# Testar se o backend está respondendo
curl http://localhost:3001/api/health

# Ou no PowerShell:
Invoke-WebRequest -Uri http://localhost:3001/api/health
```

**Se não responder:**
- Backend não está rodando
- Reinicie o backend

---

### 4. Verificar Logs do Backend

Quando você tentar criar o checkout, **olhe o terminal onde o backend está rodando**.

**Logs esperados:**
```
📝 Criando Checkout Session: { subscription_id: X, ... }
Criando Checkout Session: { priceId: '...', ... }
✅ Checkout Session criada com sucesso: cs_test_...
```

**Se houver erro:**
```
❌ Erro do Stripe ao criar Checkout Session: { ... }
❌ Erro ao criar Checkout Session: ...
```

**Se não aparecer NADA:**
- Backend não está recebendo a requisição
- Verifique o proxy do Vite

---

## 🚨 Erro Comum: Backend Cai ao Iniciar

Se o backend der erro ao iniciar, verifique:

1. **STRIPE_SECRET_KEY não configurado:**
   ```
   ❌ STRIPE_SECRET_KEY não configurado no .env
   Error: STRIPE_SECRET_KEY é obrigatório
   ```
   **Solução:** Adicione no `.env`

2. **Chave do Stripe inválida:**
   ```
   Error: Invalid API Key provided
   ```
   **Solução:** Verifique se a chave está correta

3. **Banco de dados não conectado:**
   ```
   Error: connect ECONNREFUSED
   ```
   **Solução:** Verifique a conexão do banco

---

## ✅ Checklist

- [ ] Backend rodando na porta 3001
- [ ] Sem erros no console do backend
- [ ] `STRIPE_SECRET_KEY` configurado no `.env`
- [ ] Backend responde em `http://localhost:3001`
- [ ] Logs aparecem quando você tenta criar checkout

---

**Se tudo estiver OK mas ainda der erro, compartilhe os logs do backend!**
