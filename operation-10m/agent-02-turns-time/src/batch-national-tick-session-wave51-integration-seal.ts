import { TurnTimeEngine } from './engine.js';
import { type TurnAdvanceBudgetState } from './advance-budget.js';
import { fnv1a64Hex } from './turn-audit.js';
import type { NationalTickSessionWaveTickSpec } from './batch-national-tick-session-wave.js';
import {
  commitBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAudit,
  type BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditResult,
} from './batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit.js';

/** O10-232 integration baseline (wave 50 24/24 projection). */
export const WAVE51_INTEGRATION_BASELINE_SHA = 'a32b2b15';
export const WAVE51_PROJECTED_LOC = 2_887_600;
export const WAVE51_ROUND = 51;
export const WAVE51_TICKET = 'O10-233';

export interface BatchNationalTickSessionWave51IntegrationSealResult {
  ok: boolean;
  commitOk: boolean;
  baselineSha: typeof WAVE51_INTEGRATION_BASELINE_SHA;
  projectedLoc: typeof WAVE51_PROJECTED_LOC;
  wave: typeof WAVE51_ROUND;
  ticket: typeof WAVE51_TICKET;
  commit: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditResult;
  sealDigest: string;
}

/**
 * Round 51 wave 51: seal the round-47 national-tick audit-gate commit against
 * the O10-232 integration baseline so Agent 25 assembly can reject a chunk
 * built on the wrong projection SHA / LOC.
 */
export function sealBatchNationalTickSessionWave51Integration(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWave51IntegrationSealResult {
  const commit =
    commitBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAudit(
      engine,
      budget,
      tickBatches,
    );
  const commitOk = commit.ok;
  const sealDigest = fnv1a64Hex(
    JSON.stringify({
      ticket: WAVE51_TICKET,
      wave: WAVE51_ROUND,
      baselineSha: WAVE51_INTEGRATION_BASELINE_SHA,
      projectedLoc: WAVE51_PROJECTED_LOC,
      commitDigest: commit.commitDigest,
      latchDigest: commit.export.latchDigest,
      commitOk,
    }),
  );
  return {
    ok: commitOk,
    commitOk,
    baselineSha: WAVE51_INTEGRATION_BASELINE_SHA,
    projectedLoc: WAVE51_PROJECTED_LOC,
    wave: WAVE51_ROUND,
    ticket: WAVE51_TICKET,
    commit,
    sealDigest,
  };
}
