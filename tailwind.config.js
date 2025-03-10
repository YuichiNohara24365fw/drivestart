/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        horizon: {
          50: '#f2f7f5',
          100: '#e6f0eb',
          200: '#bfd9ce',
          300: '#99c2b0',
          400: '#4d9475',
          500: '#00663a', // ホライゾングリーンのメインカラー
          600: '#005c34',
          700: '#004d2c',
          800: '#003d23',
          900: '#00321c',
        }
      }
    },
  },
  plugins: [],
};