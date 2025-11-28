// tailwind.config.cjs
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
        day: {
          bg: '#F3F4F6',
          surface: 'rgba(255, 255, 255, 0.65)',
          text: '#1F2937',
          accent: '#6366F1',
          border: 'rgba(255, 255, 255, 0.4)'
        },
        night: {
          bg: '#0f172a',
          surface: 'rgba(30, 41, 59, 0.7)',
          text: '#F1F5F9',
          accent: '#818CF8',
          border: 'rgba(255, 255, 255, 0.08)'
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'blob': 'blob 7s infinite',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        }
      }
    },
  },
  plugins: [],
}