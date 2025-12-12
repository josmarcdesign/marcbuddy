import React from 'react';

/**
 * Componente de animação de luz percorrendo a borda
 * Cria um efeito de luz que percorre continuamente a borda de um elemento
 * 
 * @param {Object} props
 * @param {string} props.color - Cor da luz (padrão: rgba(135, 197, 8, 0.9) - verde)
 * @param {string} props.duration - Duração da animação (padrão: '3s')
 * @param {string} props.maskColor - Cor da máscara interna (padrão: '#011526' - azul marinho)
 * @param {number} props.borderWidth - Largura da borda em pixels (padrão: 3)
 * @param {string} props.className - Classes CSS adicionais
 * @param {string} props.rounded - Classes de arredondamento (padrão: 'rounded-lg')
 */
const BorderGlow = ({
  color = 'rgba(135, 197, 8, 0.9)',
  duration = '3s',
  maskColor = '#011526',
  borderWidth = 3,
  className = '',
  rounded = 'rounded-lg'
}) => {
  return (
    <div 
      className={`absolute ${rounded} pointer-events-none overflow-hidden ${className}`} 
      style={{ 
        zIndex: 0,
        top: `-${borderWidth}px`,
        right: `-${borderWidth}px`,
        bottom: `-${borderWidth}px`,
        left: `-${borderWidth}px`,
      }}
    >
      {/* Gradiente rotativo que cria a luz */}
      <div 
        className={`absolute inset-0 ${rounded}`}
        style={{
          background: `conic-gradient(from 0deg, transparent 0deg, transparent 45deg, ${color} 50deg, ${color} 55deg, transparent 60deg, transparent 360deg)`,
          animation: 'borderGlow 3s linear infinite',
          animationDuration: duration,
        }}
      />
      
      {/* Máscara para mostrar apenas a borda */}
      <div 
        className={`absolute ${rounded}`}
        style={{ 
          backgroundColor: maskColor,
          zIndex: 1,
          top: `${borderWidth}px`,
          right: `${borderWidth}px`,
          bottom: `${borderWidth}px`,
          left: `${borderWidth}px`,
        }}
      />
    </div>
  );
};

export default BorderGlow;

