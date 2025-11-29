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
          DEFAULT: '#E5E4E2', // Platinum/Silver
          dark: '#C0C0C0',    // Darker Silver for hover
          light: '#F5F5F0',   // Pale Platinum
        },
        rose: {
          DEFAULT: '#E8B4B8', // Soft Rose Gold
          dark: '#D4A5A5',    // Darker Rose Gold
          light: '#FADADD',   // Light Rose
        },
        black: {
          DEFAULT: '#000000',
          soft: '#1A1A1A',    // Near Black
        },
        navy: {
          DEFAULT: '#1A1A1A', // Replaced with Near Black
          dark: '#000000',    // True Black
        },
        // Removing gold entirely
        teal: {
          DEFAULT: '#E8B4B8', // Map to Rose Gold
          dark: '#D4A5A5',
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











