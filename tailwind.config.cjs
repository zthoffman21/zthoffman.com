/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte,md,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--backgroundColor)'
      },
      fontFamily: {
        pixel: ['"Pixelated MS Sans Serif"', 'Arial', 'sans-serif'],
        ms: ['"MS Sans Serif"', 'Arial', 'sans-serif']
      }
    }
  },
  plugins: []
};

