import { TurnTimeEngine } from './engine.js';
import { type TurnAdvanceBudgetState } from './advance-budget.js';
import { fnv1a64Hex } from './turn-audit.js';
import type { NationalTickSessionWaveTickSpec } from './batch-national-tick-session-wave.js';
import {
  sealBatchNationalTickSessionWave50Integration,
  type BatchNationalTickSessionWave50IntegrationSealResult,
} from './batch-national-tick-session-wave50-integration-seal.js';

/** O10-232 integration baseline (wave 50 24/24 projection). */
export const WAVE51_INTEGRATION_BASELINE_SHA = 'a32b2b15';
export const WAVE51_PROJECTED_LOC = 2_887_600;
export const WAVE51_ROUND = 51;
export const WAVE51_TICKET = 'O10-233';

export interface BatchNationalTickSessionWave51IntegrationSealResult {
  ok: boolean;
  innerOk: boolean;
  baselineSha: typeof WAVE51_INTEGRATION_BASELINE_SHA;
  projectedLoc: typeof WAVE51_PROJECTED_LOC;
  wave: typeof WAVE51_ROUND;
  ticket: typeof WAVE51_TICKET;
  inner: BatchNationalTickSessionWave50IntegrationSealResult;
  sealDigest: string;
}

/**
 * Round 51 wave 51: seal the wave-50 O10-230 integration latch against the
 * O10-232 integration baseline so Agent 25 assembly can reject a chunk built
 * on the wrong projection SHA / LOC.
 */
export function sealBatchNationalTickSessionWave51Integration(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWave51IntegrationSealResult {
  const inner = sealBatchNationalTickSessionWave50Integration(engine, budget, tickBatches);
  const innerOk = inner.ok;
  const sealDigest = fnv1a64Hex(
    JSON.stringify({
      ticket: WAVE51_TICKET,
      wave: WAVE51_ROUND,
      baselineSha: WAVE51_INTEGRATION_BASELINE_SHA,
      projectedLoc: WAVE51_PROJECTED_LOC,
      innerSealDigest: inner.sealDigest,
      innerCommitDigest: inner.commit.commitDigest,
      innerOk,
    }),
  );
  return {
    ok: innerOk,
    innerOk,
    baselineSha: WAVE51_INTEGRATION_BASELINE_SHA,
    projectedLoc: WAVE51_PROJECTED_LOC,
    wave: WAVE51_ROUND,
    ticket: WAVE51_TICKET,
    inner,
    sealDigest,
  };
}
