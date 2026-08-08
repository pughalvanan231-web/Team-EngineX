/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        agent: {
          bg: "#FAFBFD",
          card: "#FFFFFF",
          tint: "#F2F7F4",
          tintBlue: "#F0F4FF",
          border: "#E2E8F0",
          borderMuted: "#F1F5F9",
          text: "#0F172A",
          secondary: "#475569",
          muted: "#64748B",
          accent: "#4F46E5",
          accentHover: "#4338CA",
          accentLight: "#6366F1",
          accentBg: "#EEF2FF",
          emerald: "#10B981",
          emeraldBg: "#ECFDF5",
          emeraldText: "#047857",
          sky: "#0284C7",
          skyBg: "#F0F9FF",
          pink: "#EC4899",
          pinkBg: "#FDF2F8",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'card': '0 4px 25px -4px rgba(0, 0, 0, 0.04), 0 2px 8px -2px rgba(0, 0, 0, 0.02)',
        'pill': '0 2px 10px rgba(0, 0, 0, 0.06)',
        'glow': '0 0 30px -5px rgba(79, 70, 229, 0.12)',
      }
    },
  },
  plugins: [],
}
