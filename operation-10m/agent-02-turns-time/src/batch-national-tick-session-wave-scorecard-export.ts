import { fnv1a64Hex } from './turn-audit.js';
import {
  exportBatchNationalTickSessionWave,
  type BatchNationalTickSessionWaveExport,
} from './batch-national-tick-session-wave-export.js';
import type { BatchNationalTickSessionWaveResult } from './batch-national-tick-session-wave.js';

export interface BatchNationalTickSessionWaveScorecardExport {
  ok: boolean;
  sessionCount: number;
  unifiedOkCount: number;
  ledgerOkCount: number;
  waveDigest: string;
  ledgerDigest: string;
  scorecardDigest: string;
}

export function computeBatchNationalTickSessionWaveScorecardDigest(
  scorecard: BatchNationalTickSessionWaveScorecardExport,
): string {
  return fnv1a64Hex(
    JSON.stringify({
      ok: scorecard.ok,
      sessionCount: scorecard.sessionCount,
      unifiedOkCount: scorecard.unifiedOkCount,
      ledgerOkCount: scorecard.ledgerOkCount,
      waveDigest: scorecard.waveDigest,
      ledgerDigest: scorecard.ledgerDigest,
    }),
  );
}

/**
 * Round 18: scorecard rollup over session wave export for Agent 25 assembly hooks.
 */
export function exportBatchNationalTickSessionWaveScorecard(
  wave: BatchNationalTickSessionWaveResult,
): BatchNationalTickSessionWaveScorecardExport {
  const exp: BatchNationalTickSessionWaveExport = exportBatchNationalTickSessionWave(wave);
  const unifiedOkCount = exp.rows.filter((row) => row.unifiedOk).length;
  const ledgerOkCount = exp.rows.filter((row) => row.ledgerOk).length;
  const scorecard: BatchNationalTickSessionWaveScorecardExport = {
    ok: exp.allOk && unifiedOkCount === exp.sessionCount && ledgerOkCount === exp.sessionCount,
    sessionCount: exp.sessionCount,
    unifiedOkCount,
    ledgerOkCount,
    waveDigest: exp.waveDigest,
    ledgerDigest: exp.ledgerDigest,
    scorecardDigest: '',
  };
  scorecard.scorecardDigest = computeBatchNationalTickSessionWaveScorecardDigest(scorecard);
  return scorecard;
}
