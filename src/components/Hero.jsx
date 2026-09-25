import React, { useState } from 'react';
import HalftonePortrait from './HalftonePortrait';
import { profile } from '@/data/profile';
import posthog from '@/lib/posthog';
import zakiPhoto from '../assets/zaki-photo.png';

const step = (i) => ({ animationDelay: `${i * 60}ms` });

export default function Hero() {
  const [dots, setDots] = useState(null);

  return (
    <header id="top" className="w-full max-w-6xl mx-auto px-6 pt-12 pb-20 md:pt-20 md:pb-28">
      <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-12 md:gap-12 items-start">
        <div className="md:pt-6">
          <p className="label text-brand-ink mb-6 rise" style={step(0)}>
            Seeking a {profile.seeking} · {profile.location.split(',')[0]}
          </p>

          <h1
            className="font-bold text-5xl sm:text-6xl leading-[1.02] tracking-[-0.035em] text-ink mb-7 balance rise"
            style={step(1)}
          >
            I make data <span className="swipe swipe-in">legible</span> and software real.
          </h1>

          <p className="text-lg md:text-xl text-ink-2 leading-relaxed max-w-xl mb-10 pretty rise" style={step(2)}>
            I’m Zaki Amin, a Data Analytics student and full-stack engineer. I build
            data pipelines and the products around them, from the schema to the
            shipped interface.
          </p>

          <div className="flex flex-wrap items-center gap-3 rise" style={step(3)}>
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
          </div>
        </div>

        <figure className="relative max-w-md mx-auto w-full md:max-w-none">
          <HalftonePortrait
            src={zakiPhoto}
            crop={[1 / 6, 0.2, 0.5, 0.5]}
            onDotCount={setDots}
            label="Halftone portrait of Zaki Amin, printed as a grid of dots"
          />
          <figcaption
            className="mt-4 text-sm text-ink-3 text-center md:text-right min-h-[1.25rem] transition-opacity duration-300"
            style={{ opacity: dots ? 1 : 0 }}
            aria-hidden={dots ? undefined : true}
          >
            Printed in <span className="num text-ink-2">{dots ? dots.toLocaleString('en-US') : '0'}</span> dots of ink.
          </figcaption>
        </figure>
      </div>
    </header>
  );
}
