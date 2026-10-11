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
  highlights: [
    {
      skill: 'Transactions',
      title: 'Orders that can’t double-spend',
      proof: 'The server re-prices every order, rejects it if the price moved more than 1%, and fills it in one transaction that locks the account row first. Deadlocks retry on their own.',
    },
    {
      skill: 'Concurrency',
      title: 'Settlement that can’t pay out twice',
      proof: 'Expired calls are claimed with SKIP LOCKED, so overlapping jobs split the work, and each one settles inside its own savepoint so a bad row can’t stall the rest.',
    },
    {
      skill: 'Testing',
      title: 'One pricing formula in three languages, kept in sync',
      proof: 'The Node, Python and TypeScript copies run one shared fixture suite, which caught two real mismatches: recency in whole vs fractional days, and half-cent rounding.',
    },
    {
      skill: 'Security',
      title: 'The browser never touches the database',
      proof: 'Every read and write goes through the ledger, which verifies the Supabase token. Row-level security backs it up, and Turnstile guards sign-up, sign-in and reset.',
    },
    {
      skill: 'Performance',
      title: 'Flat database load, however many clients poll',
      proof: 'A five-second cache with request coalescing holds Postgres to one listings query per tick, no matter how many tabs are open.',
    },
    {
      skill: 'Data pipeline',
      title: 'A GitHub ingester that survives rate limits',
      proof: 'Hourly on GitHub Actions, with backoff that honors Retry-After, one request per repo even at 5,000 open PRs, and per-listing commits so a cut-off run keeps its work.',
    },
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
  tagline: 'Options flow, split by who is behind it',
  status: 'Research build, private repo',
  comingSoon: false,
  description:
    "An options order-flow engine built around one question: does big money trading against the crowd say where a stock goes next? A nightly Python ETL, TimescaleDB and FastAPI run on one free ARM server, behind a Next.js terminal. Then I tested the signal: point-in-time backtests, then billions of option trades under rules committed in advance, with a held-out year scored once. Ten analyses found no usable edge, and I said so. An eleventh, a separate, narrow pre-earnings rule on fresh data, passed its locked test thinly: right 50.6% of the time, about even odds it is real. I track it live, with no money traded. Batin carries no predictive claim.",
  longform: [
    "Batin started as a product idea: read the options market, work out when big money is on the other side of the crowd, and score it. Two numbers came out: a Batin Index for the divergence, bounded at ±100, and a Trap Score from 0 to 100 for how sharply the two sides oppose. I positioned it as a tool firms could license, and never sold it. Before anyone paid for it, I wanted to know whether the score says anything about what a stock does next. Ten analyses (five end-of-day backtests, two locked trade-level tests, three wider explorations) found no usable edge. An eleventh, a separate, narrow pre-earnings rule, passed its locked test thinly (right 50.6% of the time, about even odds it is real) and is tracked live.",
    "The system came first. Every weekday evening, after the data vendor ThetaData's 17:15 ET report, a Python ETL loads 125,000 to 140,000 contract rows into TimescaleDB, over 25 million so far. The database and a FastAPI engine run under Docker Compose on an Oracle ARM VM that costs $0 a month. The vendor's SDK ships no ARM wheel, so the Docker build compiles it from its Rust source. All the scoring lives in one math module with 87 unit tests, after an audit found three copies of the formulas that could drift apart. A cache built after each nightly load took the screener from about 26 seconds a request to well under one.",
    "Then I tested it the way I'd want anyone's signal tested. In August 2026 I rebuilt the score point-in-time, with no look-ahead, and measured where each stock went next, net of the market's own move. Five backtests on end-of-day data agreed, and re-testing after two fixes to the math moved nothing. On 12 mega-caps the five-day hit rate was 53.6%, with a confidence interval of 49.6% to 57.5%: a coin flip. Higher Trap Scores did worse, not better. A wider run across 519 tickers, with its rules written down first, put the hit rate for Trap Scores of 60 and up at 43.6% (29.3% to 59.0%). It did not validate.",
    "End-of-day data folds a whole day of trading into one row per contract, so a big total could be one order or many small ones. In October 2026 I moved to ThetaData's trade-level tier ($80 a month): every US option trade, with the quote just before it. A pilot of 118.4 million trades checked the feed first: volume matched the end-of-day totals (median ratio 1.000). Then I pre-registered the test, committing its rules before computing a single later return: 100 tickers set by option volume in a week before the test period, a development year, and a held-out year that alone decides pass or fail. Split orders are glued back together, big means the top 0.1% of orders for that stock, and multi-leg spread trades are dropped.",
    "Locked rules can only change through dated amendments, and the one that mattered came from a smoke test. Delta (how far an option moves with the stock) was meant to come from each day's 17:15 report. But for contracts expiring that day (53% of SPY's trades) that delta is just the outcome: about 1 if they finished in the money, 0 if not. That leaks the day's result into the test: using it would have dropped 22% of SPY's trades, the losing ones. Delta now comes from the previous trading day. Then the backfill: about 2.55 billion trades in 18.6 hours, four API requests at a time, resumable with atomic writes, pausing itself while the nightly ETL ran. Its only two failed ticker-days were symbol-change days, fixed in another amendment.",
    "The development year was the rehearsal, and it showed big money getting more wrong as the Trap Score rose. That suggested a second idea: bet against big money (fade it) at the biggest standoffs. I pre-registered it before the held-out year was scored, with a stricter interval for running two tests (Bonferroni), and disclosed where the idea came from. Then the held-out year was scored once, on October 8, 2026. Following big money was right 49.4% of the time (47.9% to 50.8%) over 11,389 events. Fading it was right 51.1% (47.5% to 54.3%) over 2,565. Both intervals include 50%. Both fail. A coin flip both ways, on a year the rules had never seen.",
    "Then a wider question: does this data predict anything? I re-pulled both years at the order level, about 2.57 billion trades rebuilt into orders, and explored the development year only. The strongest idea in the literature is flow pressure, heavy buying minus heavy selling (Muravyev, Journal of Finance, 2016). The option's next-day return, hedged against the stock's move, was +5.5 basis points (0.055%, t = 0.69): no different from zero, against a median bid-ask spread of 2.6% to 3.4%. A test of demand for volatility pointed the wrong way. Across 1.69 million single-leg orders of $100,000 or more, bullish-leaning days beat bearish ones by 4 basis points over five days (−15 to +26). I sliced that about 25 ways. Nearly every interval included zero, about what chance gives.",
    "One exception, how big orders lean before earnings, had an economic story, so it got its own locked test. The held-out year was already scored and could not be reused, so I pulled two fresh years, 2022 to 2024: about 1.68 billion more trades, about 4.25 billion in all. I stress-tested the rules, then locked five pass/fail gates in a commit. Before scoring, I checked earnings dates against the companies' own releases (yfinance had Costco off by a week) and corrected six in a dated amendment. The development year's own numbers would fail the gates. Scored once, on October 10, 2026, the rule passed all five. Before earnings, bullish-leaning days beat bearish ones by 56 basis points over five days, net of the market (95% interval: 5 to 108).",
    "A thin pass: that interval clears zero by 5 basis points. The rule was right 50.6% of the time, so the gap comes from the size of the moves, not from being right more often. One stock, Carvana, supplies about a quarter of it. It is not a trading system, and Batin still carries no predictive claim. After a hard review I put the odds it is real at 40 to 50%, so I track it live, with no money traded. Every trading evening, before the next open, each stock's lean goes into an append-only ledger. Entries are hash-chained and time-stamped by three independent timestamp authorities, so any change or back-dating would show. The gap is read only at quarterly checkpoints, against stop and confirm rules fixed in advance.",
  ],
  highlights: [
    {
      skill: 'Data engineering',
      title: '4.25 billion option trades on a free server',
      proof: 'Four years of trade-level data, 103,200 ticker-days with zero failures, pulled four API requests at a time with resumable, atomic writes on an ARM VM with 2 cores and 12 GB of RAM.',
    },
    {
      skill: 'Market microstructure',
      title: 'Orders rebuilt from raw exchange trades',
      proof: 'Trades are marked buys or sells from the quote just before them, and trades on the same contract and side within 10 ms are glued into one order. Rebuilt volume matched official end-of-day totals.',
    },
    {
      skill: 'Statistics',
      title: 'A pre-registered test that said no',
      proof: 'Two tests had their rules committed before the held-out year was scored, and it was scored once. Following big money was right 49.4% of the time (47.9% to 50.8%) over 11,389 events. Both failed.',
    },
    {
      skill: 'Research integrity',
      title: 'A look-ahead leak caught before it counted',
      proof: 'Same-day data would have given contracts expiring that day, 53% of SPY’s trades, a delta that is just the day’s outcome. A smoke test caught it, and the fix went in as a dated amendment.',
    },
    {
      skill: 'Data integrity',
      title: 'A thin pass, tracked live in a tamper-evident ledger',
      proof: 'One narrow rule passed its locked test thinly: right 50.6% of the time, about even odds it is real. Every trading evening, readings are logged before the next open, hash-chained and time-stamped by three independent timestamp authorities.',
    },
  ],
  pipeline: [
    { stage: 'Ingest', nodes: ['ThetaData', 'yfinance'], note: 'Nightly ETL after the 17:15 ET report, plus resumable trade-level pulls' },
    { stage: 'Store', nodes: ['TimescaleDB', 'Parquet'], note: 'Over 25 million nightly rows in hypertables, 262 million rebuilt orders in Parquet' },
    { stage: 'Score', nodes: ['FastAPI engine'], note: 'One shared math module, 87 unit tests' },
    { stage: 'Show', nodes: ['Next.js terminal', 'Landing demo'], note: 'The landing demo gets derived signals only, through a cached proxy' },
    { stage: 'Test', nodes: ['Point-in-time backtests', 'Locked held-out tests', 'Live ledger'], note: 'Ten analyses, no usable edge. One narrow rule passed a locked test thinly (right 50.6% of the time, about even odds) and is tracked live, no money traded' },
  ],
  pipelineNote: 'One ARM server at $0 a month runs the database and the engine, and ran the multi-billion-trade pulls. Only derived signals ever reach the landing demo, because raw vendor data can’t be redistributed.',
  tech: ['Python', 'pandas / NumPy', 'FastAPI', 'TimescaleDB', 'PostgreSQL', 'Parquet', 'Next.js', 'Docker Compose', 'Linux', 'Oracle Cloud (ARM)'],
  demoVideo: '/Batin-demo.mp4',
  poster: '/posters/batin.jpg',
  demoSize: [1600, 900],
  demoDuration: 41.3,
  demoCaption: 'Recorded on the real engine, with the board as of the Sep 25, 2026 close. No sample data.',
  pullQuote: 'Ten analyses said no. The eleventh cleared its bar by 5 basis points, so I call it about even odds and keep a ledger.',
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
    highlights: [
      {
        skill: 'Open source',
        title: 'Published on npm, with a typed React API',
        proof: 'One wrapper component, three engines, an imperative ref to trigger and reset, and reduced-motion support built in.',
      },
      {
        skill: 'Computational geometry',
        title: 'Glass that fractures along a Voronoi diagram',
        proof: 'Shards come from a jittered Voronoi tessellation (d3-delaunay), and the UI cracks and holds for 250ms before it breaks.',
      },
      {
        skill: 'Rendering',
        title: 'Physics painted from a live DOM capture',
        proof: 'The component is rasterized with its computed styles, then every matter-js body is drawn through a canvas clipping mask until the simulation sleeps.',
      },
    ],
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
    title: 'Wallbreak',
    tagline: 'Tower defense where walling in the base doesn’t save you',
    summary:
      'A tower-defense game in Java and libGDX. Enemies route through your maze with A*, and if you wall the base in, they find the cheapest wall and break through it.',
    description:
      "A wave-based tower-defense game in Java and libGDX, where libGDX only draws the frames and the pathfinding, targeting, waves and game loop are hand-written. Enemies path with A* across a 20x12 grid and re-plan every time a wall breaks. Wall the base in completely and they switch to a breach search, where walls are passable but cost 50 each, so they pick the cheapest one and hit it until it falls. The pathfinder is tested against a brute-force BFS and a Dijkstra search on 500 random grids each, which caught a real bug: changing a node's cost while it sat inside Java's PriorityQueue broke the heap order and gave breach paths that weren't the cheapest.",
    highlights: [
      {
        skill: 'Algorithms',
        title: 'A* with a breach mode',
        proof: 'With no open route, walls become passable at +50 each, so enemies break through as few as possible, and every enemy re-plans the moment one falls.',
      },
      {
        skill: 'Testing',
        title: 'Pathfinding checked against brute force',
        proof: '36 JUnit tests, including A* against BFS and breach mode against Dijkstra on 500 random grids each. They caught a heap-ordering bug in the priority queue.',
      },
      {
        skill: 'Architecture',
        title: 'Game logic written from scratch',
        proof: 'libGDX only draws the frames. Pathfinding, targeting, wave scaling, the PREP/DEFEND state machine and the auto-tiled walls are hand-written Java.',
      },
    ],
    tech: ['Java', 'libGDX', 'A* Pathfinding', 'JUnit', 'OOP'],
    github: 'https://github.com/zakiaminn/Wallbreak',
    demoVideo: '/Wallbreak-demo.mp4',
    demoLoop: true,
    demoCaption: 'A maze, a full wall around the base, then a brute breaks through the top. Rendered frame by frame from the game.',
    poster: '/posters/wallbreak.jpg',
    demoSize: [1280, 824],
  },
  {
    title: 'FrankenSorter',
    tagline: 'A local AI that cleans up after you',
    summary:
      'A desktop app that files your documents with an on-device LLM. A regex router handles the obvious cases, so the model only runs on the ambiguous ones.',
    description:
      "A privacy-first desktop app that reads your files and sorts them for you, running entirely on-device with no cloud and no API key. The core is a two-tier router: deterministic Regex catches known patterns like course codes and routes them instantly, so a local Qwen2.5 7B model is only ever called for the genuinely ambiguous files, which keeps it fast and free. A multi-format ETL layer pulls text from PDF, Word, PowerPoint, and Excel with defensive parsing for malformed documents, and the model runs under a JSON schema with its category constrained to an enum at temperature zero, so routing is deterministic and it physically cannot invent a folder that doesn't exist. Inference and heavy I/O run off the main thread, so the interface stays responsive while it works.",
    highlights: [
      {
        skill: 'Applied LLMs',
        title: 'A model that can’t invent a folder',
        proof: 'It answers under a JSON schema with the category constrained to an enum at temperature zero, so routing is deterministic.',
      },
      {
        skill: 'Systems design',
        title: 'The model only runs when a regex can’t decide',
        proof: 'A deterministic tier routes known patterns like course codes instantly, keeping the local Qwen2.5 7B model for the genuinely ambiguous files.',
      },
      {
        skill: 'Data engineering',
        title: 'Text out of PDF, Word, PowerPoint and Excel',
        proof: 'A multi-format ETL layer with defensive parsing for malformed documents, running off the main thread so the interface stays responsive.',
      },
    ],
    tech: ['Python', 'Ollama / Qwen2.5 7B', 'CustomTkinter', 'Regex + ETL', 'JSON Schema'],
    github: 'https://github.com/zakiaminn/FrankenSorter',
    live: 'https://zakiaminn.github.io/FrankenSorter/',
    demoVideo: '/FrankenSorter-demo.mp4',
    poster: '/posters/frankensorter.jpg',
    demoSize: [2030, 1190],
  },
];
