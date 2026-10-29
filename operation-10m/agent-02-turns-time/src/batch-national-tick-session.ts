import { TurnTimeEngine } from './engine.js';
import { type TurnAdvanceBudgetState } from './advance-budget.js';
import {
  stepNationalTickOrchestratedBatch,
  type BatchNationalTickOrchestratedResult,
} from './batch-advance-national-tick-orchestrator.js';
import { type BatchAdvanceOrchestratedInput } from './batch-advance-orchestrated-step.js';
import {
  appendBatchNationalTickLedgerEntry,
  createBatchNationalTickLedger,
  type BatchNationalTickLedger,
  type BatchNationalTickLedgerEntry,
} from './batch-national-tick-ledger.js';
import { computeBatchNationalTickLedgerDigest } from './batch-national-tick-ledger-digest.js';
import { exportBatchNationalTickScorecard } from './batch-national-tick-scorecard-export.js';
import { fnv1a64Hex } from './turn-audit.js';

export interface BatchNationalTickSessionResult {
  tick: BatchNationalTickOrchestratedResult;
  parityOk: boolean;
  ledger: BatchNationalTickLedger;
  sessionDigest: string;
  export: ReturnType<typeof exportBatchNationalTickScorecard>;
}

export function computeBatchNationalTickSessionDigest(
  tick: BatchNationalTickOrchestratedResult,
  parityOk: boolean,
  ledgerDigest: string,
): string {
  return fnv1a64Hex(
    JSON.stringify({
      ok: tick.scorecard.ok && parityOk,
      tick: tick.nationalTickDigest,
      parityOk,
      ledger: ledgerDigest,
    }),
  );
}

/**
 * Round 15: national tick with replay parity check and append-only ledger entry.
 */
export function runNationalTickOrchestratedSession(
  engine: TurnTimeEngine,
  maxSteps: number,
  budget: TurnAdvanceBudgetState,
  input?: BatchAdvanceOrchestratedInput,
  ledger: BatchNationalTickLedger = createBatchNationalTickLedger(),
  tickIndex = ledger.entries.length + 1,
): BatchNationalTickSessionResult {
  const before = engine.snapshot();
  const startTurn = before.clock.turnIndex;
  const tick = stepNationalTickOrchestratedBatch(engine, maxSteps, budget, input);
  const endTurn = engine.snapshot().clock.turnIndex;

  const replayEngine = TurnTimeEngine.fromSnapshot(before);
  const replayTick = stepNationalTickOrchestratedBatch(replayEngine, maxSteps, budget, input);
  const parityOk =
    tick.nationalTickDigest === replayTick.nationalTickDigest &&
    tick.scorecard.ok === replayTick.scorecard.ok;

  const entry: BatchNationalTickLedgerEntry = {
    tickIndex,
    startTurn,
    endTurn,
    nationalTickDigest: tick.nationalTickDigest,
    ok: tick.scorecard.ok && parityOk,
  };
  const nextLedger = appendBatchNationalTickLedgerEntry(ledger, entry);
  const ledgerDigest = computeBatchNationalTickLedgerDigest(nextLedger);
  const sessionDigest = computeBatchNationalTickSessionDigest(tick, parityOk, ledgerDigest);

  return {
    tick,
    parityOk,
    ledger: nextLedger,
    sessionDigest,
    export: exportBatchNationalTickScorecard(tick),
  };
}
