/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width:{
        "HisWid":"23rem"
      },
      height:{
        "NavHit":"69px"
      }
    },
  },
  plugins: [],
}