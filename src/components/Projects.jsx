import React, { useCallback, useEffect, useRef, useState } from 'react';
import { m as Motion, useMotionTemplate, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import CaseStudy from '@/components/CaseStudy';
import { Highlights } from '@/components/ProjectBits';
import { PAGE } from '@/components/Nav';
import { CursorPreview, MaskLines, Rule } from '@/components/ui/motion';
import { builds, featured } from '@/data/skim';
import { useFinePointer, usePrefersReducedMotion } from '@/lib/motion';
import posthog from '@/lib/posthog';

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = String(Math.round(seconds % 60)).padStart(2, '0');
  return `${m}:${s}`;
}

// `frame` wraps the video alone, so a reveal can mask the picture and leave its controls readable.
function DemoVideo({ project, frame = (video) => video }) {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();
  const [playing, setPlaying] = useState(false);
  const [held, setHeld] = useState(false); // the reader paused it; stop autoplaying
  const saveData = typeof navigator !== 'undefined' && navigator.connection?.saveData;
  const autoplay = !reduced && !saveData && !held;
  const [w, h] = project.demoSize;

  useEffect(() => {
    const video = ref.current;
    if (!video || !autoplay || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.4 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [autoplay]);

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) {
      setHeld(false);
      video.play().catch(() => {});
      posthog.capture('demo_video_played', { project_title: project.title });
    } else {
      setHeld(true);
      video.pause();
    }
  };

  return (
    <figure>
      {frame(
        <video
          ref={ref}
          src={project.demoVideo}
          poster={project.poster}
          width={w}
          height={h}
          muted
          loop
          playsInline
          preload="none"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          aria-label={`Screen recording of ${project.title}`}
          className="block w-full h-auto border border-rule bg-surface"
          style={{ aspectRatio: `${w} / ${h}` }}
        />
      )}
      <figcaption className="mt-3 flex items-center gap-3 text-sm text-ink-3">
        <button type="button" onClick={toggle} className="btn btn-sm btn-icon" aria-pressed={!playing}>
          <span className="sr-only">{playing ? 'Pause the recording' : 'Play the recording'}</span>
          <svg viewBox="0 0 12 12" className="w-2.5 h-2.5" fill="currentColor" aria-hidden="true">
            {playing ? (
              <>
                <rect x="2.5" y="1.5" width="2.5" height="9" rx="0.6" />
                <rect x="7" y="1.5" width="2.5" height="9" rx="0.6" />
              </>
            ) : (
              <path d="M3 1.8v8.4a.5.5 0 0 0 .76.43l6.9-4.2a.5.5 0 0 0 0-.86l-6.9-4.2A.5.5 0 0 0 3 1.8z" />
            )}
          </svg>
        </button>
        <span>
          Screen recording, muted · <span className="num text-ink-2">{formatDuration(project.demoDuration)}</span>
        </span>
      </figcaption>
    </figure>
  );
}


function Breakable({ children }) {
  const [phase, setPhase] = useState('idle'); // idle | loading | broken
  const [armed, setArmed] = useState(false); // the package's isShattered
  const [gone, setGone] = useState(false); // the row has been captured and hidden
  const [debris, setDebris] = useState('shown');
  const [restored, setRestored] = useState(false);
  const hostRef = useRef(null);
  const moduleRef = useRef(null);
  const gridRef = useRef({ rows: 6, cols: 16 });

  const breakIt = useCallback(async () => {
    if (phase !== 'idle') return;
    setPhase('loading');
    posthog.capture('domolition_triggered');
    try {
      moduleRef.current ??= await import('domolition');
      // Aim for roughly 64px square pieces, whatever shape the row is.
      const rect = hostRef.current?.getBoundingClientRect();
      const piece = 64;
      const clamp = (n) => Math.min(24, Math.max(4, Math.round(n)));
      gridRef.current = rect
        ? { rows: clamp(rect.height / piece), cols: clamp(rect.width / piece) }
        : { rows: 6, cols: 16 };
      setDebris('shown');
      setGone(false);
      setPhase('broken');
    } catch {
      setPhase('idle');
    }
  }, [phase]);

  // Mount the wrapper first, then flip its declarative isShattered prop, so
  // the package's own mount effects can't reset the trigger.
  useEffect(() => {
    if (phase === 'broken') setArmed(true);
  }, [phase]);

  // The package hides the row (opacity 0) once its bitmap is captured. Only
  // then does "Put it back" appear, so it never sits over an intact row.
  useEffect(() => {
    const host = hostRef.current;
    if (phase !== 'broken' || !host) return;
    const check = () => {
      const hidden = [...host.querySelectorAll('div')].some((d) => d.style.opacity === '0');
      if (hidden) setGone(true);
    };
    const observer = new MutationObserver(check);
    observer.observe(host, { subtree: true, attributes: true, attributeFilter: ['style'] });
    return () => observer.disconnect();
  }, [phase]);

  // The rubble clears itself once you scroll on.
  useEffect(() => {
    if (phase !== 'broken') return;
    const startY = window.scrollY;
    const onScroll = () => {
      if (Math.abs(window.scrollY - startY) > 160) setDebris('hidden');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [phase]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || (!gone && !restored)) return;
    const active = document.activeElement;
    if (active !== document.body && !host.contains(active)) return;
    host.querySelector(gone ? '[data-restore]' : '[data-break]')?.focus({ preventScroll: true });
  }, [gone, restored]);

  const putBack = () => {
    setDebris('hidden');
    window.setTimeout(() => {
      setArmed(false);
      setGone(false);
      setPhase('idle');
      setRestored(true);
    }, 240);
  };

  // Stable, so the package never restarts its simulation on a re-render.
  const onComplete = useCallback(() => {}, []);

  const content = children({ breakIt, busy: phase !== 'idle' });
  const Wrapper = moduleRef.current?.RageQuitWrapper;

  return (
    <div ref={hostRef} className="debris-host relative" data-debris={debris}>
      {phase === 'broken' && Wrapper ? (
        <div className="[&>div]:!block [&>div]:!w-full">
          <Wrapper
            effect="grid"
            isShattered={armed}
            rows={gridRef.current.rows}
            cols={gridRef.current.cols}
            onShatterComplete={onComplete}
          >
            {content}
          </Wrapper>
        </div>
      ) : (
        <div className={restored ? 'rise' : undefined}>{content}</div>
      )}

      {gone && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <button
            type="button"
            onClick={putBack}
            data-restore
            className="btn btn-primary pointer-events-auto rise"
            style={{ animationDelay: '400ms' }}
          >
            Put it back
          </button>
        </div>
      )}
    </div>
  );
}


function liveLink(project) {
  if (project.live) return { href: project.live, label: `Visit ${project.liveLabel}`, external: true, kind: 'live' };
  if (project.writeup) return { href: project.writeup, label: 'Read the write-up', external: false, kind: 'writeup' };
  return null;
}

/** The front page's three columns: each project's teaser, with a jump to its spread below. */
function FrontColumns() {
  return (
    <div className={PAGE}>
      <div className="flex items-baseline justify-between gap-4 pt-5 pb-4 border-b border-rule">
        <h2 id="work-heading" className="label">Selected work</h2>
        <p className="text-sm text-ink-3 hidden sm:block">Each story continues below</p>
      </div>
      <div className="grid md:grid-cols-3">
        {featured.map((p, i) => (
          <article
            key={p.slug}
            className={`relative py-8 ${i > 0 ? 'md:pl-8 border-t md:border-t-0 border-rule' : ''} ${i < 2 ? 'md:pr-8' : ''}`}
          >
            {i > 0 && <Rule axis="y" className="hidden md:block absolute left-0 top-8 bottom-8 w-px" delay={0.15 * i} />}
            <a
              href={`#${p.slug}`}
              onClick={() => posthog.capture('project_teaser_clicked', { project_title: p.title })}
              className="group block"
            >
              <img
                src={p.poster}
                alt=""
                width={p.demoSize[0]}
                height={p.demoSize[1]}
                loading="lazy"
                decoding="async"
                className="w-full aspect-[16/10] object-cover object-top border border-rule bg-surface"
              />
              <h3 className="mt-5 text-[1.75rem] leading-[1.05] font-bold tracking-[-0.03em] text-ink">
                <span className="sig">{p.title}</span>
              </h3>
              <p className="mt-1.5 text-ink-2">{p.tagline}</p>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-2 pretty">{p.summary}</p>
              <p className="mt-5 text-sm text-ink-3">
                {p.statusLine} <span aria-hidden="true">·</span> <span className="font-medium text-ink">Continued below</span>
              </p>
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}

/**
 * A front-page column opens into its spread: the recording starts clipped to
 * a column's share of the page and unfolds to full width as the spread
 * scrolls in, with a crease riding the edge. Wide screens only; a phone shows
 * it whole.
 */
function Spread({ project, night = false }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  const unfold = wide && !reduce;

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.95', 'start 0.15'] });
  const open = useTransform(scrollYProgress, [0, 1], unfold ? [0, 1] : [1, 1], { clamp: true });
  const inset = useTransform(open, (v) => `${(1 - v) * 52}%`);
  const clipPath = useMotionTemplate`inset(0 ${inset} 0 0)`;
  const crease = useTransform(open, (v) => `${100 - (1 - v) * 52}%`);
  const creaseOpacity = useTransform(open, [0.9, 1], [1, 0]);
  const cta = liveLink(project);

  return (
    <section id={project.slug} ref={ref} aria-labelledby={`${project.slug}-title`} className={night ? 'night' : ''}>
      <div className={`${PAGE} py-16 md:py-24`}>
        <header className="grid lg:grid-cols-12 gap-x-10 gap-y-3 items-end pb-6 border-b border-rule">
          <h3 id={`${project.slug}-title`} className="lg:col-span-7 font-bold text-[clamp(2.5rem,5.2vw,4.5rem)] leading-[0.98] tracking-[-0.035em] text-ink">
            <MaskLines inView lines={[project.title]} />
          </h3>
          <p className="lg:col-span-5 text-xl text-ink-2 pretty lg:pb-2">{project.tagline}</p>
        </header>

        <div className="mt-10 grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 flex flex-col">
            <p className="text-lg leading-relaxed text-ink pretty">{project.summary}</p>
            <p className="mt-4 text-sm text-ink-3">{project.statusLine}</p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <CaseStudy
                project={project}
                trigger={<button type="button" className="btn btn-primary">Read the case study</button>}
              />
              {cta && (
                <a
                  href={cta.href}
                  target={cta.external ? '_blank' : undefined}
                  rel={cta.external ? 'noreferrer' : undefined}
                  onClick={() =>
                    cta.kind === 'writeup'
                      ? posthog.capture('case_study_link_clicked', { project_title: project.title, link_type: 'writeup' })
                      : posthog.capture('project_link_clicked', { project_title: project.title, link_type: 'live', project_type: 'featured' })
                  }
                  className="btn"
                >
                  {cta.label}
                  {cta.external && <span className="sr-only"> (opens in a new tab)</span>}
                </a>
              )}
            </div>
          </div>

          <div className="lg:col-span-8">
            <DemoVideo
              project={project}
              frame={(video) => (
                <div className="relative">
                  <Motion.div style={{ clipPath }}>{video}</Motion.div>
                  {unfold && (
                    <Motion.span
                      aria-hidden="true"
                      className="absolute top-0 bottom-0 w-px bg-rule-2"
                      style={{ left: crease, opacity: creaseOpacity }}
                    />
                  )}
                </div>
              )}
            />
          </div>
        </div>

        <Highlights items={project.top} className="mt-14" />
      </div>
    </section>
  );
}

function BuildLinks({ project }) {
  const link = 'link text-sm font-medium inline-flex items-center min-h-[36px]';
  const track = (type) => () =>
    posthog.capture('project_link_clicked', { project_title: project.title, link_type: type, project_type: 'index' });
  return (
    <>
      {project.github && (
        <a href={project.github} target="_blank" rel="noreferrer" onClick={track('github')} className={link}>
          Source<span className="sr-only"> for {project.title} (opens in a new tab)</span>
        </a>
      )}
      {project.live && (
        <a href={project.live} target="_blank" rel="noreferrer" onClick={track('live')} className={link}>
          Site<span className="sr-only"> for {project.title} (opens in a new tab)</span>
        </a>
      )}
      {project.npm && (
        <a href={project.npm} target="_blank" rel="noreferrer" onClick={track('npm')} className={link}>
          npm<span className="sr-only"> (opens in a new tab)</span>
        </a>
      )}
    </>
  );
}

function Brief({ project, fine, breakIt, busy }) {
  return (
    <div className="bg-bg">
      {!fine && (
        <img
          src={project.poster}
          alt=""
          loading="lazy"
          decoding="async"
          className="mb-5 w-full aspect-[16/10] object-cover object-top border border-rule bg-surface"
        />
      )}
      <h3 className="text-2xl font-bold tracking-[-0.03em] text-ink">
        <CaseStudy
          project={project}
          trigger={
            <button type="button" className="sig text-left">
              {project.title}<span className="sr-only">, open the write-up</span>
            </button>
          }
        />
      </h3>
      <p className="mt-1.5 text-ink-2">{project.tagline}</p>
      <p className="mt-4 text-[15px] leading-relaxed text-ink-2 pretty">{project.summary}</p>
      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
        {breakIt && (
          <button type="button" onClick={breakIt} aria-busy={busy} data-break className="btn btn-sm">
            Break this column
          </button>
        )}
        <BuildLinks project={project} />
      </div>
    </div>
  );
}

/** Smaller builds as the paper's "In brief" column. Hovering one shows its picture beside the cursor. */
function Briefs() {
  const [active, setActive] = useState(null);
  const fine = useFinePointer();
  return (
    <section aria-labelledby="briefs-heading" className={`${PAGE} pt-16 md:pt-24 pb-8`}>
      <div className="flex items-baseline justify-between gap-4 pb-4 border-b-2 border-ink">
        <h2 id="briefs-heading" className="label text-ink">In brief</h2>
        <p className="text-sm text-ink-3 hidden sm:block">Smaller builds, each with its source</p>
      </div>
      <div className="grid md:grid-cols-3">
        {builds.map((b, i) => (
          <article
            key={b.slug}
            className={`relative py-8 ${i > 0 ? 'md:pl-8 border-t md:border-t-0 border-rule' : ''} ${i < 2 ? 'md:pr-8' : ''}`}
            onPointerEnter={() => setActive(b.slug)}
            onPointerLeave={() => setActive(null)}
          >
            {i > 0 && <Rule axis="y" className="hidden md:block absolute left-0 top-8 bottom-8 w-px" delay={0.12 * i} />}
            {b.breakable ? (
              <Breakable>{({ breakIt, busy }) => <Brief project={b} fine={fine} breakIt={breakIt} busy={busy} />}</Breakable>
            ) : (
              <Brief project={b} fine={fine} />
            )}
          </article>
        ))}
      </div>
      <CursorPreview items={builds.map((b) => ({ id: b.slug, src: b.poster }))} activeId={active} />
    </section>
  );
}

export default function Projects() {
  return (
    <section id="work" aria-labelledby="work-heading">
      <FrontColumns />
      <div className="mt-8">
        <Spread project={featured[0]} />
        <Spread project={featured[1]} night />
        <Spread project={featured[2]} />
      </div>
      <Briefs />
    </section>
  );
}
