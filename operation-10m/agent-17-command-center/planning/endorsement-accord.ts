import type {
  Agent17CredentialAccordSnapshot,
  Agent17EndorsementAccordSnapshot,
  Agent17LedgerIndexSnapshot,
  Agent17RegistryIndexSnapshot,
} from '../types/command-center-types.ts';
import { credentialAccordBlocksLedger } from './credential-accord.ts';
import { ledgerIndexBlocksEndorsement } from './ledger-index.ts';
import { registryIndexBlocksCredential } from './registry-index.ts';

export interface Agent17EndorsementAccordInputs {
  ledgerIndex: Agent17LedgerIndexSnapshot;
  credentialAccord: Agent17CredentialAccordSnapshot;
  registryIndex: Agent17RegistryIndexSnapshot;
}

export function buildAgent17EndorsementAccord(
  inputs: Agent17EndorsementAccordInputs
): Agent17EndorsementAccordSnapshot {
  const endorsements: Agent17EndorsementAccordSnapshot['endorsements'] = [];

  endorsements.push({
    id: 'ledger_balanced',
    label: 'Ledger index ledger-balanced',
    signed:
      inputs.ledgerIndex.ledgerBalanced &&
      !ledgerIndexBlocksEndorsement(inputs.ledgerIndex),
    weight: 30,
  });

  endorsements.push({
    id: 'ledger_band',
    label: 'Ledger balanced or open',
    signed:
      inputs.ledgerIndex.band === 'balanced' || inputs.ledgerIndex.band === 'open',
    weight: 25,
  });

  endorsements.push({
    id: 'credential_issued',
    label: 'Credential accord issued-ready',
    signed:
      inputs.credentialAccord.credentialIssued &&
      !credentialAccordBlocksLedger(inputs.credentialAccord),
    weight: 20,
  });

  endorsements.push({
    id: 'registry_clear',
    label: 'Registry index not blocking credential',
    signed: !registryIndexBlocksCredential(inputs.registryIndex),
    weight: 15,
  });

  endorsements.push({
    id: 'ledger_score',
    label: 'Ledger score headroom',
    signed: inputs.ledgerIndex.ledgerScore >= 27,
    weight: 10,
  });

  const weighted = endorsements.reduce(
    (n, e) => n + (e.signed ? 100 : 5) * (e.weight / 100),
    0
  );
  const totalWeight = endorsements.reduce((n, e) => n + e.weight, 0);
  const endorsementScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const withdrawnSignals =
    ledgerIndexBlocksEndorsement(inputs.ledgerIndex) ||
    credentialAccordBlocksLedger(inputs.credentialAccord) ||
    registryIndexBlocksCredential(inputs.registryIndex);

  const band: Agent17EndorsementAccordSnapshot['band'] = withdrawnSignals
    ? 'withdrawn'
    : endorsementScore >= 53 &&
        inputs.ledgerIndex.band === 'balanced' &&
        inputs.credentialAccord.band === 'issued'
      ? 'signed'
      : 'draft';

  const endorsementSigned =
    band === 'signed' &&
    inputs.ledgerIndex.ledgerBalanced &&
    !registryIndexBlocksCredential(inputs.registryIndex);

  return {
    endorsementScore,
    band,
    endorsements,
    ledgerBand: inputs.ledgerIndex.band,
    credentialBand: inputs.credentialAccord.band,
    endorsementSigned,
    headline: `Endorsement ${band} (${endorsementScore}/100) · ${endorsements.filter(e => e.signed).length}/${endorsements.length} endorsements`,
  };
}

export function endorsementAccordBlocksLedger(snapshot: Agent17EndorsementAccordSnapshot): boolean {
  return snapshot.band === 'withdrawn' || !snapshot.endorsementSigned;
}

export function endorsementAccordBlocksCustody(snapshot: Agent17EndorsementAccordSnapshot): boolean {
  return snapshot.band === 'withdrawn' || !snapshot.endorsementSigned;
}
