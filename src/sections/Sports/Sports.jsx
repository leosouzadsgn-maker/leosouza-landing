import React, { useEffect, useRef, useState } from 'react';
import './Sports.css';

const pillars = [
  {
    number: '01',
    title: 'ATLETA',
    description:
      'A imagem precisa acompanhar o momento, a personalidade e os objetivos de cada atleta.',
  },
  {
    number: '02',
    title: 'FAMÍLIA',
    description:
      'Comunicação também faz parte da construção de uma trajetória esportiva mais profissional.',
  },
  {
    number: '03',
    title: 'MERCADO',
    description:
      'Posicionamento transforma atenção em percepção, oportunidade e valor.',
  },
];

const Sports = () => {
  const sportsRef = useRef(null);
  const [activePillar, setActivePillar] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          sportsRef.current.classList.add('is-visible');
          observer.disconnect();
        }
      },
      {
        threshold: 0.2,
      }
    );

    if (sportsRef.current) {
      observer.observe(sportsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="sports-section"
      ref={sportsRef}
    >
      <div className="container sports-container">

        {/* TOPO */}
        <header className="sports-top">
          <span className="sports-label">
            07 / 08
          </span>

          <span className="sports-category">
            SPORTS · ESPECIALIZAÇÃO
          </span>
        </header>

        {/* INTRO */}
        <div className="sports-intro">

          <span className="sports-kicker">
            MAIS DO QUE FUTEBOL
          </span>

          <h2 className="sports-heading">
            <span>O ESPORTE</span>

            <span className="sports-heading-muted">
              NÃO É SÓ
            </span>

            <span className="sports-heading-accent">
              O CAMPO.
            </span>
          </h2>

          <p className="sports-description">
            É imagem. É carreira. É posicionamento.
            E cada detalhe pode influenciar a forma
            como um atleta é percebido.
          </p>

        </div>

        {/* PILARES */}
        <div className="sports-pillars">

          {pillars.map((pillar, index) => (
            <article
              className={`sports-pillar ${
                activePillar === index ? 'is-active' : ''
              }`}
              key={pillar.number}
              onMouseEnter={() => setActivePillar(index)}
              onMouseLeave={() => setActivePillar(null)}
            >

              <span className="sports-pillar-number">
                {pillar.number}
              </span>

              <div className="sports-pillar-content">

                <h3>
                  {pillar.title}
                </h3>

                <p>
                  {pillar.description}
                </p>

              </div>

              <span className="sports-pillar-arrow">
                ↗
              </span>

            </article>
          ))}

        </div>

        {/* RODAPÉ */}
        <footer className="sports-bottom">

          <span>
            LÉO SOUZA · SPORTS
          </span>

          <span>
            07 — 08
          </span>

        </footer>

        {/* NÚMERO GIGANTE */}
        <div className="sports-background-number">
          07
        </div>

      </div>
    </section>
  );
};

export default Sports;