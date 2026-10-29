import type { EvolvingUiAccessPolicy } from '../types/access-policy.js';
import type { ProgressionSignalSnapshot } from '../types/progression.js';
import { computeProgressionCoverage } from './progression-coach.js';

export interface ProgressionCoverageSnapshot {
  visible: number;
  preview: number;
  hidden: number;
  total: number;
  coverageRatio: number;
  coachCopy: string | null;
  tierLabel: 'early' | 'mid' | 'late';
}

export function buildProgressionCoverageSnapshot(
  signals: ProgressionSignalSnapshot,
  policy: EvolvingUiAccessPolicy
): ProgressionCoverageSnapshot {
  const stats = computeProgressionCoverage(signals, policy);
  const tierLabel: ProgressionCoverageSnapshot['tierLabel'] =
    signals.gameDay < 5 ? 'early' : signals.gameDay < 12 ? 'mid' : 'late';

  let coachCopy: string | null = null;
  if (stats.coverageRatio >= 0.75) {
    coachCopy = 'Most interface panels are unlocked — expert shortcuts are available.';
  } else if (stats.coverageRatio >= 0.45) {
    coachCopy = 'Mid-game coverage — focus on upcoming milestone unlocks.';
  } else if (stats.visible >= 3) {
    coachCopy = 'Early coverage — onboarding highlights guide the next unlocks.';
  }

  return {
    ...stats,
    coachCopy,
    tierLabel,
  };
}

export function mergeCoverageRatioIntoPersisted<
  T extends { lastProgressionCoverageRatio?: number },
>(persisted: T, ratio: number): T {
  return {
    ...persisted,
    lastProgressionCoverageRatio: Math.max(0, Math.min(1, ratio)),
  };
}

export function coverageDeltaCopy(previous: number | undefined, current: number): string | null {
  if (previous == null) return null;
  const delta = current - previous;
  if (Math.abs(delta) < 0.01) return null;
  const pct = Math.round(Math.abs(delta) * 100);
  return delta > 0 ? `Interface coverage increased ${pct}% since last turn.` : `Interface coverage dipped ${pct}%.`;
}
