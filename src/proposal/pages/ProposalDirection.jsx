import React, { useEffect, useState } from 'react';
import '../styles/proposal-direction.css';

function getCompanyFromPath() {
  const parts = window.location.pathname.split('/').filter(Boolean);
  return parts[1] || 'marechal';
}

function formatCompanyName(slug) {
  return slug
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function ProposalDirection() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const companySlug = getCompanyFromPath();
  const company =
    companySlug === 'marechal'
      ? 'MARECHAL'
      : formatCompanyName(companySlug).toUpperCase();

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoaded(true), 80);
    return () => window.clearTimeout(timer);
  }, []);

  const goToPlans = () => {
    if (isLeaving) return;

    setIsLeaving(true);

    window.setTimeout(() => {
      window.location.href = `/proposta/${companySlug}/planos`;
    }, 600);
  };

  return (
    <div className={`proposal-direction ${isLoaded ? 'is-loaded' : ''} ${isLeaving ? 'is-leaving' : ''}`}>
      <div className="direction-bg" />
      <div className="direction-noise" />
      <div className="direction-grid" />

      <div className="direction-company-bg" aria-hidden="true">
        {company}
      </div>

      <header className="direction-header">
        <div className="direction-brand">
          LÉO SOUZA
          <small>DESIGNER · ESTRATEGISTA · IMAGEM</small>
        </div>

        <div className="direction-meta">
          <span>PROPOSTA</span>
          <strong>/ 001</strong>
        </div>
      </header>

      <aside className="direction-index">
        <span>03</span>
        <i />
        <span>08</span>
        <small>DIREÇÃO</small>
      </aside>

      <main className="direction-main">

        <section className="direction-hero">
          <div className="direction-kicker">
            <span />
            <span>03 / 08</span>
            <span>DIREÇÃO</span>
          </div>

          <div className="direction-hero-grid">
            <div className="direction-hero-copy">
              <span className="direction-eyebrow">DEPOIS DA LEITURA</span>

              <h1>
                AGORA,
                <br />
                <em>PRECISAMOS</em>
                <br />
                DIRECIONAR.
              </h1>
            </div>

            <div className="direction-hero-note">
              <strong>01</strong>

              <p>
                O diagnóstico mostra o cenário.
                A direção transforma essa leitura
                em um caminho claro para a marca.
              </p>
            </div>
          </div>
        </section>

        <div className="direction-divider">
          <span>DIREÇÃO ESTRATÉGICA</span>
          <i />
          <span>{company}</span>
        </div>

        <section className="direction-pillars">
          <div className="direction-section-head">
            <span>O QUE PRECISA SER CONSTRUÍDO</span>

            <h2>
              UMA DIREÇÃO.
              <br />
              QUATRO MOVIMENTOS.
            </h2>
          </div>

          <div className="direction-list">
            <article>
              <div className="direction-list-number">01</div>
              <div>
                <h3>POSICIONAR.</h3>
                <p>
                  Tornar mais claro quem é a Marechal,
                  o que ela representa e qual espaço
                  deve ocupar na percepção do público.
                </p>
              </div>
              <span>↗</span>
            </article>

            <article>
              <div className="direction-list-number">02</div>
              <div>
                <h3>ORGANIZAR.</h3>
                <p>
                  Fazer imagem, conteúdo e presença
                  trabalharem dentro de uma mesma lógica.
                </p>
              </div>
              <span>↗</span>
            </article>

            <article>
              <div className="direction-list-number">03</div>
              <div>
                <h3>VALORIZAR.</h3>
                <p>
                  Mostrar produto, ambiente, pessoas
                  e experiência de uma forma que gere
                  mais desejo e qualidade percebida.
                </p>
              </div>
              <span>↗</span>
            </article>

            <article>
              <div className="direction-list-number">04</div>
              <div>
                <h3>CONVERTER.</h3>
                <p>
                  Construir uma presença que conduza
                  da descoberta ao interesse, do desejo
                  ao contato e à visita.
                </p>
              </div>
              <span>↗</span>
            </article>
          </div>
        </section>

        <section className="direction-statement">
          <div className="direction-statement-number">03</div>

          <div className="direction-statement-copy">
            <span>UMA DIREÇÃO FEITA PARA {company}</span>

            <h2>
              NÃO É SOBRE
              <br />
              <em>FAZER MAIS.</em>
            </h2>

            <p>
              É sobre fazer cada elemento da presença digital
              cumprir uma função dentro da construção da marca.
            </p>
          </div>
        </section>

        <section className="direction-framework">
          <div className="direction-framework-head">
            <span>A EXPERIÊNCIA DA MARECHAL</span>
            <h2>
              PRECISA
              <br />
              APARECER.
            </h2>
          </div>

          <div className="direction-framework-grid">
            <div>
              <strong>PRODUTO</strong>
              <span>Desejo</span>
            </div>
            <div>
              <strong>AMBIENTE</strong>
              <span>Experiência</span>
            </div>
            <div>
              <strong>PESSOAS</strong>
              <span>Identificação</span>
            </div>
            <div>
              <strong>MARCA</strong>
              <span>Percepção</span>
            </div>
          </div>

          <p className="direction-framework-text">
            A proposta é conectar esses elementos em uma presença
            digital mais forte, profissional, reconhecível e alinhada
            aos objetivos da Marechal.
          </p>
        </section>

        <section className="direction-next">
          <div>
            <span>PRÓXIMA ETAPA</span>

            <h2>
              A DIREÇÃO
              <br />
              VIROU
              <br />
              <em>SOLUÇÃO.</em>
            </h2>

            <p>
              Agora você pode escolher a estrutura de trabalho
              mais adequada para a próxima fase da Marechal.
            </p>

            <button type="button" onClick={goToPlans}>
              <span>VER PLANOS</span>
              <strong>↗</strong>
            </button>
          </div>
        </section>

      </main>

      <div className="direction-ticker" aria-hidden="true">
        <div className="direction-ticker-track">
          <div className="direction-ticker-group">
            <span className="accent">● MARECHAL</span>
            <b>/</b>
            <span>DIREÇÃO</span>
            <b>/</b>
            <span>POSICIONAMENTO</span>
            <b>/</b>
            <span>IMAGEM</span>
            <b>/</b>
            <span>ESTRATÉGIA</span>
            <b>/</b>
            <span>SOLUÇÃO</span>
            <b>/</b>
          </div>

          <div className="direction-ticker-group">
            <span className="accent">● MARECHAL</span>
            <b>/</b>
            <span>DIREÇÃO</span>
            <b>/</b>
            <span>POSICIONAMENTO</span>
            <b>/</b>
            <span>IMAGEM</span>
            <b>/</b>
            <span>ESTRATÉGIA</span>
            <b>/</b>
            <span>SOLUÇÃO</span>
            <b>/</b>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProposalDirection;
