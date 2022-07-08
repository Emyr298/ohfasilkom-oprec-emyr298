/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'blacktr-1/10': 'rgba(0, 0, 0, 0.1)',
        'blacktr-1/5': 'rgba(0, 0, 0, 0.2)',
        'blacktr-1/2': 'rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
}
