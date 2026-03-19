/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        legal: {
          green: '#16a34a',
          red: '#dc2626',
          yellow: '#d97706',
          dark: '#1e293b',
          light: '#f8fafc',
        }
      }
    },
  },
  plugins: [],
}