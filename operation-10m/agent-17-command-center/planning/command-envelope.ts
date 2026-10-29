import type {
  Acc17CommandCenterOpsState,
  Agent17CommandEnvelopeSnapshot,
  Agent17ExecutionPacingSnapshot,
  Agent17StabilizationIndexSnapshot,
} from '../types/command-center-types.ts';
import { stabilizationIndexBlocksAutomation } from './stabilization-index.ts';

export interface Agent17CommandEnvelopeInputs {
  ops: Acc17CommandCenterOpsState;
  executionPacing: Agent17ExecutionPacingSnapshot;
  stabilizationIndex: Agent17StabilizationIndexSnapshot;
}

export function buildAgent17CommandEnvelope(
  inputs: Agent17CommandEnvelopeInputs
): Agent17CommandEnvelopeSnapshot {
  const signals: Agent17CommandEnvelopeSnapshot['signals'] = [];

  const activeDelegations = inputs.ops.delegatedProjects.filter(p => p.status === 'active').length;
  const delegationCap = 6;
  const delegationLoad = Math.round((activeDelegations / delegationCap) * 100);
  signals.push({
    id: 'delegation_load',
    label: 'Active delegation load',
    value: delegationLoad,
    unit: 'percent',
  });

  const stepsRemaining = inputs.executionPacing.stepsRemaining;
  signals.push({
    id: 'plan_steps',
    label: 'Plan steps remaining',
    value: stepsRemaining,
    unit: 'steps',
  });

  signals.push({
    id: 'turn_budget',
    label: 'Turn budget remaining',
    value: inputs.executionPacing.turnBudgetRemaining,
    unit: 'turns',
  });

  const cooldown = inputs.executionPacing.cooldownTurns;
  signals.push({
    id: 'delegate_cooldown',
    label: 'Delegate cooldown',
    value: cooldown,
    unit: 'turns',
  });

  signals.push({
    id: 'stabilization',
    label: 'Stabilization index',
    value: inputs.stabilizationIndex.stabilizationIndex,
    unit: 'index',
  });

  const horizonTurns = Math.max(
    1,
    Math.min(
      12,
      Math.ceil(stepsRemaining / 2) +
        cooldown +
        (inputs.stabilizationIndex.band === 'volatile' ? 3 : 0)
    )
  );

  const saturated =
    delegationLoad >= 85 ||
    inputs.executionPacing.pacingBand === 'throttled' ||
    stabilizationIndexBlocksAutomation(inputs.stabilizationIndex);

  const constrained =
    !saturated &&
    (delegationLoad >= 55 ||
      inputs.executionPacing.pacingBand === 'steady' ||
      inputs.stabilizationIndex.band === 'adjusting');

  const capacityBand: Agent17CommandEnvelopeSnapshot['capacityBand'] = saturated
    ? 'saturated'
    : constrained
      ? 'constrained'
      : 'nominal';

  const automationAllowed =
    capacityBand === 'nominal' &&
    inputs.executionPacing.canAdvanceActiveStep &&
    !stabilizationIndexBlocksAutomation(inputs.stabilizationIndex);

  return {
    capacityBand,
    horizonTurns,
    activeDelegationCount: activeDelegations,
    delegationCap,
    automationAllowed,
    signals,
    headline: `Envelope ${capacityBand} · horizon ${horizonTurns}t · ${activeDelegations}/${delegationCap} delegations`,
  };
}

export function commandEnvelopeNeedsThrottle(snapshot: Agent17CommandEnvelopeSnapshot): boolean {
  return snapshot.capacityBand === 'saturated' || !snapshot.automationAllowed;
}
