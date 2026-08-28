/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FAF6EE',
          100: '#F5ECD7',
          200: '#EBD8AF',
          300: '#DFC184',
          400: '#D4AF59',
          500: '#C5A059',
          600: '#A6823F',
          700: '#83652D',
          800: '#634B22',
          900: '#463417',
        },
        ivory: {
          50: '#FFFFFF',
          100: '#FCFBF9',
          200: '#FAF7F2',
          300: '#F5EFEB',
          400: '#EDE4DC',
          500: '#DFD3C8',
        },
        roseDust: {
          50: '#FBF5F5',
          100: '#F5E7E7',
          200: '#ECD2D2',
          300: '#DEB3B3',
          400: '#CB8F8F',
          500: '#B87070',
          600: '#A15454',
          700: '#844141',
        },
        charcoal: {
          800: '#2A2826',
          900: '#1A1817',
          950: '#0E0C0A',
        }
      },
      fontFamily: {
        instrument: ['"Instrument Serif"', 'serif'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        script: ['"Pinyon Script"', '"Great Vibes"', 'cursive'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      transitionTimingFunction: {
        'entrance': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'overlay': 'cubic-bezier(0.76, 0, 0.24, 1)',
      },
      boxShadow: {
        'gold-glow': '0 0 25px rgba(212, 175, 89, 0.25)',
        'gold-glow-lg': '0 0 45px rgba(212, 175, 89, 0.35)',
        'luxury': '0 20px 50px -10px rgba(42, 40, 38, 0.1), 0 10px 20px -5px rgba(197, 160, 89, 0.08)',
        'envelope': '0 25px 60px -15px rgba(0, 0, 0, 0.25), 0 0 40px rgba(197, 160, 89, 0.15)',
      },
      animation: {
        'shimmer': 'shimmer 3s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.03)' },
        }
      }
    },
  },
  plugins: [],
}
