const plugin = require('tailwindcss/plugin');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'], // Adjust this path based on your project
  theme: {
    extend: {
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(20px)' },
        },
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        'float-delay': 'float 5s ease-in-out infinite 2.5s',
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.sf1': { top: '10%', left: '15%' },
        '.sf2': { top: '25%', left: '70%' },
        '.sf3': { top: '50%', left: '40%' },
        '.sf4': { top: '75%', left: '20%' },
      });
    }),
  ],
};
