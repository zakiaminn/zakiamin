// The numbers behind the private analytics page at /admin/.
// The Worker asks PostHog's query API with a personal API key that only it
// holds (the POSTHOG_PERSONAL_API_KEY secret), so the key never reaches the
// browser. Only the range comes from the request, and it's one of three
// fixed values, so nothing a visitor sends ends up in a query.

export const RANGES = [7, 30, 90];

// Only visits to the live site count: not localhost, not branch previews.
const SITE_HOSTS = ['www.zakiamin.com', 'zakiamin.com'];

// The custom events the site sends (see the posthog.capture calls in src/).
const SITE_EVENTS = [
  'project_teaser_clicked',
  'case_study_opened',
  'case_study_tab_changed',
  'case_study_link_clicked',
  'project_link_clicked',
  'demo_video_played',
  'resume_viewed',
  'resume_link_clicked',
  'contact_link_clicked',
  'nav_link_clicked',
  'hero_cta_clicked',
  'domolition_triggered',
];

// PostHog allows three queries at once per project; more just queue.
const CONCURRENCY = 3;

const quote = (value) => `'${value}'`;
const HOSTS = `properties.$host IN (${SITE_HOSTS.map(quote).join(', ')})`;

class PostHogError extends Error {
  constructor(status, detail) {
    super(`PostHog answered ${status}${detail ? `: ${detail}` : ''}`);
    this.status = status;
  }
}

async function hogql(env, name, query) {
  const host = (env.POSTHOG_API_HOST || 'https://us.posthog.com').replace(/\/+$/, '');
  const url = `${host}/api/projects/${encodeURIComponent(env.POSTHOG_PROJECT_ID)}/query/`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.POSTHOG_PERSONAL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: `admin-${name}`, query: { kind: 'HogQLQuery', query } }),
  });
  if (!response.ok) {
    let detail = '';
    try {
      const body = await response.json();
      detail = String(body.detail || body.error || '').slice(0, 240);
    } catch {
      // A non-JSON error body says nothing useful.
    }
    throw new PostHogError(response.status, detail);
  }
  const body = await response.json();
  return Array.isArray(body.results) ? body.results : [];
}

async function inBatches(tasks, limit) {
  const results = new Array(tasks.length);
  let next = 0;
  async function run() {
    while (next < tasks.length) {
      const i = next++;
      results[i] = await tasks[i]();
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, tasks.length) }, run));
  return results;
}

const n = (value) => Number(value) || 0;

// Every day in the range, oldest first, with the days nobody came filled in.
function fillDays(rows, today, days) {
  const byDay = new Map(rows.map(([day, visitors, pageviews]) => [day, { visitors: n(visitors), pageviews: n(pageviews) }]));
  const end = Date.parse(`${today}T00:00:00Z`);
  const out = [];
  for (let i = days - 1; i >= 0; i--) {
    const day = new Date(end - i * 86400000).toISOString().slice(0, 10);
    out.push({ day, ...(byDay.get(day) || { visitors: 0, pageviews: 0 }) });
  }
  return out;
}

export function missingPostHogConfig(env) {
  return ['POSTHOG_PERSONAL_API_KEY', 'POSTHOG_PROJECT_ID'].filter((name) => !String(env[name] || '').trim());
}

/** Runs the dashboard's queries for the last `days` days, today included. */
export async function getStats(env, days) {
  // Days are counted in the PostHog project's timezone. The previous period is
  // the same stretch one range earlier, cut at the same time of day, so a
  // half-finished today is compared with a half-finished day.
  const start = `toStartOfDay(now()) - INTERVAL ${days - 1} DAY`;
  const previousStart = `toStartOfDay(now()) - INTERVAL ${2 * days - 1} DAY`;
  const previousEnd = `now() - INTERVAL ${days} DAY`;
  const current = `timestamp >= ${start}`;
  const previous = `timestamp >= ${previousStart} AND timestamp < ${previousEnd}`;
  const pageviews = `event = '$pageview' AND ${HOSTS}`;

  const queries = {
    totals: `
      SELECT
        uniqIf(person_id, ${current}),
        countIf(${current}),
        uniqIf(properties.$session_id, ${current}),
        uniqIf(person_id, ${previous}),
        countIf(${previous}),
        uniqIf(properties.$session_id, ${previous}),
        toString(toDate(now()))
      FROM events
      WHERE ${pageviews} AND timestamp >= ${previousStart}`,
    daily: `
      SELECT toString(toDate(timestamp)) AS day, uniq(person_id), count()
      FROM events
      WHERE ${pageviews} AND ${current}
      GROUP BY day
      ORDER BY day
      LIMIT 200`,
    pages: `
      SELECT coalesce(properties.$pathname, '/') AS path, count() AS views, uniq(person_id)
      FROM events
      WHERE ${pageviews} AND ${current}
      GROUP BY path
      ORDER BY views DESC
      LIMIT 10`,
    referrers: `
      SELECT coalesce(properties.$referring_domain, '$direct') AS domain, uniq(person_id) AS visitors
      FROM events
      WHERE ${pageviews} AND ${current}
      GROUP BY domain
      ORDER BY visitors DESC
      LIMIT ${10 + SITE_HOSTS.length}`,
    countries: `
      SELECT coalesce(properties.$geoip_country_name, 'Unknown') AS country, uniq(person_id) AS visitors
      FROM events
      WHERE ${pageviews} AND ${current}
      GROUP BY country
      ORDER BY visitors DESC
      LIMIT 10`,
    devices: `
      SELECT coalesce(properties.$device_type, 'Unknown') AS device, uniq(person_id) AS visitors
      FROM events
      WHERE ${pageviews} AND ${current}
      GROUP BY device
      ORDER BY visitors DESC
      LIMIT 10`,
    events: `
      SELECT
        event,
        coalesce(properties.project_title, '') AS project,
        coalesce(properties.link_type, properties.source, properties.section, properties.cta, properties.tab_name, '') AS detail,
        count(),
        uniq(person_id)
      FROM events
      WHERE event IN (${SITE_EVENTS.map(quote).join(', ')}) AND ${HOSTS} AND ${current}
      GROUP BY event, project, detail
      LIMIT 2000`,
  };

  const names = Object.keys(queries);
  const results = await inBatches(names.map((name) => () => hogql(env, name, queries[name])), CONCURRENCY);
  const r = Object.fromEntries(names.map((name, i) => [name, results[i]]));

  const [t = []] = r.totals;
  const today = typeof t[6] === 'string' ? t[6] : new Date().toISOString().slice(0, 10);
  const ranked = (rows) => rows.map(([name, visitors]) => ({ name: String(name), visitors: n(visitors) }));
  const host = (env.POSTHOG_API_HOST || 'https://us.posthog.com').replace(/\/+$/, '');

  return {
    days,
    today,
    generatedAt: new Date().toISOString(),
    hosts: SITE_HOSTS,
    totals: { visitors: n(t[0]), pageviews: n(t[1]), sessions: n(t[2]) },
    previous: { visitors: n(t[3]), pageviews: n(t[4]), sessions: n(t[5]) },
    daily: fillDays(r.daily, today, days),
    pages: r.pages.map(([path, views, visitors]) => ({ path: String(path), pageviews: n(views), visitors: n(visitors) })),
    referrers: ranked(r.referrers).filter((row) => !SITE_HOSTS.includes(row.name)).slice(0, 10),
    countries: ranked(r.countries),
    devices: ranked(r.devices),
    events: r.events.map(([event, project, detail, count, people]) => ({
      event: String(event),
      project: String(project),
      detail: String(detail),
      count: n(count),
      people: n(people),
    })),
    posthogUrl: `${host}/project/${encodeURIComponent(env.POSTHOG_PROJECT_ID)}`,
  };
}

export { PostHogError };
