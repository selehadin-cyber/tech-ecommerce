module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
       dmsans: ["DM Sans", "sans-serif"],
       rubik: ['Rubik', "sans-serif"],
      },
      screens: {
        "tablet": "800px",
        "500": "500px"
      }
    },
  },
  plugins: [],
}
