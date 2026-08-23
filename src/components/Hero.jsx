import React from 'react';
import HalftonePortrait from './HalftonePortrait';
import zakiPhoto from '../assets/zaki-photo.png';

export default function Hero() {
  return (
    <header id="top" className="w-full max-w-6xl mx-auto px-6 pt-14 pb-24 md:pt-20 md:pb-32">
      <div className="grid md:grid-cols-[1.05fr_0.95fr] gap-14 md:gap-12 items-center">
        <div className="rise-in">
          <p className="font-martian text-xs tracking-[0.14em] uppercase text-brand-ink mb-6">
            Vol. 01 — Toronto, Canada
          </p>

          <h1 className="font-bricolage font-bold text-6xl sm:text-7xl lg:text-8xl leading-[1.02] tracking-[-0.03em] text-ink mb-8 balance">
            Hi, I&rsquo;m{' '}
            <span className="misprint">
              Zaki.
              <span className="misprint-ghost" aria-hidden="true">Zaki.</span>
            </span>
            <br />
            I make data <span className="swipe">legible</span> and software <span className="swipe">real</span>.
          </h1>

          <p className="text-lg md:text-xl text-ink-2 leading-relaxed max-w-xl mb-10">
            Data analytics student and full-stack engineer. I build the pipelines that turn raw
            numbers into decisions — real-time options order flow, a fake stock market for GitHub
            repos — and the applications people actually use, down to a tool for shattering the
            DOM when it deserves it.
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
              href="#contact"
              className="ink-link font-martian text-xs tracking-[0.12em] uppercase text-ink-2 hover:text-ink
                         inline-flex items-center min-h-[44px]"
            >
              Get in touch
            </a>
          </div>
        </div>

        <div className="relative rise-in" style={{ animationDelay: '0.15s' }}>
          <div className="relative">
            <HalftonePortrait src={zakiPhoto} label="Halftone portrait of Zaki Amin, printed as a grid of dots" />

            <div className="absolute top-10 left-[8%]">
              <span className="stamp inline-block font-martian text-[11px] tracking-[0.1em] uppercase bg-surface border rule px-2.5 py-1 whitespace-nowrap">
                CS @ Sheridan College
              </span>
            </div>
            <div className="absolute bottom-16 left-[2%]">
              <span className="stamp inline-block font-martian text-[11px] tracking-[0.1em] uppercase bg-surface border rule px-2.5 py-1 whitespace-nowrap">
                Builds: Web · Data · Mobile
              </span>
            </div>
          </div>
          <p className="font-martian text-[11px] tracking-[0.1em] uppercase text-ink-3 mt-3">
            Fig. 1 — halftone plate, live. move your cursor over it.
          </p>
        </div>
      </div>
    </header>
  );
}
