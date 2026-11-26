// A per-browser switch that keeps Zaki's own visits out of the analytics.
// The admin page sets it; src/lib/posthog.js reads it before loading PostHog.
// It lives in its own module because importing posthog.js starts PostHog.

const KEY = 'analytics-opt-out';

export function isOptedOut() {
  try {
    return window.localStorage.getItem(KEY) === '1';
  } catch {
    // Storage can be blocked (private modes, strict settings): count the visit.
    return false;
  }
}

/** Returns whether the change stuck, since storage can be blocked. */
export function setOptedOut(optOut) {
  try {
    if (optOut) window.localStorage.setItem(KEY, '1');
    else window.localStorage.removeItem(KEY);
    return isOptedOut() === optOut;
  } catch {
    return false;
  }
}
