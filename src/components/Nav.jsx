import React, { useEffect, useState } from 'react';
import posthog from '@/lib/posthog';

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
      {/* The accent seal: a chartreuse mark reads as a thin graphic, so it
          takes brand-ink to stay legible on the light ground. */}
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
      // Reading band: below the 64px sticky bar, above the bottom third.
      { rootMargin: '-72px 0px -55% 0px', threshold: [0.01, 0.25, 0.5, 0.75] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return active;
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const active = useActiveSection();

  return (
    <header className="sticky top-0 z-40 w-full border-b rule bg-bg/90 backdrop-blur-[2px]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5 text-ink py-2">
          <Mark />
          <span className="font-bricolage text-base tracking-[0.06em] uppercase font-bold">Zaki Amin</span>
        </a>

        <div className="flex items-center gap-6 sm:gap-8">
          <nav aria-label="Sections" className="hidden sm:flex items-center gap-8">
            {LINKS.map((link) => {
              const isActive = active === link.href.slice(1);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? 'true' : undefined}
                  className={`ink-link font-bricolage text-xs font-medium tracking-[0.1em] uppercase py-2 transition-colors ${
                    isActive ? 'text-brand-ink' : 'text-ink-2 hover:text-ink'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Not a page section, so it lives outside the section nav: a deep
              link to the resume dialog (#resume), shareable on its own. */}
          <a
            href="#resume"
            className="hidden sm:inline-flex items-center ink-link font-bricolage text-xs font-medium tracking-[0.1em] uppercase py-2 text-ink-2 hover:text-ink transition-colors"
          >
            Résumé
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="sm:hidden font-bricolage text-xs font-medium tracking-[0.1em] uppercase text-ink border rule
                       min-h-[44px] min-w-[44px] px-3.5"
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Sections" className="sm:hidden border-t rule px-6 py-2 flex flex-col bg-bg">
          {LINKS.map((link) => {
            const isActive = active === link.href.slice(1);
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => { setOpen(false); posthog.capture('nav_link_clicked', { section: link.href.slice(1) }); }}
                aria-current={isActive ? 'true' : undefined}
                className={`font-bricolage text-sm tracking-[0.1em] uppercase flex items-center min-h-[44px] ${
                  isActive ? 'text-brand-ink' : 'text-ink-2'
                }`}
              >
                {link.label}
              </a>
            );
          })}
          <a
            href="#resume"
            onClick={() => { setOpen(false); posthog.capture('resume_link_clicked', { source: 'mobile-nav' }); }}
            className="font-bricolage text-sm tracking-[0.1em] uppercase flex items-center min-h-[44px] text-ink-2"
          >
            Résumé
          </a>
        </nav>
      )}
    </header>
  );
}
