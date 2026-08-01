export const featuredProject = {
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
