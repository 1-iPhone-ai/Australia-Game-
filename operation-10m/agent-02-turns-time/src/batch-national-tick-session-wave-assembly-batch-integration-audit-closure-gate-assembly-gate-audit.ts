import { TurnTimeEngine } from './engine.js';
import { type TurnAdvanceBudgetState } from './advance-budget.js';
import { fnv1a64Hex } from './turn-audit.js';
import type { NationalTickSessionWaveTickSpec } from './batch-national-tick-session-wave.js';
import {
  gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssembly,
  type BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateResult,
} from './batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate.js';
import {
  exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGate,
  type BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateExport,
} from './batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-export.js';
import { compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateExports } from './batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-export-compare.js';
import { verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateReplayParity } from './batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-replay-parity.js';

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditResult {
  ok: boolean;
  gate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateResult;
  gateExport: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateExport;
  exportCompareOk: boolean;
  parityOk: boolean;
  auditDigest: string;
}

/**
 * Round 30 wave 30: audit assembly gate export twin-compare and replay parity in one pass.
 */
export function auditBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGate(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditResult {
  const snapshot = engine.snapshot();
  const gate = gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssembly(
    engine,
    budget,
    tickBatches,
  );
  const gateExport = exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGate(gate);
  const twinExport = exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGate(
    gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssembly(
      TurnTimeEngine.fromSnapshot(snapshot),
      budget,
      tickBatches,
    ),
  );
  const exportCompare = compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateExports(
    gateExport,
    twinExport,
  );
  const parity = verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateReplayParity(
    TurnTimeEngine.fromSnapshot(snapshot),
    budget,
    tickBatches,
  );
  const exportCompareOk = exportCompare.ok;
  const parityOk = parity.parityOk;
  const ok = gateExport.ok && exportCompareOk && parityOk;
  const auditDigest = fnv1a64Hex(
    JSON.stringify({
      latch: gateExport.latchDigest,
      exportCompareOk,
      parityOk,
      ok,
    }),
  );
  return { ok, gate, gateExport, exportCompareOk, parityOk, auditDigest };
}
