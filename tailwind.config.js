/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ], // Adjust paths if your source files are in a different location
  theme: {
    extend: {},
  },
  plugins: [],
  darkMode: 'class', // This enables the 'dark:' prefix for classes
}