# 🌐 Configurar Domínio no Ambiente de Desenvolvimento

Este guia explica como configurar um domínio customizado para acessar o ambiente de desenvolvimento local.

---

## 📋 Opções Disponíveis

### **Opção 1: Domínio Local (Recomendado para Dev)**

Use um domínio local como `dev.marcbuddy.local` ou `marcbuddy.test` que aponta para `localhost`.

#### **Passo 1: Configurar o arquivo hosts do Windows**

1. Abra o **Bloco de Notas** (ou outro editor de texto) **como Administrador**
2. Navegue até: `C:\Windows\System32\drivers\etc\`
3. Abra o arquivo `hosts` (sem extensão)
4. Adicione a seguinte linha no final do arquivo:

```
127.0.0.1    dev.marcbuddy.local
127.0.0.1    api.marcbuddy.local
```

5. Salve o arquivo

**⚠️ Nota:** Se não conseguir salvar, certifique-se de que abriu o Bloco de Notas como Administrador.

#### **Passo 2: Configurar o Vite**

O arquivo `vite.config.js` já está configurado para aceitar qualquer host. Se quiser usar um domínio específico, edite:

```javascript
server: {
  port: 3000,
  host: 'dev.marcbuddy.local', // Descomente e use seu domínio
  // ...
}
```

#### **Passo 3: Configurar o Backend (se necessário)**

No arquivo `.env` do backend, atualize:

```env
FRONTEND_URL=http://dev.marcbuddy.local:3000
```

#### **Passo 4: Acessar**

Acesse: `http://dev.marcbuddy.local:3000`

---

### **Opção 2: Acesso por IP da Rede Local**

Permite acessar o servidor de desenvolvimento de outros dispositivos na mesma rede.

#### **Configuração:**

1. O Vite já está configurado com `host: true`
2. Inicie o servidor normalmente:
   ```bash
   cd frontend
   npm run dev
   ```
3. Acesse de qualquer dispositivo na mesma rede usando:
   - `http://[SEU-IP-LOCAL]:3000`
   - Exemplo: `http://192.168.1.100:3000`

**Para descobrir seu IP local (Windows):**
```powershell
ipconfig
```
Procure por "IPv4 Address" na seção da sua conexão de rede.

---

### **Opção 3: Domínio Público Temporário (ngrok)**

Use ferramentas como **ngrok** para expor seu servidor local através de um domínio público temporário.

#### **Instalação do ngrok:**

1. Baixe em: https://ngrok.com/download
2. Extraia e adicione ao PATH do sistema

#### **Uso:**

```bash
# Terminal 1: Inicie o servidor normalmente
cd frontend
npm run dev

# Terminal 2: Exponha através do ngrok
ngrok http 3000
```

O ngrok fornecerá uma URL pública temporária como: `https://abc123.ngrok.io`

**⚠️ Limitações:**
- URLs gratuitas são temporárias (mudam a cada reinício)
- Pode ter limites de requisições
- Não é recomendado para desenvolvimento diário

---

### **Opção 4: Domínio Real com DNS Local**

Se você tem um domínio real e quer usá-lo localmente:

1. Configure o DNS do seu domínio para apontar para `127.0.0.1` (apenas localmente)
2. Ou use um serviço de DNS local como **Pi-hole** ou **AdGuard Home**
3. Configure o arquivo hosts como na Opção 1

---

## 🔧 Configuração Avançada

### **HTTPS Local (Opcional)**

Para usar HTTPS no desenvolvimento local:

1. **Gerar certificados SSL auto-assinados:**

```bash
# Instalar mkcert (ferramenta para gerar certificados locais)
# Windows: choco install mkcert
# ou baixe de: https://github.com/FiloSottile/mkcert

# Criar certificado local
mkcert -install
mkcert dev.marcbuddy.local
```

2. **Configurar no vite.config.js:**

```javascript
import fs from 'fs';

export default defineConfig({
  server: {
    https: {
      key: fs.readFileSync('./dev.marcbuddy.local-key.pem'),
      cert: fs.readFileSync('./dev.marcbuddy.local.pem'),
    },
    host: 'dev.marcbuddy.local',
    port: 3000,
  },
});
```

3. **Acessar:** `https://dev.marcbuddy.local:3000`

---

## 📝 Exemplo Completo: Configuração com Domínio Local

### **1. Arquivo hosts (`C:\Windows\System32\drivers\etc\hosts`):**
```
127.0.0.1    dev.marcbuddy.local
127.0.0.1    api.marcbuddy.local
```

### **2. Frontend (`frontend/vite.config.js`):**
```javascript
server: {
  port: 3000,
  host: 'dev.marcbuddy.local',
  // ...
}
```

### **3. Backend (`.env`):**
```env
FRONTEND_URL=http://dev.marcbuddy.local:3000
```

### **4. Iniciar:**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### **5. Acessar:**
- Frontend: `http://dev.marcbuddy.local:3000`
- API: `http://api.marcbuddy.local:3001`

---

## ⚠️ Troubleshooting

### **Problema: "Site não pode ser acessado"**

**Solução:**
1. Verifique se o arquivo hosts foi salvo corretamente
2. Certifique-se de que abriu o editor como Administrador
3. Reinicie o navegador ou limpe o cache DNS:
   ```powershell
   ipconfig /flushdns
   ```

### **Problema: "CORS Error"**

**Solução:**
1. Verifique se o `FRONTEND_URL` no backend está correto
2. Certifique-se de que o backend está rodando
3. Verifique as configurações de CORS no `backend/src/server.js`

### **Problema: "Porta já em uso"**

**Solução:**
1. Mude a porta no `vite.config.js`:
   ```javascript
   server: {
     port: 3001, // ou outra porta disponível
   }
   ```
2. Ou mate o processo que está usando a porta:
   ```powershell
   netstat -ano | findstr :3000
   taskkill /PID [PID_NUMBER] /F
   ```

---

## 🎯 Recomendação

Para desenvolvimento diário, use a **Opção 1 (Domínio Local)** com `dev.marcbuddy.local`. É simples, rápido e não requer configurações adicionais após a primeira vez.

---

## 📚 Referências

- [Vite Server Options](https://vitejs.dev/config/server-options.html)
- [Windows Hosts File](https://support.microsoft.com/en-us/topic/how-to-reset-the-hosts-file-back-to-the-default-0b9b3c9c-2a57-41b3-4b82-22c36a8a066b)
- [ngrok Documentation](https://ngrok.com/docs)

