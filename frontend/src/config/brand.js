/**
 * Identidade Visual MarcBuddy
 * 
 * Este arquivo centraliza todas as configurações de identidade visual da marca.
 * Atualize aqui quando precisar modificar cores, fontes ou outros elementos visuais.
 * 
 * Última atualização: 2025-12-01
 */

export const BRAND_COLORS = {
  // Cores Primárias
  primary: {
    // Verde Vibrante (Action Green) - CTAs, botões primários, destaque
    green: {
      DEFAULT: '#87c508',
      hex: '#87c508',
      rgb: '135, 197, 8',
      cmyk: '32%, 0%, 95%, 23%',
      hsl: '74°, 96%, 40%',
      usage: 'CTAs, botões primários, destaque, ação'
    },
    // Azul Marinho (Trust Blue) - Fundo principal, textos primários
    blue: {
      DEFAULT: '#011526',
      hex: '#011526',
      rgb: '1, 21, 38',
      cmyk: '97%, 45%, 0%, 85%',
      hsl: '209°, 95%, 8%',
      usage: 'Fundo principal, textos primários, cabeçalhos'
    },
    // Off-White (Clean White) - Superfícies secundárias
    white: {
      DEFAULT: '#F5F5F5',
      hex: '#F5F5F5',
      rgb: '245, 245, 245',
      cmyk: '0%, 0%, 0%, 4%',
      hsl: '0°, 0%, 96%',
      usage: 'Superfícies secundárias, contraste, clareza'
    }
  },

  // Cores de Status
  status: {
    success: {
      hex: '#10B981',
      rgb: '16, 185, 129',
      usage: 'Confirmação, ativo'
    },
    warning: {
      hex: '#F59E0B',
      rgb: '245, 158, 11',
      usage: 'Alerta, atenção'
    },
    error: {
      hex: '#EF4444',
      rgb: '239, 68, 68',
      usage: 'Erro, bloqueio'
    },
    info: {
      hex: '#3B82F6',
      rgb: '59, 130, 246',
      usage: 'Informação, dica'
    }
  },

  // Cinzas Neutros (para acessibilidade)
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827'
  }
};

// Nome curto para cores principais (referência única)
export const BRAND_COLOR_NAMES = {
  MB_GREEN: BRAND_COLORS.primary.green.hex,   // Verde principal
  MB_BLUE: BRAND_COLORS.primary.blue.hex,     // Azul escuro principal
  MB_WHITE: BRAND_COLORS.primary.white.hex,   // Off-white (#F5F5F5)
};

export const BRAND_TYPOGRAPHY = {
  // Fonte Principal: Nunito
  primary: {
    name: 'Nunito',
    family: 'Nunito, sans-serif',
    weights: [300, 400, 600, 700],
    usage: [
      'H1, H2, H3 (títulos)',
      'Slogans e taglines',
      'Destaque em cards',
      'Headlines de newsletter'
    ],
    characteristics: 'Geométrica, arredondada, amigável'
  },

  // Fonte Secundária: Poppins
  secondary: {
    name: 'Poppins',
    family: 'Poppins, sans-serif',
    weights: [300, 400, 500, 600, 700],
    usage: [
      'Parágrafos e corpo',
      'Labels e descrições',
      'Valores e dados numéricos',
      'Textos de suporte',
      'Emails e newsletters',
      'Botões e CTAs'
    ],
    characteristics: 'Geométrica, moderna, legível'
  },

  // Tamanhos Recomendados
  sizes: {
    body: {
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: 1.5,
      usage: 'Padrão'
    },
    small: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: 1.4,
      usage: 'Labels, hints'
    },
    caption: {
      fontSize: '12px',
      fontWeight: 400,
      lineHeight: 1.3,
      usage: 'Footnotes'
    },
    label: {
      fontSize: '14px',
      fontWeight: 600,
      lineHeight: 1.5,
      usage: 'Form labels'
    },
    h1: {
      fontSize: '48px',
      fontWeight: 700,
      fontFamily: 'Nunito',
      usage: 'Títulos principais'
    },
    h2: {
      fontSize: '32px',
      fontWeight: 600,
      fontFamily: 'Nunito',
      usage: 'Subtítulos'
    },
    h3: {
      fontSize: '24px',
      fontWeight: 600,
      fontFamily: 'Nunito',
      usage: 'Títulos de seção'
    }
  }
};

export const BRAND_SPACING = {
  // Espaçamentos padrão (em pixels)
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px'
};

export const BRAND_BORDERS = {
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px'
  },
  width: {
    thin: '1px',
    medium: '2px',
    thick: '4px'
  }
};

export const BRAND_SHADOWS = {
  sm: '0 1px 2px 0 rgba(1, 21, 38, 0.05)',
  md: '0 4px 6px -1px rgba(1, 21, 38, 0.1)',
  lg: '0 10px 15px -3px rgba(1, 21, 38, 0.1)',
  xl: '0 20px 25px -5px rgba(1, 21, 38, 0.1)'
};

// Recomendações de Contraste (WCAG AA)
export const BRAND_CONTRAST = {
  // Texto sobre verde vibrante
  textOnGreen: {
    primary: '#011526', // Azul Marinho
    secondary: '#000000' // Preto
  },
  // Texto sobre azul marinho
  textOnBlue: {
    primary: '#F5F5F5', // Off-White
    secondary: '#87c508' // Verde Vibrante
  },
  // Texto sobre off-white
  textOnWhite: {
    primary: '#011526', // Azul Marinho
    secondary: '#374151' // Gray-700
  }
};

// ============================================
// HELPERS DE CORES - Use nomes simples
// ============================================

/**
 * Cores da marca por nome simples
 * Use: brandColor('blue'), brandColor('green'), brandColor('white')
 */
export const brandColor = (colorName) => {
  const colors = {
    // Cores primárias da marca
    green: BRAND_COLORS.primary.green.hex,
    blue: BRAND_COLORS.primary.blue.hex,
    white: BRAND_COLORS.primary.white.hex,
    
    // Cores de status
    success: BRAND_COLORS.status.success.hex,
    warning: BRAND_COLORS.status.warning.hex,
    error: BRAND_COLORS.status.error.hex,
    info: BRAND_COLORS.status.info.hex,
  };
  
  return colors[colorName] || colorName; // Se não encontrar, retorna o valor original (permite códigos hex customizados)
};

/**
 * Objeto com todas as cores da marca por nome
 * Use: brandColors.green, brandColors.blue, brandColors.white
 */
export const brandColors = {
  // Cores primárias
  green: BRAND_COLORS.primary.green.hex,
  blue: BRAND_COLORS.primary.blue.hex,
  white: BRAND_COLORS.primary.white.hex,
  
  // Cores de status
  success: BRAND_COLORS.status.success.hex,
  warning: BRAND_COLORS.status.warning.hex,
  error: BRAND_COLORS.status.error.hex,
  info: BRAND_COLORS.status.info.hex,
};

/**
 * Helper para criar objetos de estilo com cores da marca
 * Use: brandStyle({ bg: 'green', color: 'blue' })
 */
export const brandStyle = (styles) => {
  const result = {};
  
  if (styles.bg) {
    const bgColor = brandColor(styles.bg);
    result.backgroundColor = bgColor;
    result.background = bgColor; // Garante que ambos sejam definidos
  }
  if (styles.color) {
    result.color = brandColor(styles.color);
  }
  if (styles.border) {
    result.borderColor = brandColor(styles.border);
  }
  
  // Permite passar outros estilos diretamente
  Object.keys(styles).forEach(key => {
    if (!['bg', 'color', 'border'].includes(key)) {
      result[key] = styles[key];
    }
  });
  
  return result;
};

export default {
  colors: BRAND_COLORS,
  colorNames: BRAND_COLOR_NAMES,
  typography: BRAND_TYPOGRAPHY,
  spacing: BRAND_SPACING,
  borders: BRAND_BORDERS,
  shadows: BRAND_SHADOWS,
  contrast: BRAND_CONTRAST,
  // Helpers
  brandColor,
  brandColors,
  brandStyle
};

