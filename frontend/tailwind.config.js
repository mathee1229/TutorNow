/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blueberry: {
          DEFAULT: '#6A00F4',
          hover: '#5400C2',
        },
        'cream-soda': '#FFD6A5',
        cream: {
          50: '#FFF8EF',
          100: '#FFEBD3',
          200: '#FFD6A5',
          300: '#FFC281',
          500: '#FFD6A5',
          700: '#5400C2',
          800: '#430099',
          900: '#320073',
          950: '#22004D',
        },
        porcelain: {
          DEFAULT: '#FFF8EF',
          dark: '#FFEBD3',
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
        'brand': '0 10px 25px -5px rgba(106, 0, 244, 0.25)',
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)'
      }
    },
  },
  plugins: [],
}
