import type {
  Agent17CredentialAccordSnapshot,
  Agent17CustodyIndexSnapshot,
  Agent17EndorsementAccordSnapshot,
  Agent17LedgerIndexSnapshot,
} from '../types/command-center-types.ts';
import { credentialAccordBlocksLedger } from './credential-accord.ts';
import { endorsementAccordBlocksCustody } from './endorsement-accord.ts';
import { ledgerIndexBlocksEndorsement } from './ledger-index.ts';

export interface Agent17CustodyIndexInputs {
  endorsementAccord: Agent17EndorsementAccordSnapshot;
  ledgerIndex: Agent17LedgerIndexSnapshot;
  credentialAccord: Agent17CredentialAccordSnapshot;
}

export function buildAgent17CustodyIndex(
  inputs: Agent17CustodyIndexInputs
): Agent17CustodyIndexSnapshot {
  const holds: Agent17CustodyIndexSnapshot['holds'] = [];

  holds.push({
    id: 'endorsement_signed',
    label: 'Endorsement accord signed',
    secured:
      inputs.endorsementAccord.endorsementSigned &&
      !endorsementAccordBlocksCustody(inputs.endorsementAccord),
    weight: 30,
  });

  holds.push({
    id: 'endorsement_band',
    label: 'Endorsement signed or draft',
    secured:
      inputs.endorsementAccord.band === 'signed' ||
      inputs.endorsementAccord.band === 'draft',
    weight: 25,
  });

  holds.push({
    id: 'ledger_balanced',
    label: 'Ledger index ledger-balanced',
    secured:
      inputs.ledgerIndex.ledgerBalanced && !ledgerIndexBlocksEndorsement(inputs.ledgerIndex),
    weight: 20,
  });

  holds.push({
    id: 'credential_clear',
    label: 'Credential accord not blocking ledger',
    secured: !credentialAccordBlocksLedger(inputs.credentialAccord),
    weight: 15,
  });

  holds.push({
    id: 'endorsement_score',
    label: 'Endorsement score headroom',
    secured: inputs.endorsementAccord.endorsementScore >= 26,
    weight: 10,
  });

  const weighted = holds.reduce(
    (n, h) => n + (h.secured ? 100 : 6) * (h.weight / 100),
    0
  );
  const totalWeight = holds.reduce((n, h) => n + h.weight, 0);
  const custodyScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const breachedSignals =
    endorsementAccordBlocksCustody(inputs.endorsementAccord) ||
    ledgerIndexBlocksEndorsement(inputs.ledgerIndex) ||
    credentialAccordBlocksLedger(inputs.credentialAccord);

  const band: Agent17CustodyIndexSnapshot['band'] = breachedSignals
    ? 'breached'
    : custodyScore >= 55 &&
        inputs.endorsementAccord.band === 'signed' &&
        inputs.ledgerIndex.band === 'balanced'
      ? 'held'
      : 'partial';

  const custodyHeld =
    band === 'held' &&
    inputs.endorsementAccord.endorsementSigned &&
    !endorsementAccordBlocksCustody(inputs.endorsementAccord);

  return {
    custodyScore,
    band,
    holds,
    endorsementBand: inputs.endorsementAccord.band,
    ledgerBand: inputs.ledgerIndex.band,
    custodyHeld,
    headline: `Custody ${band} (${custodyScore}/100) · ${holds.filter(h => h.secured).length}/${holds.length} holds`,
  };
}

export function custodyIndexBlocksRelease(snapshot: Agent17CustodyIndexSnapshot): boolean {
  return snapshot.band === 'breached' || !snapshot.custodyHeld;
}
