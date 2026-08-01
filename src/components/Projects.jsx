import React, { useState } from 'react';
import { projects, featuredProject } from '../data/projects';

function FeaturedProject({ project }) {
  const [expanded, setExpanded] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="relative border rule mb-16 md:mb-20">
      <div className="dot-pattern h-2 text-ink" />
      <div className="p-7 md:p-12">
        <div className="flex flex-wrap items-baseline justify-between gap-4 mb-6">
          <div>
            <span className="font-mono text-xs tracking-[0.15em] uppercase text-flame">Featured Build</span>
            <h3 className="font-display text-3xl md:text-4xl text-ink mt-2">{project.title}</h3>
            <p className="font-mono text-sm text-inkSoft mt-1">{project.tagline}</p>
          </div>
          <div className="flex gap-6">
            {project.live && (
              <a href={project.live} target="_blank" rel="noreferrer" className="ink-link font-mono text-xs tracking-[0.1em] uppercase text-ink font-bold">
                Visit &nearr;
              </a>
            )}
            {project.github && (
              <a href={project.github} target="_blank" rel="noreferrer" className="ink-link font-mono text-xs tracking-[0.1em] uppercase text-inkSoft">
                Source
              </a>
            )}
          </div>
        </div>

        <p className="text-inkSoft leading-relaxed max-w-3xl mb-10">{project.description}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-y rule py-8 mb-8">
          {project.stats.map((stat) => (
            <div key={stat.label}>
              <div className="font-display text-2xl md:text-3xl text-flame">{stat.value}</div>
              <div className="font-mono text-[11px] tracking-[0.08em] uppercase text-inkFaint mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mb-2">
          {project.demoVideo && (
            <button
              onClick={() => setShowVideo((v) => !v)}
              className="font-mono text-xs tracking-[0.1em] uppercase text-ink font-bold border rule px-4 py-2.5 hover:bg-ink hover:text-paper transition-colors"
            >
              {showVideo ? 'Hide the demo' : 'Watch the demo ▶'}
            </button>
          )}
          <button
            onClick={() => setExpanded((v) => !v)}
            className="font-mono text-xs tracking-[0.1em] uppercase text-ink font-bold border rule px-4 py-2.5 hover:bg-ink hover:text-paper transition-colors"
          >
            {expanded ? 'Close the build log' : 'Read the full build log +'}
          </button>
        </div>

        {project.demoVideo && (
          <div
            className="grid transition-[grid-template-rows] duration-500 ease-out"
            style={{ gridTemplateRows: showVideo ? '1fr' : '0fr' }}
          >
            <div className="overflow-hidden">
              <video
                src={project.demoVideo}
                controls
                playsInline
                preload="metadata"
                className="w-full border rule mt-8 bg-paperDim"
              />
            </div>
          </div>
        )}

        <div
          className="grid transition-[grid-template-rows] duration-500 ease-out"
          style={{ gridTemplateRows: expanded ? '1fr' : '0fr' }}
        >
          <div className="overflow-hidden">
            <div className="pt-8 space-y-5 max-w-3xl">
              {project.longform.map((para, idx) => (
                <p key={idx} className="text-inkSoft leading-relaxed">{para}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-10">
          {project.tech.map((t) => (
            <span key={t} className="font-mono text-xs border rule px-2.5 py-1 text-inkSoft">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project }) {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className={`border rule h-full flex flex-col ${project.shatter ? 'shatter-fx' : ''}`}>
      <div className="dot-pattern h-1.5" style={{ color: project.color }} />
      <div className="p-7 flex flex-col flex-grow">
        <h3 className="font-display text-2xl text-ink mb-1.5">{project.title}</h3>
        <p className="font-mono text-xs mb-5" style={{ color: project.color }}>{project.tagline}</p>
        <p className="text-inkSoft text-sm leading-relaxed mb-6 flex-grow">{project.description}</p>

        <div className="flex flex-wrap gap-1.5 mb-6">
          {project.tech.map((t) => (
            <span key={t} className="font-mono text-[11px] border rule px-2 py-1 text-inkFaint">{t}</span>
          ))}
        </div>

        <div
          className="grid transition-[grid-template-rows] duration-400 ease-out"
          style={{ gridTemplateRows: showDemo ? '1fr' : '0fr' }}
        >
          <div className="overflow-hidden">
            <div className="border rule mb-6 bg-paperDim">
              <img src={project.demoGif} alt={`${project.title} demo`} className="w-full h-auto" />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center border-t rule pt-5 mt-auto">
          <a href={project.github} target="_blank" rel="noreferrer" className="ink-link font-mono text-xs uppercase tracking-[0.08em] text-inkSoft">
            Source
          </a>
          <button
            onClick={() => setShowDemo((v) => !v)}
            className="font-mono text-xs uppercase tracking-[0.08em] text-ink font-bold border rule px-3 py-1.5 hover:bg-ink hover:text-paper transition-colors"
          >
            {showDemo ? 'Hide demo' : 'View demo'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="w-full max-w-6xl mx-auto px-6 py-20 md:py-28 scroll-mt-24">
      <div className="flex items-baseline gap-4 mb-12 md:mb-16">
        <span className="font-mono text-sm text-flame">&sect; 03</span>
        <h2 className="font-display text-3xl md:text-4xl text-ink">Selected Work</h2>
      </div>

      <FeaturedProject project={featuredProject} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((project, idx) => (
          <ProjectCard key={idx} project={project} />
        ))}
      </div>
    </section>
  );
}
