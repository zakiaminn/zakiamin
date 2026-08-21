import React from 'react';
import { projects, featuredProjects } from '@/data/projects';
import CaseStudy from '@/components/CaseStudy';

const OPEN_BUTTON =
  'font-mono text-xs tracking-[0.1em] uppercase text-ink font-bold border rule ' +
  'px-4 min-h-[44px] inline-flex items-center hover:bg-ink hover:text-paper transition-colors';

function FeaturedProject({ project }) {
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
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              className="ink-link font-mono text-xs tracking-[0.1em] uppercase text-ink font-bold inline-flex items-center min-h-[44px]"
            >
              Visit ↗
              <span className="sr-only"> {project.title} (opens in a new tab)</span>
            </a>
          )}
        </div>

        <p className="text-inkSoft leading-relaxed max-w-3xl mb-10">{project.description}</p>

        <dl className="grid grid-cols-2 md:grid-cols-4 gap-6 border-y rule py-8 mb-8">
          {project.stats.map((stat) => (
            <div key={stat.label}>
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="block font-display text-2xl md:text-3xl text-flame tnum">{stat.value}</span>
                <span className="block font-mono text-[11px] tracking-[0.08em] uppercase text-inkFaint mt-1 balance">
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
            <li key={t} className="font-mono text-xs border rule px-2.5 py-1 text-inkSoft">{t}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function ProjectCard({ project }) {
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

        <div className="flex justify-between items-center gap-4 border-t rule pt-4 mt-auto">
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            className="ink-link font-mono text-xs uppercase tracking-[0.08em] text-inkSoft inline-flex items-center min-h-[44px]"
          >
            Source<span className="sr-only"> for {project.title} (opens in a new tab)</span>
          </a>
          <CaseStudy
            project={project}
            trigger={
              <button
                type="button"
                className="font-mono text-xs uppercase tracking-[0.08em] text-ink font-bold border rule px-3 min-h-[44px] hover:bg-ink hover:text-paper transition-colors"
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
        <span className="font-mono text-sm text-flame">&sect; 03</span>
        <h2 className="font-display text-3xl md:text-4xl text-ink">Selected Work</h2>
      </div>
      <p className="text-inkSoft max-w-xl mb-12 md:mb-16">
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
