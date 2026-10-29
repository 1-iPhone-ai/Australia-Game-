import type {
  Agent17AdministratorAccordSnapshot,
  Agent17AdministrationIndexSnapshot,
  Agent17CuratorAccordSnapshot,
  Agent17CuratorshipIndexSnapshot,
} from '../types/command-center-types.ts';
import { administratorAccordBlocksExecutor } from './administrator-accord.ts';
import { administrationIndexBlocksAdministrator } from './administration-index.ts';
import { curatorshipIndexBlocksCurator } from './curatorship-index.ts';

export interface Agent17CuratorAccordInputs {
  curatorshipIndex: Agent17CuratorshipIndexSnapshot;
  administratorAccord: Agent17AdministratorAccordSnapshot;
  administrationIndex: Agent17AdministrationIndexSnapshot;
}

export function buildAgent17CuratorAccord(
  inputs: Agent17CuratorAccordInputs
): Agent17CuratorAccordSnapshot {
  const assignments: Agent17CuratorAccordSnapshot['assignments'] = [];

  assignments.push({
    id: 'curatorship_entrusted',
    label: 'Curatorship index curatorship-entrusted',
    inducted:
      inputs.curatorshipIndex.curatorshipEntrusted &&
      !curatorshipIndexBlocksCurator(inputs.curatorshipIndex),
    weight: 30,
  });

  assignments.push({
    id: 'curatorship_band',
    label: 'Curatorship entrusted or provisional',
    inducted:
      inputs.curatorshipIndex.band === 'entrusted' ||
      inputs.curatorshipIndex.band === 'provisional',
    weight: 25,
  });

  assignments.push({
    id: 'administrator_commissioned',
    label: 'Administrator accord administrator-ready',
    inducted:
      inputs.administratorAccord.administratorCommissioned &&
      !administratorAccordBlocksExecutor(inputs.administratorAccord),
    weight: 20,
  });

  assignments.push({
    id: 'administration_clear',
    label: 'Administration index not blocking administrator',
    inducted: !administrationIndexBlocksAdministrator(inputs.administrationIndex),
    weight: 15,
  });

  assignments.push({
    id: 'curatorship_score',
    label: 'Curatorship score headroom',
    inducted: inputs.curatorshipIndex.curatorshipScore >= 2,
    weight: 10,
  });

  const weighted = assignments.reduce(
    (n, a) => n + (a.inducted ? 100 : 1) * (a.weight / 100),
    0
  );
  const totalWeight = assignments.reduce((n, a) => n + a.weight, 0);
  const curatorScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const recusedSignals =
    curatorshipIndexBlocksCurator(inputs.curatorshipIndex) ||
    administratorAccordBlocksExecutor(inputs.administratorAccord) ||
    administrationIndexBlocksAdministrator(inputs.administrationIndex);

  const band: Agent17CuratorAccordSnapshot['band'] = recusedSignals
    ? 'recused'
    : curatorScore >= 41 &&
        inputs.curatorshipIndex.band === 'entrusted' &&
        inputs.administratorAccord.band === 'commissioned'
      ? 'inducted'
      : 'serving';

  const curatorInducted =
    band === 'inducted' &&
    inputs.curatorshipIndex.curatorshipEntrusted &&
    !curatorshipIndexBlocksCurator(inputs.curatorshipIndex);

  return {
    curatorScore,
    band,
    assignments,
    curatorshipBand: inputs.curatorshipIndex.band,
    administratorBand: inputs.administratorAccord.band,
    curatorInducted,
    headline: `Curator ${band} (${curatorScore}/100) · ${assignments.filter(a => a.inducted).length}/${assignments.length} assignments`,
  };
}

export function curatorAccordBlocksAdministrator(
  snapshot: Agent17CuratorAccordSnapshot
): boolean {
  return snapshot.band === 'recused' || !snapshot.curatorInducted;
}
