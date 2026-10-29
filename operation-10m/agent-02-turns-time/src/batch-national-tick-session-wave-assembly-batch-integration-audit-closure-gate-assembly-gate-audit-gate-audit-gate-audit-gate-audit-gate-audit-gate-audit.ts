import { TurnTimeEngine } from './engine.js';
import { type TurnAdvanceBudgetState } from './advance-budget.js';
import { fnv1a64Hex } from './turn-audit.js';
import type { NationalTickSessionWaveTickSpec } from './batch-national-tick-session-wave.js';
import {
  gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGate,
  type BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateResult,
} from './batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate.js';
import {
  exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGate,
  type BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateExport,
} from './batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-export.js';
import { compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateExports } from './batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-export-compare.js';
import { verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateReplayParity } from './batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-replay-parity.js';

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditResult {
  ok: boolean;
  auditGate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateResult;
  auditGateExport: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateExport;
  exportCompareOk: boolean;
  parityOk: boolean;
  auditDigest: string;
}

/**
 * Round 41 wave 41: audit audit-gate audit gate audit gate audit gate audit gate export twin-compare and replay parity in one pass.
 */
export function auditBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAudit(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditResult {
  const snapshot = engine.snapshot();
  const auditGate = gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGate(
    engine,
    budget,
    tickBatches,
  );
  const auditGateExport =
    exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGate(auditGate);
  const twinExport =
    exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGate(
      gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGate(
        TurnTimeEngine.fromSnapshot(snapshot),
        budget,
        tickBatches,
      ),
    );
  const exportCompare =
    compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateExports(
      auditGateExport,
      twinExport,
    );
  const parity =
    verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateReplayParity(
      TurnTimeEngine.fromSnapshot(snapshot),
      budget,
      tickBatches,
    );
  const exportCompareOk = exportCompare.ok;
  const parityOk = parity.parityOk;
  const ok = auditGateExport.ok && exportCompareOk && parityOk;
  const auditDigest = fnv1a64Hex(
    JSON.stringify({
      latch: auditGateExport.latchDigest,
      exportCompareOk,
      parityOk,
      ok,
    }),
  );
  return { ok, auditGate, auditGateExport, exportCompareOk, parityOk, auditDigest };
}
