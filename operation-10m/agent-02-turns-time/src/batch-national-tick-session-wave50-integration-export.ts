import type { BatchNationalTickSessionWave50IntegrationSealResult } from './batch-national-tick-session-wave50-integration-seal.js';

export interface BatchNationalTickSessionWave50IntegrationExport {
  ok: boolean;
  commitOk: boolean;
  baselineSha: string;
  projectedLoc: number;
  wave: number;
  ticket: string;
  commitDigest: string;
  latchDigest: string;
  sealDigest: string;
}

/**
 * Round 50 wave 50: flatten the O10-230 integration seal for Agent 25 manifest hooks.
 */
export function exportBatchNationalTickSessionWave50Integration(
  seal: BatchNationalTickSessionWave50IntegrationSealResult,
): BatchNationalTickSessionWave50IntegrationExport {
  return {
    ok: seal.ok,
    commitOk: seal.commitOk,
    baselineSha: seal.baselineSha,
    projectedLoc: seal.projectedLoc,
    wave: seal.wave,
    ticket: seal.ticket,
    commitDigest: seal.commit.commitDigest,
    latchDigest: seal.commit.export.latchDigest,
    sealDigest: seal.sealDigest,
  };
}
