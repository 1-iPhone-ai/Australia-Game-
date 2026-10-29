import type { NationalPriorityId } from '../types/national-priority.ts';
import type {
  MandateMilestoneId,
  MandateProgress,
  PriorityMandateTrack,
} from '../types/coalition-mandate.ts';
import type {
  StrategicActionDefinition,
  StrategicGameplayState,
} from '../types/strategic-action.ts';

const MILESTONE_THRESHOLDS: { id: MandateMilestoneId; minPoints: number }[] = [
  { id: 'mandate_priority_engaged', minPoints: 25 },
  { id: 'mandate_priority_momentum', minPoints: 50 },
  { id: 'mandate_priority_leadership', minPoints: 75 },
];

export function createEmptyMandateProgress(): MandateProgress {
  return {};
}

function ensureTrack(
  progress: MandateProgress,
  priorityId: NationalPriorityId,
): PriorityMandateTrack {
  const existing = progress[priorityId];
  if (existing) return existing;
  return {
    priorityId,
    points: 0,
    milestonesUnlocked: [],
  };
}

function unlockMilestones(track: PriorityMandateTrack): PriorityMandateTrack {
  const unlocked = new Set(track.milestonesUnlocked);
  for (const step of MILESTONE_THRESHOLDS) {
    if (track.points >= step.minPoints) unlocked.add(step.id);
  }
  return { ...track, milestonesUnlocked: [...unlocked] };
}

export function advanceMandateOnAction(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): StrategicGameplayState {
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const priorityId of action.alignedPriorities) {
    let track = ensureTrack(progress, priorityId);
    track = { ...track, points: track.points + 12 };
    progress[priorityId] = unlockMilestones(track);
  }
  return { ...state, mandateProgress: progress };
}

export function mandateRankingBonus(
  state: StrategicGameplayState,
  action: StrategicActionDefinition,
): number {
  const progress = state.mandateProgress ?? {};
  let bonus = 0;
  for (const priorityId of action.alignedPriorities) {
    const track = progress[priorityId];
    if (!track) continue;
    bonus += track.milestonesUnlocked.length * 4;
  }
  return bonus;
}

export function summarizeMandateProgress(state: StrategicGameplayState): string {
  const progress = state.mandateProgress ?? {};
  const tracks = Object.values(progress).filter(Boolean) as PriorityMandateTrack[];
  if (tracks.length === 0) {
    return 'No mandate momentum yet — aligned actions build national priority tracks.';
  }
  const leader = tracks.sort((a, b) => b.points - a.points)[0];
  const milestoneCount = leader.milestonesUnlocked.length;
  return `${leader.priorityId} mandate at ${leader.points} pts (${milestoneCount}/3 milestones).`;
}
