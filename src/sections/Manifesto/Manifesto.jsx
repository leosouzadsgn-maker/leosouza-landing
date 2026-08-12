import React, { useEffect, useRef } from 'react';
import './Manifesto.css';

const Manifesto = () => {
    const manifestoRef = useRef(null);

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        manifestoRef.current.classList.add('is-visible');
        observer.disconnect();
      }
    },
    {
      threshold: 0.2,
    }
  );

  if (manifestoRef.current) {
    observer.observe(manifestoRef.current);
  }

  return () => observer.disconnect();
}, []);
  return (
    <section
  className="manifesto-section"
  ref={manifestoRef}
>

      <div className="container manifesto-container">

        <header className="manifesto-top">
          <span className="manifesto-label">02 / 08</span>

          <span className="manifesto-category">
            ESPORTE · IMAGEM · POSICIONAMENTO
          </span>
        </header>

        <div className="manifesto-main">

          <div className="manifesto-heading">

            <span className="manifesto-line manifesto-line-muted">
              NO ESPORTE,
            </span>

            <span className="manifesto-line">
              SUA IMAGEM
            </span>

            <div className="manifesto-accent-wrapper">

  <span className="manifesto-accent-line"></span>

  <span className="manifesto-line manifesto-accent">
    TAMBÉM JOGA.
  </span>

</div>

          </div>

          <div className="manifesto-bottom">

            <div className="manifesto-index">
             
            </div>

            <div className="manifesto-copy">

              <p>
                TALENTO CHAMA ATENÇÃO.
              </p>

              <p>
                Posicionamento cria valor.
                No futebol e no esporte, cada detalhe
                da sua imagem comunica quem você é,
                onde quer chegar e como quer ser percebido.
              </p>

            </div>

            <div className="manifesto-disciplines">

              <span>ATLETAS</span>
              <span>CLUBES</span>
              <span>PROJETOS ESPORTIVOS</span>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default Manifesto;