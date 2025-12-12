# ✅ Verificação Completa do Backend

## Status Atual
- ✅ Porta 3001 liberada (processo anterior encerrado)
- ❌ Erro `ECONNRESET` ainda ocorre ao criar checkout

---

## 🔍 Verificações Necessárias

### 1. Backend está rodando?

**No terminal do backend, você deve ver:**
```
Server running on port 3001
Database connected successfully
```

**Se não aparecer:**
- O backend não está rodando
- Execute: `cd backend && npm run dev`

---

### 2. Backend está recebendo requisições?

Quando você tenta criar o checkout, **olhe o terminal do backend**.

**Deve aparecer:**
```
📝 Criando Checkout Session: { subscription_id: X, ... }
Criando Checkout Session: { priceId: '...', ... }
```

**Se NÃO aparecer NADA:**
- O backend não está recebendo a requisição
- Problema no proxy do Vite
- Backend não está rodando

**Se aparecer ERRO:**
- Os logs mostrarão o problema exato
- Compartilhe os logs do backend

---

### 3. Verificar STRIPE_SECRET_KEY

No arquivo `backend/.env`:

```env
STRIPE_SECRET_KEY=sk_test_... (ou sk_live_...)
```

**Se não estiver configurado:**
- O backend vai dar erro ao iniciar
- Você verá: `❌ STRIPE_SECRET_KEY não configurado no .env`

---

### 4. Testar Backend Diretamente

Abra um novo terminal e teste:

```powershell
# Testar se o backend responde
Invoke-WebRequest -Uri http://localhost:3001/api/health -Method GET
```

**Se não responder:**
- Backend não está rodando
- Ou está rodando em outra porta

---

### 5. Verificar Logs do Backend ao Criar Checkout

**Quando você tentar criar o checkout, o terminal do backend DEVE mostrar:**

✅ **Sucesso:**
```
📝 Criando Checkout Session: { ... }
Criando Checkout Session: { ... }
✅ Checkout Session criada com sucesso: cs_test_...
```

❌ **Erro:**
```
📝 Criando Checkout Session: { ... }
❌ Erro do Stripe ao criar Checkout Session: { ... }
```

❌ **Backend não recebeu:**
```
(nada aparece)
```

---

## 🚨 Problemas Comuns

### Problema 1: Backend não está rodando
**Sintoma:** Nada aparece no terminal do backend quando você tenta criar checkout

**Solução:**
```bash
cd backend
npm run dev
```

---

### Problema 2: Backend cai ao processar
**Sintoma:** Backend recebe a requisição mas dá erro e cai

**Solução:**
- Verifique os logs do backend
- Verifique se `STRIPE_SECRET_KEY` está configurado
- Verifique se o banco de dados está conectado

---

### Problema 3: Proxy do Vite não está funcionando
**Sintoma:** Frontend não consegue se conectar ao backend

**Solução:**
- Verifique `frontend/vite.config.js`
- Verifique se o backend está na porta 3001
- Tente acessar diretamente: `http://localhost:3001/api/health`

---

## 📋 Checklist Final

Antes de reportar o problema, verifique:

- [ ] Backend está rodando (terminal mostra "Server running")
- [ ] Backend está na porta 3001
- [ ] `STRIPE_SECRET_KEY` está configurado no `.env`
- [ ] Banco de dados está conectado
- [ ] Logs aparecem no backend quando você tenta criar checkout
- [ ] Backend responde em `http://localhost:3001`

---

## 🆘 Se Nada Funcionar

1. **Compartilhe os logs do backend:**
   - Copie tudo que aparece no terminal do backend
   - Especialmente quando você tenta criar o checkout

2. **Teste o backend diretamente:**
   ```powershell
   Invoke-WebRequest -Uri http://localhost:3001/api/health
   ```

3. **Verifique se há erros ao iniciar:**
   - Olhe o terminal do backend ao iniciar
   - Procure por mensagens de erro

---

**A causa mais comum do erro `ECONNRESET` é que o backend não está rodando ou está caindo ao processar a requisição.**
