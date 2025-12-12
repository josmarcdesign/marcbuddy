import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePlans } from '../contexts/PlansContext';
import { brandStyle } from '../config/brand';
import BillingToggle from '../components/BillingToggle';
import PlanCard from '../components/PlanCard';
import HeroIllustration from '../components/HeroIllustration';
import AnimatedBar from '../components/AnimatedBar';
import FigmaIcon from '../assets/icons/Figma-Floating-Icon.svg';
import IllustratorIcon from '../assets/icons/Illustrator-Floating-Icon.svg';
import PhotoshopIcon from '../assets/icons/Photoshop-Floating-Icon.svg';
import NotionIcon from '../assets/icons/Notion-Floating-Icon.svg';
import MascotComputer from '../assets/ilustrations/mascot-2-computer.svg';

const Home = () => {
  const { user } = useAuth();
  const { getAllPlans } = usePlans();
  const [billingPeriod, setBillingPeriod] = useState('monthly'); // 'monthly' or 'annual'
  const [illustrationSize, setIllustrationSize] = useState(420);
  const [containerMinHeight, setContainerMinHeight] = useState('350px');
  
  // Estados para posicionamento dos ícones flutuantes (fixos)
  const iconPositions = {
    1: { top: '6%', left: '7%' },
    2: { top: '13%', right: '17%' },
    3: { bottom: '22%', left: '2%' },
    4: { bottom: '13%', right: '11%' } // Notion: ajustado para cima e esquerda no desktop
  };
  const [iconSize, setIconSize] = useState(80);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isSmallDesktop, setIsSmallDesktop] = useState(false);
  const illustrationRef = useRef(null);
  const heroContainerRef = useRef(null);
  const heroSectionRef = useRef(null);
  const activateDizzyRef = useRef(null);
  const plans = getAllPlans();

  // Ajustar tamanho da ilustração e container baseado no tamanho da tela
  useEffect(() => {
    const updateSize = () => {
      if (window.innerWidth < 768) {
        setIllustrationSize(250); // Mobile
        setContainerMinHeight('280px'); // Aumentado para dar espaço para a animação
      } else if (window.innerWidth < 1024) {
        setIllustrationSize(350); // Tablet
        setContainerMinHeight('350px');
      } else {
        setIllustrationSize(420); // Desktop
        setContainerMinHeight('400px');
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Ajustar tamanho dos ícones e detectar tablet/desktop menor baseado no tamanho da tela
  useEffect(() => {
    const updateIconSize = () => {
      const width = window.innerWidth;
      const mobile = width < 768;
      const tablet = width >= 768 && width < 1024;
      const smallDesktop = width >= 1024 && width < 1280;
      
      setIsMobile(mobile);
      setIsTablet(tablet);
      setIsSmallDesktop(smallDesktop);
      
      if (mobile) {
        setIconSize(55); // Mobile: 55px
      } else {
        setIconSize(80); // Desktop/Tablet: 80px
      }
    };

    updateIconSize();
    window.addEventListener('resize', updateIconSize);
    return () => window.removeEventListener('resize', updateIconSize);
  }, []);


  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section 
        ref={heroSectionRef}
        className="bg-brand-white pt-5 lg:pt-24 pb-[7rem] lg:pb-[9rem] px-4 relative" 
        style={{ overflowX: 'hidden', overflowY: 'visible', paddingTop: isMobile ? '20px' : undefined }}
      >
        <div className="max-w-7xl mx-auto" style={{ overflowX: 'hidden', overflowY: 'visible' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-12 items-center" style={{ overflowX: 'hidden', overflowY: 'visible' }}>
            {/* Ilustração - Primeiro no mobile, centralizada e menor */}
            <div 
              ref={heroContainerRef}
              className="order-1 lg:order-2 flex justify-center items-center w-full relative" 
              style={{ 
                minHeight: containerMinHeight, 
                overflowX: 'hidden', 
                overflowY: 'visible', 
                paddingTop: isMobile ? '10px' : '30px', 
                paddingBottom: '10px' 
              }}
            >
              <div className="relative w-full max-w-full flex justify-center items-center" style={{ overflowX: 'hidden', overflowY: 'visible', paddingTop: isMobile ? '20px' : '10px' }}>
                {/* Item 2 - Illustrator (Atrás da ilustração) */}
                <div
                  className="absolute"
                  style={{
                    ...(iconPositions[2].top ? { 
                      top: isMobile 
                        ? `calc(${iconPositions[2].top} + 3%)` 
                        : iconPositions[2].top 
                    } : {}),
                    ...(iconPositions[2].bottom ? { bottom: iconPositions[2].bottom } : {}),
                    ...(iconPositions[2].left ? { left: iconPositions[2].left } : {}),
                    ...(iconPositions[2].right ? { right: isTablet ? `calc(${iconPositions[2].right} + 3%)` : `calc(${iconPositions[2].right} - 3px)` } : {}),
                    transform: isMobile ? 'translateX(5px)' : 'none',
                    zIndex: 1,
                    pointerEvents: 'none',
                    transition: 'top 0.3s ease-out, bottom 0.3s ease-out, left 0.3s ease-out, right 0.3s ease-out, transform 0.3s ease-out'
                  }}
                >
                  <div
                    className="animate-float-wiggle-right"
                    style={{
                      width: `${iconSize}px`,
                      height: `${iconSize}px`,
                      animationDelay: '0.5s',
                      backgroundColor: 'transparent',
                      overflow: 'hidden',
                      borderRadius: '8px'
                    }}
                  >
                    <img 
                      src={IllustratorIcon} 
                      alt="Illustrator" 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'contain',
                        backgroundColor: 'transparent',
                        display: 'block',
                        border: 'none',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div 
                  ref={illustrationRef}
                  className="relative w-full max-w-full flex justify-center px-4" 
                  style={{ 
                    zIndex: 2, 
                    overflowX: 'visible', 
                    overflowY: 'visible', 
                    paddingTop: isMobile ? '30px' : '10px',
                    paddingBottom: isMobile ? '20px' : '0px',
                    transform: isMobile ? 'translateX(5px)' : 'none'
                  }}
                >
                  <HeroIllustration size={illustrationSize} onHitByBall={activateDizzyRef} />
                  
                  {/* 3 Itens Flutuantes - Por cima da ilustração */}
                  {/* Item 1 - Figma (Canto Superior Esquerdo) */}
                  <div
                    className="absolute"
                    style={{
                      ...(iconPositions[1].top ? { top: iconPositions[1].top } : {}),
                      ...(iconPositions[1].bottom ? { bottom: iconPositions[1].bottom } : {}),
                      ...(iconPositions[1].left ? { 
                        left: (isTablet || isSmallDesktop) 
                          ? `calc(${iconPositions[1].left} + 6%)` 
                          : iconPositions[1].left 
                      } : {}),
                      ...(iconPositions[1].right ? { right: iconPositions[1].right } : {}),
                      transform: isMobile ? 'translateX(5px)' : 'none',
                      zIndex: 10,
                      pointerEvents: 'none',
                      transition: 'top 0.3s ease-out, bottom 0.3s ease-out, left 0.3s ease-out, right 0.3s ease-out, transform 0.3s ease-out'
                    }}
                  >
                    <div
                      className="animate-float-wiggle-left"
                      style={{
                        width: `${iconSize}px`,
                        height: `${iconSize}px`,
                        animationDelay: '0s',
                        backgroundColor: 'transparent',
                        overflow: 'hidden',
                        borderRadius: '8px'
                      }}
                    >
                      <img 
                        src={FigmaIcon} 
                        alt="Figma" 
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'contain',
                          backgroundColor: 'transparent',
                          display: 'block',
                          border: 'none',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  {/* Item 3 - Photoshop (Canto Inferior Esquerdo) */}
                  <div
                    className="absolute"
                    style={{
                      ...(iconPositions[3].top ? { top: iconPositions[3].top } : {}),
                      ...(iconPositions[3].bottom ? { bottom: iconPositions[3].bottom } : {}),
                      ...(iconPositions[3].left ? { 
                        left: (isTablet || isSmallDesktop) 
                          ? `calc(${iconPositions[3].left} + 6%)` 
                          : iconPositions[3].left 
                      } : {}),
                      ...(iconPositions[3].right ? { right: iconPositions[3].right } : {}),
                      transform: isMobile ? 'translateX(5px)' : 'none',
                      zIndex: 10,
                      pointerEvents: 'none',
                      transition: 'top 0.3s ease-out, bottom 0.3s ease-out, left 0.3s ease-out, right 0.3s ease-out, transform 0.3s ease-out'
                    }}
                  >
                    <div
                      className="animate-float-wiggle-left"
                      style={{
                        width: `${iconSize}px`,
                        height: `${iconSize}px`,
                        animationDelay: '1s',
                        backgroundColor: 'transparent',
                        overflow: 'hidden',
                        borderRadius: '8px'
                      }}
                    >
                      <img 
                        src={PhotoshopIcon} 
                        alt="Photoshop" 
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'contain',
                          backgroundColor: 'transparent',
                          display: 'block',
                          border: 'none',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  {/* Item 4 - Robot (Canto Inferior Direito) */}
                  <div
                    className="absolute"
                    style={{
                      ...(iconPositions[4].top ? { top: iconPositions[4].top } : {}),
                      ...(iconPositions[4].bottom ? { 
                        bottom: isMobile || isTablet 
                          ? iconPositions[4].bottom 
                          : `calc(${iconPositions[4].bottom} - 3%)` // Mover para cima no desktop
                      } : {}),
                      ...(iconPositions[4].left ? { left: iconPositions[4].left } : {}),
                      ...(iconPositions[4].right ? { 
                        right: isMobile 
                          ? `calc(${iconPositions[4].right} + 5px)` 
                          : isTablet 
                            ? `calc(${iconPositions[4].right} + 3%)` 
                            : `calc(${iconPositions[4].right} + 3.5%)` // Mover para esquerda no desktop (reduzido 1.5%)
                      } : {}),
                      transform: isMobile ? 'translateX(5px)' : 'none',
                      zIndex: 10,
                      pointerEvents: 'none',
                      transition: 'top 0.3s ease-out, bottom 0.3s ease-out, left 0.3s ease-out, right 0.3s ease-out, transform 0.3s ease-out'
                    }}
                  >
                    <div
                      className="animate-float-wiggle-right"
                      style={{
                        width: `${iconSize}px`,
                        height: `${iconSize}px`,
                        animationDelay: '1.5s',
                        backgroundColor: 'transparent',
                        overflow: 'hidden',
                        borderRadius: '8px'
                      }}
                    >
                      <img 
                        src={NotionIcon} 
                        alt="Notion" 
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'contain',
                          backgroundColor: 'transparent',
                          display: 'block',
                          border: 'none',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Conteúdo - Segundo no mobile, centralizado */}
            <div className="order-2 lg:order-1 lg:pl-8 text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 font-nunito text-brand-blue-900" style={{ fontWeight: 900 }}>
                O Seu Principal Parceiro Criativo.
              </h1>
              <p className="text-lg sm:text-xl text-gray-700 mb-8 font-poppins mx-auto lg:mx-0 max-w-xl lg:max-w-none" style={{ fontWeight: 500 }}>
                O MarcBuddy é o ecossistema completo para você eliminar o trabalho pesado, simplificar o complexo e focar 100% na criação.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="bg-brand-green text-brand-blue-900 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-brand-green-500 transition-colors text-center font-poppins font-medium"
                      style={brandStyle({ bg: 'green', color: 'blue' })}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/ferramentas"
                      className="bg-brand-blue-900 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-brand-blue-800 transition-colors text-center font-nunito"
                      style={brandStyle({ bg: 'blue', color: '#ffffff' })}
                    >
                      Acessar Ferramentas
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="bg-brand-blue-900 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-brand-blue-800 transition-colors text-center font-nunito"
                      style={brandStyle({ bg: 'blue', color: '#ffffff' })}
                    >
                      Começar Grátis
                    </Link>
                    <Link
                      to="/plans"
                      className="px-8 py-3 rounded-lg font-semibold text-lg hover:bg-brand-green-500 transition-colors text-center font-poppins font-medium"
                      style={brandStyle({ bg: 'green', color: 'blue', textDecoration: 'none' })}
                    >
                      Ver Planos
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Impacto - Barra Deslizante Infinita Premium */}
      <AnimatedBar />

      {/* O que é o MarcBuddy? Section */}
      <section className="pt-12 pb-24 px-4 bg-brand-white relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Ilustração - À esquerda (alternando com o hero) */}
            <div className="flex justify-center lg:justify-start items-center order-2 lg:order-1">
              <img 
                src={MascotComputer} 
                alt="MarcBuddy Mascot" 
                className="w-full max-w-md lg:max-w-lg h-auto"
              />
            </div>
            
            {/* Conteúdo de texto - À direita */}
            <div className="text-center lg:text-left order-1 lg:order-2">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-brand-blue-900 font-nunito leading-tight">
              O que é o <span className="text-brand-green">MarcBuddy</span>?
            </h2>
            </div>
          </div>

          {/* Solução */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-12">
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-brand-green/20">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-brand-green rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-brand-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-brand-blue-900 font-poppins">
                  Ferramentas Especializadas
                </h3>
              </div>
              <p className="text-lg text-gray-700 font-poppins leading-relaxed mb-6" style={{ fontWeight: 500 }}>
                O MarcBuddy não é uma ferramenta genérica. É um <strong className="text-brand-blue-900">ecossistema completo</strong> de ferramentas especializadas, cada uma projetada para resolver problemas específicos do seu dia a dia como designer.
              </p>
              <p className="text-lg text-gray-700 font-poppins leading-relaxed" style={{ fontWeight: 500 }}>
                Criado por designers, para designers. Entendemos suas necessidades e criamos soluções que realmente funcionam.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-brand-green/20">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-brand-green rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-brand-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-brand-blue-900 font-poppins">
                  Tudo em um só lugar
                </h3>
              </div>
              <p className="text-lg text-gray-700 font-poppins leading-relaxed mb-6" style={{ fontWeight: 500 }}>
                Uma única plataforma que reúne todas as ferramentas que você precisa. Sem precisar alternar entre sites diferentes ou aprender interfaces novas.
              </p>
              <p className="text-lg text-gray-700 font-poppins leading-relaxed" style={{ fontWeight: 500 }}>
                <strong className="text-brand-blue-900">Uma conta. Uma interface. Múltiplas soluções.</strong>
              </p>
            </div>
          </div>

          {/* Diferencial */}
          <div className="bg-gradient-to-r from-brand-green/5 via-brand-green/10 to-brand-green/5 rounded-3xl p-8 md:p-12 border-2 border-brand-green/30">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-3xl md:text-4xl font-black text-brand-blue-900 mb-6 font-poppins">
                Por que o MarcBuddy é diferente?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div>
                  <div className="w-12 h-12 bg-brand-green rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-brand-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-brand-blue-900 mb-2 font-poppins">Foco no Essencial</h4>
                  <p className="text-gray-700 font-poppins" style={{ fontWeight: 500 }}>
                    Não tentamos fazer tudo. Fazemos o que importa, e fazemos bem feito.
                  </p>
                </div>
                
                <div>
                  <div className="w-12 h-12 bg-brand-green rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-brand-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-brand-blue-900 mb-2 font-poppins">Sem Curva de Aprendizado</h4>
                  <p className="text-gray-700 font-poppins" style={{ fontWeight: 500 }}>
                    Interface simples. Funcionalidades diretas. Resultado imediato.
                  </p>
                </div>
                
                <div>
                  <div className="w-12 h-12 bg-brand-green rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-brand-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-brand-blue-900 mb-2 font-poppins">Feito para Você</h4>
                  <p className="text-gray-700 font-poppins" style={{ fontWeight: 500 }}>
                    Por designers que entendem o que você precisa, quando precisa.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Planos Section */}
      <section className="py-20 px-4 bg-gray-50 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-brand-blue-900 mb-1 font-nunito">
              Planos Flexíveis para Você
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4 font-poppins" style={{ lineHeight: '1.15', fontWeight: 500 }}>
              Escolha o plano ideal para suas necessidades e comece a transformar seu fluxo de trabalho hoje mesmo.
            </p>
            
            <BillingToggle 
              billingPeriod={billingPeriod}
              onToggle={() => setBillingPeriod(billingPeriod === 'monthly' ? 'annual' : 'monthly')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 items-stretch pt-4">
            {plans.filter(plan => plan.id !== 'free').map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isPopular={plan.popular}
                billingPeriod={billingPeriod}
                showDescription={true}
                showFeatures={true}
                showFullFeatures={false}
                variant="compact"
                buttonLink="/plans"
                enableRotateAnimation={true}
              />
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/plans"
              className="inline-block bg-brand-green text-brand-blue-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-brand-green-500 transition-colors font-poppins font-medium"
              style={brandStyle({ bg: 'green', color: 'blue' })}
            >
              Ver Todos os Planos
            </Link>
          </div>
        </div>
      </section>

      {/* Como Funciona Section */}
      <section className="py-20 px-4 bg-brand-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-brand-blue-900 mb-4 font-poppins">
              Como Funciona
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-poppins" style={{ fontWeight: 500 }}>
              Simples, rápido e eficiente. Comece em minutos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Passo 1 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-brand-blue-900 text-3xl font-bold font-nunito">1</span>
              </div>
              <h3 className="text-2xl font-bold text-brand-blue-900 mb-4 font-poppins">
                Crie sua Conta
              </h3>
              <p className="text-gray-600 font-poppins" style={{ fontWeight: 500 }}>
                Cadastre-se gratuitamente em menos de 2 minutos. 
                Não precisa de cartão de crédito.
              </p>
            </div>

            {/* Passo 2 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-brand-blue-900 text-3xl font-bold font-poppins">2</span>
              </div>
              <h3 className="text-2xl font-bold text-brand-blue-900 mb-4 font-poppins">
                Escolha um Plano
              </h3>
              <p className="text-gray-600 font-poppins" style={{ fontWeight: 500 }}>
                Selecione o plano que melhor se adapta às suas necessidades. 
                Você pode mudar a qualquer momento.
              </p>
            </div>

            {/* Passo 3 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-brand-blue-900 text-3xl font-bold font-poppins">3</span>
              </div>
              <h3 className="text-2xl font-bold text-brand-blue-900 mb-4 font-poppins">
                Comece a Criar
              </h3>
              <p className="text-gray-600 font-poppins" style={{ fontWeight: 500 }}>
                Acesse todas as ferramentas e comece a trabalhar imediatamente. 
                Sua license key estará disponível no dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final Section */}
      <section className="py-24 px-4 relative" style={{ overflow: 'visible', marginBottom: '2rem' }}>
        {/* Background com gradiente diferente do footer */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-brand-white to-gray-50"></div>
        
        {/* Elementos decorativos - posicionados para não serem cortados */}
        <div className="absolute inset-0 opacity-5" style={{ overflow: 'visible', pointerEvents: 'none' }}>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-green rounded-full blur-3xl" style={{ transform: 'translate(-50%, -50%)' }}></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-green rounded-full blur-3xl" style={{ transform: 'translate(50%, 50%)' }}></div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10" style={{ position: 'relative' }}>
          {/* Card principal */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8 lg:p-12">
            <div className="text-center">
              {/* Badge decorativo */}
              <div className="inline-flex items-center gap-2 bg-brand-green/10 px-4 py-2 rounded-full mb-6">
                <svg className="w-5 h-5 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-sm font-semibold text-brand-green font-nunito">Comece Agora</span>
              </div>

              {/* Título */}
              <h2 className="text-4xl lg:text-6xl font-black mb-6 font-nunito text-brand-blue-900 leading-tight">
                Pronto para começar?
              </h2>
              
              {/* Subtítulo */}
              <p className="text-xl lg:text-2xl text-gray-700 mb-10 font-poppins max-w-2xl mx-auto leading-relaxed" style={{ fontWeight: 500 }}>
                Junte-se a milhares de designers e criadores que já usam o MarcBuddy para transformar seu fluxo de trabalho
              </p>

              {/* Botões */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="group relative bg-brand-green text-brand-blue-900 px-10 py-4 rounded-xl font-bold text-lg hover:bg-brand-green-500 transition-all duration-300 font-poppins font-medium shadow-lg hover:shadow-xl hover:scale-105 transform"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        Dashboard
                        <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </Link>
                    <Link
                      to="/ferramentas"
                      className="group relative bg-brand-blue-900 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-brand-blue-800 transition-all duration-300 font-nunito shadow-lg hover:shadow-xl hover:scale-105 transform"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        Acessar Ferramentas
                        <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="group relative bg-brand-green text-brand-blue-900 px-10 py-4 rounded-xl font-bold text-lg hover:bg-brand-green-500 transition-all duration-300 font-poppins font-medium shadow-lg hover:shadow-xl hover:scale-105 transform"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        Começar Grátis
                        <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </Link>
                    <Link
                      to="/plans"
                      className="group relative bg-transparent border-2 border-brand-green text-brand-green px-10 py-4 rounded-xl font-bold text-lg hover:bg-brand-green hover:text-brand-blue-900 transition-all duration-300 font-poppins font-medium shadow-lg hover:shadow-xl hover:scale-105 transform"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        Ver Planos
                        <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </Link>
                  </>
                )}
              </div>

              {/* Estatísticas ou informações adicionais */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex flex-wrap justify-center gap-8 text-center">
                  <div>
                    <div className="text-3xl font-bold text-brand-blue-900 mb-1 font-nunito">7 dias</div>
                    <div className="text-sm text-gray-600 font-poppins">Teste Grátis</div>
                  </div>
                  <div className="hidden sm:block w-px h-12 bg-gray-300"></div>
                  <div>
                    <div className="text-3xl font-bold text-brand-blue-900 mb-1 font-nunito">24/7</div>
                    <div className="text-sm text-gray-600 font-poppins">Suporte</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

