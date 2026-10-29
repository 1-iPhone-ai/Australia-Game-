import type {
  Agent17CustodyIndexSnapshot,
  Agent17EndorsementAccordSnapshot,
  Agent17LedgerIndexSnapshot,
  Agent17ReleaseAccordSnapshot,
} from '../types/command-center-types.ts';
import { custodyIndexBlocksRelease } from './custody-index.ts';
import { endorsementAccordBlocksCustody } from './endorsement-accord.ts';
import { ledgerIndexBlocksEndorsement } from './ledger-index.ts';

export interface Agent17ReleaseAccordInputs {
  custodyIndex: Agent17CustodyIndexSnapshot;
  endorsementAccord: Agent17EndorsementAccordSnapshot;
  ledgerIndex: Agent17LedgerIndexSnapshot;
}

export function buildAgent17ReleaseAccord(
  inputs: Agent17ReleaseAccordInputs
): Agent17ReleaseAccordSnapshot {
  const gates: Agent17ReleaseAccordSnapshot['gates'] = [];

  gates.push({
    id: 'custody_held',
    label: 'Custody index custody-held',
    cleared:
      inputs.custodyIndex.custodyHeld && !custodyIndexBlocksRelease(inputs.custodyIndex),
    weight: 30,
  });

  gates.push({
    id: 'custody_band',
    label: 'Custody held or partial',
    cleared:
      inputs.custodyIndex.band === 'held' || inputs.custodyIndex.band === 'partial',
    weight: 25,
  });

  gates.push({
    id: 'endorsement_signed',
    label: 'Endorsement accord signed-ready',
    cleared:
      inputs.endorsementAccord.endorsementSigned &&
      !endorsementAccordBlocksCustody(inputs.endorsementAccord),
    weight: 20,
  });

  gates.push({
    id: 'ledger_clear',
    label: 'Ledger index not blocking endorsement',
    cleared: !ledgerIndexBlocksEndorsement(inputs.ledgerIndex),
    weight: 15,
  });

  gates.push({
    id: 'custody_score',
    label: 'Custody score headroom',
    cleared: inputs.custodyIndex.custodyScore >= 25,
    weight: 10,
  });

  const weighted = gates.reduce(
    (n, g) => n + (g.cleared ? 100 : 5) * (g.weight / 100),
    0
  );
  const totalWeight = gates.reduce((n, g) => n + g.weight, 0);
  const releaseScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const blockedSignals =
    custodyIndexBlocksRelease(inputs.custodyIndex) ||
    endorsementAccordBlocksCustody(inputs.endorsementAccord) ||
    ledgerIndexBlocksEndorsement(inputs.ledgerIndex);

  const band: Agent17ReleaseAccordSnapshot['band'] = blockedSignals
    ? 'blocked'
    : releaseScore >= 52 &&
        inputs.custodyIndex.band === 'held' &&
        inputs.endorsementAccord.band === 'signed'
      ? 'cleared'
      : 'queued';

  const releaseCleared =
    band === 'cleared' &&
    inputs.custodyIndex.custodyHeld &&
    !ledgerIndexBlocksEndorsement(inputs.ledgerIndex);

  return {
    releaseScore,
    band,
    gates,
    custodyBand: inputs.custodyIndex.band,
    endorsementBand: inputs.endorsementAccord.band,
    releaseCleared,
    headline: `Release ${band} (${releaseScore}/100) · ${gates.filter(g => g.cleared).length}/${gates.length} gates`,
  };
}

export function releaseAccordBlocksCustody(snapshot: Agent17ReleaseAccordSnapshot): boolean {
  return snapshot.band === 'blocked' || !snapshot.releaseCleared;
}

export function releaseAccordBlocksVault(snapshot: Agent17ReleaseAccordSnapshot): boolean {
  return snapshot.band === 'blocked' || !snapshot.releaseCleared;
}
