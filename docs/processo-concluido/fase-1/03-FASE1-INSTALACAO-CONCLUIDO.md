# ✅ CONCLUÍDO - Guia de Instalação - MarcBuddy Fase 1

> **Status**: ✅ Concluído  
> **Data**: Fase 1 - Setup Inicial  
> **Ordem**: 03

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior)
- **PostgreSQL** (versão 12 ou superior)
- **npm** ou **yarn**

## Passo a Passo

### 1. Configurar o Banco de Dados PostgreSQL

📖 **Para um guia completo e detalhado, consulte:** [`CONFIGURACAO_POSTGRESQL.md`](../processo-concluido/01-CONFIGURACAO_POSTGRESQL-CONCLUIDO.md)

**Resumo rápido:**

1. Instale o PostgreSQL (se ainda não tiver)
2. Crie o banco de dados `marcbuddy_db`:
   - Via pgAdmin: Clique direito em Databases → Create → Database → Nome: `marcbuddy_db`
   - Via psql: Execute `CREATE DATABASE marcbuddy_db;`
3. Anote as credenciais do seu PostgreSQL (host, porta, usuário, senha)
   - **Padrão**: usuário `postgres` com a senha que você definiu na instalação

### 2. Configurar o Backend

1. Navegue até a pasta do backend:
```bash
cd backend
```

2. Instale as dependências:
```bash
npm install
```

3. Crie o arquivo `.env` baseado no `.env.example`:
```bash
# No Windows PowerShell:
Copy-Item env.example.txt .env

# No Linux/Mac:
cp .env.example .env
```

4. Edite o arquivo `.env` com suas configurações:
```env
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=marcbuddy_db
DB_USER=seu_usuario_postgres
DB_PASSWORD=sua_senha_postgres
JWT_SECRET=seu_jwt_secret_super_seguro_aqui_mude_em_producao
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

5. Execute a migração do banco de dados:
```bash
npm run migrate
```

6. Inicie o servidor backend:
```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3001`

### 3. Configurar o Frontend

1. Abra um novo terminal e navegue até a pasta do frontend:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

O frontend estará rodando em `http://localhost:3000`

### 4. Testar a Aplicação

1. Acesse `http://localhost:3000` no navegador
2. Você será redirecionado para a página de login
3. Clique em "Cadastre-se" para criar uma nova conta
4. Após o cadastro, você será redirecionado para o dashboard

## Estrutura de URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

## Endpoints Disponíveis

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/me` - Obter informações do usuário autenticado

### Exemplo de Requisição de Registro

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

### Exemplo de Requisição de Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

## Solução de Problemas

### Erro de conexão com o banco de dados

- Verifique se o PostgreSQL está rodando
- Confirme as credenciais no arquivo `.env`
- Verifique se o banco de dados `marcbuddy_db` foi criado

### Erro de porta já em uso

- Altere a porta no arquivo `.env` (backend) ou `vite.config.js` (frontend)
- Certifique-se de que não há outros processos usando as portas 3000 ou 3001

### Erro de CORS

- Verifique se a `FRONTEND_URL` no `.env` do backend está correta
- Certifique-se de que o frontend está rodando na URL especificada

## Próximos Passos

Após confirmar que tudo está funcionando, você pode prosseguir para a **Fase 2** do desenvolvimento.

