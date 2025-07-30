/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./contexts/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}", // Added pages directory
  ],
  darkMode: 'class', // or 'media'
  theme: {
    extend: {
      colors: {
        'ninja-orange': '#ff6806',
        'ninja-gold': '#cf974b', // This is brand-ninja-gold
        'brand-primary': '#ff6806', // Main brand color
        'brand-secondary': '#f8f8f7', // For light backgrounds or accents
        'brand-background': '#ffffff',
        'brand-text': '#1f2937', 
        'dark-background': '#111827', 
        'dark-text': '#f3f4f6', 

        // New specific brand colors from prompt
        'brand-dark-gray': '#2e2d2d',
        'brand-off-white': '#f8f8f7', // Same as brand-secondary, good
        'brand-ninja-gold': '#cf974b', // Explicitly named
        'brand-light-blue': '#47abd0',
        'brand-blue': '#00CAFF',
        'brand-medium-gray': '#9d9fa0',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'top': '0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)',
      }
    }
  },
  plugins: [],
}