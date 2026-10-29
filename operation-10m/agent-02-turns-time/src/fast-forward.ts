import {
  FastForwardOptions,
  TurnClock,
  TurnPhase,
  TURN_PHASE_ORDER,
  TurnTimeSnapshot,
} from './types.js';
import { TurnTimeEngine, StepTurnResult } from './engine.js';
import { stableFiredIdList, traceObligationFirings } from './diagnostics.js';

export interface FastForwardResult {
  snapshot: TurnTimeSnapshot;
  steps: StepTurnResult[];
  parityOk: boolean;
  parityDetail?: string;
}

/**
 * Advances deterministically to `targetTurn` by repeated single-turn steps.
 * Optionally verifies parity against a reference stepped engine (same initial state).
 */
export function fastForwardTo(
  engine: TurnTimeEngine,
  options: FastForwardOptions,
): FastForwardResult {
  const targetTurn = Math.floor(options.targetTurn);
  if (!Number.isFinite(targetTurn) || targetTurn < 1) {
    throw new Error('fastForwardTo: invalid targetTurn');
  }

  const steps: StepTurnResult[] = [];
  let current = engine.snapshot();

  while (current.clock.turnIndex < targetTurn) {
    const step = engine.stepFullTurn({ scope: options.scope });
    steps.push(step);
    current = engine.snapshot();
  }

  if (options.targetDay !== undefined) {
    const targetDay = Math.floor(options.targetDay);
    while (current.clock.dayIndex < targetDay) {
      const step = engine.stepFullTurn({ scope: options.scope, advanceDayOnEnd: true });
      steps.push(step);
      current = engine.snapshot();
    }
  }

  const report = engine.validate();
  return {
    snapshot: current,
    steps,
    parityOk: report.ok,
    parityDetail: report.ok ? undefined : report.messages.join('; '),
  };
}

export interface FastForwardParityReport {
  ok: boolean;
  steppedFired: string[];
  fastFired: string[];
  steppedTrace: string[];
  fastTrace: string[];
}

/**
 * Proves fast-forward matches naive stepping from the same seed state.
 */
export function proveFastForwardParity(
  seed: TurnTimeSnapshot,
  targetTurn: number,
): FastForwardParityReport {
  const stepped = TurnTimeEngine.fromSnapshot(seed);
  while (stepped.snapshot().clock.turnIndex < targetTurn) {
    stepped.stepFullTurn();
  }

  const fast = TurnTimeEngine.fromSnapshot(seed);
  fastForwardTo(fast, { targetTurn });

  const steppedFired = stableFiredIdList(stepped.snapshot().obligations);
  const fastFired = stableFiredIdList(fast.snapshot().obligations);
  const steppedTrace = traceObligationFirings(stepped.snapshot().trace);
  const fastTrace = traceObligationFirings(fast.snapshot().trace);

  const ok =
    steppedFired.length === fastFired.length &&
    steppedFired.every((id, i) => id === fastFired[i]) &&
    steppedTrace.length === fastTrace.length &&
    steppedTrace.every((id, i) => id === fastTrace[i]);

  return { ok, steppedFired, fastFired, steppedTrace, fastTrace };
}

export function phasesThrough(phase: TurnPhase): TurnPhase[] {
  const idx = TURN_PHASE_ORDER.indexOf(phase);
  return TURN_PHASE_ORDER.slice(0, idx + 1) as TurnPhase[];
}

export function turnsBetweenInclusive(fromTurn: number, toTurn: number): number[] {
  const out: number[] = [];
  for (let t = fromTurn; t <= toTurn; t += 1) out.push(t);
  return out;
}
