import React, { useId, useState } from 'react';
import { projects, featuredProjects } from '../data/projects';

/** Shared styling for the small mono buttons, sized to a comfortable target. */
const BUTTON =
  'font-mono text-xs tracking-[0.1em] uppercase text-ink font-bold border rule ' +
  'px-4 min-h-[44px] inline-flex items-center gap-2 hover:bg-ink hover:text-paper transition-colors';

/**
 * A collapsible region. Kept in the DOM so its height can transition, but
 * marked `inert` while closed — otherwise its links and video controls stay
 * in the tab order while invisible.
 */
function Collapse({ id, open, children }) {
  return (
    <div
      className="grid transition-[grid-template-rows] duration-500 ease-out"
      style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
    >
      <div id={id} inert={!open || undefined} className="overflow-hidden">
        {children}
      </div>
    </div>
  );
}

function FeaturedProject({ project }) {
  const [expanded, setExpanded] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const uid = useId();
  const logId = `${uid}-log`;
  const videoId = `${uid}-video`;

  const [vw, vh] = project.demoSize ?? [16, 9];
  const [lede, ...rest] = project.longform;

  return (
    <article className="relative border rule mb-16 md:mb-20">
      <div className="dot-pattern h-2 text-ink" aria-hidden="true" />
      <div className="p-7 md:p-12">
        <div className="flex flex-wrap items-baseline justify-between gap-4 mb-6">
          <div>
            <span className="font-mono text-xs tracking-[0.15em] uppercase text-flame">Featured Build</span>
            <h3 className="font-display text-3xl md:text-4xl text-ink mt-2 balance">{project.title}</h3>
            <p className="font-mono text-sm text-inkSoft mt-1">{project.tagline}</p>
          </div>
          <div className="flex gap-6">
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noreferrer"
                className="ink-link font-mono text-xs tracking-[0.1em] uppercase text-ink font-bold inline-flex items-center min-h-[44px]"
              >
                Visit &nearr;<span className="sr-only"> {project.title} (opens in a new tab)</span>
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className="ink-link font-mono text-xs tracking-[0.1em] uppercase text-inkSoft inline-flex items-center min-h-[44px]"
              >
                Source<span className="sr-only"> for {project.title} (opens in a new tab)</span>
              </a>
            )}
          </div>
        </div>

        <p className="text-inkSoft leading-relaxed max-w-3xl mb-10">{project.description}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-y rule py-8 mb-8">
          {project.stats.map((stat) => (
            <div key={stat.label}>
              <div className="font-display text-2xl md:text-3xl text-flame tnum">{stat.value}</div>
              <div className="font-mono text-[11px] tracking-[0.08em] uppercase text-inkFaint mt-1 balance">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mb-2">
          {project.demoVideo && (
            <button
              type="button"
              onClick={() => setShowVideo((v) => !v)}
              aria-expanded={showVideo}
              aria-controls={videoId}
              className={BUTTON}
            >
              {showVideo ? 'Hide the demo' : 'Watch the demo ▶'}
            </button>
          )}
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-controls={logId}
            className={BUTTON}
          >
            {expanded ? 'Close the build log' : 'Read the full build log +'}
          </button>
        </div>

        {project.demoVideo && (
          <Collapse id={videoId} open={showVideo}>
            <video
              src={project.demoVideo}
              controls
              playsInline
              preload="metadata"
              width={vw}
              height={vh}
              aria-label={`Screen recording: ${project.title} demo`}
              className="w-full h-auto border rule mt-8 bg-paperDim"
            />
          </Collapse>
        )}

        <Collapse id={logId} open={expanded}>
          <div className="pt-8 max-w-3xl">
            {/* Opening paragraph takes a drop cap, the way a feature would in print. */}
            <p className="text-inkSoft leading-relaxed dropcap">{lede}</p>

            {project.pullQuote && (
              <blockquote className="pull-quote my-9">{project.pullQuote}</blockquote>
            )}

            <div className="space-y-5">
              {rest.map((para, idx) => (
                <p key={idx} className="text-inkSoft leading-relaxed">{para}</p>
              ))}
            </div>
          </div>
        </Collapse>

        <ul className="flex flex-wrap gap-2 mt-10" aria-label={`${project.title} tech stack`}>
          {project.tech.map((t) => (
            <li key={t} className="font-mono text-xs border rule px-2.5 py-1 text-inkSoft">{t}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function ProjectCard({ project }) {
  const [showDemo, setShowDemo] = useState(false);
  const uid = useId();
  const demoId = `${uid}-demo`;
  const [dw, dh] = project.demoSize ?? [16, 9];

  return (
    <article className={`border rule h-full flex flex-col ${project.shatter ? 'shatter-fx' : ''}`}>
      <div className="dot-pattern h-1.5" style={{ color: project.color }} aria-hidden="true" />
      <div className="p-7 flex flex-col flex-grow">
        <h3 className="font-display text-2xl text-ink mb-1.5 balance">{project.title}</h3>
        <p className="font-mono text-xs mb-5" style={{ color: project.color }}>{project.tagline}</p>
        <p className="text-inkSoft text-sm leading-relaxed mb-6 flex-grow">{project.description}</p>

        <ul className="flex flex-wrap gap-1.5 mb-6" aria-label={`${project.title} tech stack`}>
          {project.tech.map((t) => (
            <li key={t} className="font-mono text-[11px] border rule px-2 py-1 text-inkFaint">{t}</li>
          ))}
        </ul>

        <Collapse id={demoId} open={showDemo}>
          <div className="border rule mb-6 bg-paperDim">
            <img
              src={project.demoGif}
              alt={`${project.title} demo`}
              width={dw}
              height={dh}
              loading="lazy"
              decoding="async"
              className="w-full h-auto"
            />
          </div>
        </Collapse>

        <div className="flex justify-between items-center gap-4 border-t rule pt-4 mt-auto">
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            className="ink-link font-mono text-xs uppercase tracking-[0.08em] text-inkSoft inline-flex items-center min-h-[44px]"
          >
            Source<span className="sr-only"> for {project.title} (opens in a new tab)</span>
          </a>
          <button
            type="button"
            onClick={() => setShowDemo((v) => !v)}
            aria-expanded={showDemo}
            aria-controls={demoId}
            className="font-mono text-xs uppercase tracking-[0.08em] text-ink font-bold border rule px-3 min-h-[44px] hover:bg-ink hover:text-paper transition-colors"
          >
            {showDemo ? 'Hide demo' : 'View demo'}
          </button>
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="w-full max-w-6xl mx-auto px-6 py-20 md:py-28 scroll-mt-24">
      <div className="flex items-baseline gap-4 mb-12 md:mb-16">
        <span className="font-mono text-sm text-flame">&sect; 03</span>
        <h2 className="font-display text-3xl md:text-4xl text-ink">Selected Work</h2>
      </div>

      {featuredProjects.map((project) => (
        <FeaturedProject key={project.title} project={project} />
      ))}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </section>
  );
}
