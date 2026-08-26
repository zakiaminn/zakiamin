import React from 'react';
import './index.css';
import ScrollProgress from './components/ScrollProgress';
import Nav from './components/Nav';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="grain relative min-h-screen bg-bg text-ink font-bricolage">
      <a
        href="#main"
        className="skip-link font-martian text-xs tracking-[0.15em] uppercase bg-bg text-ink border rule px-4 py-3"
      >
        Skip to content
      </a>
      <ScrollProgress />
      <Nav />
      <main id="main">
        <Hero />
        <About />
        <Experience />
        <Projects />
      </main>
      <Footer />
    </div>
  );
}
