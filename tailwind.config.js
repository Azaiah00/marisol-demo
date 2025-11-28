/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#c9a961',
          dark: '#b8964a',
          light: '#d4af37',
        },
        navy: {
          DEFAULT: '#1a202c',
          dark: '#0d1117',
        },
        gold: {
          DEFAULT: '#c9a961',
          light: '#d4af37',
        },
        teal: {
          DEFAULT: '#14b8a6',
          dark: '#0d9488',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}











