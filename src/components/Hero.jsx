import React from 'react';
import HalftonePortrait from './HalftonePortrait';
import { profile } from '@/data/profile';
import zakiPhoto from '../assets/zaki-photo.png';

export default function Hero() {
  return (
    <header id="top" className="w-full max-w-6xl mx-auto px-6 pt-14 pb-24 md:pt-20 md:pb-32">
      <div className="grid md:grid-cols-[1.05fr_0.95fr] gap-14 md:gap-12 items-start">
        <div className="rise-in">
          <p className="font-martian text-xs tracking-[0.14em] uppercase text-brand-ink mb-6">
            Seeking {profile.seeking} · {profile.location}
          </p>

          <h1 className="font-bricolage font-bold text-5xl sm:text-6xl leading-[1.03] tracking-[-0.03em] text-ink mb-7 balance">
            I make data <span className="swipe">legible</span> and software real.
          </h1>

          <p className="text-lg md:text-xl text-ink-2 leading-relaxed max-w-xl mb-10">
            Data Analytics student and full-stack engineer building data pipelines
            and the products around them, from schema to shipped interface.
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            <a
              href="#projects"
              className="font-martian text-xs tracking-[0.12em] uppercase font-semibold bg-brand text-brand-fg
                         inline-flex items-center min-h-[44px] px-5 hover:brightness-95 transition"
            >
              View the work &darr;
            </a>
            <a
              href="#resume"
              className="font-martian text-xs tracking-[0.12em] uppercase font-semibold text-ink border rule
                         inline-flex items-center min-h-[44px] px-5 transition-colors
                         hover:bg-brand hover:text-brand-fg hover:border-brand"
            >
              View résumé
            </a>
          </div>
        </div>

        <div className="relative rise-in" style={{ animationDelay: '0.15s' }}>
          <HalftonePortrait src={zakiPhoto} label="Halftone portrait of Zaki Amin, printed as a grid of dots" />
        </div>
      </div>
    </header>
  );
}
