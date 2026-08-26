import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { profile, skillGroups, timeline } from '@/data/profile';
import { featuredProjects, projects } from '@/data/projects';

const education = timeline.filter((t) => t.kind === 'education');
const experience = timeline.filter((t) => t.kind === 'experience');
const allProjects = [...featuredProjects, ...projects];

/** A titled block with the site's hairline-over-label idiom. */
function Section({ title, children }) {
  return (
    <section className="border-t rule pt-6">
      <h3 className="font-martian text-[11px] tracking-[0.14em] uppercase text-ink-3 mb-5">
        {title}
      </h3>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

/** A dated row: the year rail on the left, the substance on the right. */
function Entry({ year, heading, detail }) {
  return (
    <div className="grid md:grid-cols-[150px_1fr] gap-1 md:gap-8">
      {year && (
        <span className="font-martian text-xs text-brand-ink tnum md:pt-1">{year}</span>
      )}
      <div>
        <h4 className="font-bricolage font-semibold text-lg tracking-[-0.01em] text-ink">
          {heading}
        </h4>
        {detail && <p className="text-ink-2 text-[15px] leading-relaxed mt-1">{detail}</p>}
      </div>
    </div>
  );
}

/**
 * The résumé, presented in-page rather than handed over as a download — a
 * recruiter reads it here, on the same hairline grid as the rest of the site.
 * Everything is sourced from the shared profile data and the project list, so
 * it can't drift from what's on the page.
 */
export default function Resume({ trigger }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <span className="font-martian text-xs tracking-[0.14em] uppercase text-brand-ink">
            Résumé
          </span>
          <DialogTitle className="mt-2 pr-14">{profile.name}</DialogTitle>
          <DialogDescription>
            {profile.role} · {profile.location} · Seeking {profile.seeking}
          </DialogDescription>
        </DialogHeader>

        <div className="px-7 pb-9 md:px-10 space-y-8">
          {/* Contact rail */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 -mt-1">
            <a
              href={`mailto:${profile.email}`}
              className="ink-link font-martian text-xs tracking-[0.08em] text-ink hover:text-ink inline-flex items-center min-h-[44px]"
            >
              {profile.email}
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="ink-link font-martian text-xs tracking-[0.08em] uppercase text-ink-2 hover:text-ink inline-flex items-center min-h-[44px]"
            >
              GitHub<span className="sr-only"> (opens in a new tab)</span>
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="ink-link font-martian text-xs tracking-[0.08em] uppercase text-ink-2 hover:text-ink inline-flex items-center min-h-[44px]"
            >
              LinkedIn<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>

          <Section title="Education">
            {education.map((e) => (
              <Entry key={e.id} year={e.year} heading={e.role} detail={e.detail} />
            ))}
          </Section>

          <Section title="Experience">
            {experience.map((e) => (
              <Entry key={e.id} year={e.year} heading={e.role} detail={e.detail} />
            ))}
          </Section>

          <Section title="Selected Projects">
            {allProjects.map((p) => (
              <div key={p.title} className="grid md:grid-cols-[150px_1fr] gap-1 md:gap-8">
                <span className="font-martian text-xs text-ink-3 uppercase tracking-[0.08em] md:pt-1">
                  {p.live ? 'Live' : p.status ? p.status : 'Open source'}
                </span>
                <div>
                  <h4 className="font-bricolage font-semibold text-lg tracking-[-0.01em] text-ink">
                    {p.title}
                    <span className="font-martian font-normal text-xs text-ink-2 ml-2 tracking-normal">
                      {p.tagline}
                    </span>
                  </h4>
                  <p className="font-martian text-[11px] tracking-[0.04em] text-ink-3 mt-1.5">
                    {p.tech.join(' · ')}
                  </p>
                </div>
              </div>
            ))}
          </Section>

          <Section title="Skills">
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
              {skillGroups.map((group) => (
                <div key={group.label}>
                  <h4 className="font-martian text-[11px] tracking-[0.14em] uppercase text-ink-3 mb-1.5">
                    {group.label}
                  </h4>
                  <p className="text-ink-2 text-[15px] leading-relaxed">
                    {group.items.join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
