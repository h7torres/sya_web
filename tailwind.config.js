/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Stripped to black/white/gray for now. Keeping the same token
        // names (paper, ink, stamp, rule, clay) means every component
        // that already references them updates automatically — if a
        // color direction gets added back later, it's a one-file change.
        paper: '#FFFFFF',
        ink: '#000000',
        stamp: '#000000',
        rule: '#D9D9D9',
        clay: '#000000',
      },
      fontFamily: {
        display: ['"Special Elite"', 'cursive', 'monospace'],
        sans: ['"Courier Prime"', 'monospace'],
        mono: ['"Courier Prime"', 'monospace'],
      },
    },
  },
  plugins: [],
}