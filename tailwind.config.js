/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: '#0D0B08',      // near-black ground — the "stock" background
        paperDim: '#1B1712',   // raised panel, one step lighter
        ink: '#F5F0E4',        // warm off-white, primary text & dot ink
        inkSoft: '#BFB8A4',    // muted light, secondary text
        inkFaint: '#8C866F',   // faint, tertiary/labels
        flame: '#FF5A33',      // vivid flame — primary spot color
        cobalt: '#F0A93A',     // amber — secondary spot color
        line: 'rgba(245,240,228,0.16)',
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Archivo"', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'monospace'],
      },
      // Required by the shadcn Accordion primitive.
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.22s cubic-bezier(.16,1,.3,1)',
        'accordion-up': 'accordion-up 0.18s cubic-bezier(.16,1,.3,1)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
