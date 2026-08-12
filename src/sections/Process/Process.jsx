import React, { useEffect, useRef } from 'react';
import './Process.css';

const processSteps = [
  {
    number: '01',
    title: 'DIAGNÓSTICO',
    description:
      'Entender o atleta, projeto e momento atual antes de tomar qualquer decisão.',
  },
  {
    number: '02',
    title: 'POSICIONAMENTO',
    description:
      'Definir como essa imagem precisa ser percebida dentro e fora do campo.',
  },
  {
    number: '03',
    title: 'DIREÇÃO',
    description:
      'Transformar estratégia em identidade, conteúdo e comunicação.',
  },
  {
    number: '04',
    title: 'EXECUÇÃO',
    description:
      'Criar, aplicar e acompanhar cada detalhe para manter consistência.',
  },
];

const Process = () => {
  const processRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          processRef.current.classList.add('is-visible');
          observer.disconnect();
        }
      },
      {
        threshold: 0.2,
      }
    );

    if (processRef.current) {
      observer.observe(processRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="process-section"
      ref={processRef}
    >
      <div className="container process-container">

        {/* TOPO */}
        <header className="process-top">
          <span className="process-label">
            05 / 08
          </span>

          <span className="process-category">
            PROCESSO · ESTRATÉGIA · EXECUÇÃO
          </span>
        </header>

        {/* CONTEÚDO PRINCIPAL */}
        <div className="process-main">

          {/* INTRO */}
          <div className="process-intro">

            <span className="process-kicker">
              COMO EU TRABALHO
            </span>

            <h2 className="process-heading">
              <span>NÃO É</span>
              <span>SÓ DESIGN.</span>
              <span className="process-heading-accent">
                É PROCESSO.
              </span>
            </h2>

            <p className="process-description">
              Antes de criar qualquer coisa, eu entendo
              o que precisa ser comunicado, para quem
              e onde essa imagem precisa chegar.
            </p>

          </div>

          {/* PROCESSO */}
          <div className="process-timeline">

            <div className="process-line"></div>

            {processSteps.map((step, index) => (
              <article
                className="process-step"
                key={step.number}
              >

                <div className="process-step-number">
                  {step.number}
                </div>

                <div className="process-step-content">

                  <h3>
                    {step.title}
                  </h3>

                  <p>
                    {step.description}
                  </p>

                </div>

                <div className="process-step-index">
                  0{index + 1}
                </div>

              </article>
            ))}

          </div>

        </div>

        {/* RODAPÉ */}
        <footer className="process-bottom">

          <span>
            ESTRATÉGIA → IMAGEM → POSICIONAMENTO
          </span>

          <span>
            LÉO SOUZA
          </span>

        </footer>

        {/* NÚMERO DE FUNDO */}
        <div className="process-background-number">
          05
        </div>

      </div>
    </section>
  );
};

export default Process;