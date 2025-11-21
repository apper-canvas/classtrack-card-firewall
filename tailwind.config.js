/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#edf8fa',
          100: '#d1ecf0',
          200: '#a3d7e0',
          300: '#72bcc8',
          400: '#459ca9',
          500: '#2E7D87',
          600: '#277074',
          700: '#225e66',
          800: '#1e4f55',
          900: '#1b4349',
        },
        secondary: {
          50: '#f0f8fa',
          100: '#dbecf0',
          200: '#bcdbe2',
          300: '#92c4ce',
          400: '#5A9CA5',
          500: '#4a8591',
          600: '#3f6f7b',
          700: '#375c66',
          800: '#324e56',
          900: '#2d424a',
        },
        accent: {
          50: '#fff5ed',
          100: '#ffe8d5',
          200: '#ffc9aa',
          300: '#ffa274',
          400: '#FF8A3C',
          500: '#fb6f1a',
          600: '#ec5510',
          700: '#c44010',
          800: '#9b3316',
          900: '#7c2d15',
        },
        success: '#4CAF50',
        warning: '#FFB020',
        error: '#E74C3C',
        info: '#3498DB',
      },
    },
  },
  plugins: [],
}