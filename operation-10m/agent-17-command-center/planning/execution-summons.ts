import type {
  Agent17DispatchAccordSnapshot,
  Agent17ExecutionSummonsSnapshot,
  Agent17MissionDirectiveSnapshot,
  Agent17MobilizationIndexSnapshot,
} from '../types/command-center-types.ts';
import { dispatchAccordBlocksDispatch } from './dispatch-accord.ts';
import { mobilizationIndexBlocksSummons } from './mobilization-index.ts';

export interface Agent17ExecutionSummonsInputs {
  mobilizationIndex: Agent17MobilizationIndexSnapshot;
  dispatchAccord: Agent17DispatchAccordSnapshot;
  missionDirective: Agent17MissionDirectiveSnapshot;
}

export function buildAgent17ExecutionSummons(
  inputs: Agent17ExecutionSummonsInputs
): Agent17ExecutionSummonsSnapshot {
  const clauses: Agent17ExecutionSummonsSnapshot['clauses'] = [];

  clauses.push({
    id: 'mobilization_ready',
    label: 'Mobilization field-ready',
    satisfied: inputs.mobilizationIndex.fieldReady && !mobilizationIndexBlocksSummons(inputs.mobilizationIndex),
    weight: 30,
  });

  clauses.push({
    id: 'mobilization_band',
    label: 'Mobilization mobilized or forming',
    satisfied:
      inputs.mobilizationIndex.band === 'mobilized' ||
      inputs.mobilizationIndex.band === 'forming',
    weight: 25,
  });

  clauses.push({
    id: 'directive_active',
    label: 'Mission directive not held',
    satisfied: inputs.missionDirective.band !== 'held',
    weight: 20,
  });

  clauses.push({
    id: 'accord_dispatch',
    label: 'Dispatch accord allows dispatch',
    satisfied:
      inputs.dispatchAccord.dispatchAllowed && !dispatchAccordBlocksDispatch(inputs.dispatchAccord),
    weight: 15,
  });

  clauses.push({
    id: 'directive_priority',
    label: 'Mission directive clearance headroom',
    satisfied: inputs.missionDirective.clearanceScore >= 40,
    weight: 10,
  });

  const weighted = clauses.reduce(
    (n, c) => n + (c.satisfied ? 100 : 12) * (c.weight / 100),
    0
  );
  const totalWeight = clauses.reduce((n, c) => n + c.weight, 0);
  const summonsScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const revokedSignals =
    mobilizationIndexBlocksSummons(inputs.mobilizationIndex) ||
    dispatchAccordBlocksDispatch(inputs.dispatchAccord) ||
    inputs.missionDirective.band === 'held';

  const band: Agent17ExecutionSummonsSnapshot['band'] = revokedSignals
    ? 'revoked'
    : summonsScore >= 70 &&
        inputs.mobilizationIndex.band === 'mobilized' &&
        !mobilizationIndexBlocksSummons(inputs.mobilizationIndex)
      ? 'issued'
      : 'pending';

  const executionAuthorized =
    band === 'issued' &&
    inputs.mobilizationIndex.fieldReady &&
    inputs.dispatchAccord.dispatchAllowed;

  return {
    summonsScore,
    band,
    clauses,
    mobilizationBand: inputs.mobilizationIndex.band,
    directiveBand: inputs.missionDirective.band,
    executionAuthorized,
    headline: `Summons ${band} (${summonsScore}/100) · ${clauses.filter(c => c.satisfied).length}/${clauses.length} clauses`,
  };
}

export function executionSummonsBlocksField(snapshot: Agent17ExecutionSummonsSnapshot): boolean {
  return snapshot.band === 'revoked' || !snapshot.executionAuthorized;
}
