import type {
  Agent17CrownIndexSnapshot,
  Agent17DynastyAccordSnapshot,
  Agent17ImperialAccordSnapshot,
  Agent17ThroneIndexSnapshot,
} from '../types/command-center-types.ts';
import { crownIndexBlocksImperial } from './crown-index.ts';
import { imperialAccordBlocksThrone } from './imperial-accord.ts';
import { throneIndexBlocksDynasty } from './throne-index.ts';

export interface Agent17DynastyAccordInputs {
  throneIndex: Agent17ThroneIndexSnapshot;
  imperialAccord: Agent17ImperialAccordSnapshot;
  crownIndex: Agent17CrownIndexSnapshot;
}

export function buildAgent17DynastyAccord(
  inputs: Agent17DynastyAccordInputs
): Agent17DynastyAccordSnapshot {
  const charters: Agent17DynastyAccordSnapshot['charters'] = [];

  charters.push({
    id: 'throne_seated',
    label: 'Throne index throne-seated',
    ratified:
      inputs.throneIndex.throneSeated && !throneIndexBlocksDynasty(inputs.throneIndex),
    weight: 30,
  });

  charters.push({
    id: 'throne_band',
    label: 'Throne seated or vacant',
    ratified:
      inputs.throneIndex.band === 'seated' || inputs.throneIndex.band === 'vacant',
    weight: 25,
  });

  charters.push({
    id: 'crown_invested',
    label: 'Crown index crown-invested',
    ratified:
      inputs.crownIndex.crownInvested && !crownIndexBlocksImperial(inputs.crownIndex),
    weight: 20,
  });

  charters.push({
    id: 'imperial_clear',
    label: 'Imperial accord not blocking throne',
    ratified: !imperialAccordBlocksThrone(inputs.imperialAccord),
    weight: 15,
  });

  charters.push({
    id: 'crown_score',
    label: 'Crown score headroom',
    ratified: inputs.crownIndex.crownScore >= 41,
    weight: 10,
  });

  const weighted = charters.reduce(
    (n, c) => n + (c.ratified ? 100 : 5) * (c.weight / 100),
    0
  );
  const totalWeight = charters.reduce((n, c) => n + c.weight, 0);
  const dynastyScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const extinctSignals =
    throneIndexBlocksDynasty(inputs.throneIndex) ||
    imperialAccordBlocksThrone(inputs.imperialAccord) ||
    crownIndexBlocksImperial(inputs.crownIndex);

  const band: Agent17DynastyAccordSnapshot['band'] = extinctSignals
    ? 'extinct'
    : dynastyScore >= 60 &&
        inputs.throneIndex.band === 'seated' &&
        inputs.imperialAccord.band === 'empire'
      ? 'lineage'
      : 'branch';

  const dynastyProclaimed =
    band === 'lineage' &&
    inputs.throneIndex.throneSeated &&
    !crownIndexBlocksImperial(inputs.crownIndex);

  return {
    dynastyScore,
    band,
    charters,
    throneBand: inputs.throneIndex.band,
    imperialBand: inputs.imperialAccord.band,
    dynastyProclaimed,
    headline: `Dynasty ${band} (${dynastyScore}/100) · ${charters.filter(c => c.ratified).length}/${charters.length} charters`,
  };
}

export function dynastyAccordBlocksThrone(snapshot: Agent17DynastyAccordSnapshot): boolean {
  return snapshot.band === 'extinct' || !snapshot.dynastyProclaimed;
}

export function dynastyAccordBlocksRealm(snapshot: Agent17DynastyAccordSnapshot): boolean {
  return snapshot.band === 'extinct' || !snapshot.dynastyProclaimed;
}
