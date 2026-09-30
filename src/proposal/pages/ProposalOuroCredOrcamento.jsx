import React, { useEffect } from 'react';
import '../styles/proposal-ourocred-orcamento.css';

const modules = [
  ['01', 'Clientes', 'Cadastro, pesquisa, histórico, extrato e condições especiais.'],
  ['02', 'Operações', 'Nova operação, modalidades, cálculos, aprovação e histórico.'],
  ['03', 'FC', 'Cálculo automático do Fator de Comissionamento.'],
  ['04', 'NC', 'Nível de comissionamento mensal do vendedor.'],
  ['05', 'Comissões', 'Cálculo por operação, fechamento e histórico.'],
  ['06', 'Bonificações', 'Estrutura para regras de bonificação.'],
  ['07', 'Lojas', 'Controle das unidades e operação externa.'],
  ['08', 'Máquinas', 'Cadastro e configuração das máquinas.'],
  ['09', 'Bandeiras', 'Cadastro e regras relacionadas às bandeiras.'],
  ['10', 'Caixa', 'Entradas, saídas, saldo e movimentações.'],
  ['11', 'Funcionários', 'Cadastro, cargos, níveis e histórico.'],
  ['12', 'Metas', 'Metas individuais e de equipe.'],
  ['13', 'Performance', 'Indicadores e regras de desempenho.'],
  ['14', 'Folha', 'Salário, comissão, bônus, descontos e extrato.'],
  ['15', 'Documentos', 'Recibos, PDFs e vias.'],
  ['16', 'Assinaturas', 'Controle documental conforme solução definida.'],
  ['17', 'Relatórios', 'Relatórios operacionais e gerenciais.'],
  ['18', 'Dashboard', 'Visão consolidada da empresa.'],
  ['19', 'Usuários', 'Controle de acesso e permissões.'],
  ['20', 'Auditoria', 'Registro das ações críticas realizadas no sistema.'],
];

const adminItems = [
  'Dashboard',
  'Operações',
  'Clientes',
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

const exclusions = [
  ['INTEGRAÇÕES EXTERNAS', 'Integrações com bancos, instituições financeiras, APIs e outros sistemas de terceiros.'],
  ['MAQUININHAS', 'Integrações diretas com equipamentos físicos, caso sejam necessárias.'],
  ['WHATSAPP', 'Integrações via APIs ou provedores externos.'],
  ['ASSINATURA ELETRÔNICA', 'Serviços, taxas e mensalidades de fornecedores terceiros.'],
  ['MIGRAÇÃO', 'Migração complexa ou tratamento manual de grandes volumes do sistema legado.'],
  ['SERVIÇOS EXTERNOS', 'Custos de APIs, infraestrutura ou fornecedores terceiros.'],
  ['NOVAS FUNCIONALIDADES', 'Funcionalidades não previstas no escopo aprovado poderão ser orçadas separadamente.'],
];

const validationItems = [
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
];

const paymentSteps = [
  {
    percent: '20%',
    title: 'Início do projeto',
    value: 'R$ 9.800,00',
  },
  {
    percent: '30%',
    title: 'Entrega do núcleo operacional',
    value: 'R$ 14.700,00',
  },
  {
    percent: '25%',
    title: 'FC + NC + Comissionamento',
    value: 'R$ 12.250,00',
  },
  {
    percent: '15%',
    title: 'Módulos de gestão',
    value: 'R$ 7.350,00',
  },
  {
    percent: '10%',
    title: 'Entrega final e homologação',
    value: 'R$ 4.900,00',
  },
];

const phases = [
  ['01', 'FUNDAÇÃO', 'Banco de dados, autenticação, usuários, permissões e unidades.'],
  ['02', 'NÚCLEO OPERACIONAL', 'Clientes, modalidades e operações.'],
  ['03', 'COMISSIONAMENTO', 'FC, NC, comissão e aprovações.'],
  ['04', 'FINANCEIRO E DOCUMENTOS', 'Caixa, recibos, PDFs e documentação.'],
  ['05', 'GESTÃO', 'Funcionários, metas, performance e folha.'],
  ['06', 'INTELIGÊNCIA GERENCIAL', 'Dashboard e relatórios.'],
  ['07', 'HOMOLOGAÇÃO', 'Testes, validação e implantação.'],
];

function Reveal({ children, className = '' }) {
  return (
    <div className={`ouro-orc-reveal ${className}`}>
      {children}
    </div>
  );
}

function SectionHeader({ number, eyebrow, title, text }) {
  return (
    <div className="ouro-orc-section-header">
      <div className="ouro-orc-section-number">{number}</div>

      <div>
        <span className="ouro-orc-eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        {text && <p>{text}</p>}
      </div>
    </div>
  );
}

function IconCheck() {
  return <span className="ouro-orc-check">✓</span>;
}

function ProposalOuroCredOrcamento() {
  useEffect(() => {
    const elements = document.querySelectorAll('.ouro-orc-reveal');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.08 }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
    });
  };

  return (
    <main className="ouro-orc-page">
      <div className="ouro-orc-noise" />
      <div className="ouro-orc-glow ouro-orc-glow-1" />
      <div className="ouro-orc-glow ouro-orc-glow-2" />

      <header className="ouro-orc-nav">
        <a href="/projetoourocred" className="ouro-orc-brand">
          <span className="ouro-orc-brand-mark">OC</span>

          <div>
            <strong>OURO CRED</strong>
            <small>PROPOSTA COMERCIAL</small>
          </div>
        </a>

        <nav>
          <a href="#projeto">PROJETO</a>
          <a href="#escopo">ESCOPO</a>
          <a href="#comissionamento">COMISSIONAMENTO</a>
          <a href="#investimento">INVESTIMENTO</a>
          <a href="#condicoes">CONDIÇÕES</a>
          <a href="#aceite">ACEITE</a>
        </nav>

        <a
          href="/projetoourocred"
          className="ouro-orc-back"
        >
          VOLTAR AO PROJETO
        </a>
      </header>

      {/* HERO */}
      <section className="ouro-orc-hero">
        <div className="ouro-orc-grid" />

        <div className="ouro-orc-hero-inner">
          <Reveal className="ouro-orc-hero-copy">
            <span className="ouro-orc-kicker">
              OURO CRED · PROPOSTA COMERCIAL
            </span>

            <h1>
              PLATAFORMA
              <br />
              <span>DE GESTÃO.</span>
            </h1>

            <p className="ouro-orc-hero-lead">
              Desenvolvimento de uma plataforma web personalizada para
              centralizar, automatizar e modernizar a operação da Ouro Cred.
            </p>

            <p className="ouro-orc-hero-desc">
              Uma solução desenvolvida sob medida para a realidade operacional
              da Ouro Cred.
            </p>

            <div className="ouro-orc-tags">
              <span>SISTEMA WEB</span>
              <span>GESTÃO OPERACIONAL</span>
              <span>AUTOMAÇÃO</span>
              <span>FC + NC</span>
              <span>COMISSIONAMENTO</span>
            </div>

            <div className="ouro-orc-hero-buttons">
              <button onClick={() => scrollTo('projeto')}>
                VER PROPOSTA
                <span>↓</span>
              </button>

              <a href="/projetoourocred">
                VOLTAR AO PROJETO
              </a>
            </div>
          </Reveal>

          <Reveal className="ouro-orc-hero-visual">
            <div className="ouro-orc-system-card">
              <div className="ouro-orc-system-top">
                <span>SISTEMA OURO CRED</span>
                <i />
              </div>

              <div className="ouro-orc-system-title">
                <small>OPERAÇÃO CENTRALIZADA</small>
                <strong>Gestão conectada</strong>
              </div>

              <div className="ouro-orc-system-stats">
                <div>
                  <span>OPERAÇÕES</span>
                  <strong>084</strong>
                </div>
                <div>
                  <span>FC MÉDIO</span>
                  <strong>0,82</strong>
                </div>
                <div>
                  <span>COMISSÕES</span>
                  <strong>R$ 8.420</strong>
                </div>
              </div>

              <div className="ouro-orc-system-flow">
                <span>CLIENTE</span>
                <b>→</b>
                <span>OPERAÇÃO</span>
                <b>→</b>
                <span>FC</span>
                <b>→</b>
                <span>NC</span>
              </div>

              <div className="ouro-orc-system-bottom">
                <div>
                  <span>CAIXA</span>
                  <strong>ATUALIZADO</strong>
                </div>

                <div>
                  <span>DOCUMENTOS</span>
                  <strong>GERADOS</strong>
                </div>
              </div>
            </div>

            <div className="ouro-orc-orbit orbit-a" />
            <div className="ouro-orc-orbit orbit-b" />
          </Reveal>
        </div>
      </section>

      {/* RESUMO */}
      <section id="projeto" className="ouro-orc-section">
        <Reveal>
          <SectionHeader
            number="01"
            eyebrow="RESUMO EXECUTIVO"
            title="O que está sendo contratado"
            text="Desenvolvimento de uma plataforma própria para a Ouro Cred, construída com base nos processos, regras de negócio e necessidades apresentadas durante o levantamento do projeto."
          />

          <div className="ouro-orc-summary-grid">
            {[
              ['OPERAÇÃO', 'Centralização das operações da empresa.'],
              ['AUTOMAÇÃO', 'Redução de processos e lançamentos manuais.'],
              ['COMISSIONAMENTO', 'Motor de FC + NC + comissão.'],
              ['GESTÃO', 'Clientes, lojas, vendedores, caixa, documentos e relatórios em um único ambiente.'],
            ].map(([title, text]) => (
              <article key={title}>
                <span>+</span>
                <strong>{title}</strong>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ESCOPO */}
      <section id="escopo" className="ouro-orc-section ouro-orc-light">
        <Reveal>
          <SectionHeader
            number="02"
            eyebrow="ESCOPO DO PROJETO"
            title="O que está incluído"
            text="A proposta contempla uma plataforma estruturada em módulos conectados entre si."
          />

          <div className="ouro-orc-module-grid">
            {modules.map(([number, title, text]) => (
              <article key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
                <IconCheck />
              </article>
            ))}
          </div>
        </Reveal>
      </section>

      {/* DIFERENCIAL */}
      <section className="ouro-orc-section ouro-orc-dark">
        <Reveal>
          <SectionHeader
            number="03"
            eyebrow="DIFERENCIAL DA SOLUÇÃO"
            title="Uma operação. Todo o sistema atualizado."
            text="A plataforma será construída para que a informação seja registrada uma única vez e utilizada automaticamente pelos módulos relacionados."
          />

          <div className="ouro-orc-chain">
            {[
              'CLIENTE',
              'OPERAÇÃO',
              'FC',
              'NC',
              'COMISSÃO',
              'CAIXA',
              'DOCUMENTO',
              'EXTRATO',
              'RELATÓRIO',
            ].map((item, index) => (
              <React.Fragment key={item}>
                <div className="ouro-orc-chain-item">
                  <small>{String(index + 1).padStart(2, '0')}</small>
                  <strong>{item}</strong>
                </div>

                {index < 8 && <b>↓</b>}
              </React.Fragment>
            ))}
          </div>

          <div className="ouro-orc-big-statement">
            <span>ARQUITETURA</span>
            <strong>
              O objetivo não é apenas substituir a interface do sistema atual,
              mas reconstruir a operação em uma plataforma integrada e
              preparada para evolução.
            </strong>
          </div>
        </Reveal>
      </section>

      {/* FC + NC */}
      <section
        id="comissionamento"
        className="ouro-orc-section ouro-orc-light"
      >
        <Reveal>
          <SectionHeader
            number="04"
            eyebrow="FC + NC"
            title="Motor de Comissionamento"
            text="FC + NC = cálculo automatizado da comissão."
          />

          <div className="ouro-orc-commission-grid">
            <article className="ouro-orc-fc-card">
              <div className="ouro-orc-card-number">01</div>
              <span>FC</span>
              <h3>Fator de Comissionamento</h3>

              <p>
                Calculado individualmente em cada operação de acordo com a
                margem da negociação e as regras da empresa.
              </p>

              <div className="ouro-orc-margin">
                <small>MARGEM PADRÃO</small>
                <strong>10%</strong>
              </div>

              <div className="ouro-orc-mini-flow">
                <span>MARGEM PADRÃO</span>
                <b>↓</b>
                <span>MARGEM REAL</span>
                <b>↓</b>
                <strong>FC</strong>
              </div>

              <p className="ouro-orc-mini-note">
                O FC poderá ficar abaixo, igual ou acima de 1,00 conforme o
                resultado da negociação.
              </p>
            </article>

            <article className="ouro-orc-nc-card">
              <div className="ouro-orc-card-number">02</div>
              <span>NC</span>
              <h3>Nível de Comissionamento</h3>

              <p>
                O nível é definido pelo volume total vendido no mês e utilizado
                conforme a regra de comissionamento da Ouro Cred.
              </p>

              <div className="ouro-orc-nc-levels">
                {[
                  ['R$ 40 mil', 'Nível 1'],
                  ['R$ 50 mil', 'Nível 2'],
                  ['R$ 70 mil', 'Nível 3'],
                  ['R$ 100 mil', 'Nível 4'],
                ].map(([value, level]) => (
                  <div key={value}>
                    <strong>{value}</strong>
                    <span>{level}</span>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </Reveal>
      </section>

      {/* EXEMPLO */}
      <section className="ouro-orc-section ouro-orc-dark">
        <Reveal>
          <SectionHeader
            number="05"
            eyebrow="EXEMPLO DE COMISSÃO"
            title="Como o cálculo aparece dentro do sistema"
          />

          <div className="ouro-orc-equation">
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

            <div className="result">
              <span>COMISSÃO</span>
              <strong>R$ 6,30</strong>
            </div>
          </div>

          <p className="ouro-orc-centered-note">
            O sistema realizará esse cálculo automaticamente em cada operação,
            mantendo o histórico dos valores utilizados.
          </p>
        </Reveal>
      </section>

      {/* AUTOMAÇÕES */}
      <section className="ouro-orc-section">
        <Reveal>
          <SectionHeader
            number="06"
            eyebrow="AUTOMAÇÕES"
            title="O que acontece quando uma operação é confirmada?"
          />

          <div className="ouro-orc-automation">
            {[
              'Operação criada',
              'Cliente atualizado',
              'FC calculado',
              'NC identificado',
              'Comissão calculada',
              'Caixa atualizado',
              'Máquina / bandeira registrada',
              'Documento gerado',
              'Extrato atualizado',
              'Relatórios atualizados',
              'Auditoria registrada',
            ].map((item, index) => (
              <div key={item}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <IconCheck />
                <strong>{item}</strong>
              </div>
            ))}
          </div>

          <div className="ouro-orc-callout">
            <span>AUTOMAÇÃO OPERACIONAL</span>
            <strong>
              O objetivo é reduzir significativamente o retrabalho operacional
              e evitar que a mesma informação precise ser lançada manualmente em
              diferentes áreas.
            </strong>
          </div>
        </Reveal>
      </section>

      {/* ADMIN */}
      <section className="ouro-orc-section ouro-orc-light">
        <Reveal>
          <SectionHeader
            number="07"
            eyebrow="ESTRUTURA ADMINISTRATIVA"
            title="Controle completo da operação"
          />

          <div className="ouro-orc-admin-grid">
            {adminItems.map((item) => (
              <div key={item}>
                <span />
                {item}
              </div>
            ))}
          </div>

          <div className="ouro-orc-vendor-preview">
            <div className="ouro-orc-vendor-top">
              <div>
                <span>ÁREA DO VENDEDOR</span>
                <strong>Minha performance</strong>
              </div>

              <small>VENDEDOR</small>
            </div>

            <div className="ouro-orc-vendor-metrics">
              {[
                ['VENDAS DO MÊS', 'R$ XX.XXX'],
                ['NÍVEL ATUAL', 'NÍVEL 3'],
                ['FC', '0,XX'],
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
          </div>
        </Reveal>
      </section>

      {/* SEGURANÇA */}
      <section className="ouro-orc-section">
        <Reveal>
          <SectionHeader
            number="08"
            eyebrow="SEGURANÇA E CONTROLE"
            title="Cada usuário acessa o que precisa"
            text="A plataforma terá controle de permissões por perfil e poderá restringir módulos e ações conforme a função de cada usuário."
          />

          <div className="ouro-orc-roles">
            {[
              ['DONO', 'Visão e controle completo.'],
              ['ADMINISTRADOR', 'Gestão operacional e administrativa.'],
              ['GERENTE', 'Gestão de sua unidade e equipe.'],
              ['VENDEDOR', 'Clientes, operações e seus próprios resultados.'],
            ].map(([role, text]) => (
              <article key={role}>
                <span>{role}</span>
                <strong>{text}</strong>
              </article>
            ))}
          </div>

          <div className="ouro-orc-security-bottom">
            <article>
              <span>HISTÓRICO PRESERVADO</span>
              <p>
                Funcionários poderão ser inativados sem apagar o histórico de
                suas operações.
              </p>
            </article>

            <article>
              <span>AUDITORIA</span>
              <p>
                Alterações e ações críticas poderão ser registradas com
                usuário, data e horário.
              </p>
            </article>
          </div>
        </Reveal>
      </section>

      {/* ACESSO */}
      <section className="ouro-orc-section ouro-orc-light">
        <Reveal>
          <SectionHeader
            number="09"
            eyebrow="ACESSO"
            title="Um sistema acessível de onde a operação estiver"
            text="A plataforma será disponibilizada via navegador e construída com interface responsiva para os diferentes dispositivos."
          />

          <div className="ouro-orc-devices">
            {[
              ['DESKTOP', 'Gestão administrativa e relatórios.'],
              ['NOTEBOOK', 'Operação e administração.'],
              ['TABLET', 'Uso operacional.'],
              ['CELULAR', 'Vendedores externos e acompanhamento rápido.'],
            ].map(([title, text]) => (
              <article key={title}>
                <span>{title}</span>
                <strong>{text}</strong>
              </article>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ETAPAS */}
      <section className="ouro-orc-section ouro-orc-dark">
        <Reveal>
          <SectionHeader
            number="10"
            eyebrow="DESENVOLVIMENTO"
            title="Desenvolvimento estruturado em etapas"
            text="O desenvolvimento será realizado por etapas, permitindo validação dos principais módulos ao longo da construção do projeto."
          />

          <div className="ouro-orc-phases">
            {phases.map(([number, title, text], index) => (
              <article key={number}>
                <span>{number}</span>
                <div>
                  <strong>{title}</strong>
                  <p>{text}</p>
                </div>
                {index < phases.length - 1 && <b>→</b>}
              </article>
            ))}
          </div>
        </Reveal>
      </section>

      {/* INVESTIMENTO */}
      <section id="investimento" className="ouro-orc-investment">
        <div className="ouro-orc-investment-grid" />

        <Reveal>
          <span className="ouro-orc-kicker">11 · INVESTIMENTO</span>

          <h2>
            UM SISTEMA
            <br />
            <span>SOB MEDIDA.</span>
          </h2>

          <p>
            O investimento corresponde ao desenvolvimento personalizado da
            plataforma descrita nesta proposta, incluindo planejamento,
            desenvolvimento, banco de dados, regras de negócio, automações,
            interfaces, testes e homologação dentro do escopo definido.
          </p>

          <div className="ouro-orc-price-card">
            <span>DESENVOLVIMENTO DA PLATAFORMA OURO CRED</span>

            <strong>R$ 49.000,00</strong>

            <small>
              Investimento total para o escopo comercial apresentado.
            </small>
          </div>
        </Reveal>
      </section>

      {/* PAGAMENTO */}
      <section id="condicoes" className="ouro-orc-section ouro-orc-light">
        <Reveal>
          <SectionHeader
            number="12"
            eyebrow="FORMA DE PAGAMENTO"
            title="Pagamento por etapas"
            text="O pagamento será realizado de acordo com os marcos de desenvolvimento e entrega definidos para o projeto."
          />

          <div className="ouro-orc-payment">
            {paymentSteps.map((step, index) => (
              <article key={step.percent}>
                <div className="ouro-orc-payment-percent">
                  {step.percent}
                </div>

                <span>ETAPA {String(index + 1).padStart(2, '0')}</span>

                <h3>{step.title}</h3>

                <strong>{step.value}</strong>
              </article>
            ))}
          </div>

          <div className="ouro-orc-payment-total">
            <span>TOTAL</span>
            <strong>R$ 49.000,00</strong>
          </div>
        </Reveal>
      </section>

      {/* MANUTENÇÃO */}
      <section className="ouro-orc-section">
        <Reveal>
          <SectionHeader
            number="13"
            eyebrow="MANUTENÇÃO E SUPORTE"
            title="Suporte após a entrega"
            text="Após a conclusão do projeto, poderá ser contratado o plano mensal de manutenção e suporte da plataforma."
          />

          <div className="ouro-orc-maintenance">
            <div className="ouro-orc-maintenance-price">
              <span>PLANO MENSAL</span>
              <strong>R$ 500,00</strong>
              <small>/ MÊS</small>
            </div>

            <div className="ouro-orc-maintenance-items">
              {[
                'Suporte técnico',
                'Correções',
                'Manutenção',
                'Atualizações',
                'Acompanhamento',
              ].map((item) => (
                <div key={item}>
                  <IconCheck />
                  <strong>{item}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="ouro-orc-maintenance-note">
            Novos módulos, grandes alterações e integrações não previstas no
            escopo serão avaliados e orçados separadamente.
          </div>
        </Reveal>
      </section>

      {/* EXCLUSÕES */}
      <section className="ouro-orc-section ouro-orc-light">
        <Reveal>
          <SectionHeader
            number="14"
            eyebrow="EXCLUSÕES"
            title="O que não está incluído automaticamente"
            text="Itens dependentes de fornecedores, integrações externas ou novas funcionalidades fora do escopo serão tratados separadamente."
          />

          <div className="ouro-orc-exclusion-grid">
            {exclusions.map(([title, text]) => (
              <article key={title}>
                <span>×</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>

          <div className="ouro-orc-exclusion-note">
            A necessidade e viabilidade de integrações externas será analisada
            tecnicamente conforme cada fornecedor e documentação disponível.
          </div>
        </Reveal>
      </section>

      {/* PREMISSAS */}
      <section className="ouro-orc-section">
        <Reveal>
          <SectionHeader
            number="15"
            eyebrow="PREMISSAS"
            title="Premissas do projeto"
            text="A implementação das regras de negócio será realizada de acordo com as informações e aprovações fornecidas pela Ouro Cred."
          />

          <div className="ouro-orc-premises">
            {[
              'FC',
              'NC',
              'Comissões',
              'Bonificações',
              'Taxas',
              'Modalidades',
              'Performance',
            ].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>

          <div className="ouro-orc-premise-text">
            <strong>
              As regras ainda pendentes de definição deverão ser validadas
              antes da implementação definitiva.
            </strong>
          </div>
        </Reveal>
      </section>

      {/* HOMOLOGAÇÃO */}
      <section className="ouro-orc-section ouro-orc-dark">
        <Reveal>
          <SectionHeader
            number="16"
            eyebrow="HOMOLOGAÇÃO"
            title="Antes de entrar em produção"
          />

          <div className="ouro-orc-homologation">
            {[
              'DESENVOLVIMENTO',
              'TESTES',
              'VALIDAÇÃO',
              'AJUSTES',
              'HOMOLOGAÇÃO',
              'PRODUÇÃO',
            ].map((item, index) => (
              <React.Fragment key={item}>
                <div>
                  <small>{String(index + 1).padStart(2, '0')}</small>
                  <strong>{item}</strong>
                </div>

                {index < 5 && <b>→</b>}
              </React.Fragment>
            ))}
          </div>

          <div className="ouro-orc-homologation-note">
            <span>VALIDAÇÃO DOS PRINCIPAIS FLUXOS</span>
            <strong>
              FC + NC + Comissão + Caixa + Documentos + Relatórios
            </strong>

            <p>
              Os principais fluxos serão validados com casos reais ou exemplos
              fornecidos pela Ouro Cred antes da implantação definitiva.
            </p>
          </div>
        </Reveal>
      </section>

      {/* RESULTADO */}
      <section className="ouro-orc-section ouro-orc-result">
        <Reveal>
          <SectionHeader
            number="17"
            eyebrow="O RESULTADO"
            title="O que a Ouro Cred terá ao final"
            text="Uma plataforma própria para conectar a operação, os vendedores, os clientes e a gestão em um único ambiente."
          />

          <div className="ouro-orc-result-words">
            {[
              'CENTRALIZAÇÃO',
              'AUTOMAÇÃO',
              'CONTROLE',
              'COMISSIONAMENTO',
              'GESTÃO',
              'DADOS',
              'HISTÓRICO',
              'EVOLUÇÃO',
            ].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </Reveal>
      </section>

      {/* FECHAMENTO */}
      <section className="ouro-orc-closing">
        <div className="ouro-orc-grid" />

        <Reveal>
          <span className="ouro-orc-kicker">18 · FECHAMENTO</span>

          <h2>
            UMA NOVA BASE
            <br />
            <span>PARA A OURO CRED.</span>
          </h2>

          <p>
            O projeto foi desenvolvido a partir da realidade operacional da
            Ouro Cred, buscando transformar processos existentes em uma
            plataforma mais integrada, automatizada e preparada para evolução.
          </p>

          <div className="ouro-orc-closing-brand">
            <strong>Leo Souza Designer</strong>
            <span>Desenvolvimento de Sistemas e Soluções Digitais</span>
          </div>
        </Reveal>
      </section>

      {/* ACEITE */}
      <section id="aceite" className="ouro-orc-section ouro-orc-accept">
        <Reveal>
          <SectionHeader
            number="19"
            eyebrow="ACEITE"
            title="Aprovação da proposta"
            text="A aprovação desta proposta representa a concordância com o escopo comercial apresentado e autoriza o início das etapas de especificação e desenvolvimento conforme as condições acordadas entre as partes."
          />

          <div className="ouro-orc-accept-box">
            <div className="ouro-orc-accept-row">
              <span>CLIENTE</span>
              <strong>Felipe Souza / Ouro Cred</strong>
            </div>

            <div className="ouro-orc-signature-row">
              <div>
                <span>ASSINATURA</span>
                <div className="ouro-orc-signature-line" />
              </div>

              <div>
                <span>DATA</span>
                <div className="ouro-orc-date-line" />
              </div>
            </div>

            <div className="ouro-orc-accept-buttons">
              <a
  href="https://wa.me/553131912341?text=Recebi%20e%20analisei%20a%20proposta%20comercial%20da%20Plataforma%20Ouro%20Cred.%20Gostaria%20de%20conversar%20sobre%20a%20aprova%C3%A7%C3%A3o%20do%20projeto."
  target="_blank"
  rel="noreferrer"
  className="ouro-orc-accept-whatsapp"
>
  FALAR SOBRE A PROPOSTA
  <span>→</span>
</a>

              <button
                type="button"
                onClick={() => window.print()}
              >
                IMPRIMIR / SALVAR PDF
                <span>↗</span>
              </button>
            </div>
          </div>
        </Reveal>
      </section>

      <footer className="ouro-orc-footer">
        <span>OURO CRED</span>
        <span>PROPOSTA COMERCIAL · 2026</span>
        <strong>LEO SOUZA DESIGNER</strong>
      </footer>
    </main>
  );
}

export default ProposalOuroCredOrcamento;