import React, { useEffect, useRef, useState } from 'react';
import './Services.css';

const services = [
  {
    number: '01',
    title: 'IDENTIDADE',
    description:
      'Construção de uma identidade visual que transforma personalidade, história e ambição em presença.',
  },
  {
    number: '02',
    title: 'POSICIONAMENTO',
    description:
      'Estratégia para definir como atletas, clubes e projetos esportivos devem ser percebidos.',
  },
  {
    number: '03',
    title: 'IMAGEM',
    description:
      'Direção visual e comunicação para transformar imagem em autoridade, reconhecimento e valor.',
  },
  {
    number: '04',
    title: 'CONTEÚDO ESPORTIVO',
    description:
      'Design e estratégia aplicados ao universo esportivo para comunicar performance dentro e fora do campo.',
  },
];

const Services = () => {
  const sectionRef = useRef(null);
  const [activeService, setActiveService] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          sectionRef.current?.classList.add('is-visible');
          observer.disconnect();
        }
      },
      {
        threshold: 0.2,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="services-section" ref={sectionRef}>
      <div className="container services-container">

        <header className="services-top">
          <span className="services-label">03 / 08</span>

          <span className="services-category">
            ESPECIALIDADE · ESTRATÉGIA · ESPORTE
          </span>
        </header>

        <div className="services-main">

          <div className="services-intro">
            <span className="services-kicker">
              O QUE EU FAÇO
            </span>

            <h2 className="services-heading">
              O DESIGN
              <span>NÃO É O FIM.</span>
            </h2>

            <div className="services-statement">
              É A <strong>ESTRATÉGIA</strong> VISÍVEL.
            </div>
          </div>

          <div className="services-list">

            {services.map((service, index) => (
              <article
                className={`service-item ${
                  activeService === index ? 'is-active' : ''
                }`}
                key={service.number}
                onMouseEnter={() => setActiveService(index)}
              >
                <div className="service-number">
                  {service.number}
                </div>

                <div className="service-info">
                  <h3>{service.title}</h3>

                  <p>{service.description}</p>
                </div>

                <div className="service-arrow">
                  ↗
                </div>
              </article>
            ))}

          </div>

        </div>

        <div className="services-bottom">
          <span>DESIGN · ESTRATÉGIA · IMAGEM</span>

          <span>
            LÉO SOUZA
          </span>
        </div>

      </div>

      <div className="services-background-number">
        03
      </div>

    </section>
  );
};

export default Services;