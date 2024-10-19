/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'instagram-sans': ['Instagram Sans', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        'instagram-blue': '#0095f6',
        'instagram-purple': '#8a3ab9',
        'instagram-pink': '#e95950',
      },
    },
  },
  plugins: [],
}