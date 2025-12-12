# MarcBuddy - Plataforma SaaS MVP

Plataforma SaaS desenvolvida em múltiplas fases para gerenciamento de marca e ferramentas web.

## 📋 Fase 1: Setup Inicial e Autenticação ✅

### Estrutura do Projeto

```
Plataforma-MarcBuddy-Cursor-Project/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Controllers da API
│   │   ├── database/         # Configuração e migrações do banco
│   │   ├── middleware/       # Middlewares (auth, etc)
│   │   ├── routes/          # Rotas da API
│   │   └── server.js        # Arquivo principal do servidor
│   ├── .env.example         # Exemplo de variáveis de ambiente
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/      # Componentes React
    │   ├── contexts/        # Context API (AuthContext)
    │   ├── pages/          # Páginas da aplicação
    │   ├── services/       # Serviços (API client)
    │   ├── App.jsx         # Componente principal
    │   └── main.jsx        # Entry point
    ├── index.html
    └── package.json
```

### Tecnologias Utilizadas

**Backend:**
- Node.js + Express
- PostgreSQL
- JWT para autenticação
- bcryptjs para hash de senhas
- express-validator para validação

**Frontend:**
- React 18
- React Router DOM
- Axios para requisições HTTP
- React Query para gerenciamento de estado
- Tailwind CSS para estilização
- Vite como build tool

### Configuração e Instalação

#### 1. Backend

```bash
cd backend
npm install
```

Crie um arquivo `.env` baseado no `.env.example`:

```env
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=marcbuddy_db
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=seu_jwt_secret_super_seguro_aqui
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

Configure o PostgreSQL e execute a migração:

```bash
npm run migrate
```

**📖 Guias de Configuração:**
- [`CONFIGURACAO_POSTGRESQL.md`](./CONFIGURACAO_POSTGRESQL.md) - Configuração do PostgreSQL local
- [`CONFIGURACAO_HOSTINGER.md`](./CONFIGURACAO_HOSTINGER.md) - Configuração do banco Hostinger para produção

Inicie o servidor:

```bash
npm run dev
```

#### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

### Funcionalidades Implementadas

✅ **Autenticação JWT**
- Registro de novos usuários
- Login com email e senha
- Middleware de autenticação
- Proteção de rotas

✅ **Banco de Dados PostgreSQL**
- Tabela `users` (id, name, email, password_hash, role, is_active)
- Tabela `subscriptions` (preparada para Fase 2)
- Índices para otimização

✅ **Frontend React**
- Página de Login
- Página de Registro
- Dashboard básico
- Context API para gerenciamento de autenticação
- Rotas protegidas

### Endpoints da API

#### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/me` - Obter informações do usuário autenticado

#### Health Check
- `GET /api/health` - Verificar status da API

### Próximos Passos (Fase 2)

- Sistema de planos estático
- Endpoints para criação e gerenciamento de assinaturas
- Integração com Pix para pagamento manual
- Dashboard com informações de plano e license key

---

## 📝 Notas

- As cores e fontes do manual de marca serão aplicadas nas próximas fases conforme necessário
- O projeto está preparado para escalar para as próximas fases
- Código modular e bem comentado para facilitar manutenção

