import React from 'react';
import { timeline } from '@/data/profile';
import { SectionHead } from '@/components/ProjectBits';

export function YearSpan({ start, end }) {
  return (
    <span className="text-ink-3">
      <span className="num text-ink">{start}</span>
      {' to '}
      {end ? <span className="num text-ink">{end}</span> : 'present'}
    </span>
  );
}

export default function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-heading" className="w-full max-w-6xl mx-auto px-6 py-20 md:py-28">
      <SectionHead id="experience-heading" className="mb-2">Experience and education</SectionHead>
      <ol>
        {timeline.map((item) => (
          <li key={item.id} className="grid md:grid-cols-[220px_1fr] gap-2 md:gap-10 py-8 md:py-10 border-b border-rule">
            <div className="text-sm md:pt-2">
              <YearSpan start={item.start} end={item.end} />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-semibold tracking-[-0.02em] text-ink balance">{item.role}</h3>
              <p className="mt-3 text-ink-2 leading-relaxed max-w-2xl pretty">{item.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
