/** @type {import("prettier").Config} */
const config = {
  plugins: [require.resolve("prettier-plugin-tailwindcss")],
  tabWidth: 4,
  singleQuote: false,
  useTabs: false,
};

module.exports = config;
