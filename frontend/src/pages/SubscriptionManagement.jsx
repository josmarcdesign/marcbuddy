import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  CreditCard, 
  Calendar, 
  XCircle, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Copy,
  RefreshCw,
  ArrowLeft,
  Shield,
  FileText,
  Loader2
} from 'lucide-react';
import subscriptionService from '../services/subscription.service';
import api from '../services/api';
import logoMobile from '@assets/logos/Isotipo+tipografia.svg';

const SubscriptionManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(null);
  const [subscriptionHistory, setSubscriptionHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadData();
  }, [user, navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadActiveSubscription(),
        loadSubscriptionHistory()
      ]);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Erro ao carregar informações da assinatura');
    } finally {
      setLoading(false);
    }
  };

  const loadActiveSubscription = async () => {
    try {
      const response = await subscriptionService.getActive();
      if (response.success && response.data.subscription) {
        setSubscription(response.data.subscription);
      } else {
        setSubscription(null);
      }
    } catch (error) {
      setSubscription(null);
    }
  };

  const loadSubscriptionHistory = async () => {
    try {
      const response = await subscriptionService.getMySubscriptions();
      if (response.success && response.data.subscriptions) {
        setSubscriptionHistory(response.data.subscriptions);
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    }
  };

  const handleCopyLicenseKey = () => {
    if (subscription?.license_key) {
      navigator.clipboard.writeText(subscription.license_key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription) return;

    const confirmMessage = subscription.stripe_subscription_id
      ? 'Tem certeza que deseja cancelar sua assinatura? Ela permanecerá ativa até o final do período pago, mas não será renovada automaticamente.'
      : 'Tem certeza que deseja cancelar sua assinatura? Esta ação não pode ser desfeita.';

    if (!window.confirm(confirmMessage)) {
      return;
    }

    setCancelling(true);
    setError('');

    try {
      // Se tiver Stripe subscription, cancelar no Stripe também
      if (subscription.stripe_subscription_id) {
        await api.post(`/stripe/cancel-subscription`, {
          subscription_id: subscription.id
        });
      } else {
        // Cancelar assinatura tradicional
        await subscriptionService.cancel(subscription.id);
      }

      alert('Assinatura cancelada com sucesso!');
      await loadData();
    } catch (error) {
      console.error('Erro ao cancelar assinatura:', error);
      setError(error.response?.data?.message || 'Erro ao cancelar assinatura. Tente novamente.');
    } finally {
      setCancelling(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
      active: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
      expired: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status] || colors.pending;
  };

  const getStatusIcon = (status) => {
    const icons = {
      active: CheckCircle2,
      pending: Clock,
      cancelled: XCircle,
      expired: AlertCircle
    };
    return icons[status] || Clock;
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
      free: 'MBuddy Free',
      classic: 'MBuddy Classic',
      pro: 'MBuddy Pro',
      team: 'MBuddy Team'
    };
    return names[planType] || planType;
  };

  const getBillingCycleLabel = (cycle) => {
    const labels = {
      monthly: 'Mensal',
      annual: 'Anual',
      biennial: '2 Anos',
      triennial: '3 Anos'
    };
    return labels[cycle] || cycle;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-brand-green mx-auto mb-4" />
          <p className="text-sm text-gray-600 font-poppins">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-sm text-gray-600 hover:text-brand-green transition-colors font-poppins mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Voltar ao Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-brand-blue-900 mb-2 font-poppins font-medium">
                Gerenciamento de Assinatura
              </h1>
              <p className="text-gray-600 font-poppins">
                Gerencie sua assinatura, visualize histórico e atualize seu plano
              </p>
            </div>
            <img 
              src={logoMobile} 
              alt="MarcBuddy Logo" 
              className="h-8 w-auto"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            <span className="font-poppins">{error}</span>
          </div>
        )}

        {/* Assinatura Atual */}
        {subscription ? (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-brand-blue-900 font-poppins font-medium">
                Assinatura Atual
              </h2>
              {(() => {
                const StatusIcon = getStatusIcon(subscription.status);
                return (
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border-2 font-poppins ${getStatusColor(subscription.status)}`}>
                    <StatusIcon className="w-4 h-4" />
                    {getStatusLabel(subscription.status)}
                  </span>
                );
              })()}
            </div>

            {/* Informações do Plano */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="p-5 bg-gradient-to-br from-brand-green/5 to-brand-blue-900/5 rounded-lg border border-brand-green/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-brand-green/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-brand-green" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-poppins">Plano</p>
                    <p className="text-xl font-bold text-brand-blue-900 font-poppins font-medium">
                      {getPlanName(subscription.plan_type)}
                    </p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-600 font-poppins">
                    Período: <span className="font-semibold">{getBillingCycleLabel(subscription.billing_cycle)}</span>
                  </p>
                </div>
              </div>

              <div className="p-5 bg-gradient-to-br from-brand-blue-900/5 to-brand-green/5 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-poppins">Próxima Renovação</p>
                    <p className="text-xl font-bold text-brand-blue-900 font-poppins font-medium">
                      {formatDate(subscription.renewal_date)}
                    </p>
                    {(() => {
                      const days = getDaysUntilRenewal(subscription.renewal_date);
                      return days !== null && days > 0 ? (
                        <p className="text-xs text-brand-green font-semibold mt-1 font-poppins">
                          {days} dias restantes
                        </p>
                      ) : null;
                    })()}
                  </div>
                </div>
              </div>
            </div>

            {/* License Key */}
            <div className="mb-6 p-5 bg-gradient-to-br from-brand-blue-900/5 to-brand-green/5 rounded-lg border border-gray-200">
              <label className="block text-sm font-semibold text-brand-blue-900 mb-3 font-poppins">
                License Key
              </label>
              <div className="flex items-center gap-2">
                <code className="flex-1 font-mono text-sm text-brand-blue-900 bg-white p-3 rounded-lg border-2 border-gray-200 font-semibold font-poppins">
                  {subscription.license_key}
                </code>
                <button
                  onClick={handleCopyLicenseKey}
                  className="px-4 py-3 bg-brand-green text-brand-blue-900 rounded-lg hover:bg-brand-green-500 transition-colors text-sm font-semibold font-poppins font-medium flex items-center gap-2"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copiar
                    </>
                  )}
                </button>
              </div>
              <p className="mt-3 text-xs text-gray-600 font-poppins">
                Use esta chave para ativar o software MarcBuddy
              </p>
            </div>

            {/* Informações de Pagamento */}
            {subscription.stripe_subscription_id && (
              <div className="mb-6 p-5 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <h3 className="text-sm font-semibold text-blue-900 font-poppins">
                    Pagamento via Stripe
                  </h3>
                </div>
                <p className="text-xs text-blue-700 font-poppins">
                  Sua assinatura é gerenciada automaticamente pelo Stripe. O pagamento será processado automaticamente na data de renovação.
                </p>
              </div>
            )}

            {/* Datas Detalhadas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 font-poppins mb-1">Data de Início</p>
                <p className="text-sm font-bold text-brand-blue-900 font-poppins font-medium">
                  {formatDate(subscription.subscription_start_date)}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 font-poppins mb-1">Data de Expiração</p>
                <p className="text-sm font-bold text-brand-blue-900 font-poppins font-medium">
                  {subscription.subscription_end_date ? formatDate(subscription.subscription_end_date) : 'Não expira'}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 font-poppins mb-1">Criada em</p>
                <p className="text-sm font-bold text-brand-blue-900 font-poppins font-medium">
                  {formatDateTime(subscription.created_at)}
                </p>
              </div>
            </div>

            {/* Ações */}
            <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200">
              <Link
                to="/plans"
                className="px-6 py-3 bg-brand-green text-brand-blue-900 rounded-lg hover:bg-brand-green-500 transition-colors text-sm font-semibold font-poppins font-medium flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Atualizar Plano
              </Link>
              {subscription.status === 'active' && (
                <button
                  onClick={handleCancelSubscription}
                  disabled={cancelling}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold font-poppins disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {cancelling ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Cancelando...
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      Cancelar Assinatura
                    </>
                  )}
                </button>
              )}
              {subscription.status === 'pending' && (
                <Link
                  to={`/plans/${subscription.plan_type}/checkout`}
                  className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-semibold font-poppins font-medium flex items-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  Finalizar Pagamento
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 mb-6 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-brand-blue-900 mb-2 font-poppins font-medium">
              Nenhuma Assinatura Ativa
            </h3>
            <p className="text-gray-600 mb-6 font-poppins">
              Você ainda não possui uma assinatura ativa. Escolha um plano para começar.
            </p>
            <Link
              to="/plans"
              className="inline-block bg-brand-green text-brand-blue-900 px-6 py-3 rounded-lg font-semibold hover:bg-brand-green-500 transition-colors font-poppins font-medium"
            >
              Ver Planos
            </Link>
          </div>
        )}

        {/* Histórico de Assinaturas */}
        {subscriptionHistory.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-2xl font-bold text-brand-blue-900 mb-6 font-poppins font-medium">
              Histórico de Assinaturas
            </h2>
            <div className="space-y-4">
              {subscriptionHistory.map((sub) => {
                const StatusIcon = getStatusIcon(sub.status);
                return (
                  <div
                    key={sub.id}
                    className="p-5 border-2 rounded-lg hover:shadow-md transition-shadow"
                    style={{ borderColor: sub.id === subscription?.id ? '#87c508' : '#e5e7eb' }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          sub.status === 'active' ? 'bg-green-100' :
                          sub.status === 'pending' ? 'bg-yellow-100' :
                          sub.status === 'cancelled' ? 'bg-red-100' :
                          'bg-gray-100'
                        }`}>
                          <StatusIcon className={`w-5 h-5 ${
                            sub.status === 'active' ? 'text-green-600' :
                            sub.status === 'pending' ? 'text-yellow-600' :
                            sub.status === 'cancelled' ? 'text-red-600' :
                            'text-gray-600'
                          }`} />
                        </div>
                        <div>
                          <p className="font-bold text-brand-blue-900 font-poppins font-medium">
                            {getPlanName(sub.plan_type)}
                          </p>
                          <p className="text-xs text-gray-600 font-poppins">
                            {formatDateTime(sub.created_at)}
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border-2 font-poppins ${getStatusColor(sub.status)}`}>
                        {getStatusLabel(sub.status)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-gray-600 font-poppins">Período</p>
                        <p className="font-semibold text-brand-blue-900 font-poppins font-medium">
                          {getBillingCycleLabel(sub.billing_cycle)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-poppins">Início</p>
                        <p className="font-semibold text-brand-blue-900 font-poppins font-medium">
                          {formatDate(sub.subscription_start_date)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-poppins">Renovação</p>
                        <p className="font-semibold text-brand-blue-900 font-poppins font-medium">
                          {formatDate(sub.renewal_date) || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-poppins">Expiração</p>
                        <p className="font-semibold text-brand-blue-900 font-poppins font-medium">
                          {formatDate(sub.subscription_end_date) || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionManagement;
