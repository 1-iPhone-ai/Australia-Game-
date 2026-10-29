import { TurnTimeEngine } from './engine.js';
import { type TurnAdvanceBudgetState } from './advance-budget.js';
import { type BatchAdvanceOrchestratedInput } from './batch-advance-orchestrated-step.js';
import {
  createBatchNationalTickLedger,
  type BatchNationalTickLedger,
} from './batch-national-tick-ledger.js';
import { computeBatchNationalTickLedgerDigest } from './batch-national-tick-ledger-digest.js';
import { exportBatchNationalTickSessionLedger } from './batch-national-tick-session-ledger-export.js';
import {
  computeBatchNationalTickUnifiedSessionDigest,
  runNationalTickOrchestratedUnifiedSession,
  type BatchNationalTickUnifiedSessionResult,
} from './batch-national-tick-unified-session.js';
import { fnv1a64Hex } from './turn-audit.js';

export interface NationalTickSessionWaveTickSpec {
  maxSteps: number;
  input?: BatchAdvanceOrchestratedInput;
}

export interface BatchNationalTickSessionWaveResult {
  sessions: BatchNationalTickUnifiedSessionResult[];
  ledger: BatchNationalTickLedger;
  ledgerExport: ReturnType<typeof exportBatchNationalTickSessionLedger>;
  waveDigest: string;
}

export function computeBatchNationalTickSessionWaveDigest(
  sessions: readonly BatchNationalTickUnifiedSessionResult[],
  ledgerDigest: string,
): string {
  return fnv1a64Hex(
    JSON.stringify({
      ledger: ledgerDigest,
      sessions: sessions.map((s) => computeBatchNationalTickUnifiedSessionDigest(s)),
    }),
  );
}

/**
 * Round 16: chain unified national tick sessions on one engine with a shared append-only ledger.
 */
export function runNationalTickOrchestratedSessionWave(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  ticks: readonly NationalTickSessionWaveTickSpec[],
  ledger: BatchNationalTickLedger = createBatchNationalTickLedger(),
): BatchNationalTickSessionWaveResult {
  const sessions: BatchNationalTickUnifiedSessionResult[] = [];
  let currentLedger = ledger;

  for (const spec of ticks) {
    const session = runNationalTickOrchestratedUnifiedSession(
      engine,
      spec.maxSteps,
      budget,
      spec.input,
      currentLedger,
    );
    sessions.push(session);
    currentLedger = session.ledger;
  }

  const ledgerExport = exportBatchNationalTickSessionLedger(currentLedger);
  const waveDigest = computeBatchNationalTickSessionWaveDigest(
    sessions,
    ledgerExport.ledgerDigest,
  );

  return {
    sessions,
    ledger: currentLedger,
    ledgerExport,
    waveDigest,
  };
}
