import React from 'react';
import { projects, featuredProjects } from '@/data/projects';
import CaseStudy from '@/components/CaseStudy';

// Ghost control that fills with the accent on hover — the brand showing up
// on interaction rather than sitting there glowing.
const OPEN_BUTTON =
  'font-martian text-xs tracking-[0.1em] uppercase text-ink font-semibold border rule ' +
  'px-4 min-h-[44px] inline-flex items-center transition-colors ' +
  'hover:bg-brand hover:text-brand-fg hover:border-brand';

function FeaturedProject({ project }) {
  return (
    <article className="relative border rule mb-16 md:mb-20 bg-surface">
      <div className="dot-pattern h-2 text-brand-ink" aria-hidden="true" />
      <div className="p-7 md:p-12">
        <div className="flex flex-wrap items-baseline justify-between gap-4 mb-6">
          <div>
            <span className="font-martian text-xs tracking-[0.14em] uppercase text-brand-ink">Featured Build</span>
            <h3 className="font-bricolage font-bold text-3xl md:text-4xl tracking-[-0.02em] text-ink mt-2 balance">{project.title}</h3>
            <p className="font-martian text-sm text-ink-2 mt-1">{project.tagline}</p>
          </div>
          {project.live ? (
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              className="ink-link font-martian text-xs tracking-[0.1em] uppercase text-brand-ink font-semibold inline-flex items-center min-h-[44px]"
            >
              Visit ↗
              <span className="sr-only"> {project.title} (opens in a new tab)</span>
            </a>
          ) : project.status ? (
            // A brand-washed pill in place of the live link, so a pre-launch
            // build reads as "on the way", not "missing".
            <span className="font-martian text-[11px] tracking-[0.12em] uppercase text-brand-ink font-semibold bg-brand-wash border border-rule px-3 py-1.5">
              {project.status}
            </span>
          ) : null}
        </div>

        <p className="text-ink-2 leading-relaxed max-w-3xl mb-10">{project.description}</p>

        <dl className="grid grid-cols-2 md:grid-cols-4 gap-6 border-y rule py-8 mb-8">
          {project.stats.map((stat) => (
            <div key={stat.label}>
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="block font-martian font-medium text-2xl md:text-[1.75rem] tracking-[-0.035em] text-brand-ink tnum">{stat.value}</span>
                <span className="block font-martian text-[11px] tracking-[0.08em] uppercase text-ink-3 mt-1.5 balance">
                  {stat.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>

        <CaseStudy
          project={project}
          trigger={
            <button type="button" className={OPEN_BUTTON}>
              Open the case study &rarr;
              <span className="sr-only"> for {project.title}</span>
            </button>
          }
        />

        <ul className="flex flex-wrap gap-2 mt-10" aria-label={`${project.title} tech stack`}>
          {project.tech.map((t) => (
            <li key={t} className="font-martian text-xs border rule px-2.5 py-1 text-ink-2">{t}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function ProjectCard({ project }) {
  return (
    <article className={`border rule h-full flex flex-col bg-surface ${project.shatter ? 'shatter-fx' : ''}`}>
      <div className="dot-pattern h-1.5 text-brand-ink" aria-hidden="true" />
      <div className="p-7 flex flex-col flex-grow">
        <h3 className="font-bricolage font-bold text-2xl tracking-[-0.02em] text-ink mb-1.5 balance">{project.title}</h3>
        <p className="font-martian text-xs text-brand-ink mb-5">{project.tagline}</p>
        <p className="text-ink-2 text-sm leading-relaxed mb-6 flex-grow">{project.description}</p>

        <ul className="flex flex-wrap gap-1.5 mb-6" aria-label={`${project.title} tech stack`}>
          {project.tech.map((t) => (
            <li key={t} className="font-martian text-[11px] border rule px-2 py-1 text-ink-3">{t}</li>
          ))}
        </ul>

        <div className="flex justify-between items-center gap-4 border-t rule pt-4 mt-auto">
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            className="ink-link font-martian text-xs uppercase tracking-[0.08em] text-ink-2 hover:text-ink inline-flex items-center min-h-[44px]"
          >
            Source<span className="sr-only"> for {project.title} (opens in a new tab)</span>
          </a>
          <CaseStudy
            project={project}
            trigger={
              <button
                type="button"
                className="font-martian text-xs uppercase tracking-[0.08em] text-ink font-semibold border rule px-3 min-h-[44px] transition-colors hover:bg-brand hover:text-brand-fg hover:border-brand"
              >
                View<span className="sr-only"> {project.title}</span>
              </button>
            }
          />
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="w-full max-w-6xl mx-auto px-6 py-20 md:py-28 scroll-mt-24">
      <div className="flex items-baseline gap-4 mb-4">
        <span className="font-martian text-sm text-brand-ink">&sect; 03</span>
        <h2 className="font-bricolage font-bold text-3xl md:text-4xl tracking-[-0.02em] text-ink">Selected Work</h2>
      </div>
      <p className="text-ink-2 max-w-xl mb-12 md:mb-16">
        Two flagship builds and three smaller ones. Open any of them for the full write-up —
        what it does, how it was built, and what broke along the way.
      </p>

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
