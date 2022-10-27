/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/*/*.{html,css,js,ejs}", "./views/*.{html,css,js,ejs}"],
  theme: {
    extend: {},
  },
  // add daisyUI plugin
  plugins: [require("daisyui")],

  // daisyUI config (optional)
  daisyui: {
    styled: true,
    themes: true,
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    darkTheme: "dark",
  },
};
