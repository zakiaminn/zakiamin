// What the home page shows of each project: a tagline, one sentence and three
// highlights. Every sentence is lifted from projects.js; the full text stays
// in the case-study dialogs.
import { featuredProjects, projects } from './projects';

const [zoneDocket, trx, batin] = featuredProjects;
const pick = (list, indexes) => indexes.map((i) => list[i]).filter(Boolean);

export const featured = [
  {
    ...zoneDocket,
    slug: 'zonedocket',
    statusLine: `Live at ${zoneDocket.liveLabel}`,
    summary:
      'A weekly digest and alert feed that tells GTA builders, designers and planning consultants what is coming up for planning approval.',
    top: pick(zoneDocket.highlights, [0, 3, 5]),
  },
  {
    ...trx,
    slug: 'trx',
    statusLine: `Live at ${trx.liveLabel}`,
    summary:
      'A simulated market where GitHub repos trade like stocks. Every price comes from six public numbers on the repo, put through one versioned formula.',
    top: pick(trx.highlights, [0, 1, 2]),
  },
  {
    ...batin,
    slug: 'batin',
    statusLine: `${batin.phase} · ${batin.status}`,
    summary:
      'An options order-flow engine built around one question: does big money trading against the crowd say where a stock goes next? Twelve analyses found no usable edge, and I said so.',
    top: pick(batin.highlights, [0, 1, 2]),
  },
];

export const builds = projects.map((p) => ({ ...p, slug: p.title.toLowerCase() }));

// What a recruiter checks first, as plain facts.
export const facts = {
  school: 'Computer Science, Sheridan College',
  city: 'Toronto',
};
