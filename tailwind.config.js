/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")], // <-- This line is required

  theme: {
    extend: {},
  },
  plugins: [],
}

