import React, { useEffect, useRef, useState } from 'react';
import './Projects.css';
import sidaoImg from '../../assets/imagens/sidao.png';
import lucanetaImg from '../../assets/imagens/lucaneta.png';
import luisMiguelImg from '../../assets/imagens/luis-miguel.png';

import kreativeAtletaImg from '../../assets/imagens/kreative-atleta.png';

const projects = [
  {
    number: '01',
    title: 'IDENTIDADE ESPORTIVA',
    category: 'DESIGN · ESTRATÉGIA · POSICIONAMENTO',
    type: 'image',
    image: kreativeAtletaImg,
  },
  {
    number: '02',
    title: 'IMAGEM DE ATLETA',
    category: 'DIREÇÃO · CONTEÚDO · BRANDING',
    type: 'video',
    video: '/videos/luis-miguel-video.mp4',
   
  },
  {
    number: '03',
    title: 'PROJETO ESPORTIVO',
    category: 'IDENTIDADE · COMUNICAÇÃO · DIGITAL',
    type: 'matchday',
    images: [sidaoImg, lucanetaImg, luisMiguelImg],
  },
];


const Projects = () => {
  const projectsRef = useRef(null);
  const [activeProject, setActiveProject] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          projectsRef.current.classList.add('is-visible');
          observer.disconnect();
        }
      },
      {
        threshold: 0.15,
      }
    );

    if (projectsRef.current) {
      observer.observe(projectsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
    id="projects"
      className="projects-section"
      ref={projectsRef}
    >
      <div className="container projects-container">

        {/* TOPO */}
        <header className="projects-top">
          <span className="projects-label">
            04 / 08
          </span>

          <span className="projects-category">
            SELECTED WORK · CASES
          </span>
        </header>

        {/* CONTEÚDO */}
        <div className="projects-main">

          {/* HEADLINE */}
          <div className="projects-intro">
            <span className="projects-kicker">
              TRABALHO REAL
            </span>

            <h2 className="projects-heading">
              <span>PROJETOS</span>
              <span>QUE</span>
              <span className="projects-heading-accent">
                FALAM POR SI.
              </span>
            </h2>

            <p className="projects-description">
              Cada projeto nasce de uma estratégia.
              Cada escolha visual precisa comunicar
              alguma coisa.
            </p>
          </div>

          {/* LISTA DE PROJETOS */}
          <div className="projects-list">

            {projects.map((project, index) => (
              <article
                className={`project-item ${
                  activeProject === index ? 'is-active' : ''
                }`}
                key={project.number}
                onMouseEnter={() => setActiveProject(index)}
                onMouseLeave={() => setActiveProject(null)}
              >
                <span className="project-number">
                  {project.number}
                </span>

                <div className="project-info">
                  <h3>{project.title}</h3>

                  <span className="project-category">
                    {project.category}
                  </span>
                </div>

                <span className="project-arrow">
                  ↗
                </span>

               {/* PREVIEW DO PROJETO */}
<div className="project-preview">

  {project.type === 'image' && project.image && (
    <img
      src={project.image}
      alt={project.title}
      className="project-preview-image"
    />
  )}

  {project.type === 'video' && (
    <video
      src={project.video}
      className="project-preview-video"
      autoPlay
      muted
      loop
      playsInline
    />
  )}

  {project.type === 'matchday' && (
    <div className="project-matchday-grid">
      {project.images.map((image, imageIndex) => (
        <img
          key={imageIndex}
          src={image}
          alt={`Matchday ${imageIndex + 1}`}
          className="project-matchday-image"
        />
      ))}
    </div>
  )}

</div>
              </article>
            ))}

          </div>
        </div>

        {/* RODAPÉ */}
        <footer className="projects-bottom">
          <span>
            LÉO SOUZA · DESIGN & POSICIONAMENTO
          </span>

          <span>
            04 — 08
          </span>
        </footer>

      </div>
    </section>
  );
};

export default Projects;