/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'petgas-green': '#009A44',
        'petgas-light-green': '#8CC63F',
        'petgas-dark': '#111827'
      },
    },
  },
  plugins: [],
}
