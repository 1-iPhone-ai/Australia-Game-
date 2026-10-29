import type {
  Agent17CuratorAccordSnapshot,
  Agent17OversightIndexSnapshot,
  Agent17SuperintendenceIndexSnapshot,
  Agent17SuperintendentAccordSnapshot,
} from '../types/command-center-types.ts';
import { curatorAccordBlocksAdministrator } from './curator-accord.ts';
import { superintendenceIndexBlocksSuperintendent } from './superintendence-index.ts';
import { superintendentAccordBlocksCurator } from './superintendent-accord.ts';

export interface Agent17OversightIndexInputs {
  superintendentAccord: Agent17SuperintendentAccordSnapshot;
  superintendenceIndex: Agent17SuperintendenceIndexSnapshot;
  curatorAccord: Agent17CuratorAccordSnapshot;
}

export function buildAgent17OversightIndex(
  inputs: Agent17OversightIndexInputs
): Agent17OversightIndexSnapshot {
  const mandates: Agent17OversightIndexSnapshot['mandates'] = [];

  mandates.push({
    id: 'superintendent_chartered',
    label: 'Superintendent accord superintendent-chartered',
    engaged:
      inputs.superintendentAccord.superintendentChartered &&
      !superintendentAccordBlocksCurator(inputs.superintendentAccord),
    weight: 30,
  });

  mandates.push({
    id: 'superintendent_band',
    label: 'Superintendent chartered or acting',
    engaged:
      inputs.superintendentAccord.band === 'chartered' ||
      inputs.superintendentAccord.band === 'acting',
    weight: 25,
  });

  mandates.push({
    id: 'superintendence_empowered',
    label: 'Superintendence index superintendence-empowered',
    engaged:
      inputs.superintendenceIndex.superintendenceEmpowered &&
      !superintendenceIndexBlocksSuperintendent(inputs.superintendenceIndex),
    weight: 20,
  });

  mandates.push({
    id: 'curator_clear',
    label: 'Curator accord not blocking administrator',
    engaged: !curatorAccordBlocksAdministrator(inputs.curatorAccord),
    weight: 15,
  });

  mandates.push({
    id: 'superintendence_score',
    label: 'Superintendence score headroom',
    engaged: inputs.superintendenceIndex.superintendenceScore >= 2,
    weight: 10,
  });

  const weighted = mandates.reduce(
    (n, m) => n + (m.engaged ? 100 : 1) * (m.weight / 100),
    0
  );
  const totalWeight = mandates.reduce((n, m) => n + m.weight, 0);
  const oversightScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const revokedSignals =
    superintendentAccordBlocksCurator(inputs.superintendentAccord) ||
    superintendenceIndexBlocksSuperintendent(inputs.superintendenceIndex) ||
    curatorAccordBlocksAdministrator(inputs.curatorAccord);

  const band: Agent17OversightIndexSnapshot['band'] = revokedSignals
    ? 'revoked'
    : oversightScore >= 43 &&
        inputs.superintendenceIndex.band === 'empowered' &&
        inputs.superintendentAccord.band === 'chartered'
      ? 'engaged'
      : 'tentative';

  const oversightEngaged =
    band === 'engaged' &&
    inputs.superintendentAccord.superintendentChartered &&
    !superintendentAccordBlocksCurator(inputs.superintendentAccord);

  return {
    oversightScore,
    band,
    mandates,
    superintendentBand: inputs.superintendentAccord.band,
    superintendenceBand: inputs.superintendenceIndex.band,
    oversightEngaged,
    headline: `Oversight ${band} (${oversightScore}/100) · ${mandates.filter(m => m.engaged).length}/${mandates.length} mandates`,
  };
}

export function oversightIndexBlocksOverseer(
  snapshot: Agent17OversightIndexSnapshot
): boolean {
  return snapshot.band === 'revoked' || !snapshot.oversightEngaged;
}
