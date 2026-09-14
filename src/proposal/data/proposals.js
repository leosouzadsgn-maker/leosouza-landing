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



const pedroProposal = {
  id: 'pedro-wiese',
  number: '003',
  company: 'PEDRO WIESE',
  owner: 'Pedro Wiese',
  email: '',
  createdAt: '01 SET 2026',
  validUntil: '08 SET 2026',
  diagnosisPdf: '',
  analysisVideo: '',
  diagnosis: '',
  recommendation: '',
  recommendedPrice: '',
  bonus: '',
  landingPage: '',
  packages: [
    {
      name: 'GESTÃO DO INSTAGRAM',
      description: 'R$ 800,00 / mês\nPlanejamento de conteúdo\nOrganização do calendário de publicações\nCriação das artes para o perfil\nCriação de legendas\nPublicação dos conteúdos\nOrganização visual do feed\nConteúdo institucional da empresa\nConteúdos relacionados ao futebol e ao mercado esportivo\nDesenvolvimento da presença digital da empresa\nAcompanhamento básico dos resultados do perfil',
      price: 'R$ 800,00 / MÊS'
    },
    {
      name: 'COMUNICAÇÃO DOS ATLETAS',
      description: 'R$ 100,00 por atleta / mês\nAcompanhamento do calendário de jogos\nIdentificação de datas e horários das partidas\nCriação das artes Matchday\nPublicação dos Matchdays\nAdequação das artes à identidade visual da empresa\nComunicação de resultados e momentos relevantes, quando necessário\nNão haverá cobrança individual por cada arte Matchday.',
      price: 'R$ 100,00 / ATLETA / MÊS'
    },
    {
      name: 'INVESTIMENTO MENSAL',
      description: 'R$ 1.800,00 considerando 10 atletas\nR$ 800,00 + R$ 100,00 × quantidade de atletas',
      price: 'R$ 1.800,00 / MÊS'
    }
  ],
  payment: 'Mensal, com vencimento a definir entre as partes.',
  notes: 'A quantidade de atletas poderá ser alterada ao longo da parceria, sendo o valor mensal ajustado conforme a quantidade contratada.',
  status: 'active'
};

const SEED_PROPOSALS = [defaultProposal, pedroProposal];
export function getProposals() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_PROPOSALS));
      return SEED_PROPOSALS;
    }

    const parsed = JSON.parse(saved);
    const list = Array.isArray(parsed) ? parsed : [];

    const ids = new Set(list.map(item => item.id));
    const missingSeeds = SEED_PROPOSALS.filter(item => !ids.has(item.id));

    if (missingSeeds.length) {
      const merged = [...list, ...missingSeeds];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      return merged;
    }

    return list;
  } catch (error) {
    console.error('Erro ao carregar propostas:', error);
    return SEED_PROPOSALS;
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

  const baseId = data.company
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  let id = baseId || `proposta-${Date.now()}`;
  let suffix = 2;

  while (proposals.some(item => item.id === id)) {
    id = `${baseId}-${suffix}`;
    suffix += 1;
  }

  const proposal = {
    ...data,
    id,
    number: nextNumber,
    status: 'active'
  };

  const updated = [
    ...proposals,
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