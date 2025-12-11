/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Usamos 'class' para controlar el tema mediante la clase 'dark' en el HTML
  theme: {
    extend: {
      colors: {
        // Modo Recruiter (Light Mode)
        recruiter: {
          background: '#FAFAFA',
          text: '#1a1a1a',
          primary: '#2563EB',
          'primary-hover': '#1D4ED8',
          'primary-light': '#DBEAFE',
          secondary: '#64748B',
          accent: '#10B981',
          border: '#E5E7EB',
          card: '#FFFFFF',
        },
        // Modo Geek (Dark Mode)
        geek: {
          background: '#0a0a0f',
          'background-secondary': '#141420',
          text: '#FFFFFF',
          'text-secondary': '#94a3b8',
          primary: '#06B6D4',
          'primary-hover': '#0891B2',
          'primary-light': '#164E63',
          secondary: '#8B5CF6',
          'secondary-hover': '#7C3AED',
          'secondary-light': '#4C1D95',
          accent: '#10B981',
          border: 'rgba(255, 255, 255, 0.1)',
          card: 'rgba(30, 41, 59, 0.4)',
        },
        // Glassmorphism colors
        glass: {
          'white': 'rgba(255, 255, 255, 0.05)',
          'white-10': 'rgba(255, 255, 255, 0.1)',
          'white-20': 'rgba(255, 255, 255, 0.2)',
          'dark': 'rgba(10, 10, 15, 0.4)',
          'dark-60': 'rgba(10, 10, 15, 0.6)',
          'border-light': 'rgba(255, 255, 255, 0.1)',
          'border-dark': 'rgba(0, 0, 0, 0.1)',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(6, 182, 212, 0.3), 0 0 40px rgba(139, 92, 246, 0.2)' },
          '100%': { boxShadow: '0 0 30px rgba(6, 182, 212, 0.5), 0 0 60px rgba(139, 92, 246, 0.3)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-sm': '0 4px 16px 0 rgba(31, 38, 135, 0.2)',
        'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.4), 0 0 40px rgba(6, 182, 212, 0.2)',
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.4), 0 0 40px rgba(139, 92, 246, 0.2)',
        'glow-mixed': '0 0 20px rgba(6, 182, 212, 0.3), 0 0 40px rgba(139, 92, 246, 0.2)',
        'recruiter': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'geek': '0 4px 6px -1px rgba(6, 182, 212, 0.1), 0 2px 4px -1px rgba(139, 92, 246, 0.06)',
        'card-recruiter': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'card-geek': '0 10px 15px -3px rgba(6, 182, 212, 0.15), 0 4px 6px -2px rgba(139, 92, 246, 0.1)',
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'gradient-recruiter': 'linear-gradient(135deg, #2563EB 0%, #10B981 100%)',
        'gradient-geek': 'linear-gradient(135deg, #06B6D4 0%, #8B5CF6 100%)',
        'gradient-text': 'linear-gradient(135deg, #06B6D4 0%, #8B5CF6 50%, #EC4899 100%)',
      },
    },
  },
  plugins: [],
}
