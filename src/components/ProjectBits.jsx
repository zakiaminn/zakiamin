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

export function Highlights({ items, compact = false, columns = 3, className = '' }) {
  if (compact) {
    return (
      <ul className={`border-t border-rule ${className}`}>
        {items.map((h) => (
          <li
            key={h.title}
            className="grid sm:grid-cols-[208px_1fr] gap-x-6 gap-y-0.5 py-2.5 border-b border-rule"
          >
            <span className="label sm:pt-[3px]">{h.skill}</span>
            <span className="text-[15px] font-medium text-ink leading-snug">{h.title}</span>
          </li>
        ))}
      </ul>
    );
  }

  const grid = columns === 3 ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2';
  return (
    <ul className={`grid ${grid} gap-x-10 ${className}`}>
      {items.map((h) => (
        <li key={h.title} className="border-t border-rule pt-5 pb-8">
          <p className="label">{h.skill}</p>
          <p className="mt-2.5 text-lg font-semibold leading-snug tracking-[-0.01em] text-ink balance">
            {h.title}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink-2 pretty">{h.proof}</p>
        </li>
      ))}
    </ul>
  );
}

/** The stack as one quiet line, not a wall of chips. */
// The arrow on external links. U+FE0E asks for the text glyph; without it,
// iOS swaps in the emoji arrow. Hidden from screen readers, which already hear
// "opens in a new tab".
export function ExternalArrow() {
  return <span aria-hidden="true" className="ext-arrow">{'\u2197\uFE0E'}</span>;
}

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
