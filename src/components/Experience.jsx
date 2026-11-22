import React from 'react';
import { timeline } from '@/data/profile';
import { PAGE } from '@/components/Nav';
import { Rule } from '@/components/ui/motion';

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
    <section id="experience" aria-labelledby="experience-heading" className={`${PAGE} pt-16 md:pt-20`}>
      <div className="pb-4 border-b-2 border-ink">
        <h2 id="experience-heading" className="label text-ink">Experience and education</h2>
      </div>
      <ol className="grid md:grid-cols-2">
        {timeline.map((item, i) => (
          <li key={item.id} className={`relative py-8 ${i > 0 ? 'md:pl-8 border-t md:border-t-0 border-rule' : 'md:pr-8'}`}>
            {i > 0 && <Rule axis="y" className="hidden md:block absolute left-0 top-8 bottom-8 w-px" />}
            <p className="text-sm"><YearSpan start={item.start} end={item.end} /></p>
            <h3 className="mt-3 text-2xl md:text-[1.75rem] font-semibold tracking-[-0.02em] text-ink balance">{item.role}</h3>
            <p className="mt-3 max-w-xl leading-relaxed text-ink-2 pretty">{item.detail}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
