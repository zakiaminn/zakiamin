import React from 'react';
import './index.css';
import Nav from './components/Nav';
import Ticker from './components/Ticker';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="grain relative min-h-screen bg-paper text-ink font-sans">
      <Nav />
      <Ticker />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
      </main>
      <Footer />
    </div>
  );
}
