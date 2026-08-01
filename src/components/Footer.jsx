import React from 'react';

export default function Footer() {
  return (
    <footer id="contact" className="w-full border-t rule mt-8 scroll-mt-24">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-20 flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div>
          <span className="font-mono text-xs tracking-[0.15em] uppercase text-flame">Get in touch</span>
          <h2 className="font-display text-3xl md:text-4xl text-ink mt-3 max-w-md">
            Open to opportunities, collaborations, and arguments about database schema design.
          </h2>
        </div>

        <div className="flex flex-col gap-3 items-start md:items-end">
          <a href="mailto:zakiaminn@gmail.com" className="ink-link font-mono text-sm text-ink font-bold">
            zakiaminn@gmail.com
          </a>
          <a href="https://github.com/zakiaminn" target="_blank" rel="noreferrer" className="ink-link font-mono text-sm text-inkSoft">
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/zakiamin/" target="_blank" rel="noreferrer" className="ink-link font-mono text-sm text-inkSoft">
            LinkedIn
          </a>
        </div>
      </div>

      <div className="border-t rule">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between gap-2 font-mono text-[11px] tracking-[0.05em] uppercase text-inkFaint">
          <span>&copy; {new Date().getFullYear()} Zaki Amin</span>
          <span>Set in Fraunces, Archivo &amp; Space Mono</span>
        </div>
      </div>
    </footer>
  );
}
