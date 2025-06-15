/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FF6F61",
        secondary: "#4A90E2",
        accent: "#F5A623",
      },
    },
  },
  plugins: [],
};
