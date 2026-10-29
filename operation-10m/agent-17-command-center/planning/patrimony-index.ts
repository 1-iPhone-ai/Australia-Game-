import type {
  Agent17HeritageIndexSnapshot,
  Agent17LegacyAccordSnapshot,
  Agent17PatrimonyIndexSnapshot,
  Agent17RemembranceAccordSnapshot,
} from '../types/command-center-types.ts';
import { heritageIndexBlocksLegacy } from './heritage-index.ts';
import { legacyAccordBlocksPatrimony } from './legacy-accord.ts';
import { remembranceAccordBlocksHeritage } from './remembrance-accord.ts';

export interface Agent17PatrimonyIndexInputs {
  legacyAccord: Agent17LegacyAccordSnapshot;
  heritageIndex: Agent17HeritageIndexSnapshot;
  remembranceAccord: Agent17RemembranceAccordSnapshot;
}

export function buildAgent17PatrimonyIndex(
  inputs: Agent17PatrimonyIndexInputs
): Agent17PatrimonyIndexSnapshot {
  const holdings: Agent17PatrimonyIndexSnapshot['holdings'] = [];

  holdings.push({
    id: 'legacy_entailed',
    label: 'Legacy accord legacy-entailed',
    vested:
      inputs.legacyAccord.legacyEntailed &&
      !legacyAccordBlocksPatrimony(inputs.legacyAccord),
    weight: 30,
  });

  holdings.push({
    id: 'legacy_band',
    label: 'Legacy entailed or draft',
    vested:
      inputs.legacyAccord.band === 'entailed' || inputs.legacyAccord.band === 'draft',
    weight: 25,
  });

  holdings.push({
    id: 'heritage_bequeathed',
    label: 'Heritage index heritage-bequeathed',
    vested:
      inputs.heritageIndex.heritageBequeathed &&
      !heritageIndexBlocksLegacy(inputs.heritageIndex),
    weight: 20,
  });

  holdings.push({
    id: 'remembrance_clear',
    label: 'Remembrance accord not blocking heritage',
    vested: !remembranceAccordBlocksHeritage(inputs.remembranceAccord),
    weight: 15,
  });

  holdings.push({
    id: 'legacy_score',
    label: 'Legacy score headroom',
    vested: inputs.legacyAccord.legacyScore >= 8,
    weight: 10,
  });

  const weighted = holdings.reduce(
    (n, h) => n + (h.vested ? 100 : 1) * (h.weight / 100),
    0
  );
  const totalWeight = holdings.reduce((n, h) => n + h.weight, 0);
  const patrimonyScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const escheatedSignals =
    legacyAccordBlocksPatrimony(inputs.legacyAccord) ||
    heritageIndexBlocksLegacy(inputs.heritageIndex) ||
    remembranceAccordBlocksHeritage(inputs.remembranceAccord);

  const band: Agent17PatrimonyIndexSnapshot['band'] = escheatedSignals
    ? 'escheated'
    : patrimonyScore >= 46 &&
        inputs.legacyAccord.band === 'entailed' &&
        inputs.heritageIndex.band === 'bequeathed'
      ? 'vested'
      : 'pending';

  const patrimonyVested =
    band === 'vested' &&
    inputs.legacyAccord.legacyEntailed &&
    !legacyAccordBlocksPatrimony(inputs.legacyAccord);

  return {
    patrimonyScore,
    band,
    holdings,
    legacyBand: inputs.legacyAccord.band,
    heritageBand: inputs.heritageIndex.band,
    patrimonyVested,
    headline: `Patrimony ${band} (${patrimonyScore}/100) · ${holdings.filter(h => h.vested).length}/${holdings.length} holdings`,
  };
}

export function patrimonyIndexBlocksInheritance(
  snapshot: Agent17PatrimonyIndexSnapshot
): boolean {
  return snapshot.band === 'escheated' || !snapshot.patrimonyVested;
}
