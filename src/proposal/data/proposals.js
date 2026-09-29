const STORAGE_KEY = 'leo_souza_proposals';

export function getProposals() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Erro ao carregar propostas:', error);
    return [];
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
