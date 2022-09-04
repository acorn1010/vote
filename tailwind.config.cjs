/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: process.env.NODE_ENV === 'development' ? [{
    pattern: /.*/,
  }] : [],
};
