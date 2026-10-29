import { TurnTimeEngine } from './engine.js';
import { type TurnAdvanceBudgetState } from './advance-budget.js';
import { type BatchAdvanceOrchestratedInput } from './batch-advance-orchestrated-step.js';
import {
  gateBatchExternalStabilizationUnified,
  type BatchExternalStabilizationUnifiedBatchGateResult,
} from './batch-external-stabilization-unified-batch-gate.js';
import {
  appendBatchNationalTickLedgerEntry,
  createBatchNationalTickLedger,
  type BatchNationalTickLedger,
  type BatchNationalTickLedgerEntry,
} from './batch-national-tick-ledger.js';
import { computeBatchNationalTickLedgerDigest } from './batch-national-tick-ledger-digest.js';
import { exportBatchNationalTickScorecard } from './batch-national-tick-scorecard-export.js';
import {
  computeBatchNationalTickSessionDigest,
  type BatchNationalTickSessionResult,
} from './batch-national-tick-session.js';
import { stepNationalTickOrchestratedBatch } from './batch-advance-national-tick-orchestrator.js';
import { batchStabilizationGateOptionsFromCapture } from './batch-stabilization-queue-capture.js';
import { fnv1a64Hex } from './turn-audit.js';

export interface BatchNationalTickUnifiedSessionResult extends BatchNationalTickSessionResult {
  unifiedGate?: BatchExternalStabilizationUnifiedBatchGateResult;
}

export function computeBatchNationalTickUnifiedSessionDigest(
  session: BatchNationalTickUnifiedSessionResult,
): string {
  return fnv1a64Hex(
    JSON.stringify({
      session: session.sessionDigest,
      unifiedOk: session.unifiedGate?.ok ?? null,
    }),
  );
}

/**
 * Round 16: national tick session with XS-02 + Agent 05 unified batch gate on the stepped batch.
 */
export function runNationalTickOrchestratedUnifiedSession(
  engine: TurnTimeEngine,
  maxSteps: number,
  budget: TurnAdvanceBudgetState,
  input?: BatchAdvanceOrchestratedInput,
  ledger: BatchNationalTickLedger = createBatchNationalTickLedger(),
  tickIndex = ledger.entries.length + 1,
): BatchNationalTickUnifiedSessionResult {
  const before = engine.snapshot();
  const startTurn = before.clock.turnIndex;
  const tick = stepNationalTickOrchestratedBatch(engine, maxSteps, budget, input);
  const endTurn = engine.snapshot().clock.turnIndex;

  const unifiedGate =
    input?.externalByTurn !== undefined || input?.stabilizationByTurn !== undefined
      ? gateBatchExternalStabilizationUnified(
          tick.report.batch,
          input?.externalByTurn ?? {},
          input?.stabilizationByTurn ?? {},
          batchStabilizationGateOptionsFromCapture(tick.report.capture),
        )
      : undefined;
  const unifiedOk = unifiedGate?.ok ?? true;

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
    ok: tick.scorecard.ok && parityOk && unifiedOk,
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
    unifiedGate,
  };
}
