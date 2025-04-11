/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  important: true,
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
      },
      colors: {
        primary: "#0a0b0f",
        card: "#000000",
        accent: {
          from: "#6366f1",
          to: "#a855f7",
        },
      },
    },
  },
  plugins: [],
};
