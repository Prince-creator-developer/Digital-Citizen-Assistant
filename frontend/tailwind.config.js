/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          500: '#FF9933',
          600: '#E68019',
        },
        govblue: {
          800: '#002B49',
          900: '#001A2C',
        },
        ashoka: {
          600: '#000080',
        }
      },
    },
  },
  plugins: [],
}
