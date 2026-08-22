const STORAGE_KEY = 'leo_souza_proposals';

const defaultProposal = {
  id: 'empresa-teste',
  number: '002',

  company: 'EMPRESA TESTE',
  owner: 'João Silva',
  email: 'contato@leosouzadsgn.com',

  createdAt: '21 AGO 2026',
  validUntil: '28 AGO 2026',

  diagnosisPdf: '',
  analysisVideo: '',

  packages: [
    {
      name: 'ESSENCIAL',
      description: 'Uma estrutura objetiva para organizar a presença digital da marca.',
      price: 'R$ 1.000'
    },
    {
      name: 'ESTRATÉGICO',
      description: 'Uma solução completa para posicionamento, comunicação e presença.',
      price: 'R$ 1.500'
    },
    {
      name: 'PERFORMANCE',
      description: 'Uma estrutura completa para elevar a marca e acelerar sua presença.',
      price: 'R$ 2.000'
    }
  ],

  payment: 'À vista ou parcelado no cartão.',
  notes: 'O trabalho terá início após a confirmação do pagamento.',

  status: 'active'
};

export function getProposals() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([defaultProposal])
      );

      return [defaultProposal];
    }

    return JSON.parse(saved);
  } catch (error) {
    console.error('Erro ao carregar propostas:', error);
    return [defaultProposal];
  }
}

export function saveProposals(proposals) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(proposals)
  );
}

export function getProposalById(id) {
  const proposals = getProposals();

  return proposals.find(
    proposal => proposal.id === id
  );
}

export function createProposal(data) {
  const proposals = getProposals();

  const nextNumber =
    String(proposals.length + 1).padStart(3, '0');

  const id = data.company
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const proposal = {
    ...data,
    id,
    number: nextNumber,
    status: 'active'
  };

  const updated = [
    ...proposals.map(item => ({
      ...item,
      status: 'archived'
    })),
    proposal
  ];

  saveProposals(updated);

  return proposal;
}

export function archiveProposal(id) {
  const proposals = getProposals();

  const updated = proposals.map(proposal =>
    proposal.id === id
      ? {
          ...proposal,
          status: 'archived'
        }
      : proposal
  );

  saveProposals(updated);
}