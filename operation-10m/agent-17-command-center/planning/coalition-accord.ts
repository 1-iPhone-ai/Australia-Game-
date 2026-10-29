import type {
  Agent17AllianceIndexSnapshot,
  Agent17CoalitionAccordSnapshot,
  Agent17FederationAccordSnapshot,
  Agent17MobilizationIndexSnapshot,
} from '../types/command-center-types.ts';
import { allianceIndexBlocksCoalition } from './alliance-index.ts';
import { federationAccordBlocksOps } from './federation-accord.ts';
import { mobilizationIndexBlocksSummons } from './mobilization-index.ts';

export interface Agent17CoalitionAccordInputs {
  allianceIndex: Agent17AllianceIndexSnapshot;
  federationAccord: Agent17FederationAccordSnapshot;
  mobilizationIndex: Agent17MobilizationIndexSnapshot;
}

export function buildAgent17CoalitionAccord(
  inputs: Agent17CoalitionAccordInputs
): Agent17CoalitionAccordSnapshot {
  const compacts: Agent17CoalitionAccordSnapshot['compacts'] = [];

  compacts.push({
    id: 'alliance_ready',
    label: 'Alliance index alliance-ready',
    sealed:
      inputs.allianceIndex.allianceReady && !allianceIndexBlocksCoalition(inputs.allianceIndex),
    weight: 30,
  });

  compacts.push({
    id: 'alliance_band',
    label: 'Alliance allied or forming',
    sealed:
      inputs.allianceIndex.band === 'allied' || inputs.allianceIndex.band === 'forming',
    weight: 25,
  });

  compacts.push({
    id: 'mobilization_field',
    label: 'Mobilization not blocking summons',
    sealed: !mobilizationIndexBlocksSummons(inputs.mobilizationIndex),
    weight: 20,
  });

  compacts.push({
    id: 'federation_clear',
    label: 'Federation accord not blocking ops',
    sealed: !federationAccordBlocksOps(inputs.federationAccord),
    weight: 15,
  });

  compacts.push({
    id: 'mobilization_score',
    label: 'Mobilization score headroom',
    sealed: inputs.mobilizationIndex.mobilizationScore >= 38,
    weight: 10,
  });

  const weighted = compacts.reduce(
    (n, c) => n + (c.sealed ? 100 : 8) * (c.weight / 100),
    0
  );
  const totalWeight = compacts.reduce((n, c) => n + c.weight, 0);
  const coalitionScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const brokenSignals =
    allianceIndexBlocksCoalition(inputs.allianceIndex) ||
    federationAccordBlocksOps(inputs.federationAccord) ||
    mobilizationIndexBlocksSummons(inputs.mobilizationIndex);

  const band: Agent17CoalitionAccordSnapshot['band'] = brokenSignals
    ? 'broken'
    : coalitionScore >= 65 &&
        inputs.allianceIndex.band === 'allied' &&
        !allianceIndexBlocksCoalition(inputs.allianceIndex)
      ? 'sealed'
      : 'draft';

  const coalitionSealed =
    band === 'sealed' &&
    inputs.allianceIndex.allianceReady &&
    !mobilizationIndexBlocksSummons(inputs.mobilizationIndex);

  return {
    coalitionScore,
    band,
    compacts,
    allianceBand: inputs.allianceIndex.band,
    mobilizationBand: inputs.mobilizationIndex.band,
    coalitionSealed,
    headline: `Coalition ${band} (${coalitionScore}/100) · ${compacts.filter(c => c.sealed).length}/${compacts.length} compacts`,
  };
}

export function coalitionAccordBlocksAlliance(snapshot: Agent17CoalitionAccordSnapshot): boolean {
  return snapshot.band === 'broken' || !snapshot.coalitionSealed;
}
