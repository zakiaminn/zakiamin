import { isOptedOut } from './analyticsOptOut.js';

const host = import.meta.env.VITE_POSTHOG_HOST;
// A browser switched off on the admin page sends nothing and never loads PostHog.
const optedOut = typeof window !== 'undefined' && isOptedOut();
const key = optedOut ? '' : import.meta.env.VITE_POSTHOG_KEY;

let client = null;
const queue = [];

function load() {
  import('posthog-js').then(({ default: posthog }) => {
    posthog.init(key, {
      api_host: host || 'https://us.i.posthog.com',
      defaults: '2026-05-30',
    });
    client = posthog;
    for (const args of queue.splice(0)) client.capture(...args);
  });
}

if (typeof window !== 'undefined') {
  if (!key) {
    if (import.meta.env.DEV && !optedOut) {
      console.warn('VITE_POSTHOG_KEY is not set, so analytics events are dropped.');
    }
  } else if ('requestIdleCallback' in window) {
    window.requestIdleCallback(load, { timeout: 4000 });
  } else {
    window.setTimeout(load, 1500);
  }
}

const posthog = {
  capture(...args) {
    if (!key || typeof window === 'undefined') return;
    if (client) client.capture(...args);
    else queue.push(args);
  },
};

export default posthog;
