/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
      "./**/*.{js,ts,jsx,tsx}"
    ],
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          primary: '#fe5009', // Laranja Young
          secondary: '#00bcbc', // Turquesa Young
          dark: '#1e293b',
          light: '#f8fafc'
        },
        fontFamily: {
          sans: ['"Be Vietnam Pro"', 'sans-serif'],
          display: ['"Space Grotesk"', 'sans-serif'],
        }
      },
    },
    plugins: [],
  }