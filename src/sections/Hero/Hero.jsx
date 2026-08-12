import React, { useEffect, useRef } from 'react';
import './Hero.css';
import leoHeroImg from '../../assets/imagens/leo-hero.png';

const Hero = () => {
  const heroRef = useRef(null);

  // Efeito Parallax Cinematográfico atrelado ao mouse
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!heroRef.current) return;
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 30; // Sensibilidade horizontal
      const y = (clientY / window.innerHeight - 0.5) * 30; // Sensibilidade vertical
      
      heroRef.current.style.setProperty('--move-x', x);
      heroRef.current.style.setProperty('--move-y', y);
      heroRef.current.style.setProperty('--move-x-img', x * 0.3);
      heroRef.current.style.setProperty('--move-y-img', y * 0.3);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="hero-section" ref={heroRef}>

  <div className="hero-glow"></div>

  <div className="hero-ambient-light"></div>

{/* Camada do Léo integrada ao fundo */}
<div className="hero-image-layer parallax-img smooth-reveal">
  <img src={leoHeroImg} alt="Léo Souza" className="hero-image-png" />
  <div className="hero-shadow-overlay"></div>
</div>

      <div className="container hero-container">
        {/* Cabeçalho Interno da Hero */}
        <header className="hero-top fade-up delay-1">
          <div className="hero-signature">
            <span className="signature-name">LÉO SOUZA</span>
            <span className="signature-role">DESIGNER · ESTRATEGISTA · IMAGEM</span>
          </div>
          <div className="hero-indicator">01 / 08</div>
        </header>

        {/* Conteúdo Central */}
        <div className="hero-content">
          <div className="hero-title-group parallax-text">
            <h1 className="hero-headline fade-up delay-2">
              IMAGEM NÃO É<br />DECORAÇÃO.
            </h1>
            <h2 className="hero-subheadline fade-up delay-3">
              É POSICIONAMENTO.
            </h2>
          </div>

          <div className="hero-action-group fade-up delay-4">
            <p className="hero-support-text">
              Eu sou Léo Souza. Transformo imagem em posicionamento para atletas, marcas e projetos esportivos que querem deixar de apenas aparecer e começar a ser percebidos.
            </p>
           <div className="hero-ctas">
  <a href="#projects" className="btn btn-primary">
    VER PROJETOS
  </a>

  <a href="#contact" className="btn btn-secondary">
    FALAR COM LÉO
  </a>
</div>
          </div>
        </div>

        {/* Indicador de Scroll */}
        <div className="hero-scroll fade-up delay-5">
          <span className="scroll-text">SCROLL</span>
          <div className="scroll-line"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;