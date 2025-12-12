import React from 'react';

const AnimatedBar = () => {
  const getIcon = (type, isMobile, isRectangular = false) => {
    const size = isMobile ? 'w-4 h-4' : (isRectangular ? 'w-5 h-5' : 'w-6 h-6');
    const icons = {
      check: <svg className={`${size} text-brand-blue-900`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>,
      lightning: <svg className={`${size} text-brand-blue-900`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>,
      book: <svg className={`${size} text-brand-blue-900`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>,
      lightbulb: <svg className={`${size} text-brand-blue-900`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>,
      star: <svg className={`${size} text-brand-blue-900`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>,
      rocket: <svg className={`${size} text-brand-blue-900`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 2l3 3m-3-3l-3 3m3-3v8" />
      </svg>,
      sparkles: <svg className={`${size} text-brand-blue-900`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>,
      zap: <svg className={`${size} text-brand-blue-900`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>,
      palette: <svg className={`${size} text-brand-blue-900`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>,
      shield: <svg className={`${size} text-brand-blue-900`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    };
    return icons[type];
  };

  const CardComponent = ({ iconType, title, subtitle, isMobile = false, isRectangular = false }) => {
    if (isRectangular) {
      // Layout retangular horizontal para desktop (largura maior que altura, tamanho fixo)
      return (
        <div className="group relative flex items-center gap-4 bg-[#f5f5f5] rounded-xl px-7 py-4 border border-gray-300/50 hover:border-brand-green/50 transition-all duration-300 hover:scale-105 w-[320px] h-[92px] flex-shrink-0 shadow-md hover:shadow-xl">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-brand-green to-brand-green/80 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              {getIcon(iconType, false, true)}
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-brand-green rounded-full animate-pulse"></div>
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-lg font-black text-gray-900 font-poppins block truncate">{title}</span>
            <span className="text-sm text-gray-600 font-poppins truncate">{subtitle}</span>
          </div>
        </div>
      );
    }
    
    // Layout horizontal para mobile (cartão sólido e tamanho fixo para consistência)
    return (
      <div className={`group relative flex items-center ${isMobile ? 'gap-2.5 w-[184px] min-h-[90px]' : 'gap-4'} ${isMobile ? 'bg-white' : 'bg-white/10 backdrop-blur-md'} ${isMobile ? 'rounded-xl px-4 py-3' : 'rounded-2xl px-6 py-4'} ${isMobile ? 'border border-gray-200' : 'border border-white/20 hover:bg-white/15 hover:border-brand-green/50'} transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex-shrink-0`}>
        <div className="relative">
          <div className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} bg-gradient-to-br from-brand-green to-brand-green/80 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
            {getIcon(iconType, isMobile)}
          </div>
          <div className={`absolute -top-1 -right-1 ${isMobile ? 'w-2 h-2' : 'w-4 h-4'} bg-brand-green rounded-full animate-pulse`}></div>
        </div>
        <div className="min-w-0">
          <span className={`${isMobile ? 'text-xs leading-snug' : 'text-xl md:text-2xl'} font-black ${isMobile ? 'text-brand-blue-900' : 'text-white'} font-poppins block line-clamp-2`}>{title}</span>
          {!isMobile && <span className="text-sm text-white/70 font-poppins">{subtitle}</span>}
        </div>
      </div>
    );
  };

  const cards = [
    {
      iconType: 'check',
      title: "Ferramentas Especializadas",
      subtitle: "Soluções focadas"
    },
    {
      iconType: 'lightning',
      title: "Tudo em um só lugar",
      subtitle: "Uma plataforma única"
    },
    {
      iconType: 'book',
      title: "Feito para Designers",
      subtitle: "Por quem entende"
    },
    {
      iconType: 'lightbulb',
      title: "Sem Complicação",
      subtitle: "Interface intuitiva"
    },
    {
      iconType: 'zap',
      title: "Resultado Imediato",
      subtitle: "Eficiência garantida"
    },
    {
      iconType: 'star',
      title: "Qualidade Premium",
      subtitle: "Padrão profissional"
    },
    {
      iconType: 'rocket',
      title: "Performance Rápida",
      subtitle: "Velocidade que impressiona"
    },
    {
      iconType: 'sparkles',
      title: "Inovação Constante",
      subtitle: "Sempre evoluindo"
    },
    {
      iconType: 'palette',
      title: "Criatividade Liberada",
      subtitle: "Foque no que importa"
    },
    {
      iconType: 'shield',
      title: "Seguro e Confiável",
      subtitle: "Seus dados protegidos"
    },
    {
      iconType: 'check',
      title: "Workflow Otimizado",
      subtitle: "Fluxo de trabalho eficiente"
    },
    {
      iconType: 'lightning',
      title: "Automação Inteligente",
      subtitle: "Tarefas simplificadas"
    },
    {
      iconType: 'book',
      title: "Documentação Completa",
      subtitle: "Aprenda rapidamente"
    },
    {
      iconType: 'star',
      title: "Experiência Superior",
      subtitle: "Feito com excelência"
    },
    {
      iconType: 'lightbulb',
      title: "Ideias Transformadas",
      subtitle: "Conceito em realidade"
    },
    {
      iconType: 'palette',
      title: "Design Profissional",
      subtitle: "Qualidade em cada detalhe"
    },
    {
      iconType: 'rocket',
      title: "Crescimento Acelerado",
      subtitle: "Potencialize seu trabalho"
    },
    {
      iconType: 'sparkles',
      title: "Recursos Avançados",
      subtitle: "Tecnologia de ponta"
    },
    {
      iconType: 'shield',
      title: "Privacidade Garantida",
      subtitle: "Seus projetos seguros"
    },
    {
      iconType: 'check',
      title: "Precisão Absoluta",
      subtitle: "Resultados perfeitos"
    },
    {
      iconType: 'zap',
      title: "Processamento Rápido",
      subtitle: "Economia de tempo"
    },
    {
      iconType: 'book',
      title: "Aprendizado Contínuo",
      subtitle: "Evolua constantemente"
    },
    {
      iconType: 'lightning',
      title: "Produtividade Máxima",
      subtitle: "Mais feito em menos tempo"
    },
    {
      iconType: 'star',
      title: "Destaque no Mercado",
      subtitle: "Diferencie-se"
    },
    {
      iconType: 'palette',
      title: "Cores Perfeitas",
      subtitle: "Paleta profissional"
    },
    {
      iconType: 'rocket',
      title: "Lançamento Rápido",
      subtitle: "Do conceito ao mercado"
    },
    {
      iconType: 'sparkles',
      title: "Brillho Extra",
      subtitle: "Detalhes que impressionam"
    },
    {
      iconType: 'lightbulb',
      title: "Soluções Criativas",
      subtitle: "Pensamento inovador"
    },
    {
      iconType: 'shield',
      title: "Backup Automático",
      subtitle: "Nunca perca seu trabalho"
    },
    {
      iconType: 'check',
      title: "Validação Instantânea",
      subtitle: "Confirme na hora"
    },
    {
      iconType: 'zap',
      title: "Sincronização Rápida",
      subtitle: "Tudo atualizado"
    }
  ];

  // Criar conjunto completo de cards duplicados para animação fluida (mais duplicações para evitar espaços vazios)
  // Dividir os cards em duas linhas com mais variedade
  const desktopLine1Cards = [...cards.slice(0, 16), ...cards.slice(0, 16), ...cards.slice(0, 16)];
  const desktopLine2Cards = [...cards.slice(16), ...cards.slice(0, 16), ...cards.slice(16), ...cards.slice(0, 16)];
  const mobileLine1Cards = [...cards.slice(0, 2), ...cards.slice(0, 2)];
  const mobileLine2Cards = [...cards.slice(2, 4), ...cards.slice(2, 4)];
  // Para mobile, usar blocos do mesmo tamanho para manter velocidade perceptiva igual
  const mobileLine3Cards = [...cards.slice(4, 6), ...cards.slice(4, 6)];

  return (
    <section className="py-12 px-4 bg-[#f5f5f5] relative" style={{ overflow: 'visible' }}>

      <div className="relative z-10">
        {/* Versão Desktop - 2 linhas */}
        <div className="hidden md:block space-y-1 py-8">
          {/* Linha 1 - Esquerda */}
          <div className="overflow-x-hidden" style={{ overflowY: 'visible', scrollbarWidth: 'none', msOverflowStyle: 'none', paddingTop: '30px', paddingBottom: '30px' }}>
            <div className="flex animate-scroll-infinite-desktop">
              <div className="flex items-center gap-4">
                {desktopLine1Cards.map((card, idx) => (
                  <CardComponent key={`desktop-line1-${idx}`} {...card} isRectangular={true} />
                ))}
              </div>
            </div>
          </div>

          {/* Linha 2 - Direita */}
          <div className="overflow-x-hidden" style={{ overflowY: 'visible', scrollbarWidth: 'none', msOverflowStyle: 'none', paddingTop: '30px', paddingBottom: '30px' }}>
            <div className="flex animate-scroll-infinite-desktop-reverse">
              <div className="flex items-center gap-4">
                {desktopLine2Cards.map((card, idx) => (
                  <CardComponent key={`desktop-line2-${idx}`} {...card} isRectangular={true} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Versão Mobile - 3 linhas alternadas */}
        <div className="md:hidden space-y-4">
          {/* Linha 1 - Esquerda */}
          <div className="overflow-hidden">
            <div className="flex animate-scroll-infinite-mobile-left">
              <div className="flex items-center gap-4">
                {mobileLine1Cards.map((card, idx) => (
                  <CardComponent key={`mobile-left-${idx}`} {...card} isMobile={true} />
                ))}
              </div>
            </div>
          </div>

          {/* Linha 2 - Direita */}
          <div className="overflow-hidden">
            <div className="flex animate-scroll-infinite-mobile-right">
              <div className="flex items-center gap-4">
                {mobileLine2Cards.map((card, idx) => (
                  <CardComponent key={`mobile-right-${idx}`} {...card} isMobile={true} />
                ))}
              </div>
            </div>
          </div>

          {/* Linha 3 - Esquerda */}
          <div className="overflow-hidden">
            <div className="flex animate-scroll-infinite-mobile-left">
              <div className="flex items-center gap-4">
                {mobileLine3Cards.map((card, idx) => (
                  <CardComponent key={`mobile-left2-${idx}`} {...card} isMobile={true} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Estilos para animação infinita */}
      <style>{`
        /* Esconder barra de rolagem */
        .overflow-x-hidden::-webkit-scrollbar {
          display: none;
        }
        
        @keyframes scroll-infinite-desktop {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% / 3));
          }
        }
        @keyframes scroll-infinite-desktop-reverse {
          0% {
            transform: translateX(calc(-100% / 3));
          }
          100% {
            transform: translateX(0);
          }
        }
        @keyframes scroll-infinite-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% / 2));
          }
        }
        @keyframes scroll-infinite-right {
          0% {
            transform: translateX(calc(-100% / 2));
          }
          100% {
            transform: translateX(0);
          }
        }
        @keyframes scroll-infinite-mobile {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes scroll-infinite-mobile-reverse {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
        .animate-scroll-infinite-desktop {
          animation: scroll-infinite-desktop 60s linear infinite;
          will-change: transform;
          display: inline-flex;
        }
        .animate-scroll-infinite-desktop-reverse {
          animation: scroll-infinite-desktop-reverse 60s linear infinite;
          will-change: transform;
          display: inline-flex;
        }
        .animate-scroll-infinite-left {
          animation: scroll-infinite-left 20s linear infinite;
          will-change: transform;
          display: inline-flex;
        }
        .animate-scroll-infinite-right {
          animation: scroll-infinite-right 20s linear infinite;
          will-change: transform;
          display: inline-flex;
        }
        .animate-scroll-infinite-mobile-left {
          animation: scroll-infinite-mobile 32s linear infinite;
          will-change: transform;
          display: inline-flex;
        }
        .animate-scroll-infinite-mobile-right {
          animation: scroll-infinite-mobile-reverse 32s linear infinite;
          will-change: transform;
          display: inline-flex;
        }
      `}</style>
    </section>
  );
};

export default AnimatedBar;

