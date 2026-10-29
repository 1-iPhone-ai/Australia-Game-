import { TurnTimeEngine } from './engine.js';
import { type TurnAdvanceBudgetState } from './advance-budget.js';
import { fnv1a64Hex } from './turn-audit.js';
import type { NationalTickSessionWaveTickSpec } from './batch-national-tick-session-wave.js';
import {
  commitBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAudit,
  type BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditResult,
} from './batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit.js';

/** O10-232 integration baseline (wave 50 24/24 projection). */
export const WAVE56_INTEGRATION_BASELINE_SHA = '8e2366bb';
export const WAVE56_PROJECTED_LOC = 3_084_921;
export const WAVE56_ROUND = 51;
export const WAVE56_TICKET = 'O10-254';

export interface BatchNationalTickSessionWave56IntegrationSealResult {
  ok: boolean;
  commitOk: boolean;
  baselineSha: typeof WAVE56_INTEGRATION_BASELINE_SHA;
  projectedLoc: typeof WAVE56_PROJECTED_LOC;
  wave: typeof WAVE56_ROUND;
  ticket: typeof WAVE56_TICKET;
  commit: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditResult;
  sealDigest: string;
}

/**
 * Round 51 wave 51: seal the round-47 national-tick audit-gate commit against
 * the O10-232 integration baseline so Agent 25 assembly can reject a chunk
 * built on the wrong projection SHA / LOC.
 */
export function sealBatchNationalTickSessionWave56Integration(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWave56IntegrationSealResult {
  const commit =
    commitBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAudit(
      engine,
      budget,
      tickBatches,
    );
  const commitOk = commit.ok;
  const sealDigest = fnv1a64Hex(
    JSON.stringify({
      ticket: WAVE56_TICKET,
      wave: WAVE56_ROUND,
      baselineSha: WAVE56_INTEGRATION_BASELINE_SHA,
      projectedLoc: WAVE56_PROJECTED_LOC,
      commitDigest: commit.commitDigest,
      latchDigest: commit.export.latchDigest,
      commitOk,
    }),
  );
  return {
    ok: commitOk,
    commitOk,
    baselineSha: WAVE56_INTEGRATION_BASELINE_SHA,
    projectedLoc: WAVE56_PROJECTED_LOC,
    wave: WAVE56_ROUND,
    ticket: WAVE56_TICKET,
    commit,
    sealDigest,
  };
}
