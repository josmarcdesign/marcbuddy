# ✅ CONCLUÍDO - Como Criar o Banco de Dados Local - MarcBuddy

> **Status**: ✅ Concluído  
> **Data**: Fase 1 - Setup Inicial  
> **Ordem**: 02

Guia rápido passo a passo para criar o banco de dados PostgreSQL local.

## 🌍 Sobre o Locale "Portuguese, Brazil"

Durante a instalação do PostgreSQL, você configurou o locale como **"Portuguese, Brazil"**. Isso significa que:

- ✅ **Datas** serão formatadas no padrão brasileiro (DD/MM/YYYY)
- ✅ **Números** usarão vírgula como separador decimal (ex: 1.234,56)
- ✅ **Ordenação de textos** seguirá regras do português brasileiro
- ✅ **Compatibilidade** perfeita com dados em português

O banco `marcbuddy_db` herdará automaticamente essas configurações do cluster PostgreSQL, garantindo formatação adequada para o projeto MarcBuddy.

## 🚀 Método 1: Usando pgAdmin (Interface Gráfica) - Mais Fácil

### Passo 1: Abrir pgAdmin

1. Abra o **pgAdmin** (procure no menu Iniciar do Windows)
2. Na primeira vez, o pgAdmin pode pedir uma senha mestra para proteger suas conexões salvas
   - Você pode criar uma senha ou clicar em **Cancel** para pular
3. No painel esquerdo, expanda **Servers** → **PostgreSQL XX** (sua versão, ex: PostgreSQL 18)
4. Se solicitado, digite a senha do usuário `postgres` que você criou durante a instalação

### Passo 2: Criar o Banco de Dados

1. No painel esquerdo, clique com botão direito em **Databases**
2. Selecione **Create** → **Database...**
3. Uma janela "Create - Database" será aberta

### Passo 3: Configurar o Banco (Aba General)

Na janela que abrir, na aba **"General"**:

- **Database**: Digite `marcbuddy_db`
- **OID**: **Deixe vazio** (é gerado automaticamente pelo PostgreSQL)
- **Owner**: Deixe como `postgres` (já vem selecionado por padrão)
- **Comment**: Opcional - pode deixar vazio ou adicionar uma descrição

> **Sobre o OID**: OID significa "Object Identifier" (Identificador de Objeto). É um número único gerado automaticamente pelo PostgreSQL. Você não precisa preencher este campo - o sistema cria automaticamente.

### Passo 4: Outras Abas (Opcional)

Você pode deixar as outras abas com os valores padrão:
- **Definition**: Encoding UTF8 (padrão)
- **Security**: Sem configurações especiais necessárias
- **Parameters**: Valores padrão
- **Advanced**: Valores padrão
- **SQL**: Mostra o SQL que será executado (apenas visualização)

> **Nota**: O banco herdará automaticamente o locale "Portuguese, Brazil" configurado durante a instalação do PostgreSQL, garantindo formatação brasileira para datas, números e textos.

### Passo 5: Salvar

1. Clique no botão **Save** (ícone de disquete, geralmente em azul)
2. O banco será criado imediatamente
3. Pronto! O banco `marcbuddy_db` aparecerá na lista de **Databases** no painel esquerdo do pgAdmin

### Passo 6: Verificar

Para confirmar que o banco foi criado:
- No painel esquerdo, expanda **Databases**
- Você verá `marcbuddy_db` na lista
- Pode expandir o banco para ver suas propriedades

---

## 💻 Método 2: Usando SQL Shell (psql) - Linha de Comando

### Passo 1: Abrir SQL Shell

1. Abra o **SQL Shell (psql)** (vem instalado com o PostgreSQL)
2. Pressione **Enter** várias vezes para aceitar os valores padrão:
   - Server: `[localhost]` → Enter
   - Database: `[postgres]` → Enter
   - Port: `[5432]` → Enter
   - Username: `[postgres]` → Enter
3. Digite a **senha** do usuário `postgres` e pressione Enter

### Passo 2: Criar o Banco

Digite o comando:

```sql
CREATE DATABASE marcbuddy_db;
```

Pressione **Enter**. Você verá:
```
CREATE DATABASE
```

> **Nota**: O banco será criado com o locale "Portuguese, Brazil" configurado durante a instalação do PostgreSQL, garantindo formatação adequada para o projeto brasileiro.

### Passo 3: Verificar

Para confirmar que foi criado, digite:

```sql
\l
```

Você verá uma lista de bancos e `marcbuddy_db` deve estar lá.

### Passo 4: Sair

Digite:

```sql
\q
```

E pressione Enter para sair.

---

## 🎯 Método 3: Usando Terminal/CMD (Windows)

### Passo 1: Abrir Terminal

Abra o **PowerShell** ou **CMD** como Administrador.

### Passo 2: Navegar até o PostgreSQL

```powershell
cd "C:\Program Files\PostgreSQL\16\bin"
```

*Nota: O número `16` pode ser diferente dependendo da sua versão. Verifique a pasta correta.*

### Passo 3: Criar o Banco

```powershell
.\psql.exe -U postgres -c "CREATE DATABASE marcbuddy_db;"
```

Você será solicitado a digitar a senha do usuário `postgres`.

### Passo 4: Verificar

```powershell
.\psql.exe -U postgres -l
```

Você verá a lista de bancos, incluindo `marcbuddy_db`.

---

## ✅ Verificar se o Banco Foi Criado

### Via pgAdmin:
- O banco aparecerá na lista de **Databases** no painel esquerdo
- Expanda **Databases** e procure por `marcbuddy_db`
- Se aparecer, está criado com sucesso!

### Via psql:
```sql
\l
```

### Via Terminal:
```powershell
psql -U postgres -l
```

---

## 🔧 Configurar o .env do Backend

Após criar o banco, configure o arquivo `.env` no backend:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=marcbuddy_db
DB_USER=postgres
DB_PASSWORD=sua_senha_do_postgres
```

---

## 🚀 Próximo Passo: Criar as Tabelas

Após criar o banco, execute a migração para criar as tabelas:

```bash
cd backend
npm run migrate
```

Isso criará as tabelas `users` e `subscriptions` automaticamente!

---

## ❓ Problemas Comuns

### Erro: "database already exists"

**Solução**: O banco já existe! Você pode:
- Usar o banco existente, ou
- Deletar e recriar:
  ```sql
  DROP DATABASE marcbuddy_db;
  CREATE DATABASE marcbuddy_db;
  ```

### Erro: "password authentication failed"

**Solução**: 
- Verifique se está usando a senha correta do usuário `postgres`
- Se esqueceu a senha, você pode redefini-la editando `pg_hba.conf`

### Erro: "could not connect to server"

**Solução**:
- Verifique se o PostgreSQL está rodando
- **Windows**: Abra **Services** → Procure `postgresql` → Inicie o serviço

### Não encontro o pgAdmin

**Solução**:
- Procure por "pgAdmin" no menu Iniciar do Windows
- Ou reinstale o PostgreSQL incluindo o pgAdmin

### Stack Builder apareceu durante a instalação

**Solução**: 
- O Stack Builder é **opcional** e não é necessário para o projeto MarcBuddy
- Você pode clicar em **Cancel** e continuar normalmente
- Ele serve apenas para instalar ferramentas adicionais do PostgreSQL

---

## 📋 Checklist Rápido

- [x] PostgreSQL instalado com locale "Portuguese, Brazil"
- [x] PostgreSQL rodando (serviço ativo)
- [x] Banco `marcbuddy_db` criado
- [x] Arquivo `.env` configurado no backend
- [x] Migração executada (`npm run migrate`)

---

## 💡 Dicas

**Método mais rápido**: Use o **pgAdmin** (Método 1) - é visual e mais fácil para iniciantes!

**Campos importantes no pgAdmin**:
- ✅ **Database name**: Obrigatório - use `marcbuddy_db`
- ✅ **Owner**: Obrigatório - deixe `postgres`
- ❌ **OID**: Deixe vazio (gerado automaticamente)
- ⚠️ **Outros campos**: Podem ficar com valores padrão

---

**Pronto!** Agora você tem o banco local criado e pode começar a desenvolver! 🎉

