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
    classic: 'MBuddy Classic',
    pro: 'MBuddy Pro',
    team: 'MBuddy Team'
    };
    return names[planType] || planType;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green" style={{ borderColor: '#87c508' }}></div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-brand-green/10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(135, 197, 8, 0.1)' }}>
            <svg className="w-6 h-6 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#87c508' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-brand-blue-900 font-poppins font-medium" style={{ color: '#011526' }}>Sua Assinatura</h3>
        </div>
        <p className="text-gray-600 mb-6 font-poppins">
          Você ainda não possui uma assinatura ativa.
        </p>
        <Link
          to="/plans"
          className="inline-block bg-brand-green text-brand-blue-900 px-6 py-3 rounded-lg font-semibold hover:bg-brand-green-500 transition-colors font-poppins font-medium"
          style={{ backgroundColor: '#87c508', color: '#011526' }}
        >
          Escolher um Plano
        </Link>
      </div>
    );
  }

  const daysUntilRenewal = getDaysUntilRenewal(subscription.renewal_date);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-green/10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(135, 197, 8, 0.1)' }}>
            <svg className="w-6 h-6 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#87c508' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-brand-blue-900 font-poppins font-medium" style={{ color: '#011526' }}>Sua Assinatura</h3>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold font-poppins ${getStatusColor(subscription.status)}`}>
          {getStatusLabel(subscription.status)}
        </span>
      </div>

      {/* Plano Ativo */}
      <div className="mb-6 p-4 bg-gradient-to-r from-brand-green/5 to-brand-blue-900/5 rounded-lg border border-brand-green/20" style={{ background: 'linear-gradient(to right, rgba(135, 197, 8, 0.05), rgba(1, 21, 38, 0.05))', borderColor: 'rgba(135, 197, 8, 0.2)' }}>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-bold text-brand-blue-900 mb-1 font-poppins font-medium" style={{ color: '#011526' }}>
              Plano {getPlanName(subscription.plan_type)}
            </h4>
            <p className="text-sm text-gray-600 font-poppins">Plano ativo</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold font-poppins ${
            subscription.plan_type === 'pro' || subscription.plan_type === 'team'
              ? 'bg-purple-100 text-purple-800'
              : subscription.plan_type === 'classic'
              ? 'bg-blue-100 text-blue-800'
              : subscription.plan_type === 'free'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {subscription.plan_type.toUpperCase()}
          </span>
        </div>
      </div>

      {/* License Key */}
      <div className="mb-6 p-5 bg-gradient-to-br from-brand-blue-900/5 to-brand-green/5 rounded-lg border border-gray-200" style={{ background: 'linear-gradient(to bottom right, rgba(1, 21, 38, 0.05), rgba(135, 197, 8, 0.05))' }}>
        <label className="block text-sm font-semibold text-brand-blue-900 mb-3 font-poppins" style={{ color: '#011526' }}>
          🔑 License Key
        </label>
        <div className="flex items-center gap-2">
          <code className="flex-1 font-mono text-sm text-brand-blue-900 bg-white p-3 rounded-lg border-2 border-gray-200 font-semibold" style={{ color: '#011526' }}>
            {subscription.license_key}
          </code>
          <button
            onClick={handleCopyLicenseKey}
            className="px-4 py-3 bg-brand-green text-brand-blue-900 rounded-lg hover:bg-brand-green-500 transition-colors text-sm font-semibold font-poppins font-medium shadow-md"
            style={{ backgroundColor: '#87c508', color: '#011526' }}
          >
            {copied ? '✓ Copiado' : 'Copiar'}
          </button>
        </div>
        <p className="mt-3 text-xs text-gray-600 font-poppins">
          Use esta chave para ativar o software MarcBuddy
        </p>
      </div>

      {/* Datas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#87c508' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm font-medium text-gray-600 font-poppins">Data de Início</p>
          </div>
          <p className="font-bold text-brand-blue-900 text-lg font-poppins font-medium" style={{ color: '#011526' }}>
            {formatDate(subscription.start_date)}
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium text-gray-600 font-poppins">Próxima Renovação</p>
          </div>
          <p className="font-bold text-brand-blue-900 text-lg font-poppins font-medium" style={{ color: '#011526' }}>
            {formatDate(subscription.renewal_date)}
          </p>
          {daysUntilRenewal !== null && daysUntilRenewal > 0 && (
            <p className="text-xs text-brand-green font-semibold mt-1 font-poppins" style={{ color: '#87c508' }}>
              {daysUntilRenewal} dias restantes
            </p>
          )}
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium text-gray-600 font-poppins">Data de Expiração</p>
          </div>
          <p className="font-bold text-brand-blue-900 text-lg font-poppins font-medium" style={{ color: '#011526' }}>
            {formatDate(subscription.end_date) || 'Não expira'}
          </p>
        </div>
      </div>

      {/* Ações */}
      <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
        <Link
          to="/plans"
          className="px-6 py-3 bg-brand-green text-brand-blue-900 rounded-lg hover:bg-brand-green-500 transition-colors text-sm font-semibold font-poppins font-medium shadow-md"
          style={{ backgroundColor: '#87c508', color: '#011526' }}
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
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold font-poppins shadow-md"
          >
            Cancelar Assinatura
          </button>
        )}
        {subscription.status === 'pending' && (
          <Link
            to={`/plans/${subscription.plan_type}/checkout`}
            className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-semibold font-poppins shadow-md"
          >
            Finalizar Pagamento
          </Link>
        )}
      </div>
    </div>
  );
};

export default SubscriptionInfo;

