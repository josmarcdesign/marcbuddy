# 🔍 Análise Completa do Projeto MarcBuddy

> **Última atualização:** 2025-12-01  
> **Versão do Projeto:** MVP - Fase 2 Completa, Fase 3 Documentada

---

## 📊 STATUS GERAL DO PROJETO

### ✅ Fases Concluídas
- **Fase 1:** Setup Inicial e Autenticação (100%)
- **Fase 2:** Sistema de Planos e Pagamentos (100%)

### 🚧 Fase Atual
- **Fase 3:** Ferramentas Web (Documentação criada, implementação pendente)

### 📈 Progresso Total: ~70%

---

## 🏗️ ARQUITETURA DO PROJETO

### Estrutura de Pastas

```
Plataforma-MarcBuddy-Cursor-Project/
├── backend/                    # API Node.js + Express
│   ├── src/
│   │   ├── controllers/       # Lógica de negócio
│   │   ├── database/          # PostgreSQL (connection + migrations)
│   │   ├── middleware/        # Auth, validações
│   │   ├── routes/            # Endpoints da API
│   │   ├── services/          # Serviços (Pix, etc)
│   │   ├── utils/             # Utilitários (license keys, plans)
│   │   └── server.js          # Entry point
│   ├── .env                   # Variáveis de ambiente
│   └── package.json
│
├── frontend/                   # React + Vite
│   ├── src/
│   │   ├── components/        # Componentes reutilizáveis
│   │   ├── contexts/          # Context API (Auth)
│   │   ├── hooks/             # Custom hooks
│   │   ├── pages/             # Páginas da aplicação
│   │   ├── services/          # API clients
│   │   ├── config/            # Configurações (planos)
│   │   ├── App.jsx             # Rotas principais
│   │   └── main.jsx            # Entry point
│   ├── tailwind.config.js     # Config Tailwind
│   └── package.json
│
└── docs/                       # Documentação
    ├── processo-concluido/     # Fases concluídas
    └── proximos-passos/        # Próximas fases
```

---

## 🛠️ TECNOLOGIAS E DEPENDÊNCIAS

### Backend (Node.js + Express)

**Dependências Principais:**
- `express@^4.18.2` - Framework web
- `pg@^8.11.3` - Cliente PostgreSQL
- `jsonwebtoken@^9.0.2` - Autenticação JWT
- `bcryptjs@^2.4.3` - Hash de senhas
- `express-validator@^7.0.1` - Validação de dados
- `cors@^2.8.5` - CORS middleware
- `dotenv@^16.3.1` - Variáveis de ambiente
- `qrcode@^1.5.4` - Geração de QR Code Pix
- `uuid@^13.0.0` - Geração de IDs únicos

**DevDependencies:**
- `nodemon@^3.0.1` - Hot reload em desenvolvimento

**Porta:** 3001

### Frontend (React + Vite)

**Dependências Principais:**
- `react@^18.2.0` - Framework UI
- `react-dom@^18.2.0` - React DOM
- `react-router-dom@^6.20.0` - Roteamento
- `axios@^1.6.2` - Cliente HTTP
- `react-query@^3.39.3` - Gerenciamento de estado
- `react-qr-code@^2.0.18` - Componente QR Code

**DevDependencies:**
- `vite@^5.0.8` - Build tool
- `tailwindcss@^3.3.6` - Framework CSS
- `@vitejs/plugin-react@^4.2.1` - Plugin React para Vite
- `autoprefixer@^10.4.16` - Autoprefixer CSS
- `postcss@^8.4.32` - Processador CSS

**Porta:** 3000 (com proxy para /api → localhost:3001)

---

## 🗄️ BANCO DE DADOS (PostgreSQL)

### Tabelas Existentes

#### `users`
```sql
- id (SERIAL PRIMARY KEY)
- name (VARCHAR 255)
- email (VARCHAR 255 UNIQUE)
- password_hash (VARCHAR 255)
- role (VARCHAR 50) DEFAULT 'user' CHECK (role IN ('user', 'admin'))
- is_active (BOOLEAN) DEFAULT true
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

**Índices:**
- `idx_users_email` - Otimização de busca por email

#### `subscriptions`
```sql
- id (SERIAL PRIMARY KEY)
- user_id (INTEGER) REFERENCES users(id) ON DELETE CASCADE
- plan_type (VARCHAR 50) CHECK (plan_type IN ('free', 'basic', 'premium', 'enterprise'))
- status (VARCHAR 50) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'cancelled', 'expired'))
- license_key (VARCHAR 255 UNIQUE)
- start_date (TIMESTAMP)
- end_date (TIMESTAMP)
- renewal_date (TIMESTAMP)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

**Índices:**
- `idx_subscriptions_user_id` - Busca por usuário
- `idx_subscriptions_status` - Busca por status

---

## 🔐 SISTEMA DE AUTENTICAÇÃO

### Implementação
- **JWT** com expiração de 7 dias
- **bcryptjs** para hash de senhas (10 rounds)
- **Middleware** `authenticateToken` para proteger rotas
- **Context API** no frontend para gerenciar estado de autenticação
- **Interceptors Axios** para adicionar token automaticamente

### Endpoints de Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/me` - Obter dados do usuário autenticado

### Rotas Protegidas
- `/dashboard` - Requer autenticação
- `/admin/payments` - Requer autenticação + role admin
- Todas as rotas `/api/subscriptions/*` - Requerem autenticação
- Todas as rotas `/api/payments/*` - Requerem autenticação

---

## 💳 SISTEMA DE PLANOS E ASSINATURAS

### Planos Disponíveis

| Plano | Preço | Status Inicial | Features |
|-------|-------|----------------|----------|
| **Free** | R$ 0,00 | `active` (automático) | Básico |
| **Basic** | R$ 29,90 | `pending` (aguarda pagamento) | Profissional |
| **Premium** | R$ 79,90 | `pending` | Equipes |
| **Enterprise** | R$ 199,90 | `pending` | Empresas |

### License Keys
- **Formato:** `MB-XXXX-XXXX-XXXX` (16 caracteres alfanuméricos)
- **Geração:** UUID v4 formatado
- **Unicidade:** Garantida por constraint UNIQUE no banco
- **Validação:** Regex pattern `/^MB-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/`

### Endpoints de Assinaturas
- `POST /api/subscriptions` - Criar assinatura
- `GET /api/subscriptions` - Listar assinaturas do usuário
- `GET /api/subscriptions/active` - Obter assinatura ativa
- `GET /api/subscriptions/license-key` - Obter license key
- `GET /api/subscriptions/:id` - Obter assinatura específica
- `PATCH /api/subscriptions/:id/status` - Atualizar status
- `POST /api/subscriptions/:id/cancel` - Cancelar assinatura
- `GET /api/subscriptions/admin/pending` - Listar pendentes (admin only)

### Regras de Negócio
- ✅ Usuário pode ter apenas **UMA** assinatura ativa por vez
- ✅ Plano Free ativa automaticamente
- ✅ Outros planos ficam `pending` até confirmação de pagamento
- ✅ Renovação automática a cada 30 dias (quando ativado)
- ✅ License key gerada automaticamente ao criar assinatura

---

## 💰 SISTEMA DE PAGAMENTO PIX

### Implementação
- **QR Code** gerado via `qrcode` (npm)
- **Chave Pix** configurável via variável de ambiente `PIX_KEY`
- **Expiração:** 30 minutos após geração
- **Confirmação manual** por admin

### Endpoints de Pagamento
- `POST /api/payments/generate-qrcode` - Gerar QR Code Pix
- `POST /api/payments/confirm` - Confirmar pagamento (admin only)

### Fluxo de Pagamento
1. Usuário escolhe plano → Cria assinatura (status: `pending`)
2. Sistema gera QR Code Pix com valor do plano
3. Usuário escaneia e paga
4. Admin confirma pagamento manualmente
5. Assinatura ativada (status: `active`)

---

## 🎨 FRONTEND - COMPONENTES E PÁGINAS

### Componentes Globais
- **`Layout.jsx`** - Wrapper com Navbar e Footer
- **`Navbar.jsx`** - Navegação fixa (sticky top)
- **`Footer.jsx`** - Rodapé com links e redes sociais
- **`ProtectedRoute.jsx`** - HOC para proteger rotas

### Componentes de Funcionalidade
- **`PlanCard.jsx`** - Card de plano na página de planos
- **`SubscriptionInfo.jsx`** - Informações da assinatura no dashboard
- **`QRCode.jsx`** - Exibição de QR Code Pix

### Páginas Implementadas

#### Públicas (sem Layout)
- **`Login.jsx`** - Página de login (2 colunas, sem navbar/footer)
- **`Register.jsx`** - Página de registro (2 colunas, sem navbar/footer)

#### Protegidas (com Layout)
- **`Dashboard.jsx`** - Dashboard principal com informações de assinatura
- **`Plans.jsx`** - Página de planos disponíveis
- **`Payment.jsx`** - Página de pagamento Pix
- **`Admin/Payments.jsx`** - Painel admin para confirmar pagamentos

### Rotas Configuradas

```javascript
/login                    → Login (sem Layout)
/register                 → Register (sem Layout)
/plans                    → Plans (com Layout)
/plans/:planId/checkout    → Payment (com Layout)
/dashboard                → Dashboard (com Layout, protegido)
/admin/payments           → AdminPayments (com Layout, protegido, admin only)
/                         → Redirect para /dashboard
```

### Context API
- **`AuthContext.jsx`** - Gerencia autenticação global
  - `user` - Dados do usuário
  - `loading` - Estado de carregamento
  - `login(email, password)` - Função de login
  - `register(name, email, password)` - Função de registro
  - `logout()` - Função de logout

### Custom Hooks
- **`useSubscription.js`** - Hook para gerenciar assinatura
  - `subscription` - Dados da assinatura
  - `loading` - Estado de carregamento
  - `error` - Erros
  - `refetch()` - Recarregar dados

### Serviços (API Clients)
- **`api.js`** - Cliente Axios configurado
  - Base URL: `/api`
  - Interceptor para adicionar token JWT
  - Interceptor para redirecionar em 401
- **`subscription.service.js`** - Métodos para assinaturas
  - `create(planType)`
  - `getMySubscriptions()`
  - `getActive()`
  - `getLicenseKey()`
  - `cancel(subscriptionId)`

---

## 📁 ARQUIVOS PRINCIPAIS DO BACKEND

### Controllers
- **`auth.controller.js`**
  - `register()` - Registrar usuário
  - `login()` - Autenticar usuário
  - `getMe()` - Obter dados do usuário

- **`subscription.controller.js`**
  - `createSubscription()` - Criar assinatura
  - `getMySubscriptions()` - Listar assinaturas
  - `getActiveSubscription()` - Obter ativa
  - `getMyLicenseKey()` - Obter license key
  - `updateSubscriptionStatus()` - Atualizar status
  - `cancelSubscription()` - Cancelar
  - `getAllPendingSubscriptions()` - Listar pendentes (admin)

- **`payment.controller.js`**
  - `generatePaymentQRCode()` - Gerar QR Code
  - `confirmPayment()` - Confirmar pagamento (admin)

### Middleware
- **`auth.middleware.js`**
  - `authenticateToken` - Verificar JWT
  - `requireAdmin` - Verificar role admin

### Services
- **`pix.service.js`**
  - `generatePixQRCode()` - Gerar QR Code
  - `isQRCodeValid()` - Validar expiração

### Utils
- **`licenseKey.js`**
  - `generateLicenseKey()` - Gerar chave única
  - `validateLicenseKeyFormat()` - Validar formato

- **`plans.js`**
  - `PLAN_PRICES` - Preços dos planos
  - `PLAN_NAMES` - Nomes dos planos
  - `getPlanById()` - Obter dados do plano

### Database
- **`connection.js`** - Pool de conexões PostgreSQL
- **`migrate.js`** - Script de migração (cria tabelas)

---

## 🎨 IDENTIDADE VISUAL (Manual de Marca)

### Arquivo de Configuração
- **`frontend/src/config/brand.js`** - Arquivo centralizado com todas as configurações de identidade visual

### Cores Primárias

#### Verde Vibrante (Action Green)
- **Hex:** `#87c508`
- **RGB:** `135, 197, 8`
- **Uso:** CTAs, botões primários, destaque, ação
- **Tailwind:** `brand-green` ou `primary`

#### Azul Marinho (Trust Blue)
- **Hex:** `#011526`
- **RGB:** `1, 21, 38`
- **Uso:** Fundo principal, textos primários, cabeçalhos
- **Tailwind:** `brand-blue-900`

#### Off-White (Clean White)
- **Hex:** `#F5F5F5`
- **RGB:** `245, 245, 245`
- **Uso:** Superfícies secundárias, contraste, clareza
- **Tailwind:** `brand-white`

### Cores de Status
- **Success:** `#10B981` - `status-success`
- **Warning:** `#F59E0B` - `status-warning`
- **Error:** `#EF4444` - `status-error`
- **Info:** `#3B82F6` - `status-info`

### Tipografia

#### Fonte Principal: Nunito
- **Pesos:** 300, 400, 600, 700
- **Uso:** Títulos (H1, H2, H3), slogans, botões, CTAs, destaques
- **Tailwind:** `font-nunito`
- **Características:** Geométrica, arredondada, amigável

#### Fonte Secundária: Poppins
- **Pesos:** 300, 400, 500, 600, 700
- **Uso:** Corpo de texto, parágrafos, labels, descrições, valores
- **Tailwind:** `font-poppins`
- **Características:** Geométrica, moderna, legível

### Tamanhos de Fonte (Manual)
- **H1:** 48px, Nunito 700
- **H2:** 32px, Nunito 600
- **H3:** 24px, Nunito 600
- **Body:** 16px, Poppins 400
- **Small:** 14px, Poppins 400
- **Caption:** 12px, Poppins 400
- **Label:** 14px, Poppins 600

### Componentes Visuais
- **Navbar:** Branco, sticky, com logo verde
- **Footer:** Azul marinho (`brand-blue-900`), texto off-white
- **Cards:** Off-white (`brand-white`), sombra, bordas arredondadas
- **Botões:** Verde vibrante (`brand-green`), texto azul marinho
- **Formulários:** Inputs com focus ring verde
- **Links:** Verde vibrante, hover verde mais escuro

### Layout Responsivo
- **Mobile:** < 768px (1 coluna)
- **Tablet:** 768px - 1024px (2 colunas)
- **Desktop:** > 1024px (4 colunas onde aplicável)

### Recomendações de Contraste (WCAG AA)
- **Texto sobre verde:** Azul marinho ou preto
- **Texto sobre azul marinho:** Off-white ou verde vibrante
- **Texto sobre off-white:** Azul marinho ou gray-700

---

## ⚙️ CONFIGURAÇÕES IMPORTANTES

### Variáveis de Ambiente (Backend)

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
PIX_KEY=sua-chave-pix@exemplo.com
```

### Vite Config (Frontend)
- **Porta:** 3000
- **Proxy:** `/api` → `http://localhost:3001`
- **HMR:** Habilitado

---

## 📚 DOCUMENTAÇÃO

### Processo Concluído
- **Fase 1:** 4 documentos
- **Fase 2:** 6 documentos

### Próximos Passos
- **Fase 3:** 3 documentos criados (8 planejados)
  - Upload de arquivos
  - Extrator de cores
  - Compressor de imagens
  - Renomeador em lote
  - Dashboard de ferramentas
  - Restrições por plano
  - Testes e validação

---

## 🔄 FLUXOS PRINCIPAIS

### Fluxo de Registro/Login
1. Usuário acessa `/register` ou `/login`
2. Preenche formulário
3. Backend valida e cria/autentica
4. Token JWT salvo no localStorage
5. Redireciona para `/dashboard`

### Fluxo de Assinatura
1. Usuário acessa `/plans`
2. Escolhe plano e clica "Escolher Plano"
3. Redireciona para `/plans/:planId/checkout`
4. Sistema cria assinatura (status: `pending` para planos pagos)
5. Gera QR Code Pix
6. Usuário paga
7. Admin confirma em `/admin/payments`
8. Assinatura ativada (status: `active`)

### Fluxo de Dashboard
1. Usuário autenticado acessa `/dashboard`
2. Sistema busca assinatura ativa via API
3. Exibe informações: plano, license key, datas
4. Permite ações: atualizar plano, cancelar, finalizar pagamento

---

## 🚨 PONTOS DE ATENÇÃO

### Segurança
- ✅ Senhas hasheadas com bcrypt
- ✅ JWT com expiração
- ✅ Validação de dados com express-validator
- ✅ CORS configurado
- ✅ Rotas protegidas com middleware
- ⚠️ **Pendente:** Rate limiting
- ⚠️ **Pendente:** Sanitização de inputs

### Performance
- ✅ Índices no banco de dados
- ✅ Pool de conexões PostgreSQL
- ⚠️ **Pendente:** Cache de queries
- ⚠️ **Pendente:** Compressão de respostas

### Funcionalidades Pendentes
- ❌ Ferramentas web (Fase 3)
- ❌ Chat em tempo real (Fase 4)
- ❌ Dashboard analytics (Fase 5)
- ❌ API pública (Fase 6)

---

## 📝 NOTAS IMPORTANTES

1. **Arquivos Temporários:** Uploads são armazenados em `/uploads` (não versionado)
2. **License Keys:** Formato único `MB-XXXX-XXXX-XXXX`
3. **Planos:** Free ativa automaticamente, outros requerem pagamento
4. **Admin:** Role `admin` no banco para acessar `/admin/payments`
5. **QR Code Pix:** MVP simples, não é QR Code EMV padrão do Banco Central
6. **Documentação:** Toda em `docs/` organizada por fase

---

## 🎯 PRÓXIMOS PASSOS SUGERIDOS

1. **Implementar Fase 3** - Ferramentas Web
2. **Melhorar segurança** - Rate limiting, sanitização
3. **Otimizar performance** - Cache, compressão
4. **Testes automatizados** - Unit tests, integration tests
5. **CI/CD** - Pipeline de deploy
6. **Monitoramento** - Logs, métricas

---

**Este documento deve ser atualizado sempre que houver mudanças significativas no projeto.**

