/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FFF9E6',
          100: '#FFF3C4',
          200: '#FFE580',
          300: '#FFD700',
          400: '#F0C040',
          500: '#C9A84C',
          600: '#A8861F',
          700: '#8B6914',
          800: '#6B4F0F',
          900: '#4A3508',
        },
        cream: {
          100: '#F5ECD7',
          200: '#EDD9C0',
          300: '#D4B896',
          400: '#B8A080',
          500: '#8A7060',
        },
        dark: {
          100: '#2A2A2A',
          200: '#1F1F1F',
          300: '#1A1A1A',
          400: '#141414',
          500: '#111111',
          600: '#0D0D0D',
          700: '#0A0A0A',
          800: '#080808',
          900: '#050505',
        }
      },
      fontFamily: {
        royal: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        elegant: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Montserrat"', 'sans-serif'],
      },
      animation: {
        shimmer: 'shimmer 3s linear infinite',
        float: 'float 4s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite alternate',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'slide-in': 'slideIn 0.4s ease-out forwards',
        'spin-slow': 'spin 8s linear infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        glow: {
          from: { boxShadow: '0 0 10px rgba(201,168,76,0.3)' },
          to: { boxShadow: '0 0 30px rgba(201,168,76,0.6), 0 0 60px rgba(201,168,76,0.2)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateX(24px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
      },
      boxShadow: {
        gold: '0 4px 24px rgba(201,168,76,0.25)',
        'gold-lg': '0 8px 40px rgba(201,168,76,0.35)',
        card: '0 8px 32px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [],
}
