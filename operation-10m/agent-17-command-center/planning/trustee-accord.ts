import type {
  Agent17FiduciaryIndexSnapshot,
  Agent17StewardAccordSnapshot,
  Agent17StewardshipIndexSnapshot,
  Agent17TrusteeAccordSnapshot,
} from '../types/command-center-types.ts';
import { fiduciaryIndexBlocksTrustee } from './fiduciary-index.ts';
import { stewardAccordBlocksFiduciary } from './steward-accord.ts';
import { stewardshipIndexBlocksSteward } from './stewardship-index.ts';

export interface Agent17TrusteeAccordInputs {
  fiduciaryIndex: Agent17FiduciaryIndexSnapshot;
  stewardAccord: Agent17StewardAccordSnapshot;
  stewardshipIndex: Agent17StewardshipIndexSnapshot;
}

export function buildAgent17TrusteeAccord(
  inputs: Agent17TrusteeAccordInputs
): Agent17TrusteeAccordSnapshot {
  const instruments: Agent17TrusteeAccordSnapshot['instruments'] = [];

  instruments.push({
    id: 'fiduciary_bound',
    label: 'Fiduciary index fiduciary-bound',
    installed:
      inputs.fiduciaryIndex.fiduciaryBound &&
      !fiduciaryIndexBlocksTrustee(inputs.fiduciaryIndex),
    weight: 30,
  });

  instruments.push({
    id: 'fiduciary_band',
    label: 'Fiduciary bound or pending',
    installed:
      inputs.fiduciaryIndex.band === 'bound' || inputs.fiduciaryIndex.band === 'pending',
    weight: 25,
  });

  instruments.push({
    id: 'steward_commissioned',
    label: 'Steward accord steward-ready',
    installed:
      inputs.stewardAccord.stewardCommissioned &&
      !stewardAccordBlocksFiduciary(inputs.stewardAccord),
    weight: 20,
  });

  instruments.push({
    id: 'stewardship_clear',
    label: 'Stewardship index not blocking steward',
    installed: !stewardshipIndexBlocksSteward(inputs.stewardshipIndex),
    weight: 15,
  });

  instruments.push({
    id: 'fiduciary_score',
    label: 'Fiduciary score headroom',
    installed: inputs.fiduciaryIndex.fiduciaryScore >= 1,
    weight: 10,
  });

  const weighted = instruments.reduce(
    (n, i) => n + (i.installed ? 100 : 1) * (i.weight / 100),
    0
  );
  const totalWeight = instruments.reduce((n, i) => n + i.weight, 0);
  const trusteeScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const removedSignals =
    fiduciaryIndexBlocksTrustee(inputs.fiduciaryIndex) ||
    stewardAccordBlocksFiduciary(inputs.stewardAccord) ||
    stewardshipIndexBlocksSteward(inputs.stewardshipIndex);

  const band: Agent17TrusteeAccordSnapshot['band'] = removedSignals
    ? 'removed'
    : trusteeScore >= 40 &&
        inputs.fiduciaryIndex.band === 'bound' &&
        inputs.stewardAccord.band === 'commissioned'
      ? 'installed'
      : 'acting';

  const trusteeInstalled =
    band === 'installed' &&
    inputs.fiduciaryIndex.fiduciaryBound &&
    !stewardshipIndexBlocksSteward(inputs.stewardshipIndex);

  return {
    trusteeScore,
    band,
    instruments,
    fiduciaryBand: inputs.fiduciaryIndex.band,
    stewardBand: inputs.stewardAccord.band,
    trusteeInstalled,
    headline: `Trustee ${band} (${trusteeScore}/100) · ${instruments.filter(i => i.installed).length}/${instruments.length} instruments`,
  };
}

export function trusteeAccordBlocksFiduciary(snapshot: Agent17TrusteeAccordSnapshot): boolean {
  return snapshot.band === 'removed' || !snapshot.trusteeInstalled;
}
