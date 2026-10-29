import { AGENT18_LIMITS } from './types.ts';

export interface MutexStabilityReport {
  stabilityIndex: number;
  volatileRegionIds: string[];
  stableRegionCount: number;
  trackedTurns: number;
  notes: string[];
}

/**
 * Complement thrashing detection: score how stable region mutex holders have been.
 */
export function computeMutexStabilityIndex(
  mutexHistory: Array<Record<string, string>>,
  thrashingRegions: string[] = [],
): MutexStabilityReport {
  const history = mutexHistory.slice(-AGENT18_LIMITS.maxMutexHistorySnapshots);
  if (history.length < 2) {
    return {
      stabilityIndex: 100,
      volatileRegionIds: [],
      stableRegionCount: 0,
      trackedTurns: history.length,
      notes: history.length === 0 ? ['No mutex history yet'] : [],
    };
  }

  const regions = new Set<string>();
  history.forEach(snap => Object.keys(snap).forEach(r => regions.add(r)));

  const volatileRegionIds: string[] = [];
  const notes: string[] = [];
  let stableRegionCount = 0;

  regions.forEach(regionId => {
    if (thrashingRegions.includes(regionId)) {
      volatileRegionIds.push(regionId);
      return;
    }
    const holders = history.map(s => s[regionId]).filter(Boolean);
    if (holders.length < 2) {
      stableRegionCount += 1;
      return;
    }
    const flips = holders.slice(1).filter((h, i) => h !== holders[i]).length;
    const flipRate = flips / (holders.length - 1);
    if (flipRate >= 0.5) {
      volatileRegionIds.push(regionId);
      notes.push(`Region ${regionId} volatile (flip rate ${Math.round(flipRate * 100)}%)`);
    } else {
      stableRegionCount += 1;
    }
  });

  const volatilePenalty = volatileRegionIds.length * 18;
  const stabilityIndex = Math.max(0, Math.min(100, 100 - volatilePenalty));

  return {
    stabilityIndex,
    volatileRegionIds: volatileRegionIds.slice(0, 8),
    stableRegionCount,
    trackedTurns: history.length,
    notes: notes.slice(0, 6),
  };
}

export function combineDualTeamMutexStability(
  friendly: MutexStabilityReport,
  enemy: MutexStabilityReport | null,
): number {
  if (!enemy) return friendly.stabilityIndex;
  return Math.round((friendly.stabilityIndex + enemy.stabilityIndex) / 2);
}
