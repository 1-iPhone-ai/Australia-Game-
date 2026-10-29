import type {
  Agent17AdministrationIndexSnapshot,
  Agent17AdministratorAccordSnapshot,
  Agent17CuratorshipIndexSnapshot,
  Agent17ExecutorAccordSnapshot,
} from '../types/command-center-types.ts';
import { administratorAccordBlocksExecutor } from './administrator-accord.ts';
import { administrationIndexBlocksAdministrator } from './administration-index.ts';
import { executorAccordBlocksTrustee } from './executor-accord.ts';

export interface Agent17CuratorshipIndexInputs {
  administratorAccord: Agent17AdministratorAccordSnapshot;
  administrationIndex: Agent17AdministrationIndexSnapshot;
  executorAccord: Agent17ExecutorAccordSnapshot;
}

export function buildAgent17CuratorshipIndex(
  inputs: Agent17CuratorshipIndexInputs
): Agent17CuratorshipIndexSnapshot {
  const custodies: Agent17CuratorshipIndexSnapshot['custodies'] = [];

  custodies.push({
    id: 'administrator_commissioned',
    label: 'Administrator accord administrator-commissioned',
    entrusted:
      inputs.administratorAccord.administratorCommissioned &&
      !administratorAccordBlocksExecutor(inputs.administratorAccord),
    weight: 30,
  });

  custodies.push({
    id: 'administrator_band',
    label: 'Administrator commissioned or acting',
    entrusted:
      inputs.administratorAccord.band === 'commissioned' ||
      inputs.administratorAccord.band === 'acting',
    weight: 25,
  });

  custodies.push({
    id: 'administration_seated',
    label: 'Administration index administration-seated',
    entrusted:
      inputs.administrationIndex.administrationSeated &&
      !administrationIndexBlocksAdministrator(inputs.administrationIndex),
    weight: 20,
  });

  custodies.push({
    id: 'executor_clear',
    label: 'Executor accord not blocking trustee',
    entrusted: !executorAccordBlocksTrustee(inputs.executorAccord),
    weight: 15,
  });

  custodies.push({
    id: 'administrator_score',
    label: 'Administrator score headroom',
    entrusted: inputs.administratorAccord.administratorScore >= 3,
    weight: 10,
  });

  const weighted = custodies.reduce(
    (n, c) => n + (c.entrusted ? 100 : 1) * (c.weight / 100),
    0
  );
  const totalWeight = custodies.reduce((n, c) => n + c.weight, 0);
  const curatorshipScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const surrenderedSignals =
    administratorAccordBlocksExecutor(inputs.administratorAccord) ||
    administrationIndexBlocksAdministrator(inputs.administrationIndex) ||
    executorAccordBlocksTrustee(inputs.executorAccord);

  const band: Agent17CuratorshipIndexSnapshot['band'] = surrenderedSignals
    ? 'surrendered'
    : curatorshipScore >= 44 &&
        inputs.administratorAccord.band === 'commissioned' &&
        inputs.administrationIndex.band === 'seated'
      ? 'entrusted'
      : 'provisional';

  const curatorshipEntrusted =
    band === 'entrusted' &&
    inputs.administratorAccord.administratorCommissioned &&
    !administratorAccordBlocksExecutor(inputs.administratorAccord);

  return {
    curatorshipScore,
    band,
    custodies,
    administrationBand: inputs.administrationIndex.band,
    administratorBand: inputs.administratorAccord.band,
    curatorshipEntrusted,
    headline: `Curatorship ${band} (${curatorshipScore}/100) · ${custodies.filter(c => c.entrusted).length}/${custodies.length} custodies`,
  };
}

export function curatorshipIndexBlocksCurator(
  snapshot: Agent17CuratorshipIndexSnapshot
): boolean {
  return snapshot.band === 'surrendered' || !snapshot.curatorshipEntrusted;
}
