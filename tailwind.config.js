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
          DEFAULT: '#D48C9F', // Rose Gold/Pink
          dark: '#B56B7F',
          light: '#F5D0D8',
        },
        navy: {
          DEFAULT: '#2D2426', // Dark warm grey/brown instead of harsh navy
          dark: '#1A1415',
        },
        gold: {
          DEFAULT: '#D4AF37', // Keep gold for accents
          light: '#E5C565',
        },
        teal: {
          DEFAULT: '#D48C9F', // Replace teal with primary rose
          dark: '#B56B7F',
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











