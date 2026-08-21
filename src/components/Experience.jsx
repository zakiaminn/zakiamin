import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const TIMELINE = [
  {
    id: 'sheridan',
    year: '2024 — Present',
    role: 'Computer Science Student, Sheridan College',
    detail: 'Specializing in Data Analytics — data pipelines, database management, and scalable software architecture. Currently building telemetry and analytics engines outside of coursework, not just for it.',
  },
  {
    id: 'freelance',
    year: '2022 — 2024',
    role: 'Freelance Web Developer',
    detail: 'Designed and built custom web applications for clients, including a real estate platform with dynamic listing logic, custom React components, and interface polish clients actually noticed.',
  },
  {
    id: 'calgary',
    year: '2021 — 2023',
    role: 'Undergraduate Studies, University of Calgary',
    detail: 'Foundational computer science coursework — the algorithms and software design fundamentals everything since has built on.',
  },
];

export default function Experience() {
  return (
    <section id="experience" className="w-full max-w-6xl mx-auto px-6 py-20 md:py-28 scroll-mt-24">
      <div className="flex items-baseline gap-4 mb-12 md:mb-16">
        <span className="font-mono text-sm text-flame">&sect; 02</span>
        <h2 className="font-display text-3xl md:text-4xl text-ink">Experience &amp; Education</h2>
      </div>

      {/* Most recent entry opens by default, so the section never reads as empty. */}
      <Accordion type="single" collapsible defaultValue="sheridan" className="border-t rule">
        {TIMELINE.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger>
              <div className="grid md:grid-cols-[220px_1fr] gap-2 md:gap-10 flex-1">
                <span className="font-mono text-sm text-flame md:pt-1">{item.year}</span>
                {/* Radix's AccordionHeader already renders the h3 — this is just its text. */}
                <span className="block font-display text-xl md:text-2xl text-ink balance">{item.role}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-inkSoft leading-relaxed max-w-2xl">{item.detail}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
