import type {
  Acc17CommandCenterOpsState,
  Agent17ExecutionPacingSnapshot,
  Agent17GameStateSlice,
  Agent17PlanHealthBand,
  Agent17VerificationPolicySnapshot,
} from '../types/command-center-types.ts';

const DEFAULT_TURN_BUDGET = 12;
const DELEGATE_COOLDOWN_TURNS = 2;

export function buildAgent17ExecutionPacing(
  ops: Acc17CommandCenterOpsState,
  state: Agent17GameStateSlice,
  planHealth: Agent17PlanHealthBand,
  verificationPolicy: Agent17VerificationPolicySnapshot
): Agent17ExecutionPacingSnapshot {
  const turn = state.turnCounter || state.day || 1;
  const plan = ops.activePlan;
  const createdTurn = plan?.createdTurn ?? turn;
  const stepsRemaining =
    plan?.steps.filter(s => s.status !== 'verified_complete' && s.status !== 'skipped').length ?? 0;
  const elapsedOnPlan = Math.max(0, turn - createdTurn);
  const turnBudgetRemaining = Math.max(0, DEFAULT_TURN_BUDGET - elapsedOnPlan);

  const activeStep = plan?.steps[plan.activeStepIndex];
  const verificationGateOpen = verificationPolicy.allowVerification;
  const healthAllowsAdvance =
    planHealth.band !== 'critical' || (planHealth.blockedCount === 0 && planHealth.verifiedRatio > 0.2);
  const canAdvanceActiveStep =
    !!activeStep &&
    (activeStep.status === 'in_progress' || activeStep.status === 'pending') &&
    verificationGateOpen &&
    healthAllowsAdvance;

  const lastDelegateTurn = ops.delegatedProjects.reduce(
    (max, p) => Math.max(max, p.assignedTurn),
    0
  );
  const cooldownTurns = Math.max(0, DELEGATE_COOLDOWN_TURNS - (turn - lastDelegateTurn));

  let pacingBand: Agent17ExecutionPacingSnapshot['pacingBand'] = 'steady';
  if (turnBudgetRemaining <= 2 || planHealth.band === 'critical') {
    pacingBand = 'urgent';
  } else if (!verificationGateOpen || cooldownTurns > 0) {
    pacingBand = 'throttled';
  }

  const headline =
    pacingBand === 'urgent'
      ? `Urgent pacing: ${stepsRemaining} step(s), ${turnBudgetRemaining} turn budget left`
      : pacingBand === 'throttled'
        ? `Throttled: verification or delegate cooldown (${cooldownTurns} turn(s))`
        : `Steady execution: advance ${canAdvanceActiveStep ? 'allowed' : 'held'}`;

  return {
    turn,
    turnBudgetRemaining,
    stepsRemaining,
    canAdvanceActiveStep,
    verificationGateOpen,
    cooldownTurns,
    pacingBand,
    headline,
  };
}

export function executionPacingRequiresThrottle(pacing: Agent17ExecutionPacingSnapshot): boolean {
  return pacing.pacingBand === 'throttled' || !pacing.verificationGateOpen;
}
