// Serves the demo videos with byte-range support.
// Cloudflare's static asset server ignores Range headers and always answers
// 200 with the whole file, but Safari won't play a <video> unless the server
// answers its Range probe with 206 Partial Content.
// wrangler.jsonc runs this Worker only for .mp4 files; everything else,
// including the 404 page for paths that match no file, is served straight
// from dist/. A missing .mp4 gets that 404 page through env.ASSETS and is
// passed on unchanged.

export default {
  async fetch(request, env) {
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
  },
};
