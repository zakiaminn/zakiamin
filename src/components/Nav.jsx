import React, { useEffect, useState } from 'react';
import posthog from '@/lib/posthog';

const LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'Experience', href: '#experience' },
  { label: 'Toolkit', href: '#toolkit' },
  { label: 'Contact', href: '#contact' },
];

function Mark() {
  return (
    <svg viewBox="0 0 48 48" className="w-8 h-8" aria-hidden="true">
      <path fill="var(--brand-ink)" d="M3 3H45V6H3ZM3 42H45V45H3Z" />
      <path
        fill="currentColor"
        d="M3 9H45V13.5H3ZM3 34.5H45V39H3ZM15 12H21V13.5L9 34.5V36H3V34.5L15 13.5ZM25 36V34.5L32 13.5V12H38V13.5L45 34.5V36H40V34.5L38 28.5H32L30 34.5V36ZM35 19.5L33 25.5H37Z"
      />
    </svg>
  );
}

function useActiveSection() {
  const [active, setActive] = useState('');

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;

    const sections = LINKS
      .map((l) => document.getElementById(l.href.slice(1)))
      .filter(Boolean);
    if (!sections.length) return;

    const visible = new Map();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.intersectionRatio);
          else visible.delete(entry.target.id);
        }
        let best = '';
        let bestRatio = 0;
        for (const [id, ratio] of visible) {
          if (ratio > bestRatio) {
            best = id;
            bestRatio = ratio;
          }
        }
        setActive(best);
      },
      { rootMargin: '-72px 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return active;
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const active = useActiveSection();

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-rule bg-[color-mix(in_srgb,var(--bg)_90%,transparent)] backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5 text-ink py-2">
          <Mark />
          <span className="text-base font-semibold tracking-[-0.01em]">Zaki Amin</span>
        </a>

        <div className="flex items-center gap-5 sm:gap-7">
          <nav aria-label="Sections" className="hidden sm:flex items-center gap-7">
            {LINKS.map((link) => {
              const isActive = active === link.href.slice(1);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? 'true' : undefined}
                  onClick={() => posthog.capture('nav_link_clicked', { section: link.href.slice(1) })}
                  className={`sig text-sm font-medium py-2 transition-colors duration-200 ${
                    isActive ? 'text-ink' : 'text-ink-2'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>
          <a
            href="#resume"
            onClick={() => posthog.capture('resume_link_clicked', { source: 'nav' })}
            className="btn btn-sm"
          >
            Résumé
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="btn btn-sm sm:hidden"
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Sections"
          className="menu-in sm:hidden border-t border-rule px-6 pt-1 pb-3 flex flex-col bg-bg"
        >
          {LINKS.map((link) => {
            const isActive = active === link.href.slice(1);
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => { setOpen(false); posthog.capture('nav_link_clicked', { section: link.href.slice(1) }); }}
                aria-current={isActive ? 'true' : undefined}
                className={`sig self-start text-lg font-medium flex items-center min-h-[48px] ${
                  isActive ? 'text-ink' : 'text-ink-2'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>
      )}
    </header>
  );
}
