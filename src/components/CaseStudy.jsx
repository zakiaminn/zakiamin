import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, SegmentedTabsList, TabsContent } from '@/components/ui/tabs';
import { Highlights, TechLine } from '@/components/ProjectBits';
import { usePrefersReducedMotion } from '@/lib/motion';
import posthog from '@/lib/posthog';

const TABS = [
  { value: 'overview', label: 'Overview' },
  { value: 'log', label: 'Build log' },
  { value: 'stack', label: 'Stack' },
];

function ExternalLinks({ project }) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
      {project.live && (
        <a
          href={project.live}
          target="_blank"
          rel="noreferrer"
          onClick={() => posthog.capture('case_study_link_clicked', { project_title: project.title, link_type: 'live' })}
          className="sig text-ink font-medium inline-flex items-center min-h-[44px]"
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
          onClick={() => posthog.capture('case_study_link_clicked', { project_title: project.title, link_type: 'github' })}
          className="sig text-ink font-medium inline-flex items-center min-h-[44px]"
        >
          Read the source ↗
          <span className="sr-only"> for {project.title} (opens in a new tab)</span>
        </a>
      )}
      {project.npm && (
        <a
          href={project.npm}
          target="_blank"
          rel="noreferrer"
          onClick={() => posthog.capture('case_study_link_clicked', { project_title: project.title, link_type: 'npm' })}
          className="sig text-ink font-medium inline-flex items-center min-h-[44px]"
        >
          View on npm ↗
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      )}
      {/* Pre-launch builds have no public repo or site yet. Say so plainly
          rather than leaving a dead link a recruiter would click into a 404. */}
      {project.comingSoon && !project.live && !project.github && (
        <span className="text-ink-3 inline-flex items-center min-h-[44px]">
          Source and live demo open at launch.
        </span>
      )}
    </div>
  );
}

function Media({ project }) {
  const reduced = usePrefersReducedMotion();
  const [mw, mh] = project.demoSize ?? [16, 9];

  if (project.demoVideo) {
    // Short loops stand in for the old GIFs: silent, looping, no chrome.
    // Under reduced motion they wait for a press like any other video.
    const loop = project.demoLoop && !reduced;
    const video = (
      <video
        src={project.demoVideo}
        poster={project.poster}
        width={mw}
        height={mh}
        playsInline
        muted={project.demoLoop}
        loop={project.demoLoop}
        autoPlay={loop}
        controls={!loop}
        preload={loop ? 'auto' : 'none'}
        aria-label={`Screen recording: ${project.title} demo`}
        className="block w-full h-auto border border-rule bg-surface-2"
      />
    );
    if (!project.demoCaption) return video;
    return (
      <figure>
        {video}
        <figcaption className="mt-3 text-sm text-ink-3">{project.demoCaption}</figcaption>
      </figure>
    );
  }

  if (project.demoComingSoon) {
    // Reads as intentional, not missing; swapped for the recording at launch.
    return (
      <div className="border border-rule bg-surface w-full aspect-video flex flex-col items-center justify-center gap-2 px-6 text-center">
        <span className="label">Demo at launch</span>
        <span className="text-sm text-ink-2 max-w-xs">
          A live walkthrough lands with the public deployment.
        </span>
      </div>
    );
  }

  return null;
}

export default function CaseStudy({ project, trigger }) {
  const [tab, setTab] = useState('overview');
  const hasLongform = Array.isArray(project.longform) && project.longform.length > 0;
  const [lede, ...rest] = hasLongform ? project.longform : [];

  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) {
          setTab('overview');
          posthog.capture('case_study_opened', { project_title: project.title, has_longform: hasLongform });
        }
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <p className="label text-brand-ink">{hasLongform ? 'Case study' : 'Project'}</p>
          <DialogTitle className="mt-3 pr-14">{project.title}</DialogTitle>
          <DialogDescription>{project.tagline}</DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-10 md:px-10">
          {hasLongform ? (
            <Tabs
              value={tab}
              onValueChange={(next) => {
                setTab(next);
                posthog.capture('case_study_tab_changed', { project_title: project.title, tab_name: next });
              }}
            >
              <SegmentedTabsList items={TABS} value={tab} aria-label={`${project.title} case study sections`} />

              <TabsContent value="overview" className="space-y-8">
                <p className="text-ink-2 leading-relaxed">{project.description}</p>
                {project.highlights && <Highlights items={project.highlights} columns={2} />}
                <Media project={project} />
                <ExternalLinks project={project} />
              </TabsContent>

              <TabsContent value="log">
                <p className="text-ink-2 leading-relaxed">{lede}</p>
                {project.pullQuote && (
                  <blockquote className="my-9 border-l border-rule-2 pl-5 text-xl md:text-2xl font-medium leading-snug tracking-[-0.01em] text-ink max-w-[34ch] pretty">
                    {project.pullQuote}
                  </blockquote>
                )}
                <div className="space-y-5">
                  {rest.map((para, idx) => (
                    <p key={idx} className="text-ink-2 leading-relaxed">{para}</p>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="stack" className="space-y-8">
                <p className="label">Everything this build runs on</p>
                <ul className="border-t border-rule" aria-label={`${project.title} tech stack`}>
                  {project.tech.map((t) => (
                    <li key={t} className="border-b border-rule py-3 text-ink">{t}</li>
                  ))}
                </ul>
                <ExternalLinks project={project} />
              </TabsContent>
            </Tabs>
          ) : (
            <div className="space-y-8">
              <Media project={project} />
              <p className="text-ink-2 leading-relaxed">{project.description}</p>
              {project.highlights && <Highlights items={project.highlights} columns={2} />}
              <TechLine tech={project.tech} title={project.title} />
              <ExternalLinks project={project} />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
