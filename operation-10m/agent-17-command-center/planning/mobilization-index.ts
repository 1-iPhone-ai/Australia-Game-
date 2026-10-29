import type {
  Agent17CoordinationBrief,
  Agent17DispatchAccordSnapshot,
  Agent17ExecutionPacingSnapshot,
  Agent17MobilizationIndexSnapshot,
} from '../types/command-center-types.ts';
import { coordinationBriefReadyForGi } from './coordination-brief.ts';
import { dispatchAccordBlocksDispatch } from './dispatch-accord.ts';

export interface Agent17MobilizationIndexInputs {
  dispatchAccord: Agent17DispatchAccordSnapshot;
  coordinationBrief: Agent17CoordinationBrief;
  executionPacing: Agent17ExecutionPacingSnapshot;
}

export function buildAgent17MobilizationIndex(
  inputs: Agent17MobilizationIndexInputs
): Agent17MobilizationIndexSnapshot {
  const vectors: Agent17MobilizationIndexSnapshot['vectors'] = [];

  vectors.push({
    id: 'dispatch_ratified',
    label: 'Dispatch accord ratified or provisional',
    engaged:
      inputs.dispatchAccord.band === 'ratified' ||
      inputs.dispatchAccord.band === 'provisional',
    weight: 30,
  });

  vectors.push({
    id: 'dispatch_allowed',
    label: 'Dispatch lane open',
    engaged: inputs.dispatchAccord.dispatchAllowed && !dispatchAccordBlocksDispatch(inputs.dispatchAccord),
    weight: 25,
  });

  vectors.push({
    id: 'coordination_ready',
    label: 'Coordination brief GI-ready',
    engaged: coordinationBriefReadyForGi(inputs.coordinationBrief),
    weight: 20,
  });

  vectors.push({
    id: 'pacing_steady',
    label: 'Execution pacing not throttled',
    engaged:
      inputs.executionPacing.pacingBand !== 'throttled' &&
      inputs.executionPacing.canAdvanceActiveStep,
    weight: 15,
  });

  vectors.push({
    id: 'verify_gate',
    label: 'Verification gate open',
    engaged: inputs.executionPacing.verificationGateOpen,
    weight: 10,
  });

  const weighted = vectors.reduce(
    (n, v) => n + (v.engaged ? 100 : 14) * (v.weight / 100),
    0
  );
  const totalWeight = vectors.reduce((n, v) => n + v.weight, 0);
  const mobilizationScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const stalledSignals =
    dispatchAccordBlocksDispatch(inputs.dispatchAccord) ||
    inputs.dispatchAccord.band === 'void' ||
    inputs.executionPacing.pacingBand === 'throttled';

  const band: Agent17MobilizationIndexSnapshot['band'] = stalledSignals
    ? 'stalled'
    : mobilizationScore >= 72 &&
        inputs.dispatchAccord.band === 'ratified' &&
        coordinationBriefReadyForGi(inputs.coordinationBrief)
      ? 'mobilized'
      : 'forming';

  const fieldReady =
    band === 'mobilized' &&
    inputs.dispatchAccord.dispatchAllowed &&
    !dispatchAccordBlocksDispatch(inputs.dispatchAccord);

  return {
    mobilizationScore,
    band,
    vectors,
    accordBand: inputs.dispatchAccord.band,
    pacingBand: inputs.executionPacing.pacingBand,
    fieldReady,
    headline: `Mobilization ${band} (${mobilizationScore}/100) · ${vectors.filter(v => v.engaged).length}/${vectors.length} vectors`,
  };
}

export function mobilizationIndexBlocksSummons(snapshot: Agent17MobilizationIndexSnapshot): boolean {
  return snapshot.band === 'stalled' || !snapshot.fieldReady;
}
