import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';
import { inflationBandSeverityRank } from '../inflation/pass-through.js';

export type InflationRegimeLabel =
  | 'disinflationary'
  | 'anchored_soft'
  | 'reflation'
  | 'overheat'
  | 'stagflation_risk';

export interface InflationRegimeSnapshot {
  turn: number;
  regime: InflationRegimeLabel;
  persistenceScore: number;
  bandStreak: number;
  priorBand: InflationConditionsBand | null;
}

export interface InflationRegimeTrackerState {
  lastBand: InflationConditionsBand | null;
  bandStreak: number;
  persistenceScore: number;
  history: InflationRegimeSnapshot[];
}

export function createInitialInflationRegimeTracker(): InflationRegimeTrackerState {
  return {
    lastBand: null,
    bandStreak: 0,
    persistenceScore: 50,
    history: [],
  };
}

function labelFromBands(
  band: InflationConditionsBand,
  creditStressed: boolean,
  fiscalCritical: boolean,
): InflationRegimeLabel {
  const rank = inflationBandSeverityRank(band);
  if (rank <= inflationBandSeverityRank('disinflation')) return 'disinflationary';
  if (creditStressed && fiscalCritical && rank >= inflationBandSeverityRank('elevated')) {
    return 'stagflation_risk';
  }
  if (rank >= inflationBandSeverityRank('high')) return 'overheat';
  if (rank >= inflationBandSeverityRank('elevated')) return 'reflation';
  return 'anchored_soft';
}

/** Deterministic regime memory for multi-turn dashboards (max 24 snapshots). */
export function stepInflationRegimeTracker(
  state: InflationRegimeTrackerState,
  turn: number,
  band: InflationConditionsBand,
  opts?: { creditStressed?: boolean; fiscalCritical?: boolean },
): InflationRegimeTrackerState {
  const creditStressed = opts?.creditStressed ?? false;
  const fiscalCritical = opts?.fiscalCritical ?? false;

  const bandStreak = state.lastBand === band ? state.bandStreak + 1 : 1;
  const rankDelta =
    state.lastBand != null ? inflationBandSeverityRank(band) - inflationBandSeverityRank(state.lastBand) : 0;

  let persistenceScore = state.persistenceScore;
  if (bandStreak >= 3) persistenceScore += 4;
  if (Math.abs(rankDelta) >= 2) persistenceScore -= 6;
  persistenceScore = finClamp(persistenceScore, 5, 95);

  const regime = labelFromBands(band, creditStressed, fiscalCritical);
  const snapshot: InflationRegimeSnapshot = {
    turn,
    regime,
    persistenceScore: finRound(persistenceScore, 1),
    bandStreak,
    priorBand: state.lastBand,
  };

  return {
    lastBand: band,
    bandStreak,
    persistenceScore: finRound(persistenceScore, 1),
    history: [...state.history, snapshot].slice(-24),
  };
}

export function inflationRegimePersistenceHalfLifeTurns(persistenceScore: number): number {
  const s = finClamp(persistenceScore, 0, 100);
  return finRound(2 + (s / 100) * 10, 1);
}
