import type {
  Agent17HeritageIndexSnapshot,
  Agent17LegacyAccordSnapshot,
  Agent17MemorialIndexSnapshot,
  Agent17RemembranceAccordSnapshot,
} from '../types/command-center-types.ts';
import { heritageIndexBlocksLegacy } from './heritage-index.ts';
import { memorialIndexBlocksRemembrance } from './memorial-index.ts';
import { remembranceAccordBlocksHeritage } from './remembrance-accord.ts';

export interface Agent17LegacyAccordInputs {
  heritageIndex: Agent17HeritageIndexSnapshot;
  remembranceAccord: Agent17RemembranceAccordSnapshot;
  memorialIndex: Agent17MemorialIndexSnapshot;
}

export function buildAgent17LegacyAccord(
  inputs: Agent17LegacyAccordInputs
): Agent17LegacyAccordSnapshot {
  const articles: Agent17LegacyAccordSnapshot['articles'] = [];

  articles.push({
    id: 'heritage_bequeathed',
    label: 'Heritage index heritage-bequeathed',
    entailed:
      inputs.heritageIndex.heritageBequeathed &&
      !heritageIndexBlocksLegacy(inputs.heritageIndex),
    weight: 30,
  });

  articles.push({
    id: 'heritage_band',
    label: 'Heritage bequeathed or pending',
    entailed:
      inputs.heritageIndex.band === 'bequeathed' || inputs.heritageIndex.band === 'pending',
    weight: 25,
  });

  articles.push({
    id: 'remembrance_commemorated',
    label: 'Remembrance accord remembrance-ready',
    entailed:
      inputs.remembranceAccord.remembranceCommemorated &&
      !remembranceAccordBlocksHeritage(inputs.remembranceAccord),
    weight: 20,
  });

  articles.push({
    id: 'memorial_clear',
    label: 'Memorial index not blocking remembrance',
    entailed: !memorialIndexBlocksRemembrance(inputs.memorialIndex),
    weight: 15,
  });

  articles.push({
    id: 'heritage_score',
    label: 'Heritage score headroom',
    entailed: inputs.heritageIndex.heritageScore >= 9,
    weight: 10,
  });

  const weighted = articles.reduce(
    (n, a) => n + (a.entailed ? 100 : 1) * (a.weight / 100),
    0
  );
  const totalWeight = articles.reduce((n, a) => n + a.weight, 0);
  const legacyScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const extinguishedSignals =
    heritageIndexBlocksLegacy(inputs.heritageIndex) ||
    remembranceAccordBlocksHeritage(inputs.remembranceAccord) ||
    memorialIndexBlocksRemembrance(inputs.memorialIndex);

  const band: Agent17LegacyAccordSnapshot['band'] = extinguishedSignals
    ? 'extinguished'
    : legacyScore >= 44 &&
        inputs.heritageIndex.band === 'bequeathed' &&
        inputs.remembranceAccord.band === 'commemorated'
      ? 'entailed'
      : 'draft';

  const legacyEntailed =
    band === 'entailed' &&
    inputs.heritageIndex.heritageBequeathed &&
    !memorialIndexBlocksRemembrance(inputs.memorialIndex);

  return {
    legacyScore,
    band,
    articles,
    heritageBand: inputs.heritageIndex.band,
    remembranceBand: inputs.remembranceAccord.band,
    legacyEntailed,
    headline: `Legacy ${band} (${legacyScore}/100) · ${articles.filter(a => a.entailed).length}/${articles.length} articles`,
  };
}

export function legacyAccordBlocksHeritage(snapshot: Agent17LegacyAccordSnapshot): boolean {
  return snapshot.band === 'extinguished' || !snapshot.legacyEntailed;
}
