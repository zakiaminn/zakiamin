import React from 'react';
import { skillGroups } from '@/data/profile';
import { PAGE } from '@/components/Nav';

/** The toolkit as a listings page: dense, columned and ruled, built to be scanned. */
export default function Toolkit() {
  return (
    <section id="toolkit" aria-labelledby="toolkit-heading" className={`${PAGE} pt-16 md:pt-20 pb-20 md:pb-28`}>
      <div className="pb-4 border-b-2 border-ink">
        <h2 id="toolkit-heading" className="label text-ink">Toolkit</h2>
      </div>
      <div className="pt-6 columns-2 md:columns-3 lg:columns-4 gap-8 [column-rule:1px_solid_var(--rule)]">
        {skillGroups.map((g) => (
          <div key={g.label} className="break-inside-avoid pb-7">
            <h3 className="label text-ink pb-1.5 mb-2 border-b border-rule">{g.label}</h3>
            <ul className="text-[15px] leading-[1.75] text-ink">
              {g.items.map((it) => <li key={it}>{it}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
