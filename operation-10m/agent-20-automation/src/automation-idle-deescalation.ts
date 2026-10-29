import {
  evaluateIdleAutomationEscalation,
  type O10IdleEscalationResult,
  type O10IdleEscalationTier,
} from './automation-idle-escalation.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleDeescalationState {
  latchedTier: O10IdleEscalationTier;
  turnsAtTier: number;
}

export function createDefaultIdleDeescalationState(): O10IdleDeescalationState {
  return { latchedTier: 0, turnsAtTier: 0 };
}

/**
 * Reconcile latched escalation tier with fresh idle telemetry.
 * Human commit snaps to tier 0; easing pressure drops at most one tier per turn (hysteresis).
 */
export function stepIdleDeescalation(
  state: O10IdleDeescalationState,
  measured: O10IdleEscalationResult,
  humanCommittedThisTurn: boolean
): O10IdleDeescalationState {
  if (humanCommittedThisTurn) {
    return { latchedTier: 0, turnsAtTier: 0 };
  }

  const { latchedTier } = state;
  let next: O10IdleEscalationTier = latchedTier;

  if (measured.tier > latchedTier) {
    next = measured.tier;
  } else if (measured.tier < latchedTier) {
    next = Math.max(measured.tier, latchedTier - 1) as O10IdleEscalationTier;
  }

  const turnsAtTier = next === latchedTier ? state.turnsAtTier + 1 : 1;
  return { latchedTier: next, turnsAtTier };
}

/** Measure escalation from telemetry then apply hysteresis de-escalation latch. */
export function evaluateIdleEscalationWithDeescalation(
  escalationInput: Parameters<typeof evaluateIdleAutomationEscalation>[0],
  state: O10IdleDeescalationState,
  humanCommittedThisTurn: boolean
): { state: O10IdleDeescalationState; measured: O10IdleEscalationResult; effectiveTier: O10IdleEscalationTier } {
  const measured = evaluateIdleAutomationEscalation(escalationInput);
  const nextState = stepIdleDeescalation(state, measured, humanCommittedThisTurn);
  return { state: nextState, measured, effectiveTier: nextState.latchedTier };
}

export function formatIdleDeescalationSummary(state: O10IdleDeescalationState): string {
  return `idle_latch t${state.latchedTier} for ${state.turnsAtTier} turn(s)`;
}

export function runO10Agent20IdleDeescalationSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const humanReset = stepIdleDeescalation(
    { latchedTier: 3, turnsAtTier: 4 },
    evaluateIdleAutomationEscalation({ idleMs: 900_000, consecutiveIdleTurns: 12 }),
    true
  );
  push('deesc_human', 'human commit resets latch to tier 0', humanReset.latchedTier === 0);

  const measuredLow = evaluateIdleAutomationEscalation({ idleMs: 1000, consecutiveIdleTurns: 0 });
  const oneStep = stepIdleDeescalation(
    { latchedTier: 3, turnsAtTier: 2 },
    measuredLow,
    false
  );
  push('deesc_hysteresis', 'easing drops at most one tier per turn', oneStep.latchedTier === 2);

  const measuredHigh = evaluateIdleAutomationEscalation({
    idleMs: 900_000,
    consecutiveIdleTurns: 10,
    queuedIntentCount: 6,
  });
  const ramp = stepIdleDeescalation({ latchedTier: 1, turnsAtTier: 1 }, measuredHigh, false);
  push('deesc_ramp_up', 'pressure can ramp latch upward immediately', ramp.latchedTier === 3);

  const combo = evaluateIdleEscalationWithDeescalation(
    { idleMs: 500, consecutiveIdleTurns: 0 },
    { latchedTier: 2, turnsAtTier: 3 },
    false
  );
  push(
    'deesc_combo',
    'combo returns effective latched tier',
    combo.effectiveTier === 1 && combo.state.turnsAtTier === 1
  );

  return results;
}
