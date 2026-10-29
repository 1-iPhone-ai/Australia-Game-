import type { MandateProgress, PriorityMandateTrack } from '../types/coalition-mandate.ts';
import type { StrategicGameplayState } from '../types/strategic-action.ts';

export const PROLONGED_COALITION_CRISIS_THRESHOLD = 4;
const CRISIS_MANDATE_DRIFT_PER_DAY = 1;

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

export function isProlongedCoalitionCrisis(state: StrategicGameplayState): boolean {
  return (state.coalitionCrisisStreakDays ?? 0) >= PROLONGED_COALITION_CRISIS_THRESHOLD;
}

/** Extra mandate decay while acute coalition crisis persists beyond the prolonged threshold. */
export function applyProlongedCrisisMandatePressure(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isProlongedCoalitionCrisis(state)) return state;

  const driftTotal = daysAdvanced * CRISIS_MANDATE_DRIFT_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = decayTrack(track, driftTotal);
  }

  return { ...state, mandateProgress: progress };
}
