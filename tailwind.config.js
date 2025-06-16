/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5B4FE9',
        secondary: '#8B85F0',
        accent: '#FF6B6B',
        surface: '#FFFFFF',
        background: '#F7F8FA',
        success: '#4CAF50',
        warning: '#FF9800',
        error: '#F44336',
        info: '#2196F3',
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui']
      },
      animation: {
        'bounce-subtle': 'bounce-subtle 1.5s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite',
        'checkmark': 'checkmark 0.5s ease-in-out',
        'confetti': 'confetti 0.6s ease-out',
      },
      keyframes: {
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' }
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.33)', opacity: 1 },
          '80%, 100%': { transform: 'scale(2.33)', opacity: 0 }
        },
        'checkmark': {
          '0%': { strokeDashoffset: 16 },
          '100%': { strokeDashoffset: 0 }
        },
        'confetti': {
          '0%': { transform: 'scale(0) rotate(0deg)', opacity: 1 },
          '100%': { transform: 'scale(1) rotate(180deg)', opacity: 0 }
        }
      }
    },
  },
  plugins: [],
}