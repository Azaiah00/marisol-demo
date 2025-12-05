/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Strict Monochrome System
        primary: {
          DEFAULT: '#101010', // Deep Black
          hover: '#000000',   // Pure Black for hover states
          foreground: '#FFFFFF', // White text on primary
        },
        secondary: {
          DEFAULT: '#FFFFFF', // White
          hover: '#F9FAFB',   // Gray-50 for hover
          foreground: '#101010', // Black text on secondary
        },
        // Mapping old variable names to the new system to prevent breaking
        navy: '#101010',
        rose: {
          50: '#FAFAFA',
          100: '#F4F4F5',
          200: '#E4E4E7',
          300: '#D4D4D8',
          400: '#A1A1AA',
          500: '#71717A',
          600: '#52525B',
          700: '#3F3F46',
          800: '#27272A',
          900: '#18181B',
          DEFAULT: '#101010',
        },
        // Pink color palette for shadows and accents
        pink: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9f1239',
          900: '#831843',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '7xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        '8xl': ['6rem', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        '9xl': ['8rem', { lineHeight: '1', letterSpacing: '-0.04em' }],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      boxShadow: {
        'pink-sm': '0 2px 4px rgba(236, 72, 153, 0.2)',
        'pink-md': '0 4px 6px rgba(236, 72, 153, 0.25)',
        'pink-lg': '0 10px 15px rgba(236, 72, 153, 0.3)',
        'pink-xl': '0 20px 25px rgba(236, 72, 153, 0.25)',
        'pink-2xl': '0 25px 50px rgba(236, 72, 153, 0.3)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.1)',
        'glass-pink': '0 8px 32px rgba(236, 72, 153, 0.15)',
      }
    },
  },
  plugins: [],
}
