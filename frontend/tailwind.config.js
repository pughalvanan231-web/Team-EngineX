/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nova: {
          bg: "#FFFFFF",
          bgSecondary: "#F8F8FA",
          card: "#FFFFFF",
          border: "#E5E7EB",
          borderHover: "#D1D5DB",
          textPrimary: "#111827",
          textSecondary: "#6B7280",
          accent: "#6D5DFB",
          accentLight: "#F3F0FF",
          accentHover: "#5B4CF0",
          success: "#16A34A",
          warning: "#D97706",
          error: "#DC2626",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Consolas', 'monospace'],
      },
      boxShadow: {
        subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
