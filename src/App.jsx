import React from 'react';

import Hero from './sections/Hero/Hero';
import Manifesto from './sections/Manifesto/Manifesto';
import Services from './sections/Services/Services';
import Projects from './sections/Projects/Projects';
import Process from './sections/Process/Process';
import Positioning from './sections/Positioning/Positioning';
import Sports from './sections/Sports/Sports';
import Contact from './sections/Contact/Contact';

import ProposalEntry from './proposal/pages/ProposalEntry';
import ProposalContext from './proposal/pages/ProposalContext';
import ProposalDiagnostico from './proposal/pages/ProposalDiagnostico';
import ProposalDirection from './proposal/pages/ProposalDirection';
import ProposalPlans from './proposal/pages/ProposalPlans';
import ProposalAdmin from './proposal/pages/ProposalAdmin';

function MainSite() {
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

function App() {
  const path = window.location.pathname;

  /* =====================================================
     ADMIN
  ===================================================== */

  if (path.startsWith('/admin/propostas')) {
    return <ProposalAdmin />;
  }

  /* =====================================================
     DIREÇÃO
  ===================================================== */

  if (path.includes('/direcao')) {
    return <ProposalDirection />;
  }

  /* =====================================================
     PLANOS
  ===================================================== */

  if (path.includes('/planos')) {
    return <ProposalPlans />;
  }

  /* =====================================================
     CONTEXTO
  ===================================================== */

  if (path.match(/^\/proposta\/[^/]+\/contexto\/?$/)) {
    return <ProposalContext />;
  }

  /* =====================================================
     DIAGNÓSTICO
  ===================================================== */

  if (path.match(/^\/proposta\/[^/]+\/diagnostico\/?$/)) {
    return <ProposalDiagnostico />;
  }

  /* =====================================================
     ENTRADA DA PROPOSTA
  ===================================================== */

  if (path.match(/^\/proposta\/[^/]+\/?$/)) {
    return <ProposalEntry />;
  }

  /* =====================================================
     SITE PRINCIPAL
  ===================================================== */

  return <MainSite />;
}

export default App;