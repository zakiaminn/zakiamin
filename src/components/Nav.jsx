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
    <svg viewBox="0 0 48 48" className="w-6 h-6" aria-hidden="true">
      <g fill="currentColor">
        <circle cx="8" cy="8" r="1.6" />
        <circle cx="18" cy="8" r="2.3" />
        <circle cx="28" cy="8" r="3.1" />
        <circle cx="8" cy="18" r="2.3" />
        <circle cx="18" cy="18" r="3.1" />
        <circle cx="8" cy="28" r="3.1" />
      </g>
      {/* The accent seal: a thin graphic, so it takes brand-ink to stay
          legible on the light ground. */}
      <circle cx="38" cy="38" r="4.6" fill="var(--brand-ink)" />
      <circle cx="28" cy="18" r="3.8" fill="currentColor" />
      <circle cx="18" cy="28" r="3.8" fill="currentColor" />
      <circle cx="28" cy="28" r="4.4" fill="currentColor" />
    </svg>
  );
}

/**
 * Tracks which section is currently in the reading position (just under
 * the sticky bar) so the nav can mark it. Falls back silently to no
 * active section if IntersectionObserver isn't available.
 */
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
        // The section occupying the most of the reading band wins.
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
      // Reading band: below the 64px sticky bar, above the bottom half.
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

  // Escape closes the phone menu, like every other popover.
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

          {/* Not a page section, so it sits apart from the section links: a
              deep link to the résumé dialog (#resume), shareable on its own. */}
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
