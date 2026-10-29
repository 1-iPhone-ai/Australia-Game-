import type {
  Agent17CoalitionAccordSnapshot,
  Agent17CrownIndexSnapshot,
  Agent17ImperialAccordSnapshot,
  Agent17ThroneIndexSnapshot,
} from '../types/command-center-types.ts';
import { coalitionAccordBlocksAlliance } from './coalition-accord.ts';
import { crownIndexBlocksImperial } from './crown-index.ts';
import { imperialAccordBlocksThrone } from './imperial-accord.ts';

export interface Agent17ThroneIndexInputs {
  imperialAccord: Agent17ImperialAccordSnapshot;
  crownIndex: Agent17CrownIndexSnapshot;
  coalitionAccord: Agent17CoalitionAccordSnapshot;
}

export function buildAgent17ThroneIndex(
  inputs: Agent17ThroneIndexInputs
): Agent17ThroneIndexSnapshot {
  const regalia: Agent17ThroneIndexSnapshot['regalia'] = [];

  regalia.push({
    id: 'imperial_proclaimed',
    label: 'Imperial accord proclaimed',
    seated:
      inputs.imperialAccord.empireProclaimed &&
      !imperialAccordBlocksThrone(inputs.imperialAccord),
    weight: 30,
  });

  regalia.push({
    id: 'imperial_band',
    label: 'Imperial empire or domain',
    seated:
      inputs.imperialAccord.band === 'empire' || inputs.imperialAccord.band === 'domain',
    weight: 25,
  });

  regalia.push({
    id: 'crown_invested',
    label: 'Crown index invested-ready',
    seated:
      inputs.crownIndex.crownInvested && !crownIndexBlocksImperial(inputs.crownIndex),
    weight: 20,
  });

  regalia.push({
    id: 'coalition_sealed',
    label: 'Coalition accord not blocking',
    seated: !coalitionAccordBlocksAlliance(inputs.coalitionAccord),
    weight: 15,
  });

  regalia.push({
    id: 'imperial_score',
    label: 'Imperial score headroom',
    seated: inputs.imperialAccord.imperialScore >= 43,
    weight: 10,
  });

  const weighted = regalia.reduce(
    (n, r) => n + (r.seated ? 100 : 6) * (r.weight / 100),
    0
  );
  const totalWeight = regalia.reduce((n, r) => n + r.weight, 0);
  const throneScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const usurpedSignals =
    imperialAccordBlocksThrone(inputs.imperialAccord) ||
    crownIndexBlocksImperial(inputs.crownIndex) ||
    coalitionAccordBlocksAlliance(inputs.coalitionAccord);

  const band: Agent17ThroneIndexSnapshot['band'] = usurpedSignals
    ? 'usurped'
    : throneScore >= 63 &&
        inputs.imperialAccord.band === 'empire' &&
        inputs.crownIndex.band === 'invested'
      ? 'seated'
      : 'vacant';

  const throneSeated =
    band === 'seated' &&
    inputs.imperialAccord.empireProclaimed &&
    !imperialAccordBlocksThrone(inputs.imperialAccord);

  return {
    throneScore,
    band,
    regalia,
    imperialBand: inputs.imperialAccord.band,
    crownBand: inputs.crownIndex.band,
    throneSeated,
    headline: `Throne ${band} (${throneScore}/100) · ${regalia.filter(r => r.seated).length}/${regalia.length} regalia`,
  };
}

export function throneIndexBlocksDynasty(snapshot: Agent17ThroneIndexSnapshot): boolean {
  return snapshot.band === 'usurped' || !snapshot.throneSeated;
}
