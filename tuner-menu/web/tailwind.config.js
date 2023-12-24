/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        fadeInOut: {
          "0%, 100%": { opacity: 0.33 },
          "50%": { opacity: 1 },
        },
      },
      animation: {
        fadeInOut: "fadeInOut 3s infinite",
      },
      colors: {
        transparent: "transparent",
        current: "currentColor",
        primary: "#7367f0",
        secondary: "#4c5da8",
        purple: "#9867f0",
        info: "#67dbf0",
        dark: "#4899a8",
        bg: "#242e42",
        fore: "#2f3b52",
        success: "#28c76f",
        danger: "#ea5455",
        warning: "#ff9f43",
      },
      fontFamily: {
        orbitron: ["Orbitron", "sans-serif"],
        cairo: ["Cairo", "Helvetica", "Arial", "sans-serif"],
        icons: ["Material Symbols Outlined"],
      },
    },
  },
  plugins: [],
};
