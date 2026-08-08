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
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        'glow': '0 0 20px -5px rgba(99, 102, 241, 0.15)',
      }
    },
  },
  plugins: [],
}
