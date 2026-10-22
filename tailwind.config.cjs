/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        primary: "#D8F3DC",
        secondary: "#01DF74",
        tertiary: "#151030",
        "black-100": "#100d25",
        "black-200": "#090325",
        "white-100": "#f3f3f3",
      },
      lighting: {
        neon: 'text-white text-shadow-lg stroke-2 stroke-white',
      },
      boxShadow: {
        card: "0px 35px 120px -15px #211e35",
      },
      screens: {
        xs: "300px",
      },
      width: {
        content: "fit-content",
      },
      backgroundImage: {
      
      },
    },
  },
  plugins: [],
};
