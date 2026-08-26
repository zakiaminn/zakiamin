import React from 'react';
import { skillGroups as GROUPS } from '@/data/profile';

export default function About() {
  return (
    <section id="about" className="w-full max-w-6xl mx-auto px-6 py-20 md:py-28 scroll-mt-24">
      <div className="flex items-baseline gap-4 mb-4">
        <span className="font-martian text-sm text-brand-ink">&sect; 01</span>
        <h2 className="font-bricolage font-bold text-3xl md:text-4xl tracking-[-0.02em] text-ink">Working Materials</h2>
      </div>
      <p className="text-ink-2 max-w-xl mb-12 md:mb-16">
        The tools I actually reach for, grouped honestly — not a keyword dump for a search bot.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 border-t rule pt-10">
        {GROUPS.map((group) => (
          <div key={group.label}>
            <h3 className="font-martian text-xs tracking-[0.14em] uppercase text-ink-3 mb-4">
              {group.label}
            </h3>
            <ul className="space-y-2.5">
              {group.items.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-ink">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-ink shrink-0" />
                  <span className="text-[15px]">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
