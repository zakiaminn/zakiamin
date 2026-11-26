// Checks the Cloudflare Access login on a request to /admin/api/*.
// Access sits in front of www.zakiamin.com/admin* and adds a signed token to
// every request it lets through, in the Cf-Access-Jwt-Assertion header. The
// Worker checks that token itself, for two reasons: the router in front of a
// Worker with static assets doesn't pass ctx.access on, and the workers.dev and
// branch preview URLs aren't behind Access, so a request there has no token.
// Without a valid token for this Access application, the API answers nothing.

// Access signs with RS256 and rotates its key every six weeks, keeping the old
// one valid for a week, so the keys are cached and refetched on an unknown kid.
const CERTS_MAX_AGE = 60 * 60 * 1000;
const REFETCH_FLOOR = 60 * 1000;
let certs = { url: '', fetchedAt: 0, keys: new Map() };

// Allow a little clock skew between Cloudflare's edge and the Access issuer.
const LEEWAY_SECONDS = 60;

function base64UrlBytes(text) {
  const base64 = text.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '='));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function base64UrlJson(text) {
  return JSON.parse(new TextDecoder().decode(base64UrlBytes(text)));
}

async function loadCerts(url) {
  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`Access certs answered ${response.status}`);
  const { keys = [] } = await response.json();
  const imported = new Map();
  for (const jwk of keys) {
    if (jwk.kty !== 'RSA' || typeof jwk.kid !== 'string') continue;
    const key = await crypto.subtle.importKey(
      'jwk',
      { kty: 'RSA', n: jwk.n, e: jwk.e, alg: 'RS256', ext: true },
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['verify'],
    );
    imported.set(jwk.kid, key);
  }
  certs = { url, fetchedAt: Date.now(), keys: imported };
}

async function signingKey(teamDomain, kid) {
  const url = `${teamDomain}/cdn-cgi/access/certs`;
  const age = Date.now() - certs.fetchedAt;
  const stale = certs.url !== url || age > CERTS_MAX_AGE;
  // An unknown kid may mean the key just rotated, but don't let a stream of
  // made-up kids turn into a stream of fetches.
  const unknown = !certs.keys.has(kid) && age > REFETCH_FLOOR;
  if (stale || unknown) await loadCerts(url);
  return certs.keys.get(kid);
}

function denied(status, error, message) {
  return { ok: false, status, error, message };
}

/**
 * Verifies the Access token on the request.
 * Resolves to { ok: true, email } or { ok: false, status, error, message }.
 */
export async function verifyAccess(request, env) {
  const teamDomain = (env.ACCESS_TEAM_DOMAIN || '').trim().replace(/\/+$/, '');
  const audience = (env.ACCESS_AUD || '').trim();
  if (!teamDomain.startsWith('https://') || !audience) {
    // Branch previews land here too: they don't inherit `vars` from
    // wrangler.jsonc, so the admin data only ever loads in production.
    return denied(503, 'access-not-configured',
      'Cloudflare Access isn\'t configured for this deployment (ACCESS_TEAM_DOMAIN and ACCESS_AUD aren\'t set). Branch previews never have them, so the numbers only load at www.zakiamin.com/admin/.');
  }

  const token = request.headers.get('Cf-Access-Jwt-Assertion');
  if (!token) {
    return denied(401, 'not-signed-in',
      'This request didn\'t come through Cloudflare Access. Open www.zakiamin.com/admin/ and sign in.');
  }

  const invalid = denied(403, 'invalid-token', 'The Cloudflare Access login on this request isn\'t valid. Sign in again.');
  const parts = token.split('.');
  if (parts.length !== 3) return invalid;

  let header;
  let claims;
  try {
    header = base64UrlJson(parts[0]);
    claims = base64UrlJson(parts[1]);
  } catch {
    return invalid;
  }
  if (header.alg !== 'RS256' || typeof header.kid !== 'string') return invalid;

  let key;
  try {
    key = await signingKey(teamDomain, header.kid);
  } catch {
    return denied(503, 'access-certs-unavailable', 'Couldn\'t load the Cloudflare Access signing keys. Try again in a minute.');
  }
  if (!key) return invalid;

  let signed = false;
  try {
    signed = await crypto.subtle.verify(
      'RSASSA-PKCS1-v1_5',
      key,
      base64UrlBytes(parts[2]),
      new TextEncoder().encode(`${parts[0]}.${parts[1]}`),
    );
  } catch {
    return invalid;
  }
  if (!signed) return invalid;

  // A valid signature only proves Access issued the token. It also has to be
  // from this team, for this application, and current.
  const now = Math.floor(Date.now() / 1000);
  const audiences = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
  if (claims.iss !== teamDomain) return invalid;
  if (!audiences.includes(audience)) return invalid;
  if (typeof claims.exp !== 'number' || claims.exp + LEEWAY_SECONDS < now) return invalid;
  if (typeof claims.nbf === 'number' && claims.nbf - LEEWAY_SECONDS > now) return invalid;

  return { ok: true, email: typeof claims.email === 'string' ? claims.email : '' };
}
