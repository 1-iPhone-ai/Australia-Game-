import { TurnTimeEngine } from './engine.js';
import { type TurnAdvanceBudgetState } from './advance-budget.js';
import { fnv1a64Hex } from './turn-audit.js';
import type { NationalTickSessionWaveTickSpec } from './batch-national-tick-session-wave.js';
import {
  commitBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAudit,
  type BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditResult,
} from './batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit.js';

/** O10-232 integration baseline (wave 50 24/24 projection). */
export const WAVE53_INTEGRATION_BASELINE_SHA = '51039c5e';
export const WAVE53_PROJECTED_LOC = 2_979_928;
export const WAVE53_ROUND = 51;
export const WAVE53_TICKET = 'O10-237';

export interface BatchNationalTickSessionWave53IntegrationSealResult {
  ok: boolean;
  commitOk: boolean;
  baselineSha: typeof WAVE53_INTEGRATION_BASELINE_SHA;
  projectedLoc: typeof WAVE53_PROJECTED_LOC;
  wave: typeof WAVE53_ROUND;
  ticket: typeof WAVE53_TICKET;
  commit: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditResult;
  sealDigest: string;
}

/**
 * Round 51 wave 51: seal the round-47 national-tick audit-gate commit against
 * the O10-232 integration baseline so Agent 25 assembly can reject a chunk
 * built on the wrong projection SHA / LOC.
 */
export function sealBatchNationalTickSessionWave53Integration(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWave53IntegrationSealResult {
  const commit =
    commitBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAudit(
      engine,
      budget,
      tickBatches,
    );
  const commitOk = commit.ok;
  const sealDigest = fnv1a64Hex(
    JSON.stringify({
      ticket: WAVE53_TICKET,
      wave: WAVE53_ROUND,
      baselineSha: WAVE53_INTEGRATION_BASELINE_SHA,
      projectedLoc: WAVE53_PROJECTED_LOC,
      commitDigest: commit.commitDigest,
      latchDigest: commit.export.latchDigest,
      commitOk,
    }),
  );
  return {
    ok: commitOk,
    commitOk,
    baselineSha: WAVE53_INTEGRATION_BASELINE_SHA,
    projectedLoc: WAVE53_PROJECTED_LOC,
    wave: WAVE53_ROUND,
    ticket: WAVE53_TICKET,
    commit,
    sealDigest,
  };
}
