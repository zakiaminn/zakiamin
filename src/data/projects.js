// Project copy is functionality-first: the top-line description leads with what
// each build does and the hardest mechanism inside it. The war stories (dead
// hosts, IPv6, rate limits) live in `longform` (the Build Log), not the
// headline. Voice: confident, a little edge, kept honest against the real code.
// House rules for visible strings: no em dashes, sentence-case taglines, and
// stat values are numbers (the mono is for figures only).

const trxProject = {
  title: 'The Repo Exchange',
  tagline: 'A trading terminal for GitHub repos',
  description:
    "A real-time trading terminal where the tradable assets are GitHub repos, priced live off their stars, forks, and open issues. Three deployed services (a Next.js terminal, a Node/Express order engine, and a 24/7 Python data engine) share one Postgres ledger. Postgres Row-Level Security lets the client read a user's own portfolio directly, and a caching layer pins the database to a single query every five seconds no matter how many terminals are polling.",
  longform: [
    "TRX turns GitHub into a market: every repo is a tradable asset, its price derived from live metrics, and you trade it with $100k of simulated capital. A Python worker runs 24/7. It hunts trending repos, ingests their stars, forks, and open issues, computes a synthetic price, then backfills historical points so a new listing never loads with an empty chart. The real constraint was GitHub's API rate limits, so the worker runs on exponential backoff and paced polling and never gets timed out.",
    "The terminal is thirsty: it polls for live prices every five seconds to feel alive, and that nearly took the database down on its own. I put an IP rate-limiter and an in-memory cache in front of the Express API, which decouples the number of connected clients from the number of database queries. A hundred terminals still resolve to one query per five-second tick. I'd rather not get a denial-of-wallet invoice from my own frontend.",
    "Access control lives in the database. Auth is passwordless (Supabase magic links delivered over Resend), and Postgres Row-Level Security means a user physically cannot query another user's portfolio or transaction log, even straight from the client. The Express backend is kept for the heavy lifting: order routing and market data.",
    "Then my original host's free trial expired mid-production and the API went dark. Rebuilding it surfaced a bug where the API worked locally and 500'd in prod with two different errors. Supabase's direct database hostname is IPv6-only and Render couldn't route IPv6 at all. I moved both services to Railway on Supabase's connection pooler, and while the hood was open, audited the entire git history for leaked keys and patched all 27 flagged dependency vulnerabilities to zero across three ecosystems. Next up: moving trade validation fully server-side with a hard slippage tolerance, because client state is a lie and nobody should be able to edit a JSON payload to buy React for zero dollars.",
  ],
  stats: [
    { value: '3', label: 'Deployed services, one Postgres ledger' },
    { value: '1', label: 'Database query per 5-second tick, at any client count' },
    { value: '27 → 0', label: 'Flagged dependency vulnerabilities, patched' },
    { value: '24/7', label: 'Rate-limit-aware data engine' },
  ],
  tech: ['Next.js', 'Node / Express', 'Python', 'PostgreSQL', 'Supabase', 'Vercel', 'Railway'],
  github: 'https://github.com/zakiaminn/TheRepoExchange',
  live: 'https://therepo.exchange',
  liveLabel: 'therepo.exchange',
  demoVideo: '/TRX-demo.mp4',
  poster: '/posters/trx.jpg',
  demoSize: [2030, 1190],
  demoDuration: 98,
  pullQuote:
    "The API worked locally and died in prod with two different errors: Supabase's direct DB hostname is IPv6-only, and Render couldn't route IPv6 at all.",
};

const batinProject = {
  title: 'Batin',
  tagline: 'An options order-flow analytics engine',
  status: 'Pre-launch, private repo',
  comingSoon: true,
  demoComingSoon: true,
  description:
    "Batin reads options order flow and distills it into one conviction signal: the Batin Index. Every trade is classified buy- or sell-side by where it printed against the bid/ask spread (instead of assuming a call buy is bullish), then weighted by delta exposure and split into institutional versus retail flow. Live ticks and historical backfill land in the same TimescaleDB hypertables, so a query never cares whether a row arrived a second ago or a year ago.",
  longform: [
    "Batin is the analytically serious one, and the math is the point. `computeTradeDirection` looks at whether a trade printed at the bid, at the ask, or inside the spread to decide direction, and only falls back to a call/put heuristic when there's no usable quote. That direction weights `computeDex`, a delta-exposure figure (contract size × 100 × |delta| × underlying), which is then split into institutional flow (premium ≥ $500k) and retail (size ≤ 10 contracts) to produce a net conviction score per ticker: the Index itself.",
    "The storage model is deliberate. A streaming listener and a historical backfill job feed the same TimescaleDB hypertables (options ticks and dark-pool block prints), so the pipeline is agnostic to how a row arrived. TimescaleDB over vanilla Postgres specifically for the hypertable partitioning: scans across millions of ticks by ticker, strike, expiration, and time stay fast.",
    "It runs as six coordinated services under a single `docker-compose up`: TimescaleDB, Redis for hot-query caching, a FastAPI engine exposing the index and order-ticket endpoints, the streaming listener, the backfill job, and a Next.js terminal with auth, a dashboard, per-ticker pages, and a paper-trading order ticket that writes to its own table.",
    "It's headed for a public deployment now, with a live demo landing shortly. Up to this point it's run in dev on purpose, so the effort went into getting the order-flow math right rather than the packaging. If TRX is the finished storefront, Batin is the engine room.",
  ],
  stats: [
    { value: '2', label: 'TimescaleDB hypertables' },
    { value: '$500k', label: 'Premium that counts as institutional flow' },
    { value: '≤10', label: 'Contracts that count as retail flow' },
    { value: '6', label: 'Services behind one docker-compose up' },
  ],
  // How the six services connect, drawn on the page as the pipeline figure.
  pipeline: [
    { stage: 'Ingest', nodes: ['Streaming listener', 'Historical backfill'] },
    { stage: 'Store', nodes: ['TimescaleDB'], note: 'Options ticks and dark-pool prints' },
    { stage: 'Serve', nodes: ['FastAPI engine', 'Redis cache'] },
    { stage: 'Trade', nodes: ['Next.js terminal'], note: 'Dashboard, ticker pages, paper trading' },
  ],
  tech: ['Python', 'FastAPI', 'TimescaleDB', 'PostgreSQL', 'Redis', 'pandas / NumPy / SciPy', 'Next.js', 'Docker'],
  pullQuote: 'TRX is the finished storefront; Batin is the engine room.',
};

export const featuredProjects = [trxProject, batinProject];

export const projects = [
  {
    title: 'DOMolition',
    tagline: 'A UI you’re allowed to break',
    summary:
      'A published npm package that turns any React component into a rigid-body physics simulation.',
    description:
      "A published npm package that turns any React component into a rigid-body physics simulation. It captures the live element to a bitmap (computed styles and all), subdivides that image into shards (a clean grid, or Voronoi tessellation via d3-delaunay), and hands each shard to matter-js as a body with real mass, friction, and restitution. A canvas loop paints the pieces as they fall and tears itself down once everything comes to rest. Because sometimes centering a div deserves consequences.",
    tech: ['React', 'TypeScript', 'matter-js', 'd3-delaunay', 'Canvas', 'npm'],
    github: 'https://github.com/zakiaminn/DOMolition',
    npm: 'https://www.npmjs.com/package/domolition',
    demoVideo: '/DOMolition-demo.mp4',
    demoLoop: true,
    poster: '/posters/domolition.jpg',
    demoSize: [800, 520],
  },
  {
    title: 'AegisGrid',
    tagline: 'A tower-defense engine that fights back',
    summary:
      'A tower-defense engine in Java and LibGDX. Enemies re-route with A* the moment you build a wall, and tear through it if you box them in.',
    description:
      "A wave-based tower-defense engine written from scratch in Java and LibGDX. Enemies pathfind with a custom A* that recomputes the instant you place or sell a wall. And if you try to cheese it by boxing in the core, they switch to a breach route and destroy your barricades to carve a new one. Towers acquire the nearest target by Euclidean distance, lead it with vector-homing projectiles, and rotate to face it with atan2. LibGDX only draws the frames: the pathfinding, the targeting, and the PREP/DEFEND state machine are all hand-written.",
    tech: ['Java', 'LibGDX', 'A* Pathfinding', '2D Vector Math', 'OOP'],
    github: 'https://github.com/zakiaminn/AegisGrid',
    demoVideo: '/AegisGrid-demo.mp4',
    demoLoop: true,
    poster: '/posters/aegisgrid.jpg',
    demoSize: [1280, 742],
  },
  {
    title: 'FrankenSorter',
    tagline: 'A local AI that cleans up after you',
    summary:
      'A desktop app that files your documents with an on-device LLM. A regex router handles the obvious cases, so the model only runs on the ambiguous ones.',
    description:
      "A privacy-first desktop app that reads your files and sorts them for you, running entirely on-device with no cloud and no API key. The core is a two-tier router: deterministic Regex catches known patterns like course codes and routes them instantly, so a local Qwen2.5 7B model is only ever called for the genuinely ambiguous files, which keeps it fast and free. A multi-format ETL layer pulls text from PDF, Word, PowerPoint, and Excel with defensive parsing for malformed documents, and the model runs under a JSON schema with its category constrained to an enum at temperature zero, so routing is deterministic and it physically cannot invent a folder that doesn't exist. Inference and heavy I/O run off the main thread, so the interface stays responsive while it works.",
    tech: ['Python', 'Ollama / Qwen2.5 7B', 'CustomTkinter', 'Regex + ETL', 'JSON Schema'],
    github: 'https://github.com/zakiaminn/FrankenSorter',
    live: 'https://zakiaminn.github.io/FrankenSorter/',
    demoVideo: '/FrankenSorter-demo.mp4',
    poster: '/posters/frankensorter.jpg',
    demoSize: [2030, 1190],
  },
];
