import type { BatchNationalTickSessionWave53IntegrationSealResult } from './batch-national-tick-session-wave53-integration-seal.js';

export interface BatchNationalTickSessionWave53IntegrationExport {
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
 * Round 51 wave 51: flatten the O10-232 integration seal for Agent 25 manifest hooks.
 */
export function exportBatchNationalTickSessionWave53Integration(
  seal: BatchNationalTickSessionWave53IntegrationSealResult,
): BatchNationalTickSessionWave53IntegrationExport {
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
