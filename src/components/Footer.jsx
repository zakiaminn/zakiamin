import React, { useEffect, useRef, useState } from 'react';
import { profile } from '@/data/profile';
import { ExternalArrow, SectionHead } from '@/components/ProjectBits';
import posthog from '@/lib/posthog';

function CopyEmail() {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
    } catch {
      return;
    }
    posthog.capture('contact_link_clicked', { link_type: 'copy-email' });
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1800);
  };

  const face = 'col-start-1 row-start-1 transition-[opacity,filter] duration-200 ease-[var(--ease)]';

  return (
    <button type="button" onClick={copy} className="btn btn-lg">
      <span className="grid" aria-hidden="true">
        <span
          className={`${face} inline-flex items-center gap-2`}
          style={{ opacity: copied ? 0 : 1, filter: copied ? 'blur(2px)' : 'none' }}
        >
          {profile.email}
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-ink-3" fill="none" stroke="currentColor"
               strokeWidth="1.5" strokeLinejoin="round">
            <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
            <path d="M10.5 3.5v-.5A1.5 1.5 0 0 0 9 1.5H4A1.5 1.5 0 0 0 2.5 3v5A1.5 1.5 0 0 0 4 9.5h.5" />
          </svg>
        </span>
        <span
          className={`${face} inline-flex items-center justify-center`}
          style={{ opacity: copied ? 1 : 0, filter: copied ? 'none' : 'blur(2px)' }}
        >
          Copied to clipboard
        </span>
      </span>
      <span className="sr-only">Copy the email address {profile.email}</span>
      <span className="sr-only" aria-live="polite">{copied ? 'Email address copied' : ''}</span>
    </button>
  );
}

export default function Footer() {
  const external = (type) => () => posthog.capture('contact_link_clicked', { link_type: type });

  return (
    <footer id="contact" aria-labelledby="contact-heading">
      <div className="max-w-6xl mx-auto px-6 pb-20 md:pb-28">
        <SectionHead id="contact-heading" className="mb-10 md:mb-14">Contact</SectionHead>

        <p className="text-4xl md:text-5xl font-bold leading-[1.05] tracking-[-0.035em] text-ink max-w-3xl balance">
          Looking for a {profile.seeking}, and always open to arguments about database schema design.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <a href={`mailto:${profile.email}`} onClick={external('email')} className="btn btn-primary btn-lg">
            Email me
          </a>
          <CopyEmail />
        </div>

        <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-2">
          <li>
            <a href="#resume" onClick={() => posthog.capture('resume_link_clicked', { source: 'footer' })} className="sig text-ink font-medium inline-flex items-center min-h-[44px]">
              Résumé
            </a>
          </li>
          <li>
            <a href={profile.github} target="_blank" rel="me noreferrer" onClick={external('github')} className="sig text-ink font-medium inline-flex items-center min-h-[44px]">
              GitHub <ExternalArrow /><span className="sr-only"> profile (opens in a new tab)</span>
            </a>
          </li>
          <li>
            <a href={profile.linkedin} target="_blank" rel="me noreferrer" onClick={external('linkedin')} className="sig text-ink font-medium inline-flex items-center min-h-[44px]">
              LinkedIn <ExternalArrow /><span className="sr-only"> profile (opens in a new tab)</span>
            </a>
          </li>
        </ul>
      </div>

      <div className="border-t border-rule">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between gap-2 text-sm text-ink-3">
          <span>© <span className="num" suppressHydrationWarning>{new Date().getFullYear()}</span> Zaki Amin, Toronto</span>
          <span>Set in Bricolage Grotesque and Spline Sans Mono</span>
        </div>
      </div>
    </footer>
  );
}
