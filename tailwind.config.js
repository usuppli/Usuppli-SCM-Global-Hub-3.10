
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // This covers everything inside the src folder and its subfolders
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        // LANGUAGE SELECTOR
        '3xs': ['0.6rem', { lineHeight: '0.75rem' }], 

        // KPI LABELS (10px)
        '2xs': ['0.625rem', { lineHeight: '0.85rem' }],

        // SUBHEADINGS / CARD TEXT (~12.8px)
        'xs': ['0.8rem', { lineHeight: '1.2rem' }],

        // BUTTONS / BODY
        'sm': ['0.9rem', { lineHeight: '1.25rem' }],

        // PAGE TITLES (24px)
        '2xl': ['1.5rem', { lineHeight: '2rem' }],       
        
        // Standard sizes
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      },
      fontWeight: {
        normal: '400',
        medium: '500', 
        bold: '700',
      }
    },
  },
  plugins: [],
}