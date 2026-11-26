import React, { useLayoutEffect, useRef, useState } from 'react';
import { formatCount, formatDay, formatDayLong } from './format';

// Visitors per day as columns in the accent, pageviews as a 2px line in ink-2,
// on one count axis (pageviews are never below visitors, so the line rides
// over the columns). Square marks, hairline grid, no shadows: the brand kit's
// rules win over rounded chart defaults.
const PLOT_HEIGHT = 220;
const TOP = 14;
const AXIS_BAND = 30;
const LEFT = 44;
const MAX_COLUMN = 24;
const GAP = 2;
const TIP_WIDTH = 168;

// Clean steps (1, 2 or 5 times a power of ten) for about four gridlines.
function niceScale(max) {
  if (max <= 0) return { top: 4, ticks: [0, 1, 2, 3, 4] };
  const raw = max / 4;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const step = Math.max(1, [1, 2, 5, 10].find((m) => m * magnitude >= raw) * magnitude);
  const top = Math.ceil(max / step) * step;
  const ticks = [];
  for (let v = 0; v <= top + step / 2; v += step) ticks.push(v);
  return { top, ticks };
}

export function ChartLegend() {
  return (
    <ul className="flex items-center gap-5 text-sm text-ink-2" aria-label="Legend">
      <li className="flex items-center gap-2">
        <span aria-hidden="true" className="inline-block h-3 w-2.5 bg-brand-ink" />
        Visitors
      </li>
      <li className="flex items-center gap-2">
        <span aria-hidden="true" className="inline-block h-0.5 w-4 bg-ink-2" />
        Pageviews
      </li>
    </ul>
  );
}

export default function DailyChart({ rows, label }) {
  const wrapRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [active, setActive] = useState(null);
  const [fromKeyboard, setFromKeyboard] = useState(false);

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const count = rows.length;
  const plotWidth = Math.max(0, width - LEFT);
  const band = count ? plotWidth / count : 0;
  const column = Math.max(1, Math.min(MAX_COLUMN, band - GAP));
  const { top, ticks } = niceScale(Math.max(0, ...rows.map((r) => r.pageviews)));
  const y = (v) => TOP + PLOT_HEIGHT - (v / top) * PLOT_HEIGHT;
  const center = (i) => LEFT + i * band + band / 2;
  const base = TOP + PLOT_HEIGHT;

  // Date labels at least 64px apart, counted back from today so today is labelled.
  const stride = Math.max(1, Math.ceil(64 / Math.max(band, 1)));
  const labelled = new Set();
  for (let i = count - 1; i >= 0; i -= stride) labelled.add(i);

  const line = rows.map((r, i) => `${i ? 'L' : 'M'}${center(i).toFixed(1)} ${y(r.pageviews).toFixed(1)}`).join('');
  const last = count - 1;
  const focus = active ?? null;
  const tip = focus === null ? null : rows[focus];
  const tipLeft = focus === null ? 0 : Math.min(Math.max(center(focus) - TIP_WIDTH / 2, 0), Math.max(0, width - TIP_WIDTH));

  function onKeyDown(event) {
    const moves = { ArrowLeft: -1, ArrowRight: 1 };
    let next = null;
    if (event.key in moves) next = Math.min(last, Math.max(0, (active ?? last) + moves[event.key]));
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = last;
    if (next === null) return;
    event.preventDefault();
    setFromKeyboard(true);
    setActive(next);
  }

  return (
    <div className="relative">
      <div
        ref={wrapRef}
        role="group"
        tabIndex={0}
        aria-label={`${label}. Use the left and right arrow keys to read each day.`}
        onKeyDown={onKeyDown}
        onFocus={(event) => {
          // A click focuses the chart too; only a keyboard focus picks a day.
          if (!event.currentTarget.matches(':focus-visible')) return;
          setFromKeyboard(true);
          setActive((a) => a ?? last);
        }}
        onBlur={() => { setFromKeyboard(false); setActive(null); }}
        className="relative focus-visible:outline-offset-4"
        style={{ height: TOP + PLOT_HEIGHT + AXIS_BAND }}
      >
        {width > 0 && count > 0 && (
          <svg
            width={width}
            height={TOP + PLOT_HEIGHT + AXIS_BAND}
            aria-hidden="true"
            className="block select-none"
            onPointerLeave={() => { if (!fromKeyboard) setActive(null); }}
          >
            {ticks.map((t) => (
              <g key={t}>
                <line
                  x1={LEFT}
                  x2={width}
                  y1={Math.round(y(t)) + 0.5}
                  y2={Math.round(y(t)) + 0.5}
                  stroke={t === 0 ? 'var(--rule-2)' : 'var(--rule)'}
                />
                <text
                  x={LEFT - 10}
                  y={y(t)}
                  dy="0.32em"
                  textAnchor="end"
                  className="num fill-ink-3 text-[11px]"
                >
                  {formatCount(t)}
                </text>
              </g>
            ))}

            {rows.map((r, i) => {
              if (!r.visitors) return null;
              const h = Math.max(1, base - y(r.visitors));
              return (
                <rect
                  key={r.day}
                  x={LEFT + i * band + (band - column) / 2}
                  y={base - h}
                  width={column}
                  height={h}
                  className="fill-brand-ink transition-opacity duration-150"
                  opacity={focus === null || focus === i ? 1 : 0.35}
                />
              );
            })}

            {focus !== null && (
              <line
                x1={Math.round(center(focus)) + 0.5}
                x2={Math.round(center(focus)) + 0.5}
                y1={TOP}
                y2={base}
                stroke="var(--ink-3)"
              />
            )}

            <path d={line} fill="none" stroke="var(--ink-2)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
            {[focus ?? last].map((i) => (
              <circle key={i} cx={center(i)} cy={y(rows[i].pageviews)} r="4" fill="var(--ink-2)" stroke="var(--bg)" strokeWidth="2" />
            ))}

            {rows.map((r, i) => labelled.has(i) && (
              <text
                key={r.day}
                x={center(i)}
                y={base + 20}
                textAnchor={center(i) - 26 < LEFT ? 'start' : center(i) + 26 > width ? 'end' : 'middle'}
                className="num fill-ink-3 text-[11px]"
              >
                {formatDay(r.day)}
              </text>
            ))}

            {/* Hit areas: the whole day's band, top to bottom, not just the painted column. */}
            {rows.map((r, i) => (
              <rect
                key={r.day}
                x={LEFT + i * band}
                y={TOP}
                width={band}
                height={PLOT_HEIGHT}
                fill="transparent"
                onPointerEnter={() => { setFromKeyboard(false); setActive(i); }}
                onPointerDown={() => { setFromKeyboard(false); setActive(i); }}
              />
            ))}
          </svg>
        )}

        {tip && (
          <div
            className="pointer-events-none absolute top-0 border border-rule bg-bg px-3 py-2.5"
            style={{ left: tipLeft, width: TIP_WIDTH }}
          >
            <p className="text-xs text-ink-3">{formatDayLong(tip.day)}</p>
            <p className="mt-1.5 flex items-center gap-2 text-sm">
              <span aria-hidden="true" className="inline-block h-0.5 w-3 bg-brand-ink" />
              <span className="num font-medium text-ink">{formatCount(tip.visitors)}</span>
              <span className="text-ink-2">{tip.visitors === 1 ? 'visitor' : 'visitors'}</span>
            </p>
            <p className="mt-1 flex items-center gap-2 text-sm">
              <span aria-hidden="true" className="inline-block h-0.5 w-3 bg-ink-2" />
              <span className="num font-medium text-ink">{formatCount(tip.pageviews)}</span>
              <span className="text-ink-2">{tip.pageviews === 1 ? 'pageview' : 'pageviews'}</span>
            </p>
          </div>
        )}
      </div>

      <p className="sr-only" aria-live="polite">
        {fromKeyboard && tip
          ? `${formatDayLong(tip.day)}: ${tip.visitors} visitors, ${tip.pageviews} pageviews.`
          : ''}
      </p>
    </div>
  );
}
