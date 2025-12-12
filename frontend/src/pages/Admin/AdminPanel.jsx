import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { BarChart3, FileText, DollarSign, CreditCard, Wrench, Users, Lock, Palette, Tag, Layers, Mail } from 'lucide-react';
import PlansManagement from '../../components/admin/PlansManagement';
import PaymentMethodsManagement from '../../components/admin/PaymentMethodsManagement';
import ToolsManagement from '../../components/admin/ToolsManagement';
import UsersManagement from '../../components/admin/UsersManagement';
import SubscriptionsManagement from '../../components/admin/SubscriptionsManagement';
import DesignManagement from '../../components/admin/design/DesignManagement';
import CouponsManagement from '../../components/admin/CouponsManagement';
import DesignAssets from '../../components/admin/DesignAssets';
import EmailDesignerAdmin from '../../components/admin/EmailDesignerAdmin';

const AdminPanel = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalActiveSubscriptions: 0,
    activeTools: 0,
    monthlyRevenue: '0.00'
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (activeTab === 'overview') {
      loadStats();
    }
  }, [activeTab]);

  const loadStats = async () => {
    try {
      setLoadingStats(true);
      const response = await api.get('/admin/stats');
      setStats(response.data.data);
      setLoadingStats(false);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      setLoadingStats(false);
    }
  };

  // Verificar se o usuário é admin
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <Lock className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2 font-nunito">Acesso Negado</h2>
          <p className="text-gray-600 font-poppins">
            Você não tem permissão para acessar esta área.
          </p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Visão Geral', icon: BarChart3 },
    { id: 'subscriptions', name: 'Assinaturas', icon: FileText },
    { id: 'plans', name: 'Planos', icon: DollarSign },
    { id: 'coupons', name: 'Cupons', icon: Tag },
    { id: 'payments', name: 'Pagamentos', icon: CreditCard },
    { id: 'tools', name: 'Ferramentas', icon: Wrench },
    { id: 'users', name: 'Usuários', icon: Users },
    { id: 'email-designer', name: 'Email Designer', icon: Mail },
    { id: 'design', name: 'Design/JS', icon: Palette },
    { id: 'design-assets', name: 'Design Assets', icon: Layers },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-brand-blue-900 mb-1 sm:mb-2 font-nunito">
            Painel Administrativo
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 font-poppins">
            Gerencie toda a plataforma MarcBuddy
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 sm:mb-6 overflow-x-auto">
          <div className="flex space-x-1 p-2 min-w-max">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 rounded-lg font-semibold transition-colors whitespace-nowrap font-nunito text-xs sm:text-base ${
                    activeTab === tab.id
                      ? 'bg-brand-green text-brand-blue-900'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title={tab.name}
                >
                  <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="hidden xs:inline sm:inline">{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className={`${activeTab === 'design' || activeTab === 'design-assets' ? 'p-0' : 'bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 xl:p-8'}`}>
          {activeTab === 'overview' && (
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-brand-blue-900 mb-3 sm:mb-4 font-nunito">
                Visão Geral
              </h2>
              {loadingStats ? (
                <div className="text-center py-6 sm:py-8 font-poppins text-sm sm:text-base">Carregando estatísticas...</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 sm:p-4 border border-blue-200">
                    <div className="text-xl sm:text-2xl font-bold text-blue-900 mb-1 font-nunito">{stats.totalUsers}</div>
                    <div className="text-xs sm:text-sm text-blue-700 font-poppins">Total de Usuários</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 sm:p-4 border border-green-200">
                    <div className="text-xl sm:text-2xl font-bold text-green-900 mb-1 font-nunito">{stats.totalActiveSubscriptions}</div>
                    <div className="text-xs sm:text-sm text-green-700 font-poppins">Assinaturas Ativas</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 sm:p-4 border border-purple-200">
                    <div className="text-xl sm:text-2xl font-bold text-purple-900 mb-1 font-nunito">{stats.activeTools}</div>
                    <div className="text-xs sm:text-sm text-purple-700 font-poppins">Ferramentas Ativas</div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3 sm:p-4 border border-orange-200">
                    <div className="text-xl sm:text-2xl font-bold text-orange-900 mb-1 font-nunito">R$ {parseFloat(stats.monthlyRevenue).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    <div className="text-xs sm:text-sm text-orange-700 font-poppins">Receita Mensal</div>
                  </div>
                </div>
              )}
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                <p className="text-xs sm:text-sm text-blue-800 font-poppins">
                  <strong>Bem-vindo ao Painel Administrativo!</strong> Use as abas acima para gerenciar diferentes aspectos da plataforma.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'subscriptions' && <SubscriptionsManagement />}
          {activeTab === 'plans' && <PlansManagement />}
          {activeTab === 'coupons' && <CouponsManagement />}
          {activeTab === 'payments' && <PaymentMethodsManagement />}
          {activeTab === 'tools' && <ToolsManagement />}
          {activeTab === 'users' && <UsersManagement />}
          {activeTab === 'email-designer' && <EmailDesignerAdmin />}
          {activeTab === 'design' && <DesignManagement />}
          {activeTab === 'design-assets' && <DesignAssets />}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

