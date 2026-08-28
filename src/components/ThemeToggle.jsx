import React, { useEffect, useState } from 'react';
import posthog from '@/lib/posthog';

/**
 * Light/dark switch. The initial class is set before paint in index.html, so
 * this only mirrors and flips it. The choice is persisted; a `themechange`
 * event lets the canvas-drawn halftone re-read its ink from the new palette.
 */
function currentTheme() {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

export default function ThemeToggle({ className = '' }) {
  const [theme, setTheme] = useState(currentTheme);

  useEffect(() => {
    const el = document.documentElement;
    el.classList.toggle('dark', theme === 'dark');
    el.classList.toggle('light', theme === 'light');
    try {
      localStorage.setItem('theme', theme);
    } catch {
      /* private mode / storage disabled — the toggle still works this session */
    }
    window.dispatchEvent(new CustomEvent('themechange', { detail: theme }));
  }, [theme]);

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={() => { const next = isDark ? 'light' : 'dark'; setTheme(next); posthog.capture('theme_toggled', { theme: next }); }}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={
        'inline-flex items-center justify-center h-9 w-9 border rule text-ink-2 ' +
        'hover:text-ink hover:border-rule-2 transition-colors ' +
        className
      }
    >
      {isDark ? (
        // Sun — offering the light theme.
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor"
             strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8l1.8-1.8M18 6l1.8-1.8" />
        </svg>
      ) : (
        // Moon — offering the dark theme.
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
          <path d="M20 14.4A8.2 8.2 0 1 1 9.6 4a6.6 6.6 0 0 0 10.4 10.4z" />
        </svg>
      )}
    </button>
  );
}
