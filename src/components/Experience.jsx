import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { timeline as TIMELINE } from '@/data/profile';
import posthog from '@/lib/posthog';

export default function Experience() {
  return (
    <section id="experience" className="w-full max-w-6xl mx-auto px-6 py-20 md:py-28 scroll-mt-24">
      <h2 className="font-bricolage font-bold text-3xl md:text-4xl tracking-[-0.02em] text-ink mb-12 md:mb-16">Experience &amp; Education</h2>

      {/* Most recent entry opens by default, so the section never reads as empty. */}
      <Accordion
        type="single"
        collapsible
        defaultValue="sheridan"
        className="border-t rule"
        onValueChange={(value) => {
          if (value) {
            const item = TIMELINE.find((t) => t.id === value);
            posthog.capture('experience_item_expanded', {
              entry_id: value,
              entry_kind: item?.kind ?? 'unknown',
            });
          }
        }}
      >
        {TIMELINE.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger>
              <div className="grid md:grid-cols-[220px_1fr] gap-2 md:gap-10 flex-1">
                <span className="font-martian text-sm text-brand-ink md:pt-1 tnum">{item.year}</span>
                {/* Radix's AccordionHeader already renders the h3 — this is just its text. */}
                <span className="block font-bricolage font-semibold text-xl md:text-2xl tracking-[-0.01em] text-ink balance">{item.role}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-ink-2 leading-relaxed max-w-2xl">{item.detail}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
