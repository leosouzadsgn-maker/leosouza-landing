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
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  const message = encodeURIComponent(
    'Olá, Léo! Analisei a proposta comercial de Gestão de Instagram + Comunicação dos Atletas para Pedro Wiese e gostaria de seguir com a contratação.'
  );

  return (
    <main className={`pp-proposal ${loaded ? 'is-loaded' : ''}`}>
      <div className="pp-aurora" />
      <div className="pp-grid" />
      <div className="pp-noise" />

      <header className="pp-header pp-shell">
        <div className="pp-brand">
          LÉO SOUZA
          <small>DESIGNER · ESTRATÉGIA · COMUNICAÇÃO</small>
        </div>
        <div className="pp-number">
          PROPOSTA <strong>/ {DATA.number}</strong>
        </div>
      </header>

      <section className="pp-hero pp-shell">
        <div className="pp-kicker"><span /> PROPOSTA COMERCIAL</div>
        <span className="pp-eyebrow">GESTÃO DE INSTAGRAM + COMUNICAÇÃO DOS ATLETAS</span>
        <h1>
          UMA PRESENÇA
          <br />
          DIGITAL PARA
          <br />
          <em>{DATA.client}.</em>
        </h1>
        <p>
          Uma estrutura mensal para organizar a comunicação da empresa,
          fortalecer sua presença no mercado esportivo e acompanhar a rotina
          de comunicação dos atletas.
        </p>

        <div className="pp-client-strip">
          <div><span>CLIENTE</span><strong>{DATA.client}</strong></div>
          <div><span>PRESTADOR</span><strong>{DATA.provider}</strong></div>
          <div><span>PERIODICIDADE</span><strong>{DATA.periodicity}</strong></div>
        </div>
      </section>

      <section className="pp-section pp-shell">
        <div className="pp-index">01</div>
        <div className="pp-content">
          <div className="pp-section-label">01 — GESTÃO DO INSTAGRAM</div>
          <h2>GESTÃO DO <em>INSTAGRAM.</em></h2>
          <div className="pp-price">R$ 800,00 <small>/ MÊS</small></div>
          <p>A gestão contempla:</p>
          <ul className="pp-list">
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
            ].map((x, i) => <li key={x}><b>{String(i + 1).padStart(2, '0')}</b><span>{x}</span></li>)}
          </ul>
          <div className="pp-objective">
            <span>OBJETIVO</span>
            <p>Construir uma presença digital profissional, consistente e alinhada ao posicionamento da empresa no mercado esportivo.</p>
          </div>
        </div>
      </section>

      <section className="pp-section pp-shell pp-section-alt">
        <div className="pp-index">02</div>
        <div className="pp-content">
          <div className="pp-section-label">02 — COMUNICAÇÃO DOS ATLETAS</div>
          <h2>COMUNICAÇÃO <em>DOS ATLETAS.</em></h2>
          <div className="pp-price">R$ 100,00 <small>/ ATLETA / MÊS</small></div>
          <p>Cada atleta incluído na parceria terá sua comunicação esportiva acompanhada durante o mês.</p>
          <p className="pp-subtitle">Inclui:</p>
          <ul className="pp-list">
            {[
              'Acompanhamento do calendário de jogos',
              'Identificação de datas e horários das partidas',
              'Criação das artes Matchday',
              'Publicação dos Matchdays',
              'Adequação das artes à identidade visual da empresa',
              'Comunicação de resultados e momentos relevantes, quando necessário',
            ].map((x, i) => <li key={x}><b>{String(i + 1).padStart(2, '0')}</b><span>{x}</span></li>)}
          </ul>

          <div className="pp-important">
            <span>IMPORTANTE</span>
            <p>O valor de <strong>R$ 100,00 por atleta é mensal</strong> e contempla as artes Matchday necessárias de acordo com a rotina esportiva do atleta.</p>
            <p><strong>Não haverá cobrança individual por cada arte Matchday.</strong></p>
          </div>
        </div>
      </section>

      <section className="pp-investment">
        <div className="pp-shell">
          <div className="pp-section-label">03 — INVESTIMENTO</div>
          <h2>INVESTIMENTO <em>MENSAL.</em></h2>
          <div className="pp-equation">
            <div><span>GESTÃO DO INSTAGRAM</span><strong>R$ 800,00 / MÊS</strong></div>
            <b>+</b>
            <div><span>COMUNICAÇÃO DOS ATLETAS</span><strong>R$ 100,00 × ATLETAS</strong></div>
          </div>
          <div className="pp-formula">
            <span>FÓRMULA DO INVESTIMENTO</span>
            <strong>R$ 800,00 + R$ 100,00 × quantidade de atletas</strong>
          </div>
          <div className="pp-example">
            <div><span>EXEMPLO COM 12 ATLETAS</span><strong>12 atletas → R$ 1.200,00</strong></div>
            <div><span>GESTÃO DO INSTAGRAM</span><strong>R$ 800,00</strong></div>
          </div>
          <div className="pp-total">
            <span>TOTAL</span>
            <strong>R$ 2.000,00 <small>/ MÊS</small></strong>
          </div>
        </div>
      </section>

      <section className="pp-section pp-shell">
        <div className="pp-index">04</div>
        <div className="pp-content">
          <div className="pp-section-label">04 — FORMA DE TRABALHO</div>
          <h2>FORMA DE <em>TRABALHO.</em></h2>
          <p>O trabalho será realizado de forma contínua, através do planejamento e acompanhamento da rotina da empresa e dos atletas.</p>
          <p>O calendário esportivo será acompanhado para que as publicações de Matchday sejam organizadas com antecedência, sempre que as informações necessárias estiverem disponíveis.</p>
          <p>O cliente deverá fornecer informações, fotos, vídeos e demais materiais necessários para a produção dos conteúdos quando estes dependerem diretamente da empresa ou dos atletas.</p>
        </div>
      </section>

      <section className="pp-section pp-shell pp-section-alt">
        <div className="pp-index">05</div>
        <div className="pp-content">
          <div className="pp-section-label">05 — CONDIÇÕES</div>
          <h2>CONDIÇÕES <em>COMERCIAIS.</em></h2>
          <div className="pp-conditions">
            <div><span>PERIODICIDADE</span><strong>MENSAL</strong></div>
            <div><span>GESTÃO DO INSTAGRAM</span><strong>R$ 800,00 / MÊS</strong></div>
            <div><span>COMUNICAÇÃO DOS ATLETAS</span><strong>R$ 100,00 / ATLETA / MÊS</strong></div>
            <div><span>PAGAMENTO</span><strong>Mensal, com vencimento a definir entre as partes.</strong></div>
            <div className="pp-condition-full"><span>AJUSTE DE QUANTIDADE</span><strong>A quantidade de atletas poderá ser alterada ao longo da parceria, sendo o valor mensal ajustado conforme a quantidade contratada.</strong></div>
          </div>
        </div>
      </section>

      <section className="pp-final pp-shell">
        <div className="pp-section-label">INVESTIMENTO MENSAL</div>
        <h2><em>R$ 1.800,00</em></h2>
        <p>considerando 10 atletas</p>
        <div className="pp-final-note">
          <span>LEO SOUZA DESIGNER</span>
          <strong>Gestão de Instagram + Comunicação dos Atletas</strong>
        </div>
        <a className="pp-whatsapp" href={`https://wa.me/${DATA.whatsapp}?text=${message}`} target="_blank" rel="noreferrer">
          FALAR COM LÉO <b>↗</b>
        </a>
      </section>

      <div className="pp-ticker" aria-hidden="true">
        <div className="pp-ticker-track">
          {[1, 2].map(n => <div className="pp-ticker-group" key={n}>
            <span>● {DATA.client}</span><b>/</b><span>INSTAGRAM</span><b>/</b><span>ATLETAS</span><b>/</b><span>FUTEBOL</span><b>/</b><span>R$ 800,00</span><b>/</b><span>R$ 100,00 / ATLETA</span><b>/</b>
          </div>)}
        </div>
      </div>
    </main>
  );
}

export default ProposalPedro;
