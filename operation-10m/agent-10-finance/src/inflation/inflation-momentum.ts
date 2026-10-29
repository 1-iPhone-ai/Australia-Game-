import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';
import { inflationBandSeverityRank } from './pass-through.js';

export interface InflationMomentumSnapshot {
  turn: number;
  momentumScore: number;
  direction: 'disinflating' | 'stable' | 'accelerating' | 'runaway';
  bandDelta: number;
  streakTurns: number;
}

export interface InflationMomentumState {
  priorBand: InflationConditionsBand | null;
  streakTurns: number;
  lastMomentumScore: number;
}

export function createInitialInflationMomentumState(): InflationMomentumState {
  return { priorBand: null, streakTurns: 0, lastMomentumScore: 50 };
}

/** Deterministic band-to-band momentum — macro CPI channel only. */
export function stepInflationMomentum(
  state: InflationMomentumState,
  turn: number,
  currentBand: InflationConditionsBand,
): { state: InflationMomentumState; snapshot: InflationMomentumSnapshot } {
  const curRank = inflationBandSeverityRank(currentBand);
  const priorRank = state.priorBand ? inflationBandSeverityRank(state.priorBand) : curRank;
  const bandDelta = curRank - priorRank;

  let streakTurns = state.streakTurns;
  if (state.priorBand === currentBand) {
    streakTurns += 1;
  } else {
    streakTurns = 1;
  }

  let momentumScore = state.lastMomentumScore + bandDelta * 9;
  if (currentBand === 'scenario_runaway') {
    momentumScore += 6;
  } else if (bandDelta < 0) {
    momentumScore -= 2;
  }
  momentumScore = finClamp(momentumScore, 0, 100);

  let direction: InflationMomentumSnapshot['direction'] = 'stable';
  if (currentBand === 'scenario_runaway' || momentumScore >= 78) {
    direction = 'runaway';
  } else if (bandDelta > 0 || momentumScore >= 58) {
    direction = 'accelerating';
  } else if (bandDelta < 0 || momentumScore <= 38) {
    direction = 'disinflating';
  }

  const snapshot: InflationMomentumSnapshot = {
    turn,
    momentumScore: finRound(momentumScore, 1),
    direction,
    bandDelta,
    streakTurns,
  };

  return {
    state: {
      priorBand: currentBand,
      streakTurns,
      lastMomentumScore: momentumScore,
    },
    snapshot,
  };
}

export function inflationMomentumInflationScoreNudge(snapshot: InflationMomentumSnapshot): number {
  if (snapshot.direction === 'runaway') return 2.5;
  if (snapshot.direction === 'accelerating') return finRound(snapshot.bandDelta * 1.2 + 0.8, 2);
  if (snapshot.direction === 'disinflating') return finRound(Math.min(snapshot.bandDelta * 1.5, -0.5), 2);
  return 0;
}
