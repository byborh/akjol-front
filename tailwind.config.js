/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light mode (60-30-10)
        'alabaster': '#F8F9FA',
        'cloud': '#E2E8F0',
        // Dark mode (60-30-10)
        'matt-black': '#121212',
        'anthracite': '#27272A',
        // Accent (10%)
        'electric-violet': '#8B5CF6',
      },
    },
  },
  plugins: [],
}