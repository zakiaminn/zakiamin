import tailwindcssAnimate from 'tailwindcss-animate'

/** @type {import('tailwindcss').Config} */
export default {
  // Dark mode follows the device's prefers-color-scheme setting (no in-page
  // toggle). Colors flow from CSS variables that flip under the dark media
  // query, so most components need no `dark:` variants at all.
  darkMode: 'media',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // House brand kit — "Sulfur on Chalk". One accent (chartreuse) that
      // marks the interface; a warm-neutral spine; green/red reserved for data.
      // Every value resolves to a CSS variable defined in index.css.
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        ink: 'var(--ink)',
        'ink-2': 'var(--ink-2)',
        'ink-3': 'var(--ink-3)',
        rule: 'var(--rule)',
        'rule-2': 'var(--rule-2)',
        // The accent splits three ways: `brand` is the fill, `brand-ink` is
        // contrast-safe accent text/links/icons, `brand-fg` sits on a fill.
        brand: 'var(--brand)',
        'brand-ink': 'var(--brand-ink)',
        'brand-fg': 'var(--brand-fg)',
        'brand-wash': 'var(--brand-wash)',
        pos: 'var(--pos)',
        neg: 'var(--neg)',
        focus: 'var(--focus)',
      },
      fontFamily: {
        // Bricolage reads, Martian counts. Anything a human reads is Bricolage;
        // anything the machine emits (numbers, labels, the wordmark) is Martian.
        bricolage: ['"Bricolage Grotesque"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        martian: ['"Martian Mono"', 'ui-monospace', '"SF Mono"', 'Menlo', 'monospace'],
        // Defaults point at the same two families so stray utilities stay on-brand.
        sans: ['"Bricolage Grotesque"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        mono: ['"Martian Mono"', 'ui-monospace', '"SF Mono"', 'Menlo', 'monospace'],
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
  plugins: [tailwindcssAnimate],
}
