import React, { useEffect, useState } from 'react';
import '../styles/proposal-entry.css';

const DEFAULT_PROPOSAL = {
  number: '001',
  company: 'EMPRESA TESTE',
  owner: 'CAIO LOPES',
  date: '22 AGO 2026',
  email: 'contato@leosouzadsgn.com',
  validity: '22 AGO — 29 AGO 2026',
  validityDays: '07 DIAS',
};

function getCompanyFromPath() {
  const parts = window.location.pathname
    .split('/')
    .filter(Boolean);

  return parts[1] || 'empresa-teste';
}

function formatCompanyName(slug) {
  return slug
    .split('-')
    .filter(Boolean)
    .map((word) => {
      return (
        word.charAt(0).toUpperCase() +
        word.slice(1)
      );
    })
    .join(' ');
}

function ProposalEntry() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const [mouse, setMouse] = useState({
    x: 50,
    y: 50,
  });

  const [mouseActive, setMouseActive] = useState(false);

  const companySlug = getCompanyFromPath();

  const proposal = {
    ...DEFAULT_PROPOSAL,

    company:
      companySlug === 'empresa-teste'
        ? DEFAULT_PROPOSAL.company
        : formatCompanyName(companySlug).toUpperCase(),
  };

  /*
   * ========================================================
   * ENTRADA
   * ========================================================
   */

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  /*
   * ========================================================
   * MOUSE / PARALLAX
   * ========================================================
   */

  useEffect(() => {
    const handleMouseMove = (event) => {
      const x =
        (event.clientX / window.innerWidth) * 100;

      const y =
        (event.clientY / window.innerHeight) * 100;

      setMouse({
        x,
        y,
      });

      setMouseActive(true);
    };

    const handleMouseLeave = () => {
      setMouseActive(false);
    };

    window.addEventListener(
      'mousemove',
      handleMouseMove
    );

    document.addEventListener(
      'mouseleave',
      handleMouseLeave
    );

    return () => {
      window.removeEventListener(
        'mousemove',
        handleMouseMove
      );

      document.removeEventListener(
        'mouseleave',
        handleMouseLeave
      );
    };
  }, []);

  /*
   * ========================================================
   * ENTRAR NA PROPOSTA
   * ========================================================
   */

  const handleEnterProposal = () => {
    if (isLeaving) return;

    setIsLeaving(true);

    /*
     * A próxima página é CONTEXTO.
     *
     * Antes estava:
     *
     * /proposta/${companySlug}/apresentacao
     *
     * Essa rota não existe.
     *
     * Agora:
     *
     * /proposta/${companySlug}/contexto
     */

    window.setTimeout(() => {
      window.location.href =
        `/proposta/${companySlug}/contexto`;
    }, 850);
  };

  return (
    <div
      className={`
        proposal-entry
        ${isLoaded ? 'is-loaded' : ''}
        ${isLeaving ? 'is-leaving' : ''}
        ${mouseActive ? 'mouse-active' : ''}
      `}
      style={{
        '--mouse-x': `${mouse.x}%`,
        '--mouse-y': `${mouse.y}%`,
      }}
    >

      {/* ==================================================
          ATMOSFERA
      =================================================== */}

      <div className="proposal-bg" />

      <div className="proposal-grid" />

      <div className="proposal-noise" />

      <div className="proposal-light" />

      <div className="proposal-cursor-ring" />


      {/* ==================================================
          FRAME
      =================================================== */}

      <div className="proposal-frame">

        <span className="frame-corner frame-corner--tl" />
        <span className="frame-corner frame-corner--tr" />
        <span className="frame-corner frame-corner--bl" />
        <span className="frame-corner frame-corner--br" />

      </div>


      {/* ==================================================
          HEADER
      =================================================== */}

      <header className="proposal-header">

        <div className="proposal-logo">

          <div className="proposal-logo-reveal">

            <img
              src="/imagens/leo-souza.png"
              alt="Leo Souza DSGN"
            />

          </div>

        </div>


        <div className="proposal-header-right">

          <span>
            PROPOSTA
          </span>

          <strong>
            / {proposal.number}
          </strong>

        </div>

      </header>


      {/* ==================================================
          BACKGROUND TYPE
      =================================================== */}

      <div
        className="proposal-bg-company"
        aria-hidden="true"
      >
        {proposal.company}
      </div>


      <div
        className="proposal-bg-index"
        aria-hidden="true"
      >
        01
      </div>


      {/* ==================================================
          MAIN
      =================================================== */}

      <main className="proposal-main">

        <div className="proposal-content">


          {/* ================================================
              META
          ================================================= */}

          <div className="proposal-meta">

            <div className="proposal-meta-line" />

            <span>
              PRIVATE PROPOSAL
            </span>

          </div>


          {/* ================================================
              HERO
          ================================================= */}

          <section className="proposal-hero">

            <div className="proposal-overline">
              UMA VISÃO
            </div>


            <h1>

              <span className="hero-line hero-line-1">
                FOI PREPARADA
              </span>

              <span className="hero-line hero-line-2">
                PARA
              </span>

              <span className="hero-line hero-line-3">
                <em>SUA MARCA.</em>
              </span>

            </h1>

          </section>


          {/* ================================================
              CLIENTE
          ================================================= */}

          <section className="proposal-client">

            <div className="proposal-client-heading">

              <span>
                PREPARADA EXCLUSIVAMENTE PARA
              </span>

              <div className="proposal-client-number">
                001
              </div>

            </div>


            <h2>
              {proposal.company}
            </h2>


            <p>
              Uma análise estratégica foi construída
              para identificar oportunidades, pontos
              de atenção e caminhos possíveis para
              fortalecer sua presença.
            </p>

          </section>


          {/* ================================================
              ACTION
          ================================================= */}

          <section className="proposal-action">

            <button
              type="button"
              className="proposal-button"
              onClick={handleEnterProposal}
            >

              <span className="proposal-button-content">

                <small>
                  ACESSO PRIVADO
                </small>

                <strong>
                  EXPLORAR PROPOSTA
                </strong>

              </span>


              <span className="proposal-button-icon">
                ↗
              </span>

            </button>


            <div className="proposal-action-info">

              <span className="proposal-action-dot" />

              EXPERIÊNCIA DIGITAL PERSONALIZADA

            </div>

          </section>

        </div>

      </main>


      {/* ==================================================
          BOTTOM INFO
      =================================================== */}

      <footer className="proposal-footer">

        <div className="proposal-footer-block proposal-footer-validity">

          <span>
            VALIDADE DA PROPOSTA
          </span>

          <strong>
            {proposal.validity}
          </strong>

        </div>


        <div className="proposal-footer-block">

          <span>
            PREPARADO PARA
          </span>

          <strong>
            {proposal.owner}
          </strong>

        </div>


        <div className="proposal-footer-block">

          <span>
            CONTATO
          </span>

          <a href={`mailto:${proposal.email}`}>
            {proposal.email}
          </a>

        </div>


        <div className="proposal-footer-block">

          <span>
            DATA
          </span>

          <strong>
            {proposal.date}
          </strong>

        </div>


        <div className="proposal-footer-mark">

          <span className="proposal-footer-dot" />

          LEO SOUZA DSGN

        </div>

      </footer>


      {/* ==================================================
          MOVING PROPOSAL TICKER
      =================================================== */}

      <div className="proposal-ticker">

        <div className="proposal-ticker-track">


          <div className="proposal-ticker-group">

            <span className="proposal-ticker-item proposal-ticker-item--accent">

              <i />

              PROPOSTA EXCLUSIVA

            </span>


            <span className="proposal-ticker-separator">
              /
            </span>


            <span className="proposal-ticker-item">
              {proposal.company}
            </span>


            <span className="proposal-ticker-separator">
              /
            </span>


            <span className="proposal-ticker-item">
              LEO SOUZA DSGN
            </span>


            <span className="proposal-ticker-separator">
              /
            </span>


            <span className="proposal-ticker-item">
              ESTRATÉGIA
            </span>


            <span className="proposal-ticker-separator">
              /
            </span>


            <span className="proposal-ticker-item">
              POSICIONAMENTO
            </span>


            <span className="proposal-ticker-separator">
              /
            </span>


            <span className="proposal-ticker-item">
              IMAGEM
            </span>


            <span className="proposal-ticker-separator">
              /
            </span>


            <span className="proposal-ticker-item proposal-ticker-item--validity">
              VALIDADE 7 DIAS
            </span>


            <span className="proposal-ticker-separator">
              /
            </span>


            <span className="proposal-ticker-item">
              PROPOSTA {proposal.number}
            </span>

          </div>


          <div
            className="proposal-ticker-group"
            aria-hidden="true"
          >

            <span className="proposal-ticker-item proposal-ticker-item--accent">

              <i />

              PROPOSTA EXCLUSIVA

            </span>


            <span className="proposal-ticker-separator">
              /
            </span>


            <span className="proposal-ticker-item">
              {proposal.company}
            </span>


            <span className="proposal-ticker-separator">
              /
            </span>


            <span className="proposal-ticker-item">
              LEO SOUZA DSGN
            </span>


            <span className="proposal-ticker-separator">
              /
            </span>


            <span className="proposal-ticker-item">
              ESTRATÉGIA
            </span>


            <span className="proposal-ticker-separator">
              /
            </span>


            <span className="proposal-ticker-item">
              POSICIONAMENTO
            </span>


            <span className="proposal-ticker-separator">
              /
            </span>


            <span className="proposal-ticker-item">
              IMAGEM
            </span>


            <span className="proposal-ticker-separator">
              /
            </span>


            <span className="proposal-ticker-item proposal-ticker-item--validity">
              VALIDADE 7 DIAS
            </span>


            <span className="proposal-ticker-separator">
              /
            </span>


            <span className="proposal-ticker-item">
              PROPOSTA {proposal.number}
            </span>

          </div>

        </div>

      </div>


      {/* ==================================================
          EXIT
      =================================================== */}

      <div className="proposal-exit" />

    </div>
  );
}

export default ProposalEntry;