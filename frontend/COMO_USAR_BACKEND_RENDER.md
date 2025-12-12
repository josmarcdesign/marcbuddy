# 🚀 Usar Frontend Local com Backend do Render

## ✅ Configuração Completa

O frontend já está configurado para usar o backend do Render automaticamente!

---

## 🎯 Como Usar

### 1. Iniciar o Frontend

```bash
cd frontend
npm run dev
```

### 2. Acessar

Abra o navegador em: **http://localhost:3000**

### 3. Pronto! 🎉

O frontend vai automaticamente fazer requisições para:
- **Backend**: `https://marcbuddy-backend.onrender.com/api/*`

---

## 🔧 Como Funciona

O `vite.config.js` está configurado com um **proxy** que:

1. Intercepta todas as requisições para `/api/*`
2. Redireciona automaticamente para `https://marcbuddy-backend.onrender.com/api/*`
3. Mantém os cookies e headers de autenticação

---

## 🔄 Alternar Entre Backend Local e Render

### Usar Backend do Render (Padrão)

Não precisa fazer nada! Já está configurado.

### Usar Backend Local

Se quiser usar o backend local (localhost:3001):

1. **Crie `frontend/.env.local`**:

```env
VITE_API_URL=http://localhost:3001
```

2. **Reinicie o servidor do frontend**:

```bash
# Pare o servidor (Ctrl+C)
npm run dev
```

---

## ✅ Verificar se Está Funcionando

1. Inicie o frontend: `cd frontend && npm run dev`
2. Abra o navegador: http://localhost:3000
3. Abra o DevTools (F12) → **Network**
4. Tente fazer login ou acessar qualquer página
5. Verifique se as requisições estão indo para `marcbuddy-backend.onrender.com`

---

## 🐛 Troubleshooting

### Erro: "CORS policy blocked"

**Solução**: 
- O backend já está configurado para aceitar `localhost:3000`
- Verifique se `FRONTEND_URL` no Render está como `http://localhost:3000`
- O backend aceita localhost automaticamente

### Erro: "Network Error"

**Solução**:
- Verifique se o backend está rodando: https://marcbuddy-backend.onrender.com/api/health
- Verifique sua conexão com a internet
- Verifique o console do navegador para mais detalhes

### Requisições não estão indo para o Render

**Solução**:
- Verifique o `vite.config.js` - deve ter `target: 'https://marcbuddy-backend.onrender.com'`
- Reinicie o servidor do frontend
- Limpe o cache do navegador (Ctrl+Shift+R)

---

## 📝 Resumo

- ✅ **Frontend local**: http://localhost:3000
- ✅ **Backend remoto**: https://marcbuddy-backend.onrender.com
- ✅ **CORS configurado**: Backend aceita requisições do localhost
- ✅ **Proxy configurado**: Vite redireciona `/api/*` automaticamente

---

## 🔗 Links Úteis

- **Backend API**: https://marcbuddy-backend.onrender.com
- **Health Check**: https://marcbuddy-backend.onrender.com/api/health
- **Dashboard Render**: https://dashboard.render.com/web/srv-d4tq98uuk2gs73c4m5bg

---

**Última atualização:** Dezembro 2024
