import React, { useEffect, useRef, useState } from 'react';
import { LazyMotion } from 'framer-motion';
import { Masthead, StickyBar } from './components/Nav';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Toolkit from './components/Toolkit';
import Footer from './components/Footer';
import Resume from './components/Resume';

const loadMotionFeatures = () => import('./lib/motionFeatures').then((mod) => mod.default);

export default function App() {
  const mastRef = useRef(null);
  const [pastMast, setPastMast] = useState(false);

  // The slim bar takes over once the masthead has scrolled away.
  useEffect(() => {
    const el = mastRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setPastMast(!e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    // Framer Motion's features load after the page; the first screen animates in CSS.
    <LazyMotion features={loadMotionFeatures} strict>
      <div className="relative min-h-screen bg-bg text-ink font-bricolage">
        <a href="#main" className="skip-link btn btn-solid">
          Skip to content
        </a>
        <StickyBar show={pastMast} />
        <Masthead mastRef={mastRef} />
        <main id="main">
          <Hero />
          <Projects />
          <Experience />
          <Toolkit />
        </main>
        <Footer />
        <Resume />
      </div>
    </LazyMotion>
  );
}
