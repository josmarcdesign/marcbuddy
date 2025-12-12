# Fase 2.1: Página de Planos Estática - Passo a Passo Completo

> **Status**: 📋 Pendente  
> **Fase**: 2 - Sistema de Planos e Pagamento  
> **Ordem**: 02

## 🎯 Objetivo

Criar uma página estática que exibe os planos disponíveis da plataforma MarcBuddy com design moderno e responsivo.

## 📋 Passo 1: Instalar Dependências (se necessário)

No terminal do frontend:

```bash
cd frontend
npm install react-qr-code  # Para futura integração com QR code
```

## 📋 Passo 2: Criar Arquivo de Configuração dos Planos

Crie o arquivo `frontend/src/config/plans.js`:

```javascript
export const PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'mês',
    description: 'Perfeito para começar',
    features: [
      'Acesso básico às ferramentas',
      'Uso limitado',
      'Suporte pela comunidade',
      'Até 10 projetos'
    ],
    popular: false,
    color: 'gray'
  },
  basic: {
    id: 'basic',
    name: 'Basic',
    price: 29.90,
    period: 'mês',
    description: 'Para profissionais',
    features: [
      'Acesso completo às ferramentas básicas',
      'Uso ilimitado',
      'Suporte por email',
      'Projetos ilimitados',
      'Exportação de dados'
    ],
    popular: true,
    color: 'blue'
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 79.90,
    period: 'mês',
    description: 'Para equipes',
    features: [
      'Todas as ferramentas',
      'Recursos avançados',
      'Suporte prioritário',
      'API access',
      'Integrações',
      'Análises avançadas'
    ],
    popular: false,
    color: 'purple'
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199.90,
    period: 'mês',
    description: 'Para empresas',
    features: [
      'Tudo do Premium',
      'Suporte dedicado',
      'Customizações',
      'SLA garantido',
      'Treinamento da equipe',
      'Gerente de conta'
    ],
    popular: false,
    color: 'gold'
  }
};

export const getPlanById = (id) => PLANS[id] || null;
export const getAllPlans = () => Object.values(PLANS);
```

## 📋 Passo 3: Criar Componente PlanCard

Crie o arquivo `frontend/src/components/PlanCard.jsx`:

```jsx
import { Link } from 'react-router-dom';

const PlanCard = ({ plan, isPopular = false }) => {
  return (
    <div className={`relative bg-white rounded-lg shadow-lg p-6 border-2 ${
      isPopular ? 'border-primary-500 transform scale-105' : 'border-gray-200'
    }`}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
            Mais Popular
          </span>
        </div>
      )}
      
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
        <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
        
        <div className="mb-4">
          <span className="text-4xl font-bold text-gray-900">
            R$ {plan.price.toFixed(2).replace('.', ',')}
          </span>
          {plan.price > 0 && (
            <span className="text-gray-600">/{plan.period}</span>
          )}
        </div>
      </div>

      <ul className="space-y-3 mb-6">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>

      <Link
        to={`/plans/${plan.id}/checkout`}
        className={`block w-full text-center py-3 px-4 rounded-lg font-medium transition-colors ${
          isPopular
            ? 'bg-primary-600 text-white hover:bg-primary-700'
            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
        }`}
      >
        {plan.price === 0 ? 'Começar Grátis' : 'Escolher Plano'}
      </Link>
    </div>
  );
};

export default PlanCard;
```

## 📋 Passo 4: Criar Página de Planos

Crie o arquivo `frontend/src/pages/Plans.jsx`:

```jsx
import { getAllPlans } from '../config/plans';
import PlanCard from '../components/PlanCard';

const Plans = () => {
  const plans = getAllPlans();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Escolha o Plano Ideal para Você
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Planos flexíveis para atender suas necessidades. Cancele quando quiser.
          </p>
        </div>

        {/* Planos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isPopular={plan.popular}
            />
          ))}
        </div>

        {/* Informações Adicionais */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Todos os planos incluem atualizações automáticas e suporte técnico.
          </p>
          <p className="text-sm text-gray-500">
            Precisa de um plano customizado? <a href="#" className="text-primary-600 hover:underline">Entre em contato</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Plans;
```

## 📋 Passo 5: Adicionar Rota no App.jsx

Atualize `frontend/src/App.jsx`:

```jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Plans from './pages/Plans';  // Adicionar
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/plans" element={<Plans />} />  {/* Adicionar */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
```

## 📋 Passo 6: Adicionar Link no Dashboard

Atualize `frontend/src/pages/Dashboard.jsx` para incluir link para planos:

```jsx
// Adicionar no início do componente, após o import
import { Link } from 'react-router-dom';

// Adicionar no JSX, dentro do card principal:
<div className="mt-6">
  <Link
    to="/plans"
    className="inline-block bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
  >
    Ver Planos Disponíveis
  </Link>
</div>
```

## 📋 Passo 7: Testar a Página

1. Inicie o servidor frontend:
```bash
cd frontend
npm run dev
```

2. Acesse `http://localhost:3000/plans`

3. Verifique:
   - [ ] Todos os 4 planos aparecem
   - [ ] Design responsivo funciona
   - [ ] Botões "Escolher Plano" funcionam
   - [ ] Plano "Basic" está destacado como popular

## 🎨 Customização de Cores

Você pode ajustar as cores no `tailwind.config.js`:

```javascript
colors: {
  primary: {
    // Suas cores do manual de marca
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
  }
}
```

## ✅ Checklist de Conclusão

- [x] Arquivo de configuração de planos criado
- [x] Componente PlanCard criado
- [x] Página Plans criada
- [x] Rota adicionada no App.jsx
- [x] Link adicionado no Dashboard
- [x] Página testada e funcionando

## 🐛 Problemas Comuns

### Planos não aparecem
- Verifique se o arquivo `plans.js` está sendo importado corretamente
- Confirme que a função `getAllPlans()` retorna os planos

### Estilos não aplicados
- Verifique se o Tailwind CSS está configurado corretamente
- Confirme que as classes estão sendo usadas corretamente

### Rota não funciona
- Verifique se a rota foi adicionada no `App.jsx`
- Confirme que o React Router está configurado

---

**Próximo**: Seguir para `03-FASE2-ENDPOINTS_ASSINATURAS.md` para implementar os endpoints no backend
