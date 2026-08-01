import React, { useState } from 'react';

const LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Work', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

function Mark() {
  return (
    <svg viewBox="0 0 48 48" className="w-6 h-6" aria-hidden="true">
      <g fill="currentColor">
        <circle cx="8" cy="8" r="1.6" />
        <circle cx="18" cy="8" r="2.3" />
        <circle cx="28" cy="8" r="3.1" />
        <circle cx="8" cy="18" r="2.3" />
        <circle cx="18" cy="18" r="3.1" />
        <circle cx="8" cy="28" r="3.1" />
      </g>
      <circle cx="38" cy="38" r="4.6" fill="#D8431F" />
      <circle cx="28" cy="18" r="3.8" fill="currentColor" />
      <circle cx="18" cy="28" r="3.8" fill="currentColor" />
      <circle cx="28" cy="28" r="4.4" fill="currentColor" />
    </svg>
  );
}

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b rule bg-paper/92 backdrop-blur-[2px]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5 text-ink">
          <Mark />
          <span className="font-mono text-sm tracking-[0.2em] uppercase font-bold">Zaki Amin</span>
        </a>
        <nav className="hidden sm:flex items-center gap-8">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="ink-link font-mono text-xs tracking-[0.15em] uppercase text-inkSoft hover:text-ink transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle menu"
          className="sm:hidden font-mono text-xs tracking-[0.15em] uppercase text-ink border rule px-3 py-1.5"
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>
      {open && (
        <nav className="sm:hidden border-t rule px-6 py-4 flex flex-col gap-4 bg-paper">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="font-mono text-sm tracking-[0.1em] uppercase text-inkSoft"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
