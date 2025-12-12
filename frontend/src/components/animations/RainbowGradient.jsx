import React from 'react';

/**
 * Componente de animação de gradiente rainbow
 * Cria um gradiente arco-íris que se move continuamente da esquerda para a direita
 * 
 * @param {Object} props
 * @param {string} props.speed - Velocidade da animação (padrão: '20s')
 * @param {string} props.className - Classes CSS adicionais
 * @param {number} props.opacity - Opacidade do gradiente (padrão: 0.1)
 * @param {string} props.blur - Intensidade do blur (padrão: 'blur-2xl')
 */
const RainbowGradient = ({
  speed = '20s',
  className = '',
  opacity = 0.1,
  blur = 'blur-2xl'
}) => {
  return (
    <div 
      className={`absolute inset-0 rounded-lg pointer-events-none z-0 overflow-hidden ${className}`}
      style={{
        background: `linear-gradient(
          90deg,
          rgba(255, 0, 0, ${opacity}) 0%,
          rgba(255, 127, 0, ${opacity}) 14.28%,
          rgba(255, 255, 0, ${opacity}) 28.56%,
          rgba(0, 255, 0, ${opacity}) 42.84%,
          rgba(0, 0, 255, ${opacity}) 57.12%,
          rgba(75, 0, 130, ${opacity}) 71.4%,
          rgba(148, 0, 211, ${opacity}) 85.68%,
          rgba(255, 0, 0, ${opacity}) 100%
        )`,
        backgroundSize: '300% 100%',
        animation: 'rainbowGradient linear infinite',
        animationDuration: speed,
        filter: 'blur(60px)', // Blur mais forte para efeito suave
        willChange: 'background-position',
        transform: 'translateZ(0)', // Aceleração de hardware
      }}
    />
  );
};

export default RainbowGradient;

