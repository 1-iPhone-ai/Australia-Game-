import type { BatchNationalTickSessionWave56IntegrationSealResult } from './batch-national-tick-session-wave56-integration-seal.js';

export interface BatchNationalTickSessionWave56IntegrationExport {
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
export function exportBatchNationalTickSessionWave56Integration(
  seal: BatchNationalTickSessionWave56IntegrationSealResult,
): BatchNationalTickSessionWave56IntegrationExport {
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
