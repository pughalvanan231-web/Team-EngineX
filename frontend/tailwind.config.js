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
          text: "#111111",
          secondary: "#737373",
          rationale: "#525252",
          border: "#E5E5E5",
          accent: "#6D5DFB",
          success: "#16A34A",
          error: "#DC2626",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      maxWidth: {
        '720': '720px',
      }
    },
  },
  plugins: [],
}
