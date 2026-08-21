import React, { useEffect, useRef } from 'react';

/**
 * A hairline of flame across the very top, tracking read position — the
 * page is long, and a reader deep in a case study should be able to see
 * how much is left.
 *
 * Deliberately hand-rolled rather than pulled from an animation library:
 * it's a single transform driven by scroll, and the nearest library
 * equivalent costs ~100kB gzipped for exactly this one line.
 */
export default function ScrollProgress() {
  const ref = useRef(null);

  useEffect(() => {
    let frame = null;

    const update = () => {
      frame = null;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      const progress = scrollable > 0 ? doc.scrollTop / scrollable : 0;
      if (ref.current) ref.current.style.transform = `scaleX(${progress})`;
    };

    // Coalesce scroll events into at most one write per frame.
    const schedule = () => {
      if (frame == null) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      if (frame != null) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{ transform: 'scaleX(0)' }}
      className="fixed top-0 left-0 right-0 z-50 h-[2px] origin-left bg-flame will-change-transform"
    />
  );
}
