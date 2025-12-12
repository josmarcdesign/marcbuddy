# Fase 2.4: Dashboard com Informações de Plano - Passo a Passo Completo

> **Status**: 📋 Pendente  
> **Fase**: 2 - Sistema de Planos e Pagamento  
> **Ordem**: 05

## 🎯 Objetivo

Desenvolver dashboard básico que mostra plano ativo, data de renovação e license key.

## 📋 Passo 1: Criar Serviço de Subscriptions no Frontend

Crie o arquivo `frontend/src/services/subscription.service.js`:

```javascript
import api from './api';

export const subscriptionService = {
  // Criar assinatura
  create: async (planType) => {
    const response = await api.post('/subscriptions', {
      plan_type: planType
    });
    return response.data;
  },

  // Listar assinaturas do usuário
  getMySubscriptions: async () => {
    const response = await api.get('/subscriptions');
    return response.data;
  },

  // Obter assinatura ativa
  getActive: async () => {
    const response = await api.get('/subscriptions/active');
    return response.data;
  },

  // Obter license key
  getLicenseKey: async () => {
    const response = await api.get('/subscriptions/license-key');
    return response.data;
  },

  // Cancelar assinatura
  cancel: async (subscriptionId) => {
    const response = await api.post(`/subscriptions/${subscriptionId}/cancel`);
    return response.data;
  }
};
```

## 📋 Passo 2: Criar Componente SubscriptionInfo

Crie o arquivo `frontend/src/components/SubscriptionInfo.jsx`:

```jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import subscriptionService from '../services/subscription.service';

const SubscriptionInfo = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      const response = await subscriptionService.getActive();
      setSubscription(response.data.subscription);
    } catch (error) {
      // Usuário não tem assinatura ativa
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLicenseKey = () => {
    if (subscription?.license_key) {
      navigator.clipboard.writeText(subscription.license_key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const getDaysUntilRenewal = (renewalDate) => {
    if (!renewalDate) return null;
    const today = new Date();
    const renewal = new Date(renewalDate);
    const diffTime = renewal - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
      expired: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || colors.pending;
  };

  const getStatusLabel = (status) => {
    const labels = {
      active: 'Ativa',
      pending: 'Pendente',
      cancelled: 'Cancelada',
      expired: 'Expirada'
    };
    return labels[status] || status;
  };

  const getPlanName = (planType) => {
    const names = {
      free: 'Free',
      basic: 'Basic',
      premium: 'Premium',
      enterprise: 'Enterprise'
    };
    return names[planType] || planType;
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Sua Assinatura</h3>
        <p className="text-gray-600 mb-4">
          Você ainda não possui uma assinatura ativa.
        </p>
        <Link
          to="/plans"
          className="inline-block bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          Escolher um Plano
        </Link>
      </div>
    );
  }

  const daysUntilRenewal = getDaysUntilRenewal(subscription.renewal_date);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-xl font-bold text-gray-900">Sua Assinatura</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subscription.status)}`}>
          {getStatusLabel(subscription.status)}
        </span>
      </div>

      {/* Plano Ativo */}
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <h4 className="text-lg font-semibold text-gray-900">
            Plano {getPlanName(subscription.plan_type)}
          </h4>
          <span className={`ml-3 px-2 py-1 rounded text-xs font-medium ${
            subscription.plan_type === 'premium' || subscription.plan_type === 'enterprise'
              ? 'bg-purple-100 text-purple-800'
              : subscription.plan_type === 'basic'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {subscription.plan_type.toUpperCase()}
          </span>
        </div>
      </div>

      {/* License Key */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          License Key
        </label>
        <div className="flex items-center">
          <code className="flex-1 font-mono text-sm text-gray-900 bg-white p-2 rounded border">
            {subscription.license_key}
          </code>
          <button
            onClick={handleCopyLicenseKey}
            className="ml-2 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors text-sm"
          >
            {copied ? '✓ Copiado' : 'Copiar'}
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Use esta chave para ativar o software MarcBuddy
        </p>
      </div>

      {/* Datas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-600 mb-1">Data de Início</p>
          <p className="font-semibold text-gray-900">
            {formatDate(subscription.start_date)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Próxima Renovação</p>
          <p className="font-semibold text-gray-900">
            {formatDate(subscription.renewal_date)}
          </p>
          {daysUntilRenewal !== null && daysUntilRenewal > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              {daysUntilRenewal} dias restantes
            </p>
          )}
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Data de Expiração</p>
          <p className="font-semibold text-gray-900">
            {formatDate(subscription.end_date) || 'Não expira'}
          </p>
        </div>
      </div>

      {/* Ações */}
      <div className="flex flex-wrap gap-3">
        <Link
          to="/plans"
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
        >
          Atualizar Plano
        </Link>
        {subscription.status === 'active' && (
          <button
            onClick={async () => {
              if (window.confirm('Tem certeza que deseja cancelar sua assinatura?')) {
                try {
                  await subscriptionService.cancel(subscription.id);
                  alert('Assinatura cancelada com sucesso');
                  loadSubscription();
                } catch (error) {
                  alert('Erro ao cancelar assinatura');
                }
              }
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            Cancelar Assinatura
          </button>
        )}
        {subscription.status === 'pending' && (
          <Link
            to={`/plans/${subscription.plan_type}/checkout`}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
          >
            Finalizar Pagamento
          </Link>
        )}
      </div>
    </div>
  );
};

export default SubscriptionInfo;
```

## 📋 Passo 3: Atualizar Dashboard

Atualize `frontend/src/pages/Dashboard.jsx`:

```jsx
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import SubscriptionInfo from '../components/SubscriptionInfo';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-700">MarcBuddy</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/plans"
                className="text-gray-700 hover:text-primary-600 transition-colors"
              >
                Planos
              </Link>
              <span className="text-gray-700">Olá, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Conteúdo principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600">Bem-vindo ao MarcBuddy!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informações da Assinatura */}
          <div className="lg:col-span-2">
            <SubscriptionInfo />
          </div>

          {/* Informações da Conta */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações da Conta</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Nome</p>
                <p className="font-medium text-gray-900">{user?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tipo de Conta</p>
                <p className="font-medium text-gray-900">
                  {user?.role === 'admin' ? 'Administrador' : 'Usuário'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
```

## 📋 Passo 4: Adicionar Hook para Atualizar Subscription

Crie `frontend/src/hooks/useSubscription.js` (opcional):

```jsx
import { useState, useEffect } from 'react';
import subscriptionService from '../services/subscription.service';

export const useSubscription = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      setLoading(true);
      const response = await subscriptionService.getActive();
      setSubscription(response.data.subscription);
      setError(null);
    } catch (err) {
      setSubscription(null);
      setError(err.response?.data?.message || 'Erro ao carregar assinatura');
    } finally {
      setLoading(false);
    }
  };

  return { subscription, loading, error, refetch: loadSubscription };
};
```

## 📋 Passo 5: Testar Dashboard

1. Inicie o servidor frontend:
```bash
cd frontend
npm run dev
```

2. Acesse `http://localhost:3000/dashboard`

3. Verifique:
   - [ ] Informações da assinatura aparecem (se tiver)
   - [ ] License key é exibida corretamente
   - [ ] Botão copiar funciona
   - [ ] Datas são formatadas corretamente
   - [ ] Status visual está correto
   - [ ] Botões de ação funcionam

## ✅ Checklist de Conclusão

- [x] Serviço de subscriptions criado
- [x] Componente SubscriptionInfo criado
- [x] Dashboard atualizado
- [x] Funcionalidade de copiar license key implementada
- [x] Formatação de datas implementada
- [x] Indicadores visuais de status implementados
- [x] Ações (atualizar/cancelar) implementadas
- [x] Tratamento de casos sem assinatura implementado

## 🐛 Problemas Comuns

### Subscription não aparece
- Verifique se o usuário tem assinatura ativa
- Confirme que o endpoint `/api/subscriptions/active` está funcionando
- Verifique o console do navegador para erros

### License key não copia
- Verifique se o navegador suporta `navigator.clipboard`
- Em caso de erro, use fallback com `document.execCommand`

### Datas incorretas
- Verifique o formato retornado pelo backend
- Confirme que está usando `toLocaleDateString` corretamente

---

**Próximo**: Seguir para `06-FASE2-TESTES_VALIDACAO.md` para testes e validação
