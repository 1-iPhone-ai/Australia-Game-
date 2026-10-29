import type {
  Agent17AttestationAccordSnapshot,
  Agent17CredentialAccordSnapshot,
  Agent17LedgerIndexSnapshot,
  Agent17RegistryIndexSnapshot,
} from '../types/command-center-types.ts';
import { attestationAccordBlocksRegistry } from './attestation-accord.ts';
import { credentialAccordBlocksLedger } from './credential-accord.ts';
import { registryIndexBlocksCredential } from './registry-index.ts';

export interface Agent17LedgerIndexInputs {
  credentialAccord: Agent17CredentialAccordSnapshot;
  registryIndex: Agent17RegistryIndexSnapshot;
  attestationAccord: Agent17AttestationAccordSnapshot;
}

export function buildAgent17LedgerIndex(
  inputs: Agent17LedgerIndexInputs
): Agent17LedgerIndexSnapshot {
  const postings: Agent17LedgerIndexSnapshot['postings'] = [];

  postings.push({
    id: 'credential_issued',
    label: 'Credential accord issued',
    posted:
      inputs.credentialAccord.credentialIssued &&
      !credentialAccordBlocksLedger(inputs.credentialAccord),
    weight: 30,
  });

  postings.push({
    id: 'credential_band',
    label: 'Credential issued or pending',
    posted:
      inputs.credentialAccord.band === 'issued' ||
      inputs.credentialAccord.band === 'pending',
    weight: 25,
  });

  postings.push({
    id: 'registry_canonical',
    label: 'Registry index registry-canonical',
    posted:
      inputs.registryIndex.registryCanonical &&
      !registryIndexBlocksCredential(inputs.registryIndex),
    weight: 20,
  });

  postings.push({
    id: 'attestation_clear',
    label: 'Attestation accord not blocking registry',
    posted: !attestationAccordBlocksRegistry(inputs.attestationAccord),
    weight: 15,
  });

  postings.push({
    id: 'credential_score',
    label: 'Credential score headroom',
    posted: inputs.credentialAccord.credentialScore >= 28,
    weight: 10,
  });

  const weighted = postings.reduce(
    (n, p) => n + (p.posted ? 100 : 6) * (p.weight / 100),
    0
  );
  const totalWeight = postings.reduce((n, p) => n + p.weight, 0);
  const ledgerScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const closedSignals =
    credentialAccordBlocksLedger(inputs.credentialAccord) ||
    registryIndexBlocksCredential(inputs.registryIndex) ||
    attestationAccordBlocksRegistry(inputs.attestationAccord);

  const band: Agent17LedgerIndexSnapshot['band'] = closedSignals
    ? 'closed'
    : ledgerScore >= 56 &&
        inputs.credentialAccord.band === 'issued' &&
        inputs.registryIndex.band === 'canonical'
      ? 'balanced'
      : 'open';

  const ledgerBalanced =
    band === 'balanced' &&
    inputs.credentialAccord.credentialIssued &&
    !credentialAccordBlocksLedger(inputs.credentialAccord);

  return {
    ledgerScore,
    band,
    postings,
    credentialBand: inputs.credentialAccord.band,
    registryBand: inputs.registryIndex.band,
    ledgerBalanced,
    headline: `Ledger ${band} (${ledgerScore}/100) · ${postings.filter(p => p.posted).length}/${postings.length} postings`,
  };
}

export function ledgerIndexBlocksEndorsement(snapshot: Agent17LedgerIndexSnapshot): boolean {
  return snapshot.band === 'closed' || !snapshot.ledgerBalanced;
}
