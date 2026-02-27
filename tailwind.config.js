/** @type {import('tailwindcss').Config} */
export default {
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
        // A Outfit será a fonte padrão de todo o site (textos, botões, menu)
        sans: ['Outfit', 'sans-serif'],
        // A Syne será usada apenas nos títulos para dar impacto
        syne: ['Syne', 'sans-serif'], 
      }
    },
  },
  plugins: [],
}