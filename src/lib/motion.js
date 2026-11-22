import { useEffect, useLayoutEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

// --ease from index.css, and an expo-out for the few authored entrances.
export const EASE = [0.22, 1, 0.36, 1];
export const EASE_EXPO = [0.19, 1, 0.22, 1];

// The page is prerendered, so layout effects only run in the browser.
export const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(QUERY).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

export function useMedia(query, fallback = false) {
  const [match, setMatch] = useState(fallback);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const sync = () => setMatch(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, [query]);
  return match;
}

export const useFinePointer = () => useMedia('(hover: hover) and (pointer: fine)');

/** Sizes an inline element so it runs the full width of its `[data-fit-box]` ancestor, like a printed nameplate. */
export function useFitWidth(ref, max = 240) {
  useIsoLayoutEffect(() => {
    const el = ref.current;
    const box = el?.closest('[data-fit-box]');
    if (!el || !box) return;
    const fit = () => {
      el.style.fontSize = '100px';
      el.style.fontSize = `${Math.min(max, (100 * box.clientWidth) / el.offsetWidth)}px`;
    };
    fit();
    document.fonts?.ready.then(fit);
    const ro = new ResizeObserver(fit);
    ro.observe(box);
    return () => ro.disconnect();
  }, [ref, max]);
}
