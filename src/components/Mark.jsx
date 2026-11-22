import React from 'react';

/** Masthead ZA: the initials hung between a thick-and-thin rule. */
export default function Mark() {
  return (
    <svg viewBox="0 0 48 48" className="w-8 h-8 shrink-0" aria-hidden="true">
      <path fill="var(--brand-ink)" d="M3 3H45V6H3ZM3 42H45V45H3Z" />
      <path
        fill="currentColor"
        d="M3 9H45V13.5H3ZM3 34.5H45V39H3ZM15 12H21V13.5L9 34.5V36H3V34.5L15 13.5ZM25 36V34.5L32 13.5V12H38V13.5L45 34.5V36H40V34.5L38 28.5H32L30 34.5V36ZM35 19.5L33 25.5H37Z"
      />
    </svg>
  );
}

export { Mark };
