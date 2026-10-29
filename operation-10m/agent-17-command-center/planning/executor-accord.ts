import type {
  Agent17ExecutorshipIndexSnapshot,
  Agent17ExecutorAccordSnapshot,
  Agent17FiduciaryIndexSnapshot,
  Agent17TrusteeAccordSnapshot,
} from '../types/command-center-types.ts';
import { executorshipIndexBlocksExecutor } from './executorship-index.ts';
import { fiduciaryIndexBlocksTrustee } from './fiduciary-index.ts';
import { trusteeAccordBlocksFiduciary } from './trustee-accord.ts';

export interface Agent17ExecutorAccordInputs {
  executorshipIndex: Agent17ExecutorshipIndexSnapshot;
  trusteeAccord: Agent17TrusteeAccordSnapshot;
  fiduciaryIndex: Agent17FiduciaryIndexSnapshot;
}

export function buildAgent17ExecutorAccord(
  inputs: Agent17ExecutorAccordInputs
): Agent17ExecutorAccordSnapshot {
  const warrants: Agent17ExecutorAccordSnapshot['warrants'] = [];

  warrants.push({
    id: 'executorship_empowered',
    label: 'Executorship index executorship-empowered',
    appointed:
      inputs.executorshipIndex.executorshipEmpowered &&
      !executorshipIndexBlocksExecutor(inputs.executorshipIndex),
    weight: 30,
  });

  warrants.push({
    id: 'executorship_band',
    label: 'Executorship empowered or pending',
    appointed:
      inputs.executorshipIndex.band === 'empowered' ||
      inputs.executorshipIndex.band === 'pending',
    weight: 25,
  });

  warrants.push({
    id: 'trustee_installed',
    label: 'Trustee accord trustee-ready',
    appointed:
      inputs.trusteeAccord.trusteeInstalled &&
      !trusteeAccordBlocksFiduciary(inputs.trusteeAccord),
    weight: 20,
  });

  warrants.push({
    id: 'fiduciary_clear',
    label: 'Fiduciary index not blocking trustee',
    appointed: !fiduciaryIndexBlocksTrustee(inputs.fiduciaryIndex),
    weight: 15,
  });

  warrants.push({
    id: 'executorship_score',
    label: 'Executorship score headroom',
    appointed: inputs.executorshipIndex.executorshipScore >= 2,
    weight: 10,
  });

  const weighted = warrants.reduce(
    (n, w) => n + (w.appointed ? 100 : 1) * (w.weight / 100),
    0
  );
  const totalWeight = warrants.reduce((n, w) => n + w.weight, 0);
  const executorScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const dischargedSignals =
    executorshipIndexBlocksExecutor(inputs.executorshipIndex) ||
    trusteeAccordBlocksFiduciary(inputs.trusteeAccord) ||
    fiduciaryIndexBlocksTrustee(inputs.fiduciaryIndex);

  const band: Agent17ExecutorAccordSnapshot['band'] = dischargedSignals
    ? 'discharged'
    : executorScore >= 41 &&
        inputs.executorshipIndex.band === 'empowered' &&
        inputs.trusteeAccord.band === 'installed'
      ? 'appointed'
      : 'acting';

  const executorAppointed =
    band === 'appointed' &&
    inputs.executorshipIndex.executorshipEmpowered &&
    !executorshipIndexBlocksExecutor(inputs.executorshipIndex);

  return {
    executorScore,
    band,
    warrants,
    executorshipBand: inputs.executorshipIndex.band,
    trusteeBand: inputs.trusteeAccord.band,
    executorAppointed,
    headline: `Executor ${band} (${executorScore}/100) · ${warrants.filter(w => w.appointed).length}/${warrants.length} warrants`,
  };
}

export function executorAccordBlocksTrustee(snapshot: Agent17ExecutorAccordSnapshot): boolean {
  return snapshot.band === 'discharged' || !snapshot.executorAppointed;
}
