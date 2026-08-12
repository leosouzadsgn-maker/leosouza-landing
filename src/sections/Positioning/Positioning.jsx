import React, { useEffect, useRef, useState } from 'react';
import './Positioning.css';
import positioningVideo from '../../assets/videos/positioning-bg.mp4';

const pillars = [
  {
    number: '01',
    title: 'VISÃO ESPORTIVA',
    description:
      'Não penso apenas na peça. Penso no atleta, no contexto e no mercado em que ele está.',
  },
  {
    number: '02',
    title: 'DIREÇÃO',
    description:
      'Cada escolha visual precisa ter uma intenção e reforçar um posicionamento.',
  },
  {
    number: '03',
    title: 'CONSISTÊNCIA',
    description:
      'Uma imagem forte não acontece em uma publicação. Ela é construída ao longo do tempo.',
  },
];

const Positioning = () => {
  const positioningRef = useRef(null);
  const [activePillar, setActivePillar] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          positioningRef.current.classList.add('is-visible');
          observer.disconnect();
        }
      },
      {
        threshold: 0.2,
      }
    );

    if (positioningRef.current) {
      observer.observe(positioningRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="positioning-section"
      ref={positioningRef}
      
    >
        <video
  className="positioning-background-video"
  src={positioningVideo}
  autoPlay
  muted
  loop
  playsInline
  aria-hidden="true"
/>

<div className="positioning-video-overlay"></div>
        
      <div className="container positioning-container">

        {/* TOPO */}
        <header className="positioning-top">
          <span className="positioning-label">
            06 / 08
          </span>

          <span className="positioning-category">
            POSICIONAMENTO · VISÃO · DIFERENCIAL
          </span>
        </header>

        {/* INTRO */}
        <div className="positioning-intro">

          <span className="positioning-kicker">
            O QUE MOVE O TRABALHO
          </span>

          <h2 className="positioning-heading">
            <span>DESIGN É</span>
            <span className="positioning-heading-muted">
              A FERRAMENTA.
            </span>
            <span className="positioning-heading-accent">
              ESTRATÉGIA
            </span>
            <span className="positioning-heading-accent">
              É O QUE MOVE.
            </span>
          </h2>

        </div>

        {/* PILARES */}
        <div className="positioning-pillars">

          {pillars.map((pillar, index) => (
            <article
              className={`positioning-pillar ${
                activePillar === index ? 'is-active' : ''
              }`}
              key={pillar.number}
              onMouseEnter={() => setActivePillar(index)}
              onMouseLeave={() => setActivePillar(null)}
            >

              <span className="positioning-pillar-number">
                {pillar.number}
              </span>

              <div className="positioning-pillar-content">

                <h3>
                  {pillar.title}
                </h3>

                <p>
                  {pillar.description}
                </p>

              </div>

              <span className="positioning-pillar-arrow">
                ↗
              </span>

            </article>
          ))}

        </div>

        {/* RODAPÉ */}
        <footer className="positioning-bottom">

          <span>
            LÉO SOUZA · DESIGN & POSICIONAMENTO
          </span>

          <span>
            06 — 08
          </span>

        </footer>

        {/* TEXTO GIGANTE */}
        <div className="positioning-background-word">
          STRATEGY
        </div>

      </div>
    </section>
  );
};

export default Positioning;