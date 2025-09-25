/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette from provided logo/colors
        primary: {
          50: '#FFF6E6',
          100: '#FCEAC7',
          200: '#F6D999',
          300: '#F0C66A',
          400: '#E7B646',
          500: '#CD9613', // Warm Gold (CTA)
          600: '#B88211',
          700: '#9C6E0E',
          800: '#7C570B',
          900: '#5D4108',
        },
        secondary: {
          50: '#E6EBF2',
          100: '#CCD6E5',
          200: '#99AECB',
          300: '#6686B0',
          400: '#335E96',
          500: '#0A2644', // Accent Navy
          600: '#091F39',
          700: '#07192E',
          800: '#061324',
          900: '#011C3C', // Brand Navy (Deep)
        },
        brand: {
          navy: '#011C3C',
          navyAccent: '#0A2644',
          gold: '#CD9613',
          goldMuted: '#DAB157',
          grayMuted: '#A0A3A7',
          offWhite: '#FAF2E6',
        },
        // Map functional colors to brand (no green/blue)
        success: '#CD9613',
        warning: '#DAB157',
        error: '#DC2626',
        gray: {
          50: '#FAF2E6', // background
          100: '#F5EEE2',
          200: '#ECE6DB',
          300: '#D9D6D1',
          400: '#A0A3A7',
          500: '#7B7F84',
          600: '#5B6066',
          700: '#3E434A',
          800: '#232A33',
          900: '#0F1720',
        },
      },
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui'],
        'display': ['Poppins', 'ui-sans-serif', 'system-ui'],
      },
      backgroundImage: {
        'nubix-gradient': 'linear-gradient(135deg, #CD9613 0%, #0A2644 100%)',
        'nubix-gold': 'linear-gradient(135deg, #CD9613 0%, #DAB157 100%)',
        'nubix-navy': 'linear-gradient(135deg, #011C3C 0%, #0A2644 100%)',
      },
      boxShadow: {
        'nubix': '0 4px 6px -1px rgba(1, 28, 60, 0.08), 0 2px 4px -1px rgba(205, 150, 19, 0.06)',
        'nubix-lg': '0 10px 15px -3px rgba(1, 28, 60, 0.1), 0 4px 6px -2px rgba(205, 150, 19, 0.08)',
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  }
}