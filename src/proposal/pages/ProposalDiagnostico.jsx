import React, { useEffect, useState } from 'react';
import '../styles/proposal-diagnostico.css';
import ProposalTicker from '../components/ProposalTicker';

const DEFAULT_PROPOSAL = {
  number: '001',
  company: 'MARECHAL',
  owner: 'CAIO LOPES',
  date: '22 AGO 2026',
  validity: '22 AGO — 29 AGO 2026',
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

function ProposalDiagnostico() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const companySlug = getCompanyFromPath();

  const proposal = {
    ...DEFAULT_PROPOSAL,
    company:
      companySlug === 'marechal'
        ? DEFAULT_PROPOSAL.company
        : formatCompanyName(companySlug).toUpperCase(),
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  const goToNextSection = () => {
    if (isLeaving) return;

    setIsLeaving(true);

    window.setTimeout(() => {
      window.location.href =
        `/proposta/${companySlug}/direcao`;
    }, 650);
  };

  return (
    <div
      className={`
        proposal-diagnostico
        ${isLoaded ? 'is-loaded' : ''}
        ${isLeaving ? 'is-leaving' : ''}
      `}
    >

      <div className="diagnostico-bg" />
      <div className="diagnostico-noise" />
      <div className="diagnostico-grid" />

      <div className="diagnostico-frame">
        <span className="diagnostico-corner diagnostico-corner--tl" />
        <span className="diagnostico-corner diagnostico-corner--tr" />
        <span className="diagnostico-corner diagnostico-corner--bl" />
        <span className="diagnostico-corner diagnostico-corner--br" />
      </div>

      <header className="diagnostico-header">
        <div className="diagnostico-logo">
          LEO SOUZA
          <small>DSGN</small>
        </div>

        <div className="diagnostico-header-right">
          <span>PROPOSTA</span>
          <strong>/ {proposal.number}</strong>
        </div>
      </header>

      <div
        className="diagnostico-big-number"
        aria-hidden="true"
      >
        03
      </div>

      <main className="diagnostico-main">

        {/* =====================================================
            CAPÍTULO 01
        ===================================================== */}

        <section className="diagnostico-intro">

          <div className="diagnostico-meta">
            <span className="diagnostico-meta-line" />
            <span>03 / 08</span>
            <span>DIAGNÓSTICO</span>
          </div>

          <div className="diagnostico-intro-grid">

            <div className="diagnostico-intro-left">

              <span className="diagnostico-eyebrow">
                UMA LEITURA DO CENÁRIO ATUAL
              </span>

              <h1>
                EXISTE
                <br />
                <span>PRESENÇA.</span>
                <br />
                EXISTE
                <br />
                <em>ESPAÇO.</em>
              </h1>

            </div>

            <div className="diagnostico-intro-right">

              <div className="diagnostico-index">
                01
              </div>

              <p>
                A Marechal já possui uma marca,
                um produto, uma experiência e
                uma presença estabelecida.
              </p>

              <p>
                O diagnóstico mostra onde essa
                presença pode evoluir para se
                transformar em uma comunicação
                mais consistente, profissional e
                estratégica.
              </p>

            </div>

          </div>

        </section>

        {/* =====================================================
            02 — CENÁRIO ATUAL
        ===================================================== */}

        <section className="diagnostico-cenario">

          <div className="diagnostico-section-label">
            01 — CENÁRIO ATUAL
          </div>

          <div className="diagnostico-stats">

            <article className="diagnostico-stat">
              <span>PERFIL ANALISADO</span>
              <strong>46</strong>
              <small>SEMANAS</small>
            </article>

            <article className="diagnostico-stat">
              <span>PUBLICAÇÕES</span>
              <strong>13</strong>
              <small>NO FEED</small>
            </article>

            <article className="diagnostico-stat">
              <span>BASE ATUAL</span>
              <strong>1.116</strong>
              <small>SEGUIDORES</small>
            </article>

          </div>

        </section>

        {/* =====================================================
            03 — PRIMEIRA LEITURA
        ===================================================== */}

        <section className="diagnostico-reading">

          <div className="diagnostico-section-label">
            02 — PRIMEIRA LEITURA
          </div>

          <div className="diagnostico-reading-grid">

            <div>

              <span className="diagnostico-eyebrow">
                O PONTO PRINCIPAL
              </span>

              <h2>
                EXISTE
                <br />
                <em>PRESENÇA.</em>
              </h2>

            </div>

            <div>

              <h3>
                MAS EXISTE MUITO ESPAÇO
                PARA EVOLUÇÃO.
              </h3>

              <p>
                Quando observamos a relação entre
                o tempo de existência da conta e a
                quantidade de publicações, percebemos
                uma comunicação ainda pouco frequente.
              </p>

              <p>
                Isso reduz a quantidade de oportunidades
                que a marca possui para ser descoberta,
                lembrada, apresentar seus produtos,
                mostrar sua experiência e estimular
                novas visitas.
              </p>

            </div>

          </div>

        </section>

        {/* =====================================================
            04 — OPORTUNIDADES
        ===================================================== */}

        <section className="diagnostico-opportunities">

          <div className="diagnostico-section-label">
            03 — OPORTUNIDADES
          </div>

          <div className="diagnostico-opportunity-grid">

            <article>
              <span>01</span>
              <h3>DESCOBERTA</h3>
              <p>
                Aumentar as oportunidades para que
                novas pessoas encontrem a Marechal.
              </p>
            </article>

            <article>
              <span>02</span>
              <h3>LEMBRANÇA</h3>
              <p>
                Construir uma presença mais frequente
                e reconhecível.
              </p>
            </article>

            <article>
              <span>03</span>
              <h3>DESEJO</h3>
              <p>
                Valorizar produtos, ambiente, fogo,
                bebidas e experiência.
              </p>
            </article>

            <article>
              <span>04</span>
              <h3>RELACIONAMENTO</h3>
              <p>
                Criar uma comunicação mais próxima
                do público.
              </p>
            </article>

          </div>

        </section>

        {/* =====================================================
            05 — COMUNICAÇÃO
        ===================================================== */}

        <section className="diagnostico-analysis">

          <div className="diagnostico-section-label">
            04 — COMUNICAÇÃO
          </div>

          <div className="diagnostico-analysis-header">

            <span>
              NÃO BASTA TER BONS CONTEÚDOS
            </span>

            <h2>
              ELES PRECISAM
              <br />
              FAZER SENTIDO
              <br />
              <em>JUNTOS.</em>
            </h2>

          </div>

          <div className="diagnostico-analysis-content">

            <p>
              O perfil já apresenta diferentes tipos
              de conteúdo relacionados a produtos,
              ofertas, datas comemorativas, momentos
              da empresa e informações.
            </p>

            <p>
              Isso demonstra que existe material e
              vontade de comunicar.
            </p>

            <p>
              O ponto de evolução está em fazer com
              que esses diferentes conteúdos construam
              uma percepção mais uniforme da marca.
            </p>

          </div>

        </section>

        {/* =====================================================
            06 — POSICIONAMENTO
        ===================================================== */}

        <section className="diagnostico-positioning">

          <div className="diagnostico-section-label">
            05 — POSICIONAMENTO
          </div>

          <div className="diagnostico-positioning-top">

            <span>
              HOJE O PERFIL CONSEGUE MOSTRAR
              QUE A MARECHAL EXISTE.
            </span>

            <h2>
              MAS QUEM É
              <br />
              <em>A MARECHAL?</em>
            </h2>

          </div>

          <div className="diagnostico-question-grid">

            <article>
              <span>01</span>
              <strong>QUEM É A MARECHAL?</strong>
            </article>

            <article>
              <span>02</span>
              <strong>O QUE ELA REPRESENTA?</strong>
            </article>

            <article>
              <span>03</span>
              <strong>QUE EXPERIÊNCIA ELA ENTREGA?</strong>
            </article>

            <article>
              <span>04</span>
              <strong>POR QUE ESCOLHER A MARECHAL?</strong>
            </article>

          </div>

        </section>

        {/* =====================================================
            07 — ANÁLISE VISUAL
        ===================================================== */}

        <section className="diagnostico-visual">

          <div className="diagnostico-section-label">
            06 — ANÁLISE VISUAL
          </div>

          <div className="diagnostico-visual-grid">

            <div>

              <span className="diagnostico-eyebrow">
                VALOR DE MARCA
              </span>

              <h2>
                NÃO É APENAS
                <br />
                DEIXAR O FEED
                <br />
                <em>MAIS BONITO.</em>
              </h2>

            </div>

            <div className="diagnostico-visual-list">

              <div>
                <span>01</span>
                <strong>CONSISTÊNCIA</strong>
              </div>

              <div>
                <span>02</span>
                <strong>HIERARQUIA</strong>
              </div>

              <div>
                <span>03</span>
                <strong>UNIDADE</strong>
              </div>

              <div>
                <span>04</span>
                <strong>RECONHECIMENTO</strong>
              </div>

              <div>
                <span>05</span>
                <strong>QUALIDADE PERCEBIDA</strong>
              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            08 — PRODUTO & EXPERIÊNCIA
        ===================================================== */}

        <section className="diagnostico-product">

          <div className="diagnostico-section-label">
            07 — PRODUTO & EXPERIÊNCIA
          </div>

          <div className="diagnostico-product-intro">

            <span>
              A MARECHAL POSSUI UMA VANTAGEM NATURAL
            </span>

            <h2>
              É
              <br />
              <em>VISUAL.</em>
            </h2>

          </div>

          <div className="diagnostico-product-grid">

            <article>
              <strong>COMIDA</strong>
              <span>gera desejo.</span>
            </article>

            <article>
              <strong>CHURRASQUEIRA</strong>
              <span>gera movimento.</span>
            </article>

            <article>
              <strong>FOGO</strong>
              <span>gera impacto.</span>
            </article>

            <article>
              <strong>BEBIDAS</strong>
              <span>geram contexto.</span>
            </article>

            <article>
              <strong>AMBIENTE</strong>
              <span>gera experiência.</span>
            </article>

            <article>
              <strong>PESSOAS</strong>
              <span>geram identificação.</span>
            </article>

          </div>

          <div className="diagnostico-experience">

            <span>
              A MARECHAL NÃO VENDE APENAS COMIDA.
            </span>

            <h3>
              A PESSOA NÃO DEVE VISUALIZAR
              APENAS UM ESPETO.
            </h3>

            <p>
              Ela precisa conseguir imaginar:
            </p>

            <strong>
              “EU ESTANDO LÁ.”
            </strong>

          </div>

        </section>

        {/* =====================================================
            09 — PRESENÇA LOCAL
        ===================================================== */}

        <section className="diagnostico-local">

          <div className="diagnostico-section-label">
            08 — PRESENÇA LOCAL
          </div>

          <div className="diagnostico-local-grid">

            <div>

              <span className="diagnostico-eyebrow">
                UM ATIVO IMPORTANTE
              </span>

              <h2>
                SER
                <br />
                RELEVANTE
                <br />
                <em>PARA QUEM ESTÁ PERTO.</em>
              </h2>

            </div>

            <div>

              <p>
                Como estabelecimento físico, a
                Marechal possui uma oportunidade
                muito específica: permanecer na
                lembrança de pessoas que procuram
                onde comer, sair, reunir amigos,
                comemorar ou experimentar algo
                diferente.
              </p>

              <div className="diagnostico-local-tags">
                <span>ONDE COMER</span>
                <span>ONDE SAIR</span>
                <span>REUNIR AMIGOS</span>
                <span>COMEMORAR</span>
                <span>EXPERIMENTAR</span>
              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            10 — CONVERSÃO
        ===================================================== */}

        <section className="diagnostico-conversion">

          <div className="diagnostico-section-label">
            09 — CONVERSÃO
          </div>

          <div className="diagnostico-conversion-title">

            <span>
              A JORNADA
            </span>

            <h2>
              DESCOBRIR.
              <br />
              INTERESSAR.
              <br />
              DESEJAR.
              <br />
              <em>AGIR.</em>
            </h2>

          </div>

          <div className="diagnostico-funnel">

            <div>
              <span>01</span>
              <strong>DESCOBRIR</strong>
              <small>“Conheci a Marechal.”</small>
            </div>

            <div>
              <span>02</span>
              <strong>INTERESSAR</strong>
              <small>“Parece interessante.”</small>
            </div>

            <div>
              <span>03</span>
              <strong>DESEJAR</strong>
              <small>“Quero conhecer.”</small>
            </div>

            <div>
              <span>04</span>
              <strong>AÇÃO</strong>
              <small>“Vou entrar em contato.”</small>
            </div>

          </div>

        </section>

        {/* =====================================================
            11 — O QUE JÁ FUNCIONA
        ===================================================== */}

        <section className="diagnostico-positive">

          <div className="diagnostico-section-label">
            10 — O QUE JÁ FUNCIONA
          </div>

          <div className="diagnostico-positive-header">

            <span>
              UM DIAGNÓSTICO PROFISSIONAL
              TAMBÉM RECONHECE O QUE JÁ EXISTE.
            </span>

            <h2>
              A MARECHAL
              <br />
              <em>JÁ TEM MUITO.</em>
            </h2>

          </div>

          <div className="diagnostico-positive-grid">

            <article>
              <span>01</span>
              <strong>MARCA</strong>
              <p>
                Nome e identidade já existentes.
              </p>
            </article>

            <article>
              <span>02</span>
              <strong>PRODUTO</strong>
              <p>
                Um produto com forte potencial visual.
              </p>
            </article>

            <article>
              <span>03</span>
              <strong>EXPERIÊNCIA</strong>
              <p>
                Um ambiente que pode ser explorado.
              </p>
            </article>

            <article>
              <span>04</span>
              <strong>PRESENÇA</strong>
              <p>
                Uma base inicial de seguidores.
              </p>
            </article>

            <article>
              <span>05</span>
              <strong>MATERIAL</strong>
              <p>
                Uma operação capaz de gerar
                conteúdo diariamente.
              </p>
            </article>

            <article>
              <span>06</span>
              <strong>POTENCIAL</strong>
              <p>
                Espaço para construir uma presença
                digital muito maior.
              </p>
            </article>

          </div>

        </section>

        {/* =====================================================
            12 — PONTOS DE EVOLUÇÃO
        ===================================================== */}

        <section className="diagnostico-evolution">

          <div className="diagnostico-section-label">
            11 — PONTOS DE EVOLUÇÃO
          </div>

          <div className="diagnostico-evolution-header">

            <span>
              O QUE PRECISA AVANÇAR
            </span>

            <h2>
              OITO PONTOS.
              <br />
              UMA DIREÇÃO.
            </h2>

          </div>

          <div className="diagnostico-evolution-list">

            <div>
              <span>01</span>
              <strong>AUMENTO DA CONSISTÊNCIA</strong>
            </div>

            <div>
              <span>02</span>
              <strong>MAIOR CLAREZA DE POSICIONAMENTO</strong>
            </div>

            <div>
              <span>03</span>
              <strong>MAIOR UNIDADE VISUAL</strong>
            </div>

            <div>
              <span>04</span>
              <strong>MELHOR ORGANIZAÇÃO DO PERFIL</strong>
            </div>

            <div>
              <span>05</span>
              <strong>VALORIZAÇÃO DA EXPERIÊNCIA</strong>
            </div>

            <div>
              <span>06</span>
              <strong>MELHOR APROVEITAMENTO DOS MATERIAIS</strong>
            </div>

            <div>
              <span>07</span>
              <strong>MAIOR PLANEJAMENTO</strong>
            </div>

            <div>
              <span>08</span>
              <strong>INTEGRAÇÃO ENTRE IMAGEM E OBJETIVO</strong>
            </div>

          </div>

        </section>

        {/* =====================================================
            13 — A GRANDE OPORTUNIDADE
        ===================================================== */}

        <section className="diagnostico-opportunity">

          <div className="diagnostico-section-label">
            12 — A GRANDE OPORTUNIDADE
          </div>

          <div className="diagnostico-opportunity-main">

            <span>
              NÃO SE TRATA APENAS DE POSTAR MAIS.
            </span>

            <h2>
              TRANSFORMAR O
              <br />
              INSTAGRAM EM UMA
              <br />
              <em>EXTENSÃO DIGITAL</em>
              <br />
              DA MARCA.
            </h2>

            <p>
              Uma pessoa nova deve conseguir entrar
              no perfil e perceber rapidamente quem é
              a Marechal, o que ela oferece, qual é sua
              personalidade, como é sua experiência,
              por que vale a pena conhecer e como
              entrar em contato.
            </p>

          </div>

          <div className="diagnostico-opportunity-quote">

            <span>
              A EXPERIÊNCIA DA MARECHAL
              PRECISA APARECER NO DIGITAL.
            </span>

          </div>

        </section>

        {/* =====================================================
            FECHAMENTO
        ===================================================== */}

        <section className="diagnostico-end">

          <div className="diagnostico-end-number">
            03
          </div>

          <span>
            DIAGNÓSTICO CONCLUÍDO
          </span>

          <h2>
            AGORA,
            <br />
            <em>VAMOS TRANSFORMAR</em>
            <br />
            LEITURA EM DIREÇÃO.
          </h2>

          <p>
            O diagnóstico mostra o cenário.
            A próxima etapa é construir a solução.
          </p>

          <button
            type="button"
            onClick={goToNextSection}
          >
            <span>
              PRÓXIMA ETAPA
              <strong>DIREÇÃO</strong>
            </span>

            <b>↗</b>
          </button>

        </section>

      </main>

      <footer className="diagnostico-footer">

        <div>
          <span>VALIDADE</span>
          <strong>{proposal.validity}</strong>
        </div>

        <div>
          <span>PREPARADO PARA</span>
          <strong>{proposal.owner}</strong>
        </div>

        <div>
          <span>LEO SOUZA DSGN</span>
          <strong>ESTRATÉGIA & IMAGEM</strong>
        </div>

      </footer>

      <ProposalTicker
        company={proposal.company}
        section="DIAGNÓSTICO"
        number="03 / 08"
      />

    </div>
  );
}

export default ProposalDiagnostico;