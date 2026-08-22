import React, { useEffect, useState } from 'react';
import '../styles/proposal-plans.css';

function getCompanyFromPath() {
  const parts = window.location.pathname.split('/').filter(Boolean);
  return parts[1] || 'marechal';
}

function formatCompanyName(slug) {
  return slug
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const plans = [
  {
    id: 'presenca',
    number: '01',
    name: 'PRESENÇA',
    price: 'R$ 997',
    suffix: '/ MÊS',
    label: 'PARA ORGANIZAR E PROFISSIONALIZAR',
    description:
      'Uma estrutura para começar uma presença digital consistente sem uma operação excessivamente complexa.',
    pieces: '8',
    stories: 'Estratégicos',
    campaigns: 'Básicas',
    metrics: 'Básicas',
    report: 'Simplificado',
    meeting: '—',
    features: [
      'Planejamento mensal',
      'Calendário editorial',
      'Direcionamento dos temas',
      'Organização das prioridades',
      'Até 8 peças gráficas mensais',
      'Edição de materiais enviados',
      'Adaptação de fotos e vídeos',
      'Organização visual do Instagram',
      'Manutenção da identidade',
      'Stories estratégicos',
      'Direção criativa',
      'Direcionamento de posicionamento',
      'Ajustes de comunicação'
    ]
  },
  {
    id: 'marechal',
    number: '02',
    name: 'MARECHAL',
    price: 'R$ 1.497',
    suffix: '/ MÊS',
    label: 'POSICIONAMENTO + ESTRATÉGIA + PRESENÇA DIGITAL',
    recommended: true,
    description:
      'O plano recomendado para o cenário identificado no diagnóstico.',
    pieces: '12',
    stories: 'Estratégicos',
    campaigns: 'Completas',
    metrics: 'Mensais',
    report: 'Mensal',
    meeting: 'Mensal',
    features: [
      'Tudo do plano Presença',
      'Planejamento estratégico mensal',
      'Definição de prioridades',
      'Direcionamento de conteúdo',
      'Planejamento de datas comerciais',
      'Direção de imagem',
      'Posicionamento da comunicação',
      'Evolução da percepção da marca',
      'Direção de linguagem',
      'Até 12 peças gráficas mensais',
      'Peças institucionais e comerciais',
      'Campanhas',
      'Edição de vídeos enviados',
      'Adaptação para Reels',
      'Stories estratégicos',
      'Organização do feed e destaques',
      'Acompanhamento de métricas',
      'Relatório mensal',
      'Reunião estratégica mensal',
      'Manutenção do Link da Bio'
    ]
  },
  {
    id: 'prime',
    number: '03',
    name: 'MARECHAL PRIME',
    price: 'R$ 1.997',
    suffix: '/ MÊS',
    label: 'PRESENÇA DIGITAL INTENSIVA',
    description:
      'Para empresas que desejam maior volume de comunicação e acompanhamento estratégico.',
    pieces: '16',
    stories: 'Maior frequência',
    campaigns: 'Avançadas',
    metrics: 'Estratégicas',
    report: 'Estratégico',
    meeting: 'Mensal',
    features: [
      'Tudo do plano Marechal',
      'Até 16 peças gráficas mensais',
      'Maior volume de edição de vídeos',
      'Maior frequência de Stories',
      'Planejamento comercial ampliado',
      'Campanhas especiais',
      'Análise de posicionamento',
      'Análise de desempenho',
      'Planejamento de comunicação ampliado',
      'Evolução da linguagem',
      'Desenvolvimento criativo de ações',
      'Acompanhamento mais próximo',
      'Relatório estratégico',
      'Análise contínua da comunicação'
    ]
  }
];

const comparisonRows = [
  ['Planejamento mensal', '✓', '✓', '✓'],
  ['Calendário editorial', '✓', '✓', '✓'],
  ['Posicionamento', '✓', '✓', '✓'],
  ['Direção de imagem', '✓', '✓', '✓'],
  ['Direção criativa', '✓', '✓', '✓'],
  ['Peças gráficas', '8', '12', '16'],
  ['Edição de vídeos enviados', '✓', '✓', '✓'],
  ['Stories', 'Estratégicos', 'Estratégicos', 'Maior frequência'],
  ['Organização do Instagram', '✓', '✓', '✓'],
  ['Destaques', '✓', '✓', '✓'],
  ['Campanhas', 'Básicas', '✓', 'Avançadas'],
  ['Datas comerciais', '—', '✓', '✓'],
  ['Métricas', 'Básicas', 'Mensais', 'Estratégicas'],
  ['Relatório', 'Simplificado', 'Mensal', 'Estratégico'],
  ['Reunião estratégica', '—', 'Mensal', 'Mensal']
];

function ProposalPlans() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selected, setSelected] = useState('marechal');

  const companySlug = getCompanyFromPath();
  const company =
    companySlug === 'marechal'
      ? 'MARECHAL'
      : formatCompanyName(companySlug).toUpperCase();

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoaded(true), 80);
    return () => window.clearTimeout(timer);
  }, []);

  const choosePlan = (plan) => {
    setSelected(plan.id);

    const message = [
      'Olá, Léo!',
      '',
      `Analisei a proposta da ${company} e tenho interesse no ${plan.name} — ${plan.price}/mês.`,
      '',
      'Gostaria de seguir com a contratação.'
    ].join('\n');

    const whatsappUrl = `https://wa.me/553131912341?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`proposal-plans ${isLoaded ? 'is-loaded' : ''}`}>
      <div className="plans-bg" />
      <div className="plans-noise" />
      <div className="plans-grid-bg" />

      <div className="plans-company-bg" aria-hidden="true">
        {company}
      </div>

      <header className="plans-header">
        <div className="plans-brand">
          LÉO SOUZA
          <small>DESIGNER · ESTRATEGISTA · IMAGEM</small>
        </div>

        <div className="plans-meta">
          <span>PROPOSTA</span>
          <strong>/ 001</strong>
        </div>
      </header>

      <aside className="plans-index">
        <span>04</span>
        <i />
        <span>08</span>
        <small>SOLUÇÃO</small>
      </aside>

      <main className="plans-main">

        <section className="plans-hero">
          <div className="plans-kicker">
            <span />
            <span>04 / 08</span>
            <span>SOLUÇÃO</span>
          </div>

          <span className="plans-eyebrow">A DIREÇÃO AGORA VIRA ESTRUTURA.</span>

          <h1>
            ESCOLHA
            <br />
            A FORMA
            <br />
            DE <em>AVANÇAR.</em>
          </h1>

          <p>
            Três níveis de acompanhamento para transformar
            a direção construída para {company} em presença,
            consistência e evolução.
          </p>
        </section>

        <div className="plans-divider">
          <span>INVESTIMENTO</span>
          <i />
          <span>{company}</span>
        </div>

        <section className="plans-cards">
          {plans.map((plan) => (
            <article
              key={plan.id}
              className={`plan-card ${plan.recommended ? 'is-recommended' : ''} ${selected === plan.id ? 'is-selected' : ''}`}
            >
              <div className="plan-card-top">
                <span>{plan.number}</span>
                {plan.recommended && <b>RECOMENDADO</b>}
              </div>

              <div className="plan-card-title">
                <h2>{plan.name}</h2>
                <div className="plan-price">
                  <strong>{plan.price}</strong>
                  <span>{plan.suffix}</span>
                </div>
              </div>

              <div className="plan-card-label">{plan.label}</div>

              <p className="plan-card-description">{plan.description}</p>

              <div className="plan-card-stats">
                <div>
                  <span>PEÇAS</span>
                  <strong>{plan.pieces}</strong>
                </div>
                <div>
                  <span>STORIES</span>
                  <strong>{plan.stories}</strong>
                </div>
                <div>
                  <span>CAMPANHAS</span>
                  <strong>{plan.campaigns}</strong>
                </div>
              </div>

              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}>
                    <i>✓</i>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button type="button" onClick={() => choosePlan(plan)}>
                <span>
                  {selected === plan.id ? 'PLANO SELECIONADO' : 'ESCOLHER PLANO'}
                </span>
                <strong>↗</strong>
              </button>
            </article>
          ))}
        </section>

        <section className="plans-bonus">
          <div>
            <span>ORGANIZAÇÃO INICIAL</span>
            <strong>R$ 0</strong>
          </div>

          <div>
            <b>CORTESIA DE INÍCIO</b>
            <p>
              Na contratação de qualquer plano, a Marechal recebe
              a organização inicial da casa digital: revisão da bio,
              organização dos destaques, capas, estrutura do perfil,
              direcionamento visual inicial e Link da Bio personalizado.
            </p>
          </div>
        </section>

        <section className="plans-comparison">
          <div className="plans-section-head">
            <span>VISÃO GERAL</span>
            <h2>
              TRÊS PLANOS.
              <br />
              UMA DIREÇÃO.
            </h2>
          </div>

          <div className="comparison-wrap">
            <table>
              <thead>
                <tr>
                  <th>ENTREGA</th>
                  <th>PRESENÇA<br /><small>R$ 997</small></th>
                  <th className="recommended-col">MARECHAL<br /><small>R$ 1.497</small></th>
                  <th>PRIME<br /><small>R$ 1.997</small></th>
                </tr>
              </thead>

              <tbody>
                {comparisonRows.map(([label, basic, complete, prime]) => (
                  <tr key={label}>
                    <td>{label}</td>
                    <td>{basic}</td>
                    <td className="recommended-col">{complete}</td>
                    <td>{prime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="plans-bounds">
          <div className="plans-section-head">
            <span>ESCOPO</span>
            <h2>
              CLAREZA
              <br />
              TAMBÉM É
              <br />
              <em>PROFISSIONALISMO.</em>
            </h2>
          </div>

          <div className="bounds-grid">
            <div>
              <strong>NÃO INCLUI</strong>
              <p>
                Captação presencial, fotografia profissional,
                filmagem profissional, tráfego pago, verba de anúncios,
                influenciadores, impressão, materiais físicos e custos
                de ferramentas ou serviços externos de terceiros.
              </p>
            </div>

            <div>
              <strong>A MARECHAL FORNECE</strong>
              <p>
                Fotos, vídeos, informações, novidades, promoções,
                registros e materiais necessários para alimentar
                a comunicação.
              </p>
            </div>

            <div>
              <strong>LÉO SOUZA ENTREGA</strong>
              <p>
                Planejamento, posicionamento, direção, organização,
                criação, edição, design, análise e orientação.
              </p>
            </div>
          </div>
        </section>

        <section className="plans-recommendation">
          <span>RECOMENDAÇÃO</span>

          <h2>
            MARECHAL
            <br />
            <em>R$ 1.497 / MÊS</em>
          </h2>

          <p>
            É o plano que melhor equilibra planejamento,
            posicionamento, imagem, design, conteúdo,
            organização, análise e acompanhamento estratégico.
          </p>

          <div className="recommendation-pill">
            <i />
            PLANO RECOMENDADO PARA O CENÁRIO IDENTIFICADO
          </div>
        </section>

        <section className="plans-start">
          <div>
            <span>APÓS A APROVAÇÃO</span>

            <h2>
              ESCOLHER.
              <br />
              CONFIRMAR.
              <br />
              <em>COMEÇAR.</em>
            </h2>
          </div>

          <ol>
            <li><b>01</b><span>Escolha do plano.</span></li>
            <li><b>02</b><span>Confirmação da contratação.</span></li>
            <li><b>03</b><span>Alinhamento inicial.</span></li>
            <li><b>04</b><span>Organização da casa digital — cortesia.</span></li>
            <li><b>05</b><span>Planejamento do primeiro ciclo.</span></li>
            <li><b>06</b><span>Início da produção.</span></li>
          </ol>
        </section>

        <section className="plans-final">
          <span>UMA NOVA FASE PARA A PRESENÇA DIGITAL DA MARCA.</span>

          <h2>
            A MARECHAL
            <br />
            JÁ TEM
            <br />
            <em>A EXPERIÊNCIA.</em>
          </h2>

          <p>
            Agora é hora de transformar tudo isso em uma presença
            digital à altura da marca.
          </p>

          <div className="plans-final-mark">
            <strong>LÉO SOUZA</strong>
            <span>ESTRATÉGIA DE IMAGEM &amp; PRESENÇA DIGITAL</span>
          </div>
        </section>

      </main>

      <div className="plans-ticker" aria-hidden="true">
        <div className="plans-ticker-track">
          {[1, 2].map((copy) => (
            <div className="plans-ticker-group" key={copy}>
              <span className="accent">● {company}</span>
              <b>/</b>
              <span>SOLUÇÃO</span>
              <b>/</b>
              <span>PRESENÇA</span>
              <b>/</b>
              <span>MARECHAL</span>
              <b>/</b>
              <span>PRIME</span>
              <b>/</b>
              <span>INVESTIMENTO</span>
              <b>/</b>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProposalPlans;