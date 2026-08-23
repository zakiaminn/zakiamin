import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function StatRow({ stats }) {
  return (
    <dl className="grid grid-cols-2 md:grid-cols-4 gap-6 border-y rule py-7">
      {stats.map((stat) => (
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
  );
}

function TechList({ tech, title }) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label={`${title} tech stack`}>
      {tech.map((t) => (
        <li key={t} className="font-martian text-xs border rule px-2.5 py-1.5 text-ink-2">{t}</li>
      ))}
    </ul>
  );
}

function ExternalLinks({ project }) {
  return (
    <div className="flex flex-wrap gap-6">
      {project.live && (
        <a
          href={project.live}
          target="_blank"
          rel="noreferrer"
          className="ink-link font-martian text-xs tracking-[0.1em] uppercase text-brand-ink font-semibold inline-flex items-center min-h-[44px]"
        >
          Visit the live site ↗
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      )}
      {project.github && (
        <a
          href={project.github}
          target="_blank"
          rel="noreferrer"
          className="ink-link font-martian text-xs tracking-[0.1em] uppercase text-ink-2 hover:text-ink inline-flex items-center min-h-[44px]"
        >
          Read the source
          <span className="sr-only"> for {project.title} (opens in a new tab)</span>
        </a>
      )}
    </div>
  );
}

/**
 * A project opened as a case study. Depth lives in here rather than on the
 * page, so the work section stays scannable and a reader chooses what to
 * go deep on. Featured builds get tabs; the smaller ones don't have enough
 * material to earn them, so they render as one column.
 */
export default function CaseStudy({ project, trigger }) {
  const hasLongform = Array.isArray(project.longform) && project.longform.length > 0;
  const [lede, ...rest] = hasLongform ? project.longform : [];
  const [mw, mh] = project.demoSize ?? [16, 9];

  const media = project.demoVideo ? (
    <video
      src={project.demoVideo}
      controls
      playsInline
      preload="metadata"
      width={mw}
      height={mh}
      aria-label={`Screen recording: ${project.title} demo`}
      className="w-full h-auto border rule bg-surface-2"
    />
  ) : project.demoGif ? (
    <img
      src={project.demoGif}
      alt={`${project.title} demo`}
      width={mw}
      height={mh}
      loading="lazy"
      decoding="async"
      className="w-full h-auto border rule bg-surface-2"
    />
  ) : null;

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <span className="font-martian text-xs tracking-[0.14em] uppercase text-brand-ink">
            {hasLongform ? 'Case Study' : 'Project'}
          </span>
          <DialogTitle className="mt-2 pr-14">{project.title}</DialogTitle>
          <DialogDescription>{project.tagline}</DialogDescription>
        </DialogHeader>

        <div className="px-7 pb-9 md:px-10">
          {hasLongform ? (
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="log">Build Log</TabsTrigger>
                <TabsTrigger value="stack">Stack</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-8">
                <p className="text-ink-2 leading-relaxed">{project.description}</p>
                {project.stats && <StatRow stats={project.stats} />}
                {media}
                <ExternalLinks project={project} />
              </TabsContent>

              <TabsContent value="log">
                <p className="text-ink-2 leading-relaxed dropcap">{lede}</p>
                {project.pullQuote && (
                  <blockquote className="pull-quote my-9">{project.pullQuote}</blockquote>
                )}
                <div className="space-y-5">
                  {rest.map((para, idx) => (
                    <p key={idx} className="text-ink-2 leading-relaxed">{para}</p>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="stack" className="space-y-8">
                <p className="font-martian text-xs tracking-[0.14em] uppercase text-ink-3">
                  Everything this build runs on
                </p>
                <TechList tech={project.tech} title={project.title} />
                <ExternalLinks project={project} />
              </TabsContent>
            </Tabs>
          ) : (
            <div className="space-y-8">
              <p className="text-ink-2 leading-relaxed">{project.description}</p>
              {media}
              <TechList tech={project.tech} title={project.title} />
              <ExternalLinks project={project} />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
