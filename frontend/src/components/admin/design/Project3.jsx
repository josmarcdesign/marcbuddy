import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { 
  Sparkles,
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  Zap,
  Activity,
  BarChart3,
  PieChart,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Settings,
  Bell,
  Search,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';
import { BRAND_COLORS, BRAND_TYPOGRAPHY } from '../../../config/brand';

const Project3 = ({ isFullscreen = false }) => {
  const cardsRef = useRef(null);
  const [customization, setCustomization] = useState({
    primaryColor: BRAND_COLORS.primary.green.hex,
    secondaryColor: BRAND_COLORS.primary.blue.hex,
    backgroundColor: '#F5F5F5',
    textColor: BRAND_COLORS.primary.blue.hex,
    fontFamily: BRAND_TYPOGRAPHY.primary.family,
    showCustomization: false
  });

  const stats = [
    {
      title: 'Total de Usuários',
      value: '2,543',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: '#3B82F6'
    },
    {
      title: 'Ferramentas Utilizadas',
      value: '1,247',
      change: '+8.2%',
      trend: 'up',
      icon: Zap,
      color: '#87c508'
    },
    {
      title: 'Projetos Criados',
      value: '3,891',
      change: '+15.3%',
      trend: 'up',
      icon: FileText,
      color: '#8B5CF6'
    },
    {
      title: 'Taxa de Conversão',
      value: '68.4%',
      change: '-2.1%',
      trend: 'down',
      icon: TrendingUp,
      color: '#EF4444'
    }
  ];

  const recentActivities = [
    { id: 1, user: 'João Silva', action: 'Criou um novo projeto', time: '2 min atrás', type: 'create' },
    { id: 2, user: 'Maria Santos', action: 'Completou uma tarefa', time: '15 min atrás', type: 'complete' },
    { id: 3, user: 'Pedro Costa', action: 'Atualizou perfil', time: '1 hora atrás', type: 'update' },
    { id: 4, user: 'Ana Oliveira', action: 'Compartilhou projeto', time: '2 horas atrás', type: 'share' },
    { id: 5, user: 'Carlos Souza', action: 'Finalizou assinatura', time: '3 horas atrás', type: 'complete' }
  ];

  const quickActions = [
    { id: 1, title: 'Criar Projeto', icon: FileText, color: customization.primaryColor },
    { id: 2, title: 'Nova Ferramenta', icon: Zap, color: '#3B82F6' },
    { id: 3, title: 'Ver Relatórios', icon: BarChart3, color: '#8B5CF6' },
    { id: 4, title: 'Configurações', icon: Settings, color: '#6B7280' }
  ];

  useEffect(() => {
    if (cardsRef.current) {
      const cards = cardsRef.current.querySelectorAll('.stat-card');
      if (cards.length > 0) {
        // Resetar posição inicial
        gsap.set(cards, { opacity: 0, y: 30 });
        // Animar entrada
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          delay: 0.1
        });
      }
    }
  }, []);

  const toggleCustomization = () => {
    setCustomization(prev => ({ ...prev, showCustomization: !prev.showCustomization }));
  };

  const resetToBrand = () => {
    setCustomization({
      primaryColor: BRAND_COLORS.primary.green.hex,
      secondaryColor: BRAND_COLORS.primary.blue.hex,
      backgroundColor: '#F5F5F5',
      textColor: BRAND_COLORS.primary.blue.hex,
      fontFamily: BRAND_TYPOGRAPHY.primary.family,
      showCustomization: customization.showCustomization
    });
  };

  return (
    <div 
      className={`${isFullscreen ? 'h-screen' : 'h-[calc(100vh-200px)]'} flex flex-col overflow-hidden ${isFullscreen ? '' : 'rounded-lg shadow-lg'} relative`}
      style={{
        backgroundColor: customization.backgroundColor || '#F5F5F5',
        color: customization.textColor,
        fontFamily: customization.fontFamily
      }}
    >
      {/* Customization Panel */}
      {customization.showCustomization && (
        <div 
          className="absolute top-0 right-0 w-80 h-full bg-white shadow-2xl z-50 p-6 overflow-y-auto border-l"
          style={{ borderColor: `${customization.textColor}20` }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold" style={{ fontFamily: customization.fontFamily }}>
              Personalização
            </h3>
            <button
              onClick={toggleCustomization}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
            >
              <span className="text-xl">×</span>
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Cor Primária</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={customization.primaryColor}
                  onChange={(e) => setCustomization(prev => ({ ...prev, primaryColor: e.target.value }))}
                  className="w-12 h-12 rounded border cursor-pointer"
                />
                <input
                  type="text"
                  value={customization.primaryColor}
                  onChange={(e) => setCustomization(prev => ({ ...prev, primaryColor: e.target.value }))}
                  className="flex-1 px-3 py-2 border rounded"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Cor Secundária</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={customization.secondaryColor}
                  onChange={(e) => setCustomization(prev => ({ ...prev, secondaryColor: e.target.value }))}
                  className="w-12 h-12 rounded border cursor-pointer"
                />
                <input
                  type="text"
                  value={customization.secondaryColor}
                  onChange={(e) => setCustomization(prev => ({ ...prev, secondaryColor: e.target.value }))}
                  className="flex-1 px-3 py-2 border rounded"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Cor de Fundo</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={customization.backgroundColor}
                  onChange={(e) => setCustomization(prev => ({ ...prev, backgroundColor: e.target.value }))}
                  className="w-12 h-12 rounded border cursor-pointer"
                />
                <input
                  type="text"
                  value={customization.backgroundColor}
                  onChange={(e) => setCustomization(prev => ({ ...prev, backgroundColor: e.target.value }))}
                  className="flex-1 px-3 py-2 border rounded"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Cor do Texto</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={customization.textColor}
                  onChange={(e) => setCustomization(prev => ({ ...prev, textColor: e.target.value }))}
                  className="w-12 h-12 rounded border cursor-pointer"
                />
                <input
                  type="text"
                  value={customization.textColor}
                  onChange={(e) => setCustomization(prev => ({ ...prev, textColor: e.target.value }))}
                  className="flex-1 px-3 py-2 border rounded"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Fonte</label>
              <select
                value={customization.fontFamily}
                onChange={(e) => setCustomization(prev => ({ ...prev, fontFamily: e.target.value }))}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="Nunito, sans-serif">Nunito</option>
                <option value="Poppins, sans-serif">Poppins</option>
                <option value="Inter, sans-serif">Inter</option>
                <option value="Roboto, sans-serif">Roboto</option>
              </select>
            </div>
            <button
              onClick={resetToBrand}
              className="w-full px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              Restaurar Identidade da Marca
            </button>
          </div>
        </div>
      )}

      {/* Scrollable Content Container */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {/* Header */}
        <div 
          className="sticky top-0 z-40 px-6 py-4 border-b backdrop-blur-md"
          style={{ 
            backgroundColor: `${customization.backgroundColor || '#F5F5F5'}F5`,
            borderColor: `${customization.textColor}10`
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 
                className="text-2xl font-bold mb-1"
                style={{ 
                  color: customization.secondaryColor,
                  fontFamily: customization.fontFamily
                }}
              >
                Dashboard
              </h1>
              <p 
                className="text-sm opacity-70"
                style={{ fontFamily: customization.fontFamily }}
              >
                Visão geral do seu desempenho
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                title="Atualizar"
              >
                <RefreshCw className="w-5 h-5" style={{ color: customization.textColor }} />
              </button>
              <button
                onClick={toggleCustomization}
                className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                title="Personalizar"
              >
                <Sparkles className="w-5 h-5" style={{ color: customization.primaryColor }} />
              </button>
              <button
                className="p-2 rounded-lg hover:bg-gray-200 transition-colors relative"
                title="Notificações"
              >
                <Bell className="w-5 h-5" style={{ color: customization.textColor }} />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ backgroundColor: customization.primaryColor }}></span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-6">
          {/* Stats Cards */}
          <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              const TrendIcon = stat.trend === 'up' ? ArrowUpRight : ArrowDownRight;
              return (
                <div
                  key={index}
                  className="stat-card bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group"
                  onMouseEnter={(e) => {
                    gsap.killTweensOf(e.currentTarget);
                    gsap.to(e.currentTarget, {
                      y: -4,
                      duration: 0.2,
                      ease: 'power2.out'
                    });
                  }}
                  onMouseLeave={(e) => {
                    gsap.killTweensOf(e.currentTarget);
                    gsap.to(e.currentTarget, {
                      y: 0,
                      duration: 0.2,
                      ease: 'power2.out'
                    });
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${stat.color}15` }}
                    >
                      <IconComponent className="w-6 h-6" style={{ color: stat.color }} />
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-semibold ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <TrendIcon className="w-4 h-4" />
                      {stat.change}
                    </div>
                  </div>
                  <h3 
                    className="text-sm font-medium opacity-70 mb-1"
                    style={{ fontFamily: customization.fontFamily }}
                  >
                    {stat.title}
                  </h3>
                  <p 
                    className="text-2xl font-bold"
                    style={{ 
                      color: customization.secondaryColor,
                      fontFamily: customization.fontFamily
                    }}
                  >
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Charts and Activities Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Performance Chart */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 
                    className="text-lg font-bold"
                    style={{ 
                      color: customization.secondaryColor,
                      fontFamily: customization.fontFamily
                    }}
                  >
                    Desempenho
                  </h2>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Filter className="w-4 h-4" style={{ color: customization.textColor }} />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Download className="w-4 h-4" style={{ color: customization.textColor }} />
                    </button>
                  </div>
                </div>
                <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg" style={{ borderColor: `${customization.textColor}20` }}>
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-30" style={{ color: customization.textColor }} />
                    <p className="text-sm opacity-50" style={{ fontFamily: customization.fontFamily }}>
                      Gráfico de desempenho
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 
                  className="text-lg font-bold mb-4"
                  style={{ 
                    color: customization.secondaryColor,
                    fontFamily: customization.fontFamily
                  }}
                >
                  Ações Rápidas
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {quickActions.map((action) => {
                    const IconComponent = action.icon;
                    return (
                      <button
                        key={action.id}
                        className="flex flex-col items-center gap-3 p-4 rounded-lg border-2 hover:border-opacity-50 transition-all group"
                        style={{
                          borderColor: `${action.color}30`,
                          backgroundColor: `${action.color}05`
                        }}
                        onMouseEnter={(e) => {
                          gsap.to(e.currentTarget, {
                            scale: 1.05,
                            duration: 0.2,
                            ease: 'power2.out'
                          });
                        }}
                        onMouseLeave={(e) => {
                          gsap.to(e.currentTarget, {
                            scale: 1,
                            duration: 0.2,
                            ease: 'power2.out'
                          });
                        }}
                      >
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${action.color}20` }}
                        >
                          <IconComponent className="w-5 h-5" style={{ color: action.color }} />
                        </div>
                        <span 
                          className="text-xs font-semibold text-center"
                          style={{ 
                            color: customization.textColor,
                            fontFamily: customization.fontFamily
                          }}
                        >
                          {action.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 
                  className="text-lg font-bold"
                  style={{ 
                    color: customization.secondaryColor,
                    fontFamily: customization.fontFamily
                  }}
                >
                  Atividades Recentes
                </h2>
                <button className="text-xs font-semibold" style={{ color: customization.primaryColor }}>
                  Ver todas
                </button>
              </div>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${customization.primaryColor}20` }}
                    >
                      <CheckCircle2 className="w-4 h-4" style={{ color: customization.primaryColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p 
                        className="text-sm font-semibold mb-1"
                        style={{ 
                          color: customization.secondaryColor,
                          fontFamily: customization.fontFamily
                        }}
                      >
                        {activity.user}
                      </p>
                      <p 
                        className="text-xs opacity-70 mb-1"
                        style={{ fontFamily: customization.fontFamily }}
                      >
                        {activity.action}
                      </p>
                      <p 
                        className="text-xs opacity-50"
                        style={{ fontFamily: customization.fontFamily }}
                      >
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Usage Stats */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 
                className="text-sm font-semibold mb-4 opacity-70"
                style={{ fontFamily: customization.fontFamily }}
              >
                Uso de Ferramentas
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs" style={{ fontFamily: customization.fontFamily }}>ColorBuddy</span>
                    <span className="text-xs font-semibold" style={{ color: customization.primaryColor }}>85%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all"
                      style={{ 
                        width: '85%',
                        backgroundColor: customization.primaryColor
                      }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs" style={{ fontFamily: customization.fontFamily }}>Compressor</span>
                    <span className="text-xs font-semibold" style={{ color: '#3B82F6' }}>62%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all"
                      style={{ 
                        width: '62%',
                        backgroundColor: '#3B82F6'
                      }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs" style={{ fontFamily: customization.fontFamily }}>Renomeador</span>
                    <span className="text-xs font-semibold" style={{ color: '#8B5CF6' }}>43%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all"
                      style={{ 
                        width: '43%',
                        backgroundColor: '#8B5CF6'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 
                className="text-sm font-semibold mb-4 opacity-70"
                style={{ fontFamily: customization.fontFamily }}
              >
                Status do Sistema
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ fontFamily: customization.fontFamily }}>Servidor</span>
                  <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    Online
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ fontFamily: customization.fontFamily }}>API</span>
                  <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    Operacional
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ fontFamily: customization.fontFamily }}>Banco de Dados</span>
                  <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    Conectado
                  </span>
                </div>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 
                className="text-sm font-semibold mb-4 opacity-70"
                style={{ fontFamily: customization.fontFamily }}
              >
                Próximos Eventos
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${customization.primaryColor}20` }}
                  >
                    <Calendar className="w-5 h-5" style={{ color: customization.primaryColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold" style={{ fontFamily: customization.fontFamily }}>
                      Atualização do Sistema
                    </p>
                    <p className="text-xs opacity-50" style={{ fontFamily: customization.fontFamily }}>
                      Em 2 dias
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${customization.primaryColor}20` }}
                  >
                    <Clock className="w-5 h-5" style={{ color: customization.primaryColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold" style={{ fontFamily: customization.fontFamily }}>
                      Backup Automático
                    </p>
                    <p className="text-xs opacity-50" style={{ fontFamily: customization.fontFamily }}>
                      Hoje às 23:00
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Project3;
