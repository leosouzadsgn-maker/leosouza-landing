import React, { useEffect, useMemo, useState } from 'react';
import './treinamento-kreative.css';

const MODULES = [
  {
    id: 'modulo-01',
    number: '01',
    title: 'A Kreative Sports',
    subtitle: 'Antes de vender, você precisa saber o que está representando.',
  },
  {
    id: 'modulo-02',
    number: '02',
    title: 'Quem é nosso cliente',
    subtitle: 'Aprenda a reconhecer quem realmente pode precisar da Kreative.',
  },
  {
    id: 'modulo-03',
    number: '03',
    title: 'Nossas soluções',
    subtitle: 'Conheça o que oferecemos e o problema que cada solução resolve.',
  },
  {
    id: 'modulo-04',
    number: '04',
    title: 'Como trabalhamos',
    subtitle: 'Entenda o processo comercial e operacional da Kreative.',
  },
  {
    id: 'modulo-05',
    number: '05',
    title: 'Prospecção',
    subtitle: 'Aprenda a encontrar oportunidades sem sair disparando spam.',
  },
  {
    id: 'modulo-06',
    number: '06',
    title: 'Venda consultiva',
    subtitle: 'Diagnostique primeiro. Apresente a solução depois.',
  },
  {
    id: 'modulo-07',
    number: '07',
    title: 'Objeções',
    subtitle: 'Saiba conduzir as principais dúvidas e resistências.',
  },
  {
    id: 'modulo-08',
    number: '08',
    title: 'Comissão 50/50',
    subtitle: 'Entenda exatamente como funciona sua remuneração.',
  },
  {
    id: 'modulo-09',
    number: '09',
    title: 'Código do consultor',
    subtitle: 'As regras para representar a Kreative profissionalmente.',
  },
  {
    id: 'modulo-10',
    number: '10',
    title: 'Follow-up',
    subtitle: 'Aprenda a continuar a conversa sem parecer insistente.',
  },
  {
    id: 'modulo-11',
    number: '11',
    title: 'Fechamento',
    subtitle: 'Reconheça sinais de compra e conduza o próximo passo.',
  },
  {
    id: 'modulo-12',
    number: '12',
    title: 'Pós-venda',
    subtitle: 'Venda boa gera relacionamento, renovação e indicação.',
  },
  {
    id: 'modulo-13',
    number: '13',
    title: 'Rotina do consultor',
    subtitle: 'Transforme prospecção em processo e processo em resultado.',
  },
  {
    id: 'modulo-14',
    number: '14',
    title: 'Casos práticos',
    subtitle: 'Treine o raciocínio comercial em situações reais.',
  },
  {
    id: 'modulo-15',
    number: '15',
    title: 'Desafio do consultor',
    subtitle: 'Monte sua própria abordagem, diagnóstico e plano de ação.',
  },
  {
    id: 'avaliacao',
    number: '16',
    title: 'Avaliação final',
    subtitle: 'Agora é hora de provar que você está preparado.',
  },
];

const QUIZ = [
  {
    question: 'Qual é a melhor forma de apresentar a Kreative?',
    options: [
      'Uma empresa que faz artes para jogadores.',
      'Uma empresa de posicionamento, imagem e comunicação para atletas.',
      'Uma gráfica especializada em futebol.',
      'Uma agência que promete oportunidades em clubes.',
    ],
    answer: 1,
  },
  {
    question: 'O que o consultor deve fazer antes de apresentar uma solução?',
    options: [
      'Mandar a tabela de preços.',
      'Enviar todos os serviços disponíveis.',
      'Entender o momento e a necessidade do potencial cliente.',
      'Oferecer desconto.',
    ],
    answer: 2,
  },
  {
    question: 'Um cliente diz: "Já tenho designer". Qual é a melhor resposta?',
    options: [
      'Então você não precisa da Kreative.',
      'Dizer que o designer dele é ruim.',
      'Entender se ele possui apenas produção de peças ou também estratégia e posicionamento.',
      'Oferecer fazer as artes mais barato.',
    ],
    answer: 2,
  },
  {
    question: 'Sobre a comissão do consultor:',
    options: [
      'Ele recebe sobre qualquer cliente da Kreative.',
      'Ele recebe somente dos clientes que captar.',
      'Ele recebe mesmo sem participar da captação.',
      'Ele recebe apenas no primeiro mês.',
    ],
    answer: 1,
  },
  {
    question: 'Se um cliente captado pelo consultor continuar pagando mensalmente:',
    options: [
      'A comissão termina no primeiro pagamento.',
      'A comissão continua enquanto o cliente permanecer recorrente, conforme a parceria.',
      'O consultor precisa captar novamente todo mês.',
      'A comissão passa automaticamente para outro consultor.',
    ],
    answer: 1,
  },
  {
    question: 'O consultor pode prometer qualquer resultado para fechar uma venda?',
    options: [
      'Sim, se o cliente pedir.',
      'Sim, desde que seja por WhatsApp.',
      'Não. Nunca deve prometer o que a Kreative não autorizou ou não pode garantir.',
      'Somente para atletas profissionais.',
    ],
    answer: 2,
  },
  {
    question: 'Qual é a lógica da venda consultiva?',
    options: [
      'Falar o máximo possível sobre a empresa.',
      'Descobrir a necessidade e conectar a necessidade à solução adequada.',
      'Dar desconto antes de ouvir o cliente.',
      'Enviar o portfólio e esperar.',
    ],
    answer: 1,
  },
  {
    question: 'O que acontece quando o cliente diz "vou pensar"?',
    options: [
      'Encerrar imediatamente a conversa.',
      'Pressionar o cliente até ele comprar.',
      'Tentar entender o que ainda está impedindo a decisão.',
      'Oferecer metade do preço.',
    ],
    answer: 2,
  },
  {
    question: 'Qual é o primeiro objetivo de uma abordagem comercial?',
    options: [
      'Fechar na primeira mensagem.',
      'Criar contexto e abrir uma conversa relevante.',
      'Mandar o catálogo completo.',
      'Conseguir o pagamento imediatamente.',
    ],
    answer: 1,
  },
  {
    question: 'Ao analisar um perfil de atleta, o que deve orientar sua observação?',
    options: [
      'Somente o número de seguidores.',
      'Somente a quantidade de curtidas.',
      'A relação entre momento do atleta, imagem, comunicação e possíveis necessidades.',
      'Apenas a qualidade das fotos.',
    ],
    answer: 2,
  },
  {
    question: 'Qual pergunta ajuda melhor a descobrir a dor do cliente?',
    options: [
      'Você quer o plano de R$500?',
      'Posso te mandar nosso Pix?',
      'O que vocês sentem que poderia melhorar hoje na comunicação do atleta?',
      'Você quer contratar agora?',
    ],
    answer: 2,
  },
  {
    question: 'Quando o cliente pede apenas o preço logo no início, o consultor deve:',
    options: [
      'Ignorar o pedido.',
      'Passar qualquer valor para não perder a venda.',
      'Responder e, ao mesmo tempo, buscar contexto para entender qual solução faz sentido.',
      'Dar desconto automaticamente.',
    ],
    answer: 2,
  },
  {
    question: 'O que diferencia um lead qualificado de um simples contato?',
    options: [
      'Ter muitos seguidores.',
      'Ter uma necessidade compatível com uma solução da Kreative e abertura para conversar.',
      'Responder rápido.',
      'Ser atleta profissional.',
    ],
    answer: 1,
  },
  {
    question: 'Se o cliente visualizou sua mensagem e não respondeu, a melhor postura é:',
    options: [
      'Enviar várias mensagens seguidas.',
      'Cobrar uma resposta.',
      'Fazer um follow-up contextualizado depois de um intervalo razoável.',
      'Excluir o contato imediatamente.',
    ],
    answer: 2,
  },
  {
    question: 'Qual é um sinal de compra?',
    options: [
      'O cliente pergunta quando poderia começar.',
      'O cliente não visualiza.',
      'O cliente muda de assunto.',
      'O cliente encerra a conversa.',
    ],
    answer: 0,
  },
  {
    question: 'Se o cliente pede um desconto que você não tem autorização para conceder:',
    options: [
      'Concede metade para fechar.',
      'Inventa uma condição especial.',
      'Explica que precisa validar a condição e leva a demanda para quem pode autorizar.',
      'Diz que não existe negociação em nenhuma hipótese.',
    ],
    answer: 2,
  },
  {
    question: 'O consultor deve registrar um novo lead principalmente para:',
    options: [
      'Criar burocracia.',
      'Evitar perder o histórico e deixar clara a origem da oportunidade.',
      'Mostrar que possui muitos contatos.',
      'Mandar propaganda automática.',
    ],
    answer: 1,
  },
  {
    question: 'Qual é a melhor resposta quando o cliente diz que já possui alguém cuidando das artes?',
    options: [
      'Dizer que o profissional atual é ruim.',
      'Perguntar o que esse profissional já entrega e se existe alguma necessidade além da produção visual.',
      'Oferecer as mesmas artes por metade do preço.',
      'Encerrar sem perguntar nada.',
    ],
    answer: 1,
  },
  {
    question: 'O que o consultor deve fazer quando não conhece a resposta de uma pergunta importante?',
    options: [
      'Inventar uma resposta convincente.',
      'Mudar de assunto.',
      'Dizer que vai validar a informação e retornar com segurança.',
      'Prometer qualquer coisa para manter o cliente.',
    ],
    answer: 2,
  },
  {
    question: 'Por que o pós-venda é importante?',
    options: [
      'Porque a comissão acaba se o cliente não for acompanhado.',
      'Porque relacionamento pode gerar retenção, novas necessidades e indicações.',
      'Porque o consultor precisa fazer a produção.',
      'Porque substitui a prospecção.',
    ],
    answer: 1,
  },
];



function scrollToSection(id) {
  const element = document.getElementById(id);

  if (!element) return;

  element.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
}

function ModuleHeader({ number, title, subtitle }) {
  return (
    <div className="kt-module-header">
      <div className="kt-module-number">{number}</div>

      <div>
        <span className="kt-eyebrow">MÓDULO {number}</span>

        <h2>{title}</h2>

        <p>{subtitle}</p>
      </div>
    </div>
  );
}

function LessonComplete({ completed, onComplete }) {
  return (
    <div className={`kt-complete-box ${completed ? 'is-complete' : ''}`}>
      <div>
        <span>{completed ? 'MÓDULO CONCLUÍDO' : 'FINALIZOU ESTE MÓDULO?'}</span>

        <strong>
          {completed
            ? 'Você já marcou este módulo como concluído.'
            : 'Marque como concluído depois de estudar.'}
        </strong>
      </div>

      <button
        type="button"
        className="kt-complete-button"
        onClick={onComplete}
      >
        {completed ? '✓ CONCLUÍDO' : 'MARCAR COMO CONCLUÍDO'}
      </button>
    </div>
  );
}

function ServiceCard({ number, title, problem, description, pitch }) {
  return (
    <article className="kt-service-card">
      <div className="kt-service-top">
        <span>{number}</span>
        <span>SOLUÇÃO</span>
      </div>

      <h3>{title}</h3>

      <div className="kt-service-block">
        <span>PROBLEMA</span>
        <p>{problem}</p>
      </div>

      <div className="kt-service-block">
        <span>O QUE FAZEMOS</span>
        <p>{description}</p>
      </div>

      <div className="kt-service-pitch">
        <span>COMO PENSAR COMERCIALMENTE</span>
        <p>{pitch}</p>
      </div>
    </article>
  );
}

function Objection({ title, response, avoid }) {
  return (
    <article className="kt-objection">
      <div className="kt-objection-question">
        <span>CLIENTE</span>
        <strong>"{title}"</strong>
      </div>

      <div className="kt-objection-answer">
        <span>COMO CONDUZIR</span>
        <p>{response}</p>
      </div>

      <div className="kt-objection-avoid">
        <span>EVITE</span>
        <p>{avoid}</p>
      </div>
    </article>
  );
}

function TreinamentoKreative() {
  const [completed, setCompleted] = useState(() => {
    try {
      const saved = localStorage.getItem('kreative_training_completed');

      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeModule, setActiveModule] = useState('modulo-01');

  const [answers, setAnswers] = useState({});

  const [quizFinished, setQuizFinished] = useState(false);

  const [quizScore, setQuizScore] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(
        'kreative_training_completed',
        JSON.stringify(completed)
      );
    } catch {
      // localStorage indisponível
    }
  }, [completed]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = MODULES.map((module) =>
        document.getElementById(module.id)
      ).filter(Boolean);

      let current = 'modulo-01';

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();

        if (rect.top <= 180) {
          current = section.id;
        }
      });

      setActiveModule(current);
    };

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const completedCount = completed.length;

  const progress = Math.round(
    (completedCount / MODULES.length) * 100
  );

  const finalPassed = quizScore !== null && quizScore >= 70;

  const allQuizAnswered = Object.keys(answers).length === QUIZ.length;

  const calculatedScore = useMemo(() => {
    return QUIZ.reduce((score, question, index) => {
      return score + (answers[index] === question.answer ? 1 : 0);
    }, 0);
  }, [answers]);

  function toggleComplete(id) {
    setCompleted((current) => {
      if (current.includes(id)) {
        return current.filter((item) => item !== id);
      }

      return [...current, id];
    });
  }

  function handleAnswer(questionIndex, optionIndex) {
    if (quizFinished) return;

    setAnswers((current) => ({
      ...current,
      [questionIndex]: optionIndex,
    }));
  }

  function finishQuiz() {
    if (!allQuizAnswered) return;

    const score = Math.round(
      (calculatedScore / QUIZ.length) * 100
    );

    setQuizScore(score);
    setQuizFinished(true);

    if (score >= 70) {
      setCompleted((current) => {
        if (current.includes('avaliacao')) {
          return current;
        }

        return [...current, 'avaliacao'];
      });
    }
  }

  function resetQuiz() {
    setAnswers({});
    setQuizFinished(false);
    setQuizScore(null);
  }

  return (
    <div className="kt-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="kt-header">
        <div className="kt-header-inner">

          <button
            className="kt-brand"
            type="button"
            onClick={() => scrollToSection('inicio')}
          >
            <span className="kt-brand-mark">K</span>

            <span>
              <strong>KREATIVE</strong>
              <small>SPORTS</small>
            </span>
          </button>

          <div className="kt-header-progress">
            <span>FORMAÇÃO</span>

            <strong>{progress}%</strong>

            <div className="kt-mini-progress">
              <div
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>

          <div className="kt-header-status">
            <span className="kt-status-dot" />
            CONSULTOR COMERCIAL
          </div>

        </div>
      </header>

      {/* =====================================================
          PROGRESS BAR
      ===================================================== */}

      <div className="kt-progress-bar">
        <div
          className="kt-progress-fill"
          style={{
            width: `${Math.max(progress, 4)}%`,
          }}
        />
      </div>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section id="inicio" className="kt-hero">

        <div className="kt-hero-grid" />

        <div className="kt-hero-content">

          <div className="kt-label">
            <span>KREATIVE SPORTS</span>
            <span>/</span>
            <span>INTERNAL TRAINING</span>
            <span>/</span>
            <span>2026</span>
          </div>

          <div className="kt-hero-kicker">
            FORMAÇÃO DO CONSULTOR COMERCIAL
          </div>

          <h1>
            NÃO VENDA.
            <span>ENTENDA.</span>
          </h1>

          <p className="kt-hero-description">
            Você não está aqui para simplesmente oferecer serviços.
            Você está aqui para entender atletas, identificar
            problemas e conectar cada problema à solução certa
            dentro da Kreative Sports.
          </p>

          <div className="kt-hero-actions">

            <button
              className="kt-primary-button"
              type="button"
              onClick={() => scrollToSection('mapa')}
            >
              COMEÇAR FORMAÇÃO
              <span>↓</span>
            </button>

            <div className="kt-hero-meta">
              <span>{MODULES.length} ETAPAS</span>
              <span>1 AVALIAÇÃO</span>
              <span>PROGRESSO SALVO</span>
            </div>

          </div>

        </div>

        <div className="kt-hero-side">
          <span>01</span>
          <span>16</span>
          <div />
          <small>SCROLL TO LEARN</small>
        </div>

        <div className="kt-hero-bottom">
          <span>KREATIVE SPORTS</span>
          <span>KNOWLEDGE / POSITIONING / SALES</span>
        </div>

      </section>

      {/* =====================================================
          MINDSET
      ===================================================== */}

      <section className="kt-intro">

        <div className="kt-container">

          <div className="kt-intro-label">
            <span>01</span>
            <span>MENTALIDADE</span>
          </div>

          <div className="kt-intro-content">

            <h2>
              O consultor não
              <br />
              <em>empurra serviço.</em>
            </h2>

            <p>
              A venda começa quando você entende o momento do
              potencial cliente. Quanto melhor você diagnostica,
              mais fácil fica apresentar uma solução que faça sentido.
            </p>

            <p>
              Seu trabalho é abrir portas, construir relacionamento,
              identificar oportunidades e conduzir o potencial cliente
              até a Kreative.
            </p>

          </div>

        </div>

      </section>

      {/* =====================================================
          MAPA
      ===================================================== */}

      <section id="mapa" className="kt-map">

        <div className="kt-container">

          <div className="kt-section-top">

            <div>
              <span className="kt-eyebrow">ROADMAP DA FORMAÇÃO</span>

              <h2>SEU CAMINHO.</h2>
            </div>

            <div>
              <p>
                Estude os módulos em sequência. A formação foi
                construída para fazer você sair do conhecimento
                da marca até a capacidade de conduzir uma conversa
                comercial.
              </p>

              <div className="kt-map-progress">
                <div>
                  <span>PROGRESSO</span>
                  <strong>{completedCount}/{MODULES.length}</strong>
                </div>

                <div className="kt-map-progress-bar">
                  <span
                    style={{
                      width: `${Math.max(progress, 2)}%`,
                    }}
                  />
                </div>
              </div>
            </div>

          </div>

          <div className="kt-module-list">

            {MODULES.map((module) => (
              <button
                key={module.id}
                type="button"
                className={`kt-module-nav ${
                  activeModule === module.id ? 'active' : ''
                } ${
                  completed.includes(module.id)
                    ? 'completed'
                    : ''
                }`}
                onClick={() => scrollToSection(module.id)}
              >
                <span>{module.number}</span>

                <strong>{module.title}</strong>

                <small>{module.subtitle}</small>

                <b>
                  {completed.includes(module.id)
                    ? '✓'
                    : '→'}
                </b>
              </button>
            ))}

          </div>

        </div>

      </section>

      {/* =====================================================
          MODULE 01
      ===================================================== */}

      <section id="modulo-01" className="kt-module kt-dark">

        <div className="kt-container">

          <ModuleHeader
            number="01"
            title="A Kreative Sports"
            subtitle="Antes de vender, você precisa saber o que está representando."
          />

          <div className="kt-module-grid">

            <div className="kt-big-statement">

              <span>O QUE SOMOS</span>

              <h3>
                MAIS QUE DESIGN.
                <br />
                <strong>POSICIONAMENTO.</strong>
              </h3>

            </div>

            <div className="kt-copy">

              <p>
                A Kreative Sports trabalha com posicionamento de
                atletas, marketing esportivo, construção de imagem,
                gestão de redes sociais, Matchday e estratégia
                de carreira.
              </p>

              <p>
                Isso significa que nosso trabalho não termina
                quando uma arte fica pronta.
              </p>

              <p>
                A comunicação é uma ferramenta para ajudar o atleta
                a construir uma presença mais profissional dentro
                e fora das quatro linhas.
              </p>

            </div>

          </div>

          <div className="kt-principles">

            <article>
              <span>01</span>
              <h3>IMAGEM</h3>
              <p>
                A forma como o atleta é apresentado também comunica
                profissionalismo, identidade e presença.
              </p>
            </article>

            <article>
              <span>02</span>
              <h3>POSICIONAMENTO</h3>
              <p>
                O atleta precisa saber como se apresentar e como
                construir uma comunicação coerente com sua carreira.
              </p>
            </article>

            <article>
              <span>03</span>
              <h3>ESTRATÉGIA</h3>
              <p>
                Cada solução precisa estar conectada ao momento
                e ao objetivo do cliente.
              </p>
            </article>

          </div>

          <div className="kt-mantra">

            <span>FRASE QUE O CONSULTOR PRECISA GUARDAR</span>

            <strong>
              "A Kreative não vende arte.
              A arte é uma das ferramentas
              que usamos para construir imagem
              e posicionamento."
            </strong>

          </div>


          <div className="kt-training-panel-grid">
            <article className="kt-training-panel">
              <span>LIÇÃO / 01</span>
              <h3>O que você precisa conseguir explicar</h3>
              <ul>
                <li>O atleta não compra simplesmente uma peça gráfica; ele compra uma forma mais profissional de apresentar sua trajetória.</li>
                <li>A Kreative pode atuar em imagem, posicionamento, comunicação e estratégia de acordo com a necessidade identificada.</li>
                <li>O consultor representa a porta comercial da Kreative. Ele não deve inventar escopo, prazo, resultado ou promessa.</li>
              </ul>
            </article>
            <article className="kt-training-panel">
              <span>EXERCÍCIO / 01</span>
              <h3>Explique a Kreative em 30 segundos</h3>
              <p>Imagine que um pai perguntou: “O que vocês fazem?”. Responda sem falar em preço e sem listar todos os serviços. Comece pelo problema que a Kreative ajuda a organizar.</p>
              <div className="kt-answer-model">
                <span>MODELO DE RACIOCÍNIO</span>
                <strong>Quem atendemos → problema → solução → próximo passo.</strong>
              </div>
            </article>
          </div>

          <LessonComplete
            completed={completed.includes('modulo-01')}
            onComplete={() => toggleComplete('modulo-01')}
          />

        </div>

      </section>

      {/* =====================================================
          MODULE 02
      ===================================================== */}

      <section id="modulo-02" className="kt-module kt-light">

        <div className="kt-container">

          <ModuleHeader
            number="02"
            title="Quem é nosso cliente"
            subtitle="Não tente vender para todo mundo. Aprenda a reconhecer uma oportunidade."
          />

          <div className="kt-audience-grid">

            <article className="kt-audience-card">

              <span>01</span>

              <h3>ATLETA DE BASE</h3>

              <p>
                Jogadores que estão construindo sua trajetória
                e precisam começar a tratar sua imagem e presença
                digital com mais profissionalismo.
              </p>

              <div className="kt-audience-signal">
                <span>SINAL DE OPORTUNIDADE</span>
                <strong>
                  Perfil desorganizado, pouca identidade ou ausência
                  de estratégia de comunicação.
                </strong>
              </div>

            </article>

            <article className="kt-audience-card">

              <span>02</span>

              <h3>ATLETA PROFISSIONAL</h3>

              <p>
                Jogadores que já possuem carreira e podem precisar
                fortalecer sua imagem, comunicação e presença fora
                do campo.
              </p>

              <div className="kt-audience-signal">
                <span>SINAL DE OPORTUNIDADE</span>
                <strong>
                  Carreira evoluindo, mas comunicação ainda abaixo
                  do nível profissional.
                </strong>
              </div>

            </article>

            <article className="kt-audience-card">

              <span>03</span>

              <h3>PAIS E RESPONSÁVEIS</h3>

              <p>
                Em atletas de base, muitas decisões de investimento
                passam pelos pais ou responsáveis.
              </p>

              <div className="kt-audience-signal">
                <span>SINAL DE OPORTUNIDADE</span>
                <strong>
                  Preocupação com futuro, imagem, organização
                  e desenvolvimento do atleta.
                </strong>
              </div>

            </article>

            <article className="kt-audience-card">

              <span>04</span>

              <h3>PROFISSIONAIS DO FUTEBOL</h3>

              <p>
                Empresários, agentes, treinadores, escolinhas,
                projetos e parceiros podem gerar oportunidades
                para a Kreative.
              </p>

              <div className="kt-audience-signal">
                <span>SINAL DE OPORTUNIDADE</span>
                <strong>
                  Possuem atletas, projetos ou uma rede que pode
                  se beneficiar das soluções da Kreative.
                </strong>
              </div>

            </article>

          </div>

          <div className="kt-diagnosis">

            <div>
              <span>DOR</span>

              <h3>
                "Meu filho joga bem,
                mas o perfil dele não
                mostra isso."
              </h3>
            </div>

            <div>
              <span>OPORTUNIDADE</span>

              <h3>
                "Vamos entender como
                podemos transformar
                essa presença."
              </h3>
            </div>

          </div>

          <div className="kt-consultant-note light">

            <span>ATENÇÃO</span>

            <strong>
              Nem todo atleta é um lead qualificado.
            </strong>

            <p>
              O objetivo não é convencer qualquer pessoa a comprar.
              É encontrar pessoas que tenham uma necessidade real
              que a Kreative consiga atender.
            </p>

          </div>


          <div className="kt-training-panel-grid">
            <article className="kt-training-panel">
              <span>RADAR DO CONSULTOR</span>
              <h3>Leia o perfil antes de falar.</h3>
              <div className="kt-radar-list">
                <span>01 / BIO E POSICIONAMENTO</span>
                <span>02 / IDENTIDADE VISUAL</span>
                <span>03 / ORGANIZAÇÃO DO FEED</span>
                <span>04 / FREQUÊNCIA E CONTEÚDO</span>
                <span>05 / MOMENTO DA CARREIRA</span>
                <span>06 / QUEM TOMA A DECISÃO</span>
              </div>
            </article>
            <article className="kt-training-panel">
              <span>EXERCÍCIO / 02</span>
              <h3>Problema → oportunidade → solução</h3>
              <p>Treine esta sequência: “O que estou vendo?”, “por que isso pode ser um problema?”, “o que eu preciso perguntar?” e só então “qual solução pode fazer sentido?”.</p>
              <div className="kt-answer-model">
                <span>REGRA</span>
                <strong>Não diagnostique pelo número de seguidores. Diagnostique pelo contexto.</strong>
              </div>
            </article>
          </div>

          <LessonComplete
            completed={completed.includes('modulo-02')}
            onComplete={() => toggleComplete('modulo-02')}
          />

        </div>

      </section>

      {/* =====================================================
          MODULE 03
      ===================================================== */}

      <section id="modulo-03" className="kt-module kt-dark">

        <div className="kt-container">

          <ModuleHeader
            number="03"
            title="Nossas soluções"
            subtitle="Você precisa saber explicar o valor antes de falar preço."
          />

          <div className="kt-services-intro">

            <span>REGRA COMERCIAL</span>

            <h3>
              Não apresente todos os serviços de uma vez.
            </h3>

            <p>
              Descubra primeiro o problema. Depois apresente a
              solução que melhor responde àquele problema.
            </p>

          </div>

          <div className="kt-services-grid">

            <ServiceCard
              number="01"
              title="Posicionamento de atletas"
              problem="O atleta possui talento, mas não sabe como se apresentar ou construir uma presença coerente."
              description="Estratégia para organizar a percepção, comunicação e presença do atleta."
              pitch="Não fale apenas em postagem. Fale sobre como o atleta está sendo percebido."
            />

            <ServiceCard
              number="02"
              title="Construção de imagem"
              problem="O atleta tem materiais espalhados, identidade inconsistente ou uma apresentação abaixo do seu momento."
              description="Construção de uma presença visual mais profissional e alinhada à identidade do atleta."
              pitch="Mostre que imagem é parte da apresentação profissional do atleta."
            />

            <ServiceCard
              number="03"
              title="Gestão de redes sociais"
              problem="O atleta não consegue manter uma comunicação organizada e consistente."
              description="Organização e gestão da presença digital do atleta de acordo com sua estratégia."
              pitch="Não venda simplesmente quantidade de posts. Entenda o objetivo da presença digital."
            />

            <ServiceCard
              number="04"
              title="Matchday"
              problem="O atleta vive momentos importantes dentro do campo, mas não possui uma comunicação visual à altura."
              description="Materiais de Matchday para fortalecer identidade, presença e comunicação nos momentos de jogo."
              pitch="O Matchday transforma um momento esportivo em uma oportunidade de comunicação."
            />

            <ServiceCard
              number="05"
              title="Marketing esportivo"
              problem="O atleta possui uma carreira esportiva, mas não sabe transformar sua presença em posicionamento."
              description="Ações e estratégias voltadas à construção de imagem e presença dentro do universo esportivo."
              pitch="Conecte marketing ao momento de carreira, e não somente à estética."
            />

            <ServiceCard
              number="06"
              title="Estratégia de carreira"
              problem="O atleta precisa pensar além do jogo e organizar sua trajetória de forma mais estratégica."
              description="Orientação e estruturação de ações relacionadas à construção da trajetória do atleta."
              pitch="Nunca prometa uma oportunidade. Mostre que planejamento ajuda o atleta a estar mais preparado."
            />

          </div>

          <div className="kt-service-warning">

            <div>
              <span>NÃO FAÇA</span>

              <strong>
                "Temos seis serviços. Qual você quer?"
              </strong>
            </div>

            <div>
              <span>FAÇA</span>

              <strong>
                "Me conta um pouco sobre o momento do atleta
                e o que vocês estão buscando melhorar."
              </strong>
            </div>

          </div>


          <div className="kt-training-panel-grid">
            <article className="kt-training-panel">
              <span>MATRIZ COMERCIAL</span>
              <h3>Quando pensar em cada solução</h3>
              <div className="kt-matrix">
                <div><strong>POSICIONAMENTO</strong><p>Quando a comunicação não representa bem o momento e objetivo do atleta.</p></div>
                <div><strong>IMAGEM</strong><p>Quando existe inconsistência visual ou apresentação abaixo do nível desejado.</p></div>
                <div><strong>REDES</strong><p>Quando falta organização, constância ou estratégia de presença.</p></div>
                <div><strong>MATCHDAY</strong><p>Quando momentos de jogo precisam ganhar comunicação visual profissional.</p></div>
              </div>
            </article>
            <article className="kt-training-panel">
              <span>REGRA DE OURO</span>
              <h3>Não empilhe serviços.</h3>
              <p>Uma conversa consultiva não precisa terminar com seis serviços. Se o cliente apresenta um problema específico, comece pela solução que melhor responde àquele problema e aprofunde apenas se houver necessidade.</p>
              <div className="kt-answer-model">
                <span>FRASE ÚTIL</span>
                <strong>“Pelo que você me contou, acredito que o primeiro ponto a organizar seja X. Posso te explicar como trabalhamos isso?”</strong>
              </div>
            </article>
          </div>

          <LessonComplete
            completed={completed.includes('modulo-03')}
            onComplete={() => toggleComplete('modulo-03')}
          />

        </div>

      </section>

      {/* =====================================================
          MODULE 04
      ===================================================== */}

      <section id="modulo-04" className="kt-module kt-light">

        <div className="kt-container">

          <ModuleHeader
            number="04"
            title="Como trabalhamos"
            subtitle="O consultor precisa saber exatamente o que acontece depois que o cliente demonstra interesse."
          />

          <div className="kt-process">

            <article>
              <span>01</span>
              <strong>PROSPECÇÃO</strong>
              <p>
                Encontrar potenciais clientes e iniciar conversas.
              </p>
            </article>

            <article>
              <span>02</span>
              <strong>DIAGNÓSTICO</strong>
              <p>
                Entender o momento, necessidade e objetivo do cliente.
              </p>
            </article>

            <article>
              <span>03</span>
              <strong>SOLUÇÃO</strong>
              <p>
                Identificar qual solução da Kreative faz sentido.
              </p>
            </article>

            <article>
              <span>04</span>
              <strong>PROPOSTA</strong>
              <p>
                A oportunidade é conduzida para a proposta adequada.
              </p>
            </article>

            <article>
              <span>05</span>
              <strong>PAGAMENTO</strong>
              <p>
                O início do trabalho acontece conforme as condições
                comerciais definidas pela Kreative.
              </p>
            </article>

            <article>
              <span>06</span>
              <strong>ONBOARDING</strong>
              <p>
                O cliente entra no processo de organização e coleta
                das informações necessárias.
              </p>
            </article>

            <article>
              <span>07</span>
              <strong>PRODUÇÃO</strong>
              <p>
                A equipe executa o trabalho contratado.
              </p>
            </article>

            <article>
              <span>08</span>
              <strong>RELACIONAMENTO</strong>
              <p>
                O cliente continua sendo acompanhado e novas
                necessidades podem surgir.
              </p>
            </article>

          </div>

          <div className="kt-process-rule">

            <span>REGRA</span>

            <strong>
              O consultor não precisa fazer o trabalho operacional.
              Ele precisa fazer bem o trabalho comercial.
            </strong>

          </div>


          <div className="kt-training-panel-grid">
            <article className="kt-training-panel">
              <span>PASSAGEM DE BASTÃO</span>
              <h3>O que acontece quando a venda avança?</h3>
              <ul>
                <li>O consultor registra e organiza a oportunidade.</li>
                <li>A equipe valida escopo, condições e próximos passos.</li>
                <li>Após confirmação de pagamento, o trabalho segue para onboarding e produção conforme o serviço contratado.</li>
                <li>O consultor permanece atento ao relacionamento comercial, sem assumir tarefas operacionais que não são suas.</li>
              </ul>
            </article>
            <article className="kt-training-panel">
              <span>CHECKLIST</span>
              <h3>Antes de considerar um lead pronto</h3>
              <div className="kt-check-list">
                <span>□ Nome e contato identificados</span>
                <span>□ Origem do lead registrada</span>
                <span>□ Necessidade entendida</span>
                <span>□ Solução provável identificada</span>
                <span>□ Próximo passo combinado</span>
              </div>
            </article>
          </div>

          <LessonComplete
            completed={completed.includes('modulo-04')}
            onComplete={() => toggleComplete('modulo-04')}
          />

        </div>

      </section>

      {/* =====================================================
          MODULE 05
      ===================================================== */}

      <section id="modulo-05" className="kt-module kt-dark">

        <div className="kt-container">

          <ModuleHeader
            number="05"
            title="Prospecção"
            subtitle="Encontrar pessoas é fácil. Encontrar oportunidades é o trabalho."
          />

          <div className="kt-prospect-grid">

            <div className="kt-prospect-main">

              <span>O PROCESSO</span>

              <h3>
                PESQUISAR.
                <br />
                IDENTIFICAR.
                <br />
                ABORDAR.
                <br />
                ACOMPANHAR.
              </h3>

            </div>

            <div className="kt-copy">

              <p>
                Antes de mandar mensagem, olhe o perfil.
              </p>

              <p>
                Quem é o atleta? Qual categoria? Qual clube?
                Como está a apresentação? Existe identidade?
                Existe frequência? Existe profissionalismo?
              </p>

              <p>
                Quanto mais contexto você tiver, menos genérica
                será sua abordagem.
              </p>

            </div>

          </div>

          <div className="kt-prospect-checklist">

            <div>
              <span>01</span>
              <strong>ENCONTRE</strong>
              <p>
                Instagram, indicações, rede de contatos,
                clubes, escolinhas e profissionais do futebol.
              </p>
            </div>

            <div>
              <span>02</span>
              <strong>OBSERVE</strong>
              <p>
                Veja se existe um problema real que a Kreative
                consegue ajudar a resolver.
              </p>
            </div>

            <div>
              <span>03</span>
              <strong>ABORDE</strong>
              <p>
                Personalize a primeira mensagem.
                Não comece despejando preço e catálogo.
              </p>
            </div>

            <div>
              <span>04</span>
              <strong>REGISTRE</strong>
              <p>
                Organize os leads para saber quem foi contatado,
                quando e em qual estágio está.
              </p>
            </div>

            <div>
              <span>05</span>
              <strong>FOLLOW-UP</strong>
              <p>
                Nem todo silêncio significa rejeição.
                Saiba retomar uma conversa sem pressionar.
              </p>
            </div>

          </div>

          <div className="kt-message-example">

            <div>
              <span>ABORDAGEM FRACA</span>

              <p>
                "Oi, tudo bem? Trabalho com artes para atletas.
                Tenho planos a partir de R$X. Quer contratar?"
              </p>
            </div>

            <div>
              <span>ABORDAGEM CONSULTIVA</span>

              <p>
                "Fala! Vi o perfil do atleta e acompanhei um pouco
                do trabalho de vocês. Queria entender como vocês
                cuidam hoje da imagem e comunicação dele."
              </p>
            </div>

          </div>


          <div className="kt-training-panel-grid">
            <article className="kt-training-panel">
              <span>PROSPECÇÃO NA PRÁTICA</span>
              <h3>Monte uma lista de oportunidades.</h3>
              <p>Em vez de mandar 100 mensagens genéricas, monte uma lista menor de perfis que você realmente observou. Para cada lead, anote: quem é, qual problema você percebeu, quem provavelmente decide e qual seria sua primeira pergunta.</p>
              <div className="kt-answer-model">
                <span>OBJETIVO</span>
                <strong>Qualidade da conversa - quantidade de mensagens.</strong>
              </div>
            </article>
            <article className="kt-training-panel">
              <span>ROTEIRO DE PRIMEIRO CONTATO</span>
              <h3>Contexto antes de oferta.</h3>
              <div className="kt-script">
                <p><strong>1.</strong> Mostre que você realmente viu o perfil.</p>
                <p><strong>2.</strong> Faça uma pergunta aberta.</p>
                <p><strong>3.</strong> Escute a resposta.</p>
                <p><strong>4.</strong> Só depois conecte a Kreative ao problema.</p>
              </div>
            </article>
          </div>

          <LessonComplete
            completed={completed.includes('modulo-05')}
            onComplete={() => toggleComplete('modulo-05')}
          />

        </div>

      </section>

      {/* =====================================================
          MODULE 06
      ===================================================== */}

      <section id="modulo-06" className="kt-module kt-light">

        <div className="kt-container">

          <ModuleHeader
            number="06"
            title="Venda consultiva"
            subtitle="O melhor vendedor não é quem fala mais. É quem entende melhor."
          />

          <div className="kt-consultative">

            <div className="kt-consultative-heading">

              <span>AS PERGUNTAS CERTAS</span>

              <h3>
                FAÇA O CLIENTE
                <br />
                FALAR.
              </h3>

            </div>

            <div className="kt-question-list">

              <article>
                <span>01</span>
                <strong>
                  "Como vocês cuidam hoje da imagem do atleta?"
                </strong>
                <p>
                  Descobre quem já cuida dessa área e como funciona.
                </p>
              </article>

              <article>
                <span>02</span>
                <strong>
                  "O que vocês sentem que poderia melhorar?"
                </strong>
                <p>
                  Faz o cliente identificar a própria dor.
                </p>
              </article>

              <article>
                <span>03</span>
                <strong>
                  "Qual é o principal objetivo do atleta neste momento?"
                </strong>
                <p>
                  Ajuda a entender o contexto de carreira.
                </p>
              </article>

              <article>
                <span>04</span>
                <strong>
                  "Vocês já possuem alguém responsável pelas redes?"
                </strong>
                <p>
                  Evita oferecer uma solução que não faz sentido.
                </p>
              </article>

              <article>
                <span>05</span>
                <strong>
                  "Se pudesse melhorar uma coisa no perfil hoje,
                  o que seria?"
                </strong>
                <p>
                  Cria uma porta direta para o diagnóstico.
                </p>
              </article>

            </div>

          </div>

          <div className="kt-sales-formula">

            <span>FÓRMULA</span>

            <div>
              <strong>PERGUNTA</strong>
              <b>→</b>
              <strong>OUVIR</strong>
              <b>→</b>
              <strong>DIAGNOSTICAR</strong>
              <b>→</b>
              <strong>CONECTAR</strong>
              <b>→</b>
              <strong>APRESENTAR</strong>
            </div>

          </div>


          <div className="kt-training-panel-grid">
            <article className="kt-training-panel">
              <span>MAPA DA CONVERSA</span>
              <h3>Não transforme o diagnóstico em interrogatório.</h3>
              <div className="kt-conversation-steps">
                <span>CONTEXTO <b>→</b></span>
                <span>DOR <b>→</b></span>
                <span>OBJETIVO <b>→</b></span>
                <span>PRIORIDADE <b>→</b></span>
                <span>SOLUÇÃO <b>→</b></span>
                <span>PRÓXIMO PASSO</span>
              </div>
            </article>
            <article className="kt-training-panel">
              <span>EXERCÍCIO / 06</span>
              <h3>Escute antes de responder.</h3>
              <p>Depois que o cliente responder, não corra para vender. Faça uma frase de confirmação: “Entendi. Então hoje o principal ponto é…”. Isso mostra que você realmente ouviu e reduz ruído na conversa.</p>
              <div className="kt-answer-model">
                <span>LEMBRETE</span>
                <strong>Diagnóstico bom transforma uma conversa genérica em uma proposta específica.</strong>
              </div>
            </article>
          </div>

          <LessonComplete
            completed={completed.includes('modulo-06')}
            onComplete={() => toggleComplete('modulo-06')}
          />

        </div>

      </section>

      {/* =====================================================
          MODULE 07
      ===================================================== */}

      <section id="modulo-07" className="kt-module kt-dark">

        <div className="kt-container">

          <ModuleHeader
            number="07"
            title="Objeções"
            subtitle="Objeção não é necessariamente rejeição. Muitas vezes é falta de clareza."
          />

          <div className="kt-objections">

            <Objection
              title="Está caro."
              response="Entenda em relação a quê. Pergunte o que o cliente esperava, qual necessidade ele quer resolver e apresente o valor da solução adequada."
              avoid="Dar desconto imediatamente ou começar a justificar preço sem entender a objeção."
            />

            <Objection
              title="Vou pensar."
              response="Responda com tranquilidade: 'Claro. Só para eu entender, ficou alguma dúvida sobre a solução ou existe algum ponto específico que você precisa avaliar?'"
              avoid="Pressionar ou mandar várias mensagens seguidas."
            />

            <Objection
              title="Já tenho designer."
              response="Ótimo. Descubra o que esse profissional já faz. A pergunta é se existe apenas produção visual ou também estratégia, posicionamento e construção de imagem."
              avoid="Falar mal do designer atual."
            />

            <Objection
              title="Meu filho ainda é novo."
              response="Justamente por estar em formação, existe a oportunidade de construir uma presença profissional desde cedo, sem esperar a carreira chegar ao próximo nível."
              avoid="Criar medo ou prometer que a imagem vai gerar contrato com clube."
            />

            <Objection
              title="Não tenho dinheiro agora."
              response="Respeite o momento. Pergunte se faz sentido manter o contato para uma oportunidade futura ou se existe uma solução mais adequada ao momento."
              avoid="Desvalorizar o serviço para fechar a qualquer custo."
            />

            <Objection
              title="A gente só quer jogar futebol."
              response="Explique que o trabalho da Kreative não substitui treino, preparação física ou desenvolvimento esportivo. Ele cuida de uma parte complementar: a apresentação e posicionamento fora do campo."
              avoid="Tentar convencer que imagem é mais importante que futebol."
            />

          </div>


          <div className="kt-training-panel-grid">
            <article className="kt-training-panel">
              <span>ESTRUTURA DE OBJEÇÃO</span>
              <h3>OUÇA → ESCLAREÇA → RESPONDA → AVANCE</h3>
              <ul>
                <li>Não trate toda objeção como rejeição.</li>
                <li>Descubra se o problema é preço, prioridade, confiança, timing ou falta de entendimento.</li>
                <li>Responda somente ao que realmente foi colocado.</li>
                <li>Termine com uma pergunta ou próximo passo claro.</li>
              </ul>
            </article>
            <article className="kt-training-panel">
              <span>SIMULAÇÃO</span>
              <h3>“Vou conversar com meu pai.”</h3>
              <p>Não pressione. Descubra o que precisa ser levado para essa conversa e ofereça as informações certas. Exemplo: “Claro. Tem algum ponto da proposta que você gostaria que eu deixasse mais claro para vocês avaliarem juntos?”</p>
              <div className="kt-answer-model">
                <span>EVITE</span>
                <strong>“Mas é só fechar agora que eu faço um desconto.”</strong>
              </div>
            </article>
          </div>

          <LessonComplete
            completed={completed.includes('modulo-07')}
            onComplete={() => toggleComplete('modulo-07')}
          />

        </div>

      </section>

      {/* =====================================================
          MODULE 08
      ===================================================== */}

      <section id="modulo-08" className="kt-module kt-light">

        <div className="kt-container">

          <ModuleHeader
            number="08"
            title="Comissão 50/50"
            subtitle="Você precisa conhecer as regras da parceria antes de começar a prospectar."
          />

          <div className="kt-commission-hero">

            <div>
              <span>SUA PARTICIPAÇÃO</span>

              <strong>50%</strong>

              <p>
                sobre os valores recebidos dos clientes captados
                por você, conforme as regras da parceria.
              </p>
            </div>

            <div className="kt-commission-example">

              <span>EXEMPLO</span>

              <div>
                <strong>R$500</strong>
                <small>valor recebido do cliente</small>
              </div>

              <div>
                <strong>R$250</strong>
                <small>consultor</small>
              </div>

              <div>
                <strong>R$250</strong>
                <small>Kreative</small>
              </div>

            </div>

          </div>

          <div className="kt-rules-grid">

            <article>
              <span>01</span>
              <h3>CLIENTE CAPTADO POR VOCÊ</h3>
              <p>
                A comissão se aplica aos clientes que você efetivamente
                trouxe para a Kreative.
              </p>
            </article>

            <article>
              <span>02</span>
              <h3>CLIENTE RECORRENTE</h3>
              <p>
                Se o cliente continuar pagando de forma recorrente,
                você continua participando enquanto ele permanecer
                dentro da sua carteira, conforme a parceria.
              </p>
            </article>

            <article>
              <span>03</span>
              <h3>CLIENTE JÁ EXISTENTE</h3>
              <p>
                Clientes que já pertenciam à Kreative antes da sua
                captação não entram automaticamente como seus leads.
              </p>
            </article>

            <article>
              <span>04</span>
              <h3>REGISTRO</h3>
              <p>
                A origem do lead precisa ser clara para evitar conflito
                entre consultor, equipe e clientes existentes.
              </p>
            </article>

            <article>
              <span>05</span>
              <h3>TRANSPARÊNCIA</h3>
              <p>
                Não esconda informações, não invente condições e não
                combine valores por conta própria.
              </p>
            </article>

            <article>
              <span>06</span>
              <h3>RELACIONAMENTO</h3>
              <p>
                Cliente recorrente é relacionamento. A comissão não é
                motivo para abandonar o cliente depois da venda.
              </p>
            </article>

          </div>

          <div className="kt-commission-warning">

            <span>NUNCA ESQUEÇA</span>

            <strong>
              Você não está vendendo uma comissão.
              Está construindo uma carteira.
            </strong>

            <p>
              Um cliente bem atendido pode representar uma relação
              comercial de longo prazo. Pense como consultor, não
              como alguém procurando apenas a próxima venda.
            </p>

          </div>


          <div className="kt-training-panel-grid">
            <article className="kt-training-panel">
              <span>EXEMPLOS DE RECORRÊNCIA</span>
              <h3>Entenda o efeito de uma carteira.</h3>
              <div className="kt-money-grid">
                <div><strong>R$ 300</strong><span>cliente / mês</span><b>R$ 150</b><small>consultor / mês</small></div>
                <div><strong>R$ 600</strong><span>cliente / mês</span><b>R$ 300</b><small>consultor / mês</small></div>
                <div><strong>R$ 1.000</strong><span>cliente / mês</span><b>R$ 500</b><small>consultor / mês</small></div>
              </div>
            </article>
            <article className="kt-training-panel">
              <span>ATENÇÃO</span>
              <h3>50/50 não significa “metade de qualquer dinheiro”.</h3>
              <p>A regra estudada aqui é: você participa dos valores recebidos dos clientes que você captou, enquanto eles permanecem recorrentes dentro da parceria, conforme as condições combinadas. Cliente já existente não entra automaticamente na sua carteira.</p>
              <div className="kt-answer-model">
                <span>PRIORIDADE</span>
                <strong>Registre a origem do lead antes de existir conflito.</strong>
              </div>
            </article>
          </div>

          <LessonComplete
            completed={completed.includes('modulo-08')}
            onComplete={() => toggleComplete('modulo-08')}
          />

        </div>

      </section>

      {/* =====================================================
          MODULE 09
      ===================================================== */}

      <section id="modulo-09" className="kt-module kt-dark">

        <div className="kt-container">

          <ModuleHeader
            number="09"
            title="Código do consultor"
            subtitle="Representar a Kreative significa assumir responsabilidade pela forma como você se comunica."
          />

          <div className="kt-code-grid">

            <article>
              <span>01</span>
              <strong>VERDADE</strong>
              <p>
                Nunca invente informações para fechar uma venda.
              </p>
            </article>

            <article>
              <span>02</span>
              <strong>CLAREZA</strong>
              <p>
                Não esconda condições, valores ou limitações.
              </p>
            </article>

            <article>
              <span>03</span>
              <strong>RESPEITO</strong>
              <p>
                Respeite o tempo, o momento e a decisão do cliente.
              </p>
            </article>

            <article>
              <span>04</span>
              <strong>SEM PROMESSAS</strong>
              <p>
                Nunca prometa contrato, teste, clube, empresário
                ou resultado que a Kreative não tenha autorizado.
              </p>
            </article>

            <article>
              <span>05</span>
              <strong>SEM DESCONTO AUTÔNOMO</strong>
              <p>
                Não altere preços ou condições comerciais sem autorização.
              </p>
            </article>

            <article>
              <span>06</span>
              <strong>PROFISSIONALISMO</strong>
              <p>
                WhatsApp, Instagram e qualquer outro canal continuam
                sendo ambientes profissionais quando você representa
                a Kreative.
              </p>
            </article>

            <article>
              <span>07</span>
              <strong>PROTEJA A MARCA</strong>
              <p>
                Não fale mal de concorrentes, clientes ou parceiros.
              </p>
            </article>

            <article>
              <span>08</span>
              <strong>SAIBA QUANDO CHAMAR O LÉO</strong>
              <p>
                Quando a conversa sair do escopo comercial que você
                domina, não invente. Escale a situação.
              </p>
            </article>

          </div>

          <div className="kt-mantra">

            <span>O CÓDIGO</span>

            <strong>
              "Se você não sabe a resposta,
              não invente a resposta."
            </strong>

            <p>
              Um bom consultor não precisa saber tudo.
              Ele precisa saber conduzir.
            </p>

          </div>


          <div className="kt-training-panel-grid">
            <article className="kt-training-panel">
              <span>LINHA VERMELHA</span>
              <h3>O que você nunca deve prometer.</h3>
              <div className="kt-red-list">
                <span>✕ Contrato com clube</span>
                <span>✕ Teste garantido</span>
                <span>✕ Empresário garantido</span>
                <span>✕ Resultado de carreira</span>
                <span>✕ Desconto não autorizado</span>
                <span>✕ Prazo que a equipe não confirmou</span>
              </div>
            </article>
            <article className="kt-training-panel">
              <span>QUANDO ESCALAR</span>
              <h3>Você não precisa resolver tudo.</h3>
              <p>Se o cliente perguntar algo que depende de decisão da direção, condição comercial específica, escopo fora do padrão ou promessa que você não pode garantir, pare e valide. Profissionalismo também é saber dizer: “Vou confirmar isso para te responder corretamente.”</p>
              <div className="kt-answer-model">
                <span>CÓDIGO</span>
                <strong>Não invente para parecer preparado. Valide para realmente estar preparado.</strong>
              </div>
            </article>
          </div>

          <LessonComplete
            completed={completed.includes('modulo-09')}
            onComplete={() => toggleComplete('modulo-09')}
          />

        </div>

      </section>


      {/* =====================================================
          MODULE 10
      ===================================================== */}

      <section id="modulo-10" className="kt-module kt-light">
        <div className="kt-container">
          <ModuleHeader
            number="10"
            title="Follow-up"
            subtitle="A maioria das vendas não acontece na primeira mensagem. Aprenda a retomar com contexto."
          />

          <div className="kt-followup-hero">
            <div>
              <span>PRINCÍPIO</span>
              <h3>NÃO COBRE.<br />CONTINUE.</h3>
            </div>
            <div className="kt-copy">
              <p>Follow-up é a continuação de uma conversa que já começou. Ele precisa trazer contexto, utilidade ou uma pergunta clara.</p>
              <p>O objetivo não é fazer o cliente responder por pressão. É descobrir se a oportunidade continua viva, se surgiu uma dúvida ou se o momento mudou.</p>
            </div>
          </div>

          <div className="kt-followup-timeline">
            <article><span>01</span><strong>PRIMEIRO RETORNO</strong><p>Retome o que foi conversado e pergunte se conseguiu avaliar.</p></article>
            <article><span>02</span><strong>SEGUNDO RETORNO</strong><p>Acrescente uma informação útil ou esclareça um ponto da proposta.</p></article>
            <article><span>03</span><strong>ÚLTIMA TENTATIVA</strong><p>Deixe a porta aberta sem pressionar. Nem todo lead precisa ser perseguido indefinidamente.</p></article>
          </div>

          <div className="kt-message-example kt-message-example-light">
            <div>
              <span>FRACO</span>
              <p>“E aí, vai fechar? Me responde quando puder.”</p>
            </div>
            <div>
              <span>CONSULTIVO</span>
              <p>“Fala! Passando para saber se vocês conseguiram avaliar o que conversamos. Se ficou alguma dúvida sobre a solução, posso te ajudar a organizar esse ponto.”</p>
            </div>
          </div>

          <div className="kt-training-panel-grid">
            <article className="kt-training-panel">
              <span>REGRA</span>
              <h3>Silêncio também é informação.</h3>
              <p>Se a pessoa não responde depois de tentativas razoáveis, registre o estágio e siga sua prospecção. O consultor não pode deixar uma única oportunidade consumir toda a agenda.</p>
            </article>
            <article className="kt-training-panel">
              <span>EXERCÍCIO</span>
              <h3>Escreva três follow-ups diferentes.</h3>
              <p>Um para quem recebeu uma proposta, um para quem demonstrou interesse mas sumiu e outro para quem disse que não era o momento.</p>
            </article>
          </div>

          <LessonComplete completed={completed.includes('modulo-10')} onComplete={() => toggleComplete('modulo-10')} />
        </div>
      </section>

      {/* =====================================================
          MODULE 11
      ===================================================== */}

      <section id="modulo-11" className="kt-module kt-dark">
        <div className="kt-container">
          <ModuleHeader
            number="11"
            title="Fechamento"
            subtitle="Fechar não é pressionar. É conduzir o cliente para uma decisão consciente."
          />

          <div className="kt-closing-grid">
            <div className="kt-closing-main">
              <span>SINAIS DE COMPRA</span>
              <h3>QUANDO O CLIENTE<br /><strong>COMEÇA A DECIDIR.</strong></h3>
            </div>
            <div className="kt-copy">
              <p>Algumas perguntas mostram que o cliente já está tentando entender como a contratação funcionaria.</p>
              <div className="kt-signal-list">
                <span>“Quando vocês conseguem começar?”</span>
                <span>“Como funciona o pagamento?”</span>
                <span>“O que vocês precisam da gente?”</span>
                <span>“Qual seria o próximo passo?”</span>
              </div>
            </div>
          </div>

          <div className="kt-closing-steps">
            <article><span>01</span><strong>CONFIRME</strong><p>Confirme se a solução atende o que foi diagnosticado.</p></article>
            <article><span>02</span><strong>RESUMA</strong><p>Recapitule o que será feito e as condições validadas.</p></article>
            <article><span>03</span><strong>ORIENTE</strong><p>Explique claramente qual é o próximo passo.</p></article>
            <article><span>04</span><strong>REGISTRE</strong><p>Não deixe acordos importantes apenas na memória.</p></article>
          </div>

          <div className="kt-training-panel-grid">
            <article className="kt-training-panel">
              <span>FRASE DE FECHAMENTO</span>
              <h3>Se a solução estiver clara, avance.</h3>
              <p>“Pelo que conversamos, essa é a solução que mais faz sentido para o momento do atleta. Se estiver tudo certo para vocês, posso te explicar o próximo passo para iniciarmos.”</p>
            </article>
            <article className="kt-training-panel">
              <span>NÃO CONFUNDA</span>
              <h3>Interesse não é fechamento.</h3>
              <p>“Gostei” ou “vou ver” ainda não significa contratação. O consultor deve descobrir o que falta para a decisão e não comemorar antes da confirmação.</p>
            </article>
          </div>

          <LessonComplete completed={completed.includes('modulo-11')} onComplete={() => toggleComplete('modulo-11')} />
        </div>
      </section>

      {/* =====================================================
          MODULE 12
      ===================================================== */}

      <section id="modulo-12" className="kt-module kt-light">
        <div className="kt-container">
          <ModuleHeader
            number="12"
            title="Pós-venda"
            subtitle="O cliente que você conquistou pode se tornar uma relação comercial de longo prazo."
          />

          <div className="kt-retention-hero">
            <span>FLUXO</span>
            <div><strong>VENDA</strong><b>→</b><strong>ENTREGA</strong><b>→</b><strong>RELACIONAMENTO</strong><b>→</b><strong>RENOVAÇÃO</strong><b>→</b><strong>INDICAÇÃO</strong></div>
          </div>

          <div className="kt-retention-grid">
            <article><span>01</span><h3>ACOMPANHE</h3><p>Saiba se o cliente está recebendo o que esperava e se existe algum ponto que precisa ser levado para a equipe.</p></article>
            <article><span>02</span><h3>OBSERVE</h3><p>Novas necessidades aparecem depois que o cliente começa a utilizar o serviço.</p></article>
            <article><span>03</span><h3>PERGUNTE</h3><p>Não presuma satisfação. Pergunte como está sendo a experiência.</p></article>
            <article><span>04</span><h3>INDICAÇÃO</h3><p>Quando existe confiança, uma boa relação pode abrir portas para outros atletas e parceiros.</p></article>
          </div>

          <div className="kt-training-panel-grid">
            <article className="kt-training-panel">
              <span>PERGUNTA DE RELACIONAMENTO</span>
              <h3>“Como está sendo a experiência até aqui?”</h3>
              <p>É simples, mas abre espaço para o cliente falar. Se houver um problema, você pode levar para quem resolve. Se estiver tudo bem, você fortalece a relação.</p>
            </article>
            <article className="kt-training-panel">
              <span>MENTALIDADE</span>
              <h3>Seu cliente não é só sua comissão.</h3>
              <p>Uma carteira saudável depende de confiança. Trate o cliente como parceiro comercial e proteja a experiência dele.</p>
            </article>
          </div>

          <LessonComplete completed={completed.includes('modulo-12')} onComplete={() => toggleComplete('modulo-12')} />
        </div>
      </section>

      {/* =====================================================
          MODULE 13
      ===================================================== */}

      <section id="modulo-13" className="kt-module kt-dark">
        <div className="kt-container">
          <ModuleHeader
            number="13"
            title="Rotina do consultor"
            subtitle="Resultado comercial vem de consistência. Crie uma rotina que você consegue repetir."
          />

          <div className="kt-routine-grid">
            <article><span>MANHÃ</span><strong>MAPEAR</strong><p>Separe um bloco para encontrar e qualificar novas oportunidades.</p></article>
            <article><span>MEIO DO DIA</span><strong>ABORDAR</strong><p>Envie abordagens personalizadas e registre cada contato.</p></article>
            <article><span>TARDE</span><strong>CONDUZIR</strong><p>Responda conversas, faça diagnósticos e acompanhe propostas.</p></article>
            <article><span>FINAL</span><strong>ORGANIZAR</strong><p>Atualize o estágio de cada lead e defina os próximos passos.</p></article>
          </div>

          <div className="kt-routine-score">
            <span>PLACAR PESSOAL</span>
            <div>
              <strong>LEADS ENCONTRADOS</strong>
              <strong>ABORDAGENS</strong>
              <strong>CONVERSAS</strong>
              <strong>DIAGNÓSTICOS</strong>
              <strong>PROPOSTAS</strong>
              <strong>CLIENTES</strong>
            </div>
            <p>Não use apenas “vendas” como métrica. O consultor precisa acompanhar o caminho inteiro até o fechamento.</p>
          </div>

          <div className="kt-training-panel-grid">
            <article className="kt-training-panel">
              <span>DISCIPLINA</span>
              <h3>Não dependa de motivação.</h3>
              <p>Defina blocos de prospecção e siga o processo mesmo quando nenhuma conversa fechar naquele dia. A carteira é construída ao longo do tempo.</p>
            </article>
            <article className="kt-training-panel">
              <span>EXERCÍCIO</span>
              <h3>Monte sua meta semanal.</h3>
              <p>Escolha uma quantidade realista de leads qualificados, abordagens, conversas e diagnósticos que você consegue executar sem sacrificar a qualidade.</p>
            </article>
          </div>

          <LessonComplete completed={completed.includes('modulo-13')} onComplete={() => toggleComplete('modulo-13')} />
        </div>
      </section>

      {/* =====================================================
          MODULE 14
      ===================================================== */}

      <section id="modulo-14" className="kt-module kt-light">
        <div className="kt-container">
          <ModuleHeader
            number="14"
            title="Casos práticos"
            subtitle="Agora pare de decorar. Comece a raciocinar como consultor."
          />

          <div className="kt-case-grid">
            <article>
              <span>CASO 01 / BASE</span>
              <h3>Atleta de 15 anos, perfil desorganizado e pai acompanha tudo.</h3>
              <p><strong>Seu desafio:</strong> qual seria sua primeira pergunta? Quem precisa participar da conversa? Qual problema você investigaria antes de oferecer qualquer serviço?</p>
              <div><b>RESPOSTA ESPERADA</b><small>Contexto do atleta → percepção da família → organização atual → objetivo → solução adequada.</small></div>
            </article>
            <article>
              <span>CASO 02 / PROFISSIONAL</span>
              <h3>Atleta já tem designer, fotógrafo e bastante conteúdo.</h3>
              <p><strong>Seu desafio:</strong> não tente competir pelo mesmo serviço. Descubra o que existe além da produção visual.</p>
              <div><b>RESPOSTA ESPERADA</b><small>Investigar estratégia, posicionamento, consistência, gestão e objetivos de comunicação.</small></div>
            </article>
            <article>
              <span>CASO 03 / PREÇO</span>
              <h3>Cliente quer contratar, mas diz que encontrou algo mais barato.</h3>
              <p><strong>Seu desafio:</strong> não ataque o concorrente. Entenda se a comparação é por escopo, preço, prazo ou percepção de valor.</p>
              <div><b>RESPOSTA ESPERADA</b><small>Comparar necessidades e escopo antes de discutir preço.</small></div>
            </article>
            <article>
              <span>CASO 04 / PROMESSA</span>
              <h3>Pai pergunta se a Kreative consegue colocar o filho em um clube.</h3>
              <p><strong>Seu desafio:</strong> seja claro sobre o que a Kreative faz e não prometa oportunidade que não pode garantir.</p>
              <div><b>RESPOSTA ESPERADA</b><small>Explicar o papel de imagem e posicionamento sem vender uma promessa de carreira.</small></div>
            </article>
          </div>

          <div className="kt-training-panel-grid">
            <article className="kt-training-panel">
              <span>MÉTODO DE RESOLUÇÃO</span>
              <h3>Problema → Pergunta → Evidência → Solução → Próximo passo.</h3>
              <p>Use essa sequência em qualquer cenário. Ela evita que você responda por impulso e ajuda a manter a conversa comercial organizada.</p>
            </article>
            <article className="kt-training-panel">
              <span>EXERCÍCIO</span>
              <h3>Escolha um caso e grave sua resposta.</h3>
              <p>Fale em voz alta como se estivesse no WhatsApp ou em uma chamada. Depois escute e veja se você falou mais do que o necessário.</p>
            </article>
          </div>

          <LessonComplete completed={completed.includes('modulo-14')} onComplete={() => toggleComplete('modulo-14')} />
        </div>
      </section>

      {/* =====================================================
          MODULE 15
      ===================================================== */}

      <section id="modulo-15" className="kt-module kt-dark">
        <div className="kt-container">
          <ModuleHeader
            number="15"
            title="Desafio do consultor"
            subtitle="Antes da avaliação, prove que consegue montar uma operação comercial do zero."
          />

          <div className="kt-challenge">
            <div className="kt-challenge-head">
              <span>LEAD FICTÍCIO</span>
              <h3>João, 16 anos · meia · categoria de base</h3>
              <p>Instagram com 1.800 seguidores. Fotos boas, feed irregular, bio genérica, Matchday improvisado. O pai acompanha a carreira. Já possui fotógrafo, mas ninguém cuida da estratégia de comunicação.</p>
            </div>
            <div className="kt-challenge-grid">
              <article><span>01</span><strong>DIAGNÓSTICO</strong><p>Qual é o principal problema que você percebe?</p></article>
              <article><span>02</span><strong>PERGUNTA</strong><p>Qual pergunta você faria primeiro para o responsável?</p></article>
              <article><span>03</span><strong>SOLUÇÃO</strong><p>Qual solução da Kreative você investigaria?</p></article>
              <article><span>04</span><strong>ABORDAGEM</strong><p>Como iniciaria a conversa sem parecer um spam?</p></article>
              <article><span>05</span><strong>OBJEÇÃO</strong><p>Qual resistência pode aparecer e como você conduziria?</p></article>
              <article><span>06</span><strong>FOLLOW-UP</strong><p>Como retomaria a conversa caso o cliente sumisse?</p></article>
            </div>
          </div>

          <div className="kt-final-checklist">
            <span>VOCÊ ESTÁ PRONTO QUANDO CONSEGUIR:</span>
            <div>
              <strong>EXPLICAR A KREATIVE</strong>
              <strong>IDENTIFICAR UMA DOR</strong>
              <strong>FAZER BOAS PERGUNTAS</strong>
              <strong>APRESENTAR UMA SOLUÇÃO</strong>
              <strong>CONDUZIR OBJEÇÕES</strong>
              <strong>FAZER FOLLOW-UP</strong>
              <strong>RESPEITAR O CÓDIGO</strong>
            </div>
          </div>

          <LessonComplete completed={completed.includes('modulo-15')} onComplete={() => toggleComplete('modulo-15')} />
        </div>
      </section>

      {/* =====================================================
          AVALIAÇÃO
      ===================================================== */}

      <section id="avaliacao" className="kt-module kt-exam">

        <div className="kt-container">

          <div className="kt-exam-header">

            <span>ETAPA FINAL</span>

            <h2>
              VOCÊ
              <br />
              ESTÁ PRONTO?
            </h2>

            <p>
              Responda às perguntas abaixo. A aprovação acontece
              com pelo menos 70% de acerto. Estude os módulos antes de tentar.
            </p>

          </div>

          {!quizFinished && (
            <div className="kt-quiz">

              {QUIZ.map((question, questionIndex) => (
                <article
                  key={question.question}
                  className="kt-question"
                >

                  <div className="kt-question-number">
                    {String(questionIndex + 1).padStart(2, '0')}
                  </div>

                  <div className="kt-question-content">

                    <h3>{question.question}</h3>

                    <div className="kt-options">

                      {question.options.map(
                        (option, optionIndex) => (
                          <button
                            key={option}
                            type="button"
                            className={
                              answers[questionIndex] ===
                              optionIndex
                                ? 'selected'
                                : ''
                            }
                            onClick={() =>
                              handleAnswer(
                                questionIndex,
                                optionIndex
                              )
                            }
                          >
                            <span>
                              {String.fromCharCode(
                                65 + optionIndex
                              )}
                            </span>

                            {option}
                          </button>
                        )
                      )}

                    </div>

                  </div>

                </article>
              ))}

              <div className="kt-quiz-submit">

                <span>
                  {Object.keys(answers).length}/{QUIZ.length}{' '}
                  RESPONDIDAS
                </span>

                <button
                  type="button"
                  className="kt-primary-button"
                  disabled={!allQuizAnswered}
                  onClick={finishQuiz}
                >
                  FINALIZAR AVALIAÇÃO
                  <span>→</span>
                </button>

              </div>

            </div>
          )}

          {quizFinished && (
            <div
              className={`kt-result ${
                finalPassed ? 'passed' : 'failed'
              }`}
            >

              <span>
                {finalPassed ? 'APROVADO' : 'REPROVADO'}
              </span>

              <strong>{quizScore}%</strong>

              <h3>
                {finalPassed
                  ? 'Você está pronto para representar a Kreative.'
                  : 'Ainda falta um pouco. Revise os módulos e tente novamente.'}
              </h3>

              <p>
                {finalPassed
                  ? 'A avaliação foi concluída com aproveitamento mínimo. Agora o próximo passo é colocar o conhecimento em prática.'
                  : 'Você precisa atingir pelo menos 70% de aproveitamento para concluir a formação. Revise os módulos, refaça os exercícios e tente novamente.'}
              </p>

              <div className="kt-result-actions">

                {!finalPassed && (
                  <button
                    type="button"
                    className="kt-secondary-button"
                    onClick={resetQuiz}
                  >
                    REFAZER AVALIAÇÃO
                  </button>
                )}

                {finalPassed && (
                  <button
                    type="button"
                    className="kt-primary-button"
                    onClick={() => scrollToSection('inicio')}
                  >
                    VOLTAR AO INÍCIO
                    <span>↑</span>
                  </button>
                )}

              </div>

            </div>
          )}

        </div>

      </section>

      {/* =====================================================
          FINAL
      ===================================================== */}

      <footer className="kt-footer">

        <div className="kt-container">

          <span className="kt-eyebrow">
            KREATIVE SPORTS
          </span>

          <h2>
            IMAGEM.
            <br />
            POSICIONAMENTO.
            <br />
            <strong>NEGÓCIO.</strong>
          </h2>

          <p>
            Formação interna do Consultor Comercial Kreative Sports.
          </p>

          <div className="kt-footer-line">
            <span>
              PROGRESSO: {completedCount}/{MODULES.length}
            </span>

            <span>
              {finalPassed
                ? 'FORMAÇÃO APROVADA'
                : 'FORMAÇÃO EM ANDAMENTO'}
            </span>
          </div>

          <small>
            © 2026 KREATIVE SPORTS · INTERNAL TRAINING
          </small>

        </div>

      </footer>

    </div>
  );
}

export default TreinamentoKreative;