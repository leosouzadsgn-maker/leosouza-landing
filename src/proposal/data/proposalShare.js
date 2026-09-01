import { getProposalById } from './proposals';

function bytesToBase64(bytes) {
  let binary = '';
  const chunkSize = 0x8000;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }

  return btoa(binary);
}

function base64ToBytes(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
}

export function encodeProposal(proposal) {
  const json = JSON.stringify(proposal);
  const bytes = new TextEncoder().encode(json);

  return bytesToBase64(bytes)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

export function decodeProposal(value) {
  try {
    if (!value) return null;

    const normalized = value
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
    const bytes = base64ToBytes(padded);
    const json = new TextDecoder().decode(bytes);

    return JSON.parse(json);
  } catch (error) {
    console.error('Não foi possível ler a proposta compartilhada:', error);
    return null;
  }
}

export function getProposalFromHash() {
  if (typeof window === 'undefined') return null;

  const hash = window.location.hash.replace(/^#/, '');
  if (!hash) return null;

  const params = new URLSearchParams(hash);
  return decodeProposal(params.get('data'));
}

export function buildProposalLink(proposal) {
  if (typeof window === 'undefined') return '';

  return `${window.location.origin}/proposta/${proposal.id}#data=${encodeProposal(proposal)}`;
}

export function getProposalHashSuffix() {
  if (typeof window === 'undefined') return '';

  return window.location.hash || '';
}

export function getProposalByCurrentRoute() {
  if (typeof window === 'undefined') return null;

  const parts = window.location.pathname
    .split('/')
    .filter(Boolean);

  const id = parts[1];
  if (!id) return null;

  return getProposalFromHash() || getProposalById(id) || null;
}

export function getProposalSlug() {
  if (typeof window === 'undefined') return 'empresa-teste';

  const parts = window.location.pathname
    .split('/')
    .filter(Boolean);

  return parts[1] || 'empresa-teste';
}

export function goToProposalSection(section) {
  const slug = getProposalSlug();
  const hash = getProposalHashSuffix();

  window.location.href = `/proposta/${slug}/${section}${hash}`;
}
