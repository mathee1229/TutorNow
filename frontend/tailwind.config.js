/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          orange: '#FF5F1F',
          hover: '#E04E15',
          light: '#FFF0EB'
        },
        porcelain: {
          DEFAULT: '#F7F8F9',
          dark: '#EAECEF',
          card: '#FFFFFF'
        },
        surface: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          800: '#1F2937',
          900: '#111827'
        }
      },
      boxShadow: {
        'brand': '0 10px 25px -5px rgba(255, 95, 31, 0.25)',
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)'
      }
    },
  },
  plugins: [],
}
