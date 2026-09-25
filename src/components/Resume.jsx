import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { profile, skillGroups, timeline } from '@/data/profile';
import { featuredProjects, projects } from '@/data/projects';
import { YearSpan } from '@/components/Experience';
import posthog from '@/lib/posthog';

const education = timeline.filter((t) => t.kind === 'education');
const experience = timeline.filter((t) => t.kind === 'experience');
const allProjects = [...featuredProjects, ...projects];

/** A titled block with the site's label-over-hairline idiom. */
function Section({ title, children }) {
  return (
    <section className="border-t border-rule pt-6">
      <h3 className="label mb-5">{title}</h3>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

/** A dated row: the rail on the left, the substance on the right. */
function Entry({ rail, heading, detail }) {
  return (
    <div className="grid md:grid-cols-[150px_1fr] gap-1 md:gap-8">
      <div className="text-sm md:pt-1">{rail}</div>
      <div>
        <h4 className="font-semibold text-lg tracking-[-0.01em] text-ink">{heading}</h4>
        {detail && <p className="text-ink-2 leading-relaxed mt-1">{detail}</p>}
      </div>
    </div>
  );
}

export default function Resume() {
  const [open, setOpen] = useState(
    () => typeof window !== 'undefined' && window.location.hash === '#resume'
  );

  // The hash is the source of truth: back/forward, a pasted #resume link, and
  // the on-page "Résumé" anchors all flow through here.
  useEffect(() => {
    const sync = () => setOpen(window.location.hash === '#resume');
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  useEffect(() => {
    if (open) posthog.capture('resume_viewed');
  }, [open]);

  const handleOpenChange = (next) => {
    // Closing clears the hash without stacking a history entry.
    if (!next && window.location.hash === '#resume') {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    } else if (next && window.location.hash !== '#resume') {
      history.replaceState(null, '', '#resume');
    }
    setOpen(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <p className="label text-brand-ink">Résumé</p>
          <DialogTitle className="mt-3 pr-14">{profile.name}</DialogTitle>
          <DialogDescription>
            {profile.role} · {profile.location}. Seeking a {profile.seeking}.
          </DialogDescription>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-1">
            <a href={`mailto:${profile.email}`} className="sig text-ink font-medium inline-flex items-center min-h-[44px]">
              {profile.email}
            </a>
            <a href={profile.github} target="_blank" rel="noreferrer" className="sig text-ink font-medium inline-flex items-center min-h-[44px]">
              GitHub ↗<span className="sr-only"> (opens in a new tab)</span>
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="sig text-ink font-medium inline-flex items-center min-h-[44px]">
              LinkedIn ↗<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </DialogHeader>

        <div className="px-6 pb-10 md:px-10 space-y-8">
          <Section title="Education">
            {education.map((e) => (
              <Entry key={e.id} rail={<YearSpan start={e.start} end={e.end} />} heading={e.role} detail={e.detail} />
            ))}
          </Section>

          <Section title="Experience">
            {experience.map((e) => (
              <Entry key={e.id} rail={<YearSpan start={e.start} end={e.end} />} heading={e.role} detail={e.detail} />
            ))}
          </Section>

          <Section title="Selected projects">
            {allProjects.map((p) => (
              <Entry
                key={p.title}
                rail={<span className="text-ink-3">{p.live ? 'Live' : p.comingSoon ? 'Pre-launch' : 'Open source'}</span>}
                heading={p.title}
                detail={
                  <>
                    {p.tagline}.
                    <span className="block mt-1.5 text-sm text-ink-3">{p.tech.join(', ')}</span>
                  </>
                }
              />
            ))}
          </Section>

          <Section title="Skills">
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
              {skillGroups.map((group) => (
                <div key={group.label}>
                  <h4 className="label mb-1.5">{group.label}</h4>
                  <p className="text-ink-2 leading-relaxed">{group.items.join(', ')}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
