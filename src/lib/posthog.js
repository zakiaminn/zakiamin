// Analytics load after the page is idle, so they never compete with the first
// paint. Components call `posthog.capture()` as usual; events fired before the
// library arrives are queued and replayed once it initialises.

const key = import.meta.env.VITE_POSTHOG_KEY;
const host = import.meta.env.VITE_POSTHOG_HOST;

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
    if (import.meta.env.DEV) {
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
