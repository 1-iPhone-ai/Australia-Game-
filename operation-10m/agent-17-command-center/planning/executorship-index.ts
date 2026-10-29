import type {
  Agent17ExecutorshipIndexSnapshot,
  Agent17FiduciaryIndexSnapshot,
  Agent17StewardAccordSnapshot,
  Agent17TrusteeAccordSnapshot,
} from '../types/command-center-types.ts';
import { fiduciaryIndexBlocksTrustee } from './fiduciary-index.ts';
import { stewardAccordBlocksFiduciary } from './steward-accord.ts';
import { trusteeAccordBlocksFiduciary } from './trustee-accord.ts';

export interface Agent17ExecutorshipIndexInputs {
  trusteeAccord: Agent17TrusteeAccordSnapshot;
  fiduciaryIndex: Agent17FiduciaryIndexSnapshot;
  stewardAccord: Agent17StewardAccordSnapshot;
}

export function buildAgent17ExecutorshipIndex(
  inputs: Agent17ExecutorshipIndexInputs
): Agent17ExecutorshipIndexSnapshot {
  const charges: Agent17ExecutorshipIndexSnapshot['charges'] = [];

  charges.push({
    id: 'trustee_installed',
    label: 'Trustee accord trustee-installed',
    empowered:
      inputs.trusteeAccord.trusteeInstalled &&
      !trusteeAccordBlocksFiduciary(inputs.trusteeAccord),
    weight: 30,
  });

  charges.push({
    id: 'trustee_band',
    label: 'Trustee installed or acting',
    empowered:
      inputs.trusteeAccord.band === 'installed' || inputs.trusteeAccord.band === 'acting',
    weight: 25,
  });

  charges.push({
    id: 'fiduciary_bound',
    label: 'Fiduciary index fiduciary-bound',
    empowered:
      inputs.fiduciaryIndex.fiduciaryBound &&
      !fiduciaryIndexBlocksTrustee(inputs.fiduciaryIndex),
    weight: 20,
  });

  charges.push({
    id: 'steward_clear',
    label: 'Steward accord not blocking fiduciary',
    empowered: !stewardAccordBlocksFiduciary(inputs.stewardAccord),
    weight: 15,
  });

  charges.push({
    id: 'trustee_score',
    label: 'Trustee score headroom',
    empowered: inputs.trusteeAccord.trusteeScore >= 3,
    weight: 10,
  });

  const weighted = charges.reduce(
    (n, c) => n + (c.empowered ? 100 : 1) * (c.weight / 100),
    0
  );
  const totalWeight = charges.reduce((n, c) => n + c.weight, 0);
  const executorshipScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const vacatedSignals =
    trusteeAccordBlocksFiduciary(inputs.trusteeAccord) ||
    fiduciaryIndexBlocksTrustee(inputs.fiduciaryIndex) ||
    stewardAccordBlocksFiduciary(inputs.stewardAccord);

  const band: Agent17ExecutorshipIndexSnapshot['band'] = vacatedSignals
    ? 'vacated'
    : executorshipScore >= 42 &&
        inputs.trusteeAccord.band === 'installed' &&
        inputs.fiduciaryIndex.band === 'bound'
      ? 'empowered'
      : 'pending';

  const executorshipEmpowered =
    band === 'empowered' &&
    inputs.trusteeAccord.trusteeInstalled &&
    !trusteeAccordBlocksFiduciary(inputs.trusteeAccord);

  return {
    executorshipScore,
    band,
    charges,
    fiduciaryBand: inputs.fiduciaryIndex.band,
    trusteeBand: inputs.trusteeAccord.band,
    executorshipEmpowered,
    headline: `Executorship ${band} (${executorshipScore}/100) · ${charges.filter(c => c.empowered).length}/${charges.length} charges`,
  };
}

export function executorshipIndexBlocksExecutor(
  snapshot: Agent17ExecutorshipIndexSnapshot
): boolean {
  return snapshot.band === 'vacated' || !snapshot.executorshipEmpowered;
}
