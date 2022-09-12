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
        "500": "500px",
        "xs": {'max': '767px'}
      },
      gridTemplateColumns: {
        'auto-fill-275': 'repeat(auto-fill, minmax(275px, 1fr))',
        'auto-fit-275': 'repeat(auto-fit, minmax(275px, 1fr))',
      },
    },
  },
  plugins: [],
}
