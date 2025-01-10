
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
      },
      screens: {
        'sm': { 'max': '750px' },
        'md': { 'min': '750px', 'max': '1400px' },
        'lg': { 'min': '1400px' },
        'mdup': { 'min': '750px' },
      },
      colors: {
        black: {
          10:  '#1E2022',
          20: '#141516',
        },
        red: {
          10: '#EC3E6F',
          20: '#FA608B',
        }
      },
    },
  },
  plugins: [],
}

