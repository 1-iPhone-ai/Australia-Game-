import { PriorityArbitrationRecord } from './types.ts';

export interface ArbitrationPressureReport {
  pressureIndex: number;
  demotedActorIds: string[];
  notes: string[];
}

/**
 * Measure mutex arbitration demotion pressure from coordination arbitration log.
 */
export function computeArbitrationPressureIndex(
  arbitrationLog: PriorityArbitrationRecord[],
): ArbitrationPressureReport {
  const notes: string[] = [];
  const demotedActorIds: string[] = [];

  arbitrationLog.forEach(entry => {
    entry.demoted.forEach(d => {
      demotedActorIds.push(d.actorId);
      notes.push(`Demoted ${d.actorId} on ${entry.regionId || 'global'}: ${d.reason}`);
    });
  });

  const demotionCount = demotedActorIds.length;
  const entryCount = arbitrationLog.length;
  const pressureIndex = Math.round(
    Math.min(100, demotionCount * 14 + entryCount * 8 + (demotionCount >= 4 ? 15 : 0)),
  );

  return {
    pressureIndex,
    demotedActorIds: [...new Set(demotedActorIds)].slice(0, 8),
    notes: notes.slice(0, 6),
  };
}

export function combineDualTeamArbitrationPressure(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
