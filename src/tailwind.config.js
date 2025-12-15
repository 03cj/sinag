/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      container: {
        center: false,
      },
      maxWidth: {
        none: 'none',
      },

      // 🔥 MOVING GRADIENT ANIMATION
      backgroundSize: {
        '200%': '200% 200%',
      },
      keyframes: {
        gradientMove: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      animation: {
        gradient: 'gradientMove 8s ease infinite',
      },
    },
  },
  plugins: [],
};
