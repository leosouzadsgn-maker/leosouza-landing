import React, { useEffect, useState } from 'react';
import '../styles/proposal-context.css';

const DEFAULT_PROPOSAL = {
  number: '001',
  company: 'MARECHAL',
  owner: 'CAIO LOPES',
  date: '22 AGO 2026',
  nextSection: 'DIAGNÓSTICO',
};

function getCompanyFromPath() {
  const parts = window.location.pathname
    .split('/')
    .filter(Boolean);

  return parts[1] || 'marechal';
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

function ProposalContext() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const [mouse, setMouse] = useState({
    x: 50,
    y: 50,
  });

  const companySlug = getCompanyFromPath();

  const proposal = {
    ...DEFAULT_PROPOSAL,

    company:
      companySlug === 'marechal'
        ? DEFAULT_PROPOSAL.company
        : formatCompanyName(companySlug).toUpperCase(),
  };

  /*
   * =========================================================
   * ENTRADA
   * =========================================================
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
   * =========================================================
   * MOUSE / PARALLAX
   * =========================================================
   */

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMouse({
        x: (event.clientX / window.innerWidth) * 100,
        y: (event.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  /*
   * =========================================================
   * PRÓXIMA SEÇÃO
   * =========================================================
   */

  const goToNextSection = () => {
    if (isLeaving) return;

    setIsLeaving(true);

    window.setTimeout(() => {
      window.location.assign(
        `/proposta/${companySlug}/diagnostico`
      );
    }, 550);
  };

  return (
    <div
      className={`
        proposal-context
        ${isLoaded ? 'is-loaded' : ''}
        ${isLeaving ? 'is-leaving' : ''}
      `}
      style={{
        '--mouse-x': `${mouse.x}%`,
        '--mouse-y': `${mouse.y}%`,
      }}
    >

      {/* =====================================================
          ATMOSFERA
      ===================================================== */}

      <div className="context-bg" />
      <div className="context-grid" />
      <div className="context-noise" />
      <div className="context-light" />

      {/* =====================================================
          FRAME
      ===================================================== */}

      <div className="context-frame">
        <span className="context-corner context-corner--tl" />
        <span className="context-corner context-corner--tr" />
        <span className="context-corner context-corner--bl" />
        <span className="context-corner context-corner--br" />
      </div>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="context-header">

        <div className="context-brand">
          <div className="context-brand-reveal">
            <img
              src="/imagens/leo-souza.png"
              alt="Leo Souza DSGN"
            />
          </div>
        </div>

        <div className="context-header-meta">
          <span>PROPOSTA</span>
          <strong>/ {proposal.number}</strong>
        </div>

      </header>

      {/* =====================================================
          ÍNDICE LATERAL
      ===================================================== */}

      <aside className="context-side-index">

        <span>02</span>

        <div className="context-side-line">
          <i />
        </div>

        <span>08</span>

        <small>CONTEXTO</small>

      </aside>

      {/* =====================================================
          NÚMERO GIGANTE
      ===================================================== */}

      <div
        className="context-bg-number"
        aria-hidden="true"
      >
        02
      </div>

      {/* =====================================================
          EMPRESA AO FUNDO
      ===================================================== */}

      <div
        className="context-bg-company"
        aria-hidden="true"
      >
        {proposal.company}
      </div>

      {/* =====================================================
          CONTEÚDO
      ===================================================== */}

      <main className="context-main">

        {/* ===================================================
            INTRO
        =================================================== */}

        <section className="context-intro">

          <div className="context-kicker">
            <span className="context-kicker-line" />
            <span>02 / 08</span>
            <span>CONTEXTO</span>
          </div>

          <div className="context-intro-grid">

            <div className="context-intro-left">

              <span className="context-eyebrow">
                ANTES DE PROPOR UMA SOLUÇÃO
              </span>

              <h1>
                PRIMEIRO,
                <br />

                <span>PRECISAMOS</span>

                <br />

                ENTENDER.
              </h1>

            </div>

            <div className="context-intro-right">

              <div className="context-intro-number">
                01
              </div>

              <p>
                Toda decisão estratégica começa
                com uma leitura precisa do cenário
                atual.
              </p>

              <p>
                Por isso, antes de pensar em
                estética, conteúdo ou comunicação,
                analisamos onde a marca está,
                como ela está sendo percebida e
                quais oportunidades estão sendo
                deixadas de lado.
              </p>

            </div>

          </div>

        </section>

        {/* ===================================================
            DIVISOR
        =================================================== */}

        <div className="context-divider">

          <span>LEITURA ESTRATÉGICA</span>

          <div />

          <span>{proposal.company}</span>

        </div>

        {/* ===================================================
            PILARES
        =================================================== */}

        <section className="context-pillars">

          <div className="context-section-heading">

            <span>O QUE FOI OBSERVADO</span>

            <h2>
              QUATRO PONTOS.
              <br />
              UMA VISÃO.
            </h2>

          </div>

          <div className="context-pillar-list">

            {/* 01 */}

            <article className="context-pillar">

              <div className="context-pillar-top">
                <span>01</span>
                <span>PRESENÇA</span>
              </div>

              <div className="context-pillar-body">

                <h3>
                  COMO A MARCA
                  <br />
                  APARECE.
                </h3>

                <p>
                  A primeira percepção acontece
                  antes mesmo de alguém conhecer
                  profundamente o negócio.
                </p>

              </div>

              <span className="context-pillar-arrow">
                ↗
              </span>

            </article>

            {/* 02 */}

            <article className="context-pillar">

              <div className="context-pillar-top">
                <span>02</span>
                <span>POSICIONAMENTO</span>
              </div>

              <div className="context-pillar-body">

                <h3>
                  COMO A MARCA
                  <br />
                  É PERCEBIDA.
                </h3>

                <p>
                  Não basta estar presente.
                  É necessário ocupar um espaço
                  claro na cabeça de quem observa.
                </p>

              </div>

              <span className="context-pillar-arrow">
                ↗
              </span>

            </article>

            {/* 03 */}

            <article className="context-pillar">

              <div className="context-pillar-top">
                <span>03</span>
                <span>COMUNICAÇÃO</span>
              </div>

              <div className="context-pillar-body">

                <h3>
                  O QUE A MARCA
                  <br />
                  ESTÁ DIZENDO.
                </h3>

                <p>
                  Identidade, conteúdo e mensagem
                  precisam trabalhar na mesma
                  direção.
                </p>

              </div>

              <span className="context-pillar-arrow">
                ↗
              </span>

            </article>

            {/* 04 */}

            <article className="context-pillar">

              <div className="context-pillar-top">
                <span>04</span>
                <span>OPORTUNIDADE</span>
              </div>

              <div className="context-pillar-body">

                <h3>
                  O QUE PODE
                  <br />
                  SER MELHOR.
                </h3>

                <p>
                  O diagnóstico existe para revelar
                  caminhos que talvez ainda não
                  estejam sendo explorados.
                </p>

              </div>

              <span className="context-pillar-arrow">
                ↗
              </span>

            </article>

          </div>

        </section>

        {/* ===================================================
            FRASE CENTRAL
        =================================================== */}

        <section className="context-statement">

          <div className="context-statement-index">
            02
          </div>

          <div className="context-statement-content">

            <span>
              UMA LEITURA FEITA PARA {proposal.company}
            </span>

            <h2>
              NÃO É SOBRE
              <br />
              <em>APONTAR PROBLEMAS.</em>
            </h2>

            <p>
              É sobre enxergar com clareza
              onde existe espaço para evolução
              e transformar essa leitura em
              direção.
            </p>

          </div>

        </section>

        {/* ===================================================
            INFORMAÇÕES
        =================================================== */}

        <section className="context-data">

          <div className="context-data-line">

            <span>ANÁLISE REALIZADA</span>

            <strong>
              {proposal.date}
            </strong>

          </div>

          <div className="context-data-line">

            <span>CLIENTE</span>

            <strong>
              {proposal.company}
            </strong>

          </div>

          <div className="context-data-line">

            <span>PREPARADO PARA</span>

            <strong>
              {proposal.owner}
            </strong>

          </div>

        </section>

        {/* ===================================================
            PRÓXIMA SEÇÃO
        =================================================== */}

        <section className="context-next">

          <div className="context-next-content">

            <span>
              PRÓXIMO CAPÍTULO
            </span>

            <h2>
              DIAGNÓSTICO
            </h2>

            <p>
              Agora vamos mostrar
              o que encontramos.
            </p>

            <button
              type="button"
              onClick={goToNextSection}
              className="context-next-button"
              disabled={isLeaving}
            >

              <span>
                {isLeaving
                  ? 'ABRINDO...'
                  : 'CONTINUAR'}
              </span>

              <strong>
                ↘
              </strong>

            </button>

          </div>

        </section>

      </main>

      {/* =====================================================
          FAIXA ROLANTE — CAPÍTULO ATUAL
      ===================================================== */}

      <div className="proposal-section-ticker">

        <div className="proposal-section-ticker-track">

          <div className="proposal-section-ticker-group">

            <span>
              <i />
              MARECHAL
            </span>

            <b>/</b>

            <span className="current">
              CONTEXTO
            </span>

            <b>/</b>

            <span>
              LEO SOUZA DSGN
            </span>

            <b>/</b>

            <span>
              ESTRATÉGIA
            </span>

            <b>/</b>

            <span>
              POSICIONAMENTO
            </span>

            <b>/</b>

            <span>
              IMAGEM
            </span>

            <b>/</b>

            <span>
              02 / 08
            </span>

            <b>/</b>

          </div>

          <div
            className="proposal-section-ticker-group"
            aria-hidden="true"
          >

            <span>
              <i />
              MARECHAL
            </span>

            <b>/</b>

            <span className="current">
              CONTEXTO
            </span>

            <b>/</b>

            <span>
              LEO SOUZA DSGN
            </span>

            <b>/</b>

            <span>
              ESTRATÉGIA
            </span>

            <b>/</b>

            <span>
              POSICIONAMENTO
            </span>

            <b>/</b>

            <span>
              IMAGEM
            </span>

            <b>/</b>

            <span>
              02 / 08
            </span>

            <b>/</b>

          </div>

        </div>

      </div>

      {/* =====================================================
          TRANSIÇÃO
      ===================================================== */}

      <div className="context-transition">

        <div className="context-transition-layer">

          <div className="context-transition-top">
            PRÓXIMA SEÇÃO
          </div>

          <div className="context-transition-title">
            DIAGNÓSTICO
          </div>

          <div className="context-transition-bottom">
            03 / 08
          </div>

        </div>

      </div>

    </div>
  );
}

export default ProposalContext;