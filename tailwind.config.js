/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji'],
      },
      colors: {
        brand: {
          primary: 'rgb(var(--brand-primary-rgb))',
          primaryDark: 'var(--brand-primary-dark)',
          light: 'var(--brand-light)',
        },
        surface: {
          DEFAULT: '#ffffff',
          muted: '#f9fafb',
        },
      },
      borderRadius: {
        xl: '0.875rem',
      },
      boxShadow: {
        card: '0 2px 8px rgba(15, 23, 42, 0.06)',
        focus: '0 0 0 3px rgba(var(--brand-primary-rgb, 237, 28, 36), 0.4)',
      },
    },
  },
  plugins: [],
}



