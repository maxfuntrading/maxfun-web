
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'sm': { 'max': '750px' },
        'md': { 'min': '750px', 'max': '1400px' },
        'lg': { 'min': '1400px' },
      },
      colors: {
        blue: {
          10: '#000000',
          50: '#000000',
        }
      },
    },
  },
  plugins: [],
}

