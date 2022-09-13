/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.tsx'],
  safelist: [
    {
      pattern: /bg-(\w*)/,
    },
  ],
  theme: {
    extend: {
      fontFamily: {
        brand: ['Inter'],
      },
      screens: {
        xlg: { max: '1023px' },
        xmg: { max: '767px' },
        xsm: { max: '639px' },
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
      animation: {
        wiggle: 'wiggle 2s ease-in-out infinite',
      },
      colors: {
        select: {
          white: '#FFFFFF',
          silver: '#C0C0C0',
          gray: '#808080',
          black: '#000000',
          red: '#FF0000',
          brown: '#800000',
          yellow: '#FFFF00',
          olive: '#808000',
          lime: '#00FF00',
          green: '#008000',
          aqua: '#00FFFF',
          teal: '#008080',
          blue: '#0000FF',
          navy: '#000080',
          fuchsia: '#FF00FF',
          purple: '#800080',
        },
        brand: {
          base: '#338896',
          hover: '#3FA7B8',
        },
        body: {
          light: {
            100: '#F3F9F9',
            200: '#EAEDF0',
          },
          dark: '#23292C',
        },
        btn: {
          primary: {
            base: '#338896',
            hover: '#3FA7B8',
            loading: '#338896E6 ',
            disabled: '#33889680',
          },
          secondary: {
            base: '#424245',
            hover: '#5C5C5C',
            loading: '#424245E6',
            disabled: '#42424580',
          },
          cancel: {
            base: '#E24B2D',
            hover: '#F2664A',
            loading: '#E24B2DE6',
            disabled: '#E24B2D80',
          },
          session: '#75ACB1',
          text: '#F7F7F7',
          inactive: '#F7F7F780',
        },
        input: {
          base: '#F7F7F7',
          readonly: '#D2D2D2',
          border: '#D2D2D2',
          focus: '#3FA7B8',
          text: '#353535',
          placeholder: '#727272',
          inactive: '#A8A8A8',
          error: '#FF5959',
        },
        icon: {
          light: '#FFFFFF',
          dark: {
            100: '#777777',
            200: '#353535',
          },
          gold: '#C98E26',
        },
        header: {
          dark: '#202020',
          light: '#F7F7F7',
          gold: '#C98E26',
        },
        paragraph: {
          dark: '#353535',
          light: {
            100: '#A1A1A1',
            200: '#727272',
          },
        },
      },
    },
  },
  plugins: [],
};
