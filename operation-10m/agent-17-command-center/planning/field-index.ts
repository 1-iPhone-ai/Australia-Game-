import type {
  Agent17CoordinationBrief,
  Agent17ExecutionClosureSnapshot,
  Agent17ExecutionSummonsSnapshot,
  Agent17FieldIndexSnapshot,
} from '../types/command-center-types.ts';
import { coordinationBriefReadyForGi } from './coordination-brief.ts';
import { executionSummonsBlocksField } from './execution-summons.ts';

export interface Agent17FieldIndexInputs {
  executionSummons: Agent17ExecutionSummonsSnapshot;
  coordinationBrief: Agent17CoordinationBrief;
  executionClosure: Agent17ExecutionClosureSnapshot;
}

export function buildAgent17FieldIndex(inputs: Agent17FieldIndexInputs): Agent17FieldIndexSnapshot {
  const vectors: Agent17FieldIndexSnapshot['vectors'] = [];

  vectors.push({
    id: 'summons_authorized',
    label: 'Execution summons authorized',
    engaged:
      inputs.executionSummons.executionAuthorized &&
      !executionSummonsBlocksField(inputs.executionSummons),
    weight: 30,
  });

  vectors.push({
    id: 'summons_issued',
    label: 'Summons issued or pending',
    engaged:
      inputs.executionSummons.band === 'issued' || inputs.executionSummons.band === 'pending',
    weight: 25,
  });

  vectors.push({
    id: 'coordination_ready',
    label: 'Coordination brief GI-ready',
    engaged: coordinationBriefReadyForGi(inputs.coordinationBrief),
    weight: 20,
  });

  vectors.push({
    id: 'closure_open',
    label: 'Execution closure not sealed',
    engaged:
      inputs.executionClosure.band !== 'sealed' && inputs.executionClosure.automationClearance,
    weight: 15,
  });

  vectors.push({
    id: 'closure_score',
    label: 'Closure score headroom',
    engaged: inputs.executionClosure.closureScore >= 42,
    weight: 10,
  });

  const weighted = vectors.reduce(
    (n, v) => n + (v.engaged ? 100 : 13) * (v.weight / 100),
    0
  );
  const totalWeight = vectors.reduce((n, v) => n + v.weight, 0);
  const fieldScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const contestedSignals =
    executionSummonsBlocksField(inputs.executionSummons) ||
    inputs.executionSummons.band === 'revoked' ||
    inputs.executionClosure.band === 'sealed';

  const band: Agent17FieldIndexSnapshot['band'] = contestedSignals
    ? 'contested'
    : fieldScore >= 71 &&
        inputs.executionSummons.band === 'issued' &&
        coordinationBriefReadyForGi(inputs.coordinationBrief)
      ? 'engaged'
      : 'staging';

  const theaterReady =
    band === 'engaged' &&
    inputs.executionSummons.executionAuthorized &&
    !executionSummonsBlocksField(inputs.executionSummons);

  return {
    fieldScore,
    band,
    vectors,
    summonsBand: inputs.executionSummons.band,
    closureBand: inputs.executionClosure.band,
    theaterReady,
    headline: `Field ${band} (${fieldScore}/100) · ${vectors.filter(v => v.engaged).length}/${vectors.length} vectors`,
  };
}

export function fieldIndexBlocksCommitment(snapshot: Agent17FieldIndexSnapshot): boolean {
  return snapshot.band === 'contested' || !snapshot.theaterReady;
}
