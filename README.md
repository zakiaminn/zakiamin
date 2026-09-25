# Zaki Amin

Portfolio of Zaki Amin, a data analyst and full-stack engineer in Toronto, seeking a Summer 2027 co-op.

**Live:** [zaki-nu.vercel.app](https://zaki-nu.vercel.app)

It covers:

- **[The Repo Exchange](https://therepo.exchange):** a simulated stock market for GitHub repos. One pricing formula tested in three languages, server-side slippage checks, and row-locked fills.
- **Batin:** an options order-flow analytics engine on TimescaleDB, currently pre-launch.
- **[DOMolition](https://www.npmjs.com/package/domolition):** a published npm package that turns React components into rigid-body physics. The DOMolition row on the site is wrapped in it, so you can break it.
- **[AegisGrid](https://github.com/zakiaminn/AegisGrid)** and **[FrankenSorter](https://github.com/zakiaminn/FrankenSorter)**.
- Experience, toolkit, and an in-page résumé at [`/#resume`](https://zaki-nu.vercel.app/#resume).

## Stack

React 19 and Vite, Tailwind CSS, and Radix primitives for the dialogs and tabs. The page is prerendered to static HTML at build time and hydrated in the browser, so crawlers and link previews get the full content. Analytics (PostHog) load once the page is idle.

Type is Bricolage Grotesque for words and Spline Sans Mono for numbers, on one chartreuse accent.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # client build, server render, then prerender into dist/index.html
npm run preview    # serve the production build
```

`VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST` in `.env` turn on analytics. Without them the site runs the same and sends no events.

## Layout

```
src/
  components/   page sections, the halftone portrait, case-study dialogs
  components/ui dialog and tabs built on Radix
  data/         profile and project copy, the single source for page and résumé
  entry-server.jsx  build-time render used by scripts/prerender.mjs
public/         demo videos, poster frames, share card, icons, sitemap
```
