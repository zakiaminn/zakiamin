import React, { useState } from 'react';
import HalftonePortrait from './HalftonePortrait';
import { MaskLines, Reveal } from '@/components/ui/motion';
import { PAGE } from '@/components/Nav';
import posthog from '@/lib/posthog';
import zakiPhoto from '../assets/zaki-photo.png';

/** The lead story: the headline, and the halftone portrait as the front-page photo. */
export default function Hero() {
  const [dots, setDots] = useState(null);

  return (
    <section aria-labelledby="hero-heading" className={PAGE}>
      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)] border-b-2 border-ink">
        <div className="flex flex-col pt-8 pb-10 lg:pt-10 lg:pr-12 lg:border-r lg:border-rule">
          <h1 id="hero-heading" className="font-bold text-[clamp(2.6rem,5.4vw,4.75rem)] leading-[0.98] tracking-[-0.035em] text-ink">
            <MaskLines
              delay={0.55}
              lines={[
                <>I make data <span className="swipe swipe-in" style={{ animationDelay: '1150ms' }}>legible</span></>,
                'and software real.',
              ]}
            />
          </h1>

          <Reveal inView={false} delay={0.85} className="mt-7 max-w-[34rem]">
            <p className="text-lg md:text-xl leading-relaxed text-ink-2 pretty">
              I’m Zaki Amin Ahmad, a Data Analytics student and full-stack engineer. I build data
              pipelines and the products around them, from the schema to the shipped interface.
            </p>
          </Reveal>

          <Reveal inView={false} delay={0.95} className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#work"
              onClick={() => posthog.capture('hero_cta_clicked', { cta: 'work' })}
              className="btn btn-primary btn-lg"
            >
              See the work
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true" fill="none"
                   stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3v10M3.5 8.5 8 13l4.5-4.5" />
              </svg>
            </a>
            <a
              href="#resume"
              onClick={() => posthog.capture('resume_link_clicked', { source: 'hero' })}
              className="btn btn-lg"
            >
              Open the résumé
            </a>
          </Reveal>

          <blockquote className="mt-auto pt-10">
            <p className="text-sm text-ink-3 pretty">“To live without risk is to risk without living.”</p>
          </blockquote>
        </div>

        <figure className="pt-2 pb-8 lg:pt-10 lg:pl-10 max-w-sm mx-auto w-full lg:max-w-none">
          <HalftonePortrait
            src={zakiPhoto}
            crop={[1 / 6, 0.2, 0.5, 0.5]}
            onDotCount={setDots}
            label="Halftone portrait of Zaki Amin Ahmad, printed as a grid of dots"
          />
          <figcaption
            className="mt-3 text-sm text-ink-3 min-h-[1.25rem] transition-opacity duration-300"
            style={{ opacity: dots ? 1 : 0 }}
            aria-hidden={dots ? undefined : true}
          >
            Printed in <span className="num text-ink-2">{dots ? dots.toLocaleString('en-US') : '0'}</span> dots of ink.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
