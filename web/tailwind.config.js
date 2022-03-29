const colors = require('tailwindcss/colors')


module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gray: colors.neutral,
        zinc: colors.zinc,
        stone: colors.stone,
        bgWhite: colors.neutral['200'],
      },
      spacing: {
        '96': '24rem',
        '108': '27rem',
        '120': '30rem',
        '132': '33rem',
        '144': '36rem',
        '156': '39rem',
      },
      fontFamily: {
        inter: [
          'Inter',
          'sans-serif',
        ]
      },
      boxShadow: {
        'full': '0px 0px 16px -2px rgba(0,0,0,0.84)'
      }
    },
  },
  variants: {
    ringWidth: ['group-focus'],
    extend: {
      ringWidth: ['group-focus'],
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}
