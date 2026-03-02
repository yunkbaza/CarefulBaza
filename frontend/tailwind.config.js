/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        baza: {
          lavender: '#a79af0',
          mint: '#f3ffe3',
          creme: '#faf8eb',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        syne: ['Syne', 'sans-serif'], 
      }
    },
  },
  plugins: [],
}