import React, { useCallback, useEffect, useRef, useState } from 'react';
import { projects, featuredProjects } from '@/data/projects';
import CaseStudy from '@/components/CaseStudy';
import { ExternalArrow, Highlights, SectionHead, TechLine } from '@/components/ProjectBits';
import { usePrefersReducedMotion } from '@/lib/motion';
import posthog from '@/lib/posthog';

const [trx, batin] = featuredProjects;

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = String(Math.round(seconds % 60)).padStart(2, '0');
  return `${m}:${s}`;
}

function DemoVideo({ project }) {
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

/** Batin's six services, drawn from how they actually connect. */
function Pipeline({ stages }) {
  return (
    <figure className="border border-rule">
      <ol className="grid sm:grid-cols-4">
        {stages.map((s, i) => (
          <li
            key={s.stage}
            className={`relative p-5 ${i > 0 ? 'border-t border-rule sm:border-t-0 sm:border-l' : ''}`}
          >
            <p className="label">{s.stage}</p>
            <ul className="mt-4 space-y-2">
              {s.nodes.map((n) => (
                <li key={n} className="border border-rule bg-surface px-3 py-2.5 text-sm font-medium text-ink leading-snug">
                  {n}
                </li>
              ))}
            </ul>
            {s.note && <p className="mt-3 text-sm text-ink-3 leading-snug">{s.note}</p>}
            {i < stages.length - 1 && (
              <svg
                viewBox="0 0 16 16"
                aria-hidden="true"
                className="absolute z-10 h-4 w-4 bg-bg text-brand-ink
                           left-1/2 -bottom-2 -translate-x-1/2 rotate-90
                           sm:left-auto sm:bottom-auto sm:-right-2 sm:top-1/2 sm:translate-x-0 sm:-translate-y-1/2 sm:rotate-0"
                fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
              >
                <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" />
              </svg>
            )}
          </li>
        ))}
      </ol>
      <figcaption className="border-t border-rule px-5 py-3 text-sm text-ink-3">
        Six services, one <span className="font-medium text-ink-2">docker-compose up</span>. Live ticks and
        backfill land in the same hypertables.
      </figcaption>
    </figure>
  );
}

function FeaturedTrx({ project }) {
  return (
    <div className="night">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-10 lg:gap-14 items-start">
          <div>
            <p className="label text-brand-ink">Flagship</p>
            <h3 className="mt-4 text-4xl md:text-5xl font-bold leading-[1.02] tracking-[-0.035em] text-ink balance">
              {project.title}
            </h3>
            <p className="mt-3 text-lg text-ink-2">{project.tagline}</p>
            <p className="mt-6 text-ink-2 leading-relaxed pretty">{project.description}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <CaseStudy
                project={project}
                trigger={<button type="button" className="btn btn-primary">Read the case study</button>}
              />
              <a
                href={project.live}
                target="_blank"
                rel="noreferrer"
                onClick={() => posthog.capture('project_link_clicked', { project_title: project.title, link_type: 'live', project_type: 'featured' })}
                className="btn"
              >
                Visit {project.liveLabel} <ExternalArrow />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </div>
          <DemoVideo project={project} />
        </div>
        <Highlights items={project.highlights} className="mt-14 md:mt-20" />
        <TechLine tech={project.tech} title={project.title} className="mt-6" />
      </div>
    </div>
  );
}

function FeaturedBatin({ project }) {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
      <div className="grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-10 lg:gap-14 items-start">
        <div>
          <p className="label">In progress · {project.status}</p>
          <h3 className="mt-4 text-4xl md:text-5xl font-bold leading-[1.02] tracking-[-0.035em] text-ink balance">
            {project.title}
          </h3>
          <p className="mt-3 text-lg text-ink-2">{project.tagline}</p>
          <p className="mt-6 text-ink-2 leading-relaxed pretty">{project.description}</p>
          <div className="mt-8">
            <CaseStudy
              project={project}
              trigger={<button type="button" className="btn">Read the case study</button>}
            />
          </div>
        </div>
        <Pipeline stages={project.pipeline} />
      </div>
      <Highlights items={project.highlights} className="mt-14 md:mt-20" />
      <TechLine tech={project.tech} title={project.title} className="mt-6" />
    </div>
  );
}

/**
 * Wraps a row in DOMolition, the npm package the row is about. Nothing loads
 * until someone presses the button; then the package (and matter-js) arrive
 * as their own chunk, the row is captured to a bitmap and blown apart with
 * the grid engine. The rubble fades when you scroll away or put the row back.
 */
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

  // Keep keyboard focus on a live control: onto "Put it back" when the row
  // goes, and back onto "Break this row" when it returns.
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

function IndexRow({ project, breakIt, busy }) {
  return (
    <div className="group relative grid md:grid-cols-[minmax(0,1fr)_minmax(0,300px)] gap-6 md:gap-12 py-10 md:py-12 border-b border-rule bg-bg">
      <div className="min-w-0">
        <h4 className="text-3xl font-bold tracking-[-0.03em] text-ink">
          <CaseStudy
            project={project}
            trigger={
              // The title is the row's link; its ::after stretches over the
              // whole row, so the image and copy open the write-up too.
              <button type="button" className="sig text-left after:absolute after:inset-0 after:content-['']">
                {project.title}
                <span className="sr-only">, open the write-up</span>
              </button>
            }
          />
        </h4>
        <p className="mt-1.5 text-ink-2">{project.tagline}</p>
        <p className="mt-5 max-w-xl text-ink-2 leading-relaxed pretty">{project.summary}</p>
        <Highlights items={project.highlights} compact className="mt-6 max-w-2xl" />
        <TechLine tech={project.tech} title={project.title} className="mt-5" />

        <div className="relative z-10 mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          {breakIt && (
            <button type="button" onClick={breakIt} aria-busy={busy} data-break className="btn btn-sm">
              Break this row
            </button>
          )}
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            onClick={() => posthog.capture('project_link_clicked', { project_title: project.title, link_type: 'github', project_type: 'index' })}
            className="link text-sm font-medium inline-flex items-center min-h-[36px]"
          >
            Source <ExternalArrow /><span className="sr-only"> for {project.title} (opens in a new tab)</span>
          </a>
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              onClick={() => posthog.capture('project_link_clicked', { project_title: project.title, link_type: 'live', project_type: 'index' })}
              className="link text-sm font-medium inline-flex items-center min-h-[36px]"
            >
              Site <ExternalArrow /><span className="sr-only"> for {project.title} (opens in a new tab)</span>
            </a>
          )}
          {project.npm && (
            <a
              href={project.npm}
              target="_blank"
              rel="noreferrer"
              onClick={() => posthog.capture('project_link_clicked', { project_title: project.title, link_type: 'npm', project_type: 'index' })}
              className="link text-sm font-medium inline-flex items-center min-h-[36px]"
            >
              npm <ExternalArrow /><span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
        </div>
      </div>

      <img
        src={project.poster}
        alt=""
        width={project.demoSize[0]}
        height={project.demoSize[1]}
        loading="lazy"
        decoding="async"
        className="w-full aspect-[16/10] object-cover object-top border border-rule bg-surface-2"
      />
    </div>
  );
}

export default function Projects() {
  return (
    <section id="work" aria-labelledby="work-heading">
      <div className="max-w-6xl mx-auto px-6 pb-10 md:pb-14">
        <SectionHead id="work-heading">Selected work</SectionHead>
      </div>

      <FeaturedTrx project={trx} />
      <FeaturedBatin project={batin} />

      <div className="max-w-6xl mx-auto px-6 pb-20 md:pb-28">
        <SectionHead as="h3" className="mb-2">Smaller builds</SectionHead>
        <div>
          {projects.map((project) =>
            project.breakable ? (
              <Breakable key={project.title}>
                {({ breakIt, busy }) => <IndexRow project={project} breakIt={breakIt} busy={busy} />}
              </Breakable>
            ) : (
              <IndexRow key={project.title} project={project} />
            )
          )}
        </div>
      </div>
    </section>
  );
}
