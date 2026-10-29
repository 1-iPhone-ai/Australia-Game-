import type {
  Agent17EndowmentIndexSnapshot,
  Agent17InheritanceAccordSnapshot,
  Agent17LegacyAccordSnapshot,
  Agent17PatrimonyIndexSnapshot,
} from '../types/command-center-types.ts';
import { inheritanceAccordBlocksEndowment } from './inheritance-accord.ts';
import { legacyAccordBlocksPatrimony } from './legacy-accord.ts';
import { patrimonyIndexBlocksInheritance } from './patrimony-index.ts';

export interface Agent17EndowmentIndexInputs {
  inheritanceAccord: Agent17InheritanceAccordSnapshot;
  patrimonyIndex: Agent17PatrimonyIndexSnapshot;
  legacyAccord: Agent17LegacyAccordSnapshot;
}

export function buildAgent17EndowmentIndex(
  inputs: Agent17EndowmentIndexInputs
): Agent17EndowmentIndexSnapshot {
  const allocations: Agent17EndowmentIndexSnapshot['allocations'] = [];

  allocations.push({
    id: 'inheritance_transmitted',
    label: 'Inheritance accord inheritance-transmitted',
    funded:
      inputs.inheritanceAccord.inheritanceTransmitted &&
      !inheritanceAccordBlocksEndowment(inputs.inheritanceAccord),
    weight: 30,
  });

  allocations.push({
    id: 'inheritance_band',
    label: 'Inheritance transmitted or provisional',
    funded:
      inputs.inheritanceAccord.band === 'transmitted' ||
      inputs.inheritanceAccord.band === 'provisional',
    weight: 25,
  });

  allocations.push({
    id: 'patrimony_vested',
    label: 'Patrimony index patrimony-vested',
    funded:
      inputs.patrimonyIndex.patrimonyVested &&
      !patrimonyIndexBlocksInheritance(inputs.patrimonyIndex),
    weight: 20,
  });

  allocations.push({
    id: 'legacy_clear',
    label: 'Legacy accord not blocking patrimony',
    funded: !legacyAccordBlocksPatrimony(inputs.legacyAccord),
    weight: 15,
  });

  allocations.push({
    id: 'inheritance_score',
    label: 'Inheritance score headroom',
    funded: inputs.inheritanceAccord.inheritanceScore >= 6,
    weight: 10,
  });

  const weighted = allocations.reduce(
    (n, a) => n + (a.funded ? 100 : 1) * (a.weight / 100),
    0
  );
  const totalWeight = allocations.reduce((n, a) => n + a.weight, 0);
  const endowmentScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const depletedSignals =
    inheritanceAccordBlocksEndowment(inputs.inheritanceAccord) ||
    patrimonyIndexBlocksInheritance(inputs.patrimonyIndex) ||
    legacyAccordBlocksPatrimony(inputs.legacyAccord);

  const band: Agent17EndowmentIndexSnapshot['band'] = depletedSignals
    ? 'depleted'
    : endowmentScore >= 45 &&
        inputs.inheritanceAccord.band === 'transmitted' &&
        inputs.patrimonyIndex.band === 'vested'
      ? 'funded'
      : 'pending';

  const endowmentFunded =
    band === 'funded' &&
    inputs.inheritanceAccord.inheritanceTransmitted &&
    !inheritanceAccordBlocksEndowment(inputs.inheritanceAccord);

  return {
    endowmentScore,
    band,
    allocations,
    inheritanceBand: inputs.inheritanceAccord.band,
    patrimonyBand: inputs.patrimonyIndex.band,
    endowmentFunded,
    headline: `Endowment ${band} (${endowmentScore}/100) · ${allocations.filter(a => a.funded).length}/${allocations.length} allocations`,
  };
}

export function endowmentIndexBlocksBeneficiary(
  snapshot: Agent17EndowmentIndexSnapshot
): boolean {
  return snapshot.band === 'depleted' || !snapshot.endowmentFunded;
}
