# Solução: "Connection to pgAdmin server has been lost"

Este erro no pgAdmin geralmente não é um problema do PostgreSQL, mas sim do próprio pgAdmin. Aqui estão as soluções:

## ✅ Soluções Rápidas

### 1. Reiniciar o pgAdmin
- Feche completamente o pgAdmin
- Abra novamente o pgAdmin
- Tente conectar novamente

### 2. Verificar se o PostgreSQL está rodando
O PostgreSQL está rodando corretamente (verificado via serviço Windows).

### 3. Verificar a conexão manualmente
Teste a conexão usando o script Node.js que já funciona:

```bash
cd backend
npm run set-admin
```

Se este comando funcionar, significa que o PostgreSQL está OK e o problema é apenas do pgAdmin.

### 4. Recriar a conexão no pgAdmin
1. No pgAdmin, clique com botão direito em "Servers"
2. Selecione "Create" > "Server..."
3. Na aba "General":
   - Name: `MarcBuddy Local` (ou qualquer nome)
4. Na aba "Connection":
   - Host name/address: `localhost`
   - Port: `5432`
   - Maintenance database: `postgres` (ou `marcbuddy_db`)
   - Username: `postgres`
   - Password: (sua senha do PostgreSQL)
5. Clique em "Save"

### 5. Verificar configurações do PostgreSQL
Se ainda não funcionar, verifique o arquivo `pg_hba.conf`:

**Localização no Windows:**
```
C:\Program Files\PostgreSQL\18\data\pg_hba.conf
```

**Adicione ou verifique esta linha:**
```
host    all             all             127.0.0.1/32            md5
host    all             all             ::1/128                 md5
```

Depois de editar, reinicie o serviço PostgreSQL:
```powershell
Restart-Service postgresql-x64-18
```

### 6. Verificar firewall
O Windows Firewall pode estar bloqueando. Adicione uma exceção para a porta 5432.

### 7. Usar alternativa: psql (linha de comando)
Se o pgAdmin continuar com problemas, use o `psql` diretamente:

```powershell
# Conectar ao banco
psql -U postgres -d marcbuddy_db

# Ou executar o SQL diretamente
psql -U postgres -d marcbuddy_db -c "UPDATE users SET role = 'admin' WHERE email = 'josmarcdesign@gmail.com';"
```

## 🔍 Diagnóstico

### Verificar se o PostgreSQL está escutando na porta correta:
```powershell
netstat -ano | findstr :5432
```

### Verificar logs do PostgreSQL:
**Localização dos logs no Windows:**
```
C:\Program Files\PostgreSQL\18\data\log\
```

## ✅ Solução Alternativa: Usar o Script Node.js

Como o script `npm run set-admin` já funcionou, você pode usar isso para administrar o banco sem precisar do pgAdmin:

1. **Tornar usuário admin:**
   ```bash
   cd backend
   npm run set-admin
   ```

2. **Criar/atualizar tabelas:**
   ```bash
   npm run migrate
   ```

3. **Executar SQL customizado:**
   Crie scripts em `backend/scripts/` e execute com `node scripts/nome-do-script.js`

## 📝 Nota Importante

O erro "Connection to pgAdmin server has been lost" é um problema comum do pgAdmin, especialmente após atualizações ou quando há muitas conexões abertas. O PostgreSQL em si está funcionando corretamente, como comprovado pelo sucesso do script `set-admin`.

Se precisar de acesso visual ao banco, considere usar:
- **DBeaver** (alternativa gratuita ao pgAdmin)
- **TablePlus** (interface moderna)
- **psql** (linha de comando nativa)

