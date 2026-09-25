// Project copy is functionality-first: the top-line description leads with what
// each build does and the hardest mechanism inside it. The war stories (dead
// hosts, IPv6, rate limits) live in `longform` (the Build Log), not the
// headline. Voice: confident, a little edge, kept honest against the real code.
// House rules for visible strings: no em dashes, sentence-case taglines, and
// stat values are numbers (the mono is for figures only).

const trxProject = {
  title: 'The Repo Exchange',
  tagline: 'A simulated stock market for GitHub repos',
  description:
    "A simulated market where GitHub repos trade like stocks. Every price comes from six public numbers on the repo, put through one versioned formula that the Node ledger, the Python worker and the Next.js frontend each implement and test against the same fixtures, so any price can be checked against GitHub by hand. Orders are re-priced on the server, rejected if the price moved more than 1% since the ticket opened, and filled in a single row-locked transaction. You can also open calls: even-money stakes on a repo reaching a star count by a date, settled against GitHub.",
  longform: [
    "TRX turns GitHub into a market. Every repo is a listing, and its price comes from six public numbers (stars, forks, watchers, open PRs, open issues, and the date of the last push) put through one versioned formula, currently PRICING-2. Open PRs and issues are log-scaled, so a repo with 5,000 open PRs gets about $8.50 from them and spamming one barely moves its price. Each listing page rebuilds its price line by line from the public inputs, and the lines add up to the price you trade at.",
    "A Python worker reprices everything once an hour on GitHub Actions, pulling the main listings from four GitHub searches. It reads a repo's open PR count from the pagination header of a one-item page, so even 5,000 PRs cost a single request, backs off exponentially on rate limits (GitHub's Retry-After wins when it sends one), and commits each listing on its own so a run that gets cut off keeps what it already priced. The same formula lives in the ledger and the frontend too, and all three copies run against one fixture file. Wiring that up caught two places where the Node and Python copies disagreed: one measured recency in fractional days and the other in whole days, and they rounded half-cents differently.",
    "The client's price is never trusted. On every order the ledger re-reads the price, rejects the order if it moved more than 1%, and fills it in one transaction that locks the account row before the holding, so two orders can't spend the same cash; if Postgres aborts it to break a deadlock, it retries. The browser never queries the database at all: every read and write goes through the ledger, which verifies the Supabase token, with row-level security on every table as a second layer. Accounts are email and password or Google on Supabase Auth, with reset emails sent through Resend and Cloudflare Turnstile on sign-up, sign-in and reset.",
    "Calls are the newer half: stake cash on a repo reaching a star count by a date, at even money. Even money only works if the target isn't a sure thing, so the ledger sets a floor of today's stars, plus the repo's recent daily growth projected to the deadline, plus 1%. A call is a bet that the repo beats its own trend. An hourly job settles expired calls, claiming rows with SKIP LOCKED so overlapping runs split the work instead of paying twice, and each call settles inside its own savepoint so one bad row can't hold up the rest.",
    "Signed in, the listings page polls every five seconds and pauses when the tab is hidden. The ledger caches that response for five seconds and makes requests that land mid-refresh wait on the same query, so Postgres sees at most one listings query every five seconds however many tabs are open. I'd rather not get a denial-of-wallet invoice from my own frontend.",
    "Then Railway's free trial ran out mid-production and the API went dark. Rebuilding it on Render surfaced a bug where the API worked locally and 500'd in prod with two different errors: Supabase's direct database hostname is IPv6-only, and Render couldn't route IPv6 at all. Supabase's connection pooler fixed it, and while the hood was open I audited the git history for leaked keys and cleared every flagged Dependabot alert, 27 of them across three ecosystems.",
  ],
  stats: [
    { value: '6', label: 'Public GitHub numbers behind every price' },
    { value: '3', label: 'Copies of the formula, one shared test fixture' },
    { value: '1%', label: 'Price move that rejects an order' },
    { value: '1', label: 'Listings query per 5 seconds, however many tabs' },
  ],
  tech: ['Next.js', 'Node / Express', 'Python', 'PostgreSQL', 'Supabase Auth', 'Google OAuth', 'Resend', 'GitHub Actions', 'Vercel', 'Render'],
  github: 'https://github.com/zakiaminn/TheRepoExchange',
  live: 'https://therepo.exchange',
  liveLabel: 'therepo.exchange',
  demoVideo: '/TRX-demo.mp4',
  poster: '/posters/trx.jpg',
  demoSize: [1600, 898],
  demoDuration: 46.5,
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
      'A published npm package that turns any React component into a rigid-body physics simulation, with three ways to break it. This row is wrapped in it.',
    description:
      "A published npm package that turns any React component into a rigid-body physics simulation. It captures the live element to a bitmap with html-to-image (computed styles and all), cuts it into pieces, and hands each piece to matter-js as a body with real mass, friction, and restitution. Three engines decide how it breaks: glass cracks first and holds for 250ms before shattering along a Voronoi tessellation, grid blows apart into clean rectangles, and implode pulls every piece toward the center before it drops. A canvas loop paints the pieces and tears itself down once everything comes to rest, and reduced motion skips the physics entirely. Because sometimes centering a div deserves consequences.",
    tech: ['React', 'TypeScript', 'matter-js', 'd3-delaunay', 'html-to-image', 'Canvas', 'npm'],
    breakable: true,
    github: 'https://github.com/zakiaminn/DOMolition',
    npm: 'https://www.npmjs.com/package/domolition',
    demoVideo: '/DOMolition-demo.mp4',
    demoLoop: true,
    demoCaption: 'Glass, grid, then implode, recorded in the package’s demo app.',
    poster: '/posters/domolition.jpg',
    demoSize: [1280, 686],
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
