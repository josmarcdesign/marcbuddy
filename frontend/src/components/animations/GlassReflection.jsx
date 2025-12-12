import React from 'react';

/**
 * Componente de animação de reflexo de vidro
 * Cria um reflexo que se move na diagonal (esquerda para direita e para baixo)
 * 
 * @param {Object} props
 * @param {string} props.speed - Velocidade da animação (padrão: '3s')
 * @param {string} props.className - Classes CSS adicionais
 * @param {number} props.opacity - Opacidade do reflexo (padrão: 0.3)
 * @param {string} props.angle - Ângulo do gradiente em graus (padrão: '135deg' - diagonal)
 */
const GlassReflection = ({
  speed = '4s',
  className = '',
  opacity = 0.25,
  angle = '135deg'
}) => {
  return (
    <div 
      className={`absolute inset-0 rounded-lg pointer-events-none z-0 overflow-hidden ${className}`}
      style={{
        background: `linear-gradient(
          ${angle},
          transparent 0%,
          transparent 40%,
          rgba(255, 255, 255, ${opacity * 0.3}) 45%,
          rgba(255, 255, 255, ${opacity}) 48%,
          rgba(255, 255, 255, ${opacity * 0.95}) 50%,
          rgba(255, 255, 255, ${opacity}) 52%,
          rgba(255, 255, 255, ${opacity * 0.3}) 55%,
          transparent 60%,
          transparent 100%
        )`,
        backgroundSize: '250% 250%',
        backgroundRepeat: 'no-repeat',
        animation: 'glassReflection linear infinite',
        animationDuration: speed,
        willChange: 'background-position',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
      }}
    />
  );
};

export default GlassReflection;

