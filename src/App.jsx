import React from 'react';

import Hero from './sections/Hero/Hero';
import Manifesto from './sections/Manifesto/Manifesto';
import Services from './sections/Services/Services';
import Projects from './sections/Projects/Projects';
import Process from './sections/Process/Process';
import Positioning from './sections/Positioning/Positioning';
import Sports from './sections/Sports/Sports';
import Contact from './sections/Contact/Contact';

import ProposalAdmin from './proposal/pages/ProposalAdmin';
import ProposalPedro from './proposal/pages/ProposalPedro';
import ProposalOuroCred from './proposal/pages/ProposalOuroCred';
import ProposalOuroCredOrcamento from './proposal/pages/ProposalOuroCredOrcamento';

import TreinamentoKreative from './treinamento/TreinamentoKreative';

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

  // =====================================================
  // TREINAMENTO KREATIVE
  // =====================================================

  if (
    path === '/treinamentokreative' ||
    path === '/treinamentokreative/'
  ) {
    return <TreinamentoKreative />;
  }

  // =====================================================
  // ADMIN DE PROPOSTAS
  // =====================================================

  if (
    path === '/admin/propostas' ||
    path === '/admin/propostas/'
  ) {
    return <ProposalAdmin />;
  }

  // =====================================================
  // ORÇAMENTO OURO CRED
  // =====================================================

  if (
    path === '/projetoourocred/orcamento' ||
    path === '/projetoourocred/orcamento/'
  ) {
    return <ProposalOuroCredOrcamento />;
  }

  // =====================================================
  // PROJETO OURO CRED
  // =====================================================

  if (
    path === '/projetoourocred' ||
    path === '/projetoourocred/'
  ) {
    return <ProposalOuroCred />;
  }

  // =====================================================
  // PROPOSTA PEDRO
  // =====================================================

  if (
    path === '/proposta/pedro-wiese' ||
    path === '/proposta/pedro-wiese/'
  ) {
    return <ProposalPedro />;
  }

  // =====================================================
  // SITE PRINCIPAL
  // =====================================================

  return <MainSite />;
}

export default App;