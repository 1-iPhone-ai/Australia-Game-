import type {
  Agent17AllianceIndexSnapshot,
  Agent17CoalitionAccordSnapshot,
  Agent17CrownIndexSnapshot,
  Agent17SovereignAccordSnapshot,
} from '../types/command-center-types.ts';
import { allianceIndexBlocksCoalition } from './alliance-index.ts';
import { coalitionAccordBlocksAlliance } from './coalition-accord.ts';
import { sovereignAccordBlocksCompact } from './sovereign-accord.ts';

export interface Agent17CrownIndexInputs {
  sovereignAccord: Agent17SovereignAccordSnapshot;
  allianceIndex: Agent17AllianceIndexSnapshot;
  coalitionAccord: Agent17CoalitionAccordSnapshot;
}

export function buildAgent17CrownIndex(
  inputs: Agent17CrownIndexInputs
): Agent17CrownIndexSnapshot {
  const jewels: Agent17CrownIndexSnapshot['jewels'] = [];

  jewels.push({
    id: 'sovereign_crowned',
    label: 'Sovereign accord crowned',
    set:
      inputs.sovereignAccord.sovereigntyCrowned &&
      !sovereignAccordBlocksCompact(inputs.sovereignAccord),
    weight: 30,
  });

  jewels.push({
    id: 'sovereign_band',
    label: 'Sovereign crowned or regent',
    set:
      inputs.sovereignAccord.band === 'crowned' || inputs.sovereignAccord.band === 'regent',
    weight: 25,
  });

  jewels.push({
    id: 'alliance_allied',
    label: 'Alliance index allied-ready',
    set:
      inputs.allianceIndex.allianceReady && !allianceIndexBlocksCoalition(inputs.allianceIndex),
    weight: 20,
  });

  jewels.push({
    id: 'coalition_sealed',
    label: 'Coalition accord not blocking',
    set: !coalitionAccordBlocksAlliance(inputs.coalitionAccord),
    weight: 15,
  });

  jewels.push({
    id: 'sovereign_score',
    label: 'Sovereign score headroom',
    set: inputs.sovereignAccord.sovereignScore >= 44,
    weight: 10,
  });

  const weighted = jewels.reduce(
    (n, j) => n + (j.set ? 100 : 6) * (j.weight / 100),
    0
  );
  const totalWeight = jewels.reduce((n, j) => n + j.weight, 0);
  const crownScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const uncrownedSignals =
    sovereignAccordBlocksCompact(inputs.sovereignAccord) ||
    allianceIndexBlocksCoalition(inputs.allianceIndex) ||
    coalitionAccordBlocksAlliance(inputs.coalitionAccord);

  const band: Agent17CrownIndexSnapshot['band'] = uncrownedSignals
    ? 'uncrowned'
    : crownScore >= 62 &&
        inputs.sovereignAccord.band === 'crowned' &&
        inputs.allianceIndex.band === 'allied'
      ? 'invested'
      : 'pending';

  const crownInvested =
    band === 'invested' &&
    inputs.sovereignAccord.sovereigntyCrowned &&
    !sovereignAccordBlocksCompact(inputs.sovereignAccord);

  return {
    crownScore,
    band,
    jewels,
    sovereignBand: inputs.sovereignAccord.band,
    allianceBand: inputs.allianceIndex.band,
    crownInvested,
    headline: `Crown ${band} (${crownScore}/100) · ${jewels.filter(j => j.set).length}/${jewels.length} jewels`,
  };
}

export function crownIndexBlocksImperial(snapshot: Agent17CrownIndexSnapshot): boolean {
  return snapshot.band === 'uncrowned' || !snapshot.crownInvested;
}
