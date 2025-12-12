# 🔗 Conectar Frontend Local ao Backend do Render

## ✅ Configuração Atual

- ✅ Backend no Render: https://marcbuddy-backend.onrender.com
- ✅ CORS configurado para aceitar `localhost:3000`
- ✅ Frontend local pode se conectar ao backend remoto

---

## 🚀 Como Usar

### Opção 1: Usar Proxy do Vite (Recomendado)

O Vite já está configurado com proxy. Basta atualizar a URL do backend:

1. **Edite `frontend/vite.config.js`**:

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://marcbuddy-backend.onrender.com',
        changeOrigin: true,
        secure: true,
      }
    }
  }
})
```

2. **Inicie o frontend**:

```bash
cd frontend
npm run dev
```

3. **Acesse**: http://localhost:3000

O frontend vai fazer requisições para `/api/*` que serão automaticamente redirecionadas para `https://marcbuddy-backend.onrender.com/api/*`.

---

### Opção 2: Configurar Variável de Ambiente

1. **Crie/edite `frontend/.env.local`**:

```env
VITE_API_URL=https://marcbuddy-backend.onrender.com
```

2. **Atualize `frontend/src/services/api.js`**:

```javascript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://marcbuddy-backend.onrender.com';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

3. **Inicie o frontend**:

```bash
cd frontend
npm run dev
```

---

## 🔧 Verificar Configuração

### Testar Conexão

1. Inicie o frontend: `cd frontend && npm run dev`
2. Abra o navegador: http://localhost:3000
3. Abra o DevTools (F12) → Network
4. Tente fazer login ou acessar qualquer página
5. Verifique se as requisições estão indo para `marcbuddy-backend.onrender.com`

### Verificar CORS

Se houver erro de CORS:

1. Verifique se `FRONTEND_URL` no Render está como `http://localhost:3000`
2. Verifique os logs do backend no Render
3. O backend já está configurado para aceitar localhost automaticamente

---

## 📝 Checklist

- [x] Backend deployado no Render
- [x] CORS configurado para localhost
- [x] FRONTEND_URL atualizado no Render
- [ ] Frontend configurado para usar backend do Render
- [ ] Teste de conexão realizado

---

## 🐛 Troubleshooting

### Erro: "CORS policy blocked"

**Solução**: 
- Verifique se `FRONTEND_URL` no Render está como `http://localhost:3000`
- O backend já aceita localhost automaticamente, mas a variável ajuda

### Erro: "Network Error" ou "Connection refused"

**Solução**:
- Verifique se o backend está rodando: https://marcbuddy-backend.onrender.com/api/health
- Verifique a URL no `vite.config.js` ou `.env.local`
- Verifique se não há firewall bloqueando

### Requisições não estão indo para o Render

**Solução**:
- Verifique o `vite.config.js` se estiver usando proxy
- Verifique o `api.js` se estiver usando variável de ambiente
- Verifique o console do navegador para erros

---

## 🔗 Links Úteis

- **Backend API**: https://marcbuddy-backend.onrender.com
- **Health Check**: https://marcbuddy-backend.onrender.com/api/health
- **Dashboard Render**: https://dashboard.render.com/web/srv-d4tq98uuk2gs73c4m5bg

---

**Última atualização:** Dezembro 2024
