import React, { useEffect, useState } from 'react';
import { Mark } from '@/components/Mark';
import { Tabs, SegmentedTabsList, TabsContent } from '@/components/ui/tabs';
import { isOptedOut, setOptedOut } from '@/lib/analyticsOptOut';
import { PAGE } from '@/lib/layout';
import DailyChart, { ChartLegend } from './DailyChart';
import {
  detailName,
  formatChange,
  formatClock,
  formatCount,
  formatDay,
  formatDayLong,
  pageName,
  referrerName,
} from './format';

const RANGES = [
  { value: '7', label: '7 days' },
  { value: '30', label: '30 days' },
  { value: '90', label: '90 days' },
];

class StatsError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

async function loadStats(days, signal) {
  // `npm run dev` has no Worker behind it; /admin/?sample shows made-up numbers.
  if (import.meta.env.DEV && new URLSearchParams(window.location.search).has('sample')) {
    const { sampleStats } = await import('./sampleStats.js');
    return sampleStats(days);
  }
  let response;
  try {
    response = await fetch(`/admin/api/stats?days=${days}`, {
      signal,
      credentials: 'same-origin',
      headers: { Accept: 'application/json' },
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    // An expired Access login answers with a redirect to the login page,
    // which a fetch can't follow across origins.
    throw new StatsError(0, 'network',
      'Couldn\'t reach the numbers. If the page has been open a while, your login may have run out: reload to sign in again.');
  }
  let body = null;
  try {
    body = await response.json();
  } catch {
    // Not JSON: something other than the Worker answered.
  }
  if (!body) {
    throw new StatsError(response.status, 'no-api',
      'Nothing answered at /admin/api/stats. The API runs in the Worker, so run npx wrangler dev locally, or add ?sample to the address under npm run dev for made-up numbers.');
  }
  if (!response.ok) throw new StatsError(response.status, body.error, body.message);
  return body;
}

// The latest answer for the selected range. While a new range loads, the old
// numbers stay on screen, dimmed, rather than flashing to a placeholder.
function useStats(days, attempt) {
  const key = `${days}:${attempt}`;
  const [result, setResult] = useState({ key: null, data: null, error: null });

  useEffect(() => {
    const controller = new AbortController();
    loadStats(days, controller.signal).then(
      (data) => setResult({ key, data, error: null }),
      (error) => {
        if (error.name !== 'AbortError') setResult({ key, data: null, error });
      },
    );
    return () => controller.abort();
  }, [days, key]);

  return { ...result, loading: result.key !== key };
}

const TITLES = {
  'not-signed-in': 'Sign in to see the numbers',
  'invalid-token': 'That login didn\'t check out',
  'access-not-configured': 'Cloudflare Access isn\'t set up yet',
  'access-certs-unavailable': 'Couldn\'t check the login',
  'posthog-not-configured': 'PostHog isn\'t connected yet',
  'posthog-error': 'PostHog said no',
  network: 'Couldn\'t reach the numbers',
  'no-api': 'There\'s no API here',
};

function Problem({ error, onRetry }) {
  return (
    <div className="py-14 max-w-2xl" role="alert">
      <h2 className="text-2xl font-semibold tracking-[-0.02em] text-ink balance">
        {TITLES[error.code] || 'Something went wrong'}
      </h2>
      <p className="mt-3 text-ink-2 leading-relaxed pretty">{error.message}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" onClick={onRetry} className="btn">Try again</button>
        {(error.code === 'invalid-token' || error.code === 'network') && (
          <button type="button" onClick={() => window.location.reload()} className="btn">Reload the page</button>
        )}
      </div>
    </div>
  );
}

function SectionHead({ id, children, aside }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 pb-3 border-b-2 border-ink">
      <h2 id={id} className="label text-ink">{children}</h2>
      {aside}
    </div>
  );
}

function Figure({ label, value, change, note }) {
  const tone = change?.tone === 'pos' ? 'text-pos' : change?.tone === 'neg' ? 'text-neg' : 'text-ink-3';
  return (
    <div>
      <p className="label">{label}</p>
      <p className="mt-3 num text-[2.5rem] leading-none text-ink">{formatCount(value)}</p>
      <p className="mt-3 text-sm text-ink-3">
        {change && <span className={`font-medium ${tone} ${change.tone === 'flat' ? '' : 'num'}`}>{change.text}</span>} {note}
      </p>
    </div>
  );
}

function Figures({ data, resume }) {
  const vs = `on the previous ${data.days} days`;
  const items = [
    { label: 'Visitors', value: data.totals.visitors, change: formatChange(data.totals.visitors, data.previous.visitors), note: vs },
    { label: 'Pageviews', value: data.totals.pageviews, change: formatChange(data.totals.pageviews, data.previous.pageviews), note: vs },
    { label: 'Visits', value: data.totals.sessions, change: formatChange(data.totals.sessions, data.previous.sessions), note: vs },
    {
      label: 'Résumé opens',
      value: resume.opens,
      note: resume.opens ? `by ${formatCount(resume.people)} ${resume.people === 1 ? 'person' : 'people'}` : 'None in this range',
    },
  ];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 border-b border-rule">
      {items.map((item, i) => (
        <div
          key={item.label}
          className={[
            'py-6',
            i % 2 === 1 ? 'pl-5 sm:pl-8 border-l border-rule' : 'pr-5 sm:pr-8',
            i >= 2 ? 'border-t border-rule lg:border-t-0' : '',
            i === 2 ? 'lg:pl-8 lg:border-l' : '',
            i < 3 ? 'lg:pr-8' : '',
          ].join(' ')}
        >
          <Figure {...item} />
        </div>
      ))}
    </div>
  );
}

/** Ranked rows: a name, its figure, and a thin bar under the name to scan by. */
function RankList({ title, unit, rows, empty }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <section>
      <div className="flex items-baseline justify-between gap-4 pb-2 border-b border-rule">
        <h3 className="label text-ink">{title}</h3>
        <span className="label">{unit}</span>
      </div>
      {rows.length === 0 ? (
        <p className="py-4 text-sm text-ink-3">{empty}</p>
      ) : (
        <ol>
          {rows.map((row) => (
            <li key={row.key} className="py-2.5 border-b border-rule">
              <div className="flex items-baseline justify-between gap-4">
                <span className="min-w-0 truncate text-[15px] text-ink">
                  {row.name}
                  {row.sub && <span className="ml-2 text-sm text-ink-3">{row.sub}</span>}
                </span>
                <span className="num text-sm text-ink">{formatCount(row.value)}</span>
              </div>
              <div
                aria-hidden="true"
                className="mt-1.5 h-1 bg-brand-ink"
                style={{ width: `${Math.max(0.5, (row.value / max) * 100)}%` }}
              />
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function Pair({ children }) {
  const [left, right] = React.Children.toArray(children);
  return (
    <div className="grid md:grid-cols-2">
      <div className="pt-8 md:pr-8">{left}</div>
      <div className="pt-8 md:pl-8 md:border-l border-rule">{right}</div>
    </div>
  );
}

// The site's custom events, folded into what the page reports.
function summarize(events) {
  const sum = (list) => list.reduce((n, e) => n + e.count, 0);
  const of = (name) => events.filter((e) => e.event === name);
  const byDetail = (name, label = detailName) => {
    const totals = new Map();
    for (const e of of(name)) totals.set(e.detail, (totals.get(e.detail) || 0) + e.count);
    return [...totals]
      .map(([detail, value]) => ({ key: `${name}:${detail}`, name: label(detail), value }))
      .sort((a, b) => b.value - a.value);
  };

  const columns = {
    project_teaser_clicked: 'teasers',
    case_study_opened: 'opened',
    demo_video_played: 'videos',
    case_study_link_clicked: 'links',
    project_link_clicked: 'links',
  };
  const projects = new Map();
  for (const e of events) {
    const column = columns[e.event];
    if (!column || !e.project) continue;
    const row = projects.get(e.project) || { project: e.project, teasers: 0, opened: 0, videos: 0, links: 0 };
    row[column] += e.count;
    projects.set(e.project, row);
  }
  const work = [...projects.values()].sort(
    (a, b) => b.teasers + b.opened + b.videos + b.links - (a.teasers + a.opened + a.videos + a.links),
  );

  const resumeViews = of('resume_viewed');
  const heroCta = sum(of('hero_cta_clicked'));
  const domolition = sum(of('domolition_triggered'));
  const around = [
    ...byDetail('nav_link_clicked', (d) => `${detailName(d)} in the nav`),
    ...(heroCta ? [{ key: 'hero', name: 'See the work button', value: heroCta }] : []),
    ...(domolition ? [{ key: 'domolition', name: 'Broke DOMolition', value: domolition }] : []),
  ].sort((a, b) => b.value - a.value);

  return {
    work,
    resume: {
      opens: sum(resumeViews),
      people: resumeViews.reduce((n, e) => Math.max(n, e.people), 0),
      sources: byDetail('resume_link_clicked'),
    },
    contact: byDetail('contact_link_clicked'),
    around,
  };
}

function WorkTable({ rows }) {
  if (!rows.length) return <p className="py-4 text-sm text-ink-3">No one has opened a project in this range.</p>;
  const cell = 'py-2.5 pl-4 text-right num text-ink';
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] text-sm border-collapse">
        <thead>
          <tr className="border-b border-rule-2">
            <th scope="col" className="label text-left font-semibold py-2.5 pr-4">Project</th>
            <th scope="col" className="label text-right font-semibold py-2.5 pl-4">Teaser clicks</th>
            <th scope="col" className="label text-right font-semibold py-2.5 pl-4">Write-ups opened</th>
            <th scope="col" className="label text-right font-semibold py-2.5 pl-4">Video plays</th>
            <th scope="col" className="label text-right font-semibold py-2.5 pl-4">Links followed</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.project} className="border-b border-rule">
              <th scope="row" className="py-2.5 pr-4 text-left font-normal text-[15px] text-ink">{r.project}</th>
              <td className={cell}>{formatCount(r.teasers)}</td>
              <td className={cell}>{formatCount(r.opened)}</td>
              <td className={cell}>{formatCount(r.videos)}</td>
              <td className={cell}>{formatCount(r.links)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DayTable({ rows }) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full max-w-xl text-sm border-collapse">
        <thead>
          <tr className="border-b border-rule-2">
            <th scope="col" className="label text-left font-semibold py-2 pr-4">Day</th>
            <th scope="col" className="label text-right font-semibold py-2 pl-4">Visitors</th>
            <th scope="col" className="label text-right font-semibold py-2 pl-4">Pageviews</th>
          </tr>
        </thead>
        <tbody>
          {[...rows].reverse().map((r) => (
            <tr key={r.day} className="border-b border-rule">
              <th scope="row" className="py-2 pr-4 text-left font-normal text-ink-2">
                <time dateTime={r.day} className="num">{formatDayLong(r.day)}</time>
              </th>
              <td className="py-2 pl-4 text-right num text-ink">{formatCount(r.visitors)}</td>
              <td className="py-2 pl-4 text-right num text-ink">{formatCount(r.pageviews)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Dashboard({ data }) {
  const [showTable, setShowTable] = useState(false);
  const events = summarize(data.events);
  const first = data.daily[0]?.day;
  const range = first ? `${formatDay(first)} to ${formatDay(data.today)}` : '';

  const visitorsOf = (list, name = (n) => n) => list.map((r) => ({ key: r.name, name: name(r.name), value: r.visitors }));

  return (
    <>
      <Figures data={data} resume={events.resume} />

      <section aria-labelledby="daily-heading" className="pt-12">
        <SectionHead id="daily-heading" aside={<ChartLegend />}>Each day, {range}</SectionHead>
        <div className="pt-6">
          <DailyChart rows={data.daily} label={`Visitors and pageviews each day, ${range}`} />
        </div>
        <button type="button" onClick={() => setShowTable((v) => !v)} aria-expanded={showTable} className="btn btn-sm mt-4">
          {showTable ? 'Hide the table' : 'Show as a table'}
        </button>
        {showTable && <DayTable rows={data.daily} />}
      </section>

      <section aria-labelledby="audience-heading" className="pt-14">
        <SectionHead id="audience-heading">Where they came from</SectionHead>
        <Pair>
          <RankList
            title="Pages"
            unit="Pageviews"
            empty="No pageviews in this range."
            rows={data.pages.map((p) => ({
              key: p.path,
              name: pageName(p.path),
              sub: pageName(p.path) === p.path ? '' : p.path,
              value: p.pageviews,
            }))}
          />
          <RankList title="Referrers" unit="Visitors" empty="No referrers in this range." rows={visitorsOf(data.referrers, referrerName)} />
        </Pair>
        <Pair>
          <RankList title="Countries" unit="Visitors" empty="No visitors in this range." rows={visitorsOf(data.countries)} />
          <RankList title="Devices" unit="Visitors" empty="No visitors in this range." rows={visitorsOf(data.devices)} />
        </Pair>
      </section>

      <section aria-labelledby="work-heading" className="pt-14">
        <SectionHead id="work-heading">What they looked at</SectionHead>
        <div className="pt-6">
          <WorkTable rows={events.work} />
        </div>
        <div className="grid md:grid-cols-3">
          <div className="pt-8 md:pr-8">
            <RankList title="Résumé buttons" unit="Clicks" empty="No résumé button clicks." rows={events.resume.sources} />
          </div>
          <div className="pt-8 md:px-8 md:border-l border-rule">
            <RankList title="Contact" unit="Clicks" empty="No contact clicks yet." rows={events.contact} />
          </div>
          <div className="pt-8 md:pl-8 md:border-l border-rule">
            <RankList title="Around the page" unit="Clicks" empty="No clicks in this range." rows={events.around} />
          </div>
        </div>
      </section>

      <p className="mt-12 text-sm text-ink-3 leading-relaxed max-w-3xl pretty">
        Only visits to {data.hosts.join(' and ')} count, so local and branch-preview visits aren&apos;t here. Days
        follow the PostHog project&apos;s timezone, and today is still running.{' '}
        <a href={data.posthogUrl} target="_blank" rel="noreferrer" className="link">
          Open PostHog<span className="sr-only"> (opens in a new tab)</span>
        </a>
      </p>
    </>
  );
}

function ThisBrowser() {
  const [optedOut, setState] = useState(() => isOptedOut());
  const [blocked, setBlocked] = useState(false);

  function toggle() {
    const next = !optedOut;
    if (setOptedOut(next)) {
      setState(next);
      setBlocked(false);
    } else {
      setBlocked(true);
    }
  }

  return (
    <section aria-labelledby="browser-heading" className="mt-16">
      <SectionHead id="browser-heading">This browser</SectionHead>
      <div className="pt-6 flex flex-wrap items-start justify-between gap-x-10 gap-y-5">
        <div className="max-w-2xl">
          <p className="text-[1.0625rem] text-ink">
            {optedOut
              ? 'Your visits to the site from this browser aren’t counted.'
              : 'Your visits to the site from this browser are counted, like anyone else’s.'}
          </p>
          <p className="mt-2 text-sm text-ink-2 leading-relaxed pretty">
            The switch is saved in this browser only, so set it on each browser and phone you use, and again after
            clearing site data. This page itself is never counted.
          </p>
          {blocked && (
            <p className="mt-2 text-sm text-neg" role="status">
              This browser blocks site storage, so the switch can&apos;t be saved here.
            </p>
          )}
        </div>
        <button type="button" onClick={toggle} aria-pressed={optedOut} className="btn">
          {optedOut ? 'Count this browser again' : 'Stop counting this browser'}
        </button>
      </div>
    </section>
  );
}

export default function AdminPage() {
  const [range, setRange] = useState('30');
  const [attempt, setAttempt] = useState(0);
  const days = Number(range);
  const { data, error, loading } = useStats(days, attempt);
  const retry = () => setAttempt((n) => n + 1);

  return (
    <div className="relative min-h-screen bg-bg text-ink font-bricolage">
      <a href="#main" className="skip-link btn btn-solid">Skip to content</a>
      <header className="sticky top-0 z-40 w-full border-b border-rule bg-[color-mix(in_srgb,var(--bg)_90%,transparent)] backdrop-blur-md">
        <div className={`${PAGE} h-14 flex items-center justify-between gap-4`}>
          <a href="/" className="flex items-center gap-2.5 text-ink py-2">
            <Mark />
            <span className="font-semibold tracking-[-0.01em] whitespace-nowrap">Zaki Amin Ahmad</span>
          </a>
          <div className="flex items-center gap-5 sm:gap-7">
            <a href="/" className="sig hidden sm:inline text-sm font-medium text-ink-2 py-2">View the site</a>
            <a href="/cdn-cgi/access/logout" className="btn btn-sm">Sign out</a>
          </div>
        </div>
      </header>

      <main id="main" className={`${PAGE} pb-24`}>
        <Tabs value={range} onValueChange={setRange}>
          <div className="pt-10 md:pt-14 pb-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-6">
            <div>
              <p className="label">Admin · Analytics</p>
              <h1 className="mt-3 text-[clamp(2.25rem,5vw,3.5rem)] font-bold leading-[1.03] tracking-[-0.03em] text-ink">
                Who&apos;s reading
              </h1>
              <p className="mt-3 text-ink-2">
                The last <span className="num">{days}</span> days on www.zakiamin.com
                {data && (
                  <>
                    , as of <time dateTime={data.generatedAt} className="num">{formatClock(data.generatedAt)}</time>
                  </>
                )}
                .
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <SegmentedTabsList items={RANGES} value={range} aria-label="Range" />
              <button type="button" onClick={retry} disabled={loading} className="btn btn-sm">
                Refresh
              </button>
            </div>
          </div>

          {RANGES.map((r) => (
            <TabsContent key={r.value} value={r.value} className="pt-0">
              {error && !loading ? (
                <Problem error={error} onRetry={retry} />
              ) : data ? (
                <div
                  aria-busy={loading}
                  className="transition-opacity duration-200"
                  style={{ opacity: loading ? 0.45 : 1 }}
                >
                  <Dashboard data={data} />
                </div>
              ) : (
                <p className="py-14 text-ink-3">Loading the numbers…</p>
              )}
            </TabsContent>
          ))}
        </Tabs>

        <ThisBrowser />
      </main>
    </div>
  );
}
