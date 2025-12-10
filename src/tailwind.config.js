/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      container: {
        center: false, // DO NOT CENTER CONTENT
      },
      maxWidth: {
        none: 'none', // allow unlimited width
      },
    },
  },
  plugins: [],
};
