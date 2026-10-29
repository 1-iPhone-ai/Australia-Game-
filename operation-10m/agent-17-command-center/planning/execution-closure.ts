import type {
  Agent17DirectiveSynthesisSnapshot,
  Agent17ExecutionClosureSnapshot,
  Agent17ExecutionPacingSnapshot,
  Agent17MissionDirectiveSnapshot,
} from '../types/command-center-types.ts';
import { directiveSynthesisBlocksAdvance } from './directive-synthesis.ts';

export interface Agent17ExecutionClosureInputs {
  directiveSynthesis: Agent17DirectiveSynthesisSnapshot;
  executionPacing: Agent17ExecutionPacingSnapshot;
  missionDirective: Agent17MissionDirectiveSnapshot;
}

export function buildAgent17ExecutionClosure(
  inputs: Agent17ExecutionClosureInputs
): Agent17ExecutionClosureSnapshot {
  const checkpoints: Agent17ExecutionClosureSnapshot['checkpoints'] = [];

  checkpoints.push({
    id: 'synthesis_ready',
    label: 'Directive synthesis ready',
    satisfied: inputs.directiveSynthesis.band === 'ready',
    weight: 30,
  });

  checkpoints.push({
    id: 'pacing_gate',
    label: 'Execution pacing gate open',
    satisfied:
      inputs.executionPacing.canAdvanceActiveStep &&
      inputs.executionPacing.pacingBand !== 'throttled',
    weight: 25,
  });

  checkpoints.push({
    id: 'directive_exec',
    label: 'Mission directive allows execution',
    satisfied: inputs.missionDirective.executionAllowed,
    weight: 25,
  });

  checkpoints.push({
    id: 'turn_budget',
    label: 'Turn budget available',
    satisfied: inputs.executionPacing.turnBudgetRemaining >= 1,
    weight: 10,
  });

  checkpoints.push({
    id: 'verify_gate',
    label: 'Verification gate open',
    satisfied: inputs.executionPacing.verificationGateOpen,
    weight: 10,
  });

  const weighted = checkpoints.reduce(
    (n, c) => n + (c.satisfied ? 100 : 15) * (c.weight / 100),
    0
  );
  const totalWeight = checkpoints.reduce((n, c) => n + c.weight, 0);
  const closureScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const stepsReadyToClose = Math.max(
    0,
    inputs.executionPacing.stepsRemaining -
      (inputs.executionPacing.pacingBand === 'throttled' ? 2 : 0)
  );

  const sealedSignals =
    directiveSynthesisBlocksAdvance(inputs.directiveSynthesis) ||
    inputs.missionDirective.band === 'held';

  const narrowSignals =
    !sealedSignals &&
    (closureScore < 62 ||
      !inputs.executionPacing.canAdvanceActiveStep ||
      inputs.directiveSynthesis.band === 'pending');

  const band: Agent17ExecutionClosureSnapshot['band'] = sealedSignals
    ? 'sealed'
    : narrowSignals
      ? 'narrow'
      : 'open';

  const automationClearance =
    band === 'open' &&
    inputs.missionDirective.executionAllowed &&
    !directiveSynthesisBlocksAdvance(inputs.directiveSynthesis);

  return {
    closureScore,
    band,
    checkpoints,
    stepsReadyToClose,
    automationClearance,
    headline: `Closure ${band} (${closureScore}/100) · ${checkpoints.filter(c => c.satisfied).length}/${checkpoints.length} checks`,
  };
}

export function executionClosureBlocksAdvance(
  snapshot: Agent17ExecutionClosureSnapshot
): boolean {
  return snapshot.band === 'sealed' || !snapshot.automationClearance;
}
