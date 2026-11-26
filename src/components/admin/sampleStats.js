// Made-up numbers in the shape /admin/api/stats returns, for working on the
// page's design with `npm run dev` and ?sample in the URL. Only loaded in dev:
// the production build drops it.

function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

export function sampleStats(days) {
  const random = seeded(days * 7919);
  const today = new Date().toISOString().slice(0, 10);
  const end = Date.parse(`${today}T00:00:00Z`);
  const daily = Array.from({ length: days }, (_, i) => {
    const day = new Date(end - (days - 1 - i) * 86400000).toISOString().slice(0, 10);
    const visitors = Math.round(random() * 14 + (i % 7 < 5 ? 6 : 1) + (i > days - 6 ? 9 : 0));
    return { day, visitors, pageviews: visitors + Math.round(random() * visitors * 1.6) };
  });
  const sum = (key) => daily.reduce((n, d) => n + d[key], 0);
  const visitors = Math.round(sum('visitors') * 0.8);
  const pageviews = sum('pageviews');

  const event = (name, project, detail, count) => ({ event: name, project, detail, count, people: Math.max(1, Math.round(count * 0.7)) });
  return {
    days,
    today,
    generatedAt: new Date().toISOString(),
    hosts: ['www.zakiamin.com', 'zakiamin.com'],
    totals: { visitors, pageviews, sessions: Math.round(visitors * 1.3) },
    previous: { visitors: Math.round(visitors * 0.86), pageviews: Math.round(pageviews * 1.07), sessions: Math.round(visitors * 1.3) },
    daily,
    pages: [
      { path: '/', pageviews: Math.round(pageviews * 0.82), visitors: Math.round(visitors * 0.95) },
      { path: '/batin/', pageviews: Math.round(pageviews * 0.18), visitors: Math.round(visitors * 0.22) },
    ],
    referrers: [
      { name: '$direct', visitors: Math.round(visitors * 0.41) },
      { name: 'www.linkedin.com', visitors: Math.round(visitors * 0.27) },
      { name: 'github.com', visitors: Math.round(visitors * 0.14) },
      { name: 'www.google.com', visitors: Math.round(visitors * 0.09) },
      { name: 'mail.google.com', visitors: Math.round(visitors * 0.04) },
    ],
    countries: [
      { name: 'Canada', visitors: Math.round(visitors * 0.58) },
      { name: 'United States', visitors: Math.round(visitors * 0.29) },
      { name: 'United Kingdom', visitors: Math.round(visitors * 0.05) },
      { name: 'India', visitors: Math.round(visitors * 0.04) },
    ],
    devices: [
      { name: 'Desktop', visitors: Math.round(visitors * 0.71) },
      { name: 'Mobile', visitors: Math.round(visitors * 0.27) },
      { name: 'Tablet', visitors: Math.round(visitors * 0.02) },
    ],
    events: [
      event('project_teaser_clicked', 'ZoneDocket', '', 31),
      event('project_teaser_clicked', 'The Repo Exchange', '', 44),
      event('project_teaser_clicked', 'Batin', '', 18),
      event('case_study_opened', 'ZoneDocket', '', 22),
      event('case_study_opened', 'The Repo Exchange', '', 37),
      event('case_study_opened', 'Batin', '', 15),
      event('case_study_opened', 'DOMolition', '', 6),
      event('demo_video_played', 'ZoneDocket', '', 19),
      event('demo_video_played', 'The Repo Exchange', '', 28),
      event('demo_video_played', 'Wallbreak', '', 4),
      event('case_study_link_clicked', 'The Repo Exchange', 'live', 12),
      event('case_study_link_clicked', 'The Repo Exchange', 'github', 9),
      event('case_study_link_clicked', 'Batin', 'writeup', 11),
      event('project_link_clicked', 'DOMolition', 'npm', 3),
      event('project_link_clicked', 'FrankenSorter', 'github', 2),
      event('resume_viewed', '', '', 26),
      event('resume_link_clicked', '', 'hero', 14),
      event('resume_link_clicked', '', 'nav', 9),
      event('resume_link_clicked', '', 'footer', 3),
      event('contact_link_clicked', '', 'email', 7),
      event('contact_link_clicked', '', 'copy-email', 5),
      event('contact_link_clicked', '', 'linkedin', 11),
      event('contact_link_clicked', '', 'github', 8),
      event('nav_link_clicked', '', 'work', 21),
      event('nav_link_clicked', '', 'experience', 8),
      event('nav_link_clicked', '', 'toolkit', 5),
      event('nav_link_clicked', '', 'contact', 6),
      event('hero_cta_clicked', '', 'work', 17),
      event('domolition_triggered', '', '', 9),
    ],
    posthogUrl: 'https://us.posthog.com',
  };
}
