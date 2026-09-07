import React, { lazy, Suspense } from 'react';

import AdminDashboard from './pagamentos/pages/AdminDashboard';
import FinancialManagement from './pagamentos/pages/FinancialManagement';
import Charges from './pagamentos/pages/Charges';
import Brands from './pagamentos/pages/Brands';

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
        background: '#070707',
        color: '#ffffff',
        fontFamily: 'Inter, Arial, sans-serif',
      }}
    >
      Carregando...
    </main>
  );
}

/*
=====================================================
PÁGINA DE RETORNO DO PAGAMENTO
=====================================================
*/

function PaymentReturnPage() {
  const params = new URLSearchParams(
    window.location.search
  );

  const chargeId = params.get('charge_id');

  return (
    <main
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top, rgba(239,43,53,.10), transparent 35%), #070707',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        fontFamily: 'Inter, Arial, sans-serif',
      }}
    >
      <section
        style={{
          width: '100%',
          maxWidth: 520,
          padding: 34,
          borderRadius: 18,
          border:
            '1px solid rgba(255,255,255,.10)',
          background: '#101010',
          boxShadow:
            '0 30px 90px rgba(0,0,0,.45)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            margin: '0 auto 18px',
            background:
              'rgba(34,197,94,.10)',
            border:
              '1px solid rgba(34,197,94,.25)',
            color: '#22c55e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 30,
            fontWeight: 800,
          }}
        >
          ✓
        </div>

        <div
          style={{
            fontSize: 25,
            fontWeight: 800,
            letterSpacing: '-.03em',
          }}
        >
          Pagamento recebido
        </div>

        <p
          style={{
            margin: '10px auto 0',
            maxWidth: 390,
            color: '#888',
            fontSize: 13,
            lineHeight: 1.6,
          }}
        >
          Obrigado pelo pagamento. Estamos
          processando a confirmação da transação.
        </p>

        {chargeId && (
          <div
            style={{
              marginTop: 20,
              padding: 13,
              borderRadius: 10,
              background: '#0b0b0b',
              border:
                '1px solid rgba(255,255,255,.07)',
              color: '#666',
              fontSize: 10,
              wordBreak: 'break-all',
            }}
          >
            Referência da cobrança:{' '}
            {chargeId}
          </div>
        )}

        <div
          style={{
            marginTop: 22,
            paddingTop: 18,
            borderTop:
              '1px solid rgba(255,255,255,.08)',
            color: '#555',
            fontSize: 11,
            lineHeight: 1.5,
          }}
        >
          O comprovante personalizado será
          disponibilizado após a confirmação
          definitiva do pagamento.
        </div>
      </section>
    </main>
  );
}

function App() {
  const path = window.location.pathname;

  /*
  =====================================================
  CENTRAL DE PAGAMENTOS - LOGIN
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
  CENTRAL DE PAGAMENTOS - COBRANÇAS
  =====================================================
  */

  if (
    path === '/pagamentos/admin/cobrancas' ||
    path === '/pagamentos/admin/cobrancas/'
  ) {
    return <Charges />;
  }

  /*
  =====================================================
  CENTRAL DE PAGAMENTOS - MARCAS / PROJETOS
  =====================================================
  */

  if (
    path === '/pagamentos/admin/marcas' ||
    path === '/pagamentos/admin/marcas/'
  ) {
    return <Brands />;
  }

  /*
  =====================================================
  CENTRAL DE PAGAMENTOS - GESTÃO FINANCEIRA
  =====================================================
  */

  if (
    path === '/pagamentos/admin/financeiro' ||
    path === '/pagamentos/admin/financeiro/'
  ) {
    return <FinancialManagement />;
  }

  /*
  =====================================================
  RETORNO DO CHECKOUT INFINITEPAY
  =====================================================
  */

  if (
    path === '/pagamentos/confirmado' ||
    path === '/pagamentos/confirmado/'
  ) {
    return <PaymentReturnPage />;
  }

  /*
  =====================================================
  TREINAMENTO KREATIVE
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
  PROPOSTA FERNANDO
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

  if (/^\/proposta\/[^/]+\/?$/.test(path)) {
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