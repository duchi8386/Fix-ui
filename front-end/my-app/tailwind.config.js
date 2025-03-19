/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        purple: {
          50: "#ebe8ff",
          100: "#d6d1ff",
          200: "#b3a8ff",
          300: "#9080ff",
          400: "#7868e6",
          500: "#5e48e8",
          600: "#4932d0",
          700: "#382aa9",
          800: "#2b2082",
          900: "#1d165a",
        },
        pink: {
          50: "#ffe0eb",
          100: "#ffb6d0",
          200: "#ff8cb7",
          300: "#ff6b9d",
          400: "#ff4284",
          500: "#ff2171",
          600: "#e6005e",
          700: "#b80049",
          800: "#8a0037",
          900: "#5c0025",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
