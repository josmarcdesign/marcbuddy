module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    // Minificação CSS em produção
    ...(process.env.NODE_ENV === 'production' ? {
      cssnano: {
        preset: ['default', {
          discardComments: {
            removeAll: true,
          },
          normalizeWhitespace: true,
          colormin: true,
          minifyFontValues: true,
          minifyGradients: true,
          // Otimizações adicionais para produção
          reduceIdents: true,
          mergeIdents: true,
          reduceTransforms: true,
          zindex: false, // Evita problemas com z-index
        }],
      }
    } : {}),
  },
}

