import React from 'react';
import Hero from './sections/Hero/Hero';
import Manifesto from './sections/Manifesto/Manifesto';
import Services from './sections/Services/Services';
import Projects from './sections/Projects/Projects';
import Process from './sections/Process/Process';
import Positioning from './sections/Positioning/Positioning';
import Sports from './sections/Sports/Sports';
import Contact from './sections/Contact/Contact';


function App() {
  return (
    <main>
      <Hero />
      <Manifesto />
      <Services />
      <Projects />
      <Process />
      <Positioning />
      <Sports />
      <Contact />
    </main>
  );
}

export default App;