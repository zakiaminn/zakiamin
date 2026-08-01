import React from 'react';

const ITEMS = [
  'Built a real-time trading engine with row-locked transactions',
  'Migrated production infra to $0/month after a host died mid-launch',
  'Patched 27 flagged vulnerabilities across 3 ecosystems to zero',
  'Live now at therepo.exchange',
  'Data Analytics @ Sheridan College',
];

export default function Ticker() {
  const track = [...ITEMS, ...ITEMS];

  return (
    <div className="marquee w-full border-b rule bg-paperDim overflow-hidden">
      <div className="marquee-track py-2.5">
        {track.map((item, idx) => (
          <span key={idx} className="flex items-center whitespace-nowrap">
            <span className="font-mono text-[11px] tracking-[0.08em] uppercase text-inkSoft px-6">
              {item}
            </span>
            <span className="text-flame text-xs">&#9670;</span>
          </span>
        ))}
      </div>
    </div>
  );
}
