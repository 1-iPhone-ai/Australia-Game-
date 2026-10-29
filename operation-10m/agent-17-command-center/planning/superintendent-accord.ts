import type {
  Agent17CuratorAccordSnapshot,
  Agent17CuratorshipIndexSnapshot,
  Agent17SuperintendenceIndexSnapshot,
  Agent17SuperintendentAccordSnapshot,
} from '../types/command-center-types.ts';
import { curatorAccordBlocksAdministrator } from './curator-accord.ts';
import { curatorshipIndexBlocksCurator } from './curatorship-index.ts';
import { superintendenceIndexBlocksSuperintendent } from './superintendence-index.ts';

export interface Agent17SuperintendentAccordInputs {
  superintendenceIndex: Agent17SuperintendenceIndexSnapshot;
  curatorAccord: Agent17CuratorAccordSnapshot;
  curatorshipIndex: Agent17CuratorshipIndexSnapshot;
}

export function buildAgent17SuperintendentAccord(
  inputs: Agent17SuperintendentAccordInputs
): Agent17SuperintendentAccordSnapshot {
  const directives: Agent17SuperintendentAccordSnapshot['directives'] = [];

  directives.push({
    id: 'superintendence_empowered',
    label: 'Superintendence index superintendence-empowered',
    chartered:
      inputs.superintendenceIndex.superintendenceEmpowered &&
      !superintendenceIndexBlocksSuperintendent(inputs.superintendenceIndex),
    weight: 30,
  });

  directives.push({
    id: 'superintendence_band',
    label: 'Superintendence empowered or provisional',
    chartered:
      inputs.superintendenceIndex.band === 'empowered' ||
      inputs.superintendenceIndex.band === 'provisional',
    weight: 25,
  });

  directives.push({
    id: 'curator_inducted',
    label: 'Curator accord curator-ready',
    chartered:
      inputs.curatorAccord.curatorInducted &&
      !curatorAccordBlocksAdministrator(inputs.curatorAccord),
    weight: 20,
  });

  directives.push({
    id: 'curatorship_clear',
    label: 'Curatorship index not blocking curator',
    chartered: !curatorshipIndexBlocksCurator(inputs.curatorshipIndex),
    weight: 15,
  });

  directives.push({
    id: 'superintendence_score',
    label: 'Superintendence score headroom',
    chartered: inputs.superintendenceIndex.superintendenceScore >= 2,
    weight: 10,
  });

  const weighted = directives.reduce(
    (n, d) => n + (d.chartered ? 100 : 1) * (d.weight / 100),
    0
  );
  const totalWeight = directives.reduce((n, d) => n + d.weight, 0);
  const superintendentScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const suspendedSignals =
    superintendenceIndexBlocksSuperintendent(inputs.superintendenceIndex) ||
    curatorAccordBlocksAdministrator(inputs.curatorAccord) ||
    curatorshipIndexBlocksCurator(inputs.curatorshipIndex);

  const band: Agent17SuperintendentAccordSnapshot['band'] = suspendedSignals
    ? 'suspended'
    : superintendentScore >= 41 &&
        inputs.superintendenceIndex.band === 'empowered' &&
        inputs.curatorAccord.band === 'inducted'
      ? 'chartered'
      : 'acting';

  const superintendentChartered =
    band === 'chartered' &&
    inputs.superintendenceIndex.superintendenceEmpowered &&
    !superintendenceIndexBlocksSuperintendent(inputs.superintendenceIndex);

  return {
    superintendentScore,
    band,
    directives,
    superintendenceBand: inputs.superintendenceIndex.band,
    curatorBand: inputs.curatorAccord.band,
    superintendentChartered,
    headline: `Superintendent ${band} (${superintendentScore}/100) · ${directives.filter(d => d.chartered).length}/${directives.length} directives`,
  };
}

export function superintendentAccordBlocksCurator(
  snapshot: Agent17SuperintendentAccordSnapshot
): boolean {
  return snapshot.band === 'suspended' || !snapshot.superintendentChartered;
}
