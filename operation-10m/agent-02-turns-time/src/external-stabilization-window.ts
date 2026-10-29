import {
  normalizeExternalStabilizationSignals,
  type ExternalStabilizationTurnSignals,
} from './external-stabilization-signals.js';
import {
  gateStabilizationLatticeSequence,
  type StabilizationLatticeSequenceGateResult,
} from './stabilization-lattice-sequence-gate.js';

export interface ExternalStabilizationWindowTurnRow {
  turnIndex: number;
  signals: ExternalStabilizationTurnSignals;
}

export interface ExternalStabilizationWindowMergeResult {
  fromTurn: number;
  toTurn: number;
  rows: ExternalStabilizationWindowTurnRow[];
  missingTurns: number[];
  lattice: StabilizationLatticeSequenceGateResult;
  ok: boolean;
}

export function listTurnsInStabilizationWindow(fromTurn: number, toTurn: number): number[] {
  const from = Math.max(1, Math.floor(fromTurn));
  const to = Math.max(from, Math.floor(toTurn));
  const turns: number[] = [];
  for (let t = from; t <= to; t += 1) turns.push(t);
  return turns;
}

/**
 * Validates Agent 05 stabilization export across a turn window (pre-batch plan check).
 */
export function mergeExternalStabilizationWindow(
  fromTurn: number,
  toTurn: number,
  stabilizationByTurn: Readonly<Record<number, ExternalStabilizationTurnSignals>>,
): ExternalStabilizationWindowMergeResult {
  const windowTurns = listTurnsInStabilizationWindow(fromTurn, toTurn);
  const rows: ExternalStabilizationWindowTurnRow[] = [];
  const missingTurns: number[] = [];
  const slice: Record<number, ExternalStabilizationTurnSignals> = {};

  for (const turn of windowTurns) {
    if (stabilizationByTurn[turn] === undefined) {
      missingTurns.push(turn);
      continue;
    }
    const signals = normalizeExternalStabilizationSignals(stabilizationByTurn[turn]);
    rows.push({ turnIndex: turn, signals });
    slice[turn] = signals;
  }

  const lattice = gateStabilizationLatticeSequence(slice);
  return {
    fromTurn: windowTurns[0] ?? fromTurn,
    toTurn: windowTurns[windowTurns.length - 1] ?? toTurn,
    rows,
    missingTurns,
    lattice,
    ok: missingTurns.length === 0 && lattice.ok,
  };
}
