import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { 
  Sparkles,
  Zap,
  Download,
  MessageSquare,
  Users,
  FileText,
  Image,
  Settings,
  Bell,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  Play,
  BookOpen,
  Palette,
  Minimize2,
  FileEdit
} from 'lucide-react';
import { BRAND_COLORS, BRAND_TYPOGRAPHY } from '../../../config/brand';

const Project4 = ({ isFullscreen = false }) => {
  const cardsRef = useRef(null);
  const [customization, setCustomization] = useState({
    primaryColor: BRAND_COLORS.primary.green.hex,
    secondaryColor: BRAND_COLORS.primary.blue.hex,
    backgroundColor: '#F5F5F5',
    textColor: BRAND_COLORS.primary.blue.hex,
    fontFamily: BRAND_TYPOGRAPHY.primary.family,
    showCustomization: false
  });

  // Dados simulados do usuário
  const userPlan = {
    name: 'Básico',
    status: 'active',
    expiresAt: '2025-02-15',
    features: ['Todos os plugins', 'Ferramentas web', 'Chat #geral e #tutoriais', 'WhatsApp Pro']
  };

  const tools = [
    { id: 1, name: 'ColorBuddy', icon: Palette, description: 'Extrator de cores', status: 'available', usage: 45 },
    { id: 2, name: 'Compressor', icon: Minimize2, description: 'Otimização de imagens', status: 'available', usage: 32 },
    { id: 3, name: 'Renomeador', icon: FileEdit, description: 'Renomeação em lote', status: 'available', usage: 18 }
  ];

  const plugins = [
    { id: 1, name: 'Illustrator Plugin', version: '2.1.0', status: 'installed', key: 'MB-ILL-2024-ABC123' },
    { id: 2, name: 'Photoshop Plugin', version: '1.8.5', status: 'not_installed', key: 'MB-PSD-2024-XYZ789' },
    { id: 3, name: 'Figma Plugin', version: '3.0.2', status: 'installed', key: 'MB-FIG-2024-DEF456' }
  ];

  const recentContent = [
    { id: 1, title: 'Tutorial: Otimização de Cores', type: 'tutorial', downloads: 124 },
    { id: 2, title: 'Brush Pack - Texturas', type: 'brush', downloads: 89 },
    { id: 3, title: 'Template - Apresentação', type: 'template', downloads: 156 }
  ];

  const chatRooms = [
    { id: 1, name: '#geral', access: 'read', unread: 3 },
    { id: 2, name: '#tutoriais', access: 'write', unread: 0 },
    { id: 3, name: '#dúvidas', access: 'write', unread: 1 }
  ];

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
                Meu Dashboard
              </h1>
              <p 
                className="text-sm opacity-70"
                style={{ fontFamily: customization.fontFamily }}
              >
                Bem-vindo de volta! Gerencie suas ferramentas e plugins
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                className="p-2 rounded-lg hover:bg-gray-200 transition-colors relative"
                title="Notificações"
              >
                <Bell className="w-5 h-5" style={{ color: customization.textColor }} />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ backgroundColor: customization.primaryColor }}></span>
              </button>
              <button
                onClick={toggleCustomization}
                className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                title="Personalizar"
              >
                <Sparkles className="w-5 h-5" style={{ color: customization.primaryColor }} />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-6">
          {/* Plan Status Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 
                  className="text-lg font-bold mb-1"
                  style={{ 
                    color: customization.secondaryColor,
                    fontFamily: customization.fontFamily
                  }}
                >
                  Plano: {userPlan.name}
                </h2>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: customization.primaryColor }}></div>
                  <span 
                    className="text-sm font-semibold"
                    style={{ color: customization.primaryColor }}
                  >
                    {userPlan.status === 'active' ? 'Ativo' : 'Inativo'}
                  </span>
                  <span className="text-sm opacity-50">•</span>
                  <span className="text-sm opacity-70">Válido até {new Date(userPlan.expiresAt).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
              <button
                className="px-4 py-2 rounded-lg font-semibold text-sm transition-all"
                style={{
                  backgroundColor: customization.primaryColor,
                  color: customization.secondaryColor
                }}
              >
                Gerenciar Plano
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              {userPlan.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" style={{ color: customization.primaryColor }} />
                  <span className="text-xs" style={{ fontFamily: customization.fontFamily }}>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <Zap className="w-5 h-5" style={{ color: customization.primaryColor }} />
                <span className="text-xs font-semibold" style={{ color: customization.primaryColor }}>3</span>
              </div>
              <h3 className="text-xs font-medium opacity-70 mb-1" style={{ fontFamily: customization.fontFamily }}>
                Ferramentas
              </h3>
              <p className="text-lg font-bold" style={{ color: customization.secondaryColor }}>
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
                <span className="text-xs font-semibold" style={{ color: '#3B82F6' }}>2</span>
              </div>
              <h3 className="text-xs font-medium opacity-70 mb-1" style={{ fontFamily: customization.fontFamily }}>
                Plugins
              </h3>
              <p className="text-lg font-bold" style={{ color: customization.secondaryColor }}>
                Instalados
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
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${customization.primaryColor}20`, color: customization.primaryColor }}>
                  4
                </span>
              </div>
              <h3 className="text-xs font-medium opacity-70 mb-1" style={{ fontFamily: customization.fontFamily }}>
                Mensagens
              </h3>
              <p className="text-lg font-bold" style={{ color: customization.secondaryColor }}>
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
              <h3 className="text-xs font-medium opacity-70 mb-1" style={{ fontFamily: customization.fontFamily }}>
                Uso Total
              </h3>
              <p className="text-lg font-bold" style={{ color: customization.secondaryColor }}>
                95x
              </p>
            </div>
          </div>

          {/* Tools and Plugins Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Ferramentas Web */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 
                  className="text-lg font-bold"
                  style={{ 
                    color: customization.secondaryColor,
                    fontFamily: customization.fontFamily
                  }}
                >
                  Ferramentas Web
                </h2>
                <button className="text-xs font-semibold" style={{ color: customization.primaryColor }}>
                  Ver todas
                </button>
              </div>
              <div className="space-y-3">
                {tools.map((tool) => {
                  const IconComponent = tool.icon;
                  return (
                    <div
                      key={tool.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${customization.primaryColor}15` }}
                        >
                          <IconComponent className="w-5 h-5" style={{ color: customization.primaryColor }} />
                        </div>
                        <div>
                          <h3 
                            className="text-sm font-semibold"
                            style={{ 
                              color: customization.secondaryColor,
                              fontFamily: customization.fontFamily
                            }}
                          >
                            {tool.name}
                          </h3>
                          <p className="text-xs opacity-70" style={{ fontFamily: customization.fontFamily }}>
                            {tool.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-xs font-semibold" style={{ color: customization.primaryColor }}>
                            {tool.usage}x
                          </p>
                          <p className="text-xs opacity-50" style={{ fontFamily: customization.fontFamily }}>
                            usado
                          </p>
                        </div>
                        <button
                          className="p-2 rounded-lg hover:bg-gray-200 transition-colors opacity-0 group-hover:opacity-100"
                          style={{ color: customization.primaryColor }}
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Plugins Desktop */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 
                  className="text-lg font-bold"
                  style={{ 
                    color: customization.secondaryColor,
                    fontFamily: customization.fontFamily
                  }}
                >
                  Plugins Desktop
                </h2>
                <button className="text-xs font-semibold" style={{ color: customization.primaryColor }}>
                  Gerenciar
                </button>
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
                          style={{ backgroundColor: `${customization.primaryColor}15` }}
                        >
                          <Download className="w-5 h-5" style={{ color: customization.primaryColor }} />
                        </div>
                        <div>
                          <h3 
                            className="text-sm font-semibold"
                            style={{ 
                              color: customization.secondaryColor,
                              fontFamily: customization.fontFamily
                            }}
                          >
                            {plugin.name}
                          </h3>
                          <p className="text-xs opacity-70" style={{ fontFamily: customization.fontFamily }}>
                            v{plugin.version}
                          </p>
                        </div>
                      </div>
                      <span 
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          plugin.status === 'installed' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {plugin.status === 'installed' ? 'Instalado' : 'Não instalado'}
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
                  className="text-lg font-bold"
                  style={{ 
                    color: customization.secondaryColor,
                    fontFamily: customization.fontFamily
                  }}
                >
                  Comunidade
                </h2>
                <button className="text-xs font-semibold" style={{ color: customization.primaryColor }}>
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
                        style={{ backgroundColor: `${customization.primaryColor}15` }}
                      >
                        <MessageSquare className="w-4 h-4" style={{ color: customization.primaryColor }} />
                      </div>
                      <div>
                        <h3 
                          className="text-sm font-semibold"
                          style={{ 
                            color: customization.secondaryColor,
                            fontFamily: customization.fontFamily
                          }}
                        >
                          {room.name}
                        </h3>
                        <p className="text-xs opacity-70" style={{ fontFamily: customization.fontFamily }}>
                          {room.access === 'read' ? 'Apenas leitura' : 'Leitura e escrita'}
                        </p>
                      </div>
                    </div>
                    {room.unread > 0 && (
                      <span 
                        className="px-2 py-1 rounded-full text-xs font-semibold"
                        style={{ 
                          backgroundColor: customization.primaryColor,
                          color: customization.secondaryColor
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
                  className="text-lg font-bold"
                  style={{ 
                    color: customization.secondaryColor,
                    fontFamily: customization.fontFamily
                  }}
                >
                  Conteúdos
                </h2>
                <button className="text-xs font-semibold" style={{ color: customization.primaryColor }}>
                  Ver biblioteca
                </button>
              </div>
              <div className="space-y-3">
                {recentContent.map((content) => {
                  const getIcon = () => {
                    if (content.type === 'tutorial') return BookOpen;
                    if (content.type === 'brush') return Image;
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
                          style={{ backgroundColor: `${customization.primaryColor}15` }}
                        >
                          <IconComponent className="w-5 h-5" style={{ color: customization.primaryColor }} />
                        </div>
                        <div>
                          <h3 
                            className="text-sm font-semibold"
                            style={{ 
                              color: customization.secondaryColor,
                              fontFamily: customization.fontFamily
                            }}
                          >
                            {content.title}
                          </h3>
                          <p className="text-xs opacity-70" style={{ fontFamily: customization.fontFamily }}>
                            {content.downloads} downloads
                          </p>
                        </div>
                      </div>
                      <button
                        className="p-2 rounded-lg hover:bg-gray-200 transition-colors opacity-0 group-hover:opacity-100"
                        style={{ color: customization.primaryColor }}
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Project4;

