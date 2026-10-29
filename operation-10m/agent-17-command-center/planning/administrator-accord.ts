import type {
  Agent17AdministrationIndexSnapshot,
  Agent17AdministratorAccordSnapshot,
  Agent17ExecutorAccordSnapshot,
  Agent17ExecutorshipIndexSnapshot,
} from '../types/command-center-types.ts';
import { administrationIndexBlocksAdministrator } from './administration-index.ts';
import { executorAccordBlocksTrustee } from './executor-accord.ts';
import { executorshipIndexBlocksExecutor } from './executorship-index.ts';

export interface Agent17AdministratorAccordInputs {
  administrationIndex: Agent17AdministrationIndexSnapshot;
  executorAccord: Agent17ExecutorAccordSnapshot;
  executorshipIndex: Agent17ExecutorshipIndexSnapshot;
}

export function buildAgent17AdministratorAccord(
  inputs: Agent17AdministratorAccordInputs
): Agent17AdministratorAccordSnapshot {
  const commissions: Agent17AdministratorAccordSnapshot['commissions'] = [];

  commissions.push({
    id: 'administration_seated',
    label: 'Administration index administration-seated',
    delegated:
      inputs.administrationIndex.administrationSeated &&
      !administrationIndexBlocksAdministrator(inputs.administrationIndex),
    weight: 30,
  });

  commissions.push({
    id: 'administration_band',
    label: 'Administration seated or provisional',
    delegated:
      inputs.administrationIndex.band === 'seated' ||
      inputs.administrationIndex.band === 'provisional',
    weight: 25,
  });

  commissions.push({
    id: 'executor_appointed',
    label: 'Executor accord executor-ready',
    delegated:
      inputs.executorAccord.executorAppointed &&
      !executorAccordBlocksTrustee(inputs.executorAccord),
    weight: 20,
  });

  commissions.push({
    id: 'executorship_clear',
    label: 'Executorship index not blocking executor',
    delegated: !executorshipIndexBlocksExecutor(inputs.executorshipIndex),
    weight: 15,
  });

  commissions.push({
    id: 'administration_score',
    label: 'Administration score headroom',
    delegated: inputs.administrationIndex.administrationScore >= 2,
    weight: 10,
  });

  const weighted = commissions.reduce(
    (n, c) => n + (c.delegated ? 100 : 1) * (c.weight / 100),
    0
  );
  const totalWeight = commissions.reduce((n, c) => n + c.weight, 0);
  const administratorScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const revokedSignals =
    administrationIndexBlocksAdministrator(inputs.administrationIndex) ||
    executorAccordBlocksTrustee(inputs.executorAccord) ||
    executorshipIndexBlocksExecutor(inputs.executorshipIndex);

  const band: Agent17AdministratorAccordSnapshot['band'] = revokedSignals
    ? 'revoked'
    : administratorScore >= 40 &&
        inputs.administrationIndex.band === 'seated' &&
        inputs.executorAccord.band === 'appointed'
      ? 'commissioned'
      : 'acting';

  const administratorCommissioned =
    band === 'commissioned' &&
    inputs.administrationIndex.administrationSeated &&
    !administrationIndexBlocksAdministrator(inputs.administrationIndex);

  return {
    administratorScore,
    band,
    commissions,
    administrationBand: inputs.administrationIndex.band,
    executorBand: inputs.executorAccord.band,
    administratorCommissioned,
    headline: `Administrator ${band} (${administratorScore}/100) · ${commissions.filter(c => c.delegated).length}/${commissions.length} commissions`,
  };
}

export function administratorAccordBlocksExecutor(
  snapshot: Agent17AdministratorAccordSnapshot
): boolean {
  return snapshot.band === 'revoked' || !snapshot.administratorCommissioned;
}
