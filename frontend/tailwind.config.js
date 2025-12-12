/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./public/**/*.{html,js}",
  ],
  theme: {
    extend: {
      colors: {
        // Cores Primárias MarcBuddy (Manual de Marca)
        brand: {
          // Verde Vibrante (Action Green) - CTAs, botões primários
          green: {
            DEFAULT: '#87c508',
            50: '#f0f9e8',
            100: '#daf1c8',
            200: '#b8e395',
            300: '#8fcf57',
            400: '#87c508', // Principal
            500: '#6fa006',
            600: '#547d05',
            700: '#415f08',
            800: '#364d0c',
            900: '#2f420f',
          },
          // Azul Marinho (Trust Blue) - Fundo principal, textos
          blue: {
            DEFAULT: '#011526',
            50: '#e6f0f5',
            100: '#b3d1e0',
            200: '#80b2cb',
            300: '#4d93b6',
            400: '#1a74a1',
            500: '#0d4a6b',
            600: '#0a3a54',
            700: '#072a3d',
            800: '#041a26',
            900: '#011526', // Principal
          },
          // Off-White (Clean White) - Superfícies secundárias
          white: {
            DEFAULT: '#F5F5F5',
          }
        },
        // Cores de Status
        status: {
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#3B82F6',
        },
        // Manter cinzas padrão do Tailwind para compatibilidade
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
          900: '#111827',
        },
        // Alias para compatibilidade (primary agora é brand-green)
        primary: {
          DEFAULT: '#87c508',
          50: '#f0f9e8',
          100: '#daf1c8',
          200: '#b8e395',
          300: '#8fcf57',
          400: '#87c508',
          500: '#6fa006',
          600: '#547d05',
          700: '#415f08',
          800: '#364d0c',
          900: '#2f420f',
        },
      },
      fontFamily: {
        // Fonte Principal: Nunito (títulos, destaques)
        // Poppins Medium: Botões e CTAs
        sans: ['Nunito', 'Poppins', 'system-ui', 'sans-serif'],
        nunito: ['Nunito', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      fontSize: {
        // Tamanhos recomendados do manual
        'brand-h1': ['48px', { lineHeight: '1.2', fontWeight: '700' }],
        'brand-h2': ['32px', { lineHeight: '1.2', fontWeight: '600' }],
        'brand-h3': ['24px', { lineHeight: '1.2', fontWeight: '600' }],
        'brand-body': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'brand-small': ['14px', { lineHeight: '1.4', fontWeight: '400' }],
        'brand-caption': ['12px', { lineHeight: '1.3', fontWeight: '400' }],
        'brand-label': ['14px', { lineHeight: '1.5', fontWeight: '600' }],
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
        bubble1: {
          '0%': { transform: 'translate(0%, 0%) scale(1)', opacity: '0.4' },
          '25%': { transform: 'translate(80%, 20%) scale(1.3)', opacity: '0.6' },
          '50%': { transform: 'translate(60%, 80%) scale(0.9)', opacity: '0.5' },
          '75%': { transform: 'translate(-5%, 60%) scale(1.1)', opacity: '0.6' },
          '100%': { transform: 'translate(0%, 0%) scale(1)', opacity: '0.4' },
        },
        bubble2: {
          '0%': { transform: 'translate(100%, 0%) scale(1.1)', opacity: '0.3' },
          '25%': { transform: 'translate(20%, 70%) scale(0.8)', opacity: '0.5' },
          '50%': { transform: 'translate(-5%, 30%) scale(1.2)', opacity: '0.6' },
          '75%': { transform: 'translate(70%, -5%) scale(1)', opacity: '0.4' },
          '100%': { transform: 'translate(100%, 0%) scale(1.1)', opacity: '0.3' },
        },
        bubble3: {
          '0%': { transform: 'translate(50%, 100%) scale(0.9)', opacity: '0.4' },
          '25%': { transform: 'translate(-5%, 10%) scale(1.2)', opacity: '0.6' },
          '50%': { transform: 'translate(90%, 50%) scale(1)', opacity: '0.5' },
          '75%': { transform: 'translate(30%, -5%) scale(1.1)', opacity: '0.6' },
          '100%': { transform: 'translate(50%, 100%) scale(0.9)', opacity: '0.4' },
        },
        bubble4: {
          '0%': { transform: 'translate(0%, 50%) scale(1.2)', opacity: '0.3' },
          '25%': { transform: 'translate(70%, -5%) scale(0.9)', opacity: '0.5' },
          '50%': { transform: 'translate(105%, 20%) scale(1.1)', opacity: '0.6' },
          '75%': { transform: 'translate(40%, -5%) scale(1)', opacity: '0.4' },
          '100%': { transform: 'translate(0%, 50%) scale(1.2)', opacity: '0.3' },
        },
        bubble5: {
          '0%': { transform: 'translate(100%, 50%) scale(1)', opacity: '0.4' },
          '25%': { transform: 'translate(10%, 0%) scale(1.3)', opacity: '0.6' },
          '50%': { transform: 'translate(-5%, 70%) scale(0.8)', opacity: '0.5' },
          '75%': { transform: 'translate(80%, -5%) scale(1.1)', opacity: '0.6' },
          '100%': { transform: 'translate(100%, 50%) scale(1)', opacity: '0.4' },
        },
        bubble6: {
          '0%': { transform: 'translate(30%, 0%) scale(1.1)', opacity: '0.3' },
          '25%': { transform: 'translate(105%, 60%) scale(0.9)', opacity: '0.5' },
          '50%': { transform: 'translate(0%, -5%) scale(1.2)', opacity: '0.6' },
          '75%': { transform: 'translate(60%, 40%) scale(1)', opacity: '0.4' },
          '100%': { transform: 'translate(30%, 0%) scale(1.1)', opacity: '0.3' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        shimmer: 'shimmer 3s infinite',
        bubble1: 'bubble1 15s ease-in-out infinite',
        bubble2: 'bubble2 18s ease-in-out infinite',
        bubble3: 'bubble3 20s ease-in-out infinite',
        bubble4: 'bubble4 16s ease-in-out infinite',
        bubble5: 'bubble5 22s ease-in-out infinite',
        bubble6: 'bubble6 19s ease-in-out infinite',
        fadeIn: 'fadeIn 0.3s ease-in',
      },
    },
  },
  plugins: [],
}
