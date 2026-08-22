import React, { useEffect, useState } from 'react';

import {
  getProposals,
  createProposal,
  archiveProposal
} from '../data/proposals';

import '../styles/proposal-admin.css';

const initialForm = {
  company: '',
  owner: '',
  email: '',
  createdAt: '',
  validUntil: '',

  diagnosisPdf: '',
  analysisVideo: '',

  diagnosis: '',
  recommendation: '',
  recommendedPrice: '',

  bonus: '',
  landingPage: '',

  package1Name: '',
  package1Description: '',
  package1Price: '',

  package2Name: '',
  package2Description: '',
  package2Price: '',

  package3Name: '',
  package3Description: '',
  package3Price: '',

  payment: '',
  notes: ''
};

function ProposalAdmin() {
  const [proposals, setProposals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [createdLink, setCreatedLink] = useState('');

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    setProposals(getProposals());
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.company.trim()) {
      alert('Digite o nome da empresa.');
      return;
    }

    const proposal = createProposal({
      company: form.company,
      owner: form.owner,
      email: form.email,

      createdAt: form.createdAt,
      validUntil: form.validUntil,

      diagnosisPdf: form.diagnosisPdf,
      analysisVideo: form.analysisVideo,

      diagnosis: form.diagnosis,
      recommendation: form.recommendation,
      recommendedPrice: form.recommendedPrice,

      bonus: form.bonus,
      landingPage: form.landingPage,

      packages: [
        {
          name: form.package1Name,
          description: form.package1Description,
          price: form.package1Price
        },
        {
          name: form.package2Name,
          description: form.package2Description,
          price: form.package2Price
        },
        {
          name: form.package3Name,
          description: form.package3Description,
          price: form.package3Price
        }
      ],

      payment: form.payment,
      notes: form.notes
    });

    const updated = getProposals();

    setProposals(updated);

    const link =
      `${window.location.origin}/proposta/${proposal.id}`;

    setCreatedLink(link);

    setShowForm(false);

    setForm(initialForm);
  }

  function handleArchive(id) {
    archiveProposal(id);

    setProposals(getProposals());
  }

  function copyLink(link) {
    navigator.clipboard.writeText(link);

    alert('Link copiado.');
  }

  return (
    <main className="proposal-admin">

      {/* ==================================================
          HEADER
      ================================================== */}

      <header className="proposal-admin__header">

        <div>

          <span className="proposal-admin__eyebrow">
            LEO SOUZA DSGN
          </span>

          <h1>
            PROPOSAL
            <br />
            <span>SYSTEM.</span>
          </h1>

        </div>

        <button
          className="proposal-admin__new"
          onClick={() => {
            setCreatedLink('');
            setShowForm(true);
          }}
        >
          + NOVA PROPOSTA
        </button>

      </header>


      {/* ==================================================
          PROPOSTA CRIADA
      ================================================== */}

      {createdLink && (

        <section className="proposal-admin__success">

          <span>
            PROPOSTA CRIADA
          </span>

          <strong>
            {createdLink}
          </strong>

          <div>

            <button
              onClick={() => copyLink(createdLink)}
            >
              COPIAR LINK
            </button>

            <a
              href={createdLink}
              target="_blank"
              rel="noreferrer"
            >
              ABRIR PROPOSTA ↗
            </a>

          </div>

        </section>

      )}


      {/* ==================================================
          LISTA DE PROPOSTAS
      ================================================== */}

      {!showForm && (

        <section className="proposal-admin__list">

          <div className="proposal-admin__list-head">

            <span>
              PROPOSTAS
            </span>

            <span>
              {proposals.length} REGISTROS
            </span>

          </div>


          {proposals.map(proposal => (

            <article
              className={`proposal-admin__item ${
                proposal.status === 'active'
                  ? 'is-active'
                  : ''
              }`}
              key={proposal.id}
            >

              <div className="proposal-admin__number">
                /{proposal.number}
              </div>


              <div className="proposal-admin__client">

                <strong>
                  {proposal.company}
                </strong>

                <span>
                  {proposal.owner ||
                    'PROPRIETÁRIO NÃO INFORMADO'}
                </span>

              </div>


              <div className="proposal-admin__date">
                {proposal.createdAt || '—'}
              </div>


              <div className="proposal-admin__status">

                <span>
                  {proposal.status === 'active'
                    ? 'ATIVA'
                    : 'ARQUIVADA'}
                </span>

              </div>


              <div className="proposal-admin__actions">

                <a
                  href={`/proposta/${proposal.id}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  ABRIR ↗
                </a>


                {proposal.status === 'active' && (

                  <button
                    onClick={() =>
                      handleArchive(proposal.id)
                    }
                  >
                    ARQUIVAR
                  </button>

                )}

              </div>

            </article>

          ))}

        </section>

      )}


      {/* ==================================================
          NOVA PROPOSTA
      ================================================== */}

      {showForm && (

        <section className="proposal-form">


          {/* ==================================================
              TOPO
          ================================================== */}

          <div className="proposal-form__top">

            <div>

              <span>
                NOVA PROPOSTA
              </span>

              <h2>
                CRIAR
                <br />
                <strong>PROPOSTA.</strong>
              </h2>

            </div>


            <button
              onClick={() => setShowForm(false)}
              className="proposal-form__close"
              type="button"
            >
              FECHAR ×
            </button>

          </div>


          <form onSubmit={handleSubmit}>


            {/* ==================================================
                01 — CLIENTE
            ================================================== */}

            <div className="proposal-form__section">

              <span className="proposal-form__section-number">
                01
              </span>

              <div>

                <h3>
                  CLIENTE
                </h3>


                <div className="proposal-form__grid">


                  <label>

                    EMPRESA

                    <input
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      placeholder="Ex.: Espetaria Marechal"
                    />

                  </label>


                  <label>

                    PROPRIETÁRIO

                    <input
                      name="owner"
                      value={form.owner}
                      onChange={handleChange}
                      placeholder="Nome do responsável"
                    />

                  </label>


                  <label>

                    E-MAIL

                    <input
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="cliente@email.com"
                    />

                  </label>


                  <label>

                    DATA

                    <input
                      name="createdAt"
                      value={form.createdAt}
                      onChange={handleChange}
                      placeholder="22 AGO 2026"
                    />

                  </label>


                  <label>

                    VALIDADE

                    <input
                      name="validUntil"
                      value={form.validUntil}
                      onChange={handleChange}
                      placeholder="29 AGO 2026"
                    />

                  </label>


                </div>

              </div>

            </div>


            {/* ==================================================
                02 — DIAGNÓSTICO
            ================================================== */}

            <div className="proposal-form__section">

              <span className="proposal-form__section-number">
                02
              </span>

              <div>

                <h3>
                  DIAGNÓSTICO
                </h3>


                <div className="proposal-form__grid">


                  <label className="proposal-form__full">

                    DIAGNÓSTICO COMPLETO

                    <textarea
                      name="diagnosis"
                      value={form.diagnosis}
                      onChange={handleChange}
                      placeholder={`Cole aqui todo o diagnóstico da empresa.

Exemplo:

01 — OBJETIVO DESTA ANÁLISE

A Espetaria Marechal demonstrou interesse em fortalecer sua presença nas redes sociais...

02 — CENÁRIO ATUAL

46 semanas
13 publicações
1.116 seguidores

03 — PRIMEIRA LEITURA

...

Cole aqui todo o conteúdo da análise.`}
                      rows="18"
                    />

                  </label>


                  <label>

                    LINK DO PDF DO DIAGNÓSTICO

                    <input
                      name="diagnosisPdf"
                      value={form.diagnosisPdf}
                      onChange={handleChange}
                      placeholder="https://..."
                    />

                  </label>


                  <label>

                    LINK DO VÍDEO DE ANÁLISE

                    <input
                      name="analysisVideo"
                      value={form.analysisVideo}
                      onChange={handleChange}
                      placeholder="https://..."
                    />

                  </label>


                </div>

              </div>

            </div>


            {/* ==================================================
                03 — RECOMENDAÇÃO
            ================================================== */}

            <div className="proposal-form__section">

              <span className="proposal-form__section-number">
                03
              </span>

              <div>

                <h3>
                  RECOMENDAÇÃO
                </h3>


                <div className="proposal-form__grid">


                  <label>

                    PLANO RECOMENDADO

                    <input
                      name="recommendation"
                      value={form.recommendation}
                      onChange={handleChange}
                      placeholder="Ex.: MARECHAL"
                    />

                  </label>


                  <label>

                    VALOR RECOMENDADO

                    <input
                      name="recommendedPrice"
                      value={form.recommendedPrice}
                      onChange={handleChange}
                      placeholder="R$ 1.397 / MÊS"
                    />

                  </label>


                  <label className="proposal-form__full">

                    JUSTIFICATIVA DA RECOMENDAÇÃO

                    <textarea
                      name="notes"
                      value={form.notes}
                      onChange={handleChange}
                      placeholder={`Explique por que esse plano é o mais indicado.

Exemplo:

Considerando o cenário atual do Instagram, a necessidade de maior consistência, o potencial visual da empresa e o objetivo de fortalecer sua presença digital, recomendamos o Plano Marechal.`}
                      rows="8"
                    />

                  </label>


                </div>

              </div>

            </div>


            {/* ==================================================
                04 — BÔNUS E LANDING PAGE
            ================================================== */}

            <div className="proposal-form__section">

              <span className="proposal-form__section-number">
                04
              </span>

              <div>

                <h3>
                  BÔNUS / EXTRAS
                </h3>


                <div className="proposal-form__grid">


                  <label className="proposal-form__full">

                    ORGANIZAÇÃO INICIAL — CORTESIA

                    <textarea
                      name="bonus"
                      value={form.bonus}
                      onChange={handleChange}
                      placeholder={`Ex.:

ORGANIZAÇÃO DA CASA DIGITAL

Valor de referência: R$497

Cortesia na contratação de qualquer plano.

Inclui:
- revisão da bio;
- organização dos destaques;
- capas dos destaques;
- organização da apresentação;
- direcionamento visual inicial;
- Link da Bio personalizado;
- direcionamento inicial da comunicação.`}
                      rows="8"
                    />

                  </label>


                  <label className="proposal-form__full">

                    LANDING PAGE — OPCIONAL

                    <textarea
                      name="landingPage"
                      value={form.landingPage}
                      onChange={handleChange}
                      placeholder={`Ex.:

Landing Page personalizada.

Projeto opcional e contratado separadamente.

Valor e prazo definidos conforme necessidade da empresa.`}
                      rows="6"
                    />

                  </label>


                </div>

              </div>

            </div>


            {/* ==================================================
                05 — PACOTES
            ================================================== */}

            {[1, 2, 3].map(number => (

              <div
                className="proposal-form__section"
                key={number}
              >

                <span className="proposal-form__section-number">
                  0{number + 4}
                </span>


                <div>

                  <h3>
                    PLANO {number}
                  </h3>


                  <div className="proposal-form__grid">


                    <label>

                      NOME

                      <input
                        name={`package${number}Name`}
                        value={
                          form[
                            `package${number}Name`
                          ]
                        }
                        onChange={handleChange}
                        placeholder={
                          number === 1
                            ? 'PRESENÇA'
                            : number === 2
                            ? 'MARECHAL'
                            : 'MARECHAL PRIME'
                        }
                      />

                    </label>


                    <label>

                      VALOR

                      <input
                        name={`package${number}Price`}
                        value={
                          form[
                            `package${number}Price`
                          ]
                        }
                        onChange={handleChange}
                        placeholder={
                          number === 1
                            ? 'R$ 997 / MÊS'
                            : number === 2
                            ? 'R$ 1.397 / MÊS'
                            : 'R$ 1.997 / MÊS'
                        }
                      />

                    </label>


                    <label className="proposal-form__full">

                      DESCRIÇÃO

                      <textarea
                        name={`package${number}Description`}
                        value={
                          form[
                            `package${number}Description`
                          ]
                        }
                        onChange={handleChange}
                        placeholder={`Descreva tudo que está incluso no Plano ${number}...`}
                        rows="12"
                      />

                    </label>


                  </div>

                </div>

              </div>

            ))}


            {/* ==================================================
                08 — CONDIÇÕES
            ================================================== */}

            <div className="proposal-form__section">

              <span className="proposal-form__section-number">
                08
              </span>

              <div>

                <h3>
                  CONDIÇÕES
                </h3>


                <div className="proposal-form__grid">


                  <label className="proposal-form__full">

                    PAGAMENTO

                    <textarea
                      name="payment"
                      value={form.payment}
                      onChange={handleChange}
                      placeholder={`Ex.:

A contratação é confirmada após a aprovação da proposta.

O pagamento da mensalidade poderá ser realizado à vista ou parcelado no cartão, conforme condições acordadas.

O início do trabalho ocorre após a confirmação da contratação/pagamento.`}
                      rows="7"
                    />

                  </label>


                </div>

              </div>

            </div>


            {/* ==================================================
                CRIAR
            ================================================== */}

            <button
              type="submit"
              className="proposal-form__submit"
            >
              CRIAR PROPOSTA
              <span>↗</span>
            </button>


          </form>

        </section>

      )}

    </main>
  );
}

export default ProposalAdmin;