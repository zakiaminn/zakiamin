import React from 'react';
import { skillGroups } from '@/data/profile';
import { SectionHead } from '@/components/ProjectBits';

export default function Toolkit() {
  return (
    <section id="toolkit" aria-labelledby="toolkit-heading" className="w-full max-w-6xl mx-auto px-6 pb-20 md:pb-28">
      <SectionHead id="toolkit-heading" className="mb-2">Toolkit</SectionHead>
      <dl>
        {skillGroups.map((group) => (
          <div key={group.label} className="grid md:grid-cols-[220px_1fr] gap-2 md:gap-10 py-5 md:py-6 border-b border-rule">
            <dt className="label md:pt-1.5">{group.label}</dt>
            <dd className="text-lg text-ink">
              <ul className="flex flex-wrap gap-x-2 gap-y-1">
                {group.items.map((item, i) => (
                  <li key={item} className="whitespace-nowrap">
                    {item}
                    {i < group.items.length - 1 && <span aria-hidden="true" className="ml-2 text-rule-2">/</span>}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
