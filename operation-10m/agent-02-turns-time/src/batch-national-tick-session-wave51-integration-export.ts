import type { BatchNationalTickSessionWave51IntegrationSealResult } from './batch-national-tick-session-wave51-integration-seal.js';

export interface BatchNationalTickSessionWave51IntegrationExport {
  ok: boolean;
  innerOk: boolean;
  baselineSha: string;
  projectedLoc: number;
  wave: number;
  ticket: string;
  innerSealDigest: string;
  innerCommitDigest: string;
  sealDigest: string;
}

/**
 * Round 51 wave 51: flatten the O10-232 integration seal for Agent 25 manifest hooks.
 */
export function exportBatchNationalTickSessionWave51Integration(
  seal: BatchNationalTickSessionWave51IntegrationSealResult,
): BatchNationalTickSessionWave51IntegrationExport {
  return {
    ok: seal.ok,
    innerOk: seal.innerOk,
    baselineSha: seal.baselineSha,
    projectedLoc: seal.projectedLoc,
    wave: seal.wave,
    ticket: seal.ticket,
    innerSealDigest: seal.inner.sealDigest,
    innerCommitDigest: seal.inner.commit.commitDigest,
    sealDigest: seal.sealDigest,
  };
}
