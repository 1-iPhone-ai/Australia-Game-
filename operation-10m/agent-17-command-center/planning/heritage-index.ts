import type {
  Agent17HeritageIndexSnapshot,
  Agent17MemorialIndexSnapshot,
  Agent17RemembranceAccordSnapshot,
  Agent17TestamentAccordSnapshot,
} from '../types/command-center-types.ts';
import { memorialIndexBlocksRemembrance } from './memorial-index.ts';
import { remembranceAccordBlocksHeritage } from './remembrance-accord.ts';
import { testamentAccordBlocksMemorial } from './testament-accord.ts';

export interface Agent17HeritageIndexInputs {
  remembranceAccord: Agent17RemembranceAccordSnapshot;
  memorialIndex: Agent17MemorialIndexSnapshot;
  testamentAccord: Agent17TestamentAccordSnapshot;
}

export function buildAgent17HeritageIndex(
  inputs: Agent17HeritageIndexInputs
): Agent17HeritageIndexSnapshot {
  const bequests: Agent17HeritageIndexSnapshot['bequests'] = [];

  bequests.push({
    id: 'remembrance_commemorated',
    label: 'Remembrance accord remembrance-commemorated',
    bequeathed:
      inputs.remembranceAccord.remembranceCommemorated &&
      !remembranceAccordBlocksHeritage(inputs.remembranceAccord),
    weight: 30,
  });

  bequests.push({
    id: 'remembrance_band',
    label: 'Remembrance commemorated or nascent',
    bequeathed:
      inputs.remembranceAccord.band === 'commemorated' ||
      inputs.remembranceAccord.band === 'nascent',
    weight: 25,
  });

  bequests.push({
    id: 'memorial_enshrined',
    label: 'Memorial index memorial-enshrined',
    bequeathed:
      inputs.memorialIndex.memorialEnshrined &&
      !memorialIndexBlocksRemembrance(inputs.memorialIndex),
    weight: 20,
  });

  bequests.push({
    id: 'testament_clear',
    label: 'Testament accord not blocking memorial',
    bequeathed: !testamentAccordBlocksMemorial(inputs.testamentAccord),
    weight: 15,
  });

  bequests.push({
    id: 'remembrance_score',
    label: 'Remembrance score headroom',
    bequeathed: inputs.remembranceAccord.remembranceScore >= 10,
    weight: 10,
  });

  const weighted = bequests.reduce(
    (n, b) => n + (b.bequeathed ? 100 : 1) * (b.weight / 100),
    0
  );
  const totalWeight = bequests.reduce((n, b) => n + b.weight, 0);
  const heritageScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const forfeitedSignals =
    remembranceAccordBlocksHeritage(inputs.remembranceAccord) ||
    memorialIndexBlocksRemembrance(inputs.memorialIndex) ||
    testamentAccordBlocksMemorial(inputs.testamentAccord);

  const band: Agent17HeritageIndexSnapshot['band'] = forfeitedSignals
    ? 'forfeited'
    : heritageScore >= 47 &&
        inputs.remembranceAccord.band === 'commemorated' &&
        inputs.memorialIndex.band === 'enshrined'
      ? 'bequeathed'
      : 'pending';

  const heritageBequeathed =
    band === 'bequeathed' &&
    inputs.remembranceAccord.remembranceCommemorated &&
    !remembranceAccordBlocksHeritage(inputs.remembranceAccord);

  return {
    heritageScore,
    band,
    bequests,
    remembranceBand: inputs.remembranceAccord.band,
    memorialBand: inputs.memorialIndex.band,
    heritageBequeathed,
    headline: `Heritage ${band} (${heritageScore}/100) · ${bequests.filter(b => b.bequeathed).length}/${bequests.length} bequests`,
  };
}

export function heritageIndexBlocksLegacy(snapshot: Agent17HeritageIndexSnapshot): boolean {
  return snapshot.band === 'forfeited' || !snapshot.heritageBequeathed;
}
