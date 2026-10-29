import type { MandateProgress, PriorityMandateTrack } from '../types/coalition-mandate.ts';
import type { StrategicGameplayState } from '../types/strategic-action.ts';

export const ELEVATED_COALITION_VOLATILITY_THRESHOLD = 2;
const VOLATILITY_MANDATE_DRIFT_PER_DAY = 1;

function decayTrack(track: PriorityMandateTrack, pointsLost: number): PriorityMandateTrack {
  const points = Math.max(0, track.points - pointsLost);
  const milestonesUnlocked = track.milestonesUnlocked.filter((id) => {
    if (id === 'mandate_priority_leadership') return points >= 75;
    if (id === 'mandate_priority_momentum') return points >= 50;
    if (id === 'mandate_priority_engaged') return points >= 25;
    return true;
  });
  return { ...track, points, milestonesUnlocked };
}

export function isElevatedCoalitionVolatility(state: StrategicGameplayState): boolean {
  return (state.coalitionVolatilityEvents ?? 0) >= ELEVATED_COALITION_VOLATILITY_THRESHOLD;
}

/** Mandate decay while coalition oscillation history stays elevated after crisis/recovery cycles. */
export function applyElevatedVolatilityMandateDrag(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isElevatedCoalitionVolatility(state)) return state;

  const driftTotal = daysAdvanced * VOLATILITY_MANDATE_DRIFT_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = decayTrack(track, driftTotal);
  }

  return { ...state, mandateProgress: progress };
}
