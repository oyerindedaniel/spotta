/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // apps content
    `src/**/*.{js,ts,jsx,tsx}`,
    `./pages/**/*.{js,ts,jsx,tsx}`,
    "./app/**/*.{ts,tsx}",
    `./components/**/*.{js,ts,jsx,tsx}`,
    // packages content
    "../../packages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
