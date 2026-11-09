import React from 'react';
import { batinWriteup } from '@/data/batinWriteup';
import * as batinFigures from '@/components/writeup/BatinFigures';
import { Mark } from '@/components/Nav';

const HASHES_URL = 'https://github.com/zakiaminn/batin-ledger-hashes';

// Turns a heading into an anchor id, e.g. "5. Results" -> "5-results".
const slug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// About 230 words a minute, rounded to the nearest five minutes.
const words = batinWriteup.blocks
  .flatMap((b) => (b.runs ? [b.runs] : b.items ? b.items : []))
  .flat()
  .reduce((n, r) => n + r.s.split(/\s+/).filter(Boolean).length, 0);
const minutes = Math.max(5, Math.round(words / 230 / 5) * 5);

function Runs({ runs }) {
  return runs.map((r, i) => {
    let node = r.s;
    if (r.i) node = <em>{node}</em>;
    if (r.b) node = <strong className="font-semibold text-ink">{node}</strong>;
    if (r.href) {
      node = (
        <a href={r.href} className="link" target="_blank" rel="noreferrer">
          {node}
        </a>
      );
    }
    return <React.Fragment key={i}>{node}</React.Fragment>;
  });
}

function Figure({ n, caption }) {
  const Drawing = batinFigures[`Fig${n}`];
  return (
    <figure className="mt-10 mb-2 -mx-6 sm:mx-0">
      {/* On a phone the drawing keeps a readable width and scrolls sideways inside its own box. */}
      <div className="overflow-x-auto px-6 sm:px-0">
        <div className="writeup-figure min-w-[640px] sm:min-w-0 border-y border-rule py-4">
          <Drawing />
        </div>
      </div>
      <figcaption className="px-6 sm:px-0 mt-3 text-sm text-ink-2 leading-relaxed pretty">
        <span className="font-semibold text-ink">Figure {n}.</span> {caption}
      </figcaption>
    </figure>
  );
}

function Table({ rows, head }) {
  const [first, ...rest] = rows;
  const body = head ? rest : rows;
  return (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full min-w-[560px] text-sm border-collapse">
        {head && (
          <thead>
            <tr className="border-b border-rule-2">
              {first.map((cell, i) => (
                <th key={i} scope="col" className="label text-left font-semibold py-2.5 pr-4 align-bottom">
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {body.map((row, r) => (
            <tr key={r} className="border-b border-rule">
              {row.map((cell, c) => (
                <td key={c} className={`py-2.5 pr-4 align-top ${c === 0 ? 'text-ink' : 'text-ink-2'}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Block({ block }) {
  switch (block.t) {
    case 'h2':
      return (
        <h2
          id={slug(block.text)}
          className="mt-16 mb-4 text-2xl md:text-3xl font-bold leading-tight tracking-[-0.02em] text-ink balance"
        >
          {block.text}
        </h2>
      );
    case 'h3':
      return <h3 className="mt-10 mb-2 text-lg font-semibold tracking-[-0.01em] text-ink">{block.text}</h3>;
    case 'p':
      return (
        <p className="mt-4 text-ink-2 leading-relaxed pretty">
          <Runs runs={block.runs} />
        </p>
      );
    case 'ul':
    case 'ol': {
      const List = block.t;
      return (
        <List
          className={`mt-4 space-y-2 pl-5 text-ink-2 leading-relaxed marker:text-ink-3 ${
            block.t === 'ol' ? 'list-decimal' : 'list-disc'
          }`}
        >
          {block.items.map((runs, i) => (
            <li key={i} className="pl-1 pretty">
              <Runs runs={runs} />
            </li>
          ))}
        </List>
      );
    }
    case 'table':
      return <Table rows={block.rows} head={block.head} />;
    case 'figure':
      return <Figure n={block.n} caption={block.caption} />;
    default:
      return null;
  }
}

export default function WriteUpPage() {
  const contents = batinWriteup.blocks.filter((b) => b.t === 'h2');

  return (
    <div className="relative min-h-screen bg-bg text-ink font-bricolage">
      <a href="#main" className="skip-link btn btn-solid">
        Skip to content
      </a>
      <header className="sticky top-0 z-40 w-full border-b border-rule bg-[color-mix(in_srgb,var(--bg)_90%,transparent)] backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5 text-ink py-2">
            <Mark />
            <span className="text-base font-semibold tracking-[-0.01em] whitespace-nowrap">Zaki Amin Ahmad</span>
          </a>
          <a href="/#work" className="sig text-sm font-medium text-ink py-2">
            All work
          </a>
        </div>
      </header>

      <main id="main" className="max-w-[44rem] mx-auto px-6 pt-14 md:pt-20 pb-20">
        <article>
          <header>
            <p className="label">Research write-up · Batin</p>
            <h1 className="mt-4 text-4xl md:text-5xl font-bold leading-[1.04] tracking-[-0.035em] text-ink balance">
              {batinWriteup.title}
            </h1>
            <p className="mt-5 text-ink-2">
              Zaki Amin Ahmad · <time dateTime="2026-11-08">8 November 2026</time> · about {minutes} minutes to read
            </p>
          </header>

          <nav aria-label="Contents" className="mt-10 border-y border-rule py-5">
            <p className="label">Contents</p>
            <ol className="mt-3 sm:columns-2 gap-x-8 text-sm">
              {contents.map((h) => (
                <li key={h.text} className="mb-1.5 break-inside-avoid">
                  <a href={`#${slug(h.text)}`} className="sig text-ink-2">
                    {h.text}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {batinWriteup.blocks.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </article>

        <footer className="mt-16 border-t border-rule pt-6 text-sm text-ink-2 leading-relaxed pretty">
          <p>
            Batin is closed until October 2028, when the locked test of the pre-earnings rule is read once. Its lock
            hashes are public in{' '}
            <a href={HASHES_URL} className="link" target="_blank" rel="noreferrer">
              batin-ledger-hashes
            </a>
            . No money is traded, and nothing here is trading advice.
          </p>
          <p className="mt-4">
            <a href="/#work" className="sig font-medium text-ink">
              Back to the portfolio
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}
