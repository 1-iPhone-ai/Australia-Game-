import type {
  Agent17AdministrationIndexSnapshot,
  Agent17ExecutorAccordSnapshot,
  Agent17ExecutorshipIndexSnapshot,
  Agent17TrusteeAccordSnapshot,
} from '../types/command-center-types.ts';
import { executorAccordBlocksTrustee } from './executor-accord.ts';
import { executorshipIndexBlocksExecutor } from './executorship-index.ts';
import { trusteeAccordBlocksFiduciary } from './trustee-accord.ts';

export interface Agent17AdministrationIndexInputs {
  executorAccord: Agent17ExecutorAccordSnapshot;
  executorshipIndex: Agent17ExecutorshipIndexSnapshot;
  trusteeAccord: Agent17TrusteeAccordSnapshot;
}

export function buildAgent17AdministrationIndex(
  inputs: Agent17AdministrationIndexInputs
): Agent17AdministrationIndexSnapshot {
  const mandates: Agent17AdministrationIndexSnapshot['mandates'] = [];

  mandates.push({
    id: 'executor_appointed',
    label: 'Executor accord executor-appointed',
    seated:
      inputs.executorAccord.executorAppointed &&
      !executorAccordBlocksTrustee(inputs.executorAccord),
    weight: 30,
  });

  mandates.push({
    id: 'executor_band',
    label: 'Executor appointed or acting',
    seated:
      inputs.executorAccord.band === 'appointed' || inputs.executorAccord.band === 'acting',
    weight: 25,
  });

  mandates.push({
    id: 'executorship_empowered',
    label: 'Executorship index executorship-empowered',
    seated:
      inputs.executorshipIndex.executorshipEmpowered &&
      !executorshipIndexBlocksExecutor(inputs.executorshipIndex),
    weight: 20,
  });

  mandates.push({
    id: 'trustee_clear',
    label: 'Trustee accord not blocking fiduciary',
    seated: !trusteeAccordBlocksFiduciary(inputs.trusteeAccord),
    weight: 15,
  });

  mandates.push({
    id: 'executor_score',
    label: 'Executor score headroom',
    seated: inputs.executorAccord.executorScore >= 3,
    weight: 10,
  });

  const weighted = mandates.reduce(
    (n, m) => n + (m.seated ? 100 : 1) * (m.weight / 100),
    0
  );
  const totalWeight = mandates.reduce((n, m) => n + m.weight, 0);
  const administrationScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const dissolvedSignals =
    executorAccordBlocksTrustee(inputs.executorAccord) ||
    executorshipIndexBlocksExecutor(inputs.executorshipIndex) ||
    trusteeAccordBlocksFiduciary(inputs.trusteeAccord);

  const band: Agent17AdministrationIndexSnapshot['band'] = dissolvedSignals
    ? 'dissolved'
    : administrationScore >= 43 &&
        inputs.executorAccord.band === 'appointed' &&
        inputs.executorshipIndex.band === 'empowered'
      ? 'seated'
      : 'provisional';

  const administrationSeated =
    band === 'seated' &&
    inputs.executorAccord.executorAppointed &&
    !executorAccordBlocksTrustee(inputs.executorAccord);

  return {
    administrationScore,
    band,
    mandates,
    executorshipBand: inputs.executorshipIndex.band,
    executorBand: inputs.executorAccord.band,
    administrationSeated,
    headline: `Administration ${band} (${administrationScore}/100) · ${mandates.filter(m => m.seated).length}/${mandates.length} mandates`,
  };
}

export function administrationIndexBlocksAdministrator(
  snapshot: Agent17AdministrationIndexSnapshot
): boolean {
  return snapshot.band === 'dissolved' || !snapshot.administrationSeated;
}
