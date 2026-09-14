import React, { useEffect, useState } from 'react';
import '../styles/proposal-pedro.css';

const DATA = {
  number: '003',
  client: 'PEDRO WIESE',
  provider: 'LEO SOUZA DESIGNER',
  periodicity: 'MENSAL',
  whatsapp: '553131912341',
};

function ProposalPedro() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 80);

    return () => clearTimeout(timer);
  }, []);

  const whatsappMessage = encodeURIComponent(
    'Olá, Léo! Analisei a proposta comercial de Gestão de Instagram + Comunicação dos Atletas para Pedro Wiese e gostaria de seguir com a contratação.'
  );

  return (
    <main className={`pp-proposal ${loaded ? 'is-loaded' : ''}`}>
      <div className="pp-light pp-light-one" />
      <div className="pp-light pp-light-two" />
      <div className="pp-noise" />

      <header className="pp-header">
        <div className="pp-brand">
          <strong>LÉO SOUZA</strong>
          <span>DESIGNER · ESTRATÉGIA · COMUNICAÇÃO</span>
        </div>

        <div className="pp-header-meta">
          <span>PROPOSTA</span>
          <strong>/ {DATA.number}</strong>
        </div>
      </header>

      <div className="pp-progress">
        <span />
      </div>

      <section className="pp-hero pp-shell">
        <div className="pp-kicker">
          <span />
          PROPOSTA COMERCIAL
        </div>

        <p className="pp-eyebrow">
          GESTÃO DE INSTAGRAM + COMUNICAÇÃO DOS ATLETAS
        </p>

        <h1>
          UMA PRESENÇA
          <br />
          DIGITAL PARA
          <br />
          <em>{DATA.client}.</em>
        </h1>

        <p className="pp-hero-copy">
          Uma estrutura mensal para organizar a comunicação da empresa,
          fortalecer sua presença no mercado esportivo e acompanhar a rotina
          de comunicação dos atletas.
        </p>

        <div className="pp-client-info">
          <div>
            <span>CLIENTE</span>
            <strong>{DATA.client}</strong>
          </div>

          <div>
            <span>PRESTADOR</span>
            <strong>{DATA.provider}</strong>
          </div>

          <div>
            <span>PERIODICIDADE</span>
            <strong>{DATA.periodicity}</strong>
          </div>
        </div>
      </section>

      <section className="pp-block pp-shell">
        <div className="pp-block-number">01</div>

        <div className="pp-block-content">
          <div className="pp-label">
            GESTÃO DO INSTAGRAM
          </div>

          <div className="pp-title-row">
            <h2>
              GESTÃO DO
              <br />
              <em>INSTAGRAM.</em>
            </h2>

            <div className="pp-price-card">
              <span>INVESTIMENTO</span>
              <strong>R$ 800,00</strong>
              <small>/ MÊS</small>
            </div>
          </div>

          <p className="pp-intro">
            A gestão contempla:
          </p>

          <div className="pp-deliveries">
            {[
              'Planejamento de conteúdo',
              'Organização do calendário de publicações',
              'Criação das artes para o perfil',
              'Criação de legendas',
              'Publicação dos conteúdos',
              'Organização visual do feed',
              'Conteúdo institucional da empresa',
              'Conteúdos relacionados ao futebol e ao mercado esportivo',
              'Desenvolvimento da presença digital da empresa',
              'Acompanhamento básico dos resultados do perfil',
            ].map((item, index) => (
              <div key={item}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{item}</strong>
              </div>
            ))}
          </div>

          <div className="pp-highlight">
            <span>OBJETIVO</span>

            <p>
              Construir uma presença digital profissional, consistente e
              alinhada ao posicionamento da empresa no mercado esportivo.
            </p>
          </div>
        </div>
      </section>

      <section className="pp-band">
        <div className="pp-shell pp-band-inner">
          <span>02</span>

          <div>
            <p>COMUNICAÇÃO DOS ATLETAS</p>

            <h2>
              ACOMPANHAMENTO
              <br />
              <em>ESPORTE.</em>
            </h2>
          </div>

          <strong>R$ 100,00</strong>
        </div>
      </section>

      <section className="pp-block pp-shell">
        <div className="pp-block-number">02</div>

        <div className="pp-block-content">
          <div className="pp-label">
            COMUNICAÇÃO DOS ATLETAS
          </div>

          <div className="pp-title-row">
            <h2>
              COMUNICAÇÃO
              <br />
              <em>DOS ATLETAS.</em>
            </h2>

            <div className="pp-price-card">
              <span>INVESTIMENTO</span>
              <strong>R$ 100,00</strong>
              <small>/ ATLETA / MÊS</small>
            </div>
          </div>

          <p className="pp-body">
            Cada atleta incluído na parceria terá sua comunicação esportiva
            acompanhada durante o mês.
          </p>

          <p className="pp-subtitle">
            Inclui:
          </p>

          <div className="pp-deliveries">
            {[
              'Acompanhamento do calendário de jogos',
              'Identificação de datas e horários das partidas',
              'Criação das artes Matchday',
              'Publicação dos Matchdays',
              'Adequação das artes à identidade visual da empresa',
              'Comunicação de resultados e momentos relevantes, quando necessário',
            ].map((item, index) => (
              <div key={item}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{item}</strong>
              </div>
            ))}
          </div>

          <div className="pp-important">
            <div>
              <span>IMPORTANTE</span>
              <p>
                O valor de <strong>R$ 100,00 por atleta é mensal</strong> e
                contempla as artes Matchday necessárias de acordo com a rotina
                esportiva do atleta.
              </p>
            </div>

            <div>
              <p>
                <strong>
                  Não haverá cobrança individual por cada arte Matchday.
                </strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="pp-investment">
        <div className="pp-shell">
          <div className="pp-label">
            03 — INVESTIMENTO
          </div>

          <div className="pp-investment-heading">
            <h2>
              INVESTIMENTO
              <br />
              <em>MENSAL.</em>
            </h2>

            <p>
              O valor da parceria varia conforme a quantidade de atletas
              contratada.
            </p>
          </div>

          <div className="pp-equation-grid">
            <div>
              <span>GESTÃO DO INSTAGRAM</span>
              <strong>R$ 800,00 / MÊS</strong>
            </div>

            <div className="pp-equation-symbol">+</div>

            <div>
              <span>COMUNICAÇÃO DOS ATLETAS</span>
              <strong>R$ 100,00 × ATLETAS</strong>
            </div>
          </div>

          <div className="pp-formula">
            <span>FÓRMULA DO INVESTIMENTO</span>
            <strong>
              R$ 800,00 + R$ 100,00 × quantidade de atletas
            </strong>
          </div>

          <div className="pp-examples">
            <div>
              <span>EXEMPLO COM 12 ATLETAS</span>
              <strong>10 atletas → R$ 1.000,00</strong>
            </div>

            <div>
              <span>GESTÃO DO INSTAGRAM</span>
              <strong>R$ 800,00</strong>
            </div>
          </div>

          <div className="pp-main-total">
            <span>TOTAL DO EXEMPLO</span>

            <strong>
              R$ 1.800,00
              <small>/ MÊS</small>
            </strong>
          </div>
        </div>
      </section>

      <section className="pp-block pp-shell">
        <div className="pp-block-number">04</div>

        <div className="pp-block-content">
          <div className="pp-label">
            FORMA DE TRABALHO
          </div>

          <h2>
            FORMA DE
            <br />
            <em>TRABALHO.</em>
          </h2>

          <div className="pp-text-grid">
            <p>
              O trabalho será realizado de forma contínua, através do
              planejamento e acompanhamento da rotina da empresa e dos atletas.
            </p>

            <p>
              O calendário esportivo será acompanhado para que as publicações
              de Matchday sejam organizadas com antecedência, sempre que as
              informações necessárias estiverem disponíveis.
            </p>

            <p>
              O cliente deverá fornecer informações, fotos, vídeos e demais
              materiais necessários para a produção dos conteúdos quando estes
              dependerem diretamente da empresa ou dos atletas.
            </p>
          </div>
        </div>
      </section>

      <section className="pp-block pp-shell pp-conditions-section">
        <div className="pp-block-number">05</div>

        <div className="pp-block-content">
          <div className="pp-label">
            CONDIÇÕES
          </div>

          <h2>
            CONDIÇÕES
            <br />
            <em>COMERCIAIS.</em>
          </h2>

          <div className="pp-condition-list">
            <div>
              <span>PERIODICIDADE</span>
              <strong>MENSAL</strong>
            </div>

            <div>
              <span>GESTÃO DO INSTAGRAM</span>
              <strong>R$ 800,00 / MÊS</strong>
            </div>

            <div>
              <span>COMUNICAÇÃO DOS ATLETAS</span>
              <strong>R$ 100,00 / ATLETA / MÊS</strong>
            </div>

            <div>
              <span>PAGAMENTO</span>
              <strong>
                Mensal, com vencimento a definir entre as partes.
              </strong>
            </div>

            <div>
              <span>AJUSTE DE QUANTIDADE</span>
              <strong>
                A quantidade de atletas poderá ser alterada ao longo da
                parceria, sendo o valor mensal ajustado conforme a quantidade
                contratada.
              </strong>
            </div>
          </div>
        </div>
      </section>

      <section className="pp-final">
        <div className="pp-shell">
          <div className="pp-final-top">
            <span>INVESTIMENTO MENSAL</span>

            <p>
              considerando 10 atletas
            </p>
          </div>

          <h2>
            R$ 1.800,00
          </h2>

          <div className="pp-final-divider" />

          <div className="pp-final-message">
            <span>
              LEO SOUZA DESIGNER
            </span>

            <h3>
              Gestão de Instagram
              <br />
              + Comunicação dos Atletas
            </h3>

            <p>
              Uma estrutura pensada para manter a empresa presente,
              organizada e conectada à rotina esportiva dos seus atletas.
            </p>
          </div>

          <a
            className="pp-cta"
            href={`https://wa.me/${DATA.whatsapp}?text=${whatsappMessage}`}
            target="_blank"
            rel="noreferrer"
          >
            <span>FALAR COM LÉO</span>
            <b>↗</b>
          </a>

          <footer className="pp-footer">
            <strong>Léo Souza — Designer</strong>
            <span>Desenvolvimento • Design • Tecnologia</span>
            <small>Proposta válida conforme condições apresentadas.</small>
          </footer>
        </div>
      </section>

      <div className="pp-floating-label">
        PEDRO WIESE
      </div>
    </main>
  );
}

export default ProposalPedro;