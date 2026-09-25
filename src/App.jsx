import React from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Toolkit from './components/Toolkit';
import Footer from './components/Footer';
import Resume from './components/Resume';

export default function App() {
  return (
    <div className="relative min-h-screen bg-bg text-ink font-bricolage">
      <a href="#main" className="skip-link btn btn-solid">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        {/* The work leads: it is the proof, and a recruiter's first scroll
            should land on it rather than on a list of tools. */}
        <Projects />
        <Experience />
        <Toolkit />
      </main>
      <Footer />
      {/* One résumé dialog for the whole page, opened by the #resume hash. */}
      <Resume />
    </div>
  );
}
