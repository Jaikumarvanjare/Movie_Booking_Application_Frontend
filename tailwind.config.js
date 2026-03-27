/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#E11D48",
          dark: "#BE123C",
          light: "#FB7185"
        }
      }
    }
  },
  plugins: []
}
