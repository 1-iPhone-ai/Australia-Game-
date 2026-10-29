import { TurnTimeEngine } from './engine.js';
import { type TurnAdvanceBudgetState } from './advance-budget.js';
import { fnv1a64Hex } from './turn-audit.js';
import type { NationalTickSessionWaveTickSpec } from './batch-national-tick-session-wave.js';
import {
  auditBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGate,
  type BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditResult,
} from './batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-gate-audit.js';
import {
  exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAudit,
  type BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditExport,
} from './batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-gate-audit-export.js';
import { verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditReplayParity } from './batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-gate-audit-replay-parity.js';

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateResult {
  ok: boolean;
  auditOk: boolean;
  parityOk: boolean;
  audit: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditResult;
  export: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditExport;
  latchDigest: string;
}

/**
 * Round 38 wave 38: audit-gate audit gate audit gate audit gate — export ok and replay parity from pre-audit snapshot.
 */
export function gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGate(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateResult {
  const snapshot = engine.snapshot();
  const audit = auditBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGate(
    engine,
    budget,
    tickBatches,
  );
  const exp = exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAudit(audit);
  const parity =
    verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditReplayParity(
      TurnTimeEngine.fromSnapshot(snapshot),
      budget,
      tickBatches,
    );
  const auditOk = exp.ok;
  const parityOk = parity.parityOk;
  const latchDigest = fnv1a64Hex(
    JSON.stringify({
      audit: exp.auditDigest,
      auditOk,
      parityOk,
    }),
  );
  return {
    ok: auditOk && parityOk,
    auditOk,
    parityOk,
    audit,
    export: exp,
    latchDigest,
  };
}
