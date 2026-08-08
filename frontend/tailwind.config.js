/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
<<<<<<< HEAD
        agent: {
          bg: "#09090B",
          surface: "#121215",
          elevated: "#18181B",
          border: "#27272A",
          borderMuted: "#1F1F23",
          text: "#FAFAFA",
          secondary: "#A1A1AA",
          muted: "#71717A",
          accent: "#6366F1",
          accentHover: "#4F46E5",
          accentLight: "#818CF8",
          success: "#22C55E",
          warning: "#F59E0B",
          error: "#EF4444",
        }
=======
        ink: {
          950: '#05050a',
          900: '#0a0a12',
          850: '#0f0f1a',
          800: '#14141f',
          700: '#1c1c2b',
          600: '#26263a',
        },
        line: {
          800: '#262640',
          700: '#2f2f4a',
          600: '#3b3b5c',
        },
        primary: {
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
        },
        neon: {
          300: '#c4f0ff',
          400: '#7dd3fc',
          500: '#38bdf8',
        },
        mint: '#34d399',
        amber: '#fbbf24',
        coral: '#fb7185',
        muted: '#8b8ba3',
        faint: '#5b5b73',
>>>>>>> ef5acd71c8e8fed613b3c93946e4dab1962db1e8
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 40px rgba(139, 92, 246, 0.25)',
        'glow-sm': '0 0 18px rgba(139, 92, 246, 0.22)',
        card: '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 8px 32px rgba(0,0,0,0.35)',
      },
      backgroundImage: {
        'grid-faint':
          'linear-gradient(rgba(139,92,246,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.05) 1px, transparent 1px)',
        'radial-glow':
          'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(124,58,237,0.18), transparent)',
      },
      backgroundSize: { grid: '32px 32px' },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.35' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        'pulse-dot': 'pulse-dot 2s ease-in-out infinite',
        shimmer: 'shimmer 1.5s infinite',
      },
<<<<<<< HEAD
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        'glow': '0 0 20px -5px rgba(99, 102, 241, 0.15)',
      }
=======
>>>>>>> ef5acd71c8e8fed613b3c93946e4dab1962db1e8
    },
  },
  plugins: [],
}
