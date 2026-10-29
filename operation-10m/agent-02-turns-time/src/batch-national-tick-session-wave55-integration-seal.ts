import { TurnTimeEngine } from './engine.js';
import { type TurnAdvanceBudgetState } from './advance-budget.js';
import { fnv1a64Hex } from './turn-audit.js';
import type { NationalTickSessionWaveTickSpec } from './batch-national-tick-session-wave.js';
import {
  commitBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAudit,
  type BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditResult,
} from './batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit.js';

/** O10-232 integration baseline (wave 50 24/24 projection). */
export const WAVE55_INTEGRATION_BASELINE_SHA = 'c4bbec67';
export const WAVE55_PROJECTED_LOC = 3_054_213;
export const WAVE55_ROUND = 51;
export const WAVE55_TICKET = 'O10-247';

export interface BatchNationalTickSessionWave55IntegrationSealResult {
  ok: boolean;
  commitOk: boolean;
  baselineSha: typeof WAVE55_INTEGRATION_BASELINE_SHA;
  projectedLoc: typeof WAVE55_PROJECTED_LOC;
  wave: typeof WAVE55_ROUND;
  ticket: typeof WAVE55_TICKET;
  commit: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditResult;
  sealDigest: string;
}

/**
 * Round 51 wave 51: seal the round-47 national-tick audit-gate commit against
 * the O10-232 integration baseline so Agent 25 assembly can reject a chunk
 * built on the wrong projection SHA / LOC.
 */
export function sealBatchNationalTickSessionWave55Integration(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWave55IntegrationSealResult {
  const commit =
    commitBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAudit(
      engine,
      budget,
      tickBatches,
    );
  const commitOk = commit.ok;
  const sealDigest = fnv1a64Hex(
    JSON.stringify({
      ticket: WAVE55_TICKET,
      wave: WAVE55_ROUND,
      baselineSha: WAVE55_INTEGRATION_BASELINE_SHA,
      projectedLoc: WAVE55_PROJECTED_LOC,
      commitDigest: commit.commitDigest,
      latchDigest: commit.export.latchDigest,
      commitOk,
    }),
  );
  return {
    ok: commitOk,
    commitOk,
    baselineSha: WAVE55_INTEGRATION_BASELINE_SHA,
    projectedLoc: WAVE55_PROJECTED_LOC,
    wave: WAVE55_ROUND,
    ticket: WAVE55_TICKET,
    commit,
    sealDigest,
  };
}
