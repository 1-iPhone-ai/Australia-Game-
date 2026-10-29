import { TurnTimeSnapshot } from './types.js';
import {
  gateExternalDayPlanWindow,
  type ExternalDayPlanWindowGateResult,
} from './external-day-plan-window-gate.js';
import {
  gateExternalStabilizationWindow,
  type ExternalStabilizationWindowGateResult,
} from './external-stabilization-window-gate.js';
import type { ExternalStabilizationTurnSignals } from './external-stabilization-signals.js';

export interface BatchAdvanceUnifiedPreGateInput {
  fromTurn: number;
  toTurn: number;
  externalByTurn?: Readonly<Record<number, readonly string[]>>;
  stabilizationByTurn?: Readonly<Record<number, ExternalStabilizationTurnSignals>>;
}

export interface BatchAdvanceUnifiedPreGateResult {
  fromTurn: number;
  toTurn: number;
  dayPlan?: ExternalDayPlanWindowGateResult;
  stabilization?: ExternalStabilizationWindowGateResult;
  ok: boolean;
}

/**
 * Round 11: single pre-batch gate for XS-02 narrative window + Agent 05 stabilization window.
 */
export function gateBatchAdvanceUnifiedPreconditions(
  snapshot: TurnTimeSnapshot,
  input: BatchAdvanceUnifiedPreGateInput,
): BatchAdvanceUnifiedPreGateResult {
  const dayPlan = input.externalByTurn
    ? gateExternalDayPlanWindow(snapshot, input.fromTurn, input.toTurn, input.externalByTurn)
    : undefined;
  const stabilization = input.stabilizationByTurn
    ? gateExternalStabilizationWindow(snapshot, input.fromTurn, input.toTurn, input.stabilizationByTurn)
    : undefined;
  const dayOk = dayPlan?.ok ?? true;
  const stabOk = stabilization?.ok ?? true;
  return {
    fromTurn: input.fromTurn,
    toTurn: input.toTurn,
    dayPlan,
    stabilization,
    ok: dayOk && stabOk,
  };
}
