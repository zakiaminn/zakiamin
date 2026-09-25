/** @type {import('tailwindcss').Config} */
export default {
  // Dark mode follows the device's prefers-color-scheme setting (no in-page
  // toggle). Colors flow from CSS variables that flip under the dark media
  // query, so most components need no `dark:` variants at all.
  darkMode: 'media',
  // `hover:` only applies on real pointers, so a tap on a phone never leaves
  // a control stuck in its hover state.
  future: {
    hoverOnlyWhenSupported: true,
  },
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // House brand kit: "Sulfur on Chalk". One accent (chartreuse) that
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
        // legible accent text and thin graphics, `brand-fg` sits on a fill.
        brand: 'var(--brand)',
        'brand-ink': 'var(--brand-ink)',
        'brand-fg': 'var(--brand-fg)',
        'brand-wash': 'var(--brand-wash)',
        pos: 'var(--pos)',
        neg: 'var(--neg)',
        focus: 'var(--focus)',
      },
      fontFamily: {
        // Bricolage reads, Spline counts. Everything read, every label, every
        // button and the wordmark is Bricolage; the mono is kept to the numbers.
        bricolage: ['"Bricolage Grotesque"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        // Default sans stays Bricolage so stray utilities stay on-brand.
        sans: ['"Bricolage Grotesque"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        mono: ['"Spline Sans Mono"', 'ui-monospace', '"SF Mono"', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
}
