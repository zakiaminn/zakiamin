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
  status: 'Pre-launch, private repo',
  comingSoon: true,
  description:
    "Batin reads options order flow and scores who is on the other side of it. Every print is signed by where it traded against the bid/ask spread, weighted by a delta the pipeline back-solves itself, and sorted into an institutional or a retail cohort. The Trap Score, 0 to 100, measures how sharply the two pull against each other. It runs nightly on a 1 GB cloud server across 501 listings and over 20 million option trades, and five point-in-time backtests say the signal isn't predictive yet. The product says so out loud.",
  longform: [
    "Batin asks one question of the options tape: who is on the other side? Every print lands in an institutional cohort (premium of $500k or more) or a retail one (10 contracts or fewer), and each trade is signed by where it printed against the bid/ask spread instead of assuming a call buy is bullish. A trade at the ask counts as buying, at the bid as selling, and anything inside the spread is scaled by how close it printed to the ask. The opposition between the two cohorts becomes two numbers: the Batin Index, a divergence score bounded at ±100, and the Trap Score, 0 to 100 for how sharply they oppose. On most days most of the board is quiet, which is the point.",
    "The data arrives the unglamorous way. A nightly ETL runs on weekday evenings after the close, pulls the session's OPRA prints through ThetaData and the day's stock prices through yfinance, and writes roughly 130,000 option trades a day into TimescaleDB hypertables. ThetaData's tier gives option prices but no greeks, so the ETL back-solves implied volatility with a vectorized Newton-Raphson over the whole DataFrame, then plugs it into Black-Scholes for a delta on every trade. Delta is what separates a deep in-the-money call, which is basically stock, from a lottery ticket.",
    "All of the scoring math lives in one module that the API, the board and the backtests import, pinned by 87 unit tests. An audit of that math turned up four real problems: three copies of the formulas that could drift apart, cohorts that could overlap, a denominator that counted flow from neither cohort, and an opposition switch that flipped on and off instead of scaling. Each fix went in with tests. So did a later one: rows without a delta were summed in raw premium dollars next to delta-notional dollars about ten times larger, so the pipeline now bridges them onto one scale with the median elasticity it can measure.",
    "Then the part most signal projects skip: checking whether it works. I rebuilt the score point-in-time, day by day with no look-ahead, and checked where each stock went next after stripping out the market's own move. Five runs over about eight months of history agree. The five-day hit rate is 53.6%, with a confidence interval that still straddles a coin flip, and higher Trap Scores did worse, not better. Two fixes to the math were re-tested the same way and neither moved it. So the product says it on its own landing page, and a paper-trading harness keeps testing it.",
    "It runs on an Oracle Cloud free-tier VM with 1 GB of RAM: TimescaleDB and the FastAPI engine under Docker Compose, with nothing open to the internet except SSH, and a cron job for the nightly load. Moving it off my laptop meant verifying the database row for row and porting the data SDK to a build that runs on x86. The board used to take about 26 seconds to score on every request. It's now built once after each nightly load and served from a cache in well under a second.",
    "The landing page doubles as a working demo on the real board, which raised a licensing problem: raw OPRA prints can't be redistributed. So the browser only talks to a small proxy that passes derived signals and nothing else, caches each read for ten minutes, shares requests that are already in flight, and lets at most two reads reach the engine at once. SPY takes the 1 GB server over 30 seconds to score on demand, and a visitor shouldn't be able to take it down by clicking it twice.",
  ],
  highlights: [
    {
      skill: 'Market microstructure',
      title: 'Trades classified by where they print',
      proof: 'At the ask counts as buying, at the bid as selling, and inside the spread scales by how close it printed to the ask. A call/put guess only steps in when there’s no usable quote.',
    },
    {
      skill: 'Quant modeling',
      title: 'A delta for every trade, without paying for greeks',
      proof: 'The ETL back-solves implied volatility with a vectorized Newton-Raphson over the whole DataFrame, then runs Black-Scholes, so every print gets a delta from its price alone.',
    },
    {
      skill: 'Signal design',
      title: 'Divergence, not volume',
      proof: 'Disjoint institutional and retail cohorts feed two scores: a Batin Index bounded at ±100 and a Trap Score for how sharply the cohorts oppose. One math module, 87 unit tests.',
    },
    {
      skill: 'Validation',
      title: 'A backtest that told me no',
      proof: 'Five point-in-time runs agree: a 53.6% five-day hit rate once the market’s move is stripped out, a coin flip, and higher Trap Scores did worse. The landing page says so.',
    },
    {
      skill: 'Infrastructure',
      title: 'Twenty million trades on a 1 GB box',
      proof: 'TimescaleDB and FastAPI under Docker Compose on a free-tier VM, only SSH exposed, a nightly cron load, and a board that went from 26 seconds a request to a cache hit.',
    },
    {
      skill: 'Data licensing',
      title: 'Raw vendor data never leaves the engine',
      proof: 'The public demo reads through a proxy that whitelists derived signals, caches for ten minutes, coalesces requests and caps engine load, so visitors can’t tip over the server.',
    },
  ],
  pipeline: [
    { stage: 'Ingest', nodes: ['ThetaData (OPRA)', 'yfinance'], note: 'Nightly ETL after the close' },
    { stage: 'Store', nodes: ['TimescaleDB'], note: 'Over 20 million option trades' },
    { stage: 'Score', nodes: ['FastAPI engine'], note: 'One shared math module, 87 tests' },
    { stage: 'Show', nodes: ['Next.js terminal', 'Landing demo'], note: 'Derived signals only' },
  ],
  tech: ['Python', 'FastAPI', 'TimescaleDB', 'PostgreSQL', 'pandas / NumPy / SciPy', 'Next.js', 'Docker', 'Oracle Cloud'],
  demoVideo: '/Batin-demo.mp4',
  poster: '/posters/batin.jpg',
  demoSize: [1600, 900],
  demoDuration: 41.3,
  demoCaption: 'Recorded on the real engine, with the board as of the Sep 25, 2026 close. No sample data.',
  pullQuote: 'Five backtests agree the Trap Score is a coin flip, so the landing page says so.',
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
