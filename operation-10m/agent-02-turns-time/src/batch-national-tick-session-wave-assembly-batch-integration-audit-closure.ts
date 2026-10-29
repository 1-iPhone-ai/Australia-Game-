import { TurnTimeEngine } from './engine.js';
import { type TurnAdvanceBudgetState } from './advance-budget.js';
import { fnv1a64Hex } from './turn-audit.js';
import type { NationalTickSessionWaveTickSpec } from './batch-national-tick-session-wave.js';
import {
  gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAudit,
  type BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditGateResult,
} from './batch-national-tick-session-wave-assembly-batch-integration-audit-gate.js';
import {
  exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditGate,
  type BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditGateExport,
} from './batch-national-tick-session-wave-assembly-batch-integration-audit-gate-export.js';

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureResult {
  ok: boolean;
  gate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditGateResult;
  gateExport: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditGateExport;
  closureDigest: string;
}

export function computeBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureDigest(
  gateExport: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditGateExport,
): string {
  return fnv1a64Hex(
    JSON.stringify({
      gate: gateExport.gateDigest,
      integration: gateExport.integrationDigest,
      ok: gateExport.ok,
    }),
  );
}

/**
 * Round 25: assembly closure — gated integration audit plus closure digest for wave-25 hooks.
 */
export function closeBatchNationalTickSessionWaveAssemblyBatchIntegrationAudit(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureResult {
  const gate = gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAudit(
    engine,
    budget,
    tickBatches,
  );
  const gateExport = exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditGate(gate);
  const closureDigest =
    computeBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureDigest(gateExport);
  return {
    ok: gateExport.ok,
    gate,
    gateExport,
    closureDigest,
  };
}
