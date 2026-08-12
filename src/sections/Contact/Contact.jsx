import React, { useEffect, useRef } from 'react';
import './Contact.css';

const Contact = () => {
  const contactRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          contactRef.current.classList.add('is-visible');
          observer.disconnect();
        }
      },
      {
        threshold: 0.2,
      }
    );

    if (contactRef.current) {
      observer.observe(contactRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
    id="contact"
      className="contact-section"
      ref={contactRef}
    >
      <div className="container contact-container">

        {/* TOPO */}
        <header className="contact-top">
          <span className="contact-label">
            08 / 08
          </span>

          <span className="contact-category">
            CONTATO · NOVO PROJETO
          </span>
        </header>

        {/* CONTEÚDO */}
        <div className="contact-main">

          <span className="contact-kicker">
            VAMOS CONVERSAR
          </span>

          <h2 className="contact-heading">
            <span>SE VOCÊ TEM</span>

            <span className="contact-heading-muted">
              UM PROJETO,
            </span>

            <span className="contact-heading-accent">
              VAMOS FAZER
            </span>

            <span className="contact-heading-accent">
              ELE SER VISTO.
            </span>
          </h2>

          <p className="contact-description">
            Projetos esportivos, atletas, marcas e ideias
            que precisam de direção, imagem e posicionamento.
          </p>

          <a
      href="https://wa.me/553131912341?text=Ol%C3%A1%2C%20L%C3%A9o!%20Vi%20seu%20trabalho%20pelo%20site%20e%20gostaria%20de%20conversar%20sobre%20um%20projeto"
  target="_blank"
  rel="noopener noreferrer"
  className="contact-button"
          >
            <span>INICIAR CONVERSA</span>
            <span>↗</span>
          </a>

        </div>

        {/* RODAPÉ */}
        <footer className="contact-bottom">

          <span>
            LÉO SOUZA · DESIGN & POSICIONAMENTO
          </span>

          <span>
            08 — 08
          </span>

        </footer>

        {/* NÚMERO GIGANTE */}
        <div className="contact-background-number">
          08
        </div>

      </div>
    </section>
  );
};

export default Contact;