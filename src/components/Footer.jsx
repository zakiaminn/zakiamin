import React from 'react';
import Resume from './Resume';
import { profile } from '@/data/profile';

export default function Footer() {
  return (
    <footer id="contact" className="w-full border-t rule mt-8 scroll-mt-24">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-20 flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div>
          <span className="font-martian text-xs tracking-[0.14em] uppercase text-brand-ink">Get in touch</span>
          <h2 className="font-bricolage font-bold text-3xl md:text-4xl tracking-[-0.02em] text-ink mt-3 max-w-md balance">
            Looking for a {profile.seeking} — and always open to collaborations and arguments about database schema design.
          </h2>
        </div>

        <div className="flex flex-col gap-3 items-start md:items-end">
          <a href={`mailto:${profile.email}`} className="ink-link font-martian text-sm text-ink font-semibold inline-flex items-center min-h-[44px]">
            {profile.email}
          </a>
          <Resume
            trigger={
              <button
                type="button"
                className="ink-link font-martian text-sm text-ink-2 hover:text-ink inline-flex items-center min-h-[44px]"
              >
                Résumé
              </button>
            }
          />
          <a href={profile.github} target="_blank" rel="noreferrer" className="ink-link font-martian text-sm text-ink-2 hover:text-ink inline-flex items-center min-h-[44px]">
            GitHub<span className="sr-only"> profile (opens in a new tab)</span>
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer" className="ink-link font-martian text-sm text-ink-2 hover:text-ink inline-flex items-center min-h-[44px]">
            LinkedIn<span className="sr-only"> profile (opens in a new tab)</span>
          </a>
        </div>
      </div>

      <div className="border-t rule">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between gap-2 font-martian text-[11px] tracking-[0.05em] uppercase text-ink-3">
          <span>&copy; {new Date().getFullYear()} Zaki Amin</span>
          <span>Set in Bricolage Grotesque &amp; Martian Mono</span>
        </div>
      </div>
    </footer>
  );
}
