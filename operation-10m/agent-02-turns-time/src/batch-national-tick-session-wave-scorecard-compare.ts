import type { BatchNationalTickSessionWaveScorecardExport } from './batch-national-tick-session-wave-scorecard-export.js';

export interface BatchNationalTickSessionWaveScorecardCompareResult {
  ok: boolean;
  scorecardDigestMatch: boolean;
  waveDigestMatch: boolean;
  sessionCountDelta: number;
  okFlagMatch: boolean;
}

/**
 * Round 19: compare two session wave scorecards (twin-run / regression checks).
 */
export function compareBatchNationalTickSessionWaveScorecards(
  baseline: BatchNationalTickSessionWaveScorecardExport,
  candidate: BatchNationalTickSessionWaveScorecardExport,
): BatchNationalTickSessionWaveScorecardCompareResult {
  const sessionCountDelta = candidate.sessionCount - baseline.sessionCount;
  const scorecardDigestMatch = baseline.scorecardDigest === candidate.scorecardDigest;
  const waveDigestMatch = baseline.waveDigest === candidate.waveDigest;
  const okFlagMatch = baseline.ok === candidate.ok;
  return {
    ok:
      scorecardDigestMatch &&
      waveDigestMatch &&
      okFlagMatch &&
      sessionCountDelta === 0 &&
      baseline.sessionCount === candidate.sessionCount,
    scorecardDigestMatch,
    waveDigestMatch,
    sessionCountDelta,
    okFlagMatch,
  };
}
