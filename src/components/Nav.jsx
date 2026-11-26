import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { m as Motion } from 'framer-motion';
import { profile } from '@/data/profile';
import { facts } from '@/data/skim';
import { EASE, useFitWidth } from '@/lib/motion';
import { MastRules } from '@/components/ui/motion';
import posthog from '@/lib/posthog';
import Mark from '@/components/Mark';
import { PAGE } from '@/lib/layout';

export { Mark, PAGE };

const LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'Experience', href: '#experience' },
  { label: 'Toolkit', href: '#toolkit' },
  { label: 'Contact', href: '#contact' },
];

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

/** Today's date, set like a paper's dateline. The prerendered page carries none, so it never shows a stale day. */
const formatToday = () =>
  new Intl.DateTimeFormat('en-CA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(new Date());
const noSubscribe = () => () => {};

function Dateline() {
  const today = useSyncExternalStore(noSubscribe, formatToday, () => null);
  if (!today) return <span aria-hidden="true">&nbsp;</span>;
  // Numbers in the mono, words in Bricolage.
  return (
    <span>
      {today.split(/(\d+)/).map((part, i) =>
        /^\d+$/.test(part) ? <span key={i} className="num">{part}</span> : <span key={i}>{part}</span>
      )}
    </span>
  );
}

const track = (section) => () => posthog.capture('nav_link_clicked', { section });
const trackResume = () => posthog.capture('resume_link_clicked', { source: 'nav' });

/** The nameplate: the name runs the full width of the column, hung between the thin-gap-thick rules. */
export function Masthead({ mastRef }) {
  const nameRef = useRef(null);
  useFitWidth(nameRef);

  return (
    <header id="top" ref={mastRef} className={`${PAGE} pt-4 sm:pt-6`}>
      <div className="flex items-center justify-between gap-4 pb-3 text-[13px] sm:text-sm text-ink-3">
        <span>{facts.city}</span>
        <span className="hidden md:block"><Dateline /></span>
        <span>Open to a {profile.seeking}</span>
      </div>

      <MastRules inView={false} />

      <p data-fit-box className="py-3 sm:py-4 text-ink">
        <span className="block overflow-hidden">
          <span ref={nameRef} className="nameplate inline-block whitespace-nowrap mask-rise" style={{ animationDuration: '1000ms', animationDelay: '300ms' }}>
            Zaki Amin Ahmad
          </span>
        </span>
      </p>

      <MastRules inView={false} flip />

      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-3 text-sm">
        <span className="text-ink-2">{facts.school}</span>
        <nav aria-label="Sections" className="hidden md:flex items-center gap-7">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={track(link.href.slice(1))} className="sig font-medium text-ink-2 py-1">
              {link.label}
            </a>
          ))}
        </nav>
        <a href="#resume" onClick={trackResume} className="btn btn-sm">Résumé</a>
      </div>
    </header>
  );
}

/** Once the masthead scrolls away, a slim bar keeps the name, the sections and the résumé in reach. */
export function StickyBar({ show }) {
  const [open, setOpen] = useState(false);
  const active = useActiveSection();
  const visible = show || open;

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <Motion.div
      className="fixed inset-x-0 top-0 z-40 border-b border-rule bg-[color-mix(in_srgb,var(--bg)_92%,transparent)] backdrop-blur-md"
      initial={false}
      animate={{ y: visible ? '0%' : '-102%' }}
      transition={{ duration: visible ? 0.28 : 0.18, ease: EASE }}
      inert={!visible}
    >
      <div className={`${PAGE} h-14 flex items-center justify-between`}>
        <a href="#top" className="flex items-center gap-2.5 text-ink">
          <Mark />
          <span className="font-semibold tracking-[-0.01em] whitespace-nowrap">Zaki Amin Ahmad</span>
        </a>
        <div className="flex items-center gap-5 sm:gap-7">
          <nav aria-label="Sections" className="hidden md:flex items-center gap-7">
            {LINKS.map((link) => {
              const isActive = active === link.href.slice(1);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? 'true' : undefined}
                  onClick={track(link.href.slice(1))}
                  className={`sig text-sm font-medium py-2 transition-colors duration-200 ${isActive ? 'text-ink' : 'text-ink-2'}`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>
          <a href="#resume" onClick={trackResume} className="btn btn-sm hidden sm:inline-flex">Résumé</a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="btn btn-sm md:hidden"
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Sections" className="menu-in md:hidden border-t border-rule px-5 pt-1 pb-3 flex flex-col bg-bg">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => { setOpen(false); track(link.href.slice(1))(); }}
              aria-current={active === link.href.slice(1) ? 'true' : undefined}
              className={`sig self-start text-lg font-medium flex items-center min-h-[48px] ${
                active === link.href.slice(1) ? 'text-ink' : 'text-ink-2'
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#resume"
            onClick={() => { setOpen(false); trackResume(); }}
            className="sig self-start text-lg font-medium flex items-center min-h-[48px] text-ink-2 sm:hidden"
          >
            Résumé
          </a>
        </nav>
      )}
    </Motion.div>
  );
}
