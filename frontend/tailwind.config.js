/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#080a0d',
          900: '#0f1115',
          800: '#161b22',
          700: '#1c2128',
          600: '#252b33',
        },
        accent: {
          DEFAULT: '#3b82f6',
          light: '#60a5fa',
          muted: '#1e3a5f',
          subtle: '#93c5fd',
        },
        'surface-border': '#30363d',
        'surface-hover': '#252b33',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(180deg, #0f1115 0%, #161b22 100%)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        drive: 'drive 3s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        drive: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(calc(100vw + 100%))' },
        },
      },
    },
  },
  plugins: [],
}
