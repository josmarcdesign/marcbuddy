# 🚀 Comandos Essenciais do Terminal - MarcBuddy

Guia rápido de comandos para desenvolvimento e produção.

---

## 📦 Instalação Inicial

### Instalar dependências do Frontend
```bash
cd frontend
npm install
```

### Instalar dependências do Backend
```bash
cd backend
npm install
```

### Instalar dependências de ambos (raiz do projeto)
```bash
# Frontend
cd frontend && npm install && cd ..

# Backend
cd backend && npm install && cd ..
```

---

## 🎨 Frontend (React + Vite)

### Desenvolvimento
```bash
cd frontend
npm run dev
```
**Acessa em:** `http://localhost:3000`

### Desenvolvimento com acesso externo (--host)
```bash
cd frontend
npm run dev -- --host
```
**Acessa em:** `http://localhost:3000` e `http://[seu-ip]:3000`

### Desenvolvimento com porta customizada
```bash
cd frontend
npm run dev -- --port 3001
```

### Build para produção
```bash
cd frontend
npm run build
```
**Gera pasta:** `frontend/dist/`

### Preview do build de produção
```bash
cd frontend
npm run preview
```

### Preview com acesso externo
```bash
cd frontend
npm run preview -- --host
```

---

## ⚙️ Backend (Node.js + Express)

### Desenvolvimento (com nodemon - auto-reload)
```bash
cd backend
npm run dev
```
**Acessa em:** `http://localhost:3001`

### Produção
```bash
cd backend
npm start
```

### Executar migrações do banco de dados
```bash
cd backend
npm run migrate
```

---

## 🗄️ Banco de Dados (PostgreSQL)

### Conectar ao PostgreSQL (Windows)
```bash
psql -U postgres -d marcbuddy_db
```

### Conectar ao PostgreSQL (Linux/Mac)
```bash
sudo -u postgres psql -d marcbuddy_db
```

### Listar bancos de dados
```bash
psql -U postgres -l
```

### Criar banco de dados
```bash
psql -U postgres -c "CREATE DATABASE marcbuddy_db;"
```

### Dropar banco de dados (cuidado!)
```bash
psql -U postgres -c "DROP DATABASE marcbuddy_db;"
```

### Backup do banco
```bash
pg_dump -U postgres marcbuddy_db > backup.sql
```

### Restaurar backup
```bash
psql -U postgres marcbuddy_db < backup.sql
```

---

## 🔄 Comandos Úteis

### Limpar node_modules e reinstalar
```bash
# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install

# Backend
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Verificar versão do Node.js
```bash
node --version
# ou
node -v
```

### Verificar versão do npm
```bash
npm --version
# ou
npm -v
```

### Atualizar npm
```bash
npm install -g npm@latest
```

### Ver processos rodando na porta
```bash
# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# Linux/Mac
lsof -i :3000
lsof -i :3001
```

### Matar processo na porta (Windows)
```bash
# Encontrar PID primeiro
netstat -ano | findstr :3000

# Matar processo (substitua PID pelo número encontrado)
taskkill /PID [PID] /F
```

### Matar processo na porta (Linux/Mac)
```bash
# Encontrar PID primeiro
lsof -i :3000

# Matar processo (substitua PID pelo número encontrado)
kill -9 [PID]
```

---

## 🚀 Iniciar Projeto Completo

### Terminal 1 - Frontend
```bash
cd frontend
npm run dev -- --host
```

### Terminal 2 - Backend
```bash
cd backend
npm run dev
```

### Terminal 3 - Banco de Dados (se necessário)
```bash
# Verificar se PostgreSQL está rodando
# Windows
net start postgresql-x64-[versão]

# Linux/Mac
sudo systemctl start postgresql
```

---

## 📝 Variáveis de Ambiente

### Criar arquivo .env no Backend
```bash
cd backend
cp env.example.txt .env
```

### Editar arquivo .env
```bash
# Windows
notepad .env

# Linux/Mac
nano .env
# ou
vim .env
```

---

## 🧹 Limpeza e Manutenção

### Limpar cache do npm
```bash
npm cache clean --force
```

### Atualizar dependências
```bash
# Frontend
cd frontend
npm update

# Backend
cd backend
npm update
```

### Verificar dependências desatualizadas
```bash
# Frontend
cd frontend
npm outdated

# Backend
cd backend
npm outdated
```

### Verificar vulnerabilidades
```bash
# Frontend
cd frontend
npm audit

# Backend
cd backend
npm audit
```

### Corrigir vulnerabilidades automaticamente
```bash
# Frontend
cd frontend
npm audit fix

# Backend
cd backend
npm audit fix
```

---

## 🐛 Debug e Logs

### Ver logs do Backend em tempo real
```bash
cd backend
npm run dev
# Os logs aparecem no console
```

### Verificar se o servidor está rodando
```bash
# Frontend
curl http://localhost:3000

# Backend
curl http://localhost:3001/api/health
```

---

## 📦 Build e Deploy

### Build completo para produção
```bash
# Frontend
cd frontend
npm run build

# Backend (não precisa de build, mas pode otimizar)
cd backend
npm install --production
```

### Testar build localmente
```bash
# Frontend
cd frontend
npm run build
npm run preview

# Backend
cd backend
npm start
```

---

## 🔧 Comandos Git Úteis (Opcional)

### Status do repositório
```bash
git status
```

### Adicionar arquivos
```bash
git add .
```

### Commit
```bash
git commit -m "Mensagem do commit"
```

### Push
```bash
git push
```

### Pull
```bash
git pull
```

---

## 📌 Atalhos Rápidos

### Iniciar tudo de uma vez (PowerShell/Windows)
```powershell
# Terminal 1
cd frontend; npm run dev -- --host

# Terminal 2 (nova janela)
cd backend; npm run dev
```

### Iniciar tudo de uma vez (Bash/Linux/Mac)
```bash
# Terminal 1
cd frontend && npm run dev -- --host

# Terminal 2 (nova aba)
cd backend && npm run dev
```

---

## ⚠️ Troubleshooting

### Porta já em uso
```bash
# Encontrar e matar processo (veja seção "Ver processos rodando na porta")
```

### Erro de permissão (Linux/Mac)
```bash
sudo chown -R $USER:$USER node_modules
```

### Erro de módulo não encontrado
```bash
# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

### PostgreSQL não conecta
```bash
# Verificar se está rodando
# Windows
net start postgresql-x64-[versão]

# Linux/Mac
sudo systemctl status postgresql
```

---

## 📚 Recursos Adicionais

- **Frontend:** React 18 + Vite
- **Backend:** Node.js + Express
- **Banco:** PostgreSQL
- **Porta Frontend:** 3000 (padrão)
- **Porta Backend:** 3001 (padrão)

---

**Última atualização:** 2025-01-XX

