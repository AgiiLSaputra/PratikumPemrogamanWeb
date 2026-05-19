/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{html,js,ts,jsx,tsx}", // kalau ada folder src
    "./**/*.{html,js}", // untuk project sederhana
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
