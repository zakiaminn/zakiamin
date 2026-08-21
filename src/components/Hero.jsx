import React from 'react';
import HalftonePortrait from './HalftonePortrait';
import zakiPhoto from '../assets/zaki-photo.png';

export default function Hero() {
  return (
    <header id="top" className="w-full max-w-6xl mx-auto px-6 pt-14 pb-24 md:pt-20 md:pb-32">
      <div className="grid md:grid-cols-[1.05fr_0.95fr] gap-14 md:gap-12 items-center">
        <div className="rise-in">
          <p className="font-mono text-xs tracking-[0.25em] uppercase text-flame mb-6">
            Vol. 01 — Toronto, Canada
          </p>

          <h1 className="font-display font-medium text-6xl sm:text-7xl lg:text-8xl leading-[1.02] text-ink mb-8 balance">
            Hi, I&rsquo;m{' '}
            <span className="misprint">
              Zaki.
              <span className="misprint-ghost" aria-hidden="true">Zaki.</span>
            </span>
            <br />
            I make data <span className="italic">legible</span> and software <span className="italic">real</span>.
          </h1>

          <p className="text-lg md:text-xl text-inkSoft leading-relaxed max-w-xl mb-10">
            Data analytics student and full-stack engineer. I build the pipelines that turn raw
            numbers into decisions — real-time options order flow, a fake stock market for GitHub
            repos — and the applications people actually use, down to a tool for shattering the
            DOM when it deserves it.
          </p>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <a href="#projects" className="ink-link font-mono text-sm tracking-[0.1em] uppercase text-ink font-bold inline-flex items-center min-h-[44px]">
              View the work &darr;
            </a>
            <a href="#contact" className="ink-link font-mono text-sm tracking-[0.1em] uppercase text-inkSoft inline-flex items-center min-h-[44px]">
              Get in touch
            </a>
          </div>
        </div>

        <div className="relative rise-in" style={{ animationDelay: '0.15s' }}>
          <div className="relative">
            <HalftonePortrait src={zakiPhoto} label="Halftone portrait of Zaki Amin, printed as a grid of dots" />

            <div className="absolute top-10 left-[8%]">
              <span className="stamp inline-block font-mono text-[11px] tracking-[0.1em] uppercase bg-paperDim border rule px-2.5 py-1 whitespace-nowrap">
                CS @ Sheridan College
              </span>
            </div>
            <div className="absolute bottom-16 left-[2%]">
              <span className="stamp inline-block font-mono text-[11px] tracking-[0.1em] uppercase bg-paperDim border rule px-2.5 py-1 whitespace-nowrap">
                Builds: Web · Data · Mobile
              </span>
            </div>
          </div>
          <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-inkFaint mt-3">
            Fig. 1 — halftone plate, live. move your cursor over it.
          </p>
        </div>
      </div>
    </header>
  );
}
