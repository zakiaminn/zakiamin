import React, { useState } from 'react';

const ITEMS = [
  'Built a real-time trading engine with row-locked transactions',
  'Migrated production infra to $0/month after a host died mid-launch',
  'Patched 27 flagged vulnerabilities across 3 ecosystems to zero',
  'Live now at therepo.exchange',
  'Data Analytics @ Sheridan College',
];

function Run({ hidden }) {
  return (
    <>
      {ITEMS.map((item, idx) => (
        <span key={idx} className="flex items-center whitespace-nowrap" aria-hidden={hidden || undefined}>
          <span className="font-mono text-[11px] tracking-[0.08em] uppercase text-inkSoft px-6">
            {item}
          </span>
          <span className="text-flame text-xs">&#9670;</span>
        </span>
      ))}
    </>
  );
}

export default function Ticker() {
  const [paused, setPaused] = useState(false);

  return (
    <div className="relative w-full border-b rule bg-paperDim">
      {/*
        The track holds two identical runs so the -50% translate loops
        seamlessly. Only the first run is exposed to assistive tech —
        the second is a visual duplicate and would otherwise be read twice.
      */}
      <div className="marquee overflow-hidden" data-paused={paused}>
        <div className="marquee-track py-2.5">
          <Run />
          <Run hidden />
        </div>
      </div>

      {/*
        WCAG 2.2.2: motion that starts automatically and runs more than
        five seconds needs a mechanism to stop it. Hover-pause alone
        doesn't reach keyboard or touch users.
      */}
      <button
        type="button"
        onClick={() => setPaused((v) => !v)}
        aria-pressed={paused}
        className="absolute right-0 top-0 h-full min-w-[44px] px-3 flex items-center justify-center
                   bg-paperDim border-l rule text-inkFaint hover:text-ink transition-colors"
      >
        <span className="sr-only">{paused ? 'Resume the ticker' : 'Pause the ticker'}</span>
        <svg viewBox="0 0 12 12" className="w-2.5 h-2.5" fill="currentColor" aria-hidden="true">
          {paused ? (
            <path d="M2.5 1.5v9l7.5-4.5z" />
          ) : (
            <>
              <rect x="2.5" y="1.5" width="2.6" height="9" rx="0.4" />
              <rect x="7" y="1.5" width="2.6" height="9" rx="0.4" />
            </>
          )}
        </svg>
      </button>
    </div>
  );
}
