/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode for theme switching
  theme: {
    extend: {
      colors: {
        // Recruiter Mode Colors
        recruiter: {
          background: '#FAFAFA',
          text: '#333333',
          accent: '#2563EB',
          'accent-hover': '#1D4ED8',
          'accent-light': '#DBEAFE',
          secondary: '#64748B',
          border: '#E2E8F0',
        },
        // Geek Mode Colors
        geek: {
          background: '#0F172A',
          'background-card': '#1E293B',
          'background-elevated': '#334155',
          text: '#FFFFFF',
          'text-secondary': '#CBD5E1',
          cyan: '#06B6D4',
          'cyan-hover': '#0891B2',
          'cyan-glow': 'rgba(6, 182, 212, 0.3)',
          purple: '#8B5CF6',
          'purple-hover': '#7C3AED',
          'purple-glow': 'rgba(139, 92, 246, 0.3)',
          border: '#334155',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['Fira Code', 'Consolas', 'Monaco', 'Courier New', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
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
        glowPulse: {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)',
          },
          '50%': { 
            boxShadow: '0 0 40px rgba(139, 92, 246, 0.5)',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'geek-gradient': 'linear-gradient(135deg, #06B6D4 0%, #8B5CF6 100%)',
        'geek-gradient-hover': 'linear-gradient(135deg, #0891B2 0%, #7C3AED 100%)',
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.5)',
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.5)',
        'glow-mixed': '0 0 30px rgba(6, 182, 212, 0.3), 0 0 60px rgba(139, 92, 246, 0.3)',
      },
    },
  },
  plugins: [],
}
