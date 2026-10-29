import type {
  Agent17AllianceIndexSnapshot,
  Agent17AuthorityCharterSnapshot,
  Agent17DispatchAccordSnapshot,
  Agent17FederationAccordSnapshot,
} from '../types/command-center-types.ts';
import { authorityCharterBlocksAccord } from './authority-charter.ts';
import { dispatchAccordBlocksDispatch } from './dispatch-accord.ts';
import { federationAccordBlocksOps } from './federation-accord.ts';

export interface Agent17AllianceIndexInputs {
  federationAccord: Agent17FederationAccordSnapshot;
  dispatchAccord: Agent17DispatchAccordSnapshot;
  authorityCharter: Agent17AuthorityCharterSnapshot;
}

export function buildAgent17AllianceIndex(
  inputs: Agent17AllianceIndexInputs
): Agent17AllianceIndexSnapshot {
  const ties: Agent17AllianceIndexSnapshot['ties'] = [];

  ties.push({
    id: 'federation_unified',
    label: 'Federation accord unified',
    secured:
      inputs.federationAccord.federationUnified &&
      !federationAccordBlocksOps(inputs.federationAccord),
    weight: 30,
  });

  ties.push({
    id: 'federation_band',
    label: 'Federation unified or partial',
    secured:
      inputs.federationAccord.band === 'unified' || inputs.federationAccord.band === 'partial',
    weight: 25,
  });

  ties.push({
    id: 'dispatch_open',
    label: 'Dispatch accord allows dispatch',
    secured:
      inputs.dispatchAccord.dispatchAllowed && !dispatchAccordBlocksDispatch(inputs.dispatchAccord),
    weight: 20,
  });

  ties.push({
    id: 'charter_authority',
    label: 'Authority charter not revoked',
    secured: !authorityCharterBlocksAccord(inputs.authorityCharter),
    weight: 15,
  });

  ties.push({
    id: 'charter_score',
    label: 'Charter score headroom',
    secured: inputs.authorityCharter.charterScore >= 44,
    weight: 10,
  });

  const weighted = ties.reduce(
    (n, t) => n + (t.secured ? 100 : 9) * (t.weight / 100),
    0
  );
  const totalWeight = ties.reduce((n, t) => n + t.weight, 0);
  const allianceScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const rupturedSignals =
    federationAccordBlocksOps(inputs.federationAccord) ||
    dispatchAccordBlocksDispatch(inputs.dispatchAccord) ||
    authorityCharterBlocksAccord(inputs.authorityCharter);

  const band: Agent17AllianceIndexSnapshot['band'] = rupturedSignals
    ? 'ruptured'
    : allianceScore >= 67 &&
        inputs.federationAccord.band === 'unified' &&
        !federationAccordBlocksOps(inputs.federationAccord)
      ? 'allied'
      : 'forming';

  const allianceReady =
    band === 'allied' &&
    inputs.federationAccord.federationUnified &&
    !federationAccordBlocksOps(inputs.federationAccord);

  return {
    allianceScore,
    band,
    ties,
    federationBand: inputs.federationAccord.band,
    dispatchBand: inputs.dispatchAccord.band,
    allianceReady,
    headline: `Alliance ${band} (${allianceScore}/100) · ${ties.filter(t => t.secured).length}/${ties.length} ties`,
  };
}

export function allianceIndexBlocksCoalition(snapshot: Agent17AllianceIndexSnapshot): boolean {
  return snapshot.band === 'ruptured' || !snapshot.allianceReady;
}
