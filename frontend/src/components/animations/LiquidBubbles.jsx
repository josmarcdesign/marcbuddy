import React, { useEffect, useRef, useState } from 'react';

/**
 * Componente de animação de bolhas de líquido
 * Cria um efeito de bolhas coloridas se movendo e colidindo suavemente
 * 
 * @param {Object} props
 * @param {Array} props.colors - Array de cores para as bolhas (padrão: 3 cores)
 * @param {Array} props.sizes - Array de tamanhos para as bolhas (padrão: [32, 40, 36])
 * @param {Array} props.positions - Array de posições para as bolhas (padrão: posições pré-definidas)
 * @param {Array} props.durations - Array de durações de animação em segundos (padrão: [8, 10, 12])
 * @param {string} props.blur - Intensidade do blur (padrão: 'blur-3xl')
 * @param {string} props.className - Classes CSS adicionais
 * @param {boolean} props.showOverlay - Mostra overlay glassmorphism (padrão: true)
 */
const LiquidBubbles = ({
  colors = [
    { color: 'bg-brand-green/20', position: { top: '1/4', left: '1/4' } },
    { color: 'bg-blue-400/15', position: { top: '1/2', right: '1/4' } },
    { color: 'bg-brand-green/25', position: { bottom: '1/4', left: '1/2' } }
  ],
  sizes = [32, 40, 36],
  durations = ['8s', '10s', '12s'],
  blur = 'blur-3xl',
  className = '',
  showOverlay = true,
  overlayGradient = 'from-white/5 via-transparent to-transparent'
}) => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);

  // Intersection Observer para pausar animações quando não visível
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      {
        threshold: 0.1, // Pausa quando menos de 10% visível
        rootMargin: '50px', // Margem para começar antes de entrar na viewport
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Container das bolhas - otimizado para performance */}
      <div 
        ref={containerRef}
        className={`absolute inset-0 overflow-hidden rounded-lg pointer-events-none z-0 ${className}`}
        style={{
          willChange: isVisible ? 'contents' : 'auto', // Remove will-change quando não visível
          transform: 'translateZ(0)', // Aceleração de hardware
          contain: 'layout style paint', // Isola o layout para melhor performance
        }}
      >
        {colors.map((bubble, index) => {
          const size = sizes[index] || sizes[0];
          const duration = durations[index] || durations[0];
          
          // Posições iniciais baseadas no primeiro keyframe de cada animação
          // Todas usam left e top agora (sem right/bottom)
          const initialPositions = [
            { top: '0%', left: '0%' },      // bubble1: começa em 0%, 0%
            { top: '0%', left: '100%' },    // bubble2: começa em 100%, 0%
            { top: '100%', left: '50%' },   // bubble3: começa em 50%, 100%
            { top: '50%', left: '0%' }      // bubble4: começa em 0%, 50%
          ];
          
          const initialPos = initialPositions[index] || { top: '0%', left: '0%' };
          
          // Mapear cores para classes ou estilos
          const colorClass = bubble.color || 'bg-brand-green/20';
          
          return (
            <div
              key={index}
              className={`absolute ${colorClass} rounded-full ${blur}`}
              style={{
                width: `${size * 4}px`, // Convertendo para pixels (Tailwind usa múltiplos de 4)
                height: `${size * 4}px`,
                animationName: isVisible ? `bubble${index + 1}` : 'none', // Pausa quando não visível
                animationDuration: duration,
                animationTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)', // ease-in-out otimizado
                animationIterationCount: 'infinite',
                willChange: isVisible ? 'transform, opacity' : 'auto', // Remove will-change quando não visível
                transform: 'translateZ(0)', // Aceleração de hardware
                backfaceVisibility: 'hidden', // Previne flickering
                ...initialPos,
              }}
            />
          );
        })}
      </div>
      
      {/* Overlay glassmorphism */}
      {showOverlay && (
        <div className={`absolute inset-0 bg-gradient-to-br ${overlayGradient} pointer-events-none rounded-lg z-0`} />
      )}
    </>
  );
};

export default LiquidBubbles;

