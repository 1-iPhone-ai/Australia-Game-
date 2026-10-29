import { TurnTimeEngine } from './engine.js';
import { type TurnAdvanceBudgetState } from './advance-budget.js';
import { fnv1a64Hex } from './turn-audit.js';
import type { NationalTickSessionWaveTickSpec } from './batch-national-tick-session-wave.js';
import {
  gateBatchNationalTickSessionWaveAssemblyBatch,
  type BatchNationalTickSessionWaveAssemblyBatchGateResult,
} from './batch-national-tick-session-wave-assembly-batch-gate.js';
import {
  exportBatchNationalTickSessionWaveAssemblyBatchGate,
  type BatchNationalTickSessionWaveAssemblyBatchGateExport,
} from './batch-national-tick-session-wave-assembly-batch-gate-export.js';

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditResult {
  ok: boolean;
  gate: BatchNationalTickSessionWaveAssemblyBatchGateResult;
  gateExport: BatchNationalTickSessionWaveAssemblyBatchGateExport;
  integrationDigest: string;
}

export function computeBatchNationalTickSessionWaveAssemblyBatchIntegrationDigest(
  gateExport: BatchNationalTickSessionWaveAssemblyBatchGateExport,
): string {
  return fnv1a64Hex(
    JSON.stringify({
      gate: gateExport.gateDigest,
      batch: gateExport.batchDigest,
      ok: gateExport.ok,
    }),
  );
}

/**
 * Round 22: post-integration audit — gated batch run plus export digest for assembly manifest.
 */
export function auditBatchNationalTickSessionWaveAssemblyBatchIntegration(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditResult {
  const gate = gateBatchNationalTickSessionWaveAssemblyBatch(engine, budget, tickBatches);
  const gateExport = exportBatchNationalTickSessionWaveAssemblyBatchGate(gate);
  const integrationDigest =
    computeBatchNationalTickSessionWaveAssemblyBatchIntegrationDigest(gateExport);
  return {
    ok: gateExport.ok,
    gate,
    gateExport,
    integrationDigest,
  };
}
