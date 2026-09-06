import React, { lazy, Suspense } from 'react';

import AdminDashboard from './pagamentos/pages/AdminDashboard';
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
import ProposalFernando from './proposal/pages/ProposalFernando';

import TreinamentoKreative from './treinamento/TreinamentoKreative';

/*
=====================================================
CENTRAL DE PAGAMENTOS

O AdminLogin é carregado SOMENTE quando a rota
/pagamentos/admin for acessada.

Isso impede que um erro no sistema de pagamentos
derrube o site principal inteiro.
=====================================================
*/

const AdminLogin = lazy(
  () => import('./pagamentos/pages/AdminLogin')
);

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

function LoadingPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      Carregando...
    </main>
  );
}

function App() {
  const path = window.location.pathname;

  /*
  =====================================================
  CENTRAL DE PAGAMENTOS - LOGIN ADMIN
  =====================================================
  */

  if (
    path === '/pagamentos/admin' ||
    path === '/pagamentos/admin/'
  ) {
    return (
      <Suspense fallback={<LoadingPage />}>
        <AdminLogin />
      </Suspense>
    );
  }

  /*
  =====================================================
  CENTRAL DE PAGAMENTOS - DASHBOARD
  =====================================================
  */

  if (
    path === '/pagamentos/admin/dashboard' ||
    path === '/pagamentos/admin/dashboard/'
  ) {
    return <AdminDashboard />;
  }

  /*
  =====================================================
  TREINAMENTO COMERCIAL KREATIVE
  =====================================================
  */

  if (
    path === '/treinamentokreative' ||
    path === '/treinamentokreative/'
  ) {
    return <TreinamentoKreative />;
  }

  /*
  =====================================================
  ADMIN DE PROPOSTAS
  =====================================================
  */

  if (path.startsWith('/admin/propostas')) {
    return <ProposalAdmin />;
  }

  /*
  =====================================================
  PROPOSTA FERNANDO BARTENDER
  =====================================================
  */

  if (
    path === '/proposta/fernando-veiga' ||
    path === '/proposta/fernando-veiga/'
  ) {
    return <ProposalFernando />;
  }

  /*
  =====================================================
  DIREÇÃO
  =====================================================
  */

  if (path.includes('/direcao')) {
    return <ProposalDirection />;
  }

  /*
  =====================================================
  PLANOS
  =====================================================
  */

  if (path.includes('/planos')) {
    return <ProposalPlans />;
  }

  /*
  =====================================================
  CONTEXTO
  =====================================================
  */

  if (
    /^\/proposta\/[^/]+\/contexto\/?$/.test(path)
  ) {
    return <ProposalContext />;
  }

  /*
  =====================================================
  DIAGNÓSTICO
  =====================================================
  */

  if (
    /^\/proposta\/[^/]+\/diagnostico\/?$/.test(path)
  ) {
    return <ProposalDiagnostico />;
  }

  /*
  =====================================================
  ENTRADA DA PROPOSTA
  =====================================================
  */

  if (
    /^\/proposta\/[^/]+\/?$/.test(path)
  ) {
    return <ProposalEntry />;
  }

  /*
  =====================================================
  SITE PRINCIPAL
  =====================================================
  */

  return <MainSite />;
}

export default App;