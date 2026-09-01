import React, { useEffect, useState } from 'react';
import '../styles/proposal-fernando.css';

const PROPOSAL = {
  number: '002',
  client: 'FERNANDO VEIGA',
  project: 'Fernando bartender',
  date: '01 DE SETEMBRO DE 2026',
  value: 'R$ 2.000,00',
  validity: '7 DIAS',
};

function ProposalFernando() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 80);

    return () => clearTimeout(timer);
  }, []);

  const whatsappMessage = encodeURIComponent(
    'Olá, Léo! Sou Fernando Veiga e quero seguir com a contratação da proposta do projeto Fernando bartender no valor de R$ 2.000,00.'
  );

  return (
    <main className={`proposal-fernando ${loaded ? 'is-loaded' : ''}`}>
      <div className="pf-bg" />
      <div className="pf-grid" />
      <div className="pf-noise" />

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="pf-header">
        <div className="pf-brand">
          LÉO SOUZA
          <small>DESIGNER · DESENVOLVIMENTO · ESTRATÉGIA</small>
        </div>

        <div className="pf-meta">
          <span>PROPOSTA</span>
          <strong>/ {PROPOSAL.number}</strong>
        </div>
      </header>

      {/* =====================================================
          NAVEGAÇÃO LATERAL
      ===================================================== */}

      <aside className="pf-side">
        <span>01</span>
        <i />
        <span>14</span>
        <small>FERNANDO BARTENDER</small>
      </aside>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="pf-hero pf-shell">

        <div className="pf-kicker">
          <span />
          PROPOSTA COMERCIAL
        </div>

        <div className="pf-hero-main">

          <span className="pf-eyebrow">
            DESENVOLVIMENTO DE IDENTIDADE, PRESENÇA DIGITAL E SISTEMA DE PROPOSTAS
          </span>

          <h1>
            UMA ESTRUTURA
            <br />
            DIGITAL PARA
            <br />
            <em>{PROPOSAL.project.toUpperCase()}.</em>
          </h1>

          <p className="pf-hero-description">
            Uma estrutura pensada para fortalecer a marca,
            organizar sua presença digital e transformar
            a apresentação dos serviços em uma experiência
            mais profissional.
          </p>

        </div>

        <div className="pf-client-strip">

          <div>
            <span>CLIENTE</span>
            <strong>{PROPOSAL.client}</strong>
          </div>

          <div>
            <span>PROJETO</span>
            <strong>{PROPOSAL.project}</strong>
          </div>

          <div>
            <span>DATA</span>
            <strong>{PROPOSAL.date}</strong>
          </div>

        </div>

      </section>

      {/* =====================================================
          01 — OBJETIVO
      ===================================================== */}

      <div className="pf-divider">
        <span>01 — OBJETIVO DO PROJETO</span>
        <i />
      </div>

      <section className="pf-shell pf-section">

        <div className="pf-number">01</div>

        <div className="pf-copy">

          <h2>
            OBJETIVO
            <br />
            <em>DO PROJETO.</em>
          </h2>

          <p>
            Desenvolver uma estrutura digital profissional para fortalecer
            a presença da marca, apresentar os serviços de bartender de
            forma estratégica e proporcionar uma experiência diferenciada
            na apresentação de propostas comerciais aos clientes.
          </p>

          <p>
            A solução será composta por{' '}
            <strong>
              identidade visual, site profissional e um sistema exclusivo
              de criação e gerenciamento de propostas personalizadas
            </strong>.
          </p>

        </div>

      </section>

      {/* =====================================================
          02 — IDENTIDADE VISUAL
      ===================================================== */}

      <div className="pf-divider">
        <span>02 — IDENTIDADE VISUAL</span>
        <i />
      </div>

      <section className="pf-shell pf-section">

        <div className="pf-number">02</div>

        <div className="pf-copy">

          <h2>
            IDENTIDADE
            <br />
            <em>VISUAL.</em>
          </h2>

          <p>
            Criação de uma identidade visual exclusiva para a marca,
            buscando transmitir profissionalismo, qualidade e personalidade.
          </p>

          <div className="pf-list">
            {[
              'Criação da logo principal',
              'Variações da logo para diferentes aplicações',
              'Definição de tipografia',
              'Definição de paleta de cores',
              'Aplicações digitais da identidade',
              'Arquivos preparados para utilização em redes sociais e materiais digitais',
            ].map((x, i) => (
              <div key={x}>
                <b>{String(i + 1).padStart(2, '0')}</b>
                <span>{x}</span>
              </div>
            ))}
          </div>

        </div>

      </section>

      {/* =====================================================
          03 — LANDING PAGE
      ===================================================== */}

      <div className="pf-divider">
        <span>03 — LANDING PAGE / PORTFÓLIO</span>
        <i />
      </div>

      <section className="pf-shell pf-section">

        <div className="pf-number">03</div>

        <div className="pf-copy">

          <h2>
            LANDING PAGE
            <br />
            <em>/ PORTFÓLIO.</em>
          </h2>

          <p>
            Desenvolvimento de uma página profissional para apresentar
            a marca, os serviços e o portfólio.
          </p>

          <h3>A página contará com:</h3>

          <div className="pf-list">
            {[
              'Apresentação principal da marca',
              'Sobre o bartender',
              'Serviços oferecidos',
              'Portfólio de eventos e trabalhos',
              'Diferenciais',
              'Como funciona o atendimento',
              'Depoimentos',
              'Chamadas estratégicas para contato',
              'Botões direcionando para o WhatsApp',
              'Layout responsivo para celular, tablet e computador',
            ].map((x, i) => (
              <div key={x}>
                <b>{String(i + 1).padStart(2, '0')}</b>
                <span>{x}</span>
              </div>
            ))}
          </div>

          <div className="pf-callout">
            O objetivo é transformar a página em uma{' '}
            <strong>vitrine digital profissional da marca</strong>.
          </div>

        </div>

      </section>

      {/* =====================================================
          04 — SISTEMA DE PROPOSTAS
      ===================================================== */}

      <div className="pf-divider">
        <span>04 — SISTEMA DE PROPOSTAS PERSONALIZADAS</span>
        <i />
      </div>

      <section className="pf-shell pf-section">

        <div className="pf-number">04</div>

        <div className="pf-copy">

          <h2>
            SISTEMA DE
            <br />
            <em>PROPOSTAS.</em>
          </h2>

          <p>
            Será desenvolvido um sistema exclusivo para criação
            de propostas comerciais.
          </p>

          <div className="pf-flow">

            <span>O bartender conversa com o cliente</span>
            <b>→</b>

            <span>combina todos os detalhes</span>
            <b>→</b>

            <span>acessa o painel</span>
            <b>→</b>

            <span>cria a proposta</span>
            <b>→</b>

            <span>publica</span>
            <b>→</b>

            <span>envia o link pelo WhatsApp.</span>

          </div>

          <p>
            A proposta já estará pronta e personalizada para aquele cliente.
          </p>

          <h3>Informações que poderão ser cadastradas:</h3>

          <div className="pf-tags">
            {[
              'Nome do cliente',
              'WhatsApp',
              'Tipo de evento',
              'Data',
              'Horário',
              'Local',
              'Quantidade de convidados',
              'Serviço contratado',
              'Descrição do serviço',
              'Itens inclusos',
              'Valor',
              'Desconto',
              'Valor final',
              'Forma de pagamento',
              'Condições de pagamento',
              'Observações',
            ].map((x) => (
              <span key={x}>{x}</span>
            ))}
          </div>

        </div>

      </section>

      {/* =====================================================
          05 — PAINEL ADMINISTRATIVO
      ===================================================== */}

      <div className="pf-divider">
        <span>05 — PAINEL ADMINISTRATIVO</span>
        <i />
      </div>

      <section className="pf-shell pf-section">

        <div className="pf-number">05</div>

        <div className="pf-copy">

          <h2>
            PAINEL
            <br />
            <em>ADMINISTRATIVO.</em>
          </h2>

          <p>
            Área privada para gerenciamento das propostas.
          </p>

          <div className="pf-list">
            {[
              'Criar novas propostas',
              'Editar propostas',
              'Salvar propostas como rascunho',
              'Publicar propostas',
              'Visualizar propostas',
              'Copiar o link de cada proposta',
              'Compartilhar diretamente pelo WhatsApp',
              'Acompanhar o status das propostas',
              'Gerenciar propostas já criadas',
            ].map((x, i) => (
              <div key={x}>
                <b>{String(i + 1).padStart(2, '0')}</b>
                <span>{x}</span>
              </div>
            ))}
          </div>

          <h3>Status disponíveis:</h3>

          <div className="pf-status">
            {[
              'Rascunho',
              'Enviada',
              'Visualizada',
              'Aceita',
              'Recusada',
            ].map((x) => (
              <span key={x}>{x}</span>
            ))}
          </div>

        </div>

      </section>

      {/* =====================================================
          06 — PÁGINA INDIVIDUAL
      ===================================================== */}

      <div className="pf-divider">
        <span>06 — PÁGINA INDIVIDUAL DA PROPOSTA</span>
        <i />
      </div>

      <section className="pf-shell pf-section">

        <div className="pf-number">06</div>

        <div className="pf-copy">

          <h2>
            PÁGINA
            <br />
            <em>INDIVIDUAL.</em>
          </h2>

          <p>
            Cada cliente receberá uma página exclusiva através
            de um link único.
          </p>

          <div className="pf-url">
            site.com/proposta/8F72K
          </div>

          <p>
            O cliente não precisará criar uma conta ou acessar
            nenhum painel.
          </p>

          <div className="pf-proposal-card">

            <strong>PROPOSTA PERSONALIZADA</strong>

            <span>Olá, [Nome do Cliente]!</span>

            <small>
              Detalhes do evento · Serviço contratado · Incluso no serviço ·
              Investimento · Condições de pagamento · Observações
            </small>

            <b>R$ X.XXX,XX</b>

            <div className="pf-card-actions">
              <span>ACEITAR PROPOSTA</span>
              <span>FALAR PELO WHATSAPP</span>
            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          07 — WHATSAPP
      ===================================================== */}

      <div className="pf-divider">
        <span>07 — INTEGRAÇÃO COM WHATSAPP</span>
        <i />
      </div>

      <section className="pf-shell pf-section">

        <div className="pf-number">07</div>

        <div className="pf-copy">

          <h2>
            WHATSAPP
            <br />
            <em>NO FLUXO.</em>
          </h2>

          <p>
            O sistema será preparado para facilitar o envio das propostas.
          </p>

          <div className="pf-quote">
            “Olá, [Nome]! Conforme conversamos, preparei sua proposta
            personalizada. Confira todos os detalhes através do link abaixo.”
          </div>

        </div>

      </section>

      {/* =====================================================
          08 — RESPONSIVIDADE
      ===================================================== */}

      <div className="pf-divider">
        <span>08 — RESPONSIVIDADE</span>
        <i />
      </div>

      <section className="pf-shell pf-section">

        <div className="pf-number">08</div>

        <div className="pf-copy">

          <h2>
            UMA EXPERIÊNCIA
            <br />
            <em>EM QUALQUER TELA.</em>
          </h2>

          <p>
            Todo o projeto será desenvolvido para oferecer
            uma boa experiência em:
          </p>

          <div className="pf-device-grid">

            <span>
              📱
              <b>Celulares</b>
            </span>

            <span>
              💻
              <b>Computadores</b>
            </span>

            <span>
              📲
              <b>Tablets</b>
            </span>

          </div>

          <p>
            A prioridade será garantir uma experiência especialmente
            confortável para o acesso pelo celular, tanto para o bartender
            quanto para seus clientes.
          </p>

        </div>

      </section>

      {/* =====================================================
          09 — SEGURANÇA
      ===================================================== */}

      <div className="pf-divider">
        <span>09 — SEGURANÇA E ACESSO</span>
        <i />
      </div>

      <section className="pf-shell pf-section">

        <div className="pf-number">09</div>

        <div className="pf-copy">

          <h2>
            SEGURANÇA
            <br />
            <em>E ACESSO.</em>
          </h2>

          <p>
            O sistema contará com uma área administrativa protegida
            por autenticação.
          </p>

          <p>
            O cliente não terá acesso ao painel administrativo.
          </p>

          <p>
            Cada proposta será disponibilizada através de um link individual,
            permitindo que o cliente visualize somente a proposta destinada
            a ele.
          </p>

        </div>

      </section>

      {/* =====================================================
          10 — RESULTADO FINAL
      ===================================================== */}

      <div className="pf-divider">
        <span>10 — RESULTADO FINAL</span>
        <i />
      </div>

      <section className="pf-shell pf-section">

        <div className="pf-number">10</div>

        <div className="pf-copy">

          <h2>
            RESULTADO
            <br />
            <em>FINAL.</em>
          </h2>

          <div className="pf-result-grid">

            <div>
              <b>🎨 IDENTIDADE</b>
              <span>
                Uma identidade visual própria e profissional.
              </span>
            </div>

            <div>
              <b>🌐 PRESENÇA DIGITAL</b>
              <span>
                Um site moderno para apresentar a marca e seus serviços.
              </span>
            </div>

            <div>
              <b>💰 FERRAMENTA COMERCIAL</b>
              <span>
                Um sistema próprio para criação de propostas personalizadas.
              </span>
            </div>

            <div>
              <b>🔐 GESTÃO</b>
              <span>
                Um painel administrativo para organizar e gerenciar as propostas.
              </span>
            </div>

            <div>
              <b>👤 EXPERIÊNCIA DO CLIENTE</b>
              <span>
                Uma página exclusiva para cada proposta, criada para
                apresentar o orçamento de forma profissional.
              </span>
            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          11 — INVESTIMENTO
      ===================================================== */}

      <section className="pf-investment">

        <div className="pf-shell">

          <span>11 — INVESTIMENTO</span>

          <h2>
            PROJETO
            <br />
            <em>COMPLETO.</em>
          </h2>

          <strong>{PROPOSAL.value}</strong>

          <div className="pf-payment">

            <div>
              <b>À vista via PIX:</b>
              <span>{PROPOSAL.value}</span>
            </div>

            <div>
              <b>Cartão de crédito:</b>
              <span>
                Até 12x conforme as condições da plataforma
                de pagamento utilizada.
              </span>
            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          12 — DESENVOLVIMENTO
      ===================================================== */}

      <section className="pf-development">

        <div className="pf-shell">

          <div className="pf-number">12</div>

          <div>

            <span>12 — CONDIÇÕES DE DESENVOLVIMENTO</span>

            <h2>
              ETAPAS DO
              <br />
              <em>PROJETO.</em>
            </h2>

            <div className="pf-steps">

              {[
                'Identidade visual',
                'Design da experiência',
                'Landing Page',
                'Sistema de propostas',
                'Painel administrativo',
                'Página individual das propostas',
                'Integrações',
                'Testes e ajustes',
                'Publicação',
              ].map((x, i) => (
                <div key={x}>
                  <b>{String(i + 1).padStart(2, '0')}</b>
                  <span>{x}</span>
                </div>
              ))}

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          13 — OBSERVAÇÃO
      ===================================================== */}

      <section className="pf-terms pf-shell">

        <div>

          <span>13 — OBSERVAÇÃO</span>

          <h2>
            ESCOPO
            <br />
            <em>CLARO.</em>
          </h2>

        </div>

        <p>
          O projeto contempla o desenvolvimento da estrutura
          descrita nesta proposta.
        </p>

        <p>
          Custos de serviços de terceiros eventualmente necessários
          para funcionamento do projeto, como domínio, serviços de
          hospedagem, ferramentas de pagamento ou outros serviços
          externos, poderão ser cobrados separadamente quando aplicáveis.
        </p>

      </section>

      {/* =====================================================
          14 — VALIDADE
      ===================================================== */}

      <section className="pf-final">

        <div className="pf-shell">

          <span>14 — VALIDADE DA PROPOSTA</span>

          <h2>
            {PROPOSAL.validity}.
          </h2>

          <p>
            Esta proposta comercial possui validade de{' '}
            <strong>7 dias</strong> a partir da data de apresentação.
          </p>

          <div className="pf-close">

            <span>
              VAMOS TRANSFORMAR ESSA IDEIA EM UMA EXPERIÊNCIA PROFISSIONAL?
            </span>

            <h3>
              A PROPOSTA NÃO É APENAS
              <br />
              CRIAR UM SITE.
            </h3>

            <p>
              É criar uma estrutura para que a marca tenha{' '}
              <strong>
                uma identidade forte, uma presença digital profissional
                e uma forma moderna de apresentar seus serviços e fechar
                novos eventos.
              </strong>
            </p>

          </div>

          <a
            className="pf-whatsapp"
            href={`https://wa.me/553131912341?text=${whatsappMessage}`}
            target="_blank"
            rel="noreferrer"
          >
            <span>FALAR COM LÉO SOUZA</span>
            <b>↗</b>
          </a>

          <div className="pf-signature">
            <strong>LÉO SOUZA — DESIGNER</strong>
            <span>Desenvolvimento • Design • Tecnologia</span>
          </div>

        </div>

      </section>

      {/* =====================================================
          TICKER
      ===================================================== */}

      <div className="pf-ticker">

        <div className="pf-ticker-track">

          {[1, 2].map((i) => (

            <div className="pf-ticker-group" key={i}>

              <span>● {PROPOSAL.client}</span>
              <b>/</b>

              <span>FERNANDO BARTENDER</span>
              <b>/</b>

              <span>PROPOSTA COMERCIAL</span>
              <b>/</b>

              <span>R$ 2.000,00</span>
              <b>/</b>

              <span>VALIDADE 7 DIAS</span>
              <b>/</b>

              <span>LÉO SOUZA DSGN</span>
              <b>/</b>

            </div>

          ))}

        </div>

      </div>

    </main>
  );
}

export default ProposalFernando;