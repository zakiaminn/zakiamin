const trxProject = {
  title: 'The Repo Exchange',
  tagline: 'A Stock Exchange for GitHub Repos',
  description:
    "TRX is a fake stock market where the tradable assets are GitHub repos — price is just star count \xf7 100, and you trade with $100k of fake money. Under the hood it's three separate services (a Next.js frontend, a Node/Express trading engine, a Python scraper) all talking to one Postgres database, with real trading safeguards: row-locked transactions, slippage protection, a full audit log.",
  longform: [
    "TRX turns GitHub into a stock market. Every repo is a “stock,” its price is just star count \xf7 100, and you trade it with $100k of starting capital. A Python worker polls GitHub every hour, finds trending repos, and backfills 30 days of synthetic price history so new listings don't show up with an empty chart. It's three services — a Next.js trading terminal, a Node/Express engine that actually executes trades, and that Python scraper — sharing one Postgres database, no ORM, just SQL I wrote by hand.",
    "The trading engine isn't a toy despite the premise: buys and sells run inside row-locked Postgres transactions so two requests can't race each other, there's slippage protection against stale prices, weighted-average cost basis tracking, and an append-only log of every trade. I also added a confirmation step before trades fire — turns out shipping a “buy” button with zero confirmation is a bad idea even when the money's fake.",
    "Then my host's free trial expired mid-production and the API just went dark. Fixing it meant rebuilding the whole stack on $0/month infra, and along the way I chased a bug where the API worked locally and died in prod with two completely different errors — turned out Supabase's direct DB hostname is IPv6-only, and Render can't route IPv6 at all. Swapped both services to Supabase's connection pooler and it's been stable since.",
    "Before making the repo public I went back through the entire git history — not just current files — checking for leaked keys, patched all 27 flagged dependency vulnerabilities across three different ecosystems without breaking anything, then did a full design pass: new color system, a logo, reusable components, mobile nav, after running my own audit and finding a page that was literally rendering two nav bars stacked on each other.",
  ],
  stats: [
    { value: '3', label: 'Services, 1 DB' },
    { value: '27 → 0', label: 'Vulnerabilities patched' },
    { value: '$0/mo', label: 'Hosting cost' },
    { value: 'IPv6', label: 'Bug root-caused across 2 hosts' },
  ],
  tech: ['Next.js', 'React', 'Node / Express', 'Python', 'PostgreSQL', 'Supabase', 'Vercel', 'Render'],
  github: 'https://github.com/zakiaminn/TheRepoExchange',
  live: 'https://therepo.exchange',
  demoVideo: '/TRX-demo.mp4',
};

const batinProject = {
  title: 'Batin',
  tagline: 'An Options Order-Flow Analytics Engine',
  description:
    "Batin streams live options trades into TimescaleDB and turns them into a signal: the Batin Index. Every trade gets classified as buy- or sell-side off where it printed relative to the bid/ask spread, weighted by delta exposure, and split into institutional vs. retail flow — all served through a FastAPI engine and a Next.js terminal.",
  longform: [
    "Batin is the more analytically serious of the two trading projects. A streaming listener and a historical backfill job both feed the same TimescaleDB hypertables — options ticks and dark-pool block prints — so the data model doesn't care whether a row arrived live or got backfilled a year later. TimescaleDB over plain Postgres specifically because time-series queries over millions of ticks (scan by ticker + strike + expiration + time) need the hypertable partitioning to stay fast.",
    "The actual math is the part I care about: `computeTradeDirection` doesn't just assume a call buy is bullish — it looks at whether the trade printed at the bid, at the ask, or inside the spread, and falls back to a naive call/put heuristic only when there's no usable quote. That direction then weights `computeDex`, a delta-exposure calculation (contract size × 100 × |delta| × underlying price), which gets split into institutional flow (premium ≥ $500k) versus retail (size ≤ 10 contracts) to produce a net conviction score per ticker — the Batin Index itself.",
    "Everything runs as six coordinated pieces under one `docker-compose up`: TimescaleDB, Redis for caching hot queries, a FastAPI engine (`batinApp`) exposing the index and order-ticket endpoints, the streaming listener, the backfill script, and a Next.js terminal with real auth, a dashboard, per-ticker pages, and a paper-trading order ticket that writes to its own table.",
    "It's not deployed publicly yet — it's still a local dev-mode project — which is honestly the point: this is the one I built to actually understand the math of order flow, not to ship a polished product. TRX is the finished storefront; Batin is the engine room.",
  ],
  stats: [
    { value: '2', label: 'TimescaleDB hypertables' },
    { value: 'Bid/Ask', label: 'Trade-direction classification' },
    { value: '$500k', label: 'Institutional premium threshold' },
    { value: '6', label: 'Services under one Docker Compose' },
  ],
  tech: ['Python', 'FastAPI', 'TimescaleDB', 'PostgreSQL', 'Redis', 'pandas / NumPy / SciPy', 'Next.js', 'Docker'],
  github: 'https://github.com/zakiaminn/Batin',
};

export const featuredProjects = [trxProject, batinProject];

export const projects = [
  {
    title: 'DOMolition',
    tagline: 'A UI You’re Allowed to Break',
    description:
      "An NPM package for one specific feeling: when an app is being unbearable and you just want to watch it break. Click a button and the interface shatters — real DOM nodes, real CSS physics, not a video. Built it because error states are boring and rage-quitting deserved better tooling.",
    tech: ['JavaScript', 'DOM API', 'CSS Physics', 'NPM'],
    color: '#FF5A33',
    shatter: true,
    github: 'https://github.com/zakiaminn/DOMolition',
    demoGif: '/DOMolitionDemo.gif',
  },
  {
    title: 'AegisGrid',
    tagline: 'Watch A* Think',
    description:
      "A grid-based pathfinding sandbox — drop walls and obstacles, watch A* find the shortest route around them in real time, step by step. I built it to actually understand the algorithm, not just cite it in an interview.",
    tech: ['JavaScript', 'Algorithms', 'HTML5 Canvas', 'Game Dev'],
    color: '#F0A93A',
    shatter: false,
    github: 'https://github.com/zakiaminn/AegisGrid',
    demoGif: '/AegisGridDemo.gif',
  },
  {
    title: 'FrankenSorter',
    tagline: 'A Local AI That Cleans Up After You',
    description:
      "Started as a Python script to stop my Downloads folder from becoming a crime scene. Turned into a local AI app that runs Ollama on-device to read files and route them where they actually belong — no cloud, no API key, just a GUI on top of a model doing the sorting I refused to do by hand.",
    tech: ['Python', 'Ollama AI', 'Automation', 'Software Design'],
    color: '#C97B2E',
    shatter: false,
    github: 'https://github.com/zakiaminn/FrankenSorter',
    demoGif: '/ssdemo.png',
  },
];
