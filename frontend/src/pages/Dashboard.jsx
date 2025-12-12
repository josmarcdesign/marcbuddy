import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { gsap } from 'gsap';
import { 
  Zap,
  Download,
  MessageSquare,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Palette,
  Minimize2,
  FileEdit,
  Settings,
  Bell,
  BookOpen,
  Image as ImageIcon,
  FileText,
  User
} from 'lucide-react';
import subscriptionService from '../services/subscription.service';
import { BRAND_COLORS } from '../config/brand';

const Dashboard = () => {
  const { user } = useAuth();
  const cardsRef = useRef(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubscription();
  }, []);

  useEffect(() => {
    if (cardsRef.current) {
      const cards = cardsRef.current.querySelectorAll('.stat-card');
      if (cards.length > 0) {
        gsap.set(cards, { opacity: 0, y: 30 });
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
  }, [loading]);

  const loadSubscription = async () => {
    try {
      const response = await subscriptionService.getActive();
      setSubscription(response.data.subscription);
    } catch (error) {
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  const getPlanName = (planType) => {
    const names = {
      basic: 'MBuddy Classic',
      premium: 'MBuddy Pro',
      enterprise: 'MBuddy Team',
      free: 'Gratuito'
    };
    return names[planType] || planType;
  };

  const getPlanFeatures = (planType) => {
    const features = {
      basic: ['Todos os plugins', 'Ferramentas web', 'Chat #geral e #tutoriais', 'WhatsApp Pro'],
      premium: ['Todos os plugins', 'Ferramentas web', 'Chat completo', 'WhatsApp Pro', 'Beta access'],
      enterprise: ['Todos os plugins', 'Ferramentas web', 'Chat completo', 'WhatsApp Pro', 'Beta access', 'Até 5 usuários'],
      free: ['Plugin básico', '2-3 ferramentas web', 'Chat #geral (leitura)']
    };
    return features[planType] || [];
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const tools = [
    { 
      id: 1, 
      name: 'ColorBuddy', 
      icon: Palette, 
      description: 'Extrator de cores', 
      status: 'available', 
      link: '/ferramentas/colorbuddy'
    },
    { 
      id: 2, 
      name: 'Compressor', 
      icon: Minimize2, 
      description: 'Otimização de imagens', 
      status: 'coming_soon', 
      link: '/ferramentas'
    },
    { 
      id: 3, 
      name: 'Renomeador', 
      icon: FileEdit, 
      description: 'Renomeação em lote', 
      status: 'coming_soon', 
      link: '/ferramentas'
    }
  ];

  const plugins = [
    { id: 1, name: 'Illustrator Plugin', version: '2.1.0', status: subscription ? 'available' : 'not_available', key: subscription?.license_key || null },
    { id: 2, name: 'Photoshop Plugin', version: '1.8.5', status: subscription ? 'available' : 'not_available', key: subscription?.license_key || null },
    { id: 3, name: 'Figma Plugin', version: '3.0.2', status: subscription ? 'available' : 'not_available', key: subscription?.license_key || null }
  ];

  const recentContent = [
    { id: 1, title: 'Tutorial: Otimização de Cores', type: 'tutorial', downloads: 124 },
    { id: 2, title: 'Brush Pack - Texturas', type: 'brush', downloads: 89 },
    { id: 3, title: 'Template - Apresentação', type: 'template', downloads: 156 }
  ];

  const chatRooms = [
    { id: 1, name: '#geral', access: subscription ? 'read' : 'read', unread: 3 },
    { id: 2, name: '#tutoriais', access: subscription ? 'write' : 'read', unread: 0 },
    { id: 3, name: '#dúvidas', access: subscription ? 'write' : 'read', unread: 1 }
  ];

  const primaryColor = BRAND_COLORS.primary.green.hex;
  const secondaryColor = BRAND_COLORS.primary.blue.hex;
  const backgroundColor = '#F5F5F5';

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-white flex items-center justify-center" style={{ backgroundColor }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: primaryColor }}></div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex flex-col overflow-hidden relative"
      style={{ backgroundColor }}
    >
      {/* Scrollable Content Container */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {/* Header */}
        <div 
          className="sticky top-0 z-40 px-4 sm:px-6 lg:px-8 py-4 border-b backdrop-blur-md"
          style={{ 
            backgroundColor: `${backgroundColor}F5`,
            borderColor: `${secondaryColor}10`
          }}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h1 
                className="text-2xl sm:text-3xl font-bold mb-1 font-nunito"
                style={{ 
                  color: secondaryColor
                }}
              >
                Meu Dashboard
              </h1>
              <p 
                className="text-sm opacity-70 font-poppins"
              >
                Bem-vindo de volta, {user?.name}! Gerencie suas ferramentas e plugins
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/settings"
                className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                title="Configurações"
              >
                <Settings className="w-5 h-5" style={{ color: secondaryColor }} />
              </Link>
              <button
                className="p-2 rounded-lg hover:bg-gray-200 transition-colors relative"
                title="Notificações"
              >
                <Bell className="w-5 h-5" style={{ color: secondaryColor }} />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }}></span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Plan Status Card */}
          {subscription ? (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 
                    className="text-lg font-bold mb-1 font-nunito"
                    style={{ 
                      color: secondaryColor
                    }}
                  >
                    Plano: {getPlanName(subscription.plan_type)}
                  </h2>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                    <span 
                      className="text-sm font-semibold font-poppins"
                      style={{ color: primaryColor }}
                    >
                      {subscription.status === 'active' ? 'Ativo' : subscription.status === 'pending' ? 'Pendente' : 'Inativo'}
                    </span>
                    <span className="text-sm opacity-50">•</span>
                    <span className="text-sm opacity-70 font-poppins">
                      {subscription.renewal_date 
                        ? `Válido até ${formatDate(subscription.renewal_date)}`
                        : 'Sem data de renovação'}
                    </span>
                  </div>
                </div>
                <Link
                  to="/subscription"
                  className="px-4 py-2 rounded-lg font-semibold text-sm transition-all font-nunito"
                  style={{
                    backgroundColor: primaryColor,
                    color: secondaryColor
                  }}
                >
                  Gerenciar Assinatura
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                {getPlanFeatures(subscription.plan_type).map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" style={{ color: primaryColor }} />
                    <span className="text-xs font-poppins">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 
                    className="text-lg font-bold mb-1 font-nunito"
                    style={{ 
                      color: secondaryColor
                    }}
                  >
                    Nenhum plano ativo
                  </h2>
                  <p className="text-sm opacity-70 font-poppins">
                    Escolha um plano para desbloquear todas as funcionalidades
                  </p>
                </div>
                <Link
                  to="/plans"
                  className="px-4 py-2 rounded-lg font-semibold text-sm transition-all font-nunito"
                  style={{
                    backgroundColor: primaryColor,
                    color: secondaryColor
                  }}
                >
                  Escolher Plano
                </Link>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              className="stat-card bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
              onMouseEnter={(e) => {
                gsap.killTweensOf(e.currentTarget);
                gsap.to(e.currentTarget, { y: -4, duration: 0.2, ease: 'power2.out' });
              }}
              onMouseLeave={(e) => {
                gsap.killTweensOf(e.currentTarget);
                gsap.to(e.currentTarget, { y: 0, duration: 0.2, ease: 'power2.out' });
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <Zap className="w-5 h-5" style={{ color: primaryColor }} />
                <span className="text-xs font-semibold font-poppins" style={{ color: primaryColor }}>{tools.filter(t => t.status === 'available').length}</span>
              </div>
              <h3 className="text-xs font-medium opacity-70 mb-1 font-poppins">
                Ferramentas
              </h3>
              <p className="text-lg font-bold font-nunito" style={{ color: secondaryColor }}>
                Disponíveis
              </p>
            </div>

            <div
              className="stat-card bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
              onMouseEnter={(e) => {
                gsap.killTweensOf(e.currentTarget);
                gsap.to(e.currentTarget, { y: -4, duration: 0.2, ease: 'power2.out' });
              }}
              onMouseLeave={(e) => {
                gsap.killTweensOf(e.currentTarget);
                gsap.to(e.currentTarget, { y: 0, duration: 0.2, ease: 'power2.out' });
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <Download className="w-5 h-5" style={{ color: '#3B82F6' }} />
                <span className="text-xs font-semibold font-poppins" style={{ color: '#3B82F6' }}>
                  {plugins.filter(p => p.status === 'available').length}
                </span>
              </div>
              <h3 className="text-xs font-medium opacity-70 mb-1 font-poppins">
                Plugins
              </h3>
              <p className="text-lg font-bold font-nunito" style={{ color: secondaryColor }}>
                {subscription ? 'Disponíveis' : 'Bloqueados'}
              </p>
            </div>

            <div
              className="stat-card bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
              onMouseEnter={(e) => {
                gsap.killTweensOf(e.currentTarget);
                gsap.to(e.currentTarget, { y: -4, duration: 0.2, ease: 'power2.out' });
              }}
              onMouseLeave={(e) => {
                gsap.killTweensOf(e.currentTarget);
                gsap.to(e.currentTarget, { y: 0, duration: 0.2, ease: 'power2.out' });
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <MessageSquare className="w-5 h-5" style={{ color: '#8B5CF6' }} />
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full font-poppins" style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}>
                  {chatRooms.reduce((acc, room) => acc + room.unread, 0)}
                </span>
              </div>
              <h3 className="text-xs font-medium opacity-70 mb-1 font-poppins">
                Mensagens
              </h3>
              <p className="text-lg font-bold font-nunito" style={{ color: secondaryColor }}>
                Não lidas
              </p>
            </div>

            <div
              className="stat-card bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
              onMouseEnter={(e) => {
                gsap.killTweensOf(e.currentTarget);
                gsap.to(e.currentTarget, { y: -4, duration: 0.2, ease: 'power2.out' });
              }}
              onMouseLeave={(e) => {
                gsap.killTweensOf(e.currentTarget);
                gsap.to(e.currentTarget, { y: 0, duration: 0.2, ease: 'power2.out' });
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-5 h-5" style={{ color: '#10B981' }} />
              </div>
              <h3 className="text-xs font-medium opacity-70 mb-1 font-poppins">
                Uso Total
              </h3>
              <p className="text-lg font-bold font-nunito" style={{ color: secondaryColor }}>
                {subscription ? 'Ativo' : 'Gratuito'}
              </p>
            </div>
          </div>

          {/* Tools and Plugins Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Ferramentas Web */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 
                  className="text-lg font-bold font-nunito"
                  style={{ 
                    color: secondaryColor
                  }}
                >
                  Ferramentas Web
                </h2>
                <Link to="/ferramentas" className="text-xs font-semibold font-poppins" style={{ color: primaryColor }}>
                  Ver todas
                </Link>
              </div>
              <div className="space-y-3">
                {tools.map((tool) => {
                  const IconComponent = tool.icon;
                  return (
                    <Link
                      key={tool.id}
                      to={tool.link}
                      className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${primaryColor}15` }}
                        >
                          <IconComponent className="w-5 h-5" style={{ color: primaryColor }} />
                        </div>
                        <div>
                          <h3 
                            className="text-sm font-semibold font-nunito"
                            style={{ 
                              color: secondaryColor
                            }}
                          >
                            {tool.name}
                          </h3>
                          <p className="text-xs opacity-70 font-poppins">
                            {tool.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {tool.status === 'coming_soon' && (
                          <span className="text-xs opacity-50 font-poppins">Em breve</span>
                        )}
                        <button
                          className="p-2 rounded-lg hover:bg-gray-200 transition-colors opacity-0 group-hover:opacity-100"
                          style={{ color: primaryColor }}
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Plugins Desktop */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 
                  className="text-lg font-bold font-nunito"
                  style={{ 
                    color: secondaryColor
                  }}
                >
                  Plugins Desktop
                </h2>
                {subscription && (
                  <Link to="/plans" className="text-xs font-semibold font-poppins" style={{ color: primaryColor }}>
                    Gerenciar
                  </Link>
                )}
              </div>
              <div className="space-y-3">
                {plugins.map((plugin) => (
                  <div
                    key={plugin.id}
                    className="p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${primaryColor}15` }}
                        >
                          <Download className="w-5 h-5" style={{ color: primaryColor }} />
                        </div>
                        <div>
                          <h3 
                            className="text-sm font-semibold font-nunito"
                            style={{ 
                              color: secondaryColor
                            }}
                          >
                            {plugin.name}
                          </h3>
                          <p className="text-xs opacity-70 font-poppins">
                            v{plugin.version}
                          </p>
                        </div>
                      </div>
                      <span 
                        className={`px-2 py-1 rounded-full text-xs font-semibold font-poppins ${
                          plugin.status === 'available' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {plugin.status === 'available' ? 'Disponível' : 'Bloqueado'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat and Content Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Salas de Chat */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 
                  className="text-lg font-bold font-nunito"
                  style={{ 
                    color: secondaryColor
                  }}
                >
                  Comunidade
                </h2>
                <button className="text-xs font-semibold font-poppins" style={{ color: primaryColor }}>
                  Abrir chat
                </button>
              </div>
              <div className="space-y-2">
                {chatRooms.map((room) => (
                  <button
                    key={room.id}
                    className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${primaryColor}15` }}
                      >
                        <MessageSquare className="w-4 h-4" style={{ color: primaryColor }} />
                      </div>
                      <div>
                        <h3 
                          className="text-sm font-semibold font-nunito"
                          style={{ 
                            color: secondaryColor
                          }}
                        >
                          {room.name}
                        </h3>
                        <p className="text-xs opacity-70 font-poppins">
                          {room.access === 'read' ? 'Apenas leitura' : 'Leitura e escrita'}
                        </p>
                      </div>
                    </div>
                    {room.unread > 0 && (
                      <span 
                        className="px-2 py-1 rounded-full text-xs font-semibold font-poppins"
                        style={{ 
                          backgroundColor: primaryColor,
                          color: secondaryColor
                        }}
                      >
                        {room.unread}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Conteúdos Recentes */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 
                  className="text-lg font-bold font-nunito"
                  style={{ 
                    color: secondaryColor
                  }}
                >
                  Conteúdos
                </h2>
                <Link to="/biblioteca" className="text-xs font-semibold font-poppins" style={{ color: primaryColor }}>
                  Ver biblioteca
                </Link>
              </div>
              <div className="space-y-3">
                {recentContent.map((content) => {
                  const getIcon = () => {
                    if (content.type === 'tutorial') return BookOpen;
                    if (content.type === 'brush') return ImageIcon;
                    return FileText;
                  };
                  const IconComponent = getIcon();
                  return (
                    <div
                      key={content.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${primaryColor}15` }}
                        >
                          <IconComponent className="w-5 h-5" style={{ color: primaryColor }} />
                        </div>
                        <div>
                          <h3 
                            className="text-sm font-semibold font-nunito"
                            style={{ 
                              color: secondaryColor
                            }}
                          >
                            {content.title}
                          </h3>
                          <p className="text-xs opacity-70 font-poppins">
                            {content.downloads} downloads
                          </p>
                        </div>
                      </div>
                      <button
                        className="p-2 rounded-lg hover:bg-gray-200 transition-colors opacity-0 group-hover:opacity-100"
                        style={{ color: primaryColor }}
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Informações da Conta */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover border-2 shadow-md"
                  style={{ borderColor: primaryColor }}
                />
              ) : (
                <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-md" style={{ backgroundColor: `${primaryColor}15` }}>
                  <User className="w-6 h-6" style={{ color: primaryColor }} />
                </div>
              )}
              <h3 className="text-lg font-bold font-nunito" style={{ color: secondaryColor }}>
                Informações da Conta
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-600 mb-1 font-poppins">Nome Completo</p>
                <p className="text-sm font-semibold font-nunito" style={{ color: secondaryColor }}>
                  {user?.name}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1 font-poppins">Email</p>
                <p className="text-xs font-semibold font-nunito break-all" style={{ color: secondaryColor }}>
                  {user?.email}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1 font-poppins">Tipo de Conta</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold font-poppins ${
                  user?.role === 'admin' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {user?.role === 'admin' ? '👑 Administrador' : '👤 Usuário'}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <Link
                to="/ferramentas"
                className="block w-full text-center px-4 py-3 rounded-lg font-semibold transition-colors font-nunito"
                style={{ 
                  backgroundColor: primaryColor,
                  color: secondaryColor
                }}
              >
                Acessar Ferramentas
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
