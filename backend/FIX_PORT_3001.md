# 🔧 Corrigir Erro: Porta 3001 já em uso

## Problema
```
Error: listen EADDRINUSE: address already in use 0.0.0.0:3001
```

Isso significa que **outro processo está usando a porta 3001**.

---

## ✅ Solução Rápida (Windows PowerShell)

### 1. Encontrar o processo usando a porta 3001:

```powershell
netstat -ano | findstr :3001
```

Isso vai mostrar algo como:
```
TCP    0.0.0.0:3001           0.0.0.0:0              LISTENING       12345
```

O último número (12345) é o **PID** do processo.

### 2. Encerrar o processo:

```powershell
taskkill /PID 12345 /F
```

Substitua `12345` pelo PID que você encontrou.

---

## ✅ Solução Alternativa (Mais Fácil)

### Opção 1: Reiniciar o Terminal
1. Feche o terminal onde o backend está rodando
2. Abra um novo terminal
3. Execute: `cd backend && npm run dev`

### Opção 2: Usar outra porta temporariamente
No arquivo `backend/.env`, mude:
```env
PORT=3002
```

E no `frontend/vite.config.js`, mude o proxy:
```javascript
target: httpsConfig ? 'https://localhost:3002' : 'http://localhost:3002',
```

---

## ✅ Solução Completa (Recomendada)

### 1. Encontrar e encerrar TODOS os processos Node.js:

```powershell
# Ver todos os processos Node
Get-Process node -ErrorAction SilentlyContinue

# Encerrar todos os processos Node (CUIDADO!)
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
```

### 2. Verificar se a porta está livre:

```powershell
netstat -ano | findstr :3001
```

Se não mostrar nada, a porta está livre.

### 3. Reiniciar o backend:

```powershell
cd backend
npm run dev
```

---

## 🔍 Verificar se Funcionou

Após encerrar o processo, você deve ver:

```
Server running on port 3001
Database connected successfully
```

Se ainda der erro, tente:
1. Reiniciar o computador (último recurso)
2. Usar outra porta (3002, 3003, etc.)

---

## ⚠️ Dica

Se isso acontecer frequentemente, pode ser que:
- Você tenha múltiplos terminais rodando o backend
- O nodemon não está encerrando processos antigos
- Há um processo "fantasma" rodando em background

**Solução:** Sempre verifique se não há outros processos Node rodando antes de iniciar o backend.
