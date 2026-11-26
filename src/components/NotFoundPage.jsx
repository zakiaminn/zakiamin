import React, { useRef, useSyncExternalStore } from 'react';
import { profile } from '@/data/profile';
import { PAGE } from '@/lib/layout';
import { useFitWidth } from '@/lib/motion';
import { MaskLines, MastRules, Reveal } from '@/components/ui/motion';

// Where the front page's sections start. The résumé is in the masthead row
// and the Batin write-up has its own button, so they aren't repeated here.
const INSIDE = [
  { label: 'Selected work', href: '/#work' },
  { label: 'Experience and education', href: '/#experience' },
  { label: 'Toolkit', href: '/#toolkit' },
  { label: 'Contact', href: '/#contact' },
];

const noSubscribe = () => () => {};
const readPath = () => {
  try {
    return decodeURI(window.location.pathname);
  } catch {
    return window.location.pathname;
  }
};

/** The path the visitor asked for. The prerendered page can't know it, so it says "this address" until the script runs. */
function RequestedPath() {
  const path = useSyncExternalStore(noSubscribe, readPath, () => null);
  if (!path) return 'this address';
  // A long path wraps instead of widening the page; a short one moves to the next line whole.
  return <span className="font-medium text-ink break-words">{path}</span>;
}

/**
 * The page Cloudflare serves, with a 404 status, for any path that matches no
 * file. It is set like the front page: the masthead, then a correction where
 * the lead story would be, and an index of what is inside.
 */
export default function NotFoundPage() {
  const nameRef = useRef(null);
  useFitWidth(nameRef);

  return (
    <div className="relative min-h-screen flex flex-col bg-bg text-ink font-bricolage">
      <a href="#main" className="skip-link btn btn-solid">
        Skip to content
      </a>

      <header className={`${PAGE} pt-4 sm:pt-6`}>
        <div className="flex items-center justify-between gap-4 pb-3 text-[13px] sm:text-sm text-ink-3">
          <span>Toronto</span>
          <span>Open to a {profile.seeking}</span>
        </div>

        <MastRules inView={false} />

        <p data-fit-box className="py-3 sm:py-4">
          <a href="/" className="block overflow-hidden text-ink">
            <span
              ref={nameRef}
              className="nameplate inline-block whitespace-nowrap mask-rise"
              style={{ animationDuration: '1000ms', animationDelay: '300ms' }}
            >
              <span className="email-swipe">{profile.name}</span>
            </span>
          </a>
        </p>

        <MastRules inView={false} flip />

        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-3 text-sm">
          <span className="text-ink-2">
            Error <span className="num">404</span>, page not found
          </span>
          <a href="/#resume" className="btn btn-sm">
            Résumé
          </a>
        </div>
      </header>

      <main id="main" className={`${PAGE} flex-1`}>
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)] border-b-2 border-ink">
          <div className="pt-8 pb-10 lg:pt-10 lg:pr-12 lg:border-r lg:border-rule">
            <p className="label">Correction</p>
            <h1 className="mt-4 font-bold text-[clamp(2.6rem,5.4vw,4.75rem)] leading-[0.98] tracking-[-0.035em] text-ink">
              <MaskLines
                delay={0.55}
                lines={[
                  'This page',
                  <>
                    <span className="swipe swipe-in" style={{ animationDelay: '1150ms' }}>
                      doesn’t exist
                    </span>
                    .
                  </>,
                ]}
              />
            </h1>

            <Reveal inView={false} delay={0.85} className="mt-7 max-w-[34rem]">
              <p className="text-lg md:text-xl leading-relaxed text-ink-2 pretty">
                The link may be old, or a letter may have slipped. Nothing on this site lives at <RequestedPath />.
                Everything that does starts on the front page.
              </p>
            </Reveal>

            <Reveal inView={false} delay={0.95} className="mt-9 flex flex-wrap items-center gap-3">
              <a href="/" className="btn btn-primary btn-lg">
                Go to the front page
              </a>
              <a href="/batin/" className="btn btn-lg">
                Read the Batin write-up
              </a>
            </Reveal>
          </div>

          <Reveal inView={false} delay={1.05} className="pt-2 pb-10 lg:pt-10 lg:pl-10">
            <nav aria-labelledby="inside-heading">
              <h2 id="inside-heading" className="label text-ink pb-1.5 border-b border-rule">
                Inside
              </h2>
              <ul>
                {INSIDE.map((item) => (
                  <li key={item.href} className="border-b border-rule">
                    <a href={item.href} className="group flex min-h-[48px] items-center text-ink">
                      <span className="sig font-medium">{item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </Reveal>
        </div>
      </main>

      <footer className={`${PAGE} py-6 flex flex-col sm:flex-row justify-between gap-2 text-sm text-ink-3`}>
        <span>
          © <span className="num" suppressHydrationWarning>{new Date().getFullYear()}</span> {profile.name}, Toronto
        </span>
        <span>Set in Bricolage Grotesque and Spline Sans Mono</span>
      </footer>
    </div>
  );
}
