import type {
  Agent17HeritageIndexSnapshot,
  Agent17InheritanceAccordSnapshot,
  Agent17LegacyAccordSnapshot,
  Agent17PatrimonyIndexSnapshot,
} from '../types/command-center-types.ts';
import { heritageIndexBlocksLegacy } from './heritage-index.ts';
import { legacyAccordBlocksPatrimony } from './legacy-accord.ts';
import { patrimonyIndexBlocksInheritance } from './patrimony-index.ts';

export interface Agent17InheritanceAccordInputs {
  patrimonyIndex: Agent17PatrimonyIndexSnapshot;
  legacyAccord: Agent17LegacyAccordSnapshot;
  heritageIndex: Agent17HeritageIndexSnapshot;
}

export function buildAgent17InheritanceAccord(
  inputs: Agent17InheritanceAccordInputs
): Agent17InheritanceAccordSnapshot {
  const transmissions: Agent17InheritanceAccordSnapshot['transmissions'] = [];

  transmissions.push({
    id: 'patrimony_vested',
    label: 'Patrimony index patrimony-vested',
    transmitted:
      inputs.patrimonyIndex.patrimonyVested &&
      !patrimonyIndexBlocksInheritance(inputs.patrimonyIndex),
    weight: 30,
  });

  transmissions.push({
    id: 'patrimony_band',
    label: 'Patrimony vested or pending',
    transmitted:
      inputs.patrimonyIndex.band === 'vested' || inputs.patrimonyIndex.band === 'pending',
    weight: 25,
  });

  transmissions.push({
    id: 'legacy_entailed',
    label: 'Legacy accord legacy-ready',
    transmitted:
      inputs.legacyAccord.legacyEntailed &&
      !legacyAccordBlocksPatrimony(inputs.legacyAccord),
    weight: 20,
  });

  transmissions.push({
    id: 'heritage_clear',
    label: 'Heritage index not blocking legacy',
    transmitted: !heritageIndexBlocksLegacy(inputs.heritageIndex),
    weight: 15,
  });

  transmissions.push({
    id: 'patrimony_score',
    label: 'Patrimony score headroom',
    transmitted: inputs.patrimonyIndex.patrimonyScore >= 7,
    weight: 10,
  });

  const weighted = transmissions.reduce(
    (n, t) => n + (t.transmitted ? 100 : 1) * (t.weight / 100),
    0
  );
  const totalWeight = transmissions.reduce((n, t) => n + t.weight, 0);
  const inheritanceScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const disclaimedSignals =
    patrimonyIndexBlocksInheritance(inputs.patrimonyIndex) ||
    legacyAccordBlocksPatrimony(inputs.legacyAccord) ||
    heritageIndexBlocksLegacy(inputs.heritageIndex);

  const band: Agent17InheritanceAccordSnapshot['band'] = disclaimedSignals
    ? 'disclaimed'
    : inheritanceScore >= 43 &&
        inputs.patrimonyIndex.band === 'vested' &&
        inputs.legacyAccord.band === 'entailed'
      ? 'transmitted'
      : 'provisional';

  const inheritanceTransmitted =
    band === 'transmitted' &&
    inputs.patrimonyIndex.patrimonyVested &&
    !heritageIndexBlocksLegacy(inputs.heritageIndex);

  return {
    inheritanceScore,
    band,
    transmissions,
    patrimonyBand: inputs.patrimonyIndex.band,
    legacyBand: inputs.legacyAccord.band,
    inheritanceTransmitted,
    headline: `Inheritance ${band} (${inheritanceScore}/100) · ${transmissions.filter(t => t.transmitted).length}/${transmissions.length} transmissions`,
  };
}

export function inheritanceAccordBlocksPatrimony(
  snapshot: Agent17InheritanceAccordSnapshot
): boolean {
  return snapshot.band === 'disclaimed' || !snapshot.inheritanceTransmitted;
}
