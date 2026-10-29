import type {
  Agent17MemorialIndexSnapshot,
  Agent17RemembranceAccordSnapshot,
  Agent17TestamentAccordSnapshot,
  Agent17WitnessIndexSnapshot,
} from '../types/command-center-types.ts';
import { memorialIndexBlocksRemembrance } from './memorial-index.ts';
import { testamentAccordBlocksMemorial } from './testament-accord.ts';
import { witnessIndexBlocksTestament } from './witness-index.ts';

export interface Agent17RemembranceAccordInputs {
  memorialIndex: Agent17MemorialIndexSnapshot;
  testamentAccord: Agent17TestamentAccordSnapshot;
  witnessIndex: Agent17WitnessIndexSnapshot;
}

export function buildAgent17RemembranceAccord(
  inputs: Agent17RemembranceAccordInputs
): Agent17RemembranceAccordSnapshot {
  const observances: Agent17RemembranceAccordSnapshot['observances'] = [];

  observances.push({
    id: 'memorial_enshrined',
    label: 'Memorial index memorial-enshrined',
    observed:
      inputs.memorialIndex.memorialEnshrined &&
      !memorialIndexBlocksRemembrance(inputs.memorialIndex),
    weight: 30,
  });

  observances.push({
    id: 'memorial_band',
    label: 'Memorial enshrined or pending',
    observed:
      inputs.memorialIndex.band === 'enshrined' || inputs.memorialIndex.band === 'pending',
    weight: 25,
  });

  observances.push({
    id: 'testament_binding',
    label: 'Testament accord testament-ready',
    observed:
      inputs.testamentAccord.testamentBinding &&
      !testamentAccordBlocksMemorial(inputs.testamentAccord),
    weight: 20,
  });

  observances.push({
    id: 'witness_clear',
    label: 'Witness index not blocking testament',
    observed: !witnessIndexBlocksTestament(inputs.witnessIndex),
    weight: 15,
  });

  observances.push({
    id: 'memorial_score',
    label: 'Memorial score headroom',
    observed: inputs.memorialIndex.memorialScore >= 11,
    weight: 10,
  });

  const weighted = observances.reduce(
    (n, o) => n + (o.observed ? 100 : 1) * (o.weight / 100),
    0
  );
  const totalWeight = observances.reduce((n, o) => n + o.weight, 0);
  const remembranceScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const forgottenSignals =
    memorialIndexBlocksRemembrance(inputs.memorialIndex) ||
    testamentAccordBlocksMemorial(inputs.testamentAccord) ||
    witnessIndexBlocksTestament(inputs.witnessIndex);

  const band: Agent17RemembranceAccordSnapshot['band'] = forgottenSignals
    ? 'forgotten'
    : remembranceScore >= 45 &&
        inputs.memorialIndex.band === 'enshrined' &&
        inputs.testamentAccord.band === 'binding'
      ? 'commemorated'
      : 'nascent';

  const remembranceCommemorated =
    band === 'commemorated' &&
    inputs.memorialIndex.memorialEnshrined &&
    !witnessIndexBlocksTestament(inputs.witnessIndex);

  return {
    remembranceScore,
    band,
    observances,
    memorialBand: inputs.memorialIndex.band,
    testamentBand: inputs.testamentAccord.band,
    remembranceCommemorated,
    headline: `Remembrance ${band} (${remembranceScore}/100) · ${observances.filter(o => o.observed).length}/${observances.length} observances`,
  };
}

export function remembranceAccordBlocksMemorial(
  snapshot: Agent17RemembranceAccordSnapshot
): boolean {
  return snapshot.band === 'forgotten' || !snapshot.remembranceCommemorated;
}

export function remembranceAccordBlocksHeritage(
  snapshot: Agent17RemembranceAccordSnapshot
): boolean {
  return remembranceAccordBlocksMemorial(snapshot);
}
