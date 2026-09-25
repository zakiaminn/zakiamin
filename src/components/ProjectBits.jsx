import React from 'react';

/**
 * Section head: a label followed by a hairline that runs to the edge of the
 * column. Sections are never numbered.
 */
export function SectionHead({ as = 'h2', id, children, className = '' }) {
  const Tag = as;
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <Tag id={id} className="label shrink-0">{children}</Tag>
      <span className="h-px flex-1 bg-rule" aria-hidden="true" />
    </div>
  );
}

/** Figures in the mono, captions as labels, columns on hairlines. */
export function StatRow({ stats, className = '' }) {
  return (
    <dl className={`grid grid-cols-2 md:grid-cols-4 border-t border-rule ${className}`}>
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className={`flex flex-col-reverse gap-2 py-6 pr-4 ${
            i % 2 === 1 ? 'pl-4 md:pl-6 border-l border-rule' : ''
          } ${i === 2 ? 'md:pl-6 md:border-l md:border-rule' : ''} ${
            i >= 2 ? 'border-t border-rule md:border-t-0' : ''
          }`}
        >
          <dt className="label balance">{stat.label}</dt>
          <dd className="num text-[1.75rem] leading-none text-ink">{stat.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** The stack as one quiet line, not a wall of chips. */
export function TechLine({ tech, title, className = '' }) {
  return (
    <ul
      className={`flex flex-wrap gap-x-2 gap-y-1 text-sm text-ink-3 ${className}`}
      aria-label={`${title} tech stack`}
    >
      {tech.map((t, i) => (
        <li key={t} className="whitespace-nowrap">
          {t}
          {i < tech.length - 1 && <span aria-hidden="true" className="ml-2 text-rule-2">/</span>}
        </li>
      ))}
    </ul>
  );
}
