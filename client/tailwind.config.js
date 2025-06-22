/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fff1f0",
          100: "#ffe4e2",
          200: "#ffc9c5",
          300: "#ff9d97",
          400: "#ff6f61", // Your original primary color
          500: "#fb5546",
          600: "#e63e30",
          700: "#cc2d20",
          800: "#a9281d",
          900: "#8c241c",
        },
        secondary: {
          50: "#f0f7ff",
          100: "#e0eefb",
          200: "#c7e0f7",
          300: "#4a90e2", // Your original secondary color
          400: "#6ba5e9",
          500: "#4a90e2",
          600: "#3579cb",
          700: "#2d64ab",
          800: "#2a5187",
          900: "#274670",
        },
        accent: {
          50: "#fff9eb",
          100: "#fef0c7",
          200: "#f5a623", // Your original accent color
          300: "#fbd38d",
          400: "#f7b055",
          500: "#f5a623",
          600: "#e69619",
          700: "#bc7a14",
          800: "#976216",
          900: "#7c5215",
        },
        neutral: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
      },
    },
  },
  plugins: [],
};

// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
//   theme: {
//     extend: {
//       colors: {
//         primary: "#FF6F61",
//         secondary: "#4A90E2",
//         accent: "#F5A623",
//       },
//     },
//   },
//   plugins: [],
// };
