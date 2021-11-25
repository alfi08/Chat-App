const plugin = require("tailwindcss/plugin");

module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        background: "#222831",
        box: "#00ADB5",
        text: "#222831",
      },
      fontFamily: {},
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      const newUtilities = {
        ".no-scrollbar::-webkit-scrollbar": {
          display: "none",
        },
      };

      addUtilities(newUtilities);
    }),
  ],
};
