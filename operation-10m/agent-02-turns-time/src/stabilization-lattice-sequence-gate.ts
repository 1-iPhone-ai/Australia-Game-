import {
  normalizeExternalStabilizationSignals,
  type ExternalStabilizationTurnSignals,
} from './external-stabilization-signals.js';

export interface StabilizationLatticeSequenceViolation {
  turnIndex: number;
  code: 'wave_without_calm' | 'double_wave_without_backlog';
}

export interface StabilizationLatticeSequenceGateResult {
  orderedTurns: number[];
  violations: StabilizationLatticeSequenceViolation[];
  ok: boolean;
}

function orderedTurnKeys(
  stabilizationByTurn: Readonly<Record<number, ExternalStabilizationTurnSignals>>,
): number[] {
  return Object.keys(stabilizationByTurn)
    .map((k) => Number(k))
    .filter((n) => Number.isFinite(n))
    .sort((a, b) => a - b);
}

/**
 * Agent 05 tranche9 lattice: stabilization waves must co-occur with post-queue calm on the same turn.
 */
export function gateStabilizationLatticeSequence(
  stabilizationByTurn: Readonly<Record<number, ExternalStabilizationTurnSignals>>,
): StabilizationLatticeSequenceGateResult {
  const orderedTurns = orderedTurnKeys(stabilizationByTurn);
  const violations: StabilizationLatticeSequenceViolation[] = [];

  for (const turn of orderedTurns) {
    const signals = normalizeExternalStabilizationSignals(stabilizationByTurn[turn]);
    if (signals.pendingStabilizationWave && !signals.postQueueCalm) {
      violations.push({ turnIndex: turn, code: 'wave_without_calm' });
    }
  }

  for (let i = 1; i < orderedTurns.length; i += 1) {
    const prev = normalizeExternalStabilizationSignals(stabilizationByTurn[orderedTurns[i - 1]!]!);
    const curr = normalizeExternalStabilizationSignals(stabilizationByTurn[orderedTurns[i]!]!);
    if (prev.pendingStabilizationWave && curr.pendingStabilizationWave) {
      violations.push({ turnIndex: orderedTurns[i]!, code: 'double_wave_without_backlog' });
    }
  }

  return { orderedTurns, violations, ok: violations.length === 0 };
}
