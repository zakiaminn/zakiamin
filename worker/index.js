// Serves the demo videos with byte-range support, and the data API behind the
// private analytics page at /admin/.
// Cloudflare's static asset server ignores Range headers and always answers
// 200 with the whole file, but Safari won't play a <video> unless the server
// answers its Range probe with 206 Partial Content.
// wrangler.jsonc runs this Worker only for .mp4 files and /admin/api/*;
// everything else, including the 404 page for paths that match no file, is
// served straight from dist/. A missing .mp4 gets that 404 page through
// env.ASSETS and is passed on unchanged.

import { verifyAccess } from './access.js';
import { RANGES, getStats, missingPostHogConfig, PostHogError } from './stats.js';

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname.startsWith('/admin/api/')) return adminApi(request, env);
    return serveAsset(request, env);
  },
};

async function serveAsset(request, env) {
  const response = await env.ASSETS.fetch(request);
  if (response.status !== 200) return response;
  if (!new URL(request.url).pathname.endsWith('.mp4')) return response;

  const headers = new Headers(response.headers);
  headers.set('Accept-Ranges', 'bytes');
  if (request.method !== 'GET') {
    return new Response(response.body, { status: 200, headers });
  }

  const range = request.headers.get('Range');
  const ifRange = request.headers.get('If-Range');
  // No range asked for, or the file changed since the browser cached it:
  // send the whole file.
  if (!range || (ifRange && ifRange !== response.headers.get('ETag'))) {
    return new Response(response.body, { status: 200, headers });
  }

  // One range only. Anything else (several ranges, other units) gets the
  // whole file, which is a valid answer to any Range request.
  const match = /^bytes=(\d*)-(\d*)$/.exec(range.trim());
  if (!match || (match[1] === '' && match[2] === '')) {
    return new Response(response.body, { status: 200, headers });
  }

  const body = await response.arrayBuffer();
  const size = body.byteLength;
  let start;
  let end;
  if (match[1] === '') {
    // "bytes=-500" asks for the last 500 bytes.
    start = Math.max(0, size - Number(match[2]));
    end = size - 1;
  } else {
    start = Number(match[1]);
    end = match[2] === '' ? size - 1 : Math.min(Number(match[2]), size - 1);
  }

  if (start >= size || start > end) {
    headers.set('Content-Range', `bytes */${size}`);
    headers.delete('Content-Length');
    return new Response(null, { status: 416, headers });
  }

  headers.set('Content-Range', `bytes ${start}-${end}/${size}`);
  headers.set('Content-Length', String(end - start + 1));
  return new Response(body.slice(start, end + 1), { status: 206, headers });
}

function json(status, body, extra = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      // Private numbers: never stored by the browser or any cache on the way.
      'Cache-Control': 'private, no-store',
      'X-Robots-Tag': 'noindex, nofollow',
      'X-Content-Type-Options': 'nosniff',
      ...extra,
    },
  });
}

// `wrangler dev` has no Access in front of it. A request to localhost may skip
// the login check, but only when .dev.vars (which is never committed or
// deployed) sets ADMIN_LOCAL_DEV, and never on a real hostname.
function isLocalDev(request, env) {
  const { hostname } = new URL(request.url);
  return env.ADMIN_LOCAL_DEV === 'true' && (hostname === 'localhost' || hostname === '127.0.0.1');
}

async function adminApi(request, env) {
  // The login check comes first, so nothing below it answers a signed-out request.
  if (!isLocalDev(request, env)) {
    const access = await verifyAccess(request, env);
    if (!access.ok) return json(access.status, { error: access.error, message: access.message });
  }

  const url = new URL(request.url);
  if (url.pathname !== '/admin/api/stats') {
    return json(404, { error: 'not-found', message: 'There\'s no admin API at this path.' });
  }
  if (request.method !== 'GET') {
    return json(405, { error: 'method-not-allowed', message: 'Use GET.' }, { Allow: 'GET' });
  }

  const days = Number(url.searchParams.get('days') || 30);
  if (!RANGES.includes(days)) {
    return json(400, { error: 'bad-range', message: `days must be one of ${RANGES.join(', ')}.` });
  }

  const missing = missingPostHogConfig(env);
  if (missing.length) {
    return json(503, {
      error: 'posthog-not-configured',
      message: `PostHog isn't connected yet. Missing: ${missing.join(' and ')}.`,
    });
  }

  try {
    return json(200, await getStats(env, days));
  } catch (error) {
    if (error instanceof PostHogError) {
      return json(502, { error: 'posthog-error', message: error.message });
    }
    return json(500, { error: 'server-error', message: 'Something went wrong building the numbers.' });
  }
}
