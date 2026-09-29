import React, { useEffect } from 'react';
import '../styles/proposal-ourocred.css';

const modules = [
  ['01', 'Clientes', 'Cadastro, relacionamento e histórico.'],
  ['02', 'Operações', 'Crédito, negociação e processamento.'],
  ['03', 'Taxas', 'Regras comerciais centralizadas.'],
  ['04', 'Máquinas', 'Controle dos equipamentos utilizados.'],
  ['05', 'Comissões', 'Cálculo e acompanhamento.'],
  ['06', 'FC + NC', 'Fator e nível de comissionamento.'],
  ['07', 'Caixa', 'Entradas, saídas e fechamento.'],
  ['08', 'Funcionários', 'Equipe, cargos e histórico.'],
  ['09', 'Folha', 'Salários, variáveis e ajustes.'],
  ['10', 'Metas + Performance', 'Resultados individuais e de equipe.'],
  ['11', 'Documentos', 'Recibos, comprovantes e PDFs.'],
  ['12', 'Relatórios', 'Visão operacional e gerencial.'],
  ['13', 'Usuários + Permissões', 'Acessos por perfil e módulo.'],
  ['14', 'Auditoria', 'Rastreabilidade das ações.'],
];

const modalities = [
  'Cartão de Crédito',
  'INSS',
  'FGTS',
  'Bolsa Família',
  'Conta de Luz',
  'CLT',
  'Outras modalidades',
];

const operationChain = [
  'CLIENTE',
  'NOVA OPERAÇÃO',
  'CÁLCULOS',
  'FC',
  'NC',
  'COMISSÃO',
  'CAIXA',
  'DOCUMENTOS',
  'EXTRATO',
  'RELATÓRIOS',
];

const architecture = [
  ['LOJA 1', 'Funcionários', 'Máquinas', 'Caixa', 'Vendas', 'Comissões', 'Resultados'],
  ['LOJA 2', 'Funcionários', 'Máquinas', 'Caixa', 'Vendas', 'Comissões', 'Resultados'],
  ['DELIVERY / EXTERNO', 'Vendedores', 'Clientes', 'Operações', 'Resultados', 'Comissões'],
];

const reportGroups = [
  {
    title: 'Por vendedor',
    items: ['Vendas', 'FC', 'NC', 'Comissão', 'Bonificação'],
  },
  {
    title: 'Por loja',
    items: ['Volume', 'Operações', 'Resultado', 'Caixa'],
  },
  {
    title: 'Por máquina',
    items: ['Volume', 'Operações', 'Taxas', 'Resultado'],
  },
  {
    title: 'Por bandeira',
    items: ['Volume', 'Taxas', 'Operações', 'Resultado'],
  },
];

const adminItems = [
  'Dashboard',
  'Operações',
  'Clientes',
  'Lojas',
  'Vendedores',
  'Comissões',
  'FC / NC',
  'Máquinas',
  'Bandeiras',
  'Caixa',
  'Folha',
  'Metas',
  'Performance',
  'Relatórios',
  'Documentos',
  'Usuários',
  'Configurações',
  'Auditoria',
];

function Reveal({ children, className = '' }) {
  return (
    <div className={`ouro-reveal ${className}`}>
      {children}
    </div>
  );
}

function SectionHeader({ number, eyebrow, title, subtitle }) {
  return (
    <div className="ouro-section-header">
      <div className="ouro-section-index">{number}</div>

      <div>
        {eyebrow && <span className="ouro-eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </div>
  );
}

function FeatureList({ items }) {
  return (
    <div className="ouro-feature-grid">
      {items.map((item) => (
        <div className="ouro-feature" key={item}>
          <span className="ouro-feature-dot" />
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}

function ChainFlow({ items }) {
  return (
    <div className="ouro-chain-flow">
      {items.map((item, index) => (
        <React.Fragment key={item}>
          <div className="ouro-chain-node">
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{item}</strong>
          </div>

          {index < items.length - 1 && (
            <div className="ouro-chain-arrow">↓</div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function DashboardMockup() {
  return (
    <div className="ouro-dashboard">
      <div className="ouro-dashboard-top">
        <div className="ouro-window-dots">
          <i />
          <i />
          <i />
        </div>

        <span>OURO CRED / DASHBOARD</span>

        <div className="ouro-status">
          <span />
          ONLINE
        </div>
      </div>

      <div className="ouro-dashboard-body">
        <aside className="ouro-dashboard-sidebar">
          <div className="ouro-mini-logo">OC</div>

          {[
            'Dashboard',
            'Operações',
            'Clientes',
            'Comissões',
            'Caixa',
            'Relatórios',
          ].map((item, index) => (
            <div
              className={`ouro-side-item ${index === 0 ? 'active' : ''}`}
              key={item}
            >
              <span />
              {item}
            </div>
          ))}
        </aside>

        <div className="ouro-dashboard-content">
          <div className="ouro-dashboard-heading">
            <div>
              <span>VISÃO GERAL</span>
              <h3>Operação conectada</h3>
            </div>

            <div className="ouro-dashboard-date">
              FILTRO · PERÍODO
            </div>
          </div>

          <div className="ouro-metric-grid">
            <div className="ouro-metric">
              <span>VENDAS</span>
              <strong>R$ 128.480</strong>
              <small>+ operação consolidada</small>
            </div>

            <div className="ouro-metric">
              <span>COMISSÕES</span>
              <strong>R$ 8.420</strong>
              <small>FC + NC aplicados</small>
            </div>

            <div className="ouro-metric">
              <span>OPERAÇÕES</span>
              <strong>084</strong>
              <small>processadas no período</small>
            </div>
          </div>

          <div className="ouro-dashboard-main">
            <div className="ouro-chart">
              <div className="ouro-chart-head">
                <span>EVOLUÇÃO DA OPERAÇÃO</span>
                <strong>12 MESES</strong>
              </div>

              <div className="ouro-bars">
                {[32, 44, 37, 56, 48, 65, 58, 73, 67, 82, 76, 92].map(
                  (height, index) => (
                    <div className="ouro-bar-wrap" key={index}>
                      <div
                        className="ouro-bar"
                        style={{ height: `${height}%` }}
                      />
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="ouro-dashboard-list">
              <div className="ouro-list-title">
                ÚLTIMAS OPERAÇÕES
              </div>

              {[
                ['Cliente 001', 'Cartão', 'FC 0,82'],
                ['Cliente 002', 'INSS', 'FC 0,76'],
                ['Cliente 003', 'FGTS', 'FC 1,04'],
                ['Cliente 004', 'CLT', 'FC 0,68'],
              ].map(([name, type, fc]) => (
                <div className="ouro-list-row" key={name}>
                  <div>
                    <strong>{name}</strong>
                    <span>{type}</span>
                  </div>
                  <b>{fc}</b>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProposalOuroCred() {
  useEffect(() => {
    const elements = document.querySelectorAll('.ouro-reveal');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      {
        threshold: 0.08,
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  const scrollToProject = () => {
    document
      .getElementById('projeto')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="ouro-page">
      <div className="ouro-noise" />
      <div className="ouro-orb ouro-orb-1" />
      <div className="ouro-orb ouro-orb-2" />

      <header className="ouro-topbar">
        <div className="ouro-brand">
          <span className="ouro-brand-mark">OC</span>

          <div>
            <strong>OURO CRED</strong>
            <span>PLATAFORMA DE GESTÃO OPERACIONAL</span>
          </div>
        </div>

        <div className="ouro-topbar-label">
          PROJETO INSTITUCIONAL
          <span>2026</span>
        </div>
      </header>

      <section className="ouro-hero">
        <div className="ouro-hero-grid" />

        <div className="ouro-hero-inner">
          <Reveal className="ouro-hero-copy">
            <span className="ouro-kicker">
              PROPOSTA DE ARQUITETURA DIGITAL
            </span>

            <h1>
              OURO
              <br />
              <span>CRED</span>
            </h1>

            <p className="ouro-hero-title">
              PLATAFORMA DE GESTÃO OPERACIONAL
            </p>

            <p className="ouro-hero-description">
              Uma nova estrutura para centralizar, automatizar e evoluir a
              operação da Ouro Cred.
            </p>

            <p className="ouro-hero-text">
              A plataforma nasce a partir da realidade operacional da empresa:
              clientes, operações, lojas, vendedores, regras de margem,
              comissionamento, caixa, documentos e gestão.
            </p>

            <button
              type="button"
              className="ouro-primary-button"
              onClick={scrollToProject}
            >
              CONHECER A PLATAFORMA
              <span>↓</span>
            </button>
          </Reveal>

          <Reveal className="ouro-hero-visual">
            <div className="ouro-hero-glow" />

            <div className="ouro-floating-card ouro-floating-card-1">
              <span>FC</span>
              <strong>0,82</strong>
              <small>Fator de Comissionamento</small>
            </div>

            <div className="ouro-floating-card ouro-floating-card-2">
              <span>NC</span>
              <strong>NÍVEL 03</strong>
              <small>Resultado mensal</small>
            </div>

            <div className="ouro-hero-core">
              <div className="ouro-core-ring ring-1" />
              <div className="ouro-core-ring ring-2" />
              <div className="ouro-core-ring ring-3" />

              <div className="ouro-core-center">
                <span>OURO</span>
                <strong>CRED</strong>
                <small>CONNECTED OPERATION</small>
              </div>
            </div>

            <div className="ouro-hero-data data-1">CLIENTES</div>
            <div className="ouro-hero-data data-2">OPERAÇÕES</div>
            <div className="ouro-hero-data data-3">COMISSÕES</div>
            <div className="ouro-hero-data data-4">CAIXA</div>
          </Reveal>
        </div>

        <div className="ouro-scroll-indicator">
          <span />
          SCROLL TO EXPLORE
        </div>
      </section>

      <section className="ouro-intro-strip">
        <div className="ouro-intro-item">CLIENTES</div>
        <div className="ouro-intro-line" />
        <div className="ouro-intro-item">OPERAÇÕES</div>
        <div className="ouro-intro-line" />
        <div className="ouro-intro-item">TAXAS</div>
        <div className="ouro-intro-line" />
        <div className="ouro-intro-item">FC</div>
        <div className="ouro-intro-line" />
        <div className="ouro-intro-item">NC</div>
        <div className="ouro-intro-line" />
        <div className="ouro-intro-item">COMISSÕES</div>
        <div className="ouro-intro-line" />
        <div className="ouro-intro-item">CAIXA</div>
        <div className="ouro-intro-line" />
        <div className="ouro-intro-item">RELATÓRIOS</div>
      </section>

      <div id="projeto" />

      {/* 01 */}
      <section className="ouro-section">
        <Reveal>
          <SectionHeader
            number="01"
            eyebrow="O PROJETO"
            title="Não é apenas um novo sistema."
            subtitle="Uma plataforma desenvolvida especificamente para a realidade operacional da Ouro Cred."
          />

          <div className="ouro-two-column">
            <div>
              <p className="ouro-lead">
                O sistema será estruturado com base nos processos que a empresa
                já utiliza, mas com uma nova arquitetura, uma nova experiência
                de uso e, principalmente, uma nova lógica de automação.
              </p>
            </div>

            <div>
              <h3>O foco da plataforma</h3>

              <FeatureList
                items={[
                  'Centralizar as informações',
                  'Reduzir lançamentos repetidos',
                  'Automatizar cálculos',
                  'Conectar operação e gestão',
                  'Facilitar o trabalho dos vendedores',
                  'Aumentar o controle administrativo',
                  'Preservar histórico',
                  'Transformar dados em informação gerencial',
                ]}
              />
            </div>
          </div>
        </Reveal>
      </section>

      {/* 02 */}
      <section className="ouro-section ouro-section-soft">
        <Reveal>
          <SectionHeader
            number="02"
            eyebrow="O DESAFIO ATUAL"
            title="A operação envolve muitas etapas."
            subtitle="Quando as informações são tratadas separadamente, aumentam as chances de retrabalho e inconsistências."
          />

          <div className="ouro-operation-cloud">
            {[
              'Cliente',
              'Vendedor',
              'Loja',
              'Modalidade',
              'Valor',
              'Taxa',
              'Máquina',
              'Bandeira',
              'Negociação',
              'FC',
              'NC',
              'Comissão',
              'Caixa',
              'Recibo',
              'Documento',
              'Extrato',
              'Relatório',
            ].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>

          <div className="ouro-statement">
            <span>A NOVA PROPOSTA MUDA ESSA LÓGICA.</span>
            <strong>
              Uma operação gera os dados necessários para o restante da
              operação.
            </strong>
          </div>
        </Reveal>
      </section>

      {/* 03 */}
      <section className="ouro-section">
        <Reveal>
          <SectionHeader
            number="03"
            eyebrow="A NOVA EXPERIÊNCIA"
            title="Uma operação. Uma confirmação. Todo o sistema atualizado."
          />

          <ChainFlow items={operationChain} />
        </Reveal>
      </section>

      {/* 04 */}
      <section className="ouro-section ouro-section-soft">
        <Reveal>
          <SectionHeader
            number="04"
            eyebrow="OPERAÇÕES DE CRÉDITO"
            title="Todas as modalidades em uma única plataforma."
            subtitle="Arquitetura preparada para trabalhar com as principais modalidades utilizadas pela Ouro Cred."
          />

          <div className="ouro-modality-grid">
            {modalities.map((item, index) => (
              <div className="ouro-modality" key={item}>
                <span>0{index + 1}</span>
                <strong>{item}</strong>
              </div>
            ))}
          </div>

          <p className="ouro-note">
            A arquitetura será configurável, permitindo a evolução do catálogo
            de produtos da empresa.
          </p>
        </Reveal>
      </section>

      {/* 05 + 06 */}
      <section className="ouro-section">
        <Reveal>
          <SectionHeader
            number="05 — 06"
            eyebrow="CLIENTE + OPERAÇÃO"
            title="O processo começa pelo cliente."
            subtitle="O cadastro deixa de ser apenas um formulário e passa a ser a base de relacionamento da operação."
          />

          <div className="ouro-process-grid">
            <article className="ouro-card">
              <span className="ouro-card-number">05</span>
              <h3>NOVA OPERAÇÃO</h3>
              <p>
                O vendedor poderá pesquisar um cliente existente ou cadastrar um
                novo cliente.
              </p>

              <div className="ouro-search-box">
                <span>BUSCAR CLIENTE</span>
                <div className="ouro-search-field">
                  <span>CPF / NOME / TELEFONE</span>
                  <b>⌕</b>
                </div>
              </div>

              <FeatureList
                items={[
                  'CPF',
                  'Nome',
                  'Telefone',
                  'Celular',
                  'Histórico do cliente',
                ]}
              />
            </article>

            <article className="ouro-card">
              <span className="ouro-card-number">06</span>
              <h3>CLIENTE</h3>
              <p>
                Cada cliente terá um perfil completo e um histórico de
                relacionamento.
              </p>

              <FeatureList
                items={[
                  'Nome',
                  'CPF',
                  'RG',
                  'Data de nascimento',
                  'Telefone',
                  'Celular',
                  'E-mail',
                  'Endereço',
                  'Observações',
                  'Operações',
                  'Extrato',
                  'Pagamentos',
                  'Documentos',
                  'Taxas especiais',
                  'Histórico de atendimento',
                  'Vendedor responsável',
                  'Loja',
                ]}
              />
            </article>
          </div>
        </Reveal>
      </section>

      {/* 07 */}
      <section className="ouro-section ouro-section-soft">
        <Reveal>
          <SectionHeader
            number="07"
            eyebrow="CLIENTES ESPECIAIS"
            title="Condições diferenciadas de forma controlada."
            subtitle="A plataforma poderá identificar clientes que possuem condições especiais."
          />

          <div className="ouro-special-grid">
            {[
              ['TAXA DIFERENCIADA', 'Condição especial aplicada ao cliente.'],
              ['VALIDADE', 'Período em que a regra permanece ativa.'],
              ['REGRA', 'Critério que determina a condição.'],
              ['RESPONSÁVEL', 'Quem autorizou ou configurou.'],
              ['OBSERVAÇÃO', 'Contexto registrado para rastreabilidade.'],
            ].map(([title, text]) => (
              <div className="ouro-special-card" key={title}>
                <span>{title}</span>
                <strong>{text}</strong>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* 08 */}
      <section className="ouro-section">
        <Reveal>
          <SectionHeader
            number="08"
            eyebrow="OPERAÇÃO DE CARTÃO"
            title="Tudo dentro da mesma tela de operação."
          />

          <div className="ouro-card-operation">
            <div className="ouro-card-credit-visual">
              <div className="ouro-chip" />

              <div>
                <span>OURO CRED</span>
                <strong>OPERAÇÃO 001</strong>
              </div>

              <small>**** **** **** 7821</small>
            </div>

            <div className="ouro-input-grid">
              {[
                'Valor que o cliente recebe',
                'Valor de tabela',
                'Valor negociado',
                'Parcelas',
                'Bandeira',
                'Máquina',
                'Final do cartão',
                'Forma de entrega',
              ].map((label) => (
                <div className="ouro-input-item" key={label}>
                  <span>{label}</span>
                  <div>CONFIGURAR</div>
                </div>
              ))}
            </div>
          </div>

          <p className="ouro-note">
            A partir dessas informações, a plataforma realiza os cálculos
            automaticamente.
          </p>
        </Reveal>
      </section>

      {/* 09 + 10 + 11 */}
      <section className="ouro-section ouro-section-soft">
        <Reveal>
          <SectionHeader
            number="09 — 11"
            eyebrow="REGRAS DE NEGÓCIO"
            title="Máquinas, bandeiras e taxas conectadas."
            subtitle="Os elementos que influenciam a operação passam a fazer parte de uma mesma estrutura."
          />

          <div className="ouro-three-grid">
            <article className="ouro-card">
              <span className="ouro-card-number">09</span>
              <h3>MÁQUINAS</h3>

              <FeatureList
                items={[
                  'Nome',
                  'Identificação',
                  'Loja',
                  'Status',
                  'Bandeiras',
                  'Taxas',
                  'Configurações',
                ]}
              />
            </article>

            <article className="ouro-card">
              <span className="ouro-card-number">10</span>
              <h3>BANDEIRAS</h3>

              <div className="ouro-brand-pills">
                {['Visa', 'Mastercard', 'Elo', 'Hipercard'].map((brand) => (
                  <span key={brand}>{brand}</span>
                ))}
              </div>

              <p>
                As informações poderão ser relacionadas a máquinas, taxas,
                operações e relatórios.
              </p>
            </article>

            <article className="ouro-card">
              <span className="ouro-card-number">11</span>
              <h3>TAXAS</h3>

              <p>
                O sistema será estruturado para permitir configurações de taxas
                sem depender de alterações no código em cada mudança de regra.
              </p>

              <div className="ouro-rule">
                <strong>Taxa da operação</strong>
                <span>
                  Utilizada para os controles financeiros definidos pela
                  empresa.
                </span>
              </div>

              <div className="ouro-rule">
                <strong>Taxa de referência do FC</strong>
                <span>
                  Utilizada especificamente na regra de comissionamento.
                </span>
              </div>
            </article>
          </div>
        </Reveal>
      </section>

      {/* 12 + 13 + 14 + 15 */}
      <section className="ouro-section ouro-section-dark">
        <Reveal>
          <SectionHeader
            number="12 — 15"
            eyebrow="FC · AUTORIZAÇÃO"
            title="O resultado da negociação passa a ser calculado automaticamente."
            subtitle="A regra de margem entra diretamente no fluxo da operação."
          />

          <div className="ouro-fc-layout">
            <div className="ouro-fc-panel">
              <div className="ouro-fc-symbol">FC</div>
              <span>FATOR DE COMISSIONAMENTO</span>

              <h3>
                A margem efetivamente obtida é comparada com a margem padrão da
                empresa.
              </h3>

              <div className="ouro-code-flow">
                <span>VALOR EMPRESTADO</span>
                <b>↓</b>
                <span>MARGEM PADRÃO</span>
                <b>↓</b>
                <span>VALOR COBRADO</span>
                <b>↓</b>
                <span>TAXA DE REFERÊNCIA</span>
                <b>↓</b>
                <span>MARGEM REAL</span>
                <b>↓</b>
                <strong>FC</strong>
              </div>
            </div>

            <div className="ouro-fc-side">
              <div className="ouro-fc-example">
                <span>FC EXATO</span>
                <strong>1,00</strong>
                <p>Margem corresponde ao padrão.</p>
              </div>

              <div className="ouro-fc-example">
                <span>FC ABAIXO DO PADRÃO</span>
                <strong>&lt; 1,00</strong>
                <p>Margem abaixo da referência.</p>
              </div>

              <div className="ouro-fc-example">
                <span>FC ACIMA DO PADRÃO</span>
                <strong>&gt; 1,00</strong>
                <p>Margem superior à referência.</p>
              </div>
            </div>
          </div>

          <div className="ouro-limit">
            <div>
              <span>LIMITE ATUALMENTE DEFINIDO</span>
              <strong>FC ≥ 0,50</strong>
              <p>Operação dentro do limite.</p>
            </div>

            <div>
              <span>ABAIXO DO LIMITE</span>
              <strong>FC &lt; 0,50</strong>
              <p>Necessita de autorização.</p>
            </div>
          </div>

          <div className="ouro-approval-flow">
            <div>
              <span>01</span>
              VENDEDOR
            </div>
            <b>→</b>
            <div>
              <span>02</span>
              SOLICITAÇÃO
            </div>
            <b>→</b>
            <div>
              <span>03</span>
              ANÁLISE
            </div>
            <b>→</b>
            <div>
              <span>04</span>
              APROVAÇÃO / RECUSA
            </div>
            <b>→</b>
            <div>
              <span>05</span>
              CONTINUIDADE
            </div>
          </div>

          <p className="ouro-dark-note">
            A autorização poderá registrar quem solicitou, quem autorizou,
            data, hora, motivo e resultado.
          </p>
        </Reveal>
      </section>

      {/* 16 + 17 */}
      <section className="ouro-section">
        <Reveal>
          <SectionHeader
            number="16 — 17"
            eyebrow="NC"
            title="Nível de Comissionamento"
            subtitle="O volume mensal do vendedor define seu nível."
          />

          <div className="ouro-nc-grid">
            {[
              ['R$ 40 mil', 'NÍVEL 1'],
              ['R$ 50 mil', 'NÍVEL 2'],
              ['R$ 70 mil', 'NÍVEL 3'],
              ['R$ 100 mil', 'NÍVEL 4'],
            ].map(([value, level]) => (
              <div className="ouro-nc-card" key={value}>
                <span>{value}</span>
                <strong>{level}</strong>
              </div>
            ))}
          </div>

          <div className="ouro-statement light">
            <span>A REGRA DO NC</span>
            <strong>
              O nível é mensal e o resultado final do mês determina o nível
              utilizado para as vendas daquele período.
            </strong>
          </div>
        </Reveal>
      </section>

      {/* 18 + 19 */}
      <section className="ouro-section ouro-section-soft">
        <Reveal>
          <SectionHeader
            number="18 — 19"
            eyebrow="COMISSÃO"
            title="FC e NC trabalhando juntos."
            subtitle="A comissão nasce da combinação entre valor de tabela, NC e FC da operação."
          />

          <div className="ouro-commission-layout">
            <div className="ouro-commission-equation">
              <div>
                <span>VALOR DE TABELA</span>
                <strong>R$ 1.000</strong>
              </div>

              <b>×</b>

              <div>
                <span>NC</span>
                <strong>R$ 9 / 1.000</strong>
              </div>

              <b>×</b>

              <div>
                <span>FC</span>
                <strong>0,70</strong>
              </div>

              <b>=</b>

              <div className="highlight">
                <span>COMISSÃO</span>
                <strong>R$ 6,30</strong>
              </div>
            </div>

            <div className="ouro-transparent-box">
              <span>COMISSÃO COM TRANSPARÊNCIA</span>
              <p>
                Em cada operação, o vendedor consegue visualizar valor de
                tabela, FC, NC e comissão.
              </p>

              <strong>
                O resultado aparece junto com os elementos que formaram aquele
                valor.
              </strong>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 20 + 21 */}
      <section className="ouro-section">
        <Reveal>
          <SectionHeader
            number="20 — 21"
            eyebrow="VENDEDOR"
            title="Um painel feito para quem está na operação."
            subtitle="Mais simplicidade para executar e mais clareza para acompanhar o próprio desempenho."
          />

          <div className="ouro-vendor-panel">
            <div className="ouro-vendor-header">
              <div>
                <span>OLÁ, VENDEDOR</span>
                <h3>Visão da sua performance</h3>
              </div>

              <div className="ouro-vendor-tag">VENDEDOR</div>
            </div>

            <div className="ouro-vendor-metrics">
              {[
                ['VENDAS DO MÊS', 'R$ XX.XXX'],
                ['NÍVEL ATUAL', 'NÍVEL 3'],
                ['FC MÉDIO', '0,XX'],
                ['COMISSÃO', 'R$ XXX'],
                ['META', 'R$ XX.XXX'],
                ['PROGRESSO', '78%'],
              ].map(([label, value]) => (
                <div key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>

            <div className="ouro-progress">
              <span>
                <b>PRÓXIMO NÍVEL</b>
                R$ XX.XXX restantes
              </span>

              <div className="ouro-progress-bar">
                <span />
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 22 + 23 + 24 + 25 */}
      <section className="ouro-section ouro-section-soft">
        <Reveal>
          <SectionHeader
            number="22 — 25"
            eyebrow="UNIDADES + CAIXA"
            title="Duas operações. Uma única gestão."
            subtitle="Loja, delivery, caixa e forma de entrega dentro da mesma lógica."
          />

          <div className="ouro-units-grid">
            {architecture.map(([title, ...items]) => (
              <article className="ouro-unit-card" key={title}>
                <span>{title}</span>
                <h3>{title === 'DELIVERY / EXTERNO' ? 'Operação externa' : title}</h3>

                <FeatureList items={items} />
              </article>
            ))}
          </div>

          <div className="ouro-cash-layout">
            <div className="ouro-cash-card">
              <span>CAIXA</span>
              <strong>Controle por unidade</strong>

              <FeatureList
                items={[
                  'Saldo inicial',
                  'Entradas',
                  'Saídas',
                  'Operações',
                  'PIX',
                  'Espécie',
                  'Ajustes',
                  'Fechamento',
                ]}
              />
            </div>

            <div className="ouro-cash-card">
              <span>PIX + ESPÉCIE</span>
              <strong>A forma de entrega também faz parte do fluxo.</strong>

              <p>
                Durante a operação, será possível informar como o cliente
                receberá o valor, relacionando a confirmação ao controle
                correspondente.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 26 + 27 + 28 */}
      <section className="ouro-section">
        <Reveal>
          <SectionHeader
            number="26 — 28"
            eyebrow="DOCUMENTOS"
            title="A documentação nasce da própria operação."
            subtitle="O sistema poderá gerar automaticamente documentos com os dados cadastrados."
          />

          <div className="ouro-docs-grid">
            {[
              ['RECIBO', 'Documento gerado com os dados da operação.'],
              ['COMPROVANTE', 'Registro documental da transação.'],
              ['PDF DA OPERAÇÃO', 'Documento completo para consulta.'],
              ['VIA DO CLIENTE', 'Documento destinado ao cliente.'],
              ['VIA DO VENDEDOR', 'Documento para acompanhamento interno.'],
              ['VIA DA EMPRESA', 'Documento para controle da empresa.'],
            ].map(([title, text]) => (
              <div className="ouro-doc-card" key={title}>
                <div className="ouro-doc-icon">PDF</div>
                <div>
                  <strong>{title}</strong>
                  <span>{text}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="ouro-signature">
            <div className="ouro-signature-flow">
              <span>OPERAÇÃO</span>
              <b>↓</b>
              <span>DOCUMENTO GERADO</span>
              <b>↓</b>
              <span>CLIENTE</span>
              <b>↓</b>
              <span>VENDEDOR</span>
              <b>↓</b>
              <span>ASSINATURAS</span>
              <b>↓</b>
              <strong>DOCUMENTAÇÃO CONCLUÍDA</strong>
            </div>

            <p>
              A estrutura será preparada para integração com solução de
              assinatura definida para o projeto.
            </p>
          </div>

          <div className="ouro-reprint">
            <div>
              <span>REIMPRESSÃO</span>
              <h3>Um erro não significa refazer a operação.</h3>
            </div>

            <FeatureList
              items={[
                'Usuário',
                'Data',
                'Hora',
                'Motivo',
                'Documento',
              ]}
            />
          </div>
        </Reveal>
      </section>

      {/* 29 */}
      <section className="ouro-section ouro-section-soft">
        <Reveal>
          <SectionHeader
            number="29"
            eyebrow="EXTRATO DO CLIENTE"
            title="Toda a relação com a empresa fica registrada."
          />

          <div className="ouro-extract">
            <div className="ouro-extract-head">
              <span>DATA</span>
              <span>OPERAÇÃO</span>
              <span>MODALIDADE</span>
              <span>VALOR</span>
              <span>TAXA</span>
              <span>VENDEDOR</span>
              <span>LOJA</span>
              <span>STATUS</span>
            </div>

            {[
              ['29/09', '00124', 'CARTÃO', 'R$ 2.500', '—', 'VENDEDOR 01', 'LOJA 01', 'CONCLUÍDA'],
              ['28/09', '00119', 'INSS', 'R$ 1.800', '—', 'VENDEDOR 02', 'LOJA 02', 'CONCLUÍDA'],
              ['27/09', '00112', 'FGTS', 'R$ 3.200', '—', 'VENDEDOR 01', 'DELIVERY', 'CONCLUÍDA'],
              ['26/09', '00107', 'CLT', 'R$ 4.100', '—', 'VENDEDOR 03', 'LOJA 01', 'CONCLUÍDA'],
            ].map((row) => (
              <div className="ouro-extract-row" key={row[1]}>
                {row.map((cell, index) => (
                  <span key={`${row[1]}-${index}`}>{cell}</span>
                ))}
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* 30 + 31 */}
      <section className="ouro-section">
        <Reveal>
          <SectionHeader
            number="30 — 31"
            eyebrow="EQUIPE"
            title="Gestão completa dos funcionários."
            subtitle="Desligar não significa apagar."
          />

          <div className="ouro-employees">
            <div className="ouro-employee-head">
              <span>NOME</span>
              <span>CARGO</span>
              <span>LOJA</span>
              <span>NÍVEL</span>
              <span>STATUS</span>
            </div>

            {[
              ['Funcionário 01', 'Vendedor', 'Loja 01', 'Nível 3', 'ATIVO'],
              ['Funcionário 02', 'Vendedor', 'Loja 02', 'Nível 2', 'ATIVO'],
              ['Funcionário 03', 'Gerente', 'Loja 01', '—', 'ATIVO'],
              ['Funcionário 04', 'Vendedor', 'Delivery', 'Nível 1', 'INATIVO'],
            ].map((row) => (
              <div className="ouro-employee-row" key={row[0]}>
                {row.map((cell, index) => (
                  <span
                    className={index === 4 ? 'status-cell' : ''}
                    key={`${row[0]}-${index}`}
                  >
                    {cell}
                  </span>
                ))}
              </div>
            ))}
          </div>

          <div className="ouro-history-callout">
            <strong>HISTÓRICO PRESERVADO</strong>
            <p>
              Quando um funcionário sair da empresa, o usuário poderá ser
              desativado, mas as vendas permanecem no histórico.
            </p>
          </div>
        </Reveal>
      </section>

      {/* 32 + 33 + 34 + 35 */}
      <section className="ouro-section ouro-section-soft">
        <Reveal>
          <SectionHeader
            number="32 — 35"
            eyebrow="METAS · PERFORMANCE · FOLHA"
            title="Uma estrutura preparada para a gestão da equipe."
          />

          <div className="ouro-management-grid">
            <article className="ouro-management-card">
              <span>32</span>
              <h3>METAS</h3>
              <p>Individual + equipe.</p>

              <FeatureList
                items={[
                  'Meta individual',
                  'Meta de equipe',
                  'Meta',
                  'Realizado',
                  'Percentual',
                  'Progresso',
                ]}
              />
            </article>

            <article className="ouro-management-card">
              <span>33</span>
              <h3>PERFORMANCE</h3>
              <p>Regras de performance definidas pela empresa.</p>

              <FeatureList
                items={[
                  'Vendas',
                  'Metas',
                  'Faltas',
                  'Advertências',
                  'Atestados',
                  'Pontuação',
                  'Níveis',
                  'Multiplicadores',
                ]}
              />
            </article>

            <article className="ouro-management-card">
              <span>34</span>
              <h3>FOLHA</h3>
              <p>Todas as informações de remuneração em um único ambiente.</p>

              <FeatureList
                items={[
                  'Salário',
                  'Comissões',
                  'Bonificações',
                  'Bônus',
                  'Descontos',
                  'Ajustes',
                  'Total',
                ]}
              />
            </article>

            <article className="ouro-management-card">
              <span>35</span>
              <h3>BONIFICAÇÃO</h3>
              <p>Regras próprias de bonificação dentro da plataforma.</p>

              <div className="ouro-bonus-stack">
                <span>COMISSÃO</span>
                <span>BONIFICAÇÃO</span>
                <span>BÔNUS</span>
                <strong>TOTAL VARIÁVEL</strong>
              </div>
            </article>
          </div>
        </Reveal>
      </section>

      {/* 36 + 37 + 38 */}
      <section className="ouro-section">
        <Reveal>
          <SectionHeader
            number="36 — 38"
            eyebrow="RELATÓRIOS"
            title="A gestão precisa enxergar a operação de vários ângulos."
            subtitle="Dados organizados para análise por contexto operacional."
          />

          <div className="ouro-report-grid">
            {reportGroups.map((group) => (
              <article className="ouro-report-card" key={group.title}>
                <span>{group.title}</span>

                {group.items.map((item) => (
                  <div key={item}>
                    <i />
                    {item}
                  </div>
                ))}
              </article>
            ))}
          </div>

          <div className="ouro-negotiation">
            <div>
              <span>37</span>
              <h3>RELATÓRIOS DE NEGOCIAÇÃO</h3>
              <p>
                Relatórios de preço de tabela, valor negociado, diferença, FC,
                vendedor e loja.
              </p>
            </div>

            <div className="ouro-negotiation-visual">
              <div>
                <span>TABELA</span>
                <strong>R$ 1.000</strong>
              </div>
              <b>→</b>
              <div>
                <span>NEGOCIADO</span>
                <strong>R$ 930</strong>
              </div>
              <b>→</b>
              <div>
                <span>FC</span>
                <strong>0,70</strong>
              </div>
            </div>
          </div>

          <div className="ouro-financial-report">
            <span>38 · RELATÓRIOS FINANCEIROS</span>

            <div className="ouro-financial-pills">
              {[
                'Empréstimos',
                'Lucro',
                'Taxas',
                'Caixa',
                'Comissões',
                'Bonificações',
                'Por modalidade',
                'Por unidade',
                'Resultado consolidado',
              ].map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* 39 + 40 */}
      <section className="ouro-section ouro-section-soft">
        <Reveal>
          <SectionHeader
            number="39 — 40"
            eyebrow="GESTÃO"
            title="Todas as informações importantes em uma única visão."
            subtitle="Dashboard gerencial e painel administrativo."
          />

          <DashboardMockup />

          <div className="ouro-admin-panel">
            <div className="ouro-admin-title">
              <span>40</span>
              <div>
                <span>PAINEL ADMINISTRATIVO</span>
                <h3>Controle completo da empresa.</h3>
              </div>
            </div>

            <div className="ouro-admin-grid">
              {adminItems.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* 41 + 42 + 43 */}
      <section className="ouro-section">
        <Reveal>
          <SectionHeader
            number="41 — 43"
            eyebrow="CONTROLE"
            title="As próprias regras da empresa dentro da plataforma."
            subtitle="Configuração, usuários, permissões e rastreabilidade."
          />

          <div className="ouro-control-grid">
            <article className="ouro-control-card">
              <span>41</span>
              <h3>CONFIGURAÇÕES</h3>

              <FeatureList
                items={[
                  'Modalidades',
                  'Taxas',
                  'Máquinas',
                  'Bandeiras',
                  'Níveis NC',
                  'Limites FC',
                  'Comissões',
                  'Bonificações',
                  'Metas',
                  'Permissões',
                ]}
              />
            </article>

            <article className="ouro-control-card">
              <span>42</span>
              <h3>USUÁRIOS</h3>

              <div className="ouro-roles">
                {[
                  ['DONO', 'Visão e controle completo.'],
                  ['ADMINISTRADOR', 'Gestão operacional e administrativa.'],
                  ['GERENTE', 'Gestão da unidade e equipe.'],
                  ['VENDEDOR', 'Clientes, operações e resultados próprios.'],
                ].map(([role, text]) => (
                  <div key={role}>
                    <strong>{role}</strong>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="ouro-control-card">
              <span>43</span>
              <h3>SEGURANÇA</h3>

              <p>
                A plataforma deverá registrar ações relevantes para garantir
                controle e rastreabilidade.
              </p>

              <FeatureList
                items={[
                  'Alteração de taxa',
                  'Autorização de operação',
                  'Cancelamento',
                  'Reimpressão',
                  'Alteração administrativa',
                  'Ações financeiras',
                ]}
              />
            </article>
          </div>
        </Reveal>
      </section>

      {/* 44 + 45 + 46 */}
      <section className="ouro-section ouro-section-dark">
        <Reveal>
          <SectionHeader
            number="44 — 46"
            eyebrow="VISÃO DE PRODUTO"
            title="A informação nasce uma vez e é aproveitada em toda a operação."
            subtitle="Uma plataforma conectada, acessível e preparada para crescimento."
          />

          <div className="ouro-dark-chain">
            <ChainFlow items={operationChain} />
          </div>

          <div className="ouro-device-grid">
            <div>
              <span>COMPUTADOR</span>
              <strong>Gestão administrativa e relatórios.</strong>
            </div>

            <div>
              <span>NOTEBOOK</span>
              <strong>Operação e administração.</strong>
            </div>

            <div>
              <span>TABLET</span>
              <strong>Uso operacional.</strong>
            </div>

            <div>
              <span>CELULAR</span>
              <strong>Vendedores externos e acompanhamento rápido.</strong>
            </div>
          </div>

          <div className="ouro-product-pillars">
            {[
              ['OPERAÇÃO', 'Tudo começa pela operação.'],
              ['AUTOMAÇÃO', 'As informações são distribuídas automaticamente.'],
              ['GESTÃO', 'A administração acompanha tudo em um ambiente.'],
              ['COMISSIONAMENTO', 'FC + NC + comissão.'],
              ['CONTROLE', 'Histórico, permissões e auditoria.'],
              ['EVOLUÇÃO', 'Estrutura preparada para novos módulos.'],
            ].map(([title, text]) => (
              <div key={title}>
                <span>{title}</span>
                <strong>{text}</strong>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* 47 */}
      <section className="ouro-section ouro-section-soft">
        <Reveal>
          <SectionHeader
            number="47"
            eyebrow="ARQUITETURA DE FUNCIONAMENTO"
            title="A operação como uma rede conectada."
          />

          <div className="ouro-network">
            <div className="ouro-network-core">
              <span>OURO</span>
              <strong>CRED</strong>
            </div>

            <div className="ouro-network-column">
              {['LOJA 1', 'LOJA 2', 'DELIVERY'].map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>

            <div className="ouro-network-column middle">
              {['VENDEDORES', 'CLIENTES', 'OPERAÇÕES'].map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>

            <div className="ouro-network-column">
              {['FC', 'NC', 'COMISSÃO'].map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>

            <div className="ouro-network-bottom">
              <span>CAIXA</span>
              <span>DOCUMENTOS</span>
              <span>EXTRATO</span>
              <span>RELATÓRIOS</span>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 48 */}
      <section className="ouro-section">
        <Reveal>
          <SectionHeader
            number="48"
            eyebrow="FLUXO DE UMA VENDA"
            title="Da busca do cliente à confirmação."
          />

          <div className="ouro-sale-flow">
            <div className="ouro-sale-column">
              <span>VISÃO DO VENDEDOR</span>

              {[
                'Buscar cliente',
                'Selecionar modalidade',
                'Informar valores',
                'Configurar operação',
                'Ver FC',
                'Ver comissão',
                'Confirmar',
              ].map((item, index) => (
                <div key={item}>
                  <b>{index + 1}</b>
                  <strong>{item}</strong>
                </div>
              ))}
            </div>

            <div className="ouro-sale-center">→</div>

            <div className="ouro-sale-column">
              <span>VISÃO DO SISTEMA</span>

              {[
                'Recebe os dados',
                'Calcula',
                'Valida',
                'Registra',
                'Distribui',
                'Documenta',
                'Atualiza',
              ].map((item, index) => (
                <div key={item}>
                  <b>{String(index + 1).padStart(2, '0')}</b>
                  <strong>{item}</strong>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* 49 */}
      <section className="ouro-section ouro-section-soft">
        <Reveal>
          <SectionHeader
            number="49"
            eyebrow="O DIFERENCIAL"
            title="O diferencial não está apenas nas telas."
            subtitle="Está na forma como o sistema conecta as informações."
          />

          <div className="ouro-differential">
            {[
              'Cliente',
              'Venda',
              'Caixa',
              'Comissão',
              'FC',
              'NC',
              'Documento',
              'Extrato',
              'Relatório',
              'Auditoria',
            ].map((item, index) => (
              <div key={item} className="ouro-differential-item">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{item}</strong>
              </div>
            ))}
          </div>

          <div className="ouro-differential-bottom">
            <strong>
              Uma operação poderá alimentar todas essas áreas sem exigir que a
              informação seja repetida.
            </strong>
          </div>
        </Reveal>
      </section>

      {/* 50 */}
      <section className="ouro-section">
        <Reveal>
          <SectionHeader
            number="50"
            eyebrow="ESTRUTURA MODULAR"
            title="A plataforma nasce organizada para crescer."
          />

          <div className="ouro-module-grid">
            {modules.map(([number, title, text]) => (
              <article className="ouro-module" key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </Reveal>
      </section>

      {/* 51 */}
      <section className="ouro-section ouro-section-soft ouro-growth-section">
        <Reveal>
          <SectionHeader
            number="51"
            eyebrow="EVOLUÇÃO"
            title="Uma nova base para a Ouro Cred."
            subtitle="A tecnologia precisa acompanhar a empresa conforme sua operação evolui."
          />

          <div className="ouro-growth">
            {[
              'Novas lojas',
              'Novos vendedores',
              'Novas modalidades',
              'Novas regras',
              'Novos relatórios',
              'Novos processos',
              'Novas integrações',
            ].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>

          <div className="ouro-growth-statement">
            <span>ARQUITETURA</span>
            <strong>PENSADA PARA EXPANSÃO</strong>
            <p>
              A estrutura será pensada para permitir essa expansão.
            </p>
          </div>
        </Reveal>
      </section>

      {/* 52 */}
      <section className="ouro-section ouro-conclusion">
        <Reveal>
          <div className="ouro-conclusion-inner">
            <span className="ouro-kicker">52 · CONCLUSÃO</span>

            <h2>
              MAIS
              <br />
              <em>CONTROLE.</em>
            </h2>

            <h2>
              MAIS
              <br />
              <em>AUTOMAÇÃO.</em>
            </h2>

            <h2>
              MAIS
              <br />
              <em>VISÃO.</em>
            </h2>

            <p>
              A nova plataforma Ouro Cred será construída para conectar operação
              e gestão em um único ambiente.
            </p>

            <div className="ouro-final-quote">
              <span>O OBJETIVO</span>
              <strong>
                Transformar uma operação fragmentada em uma operação conectada.
              </strong>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 53 */}
      <section className="ouro-section ouro-section-soft">
        <Reveal>
          <SectionHeader
            number="53"
            eyebrow="PRÓXIMA ETAPA"
            title="Validação do projeto."
            subtitle="Antes da especificação técnica e do desenvolvimento, a estrutura precisa ser validada com a realidade da Ouro Cred."
          />

          <div className="ouro-validation-grid">
            {[
              'Fluxos',
              'Regras',
              'Modalidades',
              'Taxas',
              'FC',
              'NC',
              'Comissões',
              'Permissões',
              'Relatórios',
              'Documentos',
              'Demais particularidades da operação',
            ].map((item, index) => (
              <div key={item}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{item}</strong>
              </div>
            ))}
          </div>

          <div className="ouro-validation-footer">
            <strong>
              Após a validação, o projeto poderá avançar para a especificação
              técnica e desenvolvimento.
            </strong>
          </div>
        </Reveal>
      </section>

      {/* 54 */}
      <section className="ouro-final-section">
        <div className="ouro-final-grid" />

        <Reveal>
          <span className="ouro-kicker">54 · ENCERRAMENTO</span>

          <div className="ouro-final-logo">
            <span>OURO</span>
            <strong>CRED</strong>
          </div>

          <h2>
            Uma plataforma construída para a operação real da empresa.
          </h2>

          <div className="ouro-final-tags">
            <span>GESTÃO</span>
            <span>OPERAÇÃO</span>
            <span>AUTOMAÇÃO</span>
            <span>COMISSIONAMENTO</span>
            <span>CONTROLE</span>
            <span>DADOS</span>
          </div>

          <div className="ouro-final-line">
            TUDO CONECTADO EM UM ÚNICO AMBIENTE.
          </div>

          <a
  href="https://wa.me/+553131912341?text=Olá%2C%20Léo Souza.%20Analisei%20a%20apresentação%20da%20Plataforma%20Ouro%20Cred%20e%20gostaria%20de%20conversar%20sobre%20a%20validação%20do%20projeto."
  target="_blank"
  rel="noreferrer"
  className="ouro-primary-button"
>
  FALAR SOBRE O PROJETO
  <span>→</span>
</a>

          <p className="ouro-signature">
            Léo Souza Designer
            <br />
            Desenvolvimento · Design · Tecnologia
          </p>
        </Reveal>
      </section>
    </main>
  );
}

export default ProposalOuroCred;