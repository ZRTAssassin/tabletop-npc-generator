/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/*.{html,js,css,ejs}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
};
