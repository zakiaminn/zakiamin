# Zaki Amin Ahmad

My portfolio for the co-op
**Live:** [zakiamin.com](https://zakiamin.com)



## Private analytics at /admin/

`/admin/` is a dashboard of the site's PostHog numbers. It isn't linked from the site, isn't in the sitemap and is marked `noindex`. Cloudflare Access (Zero Trust) guards `www.zakiamin.com/admin`, so only the allowed email can sign in. The page itself holds no data: it asks the Worker for `/admin/api/stats`, and the Worker checks the Access login token before it queries PostHog (`worker/access.js`, `worker/stats.js`).

- Settings that aren't secret live in `vars` in `wrangler.jsonc`: `POSTHOG_API_HOST`, `POSTHOG_PROJECT_ID`, `ACCESS_TEAM_DOMAIN`, `ACCESS_AUD`.
- The PostHog personal API key (read-only `query:read` scope) is the `POSTHOG_PERSONAL_API_KEY` secret. Set it in the Cloudflare dashboard under Workers, zakiamin, Settings, Variables and Secrets, or with `npx wrangler secret put POSTHOG_PERSONAL_API_KEY`.
- Locally, `npm run dev` and `/admin/?sample` show made-up numbers. To call the real API under `npx wrangler dev`, put `ADMIN_LOCAL_DEV=true` (which skips the login check on localhost only) and the key in a gitignored `.dev.vars`.
- The "Stop counting this browser" switch on the page keeps your own visits out of the numbers in that browser.
