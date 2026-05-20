export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#b27f52',
          dark: '#8c5f31',
          light: '#f8ead5',
          muted: '#695139'
        },
        surface: '#fbf6ef',
        accent: '#c77d3d',
        accentSoft: '#fde3c7',
        bg: '#f7f2eb',
        text: {
          DEFAULT: '#16161a',
          muted: '#5d5d5d'
        }
      },
      boxShadow: {
        soft: '0 18px 50px rgba(15, 23, 42, 0.08)',
        card: '0 20px 70px rgba(15, 23, 42, 0.12)',
        hero: '0 32px 80px rgba(17, 17, 17, 0.08)'
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      letterSpacing: {
        widest: '0.24em'
      },
      boxShadowColor: {
        brand: 'rgba(199, 125, 61, 0.18)'
      }
    },
  },
  plugins: [],
}
