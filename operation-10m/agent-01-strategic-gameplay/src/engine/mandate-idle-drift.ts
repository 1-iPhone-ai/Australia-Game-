import type { MandateProgress, PriorityMandateTrack } from '../types/coalition-mandate.ts';
import type { StrategicGameplayState } from '../types/strategic-action.ts';

const IDLE_GRACE_DAYS = 3;
const DRIFT_POINTS_PER_DAY = 2;

export function classifyMandateDriftRisk(
  state: StrategicGameplayState,
): 'low' | 'elevated' | 'critical' {
  const last = state.lastAlignedActionDay ?? state.day;
  const idleDays = Math.max(0, state.day - last);
  if (idleDays <= IDLE_GRACE_DAYS) return 'low';
  if (idleDays <= IDLE_GRACE_DAYS + 4) return 'elevated';
  return 'critical';
}

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

export function applyMandateIdleDrift(
  state: StrategicGameplayState,
  toDay: number,
): StrategicGameplayState {
  const last = state.lastAlignedActionDay ?? state.day;
  const idleDays = Math.max(0, toDay - last - IDLE_GRACE_DAYS);
  if (idleDays <= 0) return { ...state, day: toDay };

  const driftTotal = idleDays * DRIFT_POINTS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = decayTrack(track, driftTotal);
  }

  return { ...state, day: toDay, mandateProgress: progress };
}

export function touchLastAlignedActionDay(
  state: StrategicGameplayState,
  day: number,
): StrategicGameplayState {
  return { ...state, lastAlignedActionDay: day };
}
