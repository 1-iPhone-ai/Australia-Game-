import { TurnTimeEngine } from './engine.js';
import { type TurnAdvanceBudgetState } from './advance-budget.js';
import { fnv1a64Hex } from './turn-audit.js';
import type { NationalTickSessionWaveTickSpec } from './batch-national-tick-session-wave.js';
import {
  auditBatchNationalTickSessionWaveAssemblyBatchIntegration,
  type BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditResult,
} from './batch-national-tick-session-wave-assembly-batch-integration-audit.js';
import {
  exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAudit,
  type BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditExport,
} from './batch-national-tick-session-wave-assembly-batch-integration-audit-export.js';
import {
  verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditReplayParity,
  type BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditReplayParityResult,
} from './batch-national-tick-session-wave-assembly-batch-integration-audit-replay-parity.js';

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditGateResult {
  ok: boolean;
  auditOk: boolean;
  parityOk: boolean;
  audit: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditResult;
  export: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditExport;
  parity: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditReplayParityResult;
  gateDigest: string;
}

export function computeBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditGateDigest(
  gateExport: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditExport,
  auditOk: boolean,
  parityOk: boolean,
): string {
  return fnv1a64Hex(
    JSON.stringify({
      integration: gateExport.integrationDigest,
      auditOk,
      parityOk,
    }),
  );
}

/**
 * Round 24: integration audit gate — export ok and replay parity from pre-audit snapshot.
 */
export function gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAudit(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditGateResult {
  const snapshot = engine.snapshot();
  const audit = auditBatchNationalTickSessionWaveAssemblyBatchIntegration(
    engine,
    budget,
    tickBatches,
  );
  const exp = exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAudit(audit);
  const parity = verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditReplayParity(
    TurnTimeEngine.fromSnapshot(snapshot),
    budget,
    tickBatches,
  );
  const auditOk = exp.ok;
  const parityOk = parity.parityOk;
  const gateDigest = computeBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditGateDigest(
    exp,
    auditOk,
    parityOk,
  );
  return {
    ok: auditOk && parityOk,
    auditOk,
    parityOk,
    audit,
    export: exp,
    parity,
    gateDigest,
  };
}
