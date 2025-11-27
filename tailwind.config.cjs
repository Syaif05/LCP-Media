/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        // Warna Aksen Baru: ORANGE / AMBER
        accent: {
          light: '#f97316', // Orange cerah untuk Light Mode
          dark: '#fb923c',  // Orange lembut untuk Dark Mode
          glow: 'rgba(249, 115, 22, 0.5)' // Glow effect orange
        },
        // Palette Dark Mode (Tetap Keren)
        dark: {
          bg: '#0f1014',
          card: '#18181b',
          border: '#27272a',
          text: '#e4e4e7'
        },
        // Palette Light Mode (CREAMY / WARM - Sesuai Request)
        light: {
          bg: '#fffbf2',       // <--- Putih kekuningan/Cream (Warm White)
          card: '#ffffff',     // Kartu tetap putih agar kontras
          border: '#e6e1d6',   // Border agak kecoklatan dikit
          text: '#4a4440'      // Teks abu kecoklatan (biar enak dibaca)
        }
      },
      boxShadow: {
        'glow': '0 0 20px rgba(249, 115, 22, 0.2)', // Glow Orange
        'soft': '0 4px 20px rgba(149, 113, 85, 0.08)', // Shadow hangat
      }
    },
  },
  plugins: [],
}