import React from 'react';

const GROUPS = [
  {
    label: 'Languages',
    items: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C', 'C++', 'C#'],
  },
  {
    label: 'Frameworks & Runtimes',
    items: ['React', 'Next.js', 'Node / Express', '.NET'],
  },
  {
    label: 'Data & Infrastructure',
    items: ['SQL', 'PostgreSQL', 'Supabase', 'Data Analytics'],
  },
  {
    label: 'Tools & Platforms',
    items: ['Git', 'Xcode', 'Android Studio', 'Vercel / Render'],
  },
];

export default function About() {
  return (
    <section id="about" className="w-full max-w-6xl mx-auto px-6 py-20 md:py-28 scroll-mt-24">
      <div className="flex items-baseline gap-4 mb-4">
        <span className="font-mono text-sm text-flame">&sect; 01</span>
        <h2 className="font-display text-3xl md:text-4xl text-ink">Working Materials</h2>
      </div>
      <p className="text-inkSoft max-w-xl mb-12 md:mb-16">
        The tools I actually reach for, grouped honestly — not a keyword dump for a search bot.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 border-t rule pt-10">
        {GROUPS.map((group) => (
          <div key={group.label}>
            <h3 className="font-mono text-xs tracking-[0.15em] uppercase text-inkFaint mb-4">
              {group.label}
            </h3>
            <ul className="space-y-2.5">
              {group.items.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-ink">
                  <span className="w-1.5 h-1.5 rounded-full bg-flame shrink-0" />
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
