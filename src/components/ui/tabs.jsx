import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

import { cn } from '@/lib/utils';

/**
 * Tabs as the house segmented control: a soft pill track, options as pill
 * text, and the selected state as a Sulfur pill that slides between them.
 *
 * The pill is a second copy of the row in the active colours, clipped with
 * `clip-path: inset(... round 999px)` around the chosen option. Transitioning
 * the clip moves the fill and flips the text colour in one motion, which two
 * separately-timed colour transitions can't do. Keyboard changes (Radix
 * activates on arrow keys) snap with no motion.
 */
const Tabs = TabsPrimitive.Root;

const TRACK_PAD = 3;

function SegmentedTabsList({ items, value, className, ...props }) {
  const listRef = React.useRef(null);
  const pillRef = React.useRef(null);
  const inputRef = React.useRef('pointer');
  const measuredRef = React.useRef(false);

  const place = React.useCallback((animate) => {
    const list = listRef.current;
    const pill = pillRef.current;
    if (!list || !pill) return;
    const trigger = list.querySelector(`[data-value="${CSS.escape(value)}"]`);
    if (!trigger) return;

    const left = trigger.offsetLeft;
    const right = list.clientWidth - (trigger.offsetLeft + trigger.offsetWidth);
    if (!animate) pill.setAttribute('data-instant', '');
    pill.style.clipPath = `inset(${TRACK_PAD}px ${right}px ${TRACK_PAD}px ${left}px round 999px)`;
    if (!animate) {
      // Let the snapped position commit before transitions come back.
      requestAnimationFrame(() => pill.removeAttribute('data-instant'));
    }
  }, [value]);

  // Move on value change. The first placement and keyboard changes snap.
  React.useLayoutEffect(() => {
    const animate = measuredRef.current && inputRef.current === 'pointer';
    place(animate);
    measuredRef.current = true;
  }, [place]);

  // Re-measure without motion when the row reflows (fonts landing, resize).
  // Observed once, through a ref: re-subscribing on every change would fire
  // the observer's initial callback and snap the pill mid-slide.
  const placeRef = React.useRef(place);
  React.useEffect(() => {
    placeRef.current = place;
  }, [place]);
  React.useEffect(() => {
    const list = listRef.current;
    if (!list || typeof ResizeObserver === 'undefined') return;
    let width = list.clientWidth;
    const observer = new ResizeObserver(() => {
      if (list.clientWidth === width) return;
      width = list.clientWidth;
      placeRef.current(false);
    });
    observer.observe(list);
    return () => observer.disconnect();
  }, []);

  const optionClass = 'inline-flex h-9 items-center rounded-full px-4 text-sm font-medium whitespace-nowrap';

  return (
    <TabsPrimitive.List
      ref={listRef}
      onPointerDown={() => { inputRef.current = 'pointer'; }}
      onKeyDown={() => { inputRef.current = 'keyboard'; }}
      className={cn(
        'relative inline-flex max-w-full rounded-full bg-[color-mix(in_srgb,var(--ink)_7%,transparent)]',
        className
      )}
      style={{ padding: TRACK_PAD }}
      {...props}
    >
      {items.map((item) => (
        <TabsPrimitive.Trigger
          key={item.value}
          value={item.value}
          data-value={item.value}
          className={cn(
            optionClass,
            'text-ink-2 transition-colors duration-200 hover:text-ink',
            'focus-visible:outline-offset-0'
          )}
        >
          {item.label}
        </TabsPrimitive.Trigger>
      ))}

      {/* The active copy. Purely visual; the real triggers sit underneath. */}
      <div
        ref={pillRef}
        aria-hidden="true"
        className="seg-active pointer-events-none absolute inset-0 flex rounded-full bg-brand text-brand-fg"
        style={{ padding: TRACK_PAD, clipPath: 'inset(50% 50% 50% 50% round 999px)' }}
      >
        {items.map((item) => (
          <span key={item.value} className={optionClass}>{item.label}</span>
        ))}
      </div>
    </TabsPrimitive.List>
  );
}

const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn('pt-8 focus-visible:outline-none', className)}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, SegmentedTabsList, TabsContent };
