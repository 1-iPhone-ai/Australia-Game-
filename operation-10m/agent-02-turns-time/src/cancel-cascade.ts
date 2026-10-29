import { FollowUpRule } from './types.js';

export function cancelArmedFollowUpsForTrigger(rules: FollowUpRule[], triggerRefId: string): FollowUpRule[] {
  return rules.map((r) => {
    if (r.status !== 'armed') return r;
    if (r.triggerRefId !== triggerRefId) return r;
    return { ...r, status: 'cancelled' };
  });
}

export function cancelArmedFollowUpsSpawnedAs(rules: FollowUpRule[], spawnId: string): FollowUpRule[] {
  return rules.map((r) => {
    if (r.status !== 'armed') return r;
    if (r.spawnId !== spawnId) return r;
    return { ...r, status: 'cancelled' };
  });
}
