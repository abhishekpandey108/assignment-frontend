/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", 
    "./index.html",
  ],
  theme: {
    extend: {
      colors: {
        'custom-dark': '#282D2D',
        'custom-gray': '#302E30',
        'custom-light-gray': '#3B3A3B',
        'custom-orange': '#E9522C',
      },
    },
  },
  plugins: [],
}
